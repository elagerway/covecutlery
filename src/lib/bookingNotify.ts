import type { SupabaseClient } from "@supabase/supabase-js";
import { sendSms } from "@/lib/magpipe";
import { cityFromAddress } from "@/lib/format";
import { cities } from "@/data/cities";

/** Erik's mobile — deliberately NOT the Magpipe service number (MAGPIPE_SMS_FROM,
 *  +16042108180). Pointing this at the service number makes every alert a
 *  self-send: Magpipe accepts it, stamps it "delivered", files it in its own
 *  inbox, and no handset ever rings. */
export const ADMIN_PHONE = "+16045628647";

const SUPPORT_PHONE = "+1 (604) 210-8180";
const KNOWN_CITIES = cities.map((c) => c.name);

export interface BookingNotifyArgs {
  calBookingUid: string;
  name: string;
  phone: string | null;
  appointmentDate: string;
  appointmentTime: string;
  address: string | null;
}

/** Cal.com's attendee page — Reschedule and Cancel, both enabled on the event
 *  type. This is the customer's self-serve path; the AI receptionist on the
 *  service number can only re-send a link it can already see in the thread, so
 *  every outbound booking message has to carry it. */
export function manageUrl(uid: string | null): string | null {
  return uid ? `https://cal.com/booking/${uid}` : null;
}

/**
 * Text the customer their confirmation and alert the admin. Safe to call from
 * both write paths — /api/cal/book and the Cal webhook fire for the same
 * booking, so the send is gated on an atomic claim of confirmation_sms_sent_at:
 * whichever path gets there first sends, the other no-ops.
 *
 * Never throws — the Cal.com booking already succeeded by the time this runs,
 * so a messaging failure must not fail the caller.
 */
export async function notifyNewBooking(
  supabase: SupabaseClient,
  b: BookingNotifyArgs,
): Promise<{ sent: boolean; reason?: string }> {
  if (!process.env.MAGPIPE_API_KEY || !process.env.MAGPIPE_SMS_FROM) {
    return { sent: false, reason: "sms-not-configured" };
  }

  // Claim first, and only for a booking that hasn't been announced yet.
  const { data: claimed, error: claimError } = await supabase
    .from("bookings")
    .update({ confirmation_sms_sent_at: new Date().toISOString() })
    .eq("cal_booking_uid", b.calBookingUid)
    .is("confirmation_sms_sent_at", null)
    .select("id");

  if (claimError) {
    console.error("[bookingNotify] claim failed:", b.calBookingUid, claimError);
    return { sent: false, reason: "claim-failed" };
  }
  if (!claimed || claimed.length === 0) {
    return { sent: false, reason: "already-sent" };
  }

  const url = manageUrl(b.calBookingUid);
  const changeLine = url ? ` Need to reschedule or cancel? ${url}` : "";
  const who = b.name.trim().split(/\s+/)[0] || "there";
  const where = b.address ? ` We'll see you at ${b.address}!` : "";

  // A booking made through Cal.com directly — including by the AI receptionist —
  // skips the widget's address guard, so the city can be missing. We can't reject
  // it here (the booking already exists), but an unroutable address silently drops
  // the day to "Home Shop" on the public schedule widget, so flag it loudly.
  const cityMissing = !b.address || !cityFromAddress(b.address, KNOWN_CITIES);
  const addressWarning = cityMissing ? " ** ADDRESS HAS NO CITY — check before routing **" : "";

  const tasks: Promise<unknown>[] = [
    sendSms({
      to: ADMIN_PHONE,
      message: `New booking! ${b.name} — ${b.appointmentDate} at ${b.appointmentTime}, ${b.address ?? "no address"}. Phone: ${b.phone ?? "none"}${addressWarning}`,
    }),
  ];

  if (b.phone && /^\+\d{10,15}$/.test(b.phone)) {
    tasks.push(
      sendSms({
        to: b.phone,
        message: `Hi ${who}, your Cove Blades mobile sharpening is confirmed for ${b.appointmentDate} at ${b.appointmentTime}.${where}${changeLine} Questions? Call us at ${SUPPORT_PHONE}.`,
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error("[bookingNotify] send failed:", b.calBookingUid, r.reason);
  }
  return { sent: true };
}
