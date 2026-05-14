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
