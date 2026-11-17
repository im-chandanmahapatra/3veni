import { useId } from 'react';

/**
 * Architectural & cultural SVG motifs derived directly from the original
 * 3VENI SPHERE emblem: circular outer border, central bindu dot, four swirling
 * teardrop quadrants, Warli triangle friezes, and symmetrical 8-petal rosettes.
 */

export function SphereCrestDivider({
  tone = 'light',
  folioLabel,
  className = '',
}: {
  tone?: 'light' | 'dark' | 'olive';
  folioLabel?: string;
  className?: string;
}) {
  const lineColor =
    tone === 'olive'
      ? 'bg-[#C49A50]/40'
      : tone === 'dark'
        ? 'bg-[#C49A50]/30'
        : 'bg-[#C8BCA9]';
  const primaryStroke = tone === 'light' ? '#98400F' : '#C49A50';
  const secondaryStroke = tone === 'light' ? '#41490D' : '#E5C185';
  const labelColor = tone === 'light' ? 'text-[#493023]' : 'text-[#EDE5D6]';

  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      {folioLabel && (
        <span className={`font-mono text-[10px] tracking-[0.22em] uppercase shrink-0 ${labelColor}`}>
          {folioLabel}
        </span>
      )}
      <span className={`h-[1px] flex-1 ${lineColor}`} />
      <svg width="32" height="32" viewBox="0 0 36 36" fill="none" className="shrink-0">
        {/* Outer containment ring echoing logo border */}
        <circle cx="18" cy="18" r="16.2" stroke={primaryStroke} strokeWidth="1" strokeOpacity="0.8" />
        {/* Central bindu sphere */}
        <circle cx="18" cy="18" r="2.6" fill={primaryStroke} fillOpacity="0.92" />
        {/* Four swirling Triveni quadrant curves alternating Terracotta & Deep Olive */}
        <path
          d="M18 4.2 C21.8 8.4, 21.8 12.6, 18 14.2"
          stroke={primaryStroke}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M31.8 18 C27.6 21.8, 23.4 21.8, 21.8 18"
          stroke={secondaryStroke}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M18 31.8 C14.2 27.6, 14.2 23.4, 18 21.8"
          stroke={primaryStroke}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        <path
          d="M4.2 18 C8.4 14.2, 12.6 14.2, 14.2 18"
          stroke={secondaryStroke}
          strokeWidth="1.05"
          strokeLinecap="round"
        />
        {/* Cardinal Warli diamond ticks */}
        <circle cx="18" cy="8.2" r="0.9" fill={secondaryStroke} fillOpacity="0.7" />
        <circle cx="27.8" cy="18" r="0.9" fill={primaryStroke} fillOpacity="0.7" />
        <circle cx="18" cy="27.8" r="0.9" fill={secondaryStroke} fillOpacity="0.7" />
        <circle cx="8.2" cy="18" r="0.9" fill={primaryStroke} fillOpacity="0.7" />
      </svg>
      <span className={`h-[1px] flex-1 ${lineColor}`} />
    </div>
  );
}

/**
 * Architectural frieze pattern fusing the Warli triangle chevron and botanical
 * floral rosette lattice found inside the bottom-right and top-right quadrants
 * of the official 3VENI SPHERE logo.
 */
