import Reveal from '@/components/ui/Reveal';
import SectionHead from '@/components/ui/SectionHead';
import { ActionLink } from '@/components/ui/Button';
import ParcelCard from '@/components/property/ParcelCard';
import { getFeaturedParcels, getParcels } from '@/lib/parcels';

/** Featured plots (plan B4): one wide card + a stack, one card component, no modal, no duplicated parcel (audit M7). */
export default function FeaturedParcels() {
  const [lead, ...rest] = getFeaturedParcels(3);
  const total = getParcels().length;
  if (!lead) return null;
  return (
    <section className="section section--sunken" aria-labelledby="featured-title">
      <div className="wrap">
        <SectionHead
          id="featured-title"
          eyebrow="Featured plots"
          title="Curated land parcels prepared for generational ownership."
          lead="Explore sample parcel typologies across contour grades, dimensions, and road frontages."
        />
        <Reveal className="featured">
          <div className="featured__lead">
            <ParcelCard parcel={lead} sizes="(min-width: 1024px) 56vw, 100vw" />
          </div>
          <div className="featured__stack">
            {rest.map((p) => (
              <ParcelCard key={p.id} parcel={p} variant="compact" dense sizes="(min-width: 1024px) 20vw, (min-width: 768px) 40vw, 100vw" />
            ))}
          </div>
        </Reveal>
        <div className="featured__more">
          <ActionLink href="/projects">View all {total} plots</ActionLink>
        </div>
      </div>
    </section>
  );
}
