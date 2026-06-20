import React from 'react';

interface AccentProps {
  color?: string;
  w?: number;
  h?: number;
  strokeWidth?: number;
  size?: number;
  style?: React.CSSProperties;
  flip?: boolean;
  filled?: boolean;
  bg?: string;
  accent?: string;
  colors?: string[];
  count?: number;
}

export function Squiggle({ color = 'currentColor', w = 80, h = 12, strokeWidth = 2.2 }: AccentProps) {
  return (
    <svg width={w} height={h} viewBox="0 0 80 12" fill="none" style={{ display: 'block' }}>
      <path d="M1 6 C 8 1, 14 11, 21 6 S 34 1, 41 6 S 54 11, 61 6 S 74 1, 79 6"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function Underline({ color = 'currentColor', w = 160, h = 14 }: AccentProps) {
  return (
    <svg width={w} height={h} viewBox="0 0 160 14" fill="none" style={{ display: 'block' }}>
      <path d="M3 8 Q 40 2, 80 6 T 157 5" stroke={color} strokeWidth="2.6" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function Circle({ color = 'currentColor', size = 140, strokeWidth = 2.6 }: AccentProps) {
  const height = size ? size * 0.42 : 58;
  return (
    <svg width={size} height={height} viewBox="0 0 140 58" fill="none" style={{ display: 'block' }}>
      <path d="M15 30 C 15 8, 125 8, 130 28 S 100 54, 60 52 S 10 44, 18 28"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"/>
    </svg>
  );
}

export function Sparkle({ color = 'currentColor', size = 20, style }: AccentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5 Z"
        fill={color}/>
    </svg>
  );
}

export function Dot({ color = 'currentColor', size = 6, style }: AccentProps) {
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: color, ...style }} />;
}

export function Floral({ color = 'currentColor', size = 100, style }: AccentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
      <g stroke={color} strokeWidth="2" fill="none" strokeLinecap="round">
        {[0, 72, 144, 216, 288].map(a => (
          <ellipse key={a} cx="50" cy="26" rx="11" ry="18"
            transform={`rotate(${a} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="6" fill={color}/>
      </g>
    </svg>
  );
}

export function Bouquet({ color = 'currentColor', colors, size = 100, style }: AccentProps) {
  const cCoral = colors?.[0] || '#C4663E'; // coral / terracotta
  const cIvory = colors?.[1] || '#F7F3E9'; // ivory / cream
  const cGold = colors?.[2] || '#8BBDD4';  // sage / gold

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={style}>
      {/* 1. Leaves (background fills) */}
      <path d="M 38 42 Q 22 34 32 24 Q 42 30 38 42" fill={cGold} fillOpacity={0.25} />
      <path d="M 58 48 Q 72 52 68 64 Q 58 60 58 48" fill={cGold} fillOpacity={0.25} />

      {/* 2. Left Rosebud fill */}
      <path d="M 34 50 C 27 46, 30 38, 36 42 C 40 40, 43 47, 34 50 Z" fill={cCoral} fillOpacity={0.9} />

      {/* 3. Center Peony fill */}
      <path d="M 35 32 C 30 38, 32 46, 42 46 C 55 46, 68 46, 65 32 C 70 30, 58 22, 50 22 C 42 22, 30 30, 35 32 Z" fill={cIvory} fillOpacity={0.95} />

      {/* 4. Right side blossom/accent fill */}
      <path d="M 56 46 Q 66 40 72 48 Q 66 56 56 46 Z" fill={cCoral} fillOpacity={0.85} />

      {/* 5. Stems & Outlines group */}
      <g stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Twine Wrap (Minimalist organic lines holding stems) */}
        <path d="M45 68 C 48 70, 52 70, 55 68" />
        <path d="M44.5 70.5 C 47.5 72.5, 51.5 72.5, 54.5 70.5" />

        {/* Stems extending down organically */}
        <path d="M50 40 Q 48 60 48 85" />
        <path d="M34 50 Q 44 65 52 87" strokeWidth="1.2" />
        <path d="M54 44 Q 50 68 44 83" strokeWidth="1.2" />
        <path d="M56 46 Q 52 64 47 84" strokeWidth="1.2" />

        {/* Left Rosebud lines */}
        <path d="M 34 50 C 27 46, 30 38, 36 42 C 40 40, 43 47, 34 50" />
        <path d="M 31 46 C 32 43, 35 43, 36 45" />
        <path d="M 29 48 C 30 52, 33 52, 34 50" />
        <path d="M 34 50 C 37 54, 40 50, 39 46" />

        {/* Right blossom lines */}
        <path d="M 56 46 Q 66 40 72 48 Q 66 56 56 46" />
        <path d="M 60 44 C 64 45, 66 48, 63 50" />

        {/* Delicate Berry/Leaf Sprig branching right */}
        <path d="M 54 42 Q 68 34 78 22" strokeWidth="1.2" />
        {/* Berries on the sprig - filled with high opacity colors */}
        <circle cx="78" cy="22" r="2.5" fill={cCoral} fillOpacity={0.9} stroke={color} strokeWidth="1" />
        <circle cx="71" cy="27" r="2" fill={cIvory} fillOpacity={0.9} stroke={color} strokeWidth="1" />
        <circle cx="65" cy="32" r="2.5" fill={cCoral} fillOpacity={0.9} stroke={color} strokeWidth="1" />
        <circle cx="60" cy="37" r="1.5" fill={cIvory} fillOpacity={0.9} stroke={color} strokeWidth="1" />

        {/* Leaf outlines */}
        <path d="M 38 42 Q 22 34 32 24 Q 42 30 38 42" />
        <path d="M 32 24 Q 35 33 38 42" strokeWidth="1" />
        
        <path d="M 58 48 Q 72 52 68 64 Q 58 60 58 48" />
        <path d="M 58 48 Q 63 54 68 64" strokeWidth="1" />

        {/* Center Blooming Peony / Rose lines */}
        <path d="M 50 36 C 48.5 35, 51.5 35, 50 36.5 C 49 37.5, 51 38.5, 50 39" />
        <path d="M 46 34 C 44 30, 56 30, 54 34" />
        <path d="M 43 38 C 40 33, 45 27, 50 28 C 55 27, 60 33, 57 38" />
        <path d="M 43 38 C 45 42, 55 42, 57 38" />
        <path d="M 38 38 C 30 30, 42 22, 50 22 C 58 22, 70 30, 62 38" />
        <path d="M 38 38 C 39 46, 61 46, 62 38" />
        <path d="M 35 32 C 30 38, 32 46, 42 46" />
        <path d="M 65 32 C 70 38, 68 46, 58 46" />
      </g>
    </svg>
  );
}

export function Leaf({ color = 'currentColor', size = 60, style, flip = false }: AccentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ ...style, transform: flip ? 'scaleX(-1)' : undefined }}>
      <path d="M10 50 Q 10 20 45 10 Q 50 35 10 50 Z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
      <path d="M12 48 Q 25 35 42 15" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function Arrow({ color = 'currentColor', w = 60, h = 30, style }: AccentProps) {
  return (
    <svg width={w} height={h} viewBox="0 0 60 30" fill="none" style={style}>
      <path d="M3 15 Q 20 3, 52 15" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M44 8 L 52 15 L 44 22" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function Heart({ color = 'currentColor', size = 20, filled = true, style }: AccentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style}>
      <path d="M10 17 C 10 17, 2 12, 2 7 A 4 4 0 0 1 10 5 A 4 4 0 0 1 18 7 C 18 12, 10 17, 10 17 Z"
        fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  );
}

export function Sun({ color = 'currentColor', size = 50, style }: AccentProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" style={style}>
      <circle cx="25" cy="25" r="8" stroke={color} strokeWidth="2" fill="none"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <line key={a} x1="25" y1="6" x2="25" y2="12"
          stroke={color} strokeWidth="2" strokeLinecap="round"
          transform={`rotate(${a} 25 25)`}/>
      ))}
    </svg>
  );
}

export function RingsAccent({ color = 'currentColor', size = 80, style }: AccentProps) {
  const height = size ? size * 0.6 : 48;
  return (
    <svg width={size} height={height} viewBox="0 0 80 48" fill="none" style={style}>
      <circle cx="28" cy="26" r="16" stroke={color} strokeWidth="2.2" fill="none"/>
      <circle cx="52" cy="26" r="16" stroke={color} strokeWidth="2.2" fill="none"/>
      <path d="M24 10 L28 4 L32 10 Z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
      <path d="M48 10 L52 4 L56 10 Z" stroke={color} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}

export function Envelope({ color = 'currentColor', bg = '#FAF6EC', size = 240, accent = '#E8B04E' }: AccentProps) {
  const height = size ? size * 0.68 : 163;
  return (
    <svg width={size} height={height} viewBox="0 0 240 163" fill="none">
      <rect x="4" y="24" width="232" height="135" rx="4" fill={bg} stroke={color} strokeWidth="2.4"/>
      <path d="M6 27 L 120 100 L 234 27" stroke={color} strokeWidth="2.4" fill="none" strokeLinejoin="round"/>
      <circle cx="120" cy="100" r="18" fill={accent} stroke={color} strokeWidth="2"/>
      <text x="120" y="106" textAnchor="middle" fontFamily="'DM Serif Display', serif" fontSize="16" fill={color} fontWeight="700">T&amp;D</text>
    </svg>
  );
}

export function Confetti({ colors = ['#1A2E5C', '#E8B04E', '#D7604C'], count = 30, style }: AccentProps) {
  const items = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const c = colors[i % colors.length];
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const r = Math.random() * 360;
      const shape = i % 3;
      return { c, x, y, r, shape, key: i };
    });
  }, [colors, count]);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...style }}>
      {items.map(it => (
        it.shape === 0 ? (
          <rect key={it.key} x={it.x} y={it.y} width="1.2" height="0.4" fill={it.c} transform={`rotate(${it.r} ${it.x} ${it.y})`}/>
        ) : it.shape === 1 ? (
          <circle key={it.key} cx={it.x} cy={it.y} r="0.35" fill={it.c}/>
        ) : (
          <path key={it.key} d={`M${it.x} ${it.y} l 0.6 -0.4 l 0.3 0.8 Z`} fill={it.c}/>
        )
      ))}
    </svg>
  );
}
