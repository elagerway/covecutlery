#!/usr/bin/env node
// Backfill customers from SMS history.
//
// Pulls every inbound SMS to +1-604-210-8180 from Magpipe, identifies unique
// customer phone numbers, and creates a customers row for each missing one.
// Name is extracted from the message bodies if possible (see src/lib/sms-name.ts),
// else "Unknown". Idempotent — re-running skips phones already in customers.
//
// Same logic runs automatically every time /api/admin/messages is hit, so
// this script is only needed if you want to seed customers without anyone
// opening the inbox.
//
// Usage:
//   node scripts/backfill-sms-customers.mjs
//   node scripts/backfill-sms-customers.mjs --dry-run

import { readFileSync } from "node:fs";
import { join } from "node:path";

const envPath = join(process.cwd(), ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // optional
}

const SERVICE_NUMBER = "+16042108180";
const dryRun = process.argv.includes("--dry-run");

const magKey = process.env.MAGPIPE_API_KEY;
const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!magKey || !supaUrl || !supaKey) {
  console.error("Missing MAGPIPE_API_KEY / NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// --- name extraction (mirrors src/lib/sms-name.ts) ---
const FALSE_POSITIVES = new Set([
  "Yes", "No", "Ok", "Okay", "Hi", "Hey", "Hello", "Thanks", "Thank", "Sure",
  "Yep", "Nope", "Maybe", "Cool", "Great", "Good", "Bad", "Sorry", "Yo",
  "Sup", "Morning", "Evening", "Afternoon", "Night",
]);
const PATTERNS = [
  /(?:hi|hello|hey)\W+(?:i['']?m|this is|it['']?s)\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)/i,
  /(?:^|[\s.,!?])(?:i['']?m|this is|it['']?s)\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)/i,
  /(?:^|\.\s)([A-Z][a-z]{2,15})\s+here\b/,
  /\bfrom\s+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)\b/,
  /(?:thanks|cheers|regards|sincerely|—|--)[\s,]+([A-Z][a-z]{2,15}(?:\s+[A-Z][a-z]{2,20})?)[.!\s]*$/im,
];
function extractName(body) {
  if (!body) return null;
  const cleaned = body.replace(/https?:\/\/\S+/g, " ");
  for (const re of PATTERNS) {
    const m = cleaned.match(re);
    if (!m) continue;
    const candidate = m[1].trim();
    const first = candidate.split(/\s+/)[0];
    if (FALSE_POSITIVES.has(first)) continue;
    return candidate;
  }
  return null;
}

// --- fetch messages from Magpipe ---
console.log(`Pulling Magpipe SMS for ${SERVICE_NUMBER}…`);
const res = await fetch("https://api.magpipe.ai/functions/v1/list-messages", {
  method: "POST",
  headers: { Authorization: `Bearer ${magKey}`, "Content-Type": "application/json" },
  body: JSON.stringify({ limit: 1000, phone_number: SERVICE_NUMBER }),
});
if (!res.ok) {
  console.error(`Magpipe ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const { messages } = await res.json();
console.log(`  ${messages.length} messages`);

const inbound = messages.filter(m => m.direction === "inbound" && m.to_number === SERVICE_NUMBER && m.from_number !== SERVICE_NUMBER);
console.log(`  ${inbound.length} inbound from customers`);

const byPhone = new Map();
for (const m of inbound) {
  if (!byPhone.has(m.from_number)) byPhone.set(m.from_number, []);
  byPhone.get(m.from_number).push(m);
}
console.log(`  ${byPhone.size} unique customer phones`);

// --- existing customers ---
const existingRes = await fetch(
  `${supaUrl}/rest/v1/customers?select=id,name,phone&phone=in.(${[...byPhone.keys()].map(encodeURIComponent).join(",")})`,
  { headers: { apikey: supaKey, Authorization: `Bearer ${supaKey}` } }
);
const existing = await existingRes.json();
const existingPhones = new Set(existing.map(c => c.phone));
console.log(`  ${existingPhones.size} already in customers table`);

// --- build new rows ---
const newRows = [];
for (const [phone, msgs] of byPhone) {
  if (existingPhones.has(phone)) continue;
  msgs.sort((a, b) => a.created_at.localeCompare(b.created_at)); // earliest first
  const name = msgs.map(m => extractName(m.body)).find(Boolean) ?? "Unknown";
  newRows.push({ name, phone, source: "sms" });
}

console.log(`\n${newRows.length} new customers to create:`);
for (const r of newRows) {
  console.log(`  ${r.name.padEnd(25)} ${r.phone}`);
}

if (dryRun) {
  console.log("\n(dry run — no DB writes)");
  process.exit(0);
}
if (newRows.length === 0) {
  console.log("\nNothing to insert.");
  process.exit(0);
}

const insertRes = await fetch(`${supaUrl}/rest/v1/customers`, {
  method: "POST",
  headers: {
    apikey: supaKey,
    Authorization: `Bearer ${supaKey}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  },
  body: JSON.stringify(newRows),
});
if (!insertRes.ok) {
  console.error(`Insert failed: ${await insertRes.text()}`);
  process.exit(1);
}
console.log(`\n✓ Created ${newRows.length} customer rows.`);
