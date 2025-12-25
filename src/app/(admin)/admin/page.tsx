import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    redirect('/home')
  }

  return <AdminDashboard adminEmail={user.email} />
}
