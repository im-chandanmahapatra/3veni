import type { EnquiryErrors, EnquiryValues } from '@/types/enquiry';

/** strips control characters (header-injection / log-forging defence); newlines survive only in `message` */
function clean(value: unknown, max: number, keepNewlines = false): string {
  const s = String(value ?? '');
  const stripped = keepNewlines ? s.replace(/[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g, '') : s.replace(/[\u0000-\u001F\u007F]/g, ' ');
  return stripped.trim().slice(0, max);
}

export function sanitizeEnquiry(raw: Partial<Record<keyof EnquiryValues, unknown>>): EnquiryValues {
  return {
    fullName: clean(raw.fullName, 120),
    phone: clean(raw.phone, 32),
    email: clean(raw.email, 160),
    interestedIn: clean(raw.interestedIn, 140),
    preferredLocation: clean(raw.preferredLocation, 140),
    message: clean(raw.message, 1500, true),
    companyWebsite: clean(raw.companyWebsite, 200),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEnquiry(values: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {};

  const name = values.fullName.trim();
  if (!name) errors.fullName = 'Please enter your full name.';
  else if (name.length < 2) errors.fullName = 'Name must be at least 2 characters.';
  else if (name.length > 100) errors.fullName = 'Name must be 100 characters or fewer.';

  const digits = values.phone.replace(/[^\d]/g, '');
  if (!values.phone.trim()) errors.phone = 'Please provide a contact phone number.';
  else if (digits.length < 10 || digits.length > 15) errors.phone = 'Enter a valid 10 to 15 digit phone number.';

  const email = values.email.trim();
  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email) || email.length > 150) errors.email = 'Enter a valid email address, e.g. name@domain.com.';

  if (!values.interestedIn.trim()) errors.interestedIn = 'Please choose what you are enquiring about.';

  const note = values.message.trim();
  if (note.length > 0 && note.length < 8) errors.message = 'If you add a note, please write at least 8 characters.';
  else if (note.length > 1200) errors.message = 'Notes must be 1,200 characters or fewer.';

  return errors;
}

/** the interest options offered by the forms (parcel names + two general topics) */
export const GENERAL_INTERESTS = ['General Land Plot Advisory', 'Future Homes Collection Updates'] as const;

/** optional terrain/format choices (V1 values, kept verbatim) */
export const PREFERRED_LOCATIONS = [
  'Elevated Ridge / Hillcrest Terraces',
  'Wooded / Greenbelt Enclaves',
  'Orchard & Courtyard Clusters',
  'Open to Advisory Recommendation',
] as const;
