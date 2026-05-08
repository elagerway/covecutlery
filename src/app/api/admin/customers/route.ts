import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

// GET /api/admin/customers — all customers from the customers table
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/customers — add a new customer
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, email, phone, address, notes } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const record: Record<string, unknown> = {
    name,
    phone: phone || null,
    address: address || null,
    notes: notes || null,
    source: "manual",
    updated_at: new Date().toISOString(),
  };
  if (email) record.email = email.toLowerCase().trim();

  let data, error;
  if (email) {
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      ({ data, error } = await supabase
        .from("customers")
        .update(record)
        .eq("id", existing.id)
        .select()
        .single());
    } else {
      ({ data, error } = await supabase
        .from("customers")
        .insert(record)
        .select()
        .single());
    }
  } else {
    ({ data, error } = await supabase
      .from("customers")
      .insert(record)
      .select()
      .single());
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
