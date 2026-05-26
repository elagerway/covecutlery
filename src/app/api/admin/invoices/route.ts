import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

/** Generate next invoice number: YYYYMMDD-NNN */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function nextInvoiceNumber(supabase: any) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Vancouver" }).replace(/-/g, "");
  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .like("invoice_number", `${today}-%`)
    .order("invoice_number", { ascending: false })
    .limit(1);

  const lastSeq = data?.[0]?.invoice_number
    ? parseInt(data[0].invoice_number.split("-")[1], 10)
    : 0;

  return `${today}-${String(lastSeq + 1).padStart(3, "0")}`;
}

// GET /api/admin/invoices?status=draft
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");
  const supabase = getServiceClient();

  let query = supabase
    .from("invoices")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/invoices
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    client_name, client_email, client_phone, client_address,
    line_items, notes, due_date, work_completed_date, status: invoiceStatus,
  } = body;

  if (!client_name || !line_items?.length) {
    return NextResponse.json({ error: "Client name and at least one line item are required" }, { status: 400 });
  }
  if (!client_email && !client_phone) {
    return NextResponse.json({ error: "Provide either an email or a phone number so the customer can be reached" }, { status: 400 });
  }

  // Validate line items
  for (const item of line_items) {
    if (typeof item.description !== "string" || !item.description.trim()) {
      return NextResponse.json({ error: "Each line item needs a description" }, { status: 400 });
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      return NextResponse.json({ error: "Quantity must be a positive whole number" }, { status: 400 });
    }
    if (typeof item.unit_price !== "number" || item.unit_price < 0 || !Number.isInteger(item.unit_price)) {
      return NextResponse.json({ error: "Price must be a non-negative amount in cents" }, { status: 400 });
    }
  }

  const subtotal = line_items.reduce(
    (sum: number, item: { quantity: number; unit_price: number }) => sum + item.quantity * item.unit_price,
    0
  );

  const supabase = getServiceClient();
  const invoice_number = await nextInvoiceNumber(supabase);

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      invoice_number,
      client_name,
      client_email: client_email || null,
      client_phone: client_phone || null,
      client_address: client_address || null,
      line_items,
      subtotal,
      notes: notes || null,
      status: invoiceStatus === "sent" ? "sent" : "draft",
      due_date: due_date || null,
      work_completed_date: work_completed_date || null,
      sent_at: invoiceStatus === "sent" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Upsert customer record — match by email if we have one, otherwise by phone
  let existingCustomerId: string | null = null;
  if (client_email) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("email", client_email.toLowerCase().trim())
      .maybeSingle();
    existingCustomerId = data?.id ?? null;
  } else if (client_phone) {
    const { data } = await supabase
      .from("customers")
      .select("id")
      .eq("phone", client_phone)
      .limit(1)
      .maybeSingle();
    existingCustomerId = data?.id ?? null;
  }

  const customerData = {
    name: client_name,
    email: client_email ? client_email.toLowerCase().trim() : null,
    phone: client_phone || null,
    address: client_address || null,
    source: "invoice" as const,
    updated_at: new Date().toISOString(),
  };

  if (existingCustomerId) {
    await supabase.from("customers").update(customerData).eq("id", existingCustomerId);
  } else {
    await supabase.from("customers").insert(customerData);
  }

  return NextResponse.json(data, { status: 201 });
}
