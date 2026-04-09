# Changelog

## [1.9.0] — 2026-04-08

### Changed
- **Booking flow — deposit removed** — mobile bookings no longer require a $50 Stripe deposit; customers confirm directly after selecting date/time/details; booking is saved as `confirmed` with `deposit_amount: 0`
- **BookingModal** — "Pay $50 Deposit & Confirm" button replaced with "Confirm Booking"; booking completes in-modal instead of redirecting to Stripe Checkout
- **Booking success page** — simplified to a static confirmation page; no longer verifies Stripe session

### Added
- **SMS booking notifications** — on confirmed booking, SMS sent to admin (+16043731500) with booking details and to the customer with confirmation via Magpipe API
- **Supabase insert in `/api/cal/book`** — booking record now created directly in the book route (previously created in `/api/stripe/checkout`); status set to `confirmed` immediately

## [1.8.1] — 2026-03-25

### Fixed
- **Lazy Supabase initialization** — blog pages, blog/[slug], sitemap, and `lib/supabase.ts` now guard against missing `NEXT_PUBLIC_SUPABASE_URL`; preview deployments without Supabase env vars no longer crash at build time (mirrors the earlier lazy Stripe init pattern)

## [1.8.0] — 2026-03-25

### Added
- **SEO infrastructure** — dynamic `sitemap.xml` (ISR hourly, includes all static pages, blog posts, and city pages), `robots.txt` (blocks admin/api/auth/booking), and `public/llms.txt` for AI crawlers
- **Schema helpers** — `src/lib/schema.ts` with `safeJsonLd()` (XSS-safe JSON-LD serialization), `breadcrumbSchema()`, `faqPageSchema()`, and shared `FAQ` interface
- **BlogPosting schema** on all blog post pages with BreadcrumbList and canonical URLs
- **FAQPage schema** on pricing page for existing FAQ items
- **Service area hub** — `/service-area` with city grid, FAQ schema, breadcrumb, booking CTA
- **5 city landing pages** — `/service-area/[city]` for North Vancouver, Vancouver, Burnaby, West Vancouver, and Coquitlam; SSG via `generateStaticParams`; each with unique content, FAQ/Breadcrumb/Service JSON-LD schema
- **City data module** — `src/data/cities.ts` with per-city SEO content, neighbourhoods, drive times, FAQs, meta tags
- **Restaurant page** — `/restaurants` targeting commercial kitchen managers with benefits, how-it-works, FAQ schema
- **Default OG image** — `public/og-default.png` (1200×630, gold-lit Japanese knife on dark background)
- **Booking noindex** — `src/app/booking/layout.tsx` adds `robots: noindex` to all booking pages
- **Home page metadata** — explicit `Metadata` export with title, description, and canonical URL

### Changed
- **Domain fixed to `.ca`** — `metadataBase`, `openGraph.url`, and all LocalBusiness schema URLs updated from `covecutlery.com` to `covecutlery.ca`
- **LocalBusiness schema expanded** — added `foundingDate`, `geo` coordinates, `sameAs` social links; applied `safeJsonLd()` for XSS protection
- **Aggregate rating removed** — fabricated 50-review/5.0-star rating removed to avoid Google manual penalty
- **Twitter card meta** — added `twitter: { card: 'summary_large_image' }` to root metadata
- **Footer links** — added "Service Areas" and "Restaurants" to quick links
- **Pricing page** — added `alternates.canonical` and FAQPage JSON-LD schema

## [1.7.2] — 2026-03-25

### Added
- **Privacy Policy page** — `/privacy` covering data collection, third-party services (Cal.com, Stripe, Postmark, Google Maps), cookies, and PIPEDA rights
- **Terms of Service page** — `/terms` covering service scope, bookings/payment, 30-day guarantee, liability, cancellations, and service area
- **Footer legal links** — Privacy Policy and Terms of Service links added to footer
- **Drop-off static map** — `public/map-dropoff.png` dark-themed Google Maps snapshot replaces placeholder; clickable, links to Google Maps

