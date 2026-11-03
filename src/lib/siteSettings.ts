import { getServiceClient } from "@/lib/admin";

// Admin-controlled switches stored in the site_settings table (server-only).

/** Whether the site is taking new bookings. A missing row means yes, so the
 *  default is the business running normally. */
export async function getBookingsEnabled(): Promise<boolean> {
  const { data, error } = await getServiceClient()
    .from("site_settings")
    .select("value")
    .eq("key", "bookings_enabled")
    .maybeSingle();
  if (error) console.error("[siteSettings] read failed:", error.message);
  return data?.value !== false;
}

export async function setBookingsEnabled(enabled: boolean) {
  return getServiceClient()
    .from("site_settings")
    .upsert({ key: "bookings_enabled", value: enabled, updated_at: new Date().toISOString() });
}

export const BOOKINGS_PAUSED_MESSAGE =
  "We're not taking new bookings right now. Please call or text 604-210-8180 with any questions.";
