# Architecture — Cove Cutlery

## Overview

Multi-page marketing website for Cove Cutlery cutlery sharpening service. Built with Next.js 16 App Router, deployed on Vercel. Supabase handles contact form submissions; Cal.com handles mobile appointment scheduling via server-side proxy API routes.

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
├── app/
│   ├── layout.tsx              # Root layout, metadata, Inter font, JSON-LD, BookingProvider
│   ├── page.tsx                # Homepage — assembles all sections; export const revalidate = 300 (ISR)
│   ├── globals.css             # CSS custom properties, dark theme base
│   ├── api/
│   │   ├── contact/route.ts    # POST endpoint — validates input, Turnstile verify, saves to Supabase
│   │   ├── geocode/route.ts    # GET proxy → Nominatim (sets required User-Agent header server-side)
│   │   └── cal/
│   │       ├── slots/route.ts  # GET proxy → Cal.com v2 /slots (keeps API key server-side)
│   │       ├── book/route.ts   # POST proxy → Cal.com v2 /bookings; Turnstile verify + input validation
│   │       └── schedule/route.ts  # GET — returns 7-day DaySchedule[] from Cal.com bookings
│   ├── about/page.tsx
│   ├── contact/page.tsx        # Standalone contact page with Turnstile CAPTCHA
│   ├── drop-off/page.tsx
│   ├── mobile-service/page.tsx
│   └── pricing/page.tsx
├── components/
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger; Book Now opens BookingModal
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact
│   ├── BookingProvider.tsx     # React context — exposes open() and openWithDate(date) globally
│   ├── BookingModal.tsx        # 3-step modal: date picker → time slots → details form; Turnstile CAPTCHA; phone required
│   ├── DropBoxCodeButton.tsx   # Popover CTA offering Call or Text options for drop box code
│   ├── ScheduleDayCard.tsx     # Client component — clickable day tile that opens BookingModal for that date
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, van photo, Book/Schedule/DropBox CTAs
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, booking CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, DropBoxCodeButton
│       ├── PricingSection.tsx  # 4 tiers + additional services table
│       ├── ReviewsSection.tsx  # 8 Google review cards
│       ├── WhereWeAreSection.tsx  # Async Server Component — 7-day location strip from Cal.com bookings
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form with Turnstile CAPTCHA (POSTs to /api/contact)
└── lib/
    ├── calSchedule.ts          # getWeekSchedule() — fetches Cal.com bookings, extracts city per day
    ├── supabase.ts             # Supabase client (anon key, client-side)
    └── cn.ts                   # className utility

public/
└── promaster.png              # Background-removed Ram ProMaster side-profile photo

src/app/
└── icon.svg                   # SVG favicon — gold BladeIcon on #0D1117 background (matches navbar)
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

### Pages
- `page.tsx` uses `export const revalidate = 300` — ISR, rebuilds every 5 minutes for fresh schedule data
- All other pages are statically pre-rendered at build time
- `/api/contact`, `/api/cal/slots`, `/api/cal/book`, `/api/cal/schedule` are dynamic server routes (serverless functions on Vercel)

### Environment Variables
| Variable | Used In |
|----------|---------|
| `CAL_API_KEY` | `/api/cal/slots`, `/api/cal/book`, `lib/calSchedule.ts` |
| `CAL_EVENT_TYPE_ID` | `/api/cal/slots`, `/api/cal/book` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/contact` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `ContactSection.tsx`, `contact/page.tsx`, `BookingModal.tsx` |
| `TURNSTILE_SECRET_KEY` | `/api/contact`, `/api/cal/book` |

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

- **Production URL:** https://covecutlery.vercel.app
- **Custom domain:** covecutlery.com (to be configured in Vercel dashboard)
- **GitHub repo:** https://github.com/elagerway/covecutlery
- Auto-deploy on push to `main`

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
