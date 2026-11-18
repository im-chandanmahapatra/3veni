import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import Icon from './Icon';

/**
 * Form field primitives (DESIGN §8.2): label above, "(required)" as text, hint + error linked with aria-describedby,
 * 52-px control, 16-px text. Errors never rely on colour alone (icon + text).
 */
interface FieldBase {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

function describedBy(id: string, hint: ReactNode, error?: string) {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return ids || undefined;
}

function Shell({ id, label, hint, error, required, optional, className, children }: FieldBase & { children: ReactNode }) {
  return (
    <div className={['field', className ?? ''].filter(Boolean).join(' ')}>
      <label htmlFor={id} className="field__label">
        {label} {required ? <small>(required)</small> : optional ? <small>(optional)</small> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          <Icon name="alert" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...input
}: FieldBase & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>) {
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <input
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...input}
      />
    </Shell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  children,
  ...select
}: FieldBase & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'>) {
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <select
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...select}
      >
        {children}
      </select>
    </Shell>
  );
}

export function TextareaField({
  id,
  label,
  hint,
  error,
  required,
  optional,
  className,
  ...area
}: FieldBase & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className'>) {
  return (
    <Shell id={id} label={label} hint={hint} error={error} required={required} optional={optional} className={className}>
      <textarea
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        required={required}
        {...area}
      />
    </Shell>
  );
}

export function CheckboxField({
  id,
  label,
  className,
  ...input
}: { id: string; label: ReactNode; className?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'className'>) {
  return (
    <label htmlFor={id} className={['check', className ?? ''].filter(Boolean).join(' ')}>
      <input id={id} type="checkbox" {...input} />
      <span>{label}</span>
    </label>
  );
}
