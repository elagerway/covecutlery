# Training Certificates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let an admin issue a "Certificate of Achievement" PDF to a training student, delivered by email and available in the student dashboard, with a public verify URL keyed by a short code.

**Architecture:** New `certificates` Postgres table + private `certificates` Supabase Storage bucket. Admin clicks "Issue Certificate" in the existing training roster → server route renders a PDF by overlaying recipient name, date, and short-code text onto the existing reference PDF using `pdf-lib`, uploads to Storage, optionally emails via Postmark. Public `/certificates/<short_code>` page confirms validity.

**Tech Stack:** Next.js 16 (App Router) · Supabase (Postgres + Storage + Auth) · `pdf-lib` (new) · Postmark (existing) · TypeScript

**Reference spec:** `docs/superpowers/specs/2026-05-14-training-certificates-design.md`

**Codebase note:** This project has no test framework. Each task ends with a manual verification step (curl, browser, or SQL). Don't introduce vitest/jest — that's scope creep.

**File map:**

| File | Status | Responsibility |
|---|---|---|
| `supabase/migrations/20260514000000_create_certificates.sql` | Create | Table + RLS + Storage bucket |
| `package.json` | Modify | Add `pdf-lib` dependency |
| `public/certificate-template.pdf` | Create (copy of reference) | Background PDF |
| `src/lib/certificates/code.ts` | Create | Short-code generator |
| `src/lib/certificates/render.ts` | Create | `pdf-lib` overlay renderer |
| `src/app/api/admin/training/certificates/route.ts` | Create | POST issue, GET list |
| `src/app/api/admin/training/certificates/[id]/email/route.ts` | Create | POST re-send email |
| `src/app/api/admin/training/certificates/[id]/revoke/route.ts` | Create | POST revoke |
| `src/app/api/certificates/[id]/download/route.ts` | Create | Auth'd signed-URL redirect |
| `src/app/certificates/[shortCode]/page.tsx` | Create | Public verify page |
| `src/components/admin/StudentCertificates.tsx` | Create | Admin "Certificates" panel |
| `src/components/admin/TrainingRoster.tsx` | Modify | Mount panel + add Cert chip |
| `src/app/admin/(protected)/training/page.tsx` | Modify | Pass cert data to roster |
| `src/app/dashboard/certificates/page.tsx` | Create | Student certificates list |
| `src/app/dashboard/sidebar.tsx` | Modify | Add "Certificates" nav item |
| `src/app/dashboard/courses/page.tsx` | Modify | "View Certificate" link on course card |

---

## Task 1: Database migration — certificates table + storage bucket

**Files:**
- Create: `supabase/migrations/20260514000000_create_certificates.sql`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260514000000_create_certificates.sql`:

```sql
-- Training certificates issued to students by admins.

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  short_code text not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  recipient_name text not null,
  course_title text not null,
  issued_date date not null,
  issued_by uuid references auth.users(id),
  pdf_path text not null,
  revoked_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz default now() not null
);

create index idx_certificates_user on public.certificates(user_id);
create index idx_certificates_course on public.certificates(course_id);
create index idx_certificates_short_code on public.certificates(short_code);

alter table public.certificates enable row level security;

create policy "Users view own certificates"
  on public.certificates
  for select
  using (auth.uid() = user_id);

-- All inserts/updates/deletes go through service-role admin routes.
-- No user-level write policies.

-- Private storage bucket for the rendered PDFs.
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;
```

- [ ] **Step 2: Apply the migration via Supabase MCP**

Use `mcp__supabase__apply_migration` with name `create_certificates` and the SQL body above. Confirm success.

- [ ] **Step 3: Verify**

Run `mcp__supabase__list_tables` and confirm `certificates` appears with the expected columns. Then run:

```sql
select id, name, public from storage.buckets where id = 'certificates';
```

via `mcp__supabase__execute_sql` — expect one row, `public = false`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260514000000_create_certificates.sql
git commit -m "feat(certificates): add certificates table + storage bucket"
```

---

## Task 2: Add `pdf-lib` dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

```bash
npm install pdf-lib@^1.17.1
```

- [ ] **Step 2: Verify**

```bash
node -e "console.log(require('pdf-lib').PDFDocument ? 'ok' : 'missing')"
```

Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(certificates): add pdf-lib dependency"
```

---

## Task 3: Copy template PDF into the repo

**Files:**
- Create: `public/certificate-template.pdf` (copy of the reference)

- [ ] **Step 1: Copy**

```bash
cp "/Users/admin/Documents/KNIVES/train-to-be-sharp/TTBS - Certificate of Achievement.pdf" public/certificate-template.pdf
```

- [ ] **Step 2: Verify**

```bash
ls -la public/certificate-template.pdf
```

Expected: file exists, ~5MB.

- [ ] **Step 3: Confirm template page size (informational, used in Task 5)**

```bash
node -e "
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
(async () => {
  const bytes = fs.readFileSync('public/certificate-template.pdf');
  const doc = await PDFDocument.load(bytes);
  const page = doc.getPage(0);
  console.log('width:', page.getWidth(), 'height:', page.getHeight());
})();
"
```

Note the printed width/height — they're the coordinate space for Task 5.

- [ ] **Step 4: Commit**

```bash
git add public/certificate-template.pdf
git commit -m "feat(certificates): bundle reference template PDF"
```

---

## Task 4: Short-code generator

**Files:**
- Create: `src/lib/certificates/code.ts`

- [ ] **Step 1: Write the code**

Create `src/lib/certificates/code.ts`:

```ts
import crypto from "crypto";

