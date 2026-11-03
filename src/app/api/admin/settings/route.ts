import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { getBookingsEnabled, setBookingsEnabled } from "@/lib/siteSettings";

// GET /api/admin/settings
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ bookings_enabled: await getBookingsEnabled() });
}

// PUT /api/admin/settings — { bookings_enabled: boolean }
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bookings_enabled } = await req.json();
  if (typeof bookings_enabled !== "boolean") {
    return NextResponse.json({ error: "bookings_enabled must be true or false" }, { status: 400 });
  }

  const { error } = await setBookingsEnabled(bookings_enabled);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bookings_enabled });
}
