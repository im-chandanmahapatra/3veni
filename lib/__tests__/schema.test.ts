import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import JsonLd from '@/components/seo/JsonLd';
import { PARCELS } from '@/content/parcels';
import { GUIDES } from '@/content/guides';
import { getSite } from '@/lib/site';
import {
  articleJsonLd,
  breadcrumbJsonLd,
  contactPageJsonLd,
  faqJsonLd,
  listingCollectionJsonLd,
  listingJsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

const BARE = getSite({} as NodeJS.ProcessEnv);
const FULL = getSite({
  CONTACT_EMAIL: 'team@example.in',
  CONTACT_PHONE: '+91 98765 43210',
} as unknown as NodeJS.ProcessEnv);

function withEnv(env: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) {
    saved[k] = process.env[k];
    if (env[k] === undefined) delete process.env[k];
    else process.env[k] = env[k];
  }
  try {
    fn();
  } finally {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test('Organization/WebSite emit only supplied facts (no invented telephone, address or sameAs)', () => {
  const org = organizationJsonLd(BARE);
  assert.equal(org['@type'], 'Organization');
  assert.equal(org.name, '3VENI SPHERE');
  for (const key of ['telephone', 'email', 'address', 'sameAs', 'openingHours']) assert.equal(key in org, false, key);
  const richer = organizationJsonLd(FULL);
  assert.equal(richer.telephone, '+91 98765 43210');
  assert.equal(richer.email, 'team@example.in');
  const site = websiteJsonLd(BARE);
  assert.equal(site['@type'], 'WebSite');
  assert.equal((site.publisher as Record<string, unknown>)['@id'], org['@id']);
});

test('RealEstateAgent type appears only when a postal address exists', () => {
  const withAddress = { ...BARE, address: { street: '1 Example Road', locality: 'Exampleville', country: 'IN' } };
  assert.equal(organizationJsonLd(withAddress)['@type'], 'RealEstateAgent');
  assert.equal(organizationJsonLd(BARE)['@type'], 'Organization');
});

test('RealEstateListing for every parcel: required fields, no price → no Offer, JSON round-trips', () => {
  for (const p of PARCELS) {
    const ld = listingJsonLd(p, `/og/${p.slug}.jpg`);
    assert.equal(ld['@context'], 'https://schema.org');
    assert.equal(ld['@type'], 'RealEstateListing');
    assert.match(String(ld.url), new RegExp(`/projects/${p.slug}$`));
    assert.equal('offers' in ld, false, 'an Offer must never be emitted without a real price');
    const about = ld.about as Record<string, unknown>;
    assert.equal(about['@type'], 'Place');
    assert.equal((about.additionalProperty as unknown[]).length, 5);
    assert.equal('geo' in about, false);
    assert.deepEqual(JSON.parse(JSON.stringify(ld)), ld);
  }
});

test('Offer + geo are emitted when the client supplies them', () => {
  const base = PARCELS[0]!;
  const priced = { ...base, price: { amountInr: 4500000, display: '₹45 lakh', basis: 'total' as const }, geo: { lat: 12.9, lng: 77.6 } };
  const ld = listingJsonLd(priced, '/og/default.jpg');
  const offer = ld.offers as Record<string, unknown>;
  assert.equal(offer['@type'], 'Offer');
  assert.equal(offer.priceCurrency, 'INR');
  assert.equal(offer.price, 4500000);
  assert.deepEqual((ld.about as Record<string, unknown>).geo, { '@type': 'GeoCoordinates', latitude: 12.9, longitude: 77.6 });
});

test('breadcrumb, collection, FAQ, article, contact page', () => {
  const crumbs = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Plots', path: '/projects' },
  ]);
  const items = crumbs.itemListElement as { position: number; item: string }[];
  assert.deepEqual(items.map((i) => i.position), [1, 2]);
  assert.match(items[1]!.item, /\/projects$/);

  const coll = listingCollectionJsonLd(PARCELS, '/projects', 'Plots');
  const list = coll.mainEntity as { numberOfItems: number; itemListElement: unknown[] };
  assert.equal(list.numberOfItems, 5);
  assert.equal(list.itemListElement.length, 5);

  const guide = GUIDES[0]!;
  const faq = faqJsonLd(guide.faqs);
  assert.equal((faq.mainEntity as unknown[]).length, guide.faqs.length);
  const article = articleJsonLd(guide, '/og/guide.jpg');
  assert.equal(article['@type'], 'Article');
  assert.equal(article.headline, guide.title);
  assert.match(String(article.datePublished), /^\d{4}-\d{2}-\d{2}$/);

  assert.equal('mainEntity' in contactPageJsonLd(BARE), false, 'no ContactPoint without a channel');
  assert.equal('mainEntity' in contactPageJsonLd(FULL), true);
});

test('JsonLd escapes "<" so a string can never close the script element', () => {
  const html = renderToStaticMarkup(createElement(JsonLd, { data: { name: 'x</script><img src=x onerror=alert(1)>' } }));
  assert.ok(!html.includes('</script><img'), html);
  assert.ok(html.includes('\\u003c/script>'));
});

test('metadata: preview builds are noindex; verified live builds are indexable with absolute canonical + 1200×630 OG', () => {
  withEnv({ NEXT_PUBLIC_SITE_URL: 'https://www.example.in', CONTENT_MODE: undefined, FORCE_INDEXABLE: undefined }, () => {
    const m = buildMetadata({ title: 'Plots', description: 'd', path: '/projects' });
    assert.deepEqual(m.robots, { index: false, follow: true });
  });
  withEnv({ NEXT_PUBLIC_SITE_URL: 'https://www.example.in', CONTENT_MODE: 'live' }, () => {
    const m = buildMetadata({ title: 'Plots', description: 'd', path: '/projects', canonicalPath: '/projects' });
    assert.deepEqual(m.robots, { index: true, follow: true });
    assert.equal(m.alternates?.canonical, 'https://www.example.in/projects');
    const og = (m.openGraph?.images as { url: string; width: number; height: number }[])[0]!;
    assert.equal(og.url, 'https://www.example.in/og/default.jpg');
    assert.deepEqual([og.width, og.height], [1200, 630]);
    const filtered = buildMetadata({ title: 'Plots', description: 'd', path: '/projects', noindex: true, canonicalPath: '/projects' });
    assert.deepEqual(filtered.robots, { index: false, follow: true });
  });
});