### Changed
- **Navbar & favicon** — switched to `logo-icon-512.png` (shield + sword logo); footer also uses new logo
- **Receipt sender email** — changed from `help@covecutlery.ca` to `info@covecutlery.ca`
- **Booking CAPTCHA removed** — Cloudflare Turnstile removed from `BookingModal` and `POST /api/cal/book`; contact form Turnstile unchanged
- **Booking API validation tightened** — `POST /api/cal/book` now requires phone and address (matching client-side requirements)
- **Contact form** — all fields now mandatory (phone, email, item count, message were optional)
- **Business hours** — Mon–Fri updated from 10am to Noon across all pages, footer, and JSON-LD schema
- **About section** — corrected equipment from "Tormek and Wicked Edge" to "custom-built and Bucktool machines with Airplaten accessories"; Airplaten links to airplaten.com
- **Drop-off section** — "Get Drop Box Code" button moved inline with section heading; map card stretches to match left column height
- **Background grid removed** — subtle grid texture overlays removed from HeroSection, DropOffSection, and AboutSection

### Fixed
- **App icon size** — `public/icon-512.png` compressed from 445 KB → 130 KB via PNG quantization (32 colours); annotation artefact removed

## [1.7.1] — 2026-03-24

### Added
- **App icon** — `public/icon-512.png` — 512×512 Gyuto kitchen knife icon; gold outline on dark navy background, clean flat style

## [1.7.0] — 2026-03-25

### Added
- **Service area validation** — booking flow now checks the customer's address before taking payment; blocks addresses outside 90 km of North Vancouver OR west of -123.35° longitude (Sunshine Coast, Vancouver Island require a ferry)
- Client-side check in `BookingModal` uses Google Places geometry coords captured at autocomplete selection; shows a clear error before the Cal.com booking is attempted
- Server-side guard in `POST /api/cal/book` geocodes the address string via Google Geocoding API as a second line of defence
- `GET /api/geocode?place_id=` now returns `geometry` alongside `address_components`

## [1.6.1] — 2026-03-25

### Fixed
- **Receipt modal now visible** — popover was clipped by `overflow-hidden` on the table wrapper; moved to a `fixed` full-screen overlay rendered outside the table
- **Receipt modal shows send result** — success ("Receipt sent successfully!") and error messages now display inline in the modal; Send button hides on success, replaced by Close
- **Stale job drawer** — drawer now derives its data from the live `bookings` array by ID so it automatically reflects charges, refunds, and receipt sends after `router.refresh()`

### Added
- **Activity timeline in job drawer** — shows chronological events: Booking created, Deposit paid, Day-of charge (with method + amount), Receipt sent, Deposit refunded
- **`receipt_sent_at` column** on `bookings` table — stamped by the receipt API on successful send; displayed in the activity timeline

## [1.6.0] — 2026-03-25

### Added
- **Cash vs Card payment capture** — "Charged" column now splits into 💵 Cash / 💳 Card buttons; records `payment_method` on the booking
- **Stripe off-session card charge** — `POST /api/admin/bookings/[id]/charge` charges the saved card via Stripe PaymentIntents; checkout now saves customer + payment method for future use (`customer_creation: always`, `setup_future_usage: off_session`)
- **Receipt sending** — `POST /api/admin/bookings/[id]/receipt` sends a formatted receipt via Postmark (email) and/or Magpipe SMS from `+16043731500`; admin can edit destination email/phone before sending
- **Receipt button in Jobs table** — blue "Receipt" button opens a popover with pre-filled email/phone checkboxes and editable fields
- **Job detail drawer** — clicking any row in the Jobs table opens a side drawer showing full booking details, payment history (deposit + day-of charge with method), total, and notes
- **Customers table — Total Paid column** — shows deposits + day-of charges combined (green)
- **Customer detail — Total Paid stat + table columns** — stat card plus Charged/Total columns in booking history
- **Phone normalization** — `src/lib/format.ts` exports `formatPhone()` which normalises any input to `(XXX) XXX-XXXX`; applied in JobsTable, CustomersTable, CustomerDetail; existing DB records normalised via SQL migration
- **Clickable customer rows** — entire row navigates to customer detail; View button removed
- **`stripe_customer_id` column** on `bookings` table; saved from webhook on checkout completion
- **`payment_method` column** on `bookings` table (`card` / `cash`)

