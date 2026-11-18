import Link from 'next/link';
import Button, { ActionLink } from '@/components/ui/Button';
import { TextField } from '@/components/ui/Field';
import { getParcels } from '@/lib/parcels';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

/** 404 (plan B16): says what happened, offers search, the plots and the contact desk — never a dead end. */
export default function NotFound() {
  const parcels = getParcels().slice(0, 3);
  return (
    <section className="page-top not-found">
      <div className="wrap wrap--narrow">
        <p className="t-overline">Error 404</p>
        <h1 className="t-display-xl">This page is not on our map.</h1>
        <p className="t-lead">
          The page or parcel you asked for may have moved, been renamed, or never existed. Search the plots, or choose one of the places below.
        </p>

        <form method="get" action="/projects" className="not-found__search" role="search" aria-label="Search plots">
          <TextField id="nf-q" name="q" type="search" label="Search plots" placeholder="Name, code or terrain" />
          <Button type="submit" variant="secondary" icon={null}>
            Search
          </Button>
        </form>

        <div className="not-found__links">
          <div>
            <h2 className="t-overline">Popular plots</h2>
            <ul>
              {parcels.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.slug}`} className="link-inline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-overline">Elsewhere</h2>
            <ul>
              <li>
                <Link href="/guides/land-buying-checklist" className="link-inline">
                  Buyer due-diligence guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="link-inline">
                  About 3VENI SPHERE
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-inline">
                  Contact the advisory desk
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="not-found__actions">
          <Button href="/">Back to home</Button>
          <ActionLink href="/projects">Browse all plots</ActionLink>
        </div>
      </div>
      <div className="section--tight" />
    </section>
  );
}
