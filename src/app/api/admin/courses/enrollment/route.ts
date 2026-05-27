import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function GET() {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("courses")
    .select("id, title, slug, price, enrollment_open, active")
    .order("order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, enrollment_open } = await req.json();
  if (!slug || typeof enrollment_open !== "boolean") {
    return NextResponse.json({ error: "slug and enrollment_open required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("courses")
    .update({ enrollment_open })
    .eq("slug", slug);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
