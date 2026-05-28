import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { createAdminClient } from "@/utils/supabase/admin";
import { escapeHtml } from "@/lib/format";
import {
  BRAND_NAME,
  BRAND_EMAIL,
  BRAND_PHONE_DISPLAY,
  BRAND_SITE_URL,
  BRAND_LOGO_URL,
  BRAND_GOLD,
  BRAND_DARK,
} from "@/lib/brand";

function buildResetHtml(firstName: string, resetUrl: string) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);">
    <div style="background:${BRAND_DARK};padding:24px 32px;">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;padding-right:12px;">
          <img src="${BRAND_LOGO_URL}" alt="${BRAND_NAME}" width="40" height="40" style="display:block;border-radius:6px;" />
        </td>
        <td style="vertical-align:middle;">
          <p style="margin:0;color:${BRAND_GOLD};font-size:20px;font-weight:700;letter-spacing:.5px;">COVE BLADES</p>
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Password Reset</p>
        </td>
      </tr></table>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#111;">We received a request to reset your ${BRAND_NAME} password. Click the button below to choose a new one.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${escapeHtml(resetUrl)}" style="display:inline-block;padding:14px 32px;background:${BRAND_GOLD};color:${BRAND_DARK};font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Reset password</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="${BRAND_SITE_URL}" style="color:${BRAND_GOLD};">coveblades.com</a> · ${BRAND_PHONE_DISPLAY}
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildResetText(firstName: string, resetUrl: string) {
  return [
    `Hi ${firstName},`,
    ``,
    `We received a request to reset your ${BRAND_NAME} password. Click the link below to choose a new one:`,
    ``,
    resetUrl,
    ``,
    `This link expires in 1 hour. If you didn't request this, you can ignore this email.`,
    ``,
    `${BRAND_NAME} · coveblades.com · ${BRAND_PHONE_DISPLAY}`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: {
      redirectTo: "https://coveblades.com/auth/callback?next=/auth/reset-password",
    },
  });

  // Always tell the client "ok" to avoid email enumeration. Log real errors
  // server-side so they're still visible in Vercel logs.
  if (error) {
    const msg = error.message.toLowerCase();
    if (!msg.includes("not found") && !msg.includes("no user") && !msg.includes("email not")) {
      console.error("[forgot-password] generateLink failed:", error.message);
    }
    return NextResponse.json({ ok: true });
  }

  const resetUrl = data.properties?.action_link;
  if (!resetUrl) {
    return NextResponse.json({ ok: true });
  }

  if (!process.env.POSTMARK_API_KEY) {
    console.warn("[forgot-password] POSTMARK_API_KEY not set");
    return NextResponse.json({ ok: true });
  }

  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    const firstName = email.split("@")[0];
    await client.sendEmail({
      From: `${BRAND_NAME} <${BRAND_EMAIL}>`,
      To: email,
      Subject: `Reset your ${BRAND_NAME} password`,
      TextBody: buildResetText(firstName, resetUrl),
      HtmlBody: buildResetHtml(firstName, resetUrl),
    });
  } catch (e: unknown) {
    console.error("[forgot-password] postmark failed:", e instanceof Error ? e.message : String(e));
  }

  return NextResponse.json({ ok: true });
}
