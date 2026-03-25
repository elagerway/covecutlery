import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount_charged, status, notes, payment_method } = await req.json();

  const updates: Record<string, unknown> = {};
  if (amount_charged !== undefined) updates.amount_charged = amount_charged;
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (payment_method !== undefined) updates.payment_method = payment_method;

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
