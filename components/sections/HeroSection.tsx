'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowDown, ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroArchitecturalRings } from '@/components/ui/BrandMotifs';
import { normalizeSlideIndex, resolveSwipeAction } from '@/lib/introSession';

interface HeroVista {
  id: string;
  indexLabel: string;
  label: string;
  elevationTag: string;
  image: string;
  imageAlt: string;
  linkedPlotSlug: string;
  linkedPlotTitle: string;
}

const HERO_VISTAS: HeroVista[] = [
  {
    id: 'ridge',
    indexLabel: '01',
    label: 'Ridge Terraces',
    elevationTag: 'TERRAIN · GENTLE EAST-FACING RIDGE',
    image: '/images/plots/aranya-ridge.webp',
    imageAlt:
      'Sunlit terraced residential land plots framed by dry-stone walls and tree-lined avenues at golden hour',
    linkedPlotSlug: 'aranya-ridge-terraces',
    linkedPlotTitle: 'Aranya Ridge Terraces',
  },
  {
    id: 'valley',
    indexLabel: '02',
    label: 'Valley Sanctuary',
    elevationTag: 'TERRAIN · ROLLING MEADOW BASIN',
    image: '/images/plots/prana-valley.webp',
    imageAlt:
      'Rolling green valley land parcel bordered by traditional dry-stone walls and wildflowers',
    linkedPlotSlug: 'prana-valley-sanctuary',
    linkedPlotTitle: 'Prana Valley Sanctuary',
  },
  {
    id: 'pavilion',
    indexLabel: '03',
    label: 'Evening Pavilion',
    elevationTag: 'CRAFT · STONE & TIMBER HORIZON',
    image: '/images/homes/shila-pavilion.webp',
    imageAlt:
      'Architectural stone and timber pavilion opening onto rolling hillside vistas at twilight',
    linkedPlotSlug: 'shila-laterite-crest',
    linkedPlotTitle: 'Shila Laterite Crest',
  },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const backdropParallaxRef = useRef<HTMLDivElement>(null);
  const ringsLayerRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [mountAllVistas, setMountAllVistas] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const activeVista = HERO_VISTAS[activeIndex] ?? HERO_VISTAS[0]!;

  useEffect(() => {
    if (isPaused) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const interval = window.setInterval(() => {
      setMountAllVistas(true);
      setActiveIndex((prev) => (prev + 1) % HERO_VISTAS.length);
    }, 7500);
    return () => window.clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const section = sectionRef.current;
    const backdrop = backdropParallaxRef.current;
    const rings = ringsLayerRef.current;
    if (!section || !backdrop || !rings) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.to(backdrop, {
        yPercent: 9,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      });

      gsap.to(rings, {
        yPercent: -6,
        rotation: 12,
        transformOrigin: '70% 48%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    });

    return () => {
      mm.revert();
    };
  }, []);

  const handleSelectVista = (idx: number) => {
    setMountAllVistas(true);
    setActiveIndex(normalizeSlideIndex(idx, 0, HERO_VISTAS.length));
  };

  const handleStepVista = (delta: number) => {
    setMountAllVistas(true);
    setActiveIndex((prev) => normalizeSlideIndex(prev, delta, HERO_VISTAS.length));
  };

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    pointerStartX.current = e.clientX;
  };

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    if (pointerStartX.current === null) return;
    const action = resolveSwipeAction(e.clientX - pointerStartX.current);
    pointerStartX.current = null;
    if (action === 'next') handleStepVista(1);
    else if (action === 'prev') handleStepVista(-1);
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative w-full min-h-[680px] sm:min-h-[620px] h-[100svh] max-h-[960px] overflow-hidden bg-[#1B1916] touch-pan-y"
    >
      {/* Immediate LCP-Prioritized Visual Canvas with GSAP Scroll Depth */}
      <div
        ref={backdropParallaxRef}
        className="absolute inset-0 z-0 will-change-transform"
      >
        {HERO_VISTAS.map((vista, idx) => {
          const isCurrent = idx === activeIndex;
          const shouldRender = idx === 0 || isCurrent || mountAllVistas;
          if (!shouldRender) return null;
          return (
            <div
              key={vista.id}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                isCurrent ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={vista.image}
                alt={vista.imageAlt}
                fill
                priority={idx === 0}
                loading="eager"
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                sizes="100vw"
                className={`object-cover object-center ${
                  isCurrent ? 'hero-vista-active' : ''
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Lightweight (<2 KB) Inline SVG Architectural Survey Geometry */}
      <div ref={ringsLayerRef} className="pointer-events-none absolute inset-0 z-[5] will-change-transform">
        <HeroArchitecturalRings />
      </div>

      {/* Measured Multi-Stop Editorial Scrims for >= 4.5:1 Contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#171512]/92 via-[#171512]/54 to-[#171512]/14"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-[#171512]/76 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 z-10 bg-gradient-to-t from-[#171512]/94 via-[#171512]/50 to-transparent"
      />

      {/* Editorial Foreground — extra bottom padding on mobile prevents any overlap with bottom Consent Bar */}
      <div className="relative z-20 h-full max-w-[1320px] mx-auto px-5 sm:px-8 pt-24 sm:pt-28 pb-28 sm:pb-20 md:pb-10 flex flex-col justify-between">
        <div className="my-auto max-w-3xl">
          <div className="text-xs sm:text-[13px] tracking-[0.2em] uppercase text-[#EDE5D6] mb-5 sm:mb-6 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 26 26"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <circle cx="13" cy="13" r="11.5" stroke="#C49A50" strokeWidth="1.2" />
              <circle cx="13" cy="13" r="2.2" fill="#C49A50" />
              <path
                d="M13 4.2C15.2 7 15.2 9.5 13 10.5M21.8 13C19 15.2 16.5 15.2 15.5 13M13 21.8C10.8 19 10.8 16.5 13 15.5M4.2 13C7 10.8 9.5 10.8 10.5 13"
                stroke="#C49A50"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-devanagari text-[#E5C185] tracking-normal normal-case text-sm whitespace-nowrap">
              भूमि · वास्तु · विश्वास
            </span>
            <span aria-hidden="true" className="text-[#C49A50]">
              ·
            </span>
            <span className="whitespace-nowrap">Invest With Confidence</span>
          </div>

          <h1 className="font-editorial text-[#F6F1E7] text-[clamp(2.75rem,6.2vw,5.4rem)] leading-[0.95] font-light tracking-[-0.02em] text-balance">
            Quiet Earth.
            <br />
            Enduring <em className="italic text-[#E5C185] font-normal">Architecture.</em>
          </h1>

          <div className="mt-5 sm:mt-7 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8">
            <span
              aria-hidden="true"
              className="hidden sm:block w-10 h-[1px] bg-[#C49A50]/75 mt-3.5 shrink-0"
            />
            <p className="text-[#EDE5D6] text-sm sm:text-[17px] leading-[1.68] max-w-xl">
              3VENI SPHERE curates contoured residential land plots and future living
              environments—shaped for transparent ownership, natural terrain harmony, and
              generational confidence.
            </p>
          </div>

          <div className="mt-7 sm:mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            <a
              href="#plots"
              data-testid="hero-primary-cta"
              className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.13em] uppercase hover:bg-[#7A310A] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F1E7]"
            >
              <span>Explore Available Plots</span>
              <ArrowDownRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>

            <Link
              href="/about"
              data-testid="hero-secondary-cta"
              className="editorial-link py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#F6F1E7] border-b border-[#C49A50]/65 hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F6F1E7]"
            >
              Our Stewardship Philosophy
            </Link>
          </div>
        </div>

        {/* Architectural Bottom Datum Strip — constrained away from md+ bottom-right CookieBanner */}
        <div className="pt-4 sm:pt-5 border-t border-[#F6F1E7]/20 flex flex-wrap items-center justify-start gap-x-5 gap-y-2.5 w-full md:max-w-[calc(100%-460px)]">
          <div
            role="tablist"
            aria-label="Featured landscape vistas"
            className="w-full sm:w-auto flex flex-wrap items-center gap-x-4 lg:gap-x-5 gap-y-1.5"
          >
            {HERO_VISTAS.map((vista, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={vista.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectVista(idx)}
                  className={`relative py-1.5 text-[11px] sm:text-xs tracking-[0.1em] uppercase transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C49A50] ${
                    isActive
                      ? 'text-[#F6F1E7] font-semibold'
                      : 'text-[#C8BCA9] hover:text-[#F6F1E7]'
                  }`}
                >
                  <span className="font-mono text-[#C49A50] mr-1.5 tabular-nums">
                    {vista.indexLabel}.
                  </span>
                  <span>{vista.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="hero-vista-indicator"
                      aria-hidden="true"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-[#C49A50]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 xl:border-l xl:border-[#F6F1E7]/20 xl:pl-5 shrink-0">
            <Link
              href={`/projects/${activeVista.linkedPlotSlug}`}
              data-testid="hero-sample-parcel-link"
              className="group inline-flex items-center gap-2 text-left text-xs text-[#EDE5D6] hover:text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C49A50]"
            >
              <span className="text-[#C49A50] uppercase tracking-[0.12em] font-semibold hidden sm:inline">
                {activeVista.elevationTag.split('·')[1]?.trim() || 'Sample Parcel'}:
              </span>
              <span className="font-medium underline underline-offset-4 decoration-[#C49A50]/50 group-hover:decoration-[#F6F1E7]">
                {activeVista.linkedPlotTitle}
              </span>
              <ArrowUpRight
                className="w-3.5 h-3.5 text-[#C49A50] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                aria-hidden="true"
              />
            </Link>

            <div className="hidden sm:flex items-center gap-1 pl-3 border-l border-[#F6F1E7]/20">
              <button
                type="button"
                onClick={() => handleStepVista(-1)}
                aria-label="Previous hero landscape vista"
                className="w-8 h-8 inline-flex items-center justify-center border border-[#F6F1E7]/25 text-[#EDE5D6] hover:border-[#C49A50] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStepVista(1)}
                aria-label="Next hero landscape vista"
                className="w-8 h-8 inline-flex items-center justify-center border border-[#F6F1E7]/25 text-[#EDE5D6] hover:border-[#C49A50] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="#brand-intro"
              aria-label="Scroll to Brand Introduction"
              className="hidden 2xl:inline-flex items-center gap-1.5 pl-4 border-l border-[#F6F1E7]/20 text-xs tracking-[0.12em] uppercase text-[#C8BCA9] hover:text-white transition-colors whitespace-nowrap"
            >
              <span>Scroll</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#C49A50]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