### Changed
- **Address autocomplete** switched from Nominatim to Google Places API (two-step autocomplete → place details); produces clean `123 Street, City, BC V0V 0V0` format with house numbers
- **Jobs page sort** — now sorts by `created_at DESC` (most recently created booking first); Supabase client uses `cache: "no-store"` to bypass Next.js fetch cache
- **Refund button hover** — adds red border on hover for visibility
- **BookingModal `appointment_date`** — now derived via `formatDate(new Date(selectedSlot))` using Vancouver timezone instead of raw UTC `.split("T")[0]`

### Fixed
- **Supabase server client** — added `global.fetch` override with `cache: "no-store"` to prevent Next.js from caching Supabase query results

## [1.5.0] — 2026-03-25

### Added
- **Admin Customers section** — `/admin/customers` lists all unique customers derived from booking history (name, email, phone, booking count, total deposits, last booking date); `/admin/customers/[email]` shows full booking history, editable name/phone, and per-booking refund button
- **Customers nav link** added to `AdminNav`
- **`POST /api/admin/bookings/[id]/refund`** — issues a full Stripe deposit refund via `payment_intent`, sets booking status to `refunded`; guards against already-refunded intents with try/catch
- **`PATCH /api/admin/customers/[email]`** — updates customer name/phone across all their bookings

### Fixed
- **Cal.com booking — attendee address** — address is now passed as `location: { type: "attendeeAddress", address }` to Cal.com instead of buried in `metadata.notes`; `in_person_attendee_address` field now populates correctly in the Cal.com dashboard
- **`calSchedule.ts` — city extraction** — reads city from `location.address` (new format) with fallback to legacy `metadata.notes` "Address: ..." format for existing bookings
- **`BookingModal` — notes cleanup** — removed "Address: ..." prefix from notes string since address now goes in the dedicated location field

## [1.4.2] — 2026-03-25

### Fixed
- **`/api/stripe/checkout` — restore insert error log** — re-added `console.error` for Supabase insert failures (safe: logs PostgrestError diagnostic fields only, no PII); the previous commit stripped all debug logging including this useful production diagnostic

## [1.4.1] — 2026-03-24

### Fixed
- **`/api/cal/cancel` — auth guard** — endpoint now looks up the booking in Supabase by `cal_booking_uid` and only proceeds if status is `pending_payment`; returns 403 otherwise, preventing anyone with a UID from cancelling confirmed or completed bookings
- **Stripe webhook — Cal.com cancel check** — `checkout.session.expired` handler now only updates Supabase status to `cancelled` if the Cal.com cancellation API call succeeds (`cancelRes.ok`); leaves status as-is on failure so the record isn't silently marked cancelled while the slot remains live
- **Stripe webhook — out-of-order event guard** — `checkout.session.expired` now fetches booking `status` and only cancels if still `pending_payment`, preventing a late-arriving expired event from overwriting a confirmed booking
- **`/api/stripe/checkout` — Supabase insert failure handling** — if the Supabase `bookings` insert fails, the endpoint now cancels the orphaned Cal.com booking and expires the Stripe session before returning a 500; prevents ghost bookings with no record
- **`/api/stripe/checkout` — service role client** — switched from SSR anon client to direct service role client; the `bookings` table is admin-only RLS so inserts with the anon key were silently failing
- **`BookingModal` — null `calBookingUid` guard** — extracts and validates `calBookingUid` before calling `/api/stripe/checkout`; shows error message and halts if the UID cannot be resolved instead of passing `undefined` to the API
- **`BookingModal` — orphaned Cal.com slot on Stripe failure** — if the Stripe checkout API call fails, the modal now calls `/api/cal/cancel` to free the slot before showing the error, so the customer can retry the same time
- **`/booking/success` — session ID format validation** — rejects non-`cs_` session IDs before calling Stripe, preventing invalid requests from reaching the API
- **`/booking/success` — payment status check** — `SuccessContent` now verifies `session.payment_status === 'paid'`; shows a "Payment Not Completed" error state instead of "Booking Confirmed!" when payment has not been received

