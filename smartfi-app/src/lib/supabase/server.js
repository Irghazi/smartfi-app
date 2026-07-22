import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for the server environment.
 * Digunakan untuk Server Components, Server Actions, dan API routes di Next.js 14.
 * Fungsi ini menangani cookies dan mengelola session dengan aman.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // Error ini dapat diabaikan jika `setAll` dipanggil dari Server Component
            // Middleware sebaiknya menangani refreshing user session.
          }
        },
      },
    }
  )
}
