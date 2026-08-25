/* Plasă de siguranță comportamentală pentru funcțiile pure din assets/app.js.

   De ce există: CI-ul verifică structură și sintaxă (JSON valid, `node --check`,
   acolade CSS echilibrate), dar NU comportament. Un refactor putea rescrie tăcut
   morfologia răspunsurilor, programarea eșalonată sau curățarea stării, iar toate
   verificările rămâneau verzi. Fișierul de față închide gaura, cu `node --test`
   din Node — fără niciun pachet, fără build, în etosul proiectului.

   Cum, fără să atingem fișierul livrat: `app.js` e un IIFE fără exporturi. NU îl
   modificăm (altfel ar cere bump de CACHE + ?v= + reverificare UI). În schimb îl
   citim ca text, îi punem la dispoziție un DOM minim (stub) într-un context
   `node:vm` și, chiar înainte de `})();`, injectăm O SINGURĂ linie care predă
   funcțiile deja definite unei funcții-capcană din gazdă. Rulează astfel EXACT
   codul livrat — nu o copie rescrisă de mână — iar fișierul de pe disc rămâne
   neatins, octet cu octet.

   Rulare:  node --test tools/test-comportament.mjs
   (CI: pasul „Teste comportamentale" din .github/workflows/verificare.yml)

   Pentru a demonstra că testele chiar prind regresii, variabila de mediu
   STIINTE_APP_JS poate arăta spre o COPIE cu un bug injectat; testele pică pe ea
   și trec pe fișierul real. Vezi jurnalul rulării T1. */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_PATH = process.env.STIINTE_APP_JS || join(__dirname, '..', 'assets', 'app.js');
const SURSA = readFileSync(APP_PATH, 'utf8');

/* ── shim: un DOM cât să pornească IIFE-ul, nimic mai mult ─────────────────
   Niciuna dintre funcțiile testate nu atinge DOM-ul; stub-ul există doar ca
   partea de sus a modulului (getElementById, aplicaPreferinte, updNet, Promise
   .all(fetch…)) să ruleze fără să arunce, ca să ajungem la linia de captură. */
function nodStub() {
  const style = new Proxy({}, {
    get: (t, p) => (p === 'setProperty' || p === 'removeProperty' || p === 'getPropertyValue') ? () => '' : t[p],
    set: (t, p, v) => { t[p] = v; return true; }
  });
  const store = {
    style, classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    dataset: {}, innerHTML: '', textContent: '', value: '', hidden: false,
    firstChild: null, offsetWidth: 0, inert: false
  };
  const nod = new Proxy(store, {
    get(t, p) {
      if (p in t) return t[p];
      if (p === 'querySelectorAll') return () => [];
      if (p === 'querySelector' || p === 'closest') return () => nodStub();
      if (p === 'cloneNode') return () => nodStub();
      if (typeof p === 'symbol') return undefined;
      return () => nod;                 // orice metodă DOM: no-op care întoarce nodul
    },
    set(t, p, v) { t[p] = v; return true; }
  });
  return nod;
}

function creeazaSandbox() {
  const document = {
    getElementById: () => nodStub(), querySelector: () => nodStub(),
    querySelectorAll: () => [], createElement: () => nodStub(),
    documentElement: nodStub(), body: nodStub(),
    addEventListener() {}, removeEventListener() {},
    activeElement: null, visibilityState: 'visible'
  };
  const memorie = new Map();
  const localStorage = {
    getItem: k => (memorie.has(k) ? memorie.get(k) : null),
    setItem: (k, v) => { memorie.set(k, String(v)); },
    removeItem: k => { memorie.delete(k); }, clear: () => memorie.clear()
  };
  const matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  const window = {
    addEventListener() {}, removeEventListener() {}, scrollTo() {}, matchMedia,
    requestIdleCallback: f => setTimeout(f, 0),
    requestAnimationFrame: f => setTimeout(() => f(Date.now()), 0), scrollY: 0
  };
  return {
    document, window, localStorage, matchMedia,
    navigator: { onLine: true, vibrate() { return true; } },
    location: { hash: '', pathname: '/', search: '', reload() {}, replace() {} },
    history: { back() {}, replaceState() {}, pushState() {} },
    fetch: () => new Promise(() => {}),          // rămâne în așteptare: fără rețea în teste
    alert() {}, setTimeout, clearTimeout, setInterval, clearInterval,
    performance: { now: () => Date.now() }, console
  };
}

/* Singura transformare a sursei: o linie de captură, chiar înainte de `})();`.
   Nu schimbă niciun comportament — doar expune referințele deja existente. */
