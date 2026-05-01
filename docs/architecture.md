# Architecture — Cove Blades

## Overview

Multi-page marketing website for Cove Blades cutlery sharpening service. Built with Next.js 16 App Router, deployed on Vercel. Supabase handles contact form submissions and blog content; Cal.com handles mobile appointment scheduling via server-side proxy API routes. An admin-only section at `/admin` allows the owner to manage blog posts behind Supabase magic-link authentication.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react v1 + custom inline SVGs |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel (auto-deploy from GitHub `main`) |
| Font | Inter (Google Fonts) |

## Project Structure

```
src/
├── proxy.ts                    # Next.js 16 proxy (formerly middleware.ts) — refreshes Supabase session; guards /admin/** routes
├── app/
│   ├── layout.tsx              # Root layout, metadata, Inter font, JSON-LD, BookingProvider
│   ├── page.tsx                # Homepage — assembles all sections; export const revalidate = 300 (ISR)
│   ├── globals.css             # CSS custom properties, dark theme base
│   ├── icon.svg                # SVG favicon — gold BladeIcon on #0D1117 background (matches navbar)
│   ├── api/
│   │   ├── contact/route.ts    # POST endpoint — validates input, Turnstile verify, saves to Supabase
│   │   ├── geocode/route.ts    # GET proxy → Google Places Autocomplete + Place Details (server-side key protection)
│   │   ├── admin/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts         # GET list + POST create; requireAdmin() checks session email
│   │   │   │   └── [id]/route.ts    # GET + PUT + PATCH + DELETE; PATCH for status-only toggle
│   │   │   ├── bookings/
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts         # PATCH — update amount_charged, payment_method, status, notes
│   │   │   │       ├── refund/route.ts  # POST — Stripe full refund; sets status to refunded
│   │   │   │       ├── charge/route.ts  # POST — off-session Stripe charge using saved customer card
│   │   │   │       └── receipt/route.ts # POST — sends receipt via Postmark email + Magpipe SMS
│   │   │   ├── invoices/
│   │   │   │   ├── route.ts              # GET list + POST create; auto-generates YYYYMMDD-NNN number; upserts customer record
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts          # GET + PUT — invoice detail/update
│   │   │   │       ├── send/route.ts     # POST — send invoice via email (Postmark) + SMS (Magpipe)
│   │   │   │       └── mark-paid/route.ts # POST — mark invoice as paid (e-Transfer or manual)
│   │   │   ├── campaigns/
│   │   │   │   ├── route.ts              # GET list + POST create & send bulk SMS via Magpipe with personalization
│   │   │   │   └── [id]/route.ts         # GET detail + DELETE
│   │   │   └── customers/
│   │   │       ├── route.ts              # GET list + POST create — reads from customers table
│   │   │       ├── [id]/route.ts         # GET + PATCH + DELETE — customer detail by UUID
│   │   │       └── last-booking/route.ts # GET — finds most recent booking date from Cal.com + Supabase bookings
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts    # POST — creates Stripe Checkout session ($50 CAD), stores pending booking in Supabase
│   │   │   └── webhook/route.ts     # POST — handles checkout.session.completed / expired; confirms booking or marks invoice paid
│   │   ├── invoices/
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET — public invoice data (marks as viewed on first visit)
│   │   │       └── pay/route.ts     # POST — creates Stripe Checkout session for invoice payment
│   │   └── cal/
│   │       ├── slots/route.ts       # GET proxy → Cal.com v2 /slots
│   │       ├── book/route.ts        # POST proxy → Cal.com v2 /bookings; saves to Supabase as confirmed; sends SMS to admin + customer via Magpipe
│   │       ├── cancel/route.ts      # POST — cancels a Cal.com booking by UID
│   │       └── schedule/route.ts    # GET — returns 7-day DaySchedule[] from Cal.com bookings
│   ├── auth/
│   │   └── callback/route.ts   # PKCE code exchange → session; redirects to /admin/invoices
│   ├── admin/
│   │   ├── layout.tsx          # Thin layout (metadata + robots: noindex only — no auth check)
│   │   ├── login/page.tsx      # Magic link login form; useSearchParams wrapped in Suspense
│   │   └── (protected)/
│   │       ├── layout.tsx      # Auth check + AdminNav (only runs for protected routes)
│   │       ├── page.tsx        # Redirects → /admin/invoices
│   │       ├── jobs/page.tsx   # Server Component — lists all bookings via JobsTable
│   │       ├── invoices/
│   │       │   ├── page.tsx          # Client — invoice list with status filter; mobile horizontal scroll
│   │       │   ├── new/page.tsx      # Client — create invoice; customer search; line items; preview modal; mark-as-paid
│   │       │   └── [id]/page.tsx     # Client — invoice detail with edit mode, send popover, preview link
│   │       ├── campaigns/
│   │       │   └── page.tsx          # Client — SMS campaign compose, recipient selector, send, history
│   │       ├── customers/
│   │       │   ├── page.tsx          # Client — customer list with search, add customer form; mobile horizontal scroll
│   │       │   └── [id]/page.tsx     # Client — editable customer detail (name, email, phone, address, notes)
│   │       └── blog/
│   │           ├── page.tsx        # Server Component — lists all posts via PostTable
│   │           ├── new/page.tsx    # Renders PostForm with no initial data
│   │           └── [id]/edit/page.tsx  # Server Component — fetches post, passes to PostForm
│   ├── invoice/
│   │   └── [id]/page.tsx       # Public invoice view — branded display, Stripe card payment, e-Transfer instructions
│   ├── booking/
│   │   ├── layout.tsx          # Adds robots: noindex to all booking pages
│   │   ├── success/page.tsx    # Static booking confirmation page
│   │   └── cancel/page.tsx     # Cancels Cal.com booking via /api/cal/cancel, shows cancellation message
│   ├── blog/
│   │   ├── layout.tsx          # Wraps with Navbar + Footer
│   │   ├── page.tsx            # ISR (revalidate 300) — 2-col grid of published post cards
│   │   └── [slug]/
│   │       └── page.tsx        # ISR — full post with generateStaticParams + generateMetadata; dangerouslySetInnerHTML
│   ├── about/page.tsx
│   ├── contact/page.tsx        # Standalone contact page with Turnstile CAPTCHA
│   ├── drop-off/page.tsx
│   ├── mobile-service/page.tsx
│   ├── pricing/page.tsx
│   ├── restaurants/page.tsx     # Restaurant knife sharpening landing page with FAQ/Breadcrumb schema
│   ├── service-area/
│   │   ├── page.tsx            # Service area hub — city grid, FAQ schema, breadcrumb
│   │   └── [city]/page.tsx     # Dynamic city pages (SSG via generateStaticParams); FAQ/Breadcrumb/Service schema
│   ├── sitemap.ts              # Dynamic sitemap (ISR revalidate 3600) — static pages + blog posts + city pages
│   ├── robots.ts               # robots.txt — allow /, disallow admin/api/auth/booking
│   ├── privacy/page.tsx        # Privacy Policy — data collection, third-party services, cookies, rights
│   └── terms/page.tsx          # Terms of Service — bookings, payment, 30-day guarantee, service area, cancellations
├── components/
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger; Blog + Admin (auth-gated) links; Book Now opens BookingModal
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact; Privacy Policy + Terms of Service links
│   ├── BookingProvider.tsx     # React context — exposes open() and openWithDate(date) globally
│   ├── BookingModal.tsx        # 3-step modal: date picker → time slots → details form; phone required (no CAPTCHA)
│   ├── DropBoxCodeButton.tsx   # Popover CTA offering Call or Text options for drop box code
│   ├── ScheduleDayCard.tsx     # Client component — clickable day tile that opens BookingModal for that date
│   ├── admin/
│   │   ├── AdminNav.tsx        # Desktop sidebar + mobile bottom bar + slide-out drawer; Jobs/Invoices/Campaigns/Customers/Blog
│   │   ├── PostForm.tsx        # Client form; auto-generates slug; Save Draft / Publish
│   │   ├── PostTable.tsx       # Client component; Delete/Publish/Unpublish via PATCH
│   │   ├── JobsTable.tsx       # Client component; cash/card payment capture; receipt popover; row-click detail drawer; status dropdown
│   │   ├── CustomersTable.tsx  # Client component; clickable rows navigate to detail; Total Paid column
│   │   └── CustomerDetail.tsx  # Client component; edit name/phone/address; booking history with Charged/Total columns; Total Paid stat
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, van photo, Book/Schedule/DropBox CTAs
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, booking CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, static Google Maps image, DropBoxCodeButton inline with heading
│       ├── PricingSection.tsx  # 4 tiers + additional services table
│       ├── ReviewsSection.tsx  # 6 most-recent Google reviews + "see more" link
│       ├── WhereWeAreSection.tsx  # Async Server Component — 7-day location strip from Cal.com bookings
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form with Turnstile CAPTCHA (POSTs to /api/contact)
├── utils/
│   └── supabase/
│       ├── server.ts           # createServerClient factory (async cookies — Next.js 16)
│       └── client.ts           # createBrowserClient factory for "use client" components
├── data/
│   └── cities.ts              # CityData[] for 5 Lower Mainland cities; imported by sitemap, service-area pages
└── lib/
    ├── schema.ts               # safeJsonLd(), breadcrumbSchema(), faqPageSchema(), FAQ interface — shared SEO helpers
    ├── calSchedule.ts          # getWeekSchedule() — fetches Cal.com bookings, extracts city per day
    ├── admin.ts                # Shared requireAdmin(), getServiceClient(), ADMIN_EMAIL
    ├── format.ts               # formatCAD(), formatPhone(), normalizePhone(), escapeHtml(), LineItem interface
    ├── supabase.ts             # Lazy Supabase anon client — getSupabase() defers init until first call; safe for preview builds without env vars
    └── cn.ts                   # className utility

public/
├── manifest.json              # PWA manifest — standalone, dark theme, shield icon, start_url /admin/invoices
├── promaster.png              # Background-removed Ram ProMaster side-profile photo
├── logo-icon-512.png          # 512×512 shield + sword logo icon (navbar, favicon, PWA icon)
├── icon-512.png               # 512×512 Gyuto knife icon (gold on dark)
├── og-default.png             # Default OG image (1200×630) — gold-lit Japanese knife on dark background
├── llms.txt                   # AI engine comprehension file — business info for LLM crawlers
└── map-dropoff.png            # Dark-themed Google Maps Static API snapshot of drop-off location
```

