# Architecture — Cove Cutlery

## Overview

Multi-page marketing website for Cove Cutlery knife sharpening service. Built with Next.js 16 App Router, deployed on Vercel. Supabase handles contact form submissions; Cal.com handles mobile appointment scheduling via server-side proxy API routes.

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
│   ├── page.tsx                # Homepage — assembles all sections
│   ├── globals.css             # CSS custom properties, dark theme base
│   ├── api/
│   │   ├── contact/route.ts    # POST endpoint — saves to Supabase
│   │   └── cal/
│   │       ├── slots/route.ts  # GET proxy → Cal.com v2 /slots (keeps API key server-side)
│   │       └── book/route.ts   # POST proxy → Cal.com v2 /bookings
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── drop-off/page.tsx
│   ├── mobile-service/page.tsx
│   └── pricing/page.tsx
├── components/
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger, smooth scroll
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact
│   ├── BookingProvider.tsx     # React context — exposes useBooking().open globally
│   ├── BookingModal.tsx        # 3-step modal: date picker → time slots → details form
│   ├── DropBoxCodeButton.tsx   # Popover CTA offering Call or Text options for drop box code
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, van photo divider, booking CTA
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, booking CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, DropBoxCodeButton
│       ├── PricingSection.tsx  # 4 tiers + additional services table
│       ├── ReviewsSection.tsx  # 8 Google review cards
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form (POSTs to /api/contact), contact info
└── lib/
    ├── supabase.ts             # Supabase client (anon key, client-side)
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

### Pages
- All pages are statically pre-rendered at build time
- No dynamic data fetching on pages — content is hardcoded from `project_spec.json`
- `/api/contact`, `/api/cal/slots`, `/api/cal/book` are dynamic server routes (serverless functions on Vercel)

### Environment Variables
| Variable | Used In |
|----------|---------|
| `CAL_API_KEY` | `/api/cal/slots`, `/api/cal/book` |
| `CAL_EVENT_TYPE_ID` | `/api/cal/slots`, `/api/cal/book` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | `/api/contact` |

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
- `"use client"` required on components that use hooks or browser APIs (BookingModal, BookingProvider, DropBoxCodeButton, HeroSection, MobileServiceSection, Navbar)
- Cal.com v2 slots endpoint uses `start`/`end` params (not `startTime`/`endTime`) with `cal-api-version: 2024-09-04`; bookings endpoint uses `cal-api-version: 2024-08-13`
- `BookingProvider` must wrap `{children}` in `layout.tsx` — it renders `BookingModal` globally so the modal persists across page navigations
