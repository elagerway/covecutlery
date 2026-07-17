import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatAppointment } from "@/lib/cal";

const ADMIN_PHONE = "+16042108180";

/** Normalise a Canadian/US phone number to E.164 format (+1XXXXXXXXXX).
 *  Returns the original string if it's already E.164 or can't be normalised.
 */
function toE164CA(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  if (phone.startsWith("+")) return phone; // already international
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone; // unknown format — pass as-is
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { start, name, email, phone, address, notes } = body;

  if (!start || !name || !email || !phone || !address) {
    return NextResponse.json({ error: "start, name, email, phone, and address required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length > 200 ||
      typeof email !== "string" || !email.includes("@") || email.length > 200 ||
      typeof phone !== "string" || phone.length > 30 ||
      typeof start !== "string" || start.length > 50) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const e164Phone = toE164CA(phone);
  if (!e164Phone || !/^\+\d{10,15}$/.test(e164Phone)) {
    return NextResponse.json({ error: "Please enter a valid 10-digit phone number." }, { status: 400 });
  }

  // Slots now arrive offset-formatted ("2026-07-18T17:00:00.000-07:00") since the
  // slots proxy passes timeZone; Cal.com's bookings endpoint documents UTC, so
  // convert rather than trust it to parse offsets.
  const startDate = new Date(start);
  if (isNaN(startDate.getTime())) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }
  const startUTC = startDate.toISOString();

  let res: Response;
  try {
    res = await fetch("https://api.cal.com/v2/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventTypeId: Number(process.env.CAL_EVENT_TYPE_ID),
        start: startUTC,
        attendee: {
          name,
          email,
          timeZone: "America/Vancouver",
          language: "en",
          phoneNumber: e164Phone,
        },
        location: address ? { type: "attendeeDefined", location: address } : undefined,
        metadata: notes ? { notes } : {},
      }),
    });
  } catch {
    return NextResponse.json({ error: "Booking service unavailable" }, { status: 502 });
  }

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error?.message ?? data?.message ?? "Booking failed. Please try again.";
    return NextResponse.json({ error: message }, { status: res.status });
  }

  // Save booking to Supabase as confirmed (no deposit required)
  const calBookingUid = data.uid ?? data.data?.uid ?? data.id;
  const { date: appointmentDate, time: appointmentTime } = formatAppointment(startUTC);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Upsert keyed on cal_booking_uid so this is safe against the Cal webhook
  // (/api/webhooks/cal) writing the same booking from its BOOKING_CREATED event.
  const { error: insertError } = await supabase
    .from("bookings")
    .upsert(
      {
        cal_booking_uid: calBookingUid,
        customer_name: name,
        customer_email: email,
        customer_phone: e164Phone,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        address: address ?? null,
        notes: notes ?? null,
        status: "confirmed",
        deposit_amount: 0,
      },
      { onConflict: "cal_booking_uid", ignoreDuplicates: true }
    );

  if (insertError) {
    // The Cal.com booking already succeeded, so don't fail the customer — but
    // surface it loudly: a swallowed insert here is exactly how bookings went
    // missing from /admin/jobs.
    console.error("[cal/book] booking insert failed:", JSON.stringify(insertError), "uid:", calBookingUid);
  }

  // Send SMS notifications (fire-and-forget)
  if (process.env.MAGPIPE_API_KEY && process.env.MAGPIPE_SMS_FROM) {
    const sendSms = async (to: string, message: string) => {
      try {
        await fetch("https://api.magpipe.ai/functions/v1/send-user-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MAGPIPE_API_KEY}`,
          },
          body: JSON.stringify({
            serviceNumber: process.env.MAGPIPE_SMS_FROM,
            contactPhone: to,
            message,
          }),
        });
      } catch (e) {
        console.error(`SMS to ${to} failed:`, e);
      }
    };

    // Notify admin + confirm to customer (parallel, non-blocking but awaited before response)
    const adminMsg = `New booking! ${name} — ${appointmentDate} at ${appointmentTime}, ${address ?? "no address"}. Phone: ${e164Phone}`;
    const customerMsg = `Hi ${name.split(" ")[0]}, your Cove Blades mobile sharpening is confirmed for ${appointmentDate} at ${appointmentTime}. We'll see you at ${address}! Questions? Call us at +1 (604) 210-8180.`;

    await Promise.allSettled([
      sendSms(ADMIN_PHONE, adminMsg),
      sendSms(e164Phone, customerMsg),
    ]);
  }

  return NextResponse.json(data);
}
