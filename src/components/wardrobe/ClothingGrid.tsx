'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

interface ClothingItem {
  id: string
  imageUrl: string
  type: string
  styles: string[]
  seasons: string[]
  occasions: string[]
  primaryColor: string
  pattern?: string
}

interface ClothingGridProps {
  items: ClothingItem[]
  onItemClick?: (item: ClothingItem) => void
  onItemDelete?: (id: string) => void
}

export default function ClothingGrid({
  items,
  onItemClick,
  onItemDelete,
}: ClothingGridProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleItemClick = (item: ClothingItem) => {
    setSelectedId(selectedId === item.id ? null : item.id)
    onItemClick?.(item)
  }

  const getTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'TOP':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L8 6V8H6L4 12V20H8V14H16V20H20V12L18 8H16V6L12 2ZM10 8V6.5L12 4.5L14 6.5V8H10Z" />
          </svg>
        )
      case 'BOTTOM':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4H20V8L18 20H14L12 12L10 20H6L4 8V4ZM6 6V7.5L7.5 18H9.5L12 8L14.5 18H16.5L18 7.5V6H6Z" />
          </svg>
        )
      case 'DRESS':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L8 6L6 8V10L4 20H10L11 14H13L14 20H20L18 10V8L16 6L12 2ZM10 8L12 4L14 8L16 10V11L14 12H10L8 11V10L10 8Z" />
          </svg>
        )
      case 'OUTERWEAR':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L6 8V10H4V20H10V14H14V20H20V10H18V8L12 2ZM8 10V8.5L12 4.5L16 8.5V10H8Z" />
          </svg>
        )
      case 'SHOES':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 18H22V20H2V18ZM4 16H20L22 18H2L4 16ZM20 12L22 14V16H2V14L4 12L6 10L10 8H14L18 10L20 12ZM10 10L8 11L6 13V14H18V13L16 11L14 10H10Z" />
          </svg>
        )
      case 'ACCESSORY':
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
        )
      default:
        return (
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        )
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          padding="none"
          className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
            selectedId === item.id ? 'ring-2 ring-rose' : ''
          }`}
          onClick={() => handleItemClick(item)}
        >
          {/* Image or Placeholder */}
          <div
            className="aspect-square flex items-center justify-center"
            style={{ backgroundColor: item.primaryColor + '20' }}
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.type}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="text-center"
                style={{ color: item.primaryColor }}
              >
                {getTypeIcon(item.type)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-charcoal capitalize">
                {item.type.toLowerCase()}
              </span>
              <div
                className="w-4 h-4 rounded-full border border-beige"
                style={{ backgroundColor: item.primaryColor }}
                title={item.primaryColor}
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {item.styles.slice(0, 2).map((style) => (
                <span
                  key={style}
                  className="px-2 py-0.5 bg-blush text-xs text-taupe rounded-full"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Actions (shown when selected) */}
          {selectedId === item.id && (
            <div className="px-3 pb-3 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  // Edit logic here
                }}
                className="flex-1 py-1.5 text-xs bg-beige hover:bg-blush rounded-lg text-charcoal transition-colors"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onItemDelete?.(item.id)
                }}
                className="flex-1 py-1.5 text-xs bg-red-50 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
