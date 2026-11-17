'use client';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Lock, X } from 'lucide-react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';

function CookiePreferencesDialog() {
  const prefersReducedMotion = useReducedMotion();
  const {
    consent,
    closePreferences,
    acceptAll,
    rejectOptional,
    saveCustomPreferences,
  } = useCookieConsent();

  const [analyticsEnabled, setAnalyticsEnabled] = useState(consent?.analytics ?? false);
  const [marketingEnabled, setMarketingEnabled] = useState(consent?.marketing ?? false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useFocusTrap({
    isOpen: true,
    dialogRef,
    initialFocusRef: closeBtnRef,
    onEscape: closePreferences,
  });

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#24221E]/78 backdrop-blur-sm"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) closePreferences();
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-preferences-title"
        data-testid="cookie-preferences-modal"
        initial={
          prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.99 }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#F6F1E7] text-[#24221E] border border-[#D8CEBC] p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-[#D8CEBC]">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#98400F]">
              Consent Controls
            </p>
            <h2
              id="cookie-preferences-title"
              className="font-editorial text-3xl font-normal text-[#24221E] mt-1"
            >
              Manage Cookie Preferences
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={closePreferences}
            aria-label="Close cookie preferences"
            className="w-10 h-10 inline-flex items-center justify-center border border-[#D8CEBC] text-[#24221E] hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[#98400F]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-sm text-[#493023] leading-relaxed">
          Choose which optional categories you allow. You may update or withdraw your choice at any
          time via <strong>Cookie Settings</strong> in the footer.
        </p>

        <div className="mt-6 space-y-4">
          <div className="p-4 sm:p-5 bg-[#EDE5D6] border border-[#D8CEBC] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#41490D]" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-[#24221E]">Strictly Necessary Storage</h3>
              </div>
              <p className="mt-1.5 text-xs text-[#5E554B] leading-relaxed">
                Essential for core page navigation and remembering your privacy consent status
                locally. Always active.
              </p>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#41490D] font-semibold shrink-0 pt-0.5">
              Always On
            </span>
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#D8CEBC] flex items-start justify-between gap-4">
            <div>
              <label
                htmlFor="toggle-analytics-cookies"
                className="text-sm font-semibold text-[#24221E] cursor-pointer"
              >
                Analytics Cookies
              </label>
              <p className="mt-1.5 text-xs text-[#5E554B] leading-relaxed">
                Reserved for future aggregated site performance insights. Inactive unless explicitly
                enabled; no third-party analytics script is loaded without consent.
              </p>
            </div>
            <input
              id="toggle-analytics-cookies"
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(e) => setAnalyticsEnabled(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#98400F] cursor-pointer shrink-0"
            />
          </div>

          <div className="p-4 sm:p-5 bg-white border border-[#D8CEBC] flex items-start justify-between gap-4">
            <div>
              <label
                htmlFor="toggle-marketing-cookies"
                className="text-sm font-semibold text-[#24221E] cursor-pointer"
              >
                Marketing Cookies
              </label>
              <p className="mt-1.5 text-xs text-[#5E554B] leading-relaxed">
                Reserved for future campaign attribution if enabled. Kept off by default until
                explicit opt-in consent.
              </p>
            </div>
            <input
              id="toggle-marketing-cookies"
              type="checkbox"
              checked={marketingEnabled}
              onChange={(e) => setMarketingEnabled(e.target.checked)}
              className="mt-1 w-5 h-5 accent-[#98400F] cursor-pointer shrink-0"
            />
          </div>
        </div>

        <div className="mt-7 pt-5 border-t border-[#D8CEBC] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={rejectOptional}
              className="px-4 py-2.5 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.09em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
            >
              Reject Optional
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="px-4 py-2.5 border border-[#41490D] text-[#41490D] text-xs font-semibold tracking-[0.09em] uppercase hover:bg-[#41490D] hover:text-[#F6F1E7] transition-colors focus-visible:outline-2 focus-visible:outline-[#41490D]"
            >
              Accept All
            </button>
          </div>
          <button
            type="button"
            onClick={() =>
              saveCustomPreferences({
                analytics: analyticsEnabled,
                marketing: marketingEnabled,
              })
            }
            className="px-5 py-2.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors focus-visible:outline-2 focus-visible:outline-[#98400F]"
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CookiePreferencesModal() {
  const { preferencesOpen } = useCookieConsent();
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {preferencesOpen && <CookiePreferencesDialog key="cookie-dialog" />}
    </AnimatePresence>,
    document.body
  );
}
