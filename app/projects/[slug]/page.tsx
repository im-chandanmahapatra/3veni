import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, MapPin, Ruler } from 'lucide-react';
import { LAND_PLOTS, getPlotBySlug } from '@/data/properties';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd, buildLandPlotJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import { CompassOrientationGlyph, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import PlotDossierGallery from '@/components/property/PlotDossierGallery';

export function generateStaticParams() {
  return LAND_PLOTS.map((plot) => ({ slug: plot.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plot = getPlotBySlug(slug);
  if (!plot) {
    return createPageMetadata({
      title: 'Parcel Not Found',
      description: 'The requested land parcel record does not exist.',
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: `${plot.name} — ${plot.areaDisplay}`,
    description: `${plot.shortDescription} (${plot.dimensions}, ${plot.facing}).`,
    path: `/projects/${plot.slug}`,
    image: plot.image,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plot = getPlotBySlug(slug);

  if (!plot) {
    notFound();
  }

  const gallery =
    plot.galleryImages.length > 0
      ? plot.galleryImages
      : [{ src: plot.image, alt: plot.imageAlt, caption: plot.topography }];

  const relatedPlots = LAND_PLOTS.filter((item) => item.id !== plot.id).slice(0, 2);

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: plot.name, path: `/projects/${plot.slug}` },
  ]);

  return (
    <div className="pt-20 bg-[#F6F1E7] text-[#24221E]">
      <JsonLd data={breadcrumb} />
      <JsonLd data={buildLandPlotJsonLd(plot)} />

      <section className="py-12 lg:py-16 border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="text-xs text-[#5E554B] mb-6 flex flex-wrap items-center gap-2"
          >
            <Link href="/" className="hover:text-[#98400F] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/projects" className="hover:text-[#98400F] transition-colors">
              Projects
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#24221E] font-medium">{plot.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[#98400F] mb-3">
                <span>{plot.category}</span>
                <span aria-hidden="true" className="text-[#C49A50]">
                  ·
                </span>
                <span className="text-[#41490D]">{plot.availability}</span>
              </div>
              <h1 className="font-editorial text-[clamp(2.5rem,4.7vw,4.35rem)] leading-[1.02] font-normal tracking-[-0.015em] text-[#24221E]">
                {plot.name}
              </h1>
              <p className="mt-2.5 text-sm text-[#5E554B] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#98400F]" aria-hidden="true" />
                <span>{plot.location}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#D8CEBC] text-xs font-semibold tracking-[0.1em] uppercase text-[#24221E] hover:border-[#24221E] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                <span>All Projects</span>
              </Link>
              <Link
                href={`/contact?interest=${encodeURIComponent(plot.name)}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
              >
                <span>Enquire About This Plot</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Visual Dossier + Overview */}
      <section className="py-14 lg:py-20 bg-[#EDE5D6] border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <PlotDossierGallery plotName={plot.name} images={gallery} />
          </div>

          <div className="lg:col-span-5 bg-[#F6F1E7] border border-[#D8CEBC] p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[#24221E]">
                Parcel Overview
              </h2>
              <p className="mt-4 text-sm sm:text-[15px] leading-[1.75] text-[#493023]">
                {plot.editorialOverview}
              </p>

              <div className="mt-8 pt-6 border-t border-[#D8CEBC]">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#41490D] mb-4">
                  Site &amp; Planning Highlights
                </h3>
                <ul className="space-y-3">
                  {plot.siteHighlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#493023] leading-relaxed pb-3 border-b border-[#EDE5D6] last:border-b-0"
                    >
                      <span className="font-mono text-xs text-[#98400F] mr-2.5">0{idx + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#D8CEBC]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#5E554B]">
                Pricing Guidance
              </p>
              <p className="mt-1 font-editorial text-2xl font-medium text-[#24221E]">
                {plot.priceDisplay}
              </p>
              <Link
                href={`/contact?interest=${encodeURIComponent(plot.name)}`}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
              >
                <span>Request Parcel Documentation</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <SphereCrestDivider tone="light" className="mb-12" />

          <h2 className="font-editorial text-3xl sm:text-4xl font-medium text-[#24221E] mb-8">
            Sample Parcel Specifications
          </h2>

          <dl className="grid grid-cols-1 md:grid-cols-3 border-t border-[#D8CEBC]">
            <div className="py-6 pr-6 border-b border-[#D8CEBC]">
              <dt className="text-xs text-[#5E554B] flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-[#98400F]" aria-hidden="true" />
                <span>Total Plot Area</span>
              </dt>
              <dd className="mt-2 font-mono text-lg font-medium text-[#24221E] tabular-nums">
                {plot.areaDisplay}
              </dd>
            </div>
            <div className="py-6 md:px-6 border-b border-[#D8CEBC]">
              <dt className="text-xs text-[#5E554B]">Dimensions</dt>
              <dd className="mt-2 font-mono text-lg font-medium text-[#24221E] tabular-nums">
                {plot.dimensions}
              </dd>
            </div>
            <div className="py-6 md:pl-6 border-b border-[#D8CEBC]">
              <dt className="text-xs text-[#5E554B] mb-2">Orientation &amp; Sun Path</dt>
              <dd>
                <CompassOrientationGlyph facing={plot.facing} />
              </dd>
            </div>
            <div className="py-6 pr-6 border-b border-[#D8CEBC]">
              <dt className="text-xs text-[#5E554B]">Approach Access</dt>
              <dd className="mt-2 text-base font-medium text-[#24221E]">{plot.roadWidth}</dd>
            </div>
            <div className="py-6 md:px-6 md:col-span-2 border-b border-[#D8CEBC]">
              <dt className="text-xs text-[#5E554B]">Terrain &amp; Topography</dt>
              <dd className="mt-2 text-base font-medium text-[#24221E]">{plot.topography}</dd>
            </div>
          </dl>

          <p className="mt-8 p-5 bg-[#EDE5D6] border border-[#D8CEBC] text-xs text-[#5E554B] leading-relaxed max-w-3xl">
            <strong>Portfolio Notice:</strong> Specifications presented here are representative sample
            typologies for architectural and layout evaluation. Verified survey sketches, boundary
            plans, statutory title records, and phase-specific pricing are shared strictly during
            formal advisory consultation.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#EDE5D6] border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <h2 className="font-editorial text-3xl font-medium text-[#24221E]">
              Other Sample Parcels
            </h2>
            <Link
              href="/projects"
              className="editorial-link text-xs font-semibold tracking-[0.12em] uppercase text-[#98400F]"
            >
              <span>View Full Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPlots.map((item) => (
              <article
                key={item.id}
                className="plot-card group bg-[#F6F1E7] border border-[#D8CEBC] hover:border-[#98400F]/65 flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE5D6]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 48vw"
                    className="object-cover plot-card-image"
                  />
                </div>
                <div className="p-7 flex flex-col justify-between flex-1">
                  <div>
                    <p className="text-xs font-medium text-[#98400F]">
                      {item.category} · {item.areaDisplay}
                    </p>
                    <h3 className="mt-2 font-editorial text-2xl font-medium text-[#24221E]">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-[#493023]">{item.shortDescription}</p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/projects/${item.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#24221E] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#98400F] transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
