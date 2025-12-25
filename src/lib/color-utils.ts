/**
 * Color utility functions for outfit matching
 * Implements color theory principles for outfit generation
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { r: 0, g: 0, b: 0 }
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(rgb: RGB): string {
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Calculate color distance (Delta E approximation)
 */
export function colorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  const dr = rgb1.r - rgb2.r
  const dg = rgb1.g - rgb2.g
  const db = rgb1.b - rgb2.b

  return Math.sqrt(dr * dr + dg * dg + db * db)
}

/**
 * Check if a color is neutral (black, white, gray, beige, etc.)
 */
export function isNeutralColor(hex: string): boolean {
  const rgb = hexToRgb(hex)
  const hsl = rgbToHsl(rgb)

  // Low saturation = neutral
  if (hsl.s < 15) return true

  // Beige/tan/brown neutrals
  if (hsl.h >= 20 && hsl.h <= 50 && hsl.s < 40) return true

  return false
}

/**
 * Get the complementary color
 */
export function getComplementaryColor(hex: string): string {
  const rgb = hexToRgb(hex)
  return rgbToHex({
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b,
  })
}

/**
 * Check if two colors are complementary (opposite on color wheel)
 */
export function areComplementary(color1: string, color2: string): boolean {
  const hsl1 = rgbToHsl(hexToRgb(color1))
  const hsl2 = rgbToHsl(hexToRgb(color2))

  const hueDiff = Math.abs(hsl1.h - hsl2.h)
  // Complementary colors are ~180 degrees apart
  return hueDiff >= 150 && hueDiff <= 210
}

/**
 * Check if two colors are analogous (adjacent on color wheel)
 */
export function areAnalogous(color1: string, color2: string): boolean {
  const hsl1 = rgbToHsl(hexToRgb(color1))
  const hsl2 = rgbToHsl(hexToRgb(color2))

  const hueDiff = Math.abs(hsl1.h - hsl2.h)
  // Analogous colors are within ~30-60 degrees
  return hueDiff <= 60 || hueDiff >= 300
}

/**
 * Check if two colors are in the same color family (monochromatic)
 */
export function areMonochromatic(color1: string, color2: string): boolean {
  const hsl1 = rgbToHsl(hexToRgb(color1))
  const hsl2 = rgbToHsl(hexToRgb(color2))

  const hueDiff = Math.abs(hsl1.h - hsl2.h)
  // Same hue, different saturation/lightness
  return hueDiff <= 15 || hueDiff >= 345
}

/**
 * Calculate color harmony score (0-100)
 */
export function getColorHarmonyScore(color1: string, color2: string): number {
  // Neutral colors always match well
  if (isNeutralColor(color1) || isNeutralColor(color2)) {
    return 90
  }

  // Check for various harmony types
  if (areMonochromatic(color1, color2)) {
    return 95
  }

  if (areAnalogous(color1, color2)) {
    return 85
  }

  if (areComplementary(color1, color2)) {
    return 80
  }

  // Default score based on color distance
  const distance = colorDistance(color1, color2)
  // Normalize: 0-441 (max distance) to 0-100
  return Math.max(0, Math.min(100, 100 - (distance / 441) * 50))
}

/**
 * Check if two patterns clash
 */
export function doPatternsClash(pattern1?: string, pattern2?: string): boolean {
  if (!pattern1 || !pattern2) return false
  if (pattern1 === 'solid' || pattern2 === 'solid') return false

  const clashingCombos = [
    ['stripes', 'plaid'],
    ['stripes', 'stripes'],
    ['plaid', 'plaid'],
    ['floral', 'geometric'],
    ['animal-print', 'floral'],
    ['polka-dots', 'stripes'],
  ]

  return clashingCombos.some(
    ([p1, p2]) =>
      (pattern1 === p1 && pattern2 === p2) ||
      (pattern1 === p2 && pattern2 === p1)
  )
}

/**
 * Get color harmony type
 */
export type ColorHarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'neutral'
  | 'monochromatic'
  | 'unknown'

export function getColorHarmonyType(color1: string, color2: string): ColorHarmonyType {
  if (isNeutralColor(color1) || isNeutralColor(color2)) {
    return 'neutral'
  }

  if (areMonochromatic(color1, color2)) {
    return 'monochromatic'
  }

  if (areAnalogous(color1, color2)) {
    return 'analogous'
  }

  if (areComplementary(color1, color2)) {
    return 'complementary'
  }

  return 'unknown'
}
