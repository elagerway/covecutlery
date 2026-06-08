import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

const TIMEZONE = "America/Vancouver";

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

function formatAppointment(start: string) {
  const d = new Date(start);
  return {
    date: d.toLocaleDateString("en-CA", { timeZone: TIMEZONE }), // YYYY-MM-DD
    time: d.toLocaleTimeString("en-US", {
      timeZone: TIMEZONE,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
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
}

/**
 * Cal.com webhook. Bookings made on the native Cal.com page never hit
 * /api/cal/book (the website widget path), so this is the only way they reach
 * the bookings table and show up in /admin/jobs. Keyed on cal_booking_uid so it
 * stays idempotent against the widget path and against retried deliveries.
 */
export async function POST(req: NextRequest) {
  let body: { triggerEvent?: string; payload?: CalPayload };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.triggerEvent;
  const p = body.payload ?? {};
  const uid = p.uid;

  if (!uid) {
    return NextResponse.json({ error: "Missing booking uid" }, { status: 400 });
  }

  const supabase = getServiceClient();

  if (event === "BOOKING_CANCELLED") {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("cal_booking_uid", uid);
    if (error) {
      console.error("[webhooks/cal] cancel update failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  if (event === "BOOKING_CREATED" || event === "BOOKING_RESCHEDULED") {
    const responses = p.responses ?? p.bookingFieldsResponses;
    const attendee = p.attendees?.[0] ?? {};
    const start = p.startTime ?? p.start;
    if (!start) {
      return NextResponse.json({ error: "Missing start time" }, { status: 400 });
    }
    const { date, time } = formatAppointment(start);

    const name = attendee.name ?? resp(responses, "name") ?? "Unknown";
    const email = attendee.email ?? resp(responses, "email") ?? "";
    const phone =
      attendee.phoneNumber ??
      resp(responses, "attendeePhoneNumber") ??
      resp(responses, "smsReminderNumber") ??
      null;
    const address = (p.location ?? resp(responses, "location") ?? "").trim() || null;
    const notes = resp(responses, "notes") ?? (p.metadata?.notes as string | undefined) ?? null;

    if (event === "BOOKING_RESCHEDULED") {
      // Only move the appointment; never clobber admin-entered payment fields.
      const { data: existing } = await supabase
        .from("bookings")
        .update({ appointment_date: date, appointment_time: time })
        .eq("cal_booking_uid", uid)
        .select("id");
      if (existing && existing.length > 0) {
        return NextResponse.json({ ok: true, rescheduled: true });
      }
      // Reschedule produced a new uid we haven't seen — fall through to insert.
    }

    // Insert only if this uid isn't already present (the widget path may have
    // written it). ignoreDuplicates keeps any admin edits on the existing row.
    const { error } = await supabase
      .from("bookings")
      .upsert(
        {
          cal_booking_uid: uid,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          appointment_date: date,
          appointment_time: time,
          address,
          notes,
          status: "confirmed",
          deposit_amount: 0,
        },
        { onConflict: "cal_booking_uid", ignoreDuplicates: true }
      );
    if (error) {
      console.error("[webhooks/cal] upsert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  }

  // Unhandled event types are acknowledged so Cal doesn't retry them.
  return NextResponse.json({ ok: true, ignored: event });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
