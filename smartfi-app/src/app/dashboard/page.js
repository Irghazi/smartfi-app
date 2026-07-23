'use client';

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { ArrowDown, ArrowUp, Wallet, CheckCircle2, Home } from 'lucide-react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ec4cc9', '#64748b'];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setTransactions(data || []);
      } catch (err) {
        console.error('Failed to fetch', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [supabase]);

  // Calculations
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = income - expense;

  // Recent 5
  const recentTransactions = transactions.slice(0, 5);

  // Bar Chart: Last 7 days expense
  const last7Days = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const barData = last7Days.map(date => {
    const dayStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    const dayStart = new Date(date.setHours(0,0,0,0));
    const dayEnd = new Date(date.setHours(23,59,59,999));
    
    const dayExpense = transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const tDate = new Date(t.created_at);
        return tDate >= dayStart && tDate <= dayEnd;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return { name: dayStr, amount: dayExpense };
  });

  const maxExpense = Math.max(...barData.map(d => d.amount), 0);

  const getTicks = (max) => {
    if (max === 0) return [0, 10000, 20000, 30000, 40000];
    const targetSteps = 4;
    const roughStep = max / targetSteps;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep || 1)));
    const normalizedStep = roughStep / magnitude;
    
    let step;
    if (normalizedStep <= 1) step = 1 * magnitude;
    else if (normalizedStep <= 2) step = 2 * magnitude;
    else if (normalizedStep <= 2.5) step = 2.5 * magnitude;
    else if (normalizedStep <= 5) step = 5 * magnitude;
    else step = 10 * magnitude;
    
    const ticks = [];
    for (let i = 0; i <= targetSteps; i++) {
      ticks.push(i * step);
    }
    return ticks;
  };
  
  const yAxisTicks = getTicks(maxExpense);
  const maxDomain = yAxisTicks[yAxisTicks.length - 1];

  // Pie Chart: Expense by Category
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category || 'Lainnya'] = (acc[curr.category || 'Lainnya'] || 0) + Number(curr.amount);
      return acc;
    }, {});
    
  const pieData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  })).sort((a,b) => b.value - a.value);

  if (isLoading) {
    return (
      <div className="w-full pb-8 animate-pulse">
        <div className="mb-6">
          <div className="h-10 border-4 border-black dark:border-white bg-gray-200 dark:bg-zinc-700 w-48 mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="h-5 border-2 border-black dark:border-white bg-gray-200 dark:bg-zinc-700 w-64 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="col-span-2 md:col-span-1 order-1 md:order-2 bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-32 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="col-span-1 order-2 md:order-1 bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-32 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="col-span-1 order-3 md:order-3 bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-32 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
          <div className="bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-80 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
        </div>
        <div className="bg-gray-200 dark:bg-zinc-700 border-4 border-black dark:border-white h-64 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]"></div>
      </div>
    );
  }

  return (
    <div className="w-full pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 border-4 border-black dark:border-white bg-white dark:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center flex-shrink-0">
          <Home size={24} strokeWidth={2.5} className="text-black dark:text-white" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight uppercase">Beranda</h1>
          <p className="text-sm sm:text-base text-black dark:text-gray-300 font-bold mt-1 uppercase tracking-wider">Ringkasan aktivitas keuanganmu hari ini.</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        {/* Saldo Terkini - On Mobile takes full width and is first */}
        <div className="col-span-2 md:col-span-1 order-1 md:order-2 bg-blue-500 dark:bg-blue-700 border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
          <div>
            <p className="text-white text-xs md:text-sm font-bold mb-1 uppercase tracking-wider">Saldo Terkini</p>
            <p className="text-white text-3xl md:text-4xl font-bold truncate">Rp {balance.toLocaleString('id-ID')}</p>
            <p className="text-white text-[10px] md:text-xs mt-1 md:mt-2 font-bold uppercase tracking-wide">Tersedia untuk digunakan</p>
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 border-2 border-black dark:border-white bg-blue-300 dark:bg-blue-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center ml-2">
            <Wallet size={24} className="text-black dark:text-white md:hidden" strokeWidth={2.5} />
            <Wallet size={28} className="text-black dark:text-white hidden md:block" strokeWidth={2.5} />
          </div>
        </div>

        {/* Pemasukan */}
        <div className="col-span-1 order-2 md:order-1 bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row sm:items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] gap-2 sm:gap-0">
          <div>
            <p className="text-black dark:text-white text-xs md:text-sm font-bold mb-1 uppercase tracking-wider">Pemasukan</p>
            <p className="text-black dark:text-white text-lg sm:text-xl md:text-3xl font-bold truncate">Rp {income.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 border-2 border-black dark:border-white bg-green-400 dark:bg-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center self-start sm:self-auto">
            <ArrowDown size={20} className="text-black dark:text-white md:hidden" strokeWidth={3} />
            <ArrowDown size={28} className="text-black dark:text-white hidden md:block" strokeWidth={3} />
          </div>
        </div>

        {/* Pengeluaran */}
        <div className="col-span-1 order-3 md:order-3 bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] flex flex-col sm:flex-row sm:items-center justify-between transition-transform hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] gap-2 sm:gap-0">
          <div>
            <p className="text-black dark:text-white text-xs md:text-sm font-bold mb-1 uppercase tracking-wider">Pengeluaran</p>
            <p className="text-black dark:text-white text-lg sm:text-xl md:text-3xl font-bold truncate">Rp {expense.toLocaleString('id-ID')}</p>
          </div>
          <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 border-2 border-black dark:border-white bg-red-400 dark:bg-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex items-center justify-center self-start sm:self-auto">
            <ArrowUp size={20} className="text-black dark:text-white md:hidden" strokeWidth={3} />
            <ArrowUp size={28} className="text-black dark:text-white hidden md:block" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <h2 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6 uppercase">Tren Pengeluaran 7 Hari Terakhir</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" axisLine={{stroke: '#000', strokeWidth: 2}} tickLine={{stroke: '#000', strokeWidth: 2}} tick={{fontSize: 12, fill: '#000', fontWeight: 'bold'}} />
                <YAxis axisLine={{stroke: '#000', strokeWidth: 2}} tickLine={{stroke: '#000', strokeWidth: 2}} tick={{fontSize: 12, fill: '#000', fontWeight: 'bold'}} tickFormatter={(v) => `Rp${v/1000}k`} width={80} ticks={yAxisTicks} domain={[0, maxDomain]} />
                <Tooltip 
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pengeluaran']}
                  cursor={{fill: '#e6f0ff'}}
                  contentStyle={{borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold', color: '#000'}}
                />
                <Bar dataKey="amount" fill="#3b82f6" stroke="#000" strokeWidth={2} radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          <h2 className="text-lg md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6 uppercase">Persentase Pengeluaran per Kategori</h2>
          <div className="h-64 flex justify-center items-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Total']}
                    contentStyle={{borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontWeight: 'bold', color: '#000'}}
                  />
                  <Legend align="right" iconType="square" layout="vertical" verticalAlign="middle" wrapperStyle={{fontWeight: 'bold', color: '#000'}}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-black dark:text-white font-bold">Belum ada pengeluaran</p>
            )}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        <div className="p-5 border-b-4 border-black dark:border-white bg-[#e6f0ff] dark:bg-blue-900">
          <h2 className="text-xl font-bold text-black dark:text-white uppercase">Riwayat Transaksi Terakhir</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-white dark:bg-zinc-800">
                <th className="p-4 text-sm font-bold text-black dark:text-white border-b-4 border-black dark:border-white uppercase">Tanggal</th>
                <th className="p-4 text-sm font-bold text-black dark:text-white border-b-4 border-black dark:border-white uppercase">Kategori</th>
                <th className="p-4 text-sm font-bold text-black dark:text-white border-b-4 border-black dark:border-white uppercase">Deskripsi</th>
                <th className="p-4 text-sm font-bold text-black dark:text-white border-b-4 border-black dark:border-white text-right uppercase">Nominal</th>
                <th className="p-4 text-sm font-bold text-black dark:text-white border-b-4 border-black dark:border-white text-center uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black dark:divide-white">
              {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors">
                  <td className="p-4 text-sm text-black dark:text-white font-bold">
                    {new Date(tx.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="p-4 text-sm">
                    <span className="bg-yellow-300 dark:bg-yellow-500 text-black dark:text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] px-2 py-1 text-xs font-bold uppercase">
                      {tx.category || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-black dark:text-white font-bold max-w-xs truncate">{tx.description || '-'}</td>
                  <td className={`p-4 text-sm font-bold text-right ${tx.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-sm text-center">
                    <span className="inline-flex items-center gap-1 bg-green-500 text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] px-2.5 py-0.5 text-xs font-bold uppercase">
                      <CheckCircle2 size={12} strokeWidth={3} />
                      Selesai
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-black dark:text-white font-bold">Belum ada transaksi yang dicatat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
