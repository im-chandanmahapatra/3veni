import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/config/siteConfig';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import WhyChooseSection from '@/components/sections/WhyChooseSection';
import { SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialReveal } from '@/components/ui/ScrollReveal';
import ArchitecturalAperture from '@/components/motion/ArchitecturalAperture';

export const metadata = createPageMetadata({
  title: 'About 3VENI SPHERE — Stewardship & Ethos',
  description:
    'Learn how 3VENI SPHERE approaches residential plotted land development with contour-led planning, clarity, and enduring trust.',
  path: '/about',
});

export default function AboutPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]);

  return (
    <div className="pt-20 bg-[#F6F1E7] text-[#24221E]">
      <JsonLd data={breadcrumb} />

      <section className="py-20 lg:py-28 border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-[#98400F] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#24221E] font-medium">About 3VENI SPHERE</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <EditorialReveal className="lg:col-span-6">
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-3">
                Stewardship &amp; Ethos
              </p>
              <h1 className="font-editorial text-[clamp(2.5rem,4.7vw,4.35rem)] leading-[1.02] font-normal tracking-[-0.015em] text-balance">
                Land curation shaped by heritage, terrain, and patient trust.
              </h1>
              <p className="mt-5 font-devanagari text-base text-[#41490D]">
                स्थिरता, संस्कृति और स्पष्ट विश्वास — Grounded in earth, built for generations.
              </p>
            </EditorialReveal>

            <EditorialReveal delay={0.08} className="lg:col-span-6 lg:pt-8">
              <p className="text-base leading-[1.78] text-[#493023]">
                <strong>{SITE_CONFIG.brandName}</strong> approaches residential land development
                with architectural restraint. Before proposing boundaries or road lines, we evaluate
                natural elevation, seasonal drainage, mature tree cover, and long-term livability.
              </p>
              <p className="mt-4 text-base leading-[1.78] text-[#493023]">
                Our guiding commitment—<em>Invest With Confidence</em>—means communicating dimensions,
                topography, and project documentation plainly, without speculative promises or
                visual clutter.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#7A310A] transition-colors"
                >
                  <span>Explore Land Projects</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/guides/land-buying-checklist"
                  className="editorial-link text-xs font-semibold tracking-[0.12em] uppercase text-[#41490D] hover:text-[#98400F]"
                >
                  <span>Read Buyer Due-Diligence Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </EditorialReveal>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-[#EDE5D6] border-b border-[#D8CEBC]">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <SphereCrestDivider tone="light" folioLabel="CULTURAL EMBLEM & CRAFT" className="mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 bg-[#F6F1E7] border border-[#D8CEBC] p-8 sm:p-10">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-white border-2 border-[#C49A50]/75 p-1.5 mx-auto sm:mx-0">
                <Image
                  src={SITE_CONFIG.logoPath}
                  alt="3VENI SPHERE official circular emblem"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="mt-6 font-editorial text-3xl font-normal text-[#24221E]">
                Our Cultural Emblem
              </h2>
              <p className="mt-3 text-sm leading-[1.74] text-[#493023]">
                The four-quadrant circular artwork of the 3VENI SPHERE emblem weaves together
                terracotta and deep olive botanical and community motifs—symbolizing harmony between
                land, craft, shelter, and enduring family continuity.
              </p>
              <dl className="mt-6 pt-5 border-t border-[#D8CEBC] space-y-2 text-xs text-[#5E554B]">
                <div>
                  <dt className="uppercase tracking-[0.12em]">Brand Identity</dt>
                  <dd className="text-sm font-medium text-[#24221E] mt-0.5">
                    {SITE_CONFIG.registeredEntityName}
                  </dd>
                </div>
                <div className="pt-2">
                  <dt className="uppercase tracking-[0.12em]">Core Discipline</dt>
                  <dd className="text-sm font-medium text-[#24221E] mt-0.5">
                    {SITE_CONFIG.serviceFocusLabel}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-7">
              <ArchitecturalAperture
                src="/images/plots/earth-architecture-study.webp"
                alt="Honed sandstone steps and rammed earth boundary craft"
                aspectClassName="aspect-[16/10] border border-[#D8CEBC]"
                caption="MATERIAL ARCHIVE · SANDSTONE & RAMMED EARTH"
              />
            </div>
          </div>
        </div>
      </section>

      <WhyChooseSection />
    </div>
  );
}
