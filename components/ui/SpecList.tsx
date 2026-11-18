import type { ReactNode } from 'react';

export interface Spec {
  label: string;
  value: ReactNode;
}

/** Compact definition list (cards): label overline above a tabular-numeral value. */
export function SpecList({ items, className }: { items: Spec[]; className?: string }) {
  return (
    <dl className={['spec-list', className ?? ''].filter(Boolean).join(' ')}>
      {items.map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Full-width specification rows (dossier page). */
export function SpecRows({ items, className }: { items: Spec[]; className?: string }) {
  return (
    <dl className={['spec-rows', className ?? ''].filter(Boolean).join(' ')}>
      {items.map((s) => (
        <div key={s.label}>
          <dt>{s.label}</dt>
          <dd>{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
