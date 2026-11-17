import { createPageMetadata } from '@/lib/metadata';
import HeroSection from '@/components/sections/HeroSection';
import BrandIntroSection from '@/components/sections/BrandIntroSection';
import FeaturedPlotsSection from '@/components/sections/FeaturedPlotsSection';
import AboutSection from '@/components/sections/AboutSection';
import LocationLifestyleSection from '@/components/sections/LocationLifestyleSection';
import VisualStorytellingSection from '@/components/sections/VisualStorytellingSection';
import WhyChooseSection from '@/components/sections/WhyChooseSection';
import FutureHomesSection from '@/components/sections/FutureHomesSection';
import EnquirySection from '@/components/sections/EnquirySection';

export const metadata = createPageMetadata({
  title: '3VENI SPHERE — Invest With Confidence | Plotted Land & Living Spaces',
  description:
    '3VENI SPHERE curates contoured residential land plots and future architectural living environments with transparent documentation and generational clarity.',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BrandIntroSection />
      <FeaturedPlotsSection sectionNumber="01" showPageLink={true} />
      <AboutSection />
      <LocationLifestyleSection />
      <VisualStorytellingSection />
      <WhyChooseSection />
      <FutureHomesSection showPageLink={true} />
      <EnquirySection />
    </>
  );
}
