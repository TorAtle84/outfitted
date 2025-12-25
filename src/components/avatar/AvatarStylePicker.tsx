'use client'

import { useState, useMemo } from 'react'
import AvatarDisplay from './AvatarDisplay'
import { useAvatar } from '@/hooks/useAvatar'
import type {
  AvatarTopStyle,
  AvatarBottomStyle,
  AvatarDressStyle,
  AvatarShoeStyle,
  PatternType,
} from '@/types'

interface AvatarStylePickerProps {
  clothingType: 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY'
  primaryColor: string
  pattern: PatternType
  onSelect: (style: string) => void
  selectedStyle?: string
}

// Mapping from clothing types to avatar styles
const TOP_STYLES: { style: AvatarTopStyle; label: string }[] = [
  { style: 'tshirt', label: 'T-Shirt' },
  { style: 'blouse', label: 'Blouse' },
  { style: 'sweater', label: 'Sweater' },
  { style: 'hoodie', label: 'Hoodie' },
  { style: 'tank-top', label: 'Tank Top' },
  { style: 'polo', label: 'Polo' },
  { style: 'button-shirt', label: 'Button Shirt' },
  { style: 'crop-top', label: 'Crop Top' },
  { style: 'cardigan', label: 'Cardigan' },
]

const OUTERWEAR_STYLES: { style: AvatarTopStyle; label: string }[] = [
  { style: 'blazer', label: 'Blazer' },
  { style: 'jacket', label: 'Jacket' },
  { style: 'coat', label: 'Coat' },
  { style: 'cardigan', label: 'Cardigan' },
]

const BOTTOM_STYLES: { style: AvatarBottomStyle; label: string }[] = [
  { style: 'jeans', label: 'Jeans' },
  { style: 'trousers', label: 'Trousers' },
  { style: 'shorts', label: 'Shorts' },
  { style: 'skirt-short', label: 'Short Skirt' },
  { style: 'skirt-midi', label: 'Midi Skirt' },
  { style: 'skirt-long', label: 'Long Skirt' },
  { style: 'leggings', label: 'Leggings' },
  { style: 'joggers', label: 'Joggers' },
  { style: 'dress-pants', label: 'Dress Pants' },
]

const DRESS_STYLES: { style: AvatarDressStyle; label: string }[] = [
  { style: 'casual-dress', label: 'Casual Dress' },
  { style: 'formal-dress', label: 'Formal Dress' },
  { style: 'maxi-dress', label: 'Maxi Dress' },
  { style: 'mini-dress', label: 'Mini Dress' },
  { style: 'sundress', label: 'Sundress' },
]

const SHOE_STYLES: { style: AvatarShoeStyle; label: string }[] = [
  { style: 'sneakers', label: 'Sneakers' },
  { style: 'boots', label: 'Boots' },
  { style: 'heels', label: 'Heels' },
  { style: 'flats', label: 'Flats' },
  { style: 'sandals', label: 'Sandals' },
  { style: 'loafers', label: 'Loafers' },
]

function getStyleOptions(clothingType: string): { style: string; label: string }[] {
  switch (clothingType) {
    case 'TOP':
      return TOP_STYLES
    case 'OUTERWEAR':
      return OUTERWEAR_STYLES
    case 'BOTTOM':
      return BOTTOM_STYLES
    case 'DRESS':
      return DRESS_STYLES
    case 'SHOES':
      return SHOE_STYLES
    default:
      return []
  }
}

function getSuggestedStyles(clothingType: string): { style: string; label: string }[] {
  const allStyles = getStyleOptions(clothingType)
  // Return first 3 as suggestions, or all if less than 3
  return allStyles.slice(0, 3)
}