## Data Flow

### Contact Form
```
User fills form → ContactSection (client)
  → POST /api/contact (Next.js route handler)
    → Supabase service role client
      → INSERT into contact_submissions table
        → { success: true } or { error: '...' }
```

### Mobile Booking
```
User clicks "Book Mobile Service" → BookingProvider.open()
  → BookingModal opens (step: date)
    → GET /api/cal/slots?start=&end= (Next.js proxy)
      → Cal.com v2 GET /slots?eventTypeId=2520929
        → Returns available time slots grouped by date
  → User picks date → time → fills details form
    → POST /api/cal/book (Next.js proxy)
      → Cal.com v2 POST /bookings
        → INSERT into bookings table (status: confirmed, deposit_amount: 0)
        → SMS to admin (new booking alert) via Magpipe
        → SMS to customer (confirmation) via Magpipe
        → Modal shows success
```

### Schedule (ISR)
```
WhereWeAreSection (async Server Component, ISR revalidate 300s)
  → getWeekSchedule() in lib/calSchedule.ts
    → Cal.com v2 GET /bookings (afterStart, beforeEnd, status=upcoming)
      → extractCity() parses booking metadata.notes for "Address:" line → city name
        → Returns DaySchedule[7] — cities[] or [] (Home Shop fallback)
  → Renders ScheduleDayCard (client component) per day
    → onClick: BookingProvider.openWithDate(date) → BookingModal jumps to time step
```

