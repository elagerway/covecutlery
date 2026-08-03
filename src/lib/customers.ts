import type { SupabaseClient } from "@supabase/supabase-js";

/** Booking-derived customer details. Any field may be missing or blank. */
export interface CustomerFromBooking {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

/** Bookings created customers exactly once — a bulk import on 2026-04-09 — and never
 *  again, so every booking since then left the admin customer list untouched. Both write
 *  paths (/api/cal/book for the widget, /api/webhooks/cal for native Cal-page bookings)
 *  call this so a booking always produces a customer.
 *
 *  There is no unique constraint on customers.email, so this matches-then-writes rather
 *  than upserting, mirroring /api/admin/customers. Never throws: a customer-sync failure
 *  must not fail a booking that Cal.com has already confirmed.
 */
export async function upsertCustomerFromBooking(
  supabase: SupabaseClient,
  details: CustomerFromBooking
): Promise<void> {
  const email = details.email?.trim().toLowerCase() || null;
  const phone = details.phone?.trim() || null;
  const name = details.name?.trim() || null;
  const address = details.address?.trim() || null;

  // Without an identifier we'd insert a duplicate on every booking.
  if (!email && !phone) return;

  try {
    // Prefer email as the identity; fall back to phone for Cal bookings that omit it.
    const query = supabase.from("customers").select("id, name, address");
    const { data: existing, error: lookupError } = email
      ? await query.eq("email", email).maybeSingle()
      : await query.eq("phone", phone!).maybeSingle();

    if (lookupError) {
      console.error("[customers] lookup failed:", lookupError.message);
      return;
    }

    const now = new Date().toISOString();

    if (existing) {
      // Only fill gaps — never overwrite good data with a blank or a placeholder name.
      const patch: Record<string, unknown> = { updated_at: now };
      if (name && name !== "Unknown" && (!existing.name || existing.name === "Unknown")) patch.name = name;
      if (phone) patch.phone = phone;
      if (address && !existing.address) patch.address = address;

      const { error } = await supabase.from("customers").update(patch).eq("id", existing.id);
      if (error) console.error("[customers] update failed:", error.message);
      return;
    }

    const { error } = await supabase.from("customers").insert({
      name: name || "Unknown",
      email,
      phone,
      address,
      source: "cal.com",
      updated_at: now,
    });
    if (error) console.error("[customers] insert failed:", error.message);
  } catch (e) {
    console.error("[customers] upsert threw:", e);
  }
}
