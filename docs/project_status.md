# Project Status

**Last updated:** 2026-04-08

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

**Pending manual step:**
- [ ] Add Supabase Auth redirect URLs in dashboard (localhost + covecutlery.ca)

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

## Milestone 4 — Customer Portal 🔜 Planned

- [ ] Customer accounts (Supabase Auth)
- [ ] Order history
- [ ] Loyalty program
- [ ] SMS/email reminders
