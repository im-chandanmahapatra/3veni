#!/usr/bin/env python3
"""Fetch the self-hosted woff2 files used by V2 (one-off; the files are committed).

Sources: Google Fonts CSS API v2 (all three families are licensed under the SIL
Open Font License 1.1 and may be redistributed). Only the subsets we need are fetched:

  Newsreader           static optical size 72, weights 300 and 400 (latin, latin-ext)
  Instrument Sans      variable weight 400-600                     (latin, latin-ext)
  Noto Serif Devanagari 400                                        (devanagari)

Run:  python scripts/fetch-fonts.py        (writes into app/fonts/)
"""
import re
import sys
import urllib.request
from pathlib import Path

UA = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/130.0 Safari/537.36"
}
OUT = Path(__file__).resolve().parent.parent / "app" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

REQUESTS = [
    # one request per weight so Google returns *static* instances (22 KB each) instead of a 57 KB variable file
    ("newsreader", "family=Newsreader:opsz,wght@72,300", {"latin", "latin-ext"}),
    ("newsreader", "family=Newsreader:opsz,wght@72,400", {"latin", "latin-ext"}),
    ("instrument-sans", "family=Instrument+Sans:wght@400..600", {"latin", "latin-ext"}),
    ("noto-serif-devanagari", "family=Noto+Serif+Devanagari:wght@400", {"devanagari"}),
]


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def main() -> int:
    manifest = []
    for slug, query, wanted in REQUESTS:
        css = get(f"https://fonts.googleapis.com/css2?{query}&display=swap").decode()
        for subset, body in re.findall(r"/\*\s*([\w-]+)\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S):
            if subset not in wanted:
                continue
            style = re.search(r"font-style:\s*(\w+)", body).group(1)
            weight = re.search(r"font-weight:\s*([^;]+);", body).group(1).strip().replace(" ", "-")
            url = re.search(r"url\((https://[^)]+)\)", body).group(1)
            rng = re.search(r"unicode-range:\s*([^;]+);", body).group(1).strip()
            name = f"{slug}-{weight}{'-italic' if style == 'italic' else ''}-{subset}.woff2"
            data = get(url)
            (OUT / name).write_bytes(data)
            manifest.append((name, len(data), rng))
            print(f"{name:52s} {len(data) / 1024:6.1f} KB")
    (OUT / "unicode-ranges.json").write_text(
        "{\n" + ",\n".join(f'  "{n}": "{r}"' for n, _, r in manifest) + "\n}\n", encoding="utf-8"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
