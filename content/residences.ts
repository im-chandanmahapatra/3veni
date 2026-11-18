/**
 * Future-home concept studies (NOT for sale). Text is V1's existing client copy, verbatim.
 */
import { IMG } from '@/content/images';
import type { Residence } from '@/types/parcel';

export const RESIDENCES: readonly Residence[] = [
  {
    id: "home-mitti-courtyard",
    title: "Mitti Courtyard Residence",
    typology: "Contemporary Villa Concept",
    statusLabel: "Coming Soon · Future Collection",
    footprint: "Approx. 3,400 sq. ft. Concept Study",
    materials: ["Rammed Earth", "Honed Sandstone", "Seasoned Teak"],
    image: { src: IMG.mittiCourtyard, alt: "Minimalist rammed earth and teak courtyard villa with reflecting pool at golden hour", caption: "Mitti Courtyard Residence" },
    summary: "An exploratory residential concept built from compacted earth walls, deep cantilevered eaves, and a cooling courtyard reflecting basin.",
    note: "Conceived as an architectural study for future 3VENI SPHERE residential phases—prioritizing passive thermal comfort and indoor-outdoor continuity.",
  },
  {
    id: "home-shila-pavilion",
    title: "Shila Ridge Pavilion",
    typology: "Independent Home Study",
    statusLabel: "Coming Soon · Future Collection",
    footprint: "Approx. 2,850 sq. ft. Concept Study",
    materials: ["Split Basalt", "Travertine Terrace", "Timber Truss"],
    image: { src: IMG.shilaPavilion, alt: "Open-air stone and timber pavilion home overlooking rolling landscape at twilight", caption: "Shila Ridge Pavilion" },
    summary: "A single-level stone and timber sanctuary designed to open completely toward evening breezes and horizon views.",
    note: "Design direction exploring how future homeowners might pair local masonry craft with expansive glazed living halls.",
  },
  {
    id: "home-vana-verandah",
    title: "Vana Verandah House",
    typology: "Modern Courtyard Home",
    statusLabel: "Coming Soon · Future Collection",
    footprint: "Approx. 4,100 sq. ft. Concept Study",
    materials: ["Lime Plaster", "Terracotta Jali Screen", "Natural Stone Plinth"],
    image: { src: IMG.vanaVerandah, alt: "Shaded Indian teak verandah house with breathable lime plaster and terracotta jali lattice screen", caption: "Vana Verandah House" },
    summary: "Wrap-around shaded verandahs, perforated terracotta jali screens, and breathable lime-plastered rooms inspired by classical courtyard homes.",
    note: "Reserved exclusively for future residential development previews. Not currently open for bookings or sale.",
  },
];
