import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Use service role for webhook — no user session available
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  const supabase = getSupabase();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await supabase
      .from("bookings")
      .update({
        status: "confirmed",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("stripe_session_id", session.id);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { data: booking } = await supabase
      .from("bookings")
      .select("cal_booking_uid, status")
      .eq("stripe_session_id", session.id)
      .single();

    // Only cancel if still pending — guard against out-of-order webhook delivery
    if (booking && booking.status === "pending_payment") {
      // Cancel the Cal.com booking — only mark cancelled in Supabase if Cal.com succeeds
      const cancelRes = await fetch(`https://api.cal.com/v2/bookings/${booking.cal_booking_uid}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
          "cal-api-version": "2024-08-13",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Payment not completed" }),
      });

      if (cancelRes.ok) {
        await supabase
          .from("bookings")
          .update({ status: "cancelled" })
          .eq("stripe_session_id", session.id);
      }
    }
  }

  return NextResponse.json({ received: true });
}
