import type { FutureHomeConcept, LandPlot } from '@/types/property';

/**
 * SAMPLE SHOWCASE PORTFOLIO DATA (DEMO INVENTORY MODE)
 * Represents parcel typologies and masterplan formats until verified client inventory
 * is connected. No binding prices, RERA numbers, deeds, or site addresses are claimed.
 */
export const LAND_PLOTS: LandPlot[] = [
  {
    id: 'plot-aranya-ridge',
    slug: 'aranya-ridge-terraces',
    name: 'Aranya Ridge Terraces',
    location: 'Sample Typology · North Hillcrest Corridor',
    regionLabel: 'Highland Terrace',
    category: 'Residential Plots',
    areaSqFt: 4800,
    areaDisplay: '4,800 sq. ft.',
    dimensions: '60 ft × 80 ft',
    facing: 'East / Morning Ridge',
    roadWidth: '40 ft Natural Stone Avenue',
    topography: 'Gently stepped natural contour with dry-stone retaining lines',
    priceDisplay: 'Shared Upon Advisory Consultation',
    availability: 'Sample Parcel · Open for Enquiry',
    image: '/images/plots/aranya-ridge.webp',
    imageAlt:
      'Terraced plotted land parcels along a tree-lined stone avenue in warm golden sunlight',
    galleryImages: [
      {
        src: '/images/plots/aranya-ridge.webp',
        alt: 'Terraced plotted land parcels along a tree-lined stone avenue in warm golden sunlight',
        caption: 'Terraced contour layout & stone-lined avenue',
      },
      {
        src: '/images/plots/earth-architecture-study.webp',
        alt: 'Honed sandstone steps and rammed earth garden wall in afternoon light',
        caption: 'Boundary stone & earth wall materiality study',
      },
      {
        src: '/images/homes/shila-pavilion.webp',
        alt: 'Open-air twilight pavilion overlooking terraced hills',
        caption: 'Future architectural horizon context',
      },
    ],
    shortDescription:
      'Elevated terraced parcels shaped along natural contour lines, framed by dry-stone boundaries and native avenue trees.',
    editorialOverview:
      'Designed around minimal earthwork and uninterrupted sightlines, Aranya Ridge Terraces illustrates how thoughtfully planned residential land preserves natural drainage and afternoon breeze corridors while welcoming bespoke architecture.',
    siteHighlights: [
      'Stepped contour grading planned for panoramic horizon views',
      'Dry-stone boundary demarcation with permeable gravel frontage',
      'Avenue plantation with native shade canopy species',
      'Generous 60 ft frontage suited to courtyard home layouts',
    ],
    isFeaturedWide: true,
    isIllustrative: true,
  },
  {
    id: 'plot-vatika-banyan',
    slug: 'vatika-banyan-corner',
    name: 'Vatika Banyan Corner',
    location: 'Sample Typology · East Grove Sector',
    regionLabel: 'Wooded Corner',
    category: 'Corner Parcels',
    areaSqFt: 3600,
    areaDisplay: '3,600 sq. ft.',
    dimensions: '60 ft × 60 ft',
    facing: 'North-East Dual Frontage',
    roadWidth: '30 ft & 40 ft Intersecting Lanes',
    topography: 'Level loam terrain anchored by mature banyan and neem canopy',
    priceDisplay: 'Shared Upon Advisory Consultation',
    availability: 'Sample Parcel · Corner Format',
    image: '/images/plots/vatika-banyan.webp',
    imageAlt:
      'Corner residential land plot framed by mature banyan and neem trees and dry-stone wall',
    galleryImages: [
      {
        src: '/images/plots/vatika-banyan.webp',
        alt: 'Corner residential land plot framed by mature banyan and neem trees and dry-stone wall',
        caption: 'Dual-aspect corner beneath heritage banyan canopy',
      },
      {
        src: '/images/plots/earth-architecture-study.webp',
        alt: 'Natural stone and rammed earth boundary craft',
        caption: 'Suggested dry-stone & earth perimeter expression',
      },
    ],
    shortDescription:
      'Dual-aspect corner parcel sheltered beneath mature banyan foliage with low hand-laid stone perimeters.',
    editorialOverview:
      'A corner land format offering two open setbacks for natural cross-ventilation and daylighting. Built around existing heritage canopy rather than clearing it, this typology prioritizes shade, privacy, and tactile earth boundaries.',
    siteHighlights: [
      'Dual road frontage enabling flexible architectural entry points',
      'Preserved mature banyan and neem shade perimeter',
      'Hand-stacked dry-stone boundary wall concept',
      'Square proportion well-suited to Vastu-conscious floor plates',
    ],
    isIllustrative: true,
  },
  {
    id: 'plot-shila-plateau',
    slug: 'shila-laterite-crest',
    name: 'Shila Laterite Crest',
    location: 'Sample Typology · West Horizon Belt',
    regionLabel: 'Plateau Crest',
    category: 'Corner Parcels',
    areaSqFt: 6200,
    areaDisplay: '6,200 sq. ft.',
    dimensions: '77.5 ft × 80 ft',
    facing: 'North / Valley Vista',
    roadWidth: '36 ft Compacted Earth & Stone Track',
    topography: 'Elevated laterite-stone plateau overlooking distant misty ridges',
    priceDisplay: 'Shared Upon Advisory Consultation',
    availability: 'Sample Parcel · Corner Format',
    image: '/images/plots/shila-crest.webp',
    imageAlt:
      'Elevated plateau land plot with stone boundary pillars overlooking distant misty valleys',
    galleryImages: [
      {
        src: '/images/plots/shila-crest.webp',
        alt: 'Elevated plateau land plot with stone boundary pillars overlooking distant misty valleys',
        caption: 'Plateau crest vantage & cut-stone boundary pillars',
      },
      {
        src: '/images/homes/shila-pavilion.webp',
        alt: 'Twilight hillside pavilion view',
        caption: 'Evening ridge light & open terrace orientation',
      },
    ],
    shortDescription:
      'Expansive plateau crest parcel offering wide-angle valley views and firm laterite-stone sub-base.',
    editorialOverview:
      'Positioned on a sunlit highland shelf, Shila Laterite Crest invites low-slung stone and timber pavilions that open onto uninterrupted valley mist. Cut-stone boundary pillars mark the full perimeter.',
    siteHighlights: [
      'Unobstructed 180-degree western valley orientation',
      'Firm natural laterite soil foundation profile',
      'Cut-stone pillar demarcation across all corners',
      'Deep setback potential for terrace decks and gardens',
    ],
    isIllustrative: true,
  },
  {
    id: 'plot-prana-meadow',
    slug: 'prana-valley-sanctuary',
    name: 'Prana Valley Sanctuary',
    location: 'Sample Typology · Southern Foothills',
    regionLabel: 'Valley Acreage',
    category: 'Estate Acreage',
    areaSqFt: 10890,
    areaDisplay: '10,890 sq. ft. (0.25 Acre)',
    dimensions: '90 ft × 121 ft',
    facing: 'East / Meadow Slope',
    roadWidth: '30 ft Countryside Access Trail',
    topography: 'Rolling green pasture enclosed by traditional stone walling',
    priceDisplay: 'Shared Upon Advisory Consultation',
    availability: 'Sample Parcel · Acreage Study',
    image: '/images/plots/prana-valley.webp',
    imageAlt:
      'Quarter-acre green valley land parcel with hand-laid basalt perimeter wall and wildflowers',
    galleryImages: [
      {
        src: '/images/plots/prana-valley.webp',
        alt: 'Quarter-acre green valley land parcel with hand-laid basalt perimeter wall and wildflowers',
        caption: 'Rolling valley acreage & continuous dry-stone enclosure',
      },
      {
        src: '/images/homes/vana-verandah.webp',
        alt: 'Shaded courtyard verandah inspiration',
        caption: 'Compatible homestead courtyard potential',
      },
    ],
    shortDescription:
      'Quarter-acre meadow sanctuary envisioned for private family estates, kitchen gardens, and slow living.',
    editorialOverview:
      'For buyers seeking generous room beyond conventional suburban plots, Prana Valley Sanctuary illustrates low-density land stewardship—surrounded by wildflowers, stone walls, and quiet horizon lines.',
    siteHighlights: [
      'Quarter-acre footprint suited to multi-pavilion homesteads',
      'Continuous basalt and sandstone perimeter wall',
      'Gentle slope ideal for rainwater harvesting swales',
      'Surrounded by open greenbelt vistas',
    ],
    isIllustrative: true,
  },
  {
    id: 'plot-taru-courtyard',
    slug: 'taru-ochre-enclave',
    name: 'Taru Ochre Enclave',
    location: 'Sample Typology · Central Orchard Edge',
    regionLabel: 'Orchard Plot',
    category: 'Residential Plots',
    areaSqFt: 2800,
    areaDisplay: '2,800 sq. ft.',
    dimensions: '40 ft × 70 ft',
    facing: 'South-East Sunlight',
    roadWidth: '30 ft Sandstone-Curbed Lane',
    topography: 'Level orchard ground with warm ochre topsoil',
    priceDisplay: 'Shared Upon Advisory Consultation',
    availability: 'Sample Parcel · Open for Enquiry',
    image: '/images/plots/taru-ochre.webp',
    imageAlt:
      'Sunlit level residential land parcel bordered by sandstone curbs and young orchard groves',
    galleryImages: [
      {
        src: '/images/plots/taru-ochre.webp',
        alt: 'Sunlit level residential land parcel bordered by sandstone curbs and young orchard groves',
        caption: 'Level orchard-edge parcel in morning sunlight',
      },
      {
        src: '/images/homes/mitti-courtyard.webp',
        alt: 'Minimalist courtyard residence study',
        caption: 'Compatible compact courtyard home footprint',
      },
    ],
    shortDescription:
      'Accessible, thoughtfully proportioned residential parcel bordering sunlit orchard groves and sandstone curbs.',
    editorialOverview:
      'Taru Ochre Enclave demonstrates an entry-friendly residential footprint without sacrificing light, natural greenery, or clean streetscape character. Suited for single-family homes built in unhurried phases.',
    siteHighlights: [
      'Balanced 40 × 70 proportion minimizing wasted circulation',
      'Direct frontage along sandstone-curbed neighborhood lane',
      'Positioned for morning solar exposure across living zones',
      'Clean rectangular parcel geometry for straightforward planning',
    ],
    isIllustrative: true,
  },
];

