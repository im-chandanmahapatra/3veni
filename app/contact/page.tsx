import Link from 'next/link';
import { createPageMetadata } from '@/lib/metadata';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData';
import JsonLd from '@/components/ui/JsonLd';
import EnquirySection from '@/components/sections/EnquirySection';

export const metadata = createPageMetadata({
  title: 'Contact & Advisory Enquiry',
  description:
    'Connect with the 3VENI SPHERE advisory desk to discuss land plot typologies, dimensions, or future residential concepts.',
  path: '/contact',
});

export default function ContactPage() {
  const breadcrumb = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  return (
    <div className="pt-20 bg-[#EDE5D6] text-[#24221E]">
      <JsonLd data={breadcrumb} />

      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-12">
        <nav aria-label="Breadcrumb" className="text-xs text-[#5E554B] flex items-center gap-2">
          <Link href="/" className="hover:text-[#98400F] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#24221E] font-medium">Contact &amp; Enquiry</span>
        </nav>
      </div>

      <EnquirySection headingAsH1={true} />
    </div>
  );
}
