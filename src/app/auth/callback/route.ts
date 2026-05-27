import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const inviteToken = searchParams.get("invite");
  let next = searchParams.get("next") ?? searchParams.get("redirect") ?? "/courses";
  if (!next.startsWith("/") || next.startsWith("//")) next = "/courses";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (inviteToken) {
        next = await processInvite(supabase, inviteToken, next);
      }
      await enrollFromPaidCourses(supabase);

      const allowedHosts = ["coveblades.com", "www.coveblades.com", "localhost:3000", "localhost:3002"];
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalhost = forwardedHost?.startsWith("localhost");
      const base =
        forwardedHost && allowedHosts.includes(forwardedHost)
          ? `${isLocalhost ? "http" : "https"}://${forwardedHost}`
          : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  const url = new URL("/auth/login", origin);
  url.searchParams.set("error", "auth");
  return NextResponse.redirect(url);
}

async function processInvite(
  supabase: Awaited<ReturnType<typeof createClient>>,
  token: string,
  fallbackNext: string
): Promise<string> {
  try {
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return fallbackNext;

    const { data: invite } = await admin
      .from("course_invites")
      .select("id, email, course_id, expires_at, courses(slug)")
      .eq("token", token)
      .single();

    if (!invite) return fallbackNext;
    if (new Date(invite.expires_at) < new Date()) return fallbackNext;

    if (user.email?.toLowerCase() !== invite.email.toLowerCase()) return fallbackNext;

    const { error: enrollErr } = await admin
      .from("user_enrollments")
      .upsert(
        { user_id: user.id, course_id: invite.course_id },
        { onConflict: "user_id,course_id" }
      );
    if (enrollErr) {
      console.error("[processInvite] enrollment failed, leaving invite intact:", enrollErr);
      return fallbackNext;
    }

    await admin.from("course_invites").delete().eq("id", invite.id);

    const course = invite.courses as unknown as { slug: string };
    if (course?.slug) return `/courses/${course.slug}`;
  } catch (e) {
    console.error("[processInvite] error:", e);
  }
  return fallbackNext;
}

async function enrollFromPaidCourses(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;

    const { data: paidEnrollments } = await admin
      .from("course_enrollments")
      .select("course_slug")
      .eq("customer_email", user.email.toLowerCase())
      .eq("status", "paid");

    if (!paidEnrollments?.length) return;

    const slugs = paidEnrollments.map((e) => e.course_slug);
    const { data: courses } = await admin
      .from("courses")
      .select("id")
      .in("slug", slugs);

    if (!courses?.length) return;

    for (const course of courses) {
      await admin
        .from("user_enrollments")
        .upsert(
          { user_id: user.id, course_id: course.id },
          { onConflict: "user_id,course_id" },
        );
    }
  } catch (e) {
    console.error("[enrollFromPaidCourses] error:", e);
  }
}
