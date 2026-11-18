import { absoluteUrl, getSiteUrl } from '@/lib/config';
import type { ResolvedSite } from '@/lib/site';
import type { Guide } from '@/content/guides';
import type { Parcel } from '@/types/parcel';

/**
 * schema.org builders (plan §4). Pure functions: only data the client has actually supplied is emitted —
 * no invented telephone, address, price, rating or sameAs. Output is validated by lib/__tests__/schema.test.ts.
 */
type Json = Record<string, unknown>;

const CONTEXT = 'https://schema.org';
const LOGO_PATH = '/images/brand/3veni-logo.webp';

export function organizationId(): string {
  return `${getSiteUrl().url}/#organization`;
}
export function websiteId(): string {
  return `${getSiteUrl().url}/#website`;
}

function postalAddress(site: ResolvedSite): Json | undefined {
  const a = site.address;
  if (!a || !(a.street || a.locality || a.region || a.postalCode)) return undefined;
  return {
    '@type': 'PostalAddress',
    ...(a.street ? { streetAddress: a.street } : {}),
    ...(a.locality ? { addressLocality: a.locality } : {}),
    ...(a.region ? { addressRegion: a.region } : {}),
    ...(a.postalCode ? { postalCode: a.postalCode } : {}),
    addressCountry: a.country ?? 'IN',
  };
}

/** Organization — becomes a RealEstateAgent (LocalBusiness) only once a postal address exists. */
export function organizationJsonLd(site: ResolvedSite): Json {
  const address = postalAddress(site);
  return {
    '@context': CONTEXT,
    '@type': address ? 'RealEstateAgent' : 'Organization',
    '@id': organizationId(),
    name: site.brandName,
    legalName: site.registeredEntityName,
    description: site.description,
    url: getSiteUrl().url,
    logo: absoluteUrl(LOGO_PATH),
    image: absoluteUrl(LOGO_PATH),
    ...(site.email ? { email: site.email.display } : {}),
    ...(site.phone ? { telephone: site.phone.display } : {}),
    ...(address ? { address } : {}),
    ...(site.hours ? { openingHours: site.hours } : {}),
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
  };
}

export function websiteJsonLd(site: ResolvedSite): Json {
  return {
    '@context': CONTEXT,
    '@type': 'WebSite',
    '@id': websiteId(),
    name: site.brandName,
    url: getSiteUrl().url,
    inLanguage: 'en-IN',
    publisher: { '@id': organizationId() },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): Json {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleJsonLd(guide: Guide, imagePath: string): Json {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    '@context': CONTEXT,
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    description: guide.metaDescription,
    mainEntityOfPage: url,
    image: absoluteUrl(imagePath),
    datePublished: guide.updatedAt,
    dateModified: guide.updatedAt,
    inLanguage: 'en-IN',
    author: { '@id': organizationId() },
    publisher: { '@id': organizationId() },
  };
}

function propertyValue(name: string, value: string): Json {
  return { '@type': 'PropertyValue', name, value };
}

/**
 * RealEstateListing for a parcel. `about` is a Place carrying area/dimensions/orientation/road width;
 * `geo` and `address` appear only when supplied; an `Offer` is emitted ONLY when a real price exists.
 */
export function listingJsonLd(parcel: Parcel, ogImagePath: string): Json {
  const url = absoluteUrl(`/projects/${parcel.slug}`);
  const place: Json = {
    '@type': 'Place',
    name: parcel.name,
    description: parcel.overview,
    additionalProperty: [
      propertyValue('Plot size', parcel.areaDisplay),
      propertyValue('Dimensions', parcel.dimensions),
      propertyValue('Orientation', parcel.facing),
      propertyValue('Road width', parcel.roadWidth),
      propertyValue('Topography', parcel.topography),
    ],
    ...(parcel.geo ? { geo: { '@type': 'GeoCoordinates', latitude: parcel.geo.lat, longitude: parcel.geo.lng } } : {}),
    ...(parcel.address
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(parcel.address.street ? { streetAddress: parcel.address.street } : {}),
            ...(parcel.address.locality ? { addressLocality: parcel.address.locality } : {}),
            ...(parcel.address.region ? { addressRegion: parcel.address.region } : {}),
            ...(parcel.address.postalCode ? { postalCode: parcel.address.postalCode } : {}),
            addressCountry: parcel.address.country ?? 'IN',
          },
        }
      : {}),
  };
  return {
    '@context': CONTEXT,
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: parcel.name,
    url,
    description: parcel.shortDescription,
    image: absoluteUrl(ogImagePath),
    dateModified: parcel.updatedAt,
    inLanguage: 'en-IN',
    about: place,
    isPartOf: { '@id': websiteId() },
    provider: { '@id': organizationId() },
    ...(parcel.price
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            price: parcel.price.amountInr,
            availability: parcel.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export function listingCollectionJsonLd(parcels: readonly Parcel[], path: string, name: string): Json {
  return {
    '@context': CONTEXT,
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
    isPartOf: { '@id': websiteId() },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: parcels.length,
      itemListElement: parcels.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/projects/${p.slug}`),
        name: p.name,
      })),
    },
  };
}

export function contactPageJsonLd(site: ResolvedSite): Json {
  return {
    '@context': CONTEXT,
    '@type': 'ContactPage',
    name: `Contact ${site.brandName}`,
    url: absoluteUrl('/contact'),
    isPartOf: { '@id': websiteId() },
    about: { '@id': organizationId() },
    ...(site.hasChannel
      ? {
          mainEntity: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            ...(site.phone ? { telephone: site.phone.display } : {}),
            ...(site.email ? { email: site.email.display } : {}),
          },
        }
      : {}),
  };
}
