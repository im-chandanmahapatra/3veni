import type { CSSProperties } from 'react';

/** Loading placeholder (DESIGN §8.12): shimmer is disabled under prefers-reduced-motion by the global rule. */
export default function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div aria-hidden="true" className={['skeleton', className ?? ''].filter(Boolean).join(' ')} style={style} />;
}
