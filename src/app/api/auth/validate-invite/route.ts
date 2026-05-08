import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ valid: false, reason: "No token provided" });
  }

  const supabase = createAdminClient();

  const { data: invite } = await supabase
    .from("course_invites")
    .select("id, email, course_id, expires_at, courses(title, slug)")
    .eq("token", token)
    .single();

  if (!invite) {
    return NextResponse.json({ valid: false, reason: "Invalid or already-used invite link" });
  }

  if (new Date(invite.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: "This invite has expired" });
  }

  const course = invite.courses as unknown as { title: string; slug: string };

  const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  const existingUser = authData?.users?.find(
    (u) => u.email?.toLowerCase() === invite.email.toLowerCase()
  );

  return NextResponse.json({
    valid: true,
    email: invite.email,
    courseTitle: course.title,
    courseSlug: course.slug,
    courseId: invite.course_id,
    existingUser: !!existingUser,
  });
}
