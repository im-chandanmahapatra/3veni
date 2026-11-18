'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import Button from '@/components/ui/Button';
import { SelectField, TextField, TextareaField } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import { sanitizeEnquiry, validateEnquiry } from '@/lib/enquiry/validation';
import type { Channel } from '@/lib/site';
import type { EnquiryErrors, EnquiryField, EnquiryResponse, EnquiryValues } from '@/types/enquiry';

interface EnquiryFormProps {
  /** options for "Interested in" (parcel names + general topics), validated on the server side of the page */
  interests: readonly string[];
  defaultInterest?: string;
  terrainOptions?: readonly string[];
  channels: { phone?: Channel; whatsapp?: Channel; email?: Channel };
  /** compact = dossier panel (name, phone, email, optional note; interest is fixed) */
  compact?: boolean;
  /** shown in the preview notice when no delivery channel is configured */
  deliveryConfigured: boolean;
  /** unique prefix so two forms can live on one page */
  idPrefix: string;
  submitLabel?: string;
}

type Phase = 'idle' | 'submitting' | 'success' | 'failed';

const ORDER: EnquiryField[] = ['fullName', 'phone', 'email', 'interestedIn', 'preferredLocation', 'message'];

/**
 * Enquiry form (audit C1/C5/M3): server-rendered markup (no Suspense bailout), validation with focus on the first
 * invalid field, double-submit guard, honest failure states that keep the visitor's input and offer direct channels,
 * success state with reference id and focus on the confirmation.
 */
export default function EnquiryForm({
  interests,
  defaultInterest,
  terrainOptions = [],
  channels,
  compact = false,
  deliveryConfigured,
  idPrefix,
  submitLabel = 'Submit enquiry',
}: EnquiryFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const [values, setValues] = useState<EnquiryValues>({
    fullName: '',
    phone: '',
    email: '',
    interestedIn: defaultInterest && interests.includes(defaultInterest) ? defaultInterest : (interests[0] ?? ''),
    preferredLocation: '',
    message: '',
    companyWebsite: '',
  });
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<EnquiryResponse | null>(null);

  // move focus to the confirmation once it is on screen, so screen-reader and keyboard users land on the outcome
  useEffect(() => {
    if (phase === 'success') successRef.current?.focus();
  }, [phase]);

  const id = (field: string) => `${idPrefix}-${field}`;
  const set = (field: keyof EnquiryValues) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field as EnquiryField]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusField = (field: EnquiryField) => {
    const el = formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(field))}`);
    el?.focus();
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === 'submitting') return;
    const clean = sanitizeEnquiry(values);
    const found = validateEnquiry(clean);
    if (Object.keys(found).length) {
      setErrors(found);
      const first = ORDER.find((f) => found[f]);
      if (first) focusField(first);
      return;
    }
    setErrors({});
    setPhase('submitting');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clean),
      });
      const body = (await res.json()) as EnquiryResponse;
      setResult(body);
      if (body.status === 'delivered') {
        setPhase('success');
      } else if (body.status === 'validation_error' && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setPhase('idle');
        const first = ORDER.find((f) => body.fieldErrors?.[f]);
        if (first) focusField(first);
      } else {
        setPhase('failed');
      }
    } catch {
      setResult({ status: 'error', delivered: false, message: 'We could not reach the server. Your details are still in the form — please check your connection and try again.' });
      setPhase('failed');
    }
  }

  if (phase === 'success' && result) {
    return (
      <div className="enquiry-success" role="status">
        <Icon name="check" className="enquiry-success__icon" />
        <h3 ref={successRef} tabIndex={-1} className="t-display-md">
          Enquiry received
        </h3>
        <p className="t-body">{result.message}</p>
        {result.referenceId ? (
          <p className="t-caption">
            Reference <strong className="t-numeric">{result.referenceId}</strong> — please quote it if you contact us.
          </p>
        ) : null}
        <Button
          variant="secondary"
          icon={null}
          onClick={() => {
            setPhase('idle');
            setResult(null);
            setValues((v) => ({ ...v, message: '' }));
          }}
        >
          Make another enquiry
        </Button>
      </div>
    );
  }

  const waText = `Hello 3VENI SPHERE, I would like to enquire about ${values.interestedIn || 'land plots'}.`;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="enquiry-form" aria-describedby={`${uid}-status`} data-testid="enquiry-form">
      {!deliveryConfigured ? (
        <div className="notice notice--preview" role="note">
          <Icon name="alert" />
          <p>
            <strong>Preview build.</strong> Enquiries are not delivered until an inbox or CRM is connected — you can still try the
            form; nothing will be lost.
          </p>
        </div>
      ) : null}

      <div id={`${uid}-status`} aria-live="polite">
        {phase === 'failed' && result ? (
          <div className="notice notice--error" role="alert">
            <Icon name="alert" />
            <div>
              <p>{result.message}</p>
              {channels.phone || channels.whatsapp || channels.email ? (
                <p className="enquiry-channels">
                  {channels.phone ? <a href={channels.phone.href}>Call {channels.phone.display}</a> : null}
                  {channels.whatsapp ? (
                    <a href={`${channels.whatsapp.href}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  ) : null}
                  {channels.email ? <a href={channels.email.href}>Email {channels.email.display}</a> : null}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* honeypot: invisible to people, tempting to bots; any value rejects the submission server-side */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id('company-website')}>Company website</label>
        <input id={id('company-website')} name="companyWebsite" tabIndex={-1} autoComplete="off" value={values.companyWebsite} onChange={set('companyWebsite')} />
      </div>

      <div className="enquiry-grid">
        <TextField
          id={id('fullName')}
          name="fullName"
          label="Full name"
          required
          autoComplete="name"
          placeholder="As on your ID"
          value={values.fullName}
          onChange={set('fullName')}
          error={errors.fullName}
        />
        <TextField
          id={id('phone')}
          name="phone"
          label="Phone number"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={set('phone')}
          error={errors.phone}
        />
        <TextField
          id={id('email')}
          name="email"
          label="Email address"
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@domain.com"
          className="enquiry-grid__wide"
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
        {compact ? null : (
          <>
            <SelectField id={id('interestedIn')} name="interestedIn" label="Interested in" required value={values.interestedIn} onChange={set('interestedIn')} error={errors.interestedIn}>
              {interests.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </SelectField>
            <SelectField id={id('preferredLocation')} name="preferredLocation" label="Preferred terrain / format" optional value={values.preferredLocation} onChange={set('preferredLocation')}>
              <option value="">No preference</option>
              {terrainOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </SelectField>
          </>
        )}
        <TextareaField
          id={id('message')}
          name="message"
          label="Message"
          optional
          className="enquiry-grid__wide"
          placeholder="Share preferred plot dimensions, questions, or ideal timing for a discussion…"
          value={values.message}
          onChange={set('message')}
          error={errors.message}
        />
      </div>

      <div className="enquiry-actions">
        <p className="t-caption">
          Fields marked “required” are needed so we can respond. Your details are used only to answer this enquiry.
        </p>
        <Button type="submit" size="lg" busy={phase === 'submitting'}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
