// Cove Blades email helpers (Postmark Inbound + Outbound).
//
// Inbox addresses Postmark Inbound is configured to forward to us. Add a new
// one here and re-deploy to recognise it; the rest of the pipeline (storage,
// admin UI) will pick it up automatically.

export const MAILBOXES = ["info@coveblades.com", "erik@coveblades.com", "training@coveblades.com"] as const;
export type Mailbox = (typeof MAILBOXES)[number];

export function isKnownMailbox(addr: string | null | undefined): addr is Mailbox {
  if (!addr) return false;
  return (MAILBOXES as readonly string[]).includes(addr.toLowerCase());
}

export function normaliseAddress(addr: string | null | undefined): string {
  return (addr ?? "").trim().toLowerCase();
}

/** Strip Re:/Fwd:/Aw: prefixes so we can thread by subject when message-id chains are missing. */
export function normaliseSubject(subject: string | null | undefined): string {
  if (!subject) return "(no subject)";
  return subject.replace(/^(\s*(re|fw|fwd|aw)\s*:\s*)+/i, "").trim() || "(no subject)";
}

// ---- training@ auto-reply ----
// Edit freely — these strings are the canonical template.

export const TRAINING_AUTO_REPLY_SUBJECT_PREFIX = "Thanks for reaching out — Cove Blades training";

export function buildTrainingAutoReply(args: { firstName: string | null; originalSubject: string | null }): {
  subject: string;
  text: string;
  html: string;
} {
  const first = (args.firstName ?? "").trim().split(/\s+/)[0] || "there";
  const subj = args.originalSubject ? `Re: ${args.originalSubject}` : TRAINING_AUTO_REPLY_SUBJECT_PREFIX;

  const text = `Hi ${first},

Thanks for reaching out about training. Here's the quick rundown so you have it in front of you while we follow up personally:

• "Train to Be Sharp" course (online + in-person modules) — full curriculum and pricing at https://coveblades.com/train-to-be-sharp
• Custom on-site training for restaurant kitchens — we tailor a session for your line and knife inventory
• Group / event workshops — bachelor parties, team-builds, market days, that kind of thing

Erik will personally follow up within one business day to answer specifics and figure out what level fits.

If it's time-sensitive, text or call 604-210-8180 anytime.

— The Cove Blades team
https://coveblades.com`;

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#0D1117;padding:20px 28px;">
      <p style="margin:0;color:#D4A017;font-size:18px;font-weight:700;letter-spacing:.5px;">COVE BLADES · TRAINING</p>
    </div>
    <div style="padding:28px;color:#111;font-size:15px;line-height:1.55;">
      <p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
      <p style="margin:0 0 16px;">Thanks for reaching out about training. Here's the quick rundown while we follow up personally:</p>
      <ul style="margin:0 0 16px;padding-left:20px;color:#333;">
        <li style="margin-bottom:6px;"><a href="https://coveblades.com/train-to-be-sharp" style="color:#D4A017;">Train to Be Sharp</a> — full curriculum and pricing on the page</li>
        <li style="margin-bottom:6px;">Custom on-site training for restaurant kitchens — tailored to your line</li>
        <li style="margin-bottom:6px;">Group / event workshops — bachelor parties, team-builds, markets</li>
      </ul>
      <p style="margin:0 0 16px;">Erik will personally follow up within one business day to answer specifics and figure out what level fits.</p>
      <p style="margin:0 0 16px;">If it's time-sensitive, text or call <strong>+1 (604) 210-8180</strong> anytime.</p>
      <p style="margin:24px 0 0;color:#666;font-size:13px;">— The Cove Blades team<br><a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a></p>
    </div>
  </div>
</body></html>`;

  return { subject: subj, text, html };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
