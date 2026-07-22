import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  try {
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Mencegah error 500 jika variabel lingkungan belum terbaca di Vercel
    if (!supabaseUrl || !supabaseKey) {
      console.error('⚠️ Supabase Environment Variables belum terbaca oleh Middleware!')
      return supabaseResponse
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    const url = request.nextUrl
    const path = url.pathname

    const isAuthPage = path === '/login' || path === '/register'
    const isProtectedPage = path.startsWith('/dashboard')

    if (isAuthPage && user) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isProtectedPage && !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return supabaseResponse

  } catch (error) {
    // Menangkap error apa pun agar tidak merusak halaman web (Mencegah 500)
    console.error('🚨 Middleware Error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}