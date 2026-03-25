import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateStaticParams() {
  const { data } = await getSupabase()
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");
  return (data ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getSupabase()
    .from("blog_posts")
    .select("title, meta_description, featured_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return {};
  return {
    title: `${post.title} | Cove Cutlery`,
    description: post.meta_description ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.meta_description ?? undefined,
      images: post.featured_image_url ? [post.featured_image_url] : undefined,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Vancouver",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: post } = await getSupabase()
    .from("blog_posts")
    .select("title, content, excerpt, featured_image_url, published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.featured_image_url ? { image: post.featured_image_url } : {}),
    datePublished: post.published_at ?? new Date().toISOString(),
    dateModified: post.published_at ?? new Date().toISOString(),
    author: { '@type': 'Organization', name: 'Cove Cutlery', url: 'https://covecutlery.ca' },
    publisher: { '@type': 'Organization', name: 'Cove Cutlery', url: 'https://covecutlery.ca' },
    description: post.excerpt || `Read ${post.title} on Cove Cutlery`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://covecutlery.ca/blog/${slug}` },
  }

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://covecutlery.ca' },
    { name: 'Blog', url: 'https://covecutlery.ca/blog' },
    { name: post.title, url: `https://covecutlery.ca/blog/${slug}` },
  ])

  return (
    <main className="min-h-screen py-20 px-6" style={{ backgroundColor: "#0D1117" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm mb-10 hover:opacity-80 transition-opacity"
          style={{ color: "#D4A017" }}
        >
          ← All posts
        </Link>

        {post.featured_image_url && (
          <img
            src={post.featured_image_url}
            alt={post.title}
            className="w-full rounded-xl mb-8 object-cover"
            style={{ maxHeight: 400 }}
          />
        )}

        {post.published_at && (
          <p className="text-sm mb-3" style={{ color: "#6B7280" }}>
            {formatDate(post.published_at)}
          </p>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
          {post.title}
        </h1>

        <div
          className="prose prose-invert max-w-none text-sm leading-relaxed"
          style={{ color: "#9CA3AF" }}
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </div>
    </main>
  );
}
