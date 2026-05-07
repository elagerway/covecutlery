import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServiceClient } from "@/lib/admin";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// POST /api/invoices/[id]/pay — creates Stripe Checkout for invoice payment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const supabase = getServiceClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_name, client_email, line_items, subtotal, status")
    .eq("id", id)
    .single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (!["sent", "viewed"].includes(invoice.status)) {
    return NextResponse.json({ error: invoice.status === "paid" ? "Already paid" : "Invoice is not payable" }, { status: 400 });
  }

  const origin = process.env.NODE_ENV === "development" ? (req.headers.get("origin") ?? "https://coveblades.com") : "https://coveblades.com";

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
