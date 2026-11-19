# 05 — Responsive Review (V2)

Viewports: **1440×900**, **768×1024**, **375×812** (touch, mobile UA) plus a **320×900** overflow probe. Every route captured full-page + fold at each width (`screenshots/<page>-<width>[-fold].jpg`). Fixed header and consent bar appear mid-image in full-page captures — a stitching artefact of `fullPage`, not a layout bug; the fold shots and DOM measurements are the evidence.

**Overall responsive verdict: 9/10** (V1: 6). **No horizontal scroll on any of the 13 routes at 320, 375, 768 or 1440** (`scrollWidth == clientWidth`; V1 had no failures at these widths either, but its 768/375 layouts had overlap and soft-image problems).

## What V1 called out, and V2's result

| V1 finding | V2 |
|---|---|
| D1 hero upscaled from 1376 px | Static imports + `sizes`; delivered ≤ 1.15× intrinsic; focal point; mobile uses image-first layout (no text over photography) |
| D2 / T-series cookie banner floating over content, 27–29 px buttons | Docked bar, content reserves its height, 44-px equal-weight actions |
| D3 same parcel shown twice | One card = one link, no duplicate lead card |
| D4 black frames before lazy images | Blur placeholders from static imports; no monograph frame |
| D5 / D6 uneven header + footer columns | Footer is a 4-column grid ≥ 1024 px, stacked below; identity block never single-sentence |
| Missing mobile scroll-lock | Native dialog: wheel scroll locked (scrollY 0→0) |
| 61 small tap targets | none below 44 px except inline text links and stretched card links |

## Bugs found by this audit (all fixed)

| # | Width | Bug | Fix |
|---|---|---|---|
| R1 | 320 | Header Enquire + menu button pushed the page to 340 px (horizontal scroll) | Below 22.5 rem the wordmark hides (emblem remains, link keeps its accessible name) and button padding tightens |
| R2 | 320 | `/future-homes` 323 px — "Register for future updates" button could not wrap | `.btn` wraps inside concepts; grid columns `minmax(0,1fr)` |
| R3 | 320 | `/cookie-policy` 325 px — "Update cookie preferences" `nowrap` | wraps |
| R4 | all | Dossier enquiry panel overflowed its card (fields clipped at the right) | single-column compact grid with `minmax(0,1fr)` |
| R5 | ≥ 1024 | Dossier panel did not stay sticky (grid `align-items:start` left no room) | aside stretches, inner element sticks |
| R6 | 375 | Skip link 41 px high | 44 px |
| R7 | all | Listing skeleton flashed when navigating to a dossier (`loading.tsx` sat above `[slug]`) | skeleton moved into route group `app/projects/(listing)/` |

## 1440
Full-bleed hero with docked 4-field search; statement + principles in two columns; featured stack; night method band; terrain mosaic; concept rows alternate image side; dossier is 2-column with sticky panel. No overlap; header solid after 24 px.

## 768
Hero search becomes 3 + button; listing 2-up; dossier single column with the enquiry panel after the plan; menu is still the sheet (nav inline starts at 1024). No consent-bar overlap.

## 375 / 320
Hero image first (fold shows image + H1), type on paper; search stacked; listing filters collapse to a "Filters (n)" button; dossier has a fixed bottom "Enquire" bar that scrolls to the panel; consent bar stacks three 44-px actions; checklist progress bar sticks under the header.

Known limitations: the masterplan SVG labels render ≥ 12 px only from 768 px (below that the plan is a scaled overview and parcels are reachable as links in the card list); iOS Safari and physical devices untested.
