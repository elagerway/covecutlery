---
date: 2026-03-25
topic: seo-geo-strategy
---

# SEO & GEO Strategy — Cove Cutlery

## What We're Building

A comprehensive SEO and GEO (Generative Engine Optimization) strategy to make Cove Cutlery the dominant search result — both traditional and AI-powered — for knife sharpening across the Lower Mainland BC. This covers technical SEO foundations, local search dominance, content strategy, and AI engine optimization.

## Current State

**What exists:**
- LocalBusiness JSON-LD schema in layout (name, address, hours, rating)
- Per-page metadata on most pages (title, description)
- Blog section with dynamic metadata from Supabase
- Admin pages properly noindexed
- `.ca` TLD (Canadian signal)

**Critical gaps:**
- No sitemap.ts or robots.txt
- No BlogPosting schema on blog posts
- No OG images (except blog featured images)
- No Twitter card meta tags
- No canonical URLs
- No city-specific landing pages
- Google Business Profile exists but not verified
- No FAQ schema on pricing page
- No breadcrumb schema
- Hard-coded aggregate rating (50 reviews, 5 stars) — not dynamic

## Strategy — 4 Phases

### Phase 1: Technical Foundation (Week 1)

Fix the gaps that prevent Google from properly crawling and understanding the site.

1. **`sitemap.ts`** — Dynamic sitemap including all static pages + all published blog posts (queried from Supabase). Auto-updates on ISR revalidation.

2. **`robots.ts`** — Allow all crawlers, reference sitemap URL, block `/admin/`, `/api/`, `/auth/`.

3. **Schema markup expansion:**
   - `BlogPosting` schema on `/blog/[slug]` — author, datePublished, dateModified, articleBody, image
   - `BreadcrumbList` schema on blog posts and service pages
   - `FAQPage` schema on `/pricing` (common questions about pricing)
   - `Service` schema for each service type (mobile, drop-off)
   - Expand `LocalBusiness` with `sameAs` (social links), `foundingDate: 2020`

4. **Meta tag completion:**
   - Add `twitter:card`, `twitter:title`, `twitter:description` to layout
   - Add explicit `og:image` — either a default branded image or dynamic per-page
   - Add canonical URLs via `alternates.canonical` in metadata
   - Add metadata to pages missing it: `/`, `/contact`, `/booking/*`

5. **Performance audit** — Verify Core Web Vitals (LCP, CLS, INP). Next.js ISR + static pages should score well. Check image optimization (WebP, proper sizing).

### Phase 2: Local SEO (Week 1-2)

Dominate "knife sharpening [city]" for every city in the service area.

