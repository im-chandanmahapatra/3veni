import type { Metadata } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/config';
import { SITE } from '@/content/site';

/**
 * Per-page metadata (plan §4): unique title + description, absolute canonical, Open Graph / Twitter with a
 * 1200×630 per-page image, and robots driven by the indexing rules in lib/config.ts (audit C4, M10, L4).
 */
export interface OgImage {
  /** public path, e.g. /og/aranya-ridge-terraces.jpg (1200×630) */
  path: string;
  alt: string;
}

export const DEFAULT_OG: OgImage = {
  path: '/og/default.jpg',
  alt: '3VENI SPHERE — terraced residential land plots in warm evening light',
};

export interface PageSeo {
  /** page title WITHOUT the brand suffix (the layout template appends "| 3VENI SPHERE") */
  title: string;
  description: string;
  /** route path, e.g. /projects */
  path: string;
  image?: OgImage;
  /** force noindex (filtered listings, hubs with thin content …) */
  noindex?: boolean;
  /** canonical differs from `path` (e.g. filtered listing → base listing) */
  canonicalPath?: string;
  type?: 'website' | 'article';
  /** use the title exactly as given (home page) */
  absoluteTitle?: boolean;
}

export function buildMetadata(o: PageSeo): Metadata {
  const image = o.image ?? DEFAULT_OG;
  const canonical = absoluteUrl(o.canonicalPath ?? o.path);
  const fullTitle = o.absoluteTitle ? o.title : `${o.title} | ${SITE.brandName}`;
  const index = isIndexable() && !o.noindex;
  return {
    title: o.absoluteTitle ? { absolute: o.title } : o.title,
    description: o.description,
    alternates: { canonical },
    robots: index ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: o.type ?? 'website',
      locale: 'en_IN',
      siteName: SITE.brandName,
      title: fullTitle,
      description: o.description,
      url: canonical,
      images: [{ url: absoluteUrl(image.path), width: 1200, height: 630, alt: image.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: o.description,
      images: [{ url: absoluteUrl(image.path), alt: image.alt }],
    },
  };
}

/** Pages that must never carry a canonical or be indexed (404, errors). */
export function buildNoIndexMetadata(title: string, description: string): Metadata {
  return { title, description, robots: { index: false, follow: true } };
}
