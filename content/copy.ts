/**
 * Shared editorial copy. All strings are V1's existing client copy, kept verbatim and regrouped (audit H8: each
 * message is now used once). Only the English translation captions for the Devanagari mottos (audit L7) and UI
 * microcopy are new; translations are literal renderings of the client's own lines.
 */
import { IMG } from '@/content/images';
import type { Plate } from '@/types/parcel';

export const STATEMENT = {
  heading: 'We treat residential land not as a commodity to be crowded, but as quiet ground worthy of patient architecture.',
  body: 'Grounded in the heritage craft of our circular emblem, 3VENI SPHERE pairs disciplined site evaluation with calm, transparent guidance—so buyers invest with clarity and long-term confidence.',
  motto: { hi: 'धरा की गरिमा · स्पष्ट स्वामित्व', en: 'The dignity of land · clear ownership' },
} as const;

export const PRINCIPLES = [
  { index: '01', title: 'Contour-Led Selection', detail: 'Natural drainage, elevation sightlines, and native shade canopy evaluated before any boundary line is proposed.' },
  { index: '02', title: 'Uncluttered Clarity', detail: 'Straightforward dimensions, frontage widths, and factual disclosures communicated cleanly from first enquiry.' },
  { index: '03', title: 'Land Today, Form Tomorrow', detail: 'Hold open, well-sited earth immediately while exploring architectural possibilities at your family pace.' },
] as const;

export const METHOD = {
  eyebrow: 'The 3VENI SPHERE philosophy',
  heading: 'Quiet diligence before every decision.',
  pillars: [
    { index: '01', title: 'Thoughtful Property Selection', description: 'Every parcel is evaluated for natural drainage, contour geometry, sunlight exposure, and long-term neighborhood coherence before presentation.' },
    { index: '02', title: 'Clear Property Information', description: 'Straightforward dimensions, frontage orientation, and boundary clarity—presented without obscured fine print or inflated claims.' },
    { index: '03', title: 'Customer-Focused Advisory', description: 'Guided one-on-one site walkthroughs and responsive advisory designed around your family timeline rather than high-pressure sales.' },
    { index: '04', title: 'A Considered Ownership Horizon', description: 'Rooted in our guiding ethos—Invest With Confidence—helping you hold tangible land today with clarity for what comes next.' },
  ],
} as const;

export const TERRAIN = {
  eyebrow: 'Terrain & lifestyle ethos',
  heading: 'Earth that breathes with morning light and open horizons.',
  body: 'Great land feels effortless before a single wall is raised. We look for settings where natural elevation, mature tree cover, and practical road access align—allowing future owners to experience countryside calm without disconnecting from essential urban infrastructure.',
  points: [
    { title: 'Natural Surroundings', text: 'Preserving existing native groves, stone ridges, and open sky sightlines so every parcel feels anchored in nature.' },
    { title: 'Thoughtful Accessibility', text: 'Clear approach avenues and practical transit connectivity suited to calm residential living and long-term holding.' },
    { title: 'Future Possibility', text: 'Unencumbered open canvas ready to hold a weekend pavilion, family courtyard home, or long-term land reserve.' },
  ],
} as const;

export const PLATES: readonly Plate[] = [
  {
    id: 'terraced-avenues',
    number: 'Plate 01',
    title: 'Contoured road access',
    caption: 'Tree-lined avenues proportioned for gentle grade transitions and natural shade.',
    src: IMG.aranyaRidge,
    alt: 'Sunlit terraced residential land plots framed by dry-stone walls and avenues',
    focal: [0.45, 0.5],
  },
  {
    id: 'twilight-pavilion',
    number: 'Plate 02',
    title: 'Twilight horizon study',
    caption: 'Open-air stone and timber terrace sited for uninterrupted sunset breezes.',
    src: IMG.shilaPavilion,
    alt: 'Stone and timber open-air pavilion overlooking twilight hills',
  },
  {
    id: 'laterite-plateau',
    number: 'Plate 03',
    title: 'Highland ridge topography',
    caption: 'Natural firm laterite ground holding panoramic morning valley mist.',
    src: IMG.shilaCrest,
    alt: 'Elevated laterite stone plateau overlooking misty valley ridges',
    focal: [0.5, 0.55],
  },
  {
    id: 'valley-enclosure',
    number: 'Plate 04',
    title: 'Hand-laid dry-stone boundary',
    caption: 'Permeable basalt and dry-stone boundaries preserving native meadow contours.',
    src: IMG.pranaValley,
    alt: 'Contoured valley land bordered by dry-stone walls and wildflowers',
  },
];

export const ENQUIRY_COPY = {
  eyebrow: 'Private enquiry',
  heading: 'Begin a conversation with 3VENI SPHERE.',
  body: 'Share your preferred plot size, land typology, or consultation timeline. Our advisory team will prepare relevant parcel layouts and official documentation when phases are active.',
  privacy: 'Submitted contact details are used solely to respond to your enquiry in accordance with our',
} as const;

export const FUTURE_NOTE = {
  eyebrow: 'Future collection · coming soon',
  heading: 'Architectural residences envisioned for future phases.',
  strong: 'Concept Preview:',
  body: 'Our core offering focuses on plotted land parcels. These residential studies illustrate future architectural direction and are',
  emphasis: 'not currently open for purchase',
} as const;

/** About page — V1 copy, verbatim (ABOUT_*), plus the V1 storytelling cadence that previously lived in the monograph section. */
export const ABOUT = {
  eyebrow: 'Stewardship & Ethos',
  heading: 'Land curation shaped by heritage, terrain, and patient trust.',
  motto: { hi: 'स्थिरता, संस्कृति और स्पष्ट विश्वास', en: 'Grounded in earth, built for generations.' },
  /** continues "<strong>3VENI SPHERE</strong> …" */
  intro: 'approaches residential land development with architectural restraint. Before proposing boundaries or road lines, we evaluate natural elevation, seasonal drainage, mature tree cover, and long-term livability.',
  /** continues "Our guiding commitment—<em>Invest With Confidence</em>—…" */
  commitment: 'means communicating dimensions, topography, and project documentation plainly, without speculative promises or visual clutter.',
  emblem: {
    heading: 'Our Cultural Emblem',
    body: 'The four-quadrant circular artwork of the 3VENI SPHERE emblem weaves together terracotta and deep olive botanical and community motifs—symbolizing harmony between land, craft, shelter, and enduring family continuity.',
  },
  material: { caption: 'Material archive · sandstone & rammed earth', alt: 'Honed sandstone steps and rammed earth boundary craft' },
} as const;

export const STORY = {
  motto: 'धरा · वास्तु · भविष्य',
  mottoEn: 'Earth · Architecture · Future',
  heading: 'First you hold the quiet earth; in time, the architecture follows.',
  steps: [
    { code: '01', title: 'Hold the Quiet Earth', note: 'Tangible plotted parcels selected for ridge drainage, elevation sightlines, and long-term horizon.' },
    { code: '02', title: 'Honor Existing Trees & Light', note: 'Avenue widths and block setbacks shaped around solar orientation and mature native shade cover.' },
    { code: '03', title: 'Let Architecture Follow', note: 'Build a seasonal pavilion or multi-generational residence at your own pace without urgency.' },
  ],
  caption: 'Earth · Form · Permanence — 3VENI SPHERE Material Study',
} as const;
