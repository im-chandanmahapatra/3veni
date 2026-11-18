import Hero from '@/components/home/Hero';
import Principles from '@/components/home/Principles';
import ProofRow from '@/components/home/ProofRow';
import FeaturedParcels from '@/components/home/FeaturedParcels';
import Method from '@/components/home/Method';
import TerrainLight from '@/components/home/TerrainLight';
import ResidencesTeaser from '@/components/home/ResidencesTeaser';
import GuideTeaser from '@/components/home/GuideTeaser';
import EnquiryBand from '@/components/home/EnquiryBand';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: '3VENI SPHERE — Contoured residential land plots & architecture',
  absoluteTitle: true,
  description:
    '3VENI SPHERE curates contoured residential land plots and future architectural living environments with transparent documentation and generational clarity.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Principles />
      <ProofRow />
      <FeaturedParcels />
      <Method />
      <TerrainLight />
      <ResidencesTeaser />
      <GuideTeaser />
      <EnquiryBand />
    </>
  );
}
