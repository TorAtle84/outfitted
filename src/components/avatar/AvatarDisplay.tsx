'use client'

import type {
  AccessoryType,
  BodyType,
  FaceShape,
  HairStyle,
  EyeShape,
  EyebrowStyle,
  NoseType,
  MouthExpression,
  FacialHairType,
  AvatarOutfit
} from '@/types'

interface AvatarDisplayProps {
  skinTone?: string
  hairColor?: string
  hairHighlights?: string
  hairStyle?: HairStyle
  eyeShape?: EyeShape
  eyeColor?: string
  eyebrowStyle?: EyebrowStyle
  noseType?: NoseType
  mouthExpression?: MouthExpression
  facialHair?: FacialHairType
  faceShape?: FaceShape
  bodyType?: BodyType
  height?: number
  accessories?: AccessoryType[]
  hasFreckles?: boolean
  hasBeautyMark?: boolean
  outfit?: AvatarOutfit
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
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
  eyeShape = 'default',
  eyeColor = '#4A3728',
  eyebrowStyle = 'default',
  noseType = 'default',
  mouthExpression = 'smile',
  facialHair = 'none',
  faceShape = 'oval',
  bodyType = 'average',
  height: avatarHeight = 165,
  accessories = [],
  hasFreckles = false,
  hasBeautyMark = false,
  outfit,
  className = '',
  size = 'lg',
}: AvatarDisplayProps) {
  const sizes = {
    xs: { width: 80, height: 120 },
    sm: { width: 120, height: 180 },
    md: { width: 180, height: 270 },
    lg: { width: 240, height: 360 },
  } as const

  const { width, height } = sizes[size]

  const clampedHeight = clamp(avatarHeight, 140, 200)
  const bodyScaleY = 0.9 + ((clampedHeight - 140) / 60) * 0.2

  const topColor = outfit?.top?.color || outfit?.dress?.color || '#E8DFD4'
  const bottomColor = outfit?.bottom?.color || '#4A4A4A'
  const shoesColor = outfit?.shoes?.color || '#2C1810'

  const body = BODY_SPECS[bodyType] ?? BODY_SPECS.average
  const torsoPath = getTorsoPath(body)

  const torsoStroke = shadeHex(topColor, -0.2)
  const hairStroke = shadeHex(hairColor, -0.35)

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 180"
        className="transition-transform duration-300"
      >
        <defs>
          <linearGradient id="avatarBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F2E0DC" />
            <stop offset="100%" stopColor="#F5F0E8" />
          </linearGradient>
          {/* Eye shine gradient */}
          <radialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="120" height="180" rx="16" fill="url(#avatarBg)" />

        {/* Body (scaled by height) */}
        <g transform={`translate(0 170)`}>
          <g transform={`scale(1 ${bodyScaleY})`}>
            <g transform={`translate(0 -170)`}>
              <BodySVG
                skinTone={skinTone}
                topColor={topColor}
                topStyle={outfit?.top?.style || outfit?.dress?.style}
                torsoPath={torsoPath}
                torsoStroke={torsoStroke}
                shoulder={body.shoulder}
                armWidth={body.armWidth}
                legWidth={body.legWidth}
                bottomColor={bottomColor}
                bottomStyle={outfit?.bottom?.style}
                shoesColor={shoesColor}
                shoesStyle={outfit?.shoes?.style}
                accessories={accessories}
              />
            </g>
          </g>
        </g>

        {/* Head */}
        <g>
          <HairBackSVG style={hairStyle} color={hairColor} />
          <HatSVG accessories={accessories} />
          <FaceSVG shape={faceShape} skinTone={skinTone} />

          {/* Freckles */}
          {hasFreckles && <FrecklesSVG skinTone={skinTone} />}

          {/* Beauty mark */}
          {hasBeautyMark && <circle cx="72" cy="46" r="1.2" fill={shadeHex(skinTone, -0.4)} />}

          {/* Eyes */}
          <EyesSVG
            eyeShape={eyeShape}
            eyeColor={eyeColor}
            skinTone={skinTone}
          />

          {/* Eyebrows */}
          <EyebrowsSVG
            style={eyebrowStyle}
            color={hairStroke}
          />

          {/* Nose */}
          <NoseSVG type={noseType} skinTone={skinTone} />

          {/* Mouth */}
          <MouthSVG expression={mouthExpression} />

          {/* Blush */}
          <ellipse cx="44.5" cy="42.5" rx="6" ry="3.8" fill="#F2C4C4" opacity="0.35" />
          <ellipse cx="75.5" cy="42.5" rx="6" ry="3.8" fill="#F2C4C4" opacity="0.35" />

          {/* Facial Hair */}
          <FacialHairSVG type={facialHair} color={hairColor} />

          {/* Hair front */}
          <HairFrontSVG style={hairStyle} color={hairColor} highlight={hairHighlights} />

          <EarringsSVG accessories={accessories} />
          <GlassesSVG accessories={accessories} />
        </g>
      </svg>
    </div>
  )
}

