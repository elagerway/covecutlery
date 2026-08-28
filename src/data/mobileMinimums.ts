/**
 * Mobile service minimums, by city.
 *
 * Single source of truth. These numbers previously lived in three hard-coded
 * tables (MobileServiceSection, /mobile-service, /pricing) plus prose in
 * cities.ts, which is how the stale 5-piece figure survived a sitewide retier.
 *
 * Deliberately small and free of imports so it is safe in the client bundle —
 * the booking modal needs it, and src/data/cities.ts is ~500 lines of SEO copy
 * that must never be pulled clientside.
 */

export interface MobileMinimum {
  /** Pieces required to book a mobile visit. */
  readonly pieces: number;
  /** Shown when a city's minimum isn't a single flat number. */
  readonly note?: string;
}

/** Keyed by the city slug used in /service-area/[city]. */
export const MOBILE_MINIMUMS: Readonly<Record<string, MobileMinimum>> = {
  "north-vancouver": { pieces: 6 },
  "west-vancouver": { pieces: 6 },
  burnaby: { pieces: 8, note: "8 pieces in North Burnaby, 10 in South Burnaby" },
  vancouver: { pieces: 10 },
  "port-moody": { pieces: 10 },
  coquitlam: { pieces: 15 },
  "port-coquitlam": { pieces: 15 },
  "new-westminster": { pieces: 15 },
  richmond: { pieces: 15 },
  delta: { pieces: 15 },
  surrey: { pieces: 15 },
  "white-rock": { pieces: 15 },
  langley: { pieces: 15 },
  "maple-ridge": { pieces: 15 },
  "pitt-meadows": { pieces: 15 },
};

/** The lowest minimum anywhere we serve — used for "minimums from N pieces" copy. */
export const LOWEST_MINIMUM = Math.min(
  ...Object.values(MOBILE_MINIMUMS).map((m) => m.pieces),
);

/** The highest, for "up to N further out" copy. */
export const HIGHEST_MINIMUM = Math.max(
  ...Object.values(MOBILE_MINIMUMS).map((m) => m.pieces),
);

/** City names as they appear in a formatted address, longest first so
 *  "North Vancouver" wins over "Vancouver" on a substring match. */
const CITY_NAMES: readonly (readonly [string, string])[] = Object.keys(MOBILE_MINIMUMS)
  .map((slug) => [slug, slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")] as const)
  .sort((a, b) => b[1].length - a[1].length);

export function minimumForSlug(slug: string): MobileMinimum | null {
  return MOBILE_MINIMUMS[slug] ?? null;
}

/**
 * Resolve a minimum from a free-text address ("1688 Layton Drive, North
 * Vancouver, BC V7H 1X8"). Returns null when the city isn't one we list, so
 * callers can fall back to generic copy rather than assert a wrong number.
 */
export function minimumForAddress(
  address: string,
): { slug: string; name: string; minimum: MobileMinimum } | null {
  const haystack = address.toLowerCase();
  for (const [slug, name] of CITY_NAMES) {
    if (haystack.includes(name.toLowerCase())) {
      return { slug, name, minimum: MOBILE_MINIMUMS[slug] };
    }
  }
  return null;
}
