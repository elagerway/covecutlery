# Architecture — Cove Blades

## Overview

Multi-page marketing website for Cove Blades cutlery sharpening service. Built with Next.js 16 App Router, deployed on Vercel. Supabase handles contact form submissions and blog content; Cal.com handles mobile appointment scheduling via server-side proxy API routes. An admin-only section at `/admin` allows the owner to manage blog posts behind email-password / Google OAuth authentication (admin status = email match against `ADMIN_EMAILS`).

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
│   │   │   ├── customers/
│   │   │   │   ├── route.ts              # GET list + POST create — reads from customers table
│   │   │   │   ├── [id]/route.ts         # GET + PATCH + DELETE — customer detail by UUID
│   │   │   │   └── last-booking/route.ts # GET — finds most recent booking date from Cal.com + Supabase bookings
│   │   │   └── courses/
│   │   │       └── enrollment/route.ts   # GET list + PATCH toggle enrollment_open per course
│   │   ├── courses/
│   │   │   └── enroll/route.ts      # POST — creates course_enrollment + Stripe Checkout (card) or records e-transfer; Turnstile verify. Maps routing slug → LMS slug (e.g. one-inch-grinder → train-to-be-sharp) so the webhook grants the right course
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts    # POST — creates Stripe Checkout session ($50 CAD), stores pending booking in Supabase
│   │   │   └── webhook/route.ts     # POST — handles checkout.session.completed / expired; confirms booking, marks invoice paid, or enrolls course student
│   │   ├── invoices/
│   │   │   └── [id]/
│   │   │       ├── route.ts         # GET — public invoice data (marks as viewed on first visit)
│   │   │       └── pay/route.ts     # POST — creates Stripe Checkout session for invoice payment
│   │   └── cal/
│   │       ├── slots/route.ts       # GET proxy → Cal.com v2 /slots (always passes timeZone=America/Vancouver; sorts each day's slots chronologically)
│   │       ├── book/route.ts        # POST proxy → Cal.com v2 /bookings; validates + normalizes phone to E.164; saves to Supabase as confirmed; sends SMS to admin + customer via Magpipe
│   │       ├── cancel/route.ts      # POST — cancels a Cal.com booking by UID; unauthenticated, so restricted to pending_payment bookings (Stripe cancel_url flow only)
│   │       └── schedule/route.ts    # GET — returns 7-day DaySchedule[] from Cal.com bookings
│   ├── train-to-be-sharp/
│   │   ├── page.tsx                     # Training hub — 4 module cards linking to detail pages
│   │   ├── one-inch-grinder/
│   │   │   ├── page.tsx                 # Course detail + dynamic sign-up (checks enrollment_open)
│   │   │   └── success/page.tsx         # Post-payment confirmation + account creation CTA
│   │   ├── two-inch-grinder/            # Same structure
│   │   ├── business-process/            # Same structure
│   │   └── build-your-business/         # Same structure
│   ├── auth/
│   │   ├── callback/route.ts             # PKCE code exchange → session; auto-enrolls from paid course_enrollments; redirects to next
│   │   ├── confirm/page.tsx              # Intermediate confirm-then-verifyOtp page — defeats Gmail link-scanner pre-fetch (token only consumed on button click)
│   │   ├── login/page.tsx                # Email+password + Google OAuth; "Forgot password?" link
│   │   ├── signup/page.tsx               # Account creation
│   │   ├── forgot-password/page.tsx      # Request reset email
│   │   └── reset-password/page.tsx       # Set new password (relies on session from confirm page)
│   ├── admin/
│   │   ├── layout.tsx          # Thin layout (metadata + robots: noindex only — no auth check)
│   │   ├── login/page.tsx      # Server-side redirect to /auth/login?redirect=/admin (kept so old bookmarks don't 404)
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
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger; Blog + Admin (auth-gated) links; "Sign in" for logged-out / "Dashboard" for logged-in (mutually exclusive); Book Now opens BookingModal
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact; Privacy Policy + Terms of Service links
│   ├── BookingProvider.tsx     # React context — exposes open() and openWithDate(date) globally
│   ├── BookingModal.tsx        # 3-step modal: date picker → time slots → details form; phone required, normalized to E.164 client-side before submit (no CAPTCHA)
│   ├── DropBoxCodeButton.tsx   # Popover CTA offering Call or Text options for drop box code
│   ├── ScheduleDayCard.tsx     # Client component — clickable day tile that opens BookingModal for that date
│   ├── admin/
│   │   ├── AdminNav.tsx        # Desktop sidebar + mobile bottom bar + slide-out drawer; Jobs/Invoices/Campaigns/Customers/Blog/Training
│   │   ├── EnrollmentToggles.tsx # Client — toggle switches for course enrollment_open (embedded in Training page)
│   │   ├── PostForm.tsx        # Client form; auto-generates slug; Save Draft / Publish
│   │   ├── PostTable.tsx       # Client component; Delete/Publish/Unpublish via PATCH
│   │   ├── JobsTable.tsx       # Client component; cash/card payment capture; receipt popover; row-click detail drawer; status dropdown
│   │   ├── CustomersTable.tsx  # Client component; clickable rows navigate to detail; Total Paid column
│   │   └── CustomerDetail.tsx  # Client component; edit name/phone/address; booking history with Charged/Total columns; Total Paid stat
│   ├── courses/
│   │   └── CourseSignUp.tsx    # Client — sign-up form with Stripe checkout + e-transfer toggle + Turnstile
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, van photo, Book/Schedule/DropBox CTAs
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, booking CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, static Google Maps image, DropBoxCodeButton inline with heading
│       ├── PricingSection.tsx  # 4 tiers + additional services list (items take an optional note line, e.g. Tip & Chip Repairs)
│       ├── ReviewsSection.tsx  # 6 most-recent Google reviews + "see more" link
│       ├── WhereWeAreSection.tsx  # Async Server Component — 7-day location strip from Cal.com bookings
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form with Turnstile CAPTCHA (POSTs to /api/contact); Drop Box Address card embeds a keyless Google map + directions link
├── utils/
│   └── supabase/
│       ├── server.ts           # createServerClient factory (async cookies — Next.js 16)
│       └── client.ts           # createBrowserClient factory for "use client" components
├── data/
│   └── cities.ts              # CityData[] for the Lower Mainland service-area cities; imported by sitemap, service-area pages, calSchedule + admin campaigns (known-city name matching). Server-side only — don't import into lib/format.ts (client bundles)
└── lib/
    ├── schema.ts               # safeJsonLd(), breadcrumbSchema(), faqPageSchema(), FAQ interface — shared SEO helpers
    ├── calSchedule.ts          # getWeekSchedule() — fetches Cal.com bookings, extracts city per day
    ├── admin.ts                # Shared requireAdmin(), getServiceClient(), ADMIN_EMAIL
    ├── format.ts               # formatCAD(), formatPhone(), normalizePhone(), escapeHtml(), cityFromAddress() (postal-code-safe, takes knownCities — see Gotchas), LineItem interface
    ├── supabase.ts             # Lazy Supabase anon client — getSupabase() defers init until first call; safe for preview builds without env vars
    ├── cn.ts                   # className utility
    ├── google-ads.ts           # GOOGLE_ADS_ID (AW-18180527373) + fireGooglePageView() (SPA route changes) + fireBookingConversion() (live via NEXT_PUBLIC_GADS_CONVERSION_ID)
    ├── meta-pixel.ts           # fireMetaBookingConversion() (standard 'Schedule', $60 CAD) + fireMetaPageView(); no-op until NEXT_PUBLIC_FB_PIXEL_ID is set
    └── course-enrollment-status.ts # isEnrollmentOpen(slug) — checks courses.enrollment_open via service client

