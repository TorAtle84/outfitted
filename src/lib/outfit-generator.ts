/**
 * Outfit generation logic
 * Combines color theory, style matching, and weather considerations
 */

import {
  getColorHarmonyScore,
  doPatternsClash,
  getColorHarmonyType,
  type ColorHarmonyType,
} from './color-utils'
import type { ClothingStyle, Season, WeatherData } from '@/types'

export interface ClothingItem {
  id: string
  imageUrl: string
  type: 'TOP' | 'BOTTOM' | 'DRESS' | 'OUTERWEAR' | 'SHOES' | 'ACCESSORY'
  styles: ClothingStyle[]
  seasons: Season[]
  occasions: string[]
  primaryColor: string
  pattern?: string
  locked?: boolean
}

export interface OutfitSuggestion {
  id: string
  items: ClothingItem[]
  score: number
  colorHarmony: ColorHarmonyType
  reasons: string[]
}

export interface GenerateOutfitOptions {
  wardrobe: ClothingItem[]
  lockedItems?: ClothingItem[]
  preferredStyle?: ClothingStyle
  weather?: WeatherData
  occasion?: string
  currentSeason?: Season
}

/**
 * Generate outfit suggestions from a wardrobe
 */
export function generateOutfitSuggestions(
  options: GenerateOutfitOptions,
  count: number = 3
): OutfitSuggestion[] {
  const {
    wardrobe,
    lockedItems = [],
    preferredStyle,
    weather,
    occasion,
    currentSeason = getCurrentSeason(),
  } = options

  const suggestions: OutfitSuggestion[] = []

  // Filter wardrobe by season
  const seasonalWardrobe = wardrobe.filter(
    (item) => item.seasons.includes(currentSeason)
  )

  // Group items by type
  const tops = seasonalWardrobe.filter((item) => item.type === 'TOP')
  const bottoms = seasonalWardrobe.filter((item) => item.type === 'BOTTOM')
  const dresses = seasonalWardrobe.filter((item) => item.type === 'DRESS')
  const shoes = seasonalWardrobe.filter((item) => item.type === 'SHOES')
  const accessories = seasonalWardrobe.filter((item) => item.type === 'ACCESSORY')

  // Get locked items by type
  const lockedTop = lockedItems.find((item) => item.type === 'TOP')
  const lockedBottom = lockedItems.find((item) => item.type === 'BOTTOM')
  const lockedDress = lockedItems.find((item) => item.type === 'DRESS')
  const lockedShoes = lockedItems.find((item) => item.type === 'SHOES')

  // Generate outfit combinations
  const combinations: ClothingItem[][] = []

  // Option 1: Top + Bottom + Shoes
  if (tops.length > 0 && bottoms.length > 0 && shoes.length > 0) {
    const topsToUse = lockedTop ? [lockedTop] : tops
    const bottomsToUse = lockedBottom ? [lockedBottom] : bottoms
    const shoesToUse = lockedShoes ? [lockedShoes] : shoes

    for (const top of topsToUse) {
      for (const bottom of bottomsToUse) {
        for (const shoe of shoesToUse) {
          combinations.push([top, bottom, shoe])
        }
      }
    }
  }

  // Option 2: Dress + Shoes
  if (dresses.length > 0 && shoes.length > 0) {
    const dressesToUse = lockedDress ? [lockedDress] : dresses
    const shoesToUse = lockedShoes ? [lockedShoes] : shoes

    for (const dress of dressesToUse) {
      for (const shoe of shoesToUse) {
        combinations.push([dress, shoe])
      }
    }
  }

  // Score each combination
  const scoredCombinations = combinations.map((items) => {
    const { score, reasons, colorHarmony } = scoreOutfit(items, {
      preferredStyle,
      weather,
      occasion,
    })

    return {
      id: items.map((i) => i.id).join('-'),
      items,
      score,
      colorHarmony,
      reasons,
    }
  })

  // Sort by score and return top results
  scoredCombinations.sort((a, b) => b.score - a.score)

  return scoredCombinations.slice(0, count)
}

