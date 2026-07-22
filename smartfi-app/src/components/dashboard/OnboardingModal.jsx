'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function OnboardingModal({ user }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (rawValue < 100000) {
      setError('Masukkan saldo awal minimal Rp 100.000.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'income',
        amount: Number(rawValue),
        category: 'Saldo Awal',
        description: 'Setup Saldo Awal',
        created_at: new Date().toISOString(),
      });

      if (txError) throw txError;

      // Sukses: Refresh dashboard untuk memuat data transaksi yang baru dan menghilangkan modal
      router.refresh();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan saldo awal.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 shadow-xl relative overflow-hidden bg-white rounded-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <img src="/images/icon-192x192.png" alt="SmartFi Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-text-heading">Selamat Datang di SmartFi!</h2>
          <p className="text-text-body mt-2">Mari mulai dengan mengatur saldo awal Anda agar kami bisa melacak keuangan Anda dengan akurat.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Saldo Awal (Rp)"
            type="text"
            inputMode="numeric"
            placeholder="Contoh: 100.000"
            value={displayValue}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (!val) {
                setDisplayValue('');
                setRawValue(0);
                return;
              }
              const num = parseInt(val, 10);
              setRawValue(num);
              setDisplayValue(num.toLocaleString('id-ID'));
            }}
            required
            autoFocus
          />
          {displayValue && rawValue < 100000 && (
            <p className="text-xs text-error mt-1">Minimal pengisian saldo awal adalah Rp 100.000</p>
          )}

          {error && (
            <div className="text-sm text-error bg-error/10 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || rawValue < 100000} 
            className={`w-full py-3 text-lg font-semibold transition-all ${
              rawValue >= 100000 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Menyimpan...' : 'Mulai Gunakan SmartFi'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