/**
 * FUTURE HOMES COLLECTION (CONCEPTUAL STUDIES ONLY)
 * Clearly marked as Coming Soon / Future Collection — NOT currently available for booking or sale.
 */
export const FUTURE_HOMES: FutureHomeConcept[] = [
  {
    id: 'home-mitti-courtyard',
    title: 'Mitti Courtyard Residence',
    typology: 'Contemporary Villa Concept',
    conceptStatus: 'Coming Soon · Future Collection',
    indicativeFootprint: 'Approx. 3,400 sq. ft. Concept Study',
    materialPalette: ['Rammed Earth', 'Honed Sandstone', 'Seasoned Teak'],
    image: '/images/homes/mitti-courtyard.webp',
    imageAlt:
      'Minimalist rammed earth and teak courtyard villa with reflecting pool at golden hour',
    summary:
      'An exploratory residential concept built from compacted earth walls, deep cantilevered eaves, and a cooling courtyard reflecting basin.',
    architecturalNote:
      'Conceived as an architectural study for future 3VENI SPHERE residential phases—prioritizing passive thermal comfort and indoor-outdoor continuity.',
    isIllustrative: true,
  },
  {
    id: 'home-shila-pavilion',
    title: 'Shila Ridge Pavilion',
    typology: 'Independent Home Study',
    conceptStatus: 'Coming Soon · Future Collection',
    indicativeFootprint: 'Approx. 2,850 sq. ft. Concept Study',
    materialPalette: ['Split Basalt', 'Travertine Terrace', 'Timber Truss'],
    image: '/images/homes/shila-pavilion.webp',
    imageAlt: 'Open-air stone and timber pavilion home overlooking rolling landscape at twilight',
    summary:
      'A single-level stone and timber sanctuary designed to open completely toward evening breezes and horizon views.',
    architecturalNote:
      'Design direction exploring how future homeowners might pair local masonry craft with expansive glazed living halls.',
    isIllustrative: true,
  },
  {
    id: 'home-vana-verandah',
    title: 'Vana Verandah House',
    typology: 'Modern Courtyard Home',
    conceptStatus: 'Coming Soon · Future Collection',
    indicativeFootprint: 'Approx. 4,100 sq. ft. Concept Study',
    materialPalette: ['Lime Plaster', 'Terracotta Jali Screen', 'Natural Stone Plinth'],
    image: '/images/homes/vana-verandah.webp',
    imageAlt:
      'Shaded Indian teak verandah house with breathable lime plaster and terracotta jali lattice screen',
    summary:
      'Wrap-around shaded verandahs, perforated terracotta jali screens, and breathable lime-plastered rooms inspired by classical courtyard homes.',
    architecturalNote:
      'Reserved exclusively for future residential development previews. Not currently open for bookings or sale.',
    isIllustrative: true,
  },
];

export const PREFERRED_LOCATIONS: string[] = [
  'Elevated Ridge / Hillcrest Terraces',
  'Wooded / Greenbelt Enclaves',
  'Orchard & Courtyard Clusters',
  'Open to Advisory Recommendation',
];

export function getPlotBySlug(slug: string): LandPlot | undefined {
  return LAND_PLOTS.find((plot) => plot.slug === slug);
}
