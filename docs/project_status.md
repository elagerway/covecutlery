# Project Status

**Last updated:** 2026-03-24

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
- [x] Stripe $50 deposits for mobile bookings (Checkout, webhook, Jobs admin tab)
- [ ] Booking confirmation emails

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

## Milestone 4 — Customer Portal 🔜 Planned

- [ ] Customer accounts (Supabase Auth)
- [ ] Order history
- [ ] Loyalty program
- [ ] SMS/email reminders