const CAPTURA = ';__capteaza({ raspunsPotrivit, distanta, faraArticol, normaliz, ' +
  'programeaza, sanitizeaza, pct, STARE_GOALA, SETARI, VALORI, LIMITE, ANTREN_NOU, ' +
  'ZI, __getState: () => state, __setState: v => { state = v; } });';

function incarcaApp(src) {
  const poz = src.lastIndexOf('})();');
  if (poz === -1) throw new Error('shim: nu am găsit închiderea IIFE „})();" în app.js');
  const cod = src.slice(0, poz) + CAPTURA + '\n' + src.slice(poz);
  let api = null;
  const sandbox = creeazaSandbox();
  sandbox.__capteaza = x => { api = x; };
  vm.createContext(sandbox);
  vm.runInContext(cod, sandbox, { filename: 'app.js (shim de test)' });
  if (!api) throw new Error('shim: nu s-au capturat funcțiile din app.js');
  return api;
}

const A = incarcaApp(SURSA);
const simplu = x => JSON.parse(JSON.stringify(x));   // scoate obiectele din realm-ul vm pentru deepEqual

/* ═══ 1. Morfologia răspunsurilor: normaliz / distanta / faraArticol / raspunsPotrivit ═══ */

test('normaliz — fără diacritice, fără semne, fără spații în plus', () => {
  // Ambele forme de „ț" (virgulă dedesubt U+021B și cedilă U+0163) trebuie să
  // ajungă la aceeași formă normalizată — altfel un răspuns corect scris cu
  // tastatura „greșită" ar fi respins.
  assert.equal(A.normaliz('Constituție'), 'constitutie');
  assert.equal(A.normaliz('constituţie'), 'constitutie');   // t cu cedilă
  assert.equal(A.normaliz('Republică'), 'republica');
  assert.equal(A.normaliz('ĂÎÂȘȚ'), 'aiast');
  assert.equal(A.normaliz('  Statul, de-drept! '), 'statul de drept');  // semne → spații, colaps, trim
  assert.equal(A.normaliz(''), '');
});

test('distanta — Levenshtein plafonat la „≤1 ne interesează"', () => {
  assert.equal(A.distanta('abc', 'abc'), 0);
  assert.equal(A.distanta('abc', 'abd'), 1);          // o substituție
  assert.equal(A.distanta('abc', 'ab'), 1);           // o ștergere
  assert.equal(A.distanta('abc', 'abcd'), 1);         // o inserție
  assert.equal(A.distanta('abc', 'axy'), 2);          // două substituții
  assert.equal(A.distanta('abc', 'abcde'), 2);        // diferență de lungime >1 → ieșire scurtă
  assert.equal(A.distanta('', ''), 0);
  assert.equal(A.distanta('a', ''), 1);
});

test('faraArticol — dezlipește articolul hotărât enclitic', () => {
  assert.equal(A.faraArticol('statul'), 'stat');
  assert.equal(A.faraArticol('legea'), 'lege');
  assert.equal(A.faraArticol('lucrarile'), 'lucrari');
  assert.equal(A.faraArticol('oamenilor'), 'oameni');
  // cuvânt deja nearticulat: neschimbat
  assert.equal(A.faraArticol('stat'), 'stat');
});

test('raspunsPotrivit — potriviri exacte, cu diacritice și cu majuscule', () => {
  assert.equal(A.raspunsPotrivit('constitutie', 'constituție'), true);
  assert.equal(A.raspunsPotrivit('Constituție', 'constitutie'), true);
  assert.equal(A.raspunsPotrivit('  republică  ', 'Republica'), true);
});

test('raspunsPotrivit — un răspuns gol nu e niciodată corect', () => {
  assert.equal(A.raspunsPotrivit('', 'stat'), false);
  assert.equal(A.raspunsPotrivit('   ', 'stat'), false);
  assert.equal(A.raspunsPotrivit('!!!', 'stat'), false);   // rămâne gol după normalizare
});

test('raspunsPotrivit — acceptă forma articulată în ambele sensuri', () => {
  assert.equal(A.raspunsPotrivit('Statul', 'stat'), true);   // elevul articulează
  assert.equal(A.raspunsPotrivit('stat', 'statul'), true);   // cheia e articulată
});

test('raspunsPotrivit — o literă greșită doar la cuvinte lungi (≥5)', () => {
  assert.equal(A.raspunsPotrivit('republika', 'republica'), true);   // 9 litere, 1 greșeală
  assert.equal(A.raspunsPotrivit('repablika', 'republica'), false);  // 2 greșeli → respins
  assert.equal(A.raspunsPotrivit('leg', 'lege'), false);             // scurt → fără toleranță
});

