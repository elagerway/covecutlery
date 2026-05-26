const MAGPIPE_BASE = "https://api.magpipe.ai/functions/v1";

export const SERVICE_NUMBER = process.env.MAGPIPE_SMS_FROM ?? "+16042108180";

export interface MagpipeMessage {
  id: string;
  thread_id: string | null;
  from_number: string;
  to_number: string;
  body: string;
  direction: "inbound" | "outbound";
  status: string;
  is_ai_generated: boolean;
  created_at: string;
}

interface ListMessagesResponse {
  messages: MagpipeMessage[];
  total: number;
  has_more: boolean;
}

interface ListMessagesOptions {
  limit?: number;
  offset?: number;
  phoneNumber?: string;
  fromDate?: string;
}

function getApiKey(): string {
  const key = process.env.MAGPIPE_API_KEY;
  if (!key) throw new Error("MAGPIPE_API_KEY not configured");
  return key;
}

export async function listMessages(opts: ListMessagesOptions = {}): Promise<ListMessagesResponse> {
  const res = await fetch(`${MAGPIPE_BASE}/list-messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      limit: opts.limit ?? 200,
      offset: opts.offset ?? 0,
      phone_number: opts.phoneNumber,
      from_date: opts.fromDate,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Magpipe list-messages ${res.status}: ${text}`);
  }
  return res.json();
}

export async function sendSms(args: { to: string; message: string }): Promise<void> {
  const res = await fetch(`${MAGPIPE_BASE}/send-user-sms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      serviceNumber: SERVICE_NUMBER,
      contactPhone: args.to,
      message: args.message,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Magpipe send-user-sms ${res.status}: ${text}`);
  }
}

/** Identify the customer phone in a message (the non-service-number side). */
export function customerPhone(msg: MagpipeMessage): string {
  return msg.direction === "inbound" ? msg.from_number : msg.to_number;
}

export interface Conversation {
  phone: string;
  lastMessage: MagpipeMessage;
  messageCount: number;
  hasInbound: boolean;
}

export function groupIntoConversations(messages: MagpipeMessage[]): Conversation[] {
  const byPhone = new Map<string, MagpipeMessage[]>();
  for (const m of messages) {
    // Drop self-loops (service → service). These are the booking flow's admin
    // notification SMS we send to our own number — they're not real conversations.
    if (m.from_number === SERVICE_NUMBER && m.to_number === SERVICE_NUMBER) continue;
    const phone = customerPhone(m);
    if (!phone || phone === SERVICE_NUMBER) continue;
    if (!byPhone.has(phone)) byPhone.set(phone, []);
    byPhone.get(phone)!.push(m);
  }
  const convos: Conversation[] = [];
  for (const [phone, msgs] of byPhone) {
    const hasInbound = msgs.some(m => m.direction === "inbound");
    // Only show conversations where the customer has actually texted in.
    // One-way outbound blasts (e.g. booking confirmations that never got a reply)
    // aren't "messages sent to 604-210-8180" — skip them.
    if (!hasInbound) continue;
    msgs.sort((a, b) => b.created_at.localeCompare(a.created_at));
    convos.push({
      phone,
      lastMessage: msgs[0],
      messageCount: msgs.length,
      hasInbound,
    });
  }
  convos.sort((a, b) => b.lastMessage.created_at.localeCompare(a.lastMessage.created_at));
  return convos;
}
