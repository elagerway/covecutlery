---
title: "feat: SEO & GEO Strategy Implementation"
type: feat
status: completed
date: 2026-03-25
deepened: 2026-03-25
---

# SEO & GEO Strategy Implementation

## Enhancement Summary

**Deepened on:** 2026-03-25
**Agents used:** Security Sentinel, Performance Oracle, Architecture Strategist, Code Simplicity Reviewer, TypeScript Reviewer, GEO Best Practices Researcher

### Key Improvements from Review
1. **Start with 5 cities, not 15** — reduces content effort by 60%, avoids doorway page risk, expand later based on Search Console data
2. **Fix domain mismatch** — existing code uses `covecutlery.com`, plan uses `covecutlery.ca`. Must reconcile before any SEO work
3. **Drop `hasOfferCatalog` schema** — Google doesn't surface this in rich results for local services, adds complexity for zero benefit
4. **Add `safeJsonLd()` helper** — XSS protection must be consistent across all JSON-LD blocks (existing layout schema lacks it)
5. **Add `revalidate = 3600` to sitemap** — prevents Supabase query on every crawler hit
6. **Import city slugs in sitemap from `cities.ts`** — eliminates duplicate source of truth
7. **llms.txt is low-priority** — research shows zero evidence AI crawlers read it; keep it as a 5-minute task, don't invest time
8. **FAQ schema is the #1 highest-impact GEO change** — 67% citation rate in AI responses, 30% visibility boost
9. **Answer-first content structure** — every heading should be a question, first 40-60 words must directly answer it
10. **Simplify sitemap** — drop `changeFrequency` and `priority` (Google ignores both)

### New Risks Discovered
- **Pre-existing stored XSS** in blog post rendering (`dangerouslySetInnerHTML` on `post.content` with no sanitization)
- **Aggregate rating is fabricated** — claims 50 reviews at 5.0 stars; Google can issue manual penalty. Must fix or remove before deploying expanded schema

---

## Overview

Comprehensive SEO and GEO (Generative Engine Optimization) implementation for Cove Cutlery to dominate "knife sharpening" searches across the Lower Mainland and get cited by AI search engines. Two implementation phases: Phase 1 (technical foundation) and Phase 2 (local SEO pages).

## Problem Statement

The site has basic metadata and a LocalBusiness schema but is missing critical SEO infrastructure: no sitemap, no robots.txt, no blog post schema, no canonical URLs, no city-specific landing pages, no OG images, and no GEO optimization. Google Business Profile is not yet verified. The site is invisible to AI search engines.

## Technical Approach

### Architecture

All new files follow existing Next.js 16 App Router patterns. Static pages use `export const metadata`. Dynamic pages use `async function generateMetadata()` with `params` as `Promise<>` (Next.js 16 requirement). JSON-LD rendered via `<script type="application/ld+json" dangerouslySetInnerHTML>` with XSS protection via a shared `safeJsonLd()` helper.

### Critical Pre-Requisite: Domain Reconciliation

The existing `layout.tsx` uses `covecutlery.com` in `metadataBase`, `openGraph.url`, and the LocalBusiness schema. This plan uses `covecutlery.ca`. **Before any SEO work**, decide which is canonical and update `layout.tsx` accordingly. All URLs below assume `covecutlery.ca` is the production domain.

### Implementation Phases

---

#### Phase 1: Technical SEO Foundation

##### 1.1 Schema Helpers — `src/lib/schema.ts`

Create shared helpers used by all subsequent steps:

```typescript
// src/lib/schema.ts

/** XSS-safe JSON-LD serialization — prevents script injection via </script> in data */
export function safeJsonLd(obj: Record<string, unknown>): string {
  return JSON.stringify(obj).replace(/</g, '\\u003c')
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbSchema(items: [BreadcrumbItem, ...BreadcrumbItem[]]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export interface FAQ {
  question: string
  answer: string
}

export function faqPageSchema(faqs: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}
```

