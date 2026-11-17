'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Compass, MapPin } from 'lucide-react';
import { PLOT_MAP_GEOMETRIES } from '@/data/plotMapLayout';
import { QuadrantWatermarkCorner } from '@/components/ui/BrandMotifs';
import type { LandPlot } from '@/types/property';

interface InteractivePlotMapProps {
  plots: LandPlot[];
  matchingPlotIds: Set<string>;
  onSelectPlot: (plot: LandPlot) => void;
}

export default function InteractivePlotMap({
  plots,
  matchingPlotIds,
  onSelectPlot,
}: InteractivePlotMapProps) {
  const [activePlotId, setActivePlotId] = useState<string>(plots[0]?.id ?? 'plot-aranya-ridge');

  const activePlot = plots.find((p) => p.id === activePlotId) ?? plots[0]!;
  const activeGeometry =
    PLOT_MAP_GEOMETRIES.find((g) => g.plotId === activePlot.id) ?? PLOT_MAP_GEOMETRIES[0]!;

  return (
    <div
      data-testid="interactive-plot-map"
      className="mb-12 bg-[#F6F1E7] border border-[#D8CEBC] grid grid-cols-1 lg:grid-cols-12"
    >
      <div className="lg:col-span-8 p-5 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#D8CEBC] flex flex-col justify-between">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#EDE5D6]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#98400F]">
              Sample Masterplan Diagram
            </p>
            <h3 className="font-editorial text-2xl font-medium text-[#24221E] mt-0.5">
              Interactive Plot Map
            </h3>
          </div>
          <p className="text-xs text-[#5E554B]">
            Hover, tap, or tab across parcels to inspect · Select to open parcel dossier
          </p>
        </div>

        <div className="relative my-5 bg-[#EDE5D6]/55 border border-[#D8CEBC]">
          <svg
            viewBox="0 0 800 460"
            className="w-full h-auto block select-none"
            role="img"
            aria-label="3VENI SPHERE sample contoured land masterplan with 5 interactive plot parcels"
          >
            <defs>
              <pattern
                id="veni-survey-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="#C8BCA9"
                  strokeWidth="0.6"
                  strokeOpacity="0.45"
                />
              </pattern>
            </defs>

            <rect width="800" height="460" fill="url(#veni-survey-grid)" />

            <g
              fill="none"
              stroke="#C49A50"
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="4 6"
            >
              <circle cx="380" cy="230" r="145" />
              <circle cx="380" cy="230" r="245" />
              <circle cx="380" cy="230" r="340" />
            </g>

            <g fill="none" stroke="#A69984" strokeWidth="1" strokeOpacity="0.45">
              <path d="M 16 140 Q 210 42, 420 118 T 784 96" />
              <path d="M 18 238 Q 225 182, 445 232 T 786 218" />
              <path d="M 16 346 Q 250 288, 495 344 T 784 328" />
              <path d="M 24 428 Q 310 388, 560 416 T 784 404" />
            </g>

            <path
              d="M 318 18 C 314 145, 326 210, 358 260 C 386 304, 378 378, 368 446"
              fill="none"
              stroke="#C9BCA6"
              strokeWidth="30"
              strokeLinecap="round"
            />
            <path
              d="M 318 18 C 314 145, 326 210, 358 260 C 386 304, 378 378, 368 446"
              fill="none"
              stroke="#F6F1E7"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <path
              d="M 318 18 C 314 145, 326 210, 358 260 C 386 304, 378 378, 368 446"
              fill="none"
              stroke="#C49A50"
              strokeWidth="1"
              strokeDasharray="6 6"
              strokeOpacity="0.6"
            />

            <path
              d="M 332 224 C 430 228, 520 242, 680 284"
              fill="none"
              stroke="#F6F1E7"
              strokeWidth="14"
              strokeLinecap="round"
            />

            <g
              fill="#41490D"
              fillOpacity="0.22"
              stroke="#41490D"
              strokeOpacity="0.4"
              strokeWidth="1"
            >
              <circle cx="62" cy="72" r="14" />
              <circle cx="72" cy="222" r="11" />
              <circle cx="304" cy="112" r="10" />
              <circle cx="516" cy="58" r="13" />
              <circle cx="742" cy="74" r="16" />
              <circle cx="732" cy="346" r="15" />
              <circle cx="624" cy="398" r="12" />
              <circle cx="294" cy="422" r="11" />
            </g>

            {PLOT_MAP_GEOMETRIES.map((geom) => {
              const plot = plots.find((p) => p.id === geom.plotId);
              if (!plot) return null;

              const isSelected = activePlot.id === plot.id;
              const isMatched = matchingPlotIds.has(plot.id);

              return (
                <g
                  key={geom.plotId}
                  role="button"
                  tabIndex={0}
                  aria-label={`${geom.code}: ${plot.name} (${plot.areaDisplay}) — open parcel details`}
                  onMouseEnter={() => setActivePlotId(plot.id)}
                  onFocus={() => setActivePlotId(plot.id)}
                  onClick={() => {
                    setActivePlotId(plot.id);
                    onSelectPlot(plot);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActivePlotId(plot.id);
                      onSelectPlot(plot);
                    }
                  }}
                  className="cursor-pointer focus:outline-none"
                  style={{
                    opacity: isMatched ? 1 : 0.42,
                    transition: 'opacity 220ms ease',
                  }}
                >
                  <polygon
                    points={geom.points}
                    fill={isSelected ? '#98400F' : '#F6F1E7'}
                    fillOpacity={isSelected ? 0.22 : 0.88}
                    stroke={isSelected ? '#98400F' : '#493023'}
                    strokeWidth={isSelected ? 2.5 : 1.25}
                    className="transition-colors duration-200"
                  />

                  {geom.points.split(' ').map((pair, idx) => {
                    const [cx, cy] = pair.split(',');
                    return (
                      <circle
                        key={idx}
                        cx={cx}
                        cy={cy}
                        r={isSelected ? 3.5 : 2.2}
                        fill={isSelected ? '#98400F' : '#C49A50'}
                      />
                    );
                  })}

                  <text
                    x={geom.labelX}
                    y={geom.labelY - 12}
                    textAnchor="middle"
                    fill={isSelected ? '#98400F' : '#41490D'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                    letterSpacing="0.08em"
                  >
                    {geom.code}
                  </text>
                  <text
                    x={geom.labelX}
                    y={geom.labelY + 8}
                    textAnchor="middle"
                    fill="#24221E"
                    fontSize="14"
                    fontFamily="Georgia, serif"
                    fontWeight="500"
                  >
                    {plot.name.split(' ').slice(0, 2).join(' ')}
                  </text>
                  <text
                    x={geom.labelX}
                    y={geom.labelY + 26}
                    textAnchor="middle"
                    fill="#5E554B"
                    fontSize="10.5"
                    fontFamily="monospace"
                  >
                    {plot.dimensions}
                  </text>
                </g>
              );
            })}

            <g transform="translate(744, 412)">
              <circle
                cx="0"
                cy="0"
                r="24"
                fill="none"
                stroke="#98400F"
                strokeOpacity="0.32"
                strokeWidth="0.9"
                strokeDasharray="3 4"
              />
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="#F6F1E7"
                fillOpacity="0.94"
                stroke="#C49A50"
                strokeWidth="1"
              />
              <path d="M 0 -13 L 4.5 2 L 0 -1 L -4.5 2 Z" fill="#98400F" />
              <path d="M 0 13 L 3.5 2 L 0 4.5 L -3.5 2 Z" fill="#41490D" fillOpacity="0.55" />
              <circle cx="0" cy="0" r="1.8" fill="#C49A50" />
              <text
                x="0"
                y="-16"
                textAnchor="middle"
                fill="#24221E"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="700"
              >
                N
              </text>
            </g>
          </svg>
        </div>

        {/* Mobile/Touch Quick Parcel Selector Strip */}
        <div className="mb-4 flex flex-wrap gap-1.5 lg:hidden">
          {PLOT_MAP_GEOMETRIES.map((geom) => {
            const plot = plots.find((p) => p.id === geom.plotId);
            if (!plot) return null;
            const isSelected = activePlot.id === plot.id;
            return (
              <button
                key={geom.plotId}
                type="button"
                onClick={() => setActivePlotId(plot.id)}
                className={`px-2.5 py-1.5 text-[11px] font-mono border transition-colors ${
                  isSelected
                    ? 'bg-[#98400F] text-[#F6F1E7] border-[#98400F]'
                    : 'bg-[#EDE5D6] text-[#24221E] border-[#D8CEBC]'
                }`}
              >
                {geom.code} · {plot.name.split(' ')[0]}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#5E554B]">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <span className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 border border-[#98400F] bg-[#98400F]/20 inline-block"
                aria-hidden="true"
              />
              <span>Selected Parcel</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 border border-[#493023] bg-[#F6F1E7] inline-block"
                aria-hidden="true"
              />
              <span>Sample Parcel Boundary</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-[1px] bg-[#A69984] inline-block" aria-hidden="true" />
              <span>Natural Contour Line</span>
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#5E554B]">{activeGeometry.elevationNote}</span>
        </div>
      </div>

      <div className="relative lg:col-span-4 bg-[#EDE5D6]/55 travertine-grid-surface p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
        <QuadrantWatermarkCorner
          tone="olive"
          className="absolute top-2 right-2"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#98400F]">
            <span>{activePlot.category}</span>
            <span className="font-mono text-[#41490D] tabular-nums pr-5">{activeGeometry.code}</span>
          </div>

          <div className="relative mt-4 aspect-[16/10] overflow-hidden bg-[#24221E] border border-[#D8CEBC]">
            <Image
              src={activePlot.image}
              alt={activePlot.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          <h4 className="mt-5 font-editorial text-2xl sm:text-3xl font-medium text-[#24221E] leading-tight">
            {activePlot.name}
          </h4>

          <p className="mt-1.5 text-xs text-[#5E554B] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#98400F] shrink-0" aria-hidden="true" />
            <span>{activePlot.location}</span>
          </p>

          <p className="mt-4 text-sm leading-[1.68] text-[#493023]">
            {activePlot.shortDescription}
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-[#D8CEBC]">
          <dl className="grid grid-cols-2 gap-4 text-xs mb-6">
            <div>
              <dt className="uppercase tracking-[0.12em] text-[#5E554B]">Area</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                {activePlot.areaDisplay}
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.12em] text-[#5E554B]">Orientation</dt>
              <dd className="mt-1 text-sm font-medium text-[#24221E] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#98400F] shrink-0" aria-hidden="true" />
                <span className="truncate">{activePlot.facing}</span>
              </dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => onSelectPlot(activePlot)}
            aria-label={`Open parcel dossier for ${activePlot.name}`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F]"
          >
            <span>Open Plot Dossier</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
