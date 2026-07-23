'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { createClient } from '../../../lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFormFilled = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    // [HACK BUST CACHE]: Hapus Service Worker PWA sebelum pindah ke Google
    // Ini memastikan saat user dilempar balik dari Google, browser akan
    // memuat ulang halaman dari server, bukan dari versi lama yang nyangkut.
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for(let registration of registrations) {
          registration.unregister()
        }
      })
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Container Logo Neobrutalism */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white dark:bg-zinc-700 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center overflow-hidden">
            <Image 
              src="/images/icon-192x192.png" 
              alt="SmartFi Logo" 
              width={100}
              height={100}
              priority
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Selamat Datang Kembali</h1>
          <p className="text-black dark:text-gray-300 font-medium">Kelola finansial Anda dengan cerdas</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-black dark:text-white">Email</label>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-black dark:border-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-shadow bg-white dark:bg-zinc-700 text-black dark:text-white font-medium"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-black dark:text-white">Kata Sandi</label>
            <input
              type="password"
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-black dark:border-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-shadow bg-white dark:bg-zinc-700 text-black dark:text-white font-medium"
            />
          </div>

          {error && (
            <div className="text-sm font-bold text-white bg-red-500 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] p-3">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || !isFormFilled} 
            className={`w-full py-3 px-4 font-bold border-2 border-black dark:border-white transition-all ${
              isFormFilled 
                ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none cursor-pointer' 
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t-2 border-black dark:border-white"></div>
          <span className="px-4 text-sm font-bold text-black dark:text-white uppercase">atau</span>
          <div className="flex-1 border-t-2 border-black dark:border-white"></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-zinc-700 font-bold text-black dark:text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Login dengan Google
        </button>

        <div className="mt-8 text-center text-sm font-bold">
          <span className="text-black dark:text-gray-300">Belum punya akun? </span>
          <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-4 decoration-2 transition-colors">
            Ayo daftar
          </Link>
        </div>
      </div>
    </div>
  )
}
