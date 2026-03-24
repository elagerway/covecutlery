"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_description: string;
  featured_image_url: string;
  status: "draft" | "published";
}

interface PostFormProps {
  initialData?: Post;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const inputClass = "w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none transition-colors";
const inputStyle = { backgroundColor: "#0D1117", border: "1px solid #30363D" };
const labelClass = "block text-xs font-medium mb-1.5";
const labelStyle = { color: "#6B7280" };

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [form, setForm] = useState<Post>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    content: initialData?.content ?? "",
    excerpt: initialData?.excerpt ?? "",
    meta_description: initialData?.meta_description ?? "",
    featured_image_url: initialData?.featured_image_url ?? "",
    status: initialData?.status ?? "draft",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setForm((f) => ({
      ...f,
      title,
      slug: slugManuallyEdited ? f.slug : toSlug(title),
    }));
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugManuallyEdited(true);
    setForm((f) => ({ ...f, slug: e.target.value }));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent, submitStatus?: "draft" | "published") {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { ...form, status: submitStatus ?? form.status };
    const url = isEdit ? `/api/admin/posts/${initialData!.id}` : "/api/admin/posts";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Save failed.");
      setSaving(false);
      return;
    }

    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-3xl">
      {/* Title */}
      <div>
        <label className={labelClass} style={labelStyle}>Title <span style={{ color: "#D4A017" }}>*</span></label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleTitleChange}
          required
          placeholder="Post title"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass} style={labelStyle}>Slug <span style={{ color: "#D4A017" }}>*</span></label>
        <input
          type="text"
          name="slug"
          value={form.slug}
          onChange={handleSlugChange}
          required
          placeholder="post-slug"
          className={inputClass}
          style={inputStyle}
        />
        <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
          /blog/{form.slug || "…"}
        </p>
      </div>

      {/* Featured Image URL */}
      <div>
        <label className={labelClass} style={labelStyle}>Featured Image URL</label>
        <input
          type="url"
          name="featured_image_url"
          value={form.featured_image_url}
          onChange={handleChange}
          placeholder="https://…"
          className={inputClass}
          style={inputStyle}
        />
        {form.featured_image_url && (
          <img
            src={form.featured_image_url}
            alt="Preview"
            className="mt-2 rounded-lg object-cover"
            style={{ maxHeight: 160, border: "1px solid #30363D" }}
          />
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Excerpt <span style={{ color: "#6B7280" }}>({form.excerpt.length}/160)</span>
        </label>
        <textarea
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          rows={2}
          maxLength={160}
          placeholder="Brief summary shown in post listings…"
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Meta Description */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Meta Description <span style={{ color: "#6B7280" }}>({form.meta_description.length}/160)</span>
        </label>
        <textarea
          name="meta_description"
          value={form.meta_description}
          onChange={handleChange}
          rows={2}
          maxLength={160}
          placeholder="SEO description for search engines…"
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      {/* Content */}
      <div>
        <label className={labelClass} style={labelStyle}>Content</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={20}
          placeholder="Write your post content here…"
          className={inputClass}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "monospace", fontSize: 13 }}
        />
        <p className="text-xs mt-1" style={{ color: "#6B7280" }}>HTML is supported.</p>
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ backgroundColor: "#F871711A", color: "#F87171" }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "draft")}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all hover:bg-white/5 disabled:opacity-50"
          style={{ borderColor: "#30363D", color: "#FFFFFF" }}
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e as unknown as React.FormEvent, "published")}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          {saving ? "Saving…" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-5 py-2.5 rounded-lg text-sm font-medium transition-colors hover:text-white ml-auto"
          style={{ color: "#6B7280" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
