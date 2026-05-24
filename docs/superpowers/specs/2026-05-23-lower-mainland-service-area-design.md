# Lower Mainland Service-Area Expansion

**Date:** 2026-05-23
**Status:** Approved, pending implementation
**Owner:** Erik / Cove Blades

## Goal

Expand `/service-area` from 5 city cards (North Vancouver, Vancouver, Burnaby, West Vancouver, Coquitlam) to 15 cards covering the core Lower Mainland mobile-service zone. Each new city becomes a full SEO landing page targeting "knife sharpening <city>" search intent.

## Scope

### In scope

- 10 new full city entries in `src/data/cities.ts`
- Refactor of the existing Coquitlam entry to narrow its scope to Coquitlam-only (it currently bundles Tri-Cities)
- Verification via `npm run build` and manual page check

### Out of scope

- Sitemap regeneration (handled automatically if dynamic; flagged separately if static)
- Internal linking from other pages to new cities
- Coverage-map UI updates
- Per-city pricing variations
- Any change to `service-area/page.tsx` or `service-area/[city]/page.tsx` templates — they already render from `cities.ts` and use `generateStaticParams`

## Cities to add

| Slug | Display name | Drive time from N. Van base |
|---|---|---|
| `richmond` | Richmond | 25–30 min |
| `surrey` | Surrey | 35–45 min |
| `delta` | Delta | 35–45 min |
| `new-westminster` | New Westminster | 25–30 min |
| `langley` | Langley | 50–60 min |
| `maple-ridge` | Maple Ridge | 40–50 min |
| `pitt-meadows` | Pitt Meadows | 40–45 min |
| `white-rock` | White Rock | 45–55 min |
| `port-coquitlam` | Port Coquitlam | 30–35 min |
| `port-moody` | Port Moody | 25–30 min |

Langley covers both Langley City and Langley Township under one slug — most search intent is for "Langley" generically; township vs. city is a civic-government distinction most users don't make.

## Coquitlam refactor

The current Coquitlam entry bundles Port Moody, Port Coquitlam, and Anmore. With those cities now getting dedicated pages, the Coquitlam page is narrowed to avoid self-competition in search results.

Changes to the existing `coquitlam` entry:

- **Description:** rewritten to focus on Coquitlam (Coquitlam Centre, Burke Mountain, the Lougheed corridor) — Tri-Cities framing removed
- **Neighbourhoods:** keep Coquitlam Centre, Burke Mountain, Westwood Plateau, Austin Heights, Maillardville, Ranch Park; drop Port Moody, Port Coquitlam, Anmore
- **Drive time:** stays "30–35 minutes from our North Vancouver base"
- **Meta title:** "Knife Sharpening Coquitlam & Tri-Cities | Cove Blades" → "Knife Sharpening Coquitlam | Mobile Service | Cove Blades"
- **Meta description:** rewritten to drop Tri-Cities phrasing
- **FAQ:** the FAQ that says "Yes. Our mobile service covers Coquitlam, Port Moody, Port Coquitlam, and Anmore." is updated to point at the dedicated city pages, e.g. "Our mobile service covers Coquitlam directly. For Port Moody and Port Coquitlam, see their dedicated pages."

Anmore: too small (pop. ~2,400) for its own page. Listed as a neighbourhood under Port Moody (geographically closest).

## Content principles

To avoid Google flagging the new pages as thin doorway content (which would hurt SEO instead of helping):

- **Every description paragraph is unique prose.** No shared boilerplate, no string templates, no copy-paste with city name swapped.
- **Local hooks per city.** Each description references concrete local landmarks, neighbourhoods, food-scene specifics, or service-relevant context (e.g. Richmond's massive Asian food scene → Japanese knife specialization; Surrey's geographic size → drive-time honesty; White Rock's retiree demographic → home-cook angle).
- **FAQs vary.** Common FAQs (mobile minimum, drop-off option, sharpening cadence) get city-specific framing. Each city has at least one FAQ that's genuinely unique to it.
- **Meta descriptions are unique per city, under 160 chars.**
- **Drive times are honest.** If we say "25–30 minutes from our North Vancouver base" for Richmond but realistically Surrey is 40+ minutes, we say so. Trust beats SEO inflation.

## Data shape

No changes to `CityData` interface. New entries match the existing shape exactly:

```ts
{
  readonly slug: string
  readonly name: string
  readonly description: string  // 3 paragraphs, \n\n separated
  readonly neighbourhoods: readonly [string, ...string[]]  // ~8-12 entries
  readonly driveTime: string
  readonly faqs: readonly FAQ[]  // 4 entries
  readonly metaTitle: string
  readonly metaDescription: string
}
```

## Verification plan

1. **Build:** `npm run build` — confirms all 15 routes generate via `generateStaticParams`, no TS errors, no schema issues.
2. **Hub page check:** load `/service-area` locally — confirm 15 cards render in the grid, no layout breakage at sm/lg breakpoints.
3. **Detail page spot-check:** load 2-3 new city pages (e.g. `/service-area/richmond`, `/service-area/surrey`, `/service-area/port-moody`) — confirm:
   - Hero, description, How It Works, Neighbourhoods, FAQ, CTA all render
   - Breadcrumb + FAQ + Service JSON-LD all present in `<head>`
   - Meta title and description correct
4. **Refactored Coquitlam check:** load `/service-area/coquitlam` — confirm no Port Moody / Port Coquitlam / Anmore references remain in description or neighbourhoods (except as a passing reference in the updated FAQ pointing at dedicated pages).

## Risks

- **Thin-content / doorway-page penalty.** Mitigated by the uniqueness principles above. The bigger risk is templating; we avoid that.
- **Drive-time overpromising.** Mitigated by honest ranges per city; Surrey/Langley/White Rock will read 45–60 min, not "we're 30 minutes away".
- **Coquitlam SEO continuity.** The refactor narrows what currently ranks for "Tri-Cities" queries. Net effect should still be positive (now ranking for three terms with dedicated pages instead of one bundled page), but worth noting.

## Implementation notes

- Append the 10 new entries to the end of the existing `cities` array in `src/data/cities.ts` (or insert in a geographically sensible order — leaving final ordering to implementation).
- Edit the existing Coquitlam entry in place.
- No other files should change.
