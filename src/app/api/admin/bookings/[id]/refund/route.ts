import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import Stripe from "stripe";

const ADMIN_EMAIL = "elagerway@gmail.com";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("stripe_payment_intent_id, status, deposit_amount")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (!booking.stripe_payment_intent_id) {
    return NextResponse.json({ error: "No payment on record for this booking" }, { status: 400 });
  }
  if (!["confirmed", "completed"].includes(booking.status)) {
    return NextResponse.json(
      { error: "Only confirmed or completed bookings can be refunded" },
      { status: 400 }
    );
  }

  let refund: Stripe.Refund;
  try {
    refund = await stripe.refunds.create({
      payment_intent: booking.stripe_payment_intent_id,
    });
  } catch (err) {
    const msg = err instanceof Stripe.errors.StripeError ? err.message : "Stripe refund failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (refund.status === "failed" || refund.status === "requires_action") {
    return NextResponse.json({ error: `Refund status: ${refund.status}` }, { status: 500 });
  }

  const { data, error: updateError } = await supabase
    .from("bookings")
    .update({ status: "refunded" })
    .eq("id", id)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ booking: data, refund });
}
