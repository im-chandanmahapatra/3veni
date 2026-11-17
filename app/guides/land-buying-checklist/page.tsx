import Link from 'next/link';
import { ArrowRight, CheckSquare } from 'lucide-react';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd, buildFaqJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';

export const metadata = createPageMetadata({
  title: 'Land Buying Checklist & Plot Due Diligence Guide',
  description:
    'Practical guidance for buyers evaluating plotted residential land: contour drainage, road widths, plot dimensions, boundary demarcation, and statutory verification.',
  path: '/guides/land-buying-checklist',
  type: 'article',
});

const CHECKLIST_SECTIONS = [
  {
    index: '01',
    title: 'Plot Dimensions, Proportions & Setback Usability',
    summary:
      'Total square footage alone does not determine buildability. Examine frontage width relative to plot depth and municipal setback requirements.',
    points: [
      'Measure clear frontage width (for example, 40 ft or 60 ft) so parking, entry landscaping, and natural light corridors fit comfortably.',
      'Compare rectangular proportions (such as 40 × 70 or 60 × 80) against square corner formats (60 × 60) depending on courtyard vs. linear house designs.',
      'Check for irregular corner chamfers or road-widening reservations that reduce net usable footprint.',
    ],
  },
  {
    index: '02',
    title: 'Topography, Soil Profile & Natural Drainage',
    summary:
      'Walk the ground during both dry light and monsoon conditions to verify water flow paths and foundation soil stability.',
    points: [
      'Inspect elevation levels across the parcel relative to adjoining avenues so surface runoff drains outward rather than pooling inside the plot.',
      'Evaluate topsoil vs. firmer strata (such as natural laterite or compacted sub-base) to anticipate foundation depth requirements.',
      'Note mature trees worth preserving within courtyard pockets or perimeter setbacks before finalizing site clearing.',
    ],
  },
  {
    index: '03',
    title: 'Approach Road Width & Corner Access',
    summary:
      'Access widths directly affect daily comfort, utility trenching, emergency vehicle turning radii, and permissible Floor Area Ratio (FAR).',
    points: [
      'Confirm physical constructed width and recorded right-of-way width (30 ft, 36 ft, or 40 ft internal avenues) across the entire approach path.',
      'Verify whether corner plots carry dual road access rules or dual-side setback obligations under local building bylaws.',
      'Confirm provision for underground electrical ducting, water supply lines, and stormwater drains along the avenue.',
    ],
  },
  {
    index: '04',
    title: 'Ownership Chain & Statutory Documentation',
    summary:
      'Before committing capital, insist on verifiable title records, encumbrance checks, and applicable regulatory clearances reviewed by independent legal counsel.',
    points: [
      'Review historical chain of title deeds, mutation records, and non-encumbrance certificates covering the full statutory search period.',
      'Verify conversion/land-use classification for residential construction and inspect sanctioned layout plans where required.',
      'Confirm applicable state real estate registration (RERA where mandated for the project scale) and match survey numbers on ground with physical demarcation pillars.',
    ],
  },
];

const FAQS = [
  {
    question: 'Why does frontage width matter as much as total plot area?',
    answer:
      'Two plots of equal area can behave very differently during house design. A wider frontage allows generous daylighting, dual cross-ventilation, and separate pedestrian and vehicle access without wasting interior circulation space.',
  },
  {
    question: 'What physical checks should I perform during a site visit?',
    answer:
      'Confirm physical corner boundary stones against the survey sketch, check elevation differences relative to the adjoining road crown, observe afternoon wind and sun orientation, and inspect approach road connectivity.',
  },
  {
    question: 'Does 3VENI SPHERE provide legal or financial guarantees in this guide?',
    answer:
      'No. This checklist is an educational buyer reference highlighting standard evaluation questions. Always engage qualified legal and technical surveyors to verify official title deeds and local statutory approvals prior to purchase.',
  },
];

export default function LandBuyingGuidePage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Buyer Guide: Land Buying Checklist', path: '/guides/land-buying-checklist' },
  ]);

  return (
    <article className="pt-28 pb-24 bg-[#F6F1E7] text-[#24221E]">
      <JsonLd data={breadcrumb} />
      <JsonLd data={buildFaqJsonLd(FAQS)} />

      <div className="max-w-[980px] mx-auto px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#98400F] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#24221E] font-medium">Land Buying Checklist</span>
        </nav>

        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-3">
          Buyer Due-Diligence Guide
        </p>
        <h1 className="font-editorial text-[clamp(2.45rem,4.6vw,4.1rem)] leading-[1.03] font-normal tracking-[-0.015em] text-[#24221E] text-balance">
          How to evaluate a plotted residential parcel before acquiring land.
        </h1>
        <p className="mt-5 text-base sm:text-lg text-[#493023] leading-[1.74]">
          Investing with confidence begins with asking disciplined questions about terrain, plot
          geometry, access width, and ownership documentation. Use this structured checklist during
          your site walkthroughs and advisory reviews.
        </p>

        <SphereCrestDivider tone="light" folioLabel="DUE-DILIGENCE CHECKLIST" className="my-12" />

        <div className="space-y-10">
          {CHECKLIST_SECTIONS.map((section) => (
            <section
              key={section.index}
              className="p-7 sm:p-9 bg-[#EDE5D6]/65 border border-[#D8CEBC]"
            >
              <p className="font-mono text-xs font-semibold text-[#98400F] tabular-nums">
                {section.index}.
              </p>
              <h2 className="mt-2 font-editorial text-2xl sm:text-3xl font-medium text-[#24221E]">
                {section.title}
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] text-[#493023] leading-relaxed">
                {section.summary}
              </p>
              <ul className="mt-5 space-y-3 border-t border-[#D8CEBC] pt-5">
                {section.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#24221E] leading-relaxed">
                    <CheckSquare className="w-4 h-4 text-[#41490D] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Frequently Asked Questions */}
        <section className="mt-16 pt-12 border-t border-[#D8CEBC]">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#41490D] mb-3">
            Common Buyer Questions
          </p>
          <h2 className="font-editorial text-3xl font-medium text-[#24221E] mb-8">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-[#D8CEBC] border-t border-b border-[#D8CEBC]">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-6">
                <h3 className="font-editorial text-xl sm:text-2xl font-medium text-[#24221E]">
                  {faq.question}
                </h3>
                <p className="mt-2.5 text-sm sm:text-[15px] text-[#493023] leading-[1.72]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Action Card */}
        <div className="mt-14 p-8 bg-[#24221E] text-[#F6F1E7] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-[#C49A50]">
              Explore Sample Masterplans
            </p>
            <p className="mt-2 font-editorial text-2xl font-medium">
              Inspect plot proportions and contours on our Interactive Plot Map.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
            >
              <span>Browse Projects</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 border border-[#F6F1E7]/45 text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#F6F1E7] hover:text-[#24221E] transition-colors"
            >
              <span>Contact Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
