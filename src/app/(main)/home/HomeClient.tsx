'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { Button, Card } from '@/components/ui'
import { OutfitDisplay } from '@/components/outfit'
import { isAdminEmail } from '@/lib/admin'

interface HomeClientProps {
  user: User
}

export default function HomeClient({ user }: HomeClientProps) {
  const router = useRouter()
  const [currentDay, setCurrentDay] = useState<'today' | 'tomorrow'>('today')
  const isAdmin = isAdminEmail(user.email || '')

  // TODO: Fetch actual outfit data from wardrobe
  const [selectedOutfit, setSelectedOutfit] = useState<{
    outerwear: null
    top: null
    bottom: null
    shoes: null
  }>({
    outerwear: null,
    top: null,
    bottom: null,
    shoes: null,
  })

  const handleSlotClick = (slot: 'outerwear' | 'top' | 'bottom' | 'shoes') => {
    // TODO: Open wardrobe picker modal for this slot
    router.push(`/wardrobe?select=${slot}`)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-beige border-b border-beige">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
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
          <div className="flex items-center gap-4">
            <span className="text-taupe text-sm">
              Hi, {user.user_metadata?.name || user.email?.split('@')[0]}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Weather Widget */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blush rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-rose" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal">22{'\u00B0'}C</p>
                <p className="text-sm text-taupe">Partly cloudy</p>
              </div>
            </div>
            <p className="text-taupe text-sm">
              Perfect day for light layers!
            </p>
          </div>
        </Card>

        {/* Day Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-beige rounded-full p-1 inline-flex">
            <button
              onClick={() => setCurrentDay('today')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                currentDay === 'today'
                  ? 'bg-rose text-white'
                  : 'text-taupe hover:text-charcoal'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDay('tomorrow')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                currentDay === 'tomorrow'
                  ? 'bg-rose text-white'
                  : 'text-taupe hover:text-charcoal'
              }`}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-8">
          {/* Outfit Display Section */}
          <Card variant="elevated" className="w-full max-w-md">
            <div className="flex flex-col items-center py-4">
              <h2 className="text-lg font-semibold text-charcoal mb-6">
                Your Outfit for {currentDay === 'today' ? 'Today' : 'Tomorrow'}
              </h2>

              <OutfitDisplay
                outerwear={selectedOutfit.outerwear}
                top={selectedOutfit.top}
                bottom={selectedOutfit.bottom}
                shoes={selectedOutfit.shoes}
                onSlotClick={handleSlotClick}
              />

              <p className="text-sm text-taupe mt-6 text-center">
                Tap any slot to select clothing from your wardrobe
              </p>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Shuffle
                </Button>
                <Button className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  Surprise Me!
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="w-full max-w-md grid grid-cols-2 gap-4">
            <Link href="/wardrobe">
              <Card className="flex flex-col items-center gap-2 py-6 hover:bg-blush/30 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blush rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <span className="font-medium text-charcoal">Wardrobe</span>
                <span className="text-xs text-taupe">Manage clothes</span>
              </Card>
            </Link>
            <Link href="/wardrobe">
              <Card className="flex flex-col items-center gap-2 py-6 hover:bg-blush/30 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-blush rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <span className="font-medium text-charcoal">Add Item</span>
                <span className="text-xs text-taupe">Scan or upload</span>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
            <NavItem href="/home" icon="home" label="Home" active />
            <NavItem href="/wardrobe" icon="wardrobe" label="Wardrobe" />
            <NavItem href="/profile" icon="profile" label="Profile" />
          </div>
        </div>
      </nav>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string
  icon: string
  label: string
  active?: boolean
}) {
  const icons = {
    home: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    wardrobe: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    profile: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  }

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 ${
        active ? 'text-rose' : 'text-taupe hover:text-charcoal'
      }`}
    >
      {icons[icon as keyof typeof icons]}
      <span className="text-xs font-medium">{label}</span>
    </Link>
  )
}
