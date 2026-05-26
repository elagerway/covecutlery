# Project Status

**Last updated:** 2026-05-26

## Milestone 10 — Admin inbox (SMS + Email) ✅ Complete

Unified two-channel inbox in `/admin` with read state, search, badge counts, and three auto-replies.

- [x] `/admin/messages` — SMS via Magpipe (`list-messages` + `send-user-sms`). Chat-bubble UI, ⌘↵ send, 10s polling. Outbound gold right, inbound dark left, AI auto-replies tagged.
- [x] Spans both Cove Blades service numbers (current `+16042108180` + retired `+16043731500`) via `SERVICE_NUMBERS` array
- [x] Conversation filters: drop service-to-service self-loops, drop one-way outbound blasts
- [x] `/admin/email` — Postmark Inbound → SiteGround forwarders for `info@` / `erik@` / `training@coveblades.com` → webhook → `emails` table. Conversation-list + thread-view + composer preserving `In-Reply-To` / `References`.
- [x] `training@coveblades.com` provisioned (new mailbox)
- [x] Three auto-reply templates dispatched by `autoReplyFor(mailbox)`: `info@` (self-serve links), `erik@` (brief personal), `training@` (Train-to-Be-Sharp pitch)
- [x] Loop protection (skips `@coveblades.com` senders + `noreply|mailer-daemon|postmaster|bounce`)
- [x] Read state: `sms_message_reads` table for SMS + reuses `emails.status` for email
- [x] Per-conversation unread badge + sidebar badge counts on `Messages` and `Email` (polls `/api/admin/unread-counts` every 30s, shows on desktop sidebar and mobile bottom bar)
- [x] Search on both inboxes (debounced 250ms, server-side filter on body/subject/sender/recipient)
- [x] Setup doc: `docs/marketing/postmark-inbound-setup.md`
- [x] Historical SignalWire backfill scaffolding (`historical_sms_messages` + `scripts/backfill-signalwire.mjs`) — not currently needed because Magpipe has all history, kept as fallback

## Milestone 9.6 — Booking-flow rescue + analytics canary ✅ Complete

Restored a 16-day Cal.com booking outage and built the monitoring that prevents recurrence.

- [x] `attendeeDefined` location-type fix restored on `/api/cal/book` (was reverted by an LMS commit committed from a stale working tree)
- [x] `npm run smoke:booking` script — posts live test booking + cancels, asserts 2xx
- [x] `.env.local` `CAL_EVENT_TYPE_ID` corrected to prod `2520929`
- [x] Self-hosted analytics: `analytics_events` table + `/api/events` beacon + `<AnalyticsTracker />` in root layout
- [x] `/admin/analytics` — KPI cards, 30-day pageview chart, **booking funnel with per-step conversion** (canary for any future booking outage), recent booking failures, top pages / CTAs / referrers / city pages
- [x] Memories: `cal-booking-location-type`, `feedback-review-diff-before-commit`

## Milestone 9.7 — Lower Mainland SEO expansion (+10 cities) ✅ Complete

Extended Milestone 5 with 10 more full city landing pages (15 total).

- [x] Added: Richmond, Surrey, Delta, New Westminster, Langley, Maple Ridge, Pitt Meadows, White Rock, Port Coquitlam, Port Moody
- [x] Each: unique 3-paragraph description with concrete local hooks, ~10 neighbourhoods, 4 city-specific FAQs, unique meta tags, Service + Breadcrumb + FAQ JSON-LD
- [x] Refactored existing Coquitlam entry from "Tri-Cities" bundle → Coquitlam-only (avoids self-competition with new Port Moody / Port Coquitlam pages)
- [x] Internal linking: prose mentions in `about` / `contact` link to specific city pages; service-area table cells link; homepage `MobileServiceSection` cards link; `HeroSection` trust strip + `TrustBar` + `ServicesSection` regional labels link to the `/service-area` hub
- [x] `sitemap.ts` picks up all 15 routes automatically (no code change)

## Milestone 9.8 — Google Ads conversion infrastructure ✅ Code complete, awaiting GAds config

Conversion tracking is wired and the launch playbook is paste-ready; campaign creation is pending.

