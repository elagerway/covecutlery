# Google Ads Launch Playbook — Cove Blades

**Goal:** stand up a measurable, low-pain Google Ads campaign for mobile knife sharpening across the Lower Mainland. Spend ~30 min in the Google Ads UI doing only what's unavoidable; everything else lives in this doc as paste-ready content.

**Tag already installed:** `AW-18180527373` (live on every page via root layout).

---

## Step 1 — Create the conversion action (5 min, in GAds)

Without this, you'll spend money with no idea what it returned.

1. Google Ads → **Tools** (top-right wrench) → **Conversions** → **+ New conversion action** → **Website**
2. Settings:
   - **URL to scan:** `https://coveblades.com` (it'll find the tag automatically)
   - **Conversion name:** `Booking Completed`
   - **Category:** `Purchase`
   - **Value:** `Use the same value for each conversion` → **$60 CAD**
   - **Count:** `One`
   - **Click-through window:** 30 days
   - **View-through window:** 1 day
   - **Attribution model:** Data-driven (or Position-based if Google won't let you pick data-driven yet)
3. After saving, Google shows two tag snippets. **You don't need to copy/paste them** — we've already wired the conversion event in code (`src/lib/google-ads.ts`). What you DO need:
   - On the conversion action detail page, find the **Conversion ID** and **Conversion label** (looks like `AW-18180527373` and `abcDEF123xy`)
   - Combine them as `AW-18180527373/abcDEF123xy`
   - Paste that string into `.env.local` as `NEXT_PUBLIC_GADS_CONVERSION_ID=AW-18180527373/abcDEF123xy`
   - Also set the same env var in Vercel (Project Settings → Environment Variables → all environments)
   - Push or redeploy

The conversion fires automatically on `booking_succeeded` (BookingModal step → "done"). You can test with Google's **Tag Assistant** Chrome extension to confirm.

---

## Step 2 — Create the campaign (15 min, in GAds)

**Click path:** Campaigns → **+** → New campaign → **Sales** → Continue without a goal type → **Search**

**Campaign-level settings:**

| Setting | Value |
|---|---|
| Campaign name | `Cove Blades — Mobile Sharpening` |
| Networks | ✅ Google search · ❌ Search partners · ❌ Display |
| Locations | Lower Mainland, BC. Use the city list in **Appendix A** below |
| Location options (advanced) | **Presence: People in or regularly in your targeted locations** (NOT "interest" — that wastes budget) |
| Languages | English |
| Audience segments | Skip for v1 — let keywords do the work |
| Budget | `$25/day` to start (~$760/month). Tune after 2 weeks |
| Bidding | **Maximize conversions** for the first 30 conversions, then switch to **Target CPA** at $15–20 |
| Ad schedule | All day, all week (gather data first month) |
| Ad rotation | Optimize (let Google pick best-performing ad) |
| Devices | All (default) — mobile typically wins for local home services |

---

## Step 3 — Create the 5 ad groups (paste-ready content below)

Each ad group needs: keywords, 1 responsive search ad with 15 headlines + 4 descriptions, and a landing-page URL. All of this is below — paste directly into the GAds UI.

### Ad Group 1 — Mobile (broad service intent)

**Final URL:** `https://coveblades.com/mobile-service`

**Keywords (phrase + broad match modifiers):**
```
"mobile knife sharpening"
"mobile knife sharpening vancouver"
"knife sharpening at home"
"knife sharpening comes to you"
"knife sharpener comes to home"
mobile knife sharpening
knife sharpening service mobile
sharpener that comes to you
[knife sharpening near me]
[mobile knife sharpening]
```

**15 headlines (≤30 chars each):**
```
Mobile Knife Sharpening
We Come to Your Kitchen
Sharp Knives in 20 Minutes
Pro Sharpening at Your Door
Vancouver's Mobile Sharpener
$12/Knife — All Inclusive
30-Day Edge Guarantee
Book Online in 60 Seconds
North Shore to Chilliwack
5-Star Google Rated
Trusted Since 2020
Japanese Knife Experts
Restaurant-Quality Edge
Same-Day Availability
Cove Blades — Lower Mainland
```

**4 descriptions (≤90 chars each):**
```
Professional mobile knife sharpening across Metro Vancouver. We bring the full setup.
Tired of dull knives? We come to you. Japanese waterstones. Real factory angles.
$12 per knife. 5-knife minimum. Book online in under a minute. 30-day guarantee.
Vancouver's mobile sharpener since 2020. Lonsdale to Langley, on-site in 20 minutes.
```

---

### Ad Group 2 — Vancouver (city-specific, highest volume)

**Final URL:** `https://coveblades.com/service-area/vancouver`

**Keywords:**
```
"knife sharpening vancouver"
"knife sharpener vancouver"
"mobile knife sharpening vancouver"
"sharpening service vancouver"
"chef knife sharpening vancouver"
[vancouver knife sharpening]
[knife sharpener vancouver bc]
```

**15 headlines:**
```
Knife Sharpening — Vancouver
Vancouver's Mobile Sharpener
Sharp Knives in Vancouver Today
We Come to Your Vancouver Home
$12/Knife in Vancouver
30-Day Edge Guarantee
Book Mobile Service Online
North Shore Pro, Vancouver-Wide
Japanese Knife Specialists
5-Star Google Rated
Kitsilano to Gastown We Cover It
Same-Day Drop-Off Option Too
Trusted Vancouver Since 2020
On-Site in 30 Minutes Flat
Cove Blades — Vancouver
```

**4 descriptions:**
```
Vancouver's mobile knife sharpening service. We come to Kits, Gastown, Mt Pleasant & more.
Sharp knives in 20 minutes at your Vancouver kitchen. $12/knife with 30-day guarantee.
From Yaletown to East Van — book a mobile visit online or use our 24/7 N.Van drop-off.
Single-bevel Japanese specialists. Wusthof, Shun, Global — every blade to factory angle.
```

---

### Ad Group 3 — North Shore (your highest-margin geography)

**Final URL:** `https://coveblades.com/service-area/north-vancouver`

**Keywords:**
```
"knife sharpening north vancouver"
"knife sharpener north shore"
"knife sharpening west vancouver"
"mobile knife sharpening north shore"
[north vancouver knife sharpening]
[knife sharpening north shore]
```

**15 headlines:**
```
North Shore Knife Sharpening
Based on the North Shore
Same-Day Drop-Off in N. Van
24/7 Drop Box — Brockton Cres
Mobile Service Across N. Shore
$12/Knife — 30-Day Guarantee
West Van, Lonsdale, Lynn Valley
Lonsdale to Deep Cove Coverage
5-Star Google Rated
Japanese Knife Specialists
Book in 60 Seconds Online
Same-Day Sharpening, By Appt
Trusted North Shore Since 2020
Restaurant-Quality Edge
Cove Blades — North Shore
```

**4 descriptions:**
```
North Shore's local sharpener. Same-day drop-off at 4086 Brockton Cres, 24/7 box.
Mobile visits across the North Shore in 10–15 min. $12/knife, 30-day edge guarantee.
West Van, Lonsdale, Lynn Valley, Deep Cove — we cover the whole North Shore.
Japanese waterstones. Factory angles. The local pros for your knives.
```

---

### Ad Group 4 — Japanese Knife Specialty

**Final URL:** `https://coveblades.com/service-area/richmond`

**Keywords:**
```
"japanese knife sharpening vancouver"
"yanagiba sharpening"
"single bevel knife sharpening"
"shun knife sharpening"
"miyabi sharpening"
"japanese knife sharpener vancouver"
[japanese knife sharpening]
[single bevel sharpening]
```

**15 headlines:**
```
Japanese Knife Sharpening
Single-Bevel Specialists
Yanagiba & Deba Sharpening
Japanese Waterstones, Always
Factory Angle Preserved
Shun, Miyabi, Global, Tojiro
Mobile Service Across Metro Van
$18/Knife — Japanese Blades
30-Day Edge Guarantee
We Come to Your Kitchen
24/7 Drop Box in N. Van
5-Star Google Rated
Sashimi-Ready Edges
Honyaki, Honkasumi, Kasumi
Cove Blades — Japanese Experts
```

**4 descriptions:**
```
Single-bevel Japanese knives sharpened on waterstones. We match the original factory geometry.
Yanagiba, deba, usuba, sujihiki — all blades respected. Mobile across Metro Vancouver.
$18 per Japanese knife. Mobile service or 24/7 drop-off at 4086 Brockton Cres, N. Van.
Honyaki specialists. We don't grind Japanese single-bevels like Western knives. Ever.
```

---

### Ad Group 5 — Restaurants (B2B)

**Final URL:** `https://coveblades.com/restaurants`

**Keywords:**
```
"restaurant knife sharpening"
"commercial knife sharpening"
"chef knife sharpening service"
"professional kitchen knife sharpening"
"restaurant knife service vancouver"
[restaurant knife sharpening]
[commercial knife sharpening]
```

**15 headlines:**
```
Restaurant Knife Sharpening
Commercial Kitchen Service
We Come to Your Line
Weekly & Bi-Weekly Schedules
No Service Disruption
Faster Prep, Safer Cuts
$12/Knife — Volume Pricing
Vancouver to the Valley
Mobile Mon–Sat
Trusted by 50+ Kitchens
Built for High-Volume Lines
30-Day Edge Guarantee
Sharpen On-Site in Minutes
5-Star Google Rated
Cove Blades — Restaurant Pros
```

**4 descriptions:**
```
Scheduled weekly or bi-weekly mobile sharpening for restaurant kitchens. We come to your line.
Built for high-volume kitchens — fast turnaround, factory angles, no service disruption.
Dozens of Vancouver-area kitchens use us on rotation. Email or call to start a schedule.
$12/knife at volume. Custom quotes for full knife rolls and large rotations.
```

---

## Step 4 — Add extensions (5 min, in GAds)

**Sitelinks** (under "Ads & Assets" → "Assets" → "Sitelinks"):

| Headline | URL |
|---|---|
| Mobile Service | `https://coveblades.com/mobile-service` |
| 24/7 Drop Box | `https://coveblades.com/drop-off` |
| Pricing | `https://coveblades.com/pricing` |
| Service Area Map | `https://coveblades.com/service-area` |
| Restaurant Service | `https://coveblades.com/restaurants` |
| How We Sharpen | `https://coveblades.com/how-we-sharpen-your-knives` |

**Callouts** (one per line):
```
Same-Day Drop-Off
30-Day Edge Guarantee
$12/Knife Standard
Japanese Knife Experts
5-Star Google Rated
We Come to You
Mobile Mon–Sat
24/7 Drop Box
```

**Call extension:** Add `+1 (604) 210-8180`, business hours (your existing schedule). Enable call reporting so call clicks show as conversions too.

**Location extension:** Link your Google Business Profile (Tools → Linked accounts → Google Business Profile → connect). Auto-syncs your address, hours, and pulls in your star rating to the ad. **High-value, takes 2 minutes, big CTR lift.**

**Structured snippets** (Services type):
```
Knife Sharpening, Scissor Sharpening, Cleaver Sharpening, Garden Tool Sharpening, Japanese Knife Sharpening
```

---

## Step 5 — Universal negative keywords

Add these at the **campaign level** (Negative keyword lists → New list → apply to campaign). These prevent wasted spend on irrelevant searches.

```
free
youtube
video
how to
diy
tutorial
make my own
amazon
buy
for sale
review
sharpener machine
sharpener stone
whetstone
job
jobs
hiring
apprentice
course
class
school
sharpening service near me cheap
```

---

## Step 6 — What to watch in the first 30 days

Daily for week 1, then 2–3× per week.

**In `/admin/analytics` (your own dashboard):**
- Booking funnel — are clicks turning into modal opens, slot picks, completed bookings?
- "Booking failures" KPI — should stay zero. If it ticks up, something silently broke (this is your canary).
- Top city pages — tells you which cities to lean into in ads

**In Google Ads:**
- **Search terms report** (Insights → Search terms): see what people actually typed. Add bad ones as negatives weekly. Add good ones as new exact-match keywords.
- **Conversions:** should start trickling in by day 3-5. If you have zero conversions by day 7 with 100+ clicks, something's broken (check that the env var deployed).
- **Quality Score** per keyword: ideally 6+. Below 5 = your ad copy or landing page isn't matching the search intent. Rework that ad group.
- **Click-share** per keyword: if you're getting <50% of available impressions on your top keywords, raise your bids or budget.

**After 30 conversions:** switch bidding from "Maximize Conversions" to "Target CPA = $15–20". This tells Google to find more conversions at a controlled cost-per-acquisition.

---

## Appendix A — Geographic targeting (paste into GAds locations)

Type each one into the location search and add. GAds will geocode them.

```
Vancouver, BC, Canada
North Vancouver, BC, Canada
West Vancouver, BC, Canada
Burnaby, BC, Canada
Coquitlam, BC, Canada
Port Moody, BC, Canada
Port Coquitlam, BC, Canada
New Westminster, BC, Canada
Richmond, BC, Canada
Delta, BC, Canada
Surrey, BC, Canada
White Rock, BC, Canada
Langley, BC, Canada
Maple Ridge, BC, Canada
Pitt Meadows, BC, Canada
```

---

## Appendix B — Honest expectations

- **Cost per click:** Local home-services in BC typically $2-8/click. Knife sharpening is niche → likely $2-5.
- **Conversion rate target:** 3-6% of clicks should book. Below 2% after 200 clicks = ad/landing mismatch.
- **Realistic per-booking cost:** $10-25 in ad spend. Higher than that means the funnel needs work (or competitor bids are too high to win profitably).
- **Time to first conversion:** day 3-5 typically. If nothing by day 7, check that `NEXT_PUBLIC_GADS_CONVERSION_ID` is set in Vercel and the test in Google Tag Assistant fires.
- **First 2 weeks are noisy.** Don't pause keywords too early. Need ~30 clicks per keyword before deciding.

---

## What's wired in code (so you don't have to)

| Piece | Where | What it does |
|---|---|---|
| gtag.js | `src/app/layout.tsx` | Loads Google Ads tag site-wide |
| Conversion event | `src/lib/google-ads.ts` + `BookingModal.tsx` | Fires `conversion` event with $60 value on successful booking |
| `NEXT_PUBLIC_GADS_CONVERSION_ID` | env var | Holds `AW-XXXXXXX/label` — set this after Step 1 |

If you ever want to change the conversion value (e.g. average booking grows to $80), edit `DEFAULT_VALUE_CAD` in `src/lib/google-ads.ts`.
