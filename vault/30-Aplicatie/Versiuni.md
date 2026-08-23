---
titlu: Versiuni
tip: registru
versiune: "06"
actualizat: 2026-08-23
tags: [versiuni, changelog]
---

# Versiuni

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Design System v01]]

Schema de numerotare: **versiunea aplicației** (`01`, `02`, …) marchează o etapă vizibilă
pentru utilizator. Ea este independentă de versiunea cache-ului din `sw.js`, care crește la
*fiecare* modificare de fișiere, oricât de mică.

## v06 — 2026-08-23 · „Motivație și progres”

Auditul a arătat că aplicația era deja peste piață la pedagogie și design; îi lipsea **stratul de
motivație** și un **tablou de progres** — exact ce deosebește aplicațiile premium.

**Ce s-a schimbat**
- **Realizări** — 20 de insigne derivate din starea existentă (Început, Volum, Foc, Notă,
  Stăpânire, Explorare), cu celebrare (toast + confetti) la deblocare. Detalii:
  [[Motivație și progres]].
- **Progresul meu** — ecran nou: streak, **heatmap** de activitate pe 18 săptămâni, cifrele tale,
  stăpânirea pe materii, note recente, „de reluat curând".
- **Seria** numără acum orice studiu (lecție, antrenament, test, simulare), nu doar lecțiile
  citite. Câmp nou `state.activ`, migrat din `zile`.
- **Onboarding** — foaie de bun-venit la prima pornire (clasă + obiectiv), reaccesibilă din Setări.
- **Acasă** devine hub; Setări capătă comutatorul „Sărbători" și „Revezi introducerea".
- Cache SW: `stiinte01-v10`.

**Verificare:** bateria locală, smoke-test Playwright, `tools/test-sw.mjs`, plus
[[Raport verificare v06]]. Detalii: [[Jurnal 2026-08-23 — Motivație și progres v06]].

## v05 — 2026-08-22 · „Bleumarin de miezul nopții + nisip cald”

Recolorare: se schimbă valorile tokenilor de culoare, nu structura.

**Ce s-a schimbat**
- Tema luminoasă păstrează hârtia caldă de nisip, cu **bleumarin** ca brand (butoane, linkuri,
  focus) și **aur** ca accent. Tema întunecată devine un **bleumarin de miezul nopții**, cu
  scrisul de culoarea nisipului. Aurul e firul comun al ambelor teme.
- Doar valori de culoare (stratul de tokeni); structura, mărimile și așezarea neatinse.
- Contrast recalculat pe hex real: toate perechile critice AA, majoritatea AAA.
- Cache SW: `stiinte01-v9`.

**Verificare:** [[Jurnal 2026-08-22 — Cromatică v05]] · [[Raport verificare v05]].

## v04 — 2026-08-22 · „Antrenament și simulare de notă”

Aplicația capătă un **sistem de învățare** propriu-zis și o **probă cu notă** la fiecare materie.

**Ce s-a schimbat**
- **Antrenamentul** — o sesiune scurtă care amestecă cinci tipuri de exercițiu din mai multe
  lecții deodată, construită din șapte mecanisme cu sprijin în cercetarea învățării:
  repetiție eșalonată, recuperare activă, intercalare, efect de generare, calibrare, practică
  deliberată, stăpânire cu prag. Detaliile: [[Sistemul de învățare]].
- **Tipuri noi de exercițiu** — „Completează” (scrii termenul care lipsește dintr-o definiție)
  și „Explică” (reformulezi ideea cu cuvintele tale), pe lângă grilă, card și termen. Toate
  derivate din conținutul existent, fără material nou scris.
- **Calibrare** — înainte de fiecare răspuns spui cât ești de sigur; la final vezi de câte ori
  ai zis „sigur” și ai greșit.
- **Simulare de notă** — cinci puncte a câte 2 puncte, 20 de întrebări din toate capitolele.
  Punctajul obținut este nota: 18 din 20 → 9,00 → „Ești elev de nota 9”.
- Tabul „Carduri” a devenit **„Antrenez”**; cardurile clasice rămân, în hub și în lecție.
- Acasă și fiecare materie arată **stăpânirea** și câte elemente ai de repetat azi.

**Verificare:** bateria completă, 896 de combinații de viewport × temă × rută × preferințe,
testul de service worker cu SW activ, plus [[Raport verificare v04]] — 25 de defecte găsite
de cei doi agenți, toate corectate și reverificate.

## v03 — 2026-08-22 · „Temă, setări, conținut complet”

Aplicația capătă **temă comutabilă**, un **ecran de setări** și **tot conținutul** planului-cadru.

**Ce s-a schimbat**
- **Temă luminoasă/întunecată la alegere.** Paleta întunecată a ieșit din
  `@media (prefers-color-scheme)` și a trecut pe atribute `data-*` pe `<html>`, puse de un
  bootstrap inline din `<head>` — fără clipire la pornire. Aceeași soluție pentru contrast,
  mișcare și transparență, fiecare cu trei stări: automat, pornit, oprit.
