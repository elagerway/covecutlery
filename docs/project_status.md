# Project Status

**Last updated:** 2026-04-10

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
