import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    calBookingUid,
    customerName,
    customerEmail,
    customerPhone,
    appointmentDate,
    appointmentTime,
    address,
  } = body;

  if (!calBookingUid || !customerName || !customerEmail || !appointmentDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "http://localhost:3002";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: "Mobile Sharpening Deposit",
            description: `Appointment on ${appointmentDate} at ${appointmentTime} — $50 deposit, remainder due on the day`,
          },
          unit_amount: 5000,
        },
        quantity: 1,
      },
    ],
    customer_creation: "always",
    payment_intent_data: {
      setup_future_usage: "off_session",
    },
    metadata: {
      calBookingUid,
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? "",
      appointmentDate,
      appointmentTime,
      address: address ?? "",
    },
    success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/booking/cancel?uid=${calBookingUid}`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min to complete
  });

  // Store pending booking in Supabase — service role required (no user session; bookings table is admin-only RLS)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error: insertError } = await supabase.from("bookings").insert({
    cal_booking_uid: calBookingUid,
    stripe_session_id: session.id,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone ?? null,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    address: address ?? null,
    status: "pending_payment",
  });

  if (insertError) {
    console.error("Supabase insert error:", JSON.stringify(insertError));
    // Clean up orphaned Cal.com booking and Stripe session
    await fetch(`https://api.cal.com/v2/bookings/${calBookingUid}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: "Booking system error" }),
    });
    await getStripe().checkout.sessions.expire(session.id);
    return NextResponse.json({ error: "Failed to save booking. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
