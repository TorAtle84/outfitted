'use client'

import { useState } from 'react'
import type { AccessoryType, BodyType, FaceShape, HairStyle } from '@/types'

interface AvatarDisplayProps {
  skinTone?: string
  hairColor?: string
  hairHighlights?: string
  hairStyle?: HairStyle
  eyeColor?: string
  faceShape?: FaceShape
  bodyType?: BodyType
  height?: number
  accessories?: AccessoryType[]
  outfit?: {
    top?: string
    bottom?: string
    shoes?: string
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showRotationControls?: boolean
}

type BodySpec = {
  shoulder: number
  waist: number
  hips: number
  armWidth: number
  legWidth: number
}

const BODY_SPECS: Record<BodyType, BodySpec> = {
  slim: { shoulder: 48, waist: 34, hips: 42, armWidth: 10, legWidth: 16 },
  average: { shoulder: 52, waist: 38, hips: 50, armWidth: 12, legWidth: 18 },
  athletic: { shoulder: 56, waist: 40, hips: 52, armWidth: 12, legWidth: 18 },
  curvy: { shoulder: 54, waist: 34, hips: 58, armWidth: 12, legWidth: 20 },
  plus: { shoulder: 58, waist: 46, hips: 64, armWidth: 14, legWidth: 22 },
}

export default function AvatarDisplay({
  skinTone = '#E8C4A8',
  hairColor = '#2C1810',
  hairHighlights,
  hairStyle = 'long-wavy',
  eyeColor = '#4A3728',
  faceShape = 'oval',
  bodyType = 'average',
  height: avatarHeight = 165,
  accessories = [],
  outfit,
  className = '',
  size = 'lg',
  showRotationControls,
}: AvatarDisplayProps) {
  const [rotation, setRotation] = useState(0)

  const sizes = {
    sm: { width: 120, height: 180 },
    md: { width: 180, height: 270 },
    lg: { width: 240, height: 360 },
  } as const

  const { width, height } = sizes[size]
  const shouldShowRotationControls = showRotationControls ?? size !== 'sm'

  const clampedRotation = clamp(rotation, -90, 90)
  const clampedHeight = clamp(avatarHeight, 140, 200)
  const bodyScaleY = 0.9 + ((clampedHeight - 140) / 60) * 0.2

  const topColor = outfit?.top || '#E8DFD4'
  const bottomColor = outfit?.bottom || '#4A4A4A'
  const shoesColor = outfit?.shoes || '#2C1810'

  const body = BODY_SPECS[bodyType] ?? BODY_SPECS.average
  const torsoPath = getTorsoPath(body)

  const torsoStroke = shadeHex(topColor, -0.2)
  const hairStroke = shadeHex(hairColor, -0.35)

  return (
    <div className={`relative ${className}`}>
      {shouldShowRotationControls && (
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={() => setRotation((r) => clamp(r - 15, -90, 90))}
            className="w-8 h-8 bg-beige hover:bg-blush rounded-full flex items-center justify-center transition-colors"
            aria-label="Rotate left"
            type="button"
          >
            <svg className="w-4 h-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
            </svg>
          </button>
          <button
            onClick={() => setRotation((r) => clamp(r + 15, -90, 90))}
            className="w-8 h-8 bg-beige hover:bg-blush rounded-full flex items-center justify-center transition-colors"
            aria-label="Rotate right"
            type="button"
          >
            <svg className="w-4 h-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
          </button>
        </div>
      )}

      <svg
        width={width}
        height={height}
        viewBox="0 0 120 180"
        className="transition-transform duration-300"
        style={{ transform: `rotateY(${clampedRotation}deg)` }}
      >
        <defs>
          <linearGradient id="avatarBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F2E0DC" />
            <stop offset="100%" stopColor="#F5F0E8" />
          </linearGradient>
        </defs>
        <rect width="120" height="180" rx="16" fill="url(#avatarBg)" />

        {/* Body (scaled by height) */}
        <g transform={`translate(0 170)`}>
          <g transform={`scale(1 ${bodyScaleY})`}>
            <g transform={`translate(0 -170)`}>
              <BodySVG
                skinTone={skinTone}
                topColor={topColor}
                torsoPath={torsoPath}
                torsoStroke={torsoStroke}
                shoulder={body.shoulder}
                armWidth={body.armWidth}
                legWidth={body.legWidth}
                bottomColor={bottomColor}
                shoesColor={shoesColor}
                accessories={accessories}
              />
            </g>
          </g>
        </g>

        {/* Head */}
        <g>
          <HairSVG style={hairStyle} color={hairColor} highlight={hairHighlights} />
          <HatSVG accessories={accessories} />
          <FaceSVG shape={faceShape} skinTone={skinTone} />

          {/* Eyes */}
          <ellipse cx="52" cy="35" rx="4.2" ry="4.8" fill="white" />
          <ellipse cx="68" cy="35" rx="4.2" ry="4.8" fill="white" />
          <circle cx="52" cy="35.7" r="2.4" fill={eyeColor} />
          <circle cx="68" cy="35.7" r="2.4" fill={eyeColor} />
          <circle cx="52.8" cy="34.5" r="0.8" fill="white" opacity="0.9" />
          <circle cx="68.8" cy="34.5" r="0.8" fill="white" opacity="0.9" />

          {/* Eyebrows */}
          <path
            d="M45.5 27.5 Q52 25.5 58 27.8"
            stroke={hairStroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M62 27.8 Q68 25.5 74.5 27.5"
            stroke={hairStroke}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nose */}
          <path
            d="M60 35.5 Q62.3 41.5 60.2 44.8"
            stroke={shadeHex(skinTone, -0.1)}
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Mouth */}
          <path
            d="M53 49.5 Q60 55 67 49.5"
            stroke="#D4A5A5"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Blush */}
          <ellipse cx="44.5" cy="42.5" rx="6" ry="3.8" fill="#F2C4C4" opacity="0.35" />
          <ellipse cx="75.5" cy="42.5" rx="6" ry="3.8" fill="#F2C4C4" opacity="0.35" />

