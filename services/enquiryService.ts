import nodemailer from 'nodemailer';
import { buildMailtoHref, buildWhatsAppHref } from '@/config/siteConfig';
import type { EnquiryApiResponse, EnquiryFormValues } from '@/types/property';

interface ServerEnquiryEnv {
  crmWebhookUrl: string;
  crmApiKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  recipientEmail: string;
  publicEmail: string;
  publicWhatsApp: string;
}

function getServerEnquiryEnv(): ServerEnquiryEnv {
  return {
    crmWebhookUrl: (process.env.CRM_WEBHOOK_URL || '').trim(),
    crmApiKey: (process.env.CRM_API_KEY || '').trim(),
    smtpHost: (process.env.SMTP_HOST || '').trim(),
    smtpPort: Number(process.env.SMTP_PORT || '587') || 587,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: (process.env.SMTP_USER || '').trim(),
    smtpPass: (process.env.SMTP_PASS || '').trim(),
    smtpFrom: (process.env.SMTP_FROM || process.env.SMTP_USER || '').trim(),
    recipientEmail: (
      process.env.ENQUIRY_RECIPIENT_EMAIL ||
      process.env.CONTACT_EMAIL ||
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
      ''
    ).trim(),
    publicEmail: (process.env.CONTACT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || '').trim(),
    publicWhatsApp: (
      process.env.WHATSAPP_NUMBER ||
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
      ''
    ).trim(),
  };
}

export function getEnquiryIntegrationStatus() {
  const env = getServerEnquiryEnv();
  const crmConfigured = Boolean(env.crmWebhookUrl);
  const smtpConfigured = Boolean(
    env.smtpHost && env.smtpUser && env.smtpPass && env.recipientEmail
  );

  return {
    crmConfigured,
    smtpConfigured,
    whatsappConfigured: Boolean(env.publicWhatsApp),
    emailDirectConfigured: Boolean(env.publicEmail),
  };
}

function buildDirectFallback(values: EnquiryFormValues, env: ServerEnquiryEnv) {
  const bodyLines = [
    `Hello 3VENI SPHERE,`,
    ``,
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Interested In: ${values.interestedIn}`,
    `Preferred Format / Location: ${values.preferredLocation}`,
    values.message ? `Notes: ${values.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return {
    whatsappHref: buildWhatsAppHref(env.publicWhatsApp, bodyLines),
    mailtoHref: buildMailtoHref(
      env.publicEmail,
      `3VENI SPHERE Enquiry: ${values.interestedIn}`,
      bodyLines
    ),
  };
}

async function deliverToCrmWebhook(
  values: EnquiryFormValues,
  referenceId: string,
  env: ServerEnquiryEnv
): Promise<boolean> {
  if (!env.crmWebhookUrl) return false;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (env.crmApiKey) {
    headers.Authorization = `Bearer ${env.crmApiKey}`;
  }

  const response = await fetch(env.crmWebhookUrl, {
    method: 'POST',
    headers,
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      referenceId,
      source: '3veni-sphere-web-v2',
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

  if (!response.ok) {
    throw new Error(`CRM webhook responded with HTTP ${response.status}`);
  }
  return true;
}

async function deliverViaSmtp(
  values: EnquiryFormValues,
  referenceId: string,
  env: ServerEnquiryEnv
): Promise<boolean> {
  if (!(env.smtpHost && env.smtpUser && env.smtpPass && env.recipientEmail)) {
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
  });

  await transporter.sendMail({
    from: env.smtpFrom || env.smtpUser,
    to: env.recipientEmail,
    replyTo: values.email,
    subject: `[3VENI SPHERE] Property Enquiry (${referenceId}) — ${values.interestedIn}`,
    text: [
      `Reference: ${referenceId}`,
      `Name: ${values.fullName}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Interested In: ${values.interestedIn}`,
      `Preferred Land Format: ${values.preferredLocation}`,
      `Message: ${values.message || '(none)'}`,
    ].join('\n'),
  });

  return true;
}

export async function processEnquirySubmission(
  values: EnquiryFormValues
): Promise<{ httpStatus: number; payload: EnquiryApiResponse }> {
  const env = getServerEnquiryEnv();
  const integrationStatus = getEnquiryIntegrationStatus();
  const directFallback = buildDirectFallback(values, env);

  if (!integrationStatus.crmConfigured && !integrationStatus.smtpConfigured) {
    return {
      httpStatus: 503,
      payload: {
        status: 'unconfigured_direct_only',
        delivered: false,
        message:
          'Automated CRM and email delivery are not yet connected on this server. Your details have been validated and prepared below so nothing is lost—please copy this summary or use an active direct contact channel.',
        directFallback,
      },
    };
  }

  const referenceId = `3VN-${Date.now().toString(36).toUpperCase()}`;
  let crmDelivered = false;
  let emailDelivered = false;
  const deliveryErrors: string[] = [];

  if (integrationStatus.crmConfigured) {
    try {
      crmDelivered = await deliverToCrmWebhook(values, referenceId, env);
    } catch (err) {
      deliveryErrors.push(err instanceof Error ? err.message : 'CRM webhook error');
    }
  }

  if (integrationStatus.smtpConfigured) {
    try {
      emailDelivered = await deliverViaSmtp(values, referenceId, env);
    } catch (err) {
      deliveryErrors.push(err instanceof Error ? err.message : 'SMTP delivery error');
    }
  }

  if (!crmDelivered && !emailDelivered) {
    console.error('[3VENI Enquiry Delivery Failure]', deliveryErrors.join(' | '));
    return {
      httpStatus: 502,
      payload: {
        status: 'error',
        delivered: false,
        message:
          'We could not complete automated transmission of your enquiry right now. Please try again shortly or copy your validated details below.',
        directFallback,
      },
    };
  }

  return {
    httpStatus: 200,
    payload: {
      status: 'delivered',
      delivered: true,
      referenceId,
      channels: {
        crm: crmDelivered,
        email: emailDelivered,
      },
      message: `Thank you, ${values.fullName}. Your enquiry (Reference ${referenceId}) has been received for advisory review.`,
      directFallback,
    },
  };
}
