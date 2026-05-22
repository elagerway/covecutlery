#!/usr/bin/env node
// Cal.com booking smoke test.
//
// Posts a real booking against the configured Cal.com event type using the
// same payload shape as src/app/api/cal/book/route.ts, then cancels it.
// Run with: npm run smoke:booking
//
// The Cove Blades event type (CAL_EVENT_TYPE_ID) is configured for
// location type "attendeeDefined" — Cal.com will reject any other shape.
// If you change the booking payload in book/route.ts, mirror it here.

import { readFileSync } from "node:fs";
import { join } from "node:path";

const envPath = join(process.cwd(), ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // .env.local missing — fall back to process env
}

const apiKey = process.env.CAL_API_KEY;
const eventTypeId = Number(process.env.CAL_EVENT_TYPE_ID);
const smokeEmail = process.env.SMOKE_TEST_EMAIL || "smoke-test@coveblades.com";

if (!apiKey || !eventTypeId) {
  console.error("Missing CAL_API_KEY or CAL_EVENT_TYPE_ID in env.");
  process.exit(1);
}

const CAL = "https://api.cal.com/v2";
const headers = {
  Authorization: `Bearer ${apiKey}`,
  "cal-api-version": "2024-08-13",
  "Content-Type": "application/json",
};

const start = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
const end = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

const slotsRes = await fetch(
  `${CAL}/slots?eventTypeId=${eventTypeId}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
  { headers: { ...headers, "cal-api-version": "2024-09-04" } }
);
if (!slotsRes.ok) {
  console.error(`Slots fetch failed: ${slotsRes.status} ${await slotsRes.text()}`);
  process.exit(1);
}
const slotsData = await slotsRes.json();
const slotsByDay = slotsData.data ?? {};
const firstDay = Object.keys(slotsByDay)[0];
const firstSlot = slotsByDay[firstDay]?.[0];
if (!firstSlot) {
  console.error("No bookable slots in the next 14 days — cannot run smoke test.");
  process.exit(1);
}
const slotStart = typeof firstSlot === "string" ? firstSlot : firstSlot.start;

const payload = {
  eventTypeId,
  start: slotStart,
  attendee: {
    name: "Cal Smoke Test (auto)",
    email: smokeEmail,
    timeZone: "America/Vancouver",
    language: "en",
    phoneNumber: "+16045550100",
  },
  location: { type: "attendeeDefined", location: "123 Test Lane, North Vancouver, BC" },
  metadata: { notes: "automated smoke test — safe to delete" },
};

const bookRes = await fetch(`${CAL}/bookings`, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});
const bookData = await bookRes.json().catch(() => ({}));

if (!bookRes.ok) {
  console.error(`FAIL: Cal.com rejected booking with status ${bookRes.status}`);
  console.error(JSON.stringify(bookData, null, 2));
  console.error("\nPayload sent:");
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}

const uid = bookData.uid ?? bookData.data?.uid ?? bookData.id;
console.log(`OK: booking accepted (uid=${uid}, slot=${slotStart})`);

const cancelRes = await fetch(`${CAL}/bookings/${uid}/cancel`, {
  method: "POST",
  headers,
  body: JSON.stringify({ cancellationReason: "Smoke test cleanup" }),
});
if (!cancelRes.ok) {
  console.error(`WARNING: smoke booking ${uid} could not be auto-cancelled (status ${cancelRes.status}). Please cancel manually in Cal.com.`);
  process.exit(1);
}

console.log("PASS: smoke booking created and cancelled cleanly.");
