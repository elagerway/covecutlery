# Changelog

## [2.4.0] — 2026-04-29 — Citywide SEO/GEO expansion (Phases 1–2)

### Phase 2 — Tri-Cities split

Coquitlam, Port Moody, and Port Coquitlam are three distinct cities; the prior `/service-area/coquitlam` page lumped all three (plus Anmore) which diluted the SEO signal for each.

- **`/service-area/coquitlam`** rewritten — focuses solely on Coquitlam (Coquitlam Centre, Burke Mountain, Westwood Plateau, Maillardville, Austin Heights). Drive time corrected to 25–30 min
- **`/service-area/port-moody`** added — Newport Village, Suter Brook, Brewer's Row, Heritage Mountain, Inlet Centre, Anmore + Belcarra. ~33k residents context. 22–28 min drive
- **`/service-area/port-coquitlam`** added — Downtown PoCo, Mary Hill, Citadel Heights, Lincoln Park. ~62k residents, family/residential character. 30–35 min drive
- Each city has unique 3-paragraph description, 4 city-specific FAQs, neighbourhood list, and meta title/description; all three flagged `dropOffEmphasis: false`, `subRegion: 'Tri-Cities'`

### Phase 1 — Foundation

### Added
- **`dropOffEmphasis: boolean`** field on `CityData` — only North Vancouver is `true`. Everywhere else is mobile-only per current operations
- **`subRegion`** classification on `CityData` for sub-region grouping on the upcoming hub redesign (`'North Shore' | 'Vancouver' | 'Burnaby & New West' | 'Tri-Cities' | 'South of Fraser' | 'Fraser Valley'`)

### Changed
- **`/service-area/[city]` template** now conditionally renders the hero subtitle and CTA copy based on `dropOffEmphasis`. Mobile-only cities get "Mobile Knife Sharpening in {city}, BC" + "We come to your home or restaurant. $12/knife with a 30-day edge guarantee." instead of the drop-off-promoting variant
- **Burnaby FAQ** — replaced the drop-off question with one about sharpening Burnaby's diverse food-scene blade types (Western, Chinese cleavers, Japanese gyuto/santoku, Vietnamese)
- **West Vancouver FAQ** — replaced the drop-off question with one about typical mobile-visit duration
- **Service radius bumped from 90 km → 105 km** (`MAX_KM` in `/api/cal/book/route.ts`) — covers Chilliwack (~95 km centroid, ~100 km edges) so booking won't reject Fraser Valley addresses once those city pages ship in Phase 4

## [2.3.1] — 2026-04-29

### Changed
- **`/train-to-be-sharp` rewritten with the actual course structure** (replaces the placeholder 3-hr / 5-hr framing): three modules — One-Inch Grinder ($600), Two-Inch Grinder ($400), Business Process & Automation ($200) — payable in advance, non-refundable
- New page sections: course modules grid, the practicum (sharpness-tester + microscope verification, recorded sessions), return on investment ($200/hr earning potential, 1–2 month payback), equipment & startup costs ($300–$15,000 range, mobile power station ~$1,200, van ~$13,000), location (onsite at North Van home office or mobile with level parking)
- Inquiry form `messagePlaceholder` updated to prompt for module choice; metadata description rewritten to reflect actual offering and pricing

## [2.3.0] — 2026-04-29

### Added — content parity with legacy coveblades.com
- **`/how-we-sharpen-your-knives`** — process / methodology page (4 principles, 5-step process, no form). Legacy slug for SEO continuity
- **`/train-to-be-sharp`** — training program page describing 3-hour core + 5-hour extended (with business module). Includes inquiry form posting to `contact_submissions` with `service_type="Training"`
- **`/event-sharpening-service`** — on-site event sharpening landing (4 features, 5-step process, event-types list). Inquiry form posts with `service_type="Event"`
- **Reusable `<InquiryForm>` component** — shared form for the new lead-capture pages; CAPTCHA via Turnstile, posts to existing `/api/contact`. Avoids three near-duplicate form bodies
- **Three legacy blog posts imported** to Supabase `blog_posts`: `how-to-cut-onions`, `japanese-knife-sharpening`, `knife-sharpening-on-the-north-shore`. Featured images downloaded to `public/blog/` so they survive the DNS flip away from WordPress. Skipped two posts that contradict current operations (kitchen cutlery shop, knife rentals)
- **`/staysharp` → `/blog` permanent redirects** in `next.config.ts` (apex slug + `/staysharp/:slug`). Preserves coveblades.com WordPress backlinks and Google indexing
- **Sitemap updated** with the three new routes
- **Footer**: Snapsonic credit line ("Built with love by Snapsonic") added under the Privacy/Terms row, centered. Quick Links updated to surface the new pages
- **Navbar**: replaced the redundant "/Services" anchor with three new top-level links (How We Sharpen, Training, Events). Mobile menu inherits the same list

