export const playSound = (soundName) => {
  if (typeof window !== 'undefined') {
    const isMutedAll = localStorage.getItem('smartfi_mute_sound') === 'true';
    if (isMutedAll) return;
    
    if (soundName === 'clicksoundeffect' && localStorage.getItem('smartfi_mute_click') === 'true') return;
    if (soundName === 'chatsoundeffect' && localStorage.getItem('smartfi_mute_ai') === 'true') return;

    try {
      const audio = new Audio(`/sounds/${soundName}.mp3`);
      audio.play().catch((err) => {
        console.warn(`Gagal memutar suara ${soundName}:`, err);
      });
    } catch (error) {
      console.warn('Audio playback is not supported or failed', error);
    }
  }
};
