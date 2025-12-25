'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Input, Card } from '@/components/ui'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke overens')
      return
    }

    if (password.length < 6) {
      setError('Passordet må være minst 6 tegn')
      return
    }

    setIsLoading(true)

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    // Send welcome email
    try {
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
    } catch {
      // Don't fail registration if welcome email fails
      console.error('Could not send welcome email')
    }

    setSuccess(true)
    setIsLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <Card variant="elevated" className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-charcoal mb-4">
            Sjekk e-posten din!
          </h1>
          <p className="text-taupe mb-6">
            Vi har sendt en bekreftelseslenke til <strong>{email}</strong>.
            Klikk på lenken for å aktivere kontoen din.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-amber-700 font-semibold mb-2">
              <span>⏰</span>
              <span>Viktig!</span>
            </div>
            <p className="text-amber-700 text-sm">
              Du må bekrefte e-posten din innen <strong>24 timer</strong>, ellers blir kontoen automatisk slettet.
              Vi sender deg påminnelser hvis du glemmer det.
            </p>
          </div>

          <p className="text-sm text-taupe">
            Fant du ikke e-posten? Sjekk søppelpost-mappen din.
          </p>
          <Link href="/login">
            <Button variant="secondary" className="mt-6">
              Tilbake til innlogging
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Opprett konto</h1>
          <p className="text-taupe">Bli med i Outfitted og perfeksjoner garderoben din</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Navn"
            type="text"
            placeholder="Ditt navn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="E-post"
            type="email"
            placeholder="din@epost.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Passord"
            type="password"
            placeholder="Minst 6 tegn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Bekreft passord"
            type="password"
            placeholder="Skriv passordet på nytt"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            Opprett konto
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-taupe">
            Har du allerede en konto?{' '}
            <Link href="/login" className="text-rose hover:underline font-medium">
              Logg inn
            </Link>
          </p>
        </div>

        <p className="mt-4 text-xs text-center text-taupe">
          Ved å opprette en konto godtar du våre vilkår og personvernerklæring.
        </p>
      </Card>
    </div>
  )
}
