import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/config';
import { PARCELS } from '@/content/parcels';
import { GUIDES } from '@/content/guides';

/**
 * Sitemap (audit M10): real `lastModified` per record (content `updatedAt`), no fixed date, no changefreq/priority
 * (Google ignores both). Utility pages (legal, 404) and the thin /guides hub are intentionally omitted.
 */
const SITE_UPDATED = '2026-11-18';

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = (dates: string[]) => dates.sort().at(-1) ?? SITE_UPDATED;
  const parcelsUpdated = latest(PARCELS.map((p) => p.updatedAt));
  const guidesUpdated = latest(GUIDES.map((g) => g.updatedAt));

  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: parcelsUpdated },
    { url: absoluteUrl('/projects'), lastModified: parcelsUpdated },
    ...PARCELS.map((p) => ({ url: absoluteUrl(`/projects/${p.slug}`), lastModified: p.updatedAt })),
    ...GUIDES.map((g) => ({ url: absoluteUrl(`/guides/${g.slug}`), lastModified: g.updatedAt })),
    { url: absoluteUrl('/about'), lastModified: SITE_UPDATED },
    { url: absoluteUrl('/future-homes'), lastModified: SITE_UPDATED },
    { url: absoluteUrl('/contact'), lastModified: SITE_UPDATED },
  ];
  // the guides hub is listed only when it has real depth (it is noindex below 3 guides)
  if (GUIDES.length >= 3) entries.push({ url: absoluteUrl('/guides'), lastModified: guidesUpdated });
  return entries;
}
