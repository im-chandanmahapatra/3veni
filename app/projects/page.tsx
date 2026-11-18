import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button, { ActionLink } from '@/components/ui/Button';
import { SelectField, TextField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import FiltersPanel from '@/components/property/FiltersPanel';
import Masterplan, { type PlanParcel } from '@/components/property/Masterplan';
import Pagination from '@/components/property/Pagination';
import ParcelCard from '@/components/property/ParcelCard';
import JsonLd from '@/components/seo/JsonLd';
import {
  SIZE_BANDS,
  SORTS,
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
import { FORMAT_LABEL, STATUS_LABEL, getParcels } from '@/lib/parcels';
import { breadcrumbJsonLd, listingCollectionJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const TITLE = 'Land plots — residential, corner & estate parcels';
const DESCRIPTION =
  'Browse 3VENI SPHERE sample land plot typologies, filter by format, size or terrain, and open each parcel dossier or the schematic masterplan.';

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const parcels = getParcels();
  const query = parseListingQuery(await searchParams, parcels);
  const filtered = isFilteredQuery(query);
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: '/projects',
    // filtered / sorted / plan URLs are noindex + canonical to the base listing; pagination is self-canonical
    canonicalPath: filtered ? '/projects' : listingHref({ page: query.page }),
    noindex: filtered,
    image: { path: '/og/projects.jpg', alt: 'Terraced residential land plots along a tree-lined stone avenue' },
  });
}

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const all = getParcels();
  const query = parseListingQuery(await searchParams, all);
  const facets = getFacets(all);
  const matching = sortParcels(filterParcels(all, query), query.sort);
  const pagination = paginate(matching, query.page, getPageSize());
  const chips = activeFilterChips(query, facets);
  const filtered = isFilteredQuery(query);
  const matchingSlugs = new Set(matching.map((p) => p.slug));

  const planParcels: PlanParcel[] = all.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    areaDisplay: p.areaDisplay,
    dimensions: p.dimensions,
    facing: p.facing,
    formatLabel: FORMAT_LABEL[p.format],
    terrain: p.terrain,
    statusLabel: STATUS_LABEL[p.status],
    elevationNote: p.plan.elevationNote,
    points: p.plan.points,
    labelX: p.plan.labelX,
    labelY: p.plan.labelY,
    matches: matchingSlugs.has(p.slug),
    image: { src: p.gallery[0]!.src, alt: p.gallery[0]!.alt },
  }));

  return (
    <div className="page-top">
      {!filtered ? <JsonLd data={listingCollectionJsonLd(all, '/projects', 'Land plots')} /> : null}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Plots', path: '/projects' },
        ])}
      />
      <div className="wrap">
        <header className="listing-head">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Plots' }]} />
          <p className="t-overline">Residential land plots</p>
          <h1 className="t-display-lg">Curated land parcels prepared for generational ownership.</h1>
          <p className="t-lead max-w-[56ch]">
            Explore sample parcel typologies across contour grades, dimensions, and road frontages. Select any parcel on the
            masterplan or card grid to inspect full site specifications.
          </p>
        </header>

        <div className="listing-toolbar">
          <FiltersPanel activeCount={chips.length}>
            <form method="get" action="/projects" className="filters-form" aria-label="Filter plots" data-testid="listing-filters">
              <TextField id="f-q" name="q" type="search" label="Search" placeholder="Name, code or terrain" defaultValue={query.q ?? ''} />
              <SelectField id="f-format" name="format" label="Format" defaultValue={query.format ?? ''}>
                <option value="">All formats</option>
                {facets.formats.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label} ({f.count})
                  </option>
                ))}
              </SelectField>
              <SelectField id="f-size" name="size" label="Plot size" defaultValue={query.size ?? ''}>
                <option value="">Any size</option>
                {SIZE_BANDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </SelectField>
              <SelectField id="f-terrain" name="terrain" label="Terrain" defaultValue={query.terrain ?? ''}>
                <option value="">Any terrain</option>
                {facets.terrains.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.label} ({t.count})
                  </option>
                ))}
              </SelectField>
              <SelectField id="f-sort" name="sort" label="Sort" defaultValue={query.sort}>
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </SelectField>
              {query.view === 'plan' ? <input type="hidden" name="view" value="plan" /> : null}
              <Button type="submit" variant="secondary" icon={null}>
                Apply
              </Button>
            </form>
          </FiltersPanel>

          <div className="listing-meta">
            <div className="listing-meta__chips">
              <p role="status" aria-live="polite" className="t-label" data-testid="listing-count">
                {matching.length} {matching.length === 1 ? 'plot' : 'plots'}
                {filtered ? ` of ${all.length}` : ''}
              </p>
              {chips.map((c) => (
                <Link key={c.key} href={c.removeHref} className="chip" aria-label={`Remove filter ${c.label}`}>
                  <span>{c.label}</span>
                  <Icon name="close" />
                </Link>
              ))}
              {filtered ? (
                <ActionLink href="/projects" icon={null}>
                  Clear all
                </ActionLink>
              ) : null}
            </div>
            <div className="view-toggle" role="group" aria-label="View">
              <Link href={listingHref({ ...query, view: 'list', page: 1 })} aria-current={query.view === 'list' ? 'true' : undefined}>
                List
              </Link>
              <Link href={listingHref({ ...query, view: 'plan', page: 1 })} aria-current={query.view === 'plan' ? 'true' : undefined}>
                Plan
              </Link>
            </div>
          </div>
        </div>

        {query.view === 'plan' ? (
          <div className="listing-plan">
            <Masterplan parcels={planParcels} />
          </div>
        ) : null}

        <div className="section--tight">
          {pagination.items.length === 0 ? (
            <div className="empty-state" data-testid="listing-empty">
              <h2 className="t-display-md">No plots match these filters.</h2>
              <p className="t-body max-w-[52ch]">Remove a filter to see more, or tell us what you are looking for and we will prepare a recommendation.</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="/projects" variant="secondary" icon={null}>
                  Clear all filters
                </Button>
                <ActionLink href="/contact">Tell us what you are looking for</ActionLink>
              </div>
            </div>
          ) : (
            <ul className="listing-grid">
              {pagination.items.map((p, i) => (
                <li key={p.id}>
                  <ParcelCard parcel={p} as="h2" preload={i === 0} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          )}
          <Pagination query={query} page={pagination.page} pageCount={pagination.pageCount} />
        </div>
      </div>
      <div className="section--tight" />
    </div>
  );
}
