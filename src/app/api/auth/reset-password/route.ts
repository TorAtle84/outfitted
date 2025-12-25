import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-postadresse er påkrevd' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`,
    })

    if (error) {
      console.error('Password reset error:', error)
      return NextResponse.json(
        { error: 'Kunne ikke sende tilbakestillingslenke' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Hvis e-postadressen finnes, har vi sendt en lenke for å tilbakestille passordet.',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'En feil oppstod' },
      { status: 500 }
    )
  }
}
