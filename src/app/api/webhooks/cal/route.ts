import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getServiceClient } from "@/lib/admin";
import { formatAppointment } from "@/lib/cal";

export const dynamic = "force-dynamic";

/** Cal booking-field responses come through either as plain values or as
 *  `{ label, value }` objects depending on the field. Unwrap to the raw value. */
function resp(responses: Record<string, unknown> | undefined, key: string): string | undefined {
  const v = responses?.[key];
  if (v == null) return undefined;
  if (typeof v === "object" && "value" in (v as Record<string, unknown>)) {
    const inner = (v as Record<string, unknown>).value;
    return typeof inner === "string" ? inner : undefined;
  }
  return typeof v === "string" ? v : undefined;
}

interface CalAttendee {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface CalPayload {
  uid?: string;
  startTime?: string;
  start?: string;
  location?: string;
  attendees?: CalAttendee[];
  responses?: Record<string, unknown>;
  bookingFieldsResponses?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  // Reschedule references the prior booking under one of these (Cal mints a new uid).
  rescheduleUid?: string;
  rescheduledFromUid?: string;
  originalRescheduledBooking?: { uid?: string };
}

/** Map a Cal payload to the bookings columns. Returns null when there isn't
 *  enough to write a row (no uid or no start time). */
function mapBooking(p: CalPayload) {
  const uid = p.uid;
  const start = p.startTime ?? p.start;
  if (!uid || !start) return null;
  const responses = p.responses ?? p.bookingFieldsResponses;
  const attendee = p.attendees?.[0] ?? {};
  const { date, time } = formatAppointment(start);
  return {
    cal_booking_uid: uid,
    customer_name: attendee.name ?? resp(responses, "name") ?? "Unknown",
    customer_email: attendee.email ?? resp(responses, "email") ?? "",
    customer_phone:
      attendee.phoneNumber ?? resp(responses, "attendeePhoneNumber") ?? resp(responses, "smsReminderNumber") ?? null,
    appointment_date: date,
    appointment_time: time,
    address: (p.location ?? resp(responses, "location") ?? "").trim() || null,
    notes: resp(responses, "notes") ?? (p.metadata?.notes as string | undefined) ?? null,
    deposit_amount: 0,
  };
}

function rescheduledFromUid(p: CalPayload): string | undefined {
  return p.rescheduleUid ?? p.rescheduledFromUid ?? p.originalRescheduledBooking?.uid;
}

/**
 * Cal.com webhook. Native-page bookings never hit /api/cal/book, so this is the
 * only way they reach the bookings table. Keyed on cal_booking_uid; idempotent
 * against the widget path and retried/out-of-order deliveries.
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();

  // Verify Cal's HMAC signature when a secret is configured. Skipped if unset
  // (local/dev), so configuring the secret is what turns enforcement on.
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (secret) {
    const provided = req.headers.get("x-cal-signature-256") ?? "";
    const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let body: { triggerEvent?: string; payload?: CalPayload };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.triggerEvent;
  const p = body.payload ?? {};
  const uid = p.uid;
  if (!uid) return NextResponse.json({ error: "Missing booking uid" }, { status: 400 });

  const supabase = getServiceClient();

  if (event === "BOOKING_CANCELLED") {
    const { data: updated, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("cal_booking_uid", uid)
      .select("id");
    if (error) {
      console.error("[webhooks/cal] cancel update failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Out-of-order delivery: CANCELLED arrived before CREATED. Write a cancelled
    // tombstone so the later CREATED (insert-if-missing) can't resurrect it.
    if (!updated || updated.length === 0) {
      const row = mapBooking(p);
      if (row) {
        await supabase
          .from("bookings")
          .upsert({ ...row, status: "cancelled" }, { onConflict: "cal_booking_uid", ignoreDuplicates: true });
      }
    }
    return NextResponse.json({ ok: true });
  }

  if (event === "BOOKING_CREATED" || event === "BOOKING_RESCHEDULED") {
    const row = mapBooking(p);
    if (!row) return NextResponse.json({ error: "Missing start time" }, { status: 400 });

    if (event === "BOOKING_RESCHEDULED") {
      // Cal mints a new uid on reschedule. Move the existing row (preserving any
      // admin-entered payment fields) instead of creating a duplicate.
      const fromUid = rescheduledFromUid(p);
      if (fromUid && fromUid !== uid) {
        const { data: moved } = await supabase
          .from("bookings")
          .update({
            cal_booking_uid: uid,
            appointment_date: row.appointment_date,
            appointment_time: row.appointment_time,
          })
          .eq("cal_booking_uid", fromUid)
          .select("id");
        if (moved && moved.length > 0) return NextResponse.json({ ok: true, rescheduled: true });
      } else {
        // Same uid kept: just move the time on the existing row.
        const { data: moved } = await supabase
          .from("bookings")
          .update({ appointment_date: row.appointment_date, appointment_time: row.appointment_time })
          .eq("cal_booking_uid", uid)
          .select("id");
        if (moved && moved.length > 0) return NextResponse.json({ ok: true, rescheduled: true });
      }
      if (!fromUid) {
        console.warn("[webhooks/cal] reschedule with no prior-uid reference; inserting new row for", uid);
      }
      // Fell through (prior row not found) — insert the new booking below.
    }

    // Insert only if absent (the widget path may have written it); never clobber
    // an existing row's admin edits.
    const { error } = await supabase
      .from("bookings")
      .upsert({ ...row, status: "confirmed" }, { onConflict: "cal_booking_uid", ignoreDuplicates: true });
    if (error) {
      console.error("[webhooks/cal] upsert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true, ignored: event });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
