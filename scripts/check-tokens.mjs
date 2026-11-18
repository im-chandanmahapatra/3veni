// Design-token lint (DESIGN.md §1 principle 5, audit RC4: V1 had 940 arbitrary hex classes and 59 arbitrary px text sizes).
// Fails when UI code bypasses the tokens: arbitrary hex colours, arbitrary pixel text sizes, rounded corners other than a circle.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN = ['app', 'components'];
const SKIP_DIRS = new Set(['node_modules', '.next', 'fonts']);
// V1 leftovers that are deleted in the cleanup commit; they are the only paths allowed to violate the rules.
const LEGACY = [
  'components/sections/',
  'components/navigation/',
  'components/consent/',
  'components/motion/',
  'components/property/InteractivePlotMap.tsx',
  'components/property/PlotDossierGallery.tsx',
  'components/property/ProjectDetailModal.tsx',
  'components/property/TerrainStudyGallery.tsx',
  'components/ui/BrandMotifs.tsx',
  'components/ui/EditorialCarousel.tsx',
  'components/ui/ScrollProgressBar.tsx',
  'components/ui/ScrollReveal.tsx',
  'components/ui/JsonLd.tsx',
  'app/template.tsx',
  'app/not-found.tsx',
  'app/about/',
  'app/contact/',
  'app/cookie-policy/',
  'app/future-homes/',
  'app/guides/land-buying-checklist/',
  'app/privacy-policy/',
  'app/projects/',
  'app/terms-and-conditions/',
  'app/page.tsx',
  'app/layout.tsx',
].filter(Boolean);

// Files that legitimately need literal colour values: the web manifest and the last-resort global error page (both cannot rely on CSS variables).
const ALLOW = ['app/manifest.ts', 'app/global-error.tsx'];

const RULES = [
  { name: 'arbitrary hex colour', re: /(?:text|bg|border|from|via|to|fill|stroke|outline|ring|decoration|shadow|accent|caret|divide|placeholder)-\[#[0-9a-fA-F]{3,8}(?:\/\d+)?\]/ },
  { name: 'arbitrary pixel text size', re: /\btext-\[\d+(?:\.\d+)?px\]/ },
  { name: 'rounded corner (design is square; use only rounded-full for the emblem disc)', re: /\brounded(?!-full)(?:-[a-z0-9]+)?\b/ },
  { name: 'inline hex colour', re: /(?:color|background|border|fill|stroke)\s*:\s*['"]?#[0-9a-fA-F]{3,8}/ },
];

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(tsx?|jsx?)$/.test(entry)) yield full;
  }
}

const problems = [];
for (const base of SCAN) {
  for (const file of walk(join(ROOT, base))) {
    const rel = relative(ROOT, file).replaceAll('\\', '/');
    if (ALLOW.includes(rel) || LEGACY.some((p) => rel === p || rel.startsWith(p))) continue;
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const rule of RULES) if (rule.re.test(line)) problems.push(`${rel}:${i + 1}  ${rule.name}  →  ${line.trim().slice(0, 110)}`);
    });
  }
}

if (problems.length) {
  console.error(`✖ design-token lint: ${problems.length} violation(s)\n` + problems.join('\n'));
  process.exit(1);
}
console.log('✔ design-token lint: no arbitrary colours, pixel text sizes or rounded corners in V2 UI code');
