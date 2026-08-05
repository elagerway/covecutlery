import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.GOOGLE_MAPS_API_KEY;

const PLACES_NEW = "https://places.googleapis.com/v1";
const PLACES_LEGACY = "https://maps.googleapis.com/maps/api/place";

// Which Places API a given Maps key can reach depends on its restrictions and on which
// APIs its Google Cloud project has enabled, and those can differ per key:
//
//   • An HTTP-referrer-restricted key CANNOT use legacy Places at all ("API keys with
//     referer restrictions cannot be used with this API"), and needs an explicit Referer
//     header on Places API (New) since server-side fetches don't send one.
//   • An API-restricted key works fine with legacy Places server-side, but only reaches
//     Places API (New) if that API is enabled on its project.
//
// So we try Places API (New) first and fall back to legacy, which covers every key we've
// been handed. The Referer header is a no-op for an unrestricted key (verified) and is
// kept so a referrer-restricted key keeps working if one is swapped in later. Both paths
// log the real Google error rather than returning a bare [], which is what once made a
// misconfigured key look identical to "no matches".
const REFERER = "https://coveblades.com/";

/** Legacy-shaped prediction — what the client renders. */
interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: { main_text: string; secondary_text: string };
}

/** Legacy-shaped address component — what BookingModal parses. */
interface Component {
  long_name: string;
  short_name: string;
  types: string[];
}

interface NewPrediction {
  placeId: string;
  text?: { text?: string };
  structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
}

async function autocompleteNew(q: string): Promise<Suggestion[] | null> {
  const res = await fetch(`${PLACES_NEW}/places:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": KEY ?? "",
      Referer: REFERER,
    },
    body: JSON.stringify({
      input: q,
      includedRegionCodes: ["ca"],
      includedPrimaryTypes: ["street_address", "premise", "subpremise"],
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    console.error("[geocode] places-new autocomplete failed:", res.status, JSON.stringify(data?.error ?? data).slice(0, 300));
    return null;
  }

  const suggestions: { placePrediction?: NewPrediction }[] = data.suggestions ?? [];
  return suggestions
    .map((s) => s.placePrediction)
    .filter((p): p is NewPrediction => Boolean(p?.placeId))
    .map((p) => ({
      place_id: p.placeId,
      description: p.text?.text ?? "",
      structured_formatting: {
        main_text: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
        secondary_text: p.structuredFormat?.secondaryText?.text ?? "",
      },
    }));
}

async function autocompleteLegacy(q: string): Promise<Suggestion[] | null> {
  const url = `${PLACES_LEGACY}/autocomplete/json?input=${encodeURIComponent(q)}&components=country:ca&types=address&key=${KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("[geocode] places-legacy autocomplete failed:", data.status, String(data.error_message ?? "").slice(0, 200));
    return null;
  }
  return data.predictions ?? [];
}

async function detailsNew(placeId: string): Promise<Component[] | null> {
  const res = await fetch(`${PLACES_NEW}/places/${encodeURIComponent(placeId)}`, {
    headers: {
      "X-Goog-Api-Key": KEY ?? "",
      "X-Goog-FieldMask": "addressComponents",
      Referer: REFERER,
    },
  });
  const data = await res.json();

  if (!res.ok) {
    console.error("[geocode] places-new details failed:", res.status, JSON.stringify(data?.error ?? data).slice(0, 300));
    return null;
  }

  // null, not [] — an empty array is truthy, so it would both skip the legacy fallback
  // below and make BookingModal's `data.address_components ? …` branch format an empty
  // list into "", wiping the address the customer just picked.
  const components: { longText?: string; shortText?: string; types?: string[] }[] = data.addressComponents ?? [];
  if (components.length === 0) return null;
  return components.map((c) => ({
    long_name: c.longText ?? "",
    short_name: c.shortText ?? c.longText ?? "",
    types: c.types ?? [],
  }));
}

async function detailsLegacy(placeId: string): Promise<Component[] | null> {
  const url = `${PLACES_LEGACY}/details/json?place_id=${encodeURIComponent(placeId)}&fields=address_components&key=${KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK") {
    console.error("[geocode] places-legacy details failed:", data.status, String(data.error_message ?? "").slice(0, 200));
    return null;
  }
  const components: Component[] = data.result?.address_components ?? [];
  return components.length > 0 ? components : null;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const placeId = req.nextUrl.searchParams.get("place_id");

  if (!KEY) {
    console.error("[geocode] GOOGLE_MAPS_API_KEY is not set");
    return NextResponse.json(placeId ? {} : []);
  }

  if (placeId) {
    try {
      const components = (await detailsNew(placeId)) ?? (await detailsLegacy(placeId));
      if (!components) return NextResponse.json({});
      return NextResponse.json({ address_components: components });
    } catch (e) {
      console.error("[geocode] details threw:", e);
      return NextResponse.json({});
    }
  }

  if (!q || q.trim().length < 3) return NextResponse.json([]);

  try {
    const suggestions = (await autocompleteNew(q)) ?? (await autocompleteLegacy(q));
    return NextResponse.json(suggestions ?? []);
  } catch (e) {
    console.error("[geocode] autocomplete threw:", e);
    return NextResponse.json([]);
  }
}
