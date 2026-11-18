import Image from 'next/image';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Button, { ActionLink } from '@/components/ui/Button';
import ClientSlot from '@/components/ui/ClientSlot';
import Media from '@/components/ui/Media';
import Reveal from '@/components/ui/Reveal';
import Method from '@/components/home/Method';
import ProofRow from '@/components/home/ProofRow';
import EnquiryBand from '@/components/home/EnquiryBand';
import JsonLd from '@/components/seo/JsonLd';
import { ABOUT, STORY } from '@/content/copy';
import { IMG } from '@/content/images';
import { LEADERSHIP } from '@/content/proof';
import { breadcrumbJsonLd } from '@/lib/schema';
import { buildMetadata } from '@/lib/seo';
import { getSite } from '@/lib/site';

export const metadata = buildMetadata({
  title: 'About 3VENI SPHERE — Stewardship & Ethos',
  description: 'Learn how 3VENI SPHERE approaches residential plotted land development with contour-led planning, clarity, and enduring trust.',
  path: '/about',
  image: { path: '/og/about.jpg', alt: 'Honed sandstone steps and rammed earth boundary craft' },
});

export default function AboutPage() {
  const site = getSite();
  return (
    <div>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <section className="page-top about-head">
        <div className="wrap">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'About' }]} />
          <div className="about-head__grid">
            <div>
              <p className="t-overline">{ABOUT.eyebrow}</p>
              <h1 className="t-display-xl">{ABOUT.heading}</h1>
              <p className="t-deva about-head__motto" lang="hi">
                {ABOUT.motto.hi}
              </p>
              <p className="t-caption">{ABOUT.motto.en}</p>
            </div>
            <div className="about-head__copy">
              <p className="t-lead">
                <strong>{site.brandName}</strong> {ABOUT.intro}
              </p>
              <p className="t-lead">
                Our guiding commitment—<em>Invest With Confidence</em>—{ABOUT.commitment}
              </p>
              <div className="about-head__actions">
                <Button href="/projects">Explore land projects</Button>
                <ActionLink href="/guides/land-buying-checklist">Read the buyer due-diligence guide</ActionLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sunken" aria-labelledby="emblem-title">
        <div className="wrap emblem-block">
          <div className="emblem-block__card">
            <Image src={IMG.emblem} alt="3VENI SPHERE official circular emblem" width={112} height={112} className="emblem-block__emblem" />
            <h2 id="emblem-title" className="t-display-md">
              {ABOUT.emblem.heading}
            </h2>
            <p className="t-body">{ABOUT.emblem.body}</p>
            <dl className="spec-rows">
              <div>
                <dt>Brand identity</dt>
                <dd>{site.registeredEntityName}</dd>
              </div>
              <div>
                <dt>Core discipline</dt>
                <dd>{site.serviceFocusLabel}</dd>
              </div>
            </dl>
          </div>
          <figure className="emblem-block__figure">
            <Media src={IMG.earthStudy} alt={ABOUT.material.alt} ratio="16/10" sizes="(min-width: 1024px) 58vw, 100vw" />
            <figcaption className="t-caption">{ABOUT.material.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="section story" aria-labelledby="story-title">
        <div className="wrap">
          <p className="t-deva story__motto" lang="hi">
            {STORY.motto}
          </p>
          <p className="t-caption story__motto-en">{STORY.mottoEn}</p>
          <h2 id="story-title" className="t-display-lg story__title">
            {STORY.heading}
          </h2>
          <ol className="story__steps">
            {STORY.steps.map((s, i) => (
              <Reveal as="li" key={s.code} delay={i * 70}>
                <span className="t-numeric story__code">{s.code}</span>
                <h3 className="t-title">{s.title}</h3>
                <p className="t-body-sm">{s.note}</p>
              </Reveal>
            ))}
          </ol>
          <p className="t-caption story__caption">{STORY.caption}</p>
        </div>
      </section>

      <Method />

      <ProofRow />

      <section className="section--tight" aria-label="Leadership and registration">
        <div className="wrap about-slots">
          {LEADERSHIP.length ? (
            <ul className="people">
              {LEADERSHIP.map((p) => (
                <li key={p.name}>
                  <h3 className="t-title">{p.name}</h3>
                  <p className="t-caption">{p.role}</p>
                  {p.bio ? <p className="t-body-sm">{p.bio}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <ClientSlot id="leadership" />
          )}
          {site.reraNumbers.length || site.cin ? (
            <dl className="spec-rows">
              {site.cin ? (
                <div>
                  <dt>CIN</dt>
                  <dd>{site.cin}</dd>
                </div>
              ) : null}
              {site.reraNumbers.map((r) => (
                <div key={r}>
                  <dt>RERA registration</dt>
                  <dd>{r}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <ClientSlot id="registration" />
          )}
        </div>
      </section>

      <EnquiryBand idPrefix="about" />
    </div>
  );
}
