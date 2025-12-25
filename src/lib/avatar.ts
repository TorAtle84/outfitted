import type { AccessoryType, AvatarCustomization, BodyType, FaceShape, HairStyle } from '@/types'

export const BODY_TYPES = ['slim', 'average', 'athletic', 'curvy', 'plus'] as const satisfies readonly BodyType[]

export const HAIR_STYLES = [
  'short-straight',
  'short-curly',
  'medium-straight',
  'medium-curly',
  'medium-wavy',
  'long-straight',
  'long-curly',
  'long-wavy',
  'braided',
  'bun',
  'ponytail',
  'pixie',
  'bob',
  'afro',
  'buzz',
  'bald',
] as const satisfies readonly HairStyle[]

export const FACE_SHAPES = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond'] as const satisfies readonly FaceShape[]

export const ACCESSORY_TYPES = [
  'glasses-round',
  'glasses-square',
  'glasses-cat-eye',
  'glasses-aviator',
  'sunglasses',
  'earrings-stud',
  'earrings-hoop',
  'earrings-drop',
  'necklace-chain',
  'necklace-pendant',
  'necklace-choker',
  'watch-classic',
  'watch-smart',
  'bracelet',
  'hat-beanie',
  'hat-cap',
  'hat-fedora',
] as const satisfies readonly AccessoryType[]

const BODY_TYPE_SET = new Set<string>(BODY_TYPES)
const HAIR_STYLE_SET = new Set<string>(HAIR_STYLES)
const FACE_SHAPE_SET = new Set<string>(FACE_SHAPES)
const ACCESSORY_SET = new Set<string>(ACCESSORY_TYPES)

export const DEFAULT_AVATAR: AvatarCustomization = {
  bodyType: 'average',
  height: 165,
  skinTone: '#E8C4A8',
  hairStyle: 'long-wavy',
  hairColor: '#2C1810',
  hairHighlights: undefined,
  eyeColor: '#4A3728',
  faceShape: 'oval',
  accessories: [],
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const numberValue = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numberValue)) return fallback
  return Math.min(max, Math.max(min, Math.round(numberValue)))
}

function isHexColor(value: unknown): value is string {
  if (typeof value !== 'string') return false
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim())
}

function normalizeHexColor(value: unknown, fallback: string): string {
  if (!isHexColor(value)) return fallback
  const trimmed = value.trim()
  if (trimmed.length === 4) {
    const [hash, r, g, b] = trimmed
    return `${hash}${r}${r}${g}${g}${b}${b}`.toUpperCase()
  }
  return trimmed.toUpperCase()
}

function coerceEnum<T extends readonly string[]>(allowed: T, value: unknown, fallback: T[number]): T[number] {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim()
  return (allowed as readonly string[]).includes(normalized) ? (normalized as T[number]) : fallback
}

function normalizeAccessories(value: unknown): AccessoryType[] {
  if (!Array.isArray(value)) return []
  const unique = new Set<AccessoryType>()
  for (const item of value) {
    if (typeof item !== 'string') continue
    if (!ACCESSORY_SET.has(item)) continue
    unique.add(item as AccessoryType)
  }
  return Array.from(unique)
}

export function normalizeAvatarCustomization(input: unknown): AvatarCustomization {
  const obj = (typeof input === 'object' && input !== null ? input : {}) as Record<string, unknown>

  const bodyTypeValue =
    typeof obj.bodyType === 'string' && BODY_TYPE_SET.has(obj.bodyType) ? (obj.bodyType as BodyType) : DEFAULT_AVATAR.bodyType

  const hairStyleValue =
    typeof obj.hairStyle === 'string' && HAIR_STYLE_SET.has(obj.hairStyle) ? (obj.hairStyle as HairStyle) : DEFAULT_AVATAR.hairStyle

  const faceShapeValue =
    typeof obj.faceShape === 'string' && FACE_SHAPE_SET.has(obj.faceShape) ? (obj.faceShape as FaceShape) : DEFAULT_AVATAR.faceShape

  const heightValue = clampInt(obj.height, 140, 210, DEFAULT_AVATAR.height)

  const skinToneValue = normalizeHexColor(obj.skinTone, DEFAULT_AVATAR.skinTone)
  const hairColorValue = normalizeHexColor(obj.hairColor, DEFAULT_AVATAR.hairColor)
  const eyeColorValue = normalizeHexColor(obj.eyeColor, DEFAULT_AVATAR.eyeColor)

  const hairHighlightsValue = obj.hairHighlights == null ? undefined : normalizeHexColor(obj.hairHighlights, DEFAULT_AVATAR.hairColor)

  const accessoriesValue = normalizeAccessories(obj.accessories)

  return {
    bodyType: bodyTypeValue,
    height: heightValue,
    skinTone: skinToneValue,
    hairStyle: hairStyleValue,
    hairColor: hairColorValue,
    hairHighlights: hairHighlightsValue,
    eyeColor: eyeColorValue,
    faceShape: faceShapeValue,
    accessories: accessoriesValue,
  }
}

export function avatarToDbData(customization: AvatarCustomization) {
  const normalized = normalizeAvatarCustomization(customization)
  return {
    bodyType: normalized.bodyType,
    height: normalized.height,
    skinTone: normalized.skinTone,
    hairStyle: normalized.hairStyle,
    hairColor: normalized.hairColor,
    hairHighlights: normalized.hairHighlights ?? null,
    eyeColor: normalized.eyeColor,
    faceShape: normalized.faceShape,
    accessories: normalized.accessories,
  }
}

export function avatarFromDb(avatar: {
  bodyType: unknown
  height: unknown
  skinTone: unknown
  hairStyle: unknown
  hairColor: unknown
  hairHighlights: unknown
  eyeColor: unknown
  faceShape: unknown
  accessories: unknown
}): AvatarCustomization {
  return normalizeAvatarCustomization({
    ...avatar,
    hairHighlights: avatar.hairHighlights ?? undefined,
  })
}

