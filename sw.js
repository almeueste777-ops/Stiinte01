/* Service worker: precache + strategii de cache.
   IMPORTANT: crește CACHE la fiecare modificare a fișierelor, ca utilizatorii să primească versiunea nouă. */
const CACHE = 'stiinte01-v5';   // v03 — temă comutabilă, setări, conținut pe module
const ASSETS = [
  './',
  './index.html',
  /* ?v= trebuie să fie IDENTIC cu cel din index.html (cache-ul SW potrivește
     URL-ul exact, cu tot cu query) — CI-ul verifică sincronizarea. */
  './assets/app.css?v=5',
  './assets/app.js?v=5',
  './manifest.webmanifest',
  './data/curriculum.json',
  './data/continut.json',
  /* Fișierele de modul (conținutul propriu-zis) se cer abia când e deschis
     modulul, dar TREBUIE să fie în precache: altfel aplicația instalată ar
     avea lecțiile doar cât timp există rețea. Lista o scrie
     `tools/construieste-index.mjs` — nu o edita de mână. */
  /* MODULE:START */
  './data/module/istorie-9.json',
  './data/module/logica-9.json',
  './data/module/romana-9.json',
  './data/module/istorie-10.json',
  './data/module/psihologie-10.json',
  './data/module/romana-10.json',
  './data/module/istorie-11.json',
  './data/module/sociologie-11.json',
  './data/module/romana-11.json',
  './data/module/filosofie-12.json',
  './data/module/istorie-12.json',
  './data/module/romana-12.json',
  './data/module/economie-13.json',
  './data/module/istorie-13.json',
  /* MODULE:STOP */
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      /* `cache:'reload'` OCOLEȘTE cache-ul HTTP al browserului. Fără el,
         addAll poate umple precache-ul noii versiuni cu fișiere VECHI luate
         din cache-ul HTTP (assets aveau max-age de 7 zile și nu au amprentă
         în nume) — exact bug-ul „HTML nou + CSS vechi” văzut în producție. */
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
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
        const net = fetch(req, { cache: 'no-cache' }).then(res => {
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
      /* Revalidarea de fundal ocolește cache-ul HTTP: condiționată (304 =
         ieftin) când există validatori, descărcare completă altfel. Fără ea
         s-ar citi tot din cache-ul HTTP și s-ar rămâne veșnic pe vechi. */
      const net = fetch(req, { cache: 'no-cache' }).then(res => {
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
