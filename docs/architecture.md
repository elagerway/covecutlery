# Architecture — Cove Cutlery

## Overview

Static multi-page marketing website for Cove Cutlery knife sharpening service. Built with Next.js 14 App Router, deployed on Vercel, with Supabase handling contact form submissions.

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
│   ├── layout.tsx              # Root layout, metadata, Inter font, JSON-LD
│   ├── page.tsx                # Homepage — assembles all sections
│   ├── globals.css             # CSS custom properties, dark theme base
│   ├── api/
│   │   └── contact/route.ts    # POST endpoint — saves to Supabase
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── drop-off/page.tsx
│   ├── mobile-service/page.tsx
│   └── pricing/page.tsx
├── components/
│   ├── Navbar.tsx              # Sticky nav, mobile hamburger, smooth scroll
│   ├── Footer.tsx              # 4-col grid, social SVGs, hours, contact
│   └── sections/
│       ├── HeroSection.tsx     # Full-screen hero, 2 CTAs, trust stats
│       ├── TrustBar.tsx        # 4-item trust bar below hero
│       ├── ServicesSection.tsx # 6-card services grid
│       ├── MobileServiceSection.tsx  # Service area minimums, Instagram CTA
│       ├── DropOffSection.tsx  # Step-by-step drop-off, map link
│       ├── PricingSection.tsx  # 4 tiers + additional services table
│       ├── ReviewsSection.tsx  # 8 Google review cards
│       ├── AboutSection.tsx    # Story, YouTube placeholder, values
│       └── ContactSection.tsx  # Form (POSTs to /api/contact), contact info
└── lib/
    ├── supabase.ts             # Supabase client (anon key, client-side)
    └── cn.ts                   # className utility
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

### Pages
- All pages except `/api/contact` are statically pre-rendered at build time
- No dynamic data fetching — content is hardcoded from `project_spec.json`
- `/api/contact` is a dynamic server route (serverless function on Vercel)

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
- `"use client"` required on components that use `document.getElementById` for smooth scroll (MobileServiceSection, ContactSection, HeroSection, Navbar)
