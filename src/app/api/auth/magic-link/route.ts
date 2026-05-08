import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { createAdminClient } from "@/utils/supabase/admin";
import { escapeHtml } from "@/lib/format";

const FROM_EMAIL = "info@coveblades.com";
const FROM_NAME = "Cove Blades";

function buildMagicLinkHtml(email: string, magicUrl: string) {
  const name = email.split("@")[0];
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
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Admin Sign In</p>
        </td>
      </tr></table>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(name)},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#111;">Click the button below to sign in to the Cove Blades admin panel.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${escapeHtml(magicUrl)}" style="display:inline-block;padding:14px 32px;background:#D4A017;color:#0D1117;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Sign In</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">This link expires in 1 hour. If you didn't request this, you can ignore it.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a> · +1 (604) 210-8180
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildMagicLinkText(email: string, magicUrl: string) {
  const name = email.split("@")[0];
  return [
    `Hi ${name},`,
    ``,
    `Click the link below to sign in to the Cove Blades admin panel:`,
    ``,
    magicUrl,
    ``,
    `This link expires in 1 hour. If you didn't request this, you can ignore it.`,
    ``,
    `Cove Blades · coveblades.com · +1 (604) 210-8180`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const { email, redirectTo } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: redirectTo || "https://coveblades.com/auth/callback?next=/admin/invoices",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const magicUrl = data.properties?.action_link;
  if (!magicUrl) {
    return NextResponse.json({ error: "Failed to generate magic link" }, { status: 500 });
  }

  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json({ ok: true, warning: "POSTMARK_API_KEY not configured" });
  }

  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: email,
      Subject: "Sign in to Cove Blades Admin",
      TextBody: buildMagicLinkText(email, magicUrl),
      HtmlBody: buildMagicLinkHtml(email, magicUrl),
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Failed to send email: ${e instanceof Error ? e.message : String(e)}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
