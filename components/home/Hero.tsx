import Link from 'next/link';
import Button, { ActionLink } from '@/components/ui/Button';
import Media from '@/components/ui/Media';
import HeroSearch from '@/components/home/HeroSearch';
import { getParcelBySlug } from '@/lib/parcels';

/**
 * Hero (DESIGN §3, audit H1/H2/M5/C6): ONE static plate — nothing auto-moves. Desktop: full-bleed photograph, type on a
 * ≥ 0.72 scrim, docked search. Mobile: image first, type on paper (no text over photography), stacked search.
 * The LCP image is preloaded with fetchPriority high; no element starts at opacity 0.
 */
export default function Hero() {
  const parcel = getParcelBySlug('aranya-ridge-terraces')!;
  const plate = parcel.gallery[0]!;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__media">
        <Media src={plate.src} alt={plate.alt} sizes="100vw" ratio="fill" focal={[0.5, 0.45]} preload quality={75} />
      </div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="wrap hero__body">
        <h1 id="hero-title" className="hero__title">
          <span className="t-overline hero__eyebrow">Contoured residential land plots</span>
          <span className="t-display-xl">Quiet earth. Enduring architecture.</span>
        </h1>
        <p className="t-lead hero__lead">
          3VENI SPHERE curates contoured residential land plots and future living environments—shaped for transparent ownership,
          natural terrain harmony, and generational confidence.
        </p>
        <div className="hero__actions">
          <Button href="/projects" size="lg">
            Explore plots
          </Button>
          <ActionLink href="/about">Our approach</ActionLink>
        </div>
      </div>

      <p className="hero__plate t-caption">
        Plate 01 — <Link href={`/projects/${parcel.slug}`}>{parcel.name}</Link> · Sample parcel · {parcel.areaDisplay}
      </p>

      <div className="wrap hero__search">
        <HeroSearch />
      </div>
    </section>
  );
}
