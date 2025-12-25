import Link from 'next/link'
import { Card, Button } from '@/components/ui'

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-2xl font-bold text-charcoal mb-4">
          Email verified!
        </h1>
        <p className="text-taupe mb-8">
          Thank you for verifying your email address. Your account is now activated and ready to use.
        </p>
        <p className="text-taupe mb-8">
          You can now sign in and start using Outfitted to organize your wardrobe.
        </p>
        <Link href="/login">
          <Button className="w-full" size="lg">
            Go to login
          </Button>
        </Link>
      </Card>
    </div>
  )
}
