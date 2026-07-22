import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Tidak ada akses (Unauthorized)' }, { status: 401 })
  }

  // Mengambil daftar transaksi yang diurutkan dari tanggal terbaru
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(transactions)
}

export async function POST(request) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Tidak ada akses (Unauthorized)' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, category, amount, description, created_at } = body

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        category: category || 'Lainnya',
        type,
        amount,
        description,
        created_at: created_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
