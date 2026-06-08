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
