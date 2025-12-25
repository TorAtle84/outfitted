'use client'

import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import AvatarDisplay from './AvatarDisplay'
import type { AvatarCustomization, BodyType, HairStyle, FaceShape } from '@/types'

interface AvatarCreatorProps {
  initialData?: Partial<AvatarCustomization>
  onSave?: (data: AvatarCustomization) => void
  onCancel?: () => void
}

const BODY_TYPES: { value: BodyType; label: string }[] = [
  { value: 'slim', label: 'Slim' },
  { value: 'average', label: 'Average' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'curvy', label: 'Curvy' },
  { value: 'plus', label: 'Plus' },
]

const HAIR_STYLES: { value: HairStyle; label: string }[] = [
  { value: 'short-straight', label: 'Short Straight' },
  { value: 'short-curly', label: 'Short Curly' },
  { value: 'medium-straight', label: 'Medium Straight' },
  { value: 'medium-wavy', label: 'Medium Wavy' },
  { value: 'long-straight', label: 'Long Straight' },
  { value: 'long-wavy', label: 'Long Wavy' },
  { value: 'bob', label: 'Bob' },
  { value: 'ponytail', label: 'Ponytail' },
  { value: 'bun', label: 'Bun' },
  { value: 'braided', label: 'Braided' },
  { value: 'pixie', label: 'Pixie' },
  { value: 'afro', label: 'Afro' },
  { value: 'buzz', label: 'Buzz' },
  { value: 'bald', label: 'Bald' },
]

const FACE_SHAPES: { value: FaceShape; label: string }[] = [
  { value: 'oval', label: 'Oval' },
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'heart', label: 'Heart' },
  { value: 'oblong', label: 'Oblong' },
  { value: 'diamond', label: 'Diamond' },
]

const SKIN_TONES = [
  '#FFDFC4', '#F0D5BE', '#E8C4A8', '#D4A574', '#C68642',
  '#8D5524', '#6B4423', '#4A3728', '#3A2A1D', '#2C1810',
]

const HAIR_COLORS = [
  '#000000', '#2C1810', '#4A3728', '#8B4513', '#A0522D',
  '#CD853F', '#DEB887', '#F5DEB3', '#FFD700', '#FF6347',
  '#DC143C', '#8B008B', '#4169E1', '#228B22',
]

const EYE_COLORS = [
  '#2C1810', '#4A3728', '#6B4423', '#8B4513', '#228B22',
  '#4169E1', '#6495ED', '#808080', '#4682B4',
]

export default function AvatarCreator({
  initialData,
  onSave,
  onCancel,
}: AvatarCreatorProps) {
  const [activeTab, setActiveTab] = useState<'body' | 'face' | 'hair' | 'accessories'>('body')
  const [avatar, setAvatar] = useState<AvatarCustomization>({
    bodyType: initialData?.bodyType || 'average',
    height: initialData?.height || 165,
    skinTone: initialData?.skinTone || '#E8C4A8',
    hairStyle: initialData?.hairStyle || 'long-wavy',
    hairColor: initialData?.hairColor || '#2C1810',
    hairHighlights: initialData?.hairHighlights,
    eyeColor: initialData?.eyeColor || '#4A3728',
    faceShape: initialData?.faceShape || 'oval',
    accessories: initialData?.accessories || [],
  })

  const updateAvatar = (updates: Partial<AvatarCustomization>) => {
    setAvatar((prev) => ({ ...prev, ...updates }))
  }

  const handleSave = () => {
    onSave?.(avatar)
  }

  const tabs = [
    { id: 'body', label: 'Body' },
    { id: 'face', label: 'Face' },
    { id: 'hair', label: 'Hair' },
    { id: 'accessories', label: 'Accessories' },
  ] as const

  return (
    <div className="min-h-screen bg-cream p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-charcoal text-center mb-6">
          Create Your Avatar
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview */}
          <Card variant="elevated" className="flex items-center justify-center py-8">
            <AvatarDisplay
              skinTone={avatar.skinTone}
              hairColor={avatar.hairColor}
              hairStyle={avatar.hairStyle}
              eyeColor={avatar.eyeColor}
              bodyType={avatar.bodyType}
              size="lg"
            />
          </Card>

          {/* Controls */}
          <Card variant="elevated">
            {/* Tabs */}
            <div className="flex border-b border-beige mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-rose border-b-2 border-rose'
                      : 'text-taupe hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'body' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Body Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {BODY_TYPES.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => updateAvatar({ bodyType: value })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            avatar.bodyType === value
                              ? 'bg-rose text-white'
                              : 'bg-beige text-charcoal hover:bg-blush'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Height: {avatar.height} cm
                    </label>
                    <input
                      type="range"
                      min="140"
                      max="200"
                      value={avatar.height}
                      onChange={(e) => updateAvatar({ height: parseInt(e.target.value) })}
                      className="w-full h-2 bg-beige rounded-lg appearance-none cursor-pointer accent-rose"
                    />
                    <div className="flex justify-between text-xs text-taupe mt-1">
                      <span>140 cm</span>
                      <span>200 cm</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Skin Tone
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TONES.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar({ skinTone: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            avatar.skinTone === color
                              ? 'border-rose scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Skin tone ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'face' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Face Shape
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FACE_SHAPES.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => updateAvatar({ faceShape: value })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            avatar.faceShape === value
                              ? 'bg-rose text-white'
                              : 'bg-beige text-charcoal hover:bg-blush'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Eye Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {EYE_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar({ eyeColor: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            avatar.eyeColor === color
                              ? 'border-rose scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Eye color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'hair' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Hair Style
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {HAIR_STYLES.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => updateAvatar({ hairStyle: value })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            avatar.hairStyle === value
                              ? 'bg-rose text-white'
                              : 'bg-beige text-charcoal hover:bg-blush'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-3">
                      Hair Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color}
                          onClick={() => updateAvatar({ hairColor: color })}
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            avatar.hairColor === color
                              ? 'border-rose scale-110'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Hair color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'accessories' && (
                <div className="text-center py-8">
                  <p className="text-taupe">
                    Accessories coming soon! Add glasses, earrings, watches, and more.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-beige">
              {onCancel && (
                <Button variant="outline" className="flex-1" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button className="flex-1" onClick={handleSave}>
                Save Avatar
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
