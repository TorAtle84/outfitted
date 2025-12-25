import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateAppUserFromSupabase } from '@/lib/user'
import { avatarFromDb, avatarToDbData, normalizeAvatarCustomization } from '@/lib/avatar'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const appUser = await getOrCreateAppUserFromSupabase(user)
    const avatar = await prisma.avatar.findUnique({
      where: { userId: appUser.id },
    })

    return NextResponse.json({
      avatar: avatar ? avatarFromDb(avatar) : null,
    })
  } catch (error) {
    console.error('Avatar GET error:', error)
    return NextResponse.json({ error: 'Failed to get avatar' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const normalized = normalizeAvatarCustomization(payload)
    const data = avatarToDbData(normalized)

    const appUser = await getOrCreateAppUserFromSupabase(user)

    const saved = await prisma.avatar.upsert({
      where: { userId: appUser.id },
      create: {
        userId: appUser.id,
        ...data,
      },
      update: data,
    })

    return NextResponse.json({ avatar: avatarFromDb(saved) })
  } catch (error) {
    console.error('Avatar PUT error:', error)
    return NextResponse.json({ error: 'Failed to save avatar' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  return PUT(request)
}