src/instrumentation-client.ts  # Sentry browser init + router-transition breadcrumbs (Next 16 client instrumentation convention)
src/instrumentation.ts         # Sentry server/edge init (register) + captureRequestError (onRequestError)
src/app/global-error.tsx       # Root error boundary — reports to Sentry, renders dark "Try again" recovery screen

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
      → Cal.com v2 GET /slots?eventTypeId=2520929&timeZone=America/Vancouver
        → Returns available time slots grouped by Vancouver-local date, sorted chronologically
  → User picks date → time → fills details form
    → POST /api/cal/book (Next.js proxy)
      → Cal.com v2 POST /bookings
        → UPSERT into bookings table on cal_booking_uid (status: confirmed,
          deposit_amount: 0) — upsert (not insert) so it's idempotent against
          the Cal webhook below; insert errors are logged, not swallowed
        → SMS to admin (new booking alert) via Magpipe
        → SMS to customer (confirmation) via Magpipe
        → Modal shows success
```

### Cal.com Booking Sync (Webhook)
Bookings made on the **native Cal.com page** (not the website widget) never hit `/api/cal/book`, so they're captured by a Cal webhook instead. Both write paths key on `cal_booking_uid` (unique index `bookings_cal_booking_uid_key`) so they're idempotent against each other.
```
Cal.com fires webhook → POST /api/webhooks/cal
  → verify HMAC signature (x-cal-signature-256) when CAL_WEBHOOK_SECRET set
  → BOOKING_CREATED   → upsert confirmed row (insert-if-missing; never clobbers
                         admin edits). A pre-existing cancelled tombstone stops
                         resurrection
  → BOOKING_CANCELLED → set status=cancelled; if row absent, write a cancelled
                         tombstone (out-of-order delivery guard)
  → BOOKING_RESCHEDULED → move the existing row to the new uid + time
                         (Cal mints a new uid on reschedule), else insert