          <EarringsSVG accessories={accessories} />
          <GlassesSVG accessories={accessories} />
        </g>
      </svg>

      {shouldShowRotationControls && (
        <div className="text-center mt-2">
          <span className="text-xs text-taupe">{clampedRotation}{'\u00B0'}</span>
        </div>
      )}
    </div>
  )
}

function BodySVG({
  skinTone,
  topColor,
  torsoPath,
  torsoStroke,
  shoulder,
  armWidth,
  legWidth,
  bottomColor,
  shoesColor,
  accessories,
}: {
  skinTone: string
  topColor: string
  torsoPath: string
  torsoStroke: string
  shoulder: number
  armWidth: number
  legWidth: number
  bottomColor: string
  shoesColor: string
  accessories: AccessoryType[]
}) {
  const centerX = 60
  const armY = 72
  const armHeight = 44

  const shoulderHalf = shoulder / 2
  const leftArmX = centerX - shoulderHalf - armWidth + 2
  const rightArmX = centerX + shoulderHalf - 2

  const legGap = 4
  const leftLegX = centerX - legGap / 2 - legWidth
  const rightLegX = centerX + legGap / 2

  const watch = accessories.find((a) => a.startsWith('watch-') || a === 'bracelet') ?? null
  const necklace = accessories.find((a) => a.startsWith('necklace-')) ?? null

  return (
    <g>
      {/* Neck */}
      <rect x="53.5" y="55" width="13" height="14" fill={skinTone} rx="5" opacity="0.98" />

      {/* Arms */}
      <rect x={leftArmX} y={armY} width={armWidth} height={armHeight} rx={armWidth / 2} fill={skinTone} />
      <rect x={rightArmX} y={armY} width={armWidth} height={armHeight} rx={armWidth / 2} fill={skinTone} />

      {/* Sleeves */}
      <rect x={leftArmX} y={armY - 2} width={armWidth} height={20} rx={armWidth / 2} fill={shadeHex(topColor, -0.06)} />
      <rect x={rightArmX} y={armY - 2} width={armWidth} height={20} rx={armWidth / 2} fill={shadeHex(topColor, -0.06)} />

      {/* Torso */}
      <path d={torsoPath} fill={topColor} stroke={torsoStroke} strokeWidth="0.8" />

      {necklace && <NecklaceSVG necklace={necklace} />}

      {/* Legs */}
      <rect x={leftLegX} y="128" width={legWidth} height="44" rx="8" fill={bottomColor} />
      <rect x={rightLegX} y="128" width={legWidth} height="44" rx="8" fill={bottomColor} />

      {/* Shoes */}
      <ellipse cx={leftLegX + legWidth / 2} cy="173" rx="13" ry="6.5" fill={shoesColor} opacity="0.95" />
      <ellipse cx={rightLegX + legWidth / 2} cy="173" rx="13" ry="6.5" fill={shoesColor} opacity="0.95" />

      {watch && <WristSVG wrist={watch} leftArmX={leftArmX} armWidth={armWidth} />}
    </g>
  )
}

