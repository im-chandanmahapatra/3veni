'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { SITE_CONFIG } from '@/config/siteConfig';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'projects', label: 'Projects', href: '/projects' },
  { id: 'guide', label: 'Buyer Guide', href: '/guides/land-buying-checklist' },
  { id: 'future-homes', label: 'Future Homes', href: '/future-homes' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname() || '/';
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [openedPathname, setOpenedPathname] = useState<string | null>(null);
  const mobileOpen = openedPathname === pathname;

  const isHomeRoute = pathname === '/';
  const useLightSurface = scrolled || !isHomeRoute;

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 36);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenedPathname(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const checkItemActive = (itemHref: string): boolean => {
    if (itemHref === '/') return pathname === '/';
    return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        useLightSurface
          ? 'bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#D8CEBC] text-[#24221E]'
          : 'bg-gradient-to-b from-[#171512]/88 via-[#171512]/48 to-transparent text-[#F6F1E7]'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
        <Link
          href="/"
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F]"
          aria-label="3VENI SPHERE Home"
        >
          <span className="w-10 h-10 rounded-full overflow-hidden bg-white border border-[#C49A50]/65 p-0.5 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <Image
              src={SITE_CONFIG.emblemPath}
              alt="3VENI SPHERE circular emblem"
              width={40}
              height={40}
              priority
              className="w-full h-full object-contain rounded-full"
            />
          </span>
          <span className="font-semibold tracking-[0.16em] text-sm uppercase whitespace-nowrap">
            {SITE_CONFIG.brandName}
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = checkItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative text-[13px] font-medium tracking-[0.03em] whitespace-nowrap shrink-0 py-1.5 transition-colors duration-200 group focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F] ${
                  useLightSurface
                    ? isActive
                      ? 'text-[#98400F]'
                      : 'text-[#493023] hover:text-[#98400F]'
                    : isActive
                      ? 'text-[#F6F1E7]'
                      : 'text-[#F6F1E7]/88 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-underline"
                    aria-hidden="true"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className={`absolute left-0 right-0 bottom-0 h-[1.5px] ${
                      useLightSurface ? 'bg-[#98400F]' : 'bg-[#C49A50]'
                    }`}
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 bottom-0 h-[1.5px] w-0 group-hover:w-full transition-all duration-300 ${
                      useLightSurface ? 'bg-[#98400F]/65' : 'bg-[#C49A50]/70'
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={isHomeRoute ? '#contact' : '/contact'}
            className={`group hidden sm:inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#98400F] ${
              useLightSurface
                ? 'bg-[#98400F] text-[#F6F1E7] hover:bg-[#7A310A]'
                : 'bg-[#F6F1E7] text-[#24221E] hover:bg-[#EDE5D6]'
            }`}
          >
            <span>Enquire</span>
            <ArrowUpRight
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            onClick={() =>
              setOpenedPathname((prev) => (prev === pathname ? null : pathname))
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`lg:hidden inline-flex items-center justify-center w-11 h-11 transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F] ${
              useLightSurface ? 'text-[#24221E] hover:bg-[#EDE5D6]' : 'text-[#F6F1E7] hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-[#F6F1E7] text-[#24221E] border-b border-[#D8CEBC] px-6 py-6 shadow-xl"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = checkItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpenedPathname(null)}
                    className={`py-3 text-base font-medium border-b border-[#EDE5D6] transition-colors flex items-center justify-between ${
                      isActive ? 'text-[#98400F]' : 'text-[#24221E] hover:text-[#98400F]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C49A50]" aria-hidden="true" />
                    )}
                  </Link>
                );
              })}
              <Link
                href="/contact"
                onClick={() => setOpenedPathname(null)}
                className="mt-4 inline-flex items-center justify-center px-5 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
              >
                Enquire Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
