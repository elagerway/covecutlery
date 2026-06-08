import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { cancelCalBooking, TIMEZONE } from "@/lib/cal";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount_charged, status, notes, payment_method } = await req.json();

  const updates: Record<string, unknown> = {};
  if (amount_charged !== undefined) updates.amount_charged = amount_charged;
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (payment_method !== undefined) updates.payment_method = payment_method;

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getServiceClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("cal_booking_uid, status, appointment_date, stripe_payment_intent_id")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Don't silently discard money: a captured deposit that hasn't been refunded
  // must be refunded first (there's a dedicated Refund action for that).
  if (booking.stripe_payment_intent_id && booking.status !== "refunded") {
    return NextResponse.json(
      { error: "This booking has a deposit that hasn't been refunded. Refund it first, then delete." },
      { status: 409 },
    );
  }

  // Only cancel a Cal appointment that's still live: an active status AND a
  // future date. Past or already-terminal bookings have nothing to cancel, and
  // trying would 4xx and (previously) block the delete.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const isUpcoming = booking.appointment_date >= today;
  const isActive = booking.status === "confirmed" || booking.status === "pending_payment";

  if (booking.cal_booking_uid && isActive && isUpcoming) {
    const { ok } = await cancelCalBooking(booking.cal_booking_uid, "Deleted by admin");
    if (!ok) {
      // A real upcoming appointment we couldn't cancel — don't orphan it.
      return NextResponse.json(
        { error: "Couldn't cancel the Cal.com appointment — job not deleted. Cancel it in Cal.com, then try again." },
        { status: 502 },
      );
    }
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
