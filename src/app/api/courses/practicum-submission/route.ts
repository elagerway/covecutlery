import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Student practicum technique-video submissions (GitHub issue #23).
// Link-only: students host their clip on YouTube (unlisted) or Vimeo and submit
// the URL — we don't store video files. This route records/reads the submission
// row (enrollment-guarded, RLS-backed).

const ALLOWED_LINK =
  /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)\//i;

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slug = new URL(req.url).searchParams.get("course");
  if (!slug) return NextResponse.json({ error: "Missing course" }, { status: 400 });

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", slug)
    .single();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // RLS limits this to the caller's own rows.
  const { data: submission } = await supabase
    .from("practicum_submissions")
    .select(
      "id, status, student_note, reviewer_notes, reviewed_at, submitted_at, external_url"
    )
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ submission: submission ?? null });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { courseSlug, externalUrl, studentNote } = body as {
    courseSlug?: string;
    externalUrl?: string;
    studentNote?: string;
  };
  if (!courseSlug) return NextResponse.json({ error: "Missing courseSlug" }, { status: 400 });

  const url = typeof externalUrl === "string" ? externalUrl.trim() : "";
  if (!url) return NextResponse.json({ error: "Paste a link to your video." }, { status: 400 });
  if (!ALLOWED_LINK.test(url))
    return NextResponse.json(
      { error: "Link must be a YouTube or Vimeo URL." },
      { status: 400 }
    );

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", courseSlug)
    .single();
  if (!course) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // Must be enrolled (also enforced by RLS on insert; checked here for a clean error).
  const { data: enrollment } = await supabase
    .from("user_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();
  if (!enrollment)
    return NextResponse.json({ error: "You're not enrolled in this course." }, { status: 403 });

  const note = typeof studentNote === "string" ? studentNote.slice(0, 2000) : "";

  // Inserted under the caller's identity → RLS insert policy (enrolled + own) applies.
  const { data: inserted, error } = await supabase
    .from("practicum_submissions")
    .insert({
      user_id: user.id,
      course_id: course.id,
      external_url: url,
      student_note: note,
    })
    .select("id, status, submitted_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // TODO (Phase 5): notify Erik via Postmark that a new video was submitted.
  return NextResponse.json({ submission: inserted });
}
