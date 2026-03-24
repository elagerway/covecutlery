import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import PostTable from "@/components/admin/PostTable";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {posts?.length ?? 0} post{posts?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-95"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          + New Post
        </Link>
      </div>

      {error && (
        <p className="text-sm px-4 py-3 rounded-lg mb-6" style={{ backgroundColor: "#F871711A", color: "#F87171" }}>
          {error.message}
        </p>
      )}

      <PostTable posts={posts ?? []} />
    </div>
  );
}
