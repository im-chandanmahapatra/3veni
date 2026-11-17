'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Search, SlidersHorizontal } from 'lucide-react';
import { LAND_PLOTS } from '@/data/properties';
import { filterAndSortPlots } from '@/lib/propertyFilters';
import type { LandPlot, PlotCategory, PlotSortOption } from '@/types/property';
import InteractivePlotMap from '@/components/property/InteractivePlotMap';
import ProjectDetailModal from '@/components/property/ProjectDetailModal';
import { QuadrantWatermarkCorner, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';

interface FeaturedPlotsSectionProps {
  sectionNumber?: string;
  showPageLink?: boolean;
  headingAsH1?: boolean;
  onSelectPlotForEnquiry?: (plotName: string) => void;
}

const CATEGORIES: PlotCategory[] = [
  'All',
  'Residential Plots',
  'Corner Parcels',
  'Estate Acreage',
];

export default function FeaturedPlotsSection({
  sectionNumber = '01',
  showPageLink = true,
  headingAsH1 = false,
  onSelectPlotForEnquiry,
}: FeaturedPlotsSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<PlotCategory>('All');
  const [sortBy, setSortBy] = useState<PlotSortOption>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalPlot, setModalPlot] = useState<LandPlot | null>(null);

  const visiblePlots = useMemo(
    () => filterAndSortPlots(LAND_PLOTS, selectedCategory, sortBy, searchQuery),
    [selectedCategory, sortBy, searchQuery]
  );

  const matchingPlotIds = useMemo(
    () => new Set(visiblePlots.map((plot) => plot.id)),
    [visiblePlots]
  );

  // Recalibrate GSAP ScrollTrigger positions below when filtering changes grid height
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(id);
  }, [visiblePlots.length]);

  const headingTag = headingAsH1 ? 'h1' : 'h2';

  const handleEnquirePlot = (plot: LandPlot) => {
    setModalPlot(null);
    if (onSelectPlotForEnquiry) {
      onSelectPlotForEnquiry(plot.name);
      return;
    }
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      window.history.replaceState(null, '', `/?interest=${encodeURIComponent(plot.name)}#contact`);
      window.dispatchEvent(new CustomEvent('3veni:select-interest', { detail: plot.name }));
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      router.push(`/contact?interest=${encodeURIComponent(plot.name)}`);
    }
  };

  return (
    <section
      id="plots"
      className="bg-[#EDE5D6] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="light"
          folioLabel="CHAPTER 01 · SAMPLE PORTFOLIO"
          className="mb-12"
        />

        <EditorialReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-[#C8BCA9]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-3">
              {sectionNumber}. Featured Land Projects · Primary Focus
            </p>
            <EditorialHeadingReveal
              as={headingTag}
              segments={[{ text: 'Curated land parcels prepared for generational ownership.' }]}
              className="font-editorial text-[clamp(2.3rem,4.2vw,3.75rem)] leading-[1.03] font-normal tracking-[-0.015em] text-balance"
            />
          </div>
          <div className="max-w-md space-y-4">
            <p className="text-sm text-[#5E554B] leading-relaxed">
              Explore sample parcel typologies across contour grades, dimensions, and road
              frontages. Select any parcel on the masterplan or card grid to inspect full site
              specifications.
            </p>
            {showPageLink && (
              <Link
                href="/projects"
                className="editorial-link text-xs font-semibold tracking-[0.14em] uppercase text-[#98400F] hover:text-[#7A310A]"
              >
                <span>Open Full Projects Directory</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </EditorialReveal>

        {/* Filter, Search & Sort Controls */}
        <div className="py-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div
            role="group"
            aria-label="Filter plots by category"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={isActive}
                  className={`relative px-4 py-2.5 text-xs font-semibold tracking-[0.08em] uppercase transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F] ${
                    isActive
                      ? 'text-[#F6F1E7]'
                      : 'bg-[#F6F1E7] text-[#493023] border border-[#D8CEBC] hover:border-[#98400F] hover:text-[#98400F]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="plot-category-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#98400F] z-0"
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#5E554B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="plot-search" className="sr-only">
                Search land plots
              </label>
              <input
                id="plot-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parcel or terrain..."
                className="w-full sm:w-56 pl-10 pr-4 py-2.5 bg-[#F6F1E7] border border-[#D8CEBC] text-sm text-[#24221E] placeholder:text-[#7A7166] focus:outline-none focus:border-[#98400F]"
              />
            </div>

            <div className="relative flex items-center">
              <SlidersHorizontal
                className="w-3.5 h-3.5 text-[#5E554B] absolute left-3.5 pointer-events-none"
                aria-hidden="true"
              />
              <label htmlFor="plot-sort" className="sr-only">
                Sort land plots
              </label>
              <select
                id="plot-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as PlotSortOption)}
                className="pl-9 pr-8 py-2.5 bg-[#F6F1E7] border border-[#D8CEBC] text-sm text-[#24221E] focus:outline-none focus:border-[#98400F] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="area-desc">Size: Largest First</option>
                <option value="area-asc">Size: Compact First</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono tracking-wider uppercase text-[#5E554B] mb-6 tabular-nums" aria-live="polite">
          Showing 0{visiblePlots.length} of 0{LAND_PLOTS.length} sample land typologies
        </p>

        {/* Interactive SVG Plot Masterplan */}
        <InteractivePlotMap
          plots={LAND_PLOTS}
          matchingPlotIds={matchingPlotIds}
          onSelectPlot={setModalPlot}
        />

        {/* Plot Grid */}
        {visiblePlots.length === 0 ? (
          <div className="bg-[#F6F1E7] border border-[#D8CEBC] p-12 text-center">
            <h3 className="font-editorial text-2xl font-medium text-[#24221E]">
              No matching parcels found
            </h3>
            <p className="mt-2 text-sm text-[#5E554B]">
              Adjust your category filter or search term to view available sample land parcels.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSortBy('featured');
              }}
              className="mt-6 px-5 py-2.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {visiblePlots.map((plot, index) => {
              const isLeadWide =
                index === 0 &&
                selectedCategory === 'All' &&
                !searchQuery.trim() &&
                visiblePlots.length > 2;

              return (
                <article
                  key={plot.id}
                  data-testid={`plot-card-${plot.slug}`}
                  className={`plot-card group bg-[#F6F1E7] border border-[#D8CEBC] hover:border-[#98400F]/65 flex flex-col justify-between ${
                    isLeadWide ? 'md:col-span-12 lg:grid lg:grid-cols-12' : 'md:col-span-6'
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-[#EDE5D6] ${
                      isLeadWide
                        ? 'lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:h-full min-h-[300px]'
                        : 'aspect-[4/3]'
                    }`}
                  >
                    <Image
                      src={plot.image}
                      alt={plot.imageAlt}
                      fill
                      sizes={
                        isLeadWide
                          ? '(max-width: 1024px) 100vw, 58vw'
                          : '(max-width: 768px) 100vw, 48vw'
                      }
                      className="object-cover plot-card-image"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-3.5 left-3.5 w-3 h-3 border-t border-l border-[#C49A50]/65 z-10"
                    />
                    <div
                      aria-hidden="true"
                      className="plot-card-overlay opacity-0 pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171512]/58 via-transparent to-transparent"
                    />
                    <div className="plot-card-hover-reveal pointer-events-none hidden md:flex items-center justify-between absolute inset-x-6 bottom-5 text-[#F6F1E7]">
                      <span className="text-[11px] font-semibold tracking-[0.18em] uppercase">
                        Inspect Dossier · {plot.dimensions}
                      </span>
                      <ArrowUpRight className="w-4 h-4 text-[#C49A50]" aria-hidden="true" />
                    </div>
                  </div>

                  <div
                    className={`relative p-7 sm:p-9 flex flex-col justify-between ${
                      isLeadWide ? 'lg:col-span-5 travertine-grid-surface' : ''
                    }`}
                  >
                    {isLeadWide && (
                      <QuadrantWatermarkCorner
                        tone="terracotta"
                        className="absolute top-2.5 right-2.5"
                      />
                    )}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#98400F]">
                          <span>{plot.category}</span>
                          <span aria-hidden="true" className="text-[#C49A50]">
                            ·
                          </span>
                          <span className="text-[#41490D]">{plot.availability}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#5E554B] tabular-nums">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="mt-3 font-editorial text-2xl sm:text-3xl font-medium text-[#24221E] leading-tight">
                        <Link
                          href={`/projects/${plot.slug}`}
                          className="hover:text-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
                        >
                          {plot.name}
                        </Link>
                      </h3>

                      <p className="mt-1.5 text-xs tracking-wide text-[#5E554B]">{plot.location}</p>

                      <p className="mt-4 text-sm leading-[1.7] text-[#493023]">
                        {plot.shortDescription}
                      </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-[#D8CEBC]">
                      <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.14em] text-[#5E554B]">
                            Plot Size
                          </dt>
                          <dd className="mt-1 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                            {plot.areaDisplay}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] uppercase tracking-[0.14em] text-[#5E554B]">
                            Dimensions
                          </dt>
                          <dd className="mt-1 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                            {plot.dimensions}
                          </dd>
                        </div>
                      </dl>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <Link
                          href={`/projects/${plot.slug}`}
                          aria-label={`View details for ${plot.name}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#24221E] text-[#F6F1E7] md:group-hover:bg-[#98400F] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#98400F] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F]"
                        >
                          <span>View Details</span>
                          <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setModalPlot(plot)}
                          className="editorial-link text-xs font-medium tracking-[0.08em] uppercase text-[#5E554B] hover:text-[#98400F] py-2 focus-visible:outline-2 focus-visible:outline-[#98400F]"
                        >
                          Quick Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <ProjectDetailModal
        plot={modalPlot}
        onClose={() => setModalPlot(null)}
        onEnquirePlot={handleEnquirePlot}
      />
    </section>
  );
}
