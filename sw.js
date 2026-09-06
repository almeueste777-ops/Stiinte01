/* Service worker: precache + strategii de cache.
   IMPORTANT: crește CACHE la fiecare modificare a fișierelor, ca utilizatorii să primească versiunea nouă. */
const CACHE = 'stiinte01-v16';  // v12 — Limba și literatura română Bacalaureat actualizat
/* Scheletul aplicației: FĂRĂ el aplicația nu pornește, deci se cere atomic. */
const SHELL = [
  './',
  './index.html',
  /* ?v= trebuie să fie IDENTIC cu cel din index.html (cache-ul SW potrivește
     URL-ul exact, cu tot cu query) — CI-ul verifică sincronizarea. */
  './assets/app.css?v=16',
  './assets/tema-aurora.css?v=16',
  './assets/app.js?v=16',
  './manifest.webmanifest',
  './data/curriculum.json',
  './data/continut.json',
  './data/versiuni.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

/* Fișierele de modul (conținutul propriu-zis) se cer abia când e deschis
   modulul, dar TREBUIE să ajungă în precache: altfel aplicația instalată ar
   avea lecțiile doar cât timp există rețea. Lista o scrie
   `tools/construieste-index.mjs` — nu o edita de mână.

   Sunt 60 de fișiere, ~2,6 MB. Se cer INDIVIDUAL, nu prin `addAll`: acesta
   respinge tot dacă o singură cerere pică, iar cu promisiunea respinsă în
   `waitUntil` instalarea eșuează, `skipWaiting()` nu mai rulează și
   utilizatorul rămâne tăcut pe versiunea veche. Pe rețea proastă, un singur
   timeout dintre 60 ar fi anulat tot update-ul. Ce nu intră acum intră la
   prima deschidere a modulului, prin handler-ul de fetch. */
const MODULE = [
  /* MODULE:START */
  './data/module/geografie-9.json',
  './data/module/istorie-9.json',
  './data/module/logica-9.json',
  './data/module/religie-9.json',
  './data/module/latina-9.json',
  './data/module/engleza-9.json',
  './data/module/franceza-9.json',
  './data/module/romana-9.json',
  './data/module/biologie-9.json',
  './data/module/chimie-9.json',
  './data/module/fizica-9.json',
  './data/module/matematica-9.json',
  './data/module/tic-9.json',
  './data/module/geografie-10.json',
  './data/module/istorie-10.json',
  './data/module/psihologie-10.json',
  './data/module/religie-10.json',
  './data/module/latina-10.json',
  './data/module/engleza-10.json',
  './data/module/franceza-10.json',
  './data/module/romana-10.json',
  './data/module/biologie-10.json',
  './data/module/chimie-10.json',
  './data/module/fizica-10.json',
  './data/module/matematica-10.json',
  './data/module/tic-10.json',
  './data/module/geografie-11.json',
  './data/module/holocaust-11.json',
  './data/module/istorie-11.json',
  './data/module/religie-11.json',
  './data/module/sociologie-11.json',
  './data/module/studii-sociale-11.json',
  './data/module/engleza-11.json',
  './data/module/franceza-11.json',
  './data/module/romana-11.json',
  './data/module/biologie-11.json',
  './data/module/mass-11.json',
  './data/module/stiam-11.json',
  './data/module/tic-11.json',
  './data/module/filosofie-12.json',
  './data/module/geografie-12.json',
  './data/module/istorie-12.json',
  './data/module/religie-12.json',
  './data/module/studii-sociale-12.json',
  './data/module/engleza-12.json',
  './data/module/franceza-12.json',
  './data/module/romana-12.json',
  './data/module/biologie-12.json',
  './data/module/mass-12.json',
  './data/module/stiam-12.json',
  './data/module/tic-12.json',
  './data/module/economie-13.json',
  './data/module/filosofie-13.json',
  './data/module/geografie-13.json',
  './data/module/comunism-13.json',
  './data/module/istorie-13.json',
  './data/module/religie-13.json',
  './data/module/studii-sociale-13.json',
  './data/module/engleza-13.json',
  './data/module/franceza-13.json',
  './data/module/romana-13.json',
  './data/module/biologie-13.json',
  './data/module/bac-13.json',
  /* MODULE:STOP */
];

/* Lista completă, folosită de verificatorul de precache din CI. */
const ASSETS = SHELL.concat(MODULE);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      /* `cache:'reload'` OCOLEȘTE cache-ul HTTP al browserului. Fără el,
         addAll poate umple precache-ul noii versiuni cu fișiere VECHI luate
         din cache-ul HTTP (assets aveau max-age de 7 zile și nu au amprentă
         în nume) — exact bug-ul „HTML nou + CSS vechi” văzut în producție. */
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' })))
        /* Modulele: fiecare pe cont propriu. `allSettled` nu respinge
           niciodată, deci un fișier care nu ajunge nu mai anulează instalarea
           întregii versiuni. */
        .then(() => Promise.allSettled(
          MODULE.map(u => c.add(new Request(u, { cache: 'reload' })))
        )))
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
