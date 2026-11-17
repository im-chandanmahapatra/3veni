'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { FUTURE_HOMES } from '@/data/properties';
import { QuadrantWatermarkCorner, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import EditorialCarousel from '@/components/ui/EditorialCarousel';
import type { EditorialSlide } from '@/components/ui/EditorialCarousel';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';

interface FutureHomesSectionProps {
  headingAsH1?: boolean;
  showPageLink?: boolean;
}

export default function FutureHomesSection({
  headingAsH1 = false,
  showPageLink = true,
}: FutureHomesSectionProps) {
  const router = useRouter();
  const headingTag = headingAsH1 ? 'h1' : 'h2';

  const slides: EditorialSlide[] = FUTURE_HOMES.map((home) => ({
    id: home.id,
    eyebrow: home.conceptStatus,
    title: home.title,
    subtitle: `${home.typology} · ${home.indicativeFootprint}`,
    description: `${home.summary} ${home.architecturalNote}`,
    metaLeftLabel: 'Material Direction',
    metaLeftValue: home.materialPalette[0] ?? 'Natural Earth',
    metaRightLabel: 'Full Palette',
    metaRightValue: home.materialPalette.slice(1).join(' · '),
    image: home.image,
    imageAlt: home.imageAlt,
    actionLabel: 'Request Future Updates',
  }));

  const handleActionSlide = (slide: EditorialSlide) => {
    const interest = `${slide.title} (Future Updates)`;
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      window.history.replaceState(null, '', `/?interest=${encodeURIComponent(interest)}#contact`);
      window.dispatchEvent(new CustomEvent('3veni:select-interest', { detail: interest }));
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/contact?interest=${encodeURIComponent(interest)}`);
    }
  };

  return (
    <section
      id="future-homes"
      className="bg-[#F6F1E7] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="light"
          folioLabel="CHAPTER 05 · FUTURE STUDIES"
          className="mb-12"
        />

        <EditorialReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-[#C8BCA9]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#41490D] mb-3">
              05. Future Collection · Coming Soon
            </p>
            <EditorialHeadingReveal
              as={headingTag}
              segments={[{ text: 'Architectural residences envisioned for future phases.' }]}
              className="font-editorial text-[clamp(2.25rem,3.9vw,3.5rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance"
            />
            {showPageLink && (
              <div className="mt-5">
                <Link
                  href="/future-homes"
                  className="editorial-link text-xs font-semibold tracking-[0.14em] uppercase text-[#41490D] hover:text-[#98400F]"
                >
                  <span>Explore Dedicated Future Homes Page</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>

          <div className="relative max-w-md bg-[#EDE5D6] travertine-grid-surface border border-[#D8CEBC] px-5 py-4 text-xs text-[#493023] leading-relaxed overflow-hidden">
            <QuadrantWatermarkCorner tone="olive" className="absolute top-1 right-1" />
            <strong className="text-[#24221E] uppercase tracking-wider">Concept Preview:</strong>{' '}
            Our core offering focuses on plotted land parcels. These residential studies illustrate
            future architectural direction and are <strong>not currently open for purchase</strong>.
          </div>
        </EditorialReveal>

        <EditorialReveal delay={0.08} className="mt-10">
          <EditorialCarousel
            slides={slides}
            ariaLabel="Future residential architectural studies"
            tone="light"
            onActionSlide={handleActionSlide}
          />
        </EditorialReveal>
      </div>
    </section>
  );
}
