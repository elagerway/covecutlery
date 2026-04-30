# Project Status

**Last updated:** 2026-04-30

## Milestone 4 — Brand rebrand: Cove Cutlery → Cove Blades ✅ Complete

Site fully rebranded and live at the new domain.

- [x] Brand sweep across UI, metadata, JSON-LD, OpenGraph, manifest, llms.txt, project_spec, active docs (~200 string replacements across 41 files)
- [x] Production domain switched: `covecutlery.ca` → `coveblades.com`
- [x] DNS flipped (apex A → 216.150.1.1, www CNAME → vercel-dns); SSL issued by Let's Encrypt; cert valid through 2026-07-28
- [x] Vercel project domains: `coveblades.com` apex (canonical) + `www.coveblades.com` (308 → apex) + `staging.coveblades.com` (preview)
- [x] Email: `info@coveblades.com` and `pay@coveblades.com` via Postmark (verified)
- [x] SMS: `+16042108180` provisioned in Magpipe; `MAGPIPE_SMS_FROM` + `ADMIN_PHONE` aligned
- [x] Display phone changed to `604-210-8180` everywhere
- [x] Social handles → `@coveblades` (Instagram, Facebook, YouTube)
- [x] Google Business Profile linked into LocalBusiness `sameAs`
- [x] Supabase Auth redirect URLs updated for new domain (kept legacy for transition)
- [x] Vercel project + GitHub repo intentionally NOT renamed (still `covecutlery` internally)
- [x] Legacy `covecutlery.ca` continues to serve — retire later

## Milestone 5 — Citywide SEO/GEO expansion ✅ Complete

17-city Lower Mainland coverage with unique local content per page.

- [x] Phases 1–6 (commits 519c0f0 → 2b5ed26)
- [x] Service radius bumped 90 km → 105 km (covers Chilliwack)
- [x] All 17 cities flagged mobile-only outside North Vancouver via `dropOffEmphasis: false`
- [x] Service-area hub regrouped by sub-region (North Shore, Vancouver, Burnaby & New West, Tri-Cities, South of Fraser, Fraser Valley)
- [x] Each city page: unique 3-paragraph local content, 4 city-specific FAQs, neighbourhood list, drive-time, meta tags
- [x] Drive-distance-aware mobile minimums (Abbotsford 8 knives, Chilliwack 10 knives)
- [x] Internal linking: "Also serving nearby" related-cities section on each city page
- [x] Schema: per-city Service with neighbourhood `areaServed` array + `hasOfferCatalog` pricing; ItemList + SiteNavigationElement on hub
- [x] Homepage `LocalBusiness.areaServed` now enumerates all 17 cities
- [x] llms.txt expanded with full city inventory
- [x] Answer-first H2 rewrites on city template

## Milestone 6 — Content parity with legacy coveblades.com ✅ Complete

- [x] `/how-we-sharpen-your-knives` (process / methodology)
- [x] `/train-to-be-sharp` (3-module course: One-Inch $600, Two-Inch $400, Business $200)
- [x] `/event-sharpening-service` (on-site for events)
- [x] 3 legacy blog posts imported (how-to-cut-onions, japanese-knife-sharpening, knife-sharpening-on-the-north-shore)
- [x] `/staysharp` 308-redirects to `/blog`
- [x] `<InquiryForm>` shared component with Turnstile
- [x] Validated address requirement on training intake (Google Places autocomplete)

## Milestone 7 — Home page polish + Instagram feed ✅ Complete

- [x] Hero ProMaster van zoom-in animation (right-to-left with tire-smoke trail)
- [x] Instagram feed below hero (live Graph API + in-page modal viewer for image/video/carousel)
- [x] Custom landscape video poster on About section linking to YouTube
- [x] Mon–Sat 10am–7pm hours everywhere (was Mon-Fri Noon-7, Sat Noon-4)
- [x] Footer Snapsonic credit
- [x] Navbar grouped: Services dropdown + 4 top-level links
- [x] Mobile overflow fixes (form padding, pricing card text, social row wrap)
- [x] Blog typography (Tailwind typography plugin)
- [x] Cloudflare Turnstile in `interaction-only` mode (hidden unless challenged)
- [x] Hero pt-24 sm:pt-20 so van clears the fixed navbar on mobile

---

## Time-sensitive follow-ups

- **2026-06-28** — Instagram long-lived access token expires. Refresh via `/oauth/access_token?grant_type=fb_exchange_token` using `INSTAGRAM_APP_SECRET` (already in .env / Vercel env), update `INSTAGRAM_ACCESS_TOKEN`. Or build a refresh button in admin before then.
- **When ready** — Retire `covecutlery.ca`: 301 from apex/www to `coveblades.com`, remove from Vercel project domains, optionally drop the domain.

---



## Milestone 1 — MVP Website ✅ Complete

All pages and components built, deployed to Vercel.

