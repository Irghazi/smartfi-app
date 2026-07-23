'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Target, Bell, Wallet, CreditCard, AlertTriangle, Monitor } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState(null);

  // States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [savingsTarget, setSavingsTarget] = useState('');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [isReminderActive, setIsReminderActive] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [newBalanceInput, setNewBalanceInput] = useState('');
  const [deleteRange, setDeleteRange] = useState('all');
  const [isClickMuted, setIsClickMuted] = useState(false);
  const [isAiMuted, setIsAiMuted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isSavingBalance, setIsSavingBalance] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || '');
        setFullName(user.user_metadata?.full_name || '');
        setSavingsTarget(user.user_metadata?.target_tabungan || '');
        setReminderTime(user.user_metadata?.waktu_pengingat || '08:00');
        setIsReminderActive(user.user_metadata?.status_pengingat || false);

        // Fetch Balance
        const { data: txs, error } = await supabase
          .from('transactions')
          .select('type, amount')
          .eq('user_id', user.id);

        if (!error && txs) {
          const inc = txs.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
          const exp = txs.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
          setCurrentBalance(inc - exp);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [supabase]);

  useEffect(() => {
    const legacyMute = localStorage.getItem('smartfi_mute_sound') === 'true';
    if (legacyMute) {
      setIsClickMuted(true);
      setIsAiMuted(true);
      localStorage.setItem('smartfi_mute_click', 'true');
      localStorage.setItem('smartfi_mute_ai', 'true');
      localStorage.removeItem('smartfi_mute_sound');
    } else {
      setIsClickMuted(localStorage.getItem('smartfi_mute_click') === 'true');
      setIsAiMuted(localStorage.getItem('smartfi_mute_ai') === 'true');
    }
  }, []);

  const toggleClickMute = () => {
    const newVal = !isClickMuted;
    setIsClickMuted(newVal);
    localStorage.setItem('smartfi_mute_click', newVal ? 'true' : 'false');
  };

  const toggleAiMute = () => {
    const newVal = !isAiMuted;
    setIsAiMuted(newVal);
    localStorage.setItem('smartfi_mute_ai', newVal ? 'true' : 'false');
  };

  const updateProfile = async () => {
    setIsSavingProfile(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      if (error) throw error;
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui profil.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const updateSavingsTarget = async () => {
    setIsSavingTarget(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { target_tabungan: savingsTarget }
      });
      if (error) throw error;
      alert('Target tabungan berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui target tabungan.');
    } finally {
      setIsSavingTarget(false);
    }
  };

  const updateReminder = async () => {
    setIsSavingReminder(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          waktu_pengingat: reminderTime,
          status_pengingat: isReminderActive
        }
      });
      if (error) throw error;
      alert('Pengaturan pengingat berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui pengingat.');
    } finally {
      setIsSavingReminder(false);
    }
  };

  const adjustBalance = async () => {
    if (!newBalanceInput) return;
    setIsSavingBalance(true);
    try {
      const targetBal = Number(newBalanceInput);
      const diff = targetBal - currentBalance;

      if (diff === 0) {
        alert('Saldo sudah sesuai.');
        return;
      }

      const type = diff > 0 ? 'income' : 'expense';
      const amount = Math.abs(diff);

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        type,
        amount,
        category: 'Penyesuaian Saldo',
        description: 'Koreksi saldo manual via Pengaturan'
      });

      if (error) throw error;

      alert('Saldo berhasil dikoreksi!');
      setNewBalanceInput('');
      fetchUserData(); // Refresh balance
    } catch (err) {
      alert('Gagal mengoreksi saldo.');
    } finally {
      setIsSavingBalance(false);
    }
  };

  // Helper untuk format angka dengan pemisah ribuan
  const formatRupiah = (value) => {
    if (!value) return '';
    const numberString = value.toString().replace(/[^,\d]/g, '');
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
      const separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  };

  const handleSavingsChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setSavingsTarget(rawValue);
  };

  const handleBalanceChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setNewBalanceInput(rawValue);
  };

  const handleDeleteTransactions = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus riwayat transaksi ini? Saldo terkini Anda tidak akan berubah, tetapi data transaksi akan hilang permanen.')) {
      return;
    }

    setIsDeleting(true);
    try {
      let query = supabase.from('transactions').delete().eq('user_id', user.id);

      const now = new Date();
      if (deleteRange === 'this_month') {
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte('created_at', startDate);
      } else if (deleteRange === 'this_year') {
        const startDate = new Date(now.getFullYear(), 0, 1).toISOString();
        query = query.gte('created_at', startDate);
      }

      const { error } = await query;
      if (error) throw error;

      alert('Riwayat transaksi berhasil dihapus!');
      fetchUserData(); // Refresh data untuk update cache UI jika diperlukan
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus riwayat transaksi.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full pb-8 animate-pulse">
        <div className="mb-6">
          <div className="h-10 bg-gray-200 border-4 border-black w-48 mb-2"></div>
          <div className="h-6 bg-gray-200 border-4 border-black w-64"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-white uppercase tracking-tight">Pengaturan</h1>
        <p className="text-base text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Kelola profil, target, dan preferensi akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Card 1: Profil */}
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f0ff] dark:bg-blue-900 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
              <User strokeWidth={2.5} size={24} className="text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white uppercase">Profil Pengguna</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black dark:border-white bg-white dark:bg-zinc-700 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all text-black dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 border-4 border-black dark:border-white bg-gray-200 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 cursor-not-allowed outline-none font-bold"
              />
            </div>
            <div className="pt-4">
              <button
                onClick={updateProfile}
                disabled={isSavingProfile}
                className="bg-blue-500 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full sm:w-auto disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
              >
                {isSavingProfile ? 'Menyimpan...' : 'Simpan Profil'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Target Tabungan */}
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f0ff] dark:bg-blue-900 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
              <Target strokeWidth={2.5} size={24} className="text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white uppercase">Target Tabungan</h2>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Nominal Target (Rp)</label>
              <input
                type="text"
                value={formatRupiah(savingsTarget)}
                onChange={handleSavingsChange}
                placeholder="Contoh: 5.000.000"
                className="w-full px-4 py-3 border-4 border-black dark:border-white bg-white dark:bg-zinc-700 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all text-black dark:text-white font-bold"
              />
            </div>
            <p className="text-xs text-black dark:text-gray-300 font-bold uppercase tracking-wider">Tentukan target tabungan untuk memantau kemajuan finansial Anda setiap bulan.</p>
            <div className="pt-4">
              <button
                onClick={updateSavingsTarget}
                disabled={isSavingTarget}
                className="bg-blue-500 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full sm:w-auto disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
              >
                {isSavingTarget ? 'Menyimpan...' : 'Simpan Target'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 3: Preferensi Aplikasi */}
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f0ff] dark:bg-blue-900 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
              <Monitor strokeWidth={2.5} size={24} className="text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white uppercase">Preferensi Aplikasi</h2>
          </div>
          <div className="space-y-6">
            
            <div className="flex items-center justify-between border-b-4 border-black dark:border-white pb-6">
              <div>
                <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Tema Tampilan</p>
                <p className="text-xs text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Ubah antara Light / Dark mode.</p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Aktifkan Pengingat</p>
                <p className="text-xs text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Kami akan mengingatkan Anda untuk mencatat transaksi.</p>
              </div>
              
              {/* Neobrutalist Toggle */}
              <button
                onClick={() => setIsReminderActive(!isReminderActive)}
                className={`w-16 h-8 border-4 border-black dark:border-white transition-colors relative flex items-center p-0.5 ${isReminderActive ? 'bg-green-400' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <div className={`w-5 h-5 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-transform ${isReminderActive ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
            </div>

            {isReminderActive && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Pilih Waktu</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={e => setReminderTime(e.target.value)}
                  className="w-full px-4 py-3 border-4 border-black dark:border-white bg-white dark:bg-zinc-700 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all text-black dark:text-white font-bold"
                />
              </div>
            )}

            <div className="border-t-4 border-black dark:border-white pt-6 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Matikan Suara Klik</p>
                  <p className="text-xs text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Nonaktifkan efek suara saat klik tombol.</p>
                </div>
                
                <button
                  onClick={toggleClickMute}
                  className={`w-16 h-8 border-4 border-black dark:border-white transition-colors relative flex items-center p-0.5 ${isClickMuted ? 'bg-red-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-transform ${isClickMuted ? 'translate-x-8' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-black dark:text-white uppercase tracking-widest">Matikan Suara AI</p>
                  <p className="text-xs text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Nonaktifkan efek suara saat AI merespons.</p>
                </div>
                
                <button
                  onClick={toggleAiMute}
                  className={`w-16 h-8 border-4 border-black dark:border-white transition-colors relative flex items-center p-0.5 ${isAiMuted ? 'bg-red-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 border-2 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-transform ${isAiMuted ? 'translate-x-8' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={updateReminder}
                disabled={isSavingReminder}
                className="bg-blue-500 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full sm:w-auto disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
              >
                {isSavingReminder ? 'Menyimpan...' : 'Simpan Pengingat'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 4: Penyesuaian Saldo */}
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#e6f0ff] dark:bg-blue-900 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
              <Wallet strokeWidth={2.5} size={24} className="text-black dark:text-white" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white uppercase">Koreksi Saldo</h2>
          </div>
          <div className="space-y-5">
            <div className="p-4 border-4 border-black dark:border-white bg-yellow-100 dark:bg-yellow-900">
              <p className="text-xs text-black dark:text-white font-bold uppercase tracking-widest">Saldo Tersimpan Saat Ini:</p>
              <p className="text-2xl font-extrabold text-black dark:text-white mt-1">Rp {currentBalance.toLocaleString('id-ID')}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Masukkan Saldo Aktual (Rp)</label>
              <input
                type="text"
                value={formatRupiah(newBalanceInput)}
                onChange={handleBalanceChange}
                placeholder="Contoh: 15.000.000"
                className="w-full px-4 py-3 border-4 border-black dark:border-white bg-white dark:bg-zinc-700 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all text-black dark:text-white font-bold"
              />
            </div>
            <p className="text-xs text-black dark:text-gray-300 font-bold uppercase tracking-wider">Jika nominal aktual berbeda dengan aplikasi, SmartFi akan otomatis membuat transaksi penyesuaian agar saldo seimbang.</p>
            <div className="pt-4">
              <button
                onClick={adjustBalance}
                disabled={isSavingBalance || !newBalanceInput}
                className="bg-blue-500 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full sm:w-auto disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
              >
                {isSavingBalance ? 'Memproses...' : 'Koreksi Saldo'}
              </button>
            </div>
          </div>
        </div>

        {/* Card 5: Langganan */}
        <div className="bg-[#e6f0ff] dark:bg-blue-900 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
                  <CreditCard strokeWidth={2.5} size={24} className="text-black dark:text-white" />
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white uppercase">Langganan</h2>
              </div>
              <span className="bg-yellow-300 dark:bg-yellow-500 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-black dark:text-white px-3 py-1 font-bold uppercase text-xs">TRIAL</span>
            </div>
            <p className="text-black dark:text-white font-extrabold text-2xl uppercase mb-2">SmartFi Pro</p>
            <p className="text-sm text-black dark:text-gray-300 font-bold uppercase tracking-wider mb-6">
              Anda saat ini sedang menikmati fitur lengkap masa percobaan. Tingkatkan untuk akses tak terbatas ke Penasihat AI dan Laporan Kustom.
            </p>
          </div>
          <div>
            <button
              onClick={() => alert('Fitur langganan segera hadir!')}
              className="bg-white dark:bg-zinc-800 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full"
            >
              Tingkatkan ke Premium
            </button>
          </div>
        </div>

        {/* Card 6: Zona Bahaya */}
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-400 dark:bg-red-600 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center">
                  <AlertTriangle strokeWidth={2.5} size={24} className="text-black dark:text-white" />
                </div>
                <h2 className="text-xl font-bold text-black dark:text-white uppercase">Manajemen Data</h2>
              </div>
            </div>
            <p className="text-sm text-black dark:text-gray-300 font-bold uppercase tracking-wider mb-6">
              Hapus data riwayat transaksi anda. Hati-hati, data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-black dark:text-white uppercase tracking-widest mb-2">Rentang Waktu</label>
              <select
                value={deleteRange}
                onChange={(e) => setDeleteRange(e.target.value)}
                className="w-full px-4 py-3 border-4 border-black dark:border-white bg-white dark:bg-zinc-700 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all text-black dark:text-white font-bold appearance-none"
              >
                <option value="this_month">Bulan Ini</option>
                <option value="this_year">Tahun Ini</option>
                <option value="all">Semua Waktu</option>
              </select>
            </div>
          </div>
          <div>
            <button
              onClick={handleDeleteTransactions}
              disabled={isDeleting || !user}
              className="bg-red-400 dark:bg-red-600 text-black dark:text-white border-4 border-black dark:border-white px-6 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-y-1 active:translate-x-1 active:shadow-none dark:active:shadow-none transition-all w-full disabled:bg-gray-400 disabled:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Riwayat'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