// Crockford-ish base32 — excludes I, L, O, U, 0, 1 to avoid visual confusion.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

function randomChar(): string {
  // crypto.randomInt is unbiased.
  return ALPHABET[crypto.randomInt(0, ALPHABET.length)];
}

/**
 * Returns a short, human-readable verification code:
 *   "CB-XXXX-XXXX"
 * 8 random chars from a 30-char alphabet → 30^8 ≈ 6.5e11 combinations.
 * Caller is responsible for retrying on the (vanishingly rare) unique-index collision.
 */
export function generateShortCode(): string {
  let block1 = "";
  let block2 = "";
  for (let i = 0; i < 4; i++) block1 += randomChar();
  for (let i = 0; i < 4; i++) block2 += randomChar();
  return `CB-${block1}-${block2}`;
}
```

- [ ] **Step 2: Verify shape with a one-liner**

```bash
npx tsx -e "
import { generateShortCode } from './src/lib/certificates/code';
const codes = Array.from({ length: 5 }, generateShortCode);
console.log(codes);
const uniq = new Set(codes);
if (uniq.size !== 5) throw new Error('duplicates in 5 samples — alphabet too small');
for (const c of codes) {
  if (!/^CB-[2-9A-HJKMNP-TV-Z]{4}-[2-9A-HJKMNP-TV-Z]{4}\$/.test(c)) throw new Error('bad shape: ' + c);
}
console.log('ok');
"
```

If `tsx` is not installed, `npx tsx` will fetch it. Expected: array of 5 codes printed and `ok`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/certificates/code.ts
git commit -m "feat(certificates): short-code generator"
```

---

## Task 5: PDF overlay renderer

**Files:**
- Create: `src/lib/certificates/render.ts`

- [ ] **Step 1: Write the renderer**

Create `src/lib/certificates/render.ts`:

```ts
import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

let cachedTemplate: Uint8Array | null = null;

function loadTemplate(): Uint8Array {
  if (cachedTemplate) return cachedTemplate;
  const p = path.join(process.cwd(), "public", "certificate-template.pdf");
  cachedTemplate = fs.readFileSync(p);
  return cachedTemplate;
}

function formatIssuedDate(d: Date): string {
  return d.toLocaleDateString("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Vancouver",
  });
}

export interface RenderInput {
  recipientName: string;
  issuedDate: Date;
  shortCode: string;
  /** Origin used to build the verify URL line, e.g. "https://coveblades.com" */
  origin: string;
}

/**
 * Loads the bundled certificate template, draws the recipient name on the upper
 * underline, the formatted date on the lower underline (after "Level 1 Training on"),
 * and a small verify-URL footer at the bottom. Returns the rendered PDF bytes.
 *
 * Coordinates are tuned for the bundled template's page size (printed in Task 3,
 * Step 3). If the template is replaced, re-tune.
 */
export async function renderCertificate(input: RenderInput): Promise<Uint8Array> {
  const doc = await PDFDocument.load(loadTemplate());
  const page = doc.getPage(0);
  const { width, height } = page.getSize();

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);

  // --- Recipient name: centered on the upper underline.
  // Underline sits roughly at y ≈ 0.46 * height in the reference template.
  const nameSize = 28;
  const nameWidth = helvBold.widthOfTextAtSize(input.recipientName, nameSize);
  page.drawText(input.recipientName, {
    x: (width - nameWidth) / 2,
    y: height * 0.46,
    size: nameSize,
    font: helvBold,
    color: rgb(0.05, 0.05, 0.05),
  });

  // --- Date: drawn after "Level 1 Training on " on the second line.
  // The static text "Level 1 Training on _____" is part of the template image.
  // We center the entire formatted date on the underline blank, which is roughly
  // centered around x ≈ 0.62 * width, y ≈ 0.36 * height.
  const dateStr = formatIssuedDate(input.issuedDate);
  const dateSize = 13;
  const dateWidth = helv.widthOfTextAtSize(dateStr, dateSize);
  page.drawText(dateStr, {
    x: width * 0.62 - dateWidth / 2,
    y: height * 0.36,
    size: dateSize,
    font: helv,
    color: rgb(0.1, 0.1, 0.1),
  });

  // --- Footer verify URL: small, bottom-center.
  const verifyUrl = `${input.origin.replace(/\/$/, "")}/certificates/${input.shortCode}`;
  const footer = `Verify: ${verifyUrl}`;
  const footerSize = 8;
  const footerWidth = helv.widthOfTextAtSize(footer, footerSize);
  page.drawText(footer, {
    x: (width - footerWidth) / 2,
    y: 18,
    size: footerSize,
    font: helv,
    color: rgb(0.4, 0.4, 0.4),
  });

  return doc.save();
}
```

