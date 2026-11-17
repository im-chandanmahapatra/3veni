'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeSlideIndex, resolveSwipeAction } from '@/lib/introSession';

interface GalleryImageItem {
  src: string;
  alt: string;
  caption: string;
}

interface PlotDossierGalleryProps {
  plotName: string;
  images: GalleryImageItem[];
}

export default function PlotDossierGallery({ plotName, images }: PlotDossierGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const pointerStartX = useRef<number | null>(null);

  const count = images.length;
  const activePhoto = images[activeIndex] ?? images[0]!;

  const goTo = (nextIdx: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex(normalizeSlideIndex(nextIdx, 0, count));
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
    if (count <= 1) return;
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
    if (pointerStartX.current === null || count <= 1) return;
    const action = resolveSwipeAction(e.clientX - pointerStartX.current);
    pointerStartX.current = null;
    if (action === 'next') goNext();
    else if (action === 'prev') goPrev();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${plotName} photo dossier gallery`}
      data-testid="plot-dossier-gallery"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="space-y-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F]"
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative aspect-[16/10] bg-[#24221E] border border-[#D8CEBC] overflow-hidden group select-none touch-pan-y"
      >
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activePhoto.src}
            custom={direction}
            initial={{ opacity: 0.45, x: direction > 0 ? 22 : -22, scale: 1.03 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0.45, x: direction > 0 ? -22 : 22, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={activePhoto.src}
              alt={activePhoto.alt}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
            />
          </motion.div>
        </AnimatePresence>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3.5 left-3.5 w-3.5 h-3.5 border-t border-l border-[#C49A50]/65 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5 z-10"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3.5 right-3.5 w-3.5 h-3.5 border-b border-r border-[#C49A50]/65 z-10"
        />

        {count > 1 && (
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 z-10">
            <span className="px-3 py-1.5 bg-[#24221E]/88 text-[#F6F1E7] text-xs border border-[#C49A50]/35">
              {activePhoto.caption}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous parcel photo"
                className="w-11 h-11 inline-flex items-center justify-center bg-[#24221E]/90 border border-[#C49A50]/45 text-[#F6F1E7] hover:bg-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next parcel photo"
                className="w-11 h-11 inline-flex items-center justify-center bg-[#24221E]/90 border border-[#C49A50]/45 text-[#F6F1E7] hover:bg-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {count <= 1 && (
          <p className="absolute left-4 bottom-4 px-3 py-1.5 bg-[#24221E]/88 text-[#F6F1E7] text-xs border border-[#C49A50]/35 z-10">
            {activePhoto.caption}
          </p>
        )}
      </div>

      {count > 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {images.map((photo, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={`${photo.src}-${idx}`}
                type="button"
                onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                aria-pressed={isActive}
                aria-label={`Inspect parcel study ${idx + 1}: ${photo.caption}`}
                className={`group text-left bg-[#F6F1E7] border transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F] ${
                  isActive ? 'border-[#98400F]' : 'border-[#D8CEBC] hover:border-[#C49A50]'
                }`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#24221E]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 20vw"
                    className={`object-cover transition-transform duration-500 ${
                      isActive
                        ? 'scale-[1.03]'
                        : 'opacity-80 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-[1.04]'
                    }`}
                  />
                </div>
                <p className="px-3 py-2 text-xs text-[#493023] truncate">{photo.caption}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
