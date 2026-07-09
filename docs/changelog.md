# Changelog

## [2.20.1] — 2026-07-09 — Schedule widget privacy: customer postal code leak fixed

### Security
- **Public schedule widget leaked a customer postal code** — the "Where We'll Be This Week" strip derives each day's city from customer-typed Cal.com booking addresses, and `cityFromAddress()` blindly took the second comma-separated chunk. For an address with the city glued to the street line ("…Marine Dr North Vancouver, BC V7R4T6, Canada") that chunk is the postal code, which rendered on the homepage. Rewritten to be leak-proof: postal codes are stripped up front and any digit-bearing, bare-province, or "Canada" part is rejected; unparseable addresses fall back to "Home Shop" (`a67f028`)

### Fixed
- **Comma-less addresses now resolve to the right city instead of "Home Shop"** — `cityFromAddress(address, knownCities)` first word-boundary-matches the raw address against canonical city names from `src/data/cities.ts`, preferring the match ending latest in the string then the longest ("North Vancouver" beats "Vancouver"; "Vancouver St, Port Coquitlam" → Port Coquitlam). Within the service area the widget can only ever show a vetted city name; the strict comma scan remains as fallback for unlisted cities (e.g. Squamish). Wired into `calSchedule.ts` and the admin campaigns route (better city grouping there too) (`44914f1`)

### Notes
- City names are passed into `cityFromAddress()` as a parameter rather than imported — `lib/format.ts` is imported by client components and `data/cities.ts` carries ~500 lines of SEO copy that would bloat browser bundles
- The widget caches 5 minutes (`revalidate: 300`); fixes appear on prod shortly after deploy

## [2.20.0] — 2026-07-07 — Google Ads conversions live, Tip & Chip pricing, drop-box map, cancel-endpoint lockdown

### Added
- **Google Ads booking conversion is live** — created the "Book Mobile Appointment" conversion action and set `NEXT_PUBLIC_GADS_CONVERSION_ID` (`AW-18180527373/KLlYCLWAp8wcEI2qk91D`, value $60 CAD, event-snippet mode, count Every). Verified end-to-end with a headless-browser test booking on production: the `googleadservices.com/pagead/conversion` ping fired with the right label/value/currency (test booking cancelled afterward)
- **Google Ads SPA page views** — `AnalyticsTracker` now re-fires the gtag `config` with `page_path` on client-side route changes (`lib/google-ads.ts#fireGooglePageView`), matching what Meta already did. Previously Google only saw the initial page load, breaking remarketing lists and any page-view-based conversions. `GOOGLE_ADS_ID` moved from `layout.tsx` into `lib/google-ads.ts` as the single source
- **Tip & Chip Repairs — $10** added to both additional-services lists (homepage `PricingSection` + `/pricing`), note: "Badly chipped or broken tip repair (we do these repairs by default unless you ask us not to)". `PricingSection` items now support an optional `note` line; on `/pricing` this **replaces** the stale "Blade repair (chips, tip break) From $25" row (same service, contradictory price)
- **Drop-box map** — the Contact section's Drop Box Address card now embeds a Google map of 4086 Brockton Crescent plus a "Get directions →" link (opens Google Maps directions with the place ID)

### Security
- **`/api/cal/cancel` locked down** — the unauthenticated endpoint (which exists only for the Stripe checkout `cancel_url` flow) also allowed cancelling **confirmed** bookings, so anyone with a booking uid could kill a real appointment. Now restricted to `pending_payment` only + uid shape validation; confirmed bookings cancel only via the `requireAdmin()`-gated admin API. Verified on prod: cancelled/unknown uid → 403, missing/non-string uid → 400. Found while running the conversion test booking

### Notes
- The map uses Google's **keyless** embed (`maps.google.com/maps?q=…&output=embed`) — the Maps Quick Builder API key isn't authorized for the Maps Embed API (403), and the keyless endpoint needs no key management at all. To switch to the official Embed API later, enable "Maps Embed API" on the key in Cloud Console
- Unlike Meta's `fbevents.js`, Google's gtag **does** fire conversions from headless browsers — a Playwright booking works for verifying the Google side
- Test bookings via the live widget send real SMS confirmations and now can't be cleaned up through `/api/cal/cancel` (they're `confirmed`) — cancel them from `/admin/jobs` instead
- New Vercel prod env var: `NEXT_PUBLIC_GADS_CONVERSION_ID`

## [2.19.0] — 2026-07-07 — Meta Pixel conversions, Sentry monitoring, env-var hygiene

