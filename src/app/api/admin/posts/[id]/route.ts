import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, slug, content, excerpt, meta_description, featured_image_url, status } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0)
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  if (!slug || typeof slug !== "string" || slug.trim().length === 0)
    return NextResponse.json({ error: "slug is required" }, { status: 400 });

  // Fetch existing to handle published_at logic
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const nowPublished = status === "published";
  const wasPublished = existing?.status === "published";
  const published_at = nowPublished
    ? (wasPublished ? existing.published_at : new Date().toISOString())
    : null;

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      title: title.trim(),
      slug: slug.trim(),
      content: content ?? null,
      excerpt: excerpt ?? null,
      meta_description: meta_description ?? null,
      featured_image_url: featured_image_url ?? null,
      status: nowPublished ? "published" : "draft",
      published_at,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  if (status !== "draft" && status !== "published")
    return NextResponse.json({ error: "invalid status" }, { status: 400 });

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", id)
    .single();

  const published_at =
    status === "published"
      ? existing?.status === "published"
        ? existing.published_at
        : new Date().toISOString()
      : null;

  const { data, error } = await supabase
    .from("blog_posts")
    .update({ status, published_at })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
