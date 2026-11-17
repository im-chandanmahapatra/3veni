'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { X } from 'lucide-react';
import {
  INTRO_REPLAY_EVENT,
  INTRO_SESSION_STORAGE_KEY,
  shouldPlayBrandIntro,
} from '@/lib/introSession';

/**
 * Branded 3VENI SPHERE opening curtain.
 * Animates a custom vector decomposition of the circular 4-quadrant emblem
 * (outer containment ring, clockwise swirling terracotta & olive quadrants,
 * central bindu, and split 3VENI SPHERE wordmark) in ~1.8s, once per session,
 * with immediate Skip (Esc/button), reduced-motion bypass, and Footer Replay support.
 */
export default function BrandIntroCurtain() {
  const pathname = usePathname() || '/';
  const [isVisible, setIsVisible] = useState(false);
  const [playNonce, setPlayNonce] = useState(0);

  const curtainRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const innerRingRef = useRef<SVGCircleElement>(null);
  const binduRef = useRef<SVGCircleElement>(null);
  const quadrantsGroupRef = useRef<SVGGElement>(null);
  const wordmarkLeftRef = useRef<HTMLSpanElement>(null);
  const wordmarkRightRef = useRef<HTMLSpanElement>(null);
  const dividerRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const finishCurtain = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_SESSION_STORAGE_KEY, '1');
    } catch {
      // Ignore storage access errors in private contexts
    }
    setIsVisible(false);
  }, []);

  const handleSkip = useCallback(() => {
    const curtain = curtainRef.current;
    tlRef.current?.kill();

    if (!curtain) {
      finishCurtain();
      return;
    }

    gsap.to(curtain, {
      opacity: 0,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: finishCurtain,
    });
  }, [finishCurtain]);

  // Initial session check scheduled via rAF to avoid SSR hydration mismatches
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let hasPlayedInSession = false;
    try {
      hasPlayedInSession = window.sessionStorage.getItem(INTRO_SESSION_STORAGE_KEY) === '1';
    } catch {
      hasPlayedInSession = false;
    }

    if (
      shouldPlayBrandIntro({
        pathname,
        hasPlayedInSession,
        prefersReducedMotion,
      })
    ) {
      const rafId = window.requestAnimationFrame(() => {
        setIsVisible(true);
        setPlayNonce((n) => n + 1);
      });
      return () => window.cancelAnimationFrame(rafId);
    }
    return undefined;
  }, [pathname]);

  // Listen for on-demand Replay trigger (dispatched from Footer)
  useEffect(() => {
    const onReplay = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setIsVisible(true);
      setPlayNonce((n) => n + 1);
    };

    window.addEventListener(INTRO_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(INTRO_REPLAY_EVENT, onReplay);
  }, []);

  // Run GSAP emblem & editorial curtain choreography whenever active
  useEffect(() => {
    if (!isVisible) return;

    const curtain = curtainRef.current;
    const ring = ringRef.current;
    const innerRing = innerRingRef.current;
    const bindu = binduRef.current;
    const quadrants = quadrantsGroupRef.current;
    const wordLeft = wordmarkLeftRef.current;
    const wordRight = wordmarkRightRef.current;
    const divider = dividerRef.current;
    const tagline = taglineRef.current;

    if (
      !curtain ||
      !ring ||
      !innerRing ||
      !bindu ||
      !quadrants ||
      !wordLeft ||
      !wordRight ||
      !divider ||
      !tagline
    ) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    const circumference = 2 * Math.PI * 86;
    const quadrantPaths = quadrants.querySelectorAll<SVGGElement>('[data-intro-quadrant]');

    const ctx = gsap.context(() => {
      gsap.set(curtain, { yPercent: 0, opacity: 1 });
      gsap.set(ring, { strokeDasharray: circumference, strokeDashoffset: circumference });
      gsap.set(innerRing, { opacity: 0, scale: 0.92, transformOrigin: '100px 100px' });
      gsap.set(bindu, { scale: 0.25, opacity: 0, transformOrigin: '100px 100px' });
      gsap.set(quadrants, { rotation: -24, transformOrigin: '100px 100px' });
      gsap.set(quadrantPaths, { opacity: 0, scale: 0.86, transformOrigin: '100px 100px' });
      gsap.set([wordLeft, wordRight], { yPercent: 110, opacity: 0 });
      gsap.set(divider, { scaleX: 0, transformOrigin: 'center center' });
      gsap.set(tagline, { y: 8, opacity: 0 });

      const tl = gsap.timeline({
        onComplete: finishCurtain,
      });
      tlRef.current = tl;

      tl.to(bindu, {
        scale: 1,
        opacity: 1,
        duration: 0.34,
        ease: 'back.out(1.7)',
      })
        .to(
          ring,
          {
            strokeDashoffset: 0,
            duration: 0.72,
            ease: 'power3.inOut',
          },
          0.08
        )
        .to(
          innerRing,
          {
            opacity: 0.55,
            scale: 1,
            duration: 0.5,
            ease: 'power2.out',
          },
          0.25
        )
        .to(
          quadrants,
          {
            rotation: 0,
            duration: 0.82,
            ease: 'power3.out',
          },
          0.22
        )
        .to(
          quadrantPaths,
          {
            opacity: 1,
            scale: 1,
            duration: 0.56,
            stagger: 0.075,
            ease: 'power2.out',
          },
          0.24
        )
        .to(
          [wordLeft, wordRight],
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.66
        )
        .to(
          divider,
          {
            scaleX: 1,
            duration: 0.42,
            ease: 'power2.out',
          },
          0.86
        )
        .to(
          tagline,
          {
            y: 0,
            opacity: 1,
            duration: 0.38,
            ease: 'power2.out',
          },
          0.92
        )
        .to(
          curtain,
          {
            yPercent: -100,
            duration: 0.52,
            ease: 'power4.inOut',
          },
          1.62
        );
    }, curtain);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      ctx.revert();
      tlRef.current = null;
    };
  }, [isVisible, playNonce, finishCurtain, handleSkip]);

  if (!isVisible) return null;

  return (
    <div
      ref={curtainRef}
      role="dialog"
      aria-modal="false"
      aria-label="3VENI SPHERE brand introduction"
      data-testid="brand-intro-curtain"
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#F6F1E7] travertine-grid-surface px-6 select-none overflow-hidden"
    >
      <button
        type="button"
        onClick={handleSkip}
        data-testid="skip-brand-intro"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 inline-flex items-center gap-2 px-4 min-h-[44px] border border-[#D8CEBC] bg-[#F6F1E7]/90 text-xs font-semibold tracking-[0.14em] uppercase text-[#493023] hover:border-[#98400F] hover:text-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
      >
        <span>Skip Intro</span>
        <X className="w-3.5 h-3.5" aria-hidden="true" />
      </button>

      <div className="flex flex-col items-center text-center max-w-md">
        <svg
          width="176"
          height="176"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
          className="w-36 h-36 sm:w-44 sm:h-44"
        >
          {/* Outer Terracotta containment ring matching emblem border */}
          <circle
            ref={ringRef}
            cx="100"
            cy="100"
            r="86"
            stroke="#98400F"
            strokeWidth="4.5"
            strokeLinecap="round"
            transform="rotate(-90 100 100)"
          />
          <circle
            ref={innerRingRef}
            cx="100"
            cy="100"
            r="79"
            stroke="#C49A50"
            strokeWidth="0.9"
            strokeDasharray="3 5"
          />

          {/* Four swirling clockwise teardrop quadrants derived directly from official 3VENI emblem */}
          <g ref={quadrantsGroupRef}>
            {/* Top-left Quadrant (Terracotta · Peacock Plume Curve) */}
            <g data-intro-quadrant>
              <path
                d="M93 26 C55 28, 28 55, 26 92 C48 76, 70 76, 86 91 C92 72, 95 50, 93 26 Z"
                fill="#98400F"
                fillOpacity="0.94"
              />
              <path
                d="M78 44 C61 48, 48 61, 44 76"
                stroke="#F6F1E7"
                strokeOpacity="0.6"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>

            {/* Top-right Quadrant (Deep Olive · Botanical Rosette) */}
            <g data-intro-quadrant>
              <path
                d="M174 93 C172 55, 145 28, 108 26 C124 48, 124 70, 109 86 C128 92, 150 95, 174 93 Z"
                fill="#41490D"
                fillOpacity="0.94"
              />
              <path
                d="M132 58 L142 48 M142 58 L132 48 M137 46 L137 60 M130 53 L144 53"
                stroke="#E5C185"
                strokeOpacity="0.72"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </g>

            {/* Bottom-right Quadrant (Terracotta · Warli Chevron Geometry) */}
            <g data-intro-quadrant>
              <path
                d="M107 174 C145 172, 172 145, 174 108 C152 124, 130 124, 114 109 C108 128, 105 150, 107 174 Z"
                fill="#98400F"
                fillOpacity="0.94"
              />
              <path
                d="M124 148 L132 135 L140 148 L148 135 L156 148"
                stroke="#F6F1E7"
                strokeOpacity="0.65"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* Bottom-left Quadrant (Deep Olive · Canopy Grove Arch) */}
            <g data-intro-quadrant>
              <path
                d="M26 107 C28 145, 55 172, 92 174 C76 152, 76 130, 91 114 C72 108, 50 105, 26 107 Z"
                fill="#41490D"
                fillOpacity="0.94"
              />
              <path
                d="M46 130 C54 142, 65 148, 76 150"
                stroke="#E5C185"
                strokeOpacity="0.68"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* Central Bindu Anchor */}
          <circle ref={binduRef} cx="100" cy="100" r="10.5" fill="#98400F" />
          <circle cx="100" cy="100" r="3" fill="#F6F1E7" fillOpacity="0.88" />
        </svg>

        <div className="mt-7 overflow-hidden">
          <div className="font-sans text-2xl sm:text-3xl font-semibold tracking-[0.26em] uppercase flex items-center justify-center gap-3">
            <span ref={wordmarkLeftRef} className="inline-block text-[#98400F]">
              3VENI
            </span>
            <span ref={wordmarkRightRef} className="inline-block text-[#41490D]">
              SPHERE
            </span>
          </div>
        </div>

        <span
          ref={dividerRef}
          aria-hidden="true"
          className="mt-4 block w-40 h-[1px] bg-[#C49A50]"
        />

        <p
          ref={taglineRef}
          className="mt-3.5 text-[11px] font-semibold tracking-[0.24em] uppercase text-[#493023]"
        >
          Invest With Confidence
        </p>
      </div>
    </div>
  );
}