test('raspunsPotrivit — ignoră un cuvânt de legătură din față la cheie', () => {
  assert.equal(A.raspunsPotrivit('constitutie', 'o constitutie'), true);
  assert.equal(A.raspunsPotrivit('constitutie', 'de constitutie'), true);
});

test('raspunsPotrivit — limită cunoscută: articolul se scoate doar de pe ultimul cuvânt', () => {
  // Documentează comportamentul CURENT (fara() atinge doar ultimul cuvânt).
  // Dacă asta se schimbă vreodată, testul semnalează — intenționat.
  assert.equal(A.raspunsPotrivit('statul de drept', 'stat de drept'), false);
  assert.equal(A.raspunsPotrivit('stat de dreptul', 'stat de drept'), true);  // articol pe ultimul → merge
});

/* ═══ 2. Programarea eșalonată (SM-2 simplificat): programeaza ═══ */

// Rulează programeaza pornind de la o stare dată și întoarce rezultatul + reperele de timp.
function prog(init, calificativ) {
  A.__getState().antren = {};
  if (init) A.__getState().antren.k = Object.assign({}, init);
  const t0 = Date.now();
  const s = A.programeaza('k', calificativ);
  const t1 = Date.now();
  return { s, t0, t1 };
}
const ZI = A.ZI;
// Scadența unui element programat „în viitor" trebuie să cadă la acum + i zile.
function verificaScadentaViitoare(r) {
  assert.ok(r.s.d >= r.t0 + r.s.i * ZI, 'scadența nu e mai devreme de acum+i*ZI');
  assert.ok(r.s.d <= r.t1 + r.s.i * ZI, 'scadența nu e mai târziu de acum+i*ZI');
}

test('programeaza — element nou, răspuns bun (2): primul interval e 1 zi', () => {
  const r = prog(null, 2);
  assert.equal(r.s.i, 1);
  assert.equal(r.s.e, 250);   // „bun" nu modifică ușurința
  assert.equal(r.s.r, 1);
  assert.equal(r.s.g, 0);
  verificaScadentaViitoare(r);
});

test('programeaza — element nou, „ușor" (3): interval 2, ușurință +15', () => {
  const r = prog(null, 3);
  assert.equal(r.s.i, 2);
  assert.equal(r.s.e, 265);
  assert.equal(r.s.r, 1);
  verificaScadentaViitoare(r);
});

test('programeaza — element nou, „greu" (1): interval 1, ușurință −15', () => {
  const r = prog(null, 1);
  assert.equal(r.s.i, 1);     // max(1, round(0*1.2)) = 1
  assert.equal(r.s.e, 235);
  assert.equal(r.s.r, 1);
  verificaScadentaViitoare(r);
});

test('programeaza — răspuns greșit (0): resetează, uită, revine în aceeași sesiune', () => {
  const r = prog({ i: 20, e: 200, d: 0, r: 4, g: 1 }, 0);
  assert.equal(r.s.i, 0);
  assert.equal(r.s.r, 0);       // reușitele consecutive cad la zero
  assert.equal(r.s.g, 2);       // contorul de uitări crește
  assert.equal(r.s.e, 180);     // ușurință −20
  assert.ok(r.s.d <= Date.now(), 'după greșeală elementul e scadent imediat');
});

test('programeaza — a doua și a treia reușită cresc intervalul (1 → 3 → e×i)', () => {
  assert.equal(prog({ i: 1, e: 250, d: 0, r: 1, g: 0 }, 2).s.i, 3);         // r===1 → 3
  const r2 = prog({ i: 3, e: 250, d: 0, r: 2, g: 0 }, 2).s;
  assert.equal(r2.i, 8);        // round(3 * 250/100) = round(7.5) = 8
  assert.equal(r2.r, 3);
});

test('programeaza — „ușor" cu istoric folosește ușurința ACTUALIZATĂ (i = i·e/100·1.3)', () => {
  const s = prog({ i: 10, e: 200, d: 0, r: 2, g: 0 }, 3).s;
  assert.equal(s.e, 215);      // 200 + 15
  assert.equal(s.i, 28);       // round(10 * 215/100 * 1.3) = round(27.95) = 28
});

test('programeaza — ușurința e mărginită la [130, 280]', () => {
  assert.equal(prog({ i: 5, e: 140, d: 0, r: 2, g: 0 }, 1).s.e, 130);   // podea
  assert.equal(prog({ i: 5, e: 135, d: 0, r: 2, g: 0 }, 1).s.e, 130);   // rămâne pe podea
  assert.equal(prog({ i: 100, e: 275, d: 0, r: 2, g: 0 }, 3).s.e, 280); // tavan
});

