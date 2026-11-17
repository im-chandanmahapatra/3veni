'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface EditorialRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
}

/**
 * Hydration-safe, guaranteed-visible editorial entrance wrapper.
 * Runs exclusively post-hydration via GSAP ScrollTrigger + matchMedia,
 * never sets opacity < 1, and clears transforms cleanly after completion.
 */
export function EditorialReveal({
  children,
  className = '',
  delay = 0,
  yOffset = 12,
}: EditorialRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { y: yOffset },
        {
          y: 0,
          duration: 0.58,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: {
            trigger: el,
            start: 'top 95%',
            once: true,
          },
        }
      );
    });

    return () => {
      mm.revert();
    };
  }, [delay, yOffset]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export interface EditorialWordSegment {
  text: string;
  italic?: boolean;
  className?: string;
}

interface EditorialHeadingRevealProps {
  as?: 'h1' | 'h2' | 'h3';
  segments: EditorialWordSegment[];
  className?: string;
  delay?: number;
}

/**
 * Staggered word-level typographic reveal synchronized with scrolling.
 * Keeps starting opacity at 0.92 (never 0) so display headings remain readable
 * at every zoom level and scroll velocity while gliding upward cleanly.
 */
export function EditorialHeadingReveal({
  as = 'h2',
  segments,
  className = '',
  delay = 0,
}: EditorialHeadingRevealProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = heading.querySelectorAll<HTMLElement>('[data-word-token]');
      if (words.length === 0) return;

      gsap.fromTo(
        words,
        { y: 12, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          duration: 0.52,
          delay,
          stagger: 0.032,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: heading,
            start: 'top 94%',
            once: true,
          },
        }
      );
    });

    return () => {
      mm.revert();
    };
  }, [delay]);

  const Tag = as;

  return (
    <Tag ref={headingRef} className={className}>
      {segments.map((seg, segIdx) => {
        const words = seg.text.trim().split(/\s+/);
        return (
          <span
            key={segIdx}
            className={`${seg.italic ? 'italic font-normal ' : ''}${seg.className ?? ''}`}
          >
            {words.map((word, wordIdx) => (
              <span key={`${segIdx}-${wordIdx}`} className="inline">
                <span data-word-token className="inline-block will-change-transform">
                  {word}
                </span>
                {!(segIdx === segments.length - 1 && wordIdx === words.length - 1) && ' '}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}

interface ParallaxPhotoFrameProps {
  src: string;
  alt: string;
  aspectClassName?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  hoverZoom?: boolean;
}

export function ParallaxPhotoFrame({
  src,
  alt,
  aspectClassName = 'aspect-[16/10]',
  className = '',
  sizes = '(max-width: 1024px) 100vw, 58vw',
  priority = false,
  hoverZoom = true,
}: ParallaxPhotoFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        inner,
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
          },
        }
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#EDE5D6] ${aspectClassName} ${className}`}
    >
      <div ref={innerRef} className="relative w-full h-[108%] -top-[4%] will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover transition-transform duration-700 ease-out ${
            hoverZoom ? 'group-hover:scale-[1.03] hover:scale-[1.02]' : ''
          }`}
        />
      </div>
    </div>
  );
}