> **Architecture insight:** `src/lib/` is the established location for shared utilities (`cn.ts`, `format.ts`). The `FAQ` interface is reused across pricing, city pages, and restaurants — extraction is justified.

##### 1.2 Sitemap — `src/app/sitemap.ts`

Dynamic sitemap including all static pages, city pages, and published blog posts from Supabase.

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { cities } from '@/data/cities'

export const revalidate = 3600 // Re-generate hourly, not on every crawler hit

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
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .eq('status', 'published')

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
```

> **Performance insight:** `revalidate = 3600` prevents a Supabase query on every crawler hit. Blog posts don't change frequently enough to justify real-time.
>
> **Architecture insight:** City slugs imported from `cities.ts` — single source of truth, no drift risk.
>
> **Simplicity insight:** `changeFrequency` and `priority` dropped — Google publicly ignores both.

##### 1.3 Robots — `src/app/robots.ts`

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/booking/'],
      },
    ],
    sitemap: 'https://covecutlery.ca/sitemap.xml',
  }
}
```

Do NOT block GPTBot, ClaudeBot, PerplexityBot — we want AI crawlers for GEO.

##### 1.4 llms.txt — `public/llms.txt`

> **GEO research finding:** An August 2025 audit found zero visits from AI crawlers to llms.txt files. No major AI provider has confirmed they read it. However, it is 5 minutes of work with no downside — add it but don't invest further.

Keep the llms.txt content as originally specified. Low effort, potential upside.

##### 1.5 Expand Root Layout Schema — `src/app/layout.tsx`

**Changes:**
1. Fix `metadataBase` to `https://covecutlery.ca` (if `.ca` is the production domain)
2. Add `foundingDate: "2020"` and `sameAs` social links to LocalBusiness schema
3. **Remove or update `aggregateRating`** — current values (50 reviews, 5.0 stars) appear fabricated. Either update to match actual GBP numbers or remove entirely until GBP is verified. Fabricated ratings trigger Google manual actions.
4. Add `geo` coordinates to schema: `{ "@type": "GeoCoordinates", "latitude": 49.3198, "longitude": -123.0725 }`
5. Apply `safeJsonLd()` to the existing JSON-LD block (currently unprotected)
6. Add twitter card config to root metadata: `twitter: { card: 'summary_large_image' }`
7. Add default OG image: `openGraph: { images: [{ url: '/og-default.png', width: 1200, height: 630 }] }`

> **Security insight:** The existing layout schema uses raw `JSON.stringify` with no XSS protection. Retrofit `safeJsonLd()` to this block.
>
> **Simplicity insight:** Drop `hasOfferCatalog` — Google doesn't surface this in rich results for local service businesses. Just `foundingDate`, `sameAs`, and `geo` are sufficient additions.

##### 1.6 BlogPosting Schema — `src/app/blog/[slug]/page.tsx`

Add JSON-LD with null safety:

