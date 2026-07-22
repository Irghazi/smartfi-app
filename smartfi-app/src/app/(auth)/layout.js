import React from 'react'

export const metadata = {
  title: 'Autentikasi - SmartFi',
  description: 'Login atau mendaftar ke SmartFi',
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#e6f0ff] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] flex flex-col">
      <main className="w-full flex-1 flex flex-col relative z-10">
        {children}
      </main>
      <footer className="py-4 text-center text-sm font-bold text-black border-t-2 border-black bg-white shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)] relative z-20">
        &copy; 2026 SmartFi. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  )
}
