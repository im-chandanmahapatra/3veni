import type { StaticImageData } from 'next/image';

/** Land formats. Display labels live in FORMAT_LABEL (lib/parcels.ts). */
export type ParcelFormat = 'residential' | 'corner' | 'acreage';

/**
 * `sample` = illustrative typology (every V1 parcel). Real inventory uses available | reserved | sold.
 * Display is always text (badge), never colour alone.
 */
export type ParcelStatus = 'sample' | 'available' | 'reserved' | 'sold';

export interface ParcelImage {
  src: StaticImageData;
  alt: string;
  caption: string;
  /** object-position focal point, 0–1 [x, y]; never left at the default centre when the subject is off-centre */
  focal?: readonly [number, number];
}

export interface ParcelPrice {
  /** numeric rupee amount (total or per sq. ft. as per `basis`) — only present if the client confirms public pricing */
  amountInr: number;
  display: string;
  basis: 'total' | 'per-sq-ft';
}

export interface ParcelPlanShape {
  /** SVG polygon points in the masterplan viewBox */
  points: string;
  labelX: number;
  labelY: number;
  elevationNote: string;
}

export interface Parcel {
  id: string;
  slug: string;
  /** masterplan code, P-01… */
  code: string;
  name: string;
  format: ParcelFormat;
  terrain: string;
  terrainSlug: string;
  /** V1 location label (a sample typology label, not a real address) */
  locationLabel: string;
  areaSqFt: number;
  areaDisplay: string;
  dimensions: string;
  facing: string;
  roadWidth: string;
  topography: string;
  /** V1 pricing sentence, kept verbatim */
  priceNote: string;
  price?: ParcelPrice;
  status: ParcelStatus;
  /** V1 availability sentence, kept verbatim */
  statusNote: string;
  gallery: readonly ParcelImage[];
  shortDescription: string;
  overview: string;
  highlights: readonly string[];
  plan: ParcelPlanShape;
  featured?: boolean;
  /** ISO date this record was last reviewed (feeds sitemap lastmod and schema dateModified) */
  updatedAt: string;
  // —— optional real-estate fields: [CLIENT TO PROVIDE] ——
  address?: { street?: string; locality?: string; region?: string; postalCode?: string; country?: string };
  geo?: { lat: number; lng: number };
  reraId?: string;
  documents?: readonly { label: string; href: string }[];
}

export interface Residence {
  id: string;
  title: string;
  typology: string;
  /** V1 label, kept verbatim: "Coming Soon · Future Collection" */
  statusLabel: string;
  footprint: string;
  materials: readonly string[];
  image: ParcelImage;
  summary: string;
  note: string;
}

/** A numbered photographic plate (home "terrain & light" mosaic). */
export interface Plate {
  id: string;
  /** "Plate 01" */
  number: string;
  title: string;
  caption: string;
  src: StaticImageData;
  alt: string;
  focal?: readonly [number, number];
}
