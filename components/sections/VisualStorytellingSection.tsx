'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { QuadrantWatermarkCorner, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal } from '@/components/ui/ScrollReveal';

const PHILOSOPHY_CADENCE = [
  {
    code: '01',
    title: 'Hold the Quiet Earth',
    note: 'Tangible plotted parcels selected for ridge drainage, elevation sightlines, and long-term horizon.',
  },
  {
    code: '02',
    title: 'Honor Existing Trees & Light',
    note: 'Avenue widths and block setbacks shaped around solar orientation and mature native shade cover.',
  },
  {
    code: '03',
    title: 'Let Architecture Follow',
    note: 'Build a seasonal pavilion or multi-generational residence at your own pace without urgency.',
  },
];

export default function VisualStorytellingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const imageWrap = imageWrapRef.current;
    const progressLine = progressLineRef.current;
    if (!section || !imageWrap || !progressLine) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktopMotion: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktopMotion } = context.conditions ?? {};

        if (desktopMotion) {
          gsap.fromTo(
            imageWrap,
            { scale: 1.05, yPercent: -2.5 },
            {
              scale: 1,
              yPercent: 2.5,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
              },
            }
          );

          gsap.fromTo(
            progressLine,
            { scaleX: 0.35, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 88%',
                once: true,
              },
            }
          );
        } else {
          gsap.set(imageWrap, { scale: 1, yPercent: 0 });
          gsap.set(progressLine, { scaleX: 1 });
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Architectural Philosophy"
      className="relative bg-[#24221E] text-[#F6F1E7] py-24 lg:py-32 overflow-x-clip border-b border-[#34302A]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="dark"
          folioLabel="ARCHITECTURAL MONOGRAPH"
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <p className="font-devanagari text-base text-[#C49A50] mb-4">
              धरा · वास्तु · भविष्य
            </p>
            <EditorialHeadingReveal
              as="h2"
              segments={[
                { text: 'First you hold the' },
                { text: 'quiet earth;', italic: true, className: 'text-[#E5B87B]' },
                { text: 'in time, the architecture follows.' },
              ]}
              className="font-editorial text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.02em] text-balance"
            />

            <div className="mt-7 h-[1px] w-full bg-[#C49A50]/25 overflow-hidden">
              <div ref={progressLineRef} className="h-full w-full bg-[#C49A50]" />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-7">
              {PHILOSOPHY_CADENCE.map((step) => (
                <div
                  key={step.code}
                  className="pt-4 border-t border-[#C49A50]/20 sm:border-t-0 sm:pt-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-[1px] bg-[#C49A50]" aria-hidden="true" />
                    <p className="font-mono text-[11px] text-[#C49A50] tracking-widest">
                      {step.code}.
                    </p>
                  </div>
                  <h3 className="mt-2.5 font-editorial text-xl font-medium text-[#F6F1E7]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-[#EDE5D6] leading-relaxed">
                    {step.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] max-h-[500px] w-full overflow-hidden border border-[#C49A50]/35 bg-[#1C1A17] group">
              <div
                ref={imageWrapRef}
                className="relative w-full h-[106%] -top-[3%] will-change-transform"
              >
                <Image
                  src="/images/plots/earth-architecture-study.webp"
                  alt="Honed sandstone steps and rammed earth courtyard wall framed by dappled olive tree shadows"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
                />
              </div>
              <QuadrantWatermarkCorner
                tone="gold"
                className="absolute top-2.5 right-2.5 z-10"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-[#C49A50]/65 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5 z-10"
              />
            </div>
            <p className="mt-4 font-mono text-[11px] tracking-[0.16em] uppercase text-[#C49A50]">
              Earth · Form · Permanence — 3VENI SPHERE Material Study
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
