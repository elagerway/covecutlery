#!/usr/bin/env node
// SignalWire historical SMS backfill.
//
// One-shot import of all SMS messages involving the Cove Blades service number
// from the last N days (default 90) into the `historical_sms_messages` table.
// Idempotent — uses SignalWire SID as a unique key, re-running will skip
// already-imported messages.
//
// Required env (set in .env.local). Accepts either of two naming conventions:
//   SIGNALWIRE_PROJECT_ID  | SIGNALWIRE_PROJECT   — UUID-style project ID from SignalWire dashboard
//   SIGNALWIRE_API_TOKEN   | SIGNALWIRE_API_KEY   — API token with Messages:Read scope
//   SIGNALWIRE_SPACE_URL   | SIGNALWIRE_SPACE     — e.g. "magpipe.signalwire.com"
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Usage:
//   node scripts/backfill-signalwire.mjs           # last 90 days
//   node scripts/backfill-signalwire.mjs --days 30 # last 30 days
//   node scripts/backfill-signalwire.mjs --dry-run # preview without inserting

import { readFileSync } from "node:fs";
import { join } from "node:path";

// --- env loading ---
const envPath = join(process.cwd(), ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // optional
}

const SERVICE_NUMBER = process.env.MAGPIPE_SMS_FROM || "+16042108180";

const projectId = process.env.SIGNALWIRE_PROJECT_ID || process.env.SIGNALWIRE_PROJECT;
const apiToken = process.env.SIGNALWIRE_API_TOKEN || process.env.SIGNALWIRE_API_KEY;
const spaceUrl = process.env.SIGNALWIRE_SPACE_URL || process.env.SIGNALWIRE_SPACE;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const missing = [];
if (!projectId) missing.push("SIGNALWIRE_PROJECT_ID");
if (!apiToken) missing.push("SIGNALWIRE_API_TOKEN");
if (!spaceUrl) missing.push("SIGNALWIRE_SPACE_URL");
if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
if (missing.length) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  console.error("See script header for setup instructions.");
  process.exit(1);
}

const args = process.argv.slice(2);
const daysIdx = args.indexOf("--days");
const days = daysIdx >= 0 ? parseInt(args[daysIdx + 1], 10) : 90;
const dryRun = args.includes("--dry-run");

const since = new Date(Date.now() - days * 24 * 3600 * 1000);
const sinceISO = since.toISOString();
console.log(`Backfilling SMS since ${sinceISO} (last ${days} days)`);
console.log(`Service number: ${SERVICE_NUMBER}`);
if (dryRun) console.log("(DRY RUN — no DB writes)");

// SignalWire's REST API is Twilio-compatible. Messages endpoint:
//   GET https://<space>/api/laml/2010-04-01/Accounts/<project>/Messages.json
const auth = Buffer.from(`${projectId}:${apiToken}`).toString("base64");
const baseUrl = `https://${spaceUrl}/api/laml/2010-04-01/Accounts/${projectId}/Messages.json`;

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`SignalWire ${res.status}: ${await res.text()}`);
  return res.json();
}

// Pull all pages for "From=SERVICE_NUMBER" and "To=SERVICE_NUMBER" separately.
// SignalWire's Messages endpoint requires explicit From/To filters; can't OR them in one call.
async function pullAllForFilter(filterParam) {
  const params = new URLSearchParams({
    PageSize: "1000",
    "DateSent>": sinceISO,
    ...filterParam,
  });
  let url = `${baseUrl}?${params.toString()}`;
  const out = [];
  while (url) {
    const page = await fetchPage(url);
    out.push(...(page.messages ?? []));
    url = page.next_page_uri ? `https://${spaceUrl}${page.next_page_uri}` : null;
  }
  return out;
}

console.log("Fetching outbound (From=service)…");
const outbound = await pullAllForFilter({ From: SERVICE_NUMBER });
console.log(`  ${outbound.length} messages`);

console.log("Fetching inbound (To=service)…");
const inbound = await pullAllForFilter({ To: SERVICE_NUMBER });
console.log(`  ${inbound.length} messages`);

// Dedup by SID (a message could in theory appear in both queries if From===To)
const bySid = new Map();
for (const m of [...outbound, ...inbound]) {
  if (!bySid.has(m.sid)) bySid.set(m.sid, m);
}
const all = Array.from(bySid.values());
console.log(`Total unique: ${all.length}`);

// Filter to ones we don't already have
async function fetchExistingIds() {
  const url = `${supabaseUrl}/rest/v1/historical_sms_messages?select=external_id&limit=10000`;
  const res = await fetch(url, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return new Set(rows.map((r) => r.external_id));
}

const existing = await fetchExistingIds();
const fresh = all.filter((m) => !existing.has(m.sid));
console.log(`Already imported: ${all.length - fresh.length}, new: ${fresh.length}`);

if (fresh.length === 0) {
  console.log("Nothing to import. Done.");
  process.exit(0);
}

if (dryRun) {
  console.log("Sample of new rows that would be imported:");
  for (const m of fresh.slice(0, 5)) {
    console.log(`  ${m.date_sent}  ${m.direction.padEnd(13)}  ${m.from} → ${m.to}  ${(m.body || "").slice(0, 60)}`);
  }
  process.exit(0);
}

// Insert in batches of 500
function toRow(m) {
  // SignalWire direction values: "inbound", "outbound-api", "outbound-call", "outbound-reply"
  const direction = m.direction === "inbound" ? "inbound" : "outbound";
  return {
    external_id: m.sid,
    from_number: m.from,
    to_number: m.to,
    body: m.body ?? "",
    direction,
    status: m.status ?? null,
    date_sent: m.date_sent,
  };
}

const BATCH = 500;
let imported = 0;
for (let i = 0; i < fresh.length; i += BATCH) {
  const batch = fresh.slice(i, i + BATCH).map(toRow);
  const res = await fetch(`${supabaseUrl}/rest/v1/historical_sms_messages`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) {
    console.error(`Insert failed at batch ${i}: ${await res.text()}`);
    process.exit(1);
  }
  imported += batch.length;
  console.log(`  inserted ${imported}/${fresh.length}`);
}

// Mark all historical messages as read by default — the admin has presumably
// already dealt with them outside this app. Without this, importing 90 days
// of messages would dump hundreds of "unread" badges into the inbox.
console.log("Marking historical messages as read…");
const reads = fresh.map((m) => ({ message_id: m.sid }));
for (let i = 0; i < reads.length; i += BATCH) {
  const batch = reads.slice(i, i + BATCH);
  await fetch(`${supabaseUrl}/rest/v1/sms_message_reads?on_conflict=message_id`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates",
    },
    body: JSON.stringify(batch),
  });
}

console.log(`✓ Imported ${imported} historical SMS messages.`);
