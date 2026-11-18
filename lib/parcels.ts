import { PARCELS } from '@/content/parcels';
import type { Parcel, ParcelFormat, ParcelStatus } from '@/types/parcel';

export const FORMAT_LABEL: Record<ParcelFormat, string> = {
  residential: 'Residential plots',
  corner: 'Corner parcels',
  acreage: 'Estate acreage',
};
export const FORMAT_ORDER: readonly ParcelFormat[] = ['residential', 'corner', 'acreage'];

/** Status is always shown as text, never colour alone (DESIGN §8.3). */
export const STATUS_LABEL: Record<ParcelStatus, string> = {
  sample: 'Sample parcel',
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

export function getParcels(): readonly Parcel[] {
  return PARCELS;
}

export function getParcelBySlug(slug: string): Parcel | undefined {
  return PARCELS.find((p) => p.slug === slug);
}

export function getFeaturedParcels(limit = 3): Parcel[] {
  const featured = PARCELS.filter((p) => p.featured);
  return (featured.length ? featured : [...PARCELS]).slice(0, limit);
}

/** Previous / next in catalogue order (wraps around) for the dossier footer navigation. */
export function adjacentParcels(slug: string): { prev?: Parcel; next?: Parcel } {
  const i = PARCELS.findIndex((p) => p.slug === slug);
  if (i === -1 || PARCELS.length < 2) return {};
  return {
    prev: PARCELS[(i - 1 + PARCELS.length) % PARCELS.length],
    next: PARCELS[(i + 1) % PARCELS.length],
  };
}

/**
 * "Similar parcels" by attribute instead of V1's fixed two neighbours (audit M7/H10):
 * same format scores highest, then same terrain, then closeness in plot size.
 */
export function similarParcels(parcel: Parcel, limit = 3): Parcel[] {
  return PARCELS.filter((p) => p.id !== parcel.id)
    .map((p) => {
      const sizeCloseness = 1 - Math.min(1, Math.abs(p.areaSqFt - parcel.areaSqFt) / Math.max(p.areaSqFt, parcel.areaSqFt));
      const score = (p.format === parcel.format ? 3 : 0) + (p.terrainSlug === parcel.terrainSlug ? 2 : 0) + sizeCloseness;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || a.p.areaSqFt - b.p.areaSqFt)
    .slice(0, limit)
    .map((x) => x.p);
}

/** One-line summary used in cards and metadata: "4,800 sq. ft. residential plot". */
export function parcelSummary(parcel: Parcel): string {
  const noun = parcel.format === 'acreage' ? 'estate parcel' : parcel.format === 'corner' ? 'corner parcel' : 'residential plot';
  return `${parcel.areaDisplay} ${noun}`;
}
