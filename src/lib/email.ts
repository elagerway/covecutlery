// Cove Blades email helpers (Postmark Inbound + Outbound).
//
// Inbox addresses Postmark Inbound is configured to forward to us. Add a new
// one here and re-deploy to recognise it; the rest of the pipeline (storage,
// admin UI) will pick it up automatically.

export const MAILBOXES = ["info@coveblades.com", "training@coveblades.com"] as const;
export type Mailbox = (typeof MAILBOXES)[number];

export function isKnownMailbox(addr: string | null | undefined): addr is Mailbox {
  if (!addr) return false;
  return (MAILBOXES as readonly string[]).includes(addr.toLowerCase());
}

// Inbound mail not addressed to one of the MAILBOXES, or whose body matches
// one of these patterns, is dropped at the webhook. Add patterns as new
// spam waves show up — keep them strong enough to avoid false positives on
// genuine customer mail.
const SPAM_PATTERNS: RegExp[] = [
  // The SEO/web-design pitch opener
  /your\s+website\s+(www\.)?coveblades\.com/i,
  /noticed\s+(that\s+)?your\s+website/i,
  /found\s+(your\s+website|coveblades\.com)/i,
  // SEO pitch language
  /(rank|ranking)\s+(higher|on\s+the\s+first\s+page|on\s+page\s+1|#\s*1)/i,
  /(boost|improve|increase)\s+(your\s+)?(traffic|seo|google\s+ranking|search\s+ranking|website\s+ranking)/i,
  // Generic phishing follow-up
  /\bi\s+am\s+still\s+waiting\s+for\s+your\s+reply\b/i,
];

export function looksLikeSpam(parts: { subject?: string | null; text?: string | null; html?: string | null }): boolean {
  const blob = [parts.subject, parts.text, parts.html]
    .filter((v): v is string => typeof v === "string" && v.length > 0)
    .join("\n")
    .slice(0, 50_000);
  if (!blob) return false;
  return SPAM_PATTERNS.some((re) => re.test(blob));
}

export function normaliseAddress(addr: string | null | undefined): string {
  return (addr ?? "").trim().toLowerCase();
}

/** Strip Re:/Fwd:/Aw: prefixes so we can thread by subject when message-id chains are missing. */
export function normaliseSubject(subject: string | null | undefined): string {
  if (!subject) return "(no subject)";
  return subject.replace(/^(\s*(re|fw|fwd|aw)\s*:\s*)+/i, "").trim() || "(no subject)";
}

// ---- Auto-reply templates ----
// Edit freely — these strings are the canonical templates.

export interface AutoReplyTemplate {
  subject: string;
  text: string;
  html: string;
  fromAddress: Mailbox;
  fromName: string;
}

interface AutoReplyArgs {
  firstName: string | null;
  originalSubject: string | null;
}

function subjectFor(original: string | null, fallback: string): string {
  return original ? `Re: ${original}` : fallback;
}

function htmlShell(args: { headerLabel: string; bodyHtml: string }): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
    <div style="background:#0D1117;padding:20px 28px;">
      <p style="margin:0;color:#D4A017;font-size:18px;font-weight:700;letter-spacing:.5px;">${args.headerLabel}</p>
    </div>
    <div style="padding:28px;color:#111;font-size:15px;line-height:1.55;">
      ${args.bodyHtml}
    </div>
  </div>
</body></html>`;
}

export function buildTrainingAutoReply(args: AutoReplyArgs): AutoReplyTemplate {
  const first = (args.firstName ?? "").trim().split(/\s+/)[0] || "there";

  const text = `Hi ${first},

Thanks for reaching out about training. Here's the quick rundown so you have it in front of you while we follow up personally:

• "Train to Be Sharp" course (online + in-person modules) — full curriculum and pricing at https://coveblades.com/train-to-be-sharp
• Custom on-site training for restaurant kitchens — we tailor a session for your line and knife inventory
• Group / event workshops — bachelor parties, team-builds, market days, that kind of thing

Erik will personally follow up within one business day to answer specifics and figure out what level fits.

If it's time-sensitive, text or call 604-210-8180 anytime.

— The Cove Blades team
https://coveblades.com`;

  const bodyHtml = `
    <p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
    <p style="margin:0 0 16px;">Thanks for reaching out about training. Here's the quick rundown while we follow up personally:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:#333;">
      <li style="margin-bottom:6px;"><a href="https://coveblades.com/train-to-be-sharp" style="color:#D4A017;">Train to Be Sharp</a> — full curriculum and pricing on the page</li>
      <li style="margin-bottom:6px;">Custom on-site training for restaurant kitchens — tailored to your line</li>
      <li style="margin-bottom:6px;">Group / event workshops — bachelor parties, team-builds, markets</li>
    </ul>
    <p style="margin:0 0 16px;">Erik will personally follow up within one business day to answer specifics and figure out what level fits.</p>
    <p style="margin:0 0 16px;">If it's time-sensitive, text or call <strong>+1 (604) 210-8180</strong> anytime.</p>
    <p style="margin:24px 0 0;color:#666;font-size:13px;">— The Cove Blades team<br><a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a></p>`;

  return {
    subject: subjectFor(args.originalSubject, "Thanks for reaching out — Cove Blades training"),
    text,
    html: htmlShell({ headerLabel: "COVE BLADES · TRAINING", bodyHtml }),
    fromAddress: "training@coveblades.com",
    fromName: "Cove Blades Training",
  };
}