### Blog (Public, ISR)
```
/blog (page.tsx) — fetchs published posts from Supabase anon client; ISR revalidate 300s
/blog/[slug] (page.tsx) — fetchs single post; generateStaticParams pre-builds known slugs; ISR revalidate 300s
```

### Admin (Protected)
```
Edge middleware intercepts /admin/** requests
  → createServerClient (utils/supabase/server.ts) refreshes session from cookies
    → supabase.auth.getUser() — trusted server-side call (not getSession)
      → if no user or email ≠ ADMIN_EMAIL → redirect /admin/login
      → if authed user on /admin/login → redirect /admin/blog
Admin layout re-verifies session for defence-in-depth
PostForm (client) → POST/PUT /api/admin/posts/** → requireAdmin() re-checks session → Supabase upsert
PostTable (client) → DELETE/PATCH /api/admin/posts/[id] → requireAdmin() → Supabase mutation → router.refresh()
```

### Auth Flow
```
/admin/login → signInWithOtp({ email, emailRedirectTo: /auth/callback?next=/admin/blog })
  → Supabase sends magic link email
    → User clicks link → /auth/callback?code=...
      → exchangeCodeForSession(code) → session stored in cookies
        → redirect to ?next (/admin/blog)
```

### Pages
- `page.tsx` uses `export const revalidate = 300` — ISR, rebuilds every 5 minutes for fresh schedule data
- `/blog` and `/blog/[slug]` also use `revalidate = 300`
- `/sitemap.xml` uses `revalidate = 3600` — regenerates hourly
- `/service-area/[city]` pages are statically generated via `generateStaticParams` (data from `src/data/cities.ts`)
- All other marketing pages are statically pre-rendered at build time
- `/api/contact`, `/api/cal/slots`, `/api/cal/book`, `/api/cal/schedule`, `/api/admin/posts/**` are dynamic server routes (serverless functions on Vercel)

