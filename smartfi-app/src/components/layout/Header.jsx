'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export function Header({ onMenuClick }) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    supabase.auth.getUser()
      .then(({ data, error }) => {
        if (!error && data?.user) {
          const metadata = data.user.user_metadata
          setAvatarUrl(metadata?.avatar_url || metadata?.picture || null)
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch user in Header:', err.message)
      })
  }, [])

  return (
    <header className="sticky top-0 z-30 bg-white px-6 py-4 flex items-center justify-between border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Tombol menu hamburger selalu di kiri */}
      <button 
        onClick={onMenuClick}
        className="text-black bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </button>

      {/* Konten Kanan (hanya Notif & Profile) */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Ikon Lonceng */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="text-black bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all relative flex items-center justify-center" 
            aria-label="Notifikasi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-none border-2 border-black"></span>
          </button>
          
          {/* Dropdown Notifikasi */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-4 w-64 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 z-50">
              <p className="text-black font-bold text-sm text-center">Belum ada notifikasi baru saat ini.</p>
            </div>
          )}
        </div>

        {/* Avatar Pengguna */}
        <Link 
          href="/dashboard/settings" 
          className="w-11 h-11 bg-blue-300 text-black flex items-center justify-center font-bold text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all overflow-hidden"
          title="Pengaturan Akun"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span>US</span>
          )}
        </Link>
      </div>
    </header>
  )
}
