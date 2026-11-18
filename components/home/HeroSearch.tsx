import { SelectField } from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import { getFacets, SIZE_BANDS } from '@/lib/listing';
import { getParcels } from '@/lib/parcels';

/**
 * Hero search (audit H1): a native GET form to /projects — works without JavaScript and every result is a real,
 * server-rendered, shareable URL. Options come from the same facets as the listing filters (one source of truth).
 */
export default function HeroSearch() {
  const facets = getFacets(getParcels());
  return (
    <form method="get" action="/projects" className="hero-search" aria-label="Find a plot" data-testid="hero-search">
      <SelectField id="hero-format" name="format" label="Format" defaultValue="">
        <option value="">All formats</option>
        {facets.formats.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </SelectField>
      <SelectField id="hero-size" name="size" label="Plot size" defaultValue="">
        <option value="">Any size</option>
        {SIZE_BANDS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </SelectField>
      <SelectField id="hero-terrain" name="terrain" label="Terrain" defaultValue="">
        <option value="">Any terrain</option>
        {facets.terrains.map((t) => (
          <option key={t.slug} value={t.slug}>
            {t.label}
          </option>
        ))}
      </SelectField>
      <Button type="submit" variant="primary" size="lg" icon="arrow-right" className="hero-search__go">
        Find plots
      </Button>
    </form>
  );
}