```
The webhook is registered on the **Blades** Cal account (`CAL_API_KEY_BLADES`); production `CAL_API_KEY` is that same account. Shared Cal helpers live in `src/lib/cal.ts` (`cancelCalBooking`, `formatAppointment`, `TIMEZONE`).

### Jobs Admin (`/admin/jobs`)
```
JobsTable (client) lists every bookings row (no filter), capped at 1400px
  → status dropdown / charge entry / refund / receipt → /api/admin/bookings/[id]
  → Delete (row trash icon or detail-drawer button) → confirm modal
    → DELETE /api/admin/bookings/[id]
      → blocks if a deposit is unrefunded (409)
      → cancels the Cal appointment only when active + upcoming (cancelCalBooking)
      → deletes the row; failures keep the modal open with an inline error
```

### Voice Agent Admin (`/admin/voice-prompt`)
```
System prompt: stored in app_credentials (manual sync into Magpipe)
Voice picker:  GET /api/admin/voice → Magpipe list-voices + get-agent (current voice_id)
               PUT /api/admin/voice → Magpipe update-agent (sets voice_id live)
Voice cloning: VoiceCloner records (MediaRecorder) or uploads an audio sample
               → POST /api/admin/voice/clone (multipart, ≤4MB)
                 → Magpipe clone-voice → ElevenLabs IVC → new voice in the picker
```
Magpipe calls route through `src/lib/magpipe.ts` helpers (`listVoices`, `getAgentVoiceId`, `setAgentVoice`, `cloneVoice`, `VOICE_AGENT_ID`).

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
      → if no user or email ∉ ADMIN_EMAILS → redirect /auth/login?redirect=<original-path>
Admin layout re-verifies session for defence-in-depth
PostForm (client) → POST/PUT /api/admin/posts/** → requireAdmin() re-checks session → Supabase upsert
PostTable (client) → DELETE/PATCH /api/admin/posts/[id] → requireAdmin() → Supabase mutation → router.refresh()
```

### Auth Flow
All auth (admin + student) goes through `/auth/login`. Admin status is purely an email check against `ADMIN_EMAILS` in `src/lib/admin.ts`, so any successful sign-in for those emails yields admin access.

```
Password:  /auth/login → supabase.auth.signInWithPassword → router.push(redirect)
Google:    /auth/login → supabase.auth.signInWithOAuth({provider: google,
             redirectTo: /auth/callback?next=<redirect>}) → Google consent →
             Supabase callback → /auth/callback exchanges code → session
Recovery:  /auth/forgot-password → POST /api/auth/forgot-password
             → supabase.auth.admin.generateLink(type=recovery)
             → Postmark sends email with link to /auth/confirm?h=<token_hash>&t=recovery&next=/auth/reset-password
             → User clicks "Confirm" button → JS calls supabase.auth.verifyOtp({type, token_hash})
             → /auth/reset-password → supabase.auth.updateUser({password})
Signup:    /auth/signup → POST /api/auth/signup → generateLink(type=signup) + Postmark email
             → /auth/confirm?h=...&t=signup&next=/courses → user clicks Confirm
```

