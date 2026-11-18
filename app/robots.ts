import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/config';

/**
 * Preview / unverified-domain builds disallow everything (audit C4: V1 emitted an indexable robots.txt and sitemap
 * for a placeholder domain). Live builds allow the site, keep /api/ out and point at the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
