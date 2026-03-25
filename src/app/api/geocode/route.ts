import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const placeId = req.nextUrl.searchParams.get("place_id");

  if (placeId) {
    // Place details — return structured address components
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=address_components,geometry&key=${KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return NextResponse.json(data.result ?? {});
    } catch {
      return NextResponse.json({}, { status: 200 });
    }
  }

  if (!q || q.trim().length < 3) return NextResponse.json([]);

  // Autocomplete — restrict to Canada
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&components=country:ca&types=address&key=${KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data.predictions ?? []);
  } catch {
    return NextResponse.json([]);
  }
}