**Email-link pre-fetch defence.** Email auth links never point straight at Supabase's `/auth/v1/verify` (which consumes the one-time token on any GET — Gmail's link scanner burns through them). Instead, `forgot-password` / `magic-link-style flows` / `signup` confirmation emails point at our own `/auth/confirm?h=<hashed_token>&t=<type>&next=<path>` page. That page does nothing on GET and only calls `verifyOtp({type, token_hash})` when the user clicks the button. See memory: `email_scanner_prefetch`.

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
| `CAL_API_KEY` | `/api/cal/slots`, `/api/cal/book`, `lib/cal.ts` (cancel), `lib/calSchedule.ts`, `/api/admin/customers/last-booking` — in prod this is the **Blades** account |
| `CAL_API_KEY_BLADES` | Blades Cal account key — used out-of-band to manage the Cal webhook (the webhook is owned by this account) |
| `CAL_WEBHOOK_SECRET` | `/api/webhooks/cal` — HMAC secret for verifying Cal's `x-cal-signature-256`; same value set on the Cal webhook |
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
| `MAGPIPE_API_KEY` | `lib/magpipe.ts` — SMS receipts, voice picker (`/api/admin/voice`), and voice cloning (`/api/admin/voice/clone`) |
| `MAGPIPE_SMS_FROM` | `/api/admin/bookings/[id]/receipt` — sender number (`+16042108180`) |
| `INSTAGRAM_USER_ID` | `lib/instagram.ts` — IG Business account ID for Graph API |
| `INSTAGRAM_ACCESS_TOKEN` | `lib/instagram.ts` — env-var fallback for the IG token (canonical lives in Supabase `app_credentials`) |
| `INSTAGRAM_APP_ID` | `/api/cron/refresh-instagram-token` — Meta app id for token exchange |
| `INSTAGRAM_APP_SECRET` | `/api/cron/refresh-instagram-token` — Meta app secret for token exchange |
| `CRON_SECRET` | `/api/cron/refresh-instagram-token` — gates the cron route; Vercel auto-attaches as `Authorization: Bearer` |
| `SUPABASE_ACCESS_TOKEN` | Local-only PAT for Supabase Management API (migrations, auth config); not deployed to Vercel |
| `NEXT_PUBLIC_FB_PIXEL_ID` | `layout.tsx` (pixel base snippet), `lib/meta-pixel.ts` — Meta Pixel `922591534921896`; everything no-ops when unset |
| `NEXT_PUBLIC_GADS_CONVERSION_ID` | `lib/google-ads.ts` — full `send_to` string for the Google Ads booking conversion; set in prod (`AW-18180527373/KLlYCLWAp8wcEI2qk91D`, "Book Mobile Appointment") |
| `NEXT_PUBLIC_SENTRY_DSN` | `instrumentation-client.ts`, `instrumentation.ts` — Sentry DSN; monitoring no-ops when unset |

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

Service-role-only access (RLS policy `service_role_all`). Used for credentials that need runtime mutation without a redeploy. Current rows:
- `instagram_access_token` — Meta long-lived token, rotated weekly by `/api/cron/refresh-instagram-token`
- `voice_agent_system_prompt` — local copy of the Magpipe voice agent system prompt, edited at `/admin/voice-prompt` (changes here are admin-side only; Magpipe owns the runtime prompt)

**`course_invites`** (since 2026-05-08)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| course_id | uuid | FK courses |
| email | text | Required |
| token | text | Required, 64-char hex from `crypto.randomUUID()×2` |
| invited_by | uuid | FK auth.users |
| expires_at | timestamptz | Default `now() + 30 days` |
| created_at | timestamptz | Auto |

Schema also has `status` (CHECK `pending|accepted|expired`) and `accepted_at` columns inherited from the original migration, but the runtime never sets them — `processInvite()` deletes the row on accept rather than updating status. Public RLS select (the token is the auth secret).

