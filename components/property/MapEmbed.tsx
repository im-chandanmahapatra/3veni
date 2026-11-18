'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

/**
 * Click-to-load map (plan H4): nothing from a third party loads until the visitor asks for it. Rendered only when a
 * parcel has real coordinates ([CLIENT TO PROVIDE]). Uses an OpenStreetMap embed (no SDK, no dependency, no API key).
 */
export default function MapEmbed({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const [shown, setShown] = useState(false);
  const d = 0.006;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
  if (!shown) {
    return (
      <div className="map-embed map-embed--idle">
        <p className="t-body-sm">The map loads from OpenStreetMap only when you ask for it.</p>
        <Button variant="secondary" icon="pin" onClick={() => setShown(true)}>
          Show map
        </Button>
      </div>
    );
  }
  return (
    <div className="map-embed">
      <iframe title={`Map: ${label}`} src={src} loading="lazy" referrerPolicy="no-referrer" />
    </div>
  );
}
