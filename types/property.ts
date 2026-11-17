export type PlotCategory = 'All' | 'Residential Plots' | 'Corner Parcels' | 'Estate Acreage';

export type PlotAvailability =
  | 'Sample Parcel · Open for Enquiry'
  | 'Sample Parcel · Corner Format'
  | 'Sample Parcel · Acreage Study';

export type PlotSortOption = 'featured' | 'area-desc' | 'area-asc';

export interface PropertyGalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export interface LandPlot {
  id: string;
  slug: string;
  name: string;
  location: string;
  regionLabel: string;
  category: Exclude<PlotCategory, 'All'>;
  areaSqFt: number;
  areaDisplay: string;
  dimensions: string;
  facing: string;
  roadWidth: string;
  topography: string;
  priceDisplay: string;
  availability: PlotAvailability;
  image: string;
  imageAlt: string;
  galleryImages: PropertyGalleryImage[];
  shortDescription: string;
  editorialOverview: string;
  siteHighlights: string[];
  isFeaturedWide?: boolean;
  isIllustrative: true;
}

export interface FutureHomeConcept {
  id: string;
  title: string;
  typology: string;
  conceptStatus: 'Coming Soon · Future Collection';
  indicativeFootprint: string;
  materialPalette: string[];
  image: string;
  imageAlt: string;
  summary: string;
  architecturalNote: string;
  isIllustrative: true;
}

export interface EnquiryFormValues {
  fullName: string;
  phone: string;
  email: string;
  interestedIn: string;
  preferredLocation: string;
  message: string;
  companyWebsite?: string; // Honeypot field — must stay empty
}

export interface EnquiryValidationErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  interestedIn?: string;
  preferredLocation?: string;
  message?: string;
}

export interface EnquiryApiResponse {
  status: 'delivered' | 'unconfigured_direct_only' | 'validation_error' | 'rate_limited' | 'error';
  delivered: boolean;
  referenceId?: string;
  message: string;
  channels?: {
    crm: boolean;
    email: boolean;
  };
  fieldErrors?: EnquiryValidationErrors;
  directFallback?: {
    whatsappHref: string | null;
    mailtoHref: string | null;
  };
}
