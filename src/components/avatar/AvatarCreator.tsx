'use client'

import { useState } from 'react'
import { Button, Card } from '@/components/ui'
import AvatarDisplay from './AvatarDisplay'
import type {
  AccessoryType,
  AvatarCustomization,
  BodyType,
  EyebrowStyle,
  EyeShape,
  FaceShape,
  FacialHairType,
  HairStyle,
  MouthExpression,
  NoseType,
} from '@/types'

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
  { value: 'medium-curly', label: 'Medium Curly' },
  { value: 'medium-wavy', label: 'Medium Wavy' },
  { value: 'long-straight', label: 'Long Straight' },
  { value: 'long-curly', label: 'Long Curly' },
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

const EYE_SHAPES: { value: EyeShape; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'round', label: 'Round' },
  { value: 'almond', label: 'Almond' },
  { value: 'upturned', label: 'Upturned' },
  { value: 'downturned', label: 'Downturned' },
  { value: 'hooded', label: 'Hooded' },
]

const EYEBROW_STYLES: { value: EyebrowStyle; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'thick', label: 'Thick' },
  { value: 'thin', label: 'Thin' },
  { value: 'arched', label: 'Arched' },
  { value: 'straight', label: 'Straight' },
  { value: 'rounded', label: 'Rounded' },
]

const NOSE_TYPES: { value: NoseType; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'small', label: 'Small' },
  { value: 'wide', label: 'Wide' },
  { value: 'pointed', label: 'Pointed' },
  { value: 'button', label: 'Button' },
  { value: 'roman', label: 'Roman' },
]

const MOUTH_EXPRESSIONS: { value: MouthExpression; label: string }[] = [
  { value: 'smile', label: 'Smile' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'serious', label: 'Serious' },
  { value: 'laugh', label: 'Laugh' },
  { value: 'slight-smile', label: 'Slight Smile' },
]

const FACIAL_HAIR_TYPES: { value: FacialHairType | 'none'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'stubble', label: 'Stubble' },
  { value: 'short-beard', label: 'Short Beard' },
  { value: 'full-beard', label: 'Full Beard' },
  { value: 'goatee', label: 'Goatee' },
  { value: 'mustache', label: 'Mustache' },
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

const ACCESSORY_OPTIONS: { category: string; items: { value: AccessoryType; label: string }[] }[] = [
  {
    category: 'Glasses',
    items: [
      { value: 'glasses-round', label: 'Round' },
      { value: 'glasses-square', label: 'Square' },
      { value: 'glasses-cat-eye', label: 'Cat-eye' },
      { value: 'glasses-aviator', label: 'Aviator' },
      { value: 'sunglasses', label: 'Sunglasses' },
    ],
  },
  {
    category: 'Earrings',
    items: [
      { value: 'earrings-stud', label: 'Stud' },
      { value: 'earrings-hoop', label: 'Hoop' },
      { value: 'earrings-drop', label: 'Drop' },
    ],
  },
  {
    category: 'Necklaces',
    items: [
      { value: 'necklace-chain', label: 'Chain' },
      { value: 'necklace-pendant', label: 'Pendant' },
      { value: 'necklace-choker', label: 'Choker' },
    ],
  },
  {
    category: 'Wrist',
    items: [
      { value: 'watch-classic', label: 'Classic Watch' },
      { value: 'watch-smart', label: 'Smart Watch' },
      { value: 'bracelet', label: 'Bracelet' },
    ],
  },
  {
    category: 'Hats',
    items: [
      { value: 'hat-beanie', label: 'Beanie' },
      { value: 'hat-cap', label: 'Cap' },
      { value: 'hat-fedora', label: 'Fedora' },
    ],
  },
]

