import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createConsentRecord,
  isCategoryConsented,
  parseStoredConsent,
} from '@/lib/cookieConsent';

test('cookieConsent creates strict opt-in records and validates stored payloads', () => {
  const fixedDate = new Date('2026-11-17T08:00:00.000Z');
  const record = createConsentRecord({ analytics: false, marketing: true, now: fixedDate });

  assert.equal(record.necessary, true);
  assert.equal(record.analytics, false);
  assert.equal(record.marketing, true);
  assert.equal(record.decidedAt, '2026-11-17T08:00:00.000Z');

  const parsed = parseStoredConsent(JSON.stringify(record));
  assert.deepEqual(parsed, record);

  assert.equal(isCategoryConsented(null, 'necessary'), true);
  assert.equal(isCategoryConsented(null, 'analytics'), false);
  assert.equal(isCategoryConsented(parsed, 'analytics'), false);
  assert.equal(isCategoryConsented(parsed, 'marketing'), true);

  assert.equal(parseStoredConsent('invalid-json'), null);
  assert.equal(parseStoredConsent(JSON.stringify({ version: 999 })), null);
});
