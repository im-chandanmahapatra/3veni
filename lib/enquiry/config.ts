/** Enquiry delivery configuration (server-only values; nothing here is ever sent to the browser). */
export interface EnquiryEnv {
  crmWebhookUrl: string;
  crmApiKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  recipientEmail: string;
}

export function getEnquiryEnv(env: NodeJS.ProcessEnv = process.env): EnquiryEnv {
  const t = (v: string | undefined) => (v ?? '').trim();
  return {
    crmWebhookUrl: t(env.CRM_WEBHOOK_URL),
    crmApiKey: t(env.CRM_API_KEY),
    smtpHost: t(env.SMTP_HOST),
    smtpPort: Number(t(env.SMTP_PORT) || '587') || 587,
    smtpSecure: t(env.SMTP_SECURE) === 'true',
    smtpUser: t(env.SMTP_USER),
    smtpPass: t(env.SMTP_PASS),
    smtpFrom: t(env.SMTP_FROM) || t(env.SMTP_USER),
    recipientEmail: t(env.ENQUIRY_RECIPIENT_EMAIL) || t(env.CONTACT_EMAIL) || t(env.NEXT_PUBLIC_CONTACT_EMAIL),
  };
}

export interface EnquiryIntegration {
  /** SMTP host + recipient present (auth optional, but user and pass must come together) */
  smtp: boolean;
  /** CRM webhook URL present */
  crm: boolean;
  /** at least one delivery channel is configured */
  configured: boolean;
}

export function getEnquiryIntegration(env: NodeJS.ProcessEnv = process.env): EnquiryIntegration {
  const e = getEnquiryEnv(env);
  const smtp = Boolean(e.smtpHost && e.recipientEmail && (e.smtpUser ? e.smtpPass : true));
  const crm = Boolean(e.crmWebhookUrl);
  return { smtp, crm, configured: smtp || crm };
}
