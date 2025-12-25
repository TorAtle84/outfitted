import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateAppUserFromSupabase } from '@/lib/user'
import { normalizeClothingPayload } from '@/lib/clothing'

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
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
    const existing = await prisma.clothing.findFirst({
      where: { id, userId: appUser.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const item = await prisma.clothing.update({
      where: { id },
      data: normalized.data,
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('Clothes PUT error:', error)
    return NextResponse.json({ error: 'Failed to update wardrobe item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const appUser = await getOrCreateAppUserFromSupabase(user)
    const existing = await prisma.clothing.findFirst({
      where: { id, userId: appUser.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    await prisma.clothing.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Clothes DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete wardrobe item' }, { status: 500 })
  }
}
