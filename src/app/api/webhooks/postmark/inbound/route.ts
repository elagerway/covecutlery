import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { getServiceClient } from "@/lib/admin";
import { isKnownMailbox, normaliseAddress, buildTrainingAutoReply } from "@/lib/email";

// Postmark Inbound webhook. Postmark POSTs a parsed JSON payload here when
// any mail forwarded to the configured inbound address arrives. We dedupe
// by MessageID, store the email, and if the message was originally addressed
// to training@coveblades.com we fire an auto-reply via Postmark Outbound.

interface PostmarkAttachment {
  Name: string;
  Content: string;
  ContentType: string;
  ContentLength: number;
  ContentID?: string;
}

interface PostmarkInboundPayload {
  MessageID?: string;
  From?: string;
  FromName?: string;
  To?: string;
  ToFull?: { Email: string; Name: string }[];
  Cc?: string;
  CcFull?: { Email: string; Name: string }[];
  OriginalRecipient?: string;
  Subject?: string;
  TextBody?: string;
  HtmlBody?: string;
  StrippedTextReply?: string;
  Headers?: { Name: string; Value: string }[];
  Attachments?: PostmarkAttachment[];
  Date?: string;
}

function headerValue(headers: PostmarkInboundPayload["Headers"], name: string): string | null {
  if (!headers) return null;
  const h = headers.find(x => x.Name.toLowerCase() === name.toLowerCase());
  return h?.Value ?? null;
}

function parseReferences(value: string | null): string[] {
  if (!value) return [];
  return value.split(/\s+/).map(s => s.replace(/^<|>$/g, "")).filter(Boolean);
}

function determineMailbox(body: PostmarkInboundPayload): string {
  // OriginalRecipient is set when the message went through a forwarding rule
  // (which is our SiteGround → Postmark setup). Fall back to To if missing.
  const candidates = [
    normaliseAddress(body.OriginalRecipient),
    ...(body.ToFull ?? []).map(t => normaliseAddress(t.Email)),
    normaliseAddress(body.To),
  ].filter(Boolean);

  for (const addr of candidates) {
    if (isKnownMailbox(addr)) return addr;
  }
  // Unknown — store under whatever we got so the admin can still see it.
  return candidates[0] ?? "unknown@coveblades.com";
}

export async function POST(req: NextRequest) {
  let body: PostmarkInboundPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const messageId = (body.MessageID ?? "").trim() || null;
  const fromEmail = normaliseAddress(body.From);
  if (!fromEmail) {
    return NextResponse.json({ ok: false, error: "Missing From" }, { status: 400 });
  }

  const toEmail = determineMailbox(body);
  const inReplyTo = headerValue(body.Headers, "In-Reply-To")?.replace(/^<|>$/g, "") ?? null;
  const references = parseReferences(headerValue(body.Headers, "References"));
  const ccEmails = (body.CcFull ?? []).map(c => normaliseAddress(c.Email)).filter(Boolean);

  const supabase = getServiceClient();

  // Dedupe by MessageID — Postmark occasionally retries on transient errors.
  if (messageId) {
    const { data: existing } = await supabase
      .from("emails")
      .select("id")
      .eq("message_id", messageId)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ ok: true, dedup: true });
    }
  }

  const { data: stored, error } = await supabase
    .from("emails")
    .insert({
      message_id: messageId,
      in_reply_to: inReplyTo,
      email_references: references,
      from_email: fromEmail,
      from_name: body.FromName?.trim() || null,
      to_email: toEmail,
      cc_emails: ccEmails.length ? ccEmails : null,
      subject: body.Subject?.trim() || null,
      text_body: body.TextBody ?? null,
      html_body: body.HtmlBody ?? null,
      stripped_reply: body.StrippedTextReply ?? null,
      direction: "inbound",
      status: "new",
      attachments: (body.Attachments ?? []).map(a => ({
        name: a.Name,
        content_type: a.ContentType,
        size: a.ContentLength,
      })),
      raw_payload: body,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[postmark inbound] insert failed:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  // training@ auto-reply — fire-and-forget, never block the webhook response.
  if (toEmail === "training@coveblades.com") {
    fireTrainingAutoReply({
      to: fromEmail,
      firstName: body.FromName ?? null,
      originalSubject: body.Subject ?? null,
      messageId,
      references: [messageId, ...references].filter((v): v is string => !!v),
      storedId: stored?.id,
    }).catch(e => console.error("[training auto-reply] failed:", e));
  }

  return NextResponse.json({ ok: true, id: stored?.id });
}

async function fireTrainingAutoReply(args: {
  to: string;
  firstName: string | null;
  originalSubject: string | null;
  messageId: string | null;
  references: string[];
  storedId: number | undefined;
}) {
  const apiKey = process.env.POSTMARK_API_KEY;
  if (!apiKey) {
    console.error("[training auto-reply] POSTMARK_API_KEY not configured");
    return;
  }

  const tmpl = buildTrainingAutoReply({
    firstName: args.firstName,
    originalSubject: args.originalSubject,
  });

  const client = new postmark.ServerClient(apiKey);
  const res = await client.sendEmail({
    From: "Cove Blades Training <training@coveblades.com>",
    To: args.to,
    ReplyTo: "training@coveblades.com",
    Subject: tmpl.subject,
    TextBody: tmpl.text,
    HtmlBody: tmpl.html,
    Headers: args.messageId
      ? [
          { Name: "In-Reply-To", Value: `<${args.messageId}>` },
          { Name: "References", Value: args.references.map(r => `<${r}>`).join(" ") },
        ]
      : undefined,
  });

  // Record the auto-reply as an outbound email so it appears in the thread.
  const supabase = getServiceClient();
  await supabase.from("emails").insert({
    message_id: res.MessageID ? `<${res.MessageID}@postmark.local>` : null,
    in_reply_to: args.messageId,
    email_references: args.references,
    from_email: "training@coveblades.com",
    from_name: "Cove Blades Training",
    to_email: args.to,
    subject: tmpl.subject,
    text_body: tmpl.text,
    html_body: tmpl.html,
    direction: "outbound",
    status: "auto_replied",
    postmark_message_id: res.MessageID ?? null,
  });

  if (args.storedId) {
    await supabase.from("emails").update({ status: "auto_replied" }).eq("id", args.storedId);
  }
}
