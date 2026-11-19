# 03 — SEO Audit (V2, clean-room production build)

Method as V1: raw HTML fetched with `fetch()` (no JS executed) for every route; Lighthouse SEO ×3 on six pages; JSON-LD parsed with `JSON.parse`; `robots.txt`, `sitemap.xml`, manifest, icons, OG images and security headers fetched. Build used a **non-resolvable staging domain** (`staging.3venisphere.invalid`) with `FORCE_INDEXABLE=true`, solely so indexability rules could be observed; the real domain is a client input.

## SEO score: **8 / 10** (V1: 6)

**Why 8, not 9–10:** the technical layer is now complete and tested, and Lighthouse SEO is 100 on all pages. What holds it back is content only the client can provide: no NAP (address/phone), no location pages, one guide, a placeholder domain, no real prices (so no `Offer`), no reviews (so no `aggregateRating`). I deliberately emit **no** schema for facts that do not exist.

| Sub-area | V1 | V2 | Why |
|---|---|---|---|
| Rendering / crawlability | 7 | **9** | All pages server-rendered; `/contact` H1 **and** form are in raw HTML (V1: absent); listing filters render server-side from `searchParams` |
| On-page (titles, meta, headings) | 7 | **9** | Unique title (27–68 chars) + description (82–164) per page, one H1 everywhere, **0 heading skips** (V1: h1→h3 on `/projects`), 0 images without alt |
| Structured data | 4 | **8** | `RealEstateListing`+`Place` on dossiers, `CollectionPage`+`ItemList`, `Article`, `FAQPage`, `ContactPage`, `BreadcrumbList`, `Organization`+`WebSite` (→ `RealEstateAgent` only once an address exists); `<` escaped; unit-tested |
| Indexation controls | 6 | **9** | verified-domain gate (https, not localhost), per-page canonical, filtered/sorted/plan listing URLs `noindex` + canonical `/projects`, `?page=N` self-canonical, `/guides` hub `noindex` until ≥ 3 guides, 404 `noindex`, preview mode = `noindex` + `Disallow: /`, sitemap with real `lastmod` and no `priority/changefreq` |
| Content depth / internal linking | 4 | **6** | 5 dossiers each linking similar parcels + prev/next, guide ↔ listing ↔ contact cross-links, breadcrumbs everywhere; still thin: 1 guide, no location/area pages |
| Local / real-estate signals | 2 | **4** | `RealEstateListing`, area/dimension properties, `en-IN`; **no NAP, map, reviews, GBP** — blocked on the client |

## Per-page table

| Page | Title (chars) | Desc | H1 | Heading skips | JSON-LD types | Imgs / no-alt / empty-alt | Robots |
|---|---|---|---|---|---|---|---|
| `/` | 3VENI SPHERE — Contoured residential land plots & architecture (66) | 155 | 1 | none | Organization, WebSite | 16 / 0 / 3 | index, follow |
| `/about` | About 3VENI SPHERE — Stewardship & Ethos \| 3VENI SPHERE (59) | 126 | 1 | none | Org, WebSite, BreadcrumbList | 5 / 0 / 3 | index, follow |
| `/projects` | Land plots — residential, corner & estate parcels \| … (68) | 141 | 1 | none | **CollectionPage**, BreadcrumbList | 8 / 0 / 3 | index, follow |
| `/projects?format=corner` | (same as `/projects`) | 141 | 1 | none | BreadcrumbList | 5 / 0 / 3 | **noindex**, follow · canonical → `/projects` |
| `/projects/aranya-ridge-terraces` | Aranya Ridge Terraces — 4,800 sq. ft. \| … (52) | 156 | 1 | none | **RealEstateListing**, BreadcrumbList | 10 / 0 / 6 | index, follow |
| `/projects/vatika-banyan-corner` | … 3,600 sq. ft. (51) | 145 | 1 | none | RealEstateListing, BreadcrumbList | 9 / 0 / 5 | index |
| `/projects/shila-laterite-crest` | … 6,200 sq. ft. (51) | 138 | 1 | none | RealEstateListing, BreadcrumbList | 9 / 0 / 5 | index |
| `/projects/prana-valley-sanctuary` | … 10,890 sq. ft. (0.25 Acre) (66) | 141 | 1 | none | RealEstateListing, BreadcrumbList | 9 / 0 / 5 | index |
| `/projects/taru-ochre-enclave` | … 2,800 sq. ft. (49) | 147 | 1 | none | RealEstateListing, BreadcrumbList | 9 / 0 / 5 | index |
| `/future-homes` | Future Homes Collection — Coming Soon \| … (52) | 153 | 1 | none | BreadcrumbList | 6 / 0 / 3 | index |
| `/guides` | Buyer guides \| … (27) | 82 | 1 | none | – | 3 / 0 / 3 | **noindex** (1 guide < 3) |
| `/guides/land-buying-checklist` | Land Buying Checklist & Plot Due Diligence Guide \| … (67) | 164 | 1 | none | **Article, FAQPage**, BreadcrumbList | 3 / 0 / 3 | index |
| `/contact` | Contact & Advisory Enquiry \| … (45) | 120 | **1 in raw HTML** | none | **ContactPage**, BreadcrumbList | 3 / 0 / 3 | index |
| `/privacy-policy`, `/cookie-policy`, `/terms-and-conditions` | 28–35 chars | 117–124 | 1 | none | BreadcrumbList | 3 / 0 / 3 | index |
| 404 | Page not found \| … (29) | 109 | 1 | none | – | 3 / 0 / 3 | **noindex**, HTTP 404, no canonical |

(`empty-alt` images are decorative: emblem, thumbnails and cards' duplicate media — every informative image has alt text.)

## Site-wide

| Check | Result |
|---|---|
| `robots.txt` | `Allow: /`, `Disallow: /api/`, absolute `Sitemap:` (audit build). Preview build: `Disallow: /` |
| `sitemap.xml` | 11 URLs, absolute https, real `lastmod` (from content `updatedAt`), no `priority` / `changefreq`; hub, legal, 404 omitted by design |
| Favicon / apple-icon / `icon.png` / manifest | 200 ×4 (V1: 404 + console error on every load) |
| OG / Twitter | 10 tags per page, 1200×630 JPG per page and per parcel — 11/11 images 200 |
| Canonical / `og:url` | absolute, from the verified domain; none on 404 |
| `html lang` | `en-IN` |
| Security headers | CSP with `frame-ancestors 'self'` (V1 allowed `*.google.com`; now env-controlled via `EMBED_ALLOWED_ORIGINS`), `frame-src` only for the click-to-load map, `nosniff`, `strict-origin-when-cross-origin`, `Permissions-Policy` |
| Launch gate | `npm run check:launch` (runs before `next build`) fails a `CONTENT_MODE=live` build when domain / contact channel / enquiry delivery are missing — the V1 placeholder-domain failure mode cannot recur |
| Lighthouse SEO | **100** on all 6 pages, mobile and desktop |

## Remaining (all client-side)
1. Real domain (`NEXT_PUBLIC_SITE_URL`) — until then production stays `noindex`.
2. Address / phone → NAP block, `RealEstateAgent` schema, local landing pages.
3. Real prices → `Offer` markup; real coordinates → `geo` + map.
4. More guides / area pages to lift the hub above the 3-guide threshold.
