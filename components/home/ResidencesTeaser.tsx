import Reveal from '@/components/ui/Reveal';
import Badge from '@/components/ui/Badge';
import Media from '@/components/ui/Media';
import SectionHead from '@/components/ui/SectionHead';
import { ActionLink } from '@/components/ui/Button';
import { FUTURE_NOTE } from '@/content/copy';
import { RESIDENCES } from '@/content/residences';

/** Future residences teaser (plan B7, audit H11): compact row of concepts, clearly "not for sale", links to /future-homes. */
export default function ResidencesTeaser() {
  return (
    <section className="section section--defer" aria-labelledby="residences-title">
      <div className="wrap">
        <SectionHead id="residences-title" eyebrow={FUTURE_NOTE.eyebrow} title={FUTURE_NOTE.heading}>
          <p className="t-body notice notice--preview residences__note">
            <span>
              <strong>{FUTURE_NOTE.strong}</strong> {FUTURE_NOTE.body} <strong>{FUTURE_NOTE.emphasis}</strong>.
            </span>
          </p>
        </SectionHead>
        <ul className="residences">
          {RESIDENCES.map((r, i) => (
            <Reveal as="li" key={r.id} delay={i * 70} className="residence">
              <Media src={r.image.src} alt={r.image.alt} ratio="4/5" sizes="(min-width: 1024px) 28vw, (min-width: 768px) 30vw, 100vw" />
              <div className="residence__body">
                <Badge tone="night">Concept — not for sale</Badge>
                <h3 className="t-title">{r.title}</h3>
                <p className="t-caption">
                  {r.typology} · {r.footprint}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <div className="featured__more">
          <ActionLink href="/future-homes">Explore the future homes collection</ActionLink>
        </div>
      </div>
    </section>
  );
}
