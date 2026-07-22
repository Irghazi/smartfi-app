import React from 'react'

export function Card({ children, className = '', ...props }) {
  // Menggunakan p-6 untuk padding minimum 1.5rem
  // Menggunakan bg-surface-white (atau bg-white) dan rounded-xl
  // shadow-corporate merujuk ke shadow-md (didefinisikan di tailwind.config.js)
  return (
    <div 
      className={`bg-surface-white shadow-corporate rounded-xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
