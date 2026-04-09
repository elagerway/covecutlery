import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { uid } = await req.json();
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  // Only allow cancellation of bookings still awaiting payment
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: booking } = await supabase
    .from("bookings")
    .select("status")
    .eq("cal_booking_uid", uid)
    .single();

  if (!booking || !["pending_payment", "confirmed"].includes(booking.status)) {
    return NextResponse.json({ error: "Booking not eligible for cancellation" }, { status: 403 });
  }

  const res = await fetch(`https://api.cal.com/v2/bookings/${uid}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CAL_API_KEY}`,
      "cal-api-version": "2024-08-13",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reason: "Cancelled by customer" }),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed to cancel" }, { status: 500 });

  await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("cal_booking_uid", uid);

  return NextResponse.json({ success: true });
}
