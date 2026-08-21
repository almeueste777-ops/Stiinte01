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

  // Navigări către shell (/ sau /index.html): CACHE-FIRST, cu revalidare în
  // fundal. Aplicația pornește instantaneu din cache (chiar și pe rețea
  // proastă), iar versiunea nouă se descarcă în spate și se vede la următoarea
  // deschidere. Prospețimea reală o dă oricum bump-ul de CACHE la release.
  // Cheia de cache e './', NU './index.html': Cloudflare Pages redirecționează
  // 308 /index.html -> /, iar un răspuns `redirected` servit unei navigări e
  // respins de browser cu eroare de rețea — aplicația n-ar mai porni deloc.
  // Din același motiv, un răspuns redirected nu se stochează niciodată.
  if (req.mode === 'navigate') {
    const cale = new URL(req.url).pathname;
    if (!(cale.endsWith('/') || cale.endsWith('/index.html'))) {
      // fișier deschis direct într-un tab (ex. data/continut.json):
      // rețeaua întâi, shell-ul din cache doar ca rezervă offline
      e.respondWith(fetch(req).catch(() => caches.match('./')));
      return;
    }
    e.respondWith(
      caches.match('./').then(hit => {
        const net = fetch(req).then(res => {
          if (res && res.ok && !res.redirected) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put('./', copy));
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
