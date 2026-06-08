const MAGPIPE_BASE = "https://api.magpipe.ai/functions/v1";

export const SERVICE_NUMBER = process.env.MAGPIPE_SMS_FROM ?? "+16042108180";

// All Cove Blades service numbers, current and historic. Magpipe stores
// messages for each. The inbox queries every one of these and merges the
// results so conversations span the number-change boundary cleanly.
export const SERVICE_NUMBERS: string[] = [
  SERVICE_NUMBER,
  "+16043731500", // previous number, active until ~mid-April 2026
];

export function isServiceNumber(phone: string | null | undefined): boolean {
  if (!phone) return false;
  return SERVICE_NUMBERS.includes(phone);
}

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

// The live Cove Blades inbound phone agent (+1 604 210 8180).
export const VOICE_AGENT_ID = "49fba67b-50e6-4246-b601-ad4ca42e33e5";

export interface MagpipeVoice {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  is_custom: boolean;
}

/** Low-level call to a Magpipe edge function. Throws on non-2xx so callers can
 *  surface a single error path; the missing-key guard lives in getApiKey(). */
async function magpipeFetch(
  fn: string,
  init: { method: "GET" | "POST"; body?: object; form?: FormData },
): Promise<unknown> {
  const headers: Record<string, string> = { Authorization: `Bearer ${getApiKey()}` };
  let body: BodyInit | undefined;
  if (init.form) {
    body = init.form;
  } else if (init.body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.body);
  }
  const res = await fetch(`${MAGPIPE_BASE}/${fn}`, { method: init.method, headers, body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const d = data as { error?: string; details?: string };
    const msg = [d.error, d.details].filter(Boolean).join(" — ") || `Magpipe ${fn} responded ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export async function listVoices(): Promise<MagpipeVoice[]> {
  const data = (await magpipeFetch("list-voices", { method: "GET" })) as { voices?: MagpipeVoice[] };
  return data.voices ?? [];
}

export async function getAgentVoiceId(agentId: string): Promise<string | null> {
  const data = (await magpipeFetch("get-agent", { method: "POST", body: { agent_id: agentId } })) as {
    agent?: { voice_id?: string };
    voice_id?: string;
  };
  const agent = data.agent ?? data;
  return agent.voice_id ?? null;
}

export async function setAgentVoice(agentId: string, voiceId: string): Promise<void> {
  await magpipeFetch("update-agent", { method: "POST", body: { agent_id: agentId, voice_id: voiceId } });
}

/** Clone a voice from an audio sample (forwarded to ElevenLabs by Magpipe). */
export async function cloneVoice(name: string, audio: File): Promise<MagpipeVoice> {
  const form = new FormData();
  form.append("name", name);
  form.append("audio", audio, audio.name || "sample.webm");
  const data = (await magpipeFetch("clone-voice", { method: "POST", form })) as { voice?: MagpipeVoice };
  return data.voice ?? (data as MagpipeVoice);
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
  // Prefer the explicit non-service side over the direction flag — handles
  // edge cases where direction might be miscoded but the phone numbers are right.
  if (isServiceNumber(msg.from_number)) return msg.to_number;
  if (isServiceNumber(msg.to_number)) return msg.from_number;
  return msg.direction === "inbound" ? msg.from_number : msg.to_number;
}

/** Fetch all messages across every Cove Blades service number, deduped. */
export async function listAllServiceMessages(limit = 500): Promise<MagpipeMessage[]> {
  const results = await Promise.all(
    SERVICE_NUMBERS.map(num => listMessages({ phoneNumber: num, limit }))
  );
  const seen = new Set<string>();
  const merged: MagpipeMessage[] = [];
  for (const r of results) {
    for (const m of r.messages) {
      if (seen.has(m.id)) continue;
      seen.add(m.id);
      merged.push(m);
    }
  }
  merged.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return merged;
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
    // Drop service-to-service self-loops (booking-flow admin notifications).
    if (isServiceNumber(m.from_number) && isServiceNumber(m.to_number)) continue;
    const phone = customerPhone(m);
    if (!phone || isServiceNumber(phone)) continue;
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
