'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface GsapStaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerSelector?: string;
  ruleSelector?: string;
}

/**
 * Coordinates GSAP ScrollTrigger staggered column lift and hairline rules
 * while guaranteeing items remain visible (opacity: 1) regardless of scroll/zoom state.
 */
export default function GsapStaggerGroup({
  children,
  className = '',
  staggerSelector = '[data-gsap-stagger]',
  ruleSelector = '[data-gsap-rule]',
}: GsapStaggerGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        allowMotion: '(prefers-reduced-motion: no-preference)',
        reduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { allowMotion } = context.conditions ?? {};
        const items = container.querySelectorAll<HTMLElement>(staggerSelector);
        const rules = container.querySelectorAll<HTMLElement>(ruleSelector);

        if (!allowMotion) {
          gsap.set(items, { opacity: 1, y: 0 });
          gsap.set(rules, { scaleX: 1 });
          return;
        }

        if (rules.length > 0) {
          gsap.fromTo(
            rules,
            { scaleX: 0.35, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.7,
              stagger: 0.07,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: container,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }

        if (items.length > 0) {
          gsap.fromTo(
            items,
            { y: 14 },
            {
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'transform',
              scrollTrigger: {
                trigger: container,
                start: 'top 92%',
                once: true,
              },
            }
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, [staggerSelector, ruleSelector]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
