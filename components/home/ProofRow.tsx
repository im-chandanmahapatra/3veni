import ClientSlot from '@/components/ui/ClientSlot';
import { PROOF_STATS } from '@/content/proof';
import { isPreview } from '@/lib/config';

/**
 * Proof row (audit C8; Sotheby's / Knight Frank pattern). Real figures come only from content/proof.ts — never invented.
 * Empty: a marked slot in preview, nothing in live.
 */
export default function ProofRow() {
  if (!PROOF_STATS.length) {
    if (!isPreview()) return null;
    return (
      <section className="section--tight" aria-label="Proof points">
        <div className="wrap">
          <ClientSlot id="proof" />
        </div>
      </section>
    );
  }
  return (
    <section className="section--tight hairline-top" aria-label="Proof points">
      <div className="wrap">
        <dl className="proof-row">
          {PROOF_STATS.map((s) => (
            <div key={s.label}>
              <dt className="t-overline">{s.label}</dt>
              <dd className="t-display-md t-numeric">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
