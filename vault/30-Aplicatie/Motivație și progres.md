---
titlu: Motivație și progres
tip: nota-aplicatie
versiune: "06"
actualizat: 2026-08-23
tags: [motivatie, progres, insigne, gamificare, heatmap, onboarding]
---

# Motivație și progres (v06)

Legături: [[Științe Sociale — MOC]] · [[Sistemul de învățare]] · [[Arhitectura aplicației]] ·
[[Versiuni]] · [[Jurnal 2026-08-23 — Motivație și progres v06]]

Stratul „premium" adăugat în v06, după un audit față de aplicațiile de referință (Duolingo,
Quizlet, Anki, Brilliant, Khan Academy). Aplicația avea deja **pedagogie** și **design** peste
piață; îi lipsea **stratul de motivație** și un **tablou de progres**. Nimic din ce urmează nu
inventează conținut nou — totul se citește din starea deja existentă plus câteva contoare.

## Teza

> Motivația trebuie să rămână aliniată cu învățarea, nu s-o înlocuiască.

De aceea **insigne**, nu un sistem paralel de puncte (XP). Un XP peste stăpânirea deja măsurată
în [[Sistemul de învățare]] ar fi fost gamificare de dragul ei. Insignele se leagă de fapte de
învățare reale (o materie citită complet, o serie de zile, nota 10), deci recompensa împinge spre
scopul aplicației.

## Insignele

- **Douăzeci**, pe șase grupuri: Început, Volum, Foc, Notă, Stăpânire, Explorare.
- **Derivate din stare** — fiecare are un predicat `atins()` care citește progresul existent
  (lecții citite, `stats`, note, carduri, stăpânire). Nimic de bifat separat.
- **Monotone** — odată deblocate rămân, chiar dacă seria scade sau ștergi cardurile. Doar
  „Șterge tot" le readuce la zero.
- **Sădire tăcută** — la prima pornire pe v06, `verificaInsigne` înregistrează tăcut ce e deja
  meritat (`state.insigne` trece din `undefined` în obiect), ca un elev cu luni de progres să nu
  fie inundat de zeci de felicitări. După aceea, orice nou-deblocată e sărbătorită.

### Sărbătoarea
Un **toast** atașat pe `<body>` (ca să supraviețuiască re-randării ecranului care a declanșat
deblocarea) plus **confetti** pur CSS. Respectă comutatorul „Sărbători" din Setări și preferința
de „mișcare redusă" (fără confetti, toast doar estompat) — vezi [[Animații iOS]].

## Progresul (`#/progres`)

- **Streak** — seria de zile de studiu la rând, cea mai lungă serie, zile active în ultima
  săptămână.
- **Heatmap** — 18 săptămâni × 7 zile, cinci trepte de intensitate (tokeni per temă). Container
  cu `aspect-ratio` fix, deci celulele rămân pătrate și nu apare derulare orizontală nici la 320px.
- **Cifrele tale, stăpânire pe materii, note recente, de reluat curând** — toate din stare.

## Seria și activitatea

`state.activ` = intensitatea de studiu pe zi (lecție 1, sesiune de antrenament 2, test 2,
simulare 3). Ține separat de `state.zile`, care numără **strict lecțiile citite** (obiectivul
zilnic e „lecții pe zi"). Seria (`serie()`) citește `activ`, deci un elev care se antrenează
zilnic își păstrează seria. La trecerea de pe v05, `activ` se **migrează** din `zile`.

## Onboarding

O foaie de bun-venit la prima pornire (componentele `.sheet`/`.scrim` din [[Componente UI]],
pregătite din v01 și nefolosite până acum): clasă + obiectiv zilnic + o frază despre cum
funcționează. Reaccesibilă din Setări → „Revezi introducerea". Nu apare elevilor cu progres
anterior (aceeași filozofie „nu inunda elevul vechi" ca la insigne).

## Coerența resetărilor

Fiecare resetare granulară curăță și starea nouă pe care o „deține": `reset-progres` → `activ`
(seria + heatmapul), `reset-antren`/`reset-teste`/`reset-note` → contoarele corespunzătoare din
`stats`. Altfel Progresul ar arăta cifre contradictorii (ex. „0% stăpânit" lângă „25 de sesiuni").
