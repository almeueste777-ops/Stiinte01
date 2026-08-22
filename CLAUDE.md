# Științe Sociale — ghid pentru Claude

Aplicație PWA de studiu (HTML + CSS + JS, **zero dependențe, zero build**) pentru liceu,
profil umanist, frecvență redusă. Fișierele din repo sunt exact fișierele publicate.

## ⚠️ Regula nr. 1 — CLAUDE.md ⇒ Obsidian

**Ori de câte ori citești acest fișier, citește și vault-ul Obsidian.** Minim:

1. `vault/00-Index/Științe Sociale — MOC.md` — harta documentației;
2. cea mai recentă notă din `vault/10-Jurnal/` — ce s-a lucrat ultima dată și de ce.

Vault-ul este memoria proiectului: deciziile de design, arhitectura și rapoartele de
verificare stau acolo, nu în capul nimănui. Nu începe lucrul fără acest context.

## Regula nr. 2 — echipa de verificare, la fiecare rulare

Nicio livrare nu pleacă neverificată. La fiecare rulare (sesiune de lucru care schimbă
codul), înainte de merge:

1. **Verificatorii locali** (aceiași din CI):
   ```bash
   for f in data/*.json manifest.webmanifest; do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))"; done
   node --check assets/app.js && node --check sw.js
   node tools/verifica-css.mjs assets/app.css
   python3 tools/verifica_vault.py
   ```
2. **Echipa de agenți** — lansează în paralel agenții din `.claude/agents/`:
   - `verificator-cod` — recitește diff-ul adversarial, caută bug-uri reale;
   - `verificator-ui` — pornește serverul, face capturi la 320/360/390/768/1024/1440 px
     (plus peisaj 844×390), teme luminoasă + întunecată, și caută derulare orizontală,
     elemente tăiate, ținte sub 44px.
3. Ce găsesc agenții **se corectează și se reverifică** înainte de merge. Nu se
   declară rezolvat ce nu a fost reverificat empiric.

## Procesul de livrare

1. Se lucrează pe un **branch**, niciodată direct pe `main`.
2. Verificarea de mai sus trece → branch-ul se **îmbină în `main`** și se face push.
   **Îmbinarea se face automat, fără să mai fie cerută de fiecare dată** — permisiunea e
   dată o dată pentru totdeauna. Nu se îmbină nimic neverificat.
3. **Trei jurnale, la fiecare livrare care schimbă ceva în aplicație. Toate trei, mereu:**

   | Unde | Ce se scrie | Pentru cine |
   |---|---|---|
   | `jurnal.md` | ce s-a făcut, de ce, cu ce rezultat; secțiune nouă la final | pentru cine întreține codul |
   | `vault/10-Jurnal/` + link din MOC | nota de rulare, legată de restul documentației | pentru memoria proiectului |
   | **`data/versiuni.json`** | ce s-a schimbat **pentru elev**, fără jargon | pentru utilizator |

   `data/versiuni.json` alimentează ecranul **„Ce s-a schimbat”** din aplicație (Setări →
   Despre → *Ce s-a schimbat*, lângă *Caută o versiune nouă*). La fiecare livrare:
   - dacă e o versiune nouă a aplicației, se adaugă o **intrare nouă la începutul listei**
     (`v`, `nume`, `data`, `cache`, `schimbari`) și se actualizează `curenta`;
   - dacă e o corecție în aceeași versiune, se completează `schimbari` la intrarea de sus;
   - `cache` din intrare trebuie să fie **același număr** cu `CACHE` din `sw.js`;
   - textul se scrie **pentru elev**: „lecțiile se descarcă doar când sunt deschise”, nu
     „încărcare leneșă cu memoizare și token de randare”.
4. La **orice modificare** a fișierelor publicate, crește versiunea `CACHE` din `sw.js`
   (`stiinte01-vN` → `vN+1`), altfel utilizatorii rămân pe versiunea veche din cache.
   Dacă s-a schimbat `app.css`/`app.js`, crește la același `N` și `?v=` din `index.html`
   și din `SHELL` (CI-ul verifică sincronizarea). La modificări de SW, rulează și
   `node tools/test-sw.mjs` (cu serverul local pornit) — testează ciclul de update
   cu service worker activ.
5. Push pe `main` republică automat aplicația (GitHub Pages + Cloudflare Pages, dacă e
   conectat). Workflow-urile din `.github/workflows/` verifică și publică.

## Rulare locală

```bash
python3 -m http.server 8765    # apoi http://localhost:8765 — file:// NU merge (SW + fetch)
```

## Harta fișierelor

| Cale | Rol |
|---|---|
| `index.html` | schelet + bara de navigare |
| `assets/app.css` | 4 straturi: tokeni → tokeni derivați → componente → mișcare; secțiunea 19 = responsiv |
| `assets/app.js` | rutare pe hash, ecrane, stare în `localStorage` |
| `sw.js` | service worker, cache-first; **bump `CACHE` la fiecare release** |
| `data/curriculum.json` | planul-cadru: clase, materii, arii, probe de bacalaureat |
| `data/sursa/*.txt` | conținutul scris de om, în DSL text (vezi README) |
| `data/module/<id>.json` | conținutul generat: un modul = o materie într-un an |
| `data/continut.json` | **index generat** — nu se editează de mână |
| `data/versiuni.json` | **jurnalul de versiuni arătat în aplicație** — se completează la fiecare livrare |
| `jurnal.md` | jurnalul de lucru al proiectului |
| `vault/` | vault Obsidian: documentație scrisă de mână (foldere numerotate) + conținut generat de `tools/graphify.py` (nu edita folderele generate) |
| `docs/PLAN.md` | ghidul de publicare |

## Linkul aplicației

- GitHub Pages: <https://almeueste777-ops.github.io/Stiinte01/>
- Cloudflare Pages (dacă proiectul e conectat la repo): <https://stiinte01.pages.dev>