### Changed
- **Privacy Policy** — third-party services list updated to match reality: added Supabase, Magpipe, Cloudflare Turnstile, Vercel. Added SMS opt-in disclosure. "Last updated" bumped to 2026-04-29
- **Terms of Service** — services list now includes training programs and explicitly mentions on-site event sharpening. Removed stale "deposits forfeited" cancellation language (deposits no longer collected since v2.0.0). "Last updated" bumped to 2026-04-29

### Not imported (intentional)
- `/kitchen-cutlery-shop-now-open` blog post — the cutlery shop is no longer offered
- `/knife-rentals-at-cove-blades` blog post — rentals are no longer offered
- Grails / pocket-knife collectibles page — dropped per user direction

## [2.2.0] — 2026-04-29

### Changed
- **Brand renamed: Cove Cutlery → Cove Blades** — full sweep across UI, metadata, JSON-LD, OpenGraph, manifest, llms.txt, project_spec.json, and active docs (~200 string replacements across 41 files)
- **Production domain: `covecutlery.ca` → `coveblades.com`** — `metadataBase`, sitemap, robots.txt, auth callback host allowlist, breadcrumbs, invoice/receipt email + SMS templates all updated
- **Email addresses** — `info@covecutlery.ca` → `info@coveblades.com`, `pay@covecutlery.ca` → `pay@coveblades.com`
- **Social handles** — Instagram, Facebook, YouTube `@covecutlery` → `@coveblades` in JSON-LD `sameAs`, footer, About/Mobile sections, llms.txt
- **Display phone: `604-373-1500` → `604-210-8180`** — all customer-facing tel: links, display strings, and customer SMS confirmation message body. Backend SMS sender (`MAGPIPE_SMS_FROM`) and admin notification recipient (`ADMIN_PHONE` in `/api/cal/book`) intentionally left at `+16043731500` since SMS is provisioned to that number; reprovision Magpipe and update env to converge
- **`package.json` name** — `covecutlery` → `coveblades`
- The word "cutlery" retained in marketing copy (page titles, meta descriptions, body copy) — only the brand name changed
- Logo files (`public/logo-icon-512.png`, `public/og-default.png`) reused as-is

### Not changed (intentional)
- `covecutlery.vercel.app` Vercel deployment URL kept in auth callback host allowlist and active docs (Vercel project not renamed)
- `github.com/elagerway/covecutlery` repo URL kept in active docs (repo not renamed)
- Historical docs (`changelog.md` prior entries, `docs/plans/*`, `docs/brainstorms/*`) left intact as historical record

### Added — staging.coveblades.com support
- **`lib/origin.ts`** — `safeOrigin()` helper with host allowlist (`coveblades.com`, `www.coveblades.com`, `staging.coveblades.com`) for outgoing redirect/link URLs. Falls back to `https://coveblades.com` when the request origin is missing or not allowlisted, preserving the prior anti-spoofing behavior
- **Stripe checkout origin** (`/api/invoices/[id]/pay/route.ts`) — `success_url` and `cancel_url` now use `safeOrigin()`. When triggered from staging, customers stay on staging after Stripe redirect
- **Invoice send origin** (`/api/admin/invoices/[id]/send/route.ts`) — invoice emails + SMS now contain a `View invoice` link to whichever host the admin is on (staging or prod)
- **Stripe booking-checkout origin** (`/api/stripe/checkout/route.ts`) — was using raw `req.headers.get("origin")` for `success_url`/`cancel_url`, which let an attacker spoof the Origin header and leak Stripe `session_id` to an arbitrary domain. Now uses `safeOrigin()` like the invoice pay flow
- **Auth callback host allowlist** (`/auth/callback/route.ts`) — added `staging.coveblades.com`
- Vercel: `staging.coveblades.com` attached to the `covecutlery` project (verified via API)
- Supabase Auth: `site_url` set to `https://coveblades.com`; `uri_allow_list` updated to include staging + new + old domains for transition

