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
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, slug, content, excerpt, meta_description, featured_image_url, status } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0)
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!slug || typeof slug !== "string" || slug.trim().length === 0)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      title: title.trim(),
      slug: slug.trim(),
      content: content ?? null,
      excerpt: excerpt ?? null,
      meta_description: meta_description ?? null,
      featured_image_url: featured_image_url ?? null,
      status: status === "published" ? "published" : "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
      author_email: ADMIN_EMAIL,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
