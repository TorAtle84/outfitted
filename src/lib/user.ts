import type { User as SupabaseUser } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

export async function getOrCreateAppUserFromSupabase(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email?.toLowerCase()
  if (!email) {
    throw new Error('Missing email for authenticated user')
  }

  const name = typeof supabaseUser.user_metadata?.name === 'string' ? supabaseUser.user_metadata.name : null

  return prisma.user.upsert({
    where: { email },
    create: {
      email,
      name: name || undefined,
    },
    update: name ? { name } : {},
  })
}
