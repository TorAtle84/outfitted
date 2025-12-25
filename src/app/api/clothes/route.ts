import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateAppUserFromSupabase } from '@/lib/user'
import { normalizeClothingPayload } from '@/lib/clothing'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const appUser = await getOrCreateAppUserFromSupabase(user)
    const items = await prisma.clothing.findMany({
      where: { userId: appUser.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Clothes GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch wardrobe items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await request.json()
    const normalized = normalizeClothingPayload(payload)
    if ('error' in normalized) {
      return NextResponse.json({ error: normalized.error }, { status: 400 })
    }

    const appUser = await getOrCreateAppUserFromSupabase(user)
    const item = await prisma.clothing.create({
      data: {
        userId: appUser.id,
        ...normalized.data,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('Clothes POST error:', error)
    return NextResponse.json({ error: 'Failed to create wardrobe item' }, { status: 500 })
  }
}