function NecklaceSVG({ necklace }: { necklace: AccessoryType }) {
  if (necklace === 'necklace-choker') {
    return <path d="M50 64 Q60 70 70 64" stroke="#D4A5A5" strokeWidth="2" fill="none" strokeLinecap="round" />
  }

  return (
    <g>
      <path d="M46 64 Q60 78 74 64" stroke="#D4A5A5" strokeWidth="2" fill="none" strokeLinecap="round" />
      {necklace === 'necklace-pendant' && <circle cx="60" cy="78" r="3.2" fill="#D4A5A5" />}
    </g>
  )
}

function WristSVG({ wrist, leftArmX, armWidth }: { wrist: AccessoryType; leftArmX: number; armWidth: number }) {
  if (wrist === 'bracelet') {
    return <rect x={leftArmX + 1} y="108" width={armWidth - 2} height="6" rx="3" fill="#D4A5A5" opacity="0.9" />
  }

  return (
    <g>
      <rect x={leftArmX + 1} y="104" width={armWidth - 2} height="16" rx="4" fill="#2C1810" opacity="0.9" />
      <rect
        x={leftArmX + 3}
        y="108"
        width={armWidth - 6}
        height="8"
        rx="2"
        fill={wrist === 'watch-smart' ? '#111827' : '#F5F0E8'}
        opacity="0.9"
      />
    </g>
  )
}

