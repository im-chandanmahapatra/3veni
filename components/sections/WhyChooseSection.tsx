import { FolkBandPattern, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';
import GsapStaggerGroup from '@/components/motion/GsapStaggerGroup';

const PILLARS = [
  {
    index: '01',
    title: 'Thoughtful Property Selection',
    description:
      'Every parcel is evaluated for natural drainage, contour geometry, sunlight exposure, and long-term neighborhood coherence before presentation.',
  },
  {
    index: '02',
    title: 'Clear Property Information',
    description:
      'Straightforward dimensions, frontage orientation, and boundary clarity—presented without obscured fine print or inflated claims.',
  },
  {
    index: '03',
    title: 'Customer-Focused Advisory',
    description:
      'Guided one-on-one site walkthroughs and responsive advisory designed around your family timeline rather than high-pressure sales.',
  },
  {
    index: '04',
    title: 'A Considered Ownership Horizon',
    description:
      'Rooted in our guiding ethos—Invest With Confidence—helping you hold tangible land today with clarity for what comes next.',
  },
];

export default function WhyChooseSection() {
  return (
    <section
      id="why-3veni"
      className="relative bg-[#41490D] text-[#F6F1E7] border-b border-[#343B0A]"
    >
      <FolkBandPattern color="#C49A50" opacity={0.26} />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-24 lg:py-32">
        <SphereCrestDivider
          tone="olive"
          folioLabel="CHAPTER 04 · DISCIPLINE"
          className="mb-14"
        />

        <EditorialReveal className="max-w-2xl mb-16">
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#C49A50] mb-3">
            04. The 3VENI SPHERE Philosophy
          </p>
          <EditorialHeadingReveal
            as="h2"
            segments={[{ text: 'Quiet diligence before every decision.' }]}
            className="font-editorial text-[clamp(2.25rem,3.9vw,3.55rem)] leading-[1.04] font-normal tracking-[-0.015em] text-[#F6F1E7] text-balance"
          />
        </EditorialReveal>

        <GsapStaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.index}
              data-gsap-stagger
              className="md:pr-8 lg:px-7 lg:first:pl-0 lg:last:pr-0 lg:border-r lg:border-[#C49A50]/25 last:border-r-0 flex flex-col justify-between"
            >
              <div>
                <div data-gsap-rule className="h-[1px] w-full bg-[#C49A50]/40 mb-6" />
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-[1px] bg-[#C49A50]" aria-hidden="true" />
                  <span className="font-mono text-xs font-medium text-[#C49A50] tabular-nums tracking-widest">
                    {pillar.index}.
                  </span>
                </div>
                <h3 className="mt-4 font-editorial text-2xl sm:text-[26px] font-medium text-[#F6F1E7] leading-snug">
                  {pillar.title}
                </h3>
              </div>
              <p className="mt-5 text-sm leading-[1.76] text-[#E6EAD3]">{pillar.description}</p>
            </div>
          ))}
        </GsapStaggerGroup>
      </div>

      <FolkBandPattern color="#C49A50" opacity={0.22} />
    </section>
  );
}
