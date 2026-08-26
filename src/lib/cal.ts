// Shared Cal.com helpers. Centralises the cancel call (previously copy-pasted
// across cal/cancel, stripe/webhook, and admin booking delete) and the
// appointment date/time formatting used when mirroring Cal bookings into the
// bookings table.

const CAL_API = "https://api.cal.com/v2";
const CAL_API_VERSION = "2024-08-13";
export const TIMEZONE = "America/Vancouver";

/** Format a Cal start time into the date/time strings stored on bookings rows.
 *  Both write paths (widget /api/cal/book and the webhook) call this so the
 *  stored format stays identical for a given booking. */
export function formatAppointment(startIso: string): { date: string; time: string } {
  const d = new Date(startIso);
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

/** How far ahead of UTC the given instant is in `TIMEZONE`, in ms (PST +8h, PDT +7h). */
function tzOffsetMs(at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (type: string) => Number(parts.find(p => p.type === type)?.value);
  // hour12:false renders midnight as "24" in some engines; normalise to 0.
  const hour = get("hour") % 24;
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), hour, get("minute"), get("second"));
  return at.getTime() - asUtc;
}

/** Inverse of formatAppointment(): turn the stored `appointment_date` ("YYYY-MM-DD")
 *  and `appointment_time` ("4:00 PM") back into the UTC instant of the appointment.
 *  Both are Vancouver wall-clock, so the offset has to be resolved against the
 *  appointment's own date — a fixed -8h would be an hour off for half the year.
 *  Returns null if either string doesn't parse. */
export function appointmentToDate(date: string, time: string): Date | null {
  const d = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const t = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!d || !t) return null;

  let hour = Number(t[1]) % 12;
  if (t[3].toUpperCase() === "PM") hour += 12;
  const wallClockAsUtc = Date.UTC(Number(d[1]), Number(d[2]) - 1, Number(d[3]), hour, Number(t[2]));

  // Seed the offset from the wall clock read as UTC, then re-resolve against the
  // resulting instant so DST-changeover days land on the correct side.
  const seeded = wallClockAsUtc + tzOffsetMs(new Date(wallClockAsUtc));
  return new Date(wallClockAsUtc + tzOffsetMs(new Date(seeded)));
}

/** Cancel a Cal.com booking. Returns the HTTP status so callers can tell a
 *  real failure from an already-cancelled / non-cancellable booking. */
export async function cancelCalBooking(
  uid: string,
  cancellationReason: string,
): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(`${CAL_API}/bookings/${uid}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CAL_API_KEY}`,
      "cal-api-version": CAL_API_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cancellationReason }),
  });
  return { ok: res.ok, status: res.status };
}
