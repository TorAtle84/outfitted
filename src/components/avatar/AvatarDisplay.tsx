'use client'

import { useState } from 'react'

interface AvatarDisplayProps {
  skinTone?: string
  hairColor?: string
  hairStyle?: string
  eyeColor?: string
  bodyType?: string
  outfit?: {
    top?: string
    bottom?: string
    shoes?: string
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AvatarDisplay({
  skinTone = '#E8C4A8',
  hairColor = '#2C1810',
  hairStyle = 'long-wavy',
  eyeColor = '#4A3728',
  bodyType = 'average',
  outfit,
  className = '',
  size = 'lg',
}: AvatarDisplayProps) {
  const [rotation, setRotation] = useState(0)

  const sizes = {
    sm: { width: 120, height: 180 },
    md: { width: 180, height: 270 },
    lg: { width: 240, height: 360 },
  }

  const { width, height } = sizes[size]

  return (
    <div className={`relative ${className}`}>
      {/* Rotation Controls */}
      <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <button
          onClick={() => setRotation((r) => r - 45)}
          className="w-8 h-8 bg-beige hover:bg-blush rounded-full flex items-center justify-center transition-colors"
          aria-label="Rotate left"
        >
          <svg className="w-4 h-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
        </button>
        <button
          onClick={() => setRotation((r) => r + 45)}
          className="w-8 h-8 bg-beige hover:bg-blush rounded-full flex items-center justify-center transition-colors"
          aria-label="Rotate right"
        >
          <svg className="w-4 h-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      {/* Avatar SVG */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 120 180"
        className="transition-transform duration-300"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {/* Background */}
        <defs>
          <linearGradient id="avatarBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F2E0DC" />
            <stop offset="100%" stopColor="#F5F0E8" />
          </linearGradient>
        </defs>
        <rect width="120" height="180" rx="16" fill="url(#avatarBg)" />

        {/* Body */}
        <g>
          {/* Neck */}
          <rect x="50" y="55" width="20" height="15" fill={skinTone} rx="3" />

          {/* Torso - outfit or default */}
          <rect
            x="35"
            y="68"
            width="50"
            height="55"
            rx="8"
            fill={outfit?.top || '#E8DFD4'}
          />

          {/* Arms */}
          <rect x="20" y="70" width="18" height="40" rx="9" fill={skinTone} />
          <rect x="82" y="70" width="18" height="40" rx="9" fill={skinTone} />

          {/* Sleeves */}
          <rect x="20" y="68" width="18" height="20" rx="6" fill={outfit?.top || '#E8DFD4'} />
          <rect x="82" y="68" width="18" height="20" rx="6" fill={outfit?.top || '#E8DFD4'} />

          {/* Legs/Pants */}
          <rect
            x="38"
            y="120"
            width="20"
            height="45"
            rx="6"
            fill={outfit?.bottom || '#4A4A4A'}
          />
          <rect
            x="62"
            y="120"
            width="20"
            height="45"
            rx="6"
            fill={outfit?.bottom || '#4A4A4A'}
          />

          {/* Shoes */}
          <ellipse cx="48" cy="168" rx="12" ry="6" fill={outfit?.shoes || '#2C1810'} />
          <ellipse cx="72" cy="168" rx="12" ry="6" fill={outfit?.shoes || '#2C1810'} />
        </g>

        {/* Head */}
        <g>
          {/* Face */}
          <ellipse cx="60" cy="35" rx="22" ry="25" fill={skinTone} />

          {/* Hair */}
          <HairSVG style={hairStyle} color={hairColor} />

          {/* Eyes */}
          <ellipse cx="52" cy="35" rx="3" ry="3.5" fill="white" />
          <ellipse cx="68" cy="35" rx="3" ry="3.5" fill="white" />
          <circle cx="52" cy="35.5" r="2" fill={eyeColor} />
          <circle cx="68" cy="35.5" r="2" fill={eyeColor} />
          <circle cx="52.5" cy="34.5" r="0.5" fill="white" />
          <circle cx="68.5" cy="34.5" r="0.5" fill="white" />

          {/* Eyebrows */}
          <path
            d="M47 28 Q52 26 56 28"
            stroke={hairColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M64 28 Q68 26 73 28"
            stroke={hairColor}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Nose */}
          <path
            d="M60 36 Q62 42 60 44 Q58 42 60 36"
            fill={skinTone}
            stroke={`${skinTone}99`}
            strokeWidth="0.5"
          />

          {/* Mouth */}
          <path
            d="M55 49 Q60 53 65 49"
            stroke="#D4A5A5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Blush */}
          <ellipse cx="45" cy="42" rx="5" ry="3" fill="#F2C4C4" opacity="0.4" />
          <ellipse cx="75" cy="42" rx="5" ry="3" fill="#F2C4C4" opacity="0.4" />
        </g>
      </svg>

      {/* Rotation Indicator */}
      <div className="text-center mt-2">
        <span className="text-xs text-taupe">{rotation}°</span>
      </div>
    </div>
  )
}

function HairSVG({ style, color }: { style: string; color: string }) {
  switch (style) {
    case 'long-wavy':
      return (
        <g>
          <path
            d="M38 25 Q35 15 45 10 Q55 5 60 8 Q65 5 75 10 Q85 15 82 25 Q85 40 80 55 Q75 65 70 70 L70 60 Q72 50 70 40 Q68 35 60 35 Q52 35 50 40 Q48 50 50 60 L50 70 Q45 65 40 55 Q35 40 38 25"
            fill={color}
          />
          <path
            d="M50 60 Q48 75 50 85"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M70 60 Q72 75 70 85"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )
    case 'short-straight':
      return (
        <path
          d="M38 30 Q35 20 45 12 Q55 5 60 8 Q65 5 75 12 Q85 20 82 30 Q80 35 75 32 Q70 28 60 28 Q50 28 45 32 Q40 35 38 30"
          fill={color}
        />
      )
    case 'bob':
      return (
        <g>
          <path
            d="M38 25 Q35 15 45 10 Q55 5 60 8 Q65 5 75 10 Q85 15 82 25 Q85 45 78 55 Q75 58 72 55 L70 45 Q68 35 60 35 Q52 35 50 45 L48 55 Q45 58 42 55 Q35 45 38 25"
            fill={color}
          />
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
    default:
      return (
        <path
          d="M38 30 Q35 20 45 12 Q55 5 60 8 Q65 5 75 12 Q85 20 82 30 Q80 35 75 32 Q70 28 60 28 Q50 28 45 32 Q40 35 38 30"
          fill={color}
        />
      )
  }
}
