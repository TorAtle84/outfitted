import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AvatarEditorClient from './AvatarEditorClient'

export default async function AvatarEditorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <AvatarEditorClient />
}