const ACCESSORY_CATEGORY: Record<AccessoryType, string> = {
  'glasses-round': 'Glasses',
  'glasses-square': 'Glasses',
  'glasses-cat-eye': 'Glasses',
  'glasses-aviator': 'Glasses',
  'sunglasses': 'Glasses',
  'earrings-stud': 'Earrings',
  'earrings-hoop': 'Earrings',
  'earrings-drop': 'Earrings',
  'necklace-chain': 'Necklaces',
  'necklace-pendant': 'Necklaces',
  'necklace-choker': 'Necklaces',
  'watch-classic': 'Wrist',
  'watch-smart': 'Wrist',
  bracelet: 'Wrist',
  'hat-beanie': 'Hats',
  'hat-cap': 'Hats',
  'hat-fedora': 'Hats',
}

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
    eyeShape: initialData?.eyeShape || 'default',
    eyeColor: initialData?.eyeColor || '#4A3728',
    eyebrowStyle: initialData?.eyebrowStyle || 'default',
    noseType: initialData?.noseType || 'default',
    mouthExpression: initialData?.mouthExpression || 'smile',
    facialHair: initialData?.facialHair,
    faceShape: initialData?.faceShape || 'oval',
    accessories: initialData?.accessories || [],
    hasFreckles: initialData?.hasFreckles || false,
    hasBeautyMark: initialData?.hasBeautyMark || false,
  })

  const updateAvatar = (updates: Partial<AvatarCustomization>) => {
    setAvatar((prev) => ({ ...prev, ...updates }))
  }

  const toggleAccessory = (accessory: AccessoryType) => {
    setAvatar((prev) => {
      const category = ACCESSORY_CATEGORY[accessory]
      const withoutCategory = prev.accessories.filter((a) => ACCESSORY_CATEGORY[a] !== category)
      const isSelected = prev.accessories.includes(accessory)
      return {
        ...prev,
        accessories: isSelected ? withoutCategory : [...withoutCategory, accessory],
      }
    })
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
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Preview */}
      <Card variant="elevated" className="flex items-center justify-center py-8">
        <AvatarDisplay
          skinTone={avatar.skinTone}
          hairColor={avatar.hairColor}
          hairHighlights={avatar.hairHighlights}
          hairStyle={avatar.hairStyle}
          eyeShape={avatar.eyeShape}
          eyeColor={avatar.eyeColor}
          eyebrowStyle={avatar.eyebrowStyle}
          noseType={avatar.noseType}
          mouthExpression={avatar.mouthExpression}
          facialHair={avatar.facialHair}
          faceShape={avatar.faceShape}
          bodyType={avatar.bodyType}
          height={avatar.height}
          accessories={avatar.accessories}
          hasFreckles={avatar.hasFreckles}
          hasBeautyMark={avatar.hasBeautyMark}
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
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    value={avatar.skinTone}
                    onChange={(e) => updateAvatar({ skinTone: e.target.value })}
                    className="h-10 w-12 rounded-md border border-beige bg-white p-1"
                    aria-label="Pick skin tone"
                  />
                  <span className="text-xs text-taupe">{avatar.skinTone}</span>
                </div>
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
            <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
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
                  Eye Shape
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EYE_SHAPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateAvatar({ eyeShape: value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        avatar.eyeShape === value
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
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    value={avatar.eyeColor}
                    onChange={(e) => updateAvatar({ eyeColor: e.target.value })}
                    className="h-10 w-12 rounded-md border border-beige bg-white p-1"
                    aria-label="Pick eye color"
                  />
                  <span className="text-xs text-taupe">{avatar.eyeColor}</span>
                </div>
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

              <div>
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Eyebrows
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {EYEBROW_STYLES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateAvatar({ eyebrowStyle: value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        avatar.eyebrowStyle === value
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
                  Nose
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {NOSE_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateAvatar({ noseType: value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        avatar.noseType === value
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
                  Expression
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MOUTH_EXPRESSIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateAvatar({ mouthExpression: value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        avatar.mouthExpression === value
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
                  Facial Hair
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FACIAL_HAIR_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => updateAvatar({ facialHair: value === 'none' ? undefined : value })}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        (avatar.facialHair === value) || (value === 'none' && !avatar.facialHair)
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
                  Extras
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avatar.hasFreckles || false}
                      onChange={(e) => updateAvatar({ hasFreckles: e.target.checked })}
                      className="w-4 h-4 rounded border-beige text-rose focus:ring-rose"
                    />
                    <span className="text-sm text-charcoal">Freckles</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avatar.hasBeautyMark || false}
                      onChange={(e) => updateAvatar({ hasBeautyMark: e.target.checked })}
                      className="w-4 h-4 rounded border-beige text-rose focus:ring-rose"
                    />
                    <span className="text-sm text-charcoal">Beauty Mark</span>
                  </label>
                </div>
              </div>
            </div>
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
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="color"
                    value={avatar.hairColor}
                    onChange={(e) => updateAvatar({ hairColor: e.target.value })}
                    className="h-10 w-12 rounded-md border border-beige bg-white p-1"
                    aria-label="Pick hair color"
                  />
                  <span className="text-xs text-taupe">{avatar.hairColor}</span>
                </div>
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-charcoal">
                    Highlights
                  </label>
                  <button
                    type="button"
                    onClick={() => updateAvatar({ hairHighlights: avatar.hairHighlights ? undefined : '#DEB887' })}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      avatar.hairHighlights
                        ? 'bg-rose text-white'
                        : 'bg-beige text-charcoal hover:bg-blush'
                    }`}
                  >
                    {avatar.hairHighlights ? 'On' : 'Off'}
                  </button>
                </div>

                {avatar.hairHighlights && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={avatar.hairHighlights}
                      onChange={(e) => updateAvatar({ hairHighlights: e.target.value })}
                      className="h-10 w-12 rounded-md border border-beige bg-white p-1"
                      aria-label="Pick highlight color"
                    />
                    <span className="text-xs text-taupe">{avatar.hairHighlights}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateAvatar({ hairHighlights: undefined })}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'accessories' && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">Accessories</p>
                  <p className="text-xs text-taupe">
                    {avatar.accessories.length} selected
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => updateAvatar({ accessories: [] })}
                >
                  Clear
                </Button>
              </div>

              <div className="space-y-5">
                {ACCESSORY_OPTIONS.map((group) => (
                  <div key={group.category}>
                    <p className="text-sm font-medium text-charcoal mb-2">{group.category}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {group.items.map((item) => {
                        const selected = avatar.accessories.includes(item.value)
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => toggleAccessory(item.value)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                              selected
                                ? 'bg-rose text-white'
                                : 'bg-beige text-charcoal hover:bg-blush'
                            }`}
                          >
                            {item.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
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
  )
}
