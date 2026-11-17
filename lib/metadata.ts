import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/siteConfig';

export interface RouteSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

export function createPageMetadata({
  title,
  description,
  path,
  image = SITE_CONFIG.heroFallbackPath,
  noIndex = false,
  type = 'website',
}: RouteSeoOptions): Metadata {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = new URL(normalizedPath, SITE_CONFIG.siteUrl).toString();
  const imageUrl = new URL(image, SITE_CONFIG.siteUrl).toString();

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
    openGraph: {
      type,
      locale: 'en_IN',
      siteName: SITE_CONFIG.brandName,
      title,
      description,
      url: fullUrl,
      images: [
        {
          url: imageUrl,
          width: 1376,
          height: 768,
          alt: `${title} — ${SITE_CONFIG.brandName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
