import React, { useEffect } from 'react'
import { Card } from './Card'

export function Modal({ isOpen, onClose, title, children }) {
  // Mencegah scroll pada halaman saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Latar belakang hitam transparan dengan efek buram
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Area klik di luar modal untuk menutup */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      
      {/* Konten Modal */}
      <div className="relative z-10 w-full max-w-lg">
        {/* Wajib menggunakan komponen Card (rounded-xl, p-6, putih) */}
        <Card className="flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between">
            {title && (
              <h2 className="text-xl font-semibold text-text-heading">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="text-text-body hover:text-text-heading transition-colors rounded-lg p-1 hover:bg-background-main focus:outline-none"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mt-2">
            {children}
          </div>
        </Card>
      </div>
    </div>
  )
}