### External setup status
- DNS: `coveblades.com` apex still on SiteGround NS — not yet verified by Vercel (apex won't serve until DNS flips). `staging.coveblades.com` already serving 200 OK from Vercel via SiteGround A record
- Vercel: ✅ staging domain attached to project
- Supabase Auth: ✅ redirect allowlist + site_url updated via Management API
- Postmark: pending — sender domain `coveblades.com` still needs verification before transactional email sends
- Magpipe: pending — reprovision SMS sender to `604-210-8180` and update `MAGPIPE_SMS_FROM` env + `ADMIN_PHONE` constant

## [2.1.0] — 2026-04-10

### Added
- **SMS marketing campaigns** — new `/admin/campaigns` tab for bulk SMS outreach
  - Compose message with 160-char SMS counter and personalization variables (`{{first_name}}`, `{{name}}`, `{{phone}}`)
  - Recipient selector: search, filter by source, select all/individual, only customers with phone numbers
  - Manual phone number input for ad-hoc recipients alongside customer selection
  - Preview modal and send confirmation with recipient count
  - Campaign history with expandable cards, delivery stats (sent/failed), delete
  - `campaigns` table in Supabase with recipient JSONB tracking
- **PWA support** — installable as a mobile/desktop app
  - Web manifest (standalone, dark theme, shield icon, starts at `/admin/invoices`)
  - Service worker via `@ducanh2912/next-pwa` (disabled in dev)
  - Viewport meta with `theme-color: #0D1117`
- **Mobile-responsive admin**
  - Bottom navigation bar on mobile with icon buttons (Jobs, Invoices, Campaigns, Customers, Blog, More)
  - Slide-out drawer for full menu via hamburger button
  - Desktop sidebar unchanged (hidden on mobile)
  - Horizontal scroll on invoice and customer tables with min-width
  - Form grids stack to single column on mobile
  - Search inputs full-width on mobile
- **Invoice enhancements**
  - Save as PDF button on public invoice page with print-optimized light-theme layout
  - Payment method and time shown on public invoice page and in receipt emails
  - Shield logo in email headers (invoice + booking receipt)
  - Preview button on invoice detail page
  - Send popover with editable email/phone before sending
  - Inline edit mode on any invoice (including paid)
- **Admin nav link** — gold "Admin" link in public navbar when logged in
- **Auth fixes** — Supabase site URL + redirect URLs configured for production; PKCE flow re-enabled; login redirects to `/admin/invoices`

### Changed
- **Shared utilities extracted** — `requireAdmin`/`getServiceClient`/`ADMIN_EMAIL` to `lib/admin.ts`; `formatCAD`/`normalizePhone`/`escapeHtml`/`LineItem` to `lib/format.ts`
- **Magpipe SMS endpoint** — updated from deprecated `/v1/sms` to `/functions/v1/send-user-sms` with new field names across all 3 SMS routes
- **SMS from number** — reverted to `+16043731500` (provisioned Magpipe number)

### Fixed
- **XSS in email templates** — all dynamic values now escaped via `escapeHtml()`
- **Origin header spoofing** — hardcoded to `covecutlery.ca` in production
- **Line item input validation** — type/range checks on invoice creation
- **UUID validation** on public pay endpoint
- **Null due_date** handled in email templates and public invoice view
- **Vercel build** — fixed `createBrowserClient` import in Navbar
- **Vercel SUPABASE_SERVICE_ROLE_KEY** — corrected typo causing 500s on production

## [2.0.0] — 2026-04-09

### Added
- **Invoice system** — full CRUD for creating, sending, and collecting payment on invoices for mobile sharpening clients
  - Admin pages: invoice list (`/admin/invoices`), create new (`/admin/invoices/new`), invoice detail (`/admin/invoices/[id]`)
  - Public invoice view (`/invoice/[id]`) — branded Cove Cutlery display with Stripe card payment and Interac e-Transfer instructions
  - API routes: create, list, detail, send (email + SMS), mark-paid, public view, Stripe checkout
  - Line items with preset pricing (Knife Sharpening $12, Lawnmower blade $15, etc.) + custom items
  - Invoice preview modal on the create form
  - Mark as Paid button for pre-paid invoices
  - Optional due date (checkbox to include)
  - Work Completed date — auto-filled from most recent Cal.com or Google Calendar booking
  - Stripe webhook extended to handle invoice payment completion
- **Customers table** — dedicated `customers` table in Supabase replacing the derived-from-bookings approach
  - Seeded from both Cal.com accounts (Cove Cutlery + Cove Blades), macOS Contacts, and Google Calendar export
  - 437 customers imported with phone numbers from `smsReminderNumber` and `attendeePhoneNumber` Cal.com fields
  - Searchable customer dropdown on invoice creation form
  - Admin customers page with search, add customer form, and editable customer detail
  - Source badges: `cal.com`, `imported`, `manual`, `invoice`
  - Auto-upsert on invoice creation
- **Last booking date lookup** — `/api/admin/customers/last-booking` searches Cal.com (both accounts), Supabase bookings, and Google Calendar ICS export by email, phone, and name/address
- **Invoices link** added to admin sidebar nav

### Changed
- **Customers page** — rebuilt as client component reading from the `customers` table; added search filter, add customer form, source badges, and click-through to editable detail
- **Customer detail page** — rebuilt with editable name, email, phone, address, notes; delete button; routes by UUID instead of email
- **Customer API** — `/api/admin/customers` now reads/writes the `customers` table; `[id]` route replaces `[email]` with GET/PATCH/DELETE

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
