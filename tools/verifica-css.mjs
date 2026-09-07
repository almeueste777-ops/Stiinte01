/* Verifică structura unui fișier CSS fără nicio dependență.
   Prinde exact clasa de greșeală care altfel trece nevăzută: o acoladă lipsă,
   după care browserul interpretează restul fișierului ca reguli imbricate și
   jumătate din stiluri dispar tăcut — fără nicio eroare în consolă.
   Rulare: node tools/verifica-css.mjs assets/app.css */
import { readFileSync } from 'node:fs';

const cale = process.argv[2] || 'assets/app.css';
const src = readFileSync(cale, 'utf8');

let i = 0, linie = 1, adancime = 0, erori = [];
const stiva = [];          // liniile pe care s-au deschis acoladele încă nedeschise

while (i < src.length) {
  const c = src[i];
  if (c === '\n') { linie++; i++; continue; }
  // comentarii
  if (c === '/' && src[i + 1] === '*') {
    const fin = src.indexOf('*/', i + 2);
    if (fin === -1) { erori.push(`linia ${linie}: comentariu neînchis`); break; }
    linie += src.slice(i, fin).split('\n').length - 1;
    i = fin + 2; continue;
  }
  // șiruri
  if (c === '"' || c === "'") {
    let j = i + 1;
    while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
    if (j >= src.length) { erori.push(`linia ${linie}: șir neînchis`); break; }
    i = j + 1; continue;
  }
  // Ghilimele tipografice în pozitie de cod (in comentarii sunt firesti):
  // `content:\u201d\u201d` se parseaza ca ident invalid, declaratia dispare tacut
  // si nimic nu crapa vizibil. Bug real, gasit de verificatorul-cod la v02.
  if (c === '\u201c' || c === '\u201d' || c === '\u2018' || c === '\u2019') {
    erori.push(`linia ${linie}: ghilimea tipografica (U+${c.codePointAt(0).toString(16).toUpperCase()}) in afara comentariilor - foloseste \x22 sau '`);
    i++; continue;
  }
  if (c === '{') { stiva.push(linie); adancime++; }
  else if (c === '}') {
    if (!adancime) erori.push(`linia ${linie}: acoladă „}” în plus`);
    else { stiva.pop(); adancime--; }
  }
  i++;
}
for (const l of stiva) erori.push(`linia ${l}: acoladă „{” rămasă nedeschisă (lipsește „}”)`);

/* Imbricarea CSS e validă azi, dar în acest proiect NU o folosim: dacă apare,
   e aproape sigur o acoladă uitată, nu o intenție. Semnalăm orice selector
   care începe cu „.” sau „#” aflat la adâncime > 0 în afara unui @media/@supports. */
const linii = src.split('\n');
/* Ultimul element e șirul gol de după newline-ul final — nu e o linie. */
const nrLinii = src.endsWith('\n') ? linii.length - 1 : linii.length;
let nivel = 0, inAt = [];
linii.forEach((l, idx) => {
  const curat = l.replace(/\/\*.*?\*\//g, '');
  const desc = (curat.match(/{/g) || []).length;
  const inch = (curat.match(/}/g) || []).length;
  const sel = curat.trim();
  if (nivel > 0 && !inAt.length && /^[.#][a-zA-Z][^{}]*{\s*$/.test(sel))
    erori.push(`linia ${idx + 1}: selector imbricat neintenționat → „${sel.slice(0, 60)}”`);
  if (/^@(media|supports|keyframes|property|font-face|layer)/.test(sel)) inAt.push(nivel);
  nivel += desc - inch;
  while (inAt.length && nivel <= inAt[inAt.length - 1]) inAt.pop();
});

if (erori.length) {
  console.error(`STRUCTURĂ INVALIDĂ în ${cale}:`);
  erori.forEach(e => console.error('  ' + e));
  process.exit(1);
}
console.log(`OK  ${cale} — structură validă (${nrLinii} linii, acolade echilibrate)`);
