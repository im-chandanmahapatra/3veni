'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import Lightbox from '@/components/property/Lightbox';
import type { ModalDialogHandle } from '@/components/ui/ModalDialog';
import type { ParcelImage } from '@/types/parcel';

/**
 * Dossier gallery (DESIGN §8.9, audit H10): main plate + thumbnail strip; the main plate and every thumbnail are real
 * buttons. Clicking the plate opens the lightbox (←/→, Home/End, swipe, Esc; focus returns to the opener).
 */
export default function ParcelGallery({ name, images }: { name: string; images: readonly ParcelImage[] }) {
  const handle = useRef<ModalDialogHandle>(null);
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0]!;
  const focal = current.focal ?? [0.5, 0.5];

  return (
    <div className="gallery" role="region" aria-label={`${name} photo dossier`} data-testid="plot-dossier-gallery">
      <button type="button" className="gallery__main" onClick={() => handle.current?.open()} aria-label={`Enlarge photo ${index + 1} of ${images.length}: ${current.caption}`}>
        <Image
          key={current.src.src}
          src={current.src}
          alt={current.alt}
          fill
          preload={index === 0}
          fetchPriority={index === 0 ? 'high' : undefined}
          placeholder="blur"
          sizes="(min-width: 1024px) 66vw, 100vw"
          style={{ objectFit: 'cover', objectPosition: `${Math.round(focal[0] * 100)}% ${Math.round(focal[1] * 100)}%` }}
        />
        <span className="gallery__expand" aria-hidden="true">
          <Icon name="expand" />
        </span>
      </button>
      <p className="t-caption gallery__caption">
        <span className="t-numeric">
          {index + 1} / {images.length}
        </span>{' '}
        — {current.caption}
      </p>
      {images.length > 1 ? (
        <ul className="gallery__thumbs">
          {images.map((img, i) => (
            <li key={img.src.src}>
              <button
                type="button"
                className="gallery__thumb"
                aria-label={`Show photo ${i + 1}: ${img.caption}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              >
                <Image src={img.src} alt="" fill placeholder="blur" sizes="(min-width: 1024px) 14vw, 30vw" style={{ objectFit: 'cover' }} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Lightbox label={`${name} gallery`} images={images.map((i) => ({ src: i.src, alt: i.alt, caption: i.caption }))} index={index} onIndexChange={setIndex} handle={handle} />
    </div>
  );
}
