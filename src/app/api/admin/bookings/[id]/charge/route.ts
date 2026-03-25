import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}
const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount } = await req.json(); // cents

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: booking } = await supabase
    .from("bookings")
    .select("stripe_customer_id, amount_charged, customer_name, customer_email, appointment_date, appointment_time")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.amount_charged !== null) {
    return NextResponse.json({ error: "This booking has already been charged." }, { status: 409 });
  }
  if (!booking.stripe_customer_id) {
    return NextResponse.json({ error: "No saved card for this booking. Collect cash instead." }, { status: 422 });
  }

  // Get the customer's default saved payment method
  const paymentMethods = await getStripe().paymentMethods.list({
    customer: booking.stripe_customer_id,
    type: "card",
  });

  if (!paymentMethods.data.length) {
    return NextResponse.json({ error: "No saved card found for this customer." }, { status: 422 });
  }

  const paymentMethod = paymentMethods.data[0];

  const paymentIntent = await getStripe().paymentIntents.create(
    {
      amount,
      currency: "cad",
      customer: booking.stripe_customer_id,
      payment_method: paymentMethod.id,
      confirm: true,
      off_session: true,
      description: `Remaining balance — ${booking.customer_name} on ${booking.appointment_date} at ${booking.appointment_time}`,
    },
    { idempotencyKey: `charge-${id}` }
  );

  if (paymentIntent.status !== "succeeded") {
    return NextResponse.json({ error: `Payment failed: ${paymentIntent.status}` }, { status: 402 });
  }

  await supabase
    .from("bookings")
    .update({ amount_charged: amount, payment_method: "card" })
    .eq("id", id);

  return NextResponse.json({ ok: true, payment_intent_id: paymentIntent.id });
}
