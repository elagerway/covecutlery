import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cancelCalBooking } from "@/lib/cal";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  if (!uid || typeof uid !== "string" || uid.length > 100) {
    return NextResponse.json({ error: "Missing uid" }, { status: 400 });
  }

  // This endpoint is unauthenticated — it exists solely for the Stripe
  // checkout cancel_url flow (/booking/cancel?uid=...), so it may only
  // cancel bookings still awaiting payment. Confirmed bookings can only be
  // cancelled through the authenticated admin API.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: booking } = await supabase
    .from("bookings")
    .select("status")
    .eq("cal_booking_uid", uid)
    .single();

  if (!booking || booking.status !== "pending_payment") {
    return NextResponse.json({ error: "Booking not eligible for cancellation" }, { status: 403 });
  }

  const { ok } = await cancelCalBooking(uid, "Cancelled by customer");
  if (!ok) return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("cal_booking_uid", uid);

  return NextResponse.json({ success: true });
}