// ============ Eye Components ============

function EyesSVG({
  eyeShape,
  eyeColor,
  skinTone
}: {
  eyeShape: EyeShape
  eyeColor: string
  skinTone: string
}) {
  const lashColor = shadeHex(skinTone, -0.5)

  switch (eyeShape) {
    case 'round':
      return (
        <g>
          {/* White of eyes */}
          <ellipse cx="52" cy="35" rx="5" ry="5.5" fill="white" />
          <ellipse cx="68" cy="35" rx="5" ry="5.5" fill="white" />
          {/* Iris */}
          <circle cx="52" cy="35.5" r="3.2" fill={eyeColor} />
          <circle cx="68" cy="35.5" r="3.2" fill={eyeColor} />
          {/* Pupil */}
          <circle cx="52" cy="35.5" r="1.5" fill="#1a1a1a" />
          <circle cx="68" cy="35.5" r="1.5" fill="#1a1a1a" />
          {/* Shine */}
          <circle cx="53.2" cy="34" r="1.2" fill="white" opacity="0.9" />
          <circle cx="69.2" cy="34" r="1.2" fill="white" opacity="0.9" />
          {/* Upper lashes */}
          <path d="M47 33 Q52 30 57 33" stroke={lashColor} strokeWidth="1.5" fill="none" />
          <path d="M63 33 Q68 30 73 33" stroke={lashColor} strokeWidth="1.5" fill="none" />
        </g>
      )
    case 'almond':
      return (
        <g>
          <path d="M46 35 Q52 30 58 35 Q52 40 46 35" fill="white" />
          <path d="M62 35 Q68 30 74 35 Q68 40 62 35" fill="white" />
          <circle cx="52" cy="35.2" r="2.8" fill={eyeColor} />
          <circle cx="68" cy="35.2" r="2.8" fill={eyeColor} />
          <circle cx="52" cy="35.2" r="1.3" fill="#1a1a1a" />
          <circle cx="68" cy="35.2" r="1.3" fill="#1a1a1a" />
          <circle cx="53" cy="34" r="1" fill="white" opacity="0.9" />
          <circle cx="69" cy="34" r="1" fill="white" opacity="0.9" />
          <path d="M46 34.5 Q52 29 58 34.5" stroke={lashColor} strokeWidth="1.2" fill="none" />
          <path d="M62 34.5 Q68 29 74 34.5" stroke={lashColor} strokeWidth="1.2" fill="none" />
        </g>
      )
    case 'upturned':
      return (
        <g>
          <path d="M46 36 Q52 32 58 34 Q54 40 46 36" fill="white" />
          <path d="M62 34 Q68 32 74 36 Q66 40 62 34" fill="white" />
          <circle cx="52" cy="35.5" r="2.6" fill={eyeColor} />
          <circle cx="68" cy="35.5" r="2.6" fill={eyeColor} />
          <circle cx="52" cy="35.5" r="1.2" fill="#1a1a1a" />
          <circle cx="68" cy="35.5" r="1.2" fill="#1a1a1a" />
          <circle cx="53" cy="34.5" r="0.9" fill="white" opacity="0.9" />
          <circle cx="69" cy="34.5" r="0.9" fill="white" opacity="0.9" />
          <path d="M46 35 Q52 31 58 33" stroke={lashColor} strokeWidth="1.2" fill="none" />
          <path d="M62 33 Q68 31 74 35" stroke={lashColor} strokeWidth="1.2" fill="none" />
        </g>
      )
    case 'downturned':
      return (
        <g>
          <path d="M46 34 Q52 32 58 36 Q54 40 46 34" fill="white" />
          <path d="M62 36 Q68 32 74 34 Q66 40 62 36" fill="white" />
          <circle cx="52" cy="35.5" r="2.6" fill={eyeColor} />
          <circle cx="68" cy="35.5" r="2.6" fill={eyeColor} />
          <circle cx="52" cy="35.5" r="1.2" fill="#1a1a1a" />
          <circle cx="68" cy="35.5" r="1.2" fill="#1a1a1a" />
          <circle cx="53" cy="34.5" r="0.9" fill="white" opacity="0.9" />
          <circle cx="69" cy="34.5" r="0.9" fill="white" opacity="0.9" />
        </g>
      )
    case 'hooded':
      return (
        <g>
          <ellipse cx="52" cy="36" rx="4.5" ry="4" fill="white" />
          <ellipse cx="68" cy="36" rx="4.5" ry="4" fill="white" />
          <circle cx="52" cy="36.5" r="2.5" fill={eyeColor} />
          <circle cx="68" cy="36.5" r="2.5" fill={eyeColor} />
          <circle cx="52" cy="36.5" r="1.2" fill="#1a1a1a" />
          <circle cx="68" cy="36.5" r="1.2" fill="#1a1a1a" />
          <circle cx="53" cy="35.5" r="0.8" fill="white" opacity="0.9" />
          <circle cx="69" cy="35.5" r="0.8" fill="white" opacity="0.9" />
          {/* Hood effect */}
          <path d="M47 33 Q52 32 57 33" stroke={skinTone} strokeWidth="3" fill="none" />
          <path d="M63 33 Q68 32 73 33" stroke={skinTone} strokeWidth="3" fill="none" />
        </g>
      )
    case 'default':
    default:
      return (
        <g>
          {/* White of eyes */}
          <ellipse cx="52" cy="35" rx="4.5" ry="5" fill="white" />
          <ellipse cx="68" cy="35" rx="4.5" ry="5" fill="white" />
          {/* Iris with gradient */}
          <circle cx="52" cy="35.7" r="2.8" fill={eyeColor} />
          <circle cx="68" cy="35.7" r="2.8" fill={eyeColor} />
          {/* Pupil */}
          <circle cx="52" cy="35.7" r="1.3" fill="#1a1a1a" />
          <circle cx="68" cy="35.7" r="1.3" fill="#1a1a1a" />
          {/* Shine */}
          <circle cx="53" cy="34.5" r="1" fill="white" opacity="0.9" />
          <circle cx="69" cy="34.5" r="1" fill="white" opacity="0.9" />
          <circle cx="51" cy="36.5" r="0.5" fill="white" opacity="0.6" />
          <circle cx="67" cy="36.5" r="0.5" fill="white" opacity="0.6" />
          {/* Upper lash line */}
          <path d="M47.5 32 Q52 30 56.5 32" stroke={lashColor} strokeWidth="1.3" fill="none" />
          <path d="M63.5 32 Q68 30 72.5 32" stroke={lashColor} strokeWidth="1.3" fill="none" />
        </g>
      )
  }
}

