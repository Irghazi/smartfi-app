import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*, categories(name, icon)')
      .eq('user_id', user.id)
      .order('transaction_date', { ascending: false });

    if (error) {
      throw error;
    }

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(trx => {
      if (trx.type === 'income') {
        totalIncome += Number(trx.nominal);
      } else if (trx.type === 'expense') {
        totalExpense += Number(trx.nominal);
      }
    });

    const currentBalance = totalIncome - totalExpense;
    const recentTransactions = transactions.slice(0, 5);

    return NextResponse.json({
      totalIncome,
      totalExpense,
      currentBalance,
      recentTransactions
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
