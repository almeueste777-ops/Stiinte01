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

     [cronologie] Titlu opțional                     ← vizual: cronologie (max 2/lecție)
     ~ 1475 :: Ștefan cel Mare învinge la Vaslui     ← pas: an :: text
     [schema] Titlu opțional                         ← vizual: schemă de blocuri
     ~ Substrat geto-dac :: ~160 de cuvinte          ← bloc: etichetă :: text (opțional)
     > 0-3, 1-3, 2-3                                  ← legături între blocuri (indici 0-based)

   Un vizual („~” dintr-un bloc [cronologie]/[schema]) ține până la prima altă
   directivă. Se compilează în câmpul `vizual` al lecției (listă de cel mult 2).

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

let eroriTotal = 0;
let esuate = 0;

for (const cale of fisiere) {
  try {
    converteste(cale);
  } catch (e) {
    /* O sursă stricată NU trebuie să oprească restul conversiei: altfel
       fișierele de după ea rămân tăcut la conținutul vechi, iar validatorul
       și indexul le confirmă ca fiind în regulă. */
    console.error(`${cale}: conversie eșuată — ${e.message}`);
    eroriTotal++; esuate++;
  }
}

if (esuate) console.error(`\n${esuate} fișier(e) neconvertite.`);
process.exit(eroriTotal ? 1 : 0);


