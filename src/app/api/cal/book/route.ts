import { NextRequest, NextResponse } from "next/server";

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
  const { start, name, email, phone, address, notes, captchaToken } = body;

  if (!start || !name || !email) {
    return NextResponse.json({ error: "start, name, and email required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length > 200 ||
      typeof email !== "string" || !email.includes("@") || email.length > 200 ||
      typeof start !== "string" || start.length > 50) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  // Verify Turnstile CAPTCHA
  if (!captchaToken || typeof captchaToken !== "string" || captchaToken.length > 2048) {
    return NextResponse.json({ error: "CAPTCHA required." }, { status: 400 });
  }
  try {
    const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: captchaToken }),
    });
    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "CAPTCHA verification unavailable." }, { status: 503 });
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
