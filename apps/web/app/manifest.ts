import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'A.K Resto',
    short_name: 'A.K Resto',
    description: 'Smart Restaurant Solutions & POS Counter Billing Platform',
    start_url: '/login',
    display: 'standalone',
    background_color: '#FAFBFF',
    theme_color: '#BFDEF3',
    icons: [
      {
        src: '/ak-resto-app-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
