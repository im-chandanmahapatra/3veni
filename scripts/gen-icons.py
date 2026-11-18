#!/usr/bin/env python3
"""Generate the favicon set from the supplied brand emblem (audit C7).

Input : public/images/brand/3veni-emblem.webp (192 x 192, RGB, white corners — the client's artwork, unchanged)
Output: app/icon.png (128, circular alpha), app/apple-icon.png (180, opaque, padded), app/favicon.ico (16/32/48)

No artwork is redrawn; the emblem is only masked to its circle (icons) or centred on the paper colour (apple icon).
Run:  python scripts/gen-icons.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "brand" / "3veni-emblem.webp"
APP = ROOT / "app"
PAPER = (252, 250, 246)  # --color-paper


def circular(img: Image.Image, size: int) -> Image.Image:
    """Resize and mask to the emblem circle with an anti-aliased edge (4x supersampled mask)."""
    base = img.convert("RGBA").resize((size, size), Image.LANCZOS)
    ss = 4
    mask = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size * ss - 1, size * ss - 1), fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    base.putalpha(mask)
    return base


def main() -> None:
    emblem = Image.open(SRC)
    circular(emblem, 128).save(APP / "icon.png", optimize=True)

    apple = Image.new("RGB", (180, 180), PAPER)
    inner = emblem.convert("RGB").resize((144, 144), Image.LANCZOS)
    apple.paste(inner, (18, 18))
    apple.save(APP / "apple-icon.png", optimize=True)

    ico_base = circular(emblem, 256)
    ico_base.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote app/icon.png, app/apple-icon.png, app/favicon.ico")


if __name__ == "__main__":
    main()
