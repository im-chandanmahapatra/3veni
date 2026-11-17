import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import FeaturedPlotsSection from '@/components/sections/FeaturedPlotsSection';

export const metadata = createPageMetadata({
  title: 'Projects & Land Plots — Interactive Masterplan',
  description:
    'Browse 3VENI SPHERE sample land plot typologies, filter by parcel format or dimensions, and explore our interactive SVG masterplan.',
  path: '/projects',
});

export default function ProjectsPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Projects & Available Plots', path: '/projects' },
  ]);

  return (
    <div className="pt-20 bg-[#EDE5D6] text-[#24221E]">
      <JsonLd data={breadcrumb} />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] flex items-center gap-2">
          <Link href="/" className="hover:text-[#98400F] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#24221E] font-medium">Projects &amp; Available Plots</span>
        </nav>
      </div>

      <FeaturedPlotsSection sectionNumber="01" showPageLink={false} headingAsH1={true} />

      <section className="py-16 bg-[#F6F1E7] border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#41490D] mb-2">
              Buyer Resource
            </p>
            <h2 className="font-editorial text-3xl font-medium text-[#24221E]">
              Evaluating a plotted parcel? Review our land due-diligence checklist.
            </h2>
            <p className="mt-2 text-sm text-[#493023] leading-relaxed">
              Understand boundary demarcation, road width allowances, natural drainage contour checks,
              and essential statutory questions before acquiring residential land.
            </p>
          </div>
          <Link
            href="/guides/land-buying-checklist"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors shrink-0"
          >
            <span>Open Buyer Guide</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