- [x] `gtag.js` (AW-18180527373) installed in root layout
- [x] `fireBookingConversion()` fires on every `booking_succeeded` — no-op until `NEXT_PUBLIC_GADS_CONVERSION_ID` is populated
- [x] `docs/marketing/google-ads-launch.md` — 6-step playbook with paste-ready content for 5 ad groups (Mobile, Vancouver, North Shore, Japanese, Restaurants), negative keywords, geographic targeting, bidding strategy, 30-day monitoring checklist
- [ ] **Owner action**: create conversion action in Google Ads UI → copy `AW-XXXX/label` → set `NEXT_PUBLIC_GADS_CONVERSION_ID` in `.env.local` + Vercel
- [ ] **Owner action**: create the campaign by pasting from playbook (~30 min)

## Milestone 4 — Brand rebrand: Cove Cutlery → Cove Blades ✅ Complete

Site fully rebranded and live at the new domain.

- [x] Brand sweep across UI, metadata, JSON-LD, OpenGraph, manifest, llms.txt, project_spec, active docs (~200 string replacements across 41 files)
- [x] Production domain switched: `covecutlery.ca` → `coveblades.com`
- [x] DNS flipped (apex A → 216.150.1.1, www CNAME → vercel-dns); SSL issued by Let's Encrypt; cert valid through 2026-07-28
- [x] Vercel project domains: `coveblades.com` apex (canonical) + `www.coveblades.com` (308 → apex) + `staging.coveblades.com` (preview)
- [x] Email: `info@coveblades.com` and `pay@coveblades.com` via Postmark (verified)
- [x] SMS: `+16042108180` provisioned in Magpipe; `MAGPIPE_SMS_FROM` + `ADMIN_PHONE` aligned
- [x] Display phone changed to `604-210-8180` everywhere
- [x] Social handles → `@coveblades` (Instagram, Facebook, YouTube)
- [x] Google Business Profile linked into LocalBusiness `sameAs`
- [x] Supabase Auth redirect URLs updated for new domain (kept legacy for transition)
- [x] Vercel project + GitHub repo intentionally NOT renamed (still `covecutlery` internally)
- [x] Legacy `covecutlery.ca` continues to serve — retire later

## Milestone 5 — Citywide SEO/GEO expansion ✅ Complete

17-city Lower Mainland coverage with unique local content per page.

- [x] Phases 1–6 (commits 519c0f0 → 2b5ed26)
- [x] Service radius bumped 90 km → 105 km (covers Chilliwack)
- [x] All 17 cities flagged mobile-only outside North Vancouver via `dropOffEmphasis: false`
- [x] Service-area hub regrouped by sub-region (North Shore, Vancouver, Burnaby & New West, Tri-Cities, South of Fraser, Fraser Valley)
- [x] Each city page: unique 3-paragraph local content, 4 city-specific FAQs, neighbourhood list, drive-time, meta tags
- [x] Drive-distance-aware mobile minimums (Abbotsford 8 knives, Chilliwack 10 knives)
- [x] Internal linking: "Also serving nearby" related-cities section on each city page
- [x] Schema: per-city Service with neighbourhood `areaServed` array + `hasOfferCatalog` pricing; ItemList + SiteNavigationElement on hub
- [x] Homepage `LocalBusiness.areaServed` now enumerates all 17 cities
- [x] llms.txt expanded with full city inventory
- [x] Answer-first H2 rewrites on city template

## Milestone 6 — Content parity with legacy coveblades.com ✅ Complete

- [x] `/how-we-sharpen-your-knives` (process / methodology)
- [x] `/train-to-be-sharp` (3-module course: One-Inch $600, Two-Inch $400, Business $200)
- [x] `/event-sharpening-service` (on-site for events)
- [x] 3 legacy blog posts imported (how-to-cut-onions, japanese-knife-sharpening, knife-sharpening-on-the-north-shore)
- [x] `/staysharp` 308-redirects to `/blog`
- [x] `<InquiryForm>` shared component with Turnstile
- [x] Validated address requirement on training intake (Google Places autocomplete)

## Milestone 7 — Home page polish + Instagram feed ✅ Complete

- [x] Hero ProMaster van zoom-in animation (right-to-left with tire-smoke trail)
- [x] Instagram feed below hero (live Graph API + in-page modal viewer for image/video/carousel)
- [x] Custom landscape video poster on About section linking to YouTube
- [x] Mon–Sat 10am–7pm hours everywhere (was Mon-Fri Noon-7, Sat Noon-4)
- [x] Footer Snapsonic credit
- [x] Navbar grouped: Services dropdown + 4 top-level links
- [x] Mobile overflow fixes (form padding, pricing card text, social row wrap)
- [x] Blog typography (Tailwind typography plugin)
- [x] Cloudflare Turnstile in `interaction-only` mode (hidden unless challenged)
- [x] Hero pt-24 sm:pt-20 so van clears the fixed navbar on mobile

