import Image from 'next/image';
import { SITE_CONFIG } from '@/config/siteConfig';
import { QuadrantWatermarkCorner, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';
import ArchitecturalAperture from '@/components/motion/ArchitecturalAperture';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-[#F6F1E7] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="light"
          folioLabel="CHAPTER 02 · STEWARDSHIP"
          className="mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <EditorialReveal className="lg:col-span-5 lg:sticky lg:top-28">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-4">
              02. About 3VENI SPHERE
            </p>
            <EditorialHeadingReveal
              as="h2"
              segments={[{ text: 'Land stewardship shaped with architectural restraint.' }]}
              className="font-editorial text-[clamp(2.25rem,4vw,3.65rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance"
            />
            <p className="mt-5 font-devanagari text-sm text-[#41490D]">
              स्थिरता और विश्वास की नींव — Built on clarity, grounded in earth.
            </p>

            <div className="relative mt-10 p-6 sm:p-7 bg-[#EDE5D6] travertine-grid-surface border border-[#D8CEBC] flex items-center gap-6 overflow-hidden">
              <QuadrantWatermarkCorner
                tone="terracotta"
                className="absolute top-1.5 right-1.5"
              />
              <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-[#98400F]/60 ring-2 ring-[#C49A50]/35 ring-offset-2 ring-offset-[#EDE5D6] shrink-0 p-1">
                <Image
                  src={SITE_CONFIG.logoPath}
                  alt="3VENI SPHERE official brand logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative z-10">
                <p className="text-xs tracking-[0.18em] uppercase font-semibold">
                  <span className="text-[#98400F]">3VENI</span>{' '}
                  <span className="text-[#41490D]">SPHERE</span>
                </p>
                <p className="text-xs tracking-[0.14em] uppercase text-[#493023] mt-1 font-medium">
                  {SITE_CONFIG.tagline}
                </p>
                <p className="text-xs text-[#5E554B] mt-2 leading-relaxed">
                  {SITE_CONFIG.serviceFocusLabel}
                </p>
              </div>
            </div>
          </EditorialReveal>

          <div className="lg:col-span-7 flex flex-col gap-12">
            <ArchitecturalAperture
              src="/images/plots/prana-valley.webp"
              alt="Contoured valley land bordered by dry-stone walls and open meadow horizons"
              aspectClassName="aspect-[16/10] w-full border border-[#D8CEBC]"
              caption="PLATE 01 · VALLEY CONTOUR & DRY-STONE BOUNDARY"
              hoverOverlayNote="Hand-stacked basalt & dry-stone perimeter preserving hillside runoff contours."
            />

            <EditorialReveal delay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 pt-2">
              <div className="pt-5 border-t border-[#C8BCA9]">
                <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#41490D] mb-3">
                  Our Approach
                </h3>
                <p className="text-[15px] leading-[1.78] text-[#493023]">
                  3VENI SPHERE approaches plotted land as the foundation of lasting personal wealth
                  and thoughtful architecture. Before a single line is drawn, we study natural
                  contours, approach corridors, and the quiet character of the surrounding
                  landscape.
                </p>
              </div>
              <div className="pt-5 border-t border-[#C8BCA9]">
                <h3 className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#41490D] mb-3">
                  Our Vision
                </h3>
                <p className="text-[15px] leading-[1.78] text-[#493023]">
                  To bring architectural clarity and transparent communication to land
                  acquisition—giving prospective buyers and families the confidence to hold earth
                  today and shape bespoke residences tomorrow.
                </p>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
