import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { MAILBOXES, isKnownMailbox } from "@/lib/email";

const FROM_NAMES: Record<string, string> = {
  "info@coveblades.com": "Cove Blades",
  "erik@coveblades.com": "Erik · Cove Blades",
  "training@coveblades.com": "Cove Blades Training",
};

const MAX_BODY = 50_000;

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: {
    from?: string;
    to?: string;
    subject?: string;
    text?: string;
    inReplyTo?: string | null;
    references?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const from = (body.from ?? "").trim().toLowerCase();
  const to = (body.to ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const text = (body.text ?? "").trim();

  if (!isKnownMailbox(from)) {
    return NextResponse.json({ error: `From must be one of ${MAILBOXES.join(", ")}` }, { status: 400 });
  }
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: "Invalid recipient email" }, { status: 400 });
  }
  if (!text) return NextResponse.json({ error: "Body is empty" }, { status: 400 });
  if (text.length > MAX_BODY) return NextResponse.json({ error: "Body too long" }, { status: 400 });

  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "POSTMARK_API_KEY not configured" }, { status: 500 });

  const headers: { Name: string; Value: string }[] = [];
  if (body.inReplyTo) headers.push({ Name: "In-Reply-To", Value: `<${body.inReplyTo.replace(/^<|>$/g, "")}>` });
  if (body.references?.length) {
    headers.push({
      Name: "References",
      Value: body.references.map(r => `<${r.replace(/^<|>$/g, "")}>`).join(" "),
    });
  }

  const client = new postmark.ServerClient(apiKey);
  let res: postmark.Models.MessageSendingResponse;
  try {
    res = await client.sendEmail({
      From: `${FROM_NAMES[from] ?? "Cove Blades"} <${from}>`,
      To: to,
      ReplyTo: from,
      Subject: subject || "(no subject)",
      TextBody: text,
      Headers: headers.length ? headers : undefined,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/admin/emails/send] postmark error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const supabase = getServiceClient();
  await supabase.from("emails").insert({
    message_id: res.MessageID ? `<${res.MessageID}@postmark.local>` : null,
    in_reply_to: body.inReplyTo ?? null,
    email_references: body.references ?? null,
    from_email: from,
    from_name: FROM_NAMES[from] ?? "Cove Blades",
    to_email: to,
    subject: subject || null,
    text_body: text,
    direction: "outbound",
    status: "responded",
    postmark_message_id: res.MessageID ?? null,
  });

  return NextResponse.json({ ok: true, postmarkMessageId: res.MessageID });
}
