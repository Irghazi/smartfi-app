"use client";

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("Browser Anda belum siap untuk instalasi (mungkin aplikasi sudah terinstal atau Anda menggunakan browser iOS/Safari yang memerlukan instalasi manual via menu 'Add to Home Screen').");
      return;
    }
    
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };


  return (
    <button 
      onClick={handleInstallClick}
      className={`border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all px-4 py-2 font-bold flex items-center gap-2 text-black ${
        isInstallable ? 'bg-yellow-300 cursor-pointer' : 'bg-gray-200 cursor-not-allowed opacity-80'
      }`}
    >
      <Download size={20} />
      {isInstallable ? 'Install App' : 'App Terinstal'}
    </button>
  );
}
