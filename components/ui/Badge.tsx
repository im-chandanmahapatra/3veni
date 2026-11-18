import type { ReactNode } from 'react';

type Tone = 'outline' | 'clay' | 'night' | 'olive' | 'dashed';

export default function Badge({ tone = 'outline', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  const toneClass = tone === 'outline' ? '' : tone === 'dashed' ? 'badge--dashed' : `badge--${tone}`;
  return <span className={['badge', toneClass, className ?? ''].filter(Boolean).join(' ')}>{children}</span>;
}
