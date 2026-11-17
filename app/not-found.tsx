import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { createPageMetadata } from '@/lib/metadata';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Page Not Found',
  description:
    'The page or parcel record requested could not be found on 3VENI SPHERE.',
  path: '/404',
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 bg-[#F6F1E7] text-[#24221E] min-h-[75vh] flex items-center border-b border-[#D8CEBC]">
      <div className="max-w-[920px] mx-auto px-5 sm:px-8 w-full text-center">
        <div className="flex justify-center mb-6" aria-hidden="true">
          <svg width="76" height="76" viewBox="0 0 76 76" fill="none">
            <circle cx="38" cy="38" r="35" stroke="#C49A50" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="38" cy="38" r="24" stroke="#98400F" strokeWidth="1" strokeOpacity="0.6" />
            <path d="M38 16 L43 38 L38 34 L33 38 Z" fill="#98400F" />
            <path d="M38 60 L42 38 L38 42 L34 38 Z" fill="#BFAE96" />
          </svg>
        </div>

        <p className="font-mono text-xs font-semibold tracking-[0.2em] uppercase text-[#98400F]">
          HTTP 404 · Unmapped Parcel
        </p>

        <h1 className="mt-4 font-editorial text-[clamp(2.6rem,5.2vw,4.5rem)] leading-[1.02] font-normal tracking-[-0.015em] text-[#24221E] text-balance">
          This terrain coordinate does not exist.
        </h1>

        <p className="mt-5 text-base text-[#493023] max-w-lg mx-auto leading-relaxed">
          The page or parcel route you requested may have moved, been renamed, or is outside our
          active directory. Return to the main site or browse all curated plots below.
        </p>

        <SphereCrestDivider tone="light" folioLabel="UNMAPPED ROUTE" className="my-10 max-w-md mx-auto" />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#7A310A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F]"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24221E]"
          >
            <span>Browse Projects</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
