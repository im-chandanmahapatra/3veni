import type { Parcel, ParcelFormat } from '@/types/parcel';
import { FORMAT_LABEL, FORMAT_ORDER } from '@/lib/parcels';

/**
 * Listing query model (audit H1): every filter lives in the URL, so results are shareable, crawlable and
 * server-rendered. One source of truth for filter options (the hero search and the listing filters both use it).
 */
export const SIZE_BANDS = [
  { id: 'lt3000', label: 'Up to 3,000 sq. ft.', min: 0, max: 3000 },
  { id: '3000-5000', label: '3,000 – 5,000 sq. ft.', min: 3000, max: 5000 },
  { id: '5000-8000', label: '5,000 – 8,000 sq. ft.', min: 5000, max: 8000 },
  { id: 'gt8000', label: 'Over 8,000 sq. ft.', min: 8000, max: Number.POSITIVE_INFINITY },
] as const;
export type SizeBandId = (typeof SIZE_BANDS)[number]['id'];

export const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'size-desc', label: 'Largest first' },
  { id: 'size-asc', label: 'Smallest first' },
] as const;
export type SortId = (typeof SORTS)[number]['id'];

export type ListingView = 'list' | 'plan';

export interface ListingQuery {
  format?: ParcelFormat;
  size?: SizeBandId;
  /** terrain slug, e.g. "highland-terrace" */
  terrain?: string;
  q?: string;
  sort: SortId;
  view: ListingView;
  page: number;
}

export const DEFAULT_QUERY: ListingQuery = { sort: 'featured', view: 'list', page: 1 };

export const DEFAULT_PAGE_SIZE = 6;
export function getPageSize(env: NodeJS.ProcessEnv = process.env): number {
  const n = Number(env.LISTING_PAGE_SIZE);
  return Number.isInteger(n) && n >= 1 && n <= 48 ? n : DEFAULT_PAGE_SIZE;
}

type RawParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Whitelist-parse `searchParams`; unknown or invalid values are ignored (never trusted, never echoed). */
export function parseListingQuery(raw: RawParams, parcels: readonly Parcel[]): ListingQuery {
  const query: ListingQuery = { ...DEFAULT_QUERY };

  const format = first(raw.format);
  if (format && (FORMAT_ORDER as readonly string[]).includes(format)) query.format = format as ParcelFormat;

  const size = first(raw.size);
  if (size && SIZE_BANDS.some((b) => b.id === size)) query.size = size as SizeBandId;

  const terrain = first(raw.terrain);
  if (terrain && parcels.some((p) => p.terrainSlug === terrain)) query.terrain = terrain;

  const q = (first(raw.q) ?? '').trim().slice(0, 60);
  if (q) query.q = q;

  const sort = first(raw.sort);
  if (sort && SORTS.some((s) => s.id === sort)) query.sort = sort as SortId;

  if (first(raw.view) === 'plan') query.view = 'plan';

  const page = Number.parseInt(first(raw.page) ?? '1', 10);
  if (Number.isInteger(page) && page >= 1 && page <= 999) query.page = page;

  return query;
}

/** Build a listing URL from a query, omitting defaults so URLs stay short and canonical. */
export function listingHref(query: Partial<ListingQuery>, base = '/projects'): string {
  const params = new URLSearchParams();
  if (query.format) params.set('format', query.format);
  if (query.size) params.set('size', query.size);
  if (query.terrain) params.set('terrain', query.terrain);
  if (query.q) params.set('q', query.q);
  if (query.sort && query.sort !== DEFAULT_QUERY.sort) params.set('sort', query.sort);
  if (query.view && query.view !== DEFAULT_QUERY.view) params.set('view', query.view);
  if (query.page && query.page > 1) params.set('page', String(query.page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

/** True when any filter / sort / view differs from the default (such URLs are noindex + canonical to the base). */
export function isFilteredQuery(query: ListingQuery): boolean {
  return Boolean(query.format || query.size || query.terrain || query.q) || query.sort !== 'featured' || query.view !== 'list';
}

export function filterParcels(parcels: readonly Parcel[], query: ListingQuery): Parcel[] {
  const band = query.size ? SIZE_BANDS.find((b) => b.id === query.size) : undefined;
  const needle = query.q?.toLowerCase();
  return parcels.filter((p) => {
    if (query.format && p.format !== query.format) return false;
    if (band && !(p.areaSqFt >= band.min && p.areaSqFt < band.max)) return false;
    if (query.terrain && p.terrainSlug !== query.terrain) return false;
    if (needle) {
      const haystack = [p.name, p.code, p.locationLabel, p.terrain, FORMAT_LABEL[p.format], p.shortDescription, p.facing]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

export function sortParcels(parcels: readonly Parcel[], sort: SortId): Parcel[] {
  const list = [...parcels];
  if (sort === 'size-desc') list.sort((a, b) => b.areaSqFt - a.areaSqFt);
  else if (sort === 'size-asc') list.sort((a, b) => a.areaSqFt - b.areaSqFt);
  return list;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const start = (current - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page: current, pageCount, total: items.length, pageSize };
}

export interface Facets {
  formats: { id: ParcelFormat; label: string; count: number }[];
  terrains: { slug: string; label: string; count: number }[];
  sizes: { id: SizeBandId; label: string; count: number }[];
}

export function getFacets(parcels: readonly Parcel[]): Facets {
  const terrainMap = new Map<string, { slug: string; label: string; count: number }>();
  for (const p of parcels) {
    const t = terrainMap.get(p.terrainSlug) ?? { slug: p.terrainSlug, label: p.terrain, count: 0 };
    t.count += 1;
    terrainMap.set(p.terrainSlug, t);
  }
  return {
    formats: FORMAT_ORDER.map((id) => ({ id, label: FORMAT_LABEL[id], count: parcels.filter((p) => p.format === id).length })).filter(
      (f) => f.count > 0,
    ),
    terrains: [...terrainMap.values()].sort((a, b) => a.label.localeCompare(b.label)),
    sizes: SIZE_BANDS.map((b) => ({
      id: b.id,
      label: b.label,
      count: parcels.filter((p) => p.areaSqFt >= b.min && p.areaSqFt < b.max).length,
    })).filter((s) => s.count > 0),
  };
}

export interface FilterChip {
  key: 'format' | 'size' | 'terrain' | 'q';
  label: string;
  /** URL of the listing with this single filter removed */
  removeHref: string;
}

export function activeFilterChips(query: ListingQuery, facets: Facets): FilterChip[] {
  const chips: FilterChip[] = [];
  const without = (key: FilterChip['key']): string => listingHref({ ...query, [key]: undefined, page: 1 });
  if (query.format) chips.push({ key: 'format', label: `Format: ${FORMAT_LABEL[query.format]}`, removeHref: without('format') });
  if (query.size) {
    const label = facets.sizes.find((s) => s.id === query.size)?.label ?? SIZE_BANDS.find((b) => b.id === query.size)?.label ?? '';
    chips.push({ key: 'size', label: `Size: ${label}`, removeHref: without('size') });
  }
  if (query.terrain) {
    const label = facets.terrains.find((t) => t.slug === query.terrain)?.label ?? query.terrain;
    chips.push({ key: 'terrain', label: `Terrain: ${label}`, removeHref: without('terrain') });
  }
  if (query.q) chips.push({ key: 'q', label: `Search: “${query.q}”`, removeHref: without('q') });
  return chips;
}
