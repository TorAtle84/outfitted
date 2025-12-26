'use client'

import { Card } from '@/components/ui'

interface ClothingItem {
  id: string
  imageUrl: string
  type: string
  primaryColor: string
}

interface OutfitDisplayProps {
  outerwear?: ClothingItem | null
  top?: ClothingItem | null
  bottom?: ClothingItem | null
  shoes?: ClothingItem | null
  onSlotClick?: (slot: 'outerwear' | 'top' | 'bottom' | 'shoes') => void
  className?: string
}

export default function OutfitDisplay({
  outerwear,
  top,
  bottom,
  shoes,
  onSlotClick,
  className = '',
}: OutfitDisplayProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Outerwear slot - only shown when there's outerwear or on click */}
      <OutfitSlot
        item={outerwear}
        label="Outerwear"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3L4 7v10l8 4 8-4V7l-8-4z" />
            <path d="M4 7l8 4 8-4" />
            <path d="M12 11v10" />
          </svg>
        }
        onClick={() => onSlotClick?.('outerwear')}
        size="md"
      />

      {/* Top slot */}
      <OutfitSlot
        item={top}
        label="Top"
        icon={
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3L8 5v2l4-1 4 1V5l-4-2z" />
            <path d="M8 5L4 7v4l4-2V5z" />
            <path d="M16 5l4 2v4l-4-2V5z" />
            <path d="M4 11v8l8 2 8-2v-8l-4 2v6l-4 1-4-1v-6l-4-2z" />
          </svg>
        }
        onClick={() => onSlotClick?.('top')}
        size="lg"
      />

      {/* Bottom slot */}
      <OutfitSlot
        item={bottom}
        label="Bottom"
        icon={
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2h12l1 8-7 12-7-12 1-8z" />
            <path d="M12 2v20" />
          </svg>
        }
        onClick={() => onSlotClick?.('bottom')}
        size="lg"
      />

      {/* Shoes slot */}
      <OutfitSlot
        item={shoes}
        label="Shoes"
        icon={
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 18h20l-2-6H8l-4 2-2 4z" />
            <path d="M8 12l2-6 4-1 4 2 2 5" />
          </svg>
        }
        onClick={() => onSlotClick?.('shoes')}
        size="md"
      />
    </div>
  )
}

interface OutfitSlotProps {
  item?: ClothingItem | null
  label: string
  icon: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
}

function OutfitSlot({ item, label, icon, onClick, size = 'md' }: OutfitSlotProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }

  const hasItem = item && item.imageUrl

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]} rounded-xl overflow-hidden
        transition-all duration-200 ease-in-out
        ${hasItem
          ? 'shadow-md hover:shadow-lg hover:scale-105'
          : 'border-2 border-dashed border-rose/30 hover:border-rose/50 hover:bg-blush/30'
        }
        focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2
      `}
    >
      {hasItem ? (
        <img
          src={item.imageUrl}
          alt={label}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-blush/20">
          <div className="text-rose/40">{icon}</div>
          <span className="text-xs text-taupe font-medium">{label}</span>
        </div>
      )}
    </button>
  )
}
