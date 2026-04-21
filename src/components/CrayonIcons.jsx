// 크레용 느낌 SVG 아이콘 모음
export function IconMap({ size = 32, color = '#5BAF3C' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 3C10 3 5 8 5 14c0 8 11 16 11 16s11-8 11-16c0-6-5-11-11-11z"
        fill={color} stroke="#5C3D1E" strokeWidth="2.5" strokeLinejoin="round"
        style={{ filter: 'url(#crayon)' }} />
      <circle cx="16" cy="14" r="4" fill="#FFF8F0" stroke="#5C3D1E" strokeWidth="2" />
      <defs>
        <filter id="crayon">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
        </filter>
      </defs>
    </svg>
  )
}

export function IconFire({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2s-5 5-5 10a5 5 0 0010 0c0-3-2-6-2-6s-1 2-2 3c-1-2-1-7-1-7z"
        fill="#E8453C" stroke="#5C3D1E" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 16a2 2 0 000 4 2 2 0 000-4z" fill="#FFA500" />
    </svg>
  )
}

export function IconLocation({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="4" fill="#E8453C" stroke="#5C3D1E" strokeWidth="2.5" />
      <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z"
        stroke="#5C3D1E" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function IconRefresh({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 018-8 8 8 0 016 2.8L20 4v6h-6l2.5-2.5A5 5 0 1017 17"
        stroke="#5C3D1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSearch({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="#5C3D1E" strokeWidth="2.5" />
      <path d="M16.5 16.5L21 21" stroke="#5C3D1E" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function IconStore({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="18" height="11" rx="2" fill="#FFF8F0" stroke="#5C3D1E" strokeWidth="2.2" />
      <path d="M3 10l3-7h12l3 7" stroke="#5C3D1E" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M9 21v-6h6v6" stroke="#5C3D1E" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 10h18" stroke="#5C3D1E" strokeWidth="2" />
    </svg>
  )
}

// 음식별 크레용 아이콘 (텍스트 기반 SVG)
export function FoodIcon({ emoji, size = 22 }) {
  return (
    <span style={{
      fontSize: size,
      filter: 'saturate(0.7) contrast(1.1)',
      display: 'inline-block',
      imageRendering: 'crisp-edges',
    }}>
      {emoji}
    </span>
  )
}
