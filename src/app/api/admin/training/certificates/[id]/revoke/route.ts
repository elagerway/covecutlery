import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = getServiceClient();

  const { data: cert, error } = await supabase
    .from("certificates")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!cert) return NextResponse.json({ error: "Certificate not found" }, { status: 404 });

  return NextResponse.json({ certificate: cert });
}
