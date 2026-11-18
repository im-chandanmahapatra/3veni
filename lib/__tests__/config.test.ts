import test from 'node:test';
import assert from 'node:assert/strict';
import { getContentMode, isIndexable, resolveSiteUrl } from '@/lib/config';
import { buildEmail, buildPhone, buildWhatsApp, getSite } from '@/lib/site';
import { getEnquiryIntegration } from '@/lib/enquiry/config';
import { PLACEHOLDERS } from '@/content/placeholders';

function withEnv(env: Record<string, string | undefined>, fn: () => void) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) {
    saved[k] = process.env[k];
    if (env[k] === undefined) delete process.env[k];
    else process.env[k] = env[k];
  }
  try {
    fn();
  } finally {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  }
}

test('site URL: only a public https origin is "verified"; everything else falls back to localhost and is not indexable', () => {
  assert.deepEqual(resolveSiteUrl('https://www.example.in/some/path'), { url: 'https://www.example.in', verified: true });
  for (const bad of [undefined, '', 'http://example.in', 'https://localhost:3000', 'https://127.0.0.1', 'not a url', 'https://x.run.app']) {
    assert.equal(resolveSiteUrl(bad).verified, false, String(bad));
    assert.equal(resolveSiteUrl(bad).url, 'http://localhost:3000');
  }
});

test('indexing needs a verified domain AND live mode (or the explicit audit switch)', () => {
  withEnv({ NEXT_PUBLIC_SITE_URL: 'https://www.example.in', CONTENT_MODE: 'live', FORCE_INDEXABLE: undefined }, () => {
    assert.equal(getContentMode(), 'live');
    assert.equal(isIndexable(), true);
  });
  withEnv({ NEXT_PUBLIC_SITE_URL: 'https://www.example.in', CONTENT_MODE: undefined, FORCE_INDEXABLE: undefined }, () => {
    assert.equal(getContentMode(), 'preview');
    assert.equal(isIndexable(), false, 'preview builds must never be indexable');
  });
  withEnv({ NEXT_PUBLIC_SITE_URL: 'https://www.example.in', CONTENT_MODE: 'preview', FORCE_INDEXABLE: 'true' }, () => {
    assert.equal(isIndexable(), true);
  });
  withEnv({ NEXT_PUBLIC_SITE_URL: undefined, SITE_URL: undefined, CONTENT_MODE: 'live' }, () => {
    assert.equal(isIndexable(), false, 'live without a verified domain is still not indexable');
  });
});

test('contact channels are validated and never invented', () => {
  assert.equal(buildPhone(undefined), undefined);
  assert.equal(buildPhone('12'), undefined);
  assert.deepEqual(buildPhone('+91 98765 43210'), { display: '+91 98765 43210', href: 'tel:+919876543210' });
  assert.equal(buildEmail('nope'), undefined);
  assert.deepEqual(buildEmail('hello@example.in'), { display: 'hello@example.in', href: 'mailto:hello@example.in' });
  assert.deepEqual(buildWhatsApp('+91 98765 43210'), { display: '+91 98765 43210', href: 'https://wa.me/919876543210' });
  const empty = getSite({} as NodeJS.ProcessEnv);
  assert.equal(empty.hasChannel, false);
  assert.equal(empty.phone, undefined);
  assert.equal(empty.registeredEntityName, '3VENI SPHERE');
  const withEmail = getSite({ CONTACT_EMAIL: 'team@example.in' } as unknown as NodeJS.ProcessEnv);
  assert.equal(withEmail.hasChannel, true);
  assert.equal(withEmail.email?.href, 'mailto:team@example.in');
});

test('enquiry integration detection (SMTP auth optional but user/pass travel together)', () => {
  assert.deepEqual(getEnquiryIntegration({} as NodeJS.ProcessEnv), { smtp: false, crm: false, configured: false });
  const smtpOnly = getEnquiryIntegration({ SMTP_HOST: 'smtp.example.in', ENQUIRY_RECIPIENT_EMAIL: 'in@example.in' } as unknown as NodeJS.ProcessEnv);
  assert.equal(smtpOnly.smtp, true);
  const halfAuth = getEnquiryIntegration({ SMTP_HOST: 'h', ENQUIRY_RECIPIENT_EMAIL: 'a@b.co', SMTP_USER: 'u' } as unknown as NodeJS.ProcessEnv);
  assert.equal(halfAuth.smtp, false, 'user without password is a misconfiguration');
  assert.equal(getEnquiryIntegration({ CRM_WEBHOOK_URL: 'https://crm.example.in/hook' } as unknown as NodeJS.ProcessEnv).configured, true);
});

test('placeholder registry lists the critical launch blockers', () => {
  const critical = Object.values(PLACEHOLDERS).filter((p) => p.critical).map((p) => p.id).sort();
  assert.deepEqual(critical, ['contact-channels', 'domain', 'enquiry-delivery']);
});