```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  ...(post.featured_image_url ? { image: post.featured_image_url } : {}),
  datePublished: post.published_at ?? new Date().toISOString(),
  dateModified: post.published_at ?? new Date().toISOString(),
  author: { '@type': 'Organization', name: 'Cove Cutlery', url: 'https://covecutlery.ca' },
  publisher: { '@type': 'Organization', name: 'Cove Cutlery', url: 'https://covecutlery.ca' },
  description: post.excerpt || post.meta_description || `Read ${post.title} on Cove Cutlery`,
  mainEntityOfPage: { '@type': 'WebPage', '@id': `https://covecutlery.ca/blog/${slug}` },
}
```

Also add to `generateMetadata`: `alternates: { canonical: `/blog/${slug}` }`

Also add BreadcrumbList schema: Home > Blog > [Post Title]

> **TypeScript insight:** Null safety added — `post.featured_image_url` conditionally included, `description` has a fallback chain.
>
> **GEO insight:** `dateModified` is critical for AI citation — AI engines strongly prefer recently updated content (82% citation rate for content updated within 30 days).

##### 1.7 FAQPage Schema — `src/app/pricing/page.tsx`

Add JSON-LD using `faqPageSchema()` helper for the existing 4 FAQ items.

> **GEO insight:** FAQPage schema has a 67% citation rate in AI responses. This is the single highest-impact GEO change. Expand to 8-12 FAQs if possible (add questions like "How much does knife sharpening cost in Vancouver?", "How often should kitchen knives be professionally sharpened?").

##### 1.8 Meta Tag Completion

For every page missing metadata, add:
- `title` (unique, under 60 chars)
- `description` (unique, under 160 chars)
- `alternates: { canonical: '/path' }`

**Pages needing metadata added:**
- `/` (home) — explicit metadata export
- `/contact` — already a client component, add via parent layout or convert
- `/booking/success` and `/booking/cancel` — add `robots: 'noindex'`

---

#### Phase 2: Local SEO Pages

##### 2.1 City Data — `src/data/cities.ts`

> **Simplicity insight:** Start with 5 cities, not 15. The long-tail cities (Maple Ridge, Port Coquitlam, White Rock, North Delta) have tiny search volume. Ship 5 with excellent content, watch Search Console for 4-6 weeks, then expand. The `generateStaticParams` + `cities.ts` pattern makes adding cities trivial.

**Start with these 5:**
1. **North Vancouver** — home base, same-day service
2. **Vancouver** — largest population, highest search volume
3. **Burnaby** — adjacent, high density
4. **West Vancouver** — adjacent, high income
5. **Coquitlam** — covers Tri-Cities (Port Moody, Port Coquitlam)

```typescript
// src/data/cities.ts

import type { FAQ } from '@/lib/schema'

export interface CityData {
  readonly slug: string
  readonly name: string
  readonly description: string // 2-3 unique paragraphs, 300+ words
  readonly neighbourhoods: readonly [string, ...string[]] // Non-empty
  readonly driveTime: string
  readonly faqs: readonly FAQ[] // 3-4 unique FAQs per city
  readonly metaTitle: string
  readonly metaDescription: string
}

