import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { sendEmail } from "@/lib/notify";

// Admin review of practicum video submissions (GitHub issue #23, Phase 3).
// GET ?userId=<id>  -> that student's submissions (newest first)
// GET (no userId)   -> the pending review queue (submitted + in_review)
// PATCH { id, status, reviewerNotes } -> record a review decision

const REVIEW_FIELDS =
  "id, user_id, status, student_note, reviewer_notes, reviewed_at, submitted_at, external_url";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const svc = getServiceClient();
  const userId = new URL(req.url).searchParams.get("userId");

  let query = svc
    .from("practicum_submissions")
    .select(REVIEW_FIELDS)
    .order("submitted_at", { ascending: false });
  query = userId
    ? query.eq("user_id", userId)
    : query.in("status", ["submitted", "in_review"]);

  const { data: subs, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const ids = [...new Set((subs ?? []).map((s) => s.user_id))];
  const nameMap = new Map<string, string>();
  const emailMap = new Map<string, string>();
  if (ids.length) {
    const { data: profiles } = await svc
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", ids);
    for (const p of profiles ?? []) nameMap.set(p.user_id, p.full_name ?? "");
    const { data: authData } = await svc.auth.admin.listUsers({ perPage: 1000 });
    for (const u of authData?.users ?? []) emailMap.set(u.id, u.email ?? "");
  }

  const submissions = (subs ?? []).map((s) => ({
    ...s,
    user_name: nameMap.get(s.user_id) ?? "",
    user_email: emailMap.get(s.user_id) ?? "",
  }));

  return NextResponse.json({ submissions });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { id, status, reviewerNotes } = (body ?? {}) as {
    id?: string;
    status?: string;
    reviewerNotes?: string;
  };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  if (!status || !["approved", "changes_requested", "in_review"].includes(status))
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });

  const svc = getServiceClient();
  const notes = typeof reviewerNotes === "string" ? reviewerNotes.slice(0, 2000) : "";
  const { data, error } = await svc
    .from("practicum_submissions")
    .update({
      status,
      reviewer_notes: notes,
      reviewer_id: admin.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, status, user_id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Email the student their decision (best-effort).
  if (status === "approved" || status === "changes_requested") {
    const { data: authUser } = await svc.auth.admin.getUserById(data.user_id);
    const email = authUser?.user?.email;
    if (email) {
      if (status === "approved") {
        await sendEmail({
          to: email,
          subject: "Your practicum video is approved — Cove Blades",
          text: `Great work — Erik approved your practicum technique video.${
            notes ? `\n\nFeedback: ${notes}` : ""
          }\n\nYour certificate can now be issued. View your dashboard: https://coveblades.com/dashboard/certificates`,
        });
      } else {
        await sendEmail({
          to: email,
          subject: "Practicum video — changes requested — Cove Blades",
          text: `Erik reviewed your practicum technique video and asked for some changes:\n\n${
            notes || "Please refine your technique and resubmit."
          }\n\nResubmit here: https://coveblades.com/courses/train-to-be-sharp/lessons/practicum-certification`,
        });
      }
    }
  }

  return NextResponse.json({ submission: data });
}
