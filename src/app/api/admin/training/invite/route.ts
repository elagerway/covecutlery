import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { escapeHtml } from "@/lib/format";
import crypto from "crypto";

const FROM_EMAIL = "info@coveblades.com";
const FROM_NAME = "Cove Blades";

function buildInviteHtml(email: string, courseTitle: string, inviteUrl: string) {
  const firstName = email.split("@")[0];
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
          <p style="margin:2px 0 0;color:#6B7280;font-size:13px;">Training Invitation</p>
        </td>
      </tr></table>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 16px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 24px;font-size:15px;color:#111;">You've been invited to take the <strong>${escapeHtml(courseTitle)}</strong> course on Cove Blades.</p>
      <p style="margin:0 0 24px;font-size:14px;color:#555;">Click the button below to create your account and get started.</p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${inviteUrl}" style="display:inline-block;padding:14px 32px;background:#D4A017;color:#0D1117;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">Create Your Account</a>
      </div>
      <p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">This invitation expires in 30 days.</p>
      <p style="margin:16px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a> · +1 (604) 210-8180
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildInviteText(email: string, courseTitle: string, inviteUrl: string) {
  const firstName = email.split("@")[0];
  return [
    `Hi ${firstName},`,
    ``,
    `You've been invited to take the "${courseTitle}" course on Cove Blades.`,
    ``,
    `Create your account here: ${inviteUrl}`,
    ``,
    `This invitation expires in 30 days.`,
    ``,
    `Cove Blades · coveblades.com · +1 (604) 210-8180`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, courseId } = await req.json();

  if (!email || !courseId) {
    return NextResponse.json({ error: "Email and course are required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");

  const { data: invite, error: insertError } = await supabase
    .from("course_invites")
    .insert({
      course_id: courseId,
      email: email.toLowerCase().trim(),
      token,
      invited_by: admin.id,
    })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ error: "This email already has a pending invite for this course" }, { status: 409 });
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const origin = process.env.NODE_ENV === "development"
    ? (req.headers.get("origin") ?? "http://localhost:3000")
    : "https://coveblades.com";
  const inviteUrl = `${origin}/auth/signup?invite=${token}`;

  if (!process.env.POSTMARK_API_KEY) {
    return NextResponse.json({ invite, warning: "POSTMARK_API_KEY not configured — invite created but email not sent" });
  }

  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: email,
      Subject: `You're invited to ${course.title} — Cove Blades`,
      TextBody: buildInviteText(email, course.title, inviteUrl),
      HtmlBody: buildInviteHtml(email, course.title, inviteUrl),
    });
  } catch (e: unknown) {
    return NextResponse.json({
      invite,
      warning: `Invite created but email failed: ${e instanceof Error ? e.message : String(e)}`,
    });
  }

  return NextResponse.json({ invite });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();

  const { data: invites, error } = await supabase
    .from("course_invites")
    .select("*, courses(title)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ invites });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const inviteId = req.nextUrl.searchParams.get("id");
  if (!inviteId) return NextResponse.json({ error: "id param is required" }, { status: 400 });

  const supabase = getServiceClient();

  const { data: deleted, error } = await supabase
    .from("course_invites")
    .delete()
    .eq("id", inviteId)
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ error: "Invite not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