test('programeaza — intervalul e mărginit la cel mult 365 de zile', () => {
  const r = prog({ i: 300, e: 280, d: 0, r: 5, g: 0 }, 2);   // round(300·280/100)=840 → 365
  assert.equal(r.s.i, 365);
  assert.equal(r.s.r, 6);
  verificaScadentaViitoare(r);
});

test('programeaza — scrie rezultatul înapoi în stare (același obiect)', () => {
  const r = prog(null, 2);
  assert.equal(A.__getState().antren.k, r.s);
  assert.equal(A.__getState().antren.k.i, 1);
});

/* ═══ 3. Curățarea stării: sanitizeaza (migrări + intrări stricate) ═══ */

test('sanitizeaza — intrare non-obiect → stare goală completă și validă', () => {
  for (const brut of [null, undefined, 42, 'sir', [], true]) {
    const s = A.sanitizeaza(brut);
    assert.equal(s.setari.tema, 'auto');
    assert.equal(s.clasa, 'a XII-a');
    assert.equal(s.vazutIntro, false);
    assert.equal(s.insigne, undefined);
    // câmpurile parcurse cu Object.keys nu trebuie să fie niciodată null
    for (const k of ['lectiiCitite', 'carduri', 'teste', 'notite', 'antren', 'note', 'activ', 'zile']) {
      assert.deepEqual(simplu(s[k]), {});
    }
  }
});

test('sanitizeaza — câmpurile-obiect stricate cad pe {} (nu pe șir/array)', () => {
  assert.deepEqual(simplu(A.sanitizeaza({ lectiiCitite: 'nu' }).lectiiCitite), {});
  assert.deepEqual(simplu(A.sanitizeaza({ lectiiCitite: [1, 2] }).lectiiCitite), {});
  assert.deepEqual(simplu(A.sanitizeaza({ carduri: 7 }).carduri), {});
});

test('sanitizeaza — antren: filtrare element-cu-element și mărginire numerică', () => {
  const s = A.sanitizeaza({ antren: {
    ok:    { i: 5, e: 200, d: 123, r: 2, g: 1 },
    sir:   'x', nul: null, numar: 42,            // valori non-obiect → sărite
    clamp: { i: 9999, e: 9999, d: -5, r: -3, g: 99999 },
    nan:   { i: 'abc', e: 'x', d: 'y', r: 'z', g: 'w' }   // bug istoric: „n.toFixed is not a function"
  } });
  assert.deepEqual(simplu(s.antren.ok), { i: 5, e: 200, d: 123, r: 2, g: 1 });
  assert.deepEqual(simplu(s.antren.clamp), { i: 365, e: 280, d: 0, r: 0, g: 9999 });
  assert.deepEqual(simplu(s.antren.nan), { i: 0, e: 250, d: 0, r: 0, g: 0 });   // toate pe implicit
  for (const k of ['sir', 'nul', 'numar']) assert.equal(k in s.antren, false);
});

test('sanitizeaza — note: n numeric obligatoriu, 0 se păstrează, null se aruncă', () => {
  const s = A.sanitizeaza({ note: {
    mat: [{ n: 8, cand: 100 }, { n: 'x' }, { fara: 1 }, null, { n: 5 }, { n: 0, cand: 5 }, { n: null }, { n: 99 }],
    nuArray: 'x',
    gol: [{ fara: 1 }]     // devine gol după filtrare → cheia dispare
  } });
  assert.deepEqual(simplu(s.note.mat), [
    { n: 8, cand: 100 },   // păstrat
    { n: 5, cand: 0 },     // cand lipsă → 0
    { n: 0, cand: 5 },     // nota 0 e reală, se păstrează
    { n: 10, cand: 0 }     // 99 mărginit la 10
  ]);
  assert.equal('nuArray' in s.note, false);
  assert.equal('gol' in s.note, false);
});

test('sanitizeaza — activ: doar chei-dată și valori întregi pozitive', () => {
  const s = A.sanitizeaza({ activ: {
    '2026-01-01': 3, 'notadate': 9, '2026-02-02': -1, '2026-03-03': 2.7
  } });
  assert.deepEqual(simplu(s.activ), { '2026-01-01': 3, '2026-03-03': 3 });  // 2.7 rotunjit, restul sărite
});

