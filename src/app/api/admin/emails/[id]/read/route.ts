import { NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("emails")
    .update({ status: "read", read_at: new Date().toISOString() })
    .eq("id", numericId)
    .eq("status", "new");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
