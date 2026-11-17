'use client';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import {
  CONSENT_STORAGE_KEY,
  createConsentRecord,
  isCategoryConsented,
  parseStoredConsent,
} from '@/lib/cookieConsent';
import type { CookieConsentPreferences } from '@/lib/cookieConsent';

interface CookieConsentContextValue {
  consent: CookieConsentPreferences | null;
  hydrated: boolean;
  bannerVisible: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  saveCustomPreferences: (options: { analytics: boolean; marketing: boolean }) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  hasConsentFor: (category: 'necessary' | 'analytics' | 'marketing') => boolean;
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

const consentListeners = new Set<() => void>();

function notifyConsentListeners() {
  consentListeners.forEach((listener) => listener());
}

function subscribeConsentStorage(listener: () => void) {
  consentListeners.add(listener);
  if (typeof window === 'undefined') {
    return () => {
      consentListeners.delete(listener);
    };
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_STORAGE_KEY || e.key === null) {
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    consentListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getConsentStorageSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerConsentSnapshot(): string | null {
  return null;
}

function subscribeHydration() {
  return () => {};
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const rawStoredConsent = useSyncExternalStore(
    subscribeConsentStorage,
    getConsentStorageSnapshot,
    getServerConsentSnapshot
  );
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false
  );
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const consent = useMemo(() => parseStoredConsent(rawStoredConsent), [rawStoredConsent]);

  const persistConsent = useCallback((next: CookieConsentPreferences) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Safe fallback when storage is restricted
    }
    notifyConsentListeners();
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent(createConsentRecord({ analytics: true, marketing: true }));
    setPreferencesOpen(false);
  }, [persistConsent]);

  const rejectOptional = useCallback(() => {
    persistConsent(createConsentRecord({ analytics: false, marketing: false }));
    setPreferencesOpen(false);
  }, [persistConsent]);

  const saveCustomPreferences = useCallback(
    (options: { analytics: boolean; marketing: boolean }) => {
      persistConsent(createConsentRecord(options));
      setPreferencesOpen(false);
    },
    [persistConsent]
  );

  const openPreferences = useCallback(() => setPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setPreferencesOpen(false), []);

  const hasConsentFor = useCallback(
    (category: 'necessary' | 'analytics' | 'marketing') => isCategoryConsented(consent, category),
    [consent]
  );

  const bannerVisible = hydrated && consent === null && !preferencesOpen;

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hydrated,
        bannerVisible,
        preferencesOpen,
        acceptAll,
        rejectOptional,
        saveCustomPreferences,
        openPreferences,
        closePreferences,
        hasConsentFor,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
