"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (!res.ok) { alert("Delete failed. Please try again."); return; }
    router.refresh();
  }

  async function handleToggleStatus(post: Post) {
    setTogglingId(post.id);
    const newStatus = post.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setTogglingId(null);
    if (!res.ok) { alert("Status update failed. Please try again."); return; }
    router.refresh();
  }

  if (posts.length === 0) {
    return (
      <div
        className="rounded-xl border p-12 text-center"
        style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}
      >
        <p style={{ color: "#6B7280" }}>No posts yet.</p>
        <Link
          href="/admin/blog/new"
          className="inline-block mt-4 text-sm font-medium hover:opacity-80"
          style={{ color: "#D4A017" }}
        >
          Create your first post →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#30363D" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Title</th>
            <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Status</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: "#6B7280" }}>Published</th>
            <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: "#6B7280" }}>Created</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {posts.map((post, i) => (
            <tr
              key={post.id}
              style={{
                backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                borderBottom: i < posts.length - 1 ? "1px solid #30363D" : undefined,
              }}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-white">{post.title}</div>
                <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>/blog/{post.slug}</div>
              </td>
              <td className="px-4 py-3">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  style={
                    post.status === "published"
                      ? { backgroundColor: "#16A34A22", color: "#4ADE80" }
                      : { backgroundColor: "#6B728022", color: "#9CA3AF" }
                  }
                >
                  {post.status}
                </span>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "#6B7280" }}>
                {formatDate(post.published_at)}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell" style={{ color: "#6B7280" }}>
                {formatDate(post.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 justify-end">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-white/5"
                    style={{ borderColor: "#30363D", color: "#FFFFFF" }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleToggleStatus(post)}
                    disabled={togglingId === post.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-white/5 disabled:opacity-50"
                    style={{ borderColor: "#30363D", color: post.status === "published" ? "#9CA3AF" : "#D4A017" }}
                  >
                    {togglingId === post.id ? "…" : post.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-red-900/20 disabled:opacity-50"
                    style={{ borderColor: "#30363D", color: "#F87171" }}
                  >
                    {deletingId === post.id ? "…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
