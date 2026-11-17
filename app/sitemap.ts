import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/siteConfig';
import { LAND_PLOTS } from '@/data/properties';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-11-17T00:00:00.000Z');

  const staticRoutes: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/future-homes', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/guides/land-buying-checklist', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy-policy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/cookie-policy', priority: 0.3, changeFrequency: 'monthly' },
    { path: '/terms-and-conditions', priority: 0.3, changeFrequency: 'monthly' },
  ];

  const plotRoutes = LAND_PLOTS.map((plot) => ({
    url: new URL(`/projects/${plot.slug}`, SITE_CONFIG.siteUrl).toString(),
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path, SITE_CONFIG.siteUrl).toString(),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...plotRoutes,
  ];
}
