import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Edit Post</h1>
      <PostForm initialData={post} />
    </div>
  );
}
