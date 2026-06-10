const CACHE_NAME = 'ak-resto-cache-v1';
const urlsToCache = [
  '/',
  '/login',
  '/manifest.webmanifest',
  '/ak-resto-logo.png',
  '/ak-resto-app-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