- [ ] **Step 2: Smoke-render to /tmp**

```bash
npx tsx -e "
import { renderCertificate } from './src/lib/certificates/render';
import fs from 'fs';
(async () => {
  const bytes = await renderCertificate({
    recipientName: 'Jane Sample',
    issuedDate: new Date('2026-05-14T12:00:00-07:00'),
    shortCode: 'CB-X7K2-9F4M',
    origin: 'https://coveblades.com',
  });
  fs.writeFileSync('/tmp/cert-smoke.pdf', bytes);
  console.log('wrote /tmp/cert-smoke.pdf', bytes.length, 'bytes');
})();
"
```

Expected: prints the byte count.

- [ ] **Step 3: Visually inspect the output**

```bash
open /tmp/cert-smoke.pdf
```

Confirm: recipient name appears on the upper underline; the date appears on the "Level 1 Training on" underline; the footer verify URL is centered at the bottom.

**If positions are off:** tune the multipliers in `render.ts` (the three `height * 0.XX` values and the `width * 0.62`) and re-run Steps 2-3 until the layout matches the reference. Common adjustments: name `y` between `0.42` and `0.50`; date `y` between `0.32` and `0.40`; date `x` center between `0.55` and `0.68`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/certificates/render.ts
git commit -m "feat(certificates): pdf-lib overlay renderer"
```

---

## Task 6: Issue + list API route

**Files:**
- Create: `src/app/api/admin/training/certificates/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/admin/training/certificates/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { generateShortCode } from "@/lib/certificates/code";
import { renderCertificate } from "@/lib/certificates/render";
import { escapeHtml } from "@/lib/format";

const FROM_EMAIL = "info@coveblades.com";
const FROM_NAME = "Cove Blades";

function getOrigin(req: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    return req.headers.get("origin") ?? "http://localhost:3000";
  }
  return "https://coveblades.com";
}

