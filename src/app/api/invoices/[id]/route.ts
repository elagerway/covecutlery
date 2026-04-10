import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

// GET /api/invoices/[id] — public, no auth
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Validate UUID format to prevent scanning
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_name, line_items, subtotal, notes, status, due_date, created_at, paid_at, payment_method")
    .eq("id", id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Mark as viewed on first access (only if sent)
  if (data.status === "sent") {
    await supabase.from("invoices").update({ status: "viewed" }).eq("id", id);
    data.status = "viewed";
  }

  return NextResponse.json(data);
}
