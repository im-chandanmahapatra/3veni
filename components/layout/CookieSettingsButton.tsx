'use client';

import { useCookieConsent } from '@/context/CookieConsentContext';

/** Footer entry point to reopen the consent preferences (withdrawing consent must be as easy as giving it). */
export default function CookieSettingsButton() {
  const { openPreferences } = useCookieConsent();
  return (
    <button type="button" onClick={openPreferences}>
      Cookie settings
    </button>
  );
}
