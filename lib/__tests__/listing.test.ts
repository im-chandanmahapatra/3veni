import test from 'node:test';
import assert from 'node:assert/strict';
import { PARCELS } from '@/content/parcels';
import {
  DEFAULT_QUERY,
  activeFilterChips,
  filterParcels,
  getFacets,
  getPageSize,
  isFilteredQuery,
  listingHref,
  paginate,
  parseListingQuery,
  sortParcels,
} from '@/lib/listing';
import { adjacentParcels, getFeaturedParcels, getParcelBySlug, similarParcels } from '@/lib/parcels';

test('catalogue integrity: unique ids/slugs/codes and verbatim sample status', () => {
  assert.equal(PARCELS.length, 5);
  assert.equal(new Set(PARCELS.map((p) => p.slug)).size, 5);
  assert.equal(new Set(PARCELS.map((p) => p.code)).size, 5);
  for (const p of PARCELS) {
    assert.equal(p.status, 'sample', `${p.slug} must stay labelled as a sample until the client supplies inventory`);
    assert.equal(p.price, undefined, 'no price may be invented');
    assert.ok(p.gallery.length >= 2 && p.gallery[0]!.alt.length > 10);
    assert.match(p.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('parseListingQuery ignores unknown values and clamps input', () => {
  const q = parseListingQuery(
    { format: 'castle', size: 'huge', terrain: 'moon', sort: 'random', view: 'grid', page: '-3', q: '  valley  ' },
    PARCELS,
  );
  assert.deepEqual({ ...q }, { ...DEFAULT_QUERY, q: 'valley' });
  const good = parseListingQuery({ format: 'corner', size: '3000-5000', terrain: 'wooded-corner', sort: 'size-desc', view: 'plan', page: '2' }, PARCELS);
  assert.equal(good.format, 'corner');
  assert.equal(good.size, '3000-5000');
  assert.equal(good.terrain, 'wooded-corner');
  assert.equal(good.sort, 'size-desc');
  assert.equal(good.view, 'plan');
  assert.equal(good.page, 2);
  assert.equal(parseListingQuery({ format: ['acreage', 'corner'] }, PARCELS).format, 'acreage');
  assert.equal(parseListingQuery({ q: 'x'.repeat(200) }, PARCELS).q?.length, 60);
});

test('listingHref omits defaults and round-trips through parseListingQuery', () => {
  assert.equal(listingHref({}), '/projects');
  assert.equal(listingHref({ ...DEFAULT_QUERY }), '/projects');
  const href = listingHref({ format: 'corner', size: 'gt8000', sort: 'size-asc', view: 'plan', page: 3, q: 'stone' });
  const url = new URL(href, 'https://x.test');
  const back = parseListingQuery(Object.fromEntries(url.searchParams), PARCELS);
  assert.equal(back.format, 'corner');
  assert.equal(back.size, 'gt8000');
  assert.equal(back.sort, 'size-asc');
  assert.equal(back.view, 'plan');
  assert.equal(back.page, 3);
  assert.equal(back.q, 'stone');
});

test('filters combine with AND logic and size bands are half-open', () => {
  const all = filterParcels(PARCELS, DEFAULT_QUERY);
  assert.equal(all.length, 5);
  const corner = filterParcels(PARCELS, { ...DEFAULT_QUERY, format: 'corner' });
  assert.deepEqual(corner.map((p) => p.slug).sort(), ['shila-laterite-crest', 'vatika-banyan-corner']);
  const mid = filterParcels(PARCELS, { ...DEFAULT_QUERY, size: '3000-5000' });
  assert.deepEqual(mid.map((p) => p.areaSqFt).sort((a, b) => a - b), [3600, 4800]);
  const combined = filterParcels(PARCELS, { ...DEFAULT_QUERY, format: 'corner', size: '3000-5000' });
  assert.deepEqual(combined.map((p) => p.slug), ['vatika-banyan-corner']);
  assert.equal(filterParcels(PARCELS, { ...DEFAULT_QUERY, q: 'zzzz' }).length, 0);
  assert.equal(filterParcels(PARCELS, { ...DEFAULT_QUERY, q: 'P-04' })[0]?.slug, 'prana-valley-sanctuary');
  assert.equal(filterParcels(PARCELS, { ...DEFAULT_QUERY, terrain: 'orchard-plot' })[0]?.slug, 'taru-ochre-enclave');
});

test('sorting by size', () => {
  assert.equal(sortParcels(PARCELS, 'size-desc')[0]?.slug, 'prana-valley-sanctuary');
  assert.equal(sortParcels(PARCELS, 'size-asc')[0]?.slug, 'taru-ochre-enclave');
  assert.deepEqual(sortParcels(PARCELS, 'featured').map((p) => p.slug), PARCELS.map((p) => p.slug));
});

test('pagination clamps pages and reports counts', () => {
  const page2 = paginate(PARCELS, 2, 2);
  assert.equal(page2.page, 2);
  assert.equal(page2.pageCount, 3);
  assert.equal(page2.items.length, 2);
  assert.equal(paginate(PARCELS, 99, 2).page, 3);
  assert.equal(paginate(PARCELS, 0, 2).page, 1);
  assert.equal(paginate([], 1, 6).pageCount, 1);
  assert.equal(getPageSize({ LISTING_PAGE_SIZE: "2" } as unknown as NodeJS.ProcessEnv), 2);
  assert.equal(getPageSize({ LISTING_PAGE_SIZE: "abc" } as unknown as NodeJS.ProcessEnv), 6);
});

test('facets and filter chips', () => {
  const f = getFacets(PARCELS);
  assert.deepEqual(f.formats.map((x) => [x.id, x.count]), [['residential', 2], ['corner', 2], ['acreage', 1]]);
  assert.equal(f.terrains.length, 5);
  assert.equal(f.sizes.reduce((n, s) => n + s.count, 0), 5);
  const q = { ...DEFAULT_QUERY, format: 'corner' as const, size: 'lt3000' as const };
  assert.equal(isFilteredQuery(q), true);
  assert.equal(isFilteredQuery({ ...DEFAULT_QUERY, page: 4 }), false, 'page alone is not a filter');
  const chips = activeFilterChips(q, f);
  assert.equal(chips.length, 2);
  assert.equal(chips[0]!.removeHref, '/projects?size=lt3000');
  assert.equal(chips[1]!.removeHref, '/projects?format=corner');
});

test('featured, adjacent and similar parcels', () => {
  assert.equal(getFeaturedParcels().length, 3);
  const aranya = getParcelBySlug('aranya-ridge-terraces')!;
  const adj = adjacentParcels(aranya.slug);
  assert.equal(adj.next?.slug, 'vatika-banyan-corner');
  assert.equal(adj.prev?.slug, 'taru-ochre-enclave', 'wraps around');
  const similar = similarParcels(aranya, 3);
  assert.equal(similar.length, 3);
  assert.ok(!similar.some((p) => p.id === aranya.id));
  assert.equal(similar[0]?.slug, 'taru-ochre-enclave', 'same format (residential) ranks first');
});
