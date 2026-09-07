---
titlu: Jurnal 2026-08-26 — Supra-tema Auroră v10
tip: jurnal
versiune: "10"
actualizat: 2026-08-26
tags: [jurnal, culori, paleta, sticla, glass, animatii, tema]
---

# Jurnal 2026-08-26 — v10, supra-tema „Auroră”

Legături: [[Științe Sociale — MOC]] · [[Palete și tokenuri]] · [[Glass + Neomorfism]] ·
[[Animații iOS]] · [[Design System v01]] · [[Versiuni]] ·
[[Jurnal 2026-08-22 — Cromatică v05]]

## Cerința

Un pachet de design extern (arhivă `MacOS_audit_design_proposal`, cu `HANDOFF.md` +
`assets/tema-aurora.css` gata scris) cu obiectivul: **paletă mai spectaculoasă pe ambele
teme, mai multă transluciditate și un set de efecte de mișcare — fără a rescrie
arhitectura din `assets/app.css`**. Prototipul de referință: proiectul de design
„Științe Sociale — iOS v2”. Sarcina: traducerea lui în repo, în stilul repo-ului.

## Decizia de design

Aurora e un **strat de tokeni**, nu un redesign. Se încarcă în `index.html` imediat
**după** `app.css` și rescrie doar valorile de paletă, sticlă și relief. Motivul e
arhitectural: `app.css` are patru straturi cu ordine semnificativă (stratul 3
suprascrie intenționat stratul 2); o inserție în mijloc ar rupe acea ordine, un fișier
separat încărcat la final nu poate. Zero reguli de componentă rescrise — cu o singură
excepție documentată (§4.8): gradientele de brand trec de la două trepte la trei (intră
`--brand-3`, cyan), iar o declarație în două trepte nu poate folosi un token nou.

Regula-cheie a sistemului rămâne intactă: **„adâncimea aparține conținutului,
transparența aparține cadrului”**. Aurora nu mută nimic dintr-o tabără în alta; doar
duce sticla cadrului mai departe în transparență și recolorează meshul ambiental.

- **Luminos — „porțelan de iris”.** Suprafețele trec de pe nisip cald (hue 30°) pe
  porțelan cu tentă de iris (hue 265°): `--surface-base #F7EEE2 → #F4F1FC`. Brand
  `#234B6F → #5B4BD6` (iris), accent `#C8901E → #F2A118` (ambră), voce nouă `--brand-3
  #1FA8C4` (cyan) doar în gradiente.
- **Întunecat — „auroră de indigo”.** Bleumarin `#141F33 → #0D1226`, cerneală
  liliac-fildeș, brand `#A99BFF`, accent `#FFC24B`, cyan `#4FD8E8`.
- **Sticlă mai transparentă:** alfa `.62 → .42` (luminos) și `.58 → .34` (întunecat),
  blur `20/22px → 30/32px`, saturație `180% → 200%`, muchii bicolore (fir cald sus,
  cyan jos). Alfa mai mic **și** blur mai mare împreună — separat, alfa mic dă folie
  murdară, blurul mare fără transparență dă placă opacă.
- **Neumorfism recalculat** pe noile suprafețe (umbră de iris, nu gri) și **mesh
  ambiental** pe ambră/iris/cyan (luminos) și auroră violet/indigo/teal (întunecat).
- **Efecte opt-in**, activate doar prin clase/atribute noi: reflex specular pe cardurile
  hero (`aur-sheen`), shimmer în bare (`aur-live`), cifră-erou în degrade (`aur-numar`),
  turtirea indicatorului de tab (`aur-jump`), toast tip Dynamic Island (`aur-island`).

## Ce s-a atins

- **NOU `assets/tema-aurora.css`** — copiat din pachet, apoi corectat și extins (vezi jos).
- `index.html` — link către temă după `app.css`; `theme-color` meta + bootstrap-ul de
  temă din `<head>` pe noile suprafețe (`#F4F1FC` / `#0D1226`); `?v=13 → ?v=14`.
- `assets/app.js` — clase opt-in în markup: `aur-sheen` pe cardul „Astăzi”; `aur-sheen`
  pe „Antrenamentul de azi”; `aur-live` pe bara „Astăzi” și pe bara de rezultat;
  `aur-numar` pe titlul de rezultat; turtirea `.tab-ind` (`aur-jump` + reflow) în funcția
  de schimbare tab; `aur-island` pe cele două toasturi.
- `sw.js` — `CACHE v13 → v14`, `SHELL` cu `?v=14` + `./assets/tema-aurora.css?v=14`
  precache-uit.
