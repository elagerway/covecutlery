import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { listAllServiceMessages, type MagpipeMessage, type Conversation, isServiceNumber, customerPhone } from "@/lib/magpipe";
import { extractNameFromMessages } from "@/lib/sms-name";

// GET /api/admin/messages              → conversations + unread counts
// GET /api/admin/messages?phone=X      → thread for that phone
// GET /api/admin/messages?q=foo        → conversations filtered by query
//
// Always scoped to SERVICE_NUMBER. Merges Magpipe (live) + historical
// SignalWire imports from our DB. Joins sms_message_reads for unread state.

interface UnifiedMessage {
  id: string;
  from_number: string;
  to_number: string;
  body: string;
  direction: "inbound" | "outbound";
  status: string;
  is_ai_generated: boolean;
  created_at: string;
  source: "magpipe" | "historical";
  is_read: boolean;
}

function magpipeToUnified(m: MagpipeMessage, readIds: Set<string>): UnifiedMessage {
  return {
    id: m.id,
    from_number: m.from_number,
    to_number: m.to_number,
    body: m.body,
    direction: m.direction,
    status: m.status,
    is_ai_generated: m.is_ai_generated,
    created_at: m.created_at,
    source: "magpipe",
    is_read: readIds.has(m.id),
  };
}

interface HistoricalRow {
  external_id: string;
  from_number: string;
  to_number: string;
  body: string;
  direction: "inbound" | "outbound";
  status: string | null;
  date_sent: string;
}

function historicalToUnified(h: HistoricalRow, readIds: Set<string>): UnifiedMessage {
  return {
    id: h.external_id,
    from_number: h.from_number,
    to_number: h.to_number,
    body: h.body,
    direction: h.direction,
    status: h.status ?? "delivered",
    is_ai_generated: false,
    created_at: h.date_sent,
    source: "historical",
    is_read: readIds.has(h.external_id),
  };
}

function matchesQuery(m: UnifiedMessage, q: string): boolean {
  const term = q.toLowerCase();
  return (
    (m.body ?? "").toLowerCase().includes(term) ||
    m.from_number.toLowerCase().includes(term) ||
    m.to_number.toLowerCase().includes(term)
  );
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();

  try {
    const supabase = getServiceClient();

    // Fetch Magpipe (across all service numbers) + historical + reads in parallel
    const [magpipeMessages, historicalRes, readsRes] = await Promise.all([
      listAllServiceMessages(500),
      supabase
        .from("historical_sms_messages")
        .select("external_id, from_number, to_number, body, direction, status, date_sent")
        .order("date_sent", { ascending: false })
        .limit(5000),
      supabase.from("sms_message_reads").select("message_id"),
    ]);

    const readIds = new Set<string>((readsRes.data ?? []).map(r => r.message_id));
    const magpipeUnified = magpipeMessages.map(m => magpipeToUnified(m, readIds));
    const historicalUnified = (historicalRes.data ?? []).map(h => historicalToUnified(h as HistoricalRow, readIds));

    // Dedup: prefer Magpipe over historical when external_id collides (unlikely but defensive)
    const seenIds = new Set<string>(magpipeUnified.map(m => m.id));
    const merged: UnifiedMessage[] = [
      ...magpipeUnified,
      ...historicalUnified.filter(h => !seenIds.has(h.id)),
    ];

    // Thread view: any message between us (any service number) and the requested phone
    if (phone) {
      const messages = merged
        .filter(m =>
          (m.from_number === phone && isServiceNumber(m.to_number)) ||
          (m.to_number === phone && isServiceNumber(m.from_number))
        )
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
      return NextResponse.json({ messages });
    }

    // Group into conversations + apply search + compute unread
    const conversations = groupAndFilter(merged, q);

    // Auto-add any customer phones missing from the customers table.
    // Idempotent — does nothing for phones we've already seen.
    const enrichedConvos = await ensureCustomers(supabase, conversations, merged);
    const totalUnread = enrichedConvos.reduce((s, c) => s + c.unreadCount, 0);

    return NextResponse.json({ conversations: enrichedConvos, totalUnread });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/admin/messages] error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}

interface ConversationWithUnread extends Conversation {
  unreadCount: number;
}

function groupAndFilter(messages: UnifiedMessage[], q: string): ConversationWithUnread[] {
  const byPhone = new Map<string, UnifiedMessage[]>();
  for (const m of messages) {
    if (isServiceNumber(m.from_number) && isServiceNumber(m.to_number)) continue;
    // Use customerPhone helper so messages from the old service number also
    // attribute correctly to the customer side.
    const phone = customerPhone(m as unknown as MagpipeMessage);
    if (!phone || isServiceNumber(phone)) continue;
    if (!byPhone.has(phone)) byPhone.set(phone, []);
    byPhone.get(phone)!.push(m);
  }

  const result: ConversationWithUnread[] = [];
  for (const [phone, msgs] of byPhone) {
    const hasInbound = msgs.some(m => m.direction === "inbound");
    if (!hasInbound) continue;

    if (q && !msgs.some(m => matchesQuery(m, q)) && !phone.toLowerCase().includes(q.toLowerCase())) {
      continue;
    }

    msgs.sort((a, b) => b.created_at.localeCompare(a.created_at));
    const unreadCount = msgs.filter(m => m.direction === "inbound" && !m.is_read).length;
    result.push({
      phone,
      lastMessage: msgs[0] as unknown as MagpipeMessage,
      messageCount: msgs.length,
      hasInbound,
      unreadCount,
    });
  }

  result.sort((a, b) => b.lastMessage.created_at.localeCompare(a.lastMessage.created_at));
  return result;
}

// Keep the customerPhone import marker so unused-import linter doesn't flag it
// if we later remove its only callsite.
void customerPhone;

interface ConversationWithCustomer extends ConversationWithUnread {
  customer: { id: string; name: string } | null;
}

type SupabaseClient = ReturnType<typeof getServiceClient>;

async function ensureCustomers(
  supabase: SupabaseClient,
  conversations: ConversationWithUnread[],
  allMessages: UnifiedMessage[]
): Promise<ConversationWithCustomer[]> {
  const phones = conversations.map(c => c.phone);
  if (phones.length === 0) return conversations.map(c => ({ ...c, customer: null }));

  // Fetch any existing customers matching these phones
  const { data: existing } = await supabase
    .from("customers")
    .select("id, name, phone")
    .in("phone", phones);

  const byPhone = new Map<string, { id: string; name: string }>();
  for (const c of (existing ?? []) as { id: string; name: string; phone: string }[]) {
    byPhone.set(c.phone, { id: c.id, name: c.name });
  }

  // Build inserts for any phones we don't already have a customer for
  const missingPhones = phones.filter(p => !byPhone.has(p));
  if (missingPhones.length > 0) {
    const newRows = missingPhones.map(phone => {
      // Gather all inbound message bodies from this customer for name extraction
      const bodies = allMessages
        .filter(m => m.direction === "inbound" && m.from_number === phone)
        .map(m => m.body);
      const name = extractNameFromMessages(bodies) ?? "Unknown";
      return { name, phone, source: "sms" as const };
    });

    const { data: inserted } = await supabase
      .from("customers")
      .insert(newRows)
      .select("id, name, phone");

    for (const c of (inserted ?? []) as { id: string; name: string; phone: string }[]) {
      byPhone.set(c.phone, { id: c.id, name: c.name });
    }
  }

  return conversations.map(c => ({
    ...c,
    customer: byPhone.get(c.phone) ?? null,
  }));
}