function buildEmailHtml(recipientName: string, courseTitle: string, verifyUrl: string) {
  const firstName = recipientName.split(" ")[0] || recipientName;
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);">
    <div style="background:#0D1117;padding:24px 32px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;padding-right:12px;">
          <img src="https://coveblades.com/logo-icon-512.png" alt="Cove Blades" width="40" height="40" style="display:block;border-radius:6px;" />
        </td>
        <td style="vertical-align:middle;">
          <p style="margin:0;color:#D4A017;font-size:20px;font-weight:700;letter-spacing:.5px;">COVE BLADES</p>
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Certificate of Achievement</p>
        </td>
      </tr></table>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#111;">Congratulations on completing <strong>${escapeHtml(courseTitle)}</strong>. Your certificate is attached.</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;">You can verify or share it any time at:</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#D4A017;color:#0D1117;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">View Verification Page</a>
      </div>
      <p style="margin:24px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a> · +1 (604) 210-8180
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildEmailText(recipientName: string, courseTitle: string, verifyUrl: string) {
  const firstName = recipientName.split(" ")[0] || recipientName;
  return [
    `Hi ${firstName},`,
    ``,
    `Congratulations on completing "${courseTitle}". Your certificate is attached as a PDF.`,
    ``,
    `Verify or share it any time: ${verifyUrl}`,
    ``,
    `Cove Blades · coveblades.com · +1 (604) 210-8180`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const userId = body.userId as string | undefined;
  const courseId = body.courseId as string | undefined;
  const recipientNameOverride = body.recipientName as string | undefined;
  const issuedDateStr = body.issuedDate as string | undefined; // YYYY-MM-DD
  const sendEmail = body.sendEmail !== false; // default true

  if (!userId || !courseId) {
    return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Look up course + profile + user email.
  const [{ data: course }, { data: profile }, { data: authUser }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", courseId).single(),
    supabase.from("profiles").select("user_id, full_name").eq("user_id", userId).single(),
    supabase.auth.admin.getUserById(userId),
  ]);

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (!authUser?.user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const recipientName = (recipientNameOverride?.trim()) || profile?.full_name?.trim() || authUser.user.email || "Student";
  const issuedDate = issuedDateStr ? new Date(issuedDateStr + "T12:00:00-07:00") : new Date();

  // Generate short code with retry on collision.
  let shortCode = "";
  let attempts = 0;
  while (attempts < 5) {
    shortCode = generateShortCode();
    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("short_code", shortCode)
      .maybeSingle();
    if (!existing) break;
    attempts++;
  }
  if (attempts === 5) {
    return NextResponse.json({ error: "Could not generate unique short code" }, { status: 500 });
  }

  const origin = getOrigin(req);

  // Render PDF.
  const pdfBytes = await renderCertificate({
    recipientName,
    issuedDate,
    shortCode,
    origin,
  });

  // Insert row first to get the id (used as the storage path).
  const { data: cert, error: insertError } = await supabase
    .from("certificates")
    .insert({
      short_code: shortCode,
      user_id: userId,
      course_id: courseId,
      recipient_name: recipientName,
      course_title: course.title,
      issued_date: issuedDate.toISOString().slice(0, 10),
      issued_by: admin.id,
      pdf_path: "pending",
    })
    .select()
    .single();

  if (insertError || !cert) {
    return NextResponse.json({ error: insertError?.message ?? "Insert failed" }, { status: 500 });
  }

  const pdfPath = `${cert.id}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
    // Roll back the row to avoid an orphan.
    await supabase.from("certificates").delete().eq("id", cert.id);
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  await supabase.from("certificates").update({ pdf_path: pdfPath }).eq("id", cert.id);

  // Optionally email.
  let emailWarning: string | null = null;
  if (sendEmail) {
    if (!process.env.POSTMARK_API_KEY) {
      emailWarning = "POSTMARK_API_KEY not configured — certificate created but email not sent";
    } else {
      try {
        const verifyUrl = `${origin}/certificates/${shortCode}`;
        const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
        await client.sendEmail({
          From: `${FROM_NAME} <${FROM_EMAIL}>`,
          To: authUser.user.email!,
          Subject: `Your ${course.title} Certificate — Cove Blades`,
          TextBody: buildEmailText(recipientName, course.title, verifyUrl),
          HtmlBody: buildEmailHtml(recipientName, course.title, verifyUrl),
          Attachments: [
            {
              Name: `cove-blades-certificate-${shortCode}.pdf`,
              Content: Buffer.from(pdfBytes).toString("base64"),
              ContentType: "application/pdf",
              ContentID: "",
            },
          ],
        });
        await supabase
          .from("certificates")
          .update({ email_sent_at: new Date().toISOString() })
          .eq("id", cert.id);
      } catch (e: unknown) {
        emailWarning = `Certificate created but email failed: ${e instanceof Error ? e.message : String(e)}`;
      }
    }
  }

  return NextResponse.json({
    certificate: { ...cert, pdf_path: pdfPath },
    warning: emailWarning,
  });
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId param is required" }, { status: 400 });

  const supabase = getServiceClient();
  const { data: certificates, error } = await supabase
    .from("certificates")
    .select("*, courses(title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ certificates });
}
```

- [ ] **Step 2: Start the dev server in the background**

```bash
npm run dev
```

Run in background. Wait for "Ready" log line.

- [ ] **Step 3: Manually verify the issue endpoint**

In the browser, log in as an admin (`elagerway@gmail.com`). Then in a terminal where the browser cookies are NOT shared, just verify GET returns 401 without auth:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/admin/training/certificates?userId=00000000-0000-0000-0000-000000000000
```

Expected: `401`.

For a positive POST test, do it from the admin UI in Task 12 — the body needs an authenticated session cookie which is awkward to forge in curl. Skip the positive happy-path test here and rely on Task 12's UI test.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/admin/training/certificates/route.ts
git commit -m "feat(certificates): issue + list API route"
```

---

## Task 7: Re-send email API route

**Files:**
- Create: `src/app/api/admin/training/certificates/[id]/email/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/admin/training/certificates/[id]/email/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { escapeHtml } from "@/lib/format";

const FROM_EMAIL = "info@coveblades.com";
const FROM_NAME = "Cove Blades";

function getOrigin(req: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    return req.headers.get("origin") ?? "http://localhost:3000";
  }
  return "https://coveblades.com";
}

function buildHtml(recipientName: string, courseTitle: string, verifyUrl: string) {
  const firstName = recipientName.split(" ")[0] || recipientName;
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:520px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);">
<div style="background:#0D1117;padding:24px 32px;">
<p style="margin:0;color:#D4A017;font-size:20px;font-weight:700;letter-spacing:.5px;">COVE BLADES</p>
<p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Certificate of Achievement</p>
</div>
<div style="padding:32px;">
<p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},</p>
<p style="margin:0 0 24px;font-size:15px;color:#111;">Here is your certificate for <strong>${escapeHtml(courseTitle)}</strong> (attached).</p>
<div style="text-align:center;margin:24px 0;">
  <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#D4A017;color:#0D1117;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">View Verification Page</a>
</div>
<p style="margin:24px 0 0;font-size:13px;color:#888;text-align:center;"><a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a> · +1 (604) 210-8180</p>
</div></div></body></html>`;
}

function buildText(recipientName: string, courseTitle: string, verifyUrl: string) {
  const firstName = recipientName.split(" ")[0] || recipientName;
  return [
    `Hi ${firstName},`,
    ``,
    `Here is your certificate for "${courseTitle}" (attached).`,
    ``,
    `Verify: ${verifyUrl}`,
    ``,
    `Cove Blades · coveblades.com · +1 (604) 210-8180`,
  ].join("\n");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getServiceClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .single();

  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
  if (cert.revoked_at) return NextResponse.json({ error: "Certificate is revoked" }, { status: 400 });

  const { data: authUser } = await supabase.auth.admin.getUserById(cert.user_id);
  if (!authUser?.user?.email) return NextResponse.json({ error: "User has no email" }, { status: 404 });

  // Re-download the stored PDF.
  const { data: download, error: downloadError } = await supabase.storage
    .from("certificates")
    .download(cert.pdf_path);
  if (downloadError || !download) {
    return NextResponse.json({ error: `Failed to load PDF: ${downloadError?.message ?? "missing"}` }, { status: 500 });
  }
  const arrayBuf = await download.arrayBuffer();
  const pdfB64 = Buffer.from(arrayBuf).toString("base64");

  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json({ error: "POSTMARK_API_KEY not configured" }, { status: 500 });
  }

  const origin = getOrigin(req);
  const verifyUrl = `${origin}/certificates/${cert.short_code}`;

  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: authUser.user.email,
      Subject: `Your ${cert.course_title} Certificate — Cove Blades`,
      TextBody: buildText(cert.recipient_name, cert.course_title, verifyUrl),
      HtmlBody: buildHtml(cert.recipient_name, cert.course_title, verifyUrl),
      Attachments: [
        {
          Name: `cove-blades-certificate-${cert.short_code}.pdf`,
          Content: pdfB64,
          ContentType: "application/pdf",
          ContentID: "",
        },
      ],
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  await supabase
    .from("certificates")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("id", cert.id);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Verify auth gate**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/admin/training/certificates/00000000-0000-0000-0000-000000000000/email
```

Expected: `401`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/training/certificates/\[id\]/email/route.ts
git commit -m "feat(certificates): re-send email API route"
```

---

## Task 8: Revoke API route

**Files:**
- Create: `src/app/api/admin/training/certificates/[id]/revoke/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/admin/training/certificates/[id]/revoke/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getServiceClient();

  const { data: cert, error } = await supabase
    .from("certificates")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

  return NextResponse.json({ certificate: cert });
}
```

- [ ] **Step 2: Verify auth gate**

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/admin/training/certificates/00000000-0000-0000-0000-000000000000/revoke
```

Expected: `401`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/training/certificates/\[id\]/revoke/route.ts
git commit -m "feat(certificates): revoke API route"
```

---

## Task 9: Authenticated PDF download route

**Files:**
- Create: `src/app/api/certificates/[id]/download/route.ts`

- [ ] **Step 1: Write the route**

Create `src/app/api/certificates/[id]/download/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_EMAILS, getServiceClient } from "@/lib/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ssr = await createClient();
  const { data: { user } } = await ssr.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data: cert } = await supabase
    .from("certificates")
    .select("id, user_id, pdf_path, revoked_at")
    .eq("id", id)
    .single();

  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = cert.user_id === user.id;
  const isAdmin = ADMIN_EMAILS.includes(user.email!);
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: signed, error } = await supabase.storage
    .from("certificates")
    .createSignedUrl(cert.pdf_path, 60); // 60 seconds

  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Sign failed" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, 302);
}
```

- [ ] **Step 2: Verify auth gate**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/certificates/00000000-0000-0000-0000-000000000000/download
```

Expected: `401`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/certificates/\[id\]/download/route.ts
git commit -m "feat(certificates): authenticated download route"
```

---

## Task 10: Public verification page

**Files:**
- Create: `src/app/certificates/[shortCode]/page.tsx`

- [ ] **Step 1: Write the page**

Create `src/app/certificates/[shortCode]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

function formatDate(d: string): string {
  // d is YYYY-MM-DD
  return new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  const supabase = getServiceClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("recipient_name, course_title, issued_date, revoked_at, short_code")
    .eq("short_code", shortCode.toUpperCase())
    .maybeSingle();

  if (!cert) notFound();

  const isRevoked = !!cert.revoked_at;

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500">
            <span className="text-xs font-bold text-neutral-950">CB</span>
          </div>
          <div>
            <p className="text-amber-500 font-bold tracking-wider">COVE BLADES</p>
            <p className="text-xs text-neutral-500">Certificate Verification</p>
          </div>
        </div>

        {isRevoked ? (
          <>
            <p className="text-2xl font-bold text-red-400 mb-2">⚠ Revoked</p>
            <p className="text-neutral-400">
              This certificate (<span className="font-mono text-neutral-300">{cert.short_code}</span>) has been revoked
              and is no longer valid.
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-emerald-400 mb-4">✓ Verified</p>
            <p className="text-neutral-400 mb-1">This certificate was issued to</p>
            <p className="text-2xl font-semibold text-white mb-4">{cert.recipient_name}</p>
            <p className="text-neutral-400 mb-1">for completing</p>
            <p className="text-lg text-white mb-4">{cert.course_title}</p>
            <p className="text-neutral-400 mb-1">on</p>
            <p className="text-lg text-white mb-6">{formatDate(cert.issued_date)}</p>
            <p className="text-xs text-neutral-500 font-mono">{cert.short_code}</p>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <Link href="/" className="text-sm text-amber-500 hover:underline">
            coveblades.com
          </Link>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify 404 path**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/certificates/CB-XXXX-XXXX
```

Expected: `404`.

- [ ] **Step 3: Verify the happy path manually**

Through the Supabase MCP, insert a test row that points to a fake `pdf_path` (we'll delete it):

```sql
insert into public.certificates (
  short_code, user_id, course_id, recipient_name, course_title, issued_date, pdf_path
) values (
  'CB-TEST-0001',
  (select id from auth.users limit 1),
  (select id from public.courses limit 1),
  'Test Recipient',
  'Train To Be Sharp',
  '2026-05-14',
  'fake.pdf'
);
```

Visit `http://localhost:3000/certificates/CB-TEST-0001` in a browser. Confirm the green "✓ Verified" view renders with the test recipient + date.

Then revoke it:

```sql
update public.certificates set revoked_at = now() where short_code = 'CB-TEST-0001';
```

Refresh the page. Confirm the red "⚠ Revoked" view renders.

Clean up:

```sql
delete from public.certificates where short_code = 'CB-TEST-0001';
```

- [ ] **Step 4: Commit**

```bash
git add src/app/certificates/\[shortCode\]/page.tsx
git commit -m "feat(certificates): public verification page"
```

---

## Task 11: Admin "Certificates" panel component

**Files:**
- Create: `src/components/admin/StudentCertificates.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/admin/StudentCertificates.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  short_code: string;
  course_id: string;
  recipient_name: string;
  course_title: string;
  issued_date: string;
  revoked_at: string | null;
  email_sent_at: string | null;
  created_at: string;
  courses: { title: string } | null;
}

interface CourseOption {
  id: string;
  title: string;
}

interface Props {
  userId: string;
  defaultRecipientName: string;
  courses: CourseOption[];
  onChange?: (hasActive: boolean) => void;
}

function todayYmd(): string {
  const now = new Date();
  const tz = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return tz.toISOString().slice(0, 10);
}

export function StudentCertificates({ userId, defaultRecipientName, courses, onChange }: Props) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [recipientName, setRecipientName] = useState(defaultRecipientName);
  const [issuedDate, setIssuedDate] = useState(todayYmd());
  const [sendEmail, setSendEmail] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/training/certificates?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        const list: Certificate[] = data.certificates ?? [];
        setCerts(list);
        onChange?.(list.some((c) => !c.revoked_at));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [userId]);

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/training/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, recipientName, issuedDate, sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to issue certificate");
      } else {
        setNotice(data.warning || `Certificate issued${sendEmail ? " and emailed" : ""}.`);
        setShowForm(false);
        load();
      }
    } catch {
      setError("Failed to issue certificate");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmail(id: string) {
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training/certificates/${id}/email`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Failed to send email");
      else { setNotice("Email sent."); load(); }
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this certificate? The verification page will mark it invalid.")) return;
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training/certificates/${id}/revoke`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Failed to revoke");
      else { setNotice("Certificate revoked."); load(); }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border p-6 mb-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Certificates</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            Issue Certificate
          </button>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {notice && <p className="mb-3 text-sm text-emerald-400">{notice}</p>}

      {showForm && (
        <form onSubmit={handleIssue} className="rounded-lg border p-4 mb-4 space-y-3" style={{ borderColor: "#30363D", backgroundColor: "#0D1117" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-400">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-400">Date</label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-neutral-400">Recipient name</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            Email a copy to the student
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !courseId}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {submitting ? "Issuing..." : "Issue"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : certs.length === 0 ? (
        <p className="text-sm text-neutral-500">No certificates issued.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Code</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Course</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Issued</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id} className="border-t" style={{ borderColor: "#30363D" }}>
                <td className="px-2 py-2 font-mono text-xs text-neutral-300">{c.short_code}</td>
                <td className="px-2 py-2 text-neutral-300">{c.courses?.title ?? c.course_title}</td>
                <td className="px-2 py-2 text-neutral-400">{c.issued_date}</td>
                <td className="px-2 py-2">
                  {c.revoked_at ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">Revoked</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">Active</span>
                  )}
                </td>
                <td className="px-2 py-2 text-right whitespace-nowrap">
                  <a
                    href={`/api/certificates/${c.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 mr-3"
                  >
                    Download
                  </a>
                  {!c.revoked_at && (
                    <>
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleEmail(c.id)}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-50 mr-3"
                      >
                        Email
                      </button>
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleRevoke(c.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/StudentCertificates.tsx
git commit -m "feat(certificates): admin Certificates panel component"
```

---

## Task 12: Wire the panel into TrainingRoster + add Cert chip

**Files:**
- Modify: `src/components/admin/TrainingRoster.tsx`
- Modify: `src/app/admin/(protected)/training/page.tsx`

- [ ] **Step 1: Pass course list to the roster**

Edit `src/app/admin/(protected)/training/page.tsx`. Find the existing render of `<TrainingRoster ... />` (around line 137) and pass an additional `courseOptions` prop:

```tsx
<TrainingRoster
  students={students}
  wrongAnswers={wrongAnswers}
  courseSlug={courseSlug}
  courseOptions={(courses ?? []).map((c: any) => ({ id: c.id, title: c.title }))}
/>
```

- [ ] **Step 2: Update the TrainingRoster Props + import the panel**

Edit `src/components/admin/TrainingRoster.tsx`. At the top of the file, add the import:

```tsx
import { StudentCertificates } from "./StudentCertificates";
```

Update the `Props` interface to include `courseOptions`:

```tsx
interface Props {
  students: StudentRow[];
  wrongAnswers: WrongAnswer[];
  courseSlug: string;
  courseOptions: { id: string; title: string }[];
}
```

Update the destructuring:

```tsx
export function TrainingRoster({ students: initial, wrongAnswers, courseSlug, courseOptions }: Props) {
```

- [ ] **Step 3: Add a `certBadgeByUser` state to track who has an active cert**

Inside the component body, near the other `useState` declarations, add:

```tsx
const [certBadgeByUser, setCertBadgeByUser] = useState<Record<string, boolean>>({});
```

- [ ] **Step 4: Mount the panel above "Wrong Answers" in the detail view**

In `TrainingRoster.tsx`, find the `if (selected) { ... }` branch. Just **above** the `<h3>Wrong Answers</h3>` line, insert:

```tsx
<StudentCertificates
  userId={selected.user_id}
  defaultRecipientName={selected.full_name || ""}
  courses={courseOptions}
  onChange={(hasActive) => setCertBadgeByUser((prev) => ({ ...prev, [selected.user_id]: hasActive }))}
/>
```

- [ ] **Step 5: Render the Cert chip in the roster table**

Still in `TrainingRoster.tsx`, find the row rendering inside the table body (the `students.map(...)` block). The Student cell currently shows name + email + a "Suspended" chip. Add a "Cert ✓" chip next to "Suspended":

Replace:

```tsx
{s.banned && (
  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">
    Suspended
  </span>
)}
```

with:

```tsx
{s.banned && (
  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">
    Suspended
  </span>
)}
{certBadgeByUser[s.user_id] && (
  <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400">
    Cert ✓
  </span>
)}
```

(Note: the badge only appears for students whose detail view has been opened in the current session, since that's when the panel populates `certBadgeByUser`. Acceptable for v1 — pre-fetching all certificates server-side is YAGNI.)

- [ ] **Step 6: Manual end-to-end test in the browser**

In a browser logged in as admin (`elagerway@gmail.com`):
1. Visit `http://localhost:3000/admin/training`.
2. Click any enrolled student → opens detail view.
3. The new **Certificates** panel appears above Wrong Answers, showing "No certificates issued."
4. Click **Issue Certificate**. Form appears.
5. Click **Issue** (leave defaults; uncheck "Email a copy" if you don't want to send email during testing).
6. Confirm the new row appears with an "Active" badge.
7. Click **Download** — a PDF opens in a new tab. Confirm the recipient name + today's date appear correctly on the cert.
8. Click **Revoke** on the cert. Confirm the badge flips to "Revoked" and Email/Revoke buttons disappear.
9. Visit `http://localhost:3000/certificates/<short_code>` (copy from the table) — confirm the red "Revoked" verification view.
10. (Optional) In the Supabase dashboard → Storage → `certificates` bucket, confirm the PDF object exists at `<cert_id>.pdf`.

If the PDF text positions are wrong, return to Task 5 Step 3 and re-tune.

- [ ] **Step 7: Commit**

```bash
git add src/components/admin/TrainingRoster.tsx src/app/admin/\(protected\)/training/page.tsx
git commit -m "feat(certificates): admin roster panel + active-cert chip"
```

---

## Task 13: Student dashboard — Certificates page

**Files:**
- Create: `src/app/dashboard/certificates/page.tsx`

- [ ] **Step 1: Write the page**

Create `src/app/dashboard/certificates/page.tsx`:

```tsx
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyCertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: certs } = await supabase
    .from("certificates")
    .select("id, short_code, course_title, issued_date, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = certs ?? [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-1">Certificates</h1>
      <p className="text-sm text-neutral-400 mb-6">Your training certificates.</p>

      {list.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Award className="mx-auto size-10 text-neutral-600 mb-3" />
            <p className="text-neutral-400">You don't have any certificates yet.</p>
            <p className="text-sm text-neutral-500 mt-1">Complete a course and your instructor can issue one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((c) => {
            const revoked = !!c.revoked_at;
            return (
              <Card key={c.id}>
                <CardContent className="py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{c.course_title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Issued {new Date(c.issued_date + "T12:00:00").toLocaleDateString()} · <span className="font-mono">{c.short_code}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {revoked ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">Revoked</span>
                    ) : (
                      <>
                        <Link
                          href={`/certificates/${c.short_code}`}
                          className="text-xs text-neutral-400 hover:text-white"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify
                        </Link>
                        <a
                          href={`/api/certificates/${c.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Download
                        </a>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Log in as the student you issued a certificate to in Task 12, visit `http://localhost:3000/dashboard/certificates`. Confirm the certificate row, then click **Download** — the PDF opens.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/certificates/page.tsx
git commit -m "feat(certificates): student dashboard list page"
```

---

## Task 14: Add "Certificates" to the dashboard sidebar

**Files:**
- Modify: `src/app/dashboard/sidebar.tsx`

- [ ] **Step 1: Update the imports + nav array**

Edit `src/app/dashboard/sidebar.tsx`. On line 7, add `Award` to the lucide imports:

Replace:

```tsx
import { BookOpen, User, LayoutDashboard, LogOut, Flame, Trophy, Star } from "lucide-react";
```

with:

```tsx
import { BookOpen, User, LayoutDashboard, LogOut, Flame, Trophy, Star, Award } from "lucide-react";
```

Replace the `navItems` array (lines 15-19) with:

```tsx
const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];
```

- [ ] **Step 2: Verify**

Reload the dashboard in the browser. Confirm "Certificates" appears in the sidebar between "My Courses" and "Profile" and clicking it navigates correctly.

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/sidebar.tsx
git commit -m "feat(certificates): add Certificates link to dashboard sidebar"
```

---

## Task 15: Show "View Certificate" link on student course cards

**Files:**
- Modify: `src/app/dashboard/courses/page.tsx`

- [ ] **Step 1: Fetch certificates alongside enrollments**

Edit `src/app/dashboard/courses/page.tsx`. After the existing `progress` query (around line 18-22), add a third parallel query for certificates. Restructure the queries into a `Promise.all`:

Replace:

```tsx
  const { data: enrollments } = await supabase
    .from("user_enrollments")
    .select("course_id, courses(id, title, slug, description, level, modules(id, title, lessons(id)))")
    .eq("user_id", user.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("completed", true);
```

with:

```tsx
  const [{ data: enrollments }, { data: progress }, { data: certs }] = await Promise.all([
    supabase
      .from("user_enrollments")
      .select("course_id, courses(id, title, slug, description, level, modules(id, title, lessons(id)))")
      .eq("user_id", user.id),
    supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true),
    supabase
      .from("certificates")
      .select("id, short_code, course_id, revoked_at")
      .eq("user_id", user.id)
      .is("revoked_at", null),
  ]);

  const certByCourse = new Map<string, { id: string; short_code: string }>();
  for (const c of certs ?? []) {
    if (!certByCourse.has(c.course_id)) certByCourse.set(c.course_id, { id: c.id, short_code: c.short_code });
  }
```

- [ ] **Step 2: Render a "View Certificate" link inside each course card**

Find the existing JSX inside `courses.map((course: any) => { ... })`. Below the `<CourseProgress ... />` line, add:

```tsx
{certByCourse.has(course.id) && (
  <div className="mt-3 flex items-center gap-2 text-xs">
    <span className="text-amber-400">🏅 Certificate issued</span>
    <a
      href={`/api/certificates/${certByCourse.get(course.id)!.id}/download`}
      onClick={(e) => e.stopPropagation()}
      target="_blank"
      rel="noreferrer"
      className="text-emerald-400 hover:underline"
    >
      Download
    </a>
  </div>
)}
```

(Note: `e.stopPropagation()` prevents the parent `<Link>` to the course from intercepting the download click.)

- [ ] **Step 3: Verify**

As the test student, visit `http://localhost:3000/dashboard/courses`. The course you got a cert for should show "🏅 Certificate issued · Download". Clicking Download opens the PDF.

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/courses/page.tsx
git commit -m "feat(certificates): show certificate badge on My Courses cards"
```

---

## Task 16: Stop the dev server + final review

- [ ] **Step 1: Stop the dev server** (the background `npm run dev` from Task 6 Step 2).

- [ ] **Step 2: Run lint to catch any leftover issues**

```bash
npm run lint
```

Expected: passes with no errors related to the new files.

- [ ] **Step 3: Run a build**

```bash
npm run build
```

Expected: builds successfully.

- [ ] **Step 4: Final commit if anything was fixed**

If lint/build surfaced issues that needed fixing, commit them:

```bash
git add -A
git commit -m "chore(certificates): lint/build fixes"
```

Otherwise, no commit needed — feature is complete.
