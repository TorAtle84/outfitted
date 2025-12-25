import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import WardrobeClient from './WardrobeClient'

export default async function WardrobePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <WardrobeClient user={user} />
}
