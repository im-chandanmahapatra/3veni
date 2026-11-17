'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';

export default function CookieStatusCard() {
  const { consent, openPreferences } = useCookieConsent();

  return (
    <div className="mt-8 p-6 bg-white border border-[#D8CEBC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#41490D]">
          Your Current Consent Status
        </p>
        <p className="mt-1.5 text-sm text-[#493023]">
          Strictly Necessary Storage: <strong>Active</strong> · Analytics:{' '}
          <strong>{consent?.analytics ? 'Consented' : 'Off'}</strong> · Marketing:{' '}
          <strong>{consent?.marketing ? 'Consented' : 'Off'}</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={openPreferences}
        className="px-5 py-3 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors whitespace-nowrap"
      >
        Update Cookie Preferences
      </button>
    </div>
  );
}
