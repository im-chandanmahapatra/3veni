'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/property/Lightbox';
import type { ModalDialogHandle } from '@/components/ui/ModalDialog';
import type { Plate } from '@/types/parcel';

/**
 * "Terrain & light" mosaic (merges V1's location carousel + monograph, audit H8/M8): four plates, each opens the
 * lightbox. Static, no carousel, no auto-motion.
 */
export default function PlateMosaic({ plates }: { plates: readonly Plate[] }) {
  const handle = useRef<ModalDialogHandle>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number) => {
    setIndex(i);
    handle.current?.open();
  };

  return (
    <>
      <div className="mosaic">
        {plates.map((p, i) => (
          <figure key={p.id} className={`mosaic__item mosaic__item--${i + 1} plate`}>
            <button type="button" className="mosaic__button" onClick={() => open(i)} aria-label={`Open ${p.number}: ${p.title}`}>
              <span className="mosaic__frame">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 64rem) 34vw, (min-width: 48rem) 45vw, 100vw"
                  style={{ objectFit: 'cover', objectPosition: `${Math.round((p.focal?.[0] ?? 0.5) * 100)}% ${Math.round((p.focal?.[1] ?? 0.5) * 100)}%` }}
                />
              </span>
            </button>
            <figcaption>
              <b>
                {p.number} — {p.title}
              </b>
              <br />
              {p.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <Lightbox
        label="Terrain and light gallery"
        images={plates.map((p) => ({ src: p.src, alt: p.alt, caption: `${p.number} — ${p.title}. ${p.caption}` }))}
        index={index}
        onIndexChange={setIndex}
        handle={handle}
      />
    </>
  );
}
