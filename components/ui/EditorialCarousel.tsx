'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { normalizeSlideIndex, resolveSwipeAction } from '@/lib/introSession';

export interface EditorialSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  metaLeftLabel: string;
  metaLeftValue: string;
  metaRightLabel: string;
  metaRightValue: string;
  image: string;
  imageAlt: string;
  actionLabel?: string;
  actionHref?: string;
}

interface EditorialCarouselProps {
  slides: EditorialSlide[];
  ariaLabel: string;
  autoAdvanceMs?: number;
  tone?: 'light' | 'sand';
  onActionSlide?: (slide: EditorialSlide) => void;
}

export default function EditorialCarousel({
  slides,
  ariaLabel,
  autoAdvanceMs = 0,
  tone = 'light',
  onActionSlide,
}: EditorialCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(true);
  const pointerStartX = useRef<number | null>(null);

  const count = slides.length;
  const activeSlide = slides[activeIndex] ?? slides[0]!;

  const goTo = useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (count <= 1) return;
      setDirection(dir);
      setActiveIndex(normalizeSlideIndex(nextIdx, 0, count));
    },
    [count]
  );

  const goPrev = useCallback(() => goTo(activeIndex - 1, -1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1, 1), [activeIndex, goTo]);

  useEffect(() => {
    if (!autoAdvanceMs || isPaused || prefersReducedMotion || count <= 1) return;
    const id = window.setInterval(() => {
      goTo(activeIndex + 1, 1);
    }, autoAdvanceMs);
    return () => window.clearInterval(id);
  }, [autoAdvanceMs, isPaused, prefersReducedMotion, count, activeIndex, goTo]);

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

  const cardBg = tone === 'light' ? 'bg-[#EDE5D6]' : 'bg-[#F6F1E7]';

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => autoAdvanceMs && setIsPaused(true)}
      className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F]"
    >
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={`grid grid-cols-1 lg:grid-cols-12 border border-[#D8CEBC] ${cardBg} overflow-hidden select-none touch-pan-y`}
      >
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-[#24221E] group">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={activeSlide.id}
              custom={direction}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0.4, x: direction > 0 ? 24 : -24, scale: 1.03 }
              }
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0.4, x: direction > 0 ? -24 : 24, scale: 0.99 }
              }
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={activeSlide.image}
                alt={activeSlide.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03]"
              />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 inline-block m-4 px-3 py-1.5 bg-[#24221E]/85 text-[#F6F1E7] border border-[#C49A50]/40 font-mono text-xs tabular-nums">
            0{activeIndex + 1} / 0{count}
          </div>

          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-3.5 right-3.5 w-3.5 h-3.5 border-t border-r border-[#C49A50]/65 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5 z-10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171512]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          <p className="pointer-events-none hidden md:block absolute left-4 bottom-4 text-xs tracking-wide text-[#F6F1E7] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
            {activeSlide.subtitle}
          </p>
        </div>

        <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#D8CEBC]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#98400F]">
              {activeSlide.eyebrow}
            </p>
            <h3 className="mt-3 font-editorial text-3xl sm:text-4xl font-normal text-[#24221E] leading-[1.06]">
              {activeSlide.title}
            </h3>
            <p className="mt-1.5 text-xs tracking-wide text-[#5E554B]">{activeSlide.subtitle}</p>
            <p className="mt-5 text-sm leading-[1.74] text-[#493023]">
              {activeSlide.description}
            </p>

            <dl className="mt-7 pt-6 border-t border-[#D8CEBC] grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-[#5E554B]">
                  {activeSlide.metaLeftLabel}
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                  {activeSlide.metaLeftValue}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.12em] text-[#5E554B]">
                  {activeSlide.metaRightLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[#24221E]">
                  {activeSlide.metaRightValue}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 pt-6 border-t border-[#D8CEBC] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous showcase slide"
                className="w-11 h-11 inline-flex items-center justify-center border border-[#C49A50]/65 bg-white text-[#24221E] hover:bg-[#98400F] hover:text-[#F6F1E7] hover:border-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next showcase slide"
                className="w-11 h-11 inline-flex items-center justify-center border border-[#C49A50]/65 bg-white text-[#24221E] hover:bg-[#98400F] hover:text-[#F6F1E7] hover:border-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              {autoAdvanceMs > 0 && (
                <button
                  type="button"
                  onClick={() => setIsPaused((prev) => !prev)}
                  aria-pressed={!isPaused}
                  aria-label={isPaused ? 'Play automatic showcase' : 'Pause automatic showcase'}
                  className="w-11 h-11 inline-flex items-center justify-center border border-[#D8CEBC] bg-white text-[#5E554B] hover:text-[#24221E] hover:border-[#24221E] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>

            {activeSlide.actionHref ? (
              <Link
                href={activeSlide.actionHref}
                className="group inline-flex items-center gap-2 px-5 py-3 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F]"
              >
                <span>{activeSlide.actionLabel ?? 'View Details'}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : onActionSlide ? (
              <button
                type="button"
                onClick={() => onActionSlide(activeSlide)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#24221E] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#98400F] transition-colors whitespace-nowrap"
              >
                <span>{activeSlide.actionLabel ?? 'Request Future Updates'}</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 flex-1 max-w-md"
          role="tablist"
          aria-label="Slide pagination"
        >
          {slides.map((slide, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show slide ${idx + 1}: ${slide.title}`}
                onClick={() => goTo(idx, idx > activeIndex ? 1 : -1)}
                className="group py-2 flex-1 focus-visible:outline-2 focus-visible:outline-[#98400F]"
              >
                <span
                  className={`block h-[2px] w-full transition-colors duration-300 ${
                    isSelected
                      ? 'bg-[#98400F]'
                      : 'bg-[#D8CEBC] group-hover:bg-[#C49A50]'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <p className="text-xs font-mono text-[#5E554B] hidden sm:block">
          Swipe or use arrow keys to browse
        </p>
      </div>
    </div>
  );
}
