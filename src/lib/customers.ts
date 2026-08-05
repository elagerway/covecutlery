import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePhone } from "@/lib/format";

/** Booking-derived customer details. Any field may be missing or blank. */
export interface CustomerFromBooking {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

/** Match on phone without assuming uniqueness — customers.phone has no unique index and
 *  30 numbers already appear on two rows (2026-04-09 bulk import). `.maybeSingle()` here
 *  would return PGRST116 ("The result contains 2 rows") rather than a row, silently
 *  aborting the sync for exactly those customers. Oldest row wins, so repeat bookings
 *  keep landing on the same record. */
async function findByPhone(supabase: SupabaseClient, phone: string) {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, email, address, phone")
    .eq("phone", phone)
    .order("created_at", { ascending: true })
    .limit(1);
  return { row: data?.[0] ?? null, error };
}

/** Bookings created customers exactly once — a bulk import on 2026-04-09 — and never
 *  again, so every booking since then left the admin customer list untouched. Both write
 *  paths (/api/cal/book for the widget, /api/webhooks/cal for native Cal-page bookings)
 *  call this so a booking always produces a customer.
 *
 *  customers.email is unique (a conflicting write returns 409), so this matches-then-writes
 *  rather than upserting, mirroring /api/admin/customers. A race between two bookings for a
 *  new email can still lose that insert — it's logged, not thrown: a customer-sync failure
 *  must not fail a booking that Cal.com has already confirmed.
 */
export async function upsertCustomerFromBooking(
  supabase: SupabaseClient,
  details: CustomerFromBooking
): Promise<void> {
  const email = details.email?.trim().toLowerCase() || null;
  // Both callers must agree on format or they'll fight over the column: /api/cal/book
  // sends E.164 while the webhook forwards whatever Cal.com stored, and for a widget
  // booking both run. Normalizing here keeps the table consistent either way.
  const phone = normalizePhone(details.phone) || null;
  const name = details.name?.trim() || null;
  const address = details.address?.trim() || null;

  // Without an identifier we'd insert a duplicate on every booking.
  if (!email && !phone) return;

  try {
    let existing: { id: string; name?: string | null; email?: string | null; address?: string | null } | null = null;

    if (email) {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email, address")
        .eq("email", email)
        .maybeSingle();
      if (error) {
        console.error("[customers] email lookup failed:", error.message);
        return;
      }
      existing = data;
    }

    // An email miss doesn't mean a new person: 406 of 495 customers have no email at all
    // (bulk import), so matching on phone too is what stops a repeat booker from getting
    // a second row.
    if (!existing && phone) {
      const { row, error } = await findByPhone(supabase, phone);
      if (error) {
        console.error("[customers] phone lookup failed:", error.message);
        return;
      }
      existing = row;
    }

    const now = new Date().toISOString();

    if (existing) {
      // Only fill gaps — never overwrite good data with a blank or a placeholder name.
      const patch: Record<string, unknown> = { updated_at: now };
      if (name && name !== "Unknown" && (!existing.name || existing.name === "Unknown")) patch.name = name;
      if (email && !existing.email) patch.email = email;
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
