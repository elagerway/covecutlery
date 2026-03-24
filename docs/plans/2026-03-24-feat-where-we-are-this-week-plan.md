---
title: "feat: Where We'll Be This Week section"
type: feat
status: active
date: 2026-03-24
---

# Where We'll Be This Week — Homepage Section

## Overview

Add a rolling 7-day location strip to the homepage that reads confirmed Cal.com bookings and displays which city the operator will be working in each day. Days with no bookings fall back to "Home Shop — North Vancouver". Today's card is gold-highlighted. Refreshes every 5 minutes via Next.js ISR.

---

## Proposed Solution

Three-file change:

1. **`src/app/api/cal/schedule/route.ts`** — new GET endpoint that fetches the next 7 days of bookings from Cal.com, extracts cities from the address in booking notes, and returns a structured day-by-day array.
2. **`src/components/sections/WhereWeAreSection.tsx`** — new async Server Component that calls the API route with `next: { revalidate: 300 }`, renders the 7-day card strip.
3. **`src/app/page.tsx`** — add `<WhereWeAreSection />` after `<ReviewsSection />`.

This introduces the first **async Server Component** in the codebase. No client-side JS needed — the section is fully server-rendered and cached.

---

## Technical Approach

### 1. API Route — `src/app/api/cal/schedule/route.ts`

```ts
GET /api/cal/schedule
→ Response: { days: DaySchedule[] }

interface DaySchedule {
  date: string        // "2026-03-24"
  dayLabel: string    // "Mon"
  dateLabel: string   // "Mar 24"
  cities: string[]    // ["Surrey", "Burnaby"] — empty = Home Shop
  isToday: boolean
}
```

**Implementation steps:**

1. Compute `start` = today at 00:00 Pacific, `end` = today+7 at 23:59 Pacific
   - Use `Intl.DateTimeFormat` with `America/Vancouver` timezone to get today's date string, then build ISO strings
   - Avoid `new Date().toLocaleDateString()` — not reliable on Node.js serverless

2. Fetch bookings from Cal.com:
   ```
   GET https://api.cal.com/v2/bookings
     ?afterStart={start}
     &beforeEnd={end}
     &eventTypeIds[]={CAL_EVENT_TYPE_ID}
   Headers:
     Authorization: Bearer {CAL_API_KEY}
     cal-api-version: 2024-08-13
   ```
   > ⚠️ **Verify at implementation time:** Cal.com v2 bookings list params may be `afterStart`/`beforeEnd` or `startTime`/`endTime` — test with a real booking first. Filter to `status` that represents confirmed/accepted bookings only (likely `upcoming` or `accepted`).

3. Build a 7-slot day map keyed by `YYYY-MM-DD` date string:
   ```ts
   const dayMap: Record<string, Set<string>> = {}
   // pre-populate all 7 days with empty Sets
   ```

4. For each booking, extract city:
   ```ts
   function extractCity(notes: string | null): string | null {
     if (!notes) return null
     const line = notes.split("\n").find(l => l.startsWith("Address:"))
     if (!line) return null
     const address = line.replace("Address:", "").trim()
     // Nominatim format: "123 Main St, Surrey, British Columbia V3R 0A1, Canada"
     const parts = address.split(",").map(p => p.trim())
     return parts[1] ?? null   // index 1 is always the city in Nominatim BC addresses
   }
   ```

5. For each booking: parse `booking.start` → get `YYYY-MM-DD` date in Vancouver timezone → add city to that day's Set (deduplication is automatic).

6. Build response array of 7 `DaySchedule` objects. Days with empty city Sets get `cities: []`.

7. Wrap in try/catch — on any error return all 7 days with `cities: []` (graceful fallback to Home Shop).

---

### 2. Server Component — `src/components/sections/WhereWeAreSection.tsx`

```tsx
// NO "use client" — this is an async Server Component

const HOME_SHOP = "North Vancouver"
const HOME_SHOP_FULL = "North Vancouver, BC"

export default async function WhereWeAreSection() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cal/schedule`, {
    next: { revalidate: 300 },   // ISR — revalidate every 5 minutes
  }).then(r => r.json()).catch(() => null)

  const days: DaySchedule[] = data?.days ?? fallback7Days()
  // ...
}
```

> **Note on `NEXT_PUBLIC_BASE_URL`:** Internal `fetch` calls in Server Components require an absolute URL. Add `NEXT_PUBLIC_BASE_URL=https://covecutlery.com` to `.env.local` and Vercel env vars. In development: `http://localhost:3000`.

**Alternative (simpler):** Move the Cal.com fetching logic into a shared `lib/calSchedule.ts` utility and call it directly from the Server Component — skipping the internal HTTP call entirely. This avoids the `NEXT_PUBLIC_BASE_URL` env var requirement. **Recommended** — see decision note below.

---

### 3. Preferred Architecture: Shared Utility (No Internal HTTP)

Instead of the Server Component calling its own API route, extract the logic:

```
src/lib/calSchedule.ts        ← fetches Cal.com, extracts cities, returns DaySchedule[]
src/app/api/cal/schedule/route.ts  ← calls calSchedule.ts, returns JSON (for external use)
src/components/sections/WhereWeAreSection.tsx  ← calls calSchedule.ts directly
```

