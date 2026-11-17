'use client';

import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Ruler,
  X,
} from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import type { LandPlot } from '@/types/property';
import { CompassOrientationGlyph } from '@/components/ui/BrandMotifs';
import { resolveSwipeAction } from '@/lib/introSession';

interface ProjectDetailModalProps {
  plot: LandPlot | null;
  onClose: () => void;
  onEnquirePlot: (plot: LandPlot) => void;
}

export default function ProjectDetailModal({
  plot,
  onClose,
  onEnquirePlot,
}: ProjectDetailModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [imageSelection, setImageSelection] = useState<{ plotId: string; index: number }>({
    plotId: '',
    index: 0,
  });
  const activeImageIdx = plot && imageSelection.plotId === plot.id ? imageSelection.index : 0;

  const gallery =
    plot?.galleryImages && plot.galleryImages.length > 0
      ? plot.galleryImages
      : plot
        ? [{ src: plot.image, alt: plot.imageAlt, caption: plot.topography }]
        : [];

  useFocusTrap({
    isOpen: Boolean(plot),
    dialogRef,
    initialFocusRef: closeBtnRef,
    onEscape: onClose,
  });

  useEffect(() => {
    if (!plot || gallery.length <= 1) return;
    const currentPlotId = plot.id;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setImageSelection((prev) => {
          const base = prev.plotId === currentPlotId ? prev.index : 0;
          return { plotId: currentPlotId, index: (base + 1) % gallery.length };
        });
      } else if (e.key === 'ArrowLeft') {
        setImageSelection((prev) => {
          const base = prev.plotId === currentPlotId ? prev.index : 0;
          return { plotId: currentPlotId, index: (base - 1 + gallery.length) % gallery.length };
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [plot, gallery.length]);

  if (typeof document === 'undefined') return null;

  const currentPhoto = plot ? gallery[activeImageIdx] ?? gallery[0]! : null;

  return createPortal(
    <AnimatePresence>
      {plot && currentPhoto && (
        <motion.div
          key="project-detail-overlay"
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-[#24221E]/82 backdrop-blur-sm"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key={plot.id}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
            data-testid="project-detail-modal"
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 0, y: 16, scale: 0.99 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.99 }
            }
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#F6F1E7] text-[#24221E] border border-[#D8CEBC] shadow-2xl"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-[#F6F1E7]/95 backdrop-blur-sm border-b border-[#D8CEBC]">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#98400F]">
                <span>{plot.category}</span>
                <span aria-hidden="true" className="text-[#C49A50]">
                  ·
                </span>
                <span className="text-[#41490D]">{plot.availability}</span>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label={`Close details for ${plot.name}`}
                className="inline-flex items-center justify-center w-10 h-10 border border-[#D8CEBC] text-[#24221E] hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 flex flex-col bg-[#24221E]">
                <div
                  onPointerDown={(e: PointerEvent<HTMLDivElement>) => {
                    pointerStartX.current = e.clientX;
                  }}
                  onPointerUp={(e: PointerEvent<HTMLDivElement>) => {
                    if (pointerStartX.current === null || gallery.length <= 1) return;
                    const action = resolveSwipeAction(e.clientX - pointerStartX.current);
                    pointerStartX.current = null;
                    if (action === 'next') {
                      setImageSelection({
                        plotId: plot.id,
                        index: (activeImageIdx + 1) % gallery.length,
                      });
                    } else if (action === 'prev') {
                      setImageSelection({
                        plotId: plot.id,
                        index: (activeImageIdx - 1 + gallery.length) % gallery.length,
                      });
                    }
                  }}
                  className="relative aspect-[16/10] w-full overflow-hidden group touch-pan-y select-none"
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={currentPhoto.src}
                      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.35 }}
                      animate={{ opacity: 1 }}
                      exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0.35 }}
                      transition={{ duration: 0.26 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={currentPhoto.src}
                        alt={currentPhoto.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 58vw"
                        className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {gallery.length > 1 && (
                    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 z-10">
                      <span className="px-3 py-1.5 bg-[#24221E]/88 text-[#F6F1E7] text-xs border border-[#C49A50]/35">
                        {currentPhoto.caption}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setImageSelection({
                              plotId: plot.id,
                              index: (activeImageIdx - 1 + gallery.length) % gallery.length,
                            })
                          }
                          aria-label="Previous gallery photo"
                          className="w-9 h-9 inline-flex items-center justify-center bg-[#24221E]/90 border border-[#C49A50]/40 text-[#F6F1E7] hover:bg-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setImageSelection({
                              plotId: plot.id,
                              index: (activeImageIdx + 1) % gallery.length,
                            })
                          }
                          aria-label="Next gallery photo"
                          className="w-9 h-9 inline-flex items-center justify-center bg-[#24221E]/90 border border-[#C49A50]/40 text-[#F6F1E7] hover:bg-[#98400F] transition-colors focus-visible:outline-2 focus-visible:outline-[#C49A50]"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {gallery.length > 1 && (
                  <div className="flex items-center gap-2.5 p-3 bg-[#1C1A17] border-t border-white/10 overflow-x-auto">
                    {gallery.map((item, idx) => {
                      const isActive = idx === activeImageIdx;
                      return (
                        <button
                          key={`${item.src}-${idx}`}
                          type="button"
                          onClick={() => setImageSelection({ plotId: plot.id, index: idx })}
                          aria-label={`View gallery image ${idx + 1}: ${item.caption}`}
                          aria-pressed={isActive}
                          className={`relative w-20 h-14 shrink-0 overflow-hidden border transition-all focus-visible:outline-2 focus-visible:outline-[#C49A50] ${
                            isActive
                              ? 'border-[#C49A50] opacity-100'
                              : 'border-white/15 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <Image src={item.src} alt="" fill sizes="80px" className="object-cover" />
                        </button>
                      );
                    })}
                    <span className="ml-auto font-mono text-[11px] text-[#C8BCA9] pr-2 tabular-nums shrink-0">
                      0{activeImageIdx + 1} / 0{gallery.length}
                    </span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#EDE5D6] border-t lg:border-t-0 lg:border-l border-[#D8CEBC]">
                <div>
                  <p className="text-xs tracking-[0.14em] uppercase text-[#5E554B] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#98400F]" aria-hidden="true" />
                    <span>{plot.location}</span>
                  </p>
                  <h2
                    id="project-detail-title"
                    className="mt-3 font-editorial text-3xl sm:text-4xl font-normal text-[#24221E] leading-[1.06]"
                  >
                    {plot.name}
                  </h2>
                  <p className="mt-4 text-sm leading-[1.72] text-[#493023]">
                    {plot.editorialOverview}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-[#D8CEBC]">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#5E554B]">
                    Pricing Guidance
                  </p>
                  <p className="mt-1 font-editorial text-2xl font-medium text-[#24221E]">
                    {plot.priceDisplay}
                  </p>
                  <button
                    type="button"
                    onClick={() => onEnquirePlot(plot)}
                    className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#98400F]"
                  >
                    <span>Enquire About This Plot</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <Link
                    href={`/projects/${plot.slug}`}
                    onClick={onClose}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24221E]"
                  >
                    <span>Open Full Project Page</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-7">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#98400F] mb-4">
                  Parcel Specifications (Sample Typology)
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#D8CEBC]">
                  <div className="py-4 pr-4 border-b border-[#D8CEBC]">
                    <dt className="text-xs text-[#5E554B] flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#98400F]" aria-hidden="true" />
                      <span>Total Area</span>
                    </dt>
                    <dd className="mt-1.5 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                      {plot.areaDisplay}
                    </dd>
                  </div>
                  <div className="py-4 sm:pl-4 border-b border-[#D8CEBC]">
                    <dt className="text-xs text-[#5E554B]">Plot Dimensions</dt>
                    <dd className="mt-1.5 font-mono text-sm font-medium text-[#24221E] tabular-nums">
                      {plot.dimensions}
                    </dd>
                  </div>
                  <div className="py-4 pr-4 border-b border-[#D8CEBC]">
                    <dt className="text-xs text-[#5E554B] mb-1.5">Orientation &amp; Sun Path</dt>
                    <dd>
                      <CompassOrientationGlyph facing={plot.facing} />
                    </dd>
                  </div>
                  <div className="py-4 sm:pl-4 border-b border-[#D8CEBC]">
                    <dt className="text-xs text-[#5E554B]">Approach Access</dt>
                    <dd className="mt-2 text-sm font-medium text-[#24221E]">{plot.roadWidth}</dd>
                  </div>
                  <div className="py-4 sm:col-span-2 border-b border-[#D8CEBC]">
                    <dt className="text-xs text-[#5E554B]">Terrain &amp; Topography</dt>
                    <dd className="mt-1.5 text-sm font-medium text-[#24221E]">{plot.topography}</dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-5">
                <h3 className="text-xs font-semibold tracking-[0.16em] uppercase text-[#41490D] mb-4">
                  Site &amp; Planning Highlights
                </h3>
                <ul className="space-y-3">
                  {plot.siteHighlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#493023] leading-relaxed pb-3 border-b border-[#EDE5D6] last:border-b-0"
                    >
                      <span className="font-mono text-xs text-[#98400F] mr-2.5">0{idx + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 p-4 bg-[#EDE5D6] border border-[#D8CEBC] text-xs text-[#5E554B] leading-relaxed">
                  <strong>Portfolio Note:</strong> Parcel formats shown here are representative sample
                  typologies. Official boundary sketches, title records, and binding pricing are shared
                  directly during formal advisory consultation.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
