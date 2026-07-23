'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-zinc-800 dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
        {/* Placeholder */}
      </div>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-10 h-10 border-2 border-black bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                 dark:bg-zinc-800 dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:text-white
                 flex items-center justify-center
                 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]
                 active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none
                 transition-all"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={20} strokeWidth={2.5} />
      ) : (
        <Moon size={20} strokeWidth={2.5} className="text-black" />
      )}
    </button>
  )
}
