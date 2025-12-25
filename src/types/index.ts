// Note: Prisma types will be available after running `npx prisma generate`
// For now, we define the types manually or import from @prisma/client

// Prisma enums (duplicated for now - will use generated types after prisma generate)
export type ClothingType = 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY'
export type Visibility = 'PUBLIC' | 'FRIENDS' | 'PRIVATE'
export type SubscriptionTier = 'FREE_TRIAL' | 'FREE' | 'PREMIUM'

// Avatar customization types
export interface AvatarCustomization {
  bodyType: BodyType
  height: number // in cm
  skinTone: string // hex color
  hairStyle: HairStyle
  hairColor: string // hex color
  hairHighlights?: string // hex color
  eyeColor: string // hex color
  faceShape: FaceShape
  accessories: AccessoryType[]
}

export type BodyType =
  | 'slim'
  | 'average'
  | 'athletic'
  | 'curvy'
  | 'plus'

export type HairStyle =
  | 'short-straight'
  | 'short-curly'
  | 'medium-straight'
  | 'medium-curly'
  | 'medium-wavy'
  | 'long-straight'
  | 'long-curly'
  | 'long-wavy'
  | 'braided'
  | 'bun'
  | 'ponytail'
  | 'pixie'
  | 'bob'
  | 'afro'
  | 'buzz'
  | 'bald'

export type FaceShape =
  | 'oval'
  | 'round'
  | 'square'
  | 'heart'
  | 'oblong'
  | 'diamond'

export type AccessoryType =
  | 'glasses-round'
  | 'glasses-square'
  | 'glasses-cat-eye'
  | 'glasses-aviator'
  | 'sunglasses'
  | 'earrings-stud'
  | 'earrings-hoop'
  | 'earrings-drop'
  | 'necklace-chain'
  | 'necklace-pendant'
  | 'necklace-choker'
  | 'watch-classic'
  | 'watch-smart'
  | 'bracelet'
  | 'hat-beanie'
  | 'hat-cap'
  | 'hat-fedora'

// Clothing categorization types
export type ClothingStyle =
  | 'cozy'
  | 'casual'
  | 'formal'
  | 'sporty'
  | 'festive'

export type Season =
  | 'winter'
  | 'spring'
  | 'summer'
  | 'fall'

export type Occasion =
  | 'work'
  | 'weekend'
  | 'date-night'
  | 'party'
  | 'workout'

export type PatternType =
  | 'solid'
  | 'stripes'
  | 'plaid'
  | 'floral'
  | 'polka-dots'
  | 'geometric'
  | 'animal-print'
  | 'abstract'

// Weather types
export interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  condition: WeatherCondition
  uvIndex: number
  precipitation: number
  windSpeed: number
}

export type WeatherCondition =
  | 'sunny'
  | 'partly-cloudy'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'snowy'
  | 'foggy'
  | 'windy'

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: WeatherCondition
}

// Outfit generation types
export interface OutfitSuggestion {
  id: string
  items: ClothingItem[]
  colorHarmony: ColorHarmony
  weatherScore: number
  styleMatch: number
}

export interface ClothingItem {
  id: string
  imageUrl: string
  type: string
  primaryColor: string
  locked?: boolean
}

export type ColorHarmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'neutral'
  | 'monochromatic'

// User preferences for outfit generation
export interface OutfitPreferences {
  preferredStyles: ClothingStyle[]
  avoidPatternClash: boolean
  considerWeather: boolean
  colorSeason?: 'spring' | 'summer' | 'autumn' | 'winter'
}
