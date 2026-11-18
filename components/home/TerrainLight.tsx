import Reveal from '@/components/ui/Reveal';
import ClientSlot from '@/components/ui/ClientSlot';
import PlateMosaic from '@/components/home/PlateMosaic';
import { PLATES, TERRAIN } from '@/content/copy';

/** Terrain & light (plan B6): the location story + four plates that open a lightbox. Merges V1's carousel and monograph. */
export default function TerrainLight() {
  return (
    <section className="section section--defer" aria-labelledby="terrain-title">
      <div className="wrap terrain">
        <Reveal className="terrain__copy">
          <p className="t-overline">{TERRAIN.eyebrow}</p>
          <h2 id="terrain-title" className="t-display-lg">
            {TERRAIN.heading}
          </h2>
          <p className="t-lead">{TERRAIN.body}</p>
          <dl className="terrain__points">
            {TERRAIN.points.map((p) => (
              <div key={p.title}>
                <dt className="t-label">{p.title}</dt>
                <dd className="t-body-sm">{p.text}</dd>
              </div>
            ))}
          </dl>
          <ClientSlot id="location-facts" />
        </Reveal>
        <div className="terrain__plates">
          <PlateMosaic plates={PLATES} />
        </div>
      </div>
    </section>
  );
}
