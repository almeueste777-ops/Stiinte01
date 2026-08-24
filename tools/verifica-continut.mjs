/* Verifică fișierele de modul din data/module/.

   Prinde exact greșelile care nu se văd la citire, dar strică aplicația în
   producție: un „corect” în afara listei de opțiuni (întrebare imposibil de
   nimerit), un id de lecție duplicat (progresul unei lecții s-ar vedea la
   alta), o materie scrisă altfel decât în planul de învățământ (modulul n-ar
   mai apărea sub anul lui), un capitol fără semestru (nu intră în nicio teză).

   Rulare:  node tools/verifica-continut.mjs
*/
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'data/module';
const cur = JSON.parse(readFileSync('data/curriculum.json', 'utf8'));

/* Perechile materie×clasă permise, exact cum apar în planul de învățământ. */
const permise = new Map();          // "clasa|materie" -> { arie, bac }
for (const c of cur.clase)
  for (const m of c.materii)
    permise.set(c.clasa + '|' + m.nume, { arie: m.arie, bac: !!m.bac, an: c.an });

const erori = [];
const idLectii = new Map();         // id -> fișierul în care a apărut prima dată
const idModule = new Set();

const text = (v, min = 1) => typeof v === 'string' && v.trim().length >= min;

function verificaIntrebare(q, unde) {
  if (!text(q.intrebare, 8)) erori.push(`${unde}: întrebare lipsă sau prea scurtă`);
  if (!Array.isArray(q.optiuni) || q.optiuni.length < 3)
    erori.push(`${unde}: sunt necesare cel puțin 3 opțiuni`);
  else {
    if (q.optiuni.some(o => !text(o))) erori.push(`${unde}: opțiune goală`);
    if (new Set(q.optiuni).size !== q.optiuni.length) erori.push(`${unde}: opțiuni identice`);
    if (!Number.isInteger(q.corect) || q.corect < 0 || q.corect >= q.optiuni.length)
      erori.push(`${unde}: „corect” = ${q.corect} nu indică o opțiune validă`);
  }
  if (!text(q.explicatie, 10)) erori.push(`${unde}: explicație lipsă sau prea scurtă`);
}

