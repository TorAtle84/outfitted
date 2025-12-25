import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const [
      totalUsers,
      promoUsers,
      premiumUsers,
      totalClothes,
      totalOutfits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.promoAccess.count(),
      prisma.subscription.count({ where: { tier: 'PREMIUM' } }),
      prisma.clothing.count(),
      prisma.outfit.count(),
    ])

    // Get recent signups (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const recentSignups = await prisma.user.count({
      where: { createdAt: { gte: weekAgo } }
    })

    return NextResponse.json({
      totalUsers,
      promoUsers,
      premiumUsers,
      totalClothes,
      totalOutfits,
      recentSignups,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