- **Ecran de setări** (`#/setari`): aspect (temă, contrast, transparență, mișcare, densitate,
  font, mărimea textului 80–150%), studiu (clasa implicită, amestecare, explicații, cronometru,
  număr de întrebări) și date (export/import JSON, resetări separate).
- **Model de conținut pe module:** `data/module/<id>.json` ca sursă de adevăr, `data/continut.json`
  ca index generat, blocul MODULE din `sw.js` generat. Conținutul se scrie într-un DSL text
  (`data/sursa/*.txt`) și se convertește cu `tools/text-in-modul.mjs`.
- **Navigare nouă:** an → materie → capitol → lecție, cu test la fiecare lecție, test de capitol,
  test de materie și **teză semestrială**.
- **Încărcare leneșă** a modulelor, cu memoizare și token de randare; toate rămân în precache.
- **60 de module · 206 capitole · 580 de lecții · 2320 de carduri · 3614 întrebări.**

**Verificare:** verificatorii locali, pași noi de CI pentru conținut, `tools/test-sw.mjs` cu SW
activ, plus [[Raport verificare v03]]. Detaliile: [[Jurnal 2026-08-22 — Temă, setări, conținut v03]].

## v02 — 2026-08-21 · „Responsiv total”

Aplicația devine utilizabilă pe **orice dimensiune de ecran** și pornește instantaneu.

**Ce s-a schimbat**
- Scara completă de layout: grile pe 2–3 coloane de la 700px, lecția pe două coloane
  cu notițe lipicioase de la 900px, **rail vertical de navigare** pe desktop (≥1024px),
  treaptă pentru ecrane minuscule (≤340px), safe-area pe toate laturile.
- Viteză: service worker **cache-first la navigare** (pornire instantanee), preload
  pentru date, delegare de evenimente, schimbarea clasei fără re-randare completă,
  fundal ambiental mutat pe strat fix compus pe GPU.
- Manifest: `orientation: any` — instalarea nu mai blochează peisajul.
- Proces: `CLAUDE.md` cu regula „CLAUDE.md ⇒ Obsidian”, agenți verificatori în
  `.claude/agents/`, publicare automată pe GitHub Pages.

**Ce NU s-a schimbat** — datele, logica de progres, cheia `localStorage`, estetica
v01 (doar se întinde pe toate ecranele). Cache SW: `stiinte01-v3`.

**v02.1, aceeași zi** — reparat amestecul de versiuni din cache găsit de primul
utilizator real (HTML nou + CSS vechi de 7 zile): precache cu `cache:'reload'`,
`/assets/*` pe `no-cache`, reîncărcare automată unică la preluarea controlului de
către un SW nou. Cache SW: `stiinte01-v4`. Detalii: [[Responsivitate și viteză]].

Detalii: [[Responsivitate și viteză]] · [[Jurnal 2026-08-21 — Responsiv v02]] ·
[[Raport verificare v02]]

## v01 — 2026-08-21 · „Sticlă caldă”

Prima versiune cu identitate vizuală proprie. Faza 1: **doar design**, fără funcționalități noi.

**Ce s-a schimbat**
- Sistem de design complet: paletă caldă, hibrid sticlă + neomorfism, mișcare în stil iOS.
- Bară de taburi flotantă din sticlă mată, cu indicator care alunecă.
- Bară de sus translucidă, conținutul curge pe sub ea.
- Iconițe SVG inline în locul caracterelor unicode geometrice.
- Tranziții push/pop între ecrane, intrare în cascadă a listelor, feedback la atingere.
- Temă întunecată caldă (nu negru-albăstrui).

**Ce NU s-a schimbat** — intenționat, fiindcă faza 1 e strict estetică:
- Conținutul din `data/` (8 module, 25 de lecții, 41 de carduri, 25 de întrebări).
- Logica de rutare, de progres, de test.
- Formatul datelor din `localStorage` (cheia `stiinte01:v1` rămâne — progresul elevilor
  existenți nu se pierde).

**Verificare:** vezi [[Raport verificare v01]].

**După v01 — unificarea vaultului.** Ramura care conținea generatorul de vault
(`tools/graphify.py`) a fost îmbinată în `main`. Vaultul are acum **două jumătăți** în același
folder: conținutul de studiu, generat din `data/`, și documentația proiectului, scrisă de mână.
Generatorul a fost ajustat ca să nu suprascrie configurația `.obsidian`, iar verificatorul lui
ca să nu mai raporteze drept legături rupte wikilink-urile scrise în cod inline.
Total: **89 de note**, zero legături rupte, zero orfane. Vezi [[Științe Sociale — MOC]].

## v00 — punct de plecare

Aplicația funcțională, fără identitate vizuală: paletă rece bleumarin/gri, carduri plate,
iconițe unicode, zero animații.
