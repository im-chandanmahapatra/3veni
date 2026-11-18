import { isPreview } from '@/lib/config';
import { PLACEHOLDERS, type PlaceholderId } from '@/content/placeholders';

/**
 * Marked slot for content only the client can provide (DESIGN.md §8.13).
 * Preview mode: a dashed, clearly labelled block. Live mode: renders nothing (the launch gate lists what is missing).
 */
export default function ClientSlot({ id, className }: { id: PlaceholderId; className?: string }) {
  if (!isPreview()) return null;
  const def = PLACEHOLDERS[id];
  return (
    <div className={['slot', className ?? ''].filter(Boolean).join(' ')} role="note" data-client-slot={id}>
      <span className="t-overline">Client to provide</span>
      <p>
        <strong>{def.label}</strong> — {def.needs}
      </p>
    </div>
  );
}
