import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { normaliseSubject, normaliseAddress } from "@/lib/email";

// GET /api/admin/emails                       → list of conversations (left rail)
// GET /api/admin/emails?conversation=<key>    → ordered messages in a thread

interface EmailRow {
  id: number;
  message_id: string | null;
  in_reply_to: string | null;
  email_references: string[] | null;
  from_email: string;
  from_name: string | null;
  to_email: string;
  cc_emails: string[] | null;
  subject: string | null;
  text_body: string | null;
  html_body: string | null;
  stripped_reply: string | null;
  direction: "inbound" | "outbound";
  status: string;
  attachments: { name: string; content_type: string; size: number }[];
  created_at: string;
  read_at: string | null;
}

function otherParty(e: EmailRow): string {
  return e.direction === "inbound" ? normaliseAddress(e.from_email) : normaliseAddress(e.to_email);
}

function conversationKey(e: EmailRow): string {
  return `${otherParty(e)}::${normaliseSubject(e.subject).toLowerCase()}`;
}

function matchesEmailQuery(r: EmailRow, q: string): boolean {
  const term = q.toLowerCase();
  return (
    (r.subject ?? "").toLowerCase().includes(term) ||
    (r.from_email ?? "").toLowerCase().includes(term) ||
    (r.from_name ?? "").toLowerCase().includes(term) ||
    (r.to_email ?? "").toLowerCase().includes(term) ||
    (r.text_body ?? "").toLowerCase().includes(term) ||
    (r.stripped_reply ?? "").toLowerCase().includes(term)
  );
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversation = req.nextUrl.searchParams.get("conversation");
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("emails")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const rows = (data ?? []) as EmailRow[];

  if (conversation) {
    const thread = rows
      .filter(r => conversationKey(r) === conversation)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    return NextResponse.json({ messages: thread });
  }

  // Group into conversations
  const byKey = new Map<string, EmailRow[]>();
  for (const r of rows) {
    const k = conversationKey(r);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k)!.push(r);
  }

  let conversations = Array.from(byKey.entries()).map(([key, msgs]) => {
    const sorted = msgs.slice().sort((a, b) => b.created_at.localeCompare(a.created_at));
    const last = sorted[0];
    const unreadCount = msgs.filter(m => m.direction === "inbound" && m.status === "new").length;
    return {
      key,
      otherParty: otherParty(last),
      mailbox: last.direction === "inbound" ? last.to_email : last.from_email,
      subject: normaliseSubject(last.subject),
      lastMessage: {
        snippet: (last.stripped_reply ?? last.text_body ?? "").slice(0, 160),
        direction: last.direction,
        created_at: last.created_at,
      },
      messageCount: msgs.length,
      unreadCount,
      msgs,
    };
  });

  if (q) {
    conversations = conversations.filter(c =>
      c.msgs.some(m => matchesEmailQuery(m, q)) ||
      c.otherParty.toLowerCase().includes(q.toLowerCase()) ||
      c.subject.toLowerCase().includes(q.toLowerCase())
    );
  }

  conversations.sort((a, b) => b.lastMessage.created_at.localeCompare(a.lastMessage.created_at));
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  // Strip the msgs field from the response — it was only needed for search
  const responseConvos = conversations.map(c => {
    const { msgs, ...rest } = c;
    void msgs;
    return rest;
  });

  return NextResponse.json({ conversations: responseConvos, totalUnread });
}
