/**
 * App-level credential storage in Supabase.
 *
 * Used for credentials that need runtime mutation — primarily self-rotating
 * OAuth tokens like the Instagram Graph API long-lived token (60-day expiry,
 * refreshed by /api/cron/refresh-instagram-token).
 *
 * Reads with env-var fallback so the app keeps working during the initial
 * seed window before the row is inserted, and during any Supabase outage.
 */

import { createClient } from "@supabase/supabase-js";

export interface AppCredential {
  name: string;
  value: string;
  expires_at: string | null;
  updated_at: string;
}

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * Fetch a credential by name. Returns null if missing or on error.
 * Callers should fall back to an env var if they have one.
 */
export async function getCredential(name: string): Promise<AppCredential | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_credentials")
    .select("name, value, expires_at, updated_at")
    .eq("name", name)
    .maybeSingle();
  if (error) {
    console.error(`[credentials] read failed for ${name}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Upsert a credential. Returns the new row, or null on error.
 */
export async function setCredential(
  name: string,
  value: string,
  expiresAt: string | null = null,
): Promise<AppCredential | null> {
  const supabase = getServiceClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("app_credentials")
    .upsert(
      {
        name,
        value,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "name" },
    )
    .select()
    .single();
  if (error) {
    console.error(`[credentials] upsert failed for ${name}:`, error.message);
    return null;
  }
  return data;
}
