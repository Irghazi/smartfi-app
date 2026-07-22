'use client'

import React, { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { SmartInput } from '../../../components/transactions/SmartInput'
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ArrowRightLeft } from 'lucide-react'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (txError) throw txError
      setTransactions(txData || [])

      const { data: catData, error: catError } = await supabase
        .from('user_categories')
        .select('name')
        .eq('user_id', user.id)

      let fetchedCategories = [];
      if (!catError && catData) {
        fetchedCategories = catData.map(c => c.name);
      }
      
      const defaultCats = ['Makanan', 'Transportasi', 'Hiburan', 'Gaji'];
      const txCats = Array.from(new Set((txData || []).map(t => t.category).filter(Boolean)));
      const allCats = Array.from(new Set([...defaultCats, ...fetchedCategories, ...txCats]));
      
      setCategoriesList(allCats);
    } catch (err) {
      console.warn('Gagal mengambil data:', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [supabase])

  // Get current month and year
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(tx => {
    if (!tx.created_at) return false;
    const txDate = new Date(tx.created_at)
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear
  })

  // Calculate totals
  const totalPemasukanBulanIni = currentMonthTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const totalPengeluaranBulanIni = currentMonthTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const totalPemasukanAll = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalPengeluaranAll = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + Number(tx.amount), 0);
  const saldoTerkini = totalPemasukanAll - totalPengeluaranAll;

  const chartData = [{ name: 'Bulan Ini', Pemasukan: totalPemasukanBulanIni, Pengeluaran: totalPengeluaranBulanIni }];

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm('Hapus transaksi ini?')) return
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (error) throw error
      fetchTransactions()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus transaksi')
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full pb-8">
      {/* Judul Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0">
          <ArrowRightLeft size={24} strokeWidth={2.5} className="text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Kelola Transaksi</h1>
          <p className="text-base text-black font-bold mt-1 uppercase tracking-wider">Lacak dan catat keuangan Anda dengan bantuan AI.</p>
        </div>
      </div>
      
      {/* Kolom Atas: Smart Input & Ringkasan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Kiri: Smart Input */}
        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <SmartInput onTransactionAdded={fetchTransactions} categoriesList={categoriesList} />
        </div>
        
        {/* Kanan: Ringkasan Bulan Ini */}
        <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
          <div className="mb-4">
            <p className="text-black font-bold text-sm uppercase tracking-wider">Saldo Terkini</p>
            <h3 className="text-4xl font-bold text-blue-500">{formatRupiah(saldoTerkini)}</h3>
          </div>
          
          <div className="h-48 w-full mt-2 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={{stroke: '#000', strokeWidth: 2}} tickLine={{stroke: '#000', strokeWidth: 2}} tick={{fontSize: 12, fill: '#000', fontWeight: 'bold'}} />
                <Tooltip 
                  formatter={(value) => formatRupiah(value)}
                  cursor={{fill: '#e6f0ff'}}
                  contentStyle={{borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold', color: '#000'}}
                />
                <Legend wrapperStyle={{fontWeight: 'bold', color: '#000'}} iconType="square" />
                <Bar dataKey="Pemasukan" fill="#4ade80" stroke="#000" strokeWidth={2} radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pengeluaran" fill="#f87171" stroke="#000" strokeWidth={2} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between items-center p-4 bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-auto transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <span className="text-black font-bold uppercase tracking-wider text-sm">Total Pemasukan</span>
            </div>
            <span className="text-xl font-bold text-black">{formatRupiah(totalPemasukanBulanIni)}</span>
          </div>

          <div className="flex justify-between items-center p-4 bg-red-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
              </div>
              <span className="text-black font-bold uppercase tracking-wider text-sm">Total Pengeluaran</span>
            </div>
            <span className="text-xl font-bold text-black">{formatRupiah(totalPengeluaranBulanIni)}</span>
          </div>
        </div>

      </div>

      {/* Kolom Bawah: Tabel Riwayat */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="p-5 border-b-4 border-black bg-[#e6f0ff]">
          <h3 className="text-xl font-bold text-black uppercase">Riwayat Transaksi</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white">
                <th className="p-4 text-sm font-bold text-black border-b-4 border-black uppercase">Tanggal</th>
                <th className="p-4 text-sm font-bold text-black border-b-4 border-black uppercase">Kategori</th>
                <th className="p-4 text-sm font-bold text-black border-b-4 border-black uppercase">Deskripsi</th>
                <th className="p-4 text-sm font-bold text-black border-b-4 border-black text-right uppercase">Nominal</th>
                <th className="p-4 text-sm font-bold text-black border-b-4 border-black text-center uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-gray-50">
                    <td className="p-4"><div className="h-4 border-2 border-black bg-gray-300 w-24"></div></td>
                    <td className="p-4"><div className="h-6 border-2 border-black bg-gray-300 w-20"></div></td>
                    <td className="p-4"><div className="h-4 border-2 border-black bg-gray-300 w-48"></div></td>
                    <td className="p-4"><div className="h-4 border-2 border-black bg-gray-300 w-24 ml-auto"></div></td>
                    <td className="p-4"><div className="h-8 border-2 border-black bg-gray-300 w-8 mx-auto"></div></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-black font-bold">
                    <p>Belum ada riwayat transaksi.</p>
                    <p className="text-sm mt-1">Gunakan Smart Input di atas untuk mulai mencatat.</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-blue-50 transition-colors">
                    <td className="p-4 text-sm text-black font-bold">
                      {tx.created_at ? new Date(tx.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      }) : '-'}
                    </td>
                    <td className="p-4 text-sm">
                      <span className="bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-2 py-1 text-xs font-bold uppercase">
                        {tx.category || 'Lainnya'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-black font-bold max-w-xs truncate">{tx.description}</td>
                    <td className={`p-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+ ' : '- '}Rp {tx.amount ? tx.amount.toLocaleString('id-ID') : 0}
                    </td>
                    <td className="p-4 text-sm text-center">
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="text-black bg-red-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-2 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all inline-flex items-center justify-center" 
                        aria-label="Hapus Transaksi"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
