import type { MetadataRoute } from 'next'
import { getSupabase } from '@/lib/supabase'
import { cities } from '@/data/cities'

export const revalidate = 3600

const BASE = 'https://coveblades.com'

const STATIC_PAGES = [
  '/', '/about', '/pricing', '/mobile-service', '/drop-off',
  '/contact', '/blog', '/restaurants', '/service-area',
  '/how-we-sharpen-your-knives', '/train-to-be-sharp',
  '/event-sharpening-service',
  '/privacy', '/terms',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase()
  let posts: { slug: string; published_at: string | null }[] | null = null

  if (supabase) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, published_at')
      .eq('status', 'published')

    if (error) console.error('[sitemap] Failed to fetch blog posts:', error.message)
    posts = data
  }

  return [
    ...STATIC_PAGES.map(path => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
    })),
    ...cities.map(city => ({
      url: `${BASE}/service-area/${city.slug}`,
      lastModified: new Date(),
    })),
    ...(posts ?? []).map(p => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
    })),
  ]
}
