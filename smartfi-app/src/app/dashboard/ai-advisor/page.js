'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';
import { Trash2, RefreshCw, Send, Bot } from 'lucide-react';
import { playSound } from '@/utils/playSound';

export default function AIAdvisorPage() {
  const supabase = createClient();
  const [isMounted, setIsMounted] = useState(false);
  
  const initialGreeting = [
    { 
      id: 1, 
      role: 'ai', 
      content: 'Halo! Saya SmartFi, Mentor Keuangan Pribadimu. Apa yang ingin kamu ketahui? Kamu bisa bertanya tentang pengeluaran terbesar, saran hemat, atau ringkasan bulan ini.' 
    }
  ];

  const [messages, setMessages] = useState(initialGreeting);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('smartfi_ai_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing chat history', e);
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isMounted]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('smartfi_ai_chat', JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: txs, error } = await supabase
          .from('transactions')
          .select('id, type, amount, category, description, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (txs) {
          const inc = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
          const exp = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
          const totalSaldo = inc - exp;
          
          // Ambil 15-20 transaksi terakhir agar token tidak bengkak
          const recentTransactions = txs.slice(0, 15);

          setUserData({ saldo_terkini: totalSaldo, transaksi_terbaru: recentTransactions });
        }
      } catch (err) {
        console.error('Error fetching user data for AI:', err);
      }
    };

    fetchUserData();
  }, []);

  // Fungsi pengiriman utama yang dapat dipanggil dari form manual atau klik tombol pintasan
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text
    };

    // Ambil histori pesan sebelumnya sebelum pesan baru ditambahkan ke state
    const currentHistory = [...messages];

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: currentHistory, // Kirim histori sebelumnya agar tidak dobel
          userData: userData 
        })
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil balasan dari server');
      }

      const data = await response.json();
      
      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.reply
      };
      
      setMessages(prev => [...prev, aiMsg]);
      playSound('chatsoundeffect');
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'Terjadi kesalahan saat menghubungi server AI.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  const handleClearChat = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat obrolan?')) {
      setMessages(initialGreeting);
      localStorage.setItem('smartfi_ai_chat', JSON.stringify(initialGreeting));
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (isLoading || messages.length === 0) return;

    // Cari indeks pesan user terakhir
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const userMsgToResend = messages[lastUserIndex].content;
    const historyUpToUserMsg = messages.slice(0, lastUserIndex + 1);
    
    setMessages(historyUpToUserMsg);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsgToResend, 
          history: historyUpToUserMsg, 
          userData: userData 
        })
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil balasan dari server');
      }

      const data = await response.json();
      
      const aiMsg = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: data.reply
      };
      
      setMessages(prev => [...prev, aiMsg]);
      playSound('chatsoundeffect');
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'ai',
        content: 'Terjadi kesalahan saat menghubungi server AI.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshChat = async () => {
    // Cari indeks pesan terakhir dari user
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const textPesanUser = messages[lastUserIndex].content;
    const newHistory = messages.slice(0, lastUserIndex + 1);
    
    // Tambahkan pesan AI kosong agar animasi bubble loading muncul
    const loadingAiMsg = { id: crypto.randomUUID(), role: 'ai', content: '' };
    setMessages([...newHistory, loadingAiMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textPesanUser, 
          history: newHistory, 
          userData: userData 
        })
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil balasan dari server');
      }

      const data = await response.json();
      
      // Update pesan kosong dengan balasan asli
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: data.reply
        };
        return updated;
      });
      playSound('chatsoundeffect');
    } catch (error) {
      console.error(error);
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: 'Terjadi kesalahan saat memuat ulang.'
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-auto -mt-4 -mx-4 sm:-mt-8 sm:-mx-8 border-l-4 border-r-4 border-black bg-white">
      {/* Header Terintegrasi */}
      <div className="bg-white border-b-4 border-black p-4 px-6 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hidden sm:flex items-center justify-center flex-shrink-0">
            <Bot size={24} strokeWidth={2.5} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black uppercase tracking-tight">Penasihat AI</h1>
            <p className="text-sm font-bold text-black mt-1 uppercase tracking-wider">Selalu siap membantu keuanganmu</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={handleRefreshChat}
            disabled={messages.length <= 1} // Nonaktif jika hanya ada salam
            className="bg-white text-black font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed"
            title="Muat Ulang Permintaan Terakhir"
          >
            <RefreshCw size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Muat Ulang</span>
          </button>
          <button 
            onClick={handleClearChat}
            className="bg-red-400 text-black font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-2"
            title="Hapus Obrolan"
          >
            <Trash2 size={18} strokeWidth={2.5} />
            <span className="hidden sm:inline">Hapus Obrolan</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      {!isMounted ? (
        <div className="flex-1 p-4 flex items-center justify-center opacity-50 bg-[#e6f0ff] font-bold text-black uppercase tracking-widest">
          Memuat obrolan...
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#e6f0ff] w-full border-b-4 border-black">
          {messages.map((msg, index) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-row gap-4 max-w-[90%] sm:max-w-[80%]">
                
                {/* AI Avatar */}
                {msg.role === 'ai' && (
                  <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden mt-1">
                    <Image src="/images/icon-192x192.png" alt="SmartFi" width={32} height={32} className="object-contain p-1" />
                  </div>
                )}
                
                {/* Message Content Area */}
                <div className="flex flex-col">
                  {/* Message Bubble */}
                  <div className={`px-6 py-4 text-base font-bold leading-relaxed border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    msg.role === 'user' 
                      ? 'bg-yellow-300 text-black' 
                      : 'bg-white text-black'
                  }`}>
                    {msg.content.trim() === '' ? (
                      <div className="flex space-x-2 items-center h-6">
                        <div className="w-3 h-3 bg-black border border-black animate-bounce"></div>
                        <div className="w-3 h-3 bg-black border border-black animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-black border border-black animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="mb-3 last:mb-0 whitespace-pre-wrap" {...props} />,
                          strong: ({node, ...props}) => <span className="font-extrabold text-black uppercase" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 my-3 border-l-4 border-black" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-3 border-l-4 border-black" {...props} />,
                          li: ({node, ...props}) => <li className="mb-2 pl-2" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-black bg-gray-200 p-3 italic my-3" {...props} />,
                          code: ({inline, node, ...props}) => inline ? <code className="bg-gray-200 border-2 border-black px-1.5 py-0.5 text-sm" {...props} /> : <pre className="bg-gray-200 border-2 border-black p-4 overflow-x-auto my-3 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><code {...props} /></pre>
                        }}
                      >
                        {msg.content ? msg.content.replace(/[\uFFFD\u25AF\u25A0-\u25FF\u200B\u200C\u200D\uFEFF]/g, '').trim() : ''}
                      </ReactMarkdown>
                    )}
                  </div>
                  
                  {/* Regenerate Button */}
                  {msg.role === 'ai' && index === messages.length - 1 && !isLoading && msg.content.trim() !== '' && (
                    <button 
                      onClick={handleRegenerate}
                      className="text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none text-xs font-bold uppercase mt-3 px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-all self-start"
                    >
                      <RefreshCw size={14} strokeWidth={3} />
                      Muat Ulang Respon
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role !== 'ai' && (
            <div className="flex justify-start">
              <div className="flex flex-row gap-4 max-w-[90%] sm:max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden mt-1">
                  <Image src="/images/icon-192x192.png" alt="SmartFi" width={32} height={32} className="object-contain p-1" />
                </div>
                <div className="bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-4 flex items-center gap-2 h-14">
                  <span className="w-3 h-3 bg-black border border-black animate-bounce"></span>
                  <span className="w-3 h-3 bg-black border border-black animate-bounce delay-75"></span>
                  <span className="w-3 h-3 bg-black border border-black animate-bounce delay-150"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Bottom Input Section */}
      <div className="p-4 sm:p-6 bg-white z-10 flex-shrink-0 flex flex-col gap-4">
        
        {/* Suggestion Pills */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => handleSuggestionClick('Analisis Otomatis')} 
            disabled={isLoading}
            className="bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-xs px-4 py-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analisis Otomatis
          </button>
          <button 
            onClick={() => handleSuggestionClick('Pengeluaran Terbesar')} 
            disabled={isLoading}
            className="bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-xs px-4 py-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pengeluaran Terbesar
          </button>
          <button 
            onClick={() => handleSuggestionClick('Saran Hemat')} 
            disabled={isLoading}
            className="bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold uppercase text-xs px-4 py-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Saran Hemat
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="relative flex gap-3 items-stretch w-full">
          <input
            type="text"
            placeholder="Ketik pertanyaan Anda..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-white text-black font-bold text-base px-6 py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-300 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed"
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || isLoading}
            className="bg-blue-500 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center justify-center hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={24} strokeWidth={2.5} className="ml-1" />
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-black font-bold text-center uppercase tracking-widest mt-1">SmartFi AI dapat membuat kesalahan. Harap verifikasi informasi penting.</p>
      </div>

    </div>
  );
}
