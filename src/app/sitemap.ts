import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { cities } from '@/data/cities'

export const revalidate = 3600

const BASE = 'https://covecutlery.ca'

const STATIC_PAGES = [
  '/', '/about', '/pricing', '/mobile-service', '/drop-off',
  '/contact', '/blog', '/restaurants', '/service-area',
  '/privacy', '/terms',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .eq('status', 'published')

  if (error) console.error('[sitemap] Failed to fetch blog posts:', error.message)

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
