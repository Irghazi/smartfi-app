import React from 'react';
import { Card } from '@/components/ui/Card';

export function SaldoCard({ title, amount, type }) {
  let textColorClass = 'text-text-body';
  
  if (type === 'income') {
    textColorClass = 'text-success';
  } else if (type === 'expense') {
    textColorClass = 'text-error';
  } else if (type === 'balance') {
    textColorClass = 'text-primary';
  }

  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);

  return (
    <Card className="flex flex-col justify-center gap-1">
      <h3 className="text-sm font-medium text-text-body">{title}</h3>
      <p className={`text-2xl font-bold ${textColorClass}`}>
        {formattedAmount}
      </p>
    </Card>
  );
}
