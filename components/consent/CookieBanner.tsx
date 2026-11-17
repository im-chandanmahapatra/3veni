'use client';

import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '@/context/CookieConsentContext';

/**
 * Compact bottom consent strip engineered to keep mobile viewport footprint minimal
 * (~100px max on 360px widths) without occluding Hero CTAs or vista controls.
 */
export default function CookieBanner() {
  const { bannerVisible, acceptAll, rejectOptional, openPreferences } = useCookieConsent();

  if (!bannerVisible) return null;

  return (
    <aside
      aria-label="Cookie consent notice"
      data-testid="cookie-consent-banner"
      className="fixed bottom-0 inset-x-0 md:bottom-5 md:left-auto md:right-6 md:inset-x-auto z-40 md:w-[420px] bg-[#24221E]/97 backdrop-blur-md text-[#F6F1E7] border-t md:border border-[#C49A50]/45 shadow-2xl px-4 py-3 md:p-4"
    >
      <div className="max-w-[1320px] mx-auto flex flex-col gap-2.5">
        <div className="flex items-start gap-2.5">
          <Cookie className="w-4 h-4 text-[#C49A50] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[#EDE5D6] leading-snug">
            Essential browser storage only; optional analytics stay off until enabled.{' '}
            <Link
              href="/cookie-policy"
              className="underline underline-offset-4 decoration-[#C49A50]/65 text-[#F6F1E7] hover:text-white whitespace-nowrap"
            >
              Cookie Policy
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={acceptAll}
              className="px-2.5 sm:px-3 py-1.5 bg-[#98400F] text-[#F6F1E7] text-[10px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase hover:bg-[#7A310A] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49A50]"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="px-2.5 sm:px-3 py-1.5 border border-[#F6F1E7]/45 text-[#F6F1E7] text-[10px] sm:text-[11px] font-semibold tracking-[0.06em] uppercase hover:bg-[#F6F1E7] hover:text-[#24221E] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49A50]"
            >
              Reject Optional
            </button>
          </div>
          <button
            type="button"
            onClick={openPreferences}
            className="px-2 py-1.5 text-[10px] sm:text-[11px] font-medium tracking-[0.05em] uppercase text-[#C49A50] hover:text-[#F6F1E7] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C49A50]"
          >
            Preferences
          </button>
        </div>
      </div>
    </aside>
  );
}