function converteste(cale) {
  let erori = 0;
  const id = basename(cale).replace(/\.txt$/, '');
  const linii = readFileSync(cale, 'utf8').split('\n');

  const cap = {};                      // antetul (perechi cheie: valoare)
  const m = { id, capitole: [], teze: [] };
  let capitol = null, lectie = null, teza = null;
  let intrebare = null, rezumat = [], paragraf = [];
  let vizual = null;                   // blocul [cronologie]/[schema] deschis
  let inAntet = true;

  const gata = (nr) => {               // închide întrebarea curentă
    if (!intrebare) return;
    const tinta = teza ? teza.test : (lectie ? lectie.test : null);
    if (!tinta) {
      console.error(`${cale}:${nr}: întrebare în afara unei lecții sau teze`);
      erori++; intrebare = null; return;
    }
    if (intrebare.corect < 0) { console.error(`${cale}:${nr}: întrebare fără variantă corectă (+)`); erori++; }
    tinta.push(intrebare);
    intrebare = null;
  };
  /* Directivele de conținut au nevoie de o lecție deschisă. Fără gardă, un „*”
     rătăcit după „%% teza” arunca TypeError pe null și oprea toată conversia. */
  const cereLectie = (nr, ce) => {
    if (lectie) return true;
    console.error(`${cale}:${nr}: ${ce} în afara unei lecții`);
    erori++;
    return false;
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
      gata(nr); gataLectie(); lectie = null; vizual = null;
      const s = Number(t.replace(/^%%\s*teza\s*/i, ''));
      teza = { semestru: s, test: [] };
      m.teze.push(teza);
      return;
    }
    if (t.startsWith('###')) {                      // lecție
      gata(nr); gataLectie(); teza = null; vizual = null;
      const p = t.slice(3).split('|').map(x => x.trim());
      lectie = { id: p[0], titlu: p[1], rezumat: '', ideiCheie: [], termeni: [], carduri: [], test: [] };
      if (!capitol) { console.error(`${cale}:${nr}: lecție în afara unui capitol`); erori++; return; }
      capitol.lectii.push(lectie);
      return;
    }
    if (t.startsWith('##')) {                       // capitol
      gata(nr); gataLectie(); lectie = null; teza = null; vizual = null;
      const p = t.slice(2).split('|').map(x => x.trim());
      capitol = { id: p[1], titlu: p[2], semestru: Number(p[0]), lectii: [] };
      m.capitole.push(capitol);
      return;
    }

    const vh = t.match(/^\[(cronologie|schema)\]\s*(.*)$/);
    if (vh) {                                       // vizual: [cronologie] / [schema]
      gata(nr); gataParagraf();
      if (!cereLectie(nr, `vizual [${vh[1]}]`)) return;
      if (!Array.isArray(lectie.vizual)) lectie.vizual = [];
      vizual = { tip: vh[1] };
      const titlu = vh[2].trim();
      if (titlu) vizual.titlu = titlu;
      if (vh[1] === 'cronologie') vizual.pasi = []; else vizual.blocuri = [];
      lectie.vizual.push(vizual);
      return;
    }

    if (!t) { gataParagraf(); return; }

    const corp = t.slice(1).trim();
    /* Elementele de vizual („~” pas/bloc, „>” legături) au nevoie de blocul
       [cronologie]/[schema] deschis; le tratăm ÎNAINTE de a-l închide. Orice
       altă directivă (mai jos) închide blocul: `vizual = null`. */
    if (t[0] === '~') {
      gata(nr); gataParagraf();
      if (!cereLectie(nr, 'element de vizual (~)')) return;
      if (!vizual) { console.error(`${cale}:${nr}: „~” în afara unui bloc [cronologie]/[schema]`); erori++; return; }
      const [a, b] = corp.split('::').map(x => (x || '').trim());
      if (vizual.tip === 'cronologie') {
        if (!a || !b) { console.error(`${cale}:${nr}: pasul cronologiei cere „an :: text”`); erori++; return; }
        vizual.pasi.push({ an: a, text: b });
      } else {
        if (!a) { console.error(`${cale}:${nr}: blocul schemei cere o etichetă`); erori++; return; }
        const bloc = { eticheta: a };
        if (b) bloc.text = b;
        vizual.blocuri.push(bloc);
      }
      return;
    }
    if (t[0] === '>') {
      gata(nr); gataParagraf();
      if (!vizual || vizual.tip !== 'schema') { console.error(`${cale}:${nr}: „>” (legături) în afara unei scheme`); erori++; return; }
      const leg = [];
      for (const p of corp.split(',').map(s => s.trim()).filter(Boolean)) {
        const par = p.split('-').map(x => Number(x.trim()));
        if (par.length !== 2 || !par.every(Number.isInteger)) { console.error(`${cale}:${nr}: legătură invalidă „${p}” (aștept „i-j”)`); erori++; continue; }
        leg.push(par);
      }
      if (leg.length) vizual.legaturi = (vizual.legaturi || []).concat(leg);
      return;
    }
    vizual = null;
    switch (t[0]) {
      case '*':
        gata(nr); gataParagraf();
        if (!cereLectie(nr, 'idee-cheie (*)')) return;
        lectie.ideiCheie.push(corp);
        return;
      case '=': {
        gata(nr); gataParagraf();
        if (!cereLectie(nr, 'termen (=)')) return;
        const [a, b] = corp.split('::').map(x => (x || '').trim());
        if (!b) { console.error(`${cale}:${nr}: termen fără „::”`); erori++; return; }
        lectie.termeni.push({ t: a, d: b });
        return;
      }
      case '@': {
        gata(nr); gataParagraf();
        if (!cereLectie(nr, 'card (@)')) return;
        const [a, b] = corp.split('::').map(x => (x || '').trim());
        if (!b) { console.error(`${cale}:${nr}: card fără „::”`); erori++; return; }
        lectie.carduri.push({ f: a, v: b });
        return;
      }
      case '?':
        gata(nr); gataParagraf();
        if (!lectie && !teza) {
          console.error(`${cale}:${nr}: întrebare (?) în afara unei lecții sau teze`);
          erori++; return;
        }
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

  const nl = m.capitole.reduce((a, c) => a + c.lectii.length, 0);

  /* Nu scriem niciodată ieșire dintr-o sursă cu erori: altfel pe disc ar rămâne
     un modul defect (ex. `"corect": -1`), iar ultima linie din terminal ar fi
     un „OK” liniștitor. */
  if (erori) {
    console.error(`EȘEC  ${id} — ${erori} eroare(i); fișierul NU a fost scris.`);
    eroriTotal += erori;
    return;
  }

  writeFileSync(join(IESIRE, id + '.json'), JSON.stringify(iesire, null, 1) + '\n');
  console.log(`OK  ${id} — ${m.capitole.length} capitole, ${nl} lecții, ${m.teze.length} teze`);
}
