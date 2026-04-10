import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";


const CAL_API = "https://api.cal.com/v2";
const ADMIN_EMAIL = "elagerway@gmail.com";
const GCAL_ICS_PATH = "/tmp/gcal_export/covebladeshq@gmail.com.ics";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

function normalizePhone(p: string | null | undefined): string | null {
  if (!p) return null;
  const digits = p.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  if (p.startsWith("+")) return p.replace(/[^+\d]/g, "");
  return p;
}

/** Search Cal.com bookings for the latest date matching email or phone */
async function searchCalCom(email: string | null, phone: string | null): Promise<string | null> {
  const keys = [process.env.CAL_API_KEY, process.env.CAL_API_KEY_BLADES].filter(Boolean) as string[];
  let latestDate: string | null = null;

  for (const key of keys) {
    try {
      const res = await fetch(`${CAL_API}/bookings?take=100`, {
        headers: { Authorization: `Bearer ${key}`, "cal-api-version": "2024-08-13" },
      });
      if (!res.ok) continue;
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
          // Only count dates up to today
          const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
          if (date <= today && (!latestDate || date > latestDate)) latestDate = date;
        }
      }
    } catch {
      continue;
    }
  }
  return latestDate;
}

/** Search Supabase bookings table */
async function searchBookings(email: string | null, phone: string | null): Promise<string | null> {
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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

/** Search Google Calendar ICS export by customer name and address */
function searchGcalByName(name: string, address: string | null): string | null {
  try {
    const data = readFileSync(GCAL_ICS_PATH, "utf8");
    const events = data.split("BEGIN:VEVENT").slice(1);
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" }).replace(/-/g, "");
    let latestDate: string | null = null;

    // Build search terms from name parts + address keywords
    const searchTerms = name.toLowerCase().split(/\s+/).filter(p => p.length > 2);
    if (address) {
      // Extract key parts of address (street name, building name)
      const addrParts = address.toLowerCase().replace(/[,]/g, " ").split(/\s+/).filter(p => p.length > 3 && !/^\d+$/.test(p) && !["north","south","east","west","street","ave","road","drive","bc","canada"].includes(p));
      searchTerms.push(...addrParts);
    }

    for (const event of events) {
      const summary = (event.match(/SUMMARY:(.*)/)?.[1] || "").trim().toLowerCase();
      const location = (event.match(/LOCATION:(.*)/)?.[1] || "").trim().toLowerCase();
      const searchIn = summary + " " + location;
      const match = searchTerms.some(term => searchIn.includes(term));
      if (!match) continue;

      const dtMatch = event.match(/DTSTART[^:]*:(\d{8})/);
      if (!dtMatch) continue;
      const dateStr = dtMatch[1]; // YYYYMMDD

      // Only count dates up to today
      if (dateStr <= today) {
        const formatted = dateStr.slice(0, 4) + "-" + dateStr.slice(4, 6) + "-" + dateStr.slice(6, 8);
        if (!latestDate || formatted > latestDate) latestDate = formatted;
      }
    }
    return latestDate;
  } catch {
    return null;
  }
}

// GET /api/admin/customers/last-booking?email=...&phone=...&name=...
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase() || null;
  const phone = normalizePhone(req.nextUrl.searchParams.get("phone")) || null;
  const name = req.nextUrl.searchParams.get("name")?.trim() || null;
  const address = req.nextUrl.searchParams.get("address")?.trim() || null;

  if (!email && !phone && !name) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  // Search all sources in parallel
  const [calDate, bookingDate, gcalDate] = await Promise.all([
    searchCalCom(email, phone),
    searchBookings(email, phone),
    name ? Promise.resolve(searchGcalByName(name, address)) : Promise.resolve(null),
  ]);

  // Return the most recent date across all sources
  const dates = [calDate, bookingDate, gcalDate].filter(Boolean) as string[];
  const latest = dates.length > 0 ? dates.sort().reverse()[0] : null;

  return NextResponse.json({ date: latest });
}
