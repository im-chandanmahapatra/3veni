import localFont from 'next/font/local';

/**
 * Self-hosted fonts (DESIGN.md §5). Files live in ./fonts (see scripts/fetch-fonts.py, SIL OFL 1.1 licences alongside).
 * Critical path (preloaded): Newsreader 300 (display) ≈ 22 KB + Instrument Sans ≈ 29 KB.
 * Note: next/font only accepts literal option values, so the unicode-ranges are written inline.
 * Lazy (unicode-range, no preload): Newsreader 400, latin-ext (₹ and other symbols), Devanagari.
 * V1 shipped six files ≈ 274 KB from four families.
 */
/** Display serif, weight 300 — headings. Preloaded. */
export const newsreader = localFont({
  src: [{ path: './fonts/newsreader-300-latin.woff2', weight: '300', style: 'normal' }],
  variable: '--font-newsreader',
  display: 'swap',
  adjustFontFallback: 'Times New Roman',
  declarations: [
    { prop: 'font-family', value: 'Newsreader' },
    { prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
  ],
});

/** Same family, weight 400 (card titles, long-form h3). Not preloaded — only fetched when used. */
export const newsreaderRegular = localFont({
  src: [{ path: './fonts/newsreader-400-latin.woff2', weight: '400', style: 'normal' }],
  variable: '--font-newsreader-regular',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: 'font-family', value: 'Newsreader' },
    { prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
  ],
});

/** latin-ext for both weights: only downloaded when a glyph from these ranges (e.g. ₹) is rendered. */
export const newsreaderExt = localFont({
  src: [
    { path: './fonts/newsreader-300-latin-ext.woff2', weight: '300', style: 'normal' },
    { path: './fonts/newsreader-400-latin-ext.woff2', weight: '400', style: 'normal' },
  ],
  variable: '--font-newsreader-ext',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: 'font-family', value: 'Newsreader' },
    { prop: 'unicode-range', value: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  ],
});

/** UI + body sans, variable weight 400–600. Preloaded. */
export const instrumentSans = localFont({
  src: [{ path: './fonts/instrument-sans-400-600-latin.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-instrument',
  display: 'swap',
  adjustFontFallback: 'Arial',
  declarations: [
    { prop: 'font-family', value: 'Instrument Sans' },
    { prop: 'unicode-range', value: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD' },
  ],
});

export const instrumentSansExt = localFont({
  src: [{ path: './fonts/instrument-sans-400-600-latin-ext.woff2', weight: '400 600', style: 'normal' }],
  variable: '--font-instrument-ext',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: 'font-family', value: 'Instrument Sans' },
    { prop: 'unicode-range', value: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF' },
  ],
});

/** Devanagari motto lines (brand copy), serif to match the display. Lazy, never above the fold. */
export const notoDeva = localFont({
  src: [{ path: './fonts/noto-serif-devanagari-400-devanagari.woff2', weight: '400', style: 'normal' }],
  variable: '--font-noto-deva',
  display: 'swap',
  preload: false,
  adjustFontFallback: false,
  declarations: [
    { prop: 'font-family', value: 'Noto Serif Devanagari Web' },
    { prop: 'unicode-range', value: 'U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF, U+11B00-11B0A' },
  ],
});

/** All font CSS-variable classes, applied once on <html>. */
export const fontClassName = [
  newsreader.variable,
  newsreaderRegular.variable,
  newsreaderExt.variable,
  instrumentSans.variable,
  instrumentSansExt.variable,
  notoDeva.variable,
].join(' ');