// ============ Eyebrow Components ============

function EyebrowsSVG({ style, color }: { style: EyebrowStyle; color: string }) {
  switch (style) {
    case 'thick':
      return (
        <g>
          <path d="M45 27 Q52 24 58 27.5" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M62 27.5 Q68 24 75 27" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'thin':
      return (
        <g>
          <path d="M46 27.5 Q52 26 57 28" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M63 28 Q68 26 74 27.5" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'arched':
      return (
        <g>
          <path d="M45 29 Q50 24 58 28" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M62 28 Q70 24 75 29" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'straight':
      return (
        <g>
          <path d="M46 27 L57 27" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M63 27 L74 27" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'rounded':
      return (
        <g>
          <path d="M46 28 Q52 25 58 28" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M62 28 Q68 25 74 28" stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </g>
      )
    case 'default':
    default:
      return (
        <g>
          <path d="M45.5 27.5 Q52 25.5 58 27.8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M62 27.8 Q68 25.5 74.5 27.5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )
  }
}

// ============ Nose Components ============

function NoseSVG({ type, skinTone }: { type: NoseType; skinTone: string }) {
  const stroke = shadeHex(skinTone, -0.15)

  switch (type) {
    case 'small':
      return (
        <path d="M60 38 Q61 42 60 44" stroke={stroke} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
      )
    case 'wide':
      return (
        <g>
          <path d="M60 36 Q62 42 60 45" stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M56 45 Q60 47 64 45" stroke={stroke} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
        </g>
      )
    case 'pointed':
      return (
        <path d="M60 35 L61.5 44 L60 45" stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
      )
    case 'button':
      return (
        <g>
          <path d="M60 38 Q61 42 60 44" stroke={stroke} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
          <circle cx="60" cy="44.5" r="2" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.4" />
        </g>
      )
    case 'roman':
      return (
        <path d="M60 34 Q63 38 62 42 Q61 45 60 46" stroke={stroke} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.6" />
      )
    case 'default':
    default:
      return (
        <path d="M60 35.5 Q62.3 41.5 60.2 44.8" stroke={stroke} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      )
  }
}

// ============ Mouth Components ============

function MouthSVG({ expression }: { expression: MouthExpression }) {
  switch (expression) {
    case 'laugh':
      return (
        <g>
          <path d="M51 48 Q60 58 69 48" stroke="#D4A5A5" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M53 50 Q60 54 67 50" fill="#8B4A4A" opacity="0.3" />
          {/* Teeth hint */}
          <path d="M54 50 L66 50" stroke="white" strokeWidth="2" opacity="0.8" />
        </g>
      )
    case 'neutral':
      return (
        <path d="M54 50 L66 50" stroke="#C49A9A" strokeWidth="2" fill="none" strokeLinecap="round" />
      )
    case 'serious':
      return (
        <path d="M54 51 Q60 49 66 51" stroke="#B88A8A" strokeWidth="2" fill="none" strokeLinecap="round" />
      )
    case 'slight-smile':
      return (
        <path d="M54 49 Q60 52 66 49" stroke="#D4A5A5" strokeWidth="2" fill="none" strokeLinecap="round" />
      )
    case 'smile':
    default:
      return (
        <path d="M53 49.5 Q60 55 67 49.5" stroke="#D4A5A5" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      )
  }
}

// ============ Facial Hair Components ============

function FacialHairSVG({ type, color }: { type?: FacialHairType; color: string }) {
  if (!type || type === 'none') return null

  const darkColor = shadeHex(color, -0.2)

  switch (type) {
    case 'stubble':
      return (
        <g opacity="0.4">
          {/* Stubble dots pattern */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={50 + (i % 5) * 4 + Math.random() * 2}
              cy={52 + Math.floor(i / 5) * 3 + Math.random() * 2}
              r="0.5"
              fill={darkColor}
            />
          ))}
        </g>
      )
    case 'short-beard':
      return (
        <g>
          <path
            d="M42 48 Q42 60 50 64 Q60 68 70 64 Q78 60 78 48"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M54 49 Q60 53 66 49"
            stroke="#D4A5A5"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )
    case 'full-beard':
      return (
        <g>
          <path
            d="M40 46 Q38 60 48 72 Q60 78 72 72 Q82 60 80 46"
            fill={color}
            opacity="0.75"
          />
          <path
            d="M54 49 Q60 52 66 49"
            stroke="#D4A5A5"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )
    case 'goatee':
      return (
        <g>
          <path
            d="M52 52 Q52 62 60 66 Q68 62 68 52"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M54 50 Q60 54 66 50"
            stroke="#D4A5A5"
            strokeWidth="2"
            fill="none"
          />
        </g>
      )
    case 'mustache':
      return (
        <path
          d="M50 48 Q54 46 60 48 Q66 46 70 48 Q66 52 60 50 Q54 52 50 48"
          fill={color}
          opacity="0.8"
        />
      )
    default:
      return null
  }
}

// ============ Freckles ============

function FrecklesSVG({ skinTone }: { skinTone: string }) {
  const freckleColor = shadeHex(skinTone, -0.25)
  return (
    <g opacity="0.5">
      {/* Left cheek */}
      <circle cx="44" cy="40" r="0.8" fill={freckleColor} />
      <circle cx="46" cy="42" r="0.6" fill={freckleColor} />
      <circle cx="42" cy="43" r="0.7" fill={freckleColor} />
      <circle cx="48" cy="40" r="0.5" fill={freckleColor} />
      <circle cx="45" cy="44" r="0.6" fill={freckleColor} />
      {/* Right cheek */}
      <circle cx="76" cy="40" r="0.8" fill={freckleColor} />
      <circle cx="74" cy="42" r="0.6" fill={freckleColor} />
      <circle cx="78" cy="43" r="0.7" fill={freckleColor} />
      <circle cx="72" cy="40" r="0.5" fill={freckleColor} />
      <circle cx="75" cy="44" r="0.6" fill={freckleColor} />
      {/* Nose bridge */}
      <circle cx="58" cy="38" r="0.5" fill={freckleColor} />
      <circle cx="62" cy="38" r="0.5" fill={freckleColor} />
      <circle cx="60" cy="40" r="0.4" fill={freckleColor} />
    </g>
  )
}

// ============ Body Components ============

function BodySVG({
  skinTone,
  topColor,
  topStyle,
  torsoPath,
  torsoStroke,
  shoulder,
  armWidth,
  legWidth,
  bottomColor,
  bottomStyle,
  shoesColor,
  shoesStyle,
  accessories,
}: {
  skinTone: string
  topColor: string
  topStyle?: string
  torsoPath: string
  torsoStroke: string
  shoulder: number
  armWidth: number
  legWidth: number
  bottomColor: string
  bottomStyle?: string
  shoesColor: string
  shoesStyle?: string
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

      {/* Sleeves based on top style */}
      <SleevesSVG
        topStyle={topStyle}
        topColor={topColor}
        leftArmX={leftArmX}
        rightArmX={rightArmX}
        armWidth={armWidth}
        armY={armY}
      />

      {/* Torso */}
      <TorsoSVG
        topStyle={topStyle}
        topColor={topColor}
        torsoPath={torsoPath}
        torsoStroke={torsoStroke}
      />

      {necklace && <NecklaceSVG necklace={necklace} />}

      {/* Legs based on bottom style */}
      <LegsSVG
        bottomStyle={bottomStyle}
        bottomColor={bottomColor}
        leftLegX={leftLegX}
        rightLegX={rightLegX}
        legWidth={legWidth}
      />

      {/* Shoes based on style */}
      <ShoesSVG
        shoesStyle={shoesStyle}
        shoesColor={shoesColor}
        leftLegX={leftLegX}
        rightLegX={rightLegX}
        legWidth={legWidth}
      />

      {watch && <WristSVG wrist={watch} leftArmX={leftArmX} armWidth={armWidth} />}
    </g>
  )
}

function SleevesSVG({
  topStyle,
  topColor,
  leftArmX,
  rightArmX,
  armWidth,
  armY,
}: {
  topStyle?: string
  topColor: string
  leftArmX: number
  rightArmX: number
  armWidth: number
  armY: number
}) {
  const sleeveColor = shadeHex(topColor, -0.06)

  // Determine sleeve length based on style
  let sleeveLength = 20 // default short sleeve

  if (topStyle === 'tank-top' || topStyle === 'crop-top') {
    sleeveLength = 0
  } else if (topStyle === 'sweater' || topStyle === 'hoodie' || topStyle === 'jacket' || topStyle === 'coat' || topStyle === 'cardigan') {
    sleeveLength = 38 // long sleeve
  } else if (topStyle === 'blouse' || topStyle === 'button-shirt') {
    sleeveLength = 32 // 3/4 sleeve
  }

  if (sleeveLength === 0) return null

  return (
    <g>
      <rect x={leftArmX} y={armY - 2} width={armWidth} height={sleeveLength} rx={armWidth / 2} fill={sleeveColor} />
      <rect x={rightArmX} y={armY - 2} width={armWidth} height={sleeveLength} rx={armWidth / 2} fill={sleeveColor} />
    </g>
  )
}

function TorsoSVG({
  topStyle,
  topColor,
  torsoPath,
  torsoStroke,
}: {
  topStyle?: string
  topColor: string
  torsoPath: string
  torsoStroke: string
}) {
  // Add collar/neckline details based on style
  return (
    <g>
      <path d={torsoPath} fill={topColor} stroke={torsoStroke} strokeWidth="0.8" />

      {/* Collar variations */}
      {topStyle === 'polo' && (
        <path d="M52 68 L52 72 L60 76 L68 72 L68 68" fill={shadeHex(topColor, -0.1)} stroke={torsoStroke} strokeWidth="0.5" />
      )}
      {topStyle === 'button-shirt' && (
        <g>
          <path d="M57 68 L57 90" stroke={torsoStroke} strokeWidth="0.8" />
          <path d="M63 68 L63 90" stroke={torsoStroke} strokeWidth="0.8" />
          {/* Buttons */}
          <circle cx="60" cy="75" r="1.5" fill={shadeHex(topColor, -0.2)} />
          <circle cx="60" cy="85" r="1.5" fill={shadeHex(topColor, -0.2)} />
          <circle cx="60" cy="95" r="1.5" fill={shadeHex(topColor, -0.2)} />
        </g>
      )}
      {topStyle === 'hoodie' && (
        <g>
          <path d="M48 68 Q60 78 72 68" fill="none" stroke={torsoStroke} strokeWidth="1.5" />
          {/* Hood strings */}
          <path d="M54 72 L54 85" stroke={torsoStroke} strokeWidth="1" />
          <path d="M66 72 L66 85" stroke={torsoStroke} strokeWidth="1" />
        </g>
      )}
      {(topStyle === 'tshirt' || topStyle === 'sweater') && (
        <path d="M52 66 Q60 72 68 66" fill="none" stroke={torsoStroke} strokeWidth="1" />
      )}
    </g>
  )
}

function LegsSVG({
  bottomStyle,
  bottomColor,
  leftLegX,
  rightLegX,
  legWidth,
}: {
  bottomStyle?: string
  bottomColor: string
  leftLegX: number
  rightLegX: number
  legWidth: number
}) {
  const legHeight = bottomStyle?.includes('short') ? 24 : 44
  const legY = 128

  if (bottomStyle?.includes('skirt')) {
    // Skirt rendering
    const skirtLength = bottomStyle === 'skirt-short' ? 20 : bottomStyle === 'skirt-midi' ? 35 : 50
    return (
      <g>
        <path
          d={`M${leftLegX - 4} 128 Q${60} ${128 + skirtLength + 10} ${rightLegX + legWidth + 4} 128`}
          fill={bottomColor}
        />
        {/* Legs showing below skirt */}
        {bottomStyle !== 'skirt-long' && (
          <g>
            <rect x={leftLegX + 2} y={128 + skirtLength - 5} width={legWidth - 4} height={50 - skirtLength} rx="6" fill="#E8C4A8" />
            <rect x={rightLegX + 2} y={128 + skirtLength - 5} width={legWidth - 4} height={50 - skirtLength} rx="6" fill="#E8C4A8" />
          </g>
        )}
      </g>
    )
  }

  return (
    <g>
      <rect x={leftLegX} y={legY} width={legWidth} height={legHeight} rx="8" fill={bottomColor} />
      <rect x={rightLegX} y={legY} width={legWidth} height={legHeight} rx="8" fill={bottomColor} />
    </g>
  )
}

function ShoesSVG({
  shoesStyle,
  shoesColor,
  leftLegX,
  rightLegX,
  legWidth,
}: {
  shoesStyle?: string
  shoesColor: string
  leftLegX: number
  rightLegX: number
  legWidth: number
}) {
  const leftCenterX = leftLegX + legWidth / 2
  const rightCenterX = rightLegX + legWidth / 2

  switch (shoesStyle) {
    case 'heels':
      return (
        <g>
          <ellipse cx={leftCenterX} cy="172" rx="10" ry="5" fill={shoesColor} />
          <ellipse cx={rightCenterX} cy="172" rx="10" ry="5" fill={shoesColor} />
          {/* Heels */}
          <rect x={leftCenterX - 2} y="172" width="4" height="6" fill={shoesColor} />
          <rect x={rightCenterX - 2} y="172" width="4" height="6" fill={shoesColor} />
        </g>
      )
    case 'boots':
      return (
        <g>
          <rect x={leftLegX - 2} y="164" width={legWidth + 4} height="14" rx="4" fill={shoesColor} />
          <rect x={rightLegX - 2} y="164" width={legWidth + 4} height="14" rx="4" fill={shoesColor} />
        </g>
      )
    case 'sandals':
      return (
        <g>
          <ellipse cx={leftCenterX} cy="174" rx="12" ry="4" fill={shoesColor} opacity="0.8" />
          <ellipse cx={rightCenterX} cy="174" rx="12" ry="4" fill={shoesColor} opacity="0.8" />
          <path d={`M${leftCenterX - 6} 172 L${leftCenterX} 168 L${leftCenterX + 6} 172`} stroke={shoesColor} strokeWidth="2" fill="none" />
          <path d={`M${rightCenterX - 6} 172 L${rightCenterX} 168 L${rightCenterX + 6} 172`} stroke={shoesColor} strokeWidth="2" fill="none" />
        </g>
      )
    case 'sneakers':
    default:
      return (
        <g>
          <ellipse cx={leftCenterX} cy="173" rx="13" ry="6.5" fill={shoesColor} opacity="0.95" />
          <ellipse cx={rightCenterX} cy="173" rx="13" ry="6.5" fill={shoesColor} opacity="0.95" />
          {/* Sneaker details */}
          <ellipse cx={leftCenterX + 4} cy="172" rx="4" ry="2" fill="white" opacity="0.3" />
          <ellipse cx={rightCenterX + 4} cy="172" rx="4" ry="2" fill="white" opacity="0.3" />
        </g>
      )
  }
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

// ============ Face Shape ============

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

// ============ Hair Components ============

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

function HairBackSVG({ style, color }: { style: HairStyle; color: string }) {
  const normalized = normalizeHairStyle(style)

  // Hair that goes behind the head
  if (normalized === 'long-wavy' || normalized === 'long-straight') {
    return (
      <path
        d="M36 30 Q32 50 35 70 L40 75 L40 65 Q38 50 40 35 Z M84 30 Q88 50 85 70 L80 75 L80 65 Q82 50 80 35 Z"
        fill={color}
        opacity="0.9"
      />
    )
  }
  return null
}

function HairFrontSVG({ style, color, highlight }: { style: HairStyle; color: string; highlight?: string }) {
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
    case 'long-straight':
      return (
        <g>
          <path
            d={[
              'M 36 27',
              'Q 35 14 46 9',
              'Q 55 4 60 7',
              'Q 65 4 74 9',
              'Q 85 14 84 27',
              'L 84 34',
              'Q 78 32 70 32',
              'Q 60 32 50 32',
              'Q 42 32 36 34',
              'L 36 27 Z',
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
    case 'short-curly':
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
    case 'pixie':
      return (
        <path
          d="M40 28 Q38 18 48 12 Q58 6 60 9 Q62 6 72 12 Q82 18 80 28 Q78 34 72 31 Q66 28 60 28 Q54 28 48 31 Q42 34 40 28"
          fill={color}
        />
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

// ============ Accessory Components ============

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

// ============ Utility Functions ============

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
