import { NextRequest, NextResponse } from "next/server";

const HOME_BASE = { lat: 49.3198, lng: -123.0725 };
const MAX_KM = 90;
const MAX_LNG = -123.35; // west of this requires a ferry (Sunshine Coast, Vancouver Island)

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
        location: address ? { type: "attendeeAddress", address } : undefined,
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

  return NextResponse.json(data);
}
