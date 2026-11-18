'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Scroll reveal (DESIGN §10): opacity + 14 px rise, once, **below the fold only**.
 * - Elements already in (or above) the viewport at mount are never hidden → no LCP/CLS risk, nothing invisible without JS.
 * - Hidden state is applied by JS after hydration, so server HTML always contains fully visible content.
 * - prefers-reduced-motion: skipped entirely.
 * Children are passed through untouched, so server-rendered content stays server-rendered.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.92) return; // already visible (or above): leave untouched
    el.setAttribute('data-reveal', 'pending');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.setAttribute('data-reveal', 'shown');
        io.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
