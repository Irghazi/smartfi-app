import React from 'react';
import Link from 'next/link';
import { Smartphone, Rocket, Lightbulb, Bot, Zap, Lock } from 'lucide-react';
import InstallButton from '../components/InstallButton';

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-black overflow-x-hidden bg-[#e6f0ff] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]">
      
      {/* Navbar (Atas) */}
      <nav className="p-4 md:px-10 md:py-6 flex justify-between items-center z-50">
        <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl px-4 py-2">
          SmartFi
        </div>
        <div className="flex gap-4">
          <InstallButton />
          <Link 
            href="/login" 
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all px-4 py-2 font-bold"
          >
            Masuk
          </Link>
          <Link 
            href="/register" 
            className="bg-blue-100 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all px-4 py-2 font-bold"
          >
            Daftar
          </Link>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 z-10">
        <div className="absolute top-10 md:top-20 transform -rotate-3 bg-yellow-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-1 font-bold text-sm mb-6">
          <Smartphone className="inline-block mr-1 -mt-1" size={18} strokeWidth={3} /> Tersedia sebagai PWA!
        </div>

        <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 max-w-4xl leading-tight mt-10">
          KELOLA UANG TANPA PUSING.
        </h1>

        <p className="text-lg md:text-xl font-medium max-w-2xl mb-10 bg-white/90 border-2 border-black p-3 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Mengelola keuangan seringkali terasa seperti beban. SmartFi mengubah hal itu. Kami menggabungkan pencatatan super cepat dengan kecerdasan AI untuk menganalisis pola pengeluaranmu. Temukan celah pemborosan, terima saran penghematan proaktif, dan capai target finansialmu lebih cepat. Solusi cerdas untuk keuangan yang bebas stres.
        </p>

        <Link 
          href="/register" 
          className="bg-blue-500 text-white font-black text-xl md:text-2xl px-10 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          <span className="flex items-center justify-center gap-2">MULAI SEKARANG <Rocket size={24} strokeWidth={3} /></span>
        </Link>

        {/* Dekorasi Neobrutalism */}
        <div className="absolute left-10 bottom-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-3 w-64 hidden lg:flex flex-col gap-2 z-0">
          <span className="font-bold text-sm">Sisa Budget Hiburan: Rp 50.000</span>
          <div className="bg-red-400 border-2 border-black h-4 w-full"></div>
        </div>
        
        <div className="absolute right-10 top-32 bg-blue-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-6 w-56 hidden lg:flex flex-col z-0">
          <span className="font-bold flex items-center gap-2">AI Insight <Lightbulb size={20} strokeWidth={3} /></span>
          <span className="text-sm mt-1">Bulan ini kamu hemat 20%!</span>
        </div>
      </section>

      {/* SECTION 2: Fitur Unggulan (Bento Grid) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 z-10">
        <h2 className="text-4xl font-black mb-10 uppercase text-center">Bukan Sekadar Catatan Kas.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-100 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h3 className="font-black text-2xl mb-4 flex items-center gap-2"><Bot size={32} strokeWidth={3} /> Penasihat AI Pribadi</h3>
            <p className="font-medium text-lg">Analisis instan dan saran penghematan otomatis berdasarkan pola pengeluaran unikmu.</p>
          </div>
          <div className="bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h3 className="font-black text-2xl mb-4 flex items-center gap-2"><Zap size={32} strokeWidth={3} /> Pencatatan Kilat</h3>
            <p className="font-medium text-lg">Catat transaksi dalam hitungan detik. Pantau saldo secara real-time tanpa UI yang membingungkan.</p>
          </div>
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
            <h3 className="font-black text-2xl mb-4 flex items-center gap-2"><Lock size={32} strokeWidth={3} /> Akses Di Mana Saja</h3>
            <p className="font-medium text-lg">Teknologi PWA memungkinkan SmartFi diinstal langsung ke HP-mu dengan kecepatan dan keamanan tingkat tinggi.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Value Proposition */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 mb-20 z-10">
        <div className="bg-green-200 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-4 uppercase">Mengapa Klien & Pebisnis Memilih Kami?</h3>
            <p className="font-medium text-lg">
              SmartFi memangkas waktu rekonsiliasi data hingga 70% dan mencegah pengeluaran impulsif melalui insight berbasis AI. Solusi cerdas untuk keuangan personal maupun operasional mikro.
            </p>
          </div>
          <Link 
            href="/about" 
            className="bg-black text-white font-bold px-8 py-4 border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition-all flex-shrink-0"
          >
            Lihat Demo
          </Link>
        </div>
      </section>

      {/* SECTION 4: Footer */}
      <footer className="w-full border-t-4 border-black bg-white py-20 px-4 text-center flex flex-col items-center justify-center z-10 relative">
        <h2 className="text-4xl md:text-5xl font-black uppercase mb-8">Siap Mengambil Kendali?</h2>
        <Link 
          href="/register" 
          className="bg-blue-500 text-white font-black text-xl md:text-2xl px-10 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all"
        >
          <span className="flex items-center justify-center gap-2">MULAI SEKARANG <Rocket size={24} strokeWidth={3} /></span>
        </Link>
        <p className="mt-10 font-bold text-sm">© 2026 SmartFi. All rights reserved.</p>
      </footer>

    </div>
  );
}
