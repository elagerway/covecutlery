import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { createAdminClient } from "@/utils/supabase/admin";
import { escapeHtml } from "@/lib/format";
import { BRAND_NAME, BRAND_EMAIL, BRAND_PHONE_DISPLAY, BRAND_SITE_URL, BRAND_LOGO_URL, BRAND_GOLD, BRAND_DARK } from "@/lib/brand";

function buildConfirmHtml(firstName: string, confirmUrl: string) {
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
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Confirm Your Account</p>
        </td>
      </tr></table>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#111;">Thanks for creating your ${BRAND_NAME} account. Confirm your email to get started.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;padding:14px 32px;background:${BRAND_GOLD};color:${BRAND_DARK};font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Confirm Email</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">If you didn't create this account, you can ignore this email.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="${BRAND_SITE_URL}" style="color:${BRAND_GOLD};">coveblades.com</a> · ${BRAND_PHONE_DISPLAY}
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildConfirmText(firstName: string, confirmUrl: string) {
  return [
    `Hi ${firstName},`,
    ``,
    `Thanks for creating your ${BRAND_NAME} account. Confirm your email to get started:`,
    ``,
    confirmUrl,
    ``,
    `If you didn't create this account, you can ignore this email.`,
    ``,
    `${BRAND_NAME} · coveblades.com · ${BRAND_PHONE_DISPLAY}`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { email, password, fullName, redirectTo } = await req.json();

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { full_name: fullName },
      redirectTo: redirectTo || "https://coveblades.com/auth/callback?next=/courses",
    },
  });

  if (error) {
    if (error.message.includes("already been registered") || error.message.includes("already exists")) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in instead." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const confirmUrl = data.properties?.action_link;
  if (!confirmUrl) {
    return NextResponse.json({ error: "Failed to generate confirmation link" }, { status: 500 });
  }

  const firstName = fullName.split(" ")[0];

  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json({ ok: true, warning: "POSTMARK_API_KEY not configured — account created but confirmation email not sent" });
  }

  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    await client.sendEmail({
      From: `${BRAND_NAME} <${BRAND_EMAIL}>`,
      To: email,
      Subject: `Confirm your ${BRAND_NAME} account`,
      TextBody: buildConfirmText(firstName, confirmUrl),
      HtmlBody: buildConfirmHtml(firstName, confirmUrl),
    });
  } catch (e: unknown) {
    return NextResponse.json({ ok: true, warning: `Account created but email failed: ${e instanceof Error ? e.message : String(e)}` });
  }

  return NextResponse.json({ ok: true });
}
