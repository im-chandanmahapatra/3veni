import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FUTURE_HOMES } from '@/data/properties';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Future Homes Collection — Coming Soon',
  description:
    'Explore architectural home concepts envisioned for future 3VENI SPHERE residential phases—built around rammed earth, stone masonry, and shaded verandahs.',
  path: '/future-homes',
});

export default function FutureHomesPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Future Homes', path: '/future-homes' },
  ]);

  return (
    <div className="pt-20 bg-[#F6F1E7] text-[#24221E]">
      <JsonLd data={breadcrumb} />

      <section className="py-14 lg:py-20 border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#98400F] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#24221E] font-medium">Future Homes</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#41490D] mb-3">
                Future Collection · Coming Soon
              </p>
              <h1 className="font-editorial text-[clamp(2.45rem,4.6vw,4.25rem)] leading-[1.03] font-normal tracking-[-0.015em] text-balance">
                Architectural residences envisioned for future phases.
              </h1>
            </div>

            <div className="max-w-md bg-[#EDE5D6] border border-[#D8CEBC] px-5 py-4 text-xs sm:text-sm text-[#493023] leading-relaxed">
              <strong className="text-[#24221E] uppercase tracking-wider">Concept Preview:</strong>{' '}
              3VENI SPHERE currently focuses on residential plotted land. The studies below reflect
              future architectural direction and are <strong>not open for purchase or booking</strong>.
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-[#EDE5D6] border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <SphereCrestDivider tone="light" folioLabel="CONCEPT ARCHITECTURAL STUDIES" className="mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FUTURE_HOMES.map((home) => (
              <article
                key={home.id}
                className="bg-[#F6F1E7] border border-[#D8CEBC] flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#24221E]">
                    <Image
                      src={home.image}
                      alt={home.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 32vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#41490D]">
                      {home.conceptStatus}
                    </p>
                    <h2 className="mt-2 font-editorial text-2xl font-medium text-[#24221E]">
                      {home.title}
                    </h2>
                    <p className="mt-1 text-xs text-[#98400F] font-medium">
                      {home.typology} · {home.indicativeFootprint}
                    </p>
                    <p className="mt-4 text-sm text-[#493023] leading-relaxed">{home.summary}</p>
                    <p className="mt-3 text-xs text-[#5E554B] leading-relaxed">
                      Materials: {home.materialPalette.join(' · ')}
                    </p>
                  </div>
                </div>
                <div className="px-7 pb-7 pt-4 border-t border-[#D8CEBC]">
                  <Link
                    href={`/contact?interest=${encodeURIComponent(`${home.title} (Future Updates)`)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors"
                  >
                    <span>Register for Future Updates</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
