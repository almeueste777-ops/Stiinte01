---
titlu: Jurnal 2026-08-25 — Imagini explicative v08
tip: jurnal
versiune: "08"
actualizat: 2026-08-25
tags: [jurnal, continut, vizual, svg, accesibilitate, pipeline]
---

# Jurnal 2026-08-25 — v08, „Imagini explicative la lecție (sistem + pilot)"

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Strategie și foaie de parcurs]] ·
[[Versiuni]] · [[Jurnal 2026-08-24 — Mai multe lecții v07]]

## Cererea

Din foaia de parcurs, task-ul **T3** (prioritate cerută de utilizator): fiecare lecție să poată primi
**până la două** vizuale explicative care ajută înțelegerea. Sesiunea a luat **doar sub-faza T3.0** —
sistemul + pipeline-ul + un pilot — cu disciplina „un task cap-coadă" și cu obiectivul explicit de a
folosi cât mai puțini tokeni (munca grea în subagenți izolați, verificare independentă).

## Decizia de design: SVG inline, nu raster

Confirmată la preluare (era marcată „de confirmat"): **imagine = diagramă SVG desenată**, nu raster.
SVG-ul e minuscul (text), intră aproape gratis în precache, se scalează perfect la 320px și **se
temează singur** prin `currentColor` + tokenii din `app.css`. Rasterul ar fi contrazis etosul
zero-asset / offline (1152 lecții × 2 rastere = precache umflat + surse + licențe).

## Ce s-a implementat (cap-coadă)

Două tipuri de vizual — **`cronologie`** (linie de timp) și **`schema`** (blocuri + legături) — pe tot
lanțul:

- **DSL** nou în `data/sursa/*.txt`: bloc `[cronologie]`/`[schema]` cu linii `~ a :: b` și `> i-j`
  pentru legături (caractere neutilizate până acum — zero coliziune cu sintaxa veche);
- **compilator** (`tools/text-in-modul.mjs`): blocul → câmp nou `vizual` pe lecție (listă de ≤2);
- **randare** (`assets/app.js`): SVG inline în `viewLectie`, cu tot textul prin `esc()`, `role="img"`
  + `aria-label` + `<title>`/`<desc>`, temabil, `viewBox` + `max-width:100%` (fără overflow la 320px);
- **stil** (`assets/app.css`, §18d nou): responsive, temabil, override de contrast ridicat;
- **lint** (`tools/verifica-continut.mjs`): „≤2 vizuale/lecție", `tip` valid, câmpuri obligatorii,
  legături în interval — un vizual malformat devine **eroare de validare** (prins de CI).

**Pilot: `istorie-9`** (Istorie, cl. a IX-a), aditiv — o `schema` pe „Etnogeneza românească" (ist9-06:
substrat geto-dac + strat latin + adstrat slav → limba și poporul român) și o `cronologie` pe lupta
antiotomană (ist9-11: 1396 → 1600). Nimic vechi nu s-a schimbat: 24 de lecții + 2 teze byte-identice,
doar câte o cheie `vizual` nouă (66 inserții, 0 ștergeri). Compilatorul e **neutru la serializare**
(recompilarea sursei vechi dă modul byte-identic).

## Versionare

- `sw.js`: `CACHE` v11 → **v12** (fișiere publicate schimbate); lista `MODULE` neatinsă.
- `?v=` din `index.html` + `SHELL`: 10 → **12** — ridicat la `N` = numărul CACHE, cf. regulii #4. Asta
  **resincronizează** și checkul CI `CACHE ↔ ?v=` (care cere `?v == CACHE`), rămas roșu de la
  release-ul doar-date v07.
- `data/versiuni.json`: intrare nouă **v08 „Imagini explicative"** (cache 12), scrisă pentru elev;
  `curenta` → „08". `data/continut.json` neschimbat (vizualele nu intră în index).

## Verificare

Bateria locală trece integral: JSON; `node --check`; CSS; `verifica-continut` (60 module, 1152 lecții);
`verifica_vault`; `node --test` **32/32** (suita T1 intactă); index resincronizat; checkul CI
`CACHE v12 ↔ ?v=12` **OK**; `test-sw.mjs` **TRECUT** (exact o reîncărcare pe v12, 60 de carduri, zero
erori JS).

**Echipa de agenți.** `verificator-cod`: **CURAT** — a reprodus empiric escaparea (payload-uri XSS
neutralizate în titlu/an/etichetă/`aria-label`), aditivitatea, parserul care cade zgomotos la
malformări și declanșarea lintului; a prins și **corecția de `?v=`** (altfel CI roșu). `verificator-ui`
(restrâns la pilot, ca să ținem costul jos): **CURAT** pe 56 de combinații (7 lățimi × 4 teme) — zero
derulare orizontală / tăiere / ținte sub 44px — cu **două observații cosmetice, corectate și
reverificate**:

- **C1** — linia cronologiei era aproape invizibilă pe tema întunecată normală (`--hairline`, ~1,24:1)
  → trecută pe `--ink-faint` (~3,5:1), vizibilă pe ambele teme; overrideul de contrast ridicat rămâne.
- **C2** — anii nu primeau albastrul de brand din cauza specificității (`.vizual-svg text` bătea
  `.vz-an`) → regula ridicată la `.vizual-svg .vz-an`.

Reverificat prin **stil calculat** (linia = `--ink-faint`, anii = `--brand` pe luminos/întunecat/
contrast-ridicat) + capturi la 320px pe toate cele trei teme.

## Ce urmează

**T3.1+** — roll-out câte un modul/materie pe sesiune, **disciplinele de BAC întâi**, fiecare aditiv
și verificat, exact ca la v07. Epicul T3 rămâne deschis; sistemul e demonstrat pe pilot.
