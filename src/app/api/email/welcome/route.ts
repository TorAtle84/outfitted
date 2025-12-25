import { sendEmail, emailTemplates } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'E-post og navn er påkrevd' },
        { status: 400 }
      )
    }

    const template = emailTemplates.welcome(name)
    const result = await sendEmail({
      to: email,
      subject: template.subject,
      html: template.html,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Kunne ikke sende velkomst-e-post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Velkomst-e-post sendt' })
  } catch (error) {
    console.error('Welcome email error:', error)
    return NextResponse.json(
      { error: 'En feil oppstod' },
      { status: 500 }
    )
  }
}
