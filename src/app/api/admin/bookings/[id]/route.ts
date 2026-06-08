import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getServiceClient } from "@/lib/admin";

const ADMIN_EMAIL = "elagerway@gmail.com";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return supabase;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await requireAdmin();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { amount_charged, status, notes, payment_method } = await req.json();

  const updates: Record<string, unknown> = {};
  if (amount_charged !== undefined) updates.amount_charged = amount_charged;
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;
  if (payment_method !== undefined) updates.payment_method = payment_method;

  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // bookings is admin-RLS; use the service client for the mutations (same as
  // the cancel + webhook paths) once the admin session is verified above.
  const supabase = getServiceClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("cal_booking_uid, status")
    .eq("id", id)
    .single();

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  // Cancel the Cal.com appointment first. If that fails, bail out without
  // deleting so we never orphan a live appointment on the calendar. Already
  // cancelled bookings (kept in sync by /api/webhooks/cal) skip this.
  if (booking.cal_booking_uid && booking.status !== "cancelled") {
    const res = await fetch(`https://api.cal.com/v2/bookings/${booking.cal_booking_uid}/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CAL_API_KEY}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancellationReason: "Deleted by admin" }),
    });
    if (!res.ok) {
      console.error(`[bookings/${id}] Cal cancel failed:`, res.status, await res.text().catch(() => ""));
      return NextResponse.json(
        { error: "Couldn't cancel the Cal.com appointment — job not deleted. Cancel it in Cal.com, then try again." },
        { status: 502 },
      );
    }
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
