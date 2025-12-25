import type { User as SupabaseUser } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

export async function getOrCreateAppUserFromSupabase(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email?.toLowerCase()
  if (!email) {
    throw new Error('Missing email for authenticated user')
  }

  const name = typeof supabaseUser.user_metadata?.name === 'string' ? supabaseUser.user_metadata.name : null

  const existing = await prisma.user.findUnique({
    where: { email },
  })

  if (existing) {
    if (!existing.name && name) {
      return prisma.user.update({
        where: { id: existing.id },
        data: { name },
      })
    }
    return existing
  }

  return prisma.user.create({
    data: {
      email,
      name: name || undefined,
    },
  })
}

