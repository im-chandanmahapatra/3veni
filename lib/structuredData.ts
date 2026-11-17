import { SITE_CONFIG } from '@/config/siteConfig';
import type { LandPlot } from '@/types/property';

export function buildOrganizationJsonLd() {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.brandName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.siteUrl,
    logo: new URL(SITE_CONFIG.logoPath, SITE_CONFIG.siteUrl).toString(),
  };

  if (SITE_CONFIG.publicEmail) {
    schema.email = SITE_CONFIG.publicEmail;
  }

  return schema;
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.brandName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.siteUrl,
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: new URL(item.path, SITE_CONFIG.siteUrl).toString(),
    })),
  };
}

export function buildLandPlotJsonLd(plot: LandPlot) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: plot.name,
    description: plot.editorialOverview,
    url: new URL(`/projects/${plot.slug}`, SITE_CONFIG.siteUrl).toString(),
    image: new URL(plot.image, SITE_CONFIG.siteUrl).toString(),
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Category',
        value: plot.category,
      },
      {
        '@type': 'PropertyValue',
        name: 'Area',
        value: plot.areaDisplay,
      },
      {
        '@type': 'PropertyValue',
        name: 'Dimensions',
        value: plot.dimensions,
      },
      {
        '@type': 'PropertyValue',
        name: 'Orientation',
        value: plot.facing,
      },
    ],
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
