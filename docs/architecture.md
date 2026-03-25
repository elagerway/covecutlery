# Architecture — Cove Cutlery

## Overview

Multi-page marketing website for Cove Cutlery cutlery sharpening service. Built with Next.js 16 App Router, deployed on Vercel. Supabase handles contact form submissions and blog content; Cal.com handles mobile appointment scheduling via server-side proxy API routes. An admin-only section at `/admin` allows the owner to manage blog posts behind Supabase magic-link authentication.

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
│   │   ├── geocode/route.ts    # GET proxy → Nominatim (sets required User-Agent header server-side)
│   │   ├── admin/
│   │   │   ├── posts/
│   │   │   │   ├── route.ts         # GET list + POST create; requireAdmin() checks session email
│   │   │   │   └── [id]/route.ts    # GET + PUT + PATCH + DELETE; PATCH for status-only toggle
│   │   │   └── bookings/
│   │   │       └── [id]/route.ts    # PATCH — update amount_charged, status, notes
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts    # POST — creates Stripe Checkout session ($50 CAD), stores pending booking in Supabase
│   │   │   └── webhook/route.ts     # POST — handles checkout.session.completed / expired; confirms or cancels booking
│   │   └── cal/
│   │       ├── slots/route.ts       # GET proxy → Cal.com v2 /slots
│   │       ├── book/route.ts        # POST proxy → Cal.com v2 /bookings; Turnstile verify + input validation
│   │       ├── cancel/route.ts      # POST — cancels a Cal.com booking by UID
│   │       └── schedule/route.ts    # GET — returns 7-day DaySchedule[] from Cal.com bookings
│   ├── auth/
│   │   └── callback/route.ts   # PKCE code exchange → session; redirects to /admin/blog or /admin/login?error=auth
│   ├── admin/
│   │   ├── layout.tsx          # Thin layout (metadata + robots: noindex only — no auth check)
│   │   ├── login/page.tsx      # Magic link login form; useSearchParams wrapped in Suspense
│   │   └── (protected)/
│   │       ├── layout.tsx      # Auth check + AdminNav (only runs for protected routes)
│   │       ├── page.tsx        # Redirects → /admin/blog
│   │       ├── jobs/page.tsx   # Server Component — lists all bookings via JobsTable
│   │       └── blog/
│   │           ├── page.tsx        # Server Component — lists all posts via PostTable
│   │           ├── new/page.tsx    # Renders PostForm with no initial data
│   │           └── [id]/edit/page.tsx  # Server Component — fetches post, passes to PostForm
│   ├── booking/
│   │   ├── success/page.tsx    # Verifies Stripe session, confirms booking in Supabase, shows confirmation
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
│   └── pricing/page.tsx
├── components/
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger; Blog link; Book Now opens BookingModal
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact
│   ├── BookingProvider.tsx     # React context — exposes open() and openWithDate(date) globally
│   ├── BookingModal.tsx        # 3-step modal: date picker → time slots → details form; Turnstile CAPTCHA; phone required
│   ├── DropBoxCodeButton.tsx   # Popover CTA offering Call or Text options for drop box code
│   ├── ScheduleDayCard.tsx     # Client component — clickable day tile that opens BookingModal for that date
│   ├── admin/
│   │   ├── AdminNav.tsx        # Sidebar nav with Jobs + Blog links; logout
│   │   ├── PostForm.tsx        # Client form; auto-generates slug; Save Draft / Publish
│   │   ├── PostTable.tsx       # Client component; Delete/Publish/Unpublish via PATCH
│   │   └── JobsTable.tsx       # Client component; inline amount-charged editor; status dropdown; total calculation
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, van photo, Book/Schedule/DropBox CTAs
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, booking CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, DropBoxCodeButton
│       ├── PricingSection.tsx  # 4 tiers + additional services table
│       ├── ReviewsSection.tsx  # 6 most-recent Google reviews + "see more" link
│       ├── WhereWeAreSection.tsx  # Async Server Component — 7-day location strip from Cal.com bookings
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form with Turnstile CAPTCHA (POSTs to /api/contact)
├── utils/
│   └── supabase/
│       ├── server.ts           # createServerClient factory (async cookies — Next.js 16)
│       └── client.ts           # createBrowserClient factory for "use client" components
└── lib/
    ├── calSchedule.ts          # getWeekSchedule() — fetches Cal.com bookings, extracts city per day
    ├── supabase.ts             # Supabase anon client (public pages only)
    └── cn.ts                   # className utility

public/
└── promaster.png              # Background-removed Ram ProMaster side-profile photo
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
      → Cal.com v2 GET /slots?eventTypeId=5142178
        → Returns available time slots grouped by date
  → User picks date → time → fills details form
    → POST /api/cal/book (Next.js proxy)
      → Cal.com v2 POST /bookings
        → Booking confirmed, modal shows success
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
- All other marketing pages are statically pre-rendered at build time
- `/api/contact`, `/api/cal/slots`, `/api/cal/book`, `/api/cal/schedule`, `/api/admin/posts/**` are dynamic server routes (serverless functions on Vercel)

