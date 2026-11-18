import Reveal from '@/components/ui/Reveal';
import Media from '@/components/ui/Media';
import { ActionLink } from '@/components/ui/Button';
import { IMG } from '@/content/images';
import { GUIDES } from '@/content/guides';

/** Guide teaser (plan B8): authority through content + internal linking (Knight Frank "Buying guides" pattern). */
export default function GuideTeaser() {
  const guide = GUIDES[0];
  if (!guide) return null;
  return (
    <section className="section section--sunken section--defer" aria-labelledby="guide-teaser-title">
      <div className="wrap guide-teaser">
        <Reveal className="guide-teaser__copy">
          <p className="t-overline">{guide.eyebrow}</p>
          <h2 id="guide-teaser-title" className="t-display-md">
            {guide.title}
          </h2>
          <p className="t-lead">{guide.metaDescription}</p>
          <ActionLink href={`/guides/${guide.slug}`}>Read the guide</ActionLink>
        </Reveal>
        <div className="guide-teaser__media">
          <Media src={IMG.earthStudy} alt="Honed sandstone steps and rammed earth garden wall in afternoon light" ratio="5/4" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
