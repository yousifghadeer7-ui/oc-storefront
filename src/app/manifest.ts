import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OC Store',
    short_name: 'OC Store',
    description: 'Luxury Apparel & Considered Clothing',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f5f0',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
