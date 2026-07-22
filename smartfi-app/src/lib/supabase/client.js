import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for the browser environment.
 * Digunakan untuk mengambil environment variables di client-side (komponen browser).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
