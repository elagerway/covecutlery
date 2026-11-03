import { NextResponse } from "next/server";
import { getBookingsEnabled } from "@/lib/siteSettings";

// GET /api/settings/bookings — public; the site hides booking buttons when false.
export async function GET() {
  return NextResponse.json(
    { enabled: await getBookingsEnabled() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