export function FolkBandPattern({
  color = '#C49A50',
  opacity = 0.26,
}: {
  color?: string;
  opacity?: number;
}) {
  const patternId = useId();
  return (
    <div
      aria-hidden="true"
      className="w-full h-5 overflow-hidden select-none pointer-events-none"
      style={{ opacity }}
    >
      <svg width="100%" height="20" preserveAspectRatio="none">
        <defs>
          <pattern id={patternId} width="48" height="20" patternUnits="userSpaceOnUse">
            {/* Upper & lower framing lines */}
            <line x1="0" y1="1.5" x2="48" y2="1.5" stroke={color} strokeWidth="0.7" strokeOpacity="0.6" />
            <line x1="0" y1="18.5" x2="48" y2="18.5" stroke={color} strokeWidth="0.7" strokeOpacity="0.6" />
            {/* Alternating Warli triangle geometry + rosette diamond */}
            <path
              d="M0 17 L8 3 L16 17 M24 10 L29 4 L34 10 L29 16 Z M40 17 L44 10 L48 17"
              fill="none"
              stroke={color}
              strokeWidth="0.95"
            />
            <circle cx="8" cy="12" r="1.2" fill={color} />
            <circle cx="29" cy="10" r="1.2" fill={color} />
            <circle cx="20" cy="10" r="0.8" fill={color} fillOpacity="0.65" />
            <circle cx="38" cy="10" r="0.8" fill={color} fillOpacity="0.65" />
          </pattern>
        </defs>
        <rect width="100%" height="20" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}

export function CompassOrientationGlyph({ facing }: { facing: string }) {
  const lower = facing.toLowerCase();
  const angle = lower.includes('north-east')
    ? 45
    : lower.includes('south-east')
      ? 135
      : lower.includes('east')
        ? 90
        : lower.includes('west')
          ? 270
          : 0;

  return (
    <div className="inline-flex items-center gap-3">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="18" cy="18" r="16" stroke="#C49A50" strokeWidth="1" />
        <text x="18" y="8" textAnchor="middle" fill="#5E554B" fontSize="5" fontFamily="monospace">
          N
        </text>
        <g transform={`rotate(${angle} 18 18)`}>
          <path d="M18 9 L21 18 L18 16 L15 18 Z" fill="#98400F" />
          <path d="M18 27 L20.5 18 L18 19.5 L15.5 18 Z" fill="#BFAE96" />
        </g>
      </svg>
      <span className="text-sm font-medium text-[#24221E]">{facing}</span>
    </div>
  );
}

/**
 * Corner watermark inspired by one teardrop quadrant curve and botanical dot
 * from the 3VENI SPHERE circular emblem. Used subtly on dossier & card frames.
 */
export function QuadrantWatermarkCorner({
  tone = 'terracotta',
  className = '',
}: {
  tone?: 'terracotta' | 'olive' | 'gold';
  className?: string;
}) {
  const stroke = tone === 'olive' ? '#41490D' : tone === 'gold' ? '#C49A50' : '#98400F';
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <path
        d="M42 2 A 40 40 0 0 0 2 42"
        stroke={stroke}
        strokeWidth="1"
        strokeOpacity="0.32"
      />
      <path
        d="M42 12 C28 12, 20 20, 12 42"
        stroke={stroke}
        strokeWidth="0.9"
        strokeDasharray="2 3"
        strokeOpacity="0.4"
      />
      <circle cx="34" cy="34" r="2.2" fill={stroke} fillOpacity="0.45" />
    </svg>
  );
}

/**
 * Hero geometric backdrop translating the official 3VENI SPHERE 4-quadrant
 * swirling Triveni curves and concentric outer containment into atmospheric survey lines.
 */
export function HeroArchitecturalRings() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden opacity-55"
    >
      <svg
        viewBox="0 0 1200 720"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <g transform="translate(885, 345)">
          {/* Outer containment rings inspired by the logo's bold circular rim */}
          <circle
            cx="0"
            cy="0"
            r="175"
            stroke="#C49A50"
            strokeOpacity="0.24"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
          <circle cx="0" cy="0" r="285" stroke="#C49A50" strokeOpacity="0.18" strokeWidth="1" />
          <circle
            cx="0"
            cy="0"
            r="405"
            stroke="#E5C185"
            strokeOpacity="0.12"
            strokeWidth="0.9"
            strokeDasharray="2 10"
          />

          {/* Four swirling S-curves directly echoing the 3VENI SPHERE 4-quadrant emblem */}
          <path
            d="M 0 -280 C 82 -200, 82 -105, 0 -42"
            stroke="#C49A50"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <path
            d="M 280 0 C 200 82, 105 82, 42 0"
            stroke="#E5C185"
            strokeOpacity="0.18"
            strokeWidth="1.2"
          />
          <path
            d="M 0 280 C -82 200, -82 105, 0 42"
            stroke="#C49A50"
            strokeOpacity="0.22"
            strokeWidth="1.2"
          />
          <path
            d="M -280 0 C -200 -82, -105 -82, -42 0"
            stroke="#E5C185"
            strokeOpacity="0.18"
            strokeWidth="1.2"
          />

          {/* Central bindu sphere */}
          <circle cx="0" cy="0" r="8" stroke="#C49A50" strokeOpacity="0.35" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#C49A50" fillOpacity="0.35" />

          {/* Fine survey crosshairs */}
          <line
            x1="-430"
            y1="0"
            x2="430"
            y2="0"
            stroke="#C49A50"
            strokeOpacity="0.1"
            strokeWidth="0.7"
          />
          <line
            x1="0"
            y1="-430"
            x2="0"
            y2="430"
            stroke="#C49A50"
            strokeOpacity="0.1"
            strokeWidth="0.7"
          />
        </g>
      </svg>
    </div>
  );
}
