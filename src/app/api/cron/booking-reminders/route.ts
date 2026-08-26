import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";
import { appointmentToDate, TIMEZONE } from "@/lib/cal";
import { sendSms } from "@/lib/magpipe";

/**
 * Vercel cron — runs every 15 minutes. Sends the 24-hour and 1-hour appointment
 * reminder texts.
 *
 * These used to be Cal.com workflows ("1 day sms reminder" / "1 hr reminder"),
 * but a workflow with `phoneRequired` injects a required `smsReminderNumber`
 * booking field, and the v2 bookings API on cal-api-version 2024-08-13 offers no
 * way to answer it — `bookingFieldsResponses` silently drops system fields, and
 * `attendee.phoneNumber` doesn't satisfy it. That 400'd every widget booking with
 * `responses - {smsReminderNumber}error_required_field`. The workflows are now
 * detached from the event type and reminders run from here off `customer_phone`.
 *
 * Trigger: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`. Any
 * unauthenticated caller gets 401.
 *
 * Manual trigger (for testing):
 *   curl -H "Authorization: Bearer ${CRON_SECRET}" \
 *        "https://coveblades.com/api/cron/booking-reminders"
 *
 * Add `?dryRun=1` to see what would be sent without sending or marking anything.
 */

export const dynamic = "force-dynamic";

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const SUPPORT_PHONE = "+1 (604) 210-8180";

/** Send windows, checked against how far out the appointment is. Each is wider
 *  than the 15-minute cron interval so a skipped run doesn't drop a reminder,
 *  and the `sent_at` column makes a second match a no-op. The 24h window stops
 *  at 22h so a booking made same-day never gets a "reminder" on the heels of its
 *  confirmation text — that's the Cal.com behaviour we're replacing. */
const KINDS = [
  { column: "reminder_24h_sent_at", minMs: 22 * HOUR, maxMs: 25 * HOUR },
  { column: "reminder_1h_sent_at", minMs: 45 * MINUTE, maxMs: 75 * MINUTE },
] as const;

type Kind = (typeof KINDS)[number];

interface BookingRow {
  id: string;
  cal_booking_uid: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  address: string | null;
  reminder_24h_sent_at: string | null;
  reminder_1h_sent_at: string | null;
}

/** Vancouver calendar date, offset by whole days. Used to bound the query. */
function localDate(offsetDays: number): string {
  const d = new Date(Date.now() + offsetDays * 24 * HOUR);
  return d.toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

function firstName(name: string | null): string {
  return name?.trim().split(/\s+/)[0] || "there";
}

/** Weekday + date for the 24h text, so the copy stays correct anywhere in the
 *  window rather than asserting "tomorrow". */
function friendlyDate(at: Date): string {
  return at.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Cal.com's attendee-facing booking page — "Need to make a change?" with
 *  Reschedule and Cancel. Both are enabled on the event type, so this is the
 *  self-serve path and needs no page of our own. Note the event type sets
 *  minimumBookingNotice: 120, so rescheduling is already closed off by the time
 *  the 1-hour reminder goes out — that copy only promises cancelling. */
function manageUrl(b: BookingRow): string | null {
  return b.cal_booking_uid ? `https://cal.com/booking/${b.cal_booking_uid}` : null;
}

function messageFor(kind: Kind, b: BookingRow, at: Date): string {
  const who = firstName(b.customer_name);
  const time = b.appointment_time ?? "";
  const where = b.address ? ` at ${b.address}` : "";
  const url = manageUrl(b);

  if (kind.column === "reminder_1h_sent_at") {
    const change = url ? ` Need to cancel? ${url}` : "";
    return `Hi ${who}, your Cove Blades mobile sharpening is in about an hour — ${time}${where}.${change} Questions? Call us at ${SUPPORT_PHONE}.`;
  }
  const change = url ? ` Need to reschedule or cancel? ${url}` : "";
  return `Hi ${who}, a reminder that your Cove Blades mobile sharpening is ${friendlyDate(at)} at ${time}${where}.${change} Questions? Call us at ${SUPPORT_PHONE}.`;
}

export async function GET(req: NextRequest) {
  // Auth — Vercel Cron attaches Authorization: Bearer ${CRON_SECRET}
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get("dryRun") === "1";
  const supabase = getServiceClient();

  // Bound the scan to the days a 25h-out appointment can fall on. appointment_date
  // is a Vancouver calendar date, so compare it in that zone, not UTC.
  const { data, error } = await supabase
    .from("bookings")
    .select(
      "id, cal_booking_uid, customer_name, customer_phone, appointment_date, appointment_time, address, reminder_24h_sent_at, reminder_1h_sent_at",
    )
    .eq("status", "confirmed")
    .gte("appointment_date", localDate(0))
    .lte("appointment_date", localDate(2));

  if (error) {
    console.error("[cron/booking-reminders] query failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();
  const sent: string[] = [];
  const skipped: string[] = [];
  let failed = 0;

  for (const b of (data ?? []) as BookingRow[]) {
    if (!b.appointment_date || !b.appointment_time) continue;
    const at = appointmentToDate(b.appointment_date, b.appointment_time);
    if (!at) {
      console.error("[cron/booking-reminders] unparseable appointment:", b.id, b.appointment_date, b.appointment_time);
      continue;
    }
    const msUntil = at.getTime() - now;

    for (const kind of KINDS) {
      if (msUntil <= kind.minMs || msUntil > kind.maxMs) continue;
      if (b[kind.column]) continue;

      // Reminders are the one thing worse to send twice than late, so require a
      // usable E.164 number rather than handing Magpipe something it will reject.
      if (!b.customer_phone || !/^\+\d{10,15}$/.test(b.customer_phone)) {
        skipped.push(`${b.id}:${kind.column}:no-phone`);
        continue;
      }

      if (dryRun) {
        sent.push(`${b.id}:${kind.column}:DRY`);
        continue;
      }

      // Claim first, and only for a row still unsent, so two overlapping cron
      // runs can't both pick up the same reminder. The claim is rolled back if
      // the send fails, letting the next run retry while it's still in window.
      const stamp = new Date().toISOString();
      const { data: claimed, error: claimError } = await supabase
        .from("bookings")
        .update({ [kind.column]: stamp })
        .eq("id", b.id)
        .is(kind.column, null)
        .select("id");

      if (claimError) {
        console.error("[cron/booking-reminders] claim failed:", b.id, kind.column, claimError);
        failed++;
        continue;
      }
      if (!claimed || claimed.length === 0) {
        skipped.push(`${b.id}:${kind.column}:already-claimed`);
        continue;
      }

      try {
        await sendSms({ to: b.customer_phone, message: messageFor(kind, b, at) });
        sent.push(`${b.id}:${kind.column}`);
      } catch (e) {
        console.error("[cron/booking-reminders] send failed:", b.id, kind.column, e);
        failed++;
        await supabase.from("bookings").update({ [kind.column]: null }).eq("id", b.id);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    dryRun,
    scanned: data?.length ?? 0,
    sent,
    skipped,
    failed,
  });
}
