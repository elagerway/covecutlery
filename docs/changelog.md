# Changelog

## [1.1.0] — 2026-03-24

### Added
- **Cal.com booking integration** — `BookingModal` (3-step: date → time → details) powered by Cal.com v2 REST API; proxy routes `/api/cal/slots` and `/api/cal/book` keep API key server-side
- **`BookingProvider`** — React context wraps the app so any component can open the booking modal via `useBooking().open`
- **`DropBoxCodeButton`** — reusable popover component offering both Call and Text options for the drop box code; replaces all previous `tel:` CTA links
- **Address autocomplete** — Nominatim (OpenStreetMap) Canadian address search with debounce in booking form; address is a required field
- **Ram ProMaster van image** — background-removed side-profile photo used as hero decoration between gold divider lines
- **`public/promaster.png`** — rembg-processed transparent PNG of the service van

### Changed
- All social/email links updated from `coveblades` → `covecutlery` across Footer, ContactSection, AboutSection, MobileServiceSection, about page, contact page, layout JSON-LD, and project_spec.json
- "Book Mobile Service" and "Book Mobile" CTAs now open `BookingModal` instead of scrolling to contact form
- TrustBar "4+ Years in Business" → "6+ Years in Business" (operating since 2020)
- Hero blade/diamond SVG divider replaced with real van photo

### Fixed
- API routes now catch network errors and check `res.ok` before parsing JSON — prevents silent 500s on Cal.com outage
- `BookingModal` reset `setTimeout` now tracked in a ref and cleared on re-open, preventing stale state wipe if modal is closed and reopened within 300 ms

## [1.0.0] — 2026-03-24

### Added — Milestone 1: MVP Website

**Pages**
- `/` — Long-scroll homepage with all sections assembled
- `/mobile-service` — Mobile sharpening page with service area details, how-it-works, FAQ
- `/pricing` — Full pricing page with tiers, additional services, FAQ
- `/drop-off` — Drop-off instructions, address, hours, CTA
- `/about` — Brand story, YouTube channel link, values
- `/contact` — Full contact form + contact info sidebar

**Homepage Sections**
- `HeroSection` — Full-screen dark hero with headline, 2 CTAs, trust stats row
- `TrustBar` — 4-item trust bar (5★ rating, years in business, service area, guarantee)
- `ServicesSection` — 6-card grid (1-Hour Turnaround, Ceramic & Serrated, Special Events, Mobile, 30-Day Guarantee, Drop Box)
- `MobileServiceSection` — Service area minimum requirements, Instagram CTA
- `DropOffSection` — Numbered step instructions, address card, map link
- `PricingSection` — 4-tier pricing (Residential $12, Home Pro $10 featured, Commercial $8, Mobile $12) + additional services table
- `ReviewsSection` — 8 Google reviews with star ratings and author avatars
- `AboutSection` — Brand story, YouTube placeholder card, 3 values cards
- `ContactSection` — Contact form with Supabase submission + contact info sidebar

**Components**
- `Navbar` — Sticky, scroll-aware, mobile hamburger menu, smooth scroll on homepage
- `Footer` — 4-column grid with quick links, hours, contact, social icons

**Backend**
- `POST /api/contact` — Server-side route, validates name/email, inserts to Supabase
- Supabase `contact_submissions` table with RLS enabled

**Infrastructure**
- Next.js 16.2.1 with App Router, TypeScript, Tailwind CSS v4
- Vercel deployment linked to GitHub `elagerway/covecutlery`
- LocalBusiness JSON-LD structured data in `<head>`
- Full Next.js metadata API (title, description, OG tags, robots)
- Inter font via Google Fonts
