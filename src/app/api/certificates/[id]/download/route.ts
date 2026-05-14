import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_EMAILS, getServiceClient } from "@/lib/admin";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ssr = await createClient();
  const { data: { user } } = await ssr.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data: cert } = await supabase
    .from("certificates")
    .select("id, user_id, pdf_path, revoked_at")
    .eq("id", id)
    .single();

  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = cert.user_id === user.id;
  const isAdmin = ADMIN_EMAILS.includes(user.email!);
  if (!isOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: signed, error } = await supabase.storage
    .from("certificates")
    .createSignedUrl(cert.pdf_path, 60);

  if (error || !signed?.signedUrl) {
    return NextResponse.json({ error: error?.message ?? "Sign failed" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl, 302);
}
