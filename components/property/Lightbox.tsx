'use client';

import { useRef, type KeyboardEvent, type PointerEvent, type RefObject } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Icon from '@/components/ui/Icon';
import ModalDialog, { type ModalDialogHandle } from '@/components/ui/ModalDialog';

export interface LightboxImage {
  src: StaticImageData;
  alt: string;
  caption: string;
}

/**
 * Lightbox on a native <dialog> (DESIGN §8.8, audit M3): focus trap, Esc, inert background and focus return to the
 * opening thumbnail are platform behaviour. Adds ←/→/Home/End keys, swipe, counter and caption.
 */
export default function Lightbox({
  images,
  index,
  onIndexChange,
  handle,
  label,
}: {
  images: readonly LightboxImage[];
  index: number;
  onIndexChange: (next: number) => void;
  handle: RefObject<ModalDialogHandle | null>;
  label: string;
}) {
  const count = images.length;
  const current = images[index] ?? images[0]!;
  const startX = useRef<number | null>(null);

  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onIndexChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onIndexChange(count - 1);
    }
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 48 && count > 1) go(dx < 0 ? 1 : -1);
  };

  return (
    <ModalDialog label={label} className="lightbox" handle={handle}>
      <div className="lightbox__inner on-dark" onKeyDown={onKeyDown} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className="lightbox__bar">
          <p className="t-caption" aria-live="polite">
            {index + 1} / {count}
          </p>
          <button type="button" className="icon-btn" onClick={() => handle.current?.close()}>
            <Icon name="close" />
            <span className="sr-only">Close gallery</span>
          </button>
        </div>
        <figure
          className="lightbox__stage"
          onClick={(e) => {
            if (e.target === e.currentTarget) handle.current?.close();
          }}
        >
          <Image
            key={current.src.src}
            src={current.src}
            alt={current.alt}
            sizes="100vw"
            placeholder="blur"
            className="lightbox__img"
            draggable={false}
          />
          <figcaption className="lightbox__caption">{current.caption}</figcaption>
        </figure>
        {count > 1 ? (
          <div className="lightbox__nav">
            <button type="button" className="btn btn--on-dark-outline btn--icon" onClick={() => go(-1)}>
              <Icon name="arrow-left" />
              <span className="sr-only">Previous photo</span>
            </button>
            <button type="button" className="btn btn--on-dark-outline btn--icon" onClick={() => go(1)}>
              <Icon name="arrow-right" />
              <span className="sr-only">Next photo</span>
            </button>
          </div>
        ) : null}
      </div>
    </ModalDialog>
  );
}