## [1.4.0] — 2026-03-24

### Added
- **Stripe $50 deposit** — booking flow now redirects to Stripe Checkout after Cal.com slot reservation; `/booking/success` confirms, `/booking/cancel` cancels the Cal.com slot
- **Stripe webhook** (`/api/stripe/webhook`) — handles `checkout.session.completed` (confirms booking) and `checkout.session.expired` (cancels Cal.com slot); webhook endpoint registered on Stripe live account
- **`bookings` Supabase table** — stores all mobile bookings with Stripe session ID, Cal.com UID, customer info, deposit amount, amount charged on day, and status; admin-only RLS
- **Admin Jobs tab** (`/admin/jobs`) — lists all bookings; inline editor for "amount charged on day"; auto-calculated total; status dropdown per booking
- **`/api/admin/bookings/[id]`** PATCH — updates amount_charged, status, notes
- **`/api/cal/cancel`** POST — cancels a Cal.com booking by UID
- **`stripe` npm package** added
- **`proxy.ts`** — renamed from `middleware.ts` per Next.js 16 convention; function renamed to `proxy`

### Changed
- **BookingModal confirm button** — now reads "Pay $50 Deposit & Confirm"; after Cal.com booking, redirects to Stripe Checkout instead of showing done step
- **Admin login page** — `useSearchParams` wrapped in `<Suspense>` to fix Next.js 16 prerender error
- **Admin route structure** — protected pages moved under `admin/(protected)/` route group to fix infinite redirect loop on `/admin/login`
- **Payment methods** — "Credit & Debit" added alongside Cash and Interac e-Transfer in ContactSection

## [1.3.0] — 2026-03-24

### Added
- **Public blog** — `/blog` (ISR card grid, revalidate 300s) and `/blog/[slug]` (full post, generateStaticParams, generateMetadata, OG tags); posts sourced from Supabase `blog_posts` table
- **Admin section** — `/admin/blog` (post list with publish/unpublish/delete), `/admin/blog/new` (create), `/admin/blog/[id]/edit` (edit); fully protected behind Supabase Auth
- **Supabase magic-link authentication** — `/admin/login` sends OTP email; `/auth/callback` exchanges PKCE code for session; admin access restricted to `elagerway@gmail.com`
- **Edge middleware** (`src/middleware.ts`) — refreshes Supabase session on every request using the double-cookie pattern; redirects unauthenticated users from `/admin/**` to `/admin/login`
- **`@supabase/ssr`** — added to project; `src/utils/supabase/server.ts` (async cookies, Next.js 16 compatible) and `src/utils/supabase/client.ts` for client components
- **Admin UI components** — `AdminNav` (sidebar with logout), `PostForm` (auto-slug, Save Draft / Publish), `PostTable` (inline actions, optimistic refresh)
- **`/api/admin/posts` routes** — GET list, POST create, PUT update, DELETE; `requireAdmin()` helper re-validates session email on every call; `published_at` preserved on re-publish
- **`blog_posts` Supabase table** — with RLS: public SELECT on published posts, full admin access gated on `auth.jwt() ->> 'email' = 'elagerway@gmail.com'`; `updated_at` trigger
- **Blog link in Navbar** — added to both desktop and mobile nav

## [1.2.2] — 2026-03-24

### Added
- **SVG favicon** (`src/app/icon.svg`) — gold blade icon on `#0D1117` background, matching the navbar; Next.js App Router serves it automatically

### Changed
- **Brand copy: "Knife" → "Cutlery"** across all page titles, meta descriptions, OG tags, keywords, hero headline, section copy, footer, and JSON-LD structured data
- **Reviews updated** — replaced 8 stale reviews with the 6 most recent Google reviews (sourced from coveblades.com); grid now shows a clean 3×2 layout; "Cove Blades" references updated to "Cove Cutlery"
- **"— see more —" link** added below reviews grid, pointing to the Google Places reviews page

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
