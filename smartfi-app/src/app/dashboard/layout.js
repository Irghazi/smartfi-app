'use client'

import React, { useState, useEffect } from 'react'
import { Sidebar } from '../../components/layout/Sidebar'
import { Header } from '../../components/layout/Header'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true)
    }
  }, [])

  return (
    <div className="flex min-h-screen font-sans bg-[#e6f0ff] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* Sidebar - Position is fixed inside the component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Spacer for desktop sidebar */}
      <div className={`hidden md:block shrink-0 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'}`} />

      {/* Kontainer Utama */}
      <div className="flex-1 flex flex-col min-w-0 max-w-full transition-all duration-300">
        {/* Header di bagian atas area konten utama */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Area Konten Utama */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
