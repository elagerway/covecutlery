import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

export async function generateStaticParams() {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data } = await supabase
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
  const supabase = getSupabase();
  if (!supabase) return {};
  const { data: post } = await supabase
    .from("blog_posts")
    .select("title, meta_description, featured_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) return {};
  return {
    title: `${post.title} | Cove Blades`,
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
  const supabase = getSupabase();
  if (!supabase) notFound();
  const { data: post } = await supabase
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
    author: { '@type': 'Organization', name: 'Cove Blades', url: 'https://coveblades.com' },
    publisher: { '@type': 'Organization', name: 'Cove Blades', url: 'https://coveblades.com' },
    description: post.excerpt || `Read ${post.title} on Cove Blades`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://coveblades.com/blog/${slug}` },
  }

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: 'Home', url: 'https://coveblades.com' },
    { name: 'Blog', url: 'https://coveblades.com/blog' },
    { name: post.title, url: `https://coveblades.com/blog/${slug}` },
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
          className="prose prose-invert prose-base sm:prose-lg max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
            prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl sm:prose-h2:text-3xl
            prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl sm:prose-h3:text-2xl
            prose-p:text-[#9CA3AF] prose-p:leading-relaxed
            prose-strong:text-white
            prose-em:text-[#9CA3AF]
            prose-a:text-[#D4A017] prose-a:no-underline hover:prose-a:underline
            prose-li:text-[#9CA3AF] prose-li:leading-relaxed
            prose-ul:my-6 prose-ol:my-6
            prose-blockquote:border-l-[#D4A017] prose-blockquote:text-[#9CA3AF] prose-blockquote:italic
            prose-hr:border-[#30363D]"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
      </div>
    </main>
  );
}
