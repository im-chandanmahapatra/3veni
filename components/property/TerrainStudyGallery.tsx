'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeSlideIndex, resolveSwipeAction } from '@/lib/introSession';

interface TerrainPlate {
  id: string;
  index: string;
  label: string;
  plateTitle: string;
  caption: string;
  src: string;
  alt: string;
}

const TERRAIN_PLATES: TerrainPlate[] = [
  {
    id: 'twilight-pavilion',
    index: '01',
    label: 'Twilight Pavilion',
    plateTitle: 'PLATE 01 · TWILIGHT HORIZON STUDY',
    caption: 'Open-air stone and timber terrace sited for uninterrupted sunset breezes.',
    src: '/images/homes/shila-pavilion.webp',
    alt: 'Stone and timber open-air pavilion overlooking twilight hills',
  },
  {
    id: 'laterite-plateau',
    index: '02',
    label: 'Laterite Plateau',
    plateTitle: 'PLATE 02 · HIGHLAND RIDGE TOPOGRAPHY',
    caption: 'Natural firm laterite ground holding panoramic morning valley mist.',
    src: '/images/plots/shila-crest.webp',
    alt: 'Elevated laterite stone plateau overlooking misty valley ridges',
  },
  {
    id: 'terraced-avenues',
    index: '03',
    label: 'Terraced Avenues',
    plateTitle: 'PLATE 03 · CONTOURED ROAD ACCESS',
    caption: 'Tree-lined avenues proportioned for gentle grade transitions and natural shade.',
    src: '/images/plots/aranya-ridge.webp',
    alt: 'Sunlit terraced residential land plots framed by dry-stone walls and avenues',
  },
  {
    id: 'valley-enclosure',
    index: '04',
    label: 'Valley Enclosure',
    plateTitle: 'PLATE 04 · HAND-LAID DRY-STONE BOUNDARY',
    caption: 'Permeable basalt and dry-stone boundaries preserving native meadow contours.',
    src: '/images/plots/prana-valley.webp',
    alt: 'Contoured valley land bordered by dry-stone walls and wildflowers',
  },
];

export default function TerrainStudyGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const pointerStartX = useRef<number | null>(null);

  const count = TERRAIN_PLATES.length;
  const activePlate = TERRAIN_PLATES[activeIndex] ?? TERRAIN_PLATES[0]!;

  const goTo = (nextIndex: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex(normalizeSlideIndex(nextIndex, 0, count));
  };

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => normalizeSlideIndex(prev, -1, count));
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((prev) => normalizeSlideIndex(prev, 1, count));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const action = resolveSwipeAction(e.clientX - pointerStartX.current);
    pointerStartX.current = null;
    if (action === 'next') goNext();
    else if (action === 'prev') goPrev();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Terrain and landscape studies gallery"
      data-testid="terrain-study-gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F]"
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative aspect-[16/10] w-full overflow-hidden border border-[#D8CEBC] bg-[#24221E] group select-none touch-pan-y"
      >
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activePlate.id}
            custom={direction}
            initial={{ opacity: 0.45, x: direction > 0 ? 20 : -20, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0.45, x: direction > 0 ? -20 : 20, scale: 0.99 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activePlate.src}
              alt={activePlate.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 56vw"
              className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.035]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle gradient scrim + contextual caption reveal */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#171512]/88 via-[#171512]/40 to-transparent"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t border-l border-[#C49A50]/70 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5 z-10"
        />

        <div className="relative z-10 flex items-center justify-between p-4">
          <span className="px-3 py-1 bg-[#24221E]/85 text-[#F6F1E7] border border-[#C49A50]/40 font-mono text-[11px] tabular-nums">
            {activePlate.index} / 0{count}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous terrain study plate"
              className="w-11 h-11 inline-flex items-center justify-center bg-[#F6F1E7]/92 border border-[#D8CEBC] text-[#24221E] hover:bg-[#98400F] hover:text-[#F6F1E7] hover:border-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next terrain study plate"
              className="w-11 h-11 inline-flex items-center justify-center bg-[#F6F1E7]/92 border border-[#D8CEBC] text-[#24221E] hover:bg-[#98400F] hover:text-[#F6F1E7] hover:border-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-4 bottom-4 z-10 pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#C49A50]">
            {activePlate.plateTitle}
          </p>
          <p className="mt-1 text-xs sm:text-sm text-[#F6F1E7] leading-relaxed max-w-lg transition-transform duration-300 [@media(hover:hover)]:group-hover:-translate-y-0.5">
            {activePlate.caption}
          </p>
        </div>
      </div>

      {/* Plate Thumbnails & Direct Selector */}
      <div
        role="tablist"
        aria-label="Terrain photography plates"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      >
        {TERRAIN_PLATES.map((plate, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={plate.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
              className={`group text-left p-2.5 border transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F] ${
                isSelected
                  ? 'bg-[#F6F1E7] border-[#98400F]'
                  : 'bg-[#F6F1E7]/70 border-[#D8CEBC] hover:border-[#C49A50]'
              }`}
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#24221E] mb-2">
                <Image
                  src={plate.src}
                  alt=""
                  fill
                  sizes="160px"
                  className={`object-cover transition-transform duration-500 ${
                    isSelected
                      ? 'scale-[1.03]'
                      : 'opacity-80 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.04]'
                  }`}
                />
              </div>
              <p className="font-mono text-[10px] text-[#98400F] tabular-nums">{plate.index}.</p>
              <p className="text-xs font-medium text-[#24221E] truncate">{plate.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
