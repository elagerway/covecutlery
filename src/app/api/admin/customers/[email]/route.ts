import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email } = await params;
  const { customer_name, customer_phone } = await req.json();

  const updates: Record<string, unknown> = {};
  if (customer_name !== undefined) updates.customer_name = customer_name;
  if (customer_phone !== undefined) updates.customer_phone = customer_phone;

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("customer_email", email)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
