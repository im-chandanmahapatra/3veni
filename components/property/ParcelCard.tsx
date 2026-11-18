import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Icon from '@/components/ui/Icon';
import Media from '@/components/ui/Media';
import { SpecList } from '@/components/ui/SpecList';
import { FORMAT_LABEL, STATUS_LABEL } from '@/lib/parcels';
import type { Parcel } from '@/types/parcel';

interface ParcelCardProps {
  parcel: Parcel;
  /** `compact` = horizontal card for the featured stack */
  variant?: 'default' | 'compact';
  /** heading level for the title; the listing uses h2 under an h1, home sections use h3 under an h2 */
  as?: 'h2' | 'h3';
  /** exact `sizes` for the lead image */
  sizes: string;
  /** hide the spec list (compact stack) */
  dense?: boolean;
  /** the LCP candidate of the page (first card of a listing): preload + fetchPriority high */
  preload?: boolean;
}

/**
 * Property card (DESIGN §8.4): the whole card is ONE link (title anchor stretched over the card) — V1 had two
 * competing paths ("View Details" + "Quick Preview"). Specs are a definition list in tabular numerals; price is explicit.
 */
export default function ParcelCard({ parcel, variant = 'default', as: Heading = 'h3', sizes, dense, preload }: ParcelCardProps) {
  const lead = parcel.gallery[0]!;
  const price = parcel.price?.display ?? 'Price on request';
  return (
    <article className={['card', variant === 'compact' ? 'card--compact' : ''].filter(Boolean).join(' ')} data-testid={`plot-card-${parcel.slug}`}>
      <div className="card__media-wrap">
        <Media src={lead.src} alt={lead.alt} sizes={sizes} ratio={variant === 'compact' ? 'fill' : '3/2'} focal={lead.focal} preload={preload} />
        <Badge className="card__badge">{STATUS_LABEL[parcel.status]}</Badge>
      </div>
      <div className="card__body">
        <p className="t-overline">
          {parcel.code} · {FORMAT_LABEL[parcel.format]}
        </p>
        <Heading className="t-title card__title">
          <Link href={`/projects/${parcel.slug}`}>{parcel.name}</Link>
        </Heading>
        <p className="t-caption">
          {parcel.terrain} · {parcel.locationLabel}
        </p>
        {dense ? null : (
          <SpecList
            items={[
              { label: 'Plot size', value: parcel.areaDisplay },
              { label: 'Dimensions', value: parcel.dimensions },
              { label: 'Facing', value: parcel.facing },
            ]}
          />
        )}
        <div className="card__foot">
          <b>{price}</b>
          <span className="card__cta" aria-hidden="true">
            View dossier <Icon name="arrow-right" />
          </span>
        </div>
      </div>
    </article>
  );
}
