import * as postmark from "postmark";

// Small server-only transactional email helper (Postmark). Best-effort: never
// throws — returns a warning if the key is missing or the send fails, so callers
// can proceed without failing the request.

const FROM_EMAIL = "info@coveblades.com";
const FROM_NAME = "Cove Blades";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; warning?: string }> {
  if (!process.env.POSTMARK_API_KEY) {
    console.warn("[notify] POSTMARK_API_KEY not set — skipping:", opts.subject);
    return { ok: false, warning: "POSTMARK_API_KEY not configured" };
  }
  try {
    const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
    await client.sendEmail({
      From: `${FROM_NAME} <${FROM_EMAIL}>`,
      To: opts.to,
      Subject: opts.subject,
      TextBody: opts.text,
      ...(opts.html ? { HtmlBody: opts.html } : {}),
      ...(opts.replyTo ? { ReplyTo: opts.replyTo } : {}),
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[notify] send failed:", msg);
    return { ok: false, warning: msg };
  }
}
