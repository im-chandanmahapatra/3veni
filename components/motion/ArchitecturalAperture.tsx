'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ArchitecturalApertureProps {
  src: string;
  alt: string;
  aspectClassName?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  hoverZoom?: boolean;
  scrubDepth?: boolean;
  caption?: string;
  hoverOverlayNote?: string;
}

/**
 * Architectural editorial photograph frame driven by GSAP + ScrollTrigger
 * depth scrub, subtle image de-zoom, optional hover caption reveal, and brass reticles.
 */
export default function ArchitecturalAperture({
  src,
  alt,
  aspectClassName = 'aspect-[16/10]',
  className = '',
  sizes = '(max-width: 1024px) 100vw, 58vw',
  priority = false,
  hoverZoom = true,
  scrubDepth = true,
  caption,
  hoverOverlayNote,
}: ArchitecturalApertureProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const media = mediaRef.current;
    if (!outer || !media) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        isMobileMotion: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        isReduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { isDesktop, isMobileMotion } = context.conditions ?? {};

        if (isDesktop) {
          gsap.fromTo(
            media,
            { scale: 1.07 },
            {
              scale: 1,
              duration: 1.05,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: outer,
                start: 'top 92%',
                once: true,
              },
            }
          );

          if (scrubDepth) {
            gsap.fromTo(
              media,
              { yPercent: -3 },
              {
                yPercent: 3,
                ease: 'none',
                scrollTrigger: {
                  trigger: outer,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.65,
                },
              }
            );
          }
        } else if (isMobileMotion) {
          gsap.fromTo(
            media,
            { scale: 1.04 },
            {
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: outer,
                start: 'top 92%',
                once: true,
              },
            }
          );
        } else {
          gsap.set(media, { scale: 1, yPercent: 0 });
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, [scrubDepth]);

  return (
    <figure ref={outerRef} className={className}>
      <div className={`relative overflow-hidden bg-[#EDE5D6] ${aspectClassName} group`}>
        <div ref={mediaRef} className="relative w-full h-[108%] -top-[4%] will-change-transform">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover transition-transform duration-700 ease-out ${
              hoverZoom ? '[@media(hover:hover)]:group-hover:scale-[1.035]' : ''
            }`}
          />
        </div>

        {/* Architectural brass reticle corners echoing the 3VENI emblem frame */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-[#C49A50]/65 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-[#C49A50]/65 transition-all duration-300 [@media(hover:hover)]:group-hover:w-5 [@media(hover:hover)]:group-hover:h-5"
        />

        {hoverOverlayNote && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#171512]/80 via-[#171512]/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
            />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 text-xs text-[#F6F1E7] tracking-wide opacity-100 md:opacity-0 md:translate-y-1.5 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300">
              {hoverOverlayNote}
            </div>
          </>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-[11px] font-mono tracking-[0.12em] uppercase text-[#5E554B]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
