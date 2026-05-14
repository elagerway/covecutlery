# Training Certificates — Design

**Date:** 2026-05-14
**Status:** Approved (pending implementation plan)

## Goal

Let an admin issue a "Certificate of Achievement" PDF to a student who has taken a Cove Blades training course. The certificate is delivered via email, available in the student's dashboard, and downloadable by the admin from the existing training roster.

The visual design follows the reference at `KNIVES/train-to-be-sharp/TTBS - Certificate of Achievement.pdf` — gold-and-black ribbons, Cove Blades shield logo at top, "CERTIFICATE OF ACHIEVEMENT" headline, recipient name on a signature line, "For participating in the Cove Blades 'Train to be Sharp' Level 1 Training on _______", gold seal, and Erik Lagerway's signature.

## Behaviour decisions

| Decision | Choice |
|---|---|
| Trigger | Admin clicks "Issue Certificate" button (no auto-issuance) |
| Eligibility | No gating — admin can issue at any completion % |
| Delivery | Email PDF + dashboard download + admin download (all three) |
| Date shown | Date the admin issues the certificate (today, editable in form) |
| Verification | Yes — short code printed on PDF + public verify URL |
| Rendering | Use the existing reference PDF as the page background; overlay name/date/code as text via `pdf-lib` |

## Architecture

### Data

New migration `supabase/migrations/<timestamp>_create_certificates.sql`:

```sql
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  short_code text not null unique,           -- e.g. "CB-X7K2-9F4M"
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  recipient_name text not null,              -- snapshot at issuance time
  course_title text not null,                -- snapshot at issuance time
  issued_date date not null,                 -- the date printed on the cert
  issued_by uuid references auth.users(id),  -- admin who issued
  pdf_path text not null,                    -- Supabase Storage path: "<id>.pdf"
  revoked_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz default now() not null
);
create index idx_certificates_user on public.certificates(user_id);
create index idx_certificates_course on public.certificates(course_id);

alter table public.certificates enable row level security;
create policy "Users view own certificates" on public.certificates for select
  using (auth.uid() = user_id);
-- All writes go through service-role admin routes; no user write policies.

-- Private storage bucket
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;
```

A student may have multiple certificates for the same course (re-issuance keeps history). `revoked_at` marks one invalid without deleting it.

### Template asset

Copy the reference PDF into the repo at `public/certificate-template.pdf`. Loaded once per cold start, cached in module scope.

### Library code

- `src/lib/certificates/code.ts` — `generateShortCode()`. Crockford base32 (skips I, L, O, U, 0, 1), 8 chars formatted `CB-XXXX-XXXX`. Caller retries on unique-index collision (vanishingly rare).
- `src/lib/certificates/render.ts` — `renderCertificate({ recipientName, issuedDate, shortCode }) → Promise<Uint8Array>`. Loads the template PDF, embeds Helvetica-Bold (recipient) + Helvetica (date + footer), draws three text overlays at coordinates measured from the template, returns PDF bytes.
  - Recipient name: centered horizontally on the underline below "Proudly Presented to:"
  - Date: drawn after "Level 1 Training on " on the second underline (formatted "May 14, 2026")
  - Short code line: small, bottom-center, e.g. `Verify at coveblades.com/certificates/CB-X7K2-9F4M`

### API routes

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/admin/training/certificates` | Issue a new certificate; renders PDF, uploads to Storage, inserts row, optionally emails it. Body: `{ userId, courseId, recipientName?, issuedDate?, sendEmail? }` |
| GET | `/api/admin/training/certificates?userId=...` | List a student's certificates (admin) |
| POST | `/api/admin/training/certificates/[id]/email` | Re-send the existing PDF by email; sets `email_sent_at` |
| POST | `/api/admin/training/certificates/[id]/revoke` | Mark `revoked_at` |
| GET | `/api/certificates/[id]/download` | Auth: owner or admin. Returns a short-lived signed URL from Storage and 302-redirects |

All admin routes use the existing `requireAdmin()` helper from `src/lib/admin.ts`. Postmark and Storage use the existing service-role patterns from invoices/invites.

### UI

**Admin — `src/components/admin/TrainingRoster.tsx`** (modify existing):

- Roster table: add a small `Cert ✓` chip in the Student column when the student has any non-revoked cert.
- Student detail panel: insert a "Certificates" section above "Wrong Answers":
  - "Issue Certificate" button → inline form (course dropdown, name, date, "Email a copy" checkbox).
  - List of existing certs: short_code · course · issued_date · revoked badge · `[Download]` `[Email]` `[Revoke]` buttons.

**Student — `src/app/dashboard/`**:

- New page `dashboard/certificates/page.tsx` listing the user's certs with download buttons + verify URL.
- Add "Certificates" entry to `dashboard/sidebar.tsx`.
- On `dashboard/courses/page.tsx`, when a non-revoked cert exists for that course, show a small "View Certificate" link on the course card.

**Public — `src/app/certificates/[shortCode]/page.tsx`**:

- Server component, no auth.
- Found + active → "✓ Issued — `<recipient_name>` completed `<course_title>` on `<issued_date>`."
- Found + revoked → "⚠ This certificate has been revoked."
- Not found → 404.
- Branded with Cove Blades header. Exposes only name, course title, issued date, and revoked status.

## Out of scope

- Auto-issuance on course completion.
- Eligibility gating based on lessons/quizzes.
- QR code on the certificate.
- Per-course templates (the template hardcodes "Train to be Sharp Level 1"; if more courses are added later, we either swap to per-course templates or move that line into the dynamic overlay — flagged as future work).

## Risks & notes

- **`pdf-lib` dependency** — pure JS, ~2MB, runs on Vercel serverless without extras. Low risk.
- **Coordinate measurement** — text positions on the template need to be tuned visually during implementation; budget one pass to get them right.
- **Template is locked to one course** — see "Out of scope" above.
- **No font embedding beyond `pdf-lib`'s standard fonts** — Helvetica is close enough to the reference for v1.