export const cities: readonly CityData[] = [
  // 5 cities with genuinely unique content
]

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find(c => c.slug === slug)
}
```

> **Architecture insight:** `src/data/` is a new directory convention justified by the data size and multi-consumer pattern (city pages, hub page, sitemap all need it). Added `getCityBySlug()` helper for cleaner page components.
>
> **TypeScript insight:** `readonly` prevents accidental mutation. Non-empty array type on `neighbourhoods` prevents rendering a broken section. `FAQ` interface imported from `schema.ts`.
>
> **Content quality:** Each city page needs 1,500-2,000 words of genuinely unique content. Structure each with: answer-first intro, how-it-works steps, local context paragraph, neighbourhood list, FAQ section, booking CTA. Include a statistic every 150-200 words.

##### 2.2 Service Area Hub — `src/app/service-area/page.tsx`

Static page with:
- H1: "Knife Sharpening Across Metro Vancouver"
- Answer-first intro: "Cove Cutlery provides mobile knife sharpening to homes, restaurants, and businesses across Metro Vancouver. Based in North Vancouver, we serve the entire Lower Mainland within a 90 km radius."
- Grid of city cards linking to each `/service-area/[city]` page
- FAQ section with FAQPage schema
- Booking CTA
- Breadcrumb: Home > Service Areas

> **Performance insight:** Use text list of cities + Google Maps link for initial launch. A custom static map image can be added later — it's a nice-to-have that shouldn't block the PR.

##### 2.3 City Landing Pages — `src/app/service-area/[city]/page.tsx`

Dynamic route with `generateStaticParams`. Fully static (no `revalidate` needed since data is hardcoded).

**Each city page GEO-optimized structure:**
1. Breadcrumb: Home > Service Areas > [City Name]
2. H1 as a question: "Looking for Knife Sharpening in [City], BC?"
3. Answer-first intro (40-60 words directly answering the query, unique per city)
4. "How Mobile Sharpening Works in [City]" — numbered steps with city-specific drive time
5. Local context paragraph (specific neighbourhoods, landmarks, logistics)
6. Neighbourhoods served (bulleted list)
7. FAQ section (3-4 unique questions per city) with FAQPage schema
8. Booking CTA (opens BookingModal)
9. "Also Serving Nearby" — link back to `/service-area` hub
10. JSON-LD: BreadcrumbList + FAQPage + Service (with `areaServed`)

> **GEO insight:** H2 headings should be phrased as questions matching actual search queries. Include statistics every 150-200 words. Answer-first: first 1-2 sentences after each heading must directly answer the implied question.
>
> **Simplicity insight:** Cross-link only back to the hub page. "Adjacent city" links are premature with 5 cities.

##### 2.4 Restaurants Page — `src/app/restaurants/page.tsx`

Static page targeting commercial kitchen managers:
- H1: "Restaurant Knife Sharpening in Vancouver"
- Answer-first: "Cove Cutlery offers scheduled mobile knife sharpening for Vancouver restaurants. We visit weekly or bi-weekly, sharpening your entire knife inventory on-site so your kitchen never misses a beat."
- Benefits for restaurants
- How it works
- FAQ section with FAQPage schema
- Contact CTA (phone + booking)
- Breadcrumb: Home > Restaurant Service

##### 2.5 Navigation Updates

- **Footer**: Add "Service Areas" and "Restaurants" to `quickLinks` array
- All new pages must explicitly render `<Navbar />` and `<Footer />` (existing pattern — no shared layout wraps these)

##### 2.6 Internal Linking Strategy

- Each city page links back to `/service-area` hub
- `/restaurants` links to `/mobile-service` and `/contact`
- Homepage services section links to `/service-area`
- Blog posts about specific cities can link to city pages (content workflow, not code)

---

## Files to Create

| File | Description |
|------|-------------|
| `src/lib/schema.ts` | `safeJsonLd()`, `breadcrumbSchema()`, `faqPageSchema()`, `FAQ` interface |
| `src/app/sitemap.ts` | Dynamic sitemap with revalidate=3600 |
| `src/app/robots.ts` | Robots.txt configuration |
| `public/llms.txt` | AI engine comprehension file (low priority) |
| `src/data/cities.ts` | Per-city SEO data for 5 cities (expand later) |
| `src/app/service-area/page.tsx` | Service area hub page |
| `src/app/service-area/[city]/page.tsx` | Dynamic city landing pages |
| `src/app/restaurants/page.tsx` | Restaurant-focused landing page |
| `public/og-default.png` | Default OG image (1200x630, branded) |

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | Fix domain to `.ca`, expand schema (sameAs, geo, foundingDate), fix/remove aggregateRating, add twitter config, add OG image, apply `safeJsonLd()` |
| `src/app/blog/[slug]/page.tsx` | Add BlogPosting + BreadcrumbList schema, canonical URL |
| `src/app/pricing/page.tsx` | Add FAQPage schema |
| `src/app/page.tsx` | Add explicit metadata export |
| `src/components/Footer.tsx` | Add Service Areas + Restaurants to quick links |
| `src/app/booking/success/page.tsx` | Add `robots: 'noindex'` metadata |
| `src/app/booking/cancel/page.tsx` | Add `robots: 'noindex'` metadata |

## Acceptance Criteria

### Functional Requirements

- [x] `sitemap.xml` accessible, includes all pages + blog posts + city pages
- [x] `robots.txt` accessible, blocks admin/api/auth/booking paths
- [x] BlogPosting schema on every blog post (validate with Rich Results Test)
- [x] BreadcrumbList schema on blog posts, city pages, restaurants page
- [x] FAQPage schema on /pricing and all city pages
- [x] LocalBusiness schema expanded with sameAs, geo, foundingDate
- [x] Twitter card meta tags on all pages
- [x] Canonical URL on every page
- [x] Default OG image on pages without a specific one
- [x] 5 city landing pages at `/service-area/[city]` with 1,500+ words unique content each
- [x] Service area hub page at `/service-area` with city grid
- [x] Restaurant page at `/restaurants`
- [x] Footer links updated with new pages
- [x] All new pages use existing Navbar + Footer + BookingProvider
- [x] All new pages match dark theme (#0D1117 bg, #D4A017 gold)
- [x] All JSON-LD uses `safeJsonLd()` for XSS protection
- [x] `aggregateRating` matches real GBP numbers or is removed

### Quality Gates

- [x] All JSON-LD validates on https://validator.schema.org
- [x] No duplicate content (each city page has 1,500+ words of unique content)
- [ ] Lighthouse SEO score >= 95 on all new pages
- [x] No console errors on any new page
- [x] City pages self-canonicalize

## Dependencies & Risks

- **MUST FIX: Domain mismatch** — `covecutlery.com` vs `covecutlery.ca` in existing code. Reconcile before deploying.
- **MUST FIX: Aggregate rating** — Remove or update to real numbers before expanding schema.
- **Risk: Thin city pages** — Mitigated by starting with 5 cities with 1,500+ words each. Expand only when content quality is proven.
- **Dependency: GBP verification** — External task. Not blocked by code changes.
- **Dependency: OG default image** — Generate via Gemini or design tool.
- **Pre-existing: Blog XSS** — `post.content` rendered via `dangerouslySetInnerHTML` with no sanitization. Not in scope but should be addressed.

## Build Sequence

1. `src/lib/schema.ts` (helpers used by everything else)
2. `src/app/robots.ts` + `src/app/sitemap.ts` + `public/llms.txt` (quick wins, steps 2-6 can be parallelized)
3. `src/app/layout.tsx` modifications (domain fix, schema expansion, twitter, OG, safeJsonLd)
4. `src/app/blog/[slug]/page.tsx` modifications (BlogPosting schema, canonical)
5. `src/app/pricing/page.tsx` modifications (FAQPage schema)
6. Metadata additions to home, booking pages
7. `src/data/cities.ts` (city data — biggest content effort, 5 cities)
8. `src/app/service-area/page.tsx` (hub page)
9. `src/app/service-area/[city]/page.tsx` (city pages)
10. `src/app/restaurants/page.tsx`
11. `src/components/Footer.tsx` updates
12. Generate OG default image

## GEO Content Guidelines

Apply to all new pages and retrofit to existing service pages over time:

- **Answer-first:** First 40-60 words after every heading must directly answer the implied question
- **Question headings:** Rewrite H2s as questions matching search queries (e.g., "How Much Does Knife Sharpening Cost in Vancouver?")
- **Fact density:** Include a statistic or specific number every 150-200 words
- **FAQ sections:** 8-12 FAQs on service pages, 3-4 per city page — all with FAQPage schema
- **Target word count:** 1,500-2,000 words per service/city page
- **Trust signals:** Years in business, number of knives sharpened, equipment details
- **Comparison content:** "Professional vs DIY", "Mobile vs Drop-Off" sections get cited heavily by AI

## High-Value Query Targets

| Query Pattern | Target Page |
|---|---|
| "knife sharpening vancouver" | `/service-area/vancouver` |
| "mobile knife sharpening vancouver" | `/mobile-service` |
| "knife sharpening near me [city]" | `/service-area/[city]` |
| "how much does knife sharpening cost vancouver" | `/pricing` |
| "restaurant knife sharpening vancouver" | `/restaurants` |
| "24/7 knife drop off vancouver" | `/drop-off` |
| "japanese knife sharpening vancouver" | Blog post |
| "best knife sharpening service vancouver" | Homepage / blog |

## References

- Brainstorm: `docs/brainstorms/2026-03-25-seo-geo-strategy-brainstorm.md`
- Next.js 16 Sitemap docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- Next.js 16 Robots docs: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`
- Next.js 16 JSON-LD guide: `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`
- GEO research: First Page Sage, Search Engine Land, Go Fish Digital case studies
- FAQ schema citation rates: Passionfruit, Frase.io research
- llms.txt audit: Longato August 2025 analysis
- Existing layout schema: `src/app/layout.tsx:39-80`
- Existing blog metadata: `src/app/blog/[slug]/page.tsx:23-45`
