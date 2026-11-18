import type { ReactNode } from 'react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/schema';

/** Shared shell for the three legal pages: breadcrumb, eyebrow, H1, governance notice, then prose sections. */
export default function LegalPage({
  title,
  eyebrow,
  path,
  notice,
  children,
}: {
  title: string;
  eyebrow: string;
  path: string;
  notice: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="page-top legal">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: title, path },
        ])}
      />
      <div className="wrap wrap--narrow">
        <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: title }]} />
        <p className="t-overline legal__eyebrow">{eyebrow}</p>
        <h1 className="t-display-lg">{title}</h1>
        <p className="notice legal__notice" role="note">
          <span>{notice}</span>
        </p>
        <div className="prose legal__body">{children}</div>
      </div>
      <div className="section--tight" />
    </article>
  );
}
