'use client'

import { useState, useRef } from 'react'
import { Button, Card, Input } from '@/components/ui'
import { AvatarStylePicker } from '@/components/avatar'
import type { ClothingStyle, Season, Occasion, PatternType } from '@/types'

interface AddClothingModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: ClothingFormData) => Promise<void> | void
}

export interface ClothingFormData {
  imageUrl: string
  type: 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY'
  styles: ClothingStyle[]
  seasons: Season[]
  occasions: Occasion[]
  primaryColor: string
  pattern: PatternType
  brand?: string
  avatarStyle?: string
}

const CLOTHING_TYPES = [
  { value: 'TOP', label: 'Top', icon: '👕' },
  { value: 'BOTTOM', label: 'Bottom', icon: '👖' },
  { value: 'DRESS', label: 'Dress', icon: '👗' },
  { value: 'OUTERWEAR', label: 'Outerwear', icon: '🧥' },
  { value: 'SHOES', label: 'Shoes', icon: '👟' },
  { value: 'ACCESSORY', label: 'Accessory', icon: '💍' },
] as const

const STYLES: ClothingStyle[] = ['cozy', 'casual', 'formal', 'sporty', 'festive']
const SEASONS: Season[] = ['winter', 'spring', 'summer', 'fall']
const OCCASIONS: Occasion[] = ['work', 'weekend', 'date-night', 'party', 'workout']
const PATTERNS: PatternType[] = ['solid', 'stripes', 'plaid', 'floral', 'polka-dots', 'geometric']

export default function AddClothingModal({
  isOpen,
  onClose,
  onAdd,
}: AddClothingModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ClothingFormData>({
    imageUrl: '',
    type: 'TOP',
    styles: [],
    seasons: [],
    occasions: [],
    primaryColor: '#4A4A4A',
    pattern: 'solid',
    brand: '',
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewImage(result)
        setFormData((prev) => ({ ...prev, imageUrl: result }))
        // Auto-detect dominant color (simplified)
        detectDominantColor(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const detectDominantColor = (imageUrl: string) => {
    // Simplified color detection - in production, use a proper library
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1
      canvas.height = 1
      ctx.drawImage(img, 0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      setFormData((prev) => ({ ...prev, primaryColor: hex }))
    }
    img.src = imageUrl
  }

  const toggleArrayValue = <T extends string>(
    array: T[],
    value: T,
    setter: (fn: (prev: ClothingFormData) => ClothingFormData) => void,
    field: keyof ClothingFormData
  ) => {
    setter((prev) => {
      const currentArray = prev[field] as T[]
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter((v) => v !== value)
          : [...currentArray, value],
      }
    })
  }

  const handleSubmit = async () => {
    const data: ClothingFormData = {
      ...formData,
      styles: formData.styles.length > 0 ? formData.styles : ['casual'],
      seasons: formData.seasons.length > 0 ? formData.seasons : ['spring', 'summer', 'fall', 'winter'],
      occasions: formData.occasions.length > 0 ? formData.occasions : ['weekend'],
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      await onAdd(data)
      resetForm()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to add item')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({
      imageUrl: '',
      type: 'TOP',
      styles: [],
      seasons: [],
      occasions: [],
      primaryColor: '#4A4A4A',
      pattern: 'solid',
      brand: '',
    })
    setPreviewImage(null)
    setSubmitError(null)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card variant="elevated" className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-charcoal">Add Clothing Item</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-beige rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        {submitError && (
          <div className="mb-4 rounded-lg border border-rose/30 bg-blush/40 px-4 py-2 text-sm text-charcoal">
            {submitError}
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full ${
                s <= step ? 'bg-rose' : 'bg-beige'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Photo */}
        {step === 1 && (
          <div className="space-y-6">
            <p className="text-taupe">
              Take a photo of your clothing item or upload from your gallery.
            </p>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                aspect-square rounded-xl border-2 border-dashed cursor-pointer
                flex flex-col items-center justify-center gap-4 transition-colors
                ${previewImage ? 'border-transparent' : 'border-rose/30 hover:border-rose/50 hover:bg-blush/30'}
              `}
            >
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <>
                  <div className="w-16 h-16 bg-blush rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-rose" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <p className="text-taupe text-sm">Click to upload a photo</p>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {previewImage && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setPreviewImage(null)
                    setFormData((prev) => ({ ...prev, imageUrl: '' }))
                  }}
                >
                  Remove
                </Button>
                <Button className="flex-1" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            )}

            {!previewImage && (
              <Button className="w-full" onClick={() => setStep(2)}>
                Skip photo for now
              </Button>
            )}
          </div>
        )}

        {/* Step 2: Type & Color */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Type of clothing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CLOTHING_TYPES.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    onClick={() => setFormData((prev) => ({ ...prev, type: value }))}
                    className={`p-3 rounded-lg text-center transition-all ${
                      formData.type === value
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{icon}</span>
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, primaryColor: e.target.value }))
                  }
                  className="w-16 h-16 rounded-lg cursor-pointer border-2 border-beige"
                />
                <div className="flex-1">
                  <p className="text-sm text-charcoal font-medium">
                    {formData.primaryColor.toUpperCase()}
                  </p>
                  <p className="text-xs text-taupe">
                    Click to adjust or use the detected color
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Pattern
              </label>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => setFormData((prev) => ({ ...prev, pattern }))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.pattern === pattern
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    {pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Categories */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Style (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      toggleArrayValue(formData.styles, style, setFormData, 'styles')
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.styles.includes(style)
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    {style.charAt(0).toUpperCase() + style.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Season (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    onClick={() =>
                      toggleArrayValue(formData.seasons, season, setFormData, 'seasons')
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.seasons.includes(season)
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-3">
                Occasion (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {OCCASIONS.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() =>
                      toggleArrayValue(formData.occasions, occasion, setFormData, 'occasions')
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.occasions.includes(occasion)
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    {occasion
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Brand (optional)"
              placeholder="e.g., Zara, H&M"
              value={formData.brand}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
            />

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Avatar Style */}
        {step === 4 && (
          <div className="space-y-6">
            <AvatarStylePicker
              clothingType={formData.type}
              primaryColor={formData.primaryColor}
              pattern={formData.pattern}
              onSelect={(style) => setFormData((prev) => ({ ...prev, avatarStyle: style }))}
              selectedStyle={formData.avatarStyle}
            />

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add to Wardrobe'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
