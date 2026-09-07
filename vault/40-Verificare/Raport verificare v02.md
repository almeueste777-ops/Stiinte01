---
titlu: Raport verificare v02
tip: raport-verificare
versiune: "02"
actualizat: 2026-08-21
tags: [verificare, agenti, responsiv]
---

# Raport verificare v02

Legături: [[Științe Sociale — MOC]] · [[Jurnal 2026-08-21 — Responsiv v02]] ·
[[Responsivitate și viteză]] · [[Raport verificare v01]]

Echipa rulării v02: **verificator-cod** (adversarial, pe diff) și **verificator-ui**
(empiric, cu Playwright), lansați în paralel, plus bateria proprie (verificatorii din
CI + capturi pe 8 viewporturi × 2 teme × 7 ecrane).

## Ce a găsit verificator-cod

| Nr | Severitate | Constatarea | Rezolvarea |
|---|---|---|---|
| 1 | **BLOCANT** | `content:””` pe `body::before` — ghilimele **tipografice** (U+201D), nu ASCII; declarația invalidă era aruncată tăcut și fundalul ambiental nu se mai desena deloc, în ambele teme | octeții corectați la `""`; confirmat apoi pe captură că mesh-ul se desenează |
| 2 | IMPORTANT | SW cache-first putea stoca/servi un răspuns `redirected` la navigare — pe Cloudflare Pages (`/index.html` → 308 → `/`) browserul refuză un asemenea răspuns și aplicația nu ar mai porni deloc | cheia de cache a navigării e acum `./` (fără redirect), iar răspunsurile `redirected` nu se mai stochează |
| 3 | MINOR | orice navigare din scope primea shell-ul din cache (ex. `data/continut.json` deschis în tab) | navigările care nu sunt shell rămân network-first, cu shell doar ca rezervă offline |
| 4 | MINOR | `"id": "./"` în manifest se rezolvă la **originea** site-ului, nu la calea aplicației — identic cu vechiul `"/"`, deci no-op cu risc de coliziune între PWA-uri pe același domeniu | `id` scos; implicitul (= `start_url`) dă exact identitatea per-aplicație |
| 5 | MINOR | CLAUDE.md promitea „aceiași verificatori ca în CI", dar CI nu rula verificatorul de vault | pas nou în `verificare.yml`: `python3 tools/verifica_vault.py` |
| 6 | MINOR | nota de performanță din CSS spunea „sub 400 de noduri"; garda reală din JS e 2000 | cifra corectată |
| 7 | MINOR | sticky-ul notițelor folosea `--topbar-h` plin pe ferestre late dar scunde | override în blocul de peisaj cu `--topbar-h-compact` |

## Ce a găsit verificator-ui

| Nr | Severitate | Constatarea | Rezolvarea |
|---|---|---|---|
| 8 | MINOR | `.plan-grid` trecea pe 2 coloane de la 700px, deși intenția documentată era 900px | regula de la 700px exclude acum `.plan-grid` (`:not()`) |
| 9 | cosmetic, acceptat | la text mărit (bază 20px), tabelele frâng cuvinte fără cratimă („CURRICUL/ARĂ") | acceptat: `overflow-wrap:anywhere` garantează lipsa scroll-ului orizontal, care e prioritară; fără hyphens — suportul românesc e inegal |

Și lista lui de **trecute**: 12 viewporturi × 4 rute (inclusiv Galaxy Fold 280px și
2560×1440) fără scroll orizontal; rail exact de la 1024, pilulă sub; pastila aliniată
numeric (±3px) cu tabul selectat în toate cele 48 de combinații; grile 1→2→3 coloane
exact la praguri; `.two-col` comută exact la 900; schimbarea clasei sub 1ms;
reduced-motion fără clone reziduale; **zero erori JS** pe tot parcursul.

## Lecția rulării

Bug-ul blocant (nr. 1) a fost introdus de **uneltele de editare care „înfrumusețează"
ghilimelele**: într-un fișier plin de comentarii românești cu „ghilimele tipografice",
un `content:""` a fost transformat tăcut în `content:””`. A trecut prin toți
verificatorii — structura de acolade era impecabilă. De aceea `verifica-css.mjs`
detectează acum **ghilimelele tipografice în afara comentariilor** (eroare, nu
avertisment), iar clasa de bug e închisă definitiv, în CI.

Ca și la v01: nimic nu s-a declarat rezolvat fără reverificare empirică — bateria
completă de capturi a fost rerulată după corecturi, cu mesh-ul ambiental vizibil
pe captură.
