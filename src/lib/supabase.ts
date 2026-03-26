import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

/**
 * Returns a Supabase anon client, or null when env vars are missing
 * (e.g. Vercel preview builds without NEXT_PUBLIC_SUPABASE_URL).
 */
export function getSupabase(): SupabaseClient | null {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return null
    _supabase = createClient(url, key)
  }
  return _supabase
}
