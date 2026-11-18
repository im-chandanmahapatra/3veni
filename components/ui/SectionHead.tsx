import type { ReactNode } from 'react';

interface SectionHeadProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  /** heading level; exactly one h1 per page, h2 for sections */
  as?: 'h1' | 'h2' | 'h3';
  size?: 'lg' | 'md';
  id?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHead({ eyebrow, title, lead, as: Tag = 'h2', size = 'lg', id, className, children }: SectionHeadProps) {
  return (
    <div className={['section-head', className ?? ''].filter(Boolean).join(' ')}>
      {eyebrow ? <p className="t-overline">{eyebrow}</p> : null}
      <Tag id={id} className={size === 'lg' ? 't-display-lg' : 't-display-md'}>
        {title}
      </Tag>
      {lead ? <p className="t-lead max-w-[56ch]">{lead}</p> : null}
      {children}
    </div>
  );
}
