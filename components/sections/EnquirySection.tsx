'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Loader2,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { LAND_PLOTS, PREFERRED_LOCATIONS } from '@/data/properties';
import { SITE_CONFIG, buildWhatsAppHref } from '@/config/siteConfig';
import { validateEnquiryForm } from '@/lib/propertyFilters';
import type {
  EnquiryApiResponse,
  EnquiryFormValues,
  EnquiryValidationErrors,
} from '@/types/property';
import { QuadrantWatermarkCorner, SphereCrestDivider } from '@/components/ui/BrandMotifs';
import { EditorialHeadingReveal, EditorialReveal } from '@/components/ui/ScrollReveal';

interface EnquirySectionProps {
  initialInterest?: string;
  headingAsH1?: boolean;
}

function EnquirySectionInner({
  initialInterest = '',
  headingAsH1 = false,
}: EnquirySectionProps) {
  const searchParams = useSearchParams();
  const queryInterest = searchParams.get('interest') || initialInterest;
  const headingTag = headingAsH1 ? 'h1' : 'h2';

  const [userEditedInterest, setUserEditedInterest] = useState<string | null>(null);
  const effectiveInterestedIn = userEditedInterest || queryInterest || LAND_PLOTS[0]!.name;

  const [values, setValues] = useState<Omit<EnquiryFormValues, 'interestedIn'>>({
    fullName: '',
    phone: '',
    email: '',
    preferredLocation: PREFERRED_LOCATIONS[0]!,
    message: '',
    companyWebsite: '',
  });

  const [errors, setErrors] = useState<EnquiryValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResult, setApiResult] = useState<EnquiryApiResponse | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  useEffect(() => {
    const onSelectInterest = (e: Event) => {
      const custom = e as CustomEvent<string>;
      if (custom.detail) {
        setUserEditedInterest(custom.detail);
        setApiResult(null);
      }
    };
    window.addEventListener('3veni:select-interest', onSelectInterest);
    return () => window.removeEventListener('3veni:select-interest', onSelectInterest);
  }, []);

  const currentValues: EnquiryFormValues = {
    ...values,
    interestedIn: effectiveInterestedIn,
  };

  const handleChange = (field: keyof EnquiryFormValues, nextValue: string) => {
    if (field === 'interestedIn') {
      setUserEditedInterest(nextValue);
    } else {
      setValues((prev) => ({ ...prev, [field]: nextValue }));
    }
    if (field !== 'companyWebsite' && errors[field as keyof EnquiryValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiResult && apiResult.status !== 'delivered') {
      setApiResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateEnquiryForm(currentValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setApiResult(null);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentValues),
      });

      const payload = (await res.json()) as EnquiryApiResponse;
      if (payload.fieldErrors) {
        setErrors(payload.fieldErrors);
      }
      setApiResult(payload);
    } catch {
      setApiResult({
        status: 'error',
        delivered: false,
        message:
          'A network error interrupted your submission. Please verify your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedSummary = [
    `3VENI SPHERE Advisory Enquiry`,
    `Name: ${currentValues.fullName}`,
    `Phone: ${currentValues.phone}`,
    `Email: ${currentValues.email}`,
    `Interested In: ${currentValues.interestedIn}`,
    `Preferred Format: ${currentValues.preferredLocation}`,
    currentValues.message ? `Message: ${currentValues.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummary);
      setCopiedSummary(true);
      window.setTimeout(() => setCopiedSummary(false), 2500);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
  };

  const directWhatsApp = buildWhatsAppHref(
    SITE_CONFIG.publicWhatsApp,
    'Hello 3VENI SPHERE, I would like to enquire about land developments.'
  );

  return (
    <section
      id="contact"
      className="bg-[#EDE5D6] text-[#24221E] py-24 lg:py-32 border-b border-[#D8CEBC]"
    >
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <SphereCrestDivider
          tone="light"
          folioLabel="CHAPTER 06 · ADVISORY DESK"
          className="mb-14"
        />

        <EditorialReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#98400F] mb-3">
              06. Private Enquiry
            </p>
            <EditorialHeadingReveal
              as={headingTag}
              segments={[{ text: 'Begin a conversation with 3VENI SPHERE.' }]}
              className="font-editorial text-[clamp(2.25rem,3.9vw,3.5rem)] leading-[1.04] font-normal tracking-[-0.015em] text-balance"
            />
            <p className="mt-5 text-[15px] leading-[1.7] text-[#493023]">
              Share your preferred plot size, land typology, or consultation timeline. Our advisory
              team will prepare relevant parcel layouts and official documentation when phases are
              active.
            </p>

            <div className="mt-10 pt-8 border-t border-[#D8CEBC] space-y-5">
              {SITE_CONFIG.publicEmail && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#5E554B]">
                    Direct Email Channel
                  </p>
                  <a
                    href={`mailto:${SITE_CONFIG.publicEmail}`}
                    className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#24221E] hover:text-[#98400F]"
                  >
                    <Mail className="w-4 h-4 text-[#98400F]" aria-hidden="true" />
                    <span>{SITE_CONFIG.publicEmail}</span>
                  </a>
                </div>
              )}

              {directWhatsApp && (
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#5E554B]">
                    WhatsApp Advisory
                  </p>
                  <a
                    href={directWhatsApp}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-[#24221E] hover:text-[#41490D]"
                  >
                    <MessageSquare className="w-4 h-4 text-[#41490D]" aria-hidden="true" />
                    <span>{SITE_CONFIG.publicWhatsApp}</span>
                  </a>
                </div>
              )}

              <div className="p-4 bg-[#F6F1E7] border border-[#D8CEBC] text-xs text-[#5E554B] leading-relaxed">
                <p className="font-semibold text-[#24221E] uppercase tracking-[0.1em] mb-1">
                  Privacy Commitment
                </p>
                <p>
                  Submitted contact details are used solely to respond to your enquiry in accordance
                  with our{' '}
                  <Link
                    href="/privacy-policy"
                    className="text-[#98400F] underline underline-offset-4 hover:text-[#7A310A]"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-7 bg-[#F6F1E7] travertine-grid-surface border border-[#D8CEBC] p-7 sm:p-10 overflow-hidden">
            <QuadrantWatermarkCorner
              tone="terracotta"
              className="absolute top-2.5 right-2.5"
            />
            {apiResult?.status === 'delivered' ? (
              <div role="status" aria-live="polite" data-testid="enquiry-delivered" className="py-4">
                <div className="flex items-start gap-3 text-[#41490D]">
                  <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-editorial text-3xl font-medium text-[#24221E]">
                      Enquiry Received
                    </h3>
                    <p className="mt-2 text-sm text-[#493023] leading-relaxed">
                      {apiResult.message}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-5 bg-[#EDE5D6] border border-[#D8CEBC] text-sm space-y-2">
                  {apiResult.referenceId && (
                    <p>
                      <span className="text-[#5E554B]">Reference ID:</span>{' '}
                      <span className="font-mono text-xs font-semibold text-[#24221E]">
                        {apiResult.referenceId}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="text-[#5E554B]">Interest:</span>{' '}
                    <span className="font-medium text-[#24221E]">{currentValues.interestedIn}</span>
                  </p>
                  <p>
                    <span className="text-[#5E554B]">Preferred Format:</span>{' '}
                    <span className="font-medium text-[#24221E]">{currentValues.preferredLocation}</span>
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setApiResult(null);
                      setUserEditedInterest(LAND_PLOTS[0]!.name);
                      setValues({
                        fullName: '',
                        phone: '',
                        email: '',
                        preferredLocation: PREFERRED_LOCATIONS[0]!,
                        message: '',
                        companyWebsite: '',
                      });
                    }}
                    className="px-5 py-3 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              </div>
            ) : apiResult?.status === 'unconfigured_direct_only' ? (
              <div
                role="status"
                aria-live="polite"
                data-testid="enquiry-unconfigured-notice"
                className="py-2"
              >
                <div className="flex items-start gap-3 text-[#98400F]">
                  <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-editorial text-3xl font-medium text-[#24221E]">
                      Direct Channel Required
                    </h3>
                    <p className="mt-2 text-sm text-[#493023] leading-relaxed">
                      {apiResult.message}
                    </p>
                  </div>
                </div>

                <pre className="mt-6 p-5 bg-[#EDE5D6] border border-[#D8CEBC] text-xs font-mono text-[#24221E] whitespace-pre-wrap leading-relaxed">
                  {formattedSummary}
                </pre>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#24221E] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#98400F] transition-colors"
                  >
                    {copiedSummary ? (
                      <>
                        <Check className="w-4 h-4" aria-hidden="true" />
                        <span>Summary Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" aria-hidden="true" />
                        <span>Copy Enquiry Summary</span>
                      </>
                    )}
                  </button>

                  {apiResult.directFallback?.whatsappHref && (
                    <a
                      href={apiResult.directFallback.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 bg-[#41490D] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#343B0A] transition-colors"
                    >
                      Continue via WhatsApp
                    </a>
                  )}

                  {apiResult.directFallback?.mailtoHref && (
                    <a
                      href={apiResult.directFallback.mailtoHref}
                      className="px-5 py-3 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#7A310A] transition-colors"
                    >
                      Open Email Client
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setApiResult(null)}
                    className="px-5 py-3 border border-[#24221E] text-[#24221E] text-xs font-semibold tracking-[0.1em] uppercase hover:bg-[#24221E] hover:text-[#F6F1E7] transition-colors"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                {apiResult && (
                  <div
                    role="alert"
                    className="p-4 bg-[#FEE2E2] border border-[#B91C1C]/40 text-xs sm:text-sm text-[#7F1D1D] flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{apiResult.message}</span>
                  </div>
                )}

                {/* Honeypot anti-spam field hidden from real users */}
                <div aria-hidden="true" className="hidden">
                  <label htmlFor="enquiry-company-website">Company Website</label>
                  <input
                    id="enquiry-company-website"
                    name="companyWebsite"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.companyWebsite || ''}
                    onChange={(e) => handleChange('companyWebsite', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enquiry-full-name"
                      className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                    >
                      Full Name <span className="text-[#98400F]">*</span>
                    </label>
                    <input
                      id="enquiry-full-name"
                      name="fullName"
                      type="text"
                      required
                      value={values.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'error-full-name' : undefined}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 bg-white border text-sm text-[#24221E] focus:outline-none ${
                        errors.fullName
                          ? 'border-[#B91C1C]'
                          : 'border-[#D8CEBC] focus:border-[#98400F]'
                      }`}
                    />
                    {errors.fullName && (
                      <p id="error-full-name" role="alert" className="mt-1.5 text-xs text-[#991B1B]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-phone"
                      className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                    >
                      Phone Number <span className="text-[#98400F]">*</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      required
                      value={values.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'error-phone' : undefined}
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-3 bg-white border text-sm text-[#24221E] focus:outline-none ${
                        errors.phone
                          ? 'border-[#B91C1C]'
                          : 'border-[#D8CEBC] focus:border-[#98400F]'
                      }`}
                    />
                    {errors.phone && (
                      <p id="error-phone" role="alert" className="mt-1.5 text-xs text-[#991B1B]">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                  >
                    Email Address <span className="text-[#98400F]">*</span>
                  </label>
                  <input
                    id="enquiry-email"
                    name="email"
                    type="email"
                    required
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'error-email' : undefined}
                    placeholder="you@domain.com"
                    className={`w-full px-4 py-3 bg-white border text-sm text-[#24221E] focus:outline-none ${
                      errors.email
                        ? 'border-[#B91C1C]'
                        : 'border-[#D8CEBC] focus:border-[#98400F]'
                    }`}
                  />
                  {errors.email && (
                    <p id="error-email" role="alert" className="mt-1.5 text-xs text-[#991B1B]">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="enquiry-interest"
                      className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                    >
                      Interested In <span className="text-[#98400F]">*</span>
                    </label>
                    <select
                      id="enquiry-interest"
                      name="interestedIn"
                      value={currentValues.interestedIn}
                      onChange={(e) => handleChange('interestedIn', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#D8CEBC] text-sm text-[#24221E] focus:outline-none focus:border-[#98400F]"
                    >
                      {LAND_PLOTS.map((plot) => (
                        <option key={plot.id} value={plot.name}>
                          {plot.name} ({plot.areaDisplay})
                        </option>
                      ))}
                      <option value="General Land Plot Advisory">General Land Plot Advisory</option>
                      <option value="Future Homes Collection Updates">
                        Future Homes Collection Updates
                      </option>
                      {!LAND_PLOTS.some((p) => p.name === currentValues.interestedIn) &&
                        currentValues.interestedIn !== 'General Land Plot Advisory' &&
                        currentValues.interestedIn !== 'Future Homes Collection Updates' && (
                          <option value={currentValues.interestedIn}>
                            {currentValues.interestedIn}
                          </option>
                        )}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="enquiry-location"
                      className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                    >
                      Preferred Terrain / Format <span className="text-[#98400F]">*</span>
                    </label>
                    <select
                      id="enquiry-location"
                      name="preferredLocation"
                      value={values.preferredLocation}
                      onChange={(e) => handleChange('preferredLocation', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#D8CEBC] text-sm text-[#24221E] focus:outline-none focus:border-[#98400F]"
                    >
                      {PREFERRED_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="enquiry-message"
                    className="block text-xs font-semibold tracking-[0.1em] uppercase text-[#493023] mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="enquiry-message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'error-message' : undefined}
                    placeholder="Share preferred plot dimensions, questions, or ideal timing for a discussion..."
                    className={`w-full px-4 py-3 bg-white border text-sm text-[#24221E] focus:outline-none resize-y ${
                      errors.message
                        ? 'border-[#B91C1C]'
                        : 'border-[#D8CEBC] focus:border-[#98400F]'
                    }`}
                  />
                  {errors.message && (
                    <p id="error-message" role="alert" className="mt-1.5 text-xs text-[#991B1B]">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-[#5E554B]">
                    <span className="text-[#98400F]">*</span> Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#98400F] text-[#F6F1E7] text-xs font-semibold tracking-[0.12em] uppercase hover:bg-[#7A310A] disabled:opacity-70 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Enquiry</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}

export default function EnquirySection(props: EnquirySectionProps) {
  return (
    <Suspense
      fallback={
        <section id="contact" className="bg-[#EDE5D6] py-20 lg:py-28 border-b border-[#D8CEBC]">
          <div className="max-w-[1320px] mx-auto px-5 sm:px-8 text-sm text-[#5E554B]">
            Loading enquiry form...
          </div>
        </section>
      }
    >
      <EnquirySectionInner {...props} />
    </Suspense>
  );
}
