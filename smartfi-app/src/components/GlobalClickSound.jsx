'use client';

import { useEffect } from 'react';
import { playSound } from '@/utils/playSound';

export default function GlobalClickSound() {
  useEffect(() => {
    const handleClick = (e) => {
      // Periksa apakah elemen yang diklik adalah tombol atau link (atau ada di dalamnya)
      const isClickable = e.target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
      if (isClickable) {
        playSound('clicksoundeffect');
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return null; // Komponen ini tidak me-render UI apapun
}
