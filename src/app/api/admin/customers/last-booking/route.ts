import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { normalizePhone } from "@/lib/format";

const CAL_API = "https://api.cal.com/v2";

/** Search Cal.com bookings for the latest date matching email or phone */
async function searchCalCom(email: string | null, phone: string | null): Promise<string | null> {
  const key = process.env.CAL_API_KEY;
  if (!key) return null;
  let latestDate: string | null = null;

  try {
    const res = await fetch(`${CAL_API}/bookings?take=100`, {
      headers: { Authorization: `Bearer ${key}`, "cal-api-version": "2024-08-13" },
    });
    if (!res.ok) return null;
    const json = await res.json();

    for (const b of json.data || []) {
      if (b.status === "cancelled") continue;
      const a = (b.attendees || [])[0];
      if (!a) continue;
      const bfr = b.bookingFieldsResponses || {};

      const matchEmail = email && a.email?.toLowerCase() === email;
      const bookingPhone = normalizePhone(a.phoneNumber || bfr.attendeePhoneNumber || bfr.smsReminderNumber);
      const matchPhone = phone && bookingPhone === phone;

      if (matchEmail || matchPhone) {
        const date = new Date(b.start).toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
        const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
        if (date <= today && (!latestDate || date > latestDate)) latestDate = date;
      }
    }
  } catch {
    return latestDate;
  }
  return latestDate;
}

/** Search Supabase bookings table */
async function searchBookings(email: string | null, phone: string | null): Promise<string | null> {
  const supabase = getServiceClient();

  let query = supabase.from("bookings").select("appointment_date").order("appointment_date", { ascending: false }).limit(1);

  if (email) {
    query = query.eq("customer_email", email);
  } else if (phone) {
    query = query.eq("customer_phone", phone);
  } else {
    return null;
  }

  const { data } = await query;
  return data?.[0]?.appointment_date || null;
}

// GET /api/admin/customers/last-booking?email=...&phone=...&name=...
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() || null;
  const phone = normalizePhone(req.nextUrl.searchParams.get("phone")) || null;
  const name = req.nextUrl.searchParams.get("name")?.trim() || null;

  if (!email && !phone && !name) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  // Search all sources in parallel
  const [calDate, bookingDate] = await Promise.all([
    searchCalCom(email, phone),
    searchBookings(email, phone),
  ]);

  // Return the most recent date across all sources
  const dates = [calDate, bookingDate].filter(Boolean) as string[];
  const latest = dates.length > 0 ? dates.sort().reverse()[0] : null;

  return NextResponse.json({ date: latest });
}