The Server Component calls `calSchedule()` directly with `fetch` wrapped at the Cal.com call level using `next: { revalidate: 300 }`. This is the cleaner Next.js App Router pattern — no internal HTTP hop, no base URL env var needed.

---

### 4. UI Layout

**Desktop (md+):** 7-column grid, each column is a card.
**Mobile:** Horizontal scroll row (`overflow-x-auto`, each card `min-w-[100px]`), today card centered on load.

**Card anatomy:**
```
┌─────────────────┐
│  MON            │  ← day label, small, muted
│  Mar 24         │  ← date, smaller, muted
│                 │
│  📍 Surrey      │  ← city in white (or "Home Shop" muted)
│     · Burnaby   │  ← additional cities if multiple
└─────────────────┘
```

**Today card:** gold border + subtle gold background tint (`rgba(212,160,23,0.08)`).
**Home Shop card:** muted text, house icon instead of map pin.
**Booked city card:** white city name, gold map pin icon, white border.

**Section heading:**
```
Where We'll  Be
             ^^^  gold
[thin gold divider line]
[subtitle: "Bookings update our location automatically. Find us near you."]
```

---

### 5. City Extraction — Edge Cases

| Input | Expected Output | Handling |
|-------|-----------------|----------|
| `"Address: 4086 Brockton Crescent, North Vancouver, BC V7G 1E6, Canada"` | `"North Vancouver"` | index 1 |
| `"Address: 123 Main St, Surrey, BC V3R 0A1, Canada"` | `"Surrey"` | index 1 |
| `"Address: Suite 200, 123 Main St, Burnaby, BC"` | `"123 Main St"` ❌ | Need to detect — if index 1 looks like a street (contains digits), use index 2 |
| No `"Address:"` line in notes | `null` → Home Shop | Handled |
| `notes` is `null` or `""` | `null` → Home Shop | Handled |
| Booking in non-BC location | Returns whatever city Nominatim gave | Acceptable |

**Improved city extraction for suite addresses:**
```ts
const city = parts[1]?.match(/^\d/) ? parts[2] : parts[1]
```

---

### 6. Timezone Handling

All booking `start` times from Cal.com are ISO 8601 UTC strings (e.g. `"2026-03-24T21:00:00.000Z"`). To map them to the correct Pacific date:

```ts
function toVancouverDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-CA", {
    timeZone: "America/Vancouver",
  }) // → "2026-03-24"
}
```

A booking at 9pm UTC = 2pm Pacific on the same day ✓.
A booking at 11pm UTC = 3pm Pacific next day ✗ if not timezone-converted — this is the key bug to avoid.

---

## Acceptance Criteria

- [ ] Section appears on homepage between ReviewsSection and AboutSection
- [ ] Shows 7 days starting from today (Vancouver timezone)
- [ ] Today's card has gold border and background tint
- [ ] Days with confirmed bookings show the city name (not street address)
- [ ] Multiple cities on same day are deduplicated and shown as "City A · City B"
- [ ] Days with no bookings show "Home Shop" in muted styling with a house icon
- [ ] On Cal.com API failure, all days gracefully show "Home Shop"
- [ ] Section revalidates every 5 minutes (not on every request)
- [ ] No loading spinner — content is server-rendered
- [ ] Mobile: horizontal scroll with cards, desktop: 7-column grid
- [ ] Customer's street address is never displayed

---

## Dependencies & Risks

| Risk | Mitigation |
|------|------------|
| Cal.com bookings API params differ from expected | Test with a real booking before full build; check `afterStart`/`beforeEnd` vs other param names |
| Bookings endpoint returns all event types | Filter by `eventTypeId` in the query, or filter client-side on `booking.eventTypeId` |
| No bookings API key read access | Current key is a personal API key — should have full access. Verify by hitting the endpoint manually first |
| `NEXT_PUBLIC_BASE_URL` needed if calling own API route | Avoided by using the shared utility pattern (Approach 3 above) |
| Nominatim address format varies | The edge case detection (suite/unit numbers) handles the most common variant |

---

## Implementation Order

1. Verify Cal.com bookings API response shape with a test `curl`
2. Create `src/lib/calSchedule.ts` — data fetching + city extraction + day building
3. Create `src/app/api/cal/schedule/route.ts` — thin wrapper around `calSchedule()`
4. Create `src/components/sections/WhereWeAreSection.tsx` — async Server Component
5. Update `src/app/page.tsx` — insert section
6. Add `NEXT_PUBLIC_BASE_URL` to `.env.local` if needed
7. Test: confirm city shows for a booked day, Home Shop for unbooked, graceful fallback on error

---

## References

- Existing proxy pattern: `src/app/api/cal/slots/route.ts`
- Existing proxy pattern: `src/app/api/cal/book/route.ts`
- Homepage assembly: `src/app/page.tsx:1-31`
- Section component pattern: `src/components/sections/DropOffSection.tsx` (simplest non-client section)
- Design tokens: all inline `style={{}}`, bg `#0D1117`, card `#161B22`, gold `#D4A017`, muted `#6B7280`, border `#30363D`
- Cal.com v2 bookings: `https://api.cal.com/v2/bookings` with `cal-api-version: 2024-08-13`
