import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({ children }) {
  const supabase = await createClient()

  // Ambil sesi user saat ini. Jika tidak ada, pental ke login.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  )
}
