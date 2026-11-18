'use client';

import Button from '@/components/ui/Button';
import { useCookieConsent } from '@/context/CookieConsentContext';

/** Live consent status on the cookie-policy page, with a control to reopen the preferences dialog. */
export default function CookieStatus() {
  const { consent, openPreferences } = useCookieConsent();
  return (
    <div className="cookie-status">
      <div>
        <p className="t-overline">Your current consent status</p>
        <p className="t-body-sm">
          Strictly necessary storage: <strong>Active</strong> · Analytics: <strong>{consent?.analytics ? 'Consented' : 'Off'}</strong> · Marketing:{' '}
          <strong>{consent?.marketing ? 'Consented' : 'Off'}</strong>
        </p>
      </div>
      <Button variant="secondary" icon={null} onClick={openPreferences}>
        Update cookie preferences
      </Button>
    </div>
  );
}