Two redundant enrollment paths consume invite rows so a customer never gets stranded:
1. **Auth callback** — `processInvite()` in `src/app/auth/callback/route.ts` runs immediately after `exchangeCodeForSession`. Looks up the invite by `token` from the URL, enrolls, deletes the row.
2. **Course-page self-heal** — `src/app/courses/[slug]/page.tsx`, when a logged-in user is rendered without an enrollment, looks up any matching pending invite by `(course_id, lowercased email, status='pending', not expired)`. If found, it enrolls + deletes the invite using the service-role client and renders the enrolled view. This is the safety net for the case where the `invite=` query param gets dropped or `getUser()` returns null mid-callback (an @supabase/ssr cookie-timing edge case in Route Handlers). Discovered in production 2026-05-08 when a customer who completed the full email→confirm flow was authenticated but unenrolled.

**Payment enforcement (2026-06-24):** a `user_enrollments` row (LMS access) is created *only* by a paid `course_enrollment` (Stripe webhook / login backfill) or an accepted invite. The lesson page `src/app/courses/[slug]/lessons/[lessonSlug]/page.tsx` previously auto-created an enrollment for any logged-in visitor (the free hole); it now redirects non-enrolled users to the course overview, whose non-enrolled branch shows an **"Enroll — $price"** CTA linking to the matching `/train-to-be-sharp/*` purchase page. The unused `enroll-button.tsx` (free direct insert) was deleted.

**`magpipe_call_logs`** (since 2026-05-08)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| event_type | text | `call.completed`, `sms.received`, etc. |
| call_id, agent_id, from_number, to_number, direction, duration_seconds, status | varies | Extracted flat fields for easy querying |
| transcript, summary, recording_url | text | When provided by Magpipe |
| payload | jsonb | Full original payload |
| created_at | timestamptz | Auto |

Populated by `/api/webhooks/magpipe/post-call`. RLS enabled (service-role-only access).

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

**`course_enrollments`** (since 2026-05-27)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| course_slug | text | Matches COURSES map in /api/courses/enroll |
| course_name | text | Display name |
| amount | integer | Price in cents |
| customer_name/email/phone | text | From sign-up form |
| payment_method | text | `stripe` or `etransfer` |
| status | text | `pending_payment`, `paid`, `cancelled` |
| stripe_session_id | text | Nullable |
| stripe_payment_intent_id | text | Nullable |
| paid_at | timestamptz | When payment confirmed |
| created_at | timestamptz | Auto |

RLS: admin full access only. On Stripe webhook `checkout.session.completed`, status → `paid` + auto-enrolls user in LMS if account exists. Auth callback also checks for paid enrollments by email on every login/signup.

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

## Analytics & Monitoring

Three independent tracking/observability layers (all no-op locally unless their env var is in `.env.local`):

- **First-party events** — `AnalyticsTracker` (in `layout.tsx`) + `lib/analytics-client.ts` POST pageviews/events to `/api/events`; viewed at `/admin/analytics`
- **Google Ads** — gtag base script in `layout.tsx` (`GOOGLE_ADS_ID` imported from `lib/google-ads.ts`); initial page view from the base `config`, SPA-navigation page views from `AnalyticsTracker` via `fireGooglePageView()` (re-runs `config` with `page_path`), and the "Book Mobile Appointment" conversion (`$60` CAD) from `BookingModal` via `fireBookingConversion()` (`NEXT_PUBLIC_GADS_CONVERSION_ID` set in prod). Verified live via headless test booking — gtag, unlike Meta, accepts headless-browser hits
- **Meta Pixel** — base snippet in `layout.tsx` gated on `NEXT_PUBLIC_FB_PIXEL_ID`; initial `PageView` from the snippet, SPA-navigation `PageView`s from `AnalyticsTracker` (skips its first effect to avoid double-counting), and the standard **`Schedule`** conversion (`$60` CAD) from `BookingModal` on booking success via `lib/meta-pixel.ts`. Ad sets optimize on the `Schedule` event (Sales objective)
- **Sentry** (`@sentry/nextjs`) — browser via `src/instrumentation-client.ts`, server/edge via `src/instrumentation.ts` (`onRequestError`), root crashes via `app/global-error.tsx`. Errors-only (`tracesSampleRate: 0`, `sendDefaultPii: false`), gated on `NEXT_PUBLIC_SENTRY_DSN`. No source-map upload yet (needs an org auth token), so prod stacks are minified

