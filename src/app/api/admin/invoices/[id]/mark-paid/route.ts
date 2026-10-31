import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { MANUAL_PAYMENT_METHODS } from "@/lib/format";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { payment_method = "etransfer" } = await req.json();
  if (!MANUAL_PAYMENT_METHODS.some((m) => m.value === payment_method)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("invoices")
    .update({
      status: "paid",
      payment_method,
      paid_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