1. **Google Business Profile:**
   - Verify the profile (priority #1 — can't rank in Maps/Local Pack without it)
   - Complete all fields: categories (Knife Sharpening Service, Tool & Knife Sharpening), attributes, service area, photos
   - Add services with prices
   - Post weekly updates (sharpening tips, before/after photos)
   - Respond to all reviews
   - Add booking link directly to GBP

2. **NAP consistency** — Ensure Name, Address, Phone are identical everywhere:
   - Website (footer, contact, JSON-LD)
   - Google Business Profile
   - Yelp, Yellow Pages, Bing Places, Apple Maps
   - Facebook, Instagram bios

3. **Local citations** — Submit to:
   - Yelp.ca
   - Yellow Pages Canada
   - Bing Places
   - Apple Maps Connect
   - Better Business Bureau (BC)
   - Vancouver local business directories
   - North Shore business associations

4. **City landing pages** — Create `/service-area/[city]` pages for each major city:
   - `/service-area/north-vancouver`
   - `/service-area/vancouver`
   - `/service-area/burnaby`
   - `/service-area/surrey`
   - `/service-area/coquitlam`
   - `/service-area/richmond`
   - `/service-area/new-westminster`
   - `/service-area/west-vancouver`
   - `/service-area/port-moody`
   - `/service-area/langley`
   - `/service-area/delta`
   - `/service-area/maple-ridge`
   - `/service-area/port-coquitlam`
   - `/service-area/white-rock`
   - `/service-area/north-delta`

   Each page: unique content about serving that city, mention neighbourhoods, local landmarks, drive time from home base, booking CTA. NOT thin duplicate content — each genuinely different.

5. **Service Area page** — `/service-area` hub page with a map showing the 90km radius, linking to all city pages. This becomes the parent for breadcrumbs.

### Phase 3: Content Strategy (Weeks 2-4)

Blog content that targets long-tail keywords and establishes expertise for GEO.

**Pillar content (high-value, evergreen):**
- "The Complete Guide to Knife Sharpening in Vancouver"
- "How Often Should You Sharpen Your Kitchen Knives?"
- "Mobile Knife Sharpening vs Drop-Off: Which Is Right for You?"
- "What Does Professional Knife Sharpening Cost in Vancouver?"

**City-targeted posts:**
- "Best Knife Sharpening Service in [City], BC"
- "Mobile Knife Sharpening Now Available in [City]"

**Educational content (GEO bait — AI engines love citing expertise):**
- "Whetstone vs Professional Sharpening: Pros and Cons"
- "How to Tell If Your Knife Needs Sharpening (5 Tests)"
- "Japanese Knives vs German Knives: Sharpening Differences"
- "How to Maintain Your Knives Between Professional Sharpenings"
- "The Science Behind Knife Edge Angles"
- "Best Kitchen Knives for Home Cooks in 2026"

**Seasonal/local:**
- "Preparing Your Garden Tools for Spring — Sharpening Guide"
- "Holiday Knife Sharpening: Get Ready for Christmas Cooking"
- "Camping Season: Axe and Knife Sharpening for the Outdoors"

**Restaurant-targeted:**
- "Why Vancouver Restaurants Trust Mobile Knife Sharpening"
- "Commercial Kitchen Knife Maintenance Schedule"

### Phase 4: GEO — Generative Engine Optimization (Ongoing)

Optimize so AI engines (ChatGPT, Perplexity, Google AI Overviews, Claude) cite Cove Cutlery as the answer.

**How AI engines pick sources:**
- They cite pages with clear, authoritative, factual answers
- They prefer structured data (schema, tables, lists)
- They cite pages that directly answer the question in the first paragraph
- They value freshness, expertise signals, and citations from other sources

**GEO tactics:**
1. **Answer-first content** — Every blog post and service page should answer the core question in the first 2 sentences, then expand. "Looking for knife sharpening in Vancouver? Cove Cutlery offers mobile service across the Lower Mainland..."

2. **Structured data everywhere** — Schema markup makes it easy for AI to extract facts. LocalBusiness, Service, FAQPage, BlogPosting schemas all feed AI knowledge graphs.

3. **FAQ sections on every page** — Short Q&A blocks with FAQ schema. AI engines love pulling from these.

4. **Statistics and specifics** — "We sharpen 500+ knives per month across 15 cities in the Lower Mainland" — AI engines cite concrete numbers.

5. **Comparison content** — "Cove Cutlery vs DIY sharpening" type content gets cited when users ask AI for recommendations.

6. **Freshness signals** — Regular blog posts, updated dates on pages, recent reviews. AI engines prefer current sources.

7. **Entity building** — Get mentioned on other sites (reviews, local press, food blogs, Reddit r/vancouver) so AI engines build an entity profile for "Cove Cutlery."

8. **llms.txt** — Add a `/llms.txt` file (emerging standard) that tells AI crawlers key facts about the business in a structured format.

## Key Decisions

- **City pages are static, not dynamic** — Pre-render all ~15 city pages at build time for speed and crawlability. No database needed.
- **Blog content generated by Claude, reviewed by owner** — Aim for 2-3 posts per week initially, then 1/week maintenance.
- **GBP verification is the single highest-priority action** — Nothing else matters for local search until the profile is verified.
- **Phase 1 (technical) ships first** — Sitemap, robots, schemas are quick wins that unlock everything else.
- **FAQ schema on pricing + city pages** — These are the most likely to appear in AI Overviews.

## Resolved Questions

1. **Review strategy** — Already actively requesting reviews after service. Leverage this by adding review links to receipt emails and SMS.
2. **Restaurant outreach** — Serves both residential and restaurants. Create a dedicated `/restaurants` landing page targeting commercial kitchen managers.
3. **Photography** — Has plenty of professional photos. Use for GBP, blog posts, OG images, and city landing pages.

4. **Budget for local citations** — Free listings only. Focus on Google, Yelp (free), Bing Places, Apple Maps, Yellow Pages Canada.

## Next Steps

→ `/workflows:plan` to create the implementation plan with exact file contents