- [x] Next.js project scaffolded
- [x] Tailwind CSS v4, Inter font
- [x] Supabase client + contact_submissions table
- [x] Homepage with all 9 sections
- [x] 5 inner pages (/mobile-service, /pricing, /drop-off, /about, /contact)
- [x] Contact form → Supabase backend
- [x] SEO metadata + JSON-LD structured data
- [x] Navbar (sticky, mobile-responsive)
- [x] Footer (4-col, social icons)
- [x] Vercel deployment live: https://covecutlery.vercel.app
- [x] GitHub repo: https://github.com/elagerway/covecutlery

**Pending:**
- [ ] Visual QA on mobile + desktop (Playwright)
- [ ] Real photos / hero image

---

## Milestone 2 — Booking + Live Schedule ✅ Complete

- [x] Cal.com v2 booking integration (date → time → details modal)
- [x] "Where We'll Be This Week" live schedule section (ISR, Cal.com bookings → city per day)
- [x] Cloudflare Turnstile CAPTCHA on contact forms
- [x] ~~Stripe $50 deposits~~ — removed; bookings confirm directly without payment
- [x] SMS booking confirmations (admin + customer) via Magpipe

## Milestone 3 — Blog + Admin ✅ Complete

- [x] Public blog at `/blog` and `/blog/[slug]` (ISR, Supabase-backed)
- [x] `blog_posts` table with RLS (public read, admin write)
- [x] Supabase magic-link auth restricted to `elagerway@gmail.com`
- [x] Edge middleware protecting all `/admin/**` routes
- [x] Admin post list (with publish/unpublish/delete actions)
- [x] Admin create + edit post forms (auto-slug, draft/publish)
- [x] Blog link in Navbar

- [x] Supabase Auth redirect URLs configured (coveblades.com + www + localhost:3002)

---

## Milestone 3.5 — SEO & GEO Strategy ✅ Complete

- [x] Dynamic sitemap.xml (ISR hourly) with blog posts + city pages
- [x] robots.txt blocking admin/api/auth/booking
- [x] Schema helpers (safeJsonLd, breadcrumb, FAQ)
- [x] BlogPosting + BreadcrumbList schema on blog posts
- [x] FAQPage schema on pricing page
- [x] LocalBusiness schema expanded (sameAs, geo, foundingDate)
- [x] Domain fixed from .com to .ca
- [x] Aggregate rating removed (was fabricated)
- [x] 5 city landing pages (North Vancouver, Vancouver, Burnaby, West Vancouver, Coquitlam)
- [x] Service area hub page
- [x] Restaurant landing page
- [x] Default OG image + Twitter card meta
- [x] Footer updated with new page links
- [x] llms.txt for AI crawlers

**Pending:**
- [ ] Google Business Profile verification
- [ ] Lighthouse SEO audit (target >= 95)
- [ ] Search Console monitoring (4-6 weeks) before expanding to more cities

---

## Milestone 3.7 — Invoice System & Customers Table ✅ Complete

- [x] `customers` table in Supabase (replaces derived-from-bookings approach)
- [x] Customer import from Cal.com (both accounts), macOS Contacts, Google Calendar
- [x] Admin customer list with search, add, edit, delete
- [x] `invoices` table with full CRUD
- [x] Admin invoice creation with customer search, line items, preview
- [x] Public branded invoice view with Stripe + e-Transfer payment
- [x] Mark as Paid for pre-paid invoices
- [x] Work Completed date auto-filled from Cal.com / Google Calendar
- [x] Stripe webhook handles invoice payments
- [x] Invoices link in admin nav

- [x] Email sending via Postmark (with shield logo header)
- [x] SMS sending via Magpipe (updated to v2 API)
- [x] Invoice edit mode (including paid invoices)
- [x] Send popover with editable email/phone
- [x] Save as PDF on public invoice page
- [x] Payment method/time in receipt emails and public view
- [x] Admin nav link in public navbar (auth-gated)
- [x] Shared utilities extracted (lib/admin.ts, lib/format.ts)

**Pending:**
- [ ] macOS Contacts import UI (currently one-time script)
- [ ] Google Calendar API OAuth for live calendar access

---

## Milestone 3.8 — SMS Campaigns & PWA ✅ Complete

- [x] SMS campaign admin tab (`/admin/campaigns`)
- [x] Compose with personalization variables ({{first_name}}, {{name}}, {{phone}})
- [x] Recipient selector with search, source filter, select all
- [x] Manual phone number input for ad-hoc recipients
- [x] Campaign history with delivery stats
- [x] PWA manifest + service worker (installable app)
- [x] Mobile-responsive admin nav (bottom bar + slide-out drawer)
- [x] Mobile-responsive tables (horizontal scroll, stacking forms)
- [x] Viewport meta + theme-color

---

## Milestone 4 — Customer Portal 🔜 Planned

- [ ] Customer accounts (Supabase Auth)
- [ ] Order history
- [ ] Loyalty program
- [ ] SMS/email reminders
