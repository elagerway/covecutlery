import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";
import { appointmentToDate } from "@/lib/cal";
import { manageUrl } from "@/lib/bookingNotify";
import { sendSms } from "@/lib/magpipe";

/**
 * Texts a customer the Cal.com management link for their upcoming booking.
 *
 * Exists so there is ONE static URL (coveblades.com/manage) that works without a
 * booking uid. The Magpipe AI receptionist can send arbitrary SMS text but has no
 * booking lookup, and its tool description forbids inventing URLs — so it can
 * offer this fixed page on a voice call, where there's no SMS thread to copy a
 * per-booking link out of.
 *
 * Deliberately does NOT return the booking in the response. Anyone can type any
 * phone number here, so the appointment details go to the handset that owns the
 * number, never to the screen. The response is identical whether or not a booking
 * exists, so this can't be used to probe who is a customer.
 */

export const dynamic = "force-dynamic";

/** Same normalisation the booking route uses, so lookups match what we stored. */
function toE164CA(phone: string): string | null {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return /^\+\d{10,15}$/.test(trimmed) ? trimmed : null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null;
}

// Uniform response — never reveals whether the number has a booking.
const OK = { ok: true as const, message: "If that number has an upcoming booking, we've just texted you the link." };

export async function POST(req: NextRequest) {
  const { phone, cfToken } = await req.json().catch(() => ({}) as Record<string, unknown>);

  if (typeof phone !== "string" || phone.length > 30) {
    return NextResponse.json({ error: "Please enter your phone number." }, { status: 400 });
  }

  if (cfToken && process.env.TURNSTILE_SECRET_KEY) {
    try {
      const tsRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: cfToken }),
      });
      const tsData: { success: boolean } = await tsRes.json();
      if (!tsData.success) {
        return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "CAPTCHA verification unavailable." }, { status: 503 });
    }
  }

  const e164 = toE164CA(phone);
  // Still the uniform response — a malformed number mustn't read differently
  // from a well-formed one with no booking.
  if (!e164) return NextResponse.json(OK);

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("cal_booking_uid, customer_name, appointment_date, appointment_time")
    .eq("customer_phone", e164)
    .eq("status", "confirmed")
    .gte("appointment_date", new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" }))
    .order("appointment_date", { ascending: true })
    .limit(5);

  if (error) {
    console.error("[bookings/manage-link] query failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please call us at +1 (604) 210-8180." }, { status: 500 });
  }

  // Pick the soonest booking still in the future — appointment_date alone can't
  // order same-day slots, and today's earlier slots have already passed.
  const now = Date.now();
  const next = (data ?? [])
    .map(b => ({ b, at: b.appointment_date && b.appointment_time ? appointmentToDate(b.appointment_date, b.appointment_time) : null }))
    .filter((x): x is { b: (typeof data)[number]; at: Date } => x.at !== null && x.at.getTime() > now)
    .sort((a, z) => a.at.getTime() - z.at.getTime())[0];

  const url = next ? manageUrl(next.b.cal_booking_uid) : null;
  if (!next || !url) return NextResponse.json(OK);

  try {
    await sendSms({
      to: e164,
      message: `Hi ${next.b.customer_name?.trim().split(/\s+/)[0] || "there"}, here's the link to reschedule or cancel your Cove Blades sharpening on ${next.b.appointment_date} at ${next.b.appointment_time}: ${url}`,
    });
  } catch (e) {
    console.error("[bookings/manage-link] send failed:", e);
    return NextResponse.json({ error: "We couldn't send that text. Please call us at +1 (604) 210-8180." }, { status: 502 });
  }

  return NextResponse.json(OK);
}