### Environment Variables
| Variable | Used In |
|----------|---------|
| `CAL_API_KEY` | `/api/cal/slots`, `/api/cal/book`, `lib/calSchedule.ts` |
| `CAL_EVENT_TYPE_ID` | `/api/cal/slots`, `/api/cal/book` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `utils/supabase/server.ts`, `utils/supabase/client.ts`, blog pages |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts`, `utils/supabase/client.ts`, blog pages |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/contact` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `ContactSection.tsx`, `contact/page.tsx`, `BookingModal.tsx` |
| `TURNSTILE_SECRET_KEY` | `/api/contact`, `/api/cal/book` |
| `STRIPE_SECRET_KEY` | `/api/stripe/checkout`, `/api/stripe/webhook` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (future client-side Stripe use) |
| `STRIPE_WEBHOOK_SECRET` | `/api/stripe/webhook` — validates Stripe webhook signatures |
| `STRIPE_DEPOSIT_AMOUNT` | `/api/stripe/checkout` — deposit in cents (5000 = $50 CAD) |

## Database

**Supabase project:** `kvatxuhjiinjpvsyably`

### Tables

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
| customer_name/email/phone | text | From booking form |
| appointment_date | date | |
| appointment_time | text | Formatted Vancouver time |
| address | text | Service address |
| deposit_amount | integer | Cents (default 5000 = $50) |
| amount_charged | integer | Cents — entered by admin after job |
| status | text | pending_payment / confirmed / completed / cancelled / refunded |
| notes | text | Admin notes |

RLS: admin full access only (`auth.jwt() ->> 'email' = 'elagerway@gmail.com'`)

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

- **Production URL:** https://covecutlery.ca
- **Vercel URL:** https://covecutlery.vercel.app
- **GitHub repo:** https://github.com/elagerway/covecutlery
- Auto-deploy on push to `main`

**Supabase Auth Redirect URLs** (must be set in Supabase Dashboard → Authentication → URL Configuration):
- `http://localhost:3002/auth/callback` (dev)
- `https://covecutlery.ca/auth/callback` (prod)

Note: dev server runs on port **3002**. Never use port 3000.

## Known Gotchas

- `lucide-react` v1 removed `Knife`, `Instagram`, `Facebook`, `Youtube` icons — replaced with custom inline SVGs in Navbar, Footer, MobileServiceSection, ContactSection, AboutSection
- `"use client"` required on components that use hooks or browser APIs (BookingModal, BookingProvider, DropBoxCodeButton, HeroSection, MobileServiceSection, Navbar, ScheduleDayCard, ContactSection)
- Cal.com v2 slots endpoint uses `start`/`end` params (not `startTime`/`endTime`) with `cal-api-version: 2024-09-04`; bookings endpoint uses `cal-api-version: 2024-08-13`
- `BookingProvider` must wrap `{children}` in `layout.tsx` — it renders `BookingModal` globally so the modal persists across page navigations
- `WhereWeAreSection` is an **async Server Component** — the first in this codebase. It cannot use hooks; interactive behavior is delegated to child `ScheduleDayCard` (client component)
- City extraction in `calSchedule.ts` parses the Nominatim `display_name` stored in `booking.metadata.notes` — format: `"Address: Street, City, Province Postal, Country"`. Index 1 of comma-split is the city; if index 1 starts with a digit it uses index 2 (unit number edge case)
- Cloudflare Turnstile CAPTCHA: site key is public (`NEXT_PUBLIC_`), secret key is server-only. ContactSection, `/contact` page, and `BookingModal` all have the widget. Both `/api/contact` and `/api/cal/book` verify the token server-side before any external call
- Nominatim geocoding (`/api/geocode`) must stay server-side — browsers cannot set the `User-Agent` header (forbidden), so direct client-side fetch to Nominatim would return 403
- `lib/calSchedule.ts` uses `vancouverMidnightISO()` — a DST-aware helper that probes noon UTC via `Intl.DateTimeFormat` to determine Vancouver's UTC offset before constructing the midnight timestamp. Raw `new Date("YYYY-MM-DDT00:00:00")` would parse in server-local time (UTC on Vercel), yielding the wrong window
- Next.js 16 App Router: `params` in page/route handler components is `Promise<{ ... }>` and must be `await`ed; `cookies()` from `next/headers` is also async
- `@supabase/ssr` is used for all auth-aware server contexts (middleware, server components, API routes). The older `lib/supabase.ts` anon client remains for public-facing pages
- Admin middleware uses `getUser()` (not `getSession()`) — Supabase recommends this for server-side auth checks as it validates the token server-side
- The double-cookie pattern in middleware: cookies must be set on both the incoming `request` and the outgoing `supabaseResponse` to keep the session alive across edge calls
