'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Button from '@/components/ui/Button';
import type { GuideSection } from '@/content/guides';

const KEY = (slug: string) => `3veni_guide_checklist_${slug}`;

/** Tiny external store over localStorage (with an in-memory fallback when storage is blocked), so server and first client render agree. */
const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};
function read(slug: string): string {
  try {
    return window.localStorage.getItem(KEY(slug)) ?? memory.get(slug) ?? '[]';
  } catch {
    return memory.get(slug) ?? '[]';
  }
}
function write(slug: string, ids: string[]) {
  const raw = JSON.stringify(ids);
  memory.set(slug, raw);
  try {
    window.localStorage.setItem(KEY(slug), raw);
  } catch {
    /* storage unavailable — kept in memory for this visit */
  }
  listeners.forEach((l) => l());
}

function parse(raw: string): ReadonlySet<string> {
  try {
    const ids = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(ids) ? ids.filter((x): x is string => typeof x === 'string') : []);
  } catch {
    return new Set();
  }
}

/**
 * Due-diligence checklist (plan B14): every point is a real checkbox with a visible label. Progress is saved in this
 * browser only, shown as text + bar, can be reset, and prints cleanly. Server HTML renders every section fully, so the
 * guide reads without JavaScript.
 */
export default function InteractiveChecklist({ slug, sections }: { slug: string; sections: readonly GuideSection[] }) {
  const total = sections.reduce((n, s) => n + s.points.length, 0);
  const raw = useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => '[]',
  );
  const done = useMemo(() => parse(raw), [raw]);

  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    write(slug, [...next]);
  };

  const reset = () => write(slug, []);

  const count = done.size;
  return (
    <div className="checklist" data-testid="guide-checklist">
      <div className="checklist__progress">
        <p className="t-label" role="status" aria-live="polite">
          {count} of {total} checked
        </p>
        <progress max={total} value={count} aria-label="Checklist progress" />
        <div className="checklist__tools no-print">
          <Button variant="secondary" icon={null} onClick={() => window.print()}>
            Print checklist
          </Button>
          <Button variant="secondary" icon={null} onClick={reset} disabled={count === 0}>
            Reset
          </Button>
        </div>
      </div>

      {sections.map((s) => (
        <section key={s.index} className="checklist__section" aria-labelledby={`cl-${s.index}`}>
          <p className="t-numeric checklist__index">{s.index}</p>
          <h2 id={`cl-${s.index}`} className="t-display-md">
            {s.title}
          </h2>
          <p className="t-body max-w-[60ch]">{s.summary}</p>
          <ul className="checklist__points">
            {s.points.map((p, i) => {
              const id = `${s.index}-${i}`;
              return (
                <li key={id}>
                  <label className="check">
                    <input type="checkbox" checked={done.has(id)} onChange={() => toggle(id)} />
                    <span>{p}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
