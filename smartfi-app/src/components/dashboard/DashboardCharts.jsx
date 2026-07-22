'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function DashboardCharts({ transactions = [] }) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  if (expenseTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-border-default shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-text-body font-medium">Belum ada data pengeluaran untuk ditampilkan.</p>
      </div>
    );
  }

  // Bar Chart Logic
  const dateTotals = {};
  expenseTransactions.forEach(trx => {
    const dateStr = trx.created_at ? trx.created_at.split('T')[0] : 'Unknown';
    dateTotals[dateStr] = (dateTotals[dateStr] || 0) + Number(trx.amount);
  });
  
  const sortedDates = Object.keys(dateTotals).sort();
  const barLabels = sortedDates.map(dateStr => {
    if (dateStr === 'Unknown') return dateStr;
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d);
  });
  const barDataValues = sortedDates.map(dateStr => dateTotals[dateStr]);

  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Pengeluaran',
        data: barDataValues,
        backgroundColor: '#EF4444',
      },
    ],
  };

  // Pie Chart Logic
  const categoryTotals = {};
  expenseTransactions.forEach(trx => {
    const cat = trx.category || 'Lainnya';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(trx.amount);
  });
  
  const doughnutLabels = Object.keys(categoryTotals);
  const doughnutDataValues = Object.values(categoryTotals);
  const colors = ['#60A5FA', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#14B8A6'];
  const doughnutBackgrounds = doughnutLabels.map((_, i) => colors[i % colors.length]);

  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        label: 'Kategori Pengeluaran',
        data: doughnutDataValues,
        backgroundColor: doughnutBackgrounds,
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-text-heading">Tren Pengeluaran</h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg font-semibold mb-4 text-text-heading">Pengeluaran per Kategori</h3>
        <div className="h-64">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </Card>
    </div>
  );
}
