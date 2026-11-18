export interface EnquiryValues {
  fullName: string;
  phone: string;
  email: string;
  /** which parcel / topic the visitor asked about (free text, ≤ 140 chars) */
  interestedIn: string;
  /** optional preferred terrain / format */
  preferredLocation: string;
  message: string;
  /** honeypot: real visitors never see or fill this field */
  companyWebsite: string;
}

export type EnquiryField = 'fullName' | 'phone' | 'email' | 'interestedIn' | 'preferredLocation' | 'message';
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

/**
 * delivered         at least one channel (SMTP / CRM) accepted the enquiry
 * not_configured    no delivery channel is configured (preview builds) — honest, never shown as "sent"
 * validation_error  400
 * rate_limited      429
 * error             502 (delivery failed) or 500
 */
export type EnquiryStatus = 'delivered' | 'not_configured' | 'validation_error' | 'rate_limited' | 'error';

export interface EnquiryResponse {
  status: EnquiryStatus;
  delivered: boolean;
  referenceId?: string;
  message: string;
  fieldErrors?: EnquiryErrors;
  channels?: { email: boolean; crm: boolean };
}