### Environment Variables
| Variable | Used In |
|----------|---------|
| `CAL_API_KEY` | `/api/cal/slots`, `/api/cal/book`, `lib/calSchedule.ts`, `/api/admin/customers/last-booking` |
| `CAL_EVENT_TYPE_ID` | `/api/cal/slots`, `/api/cal/book` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `utils/supabase/server.ts`, `utils/supabase/client.ts`, blog pages |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts`, `utils/supabase/client.ts`, blog pages |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/contact` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `ContactSection.tsx`, `contact/page.tsx` |
| `TURNSTILE_SECRET_KEY` | `/api/contact` |
| `STRIPE_SECRET_KEY` | `/api/stripe/checkout`, `/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (future client-side Stripe use) |
| `STRIPE_WEBHOOK_SECRET` | `/api/stripe/webhook` — validates Stripe webhook signatures |
| `STRIPE_DEPOSIT_AMOUNT` | `/api/stripe/checkout` — deposit in cents (5000 = $50 CAD) |
| `GOOGLE_MAPS_API_KEY` | `/api/geocode` — Google Places Autocomplete + Place Details |
| `POSTMARK_API_KEY` | `/api/admin/bookings/[id]/receipt` — transactional email receipts |
| `MAGPIPE_API_KEY` | `/api/admin/bookings/[id]/receipt` — SMS receipts via Magpipe |
| `MAGPIPE_SMS_FROM` | `/api/admin/bookings/[id]/receipt` — sender number (`+16042108180`) |
| `INSTAGRAM_USER_ID` | `lib/instagram.ts` — IG Business account ID for Graph API |
| `INSTAGRAM_ACCESS_TOKEN` | `lib/instagram.ts` — env-var fallback for the IG token (canonical lives in Supabase `app_credentials`) |
| `INSTAGRAM_APP_ID` | `/api/cron/refresh-instagram-token` — Meta app id for token exchange |
| `INSTAGRAM_APP_SECRET` | `/api/cron/refresh-instagram-token` — Meta app secret for token exchange |
| `CRON_SECRET` | `/api/cron/refresh-instagram-token` — gates the cron route; Vercel auto-attaches as `Authorization: Bearer` |
| `SUPABASE_ACCESS_TOKEN` | Local-only PAT for Supabase Management API (migrations, auth config); not deployed to Vercel |

## Database

**Supabase project:** `kvatxuhjiinjpvsyably` (named **Cove Blades** in the dashboard)

### Tables

**`app_credentials`**
| Column | Type | Notes |
|--------|------|-------|
| name | text | Primary key (e.g. `instagram_access_token`) |
| value | text | Required — the actual credential |
| expires_at | timestamptz | Nullable; used by the rotation cron to decide whether to refresh |
| updated_at | timestamptz | Auto-set on upsert |

Service-role-only access (RLS policy `service_role_all`). Used for credentials that need runtime mutation without a redeploy — primarily the Instagram Graph API long-lived token, rotated by the weekly cron at `/api/cron/refresh-instagram-token`.

**`contact_submissions`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, auto-generated |
| created_at | timestamptz | Auto |
| name | text | Required |
| phone | text | Optional |
| email | text | Required |
| service_type | text | Mobile, Drop Off, Special Event, Other |
| item_count | text | Number of items |
| message | text | Optional |
| status | text | Default: 'new' |

RLS is enabled. Inserts go through the service role key (server-side only).

**`blog_posts`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key, gen_random_uuid() |
| title | text | Required |
| slug | text | Unique, required |
| content | text | HTML string |
| excerpt | text | Optional short summary |
| meta_description | text | SEO |
| featured_image_url | text | Optional hero image |
| status | text | `draft` or `published` (CHECK constraint) |
| published_at | timestamptz | Set on first publish, preserved on re-publish |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto-updated via trigger |
| author_email | text | Required |

RLS policies:
- **Public SELECT**: `status = 'published'` (anyone can read published posts)
- **Admin SELECT**: `auth.jwt() ->> 'email' = 'elagerway@gmail.com'` (admin sees drafts too)
- **Admin INSERT/UPDATE/DELETE**: `auth.jwt() ->> 'email' = 'elagerway@gmail.com'`

**`bookings`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| cal_booking_uid | text | Cal.com booking UID for cancellation |
| stripe_session_id | text | Stripe Checkout session ID |
| stripe_payment_intent_id | text | Set on payment completion |
| stripe_customer_id | text | Stripe Customer ID — saved on checkout completion for future charges |
| customer_name/email/phone | text | From booking form |
| appointment_date | date | |
| appointment_time | text | Formatted Vancouver time |
| address | text | Service address |
| deposit_amount | integer | Cents (0 for no-deposit bookings) |
| amount_charged | integer | Cents — entered by admin after job |
| payment_method | text | `card` or `cash` — how day-of charge was collected |
| status | text | pending_payment / confirmed / completed / cancelled / refunded |
| notes | text | Admin notes |

RLS: admin full access only (`auth.jwt() ->> 'email' = 'elagerway@gmail.com'`)

**`customers`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Required |
| email | text | Nullable, unique (partial index on non-null) |
| phone | text | Nullable |
| address | text | Nullable |
| notes | text | Nullable |
| source | text | `manual`, `cal.com`, `booking`, `invoice`, `imported` |
| created_at | timestamptz | Auto |
| updated_at | timestamptz | Auto |

RLS: admin full access only. Seeded from Cal.com bookings (both accounts), macOS Contacts, and Google Calendar export.

**`invoices`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| invoice_number | text | Unique, format `YYYYMMDD-NNN` |
| client_name/email/phone | text | From customer selection |
| client_address | text | Nullable |
| line_items | jsonb | `[{ description, quantity, unit_price }]` |
| subtotal | integer | Cents, calculated from line items |
| notes | text | Nullable |
| status | text | `draft`, `sent`, `viewed`, `paid`, `overdue` |
| payment_method | text | `stripe` or `etransfer` |
| due_date | date | Nullable |
| work_completed_date | date | Nullable — auto-filled from last Cal.com/gcal booking |
| sent_at | timestamptz | When invoice was sent |
| paid_at | timestamptz | When payment received |
| stripe_session_id | text | Nullable |
| stripe_payment_intent_id | text | Nullable |
| created_at | timestamptz | Auto |

RLS: admin full access only.

**`campaigns`**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| message | text | SMS body (may contain personalization variables) |
| recipient_count | integer | Total recipients |
| sent_count | integer | Successfully sent |
| failed_count | integer | Failed to send |
| status | text | `draft`, `sending`, `completed`, `failed` |
| recipients | jsonb | `[{ id, name, phone }]` |
| created_at | timestamptz | Auto |
| sent_at | timestamptz | When campaign was sent |

RLS: admin full access only.

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0D1117` | Page background |
| Card | `#161B22` | Cards, inputs, nav |
| Gold | `#D4A017` | Accent, CTAs, icons |
| Blue | `#1E90FF` | Secondary accent |
| Text | `#FFFFFF` | Primary text |
| Muted | `#6B7280` | Secondary text, labels |
| Border | `#30363D` | Card borders, dividers |

