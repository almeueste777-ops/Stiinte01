/* Construiește indexul de conținut din fișierele de modul.

   Sursa de adevăr este `data/module/<id>.json` — câte un fișier per pereche
   materie×an. Din ele se generează DOUĂ lucruri, ca să nu existe niciodată
   două copii scrise de mână ale aceleiași informații:

     1. `data/continut.json` — indexul UȘOR (titluri, structură, contoare) pe
        care aplicația îl încarcă la pornire. Corpul lecțiilor rămâne în
        fișierul de modul și se cere abia când e deschis modulul.
     2. blocul MODULE din `sw.js` — lista de fișiere puse în precache, ca
        aplicația să funcționeze integral offline.

   Rulare:  node tools/construieste-index.mjs
   Ieșirea e deterministă: aceleași intrări produc exact aceleași fișiere,
   deci CI-ul poate verifica sincronizarea cu un simplu `git diff`.
*/
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'data/module';
const INDEX = 'data/continut.json';
const SW = 'sw.js';

const fisiere = readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
if (!fisiere.length) { console.error('Niciun modul în ' + DIR); process.exit(1); }

const module_ = [];
for (const f of fisiere) {
  const m = JSON.parse(readFileSync(join(DIR, f), 'utf8'));
  if (m.id + '.json' !== f) {
    console.error(`${f}: id-ul „${m.id}” nu se potrivește cu numele fișierului`);
    process.exit(1);
  }
  let nrLectii = 0, nrCarduri = 0, nrIntrebari = 0;
  const capitole = (m.capitole || []).map(c => {
    const lectii = (c.lectii || []).map(l => {
      nrLectii++;
      nrCarduri += (l.carduri || []).length;
      nrIntrebari += (l.test || []).length;
      return { id: l.id, titlu: l.titlu };
    });
    return { id: c.id, titlu: c.titlu, semestru: c.semestru, lectii };
  });
  const teze = (m.teze || []).map(t => ({ semestru: t.semestru, nrIntrebari: (t.test || []).length }));
  nrIntrebari += teze.reduce((a, t) => a + t.nrIntrebari, 0);
  module_.push({
    id: m.id, materie: m.materie, clasa: m.clasa, an: m.an,
    arie: m.arie, bac: !!m.bac, socioUman: !!m.socioUman,
    descriere: m.descriere,
    nrLectii, nrCarduri, nrIntrebari,
    capitole, teze
  });
}

/* Ordinea: întâi anul, apoi aria, apoi materia — exact ordinea din ecranul
   „Materii”, ca aplicația să nu trebuiască să sorteze la fiecare randare. */
const ARII = ['Om și societate', 'Limbă și comunicare',
              'Matematică și științe ale naturii', 'Tehnologii',
              'Curriculum la decizia elevului'];
module_.sort((a, b) =>
  a.an - b.an ||
  (ARII.indexOf(a.arie) + 1 || 99) - (ARII.indexOf(b.arie) + 1 || 99) ||
  a.materie.localeCompare(b.materie, 'ro'));

const index = {
  version: '03',
  actualizat: new Date().toISOString().slice(0, 10),
  nrModule: module_.length,
  nrLectii: module_.reduce((a, m) => a + m.nrLectii, 0),
  nrCarduri: module_.reduce((a, m) => a + m.nrCarduri, 0),
  nrIntrebari: module_.reduce((a, m) => a + m.nrIntrebari, 0),
  module: module_
};

/* Data de actualizare NU se rescrie dacă restul conținutului e identic:
   altfel fiecare rulare ar produce un commit gol și CI-ul de sincronizare
   ar pica pe o simplă schimbare de zi. */
let vechi = null;
try { vechi = JSON.parse(readFileSync(INDEX, 'utf8')); } catch { /* prima rulare */ }
if (vechi) {
  const { actualizat, ...restVechi } = vechi;
  const { actualizat: _, ...restNou } = index;
  if (JSON.stringify(restVechi) === JSON.stringify(restNou)) index.actualizat = actualizat;
}
writeFileSync(INDEX, JSON.stringify(index, null, 2) + '\n');

/* Lista de precache din sw.js, între marcaje. */
const sw = readFileSync(SW, 'utf8');
const START = '  /* MODULE:START */';
const STOP = '  /* MODULE:STOP */';
const i = sw.indexOf(START), j = sw.indexOf(STOP);
if (i === -1 || j === -1) { console.error('sw.js: lipsesc marcajele MODULE:START/STOP'); process.exit(1); }
const lista = module_.map(m => `  './data/module/${m.id}.json',`).join('\n');
const swNou = sw.slice(0, i) + START + '\n' + lista + '\n' + sw.slice(j);
if (swNou !== sw) writeFileSync(SW, swNou);

console.log(`OK  ${INDEX} — ${index.nrModule} module, ${index.nrLectii} lecții, ` +
            `${index.nrCarduri} carduri, ${index.nrIntrebari} întrebări`);