---

## Milestone 9 — Invite-only courses, Postmark email unification, voice agent integration ✅ Complete

Lock down the course platform so only invited people can sign up; standardize all transactional email on Postmark with branded templates; wire up the Magpipe voice agent (with a no-phone-booking rule) and capture call data via webhook.

- [x] `course_invites` table with token-based invitation flow; admin sends invites from `/admin/training`
- [x] Signup gated by invite token (read-only email, course preview, existing-user redirect)
- [x] Auto-enroll on email confirmation + invite row deleted in same transaction (no "accepted" state, no cleanup cron)
- [x] Self-enrollment RLS policy dropped — only the invite-callback flow can create `user_enrollments` rows
- [x] Customer autocomplete on the invite email field
- [x] Cancel pending invites from admin UI + DELETE endpoint
- [x] `POST /api/auth/signup` and `POST /api/auth/magic-link` — branded Postmark emails for new-user confirmation and admin magic link (replaces Supabase's built-in mailer)
- [x] `src/lib/brand.ts` — central brand constants (phone, email, colors, logo URL)
- [x] Voice agent system prompt stored in `app_credentials`, edited at `/admin/voice-prompt`
- [x] Magpipe MCP server registered (`magpipe-mcp-server` v0.2.1) — direct curl rejects `mgp_` keys; only the MCP works for SMS
- [x] Magpipe post-call webhook at `/api/webhooks/magpipe/post-call` — plain unauthenticated POST, writes to `magpipe_call_logs`
- [x] Training page rejig — clickable rows open per-student detail with suspend/unsuspend (Supabase user-ban API) + scoped wrong-answers
- [x] Phone number swept site-wide: `604-373-1500` → `+1 (604) 210-8180` (display) and `+16043731500` → `+16042108180` (E.164 + `tel:`); `MAGPIPE_SMS_FROM` rotated on Vercel
- [x] "Call to book" copy removed from FAQs and service-area pages — booking is online-only
- [x] `llms.txt` ## Booking section telling AI agents to direct to website
- [x] Admin email allowlist consolidated to `ADMIN_EMAILS` array in `src/lib/admin.ts` (was inconsistent across layout/proxy/lib)
- [x] Customer search no longer crashes on null email (partial unique index leftover)
- [x] Customer create with email now works (replaced upsert/onConflict with explicit check-then-insert/update — the partial unique index can't be used by ON CONFLICT)
- [x] Auth callback redirect uses `http://` for localhost (was forcing `https://` for all matched forwarded hosts)
- [x] Production live at commit `5d8845a` aliased to `coveblades.com`

### Milestone 9.1 — Invite-flow safety net + Sign in nav link (2026-05-08)
- [x] Course-page self-heal — auto-enrolls a logged-in user who has a matching pending invite, so the flow survives a dropped `invite=` param or a `getUser()`-returns-null callback edge case
- [x] `/api/admin/training/activate` + Activate button — manual enrollment override for customers who signed up but didn't auto-enroll
- [x] "Sign in" link in the public Navbar (was missing — logged-out students had no entry point back into their courses)
- [x] Unblocked `jamesmarkalexander@hotmail.com` manually (auth user + enrollment intact; invite deleted)
- [x] All three paths verified end-to-end on production via Playwright (self-heal, Activate, 409-no-account)

### Milestone 9.2 — Removed service-area gating on mobile booking (2026-05-13)
- [x] James reported "Please select your address from the autocomplete suggestions…" trying to book mobile sharpening on his phone — `addressCoords` precheck failed because mobile autofill / fast typers / keyboard-dismissed dropdowns never populate it
- [x] Owner unblocked James manually (booked outside the form) before the fix shipped
- [x] Removed all service-area gating client- and server-side: `addressCoords` state + precheck + haversine in `BookingModal.tsx`; `geocodeAddress` + 422 service-area block in `/api/cal/book`; `HOME_BASE`/`MAX_KM`/`MAX_LNG` constants from both
- [x] Terms of Service §6 and Privacy Policy §3 updated to remove now-false "we verify service area eligibility" language
- [x] Dropped unused `geometry` field from `/api/geocode` place-details fetch (Places API cost reduction)
- [x] Verified end-to-end on iPhone-emulated viewport (Toronto address, no autocomplete tap → "You're booked!")
- [x] Shipped as commit `0a1e51c` on `main`
- [ ] Known follow-up: `/api/cal/book` is now slightly more open to garbage submissions; revisit if abuse appears

### Milestone 9.3 — Training certificates (2026-05-14)
- [x] Admin can issue a "Certificate of Achievement" PDF to any enrolled student from `/admin/training` → student detail → Certificates panel; the cert is delivered by email + available on the student's `/dashboard/certificates` page + downloadable by the admin
- [x] `certificates` table + private `certificates` Storage bucket (migration `20260514000000_create_certificates.sql`); RLS lets a user read only their own rows
- [x] `pdf-lib` overlay renderer composites recipient name + issued date + verify-URL footer onto the existing `public/certificate-template.pdf` (842 × 595 PDF points, coordinates measured pixel-accurately from the template — name centered on the upper underline at x=502, date on the "Level 1 Training on" blank at x=556, verify URL on the cert's visual axis at x=502)
- [x] Short verification code generator (`CB-XXXX-XXXX`, Crockford-ish base32 minus visually ambiguous chars)
- [x] Public verify page at `/certificates/<short_code>` — shows verified / revoked / 404
- [x] API: POST/GET issue+list, POST email (re-send), POST revoke, GET signed-URL download (owner-or-admin auth)
- [x] Preview button in the issue form — admin sees the rendered PDF in a new tab without writing to the DB or sending email; preview footer reads "PREVIEW — Not a valid certificate" instead of a fake verify URL
- [x] Postmark email matches the existing invite/invoice template style (gold "View Verification Page" CTA, PDF attachment)
- [x] Spec at `docs/superpowers/specs/2026-05-14-training-certificates-design.md`, plan at `docs/superpowers/plans/2026-05-14-training-certificates.md`
- [x] Shipped as commits `c102f4a` → `dcdf625` on `main`

### Milestone 9.4 — Training landing course-split (2026-05-14)
- [x] `/train-to-be-sharp` modules grid expanded from 3 → 4 cards: existing "Business Process & Automation" repositioned as the introductory tier ($200, "Two-hour session · Introduction"); new "Build Your Business with AI — Hands-On" added ($600, "Half-day workshop", Sparkles icon)
- [x] Page metadata description and "Three Modules" / "Four Modules" heading both updated for consistency
- [x] Grid layout changed to `md:grid-cols-2 lg:grid-cols-4` for responsive 2×2 / 4-up
- [x] Marketing copy only — no DB changes (the new course is a landing-page card, not an enrolled-course row)
- [x] Spec at `docs/superpowers/specs/2026-05-14-training-landing-course-split-design.md`
- [x] Shipped as commits `3d198d5` and `59ad5d8` on `main`

---

## Milestone 8 — Auto-rotating Instagram token ✅ Complete

Set-and-forget rotation of the Instagram Graph API long-lived token. No more manual refresh ceremony every 60 days.

- [x] `app_credentials` Supabase table (service-role-only RLS) for runtime-mutable secrets
- [x] `lib/credentials.ts` — `getCredential` / `setCredential` helpers
- [x] `lib/instagram.ts` reads token from Supabase first, falls back to env
- [x] `/api/cron/refresh-instagram-token` — `CRON_SECRET`-gated, refreshes when expiry < 14 days away
- [x] `vercel.json` cron schedule: `0 9 * * 1` (every Monday 09:00 UTC)
- [x] Initial token row seeded with `2026-06-28T22:30:00Z` expiry
- [x] First active refresh expected ~2026-06-14 (14 days before expiry)
- [x] Verified end-to-end on production: cron route returns clean "expires in 59.2 days — no refresh needed" JSON

---

## Active follow-ups

- **When ready** — Retire `covecutlery.ca`: 301 from apex/www to `coveblades.com`, remove from Vercel project domains, optionally drop the domain.

---



## Milestone 1 — MVP Website ✅ Complete

All pages and components built, deployed to Vercel.

- [x] Next.js project scaffolded
- [x] Tailwind CSS v4, Inter font
- [x] Supabase client + contact_submissions table
- [x] Homepage with all 9 sections
- [x] 5 inner pages (/mobile-service, /pricing, /drop-off, /about, /contact)
- [x] Contact form → Supabase backend
- [x] SEO metadata + JSON-LD structured data
- [x] Navbar (sticky, mobile-responsive)
- [x] Footer (4-col, social icons)
- [x] Vercel deployment live: https://covecutlery.vercel.app
- [x] GitHub repo: https://github.com/elagerway/covecutlery

**Pending:**
- [ ] Visual QA on mobile + desktop (Playwright)
- [ ] Real photos / hero image

---

## Milestone 2 — Booking + Live Schedule ✅ Complete

- [x] Cal.com v2 booking integration (date → time → details modal)
- [x] "Where We'll Be This Week" live schedule section (ISR, Cal.com bookings → city per day)
- [x] Cloudflare Turnstile CAPTCHA on contact forms
- [x] ~~Stripe $50 deposits~~ — removed; bookings confirm directly without payment
- [x] SMS booking confirmations (admin + customer) via Magpipe

## Milestone 3 — Blog + Admin ✅ Complete

- [x] Public blog at `/blog` and `/blog/[slug]` (ISR, Supabase-backed)
- [x] `blog_posts` table with RLS (public read, admin write)
- [x] Supabase magic-link auth restricted to `elagerway@gmail.com`
- [x] Edge middleware protecting all `/admin/**` routes
- [x] Admin post list (with publish/unpublish/delete actions)
- [x] Admin create + edit post forms (auto-slug, draft/publish)
- [x] Blog link in Navbar

- [x] Supabase Auth redirect URLs configured (coveblades.com + www + localhost:3002)

---

## Milestone 3.5 — SEO & GEO Strategy ✅ Complete

- [x] Dynamic sitemap.xml (ISR hourly) with blog posts + city pages
- [x] robots.txt blocking admin/api/auth/booking
- [x] Schema helpers (safeJsonLd, breadcrumb, FAQ)
- [x] BlogPosting + BreadcrumbList schema on blog posts
- [x] FAQPage schema on pricing page
- [x] LocalBusiness schema expanded (sameAs, geo, foundingDate)
- [x] Domain fixed from .com to .ca
- [x] Aggregate rating removed (was fabricated)
- [x] 5 city landing pages (North Vancouver, Vancouver, Burnaby, West Vancouver, Coquitlam)
- [x] Service area hub page
- [x] Restaurant landing page
- [x] Default OG image + Twitter card meta
- [x] Footer updated with new page links
- [x] llms.txt for AI crawlers

**Pending:**
- [ ] Google Business Profile verification
- [ ] Lighthouse SEO audit (target >= 95)
- [ ] Search Console monitoring (4-6 weeks) before expanding to more cities

---

## Milestone 3.7 — Invoice System & Customers Table ✅ Complete

- [x] `customers` table in Supabase (replaces derived-from-bookings approach)
- [x] Customer import from Cal.com (both accounts), macOS Contacts, Google Calendar
- [x] Admin customer list with search, add, edit, delete
- [x] `invoices` table with full CRUD
- [x] Admin invoice creation with customer search, line items, preview
- [x] Public branded invoice view with Stripe + e-Transfer payment
- [x] Mark as Paid for pre-paid invoices
- [x] Work Completed date auto-filled from Cal.com / Google Calendar
- [x] Stripe webhook handles invoice payments
- [x] Invoices link in admin nav

- [x] Email sending via Postmark (with shield logo header)
- [x] SMS sending via Magpipe (updated to v2 API)
- [x] Invoice edit mode (including paid invoices)
- [x] Send popover with editable email/phone
- [x] Save as PDF on public invoice page
- [x] Payment method/time in receipt emails and public view
- [x] Admin nav link in public navbar (auth-gated)
- [x] Shared utilities extracted (lib/admin.ts, lib/format.ts)

**Pending:**
- [ ] macOS Contacts import UI (currently one-time script)
- [ ] Google Calendar API OAuth for live calendar access

---

## Milestone 3.8 — SMS Campaigns & PWA ✅ Complete

- [x] SMS campaign admin tab (`/admin/campaigns`)
- [x] Compose with personalization variables ({{first_name}}, {{name}}, {{phone}})
- [x] Recipient selector with search, source filter, select all
- [x] Manual phone number input for ad-hoc recipients
- [x] Campaign history with delivery stats
- [x] PWA manifest + service worker (installable app)
- [x] Mobile-responsive admin nav (bottom bar + slide-out drawer)
- [x] Mobile-responsive tables (horizontal scroll, stacking forms)
- [x] Viewport meta + theme-color

---

## Milestone 4 — Customer Portal 🔜 Planned

- [ ] Customer accounts (Supabase Auth)
- [ ] Order history
- [ ] Loyalty program
- [ ] SMS/email reminders
