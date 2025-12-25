import Link from 'next/link'
import { Button } from '@/components/ui'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg
            className="w-8 h-8 text-rose"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L12 6M12 6C9.5 6 7 8 7 11C7 14 9 16 12 22C15 16 17 14 17 11C17 8 14.5 6 12 6Z" />
            <path d="M4 8L8 10M16 10L20 8" />
          </svg>
          <span className="text-xl font-bold text-charcoal">Outfitted</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal mb-6">
            Your wardrobe,{' '}
            <span className="text-rose">perfected</span>
          </h1>
          <p className="text-xl text-taupe mb-8 max-w-2xl mx-auto">
            Digitize your closet, get AI-powered outfit suggestions, and never wonder
            &quot;what should I wear?&quot; again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start for free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn more
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-20 relative">
          <div className="avatar-container p-8 max-w-3xl mx-auto">
            <div className="bg-white/80 rounded-lg p-6 text-center">
              <div className="w-48 h-64 mx-auto bg-blush rounded-lg mb-4 flex items-center justify-center">
                <svg
                  className="w-24 h-24 text-rose/40"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" />
                </svg>
              </div>
              <p className="text-taupe text-sm">
                Create your personalized avatar and see yourself in any outfit
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <section id="features" className="mt-24 scroll-mt-24">
          <h2 className="text-3xl font-bold text-charcoal text-center mb-12">
            Everything you need for the perfect outfit
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              }
              title="Digital Closet"
              description="Photograph and catalog all your clothes. Always know what you own."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              }
              title="Smart Suggestions"
              description="AI-powered outfit recommendations based on color theory, weather, and your style."
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
              title="Weather Aware"
              description="Get outfit suggestions based on the local forecast. Always dress for the weather."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24 text-center">
          <div className="bg-beige rounded-2xl p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-charcoal mb-4">
              Ready to transform your mornings?
            </h2>
            <p className="text-taupe mb-8">
              Join thousands of users who never stress about what to wear.
            </p>
            <Link href="/register">
              <Button size="lg">Create your free account</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-beige">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-taupe text-sm">
            &copy; {new Date().getFullYear()} Outfitted. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-taupe">
            <Link href="#" className="hover:text-charcoal">Privacy</Link>
            <Link href="#" className="hover:text-charcoal">Terms</Link>
            <Link href="#" className="hover:text-charcoal">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-beige rounded-xl p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-blush rounded-full flex items-center justify-center text-rose">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-taupe text-sm">{description}</p>
    </div>
  )
}