export default function AvatarStylePicker({
  clothingType,
  primaryColor,
  pattern,
  onSelect,
  selectedStyle,
}: AvatarStylePickerProps) {
  const { avatar } = useAvatar()
  const [showAllStyles, setShowAllStyles] = useState(false)

  const suggestedStyles = useMemo(() => getSuggestedStyles(clothingType), [clothingType])
  const allStyles = useMemo(() => getStyleOptions(clothingType), [clothingType])

  // Don't show picker for accessories (no avatar representation)
  if (clothingType === 'ACCESSORY') {
    return (
      <div className="text-center py-8 text-taupe">
        <p>Accessories don&apos;t have avatar styles.</p>
        <p className="text-sm mt-2">Your accessory will be added to your wardrobe.</p>
      </div>
    )
  }

  const displayStyles = showAllStyles ? allStyles : suggestedStyles

  // Build outfit object based on clothing type
  const getOutfitForStyle = (style: string) => {
    const outfit: {
      top?: { style: AvatarTopStyle; color: string; pattern?: PatternType }
      bottom?: { style: AvatarBottomStyle; color: string; pattern?: PatternType }
      dress?: { style: AvatarDressStyle; color: string; pattern?: PatternType }
      shoes?: { style: AvatarShoeStyle; color: string }
      outerwear?: { style: AvatarTopStyle; color: string }
    } = {}

    switch (clothingType) {
      case 'TOP':
        outfit.top = { style: style as AvatarTopStyle, color: primaryColor, pattern }
        outfit.bottom = { style: 'jeans', color: '#1a365d' }
        break
      case 'OUTERWEAR':
        outfit.outerwear = { style: style as AvatarTopStyle, color: primaryColor }
        outfit.top = { style: 'tshirt', color: '#ffffff' }
        outfit.bottom = { style: 'jeans', color: '#1a365d' }
        break
      case 'BOTTOM':
        outfit.bottom = { style: style as AvatarBottomStyle, color: primaryColor, pattern }
        outfit.top = { style: 'tshirt', color: '#ffffff' }
        break
      case 'DRESS':
        outfit.dress = { style: style as AvatarDressStyle, color: primaryColor, pattern }
        break
      case 'SHOES':
        outfit.shoes = { style: style as AvatarShoeStyle, color: primaryColor }
        outfit.top = { style: 'tshirt', color: '#ffffff' }
        outfit.bottom = { style: 'jeans', color: '#1a365d' }
        break
    }

    return outfit
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-charcoal mb-1">
          How should this look on your avatar?
        </h3>
        <p className="text-sm text-taupe">
          Select the style that best matches your item
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {displayStyles.map(({ style, label }) => {
          const isSelected = selectedStyle === style
          const outfit = getOutfitForStyle(style)

          return (
            <button
              key={style}
              onClick={() => onSelect(style)}
              className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                isSelected
                  ? 'bg-rose/10 ring-2 ring-rose'
                  : 'bg-beige/50 hover:bg-blush/50'
              }`}
            >
              <div className="w-20 h-24 mb-2">
                <AvatarDisplay
                  skinTone={avatar?.skinTone}
                  hairColor={avatar?.hairColor}
                  hairHighlights={avatar?.hairHighlights}
                  hairStyle={avatar?.hairStyle}
                  eyeShape={avatar?.eyeShape}
                  eyeColor={avatar?.eyeColor}
                  eyebrowStyle={avatar?.eyebrowStyle}
                  noseType={avatar?.noseType}
                  mouthExpression={avatar?.mouthExpression}
                  facialHair={avatar?.facialHair}
                  faceShape={avatar?.faceShape}
                  bodyType={avatar?.bodyType}
                  height={avatar?.height}
                  accessories={avatar?.accessories}
                  outfit={outfit}
                  size="xs"
                />
              </div>
              <span
                className={`text-xs font-medium ${
                  isSelected ? 'text-rose' : 'text-charcoal'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>

      {allStyles.length > 3 && (
        <button
          onClick={() => setShowAllStyles(!showAllStyles)}
          className="w-full text-center text-sm text-rose hover:text-rose/80 transition-colors py-2"
        >
          {showAllStyles ? 'Show less' : `Show all ${allStyles.length} styles`}
        </button>
      )}
    </div>
  )
}
