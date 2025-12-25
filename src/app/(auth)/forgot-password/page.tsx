'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, Input } from '@/components/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
      } else {
        setMessage(data.message)
      }
    } catch {
      setError('En feil oppstod. Prøv igjen.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-cream px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-semibold text-charcoal-soft text-center mb-2">
            Glemt passord?
          </h1>
          <p className="text-warm-taupe text-center mb-8">
            Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
          </p>

          {message && (
            <div className="bg-sage-mist/20 text-sage-mist p-4 rounded-lg mb-6 text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-dusty-rose/20 text-dusty-rose p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-post"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@epost.no"
              required
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sender...' : 'Send tilbakestillingslenke'}
            </Button>
          </form>

          <p className="text-center mt-6 text-warm-taupe">
            Husker du passordet?{' '}
            <Link href="/login" className="text-dusty-rose hover:underline">
              Logg inn
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
