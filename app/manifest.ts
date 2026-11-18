import type { MetadataRoute } from 'next';

/** Web app manifest (audit C7: V1 returned 404 for icons and manifest). Colours are the canvas token. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '3VENI SPHERE',
    short_name: '3VENI SPHERE',
    description: '3VENI SPHERE — Invest With Confidence. Curated plotted land developments and future architectural residences.',
    start_url: '/',
    display: 'browser',
    background_color: '#F7F3EC',
    theme_color: '#F7F3EC',
    lang: 'en-IN',
    icons: [
      { src: '/icon.png', sizes: '128x128', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
