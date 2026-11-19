# V2 changelog

Branch `v2` (V1 untouched on `main`; nothing force-pushed). Commits in build order (base `ec128cc`).

| Commit | Summary |
|---|---|
| `4339e54` v2 | Design tokens (Tailwind 4 `@theme`, palette, fluid type, spacing, one shadow), self-hosted fonts (Newsreader, Instrument Sans, Noto Serif Devanagari; 51 KB preloaded vs V1 274 KB), base styles, favicon set |
| `a4d7791` v2 | UI primitives (Button, Field, Badge, Media, Reveal, ModalDialog, ClientSlot…), typed content model, `CONTENT_MODE` + launch gate, listing logic (filter/sort/paginate) + tests |
| `cd09318` v2(seo,enquiry) | Metadata + schema builders, sitemap/robots/manifest, 11 OG images, enquiry pipeline (validation, honeypot, rate limit, SMTP + CRM webhook, honest 503/502) verified against an SMTP sink |
| `0a2b959` v2(layout) | Header with native-dialog menu, footer identity block, docked consent bar + preferences dialog |
| `d473471` v2(home,plots,pages) | New home composition; URL-state listing with plan view; parcel dossier (gallery + lightbox, specs, sticky enquiry, similar/prev-next, `RealEstateListing`); contact / about / future-homes / guides (interactive checklist) / legal / 404 / error boundaries |
| `abdcad2` v2(cleanup) | Removed V1 components, data, config, services, libs, tests; removed GSAP, Motion, lucide-react; CSP `frame-ancestors` from `EMBED_ALLOWED_ORIGINS`; `.env.example` rewritten; token-lint allowlist emptied |
| `ea11550` v2(deps) | ESLint toolchain → devDependencies (production audit: 0) |
| `06f193d` v2(a11y) | Slot label contrast on dark |
| `ff4f1fb` v2(perf) | Preload first listing card, hero q60, deferred statement section, consent-aware scroll padding |
| `93337a7` v2 | `(listing)` route group, focus moves to the enquiry confirmation, responsive tweaks |
| `454a4f2`, `6bdb82d` v2(responsive) | 320-px header, concept/cookie wrapping, non-draggable lightbox image |
| `f57ff4e` v2(a11y) | Masterplan panel title is not a heading |
| (this commit) v2(docs) | `docs/v2-audit/`, comparison, changelog, handover |

## Added
- Enquiry that actually delivers (SMTP and/or CRM), reference ID, honest failure states, `GET /api/health`.
- Search: hero search, listing filters (format/size/terrain/keyword), sort, pagination, plan view — all in the URL.
- Parcel dossiers with lightbox gallery, spec rows, sticky enquiry panel, similar parcels, previous/next, click-to-load map (when coordinates exist), documents slot.
- Interactive buyer checklist (persisted, printable), FAQ as `<details>`.
- `CONTENT_MODE` preview/live with marked `[CLIENT TO PROVIDE]` slots, `check:launch` gate, `content:report`.
- Structured data: `Organization`/`RealEstateAgent`, `WebSite`, `RealEstateListing`+`Place`, `CollectionPage`+`ItemList`, `Article`, `FAQPage`, `ContactPage`, `BreadcrumbList`.
- Favicon set, manifest, per-page 1200×630 OG images, real `lastmod` sitemap.
- Unit/integration tests (29), token lint, `smtp-sink` script.

## Changed
- Visual system: tokens only (no arbitrary hex/px classes — V1 had 940 + 59), square hairline language, two-family type pairing, brass never as text on light.
- Header/CTA/consent/menu/lightbox rebuilt on native `<dialog>`; no hand-rolled focus traps.
- Home: 9 sections → one idea each; nothing auto-moves; images static-imported with blur placeholders.
- Legal text unchanged (restyled only).

## Removed
- 3.3 s brand intro curtain and "replay" link; hero auto-rotation; GSAP, Motion, lucide-react; V1 sample-copy duplication; unreferenced `public/assets/aistudio/*.png`; AI-Studio / `*.google.com` CSP allowance (now opt-in via `EMBED_ALLOWED_ORIGINS`).

## Fixed (V1 audit → V2)
C1–C8, H1–H12, M1–M13, L1–L7 traceability is in `docs/v2/00-v2-plan.md` §2; closure evidence in `docs/v2-audit/`. Open items (client content, lab LCP) are listed in `docs/v2-audit/06-v2-priorities.md`.
