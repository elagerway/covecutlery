import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST /api/invoices/[id]/pay — creates Stripe Checkout for invoice payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getServiceClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (!["sent", "viewed"].includes(invoice.status)) {
    return NextResponse.json({ error: invoice.status === "paid" ? "Already paid" : "Invoice is not payable" }, { status: 400 });
  }

  const origin = req.headers.get("origin") ?? "https://covecutlery.ca";

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: invoice.line_items.map((item: { description: string; quantity: number; unit_price: number }) => ({
      price_data: {
        currency: "cad",
        product_data: { name: item.description },
        unit_amount: item.unit_price,
      },
      quantity: item.quantity,
    })),
    customer_email: invoice.client_email,
    metadata: {
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
    },
    success_url: `${origin}/invoice/${invoice.id}?paid=true`,
    cancel_url: `${origin}/invoice/${invoice.id}`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  });

  // Store Stripe session on invoice
  await supabase
    .from("invoices")
    .update({ stripe_session_id: session.id })
    .eq("id", id);

  return NextResponse.json({ url: session.url });
}
