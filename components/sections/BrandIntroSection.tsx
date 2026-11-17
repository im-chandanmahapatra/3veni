import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';
import GsapStaggerGroup from '@/components/motion/GsapStaggerGroup';

const BRAND_TENETS = [
  {
    index: '01',
    title: 'Contour-Led Selection',
    detail:
      'Natural drainage, elevation sightlines, and native shade canopy evaluated before any boundary line is proposed.',
  },
  {
    index: '02',
    title: 'Uncluttered Clarity',
    detail:
      'Straightforward dimensions, frontage widths, and factual disclosures communicated cleanly from first enquiry.',
  },
  {
    index: '03',
    title: 'Land Today, Form Tomorrow',
    detail:
      'Hold open, well-sited earth immediately while exploring architectural possibilities at your family pace.',
  },
];

export default function BrandIntroSection() {
  return (
    <section
      id="brand-intro"
      className="bg-[#F6F1E7] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#98400F]">
              Folio · Brand Ethos
            </p>
            <p className="font-devanagari text-sm text-[#41490D]">
              धरा की गरिमा · स्पष्ट स्वामित्व
            </p>
            <div className="pt-4 hidden lg:block">
              <span aria-hidden="true" className="block w-16 h-[1px] bg-[#C49A50]/65" />
            </div>
          </div>

          <div className="lg:col-span-8">
            <EditorialHeadingReveal
              as="h2"
              segments={[
                { text: 'We treat residential land not as a commodity to be crowded, but as' },
                { text: 'quiet ground', italic: true, className: 'text-[#98400F]' },
                { text: 'worthy of patient architecture.' },
              ]}
              className="font-editorial text-[clamp(2.15rem,4.1vw,3.65rem)] leading-[1.06] font-normal tracking-[-0.015em] text-[#24221E] text-balance"
            />
            <p className="mt-6 text-[15px] sm:text-base leading-[1.78] text-[#493023] max-w-2xl">
              Grounded in the heritage craft of our circular emblem, 3VENI SPHERE pairs disciplined
              site evaluation with calm, transparent guidance—so buyers invest with clarity and
              long-term confidence.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/about"
                className="editorial-link text-xs font-semibold tracking-[0.14em] uppercase text-[#98400F] hover:text-[#7A310A] transition-colors"
              >
                <span>Read Our Stewardship Philosophy</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <Link
                href="/guides/land-buying-checklist"
                className="editorial-link text-xs font-semibold tracking-[0.14em] uppercase text-[#41490D] hover:text-[#98400F] transition-colors"
              >
                <span>Land Buying Checklist</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </EditorialReveal>

        <GsapStaggerGroup className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {BRAND_TENETS.map((item, idx) => (
            <div key={item.index} data-gsap-stagger>
              <div data-gsap-rule className="h-[1px] w-full bg-[#C8BCA9] mb-6" />
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`w-3.5 h-[1px] ${
                    idx % 2 === 0 ? 'bg-[#98400F]' : 'bg-[#41490D]'
                  }`}
                />
                <p className="font-mono text-xs text-[#98400F] font-medium tabular-nums tracking-widest">
                  {item.index}.
                </p>
              </div>
              <h3 className="mt-3 font-editorial text-2xl sm:text-[26px] font-medium text-[#24221E]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.75] text-[#5E554B]">{item.detail}</p>
            </div>
          ))}
        </GsapStaggerGroup>
      </div>
    </section>
  );
}
