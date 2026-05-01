import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const HOME_BASE = { lat: 49.3198, lng: -123.0725 };
const MAX_KM = 105; // covers Lower Mainland out to Chilliwack (~95 km centroid, ~100 km edges)
const MAX_LNG = -123.35; // west of this requires a ferry (Sunshine Coast, Vancouver Island)
const ADMIN_PHONE = "+16042108180";
const TIMEZONE = "America/Vancouver";

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  const KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!KEY) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&components=country:CA&key=${KEY}`
    );
    const data = await res.json();
    const loc = data.results?.[0]?.geometry?.location;
    return loc ? { lat: loc.lat, lng: loc.lng } : null;
  } catch {
    return null;
  }
}

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
      typeof start !== "string" || start.length > 50) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  // Service area check — geocode the address and verify it's within 90 km of North Vancouver and not ferry-only
  if (address) {
    const coords = await geocodeAddress(address);
    if (!coords) {
      console.warn("[cal/book] Could not geocode address for service area check:", address);
      return NextResponse.json(
        { error: "We couldn't verify your address location. Please select your address from the autocomplete suggestions and try again." },
        { status: 422 }
      );
    }
    const km = haversineKm(HOME_BASE.lat, HOME_BASE.lng, coords.lat, coords.lng);
    if (km > MAX_KM || coords.lng < MAX_LNG) {
      return NextResponse.json(
        { error: "We're very sorry, your address falls outside of our service area. Please contact us to discuss options." },
        { status: 422 }
      );
    }
  }

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
        start,
        attendee: {
          name,
          email,
          timeZone: "America/Vancouver",
          language: "en",
          phoneNumber: toE164CA(phone),
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
  const appointmentDate = new Date(start).toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const appointmentTime = new Date(start).toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("bookings").insert({
    cal_booking_uid: calBookingUid,
    customer_name: name,
    customer_email: email,
    customer_phone: toE164CA(phone) ?? null,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    address: address ?? null,
    status: "confirmed",
    deposit_amount: 0,
  });

  // Send SMS notifications (fire-and-forget)
  const e164Phone = toE164CA(phone);
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
    const adminMsg = `New booking! ${name} — ${appointmentDate} at ${appointmentTime}, ${address ?? "no address"}. Phone: ${phone}`;
    const customerMsg = `Hi ${name.split(" ")[0]}, your Cove Blades mobile sharpening is confirmed for ${appointmentDate} at ${appointmentTime}. We'll see you at ${address}! Questions? Call us at 604-210-8180.`;

    await Promise.allSettled([
      sendSms(ADMIN_PHONE, adminMsg),
      e164Phone ? sendSms(e164Phone, customerMsg) : Promise.resolve(),
    ]);
  }

  return NextResponse.json(data);
}