### Added
- **Meta (Facebook) Pixel conversion tracking** (`922591534921896`, via `NEXT_PUBLIC_FB_PIXEL_ID`) — base snippet in `layout.tsx` (`afterInteractive`, renders only when the env var is set); `PageView` on initial load + client-side route changes via `AnalyticsTracker` (skips the first effect so the initial view isn't double-counted); `src/lib/meta-pixel.ts` fires the standard **`Schedule`** event (`value: 60, currency: CAD`) alongside the Google Ads conversion on booking success in `BookingModal`. Verified live in Events Manager Test Events (PageView + Schedule). Ads Manager: use the **Sales** objective with conversion event `Schedule`
- **Sentry error monitoring** (`@sentry/nextjs` 10.63.0) — browser errors via `src/instrumentation-client.ts` (+ router-transition breadcrumbs), server/edge errors via `src/instrumentation.ts` (`register` + `captureRequestError`), and a root `app/global-error.tsx` boundary (reports the crash, shows a dark-themed "Try again" screen). Gated on `NEXT_PUBLIC_SENTRY_DSN` (prod + `.env.local`); errors-only (`tracesSampleRate: 0`), no PII. Verified end-to-end: thrown test error on the live site → ingest 200. Source-map upload (readable prod stacks) deferred — needs a Sentry auth token
- **Build-time env-var guard** in `next.config.ts` — the build fails loudly if any project-prefixed env var (`NEXT_PUBLIC_`, `STRIPE_`, `CAL_`, `TURNSTILE_`, …) contains leading/trailing whitespace or a newline. Vercel-injected `NEXT_PUBLIC_VERCEL_*` vars are exempt (`NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE` legitimately contains newlines — this failed the first two git-push builds)

### Fixed
- **Turnstile CAPTCHA broken in production for ~3 months** — `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Vercel had a trailing newline, so Cloudflare rejected the sitekey and the contact form, inquiry form, and course sign-up CAPTCHA all failed silently (`TurnstileError` in every visitor's console; spotted during pixel testing). Re-added clean + redeployed
- **11 poisoned production env vars** — the guard's first real build caught `STRIPE_WEBHOOK_SECRET` too; a full scan found trailing newlines on all Stripe keys, `TURNSTILE_SECRET_KEY`, `POSTMARK_API_KEY`, `GOOGLE_MAPS_API_KEY`, `MAGPIPE_API_KEY`, and the four `INSTAGRAM_*` vars (all from dashboard pastes). Some SDKs tolerate the whitespace, others don't — breakage was partial and silent. All trimmed and re-added via CLI; full prod env verified clean

### Notes
- **Add env vars only via `printf '%s' 'VALUE' | vercel env add KEY production --scope=snapsonic`** — pasting into the dashboard is what poisoned all 11
- `vercel redeploy <url>` rebuilds **that deployment's source** — redeploying an old URL aliases old code over newer commits. Redeploy the newest deployment or push to `main`
- Meta's `fbevents.js` silently drops events from automated/headless browsers (bot filtering) — test conversions with a real browser or the `https://www.facebook.com/tr` image endpoint
- New Vercel prod env vars: `NEXT_PUBLIC_FB_PIXEL_ID`, `NEXT_PUBLIC_SENTRY_DSN`

## [2.18.0] — 2026-06-27 — Practicum video, remote certification, admin view-switch, auth fix

### Added
- **Practicum video + clickable chapters** — the Level 1 practicum ships as one 44-min chaptered YouTube video (`_Aam40x1HDw`, 20 chapters). New `components/courses/video-with-chapters.tsx` (YouTube IFrame API) embeds the player with a clickable chapter list that seeks it and highlights the active chapter; the lesson page renders it for any video lesson with a YouTube `video_url`. The Practicum module is now **one lesson per chapter (20)**, each deep-linked to its timestamp (`?t=`)
- **Remote certification loop** (issue #23) — students submit a technique video for Erik to review; the certificate is gated on approval:
  - `practicum_submissions` table + RLS (students read/insert their own, enrolled-only; reviews server-side). **Link-only** — students host on YouTube (unlisted) or Vimeo and submit the URL; no video files are stored
  - Student submission UI (`components/courses/practicum-submission.tsx`) + `GET/POST /api/courses/practicum-submission`
  - Admin review queue (`components/admin/PracticumSubmissions.tsx` + `GET/PATCH /api/admin/training/submissions`) — inline embed + Approve / Request Changes, shown on the Training page and per student
  - **Certificate gating** — `/api/admin/training/certificates` refuses to issue (422) until the student has an approved submission, but only for courses that have a `practicum` module
  - **Notifications** via `src/lib/notify.ts` (Postmark, best-effort) — Erik emailed on submission; student emailed on approve / changes-requested
- **Remote Certification section** — its own course module (order 10) after the practicum, with remote-student process clarification, a gold-emphasized header/row, and a medal icon; deep-links the certification clip and hosts the upload
- **Admin ↔ User view switching** — "Admin" link in the dashboard user modal (admins only) and a "User Dashboard" link in the admin sidebar

### Fixed
- **Admin bounce-to-login mid-session** — Next prefetch of admin links hit `proxy.ts` (the renamed middleware) and rotated the Supabase refresh token on requests whose `Set-Cookie` the browser discards, so the next real navigation sent a stale token and logged the admin out. Fixed by excluding prefetch from the proxy matcher, copying refreshed cookies onto the login redirect, and `prefetch={false}` on admin/switch links
- **Lessons printed their title twice** — the page renders the lesson title as `<h1>` and every lesson's content started with `## <title>`. `LessonContent` now strips the leading heading when it matches the title

### Notes
- Migrations `20260627000000` (practicum_submissions + bucket) and `20260627010000` (drop bucket/`storage_path` → link-only), applied to prod via the Supabase Management API
- A Vercel deploy on `16b2378` errored at the "Deploying outputs" step *after* a successful build (transient platform error); the next commit redeployed cleanly. Read build logs with `vercel inspect "https://<url>" --logs --scope=snapsonic`

## [2.17.0] — 2026-06-24 — Schedule TZ fix, fresh reviews, course payment enforcement, practicum

### Fixed
- **Schedule widget off-by-one day** — `addDays()` in `src/lib/calSchedule.ts` built a `Date` at the server's *local* midnight (UTC on the host) then re-read it as Vancouver time, shifting day 0 back a day (highlighted SUN when it was MON). Now uses pure UTC calendar arithmetic; the day/date label helpers also construct/format in UTC so they can't drift on a non-UTC host
- **Course price showed "Free"** — `/courses` catalog + `/courses/[slug]` hardcoded a "Free" badge despite `is_free`/`price` on the model. Badge now reflects the real price (e.g. Train to Be Sharp $600)

### Changed
- **Enforced payment before LMS access.** A `user_enrollments` row is now created only by a paid `course_enrollment` (Stripe webhook / login backfill) or an accepted invite:
  - Lesson page (`courses/[slug]/lessons/[lessonSlug]`) no longer auto-enrolls any logged-in visitor (the free hole) — it redirects non-enrolled users to the course overview
  - `api/courses/enroll` now maps the routing slug → LMS slug (`one-inch-grinder` → `train-to-be-sharp`) and stores the LMS slug on the enrollment, so paying actually grants access (was a silent mismatch)
  - Course overview's non-enrolled branch shows an **"Enroll — $price"** CTA to the matching `/train-to-be-sharp/*` purchase page instead of an invite-only dead end
  - Deleted unused `components/courses/enroll-button.tsx` (free direct insert into `user_enrollments`)
- **Homepage reviews refreshed** — pulled the 5 newest 5★ Google reviews via the Places Details API and prepended them in `ReviewsSection.tsx` (profile now 5.0 across 48 ratings)

### Added
- **Train to Be Sharp practicum** — GitHub epic #1 + 10 sub-issues (#13–#22), one per module-aligned video lesson, each with objective, theory mapping, equipment, shot list, and a script outline
- **Practicum LMS module** — `supabase/seed_train_to_be_sharp_practicum.sql` adds a "Practicum: Watch Erik Sharpen" module (order 9) with 10 `content_type='video'` lesson stubs (placeholder content + issue links; `video_url` filled in as filmed). Applied to prod

## [2.16.0] — 2026-06-08 — Cal booking sync, jobs admin polish, voice picker + cloning

### Added
- **Cal.com → Supabase booking sync** (`POST /api/webhooks/cal`) — bookings made on the native Cal.com page (not the website widget) now reach the `bookings` table and `/admin/jobs`. Handles `BOOKING_CREATED` / `CANCELLED` / `RESCHEDULED`, keyed on `cal_booking_uid`. Previously these were invisible in admin (only on the calendar); four real jobs had gone missing this way and were backfilled
- **Unique index** `bookings_cal_booking_uid_key` (migration `20260607000000`) — backs idempotent upserts so the widget path and the webhook can't double-write
- **HMAC signature verification** on the Cal webhook (`x-cal-signature-256`, `CAL_WEBHOOK_SECRET`) — verified live (signed create/cancel pass, unsigned → 401)
- **Delete a job** from `/admin/jobs` — trash icon on each row + a button in the detail drawer, behind a styled confirm modal. Cancels the Cal appointment (only when active + upcoming) then removes the row; blocks deletion of bookings with an unrefunded deposit
- **Voice picker** on `/admin/voice-prompt` — choose the live phone agent's voice from Magpipe's list (`GET/PUT /api/admin/voice`); applies immediately via Magpipe `update-agent`
- **Voice cloning** — record in-browser (mic) or upload an audio clip to clone a voice (`POST /api/admin/voice/clone` → Magpipe `clone-voice` → ElevenLabs); the clone lands in the picker
- **Shared helpers** `src/lib/cal.ts` (`cancelCalBooking`, `formatAppointment`, `TIMEZONE`) and voice/agent helpers in `src/lib/magpipe.ts` (`listVoices`, `getAgentVoiceId`, `setAgentVoice`, `cloneVoice`, `VOICE_AGENT_ID`)

### Changed
- **`/admin/jobs` formatting** — money columns right-aligned with tabular figures, `$0` deposits shown as a muted dash, one-line date/time, truncated long addresses/emails, tidied headers
- **All admin views capped at 1400px**, left-aligned, via the shared protected layout
- **`/api/cal/book`** now upserts (was a plain insert whose error was swallowed) and logs failures
- **`/api/stripe/checkout`** upserts on `cal_booking_uid` so a webhook-won race can't hit the unique index and destroy a paying booking
- The three copy-pasted Cal-cancel calls (`cal/cancel`, `stripe/webhook`, booking delete) now share `cancelCalBooking` (fixes the `cancellationReason` vs `reason` drift); booking route uses the shared `requireAdmin` (full `ADMIN_EMAILS`)

### Fixed (code review)
- Cal webhook out-of-order delivery (CANCELLED-before-CREATED) now writes a cancelled tombstone instead of resurrecting the booking; reschedules move the existing row instead of duplicating it
- `VoiceCloner` guards the `MediaRecorder` constructor (stops the mic stream if it throws), revokes the sample object URL on unmount, and drives the timer without a `setState` side effect
- Job-delete failures keep the confirm modal open with an inline error instead of closing + `alert()`

### Data
- Removed 5 test/owner rows from `bookings` (2 `test@example.com`, 3 `elagerway@gmail.com`); `/admin/jobs` shows the 6 real customer jobs

### Notes
- Cal webhook is owned by the **Blades** account — manage it (e.g. rotate the secret) with `CAL_API_KEY_BLADES`, not `CAL_API_KEY`
- Shipped as commits `1db2373` → `137d297` on `main`

## [2.15.0] — 2026-05-28 — Supabase project migration to snapsonic org + auth overhaul

### Migrated
- **Cove Blades Supabase project moved cross-org** — old `kvatxuhjiinjpvsyably` under the Cove Cutlery org (free tier) → new `dbrphymgtnkkythvunyf` under the snapsonic org (Pro). Triggered by a compute-exhaustion outage on the Nano-tier free project (Postmark inbound webhook hammering DB connections, all services UNHEALTHY). 17 MB of data total — phantom-table DDL + 19 migrations + auth.users (UUIDs preserved) + 26 public tables, all row-counts verified equal post-migration
- **One-shot migrator** `scripts/migrate-supabase.py` — uses only the Supabase Management API + PostgREST, no `pg_dump`/`psql` required. Handles FK dependency order, sequence resets, generated-column exclusion, schema-reset grant restoration
- **Vercel production env swap** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) + redeploy — cutover verified by hitting `/api/events` and confirming writes land on new project
- Old project kept paused (downgrade to free pending) for one-week rollback insurance

### Added
- **`/auth/forgot-password`** + **`/auth/reset-password`** pages with full password reset flow
- **`POST /api/auth/forgot-password`** — calls `supabase.auth.admin.generateLink(type=recovery)` and sends a branded Postmark email
- **`/auth/confirm` intermediate page** that defeats Gmail's link-scanner pre-fetch. Reads `hashed_token` + type from URL and calls `supabase.auth.verifyOtp` only on user button click — single-use token is consumed at click time, not when scanners crawl the inbox. Applied to all three email-link auth flows (`forgot-password`, `magic-link`-equivalent, `signup`)
- **"Forgot password?"** link on `/auth/login`
- **Sign In button on home page** — Navbar Sign In promoted from muted gray text to a gold-outlined button next to Book Now
- **Google OAuth re-configured** on new Supabase project — secret pasted in from Google Cloud Console (encrypted-at-rest per-project, can't be copied from old via API)

### Changed
- **`/admin/login`** no longer hosts a magic-link form — it's now a server-side redirect to `/auth/login?redirect=/admin`. All admin sign-in goes through the same shared `/auth/login` page students use (email+password or Google). Admin status is purely an `ADMIN_EMAILS.includes(user.email)` check
- **`src/proxy.ts`** sends unauthed admin visitors to `/auth/login?redirect=<original-path>` instead of `/admin/login`
- **`src/components/Navbar.tsx`** — Sign In is now an outlined button; Sign in / Dashboard / Admin links separated cleanly
- **Contact page** (`src/app/contact/page.tsx`) — added a "Text" contact option (`sms:6042108180`) alongside the existing Call link/button; bottom CTAs split into a Call/Text grid

### Removed
- `src/app/api/auth/magic-link/route.ts` — no longer referenced after the `/admin/login` redirect

### Notes
- Pre-fetch bug specifically observed against `elagerway@gmail.com`: reset emails delivered by Postmark (SMTP 250 OK from `gmail-smtp-in.l.google.com`) but the link returned "auth error" on click. Fix: `/auth/confirm` page (commit `1b3be2c`)
- Cloudflare in front of the Supabase Management API blocks default urllib UA with error 1010 — always include a `User-Agent` header from scripts
- Shipped as commits `6eeff0d` → `216612e` on `main`

## [2.14.0] — 2026-05-27 — Training course detail pages, online LMS content, Stripe enrollment

### Added
- **Course detail pages** at `/train-to-be-sharp/one-inch-grinder`, `/two-inch-grinder`, `/business-process`, `/build-your-business` — each with full marketing copy, course structure, and "Learn more" links from the training hub cards
- **Stripe + Interac e-Transfer sign-up** via `CourseSignUp` component — name/email/phone + Turnstile, card checkout or e-transfer toggle with pay@coveblades.com instructions
- **`course_enrollments` table** + `POST /api/courses/enroll` — handles both payment paths; Stripe webhook marks paid; expired sessions auto-cancel
- **Auto-enrollment in LMS** — Stripe webhook enrolls user if account exists; auth callback enrolls on signup/login if email matches a paid `course_enrollment`
- **Success pages** at `/train-to-be-sharp/[slug]/success` with "Create Account & Start Learning" CTA
- **3 new online courses seeded** (Two-Inch Grinder: 6 modules/24 lessons/6 quizzes; Business Process: 5/18/5; Build Your Business: 6/22/6) — 64 new lessons + 17 quizzes with full markdown content
- **Enrollment toggles** in `/admin/training` — `enrollment_open` column on courses table; admin can enable/disable sign-up per course without code changes
- **`EnrollmentToggles` component** embedded in Training admin page
- **`GET/PATCH /api/admin/courses/enrollment`** — list courses with enrollment status, toggle on/off

### Changed
- Training hub cards all link to detail pages with hover effects and "Learn more" text
- "Recorded for life" practicum point replaced with "A billable skill" (professional skills focus)
- One-Inch Grinder course set to $600 (was free)
- Two-Inch Grinder detail page expanded with Airplaten radius platen thinning section, belt progression, safety, blade types, and 7 topic cards
- Business Process page rewritten as "how we work commercially" discussion format with cross-links to Build Your Business workshop
- Build Your Business page rewritten with 6 deliverables, tech stack (Claude Code, Next.js, Vercel, Supabase, GitHub), 4-step session flow

### Notes
- Three courses (Two-Inch, Business Process, Build Your Business) have enrollment disabled pending owner review of lesson content
- Seed files: `supabase/seed_two_inch_grinder.sql`, `supabase/seed_business_process.sql`, `supabase/seed_build_your_business.sql`
- Shipped as commits `c57925b` → `b1646a5` on `main`

## [2.13.1] — 2026-05-26 — Inbox read/unread + badges + search + multi-number SMS

### Added
- **`sms_message_reads` table** keyed by message ID (works for both Magpipe UUIDs and SignalWire SIDs) — Magpipe doesn't track read state for us so we own it locally
- **`/api/admin/messages/read`** POST endpoint to mark message IDs as read
- **`/api/admin/unread-counts`** GET returns `{ sms, email }` totals; AdminNav polls every 30s and renders a gold badge next to `Messages` and `Email` in both desktop sidebar and mobile bottom bar
- **Per-conversation unread badge** in the inbox conversation list view
- **Search** on `/admin/messages` and `/admin/email` (debounced 250ms): SMS matches body + from/to numbers, email matches subject + body + sender/recipient — all server-side
- **`historical_sms_messages` table** + `scripts/backfill-signalwire.mjs` (`npm run backfill:signalwire`) for one-shot SignalWire import. Idempotent, supports `--days N` and `--dry-run`, marks imported messages as already-read

### Fixed
- **SMS inbox now spans both service numbers.** Magpipe stores history for `+16042108180` (current, since Apr 30) and `+16043731500` (retired, Mar 25–Apr 10). `SERVICE_NUMBERS` array in `src/lib/magpipe.ts` drives a parallel fan-out that merges and dedupes by message ID, so conversations across the number change don't fragment
- `customerPhone()` now uses `isServiceNumber()` membership rather than the direction flag — handles cross-number threads correctly

### Notes
- The SignalWire backfill scaffolding was built before realising Magpipe already had everything under the old service number. Left in place as a fallback but not currently needed.
- Shipped as `e45ebc3` and `6a1758d`

## [2.13.0] — 2026-05-26 — Admin email inbox + auto-replies for info@/erik@/training@

### Added
- **`/admin/email`** — Postmark Inbound webhook receives forwarded mail from SiteGround, stores in new `emails` table (`emails` migration `20260526000000`), surfaces in a conversation-list + thread-view UI similar to `/admin/messages` but with traditional inline cards (subject + sender + body) rather than chat bubbles
- **Three auto-reply templates** in `src/lib/email.ts` (`buildInfoAutoReply`, `buildErikAutoReply`, `buildTrainingAutoReply`) dispatched by `autoReplyFor(mailbox)` from the inbound webhook — fire-and-forget so the webhook never blocks
- **`training@coveblades.com`** as a new inbox (in addition to existing `info@` and `erik@`) — for training inquiries
- **Loop protection**: auto-reply skipped if sender is `@coveblades.com` or matches `noreply|mailer-daemon|postmaster|bounce`
- **Setup doc** `docs/marketing/postmark-inbound-setup.md` walks the SiteGround forwarder + Postmark Inbound webhook config (~15 min, one-time)
- **`/admin/emails` API endpoints**: GET (conversations or thread by `?conversation=`), POST `/send` (Postmark outbound preserving In-Reply-To + References), POST `/[id]/read`

### Notes
- Outbound replies sent via Postmark with the originating mailbox as From (e.g. `Erik · Cove Blades <erik@coveblades.com>`), so threading on the customer's side works
- Recorded inbound + auto-reply both as rows in `emails` so the thread view shows the full conversation
- Shipped as `014d8c8` and `6a304aa`

## [2.12.0] — 2026-05-25 — Admin SMS messages tab (Magpipe-backed)

### Added
- **`/admin/messages`** — two-pane chat UI (conversation list + thread) for SMS to `604-210-8180`. Outbound replies in gold on the right, inbound dark on the left, AI auto-replies tagged in the bubble header. ⌘↵ to send. Optimistic send with rollback on failure. 10-second polling on both panes.
- **`src/lib/magpipe.ts`** wraps `list-messages` + `send-user-sms` HTTP endpoints, groups messages into conversations by customer phone
- **API endpoints**: `/api/admin/messages` (GET conversations / thread), `/api/admin/messages/send` (POST reply with E.164 validation)
- **Conversation filters**: drops service→service self-loops (booking-flow admin notifications), only includes conversations with at least one inbound message (so one-way outbound blasts don't pollute the list)

### Notes
- The Magpipe `list-messages` HTTP endpoint was broken at the start — returning hollow rows missing `from_number`/`to_number`/`body` because the formatter referenced DB column names that didn't exist (the DB uses `sender_number`/`recipient_number`/`content`). Magpipe team fixed this on their end with a `_shared/message-dto.ts` mapper + `SMS_MESSAGE_COLUMNS` constant.
- Shipped as `b64e6a3`, `63fdcd8`, `9e34ef3`

## [2.11.1] — 2026-05-23 — Invoice rebrand + email-or-phone

### Fixed
- **"COVE CUTLERY" → "COVE BLADES"** in four remaining surfaces: emailed invoice header, admin "new invoice" preview, customer-facing `/invoice/[id]` web view, and the print/PDF version
- **Invoice POST** no longer hard-requires both `client_email` AND `client_phone`. Now requires `client_name` + line items + at least one of email/phone. Admin form labels updated from `Email *` / `Phone *` to `Email · or phone` / `Phone · or email`. Customer record upsert matches by email when available else by phone, so phone-only repeat customers don't create duplicates.

### Changed
- Social handles in footer + LocalBusiness JSON-LD: `instagram.com/covecutlery` → `coveblades`, same for Facebook + YouTube.

### Notes
- Shipped as `dc29034` and `128778f`

## [2.11.0] — 2026-05-23 — Google Ads conversion tracking + launch playbook

### Added
- **`src/lib/google-ads.ts`** with `fireBookingConversion()` — wired into `BookingModal` `handleBook` success path, fires `conversion` event with $60 CAD default on every `booking_succeeded`. No-op until `NEXT_PUBLIC_GADS_CONVERSION_ID` is set (format: `AW-XXXXXXXXXX/labelhere`)
- **`docs/marketing/google-ads-launch.md`** — 6-step playbook: paste-ready keyword lists for 5 ad groups (Mobile, Vancouver, North Shore, Japanese, Restaurants), 15 headlines + 4 descriptions per group, sitelinks, callouts, universal negative-keyword list, geographic targeting for the 15 service-area cities, bidding strategy, 30-day monitoring checklist
- gtag.js base tag (`AW-18180527373`) was added to root layout earlier; this commit makes the conversion event fire

### Notes
- Shipped as `25f86b8`

## [2.10.0] — 2026-05-21 — Booking-flow rescue, +10 Lower Mainland city pages, self-hosted analytics

### Fixed
- **Critical: Cal.com booking flow restored.** Code was sending `{ type: "attendeeAddress", address }` to Cal.com which had been silently rejecting it with HTTP 400 for ~16 days (May 7 → May 23) — confirmed by Cal.com booking data showing zero successful bookings since May 2. Fix: `{ type: "attendeeDefined", location: address }` to match the prod event-type config. Originally fixed on May 1 (`de1a2ec`) then reverted by `3d36907` ("Train to Be Sharp LMS") which was committed from a stale working tree.
- Also corrected stale `CAL_EVENT_TYPE_ID=5142178` in `.env.local` → `2520929` (matches prod).

### Added
- **`npm run smoke:booking`** (`scripts/smoke-cal-booking.mjs`) — posts a live test booking to Cal.com, asserts 2xx, cancels it. Run before deploying any change to the booking payload. Catches the class of regression that just happened.
- **10 new Lower Mainland city pages** in `src/data/cities.ts`: Richmond, Surrey, Delta, New Westminster, Langley, Maple Ridge, Pitt Meadows, White Rock, Port Coquitlam, Port Moody. Each gets unique 3-paragraph description, ~10 neighbourhoods, 4 city-specific FAQs, unique meta tags, Service + Breadcrumb + FAQ JSON-LD. Existing Coquitlam entry narrowed (Tri-Cities references removed) to avoid self-competition.
- **Internal linking**: city mentions in `about`, `contact`, the `mobile-service` table, the `MobileServiceSection` homepage card, the `HeroSection` trust strip, the `TrustBar`, and the `ServicesSection` now link to `/service-area/<city>` (or the hub when no single city fits).
- **Self-hosted analytics pipeline**: `analytics_events` table + `/api/events` POST endpoint + `src/lib/analytics-client.ts` beacon (sendBeacon, skips `/admin` and `/dashboard`) + `<AnalyticsTracker />` in root layout for pageviews
- **`/admin/analytics`** dashboard with 4 KPI cards, 30-day pageview bar chart, **booking funnel with per-step conversion** (the canary that would have caught the May 7 outage in hours), recent booking failures with timestamps, top pages, CTA click counts, top referrers, top city pages
- **Instrumented events**: `pageview`, `book_clicked`, `schedule_clicked`, `dropbox_code_clicked`, `phone_tapped`, `sms_tapped`, `booking_modal_opened`, `booking_slot_picked`, `booking_submitted`, `booking_succeeded`, `booking_failed`
- **`scripts/smoke-cal-booking.mjs`** smoke test runnable via `npm run smoke:booking`

### Notes
- The 16-day booking outage almost certainly accounts for the recent business drop. Booking data confirms: 6 bookings in past 60 days, zero since May 2 (matching the bug window).
- No third-party scripts, no cookies, no consent banner for analytics — all self-hosted in Supabase.
- Memories added: `cal-booking-location-type`, `feedback-review-diff-before-commit`.
- Shipped across commits `7b99865`, `5d1b96f`, `e41ce5e`, `c07f234`, `27e0442`, `7e77946`.

## [2.9.4] — 2026-05-14 — Training landing course-split

### Changed
- **Modules grid on `/train-to-be-sharp` expanded from 3 → 4 cards.** Existing "Business Process & Automation" card retitled as the introductory tier ("Two-hour session · Introduction", $200, "Tips, tricks, and insights from how we actually run Cove Blades… The lay-of-the-land before you build your own."). New fourth card added: "Build Your Business with AI — Hands-On" ($600, "Half-day workshop", Sparkles icon, copy mentions website + email marketing + social profiles + business cards + phone number + AI assistant)
- **Grid layout** flipped from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4` so 4 cards fit cleanly across desktop and stack 2×2 on tablet
- **Page metadata `description`** rewritten to list four modules with prices (was "Three modules: …")
- **Section heading** changed from "Three Modules" to "Four Modules"

### Notes
- No DB / `courses` table changes — the new card is landing-page marketing only. The new course doesn't have lessons or enrollment yet; the owner will lay out the actual content separately
- Shipped as commits `3d198d5` and `59ad5d8` on `main`

## [2.9.3] — 2026-05-14 — Training certificates

### Added
- **Admin-issued PDF certificates of achievement** for training students. From `/admin/training` → student detail → new "Certificates" panel, the admin clicks "Issue Certificate", confirms recipient name + course + date, optionally emails the student. The cert is rendered as a PDF, uploaded to a private Supabase Storage bucket, and recorded in a new `certificates` table. Admin can also Preview before issuing, Revoke, Re-Email, and Download
- **Student-facing pages**: `/dashboard/certificates` lists own certificates with download / verify links; `Award` icon added to the dashboard sidebar; "🏅 Certificate issued · Download" pill appears on `/dashboard/courses` cards when a non-revoked cert exists
- **Public verification page** at `/certificates/<short_code>` (no auth) — shows "✓ Verified" + recipient name + course + date OR "⚠ Revoked" OR 404. Short codes look like `CB-XXXX-XXXX` using a Crockford-ish base32 alphabet (no I/L/O/U/0/1)
- **Postmark email** with the rendered PDF as attachment + "View Verification Page" CTA — matches the existing invite/invoice template style
- **`pdf-lib`** added as a dependency; `public/certificate-template.pdf` bundled into the repo as the rendering background. Renderer overlays text at coordinates measured pixel-accurately from the template (842 × 595 PDF points)

### Schema
- New `certificates` table (`short_code` unique, `user_id` / `course_id` FKs cascade, `issued_by` FK ON DELETE SET NULL, `recipient_name` and `course_title` snapshotted at issuance, `pdf_path`, `revoked_at`, `email_sent_at`)
- Private `certificates` Storage bucket; downloads go through `/api/certificates/[id]/download` which checks owner-or-admin auth and 302s to a 60-second signed URL
- Migration: `supabase/migrations/20260514000000_create_certificates.sql`

### Spec / Plan
- `docs/superpowers/specs/2026-05-14-training-certificates-design.md`
- `docs/superpowers/plans/2026-05-14-training-certificates.md`

### Shipped
- Commits `c102f4a` → `dcdf625` on `main`

## [2.9.2] — 2026-05-13 — Removed service-area gating on mobile booking

### Fixed
- **Mobile customers blocked at "Please select your address from the autocomplete suggestions…"** — a real customer (James) hit this on his phone trying to book mobile sharpening. The client-side check in `BookingModal.tsx` required `addressCoords` to be non-null, which is only set when the user taps an entry in the Google Places autocomplete dropdown. On mobile that breaks for iOS/Android address autofill (fills the field without a dropdown tap), fast typers who submit before the dropdown loads, and cases where the keyboard dismisses the dropdown before the tap registers. Owner decision: drop the 90km / no-ferry service-area restriction entirely rather than try to make the precheck smarter

### Removed
- **All service-area gating from the mobile-booking flow** — `HOME_BASE`, `MAX_KM`, `MAX_LNG`, `haversineKm` constants/helper, the `addressCoords` state and all its writes, the precheck and haversine block in `handleBook`, and the dead "outside of our service area" JSX branch in the error renderer — all gone from `src/components/BookingModal.tsx`. Same constants + `geocodeAddress` helper + the 422 service-area-rejection block — gone from `src/app/api/cal/book/route.ts`. Cal.com receives any address; out-of-area bookings are triaged manually after the fact
- **`geometry` field from `/api/geocode` place-details request** — was only consumed by the deleted `setAddressCoords(data.geometry.location)` line. Address-autocomplete-only now; smaller Places API cost

### Changed
- **Terms of Service §6 (Service Area)** — removed the now-false "We verify service area eligibility at the time of booking" sentence; softened to "may be declined after review"
- **Privacy Policy §3 (Third-Party Services)** — Google Maps line corrected from "address lookup and service area verification" to "address autocomplete during booking"

### Verified end-to-end (2026-05-13)
- iPhone-emulated viewport (390x844, touch, iOS user agent), filled the booking form with a Toronto address (well outside the previous 90km zone) without tapping any autocomplete suggestion, clicked Confirm Booking. `/api/cal/book` was called with the raw address (no coords field). "You're booked!" success screen rendered. The pre-fix flow would have surfaced the "autocomplete suggestions" error and never sent the request
- `tsc --noEmit` and `eslint` clean

### Customer impact
- **James (jamesmarkalexander@hotmail.com)** was the reported case — booked manually by the owner before this fix shipped so he wasn't held up

### Known follow-up
- `/api/cal/book` now slightly more open to garbage submissions reaching Cal.com (no rate-limit or abuse guard). Not addressed in this change — flag for later if abuse appears in practice

## [2.9.1] — 2026-05-08 — Invite-flow safety net + Sign in nav link

### Fixed
- **Customer authenticated but unenrolled after invite signup** — a paying training customer (`jamesmarkalexander@hotmail.com`) signed up via the emailed invite link, completed email confirmation (auth user created at 22:24:37, confirmed at 22:24:46, signed in at 22:25:02), and landed on `/courses/train-to-be-sharp` with the "invite-only" banner instead of the enrolled view. `processInvite()` in the auth callback returned its fallback path before reaching the enrollment upsert — most likely because `getUser()` returned null inside the same Route Handler that just called `exchangeCodeForSession` (an @supabase/ssr cookie-timing quirk). Manually inserted his enrollment row + deleted the consumed invite to unblock him

### Added
- **Course-page self-heal** — `src/app/courses/[slug]/page.tsx` now auto-enrolls any logged-in user who has a matching pending `course_invites` row (`course_id` + lowercased email + `status='pending'` + not expired). Eliminates the dependency on the `invite=` query param surviving the entire email → Supabase verify → callback redirect chain. End-to-end browser-tested in production
- **`POST /api/admin/training/activate`** — admin-gated endpoint that finds an auth user by an invite's email, upserts the enrollment, deletes the invite. Returns 409 with `"No account found for this email — the customer needs to create an account first using the invite link."` when no auth user exists yet
- **"Activate" button on each pending invite row** in `src/components/admin/TrainingInviteForm.tsx` — manual enrollment override for customers who signed up but didn't auto-enroll. Sits next to the existing "Cancel" button with a `confirm()` dialog
- **"Sign in" link in Navbar** for logged-out visitors (`src/components/Navbar.tsx`) — the navbar showed "Dashboard" for authenticated users but had no entry point for students who already had an account and wanted to sign back in. Now shows "Sign in" → `/auth/login` when logged out, swaps to "Dashboard" → `/dashboard` when logged in. Both desktop and mobile menus

### Verified end-to-end on production
- ✅ Self-heal flow: created throwaway test user + pending invite, signed in via `/auth/login`, navigated to `/courses/train-to-be-sharp`, page rendered the enrolled view (sidebar + Continue Learning); enrollment row created at exact navigation timestamp; invite row deleted
- ✅ Activate flow: created second test user + invite, signed in as admin, clicked Activate, accepted confirm dialog; success toast shown, enrollment row created, invite row deleted
- ✅ 409 path: invite with no matching auth user → red error toast, invite preserved (no destructive side effect)
- ✅ All test artifacts cleaned up

## [2.9.0] — 2026-05-08 — Invite-only courses, Postmark for all auth emails, voice agent prompt store, Magpipe post-call webhook

### Added
- **Invite-only course access** — admins send time-limited email invites from `/admin/training`; signup is gated by invite token; auto-enroll on email confirmation; invite row is deleted at the moment of acceptance (no "accepted" state, no cleanup cron). Schema: `course_invites` table; route: `src/app/api/admin/training/invite/route.ts` (POST/GET/DELETE) + `src/app/api/auth/validate-invite/route.ts`. Self-enrollment RLS policy on `user_enrollments` was dropped — only the invite-callback flow can enroll
- **Customer autocomplete on the invite form** — typing in the email field surfaces matching customers from `/api/admin/customers` (top 8 by name/email), click to fill
- **Cancel pending invites** — DELETE row + UI button on the training page invite list (with `confirm()` dialog)
- **Branded transactional emails for ALL auth flows** — `src/app/api/auth/signup/route.ts` and `src/app/api/auth/magic-link/route.ts` use `supabase.auth.admin.generateLink()` to mint the action link without triggering Supabase's built-in mailer, then send a Cove Blades-branded HTML/text email via Postmark. Same template style as the existing invoice + invite + receipt emails
- **`src/lib/brand.ts`** — single source for `BRAND_NAME`, `BRAND_PHONE_E164`, `BRAND_PHONE_DISPLAY`, `BRAND_SITE_URL`, `BRAND_LOGO_URL`, `BRAND_GOLD`, `BRAND_DARK`. Used in the new signup email; older email templates still inline these values
- **Voice agent system prompt store** — `app_credentials` row keyed `voice_agent_system_prompt`. Admin UI at `/admin/voice-prompt` (read/edit textarea with save). API: `GET/PUT /api/admin/voice-prompt`. The admin owns the prompt copy locally; updates must be manually pushed to Magpipe to go live on the agent
- **Magpipe MCP server** registered for the project in `~/.claude.json` (`magpipe-mcp-server` v0.2.1). Working `mcp__magpipe__*` tools for SMS, contacts, calls, etc. Direct curl to `api.magpipe.ai` rejects `mgp_` keys with `UNAUTHORIZED_INVALID_JWT_FORMAT`; only the MCP path works
- **Magpipe post-call webhook** — `POST /api/webhooks/magpipe/post-call`. Accepts plain unauthenticated JSON; writes the full payload + extracted flat columns (`call_id`, `from`/`to`, `duration_seconds`, `transcript`, `summary`, `recording_url`) into `public.magpipe_call_logs`. Migration: `supabase/migrations/20260508000000_magpipe_call_logs.sql`
- **Training page rejig** — students table has clickable rows that open a per-student detail view: header card with progress + suspend/unsuspend toggle (uses Supabase `auth.admin.updateUserById({ban_duration})`), wrong-answers table scoped to that student. Replaces the global wrong-answers panel
- **`/api/admin/training/suspend`** — admin endpoint to ban/unban a student via Supabase Auth's user-ban feature

### Changed
- **Phone number swept everywhere**: `604-373-1500` → `+1 (604) 210-8180` (display) and `+16043731500` → `+16042108180` (E.164 + `tel:` hrefs). 14 files: `layout.tsx` JSON-LD, footer, terms, privacy, service-area + city pages, pricing, invoice page (printed footer + email), Cal book route's customer SMS, all email templates, llms.txt
- **`MAGPIPE_SMS_FROM`** updated on Vercel (Production + Development) from `+16043731500` → `+16042108180` (was correctly aligned in `.env.local` from Milestone 4 but the old number had survived on Vercel from a previous rotation)
- **Booking copy de-phoned** — FAQs and service-area pages no longer say "or call to book"; everything routes to the website. `llms.txt` got an explicit `## Booking` section instructing voice agents/LLMs to direct callers to coveblades.com
- **Admin email allowlist** consolidated to `ADMIN_EMAILS = ["elagerway@gmail.com", "claude-admin@coveblades.com"]` — single source in `src/lib/admin.ts`, imported by the layout, proxy. The previous split-brain (single string in `requireAdmin()`, two-element array in layout/proxy) had been silently 401'ing the second admin from API routes
- **`getServiceClient` consolidated** — `src/utils/supabase/admin.ts` now re-exports `getServiceClient as createAdminClient` so there's exactly one service-role client factory across the codebase
- **Training page perf** — `listUsers({perPage:1000})` moved into the existing `Promise.all` (was a sequential fetch after the seven Supabase queries) — saves ~100-300ms per admin page load
- **`TrainingRoster.tsx`** — extracted shared `getProgress()` helper (was duplicated in detail/list views); pre-computed `wrongCountByUser` Map via `useMemo` (was an O(N*M) `.filter()` on every render)
- **`processInvite()` ordering** in the auth callback — enrollment upsert runs before the invite delete, with explicit error check; if enrollment fails, the invite row stays so admins can troubleshoot

### Fixed
- **Customer search crash on null email** — `c.email.toLowerCase()` blew up the customers admin page on first keystroke for the ~150 imported customers with no email (the partial unique index migration in `20260409000002` cleared placeholder addresses). Search filter now guards `c.email` before calling `.toLowerCase()`
- **Customer create with empty email** — the existing route's `upsert({onConflict: "email"})` failed when email was provided because the customers table has a *partial* unique index (`WHERE email IS NOT NULL`), not a full UNIQUE constraint, and Postgres won't accept partial indexes for `ON CONFLICT`. Replaced with explicit check-then-insert/update
- **Auth callback `https://localhost`** — earlier code unconditionally rewrote the redirect to `https://${forwardedHost}` for matched hosts including `localhost:3000`. Localhost dev was getting redirected to the non-existent HTTPS dev server. Now uses `http://` for any forwarded host starting with `localhost`, `https://` for production hosts
- **Cancel button silent failure** — `handleCancel` swallowed all errors with empty `catch {}`; if the DELETE failed, nothing happened and no error surfaced. Now sets `error` state on non-OK response
- **Signup confirmation silent email failure** — when Postmark threw, the API returned `{ok:true, warning:...}` but the client only checked `res.ok` and showed the success screen. The user thought "Check your email" and would never get one. Now the warning is surfaced as an error and the signup screen tells them to contact support
- **Suspend silent failure** — same pattern as Cancel; now shows error feedback in the detail view

### Removed
- **`accepted` and `expired` invite states** in app code — the schema `CHECK (status in ('pending','accepted','expired'))` is unchanged, but `processInvite` deletes on accept rather than updating status, and `validate-invite` no longer has a dead `if (status === 'accepted')` branch. The `accepted_at` column survives in the DB but is never written
- **Cleanup cron** — `/api/cron/cleanup-invites` was briefly added to delete accepted invites > 7 days old + expired pending invites; deleted entirely once the design changed to delete-on-accept. `vercel.json` cron entry removed
- **HMAC signature verification on the post-call webhook** — initial implementation followed Magpipe's documented HMAC-SHA256 / `x-magpipe-signature` flow; the team explicitly rejected it ("It's a Post web Hook why are you giving me signing secrets?"). The endpoint is now plain unauthenticated POST. `MAGPIPE_WEBHOOK_SECRET` was set on Vercel earlier and is no longer read but left in env (harmless)
- **EnrollButton on the course page** — now invite-only, replaced with an amber notice with a `mailto:info@coveblades.com` "contact us" link

### Verified end-to-end (2026-05-08)
- Signup confirmation, magic link, and invite emails all confirmed delivered through Postmark with Cove Blades branding
- Invite send → recipient signup → auto-enrollment → invite row deleted in DB (verified via Supabase API queries)
- Customer create with brand-new email + with existing email both work (the upsert fix)
- Customer search on 438+ customers no longer crashes on null email
- Magpipe SMS to `+16045628647` from `+16042108180` confirmed via `mcp__magpipe__send_sms` after the SMS-from number was correctly rotated on Vercel
- Vercel rolled back from latest `33e088e` to older `85c3564` mid-session due to a wrong deployment URL passed to `vercel redeploy`; corrected by triggering a fresh deploy from `gitSource.ref=main` via the v13 deployments API. Final production: `5d8845a` aliased to `coveblades.com`

### Notes for next time
- All transactional email goes through Postmark — never call `supabase.auth.signUp()` or `supabase.auth.signInWithOtp()` directly from a client; route through `/api/auth/signup` / `/api/auth/magic-link`
- Magpipe's voice agent system prompt update goes: edit at `/admin/voice-prompt` → save → manually paste into Magpipe's agent config UI to push live
- The Magpipe post-call webhook is at `https://coveblades.com/api/webhooks/magpipe/post-call` and accepts unsigned POSTs — already configured on Magpipe's side

## [2.8.0] — 2026-05-01 — Cal.com migration to Cove Blades account + three v2-API mismatch fixes

### Changed
- **`CAL_API_KEY` rotated** from the legacy Cove Cutlery account (`cal_live_19b65a2d…`) to a fresh token on the active Cove Blades account (`cal_live_0e4c84c6…`); updated in `.env.local` and Vercel Production
- **`CAL_EVENT_TYPE_ID`** changed from `5142178` (Cove Cutlery account, type `attendeeAddress`) to `2520929` (Cove Blades account, type `attendeeDefined`)
- **Removed `CAL_API_KEY_BLADES`** — the previous "second Cal account" fallback. Verified by querying both keys: identical 55-booking lists, so they were the same Cove Blades account. The dual-key code in `last-booking/route.ts` now uses `CAL_API_KEY` only
- **Supabase local auth config (`supabase/config.toml`)** — `site_url` and `additional_redirect_urls` switched from `covecutlery.ca` → `coveblades.com` so local magic-link redirects no longer point at the retired domain. Production dashboard URLs must be updated manually at https://supabase.com/dashboard/project/kvatxuhjiinjpvsyably/auth/url-configuration

### Fixed
- **`/api/cal/book` location payload** — sent `{ type: "attendeeAddress", address }` but the new event type only accepts `attendeeDefined`. Bookings would have 400'd in production. Now sends `{ type: "attendeeDefined", location: address }`
- **`lib/calSchedule.ts` `extractCity`** — only extracted city from object-shaped `location.address`. Cal v2 returns `location` as a flat string for `attendeeDefined` event types, so the schedule widget was silently rendering "Home Shop" everywhere even when bookings existed. Added a string-form branch ahead of the legacy object-form branch
- **`/api/cal/cancel` body** — sent `{ reason: "..." }` but Cal v2 requires `{ cancellationReason: "..." }`; cancellations would have 400'd

### Removed
- **Legacy Cove Cutlery Magpipe agents deactivated** — both "Cove Cutlery — Voice" (UUID `d7e8c398…`) and "Cove Cutlery — SMS" (UUID `3ebd970e…`) set to `is_active: false`. The voice agent's two Cal-direct custom functions (`book_appointment`, `get_availability`) had hardcoded credentials for the old account and were deleted entirely
- **Cove Blades agent prompt typo** — `coveblade.com` → `coveblades.com` (single-character fix in the active inbound voice agent's system prompt)

### Verified end-to-end (2026-05-01)
- Slots smoke test against `https://coveblades.com/api/cal/slots` returned 200 with real slot data spanning May 2–9
- Test booking created via Cal v2 (`UID 4SyHFNwC2RzhVT8N37AUKc`, Sat May 2 @ 2pm PDT, attendee `demo@snapsonic.com`, location "555 Burrard Street, Vancouver, BC")
- Live `coveblades.com` schedule widget rendered "Sat May 2 — Vancouver" instead of the default Home Shop card → confirms both the booking POST shape and the city-extraction fix
- Test booking subsequently cancelled via Cal v2 (revealed bug #3, the `cancellationReason` field-name mismatch)

## [2.7.0] — 2026-04-30 — Auto-rotating Instagram access token

### Added
- **`app_credentials` Supabase table** for runtime-mutable secrets — primarily self-rotating OAuth tokens. Service-role-only RLS. Migration: `supabase/migrations/20260430000000_app_credentials.sql`
- **`lib/credentials.ts`** — `getCredential(name)` / `setCredential(name, value, expiresAt)` helpers backed by `app_credentials`. Used for any credential that needs to mutate at runtime without a redeploy
- **`/api/cron/refresh-instagram-token`** — Vercel Cron handler. Reads the current IG token from Supabase (with env fallback), checks `expires_at`, calls Meta's `oauth/access_token?grant_type=fb_exchange_token` if within 14 days of expiry, writes the new 60-day token + new `expires_at` back to Supabase. Authenticated via `CRON_SECRET` (Vercel auto-attaches `Authorization: Bearer ${CRON_SECRET}` to cron invocations)
- **`vercel.json` cron schedule** — `0 9 * * 1` (every Monday 09:00 UTC). With Meta's 60-day token life and a 14-day refresh window, the cron has 7 chances to refresh before the token expires
- **`CRON_SECRET` env** generated and added to `.env.local` + Vercel Production/Development

### Changed
- **`lib/instagram.ts` `getInstagramToken()`** — now reads from `app_credentials` first, falls back to `INSTAGRAM_ACCESS_TOKEN` env var. The env-var path covers the seed window (before the first cron run writes the row) and any Supabase outage

### Verified end-to-end (2026-04-30)
- Migration applied to live DB; `app_credentials` table created with `service_role_all` RLS policy
- Initial `instagram_access_token` row seeded with `2026-06-28T22:30:00Z` expiry
- Production cron route hit successfully: `{ refreshed: false, reason: "expires in 59.2 days — no refresh needed" }`
- Vercel Cron registered (visible in dashboard)
- First active refresh expected on or near `2026-06-14` (14 days before token expiry)

### Also (2026-04-30)
- Supabase project renamed in the dashboard from "Cove Cutlery" → "Cove Blades" via Management API (`PATCH /v1/projects/{ref}`)
- Initial deploy of this slice failed because `CRON_SECRET` had a trailing newline from `openssl rand -hex 32` output capture; fixed by re-adding via `printf "%s"` (no `\n`) instead of `echo`

## [2.6.3] — 2026-04-29 — SMS infra now on the new (604-210-8180) number

### Changed
- **`MAGPIPE_SMS_FROM` env** updated from `+16043731500` (legacy Cove Cutlery number) to `+16042108180` (Cove Blades) — locally in `.env.local` and on Vercel (Production + Development). Customer-facing SMS confirmations and receipts now arrive from the same number that's displayed on the website
- **`ADMIN_PHONE` constant** in `src/app/api/cal/book/route.ts` updated similarly. Admin booking notifications now go to the new number
- **architecture.md** updated to reflect the now-aligned state — removed the "Brand-rename infra divergence" gotcha (the divergence is resolved); Vercel project + GitHub repo identifiers remain intentionally unrenamed

## [2.6.2] — 2026-04-29 — Hero padding fix: van no longer obscured by navbar on mobile

### Fixed
- **Hero section** added `pt-24 pb-16 sm:pt-20 sm:pb-12` to clear the fixed `h-16` navbar. The van decoration (with the new tire-smoke animation) was rendering behind the navbar on mobile because `flex justify-center` was vertically-centering content with no top margin reserved for the navbar overlap. Van now sits 30 px below the navbar with breathing room

## [2.6.1] — 2026-04-29 — Instagram in-page modal + repositioned to under Hero

### Changed
- **Instagram section moved from below `WhereWeAreSection` to right under `HeroSection`** — pictures-first instinct: visual social proof immediately after the hero CTAs, before the rest of the funnel. The hero is `min-h-screen` so the feed becomes the first thing visitors see when they scroll
- **Posts now open in a modal instead of redirecting to instagram.com** — keeps users on the site. Modal is media-type aware:
  - **Images** render full-size, contained to 60vh
  - **Videos** play inline with HTML5 controls, autoplay, `playsInline`
  - **Carousels** show all child items with prev/next chevrons, slide counter (`1 / 4`), and arrow-key navigation
  - Caption rendered with preserved line breaks below the media; "View on Instagram" footer link kept as escape hatch
  - Backdrop click + Escape key close; body scroll locked while open

### Added
- **`children` field added to Graph API query** — each carousel post now includes its full set of `id, media_type, media_url, thumbnail_url` children in one API call, so the modal has everything it needs without an additional round trip
- **`InstagramFeedClient`** client component (`src/components/sections/InstagramFeedClient.tsx`) — handles modal state, keyboard, body-scroll-lock, and renders the grid as `<button>` elements (was `<a>`). The server-component `InstagramFeed.tsx` stays as a thin shell that fetches data and passes it to the client component

## [2.6.0] — 2026-04-29 — Instagram feed on the home page

### Added
- **`<InstagramFeed>` server section** (`src/components/sections/InstagramFeed.tsx`) — fetches the latest 6 posts from the @coveblades Instagram Business account via the Meta Graph API and renders them as a 2×3 grid (3-col on `sm+`). Inserted between `WhereWeAreSection` and `AboutSection` on the home page (early-funnel social proof, after the schedule and before the about/contact close)
- **`lib/instagram.ts`** — `getInstagramFeed(limit)` helper. Calls `/{ig-user-id}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` with `next: { revalidate: 3600 }` so the result is cached at the Next.js fetch layer for 1 hour. Returns `[]` on missing credentials or API failure so the section degrades gracefully to a "Follow @coveblades" CTA only
- **Media-type aware preview** — videos render their `thumbnail_url` with a play badge; carousels render the cover with a multi-image badge; images render directly. Hover surfaces caption (line-clamped to 3 lines) over a gradient
- **`INSTAGRAM_USER_ID`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_APP_ID`** added to `.env.local` (token is currently short-lived; needs exchange to long-lived 60-day token via App Secret as a follow-up)

### Why direct Graph API instead of a third-party widget
- No paid middleware
- No watermarks
- Full styling control matched to the rest of the site
- Tradeoff: 60-day token refresh required (handled separately)

## [2.5.5] — 2026-04-29 — Mobile overflow fixes + readable blog typography

### Fixed (mobile)
- **Lead-capture form padding** reduced on mobile (`p-8` → `p-5 sm:p-8`) on `/contact`, `/train-to-be-sharp`, `/event-sharpening-service`, and the homepage `ContactSection`. The Cloudflare Turnstile widget renders ~300 px wide; previous `p-8` left only ~270 px of inner space, causing the iframe to overflow. New padding gives ~302 px inner space — Turnstile now fits with a 6 px margin (the prior 30 px overflow is gone)
- **Pricing card `$price` text** drops from `text-4xl` to `text-3xl` on mobile (`text-3xl sm:text-4xl`); `/cutlery` suffix drops to `text-xs sm:text-sm`. Fixes the 4 px overflow inside each pricing tier card on the home page 2-col grid
- **Footer-area social row** (Instagram / Facebook / YouTube on `ContactSection`) switched from `flex` to `flex flex-wrap items-center gap-x-4 gap-y-2` — items wrap to a second line if they don't fit, eliminating the prior 7 px row overflow

### Added
- **`@tailwindcss/typography` plugin** installed and registered in `globals.css` via `@plugin "@tailwindcss/typography"` (Tailwind v4 syntax). Blog posts (`/blog/[slug]`) now render with proper typographic hierarchy — distinct `h2` / `h3` sizing and spacing, paragraph rhythm, list/blockquote styling, gold-link `hover` underlines, white headings with `prose-invert` dark-mode contrast. Replaces the previous wall-of-text rendering where every block looked the same

## [2.5.4] — 2026-04-29 — Hero van zoom-in animation

### Added
- **Hero ProMaster van zooms in from off-screen left** on page mount and lands cleanly between the gold gradient lines. Custom CSS keyframe `van-zoom-in` (1.4 s, expo ease-out) in `globals.css`; class applied to the `<img>` in `HeroSection.tsx`. Respects `prefers-reduced-motion`

## [2.5.3] — 2026-04-29 — `{{city}}` personalization variable in SMS campaigns

### Added
- **`{{city}}` variable** in SMS campaign personalization — derived from the customer's `address` field via `cityFromAddress()`. When the address can't be parsed (or for ad-hoc manual recipients), falls back to `"your area"` so the message still reads naturally
- Insert button for `{{city}}` added alongside First Name / Name / Phone in the campaigns admin compose UI

### Changed
- **`cityFromAddress()` extracted** from `lib/calSchedule.ts` (where it was a private helper) into `lib/format.ts` so it can be shared. `calSchedule.ts` now imports it. Behavior preserved (Nominatim/Places "Street, City, Province Postal, Country" parsing with the unit-number edge case)
- `validRecipients` in `/api/admin/campaigns` POST now carries `city` alongside name and phone

This unlocks the review-request SMS template suggested earlier:
`Hi {{first_name}}, hope your knives feel sharp! A Google review (mentioning {{city}}!) would mean a lot: {{review_link}} — Cove Blades`

## [2.5.2] — 2026-04-29 — Reinforce Service Area Business signal site-wide

### Added
- **Homepage `LocalBusiness.areaServed`** now enumerates all 17 cities (sourced from `cities.ts`). Previously the schema only carried the physical `address` + `geo`, leaving Google to infer service-area scope from city pages alone. The explicit `areaServed` array site-wide reinforces the SAB (Service Area Business) signal — works alongside the per-city `Service` schema and the GBP `sameAs` reference to give Google a coherent, deterministic picture: one entity, one physical location, 17 served cities

This is the in-code piece. The companion off-site work (configuring GBP as SAB with all 17 cities, soliciting city-mentioning reviews, building city-specific citations) sits with the user.

## [2.5.1] — 2026-04-29 — Wire existing Google Business Profile into entity graph

### Added
- **Google Business Profile URL added to LocalBusiness `sameAs`** in `src/app/layout.tsx`. Cove Blades' GBP already exists; without `sameAs` linkage Google has to infer the website-to-entity match from address/phone/name signals alone. With the explicit reference, entity disambiguation becomes deterministic
- **`public/llms.txt`** picks up the same GBP URL under contact references so AI crawlers see the listing alongside socials

The URL form is the Google Search knowledge-panel anchor (`/search?q=...&stick=...`) since that is what the user had on hand. The `stick` parameter is a stable entity reference that Google's parsers recognize for `sameAs`. If a cleaner `https://maps.google.com/?cid=...` form turns up later, it's a one-line swap.

## [2.5.0] — 2026-04-29 — Validated address on training intake + form audit

### Added
- **`<AddressAutocomplete>` component** (`src/components/AddressAutocomplete.tsx`) — reusable Google Places-backed address field with debounced 350ms autocomplete, suggestion picker, outside-click dismissal, and a `validated` flag tracking whether the current value came from a real Places pick (vs free-typed). Returns address text + validated boolean to its parent
- **`address` column on `contact_submissions`** (Supabase migration `20260429000000_contact_submissions_address.sql`) — nullable text. Backwards-compatible for existing rows
- **`InquiryForm` props**: `showAddress: boolean`, `addressLabel?: string`. When enabled, renders `<AddressAutocomplete>` and blocks submit until the address is autocomplete-validated (with a clear error message: "Please pick your address from the autocomplete suggestions")

### Changed
- **`/train-to-be-sharp` inquiry form** now requires a validated address ("Your address" label) — covers Erik's need to know where students are coming from for both onsite and mobile training delivery
- **`/api/contact`** accepts and stores the optional `address` field

### Form Turnstile audit (no changes needed)
All three lead-capture forms already use Cloudflare Turnstile:
- `/contact` page form ✓
- `ContactSection` (homepage) ✓
- `InquiryForm` (training + events) ✓

`BookingModal` deliberately has no Turnstile — CAPTCHA was previously removed from the booking flow to reduce friction, with the trade-off documented in `architecture.md`. Flagging here in case you want to revisit; not changed in this commit.

## [2.4.0] — 2026-04-29 — Citywide SEO/GEO expansion (Phases 1–6)

### Phase 6 — Schema enrichment + answer-first H2 nudges

- **City `Service` schema** enriched: `serviceType`, full `provider` block (telephone, email, address), `areaServed` now an array including each neighbourhood as a `Place`, new `hasOfferCatalog` with three priced offers (standard $12, Japanese/ceramic $18, scissors $12) — gives AI engines structured pricing they can cite directly
- **Hub page** picked up two new schema blocks: `ItemList` of all 17 service-area pages with positional ordering, and a `SiteNavigationElement` listing each city as a navigation entry — both improve crawl-depth signals for AI search
- **Answer-first H2 rewrites** on the city template: "How Mobile Sharpening Works in {city}" → "How does mobile sharpening work in {city}?"; "Neighbourhoods We Serve in {city}" → "Which {city} neighbourhoods do we serve?". Citation-friendly pattern for AI summarization



### Phase 5 — Hub redesign + internal linking + llms.txt

- **`/service-area` hub** — cities now grouped by sub-region (North Shore / Vancouver / Burnaby & New West / Tri-Cities / South of Fraser / Fraser Valley) instead of a flat grid; hero updated to "17 cities" and "105 km service radius"; FAQ rewritten with mobile-first messaging and drive-distance-aware minimums; CTA softened on drop-off
- **City template** — added "Also serving nearby" related-cities section (3 cities from same sub-region) before the CTA. Driven by `getRelatedCities(city, 3)` helper in `cities.ts`
- **`public/llms.txt`** — full 17-city service-area inventory by sub-region, mobile-vs-drop-off explicitly clarified, mobile minimums per city, training/event services added, YouTube social link added
- **Sitemap** — automatically picks up all new cities since it iterates `cities` from `cities.ts`; verified all 17 entries present



### Phase 4 — Five Fraser Valley + South Fraser cities

- **`/service-area/pitt-meadows`** — Agricultural pocket between Maple Ridge and Coquitlam; blueberry/cranberry growing context; bundled-routing note with Maple Ridge. 40–45 min drive
- **`/service-area/langley`** — Both City and Township; Walnut Grove, Willoughby, Brookswood, Murrayville, Aldergrove, Fort Langley; wineries + farm-to-table angle. 50–65 min drive
- **`/service-area/white-rock`** — Beachfront character; promenade, pier, fillet knife focus; coordinated strata visits. 50–60 min drive
- **`/service-area/abbotsford`** — Largest Fraser Valley city; agricultural capital framing (dairy, blueberries, Mennonite + South Asian food culture); minimum bumped to 8 knives ($96) given drive. 70–80 min drive
- **`/service-area/chilliwack`** — Eastern edge of service area; Sardis, Vedder, Cultus Lake, Yarrow; minimum bumped to 10 knives ($120); explicit batched-route framing. 90–105 min drive

Drive-distance-aware minimums on the longer cities (Abbotsford 8 knives, Chilliwack 10 knives) keep mobile economics realistic without rejecting the customer entirely. Each page has unique 3-paragraph local content, 4 city-specific FAQs, distinct neighbourhood list, and dedicated meta tags.



### Phase 3 — Five close-in mobile cities

- **`/service-area/richmond`** — Asian food capital, dim sum + Vietnamese + izakaya context, Steveston fishing village, Chinese cleavers and fillet knives. 25–30 min drive
- **`/service-area/surrey`** — All six town centres (Whalley/City Centre, Guildford, Newton, Fleetwood, Cloverdale, South Surrey); Punjabi food capital framing for Newton; 35–50 min drive depending on town centre
- **`/service-area/delta`** — All three communities (North Delta, Ladner, Tsawwassen) with distinct food-culture context per community; fillet knives for waterfront homes; 35–50 min drive
- **`/service-area/new-westminster`** — Royal City; Quay, Sapperton, Brewery District, Queensborough; 25–35 min drive
- **`/service-area/maple-ridge`** — Semi-rural character; equestrian properties, garden tools, hunting/fillet knives alongside kitchen blades; 40–50 min drive

Each page has a unique 3-paragraph description grounded in actual local geography and food culture, 4 city-specific FAQs, distinct neighbourhood list, and dedicated meta tags. All flagged `dropOffEmphasis: false` with appropriate `subRegion`.


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
