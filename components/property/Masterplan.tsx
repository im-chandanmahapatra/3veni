'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import Media from '@/components/ui/Media';
import { SpecList } from '@/components/ui/SpecList';

export interface PlanParcel {
  slug: string;
  code: string;
  name: string;
  areaDisplay: string;
  dimensions: string;
  facing: string;
  formatLabel: string;
  terrain: string;
  statusLabel: string;
  elevationNote: string;
  points: string;
  labelX: number;
  labelY: number;
  /** false when the current filters exclude this parcel (dimmed, still reachable) */
  matches: boolean;
  image: { src: StaticImageData; alt: string };
}

/**
 * Schematic masterplan (DESIGN §8, audit H4/M2/M3): honest label "Schematic — not to scale". Each parcel is a real
 * link to its dossier — there is no modal. The SVG is a role="group" (V1 nested buttons inside role="img": axe
 * nested-interactive) and every parcel's accessible name is its visible text, so voice control can say "P-01".
 * Labels are ≥ 15 SVG units so they render ≥ 12 px at the smallest plan width (≥ 768 px viewports only).
 */
export default function Masterplan({
  parcels,
  currentSlug,
  mini = false,
}: {
  parcels: readonly PlanParcel[];
  /** highlights one parcel (dossier mini-plan) */
  currentSlug?: string;
  /** mini = no info panel (dossier page) */
  mini?: boolean;
}) {
  const initial = (currentSlug && parcels.find((p) => p.slug === currentSlug)) || parcels.find((p) => p.matches) || parcels[0];
  const [activeSlug, setActiveSlug] = useState<string | undefined>(initial?.slug);
  const active = parcels.find((p) => p.slug === activeSlug) ?? initial;

  return (
    <div className={['plan', mini ? 'plan--mini' : ''].filter(Boolean).join(' ')} data-testid="interactive-plot-map">
      <figure className="plan__figure">
        <svg viewBox="0 0 800 460" role="group" aria-label="Schematic masterplan of the sample parcels, not to scale" className="plan__svg">
          <defs>
            <pattern id={`plan-grid-${mini ? 'm' : 'l'}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" className="plan__gridline" fill="none" />
            </pattern>
          </defs>
          <g aria-hidden="true">
            <rect width="800" height="460" fill={`url(#plan-grid-${mini ? 'm' : 'l'})`} />
            <g className="plan__rings" fill="none">
              <circle cx="380" cy="230" r="145" />
              <circle cx="380" cy="230" r="245" />
              <circle cx="380" cy="230" r="340" />
            </g>
            <g className="plan__contours" fill="none">
              <path d="M 16 140 Q 210 42, 420 118 T 784 96" />
              <path d="M 18 238 Q 225 182, 445 232 T 786 218" />
              <path d="M 16 346 Q 250 288, 495 344 T 784 328" />
              <path d="M 24 428 Q 310 388, 560 416 T 784 404" />
            </g>
            <path d="M 318 18 C 314 145, 326 210, 358 260 C 386 304, 378 378, 368 446" className="plan__road-edge" fill="none" strokeWidth="30" strokeLinecap="round" />
            <path d="M 318 18 C 314 145, 326 210, 358 260 C 386 304, 378 378, 368 446" className="plan__road" fill="none" strokeWidth="22" strokeLinecap="round" />
            <path d="M 332 224 C 430 228, 520 242, 680 284" className="plan__road" fill="none" strokeWidth="14" strokeLinecap="round" />
            <g className="plan__trees">
              <circle cx="62" cy="72" r="14" />
              <circle cx="72" cy="222" r="11" />
              <circle cx="304" cy="112" r="10" />
              <circle cx="516" cy="58" r="13" />
              <circle cx="742" cy="74" r="16" />
              <circle cx="732" cy="346" r="15" />
              <circle cx="624" cy="398" r="12" />
              <circle cx="294" cy="422" r="11" />
            </g>
          </g>

          {parcels.map((p) => {
            const isActive = active?.slug === p.slug;
            const isCurrent = currentSlug === p.slug;
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={['plan__parcel', isActive ? 'is-active' : '', isCurrent ? 'is-current' : '', p.matches ? '' : 'is-dim'].filter(Boolean).join(' ')}
                onMouseEnter={() => setActiveSlug(p.slug)}
                onFocus={() => setActiveSlug(p.slug)}
                {...(isCurrent ? { 'aria-current': 'page' as const } : {})}
              >
                <polygon points={p.points} />
                <text x={p.labelX} y={p.labelY - 16} textAnchor="middle" className="plan__code">
                  {p.code}
                </text>
                <text x={p.labelX} y={p.labelY + 4} textAnchor="middle" className="plan__name">
                  {p.name.split(' ').slice(0, 2).join(' ')}
                </text>
                <text x={p.labelX} y={p.labelY + 24} textAnchor="middle" className="plan__dims">
                  {p.dimensions}
                </text>
              </Link>
            );
          })}
        </svg>
        <figcaption className="t-caption plan__caption">
          Schematic — not to scale. {active ? active.elevationNote : ''}
        </figcaption>
      </figure>

      {mini || !active ? null : (
        <aside className="plan__panel" aria-live="polite" aria-label="Selected parcel">
          <Media src={active.image.src} alt={active.image.alt} ratio="3/2" sizes="(min-width: 1024px) 24vw, 45vw" />
          <div className="plan__panel-body">
            <Badge>{active.statusLabel}</Badge>
            <p className="t-overline">
              {active.code} · {active.formatLabel}
            </p>
            <p className="t-title">{active.name}</p>
            <p className="t-caption">{active.terrain}</p>
            <SpecList
              items={[
                { label: 'Plot size', value: active.areaDisplay },
                { label: 'Facing', value: active.facing },
              ]}
            />
            <Link href={`/projects/${active.slug}`} className="link-action">
              <span>Open dossier</span>
              <Icon name="arrow-right" nudge />
            </Link>
          </div>
        </aside>
      )}
    </div>
  );
}