**Env-var guard:** `next.config.ts` validates every project-prefixed env var at build start and throws on leading/trailing whitespace or newlines (exempting Vercel-injected `NEXT_PUBLIC_VERCEL_*`). Added after a trailing-newline `NEXT_PUBLIC_TURNSTILE_SITE_KEY` shipped a broken CAPTCHA for ~3 months and a scan found 11 poisoned prod secrets. Always add env vars via `printf '%s' 'VALUE' | vercel env add KEY production --scope=snapsonic`, never dashboard paste.

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
- **Cal.com `/v2/slots` must be called with `timeZone=America/Vancouver`** — without it Cal groups slots by UTC date, so a 5:00 PM PDT slot (= midnight UTC) leaks onto the *next* day's key: the widget showed Saturday's 5 PM under Sunday, and clicking it would book Saturday (fixed 2026-07-16)
- Phone numbers are normalized to E.164 (`+1XXXXXXXXXX`) in **both** `BookingModal` (client, with inline validation error) and `/api/cal/book` (server, 400 on invalid). The implementations differ slightly by design — the client only ever emits `+` followed by 10–15 digits, which the server's regex always accepts, so the client can never produce a server-rejected value. E.164 is what Cal.com, the `bookings.customer_phone` column, and Magpipe SMS all receive
- `BookingProvider` must wrap `{children}` in `layout.tsx` — it renders `BookingModal` globally so the modal persists across page navigations
- `WhereWeAreSection` is an **async Server Component** — the first in this codebase. It cannot use hooks; interactive behavior is delegated to child `ScheduleDayCard` (client component)
- City extraction in `calSchedule.ts` reads `booking.location` as a string (current `attendeeDefined` event type returns the address as a flat string), falls back to `booking.location.address` for legacy `attendeeAddress`-shaped bookings, then to `booking.metadata.notes` `"Address: ..."` format
- **`cityFromAddress()` output is rendered on the PUBLIC schedule widget — it must never leak customer address details.** Booking addresses are customer-typed freeform; positional comma parsing once put a postal code on the homepage ("BC V7R4T6", fixed 2026-07-09). Current logic: (1) word-boundary match against canonical city names passed via the `knownCities` param (from `src/data/cities.ts`), preferring the match ending latest in the string then the longest — so "North Vancouver" beats "Vancouver", and a street named after a city loses to the real city after it; (2) fallback strict comma scan that strips postal codes and rejects digit-bearing/bare-province/"Canada" parts (handles cities outside the service list, e.g. Squamish); (3) `null` → widget shows "Home Shop". Within the service area the widget can only ever display a vetted city name
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
- **Vercel env vars must be added via CLI** (`printf '%s' 'VALUE' | vercel env add`) — dashboard pastes appended trailing newlines to 11 prod secrets, silently breaking Turnstile for ~3 months (some SDKs trim, others reject). The `next.config.ts` guard now fails any build with a whitespace-poisoned project var; if a Vercel build dies in <10s with "Failed to load next.config.ts", read the guard's error via `vercel inspect <url> --logs --scope=snapsonic`
- **`vercel redeploy <url>` rebuilds that deployment's source**, not HEAD — redeploying an old deployment URL aliases old code over newer commits. Redeploy the newest deployment or push to `main`
- **Meta's `fbevents.js` drops all events from automated/headless browsers** (bot filtering — keeps bot traffic out of conversion data). Test the pixel with a real browser, or hit the `https://www.facebook.com/tr` image endpoint directly (the `<noscript>` mechanism)
- **`<InquiryForm>` (`src/components/InquiryForm.tsx`):** shared client form used by `/train-to-be-sharp` and `/event-sharpening-service`. Takes `serviceType` as a prop and posts to `/api/contact` along with the captcha token. The same `/api/contact` endpoint is shared with `ContactSection` and `/contact` — different `service_type` values discriminate downstream in `/admin/jobs`
