/**
 * Buyer guides. The text of the "Land Buying Checklist & Plot Due Diligence Guide" is V1's existing client copy,
 * kept verbatim (checklist sections, FAQs, intro). The guide data model supports more guides: add an entry here.
 * Legal accuracy of any new guide must be reviewed by the client (open question Q14).
 */
export interface GuideSection {
  index: string;
  title: string;
  summary: string;
  points: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  /** page <title> (the site template appends the brand) */
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  faqs: GuideFaq[];
  /** ISO date of the last editorial review */
  updatedAt: string;
}

const CHECKLIST_SECTIONS: GuideSection[] = [
  {
    index: '01',
    title: 'Plot Dimensions, Proportions & Setback Usability',
    summary:
      'Total square footage alone does not determine buildability. Examine frontage width relative to plot depth and municipal setback requirements.',
    points: [
      'Measure clear frontage width (for example, 40 ft or 60 ft) so parking, entry landscaping, and natural light corridors fit comfortably.',
      'Compare rectangular proportions (such as 40 × 70 or 60 × 80) against square corner formats (60 × 60) depending on courtyard vs. linear house designs.',
      'Check for irregular corner chamfers or road-widening reservations that reduce net usable footprint.',
    ],
  },
  {
    index: '02',
    title: 'Topography, Soil Profile & Natural Drainage',
    summary:
      'Walk the ground during both dry light and monsoon conditions to verify water flow paths and foundation soil stability.',
    points: [
      'Inspect elevation levels across the parcel relative to adjoining avenues so surface runoff drains outward rather than pooling inside the plot.',
      'Evaluate topsoil vs. firmer strata (such as natural laterite or compacted sub-base) to anticipate foundation depth requirements.',
      'Note mature trees worth preserving within courtyard pockets or perimeter setbacks before finalizing site clearing.',
    ],
  },
  {
    index: '03',
    title: 'Approach Road Width & Corner Access',
    summary:
      'Access widths directly affect daily comfort, utility trenching, emergency vehicle turning radii, and permissible Floor Area Ratio (FAR).',
    points: [
      'Confirm physical constructed width and recorded right-of-way width (30 ft, 36 ft, or 40 ft internal avenues) across the entire approach path.',
      'Verify whether corner plots carry dual road access rules or dual-side setback obligations under local building bylaws.',
      'Confirm provision for underground electrical ducting, water supply lines, and stormwater drains along the avenue.',
    ],
  },
  {
    index: '04',
    title: 'Ownership Chain & Statutory Documentation',
    summary:
      'Before committing capital, insist on verifiable title records, encumbrance checks, and applicable regulatory clearances reviewed by independent legal counsel.',
    points: [
      'Review historical chain of title deeds, mutation records, and non-encumbrance certificates covering the full statutory search period.',
      'Verify conversion/land-use classification for residential construction and inspect sanctioned layout plans where required.',
      'Confirm applicable state real estate registration (RERA where mandated for the project scale) and match survey numbers on ground with physical demarcation pillars.',
    ],
  },
];

const FAQS: GuideFaq[] = [
  {
    question: 'Why does frontage width matter as much as total plot area?',
    answer:
      'Two plots of equal area can behave very differently during house design. A wider frontage allows generous daylighting, dual cross-ventilation, and separate pedestrian and vehicle access without wasting interior circulation space.',
  },
  {
    question: 'What physical checks should I perform during a site visit?',
    answer:
      'Confirm physical corner boundary stones against the survey sketch, check elevation differences relative to the adjoining road crown, observe afternoon wind and sun orientation, and inspect approach road connectivity.',
  },
  {
    question: 'Does 3VENI SPHERE provide legal or financial guarantees in this guide?',
    answer:
      'No. This checklist is an educational buyer reference highlighting standard evaluation questions. Always engage qualified legal and technical surveyors to verify official title deeds and local statutory approvals prior to purchase.',
  },
];

export const GUIDES: readonly Guide[] = [
  {
    slug: 'land-buying-checklist',
    metaTitle: 'Land Buying Checklist & Plot Due Diligence Guide',
    metaDescription:
      'Practical guidance for buyers evaluating plotted residential land: contour drainage, road widths, plot dimensions, boundary demarcation, and statutory verification.',
    eyebrow: 'Buyer Due-Diligence Guide',
    title: 'How to evaluate a plotted residential parcel before acquiring land.',
    intro:
      'Investing with confidence begins with asking disciplined questions about terrain, plot geometry, access width, and ownership documentation. Use this structured checklist during your site walkthroughs and advisory reviews.',
    sections: CHECKLIST_SECTIONS,
    faqs: FAQS,
    updatedAt: '2026-11-18',
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