/**
 * Score an outfit combination
 */
function scoreOutfit(
  items: ClothingItem[],
  options: {
    preferredStyle?: ClothingStyle
    weather?: WeatherData
    occasion?: string
  }
): { score: number; reasons: string[]; colorHarmony: ColorHarmonyType } {
  let score = 50 // Base score
  const reasons: string[] = []

  // Color harmony scoring
  let totalColorScore = 0
  let colorPairs = 0
  let primaryHarmony: ColorHarmonyType = 'neutral'

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const harmonyScore = getColorHarmonyScore(
        items[i].primaryColor,
        items[j].primaryColor
      )
      totalColorScore += harmonyScore
      colorPairs++

      if (i === 0 && j === 1) {
        primaryHarmony = getColorHarmonyType(
          items[i].primaryColor,
          items[j].primaryColor
        )
      }
    }
  }

  if (colorPairs > 0) {
    const avgColorScore = totalColorScore / colorPairs
    score += (avgColorScore - 50) * 0.4 // Weight: 40% of score difference
    if (avgColorScore >= 85) {
      reasons.push('Excellent color harmony')
    } else if (avgColorScore >= 70) {
      reasons.push('Good color coordination')
    }
  }

  // Pattern clash penalty
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      if (doPatternsClash(items[i].pattern, items[j].pattern)) {
        score -= 20
        reasons.push('Pattern clash detected')
      }
    }
  }

  // Style consistency bonus
  const { preferredStyle } = options
  if (preferredStyle) {
    const matchingItems = items.filter((item) =>
      item.styles.includes(preferredStyle)
    )
    const styleMatchRatio = matchingItems.length / items.length
    score += styleMatchRatio * 15
    if (styleMatchRatio >= 0.8) {
      reasons.push(`Perfect ${preferredStyle} style match`)
    }
  }

  // Style cohesion (all items share at least one style)
  const allStyles = items.flatMap((item) => item.styles)
  const styleFrequency = allStyles.reduce((acc, style) => {
    acc[style] = (acc[style] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostCommonStyle = Object.entries(styleFrequency).sort(
    (a, b) => b[1] - a[1]
  )[0]
  if (mostCommonStyle && mostCommonStyle[1] >= items.length * 0.8) {
    score += 10
    reasons.push(`Cohesive ${mostCommonStyle[0]} look`)
  }

  // Occasion matching
  const { occasion } = options
  if (occasion) {
    const matchingItems = items.filter((item) =>
      item.occasions.includes(occasion)
    )
    const occasionMatchRatio = matchingItems.length / items.length
    score += occasionMatchRatio * 10
    if (occasionMatchRatio >= 0.8) {
      reasons.push(`Great for ${occasion}`)
    }
  }

  // Weather appropriateness
  const { weather } = options
  if (weather) {
    score += scoreWeatherAppropriateness(items, weather)
    // Add weather-specific reasons
    if (weather.temperature < 10) {
      const hasOuterwear = items.some((item) => item.type === 'OUTERWEAR')
      if (!hasOuterwear) {
        reasons.push('Consider adding a jacket')
      }
    }
  }

  // Clamp score between 0-100
  score = Math.max(0, Math.min(100, score))

  return { score, reasons, colorHarmony: primaryHarmony }
}

/**
 * Score weather appropriateness
 */
function scoreWeatherAppropriateness(
  items: ClothingItem[],
  weather: WeatherData
): number {
  let score = 0
  const { temperature, condition } = weather

  // Temperature-based scoring
  if (temperature < 0) {
    // Very cold: prefer winter items
    const winterItems = items.filter((item) => item.seasons.includes('winter'))
    score += (winterItems.length / items.length) * 15
  } else if (temperature < 10) {
    // Cold: prefer fall/winter items
    const coldItems = items.filter(
      (item) =>
        item.seasons.includes('winter') || item.seasons.includes('fall')
    )
    score += (coldItems.length / items.length) * 10
  } else if (temperature > 25) {
    // Hot: prefer summer items
    const summerItems = items.filter((item) => item.seasons.includes('summer'))
    score += (summerItems.length / items.length) * 10
  }

  // Condition-based adjustments
  if (condition === 'rainy' || condition === 'stormy') {
    const hasOuterwear = items.some((item) => item.type === 'OUTERWEAR')
    if (hasOuterwear) score += 5
  }

  return score
}

/**
 * Get current season based on month
 */
function getCurrentSeason(): Season {
  const month = new Date().getMonth()

  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}

/**
 * Shuffle an outfit - replace unlocked items with alternatives
 */
export function shuffleOutfit(
  currentOutfit: ClothingItem[],
  wardrobe: ClothingItem[],
  lockedItemIds: string[]
): OutfitSuggestion | null {
  const lockedItems = currentOutfit.filter((item) =>
    lockedItemIds.includes(item.id)
  )
  const unlockedTypes = currentOutfit
    .filter((item) => !lockedItemIds.includes(item.id))
    .map((item) => item.type)

  // Get alternatives for each unlocked type
  const alternatives: ClothingItem[] = []

  for (const type of unlockedTypes) {
    const typeItems = wardrobe.filter(
      (item) =>
        item.type === type &&
        !currentOutfit.some((current) => current.id === item.id)
    )

    if (typeItems.length > 0) {
      // Pick a random alternative
      const randomIndex = Math.floor(Math.random() * typeItems.length)
      alternatives.push(typeItems[randomIndex])
    } else {
      // Keep the original if no alternatives
      const original = currentOutfit.find(
        (item) => item.type === type && !lockedItemIds.includes(item.id)
      )
      if (original) alternatives.push(original)
    }
  }

  const newOutfitItems = [...lockedItems, ...alternatives]

  if (newOutfitItems.length === 0) return null

  const { score, reasons, colorHarmony } = scoreOutfit(newOutfitItems, {})

  return {
    id: newOutfitItems.map((i) => i.id).join('-'),
    items: newOutfitItems,
    score,
    colorHarmony,
    reasons,
  }
}

/**
 * Generate a "surprise me" outfit - prioritize unexpectedness
 */
export function generateSurpriseOutfit(
  wardrobe: ClothingItem[]
): OutfitSuggestion | null {
  const currentSeason = getCurrentSeason()

  // Filter by season
  const seasonalWardrobe = wardrobe.filter((item) =>
    item.seasons.includes(currentSeason)
  )

  // Get random items of each type
  const getRandomItem = (type: ClothingItem['type']) => {
    const items = seasonalWardrobe.filter((item) => item.type === type)
    if (items.length === 0) return null
    return items[Math.floor(Math.random() * items.length)]
  }

  // Try dress + shoes first
  const dress = getRandomItem('DRESS')
  const shoes = getRandomItem('SHOES')

  if (dress && shoes) {
    const items = [dress, shoes]
    const { score, reasons, colorHarmony } = scoreOutfit(items, {})

    return {
      id: items.map((i) => i.id).join('-'),
      items,
      score,
      colorHarmony,
      reasons: [...reasons, 'Surprise combination!'],
    }
  }

  // Try top + bottom + shoes
  const top = getRandomItem('TOP')
  const bottom = getRandomItem('BOTTOM')

  if (top && bottom && shoes) {
    const items = [top, bottom, shoes]
    const { score, reasons, colorHarmony } = scoreOutfit(items, {})

    return {
      id: items.map((i) => i.id).join('-'),
      items,
      score,
      colorHarmony,
      reasons: [...reasons, 'Surprise combination!'],
    }
  }

  return null
}
