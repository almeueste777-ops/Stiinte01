---
titlu: Raport verificare v06
tip: raport
versiune: "06"
actualizat: 2026-08-23
tags: [verificare, raport, v06, motivatie, progres, insigne]
---

# Raport verificare v06

Legături: [[Științe Sociale — MOC]] · [[Jurnal 2026-08-23 — Motivație și progres v06]] ·
[[Motivație și progres]] · [[Versiuni]] · [[Raport verificare v05]]

Livrare de **funcționalitate** (strat de motivație + tablou de progres + onboarding), nu de
cromatică. Verificarea s-a concentrat pe corectitudinea stării noi (activitate, contoare,
insigne), pe migrare, pe fluxurile de reset și pe faptul că ecranele noi nu introduc derulare
orizontală, ținte mici sau probleme de contrast — pe lângă bateria obișnuită.

## Bateria locală

- Parse JSON pe `data/*.json` + `manifest.webmanifest`: trece.
- `node --check assets/app.js && node --check sw.js`: trece.
- `node tools/verifica-css.mjs assets/app.css`: structură validă, acolade echilibrate (2123 linii).
- `node tools/verifica-continut.mjs`: 60 module, 580 lecții — valid.
- `node tools/construieste-index.mjs` + `git diff`: `continut.json` și blocul MODULE neschimbate
  (doar bump-ul de CACHE/`?v`, intenționat).
- Sincronizarea `versiuni.json`: `curenta` = „06", `cache` = 10 = `CACHE` din `sw.js`, `?v=10`
  în `index.html` și `sw.js`.
- `python3 tools/verifica_vault.py`: fără legături rupte, fără note orfane.
- `tools/test-sw.mjs` (actualizat să sară onboarding-ul, cu SW activ): prima instalare fără
  reload, 60 de carduri de materii sub SW, exact o reîncărcare la update, stabil după, zero
  erori JS — **trecut**.
- Smoke-test propriu (Playwright + chrome-headless-shell): onboarding la pornire proaspătă și
  ascuns pentru utilizatorii cu progres; heatmap 126 de celule fără derulare orizontală la
  320/360/390/768/1024/1440px; 20 de medalioane; sărbătoare end-to-end; fluxurile de reset;
  zero erori de consolă.

## Constatările echipei de agenți

Doi agenți independenți, în paralel: `verificator-cod` (recitire adversarială + bateria locală)
și `verificator-ui` (server local + capturi Playwright pe scara 320–1440px + peisaj, ambele teme,
plus contrast ridicat, transparență redusă și mișcare redusă).

### verificator-ui — verdict curat, un singur defect minor

- **Țintă sub 44px (minor, corectat).** Butonul-scurtătură „N/20 insigne" din cardul „Cifrele
  tale" (`.btn.sm`, 40px înălțime) era singura țintă interactivă sub prag din toată aplicația.
  Corectat: înlocuit cu o **pastilă neinteractivă** (`.pill.soft`); navigarea spre Realizări
  rămâne pe butonul mare „Realizările mele" (52px), de pe același ecran.
- În rest, curat pe toată matricea (7 viewporturi × 2 teme × 12 ecrane + scenarii): zero derulare
  orizontală, heatmap-ul încape la 320px, zero erori de consolă, `theme-color` corect pe temă.
  Onboarding = foaie jos pe telefon / dialog centrat pe desktop; **la mișcare redusă confetti-ul
  NU apare, toast-ul doar se estompează**; contrast ridicat + transparență redusă lizibile; rail
  vertical corect ≥1024px; ecranele vechi fără regresii. Trei „fals-pozitive" investigate și
  eliminate (reflexul decorativ al cardului de memorare, comparație parțială de text la schimbarea
  clasei, bara de taburi în capturile `fullPage`).

### verificator-cod — niciun blocant, constatări minore corectate

- **Resetări granulare incoerente cu starea nouă (cea mai substanțială, corectată).**
  `reset-progres` nu golea `state.activ`, iar `reset-antren`/`reset-teste`/`reset-note` nu atingeau
  contoarele din `stats` — Progresul putea arăta „0% stăpânit" lângă „25 de sesiuni". Corectat:
  fiecare resetare curăță acum și starea nouă pe care o „deține".
- **După „Șterge tot", prima insignă recâștigată nu se sărbătorea (corectat).** `reset-tot` lăsa
  `state.insigne` `undefined` fără reîncărcare, deci următoarea deblocare se sădea tăcut. Corectat:
  se apelează `verificaInsigne` după orice reset, ca insignele să fie re-sădite ca `{}`.
- **Onboarding arătat elevilor vechi (corectat).** Salvările v05 n-au `vazutIntro`. Corectat în
  `sanitizeaza`: cine are progres anterior e considerat „a văzut".
- **Copie „peste douăzeci" pentru fix 20 de insigne (corectat)** în `versiuni.json` → „douăzeci".
- **Ramură moartă în Setări (corectat)** — `insigneDeblocate()` întoarce mereu un obiect;
  fallback-ul era inaccesibil. Simplificat.
- Confirmate sănătoase la recitire adversarială: fără dublă contorizare a stats/activității,
  migrarea `activ` corectă, monotonia insignelor, sădirea tăcută la `undefined`, siguranța
  `save()` la import (doar după o randare reușită), fus orar consistent (feliere ISO peste tot),
  fără XSS (tot textul dinamic prin `esc`, inclusiv `title`-ul din heatmap), rutare/„înapoi" pe
  progres/realizari corecte, `reduced()` niciodată literal „auto".

## Contrast — recalcul pe valorile hex reale (prag AA 4,5:1)

Perechile noi de text trec toate, majoritatea la AAA:

| Pereche | Luminos | Întunecat |
|---|---|---|
| `.toast-et` (ink-muted / sticlă densă) | 6,21 | 6,12 |
| `.toast` titlu (ink / sticlă) | 15,36 | 11,86 |
| medalion deblocat (brand-ink / brand·brand-2) | 8,09 / 6,22 | 8,42 / 10,78 |
| streak + flacără (accent-ink / aur·aur-2) | 6,49 / 8,13 | 9,44 / 11,36 |
| etichete heatmap (ink-muted / card) | 6,21 | 6,12 |

Nivelurile heatmapului nu sunt text (nu li se aplică pragul), dar cele cinci trepte sunt distincte
reciproc în ambele teme; treapta „gol" se retrage discret față de card, cum trebuie.

## Verdict

Livrare curată. Toate constatările — un defect minor UI și cinci constatări minore de cod — au
fost corectate și **reverificate empiric** (smoke-test dedicat pentru pastilă, resetări și
re-sădirea insignelor; zero erori de consolă). Bateria locală și `test-sw.mjs` trec integral.
Contrast AA peste tot, majoritatea AAA. Gata de îmbinare în `main`.
