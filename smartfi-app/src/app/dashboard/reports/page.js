'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ArrowDown, ArrowUp, Wallet, Download, FileSpreadsheet, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ReportsPage() {
  const [transactions, setTransactions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (startDate) {
        // Appending T00:00:00 to ensure we capture from start of day
        query = query.gte('created_at', `${startDate}T00:00:00`);
      }
      if (endDate) {
        // Appending T23:59:59 to ensure we capture till end of day
        query = query.lte('created_at', `${endDate}T23:59:59`);
      }
      if (reportType !== 'all') {
        query = query.eq('type', reportType);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (err) {
      console.error(err);
      alert('Gagal mengambil data laporan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [supabase]);

  // Kalkulasi statistik
  const totalPemasukan = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    
  const totalPengeluaran = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    
  const saldoAkhir = totalPemasukan - totalPengeluaran;

  const exportToExcel = () => {
    const headers = ['No', 'Tanggal', 'Kategori', 'Deskripsi', 'Pemasukan (Rp)', 'Pengeluaran (Rp)'];
    const rows = transactions.map((tx, idx) => {
      const inc = tx.type === 'income' ? tx.amount : 0;
      const exp = tx.type === 'expense' ? tx.amount : 0;
      const date = new Date(tx.created_at).toLocaleDateString('id-ID');
      
      return [
        idx + 1,
        date,
        `"${tx.category || '-'}"`,
        `"${tx.description || '-'}"`,
        inc,
        exp
      ].join(',');
    });
    
    // Add total row at the bottom
    rows.push([
      '','','','TOTAL', totalPemasukan, totalPengeluaran
    ].join(','));
    
    // Add net balance row at the bottom
    rows.push([
      '','','','SALDO BERSIH', '', saldoAkhir
    ].join(','));

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'laporan_keuangan.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="w-full pb-10">
      {/* Global CSS untuk styling ketika mode Print berjalan */}
      <style>{`
        @media print {
          aside, header { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 print:hidden">
        <div className="w-12 h-12 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center flex-shrink-0">
          <FileText size={24} strokeWidth={2.5} className="text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Laporan Keuangan</h1>
          <p className="text-base text-black font-bold mt-1 uppercase tracking-wider">Filter dan ekspor data keuanganmu.</p>
        </div>
      </div>

      {/* Filter Section - Hidden on Print */}
      <div className="bg-white border-4 border-black p-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] print:hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Tanggal Mulai</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Tanggal Akhir</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black uppercase tracking-widest mb-2">Jenis Laporan</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border-4 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold appearance-none"
            >
              <option value="all">Semua Transaksi</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
            </select>
          </div>
          <div>
            <button 
              onClick={fetchData}
              disabled={isLoading}
              className="w-full bg-blue-500 text-black border-4 border-black px-5 py-3 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
            >
              <Search strokeWidth={3} size={20} />
              Cari Laporan
            </button>
          </div>
        </div>
      </div>

      {/* Tampilan Header Print-only */}
      <div className="hidden print:block mb-8 text-center border-b-4 border-black pb-4">
        <h1 className="text-4xl font-extrabold text-black uppercase mb-2">Laporan Keuangan SmartFi</h1>
        <p className="text-black font-bold uppercase tracking-widest">
          Periode: {startDate ? new Date(startDate).toLocaleDateString('id-ID') : 'Awal'} 
          {' '}HINGGA{' '} 
          {endDate ? new Date(endDate).toLocaleDateString('id-ID') : 'Sekarang'}
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between print:shadow-none print:border-black">
          <div>
            <p className="text-black font-bold uppercase tracking-widest mb-1 text-sm print:text-black">Total Pemasukan</p>
            <p className="text-black text-3xl font-extrabold">Rp {totalPemasukan.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-12 h-12 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center print:hidden">
            <ArrowDown strokeWidth={3} size={24} className="text-black" />
          </div>
        </div>
        <div className="bg-red-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between print:shadow-none print:border-black">
          <div>
            <p className="text-black font-bold uppercase tracking-widest mb-1 text-sm print:text-black">Total Pengeluaran</p>
            <p className="text-black text-3xl font-extrabold">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-12 h-12 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center print:hidden">
            <ArrowUp strokeWidth={3} size={24} className="text-black" />
          </div>
        </div>
        <div className="bg-blue-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between print:bg-white print:border-black print:shadow-none">
          <div>
            <p className="text-black font-bold uppercase tracking-widest mb-1 text-sm print:text-black">Saldo Akhir</p>
            <p className="text-black text-3xl font-extrabold print:text-black">Rp {saldoAkhir.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-12 h-12 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center print:hidden">
            <Wallet strokeWidth={3} size={24} className="text-black" />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 print:shadow-none print:border-none">
        <div className="p-5 border-b-4 border-black flex justify-between items-center bg-[#e6f0ff] print:bg-transparent print:border-black">
          <h2 className="text-xl font-bold text-black uppercase tracking-tight">Detail Transaksi</h2>
          <span className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black px-4 py-2 font-bold uppercase text-xs print:border print:border-black print:bg-white">
            {transactions.length} Transaksi
          </span>
        </div>
        
        {isLoading ? (
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 border-4 border-black bg-gray-200 animate-pulse w-full"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse print:border-4 print:border-black">
              <thead>
                <tr className="bg-white border-b-4 border-black print:border-black">
                  <th className="p-4 text-sm font-extrabold text-black uppercase print:text-black print:border-b-4 print:border-black">No</th>
                  <th className="p-4 text-sm font-extrabold text-black uppercase print:text-black print:border-b-4 print:border-black">Tanggal</th>
                  <th className="p-4 text-sm font-extrabold text-black uppercase print:text-black print:border-b-4 print:border-black">Kategori</th>
                  <th className="p-4 text-sm font-extrabold text-black uppercase print:text-black print:border-b-4 print:border-black">Deskripsi</th>
                  <th className="p-4 text-sm font-extrabold text-black uppercase text-right print:text-black print:border-b-4 print:border-black">Pemasukan (Rp)</th>
                  <th className="p-4 text-sm font-extrabold text-black uppercase text-right print:text-black print:border-b-4 print:border-black">Pengeluaran (Rp)</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black print:divide-black">
                {transactions.map((tx, index) => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-yellow-100 transition-colors bg-white">
                      <td className="p-4 text-sm text-black font-bold">{index + 1}</td>
                      <td className="p-4 text-sm text-black font-bold">
                        {new Date(tx.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </td>
                      <td className="p-4 text-sm">
                        <span className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-2 py-1 text-xs font-bold uppercase print:bg-white print:border print:border-black">
                          {tx.category || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-black font-bold max-w-[200px] truncate">{tx.description || '-'}</td>
                      <td className={`p-4 text-sm font-bold text-right ${isIncome ? 'text-green-600' : 'text-black'}`}>
                        {isIncome ? tx.amount.toLocaleString('id-ID') : '-'}
                      </td>
                      <td className={`p-4 text-sm font-bold text-right ${!isIncome ? 'text-red-600' : 'text-black'}`}>
                        {!isIncome ? tx.amount.toLocaleString('id-ID') : '-'}
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-black font-bold uppercase">
                      Tidak ada transaksi untuk filter tersebut.
                    </td>
                  </tr>
                )}
                {transactions.length > 0 && (
                  <>
                    <tr className="bg-gray-100 border-t-4 border-black print:border-t-4 print:border-black print:bg-white">
                      <td colSpan="4" className="p-4 text-sm text-black font-extrabold uppercase text-right">TOTAL</td>
                      <td className="p-4 text-sm text-green-600 font-extrabold text-right">{totalPemasukan.toLocaleString('id-ID')}</td>
                      <td className="p-4 text-sm text-red-600 font-extrabold text-right">{totalPengeluaran.toLocaleString('id-ID')}</td>
                    </tr>
                    <tr className="bg-yellow-300 border-t-4 border-black print:bg-white print:border-b-4 print:border-black">
                      <td colSpan="4" className="p-4 text-base text-black font-extrabold uppercase text-right">SALDO BERSIH</td>
                      <td colSpan="2" className="p-4 text-lg text-black font-extrabold text-right">
                        {saldoAkhir < 0 ? '-Rp ' + Math.abs(saldoAkhir).toLocaleString('id-ID') : 'Rp ' + saldoAkhir.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Export Buttons - Hidden on Print */}
      <div className="flex justify-end gap-4 print:hidden">
        <button 
          onClick={exportToPDF}
          disabled={transactions.length === 0 || isLoading}
          className="flex items-center gap-2 bg-white text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 font-bold uppercase hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
        >
          <Download strokeWidth={3} size={20} />
          Ekspor PDF
        </button>
        <button 
          onClick={exportToExcel}
          disabled={transactions.length === 0 || isLoading}
          className="flex items-center gap-2 bg-yellow-300 text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3 font-bold uppercase hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet strokeWidth={3} size={20} />
          Ekspor Excel
        </button>
      </div>
    </div>
  );
}
