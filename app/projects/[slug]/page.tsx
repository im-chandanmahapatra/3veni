import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Badge from '@/components/ui/Badge';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button, { ActionLink } from '@/components/ui/Button';
import ClientSlot from '@/components/ui/ClientSlot';
import Icon from '@/components/ui/Icon';
import { SpecRows } from '@/components/ui/SpecList';
import EnquiryForm from '@/components/forms/EnquiryForm';
import LocationBlock from '@/components/property/LocationBlock';
import Masterplan, { type PlanParcel } from '@/components/property/Masterplan';
import ParcelCard from '@/components/property/ParcelCard';
import ParcelGallery from '@/components/property/ParcelGallery';
import JsonLd from '@/components/seo/JsonLd';
import { getEnquiryIntegration } from '@/lib/enquiry/config';
import { FORMAT_LABEL, STATUS_LABEL, adjacentParcels, getParcelBySlug, getParcels, parcelSummary, similarParcels } from '@/lib/parcels';
import { breadcrumbJsonLd, listingJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { getSite } from '@/lib/site';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getParcels().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const parcel = getParcelBySlug(slug);
  if (!parcel) return { title: 'Parcel not found', robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${parcel.name} — ${parcel.areaDisplay}`,
    description: `${parcel.shortDescription} (${parcel.dimensions}, ${parcel.facing}).`,
    path: `/projects/${parcel.slug}`,
    image: { path: `/og/${parcel.slug}.jpg`, alt: parcel.gallery[0]!.alt },
  });
}

export default async function ParcelPage({ params }: { params: Params }) {
  const { slug } = await params;
  const parcel = getParcelBySlug(slug);
  if (!parcel) notFound();

  const site = getSite();
  const all = getParcels();
  const similar = similarParcels(parcel, 2);
  const { prev, next } = adjacentParcels(parcel.slug);
  const price = parcel.price?.display ?? 'Price on request';

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
    matches: true,
    image: { src: p.gallery[0]!.src, alt: p.gallery[0]!.alt },
  }));

  return (
    <div className="page-top dossier">
      <JsonLd data={listingJsonLd(parcel, `/og/${parcel.slug}.jpg`)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Plots', path: '/projects' },
          { name: parcel.name, path: `/projects/${parcel.slug}` },
        ])}
      />
      <div className="wrap">
        <header className="dossier-head">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Plots', href: '/projects' }, { name: parcel.name }]} />
          <div className="dossier-head__row">
            <div>
              <p className="t-overline">
                {parcel.code} · {FORMAT_LABEL[parcel.format]}
              </p>
              <h1 className="t-display-lg">{parcel.name}</h1>
              <p className="t-lead dossier-head__loc">
                <Icon name="pin" /> {parcel.locationLabel}
              </p>
            </div>
            <div className="dossier-head__status">
              <Badge>{STATUS_LABEL[parcel.status]}</Badge>
              <p className="t-caption">{parcel.statusNote}</p>
            </div>
          </div>
        </header>

        <div className="dossier-grid">
          <div className="dossier-main">
            <ParcelGallery name={parcel.name} images={parcel.gallery} />

            <section className="detail-block" aria-labelledby="overview-title">
              <h2 id="overview-title" className="t-display-md">
                Parcel overview
              </h2>
              <p className="t-body max-w-[62ch]">{parcel.overview}</p>
              <h3 className="t-overline detail-block__sub">Site &amp; planning highlights</h3>
              <ol className="highlights">
                {parcel.highlights.map((h, i) => (
                  <li key={h}>
                    <span className="t-numeric">{String(i + 1).padStart(2, '0')}</span>
                    <span className="t-body">{h}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="detail-block" aria-labelledby="specs-title">
              <h2 id="specs-title" className="t-display-md">
                Sample parcel specifications
              </h2>
              <SpecRows
                items={[
                  { label: 'Total plot area', value: parcel.areaDisplay },
                  { label: 'Dimensions', value: parcel.dimensions },
                  { label: 'Orientation & sun path', value: parcel.facing },
                  { label: 'Approach access', value: parcel.roadWidth },
                  { label: 'Terrain & topography', value: parcel.topography },
                  { label: 'Format', value: FORMAT_LABEL[parcel.format] },
                  ...(parcel.reraId ? [{ label: 'RERA registration', value: parcel.reraId }] : []),
                  { label: 'Pricing', value: parcel.price ? price : parcel.priceNote },
                ]}
              />
              <p className="notice" role="note">
                <span>
                  <strong>Portfolio Notice:</strong> Specifications presented here are representative sample typologies for architectural and layout
                  evaluation. Verified survey sketches, boundary plans, statutory title records, and phase-specific pricing are shared strictly during
                  formal advisory consultation.
                </span>
              </p>
              {parcel.documents?.length ? (
                <ul className="doc-list">
                  {parcel.documents.map((d) => (
                    <li key={d.href}>
                      <a href={d.href} className="link-action">
                        {d.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <ClientSlot id="documents" />
              )}
            </section>

            <LocationBlock parcel={parcel} />

            <section className="detail-block" aria-labelledby="plan-title">
              <h2 id="plan-title" className="t-display-md">
                Where it sits in the plan
              </h2>
              <Masterplan parcels={planParcels} currentSlug={parcel.slug} mini />
            </section>
          </div>

          <aside className="dossier-aside" aria-label="Enquire about this parcel">
            <div className="dossier-aside__inner" id="enquire-parcel">
              <p className="t-overline">Pricing guidance</p>
              <p className="t-display-md dossier-aside__price">{price}</p>
              {!parcel.price ? <p className="t-caption">{parcel.priceNote}.</p> : null}
              <h2 className="t-title">Request parcel documentation</h2>
              <EnquiryForm
                idPrefix="dossier"
                compact
                interests={[parcel.name]}
                defaultInterest={parcel.name}
                deliveryConfigured={getEnquiryIntegration().configured}
                channels={{ phone: site.phone, whatsapp: site.whatsapp, email: site.email }}
                submitLabel="Request documentation"
              />
              <p className="t-caption">
                Prefer a conversation? <Link href="/contact" className="link-inline">See all contact options</Link>.
              </p>
            </div>
          </aside>
        </div>

        {similar.length ? (
          <section className="section--tight" aria-labelledby="similar-title">
            <div className="detail-block__head">
              <h2 id="similar-title" className="t-display-md">
                Similar sample parcels
              </h2>
              <ActionLink href="/projects">View all plots</ActionLink>
            </div>
            <ul className="listing-grid listing-grid--two">
              {similar.map((p) => (
                <li key={p.id}>
                  <ParcelCard parcel={p} sizes="(min-width: 768px) 45vw, 100vw" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {prev && next ? (
          <nav className="dossier-pager" aria-label="More parcels">
            <Link href={`/projects/${prev.slug}`} rel="prev">
              <Icon name="arrow-left" />
              <span>
                <small className="t-overline">Previous</small>
                {prev.name}
              </span>
            </Link>
            <Link href={`/projects/${next.slug}`} rel="next">
              <span>
                <small className="t-overline">Next</small>
                {next.name}
              </span>
              <Icon name="arrow-right" />
            </Link>
          </nav>
        ) : null}
      </div>

      <div className="dossier-bar">
        <span className="t-label">{parcelSummary(parcel)}</span>
        <Button href="#enquire-parcel" size="md">
          Enquire
        </Button>
      </div>
    </div>
  );
}
