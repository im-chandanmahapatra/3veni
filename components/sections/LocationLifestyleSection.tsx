import { SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';
import TerrainStudyGallery from '@/components/property/TerrainStudyGallery';

export default function LocationLifestyleSection() {
  return (
    <section
      id="lifestyle"
      className="bg-[#EDE5D6] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="light"
          folioLabel="CHAPTER 03 · TERRAIN & LIGHT"
          className="mb-14"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          <EditorialReveal className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-3">
              03. Terrain &amp; Lifestyle Ethos
            </p>
            <EditorialHeadingReveal
              as="h2"
              segments={[{ text: 'Earth that breathes with morning light and open horizons.' }]}
              className="font-editorial text-[clamp(2.25rem,3.9vw,3.5rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance"
            />
            <p className="mt-5 text-[15px] leading-[1.78] text-[#493023]">
              Great land feels effortless before a single wall is raised. We look for settings where
              natural elevation, mature tree cover, and practical road access align—allowing future
              owners to experience countryside calm without disconnecting from essential urban
              infrastructure.
            </p>

            <div className="mt-10 border-t border-[#C8BCA9] divide-y divide-[#C8BCA9]">
              <div className="py-5">
                <h3 className="text-sm font-semibold text-[#24221E] tracking-wide flex items-center gap-3">
                  <span className="w-3.5 h-[1px] bg-[#41490D]" aria-hidden="true" />
                  <span>Natural Surroundings</span>
                </h3>
                <p className="mt-1.5 text-sm text-[#5E554B] leading-relaxed pl-6">
                  Preserving existing native groves, stone ridges, and open sky sightlines so
                  every parcel feels anchored in nature.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-sm font-semibold text-[#24221E] tracking-wide flex items-center gap-3">
                  <span className="w-3.5 h-[1px] bg-[#98400F]" aria-hidden="true" />
                  <span>Thoughtful Accessibility</span>
                </h3>
                <p className="mt-1.5 text-sm text-[#5E554B] leading-relaxed pl-6">
                  Clear approach avenues and practical transit connectivity suited to calm
                  residential living and long-term holding.
                </p>
              </div>
              <div className="py-5">
                <h3 className="text-sm font-semibold text-[#24221E] tracking-wide flex items-center gap-3">
                  <span className="w-3.5 h-[1px] bg-[#C49A50]" aria-hidden="true" />
                  <span>Future Possibility</span>
                </h3>
                <p className="mt-1.5 text-sm text-[#5E554B] leading-relaxed pl-6">
                  Unencumbered open canvas ready to hold a weekend pavilion, family courtyard home,
                  or long-term land reserve.
                </p>
              </div>
            </div>
          </EditorialReveal>

          <div className="lg:col-span-7">
            <TerrainStudyGallery />
          </div>
        </div>
      </div>
    </section>
  );
}
