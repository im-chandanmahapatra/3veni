'use client';

import { useEffect, useRef, useState } from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { CheckboxField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import ModalDialog, { type ModalDialogHandle } from '@/components/ui/ModalDialog';
import { useCookieConsent } from '@/context/CookieConsentContext';

/** Mounted only while the dialog is open, so the toggles always start from the stored choice. */
function PreferencesForm() {
  const { consent, closePreferences, acceptAll, rejectOptional, saveCustomPreferences } = useCookieConsent();
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [marketing, setMarketing] = useState(consent?.marketing ?? false);

  return (
    <div data-testid="cookie-preferences-modal" className="contents">
      <div className="dialog__head">
        <div className="grid gap-2">
          <p className="t-overline">Consent controls</p>
          <h2 className="t-display-md">Manage cookie preferences</h2>
        </div>
        <button type="button" className="icon-btn" onClick={closePreferences}>
          <Icon name="close" />
          <span className="sr-only">Close cookie preferences</span>
        </button>
      </div>
      <div className="dialog__body">
        <p className="t-body-sm">
          Choose which optional categories you allow. You may update or withdraw your choice at any time via{' '}
          <strong>Cookie settings</strong> in the footer.
        </p>
        <div className="pref-row">
          <div>
            <h3>Strictly necessary storage</h3>
            <p>Essential for core page navigation and remembering your privacy consent status locally. Always active.</p>
          </div>
          <Badge>Always on</Badge>
        </div>
        <div className="pref-row">
          <div>
            <h3>Analytics cookies</h3>
            <p>
              Reserved for future aggregated site performance insights. Inactive unless explicitly enabled; no third-party
              analytics script is loaded without consent.
            </p>
          </div>
          <CheckboxField
            id="pref-analytics"
            label={<span className="sr-only">Allow analytics cookies</span>}
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
          />
        </div>
        <div className="pref-row">
          <div>
            <h3>Marketing cookies</h3>
            <p>Reserved for future campaign attribution if enabled. Kept off by default until explicit opt-in consent.</p>
          </div>
          <CheckboxField
            id="pref-marketing"
            label={<span className="sr-only">Allow marketing cookies</span>}
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
          />
        </div>
      </div>
      <div className="dialog__foot">
        <Button variant="secondary" icon={null} onClick={rejectOptional}>
          Reject optional
        </Button>
        <Button variant="secondary" icon={null} onClick={acceptAll}>
          Accept all
        </Button>
        <Button icon={null} onClick={() => saveCustomPreferences({ analytics, marketing })}>
          Save preferences
        </Button>
      </div>
    </div>
  );
}

/** Consent preferences in a native <dialog>: focus trap, Esc, inert background and focus return are platform-provided. */
export default function PreferencesDialog() {
  const { preferencesOpen, closePreferences } = useCookieConsent();
  const handle = useRef<ModalDialogHandle>(null);

  // keep the native dialog in sync with the context flag
  useEffect(() => {
    if (preferencesOpen) handle.current?.open();
    else handle.current?.close();
  }, [preferencesOpen]);

  return (
    <ModalDialog label="Cookie preferences" className="dialog" handle={handle} onClose={closePreferences}>
      {preferencesOpen ? <PreferencesForm /> : null}
    </ModalDialog>
  );
}