## Deployment

- **Production URL:** https://coveblades.com (live; DNS flipped 2026-04-30)
- **Staging URL:** https://staging.coveblades.com (live; serves the same Vercel deployment as production)
- **Vercel URL:** https://covecutlery.vercel.app
- **GitHub repo:** https://github.com/elagerway/covecutlery
- **Supabase project:** `kvatxuhjiinjpvsyably` (named "Cove Blades" in the dashboard)
- Auto-deploy on push to `main`
- Legacy domain `covecutlery.ca` continues to serve in parallel (separate A record at `216.150.1.1`); retire when ready

**Supabase Auth Redirect URLs** (configured in Supabase Dashboard → Authentication → URL Configuration):
- `http://localhost:3002/auth/callback` (dev)
- `https://coveblades.com/auth/callback`, `https://www.coveblades.com/auth/callback` (prod)
- `https://staging.coveblades.com/auth/callback` (staging)
- `https://covecutlery.ca/auth/callback`, `https://www.covecutlery.ca/auth/callback` (legacy — kept until covecutlery.ca is retired)

Note: dev server runs on port **3002**. Never use port 3000.

## Cron Jobs

Vercel Cron registered via `vercel.json`:

| Path | Schedule | Purpose |
|------|----------|---------|
| `/api/cron/refresh-instagram-token` | `0 9 * * 1` (Mondays 09:00 UTC) | Auto-rotates the Instagram Graph API long-lived token (~60-day expiry) when within 14 days of expiry. Reads from `app_credentials.instagram_access_token`, calls Meta's `oauth/access_token?grant_type=fb_exchange_token`, writes the new 60-day token + new `expires_at` back to Supabase. Returns no-op JSON when not yet due. |

