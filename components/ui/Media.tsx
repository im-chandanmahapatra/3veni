import Image, { type StaticImageData } from 'next/image';

export type MediaRatio = '3/2' | '16/9' | '4/5' | '1/1' | '21/9' | '16/10' | '5/4' | 'fill';

interface MediaProps {
  src: StaticImageData;
  alt: string;
  /** exact `sizes` attribute — required, never guessed (DESIGN §9) */
  sizes: string;
  ratio?: MediaRatio;
  /** object-position focal point, 0–1 [x, y] */
  focal?: readonly [number, number];
  /** LCP image: preload + fetchPriority high, eager. Use for exactly one image per page. */
  preload?: boolean;
  /** raise for large hero art; default 75 keeps Next's default `images.qualities` */
  quality?: number;
  className?: string;
}

/**
 * Responsive image on a sunken placeholder with an aspect-ratio box (no layout shift) and the automatic blur
 * placeholder Next generates for static imports (audit M8). AVIF/WebP + srcset come from next/image.
 */
export default function Media({ src, alt, sizes, ratio = '3/2', focal, preload, quality, className }: MediaProps) {
  const [fx, fy] = focal ?? [0.5, 0.5];
  return (
    <div className={['media', ratio === 'fill' ? 'media--fill' : '', className ?? ''].filter(Boolean).join(' ')} style={ratio === 'fill' ? undefined : { aspectRatio: ratio.replace('/', ' / ') }}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        placeholder="blur"
        quality={quality}
        {...(preload ? { preload: true, fetchPriority: 'high' as const, loading: 'eager' as const } : {})}
        style={{ objectFit: 'cover', objectPosition: `${Math.round(fx * 100)}% ${Math.round(fy * 100)}%` }}
      />
    </div>
  );
}
