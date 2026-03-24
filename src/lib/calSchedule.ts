const HOME_CITY = "North Vancouver";
const CAL_API = "https://api.cal.com/v2";

export interface DaySchedule {
  date: string;       // "2026-03-24"
  dayLabel: string;   // "Mon"
  dateLabel: string;  // "Mar 24"
  cities: string[];   // [] = Home Shop
  isToday: boolean;
}

interface CalBooking {
  start: string;
  status: string;
  metadata?: Record<string, unknown>;
}

/** Returns today's date string in Vancouver timezone: "2026-03-24" */
function todayVancouver(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
}

/** Converts a UTC ISO string to a Vancouver date string: "2026-03-24" */
function toVancouverDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
}

/** Adds N days to a date string "YYYY-MM-DD" */
function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d + n);
  return date.toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
}

/** Formats "2026-03-24" → "Mon" */
function toDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short" });
}

/** Formats "2026-03-24" → "Mar 24" */
function toDateLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Extracts city from the booking metadata notes string.
 *  Notes format: "Address: 123 Main St, Surrey, British Columbia V3R 0A1, Canada\nOptional notes"
 */
function extractCity(booking: CalBooking): string | null {
  const notes = booking.metadata?.notes;
  if (typeof notes !== "string") return null;

  const addressLine = notes.split("\n").find((l) => l.startsWith("Address:"));
  if (!addressLine) return null;

  const address = addressLine.replace("Address:", "").trim();
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);

  // Nominatim format: "Street", "City", "Province Postal", "Country"
  // If parts[1] starts with a digit it's likely a unit/suite — use parts[2]
  const candidate = parts[1]?.match(/^\d/) ? parts[2] : parts[1];
  return candidate ?? null;
}

/** Fetches the next 7 days of confirmed bookings from Cal.com and returns a DaySchedule array. */
export async function getWeekSchedule(): Promise<DaySchedule[]> {
  const today = todayVancouver();

  // Build 7-day scaffold
  const days: DaySchedule[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(today, i);
    return {
      date,
      dayLabel: toDayLabel(date),
      dateLabel: toDateLabel(date),
      cities: [],
      isToday: i === 0,
    };
  });

  try {
    const start = new Date(`${today}T00:00:00`).toISOString();
    const end = new Date(`${addDays(today, 7)}T00:00:00`).toISOString();

    const res = await fetch(
      `${CAL_API}/bookings?afterStart=${encodeURIComponent(start)}&beforeEnd=${encodeURIComponent(end)}&status=upcoming`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
          "cal-api-version": "2024-08-13",
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return days;

    const json = await res.json();
    const bookings: CalBooking[] = json?.data ?? [];

    // Group cities by Vancouver date
    const cityMap = new Map<string, Set<string>>();
    for (const booking of bookings) {
      if (booking.status === "cancelled") continue;
      const date = toVancouverDate(booking.start);
      const city = extractCity(booking);
      if (!city) continue;
      if (!cityMap.has(date)) cityMap.set(date, new Set());
      cityMap.get(date)!.add(city);
    }

    // Merge into scaffold
    for (const day of days) {
      const cities = cityMap.get(day.date);
      if (cities) day.cities = Array.from(cities);
    }
  } catch {
    // On any error return the empty scaffold (all Home Shop)
  }

  return days;
}

export { HOME_CITY };
