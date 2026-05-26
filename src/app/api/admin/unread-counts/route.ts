import { NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { listMessages, SERVICE_NUMBER } from "@/lib/magpipe";

// GET /api/admin/unread-counts
// → { sms: <count>, email: <count> }
// Used by the admin sidebar to render badge counts next to channel links.

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();

  // Email unread = inbound emails with status=new
  const { count: emailCount } = await supabase
    .from("emails")
    .select("id", { count: "exact", head: true })
    .eq("direction", "inbound")
    .eq("status", "new");

  // SMS unread = inbound messages (Magpipe + historical) whose ID is NOT in sms_message_reads
  let smsCount = 0;
  try {
    const [magpipeData, historicalRes, readsRes] = await Promise.all([
      listMessages({ phoneNumber: SERVICE_NUMBER, limit: 500 }),
      supabase
        .from("historical_sms_messages")
        .select("external_id, direction, from_number, to_number")
        .eq("direction", "inbound"),
      supabase.from("sms_message_reads").select("message_id"),
    ]);

    const readIds = new Set<string>((readsRes.data ?? []).map(r => r.message_id));

    const magpipeUnread = magpipeData.messages.filter(
      m => m.direction === "inbound" && m.to_number === SERVICE_NUMBER && !readIds.has(m.id)
    ).length;

    const historicalUnread = (historicalRes.data ?? []).filter(
      h => h.to_number === SERVICE_NUMBER && !readIds.has(h.external_id as string)
    ).length;

    smsCount = magpipeUnread + historicalUnread;
  } catch (e) {
    // Don't fail the whole endpoint if Magpipe is briefly unavailable
    console.error("[unread-counts] sms count failed:", e);
  }

  return NextResponse.json({ sms: smsCount, email: emailCount ?? 0 });
}
