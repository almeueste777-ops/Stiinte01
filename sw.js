/* Service worker: precache + strategii de cache.
   IMPORTANT: crește CACHE la fiecare modificare a fișierelor, ca utilizatorii să primească versiunea nouă. */
const CACHE = 'stiinte01-v3';   // v02 „Responsiv total” — layout adaptiv + pornire instantanee
const ASSETS = [
  './',
  './index.html',
  './assets/app.css',
  './assets/app.js',
  './manifest.webmanifest',
  './data/curriculum.json',
  './data/continut.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Navigări: CACHE-FIRST, cu revalidare în fundal. Aplicația pornește
  // instantaneu din cache (chiar și pe rețea proastă), iar versiunea nouă —
  // dacă există — se descarcă în spate și se vede la următoarea deschidere.
  // Prospețimea reală o dă oricum bump-ul de versiune CACHE la fiecare release.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then(hit => {
        const net = fetch(req).then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./index.html', copy));
          }
          return res;
        }).catch(() => hit);
        return hit || net;
      })
    );
    return;
  }

  // Restul: cache-first, cu revalidare în fundal.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
