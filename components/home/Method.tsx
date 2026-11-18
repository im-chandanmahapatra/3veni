import Reveal from '@/components/ui/Reveal';
import { METHOD } from '@/content/copy';

/**
 * Method — the page's single night band (plan B5). Replaces V1's olive band: gold-on-olive was 3.7 : 1 (audit H9);
 * here numerals are brass-soft on night (10.4 : 1) and text is on-night (15 : 1).
 */
export default function Method() {
  return (
    <section className="section section--night on-dark" aria-labelledby="method-title">
      <div className="wrap">
        <Reveal className="section-head">
          <p className="t-overline">{METHOD.eyebrow}</p>
          <h2 id="method-title" className="t-display-lg">
            {METHOD.heading}
          </h2>
        </Reveal>
        <ol className="method">
          {METHOD.pillars.map((p, i) => (
            <Reveal as="li" key={p.index} delay={i * 70} className="method__item">
              <span className="method__index t-numeric">{p.index}</span>
              <h3 className="t-title">{p.title}</h3>
              <p className="t-body-sm">{p.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
