'use client';

import { useState, type ChangeEvent, type ReactNode } from 'react';
import Icon from '@/components/ui/Icon';

/**
 * Progressive enhancement around the server-rendered GET filter form (audit H1):
 *  - the form works without JavaScript (Apply button, real URLs);
 *  - with JavaScript, changing a select re-submits immediately;
 *  - below 1024 px the panel collapses behind a toggle (with <noscript> it stays open).
 */
export default function FiltersPanel({ children, activeCount }: { children: ReactNode; activeCount: number }) {
  const [open, setOpen] = useState(false);

  const onChange = (e: ChangeEvent<HTMLDivElement>) => {
    const target = e.target;
    if (target instanceof HTMLSelectElement) target.form?.requestSubmit();
  };

  return (
    <div className="filters-panel" data-open={open} onChange={onChange}>
      <button type="button" className="filters-toggle" aria-expanded={open} aria-controls="filters-body" onClick={() => setOpen((v) => !v)}>
        <span>Filters{activeCount ? ` (${activeCount})` : ''}</span>
        <Icon name="chevron-down" />
      </button>
      <div id="filters-body" className="filters-body">
        {children}
      </div>
      <noscript>
        <style>{'.filters-body{display:block!important}'}</style>
      </noscript>
    </div>
  );
}
