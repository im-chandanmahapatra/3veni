import test from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { startSink } from '../../scripts/smtp-sink.mjs';
import { processEnquiry, buildEmailBody, createReferenceId } from '@/lib/enquiry/service';
import { sanitizeEnquiry, validateEnquiry } from '@/lib/enquiry/validation';
import { clearRateLimitBucketsForTest } from '@/lib/rateLimit';
import { POST } from '@/app/api/enquiries/route';
import type { EnquiryValues } from '@/types/enquiry';

const VALID: EnquiryValues = {
  fullName: 'Test Buyer',
  phone: '+91 98765 43210',
  email: 'buyer@example.in',
  interestedIn: 'Aranya Ridge Terraces',
  preferredLocation: 'Elevated Ridge / Hillcrest Terraces',
  message: 'Interested in a site visit next month please.',
  companyWebsite: '',
};

function setEnv(env: Record<string, string | undefined>) {
  const saved: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) {
    saved[k] = process.env[k];
    if (env[k] === undefined) delete process.env[k];
    else process.env[k] = env[k];
  }
  return () => {
    for (const k of Object.keys(saved)) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k];
    }
  };
}

const CLEAR = {
  SMTP_HOST: undefined,
  SMTP_PORT: undefined,
  SMTP_USER: undefined,
  SMTP_PASS: undefined,
  SMTP_FROM: undefined,
  ENQUIRY_RECIPIENT_EMAIL: undefined,
  CONTACT_EMAIL: undefined,
  NEXT_PUBLIC_CONTACT_EMAIL: undefined,
  CRM_WEBHOOK_URL: undefined,
  CRM_API_KEY: undefined,
};

