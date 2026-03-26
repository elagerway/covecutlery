import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | Cove Cutlery",
  description: "Tips, techniques, and news from Vancouver's professional cutlery sharpening service.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Vancouver",
  });
}

export default async function BlogPage() {
  const supabase = getSupabase();
  let posts: { title: string; slug: string; excerpt: string | null; featured_image_url: string | null; published_at: string | null }[] | null = null;

  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, featured_image_url, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    posts = data;
  }

  return (
    <main className="min-h-screen py-20 px-6" style={{ backgroundColor: "#0D1117" }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Blog</h1>
          <div className="h-px w-16" style={{ backgroundColor: "#D4A017", opacity: 0.5 }} />
        </div>

        {(!posts || posts.length === 0) ? (
          <p style={{ color: "#6B7280" }}>No posts yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border overflow-hidden flex flex-col transition-all hover:border-yellow-600/50"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                {post.featured_image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  {post.published_at && (
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      {formatDate(post.published_at)}
                    </p>
                  )}
                  <h2 className="text-lg font-semibold text-white leading-snug group-hover:text-yellow-400 transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm leading-relaxed flex-1" style={{ color: "#6B7280" }}>
                      {post.excerpt}
                    </p>
                  )}
                  <span className="text-sm font-medium mt-auto" style={{ color: "#D4A017" }}>
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
