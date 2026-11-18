import Reveal from '@/components/ui/Reveal';
import { ActionLink } from '@/components/ui/Button';
import { PRINCIPLES, STATEMENT } from '@/content/copy';

/** Positioning statement + three principles (plan B3): the brand idea, once (audit H8). */
export default function Principles() {
  return (
    <section className="section section--defer" aria-labelledby="statement-title">
      <div className="wrap">
        <Reveal className="statement">
          <div className="statement__aside">
            <p className="t-overline">Brand ethos</p>
            <p className="t-deva statement__motto" lang="hi">
              {STATEMENT.motto.hi}
            </p>
            <p className="t-caption" lang="en">
              {STATEMENT.motto.en}
            </p>
          </div>
          <div className="statement__main">
            <h2 id="statement-title" className="t-display-lg">
              {STATEMENT.heading}
            </h2>
            <p className="t-lead">{STATEMENT.body}</p>
            <div className="statement__links">
              <ActionLink href="/about">Read our stewardship philosophy</ActionLink>
              <ActionLink href="/guides/land-buying-checklist">Land buying checklist</ActionLink>
            </div>
          </div>
        </Reveal>

        <ol className="principles">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.index} delay={i * 80} className="principle">
              <span className="principle__index t-numeric">{p.index}</span>
              <h3 className="t-title">{p.title}</h3>
              <p className="t-body-sm">{p.detail}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
