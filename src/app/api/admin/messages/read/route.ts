import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

// POST /api/admin/messages/read
// Body: { messageIds: string[] }
// Idempotent — upserts read state for each ID.

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { messageIds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!Array.isArray(body.messageIds)) {
    return NextResponse.json({ error: "messageIds must be an array" }, { status: 400 });
  }

  const ids = body.messageIds
    .filter((x): x is string => typeof x === "string" && x.length > 0)
    .slice(0, 500);

  if (ids.length === 0) return NextResponse.json({ ok: true, marked: 0 });

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("sms_message_reads")
    .upsert(
      ids.map(id => ({ message_id: id })),
      { onConflict: "message_id", ignoreDuplicates: true }
    );

  if (error) {
    console.error("[/api/admin/messages/read] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, marked: ids.length });
}
