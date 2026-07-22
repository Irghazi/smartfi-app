'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { createClient } from '../../../lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isFormFilled = email.trim().length > 0 && password.trim().length > 0;

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!isFormFilled) return;
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        throw error
      }
      
      if (data?.user && data?.session === null) {
        setSuccess('Pendaftaran berhasil! Silakan periksa email Anda untuk verifikasi.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mendaftar.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* Container Logo Neobrutalism */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
            <Image 
              src="/images/icon-192x192.png" 
              alt="SmartFi Logo" 
              width={100}
              height={100}
              priority
              className="w-14 h-14 object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold text-black mb-2">Buat Akun Baru</h1>
          <p className="text-black font-medium">Ayo daftar dan kelola finansial Anda dengan cerdas</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-black">Email</label>
            <input
              type="email"
              placeholder="Masukkan email aktif Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white text-black font-medium"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-bold text-black">Kata Sandi</label>
            <input
              type="password"
              placeholder="Buat kata sandi baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white text-black font-medium"
            />
          </div>

          {error && (
            <div className="text-sm font-bold text-white bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm font-bold text-white bg-green-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
              {success}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!isFormFilled || isLoading} 
            className={`w-full py-3 px-4 font-bold border-2 border-black transition-all ${
              isFormFilled 
                ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer' 
                : 'bg-gray-300 text-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold">
          <span className="text-black">Sudah punya akun? </span>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 underline underline-offset-4 decoration-2 transition-colors">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  )
}
