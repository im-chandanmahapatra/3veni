import Breadcrumb from '@/components/ui/Breadcrumb';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Media from '@/components/ui/Media';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/seo/JsonLd';
import { FUTURE_NOTE } from '@/content/copy';
import { RESIDENCES } from '@/content/residences';
import { FUTURE_UPDATE_SUFFIX } from '@/lib/interests';
import { breadcrumbJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Future Homes Collection — Coming Soon',
  description:
    'Explore architectural home concepts envisioned for future 3VENI SPHERE residential phases—built around rammed earth, stone masonry, and shaded verandahs.',
  path: '/future-homes',
  image: { path: '/og/future-homes.jpg', alt: 'Rammed earth and teak courtyard residence concept at golden hour' },
});

export default function FutureHomesPage() {
  return (
    <div className="page-top">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Future Homes', path: '/future-homes' },
        ])}
      />
      <div className="wrap">
        <header className="listing-head">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Future homes' }]} />
          <p className="t-overline">{FUTURE_NOTE.eyebrow}</p>
          <h1 className="t-display-lg">{FUTURE_NOTE.heading}</h1>
          <p className="notice notice--preview future-note" role="note">
            <span>
              <strong>{FUTURE_NOTE.strong}</strong> {FUTURE_NOTE.body} <strong>{FUTURE_NOTE.emphasis}</strong> or booking.
            </span>
          </p>
        </header>

        <ol className="concepts">
          {RESIDENCES.map((r, i) => (
            <li key={r.id} className="concept">
              <Reveal className="concept__media">
                <Media src={r.image.src} alt={r.image.alt} ratio="4/5" sizes="(min-width: 1024px) 45vw, 100vw" preload={i === 0} />
              </Reveal>
              <Reveal className="concept__body">
                <Badge tone="night">Concept — not for sale</Badge>
                <p className="t-overline">{r.statusLabel}</p>
                <h2 className="t-display-md">{r.title}</h2>
                <p className="t-caption">
                  {r.typology} · {r.footprint}
                </p>
                <p className="t-body">{r.summary}</p>
                <p className="t-body-sm">{r.note}</p>
                <p className="t-caption">Materials: {r.materials.join(' · ')}</p>
                <Button href={`/contact?interest=${encodeURIComponent(`${r.title}${FUTURE_UPDATE_SUFFIX}`)}`} variant="secondary">
                  Register for future updates
                </Button>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
      <div className="section--tight" />
    </div>
  );
}