test('sanitizeaza — migrare v05→v06: „activ" se seamănă din „zile" doar dacă lipsește', () => {
  // fără activ, dar cu zile → seria nu trebuie să cadă la zero
  assert.deepEqual(simplu(A.sanitizeaza({ zile: { '2026-01-01': 2, 'bad': 5 } }).activ), { '2026-01-01': 2 });
  // cu activ prezent, „zile" NU se mai amestecă
  assert.deepEqual(simplu(A.sanitizeaza({ activ: { '2026-05-05': 1 }, zile: { '2026-01-01': 9 } }).activ), { '2026-05-05': 1 });
});

test('sanitizeaza — insigne: obiect prezent = „sădit", absent = undefined', () => {
  assert.deepEqual(simplu(A.sanitizeaza({ insigne: {} }).insigne), {});          // gol dar prezent
  assert.deepEqual(simplu(A.sanitizeaza({ insigne: { a: 123, b: 'x' } }).insigne), { a: 123 });  // b non-numeric sărit
  assert.equal(A.sanitizeaza({}).insigne, undefined);                            // nesădit
  assert.equal(A.sanitizeaza({ insigne: [1, 2] }).insigne, undefined);           // array ≠ obiect de insigne
});

test('sanitizeaza — vazutIntro se deduce din orice urmă de progres', () => {
  assert.equal(A.sanitizeaza({}).vazutIntro, false);
  assert.equal(A.sanitizeaza({ vazutIntro: true }).vazutIntro, true);
  assert.equal(A.sanitizeaza({ lectiiCitite: { x: 1 } }).vazutIntro, true);   // elev vechi, fără câmpul de intro
  assert.equal(A.sanitizeaza({ teste: { 'materie:x': { procent: 50 } } }).vazutIntro, true);
});

test('sanitizeaza — setări cu listă închisă: valoarea invalidă cade pe implicit', () => {
  // exact bug-ul „data-tema=banana": o valoare din import care nu potrivea niciun selector
  assert.equal(A.sanitizeaza({ setari: { tema: 'banana' } }).setari.tema, 'auto');
  assert.equal(A.sanitizeaza({ setari: { tema: 'intunecat' } }).setari.tema, 'intunecat');
  assert.equal(A.sanitizeaza({ setari: { ordineCarduri: 'xxx' } }).setari.ordineCarduri, 'aleatorie');
});

test('sanitizeaza — setări numerice: mărginire, rotunjire, NaN → implicit', () => {
  assert.equal(A.sanitizeaza({ setari: { marimeText: 9999 } }).setari.marimeText, 150);
  assert.equal(A.sanitizeaza({ setari: { marimeText: 10 } }).setari.marimeText, 80);
  assert.equal(A.sanitizeaza({ setari: { marimeText: 'abc' } }).setari.marimeText, 100);
  assert.equal(A.sanitizeaza({ setari: { obiectivZilnic: 3.9 } }).setari.obiectivZilnic, 4);   // rotunjit apoi în [1,20]
});

test('sanitizeaza — setări booleene: coerciție consecventă', () => {
  assert.equal(A.sanitizeaza({ setari: { haptic: 0 } }).setari.haptic, false);
  assert.equal(A.sanitizeaza({ setari: { haptic: 'da' } }).setari.haptic, true);
  assert.equal(A.sanitizeaza({ setari: { feedbackImediat: '' } }).setari.feedbackImediat, false);
});

test('sanitizeaza — clasa și ultima: doar șiruri nevide', () => {
  assert.equal(A.sanitizeaza({ clasa: 'a X-a' }).clasa, 'a X-a');
  assert.equal(A.sanitizeaza({ clasa: 123 }).clasa, 'a XII-a');
  assert.equal(A.sanitizeaza({ clasa: '' }).clasa, 'a XII-a');
  assert.equal(A.sanitizeaza({ ultima: '#/lectie/x/y' }).ultima, '#/lectie/x/y');
  assert.equal(A.sanitizeaza({ ultima: 123 }).ultima, '');
});

/* ═══ 4. Scorul testului: pct (folosit direct în rezultatTest) ═══ */

test('pct — procent rotunjit', () => {
  assert.equal(A.pct(5, 10), 50);
  assert.equal(A.pct(1, 3), 33);
  assert.equal(A.pct(2, 3), 67);
  assert.equal(A.pct(10, 10), 100);
});

test('pct — test gol nu produce NaN (garda Math.max(1, b))', () => {
  // rezultatTest face pct(qScor, quiz.length); un test de 0 întrebări nu trebuie
  // să scrie „NaN%" în stare și pe ecran.
  assert.equal(A.pct(0, 0), 0);
  assert.equal(Number.isNaN(A.pct(0, 0)), false);
});
