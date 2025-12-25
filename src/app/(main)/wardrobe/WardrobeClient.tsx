'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { Button, Card } from '@/components/ui'
import AddClothingModal, { type ClothingFormData } from '@/components/wardrobe/AddClothingModal'
import ClothingGrid from '@/components/wardrobe/ClothingGrid'
import type { ClothingStyle, Season, Occasion, PatternType } from '@/types'

interface WardrobeClientProps {
  user: User
}

type ClothingFilter = 'all' | 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory'

interface ClothingItem extends ClothingFormData {
  id: string
}

// Mock data for demonstration
const MOCK_CLOTHES: ClothingItem[] = [
  {
    id: '1',
    imageUrl: '',
    type: 'TOP',
    styles: ['casual'] as ClothingStyle[],
    seasons: ['spring', 'summer'] as Season[],
    occasions: ['weekend'] as Occasion[],
    primaryColor: '#4169E1',
    pattern: 'solid' as PatternType,
  },
  {
    id: '2',
    imageUrl: '',
    type: 'BOTTOM',
    styles: ['casual'] as ClothingStyle[],
    seasons: ['spring', 'summer', 'fall'] as Season[],
    occasions: ['work', 'weekend'] as Occasion[],
    primaryColor: '#4A4A4A',
    pattern: 'solid' as PatternType,
  },
  {
    id: '3',
    imageUrl: '',
    type: 'SHOES',
    styles: ['casual'] as ClothingStyle[],
    seasons: ['spring', 'summer', 'fall'] as Season[],
    occasions: ['weekend'] as Occasion[],
    primaryColor: '#FFFFFF',
    pattern: 'solid' as PatternType,
  },
]

export default function WardrobeClient({ user }: WardrobeClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<ClothingFilter>('all')
  const [activeStyleFilter, setActiveStyleFilter] = useState<ClothingStyle | null>(null)
  const [activeSeasonFilter, setActiveSeasonFilter] = useState<Season | null>(null)
  const [clothes, setClothes] = useState(MOCK_CLOTHES)

  const filters: { value: ClothingFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'top', label: 'Tops' },
    { value: 'bottom', label: 'Bottoms' },
    { value: 'dress', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessory', label: 'Accessories' },
  ]

  const styleFilters: ClothingStyle[] = ['cozy', 'casual', 'formal', 'sporty', 'festive']
  const seasonFilters: Season[] = ['winter', 'spring', 'summer', 'fall']

  const filteredClothes = clothes.filter((item) => {
    if (activeFilter !== 'all' && item.type.toLowerCase() !== activeFilter) {
      return false
    }
    if (activeStyleFilter && !item.styles.includes(activeStyleFilter)) {
      return false
    }
    if (activeSeasonFilter && !item.seasons.includes(activeSeasonFilter)) {
      return false
    }
    return true
  })

  const handleAddClothing = (newItem: ClothingFormData) => {
    setClothes((prev) => [...prev, { ...newItem, id: Date.now().toString() }])
    setIsAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Header */}
      <header className="bg-beige border-b border-beige sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Link href="/home">
                <svg className="w-6 h-6 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-charcoal">My Wardrobe</h1>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add
            </Button>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setActiveFilter(value)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeFilter === value
                    ? 'bg-rose text-white'
                    : 'bg-cream text-charcoal hover:bg-blush'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Additional Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex gap-2">
            <span className="text-sm text-taupe self-center">Style:</span>
            {styleFilters.map((style) => (
              <button
                key={style}
                onClick={() => setActiveStyleFilter(activeStyleFilter === style ? null : style)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeStyleFilter === style
                    ? 'bg-sage text-charcoal'
                    : 'bg-beige text-taupe hover:bg-blush'
                }`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-sm text-taupe self-center">Season:</span>
            {seasonFilters.map((season) => (
              <button
                key={season}
                onClick={() => setActiveSeasonFilter(activeSeasonFilter === season ? null : season)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  activeSeasonFilter === season
                    ? 'bg-sage text-charcoal'
                    : 'bg-beige text-taupe hover:bg-blush'
                }`}
              >
                {season.charAt(0).toUpperCase() + season.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <Card className="mb-6">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-charcoal">{clothes.length}</p>
              <p className="text-sm text-taupe">Total Items</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">
                {clothes.filter((c) => c.type === 'TOP').length}
              </p>
              <p className="text-sm text-taupe">Tops</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">
                {clothes.filter((c) => c.type === 'BOTTOM').length}
              </p>
              <p className="text-sm text-taupe">Bottoms</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal">
                {clothes.filter((c) => c.type === 'SHOES').length}
              </p>
              <p className="text-sm text-taupe">Shoes</p>
            </div>
          </div>
        </Card>

        {/* Clothing Grid */}
        {filteredClothes.length > 0 ? (
          <ClothingGrid items={filteredClothes} />
        ) : (
          <Card className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-blush rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-rose/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-charcoal mb-2">
              {activeFilter === 'all' ? 'Your wardrobe is empty' : `No ${activeFilter}s yet`}
            </h3>
            <p className="text-taupe mb-4">
              Start building your digital closet by adding your first item.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              Add your first item
            </Button>
          </Card>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-around">
            <NavItem href="/home" icon="home" label="Home" />
            <NavItem href="/wardrobe" icon="wardrobe" label="Wardrobe" active />
            <NavItem href="/profile" icon="profile" label="Profile" />
          </div>
        </div>
      </nav>

      {/* Add Clothing Modal */}
      <AddClothingModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddClothing}
      />
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
