import Link from 'next/link'
import { Card, Button } from '@/components/ui'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold text-charcoal mb-4">
          Noe gikk galt
        </h1>
        <p className="text-taupe mb-6">
          Vi kunne ikke bekrefte lenken din. Dette kan skje hvis:
        </p>
        <ul className="text-left text-taupe mb-8 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>Lenken har utløpt (de er gyldige i 24 timer)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>Lenken allerede har blitt brukt</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-rose">•</span>
            <span>Det oppstod en teknisk feil</span>
          </li>
        </ul>
        <div className="space-y-3">
          <Link href="/register">
            <Button className="w-full" size="lg">
              Registrer deg på nytt
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full">
              Gå til innlogging
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
