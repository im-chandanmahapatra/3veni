import nodemailer from 'nodemailer';
import { getEnquiryEnv, getEnquiryIntegration, type EnquiryEnv } from '@/lib/enquiry/config';
import type { EnquiryResponse, EnquiryValues } from '@/types/enquiry';

/**
 * Enquiry delivery (audit C1). Tries every configured channel (SMTP, CRM webhook); the enquiry counts as delivered
 * when at least one accepts it. With NO channel configured the result is an honest `not_configured` (HTTP 503) —
 * the UI never presents an undelivered enquiry as sent. Verified end-to-end against a local SMTP sink
 * (lib/__tests__/enquiry.integration.test.ts).
 */
export interface EnquiryResult {
  httpStatus: number;
  payload: EnquiryResponse;
}

export function createReferenceId(now: number = Date.now(), random: () => number = Math.random): string {
  const suffix = Math.floor(random() * 36 ** 3)
    .toString(36)
    .toUpperCase()
    .padStart(3, '0');
  return `3VN-${now.toString(36).toUpperCase()}${suffix}`;
}

export function buildEmailBody(values: EnquiryValues, referenceId: string, submittedAt: string): string {
  return [
    `Reference: ${referenceId}`,
    `Submitted: ${submittedAt}`,
    '',
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Interested in: ${values.interestedIn}`,
    `Preferred terrain / format: ${values.preferredLocation || '(not specified)'}`,
    '',
    'Message:',
    values.message || '(none)',
  ].join('\n');
}

async function deliverSmtp(values: EnquiryValues, referenceId: string, env: EnquiryEnv): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    ...(env.smtpUser ? { auth: { user: env.smtpUser, pass: env.smtpPass } } : {}),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  await transporter.sendMail({
    from: env.smtpFrom || env.smtpUser || env.recipientEmail,
    to: env.recipientEmail,
    replyTo: values.email,
    subject: `[3VENI SPHERE] Enquiry ${referenceId} - ${values.interestedIn}`,
    text: buildEmailBody(values, referenceId, new Date().toISOString()),
  });
}

async function deliverCrm(values: EnquiryValues, referenceId: string, env: EnquiryEnv): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (env.crmApiKey) headers.Authorization = `Bearer ${env.crmApiKey}`;
  const res = await fetch(env.crmWebhookUrl, {
    method: 'POST',
    headers,
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      referenceId,
      source: '3veni-sphere-web',
      submittedAt: new Date().toISOString(),
      lead: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        interestedIn: values.interestedIn,
        preferredLocation: values.preferredLocation,
        message: values.message,
      },
    }),
  });
  if (!res.ok) throw new Error(`CRM webhook responded with HTTP ${res.status}`);
}

export async function processEnquiry(values: EnquiryValues, envSource: NodeJS.ProcessEnv = process.env): Promise<EnquiryResult> {
  const env = getEnquiryEnv(envSource);
  const integration = getEnquiryIntegration(envSource);

  if (!integration.configured) {
    return {
      httpStatus: 503,
      payload: {
        status: 'not_configured',
        delivered: false,
        message:
          'This build is not connected to an inbox or CRM yet, so your enquiry was not sent. Nothing has been lost — your details are still in the form.',
      },
    };
  }

  const referenceId = createReferenceId();
  const failures: string[] = [];
  let email = false;
  let crm = false;

  if (integration.smtp) {
    try {
      await deliverSmtp(values, referenceId, env);
      email = true;
    } catch (err) {
      failures.push(`smtp: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }
  if (integration.crm) {
    try {
      await deliverCrm(values, referenceId, env);
      crm = true;
    } catch (err) {
      failures.push(`crm: ${err instanceof Error ? err.message : 'unknown error'}`);
    }
  }

  if (failures.length) console.error(`[enquiry ${referenceId}] delivery issue(s): ${failures.join(' | ')}`);

  if (!email && !crm) {
    return {
      httpStatus: 502,
      payload: {
        status: 'error',
        delivered: false,
        message:
          'We could not deliver your enquiry just now. Your details are still in the form — please try again in a moment or use the direct contact options.',
      },
    };
  }

  return {
    httpStatus: 200,
    payload: {
      status: 'delivered',
      delivered: true,
      referenceId,
      channels: { email, crm },
      message: `Thank you, ${values.fullName}. Your enquiry (reference ${referenceId}) has been received.`,
    },
  };
}