const fisiere = readdirSync(DIR).filter(f => f.endsWith('.json')).sort();
for (const f of fisiere) {
  let m;
  try { m = JSON.parse(readFileSync(join(DIR, f), 'utf8')); }
  catch (e) { erori.push(`${f}: JSON invalid — ${e.message}`); continue; }

  if (!text(m.id) || m.id + '.json' !== f) erori.push(`${f}: id-ul trebuie să fie „${f.replace(/\.json$/, '')}”`);
  if (idModule.has(m.id)) erori.push(`${f}: id de modul duplicat`);
  idModule.add(m.id);

  const cheie = m.clasa + '|' + m.materie;
  const plan = permise.get(cheie);
  if (!plan) {
    erori.push(`${f}: „${m.materie}” nu figurează la clasa ${m.clasa} în curriculum.json`);
  } else {
    if (m.arie !== plan.arie) erori.push(`${f}: aria „${m.arie}” ≠ „${plan.arie}” din plan`);
    if (!!m.bac !== plan.bac) erori.push(`${f}: marcajul BAC nu se potrivește cu planul`);
    if (m.an !== plan.an) erori.push(`${f}: anul ${m.an} ≠ ${plan.an} din plan`);
  }
  if (!text(m.descriere, 20)) erori.push(`${f}: descriere lipsă sau prea scurtă`);

  if (!Array.isArray(m.capitole) || !m.capitole.length) { erori.push(`${f}: niciun capitol`); continue; }

  const idCap = new Set();
  const semestre = new Set();
  for (const c of m.capitole) {
    const unde = `${f} › ${c.id || '(fără id)'}`;
    if (!text(c.id)) erori.push(`${unde}: capitol fără id`);
    if (idCap.has(c.id)) erori.push(`${unde}: id de capitol duplicat`);
    idCap.add(c.id);
    if (!text(c.titlu, 3)) erori.push(`${unde}: capitol fără titlu`);
    if (c.semestru !== 1 && c.semestru !== 2) erori.push(`${unde}: „semestru” trebuie să fie 1 sau 2`);
    semestre.add(c.semestru);
    if (!Array.isArray(c.lectii) || !c.lectii.length) { erori.push(`${unde}: capitol fără lecții`); continue; }

    for (const l of c.lectii) {
      const u = `${f} › ${l.id || '(fără id)'}`;
      if (!text(l.id)) erori.push(`${u}: lecție fără id`);
      else if (idLectii.has(l.id)) erori.push(`${u}: id de lecție duplicat (deja în ${idLectii.get(l.id)})`);
      else idLectii.set(l.id, f);
      if (!text(l.titlu, 3)) erori.push(`${u}: lecție fără titlu`);
      if (!text(l.rezumat, 120)) erori.push(`${u}: rezumatul are sub 120 de caractere`);
      if (!Array.isArray(l.ideiCheie) || l.ideiCheie.length < 3)
        erori.push(`${u}: sunt necesare cel puțin 3 idei-cheie`);
      else if (l.ideiCheie.some(i => !text(i, 10))) erori.push(`${u}: idee-cheie goală sau prea scurtă`);
      if (l.termeni && (!Array.isArray(l.termeni) || l.termeni.some(t => !text(t.t) || !text(t.d, 10))))
        erori.push(`${u}: listă de termeni invalidă`);
      if (!Array.isArray(l.carduri) || l.carduri.length < 3) erori.push(`${u}: sunt necesare cel puțin 3 carduri`);
      else if (l.carduri.some(c2 => !text(c2.f, 5) || !text(c2.v, 2))) erori.push(`${u}: card incomplet`);
      if (!Array.isArray(l.test) || l.test.length < 3) erori.push(`${u}: testul lecției are sub 3 întrebări`);
      else l.test.forEach((q, i) => verificaIntrebare(q, `${u} › întrebarea ${i + 1}`));
    }
  }

  /* Teza se dă pe semestru: fiecare semestru care are capitole trebuie să aibă
     și teză, altfel butonul din ecranul materiei ar duce în gol. */
  const teze = Array.isArray(m.teze) ? m.teze : [];
  for (const s of [...semestre].sort()) {
    const t = teze.find(x => x.semestru === s);
    if (!t) { erori.push(`${f}: lipsește teza pentru semestrul ${s}`); continue; }
    if (!Array.isArray(t.test) || t.test.length < 8)
      erori.push(`${f} › teza sem. ${s}: sub 8 întrebări`);
    else {
      t.test.forEach((q, i) => verificaIntrebare(q, `${f} › teza sem. ${s} › întrebarea ${i + 1}`));
      /* Teza se dă întreagă, amestecată: aceeași întrebare de două ori irosește un
         item și degradează proba. Enunțuri identice (după normalizare) = eroare. */
      const vazute = new Map();
      t.test.forEach((q, i) => {
        const cheie = String(q.intrebare || '').toLowerCase().replace(/\s+/g, ' ').trim();
        if (cheie && vazute.has(cheie))
          erori.push(`${f} › teza sem. ${s}: întrebare duplicată (poz. ${vazute.get(cheie) + 1} și ${i + 1})`);
        else vazute.set(cheie, i);
      });
    }
  }
  for (const t of teze)
    if (!semestre.has(t.semestru)) erori.push(`${f}: teză pentru semestrul ${t.semestru}, care nu are capitole`);
}

if (erori.length) {
  console.error(`CONȚINUT INVALID — ${erori.length} probleme:`);
  erori.slice(0, 80).forEach(e => console.error('  ' + e));
  if (erori.length > 80) console.error(`  … și încă ${erori.length - 80}`);
  process.exit(1);
}
console.log(`OK  ${fisiere.length} module, ${idLectii.size} lecții — structură validă`);
