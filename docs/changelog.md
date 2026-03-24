# Changelog

## [1.2.1] — 2026-03-24

### Added
- **Turnstile CAPTCHA in BookingModal** — details step now requires CAPTCHA before the Confirm Booking button is enabled; token sent to `/api/cal/book` and verified server-side before Cal.com API call
- **`/api/geocode` proxy route** — server-side Nominatim proxy that sets the required `User-Agent` header; `BookingModal` address autocomplete now calls this instead of fetching Nominatim directly from the browser
- **`vancouverMidnightISO()` in `calSchedule.ts`** — DST-aware helper using `Intl.DateTimeFormat` noon-probe trick to compute the correct UTC timestamp for Vancouver midnight, replacing the broken `new Date("YYYY-MM-DDT00:00:00")` which parsed in server-local (UTC) time on Vercel

### Changed
- **Phone is now required** in `BookingModal` — field marked with gold asterisk, `handleBook` guard and button disabled state both check for phone value
- **`contact/route.ts` validation order** — cheap name/email checks now run before the outbound Turnstile fetch to avoid unnecessary external calls on bad input

### Fixed
- **BookingModal time step** — slot grid is now gated behind `!loadingSlots`; spinner and grid no longer render simultaneously, eliminating the false "No slots available" flash on load
- **Cal.com error message** — `/api/cal/book` now extracts `data?.error?.message ?? data?.message` instead of wrapping the full error object, so users see a readable message instead of `[object Object]`
- **ContactSection field names** — `serviceType`/`numberOfItems` renamed to `service_type`/`item_count` to match the API route and Supabase schema (silent data loss bug)
- **`vancouverMidnightISO` NaN guard** — added bounds check (`offsetHours < 6 || offsetHours > 9`) with PDT fallback in case `Intl.DateTimeFormat` returns an unexpected value

## [1.2.0] — 2026-03-24

### Added
- **"Where We'll Be This Week" section** — 7-day rolling location strip on homepage; reads confirmed Cal.com bookings, extracts city from attendee address, shows "Home Shop" fallback when no bookings. First async Server Component in the codebase (ISR revalidate 300s)
- **`lib/calSchedule.ts`** — `getWeekSchedule()` utility; fetches Cal.com v2 bookings, parses `metadata.notes` for city, returns `DaySchedule[7]`
- **`src/app/api/cal/schedule/route.ts`** — GET endpoint wrapping `getWeekSchedule()`
- **`ScheduleDayCard`** — client component; clicking a day tile opens `BookingModal` pre-navigated to that date's time slots
- **`BookingProvider.openWithDate(date)`** — new context method to open the booking modal for a specific date
- **Cloudflare Turnstile CAPTCHA** on both the homepage ContactSection and the standalone `/contact` page; server-side token verification in `/api/contact` before Supabase insert
- **"Current Schedule" button** in hero CTA row — gold outline style, links to `#schedule` anchor, positioned between "Book Mobile Service" and "Get Drop Box Code"

### Changed
- **Navbar "Book Now"** now calls `openBooking()` directly (was a `<Link>`)
- **`BookingModal`** accepts `initialDate` prop; when set, jumps directly to the time-slot step
- All phone numbers site-wide changed to **604 373 1500**
- Removed **Credit Card** from accepted payment methods in ContactSection
- `page.tsx` exports `revalidate = 300` to activate ISR for the schedule section

### Fixed
- `/contact` page now includes Turnstile widget — previously CAPTCHA was added to API but not this page, breaking all standalone contact form submissions

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