export function buildInfoAutoReply(args: AutoReplyArgs): AutoReplyTemplate {
  const first = (args.firstName ?? "").trim().split(/\s+/)[0] || "there";

  const text = `Hi ${first},

Thanks for getting in touch. Erik or someone on the team will reply within one business day.

In the meantime, here are quick links that answer most questions:

• Book a mobile visit: https://coveblades.com (5-knife minimum, 30-day edge guarantee)
• Pricing: $12 standard, $18 Japanese — full breakdown at https://coveblades.com/pricing
• 24/7 drop-off box (no minimum): https://coveblades.com/drop-off
• Service area + drive times: https://coveblades.com/service-area

If it's time-sensitive, the fastest path is to text or call 604-210-8180.

— Cove Blades
https://coveblades.com`;

  const bodyHtml = `
    <p style="margin:0 0 16px;">Hi ${escapeHtml(first)},</p>
    <p style="margin:0 0 16px;">Thanks for getting in touch. Erik or someone on the team will reply within one business day.</p>
    <p style="margin:0 0 12px;">In the meantime, here are quick links that answer most questions:</p>
    <ul style="margin:0 0 16px;padding-left:20px;color:#333;">
      <li style="margin-bottom:6px;"><a href="https://coveblades.com" style="color:#D4A017;">Book a mobile visit</a> — 5-knife minimum, 30-day edge guarantee</li>
      <li style="margin-bottom:6px;"><a href="https://coveblades.com/pricing" style="color:#D4A017;">Pricing</a> — $12 standard, $18 Japanese</li>
      <li style="margin-bottom:6px;"><a href="https://coveblades.com/drop-off" style="color:#D4A017;">24/7 drop-off box</a> — no minimum, 24–48 hr turnaround</li>
      <li style="margin-bottom:6px;"><a href="https://coveblades.com/service-area" style="color:#D4A017;">Service area + drive times</a></li>
    </ul>
    <p style="margin:0 0 16px;">If it's time-sensitive, text or call <strong>+1 (604) 210-8180</strong>.</p>
    <p style="margin:24px 0 0;color:#666;font-size:13px;">— Cove Blades<br><a href="https://coveblades.com" style="color:#D4A017;">coveblades.com</a></p>`;

  return {
    subject: subjectFor(args.originalSubject, "Thanks for reaching out — Cove Blades"),
    text,
    html: htmlShell({ headerLabel: "COVE BLADES", bodyHtml }),
    fromAddress: "info@coveblades.com",
    fromName: "Cove Blades",
  };
}

/** Returns the auto-reply template for a given inbox, or null if that inbox has no auto-reply. */
export function autoReplyFor(mailbox: string, args: AutoReplyArgs): AutoReplyTemplate | null {
  switch (mailbox) {
    case "training@coveblades.com": return buildTrainingAutoReply(args);
    case "info@coveblades.com": return buildInfoAutoReply(args);
    default: return null;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