function FaceSVG({ shape, skinTone }: { shape: FaceShape; skinTone: string }) {
  const stroke = shadeHex(skinTone, -0.25)

  switch (shape) {
    case 'round':
      return (
        <g>
          <ellipse cx="60" cy="35" rx="24" ry="24.5" fill={skinTone} stroke={stroke} strokeWidth="0.8" />
          <circle cx="36.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="83.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
    case 'square':
      return (
        <g>
          <rect x="37.5" y="11.5" width="45" height="49" rx="14" fill={skinTone} stroke={stroke} strokeWidth="0.8" />
          <circle cx="36.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="83.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
    case 'oblong':
      return (
        <g>
          <ellipse cx="60" cy="35" rx="20.5" ry="28" fill={skinTone} stroke={stroke} strokeWidth="0.8" />
          <circle cx="39" cy="38" r="4" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="81" cy="38" r="4" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
    case 'heart':
      return (
        <g>
          <path
            d={[
              'M 60 12',
              'C 47 10 36 18 36 32',
              'C 36 52 50 62 60 62',
              'C 70 62 84 52 84 32',
              'C 84 18 73 10 60 12 Z',
            ].join(' ')}
            fill={skinTone}
            stroke={stroke}
            strokeWidth="0.8"
          />
          <circle cx="36.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="83.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
    case 'diamond':
      return (
        <g>
          <path
            d={[
              'M 60 10',
              'C 50 12 41 20 39 32',
              'C 37 44 44 58 60 62',
              'C 76 58 83 44 81 32',
              'C 79 20 70 12 60 10 Z',
            ].join(' ')}
            fill={skinTone}
            stroke={stroke}
            strokeWidth="0.8"
          />
          <circle cx="36.8" cy="38" r="4.1" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="83.2" cy="38" r="4.1" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
    case 'oval':
    default:
      return (
        <g>
          <ellipse cx="60" cy="35" rx="22.5" ry="26" fill={skinTone} stroke={stroke} strokeWidth="0.8" />
          <circle cx="36.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
          <circle cx="83.5" cy="38" r="4.2" fill={skinTone} stroke={stroke} strokeWidth="0.6" />
        </g>
      )
  }
}

function normalizeHairStyle(style: HairStyle): HairStyle {
  switch (style) {
    case 'medium-straight':
    case 'medium-wavy':
    case 'medium-curly':
      return 'bob'
    case 'long-curly':
      return 'long-wavy'
    case 'braided':
      return 'ponytail'
    default:
      return style
  }
}

function HairSVG({ style, color, highlight }: { style: HairStyle; color: string; highlight?: string }) {
  const normalized = normalizeHairStyle(style)
  const highlightOpacity = highlight ? 0.35 : 0
  const highlightColor = highlight ? shadeHex(highlight, 0.05) : null

  switch (normalized) {
    case 'bald':
      return null
    case 'afro':
      return (
        <g>
          <circle cx="60" cy="18" r="28" fill={color} />
          <circle cx="44" cy="10" r="10" fill={shadeHex(color, 0.08)} opacity="0.7" />
          <circle cx="76" cy="10" r="10" fill={shadeHex(color, 0.08)} opacity="0.7" />
          <circle cx="36" cy="22" r="10" fill={shadeHex(color, 0.08)} opacity="0.7" />
          <circle cx="84" cy="22" r="10" fill={shadeHex(color, 0.08)} opacity="0.7" />
        </g>
      )
    case 'buzz':
      return (
        <path
          d="M40 30 Q38 18 48 12 Q58 7 60 10 Q62 7 72 12 Q82 18 80 30 Q78 35 70 33 Q62 31 60 31 Q58 31 50 33 Q42 35 40 30"
          fill={shadeHex(color, 0.15)}
          opacity="0.85"
        />
      )
    case 'long-wavy':
      return (
        <g>
          <path
            d={[
              'M 36 27',
              'Q 35 14 46 9',
              'Q 55 4 60 7',
              'Q 65 4 74 9',
              'Q 85 14 84 27',
              'Q 88 46 80 64',
              'Q 74 76 68 78',
              'L 68 66',
              'Q 72 54 70 44',
              'Q 66 34 60 34',
              'Q 54 34 50 44',
              'Q 48 54 52 66',
              'L 52 78',
              'Q 46 76 40 64',
              'Q 32 46 36 27 Z',
            ].join(' ')}
            fill={color}
          />
          {highlightColor && (
            <path
              d="M46 22 Q54 12 60 15 Q66 12 74 22"
              stroke={highlightColor}
              strokeWidth="5"
              strokeLinecap="round"
              opacity={highlightOpacity}
            />
          )}
        </g>
      )
    case 'short-straight':
      return (
        <g>
          <path
            d="M38 30 Q35 20 45 12 Q55 5 60 8 Q65 5 75 12 Q85 20 82 30 Q80 36 75 33 Q70 30 60 30 Q50 30 45 33 Q40 36 38 30"
            fill={color}
          />
          {highlightColor && (
            <path
              d="M46 22 Q55 16 60 18 Q65 16 74 22"
              stroke={highlightColor}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={highlightOpacity}
            />
          )}
        </g>
      )
    case 'ponytail':
      return (
        <g>
          <path
            d="M38 25 Q35 15 45 10 Q55 5 60 8 Q65 5 75 10 Q85 15 82 25 Q80 35 75 32 Q70 28 60 28 Q50 28 45 32 Q40 35 38 25"
            fill={color}
          />
          <path
            d="M75 20 Q85 18 90 30 Q92 50 85 70"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )
    case 'bun':
      return (
        <g>
          <path
            d="M38 30 Q35 20 45 12 Q55 5 60 8 Q65 5 75 12 Q85 20 82 30 Q80 35 75 32 Q70 28 60 28 Q50 28 45 32 Q40 35 38 30"
            fill={color}
          />
          <circle cx="60" cy="5" r="10" fill={color} />
        </g>
      )
    case 'bob':
    default:
      return (
        <path
          d="M38 26 Q35 14 46 10 Q55 6 60 8 Q65 6 74 10 Q85 14 82 26 Q84 44 78 56 Q74 62 70 58 L70 48 Q69 38 60 38 Q51 38 50 48 L50 58 Q46 62 42 56 Q36 44 38 26"
          fill={color}
        />
      )
  }
}

function GlassesSVG({ accessories }: { accessories: AccessoryType[] }) {
  const glasses = accessories.find((a) => a.startsWith('glasses') || a === 'sunglasses')
  if (!glasses) return null

  const normalized = glasses === 'glasses-cat-eye' || glasses === 'glasses-aviator' ? 'glasses-round' : glasses
  const frameStroke = '#2C1810'

  switch (normalized) {
    case 'glasses-square':
      return (
        <g>
          <rect x="44" y="30.5" width="16" height="12" rx="4" fill="none" stroke={frameStroke} strokeWidth="1.6" />
          <rect x="60" y="30.5" width="16" height="12" rx="4" fill="none" stroke={frameStroke} strokeWidth="1.6" />
          <path d="M60 36.5 Q61.5 34.8 63.2 36.2" stroke={frameStroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'sunglasses':
      return (
        <g opacity={0.85}>
          <rect x="44" y="31" width="16" height="12" rx="5" fill="#1F2937" />
          <rect x="60" y="31" width="16" height="12" rx="5" fill="#1F2937" />
          <path d="M60 36.5 Q61.5 34.8 63.2 36.2" stroke={frameStroke} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      )
    case 'glasses-round':
    default:
      return (
        <g>
          <circle cx="52" cy="36" r="7.2" fill="none" stroke={frameStroke} strokeWidth="1.6" />
          <circle cx="68" cy="36" r="7.2" fill="none" stroke={frameStroke} strokeWidth="1.6" />
          <path d="M60 36.5 Q61.5 34.8 63.2 36.2" stroke={frameStroke} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )
  }
}

function EarringsSVG({ accessories }: { accessories: AccessoryType[] }) {
  const earrings = accessories.find((a) => a.startsWith('earrings-'))
  if (!earrings) return null

  switch (earrings) {
    case 'earrings-stud':
      return (
        <g>
          <circle cx="36.5" cy="45.5" r="2.2" fill="#D4A5A5" />
          <circle cx="83.5" cy="45.5" r="2.2" fill="#D4A5A5" />
        </g>
      )
    case 'earrings-hoop':
      return (
        <g>
          <circle cx="36.5" cy="47" r="3.4" fill="none" stroke="#D4A5A5" strokeWidth="1.6" />
          <circle cx="83.5" cy="47" r="3.4" fill="none" stroke="#D4A5A5" strokeWidth="1.6" />
        </g>
      )
    case 'earrings-drop':
      return (
        <g>
          <path d="M36.5 45.5 v6" stroke="#D4A5A5" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M83.5 45.5 v6" stroke="#D4A5A5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="36.5" cy="53.5" r="2.2" fill="#D4A5A5" />
          <circle cx="83.5" cy="53.5" r="2.2" fill="#D4A5A5" />
        </g>
      )
    default:
      return null
  }
}

function HatSVG({ accessories }: { accessories: AccessoryType[] }) {
  const hat = accessories.find((a) => a.startsWith('hat-'))
  if (!hat) return null

  switch (hat) {
    case 'hat-beanie':
      return (
        <g>
          <path d="M36 22 Q60 2 84 22 Q82 36 60 32 Q38 36 36 22" fill="#4A4A4A" />
          <circle cx="60" cy="6" r="4" fill="#4A4A4A" />
        </g>
      )
    case 'hat-cap':
      return (
        <g>
          <path d="M38 24 Q60 10 82 24 Q80 34 60 32 Q40 34 38 24" fill="#4A4A4A" />
          <path d="M44 28 Q60 40 88 32" fill="none" stroke="#4A4A4A" strokeWidth="8" strokeLinecap="round" />
        </g>
      )
    case 'hat-fedora':
      return (
        <g>
          <path d="M36 26 Q60 12 84 26 Q78 40 60 34 Q42 40 36 26" fill="#4A4A4A" />
          <path d="M30 34 Q60 46 90 34" fill="none" stroke="#4A4A4A" strokeWidth="8" strokeLinecap="round" />
        </g>
      )
    default:
      return null
  }
}

function getTorsoPath(body: BodySpec) {
  const centerX = 60
  const topY = 68
  const waistY = 104
  const hipY = 126
  const bottomY = 128

  const shoulderHalf = body.shoulder / 2
  const waistHalf = body.waist / 2
  const hipsHalf = body.hips / 2

  const leftShoulderX = centerX - shoulderHalf
  const rightShoulderX = centerX + shoulderHalf
  const leftWaistX = centerX - waistHalf
  const rightWaistX = centerX + waistHalf
  const leftHipX = centerX - hipsHalf
  const rightHipX = centerX + hipsHalf

  return [
    `M ${leftShoulderX} ${topY}`,
    `Q ${leftShoulderX - 2} ${topY + 18} ${leftWaistX} ${waistY}`,
    `Q ${leftHipX} ${hipY} ${leftHipX} ${bottomY}`,
    `L ${rightHipX} ${bottomY}`,
    `Q ${rightHipX} ${hipY} ${rightWaistX} ${waistY}`,
    `Q ${rightShoulderX + 2} ${topY + 18} ${rightShoulderX} ${topY}`,
    'Z',
  ].join(' ')
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function shadeHex(hex: string, amount: number) {
  const normalized = normalizeHex(hex)
  if (!normalized) return hex

  const rgb = hexToRgb(normalized)
  const target = amount >= 0 ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 }
  const w = clamp(Math.abs(amount), 0, 1)

  return rgbToHex({
    r: Math.round(rgb.r + (target.r - rgb.r) * w),
    g: Math.round(rgb.g + (target.g - rgb.g) * w),
    b: Math.round(rgb.b + (target.b - rgb.b) * w),
  })
}

function normalizeHex(hex: string) {
  const value = hex.trim()
  if (/^#[0-9a-f]{6}$/i.test(value)) return value
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const [hash, r, g, b] = value
    return `${hash}${r}${r}${g}${g}${b}${b}`
  }
  return null
}

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex(rgb: { r: number; g: number; b: number }) {
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
}