function post(body: unknown, ip: string) {
  return POST(
    new NextRequest('http://localhost/api/enquiries', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );
}

test('SMTP: a valid enquiry is delivered end-to-end to the local sink with reply-to, reference and full body', async () => {
  const sink = await startSink({ port: 0 });
  try {
    const result = await processEnquiry(VALID, {
      SMTP_HOST: '127.0.0.1',
      SMTP_PORT: String(sink.port),
      SMTP_USER: 'sink',
      SMTP_PASS: 'sink',
      SMTP_FROM: 'web@example.test',
      ENQUIRY_RECIPIENT_EMAIL: 'team@example.test',
    } as unknown as NodeJS.ProcessEnv);
    assert.equal(result.httpStatus, 200);
    assert.equal(result.payload.status, 'delivered');
    assert.equal(result.payload.delivered, true);
    assert.match(result.payload.referenceId ?? '', /^3VN-[0-9A-Z]{8,}$/);
    assert.deepEqual(result.payload.channels, { email: true, crm: false });

    assert.equal(sink.messages.length, 1);
    const raw: string = sink.messages[0].raw;
    assert.match(raw, /^From: .*web@example\.test/im);
    assert.match(raw, /^To: team@example\.test/im);
    assert.match(raw, /^Reply-To: buyer@example\.in/im);
    assert.match(raw, new RegExp(`^Subject: \\[3VENI SPHERE\\] Enquiry ${result.payload.referenceId} - Aranya Ridge Terraces`, 'im'));
    for (const fragment of ['Name: Test Buyer', 'Phone: +91 98765 43210', 'Email: buyer@example.in', 'Interested in: Aranya Ridge Terraces', 'site visit next month']) {
      assert.ok(raw.includes(fragment), `mail body must contain "${fragment}"`);
    }
  } finally {
    await sink.close();
  }
});

test('SMTP down: the enquiry is NOT reported as delivered (502) and the visitor keeps their input', async () => {
  const sink = await startSink({ port: 0 });
  const deadPort = sink.port;
  await sink.close();
  const result = await processEnquiry(VALID, {
    SMTP_HOST: '127.0.0.1',
    SMTP_PORT: String(deadPort),
    SMTP_USER: 'u',
    SMTP_PASS: 'p',
    ENQUIRY_RECIPIENT_EMAIL: 'team@example.test',
  } as unknown as NodeJS.ProcessEnv);
  assert.equal(result.httpStatus, 502);
  assert.equal(result.payload.delivered, false);
  assert.equal(result.payload.status, 'error');
  assert.equal(result.payload.referenceId, undefined);
});

test('CRM webhook: payload shape, bearer auth, and failure handling', async () => {
  const realFetch = globalThis.fetch;
  const calls: { url: string; init: RequestInit }[] = [];
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return new Response('ok', { status: 200 });
  }) as typeof fetch;
  try {
    const ok = await processEnquiry(VALID, { CRM_WEBHOOK_URL: 'https://crm.example.test/hook', CRM_API_KEY: 'k' } as unknown as NodeJS.ProcessEnv);
    assert.equal(ok.httpStatus, 200);
    assert.deepEqual(ok.payload.channels, { email: false, crm: true });
    assert.equal(calls.length, 1);
    assert.equal((calls[0]!.init.headers as Record<string, string>).Authorization, 'Bearer k');
    const body = JSON.parse(String(calls[0]!.init.body));
    assert.equal(body.lead.email, 'buyer@example.in');
    assert.equal(body.referenceId, ok.payload.referenceId);

    globalThis.fetch = (async () => new Response('nope', { status: 500 })) as typeof fetch;
    const failed = await processEnquiry(VALID, { CRM_WEBHOOK_URL: 'https://crm.example.test/hook' } as unknown as NodeJS.ProcessEnv);
    assert.equal(failed.httpStatus, 502);
    assert.equal(failed.payload.delivered, false);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('no channel configured: honest 503 "not_configured" — never "delivered"', async () => {
  const result = await processEnquiry(VALID, {} as NodeJS.ProcessEnv);
  assert.equal(result.httpStatus, 503);
  assert.equal(result.payload.status, 'not_configured');
  assert.equal(result.payload.delivered, false);
  assert.equal(result.payload.referenceId, undefined);
});

test('API route: validation, honeypot, bad JSON, rate limit and delivery', async () => {
  clearRateLimitBucketsForTest();
  const restore = setEnv(CLEAR);
  const sink = await startSink({ port: 0 });
  try {
    assert.equal((await post('not json', '198.51.100.1')).status, 400);
    assert.equal((await post([], '198.51.100.1')).status, 400);

    const empty = await post({}, '198.51.100.2');
    assert.equal(empty.status, 400);
    const emptyBody = await empty.json();
    assert.equal(emptyBody.status, 'validation_error');
    assert.ok(emptyBody.fieldErrors.fullName && emptyBody.fieldErrors.phone && emptyBody.fieldErrors.email && emptyBody.fieldErrors.interestedIn);

    const bot = await post({ ...VALID, companyWebsite: 'https://spam.example' }, '198.51.100.3');
    assert.equal(bot.status, 400);

    // no channel configured → 503
    const unconfigured = await post(VALID, '198.51.100.4');
    assert.equal(unconfigured.status, 503);
    assert.equal((await unconfigured.json()).status, 'not_configured');

    // configured → delivered through the route
    process.env.SMTP_HOST = '127.0.0.1';
    process.env.SMTP_PORT = String(sink.port);
    process.env.SMTP_USER = 'sink';
    process.env.SMTP_PASS = 'sink';
    process.env.ENQUIRY_RECIPIENT_EMAIL = 'team@example.test';
    const delivered = await post(VALID, '198.51.100.5');
    assert.equal(delivered.status, 200);
    const deliveredBody = await delivered.json();
    assert.equal(deliveredBody.status, 'delivered');
    assert.equal(sink.messages.length, 1);
    assert.equal(delivered.headers.get('cache-control'), 'no-store');

    // rate limit: 5 per 10 minutes per IP → the 6th is 429 with Retry-After
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) last = await post({}, '198.51.100.9');
    assert.equal(last!.status, 429);
    assert.ok(Number(last!.headers.get('retry-after')) > 0);
  } finally {
    await sink.close();
    restore();
    clearRateLimitBucketsForTest();
  }
});

test('validation + sanitising: control characters stripped, limits enforced', () => {
  const dirty = sanitizeEnquiry({ ...VALID, fullName: 'Eve\r\nBcc: evil@x.test', message: 'line one\nline two\u0000', interestedIn: 'x'.repeat(500) });
  assert.ok(!/[\r\n]/.test(dirty.fullName), 'header-injection newline removed from single-line fields');
  assert.equal(dirty.message, 'line one\nline two', 'newlines kept in the message, NULs removed');
  assert.equal(dirty.interestedIn.length, 140);
  assert.deepEqual(validateEnquiry(sanitizeEnquiry(VALID)), {});
  assert.ok(validateEnquiry(sanitizeEnquiry({ ...VALID, email: 'nope' })).email);
  assert.ok(validateEnquiry(sanitizeEnquiry({ ...VALID, phone: '123' })).phone);
  assert.ok(validateEnquiry(sanitizeEnquiry({ ...VALID, message: 'short' })).message);
  assert.equal(validateEnquiry(sanitizeEnquiry({ ...VALID, preferredLocation: '' })).preferredLocation, undefined, 'preferredLocation is optional in V2');
});

test('reference ids are unique-looking and the mail body is complete', () => {
  const a = createReferenceId(1_700_000_000_000, () => 0.5);
  const b = createReferenceId(1_700_000_000_001, () => 0.5);
  assert.notEqual(a, b);
  assert.match(a, /^3VN-/);
  const body = buildEmailBody(VALID, a, '2026-11-18T00:00:00.000Z');
  assert.ok(body.startsWith(`Reference: ${a}`));
  assert.ok(body.includes('Message:\nInterested in a site visit'));
});
