#!/usr/bin/env python3
"""Generate 1200x630 Open Graph images from the client's existing photography (audit L4).

V1 reused one raw 1376x768 photo on every page. V2 serves a purpose-cropped 1200x630 JPEG per page
(cover crop around each image's focal point, no text, no overlay, no re-touching).

Run:  python scripts/gen-og.py        (writes public/og/*.jpg)
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images"
OUT = ROOT / "public" / "og"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1200, 630

# name -> (source file, focal x, focal y)
JOBS = {
    "default": ("plots/aranya-ridge.webp", 0.5, 0.5),
    "aranya-ridge-terraces": ("plots/aranya-ridge.webp", 0.45, 0.5),
    "vatika-banyan-corner": ("plots/vatika-banyan.webp", 0.42, 0.55),
    "shila-laterite-crest": ("plots/shila-crest.webp", 0.5, 0.55),
    "prana-valley-sanctuary": ("plots/prana-valley.webp", 0.5, 0.5),
    "taru-ochre-enclave": ("plots/taru-ochre.webp", 0.5, 0.5),
    "projects": ("plots/aranya-ridge.webp", 0.5, 0.45),
    "about": ("plots/prana-valley.webp", 0.5, 0.5),
    "guide": ("plots/earth-architecture-study.webp", 0.5, 0.5),
    "future-homes": ("homes/mitti-courtyard.webp", 0.5, 0.5),
    "contact": ("plots/taru-ochre.webp", 0.5, 0.5),
}


def cover(img: Image.Image, fx: float, fy: float) -> Image.Image:
    sw, sh = img.size
    scale = max(W / sw, H / sh)
    nw, nh = round(sw * scale), round(sh * scale)
    img = img.resize((nw, nh), Image.LANCZOS)
    left = min(max(round(fx * nw - W / 2), 0), nw - W)
    top = min(max(round(fy * nh - H / 2), 0), nh - H)
    return img.crop((left, top, left + W, top + H))


def main() -> None:
    for name, (rel, fx, fy) in JOBS.items():
        im = Image.open(SRC / rel).convert("RGB")
        cover(im, fx, fy).save(OUT / f"{name}.jpg", quality=82, optimize=True, progressive=True)
        print(f"public/og/{name}.jpg")


if __name__ == "__main__":
    main()
