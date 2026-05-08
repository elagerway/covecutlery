import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { inviteId } = await req.json();
  if (!inviteId) return NextResponse.json({ error: "inviteId is required" }, { status: 400 });

  const supabase = getServiceClient();

  const { data: invite, error: inviteErr } = await supabase
    .from("course_invites")
    .select("id, email, course_id")
    .eq("id", inviteId)
    .single();

  if (inviteErr || !invite) {
    return NextResponse.json({ error: "Invite not found" }, { status: 404 });
  }

  const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

  const targetEmail = invite.email.toLowerCase();
  const user = usersList?.users?.find((u) => u.email?.toLowerCase() === targetEmail);

  if (!user) {
    return NextResponse.json({
      error: "No account found for this email — the customer needs to create an account first using the invite link.",
    }, { status: 409 });
  }

  const { error: enrollErr } = await supabase
    .from("user_enrollments")
    .upsert(
      { user_id: user.id, course_id: invite.course_id },
      { onConflict: "user_id,course_id" }
    );
  if (enrollErr) return NextResponse.json({ error: enrollErr.message }, { status: 500 });

  await supabase.from("course_invites").delete().eq("id", invite.id);

  return NextResponse.json({ ok: true, userId: user.id, email: user.email });
}
