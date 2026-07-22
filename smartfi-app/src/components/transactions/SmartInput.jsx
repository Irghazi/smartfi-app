'use client'

import React, { useState } from 'react'
import { playSound } from '@/utils/playSound'

export function SmartInput({ onTransactionAdded, categoriesList = [] }) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleProcessAI = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setError('')
    setPreview(null)

    try {
      const categoryInstruction = categoriesList.length > 0 
        ? `\n\nKamu harus memilih properti 'kategori' HANYA dari daftar berikut yang paling relevan dengan deskripsi: [${categoriesList.join(', ')}]. Jangan gunakan bahasa Inggris atau kata lain di luar daftar ini.`
        : '';
        
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt + categoryInstruction })
      })
      
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal memproses bahasa dengan AI')
      
      setPreview(data)
      playSound('chatsoundeffect');
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!preview) return
    setIsSaving(true)
    setError('')

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: preview.type,
          category: preview.category,
          amount: preview.amount || preview.nominal,
          description: preview.description,
          created_at: preview.date || new Date().toISOString()
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Gagal menyimpan transaksi ke database')
      }

      // Berhasil, reset form
      setPrompt('')
      setPreview(null)
      alert('Transaksi berhasil disimpan secara cerdas!')
      
      if (onTransactionAdded) onTransactionAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="font-bold text-black text-xl uppercase">Smart Input AI</h3>
      <p className="text-sm text-black font-bold -mt-2 mb-2">Tuliskan transaksi Anda secara alami, biarkan AI yang mencatat.</p>
      
      <textarea
        className="w-full p-4 border-2 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none min-h-[120px] text-black font-medium"
        placeholder="Contoh: Makan siang di warteg habis 25 ribu..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      
      {error && (
        <div className="text-sm font-bold text-white bg-red-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleProcessAI} 
        disabled={isLoading || !prompt.trim()}
        className={`flex items-center justify-center gap-2 border-2 border-black transition-all ${
          !prompt.trim()
            ? 'w-full py-3 mt-4 font-bold bg-gray-300 text-gray-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-not-allowed'
            : 'w-full py-3 mt-4 font-bold bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer'
        }`}
      >
        {isLoading ? 'AI sedang membaca pikiran Anda...' : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
            PROSES DENGAN AI
          </>
        )}
      </button>

      {/* Pratinjau Form yang dihasilkan AI */}
      {preview && (
        <div className="mt-4 border-t-4 border-black pt-6 flex flex-col gap-5">
          <h4 className="font-bold text-black text-sm uppercase tracking-wider flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            Pratinjau Hasil
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-bold text-black text-sm">Tipe Transaksi</label>
              <input 
                type="text"
                value={preview.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} 
                readOnly 
                className="w-full p-3 border-2 border-black bg-gray-200 text-gray-500 font-bold focus:outline-none"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-black text-sm">Kategori</label>
              <input 
                type="text"
                value={preview.category} 
                onChange={(e) => setPreview({...preview, category: e.target.value})}
                className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white text-black font-medium"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-black text-sm">Nominal (Rp)</label>
              <input 
                type="number"
                value={preview.amount || preview.nominal || ''} 
                onChange={(e) => setPreview({...preview, amount: Number(e.target.value)})}
                className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white text-black font-medium"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-black text-sm">Deskripsi Transaksi</label>
              <input 
                type="text"
                value={preview.description} 
                onChange={(e) => setPreview({...preview, description: e.target.value})}
                className="w-full p-3 border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white text-black font-medium"
              />
            </div>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full py-3 mt-4 font-bold bg-green-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed uppercase"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </div>
      )}
    </div>
  )
}
