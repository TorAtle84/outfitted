import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { isAdminEmail } from '@/lib/admin'
import { NextResponse } from 'next/server'

// Get all promo users
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const promoUsers = await prisma.promoAccess.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ promoUsers })
  } catch (error) {
    console.error('Promo list error:', error)
    return NextResponse.json({ error: 'Failed to get promo users' }, { status: 500 })
  }
}

// Add promo access
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { email, reason, expiresAt } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find or create user
    let targetUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (!targetUser) {
      // Create a placeholder user - they'll complete registration when they sign up
      targetUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          role: 'USER',
        },
      })
    }

    // Check if already has promo access
    const existingPromo = await prisma.promoAccess.findUnique({
      where: { userId: targetUser.id },
    })

    if (existingPromo) {
      return NextResponse.json({ error: 'User already has promo access' }, { status: 400 })
    }

    // Grant promo access
    const promoAccess = await prisma.promoAccess.create({
      data: {
        userId: targetUser.id,
        grantedBy: user.email,
        reason,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ promoAccess })
  } catch (error) {
    console.error('Promo create error:', error)
    return NextResponse.json({ error: 'Failed to add promo access' }, { status: 500 })
  }
}

// Remove promo access
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const promoId = searchParams.get('id')

    if (!promoId) {
      return NextResponse.json({ error: 'Promo ID is required' }, { status: 400 })
    }

    await prisma.promoAccess.delete({
      where: { id: promoId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Promo delete error:', error)
    return NextResponse.json({ error: 'Failed to remove promo access' }, { status: 500 })
  }
}
