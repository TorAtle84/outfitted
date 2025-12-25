import Link from 'next/link'
import { Card, Button } from '@/components/ui'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-charcoal mb-4">
          Something went wrong
        </h1>
        <p className="text-taupe mb-6">
          We couldn&apos;t verify your link. This can happen if:
        </p>
        <ul className="text-left text-taupe mb-8 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>The link has expired (they&apos;re valid for 24 hours)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>The link has already been used</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>A technical error occurred</span>
          </li>
        </ul>
        <div className="space-y-3">
          <Link href="/register">
            <Button className="w-full" size="lg">
              Register again
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              Go to login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