Cron auth: Vercel auto-attaches `Authorization: Bearer ${CRON_SECRET}` to cron invocations. The route returns 401 to anything else, so manual triggers require the secret. Failures are logged via `console.error` and surfaced in Vercel logs.

## Known Gotchas

- `lucide-react` v1 removed `Knife`, `Instagram`, `Facebook`, `Youtube` icons — replaced with custom inline SVGs in Navbar, Footer, MobileServiceSection, ContactSection, AboutSection
- `"use client"` required on components that use hooks or browser APIs (BookingModal, BookingProvider, DropBoxCodeButton, HeroSection, MobileServiceSection, Navbar, ScheduleDayCard, ContactSection)
- Cal.com v2 slots endpoint uses `start`/`end` params (not `startTime`/`endTime`) with `cal-api-version: 2024-09-04`; bookings endpoint uses `cal-api-version: 2024-08-13`
- `BookingProvider` must wrap `{children}` in `layout.tsx` — it renders `BookingModal` globally so the modal persists across page navigations
- `WhereWeAreSection` is an **async Server Component** — the first in this codebase. It cannot use hooks; interactive behavior is delegated to child `ScheduleDayCard` (client component)
- City extraction in `calSchedule.ts` reads `booking.location` as a string (current `attendeeDefined` event type returns the address as a flat string), falls back to `booking.location.address` for legacy `attendeeAddress`-shaped bookings, then to `booking.metadata.notes` `"Address: ..."` format. Nominatim format: `"Street, City, Province Postal, Country"` — index 1 is city; index 2 if index 1 starts with a digit (unit number edge case)
- Cal.com booking location: address is passed as `location: { type: "attendeeDefined", location: address }`. The current event type (`CAL_EVENT_TYPE_ID=2520929` on the Cove Blades account) is configured for `attendeeDefined` only — sending `attendeeAddress` returns 400. The previous Cove Cutlery event type used `attendeeAddress`, hence the fallback path in `extractCity`
- Cloudflare Turnstile CAPTCHA: site key is public (`NEXT_PUBLIC_`), secret key is server-only. ContactSection and `/contact` page use Turnstile; `BookingModal` and `/api/cal/book` do **not** — CAPTCHA was removed from the booking flow to reduce friction
- Nominatim geocoding (`/api/geocode`) must stay server-side — browsers cannot set the `User-Agent` header (forbidden), so direct client-side fetch to Nominatim would return 403
- `lib/calSchedule.ts` uses `vancouverMidnightISO()` — a DST-aware helper that probes noon UTC via `Intl.DateTimeFormat` to determine Vancouver's UTC offset before constructing the midnight timestamp. Raw `new Date("YYYY-MM-DDT00:00:00")` would parse in server-local time (UTC on Vercel), yielding the wrong window
- Next.js 16 App Router: `params` in page/route handler components is `Promise<{ ... }>` and must be `await`ed; `cookies()` from `next/headers` is also async
- `@supabase/ssr` is used for all auth-aware server contexts (middleware, server components, API routes). The older `lib/supabase.ts` anon client remains for public-facing pages. Build-time pages (blog, sitemap) guard against missing Supabase env vars to prevent preview deployment failures — same pattern as the lazy Stripe init
- Admin middleware uses `getUser()` (not `getSession()`) — Supabase recommends this for server-side auth checks as it validates the token server-side
- The double-cookie pattern in middleware: cookies must be set on both the incoming `request` and the outgoing `supabaseResponse` to keep the session alive across edge calls
- **Vercel project name (`covecutlery.vercel.app`) and GitHub repo (`elagerway/covecutlery`) intentionally not renamed** — only the public domain and brand changed; internal infra identifiers stayed as-is to avoid the cascade of breaking integrations that haven't been audited (CI, deploy hooks, etc.)
- **Outgoing-URL host allowlist (`lib/origin.ts`):** `safeOrigin()` returns the request's `Origin` header iff its host is in `["coveblades.com", "www.coveblades.com", "staging.coveblades.com"]`, else `https://coveblades.com`. Used by Stripe checkout (`/api/invoices/[id]/pay`) and invoice send (`/api/admin/invoices/[id]/send`) so links/redirects respect staging. The prior hardcoded `https://coveblades.com` defended against `Origin` spoofing — the allowlist preserves that property while permitting staging
- **Legacy slug parity:** the new pages `/how-we-sharpen-your-knives`, `/train-to-be-sharp`, `/event-sharpening-service` use the verbose slugs from the legacy WordPress site at coveblades.com so existing Google rankings and external backlinks survive the DNS flip. `/staysharp` redirects to `/blog` (and per-slug) via `next.config.ts` for the same reason. Don't "clean up" these slugs without setting up corresponding redirects
- **`<InquiryForm>` (`src/components/InquiryForm.tsx`):** shared client form used by `/train-to-be-sharp` and `/event-sharpening-service`. Takes `serviceType` as a prop and posts to `/api/contact` along with the captcha token. The same `/api/contact` endpoint is shared with `ContactSection` and `/contact` — different `service_type` values discriminate downstream in `/admin/jobs`
