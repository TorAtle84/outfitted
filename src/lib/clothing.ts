const CLOTHING_TYPES = ['TOP', 'BOTTOM', 'DRESS', 'OUTERWEAR', 'SHOES', 'ACCESSORY'] as const

type ClothingTypeValue = (typeof CLOTHING_TYPES)[number]

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

export type NormalizedClothingPayload = {
  imageUrl: string
  type: ClothingTypeValue
  styles: string[]
  seasons: string[]
  occasions: string[]
  primaryColor: string
  secondaryColors: string[]
  pattern: string | null
  brand: string | null
  isOuterwear: boolean
}

export function normalizeClothingPayload(payload: Record<string, unknown>) {
  const rawType = typeof payload.type === 'string' ? payload.type.toUpperCase() : ''
  if (!CLOTHING_TYPES.includes(rawType as ClothingTypeValue)) {
    return { error: 'Invalid clothing type' }
  }

  const primaryColor = typeof payload.primaryColor === 'string' ? payload.primaryColor : ''
  if (!primaryColor) {
    return { error: 'Missing primaryColor' }
  }

  const imageUrl = typeof payload.imageUrl === 'string' ? payload.imageUrl : ''
  const styles = toStringArray(payload.styles)
  const seasons = toStringArray(payload.seasons)
  const occasions = toStringArray(payload.occasions)
  const secondaryColors = toStringArray(payload.secondaryColors)
  const pattern = typeof payload.pattern === 'string' ? payload.pattern.trim() : ''
  const brand = typeof payload.brand === 'string' ? payload.brand.trim() : ''

  return {
    data: {
      imageUrl,
      type: rawType as ClothingTypeValue,
      styles,
      seasons,
      occasions,
      primaryColor,
      secondaryColors,
      pattern: pattern || null,
      brand: brand || null,
      isOuterwear: rawType === 'OUTERWEAR',
    } satisfies NormalizedClothingPayload,
  }
}
