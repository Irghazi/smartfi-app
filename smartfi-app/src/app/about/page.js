import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PlayCircle, Rocket } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-black overflow-x-hidden bg-[#e6f0ff] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]">
      
      {/* Navbar Minimalis */}
      <nav className="p-4 md:px-10 md:py-6 flex justify-between items-center z-50">
        <Link href="/">
          <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black text-xl px-4 py-2 flex items-center gap-2 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <ArrowLeft strokeWidth={3} size={20} /> Kembali
          </div>
        </Link>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col items-center justify-center text-center z-10">
        <h1 className="text-4xl md:text-6xl font-black uppercase mb-6 bg-yellow-300 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 inline-block transform -rotate-2">
          Demo SmartFi
        </h1>
        
        <p className="text-lg md:text-xl font-medium max-w-3xl mb-12 bg-white/90 border-2 border-black p-4 mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Lihat bagaimana AI kami bekerja menganalisis pengeluaranmu dalam hitungan detik. SmartFi dirancang agar mencatat keuangan tidak lagi membosankan.
        </p>

        {/* Placeholder Video Demo */}
        <div className="w-full max-w-3xl mx-auto aspect-video bg-black rounded-sm border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center relative group overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="absolute inset-0 bg-blue-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="bg-white border-4 border-black rounded-full p-4 z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">
            <PlayCircle size={48} strokeWidth={2.5} className="text-black" />
          </div>
          <p className="absolute bottom-6 font-bold text-white tracking-widest uppercase z-10 text-sm md:text-base">
            Putar Video Demo
          </p>
        </div>

        <div className="mt-16 mb-10">
          <Link 
            href="/register" 
            className="bg-blue-500 text-white font-black text-xl md:text-2xl px-10 py-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-y-2 active:translate-x-2 active:shadow-none transition-all inline-block"
          >
            <span className="flex items-center justify-center gap-2">COBA SEKARANG JUGA <Rocket size={24} strokeWidth={3} /></span>
          </Link>
        </div>
      </main>

    </div>
  );
}
