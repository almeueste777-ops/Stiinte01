/* Convertește sursele de conținut din `data/sursa/*.txt` în module JSON.

   De ce un format text și nu JSON scris direct: un modul are 15–20 de lecții,
   fiecare cu rezumat, idei-cheie, termeni, carduri și întrebări. În JSON asta
   înseamnă mii de ghilimele și acolade care se scriu greu și se citesc și mai
   greu. Formatul de mai jos se scrie ca o pagină de caiet, iar tot ce e strict
   (structura, escaparea, contoarele) îl face unealta.

   FORMAT — `data/sursa/<id>.txt`, UTF-8:

     materie: Logică, argumentare și comunicare
     clasa: a IX-a
     an: 1
     arie: Om și societate
     bac: da
     socioUman: da
     descriere: O frază despre ce conține modulul.

     ## 1 | log9-c1 | Argumentare și comunicare      ← capitol: semestru | id | titlu
     ### log9-01 | Ce este logica                    ← lecție: id | titlu
     Rândurile simple = rezumatul lecției. Un rând gol începe un paragraf nou.
     * Idee-cheie
     = termen :: înțelesul lui
     @ fața cardului :: verso
     ? Întrebarea de test?
     - variantă greșită
     + variantă corectă
     - altă variantă greșită
     ! Explicația răspunsului corect.

     %% teza 1                                       ← teza semestrului 1
     ? …  - …  + …  ! …

   Rulare:  node tools/text-in-modul.mjs [fisier.txt ...]
   Fără argumente convertește tot folderul `data/sursa`.
*/
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';

const SURSA = 'data/sursa';
const IESIRE = 'data/module';

const args = process.argv.slice(2);
const fisiere = args.length ? args
  : readdirSync(SURSA).filter(f => f.endsWith('.txt')).sort().map(f => join(SURSA, f));

let erori = 0;

for (const cale of fisiere) {
  const id = basename(cale).replace(/\.txt$/, '');
  const linii = readFileSync(cale, 'utf8').split('\n');

  const cap = {};                      // antetul (perechi cheie: valoare)
  const m = { id, capitole: [], teze: [] };
  let capitol = null, lectie = null, teza = null;
  let intrebare = null, rezumat = [], paragraf = [];
  let inAntet = true;

  const gata = (nr) => {               // închide întrebarea curentă
    if (!intrebare) return;
    if (intrebare.corect < 0) { console.error(`${cale}:${nr}: întrebare fără variantă corectă (+)`); erori++; }
    (teza ? teza.test : lectie.test).push(intrebare);
    intrebare = null;
  };
  const gataParagraf = () => {
    if (paragraf.length) { rezumat.push(paragraf.join(' ')); paragraf = []; }
  };
  const gataLectie = () => {
    if (!lectie) return;
    gataParagraf();
    lectie.rezumat = rezumat.join('\n');
    if (!lectie.termeni.length) delete lectie.termeni;
    rezumat = [];
  };

  linii.forEach((linieBruta, i) => {
    const nr = i + 1;
    const linie = linieBruta.replace(/\s+$/, '');
    const t = linie.trim();

    if (inAntet) {
      if (!t) return;
      if (/^(##|###|%%)/.test(t)) inAntet = false;
      else {
        const k = t.indexOf(':');
        if (k < 1) { console.error(`${cale}:${nr}: antet invalid → ${t}`); erori++; return; }
        cap[t.slice(0, k).trim()] = t.slice(k + 1).trim();
        return;
      }
    }

    if (t.startsWith('%%')) {                       // teză
      gata(nr); gataLectie(); lectie = null;
      const s = Number(t.replace(/^%%\s*teza\s*/i, ''));
      teza = { semestru: s, test: [] };
      m.teze.push(teza);
      return;
    }
    if (t.startsWith('###')) {                      // lecție
      gata(nr); gataLectie(); teza = null;
      const p = t.slice(3).split('|').map(x => x.trim());
      lectie = { id: p[0], titlu: p[1], rezumat: '', ideiCheie: [], termeni: [], carduri: [], test: [] };
      if (!capitol) { console.error(`${cale}:${nr}: lecție în afara unui capitol`); erori++; return; }
      capitol.lectii.push(lectie);
      return;
    }
    if (t.startsWith('##')) {                       // capitol
      gata(nr); gataLectie(); lectie = null; teza = null;
      const p = t.slice(2).split('|').map(x => x.trim());
      capitol = { id: p[1], titlu: p[2], semestru: Number(p[0]), lectii: [] };
      m.capitole.push(capitol);
      return;
    }

    if (!t) { gataParagraf(); return; }

    const corp = t.slice(1).trim();
    switch (t[0]) {
      case '*': gata(nr); gataParagraf(); lectie.ideiCheie.push(corp); return;
      case '=': {
        gata(nr); gataParagraf();
        const [a, b] = corp.split('::').map(x => (x || '').trim());
        if (!b) { console.error(`${cale}:${nr}: termen fără „::”`); erori++; return; }
        lectie.termeni.push({ t: a, d: b });
        return;
      }
      case '@': {
        gata(nr); gataParagraf();
        const [a, b] = corp.split('::').map(x => (x || '').trim());
        if (!b) { console.error(`${cale}:${nr}: card fără „::”`); erori++; return; }
        lectie.carduri.push({ f: a, v: b });
        return;
      }
      case '?':
        gata(nr); gataParagraf();
        intrebare = { intrebare: corp, optiuni: [], corect: -1, explicatie: '' };
        return;
      case '-': case '+':
        if (!intrebare) { console.error(`${cale}:${nr}: variantă în afara unei întrebări`); erori++; return; }
        if (t[0] === '+') intrebare.corect = intrebare.optiuni.length;
        intrebare.optiuni.push(corp);
        return;
      case '!':
        if (!intrebare) { console.error(`${cale}:${nr}: explicație în afara unei întrebări`); erori++; return; }
        intrebare.explicatie = corp;
        return;
      default:
        if (!lectie) { console.error(`${cale}:${nr}: text în afara unei lecții → ${t.slice(0, 40)}`); erori++; return; }
        gata(nr);
        paragraf.push(t);
    }
  });
  gata(linii.length); gataLectie();

  const iesire = {
    id,
    materie: cap.materie,
    clasa: cap.clasa,
    an: Number(cap.an),
    arie: cap.arie,
    bac: /^(da|true|1)$/i.test(cap.bac || ''),
    socioUman: /^(da|true|1)$/i.test(cap.socioUman || ''),
    descriere: cap.descriere,
    capitole: m.capitole,
    teze: m.teze.sort((a, b) => a.semestru - b.semestru)
  };
  if (!iesire.socioUman) delete iesire.socioUman;

  writeFileSync(join(IESIRE, id + '.json'), JSON.stringify(iesire, null, 1) + '\n');
  const nl = m.capitole.reduce((a, c) => a + c.lectii.length, 0);
  console.log(`OK  ${id} — ${m.capitole.length} capitole, ${nl} lecții, ${m.teze.length} teze`);
}

process.exit(erori ? 1 : 0);
