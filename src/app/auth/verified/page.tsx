import Link from 'next/link'
import { Card, Button } from '@/components/ui'

export default function VerifiedPage() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <Card variant="elevated" className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">✓</div>
        <h1 className="text-2xl font-bold text-charcoal mb-4">
          E-posten din er bekreftet!
        </h1>
        <p className="text-taupe mb-8">
          Takk for at du bekreftet e-postadressen din. Kontoen din er nå aktivert og klar til bruk.
        </p>
        <p className="text-taupe mb-8">
          Du kan nå logge inn og begynne å bruke Outfitted for å organisere garderoben din.
        </p>
        <Link href="/login">
          <Button className="w-full" size="lg">
            Gå til innlogging
          </Button>
        </Link>
      </Card>
    </div>
  )
}
