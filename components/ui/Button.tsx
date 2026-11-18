import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

type Variant = 'primary' | 'secondary' | 'on-dark' | 'on-dark-outline';

interface CommonProps {
  variant?: Variant;
  size?: 'md' | 'lg';
  block?: boolean;
  /** trailing icon; `null` for none (default: arrow-right) */
  icon?: IconName | null;
  /** loading state: label hidden, spinner shown, width locked (DESIGN §8.1) */
  busy?: boolean;
  className?: string;
  children: ReactNode;
}

type AsButton = CommonProps & Omit<ComponentProps<'button'>, 'children' | 'className'> & { href?: undefined };
type AsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'href'> & { href: string; external?: boolean };

export function buttonClass({
  variant = 'primary',
  size = 'md',
  block,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'block' | 'className'>) {
  return ['btn', `btn--${variant}`, size === 'lg' ? 'btn--lg' : '', block ? 'btn--block' : '', className ?? '']
    .filter(Boolean)
    .join(' ');
}

const EXTERNAL = /^(https?:|mailto:|tel:)/i;

export default function Button(props: AsButton | AsLink) {
  const { variant = 'primary', size = 'md', block, icon = 'arrow-right', busy, className, children } = props;
  const cls = buttonClass({ variant, size, block, className });
  const content = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} nudge /> : null}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, ...rest } = props as AsLink;
    const linkProps = omit(rest, ['variant', 'size', 'block', 'icon', 'busy', 'className', 'children']);
    if (external || EXTERNAL.test(href)) {
      return (
        <a href={href} className={cls} {...(/^https?:/i.test(href) ? { rel: 'noopener noreferrer' } : {})}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { type = 'button', ...rest } = props as AsButton;
  const buttonProps = omit(rest, ['variant', 'size', 'block', 'icon', 'busy', 'className', 'children', 'href']);
  return (
    <button type={type} className={cls} aria-busy={busy || undefined} {...buttonProps}>
      {content}
    </button>
  );
}

function omit<T extends object>(obj: T, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) if (!keys.includes(k)) out[k] = v;
  return out;
}

/** Text link with an animated underline (DESIGN §8.1 "Text link"). */
export function ActionLink({
  href,
  children,
  icon = 'arrow-right',
  className,
  ...rest
}: { href: string; children: ReactNode; icon?: IconName | null; className?: string } & Omit<
  ComponentProps<typeof Link>,
  'href' | 'children' | 'className'
>) {
  const cls = ['link-action', className ?? ''].filter(Boolean).join(' ');
  const inner = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} nudge /> : null}
    </>
  );
  if (EXTERNAL.test(href)) {
    return (
      <a href={href} className={cls} {...(/^https?:/i.test(href) ? { rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