- `data/versiuni.json` — intrare nouă **v10 „Temă nouă «Auroră»”** (cache 14), scrisă
  pentru elev; `curenta → "10"`.

## Corecții față de pachet (înainte de merge)

Trei intervenții proprii, dincolo de simpla copiere:

1. **Mișcare redusă forțată din Setări — regulă invalidă (bug real din pachet).**
   Ultima linie folosea pseudo-elemente (`::after`/`::before`) într-un `:is()` — ceea
   ce invalidează întreaga regulă, deci parser-ul o ignoră. Efect: la
   `[data-miscare="redusa"]` **fără** preferință de sistem, sclipirea/shimmerul/aureola
   ar fi continuat să ruleze. Rescrisă cu selectoarele enumerate separat.
2. **Heatmap rămas pe paleta veche (găsit de `verificator-cod`).** `--hm-0..4` (rampa
   din Progres) nu erau rescriși de Aurora, deci mergeau nisip → bleumarin peste
   porțelanul de iris. Re-declarați pe iris, cinci trepte distincte, ambele teme
   (confirmat empiric: legende `#E6E2F7…#4B39B8` luminos, `#1B1B44…#A99BFF` întunecat).
3. **`aur-numar` cu contrast sub prag pe luminos (găsit de ambii agenți).** Nota de la
   rezultat e **text informativ**, iar degradeul ambră/cyan pe porțelan cvasi-alb cădea
   sub 3:1 (text mare). Gradientul devine per-temă via `--aur-numar-grad`: pe luminos
   iris / ambră-text / smarald (6,4 · 8,1 · ~4,8 : 1), pe întunecat culorile vii se
   păstrează.
4. **`aur-breathe` scos din card (găsit de `verificator-ui`).** `animation-name`
   computat era `list-in` — regula `.view.stagger .enter` (specificitate 0,3,0) din
   app.css bate `.aur-breathe` (0,1,0), deci respirația nu rula; a o forța ar fi stricat
   animația de intrare pentru un puls de `scale(1.012)` abia perceptibil. Clasa scoasă
   din markup; regula CSS rămâne ca utilitar opt-in, cu o notă care avertizează să nu
   fie pusă pe un `.card` din listă cu stagger.

## Verificare (gate-ul de merge)

**Verificatori locali — toți verzi.** JSON valid (`data/*.json` + manifest);
`node --check` `app.js`/`sw.js`; `verifica-css` pe `app.css` (2186 linii) **și** pe
`tema-aurora.css` (444 linii), acolade echilibrate; `verifica_vault` (fără legături
rupte); testele comportamentale **33/33**; sincronizarea `CACHE v14 ↔ ?v=14 ↔
versiuni.json cache 14, curenta 10`; `test-sw.mjs` cu SW activ — **exact o reîncărcare**
la trecerea pe v14, 60 de carduri, **zero erori JS**, fundal nou `#F4F1FC` servit corect
prin SW.

**Echipa de agenți.** `verificator-cod`: niciun blocant; a confirmat cascada tokenilor
(singurii nerescriși erau `--hm-0..4`, corectați), rezervele acoperite
(`@supports`/`transparenta`/`contrast`), `aur-island` compatibil cu poziționarea
toastului și cu animația de ieșire; a găsit heatmap-ul și contrastul `aur-numar`.
`verificator-ui` (Playwright, Chromium 1194): **69 de capturi** — 7 lățimi (320–1440) +
peisaj 844×390 × 2 teme × 3 ecrane + modurile de accesibilitate. **Zero derulare
orizontală**, **toate țintele ≥44px**, sclipirea nu iese din card, `data-transparenta`
opacizează + ascunde meshul, `data-contrast` transformă umbrele în linii de 1px,
`data-miscare` oprește animațiile **fără deplasare de layout** (bounding box identic
înainte/după). A găsit contrastul `aur-numar` (corectat) și `aur-breathe` care nu rula
(scos). Toate constatările **corectate și reverificate** înainte de merge.

## Ce a rămas ca notă (neblocant)

- Sclipirea `aur-sheen` continuă în `data-contrast="ridicat"` (efect de mișcare, oprit
  doar de `data-miscare` — conform specificației). De reconsiderat dacă vreodată
  accesibilitatea cere oprirea mișcării și în contrast ridicat.
- `aur-halo` (aureola conică) rămâne definit dar neaplicat: aplicația nu are un inel de
  progres SVG, ci bare. Disponibil ca opt-in dacă apare un inel.
