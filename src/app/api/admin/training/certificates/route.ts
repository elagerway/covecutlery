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

  const [{ data: course }, { data: profile }, { data: authUser }] = await Promise.all([
    supabase.from("courses").select("id, title").eq("id", courseId).single(),
    supabase.from("profiles").select("user_id, full_name").eq("user_id", userId).single(),
    supabase.auth.admin.getUserById(userId),
  ]);

  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });
  if (!authUser?.user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Gate (#23 Phase 4): if this course has a practicum module, the student must
  // have an approved technique-video submission before a certificate is issued.
  const { data: practicumModule } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId)
    .eq("slug", "practicum")
    .maybeSingle();
  if (practicumModule) {
    const { data: approved } = await supabase
      .from("practicum_submissions")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("status", "approved")
      .limit(1)
      .maybeSingle();
    if (!approved) {
      return NextResponse.json(
        {
          error:
            "This student doesn't have an approved practicum video yet. Review and approve their submission before issuing the certificate.",
        },
        { status: 422 }
      );
    }
  }

  const recipientName = (recipientNameOverride?.trim()) || profile?.full_name?.trim() || authUser.user.email || "Student";
  const issuedDate = issuedDateStr ? new Date(issuedDateStr + "T12:00:00-07:00") : new Date();

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

  const pdfBytes = await renderCertificate({
    recipientName,
    issuedDate,
    shortCode,
    origin,
  });

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
    await supabase.from("certificates").delete().eq("id", cert.id);
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  await supabase.from("certificates").update({ pdf_path: pdfPath }).eq("id", cert.id);

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
