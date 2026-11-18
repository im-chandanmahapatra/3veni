'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useCookieConsent } from '@/context/CookieConsentContext';

/**
 * Consent bar (DESIGN §8.11, audit H7): docked bottom bar that reserves its own height (--consent-h) so it never
 * covers content; three equal-weight actions at ≥ 44 px. Behaviour and storage key are unchanged from V1.
 */
export default function ConsentBar() {
  const { bannerVisible, acceptAll, rejectOptional, openPreferences } = useCookieConsent();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!bannerVisible || !el) {
      root.style.setProperty('--consent-h', '0px');
      return;
    }
    const apply = () => root.style.setProperty('--consent-h', `${Math.ceil(el.getBoundingClientRect().height)}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty('--consent-h', '0px');
    };
  }, [bannerVisible]);

  if (!bannerVisible) return null;

  return (
    <div ref={ref} role="region" aria-label="Cookie consent" className="consent-bar" data-testid="cookie-consent-banner">
      <div className="wrap consent-bar__inner">
        <p>
          Essential browser storage only; optional analytics stay off until enabled.{' '}
          <Link href="/cookie-policy">Cookie Policy</Link>
        </p>
        <div className="consent-bar__actions">
          <Button variant="on-dark" icon={null} onClick={acceptAll}>
            Accept all
          </Button>
          <Button variant="on-dark-outline" icon={null} onClick={rejectOptional}>
            Reject optional
          </Button>
          <Button variant="on-dark-outline" icon={null} onClick={openPreferences}>
            Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
