export interface PlotPolygonGeometry {
  plotId: string;
  code: string;
  points: string;
  labelX: number;
  labelY: number;
  elevationNote: string;
}

/**
 * Architectural SVG masterplan coordinates matching the 5 parcel typologies in LAND_PLOTS.
 */
export const PLOT_MAP_GEOMETRIES: PlotPolygonGeometry[] = [
  {
    plotId: 'plot-aranya-ridge',
    code: 'P-01',
    points: '92,98 258,76 276,178 106,196',
    labelX: 184,
    labelY: 136,
    elevationNote: 'RL +114m · Ridge Terrace',
  },
  {
    plotId: 'plot-vatika-banyan',
    code: 'P-02',
    points: '348,88 492,84 504,198 358,208',
    labelX: 426,
    labelY: 146,
    elevationNote: 'RL +106m · Dual Corner',
  },
  {
    plotId: 'plot-shila-plateau',
    code: 'P-03',
    points: '544,96 716,118 698,256 534,234',
    labelX: 624,
    labelY: 176,
    elevationNote: 'RL +121m · Crest Plateau',
  },
  {
    plotId: 'plot-prana-meadow',
    code: 'P-04',
    points: '96,262 296,246 318,392 108,402',
    labelX: 204,
    labelY: 326,
    elevationNote: 'RL +98m · 0.25 Acre',
  },
  {
    plotId: 'plot-taru-courtyard',
    code: 'P-05',
    points: '412,276 566,268 576,378 422,388',
    labelX: 494,
    labelY: 328,
    elevationNote: 'RL +103m · Orchard Edge',
  },
];
