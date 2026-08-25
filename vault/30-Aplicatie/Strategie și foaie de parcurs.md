---
titlu: Strategie și foaie de parcurs
tip: strategie
versiune: "07"
actualizat: 2026-08-25
tags: [strategie, foaie-de-parcurs, backlog, roadmap]
---

# Strategie și foaie de parcurs

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Sistemul de învățare]] ·
[[Motivație și progres]] · [[Versiuni]] · [[Jurnal 2026-08-24 — Mai multe lecții v07]]

Sursa unică de adevăr pentru **unde merge aplicația mai departe**. Auditul din 2026-08-25 a găsit
un cod, sincer, fără defecte: toți verificatorii verzi, `esc()` consistent (inclusiv notițele
locale), arbore curat, zero dependențe. **Distanța până la „deosebită" nu e în cod — e în scopul de
produs și în proces.** Teza: *de la aplicație frumoasă la aplicație pe care un elev își pariază bacul.*

> [!important] Protocol de lucru — UN SINGUR task pe sesiune
> La fiecare sesiune nouă:
> 1. citește această notă;
> 2. ia **un singur** task din coadă — cel marcat „⟵ URMĂTORUL", sau cel cerut expres de utilizator;
> 3. du-l până la capăt **impecabil** (vezi *Definiția lui „gata impecabil"* la final) înainte de a
>    începe altceva. Nu deschide două task-uri în paralel.
> 4. la final, actualizează *Starea* în tabelul de mai jos și, dacă s-a schimbat aplicația, scrie
>    cele **trei jurnale** (`jurnal.md`, notă în `10-Jurnal` + link din MOC, `data/versiuni.json`).
>
> Un task mare (epic) se ia tot pe bucăți: o sub-fază pe sesiune, disciplina „un modul cap-coadă" de
> la [[Jurnal 2026-08-24 — Mai multe lecții v07|v07]].

## Verdictul auditului v07 (pe scurt)

| Verificare | Rezultat |
|---|---|
| JSON (60 module + index + manifest) | 64/64 valide |
| Structură conținut | 60 module, 1152 lecții — valid |
| Sintaxă JS / CSS / vault | OK · OK · 1387 note, 0 rupte, 0 orfane |
| `CACHE v11` ↔ `?v=10` | corect (v07 a atins doar date) |
| Cod (corectitudine + XSS) | **fără defecte găsite** |

Concluzie: nu e nimic de reparat. Ce urmează **adaugă** valoare, în etosul zero-dependențe / offline.

## Teza strategică — șase piloni

1. **Încrederea în conținut** *(existențial)* — conținut generat, fără pistă de verificare față de
   sursa oficială și fără canal de raportare a erorilor. Pârghia cea mai mare.
2. **Alinierea reală la bacalaureat** *(scopul produsului)* — evaluarea e uniformă (grilă + răspuns
   scurt); bacul real e specific pe disciplină.
3. **Durabilitatea parcursului** *(risc pe 5 ani)* — progres într-un singur `localStorage`; backup manual.
4. **Adâncirea buclei de învățare** — explicații mai bogate, **vizual explicativ**, trasee de recuperare.
5. **Plasa de siguranță de inginerie** — fără teste comportamentale; CI verifică structură, nu comportament.
6. **Audiență și impact** *(decizie de poziționare)* — construită pentru un liceu; programa e națională.

## Coada de task-uri

| ID | Task | Pilon | Cost | Stare |
|---|---|---|---|---|
| **T1** | Plasă de siguranță: teste comportamentale (`node --test`) | 5 | mic | ✅ Făcut (2026-08-25) — 32 de teste, `app.js` neatins |
| **T2** | „Raportează o greșeală" pe lecție și pe întrebare | 1 | mic | TODO |
| **T3** | ⭐ Imagini explicative la lecție (max 2/lecție) | 4 | epic | **T3.0 ✅ făcut** (sistem+pipeline+pilot istorie-9, 2026-08-25); roll-out T3.1+ TODO |
| **T4** | Moduri de examen în format bac + pregătire/countdown | 2 | mediu | TODO |
| **T5** | Verificarea conținutului vs. programă + subiecte reale | 1 | mare/continuu | TODO |
| **T6** | Backup fără fricțiune + rezistență la cotă / IndexedDB | 3 | mediu | TODO |
| **T7** | Explicații mai bogate la greșeli + trasee de recuperare | 4 | mediu | TODO |
| **T8** | Poziționare: generalizare / partajare | 6 | decizie | TODO |

> [!tip] Ordinea recomandată vs. prioritatea ta
> Recomandarea mea de inginerie: **T1 primul** — e o jumătate de sesiune și apără tot ce urmează
> (inclusiv T3). Tu ai cerut însă explicit **imaginile (T3)**; dacă vrei să începi cu ele, punctul de
> intrare este **T3.0** (sistemul + pipeline + pilot). Alege un singur task la începutul sesiunii.

---

## T1 — Plasă de siguranță: teste comportamentale

**Scop.** CI verifică azi structură/sintaxă, dar nu *comportament*. Un refactor poate sparge tăcut
logica, cu CI tot verde.
**Domeniu.** Un fișier de teste zero-dependențe cu `node --test` (fără pachete). Ținte, în ordinea
riscului: `raspunsPotrivit`/`distanta`/`faraArticol` (morfologia românească), `programeaza` (SM-2),
`sanitizeaza` (migrări + intrări stricate), `pct`/scorul din `rezultatTest`. Cârlig în
`.github/workflows/verificare.yml`.
**Notă tehnică.** `app.js` e un IIFE fără exporturi; pentru teste, extrage funcțiile pure într-un mic
modul importabil **fără** a schimba comportamentul livrat (sau testează-le printr-un shim), păstrând
zero-build.
**Gata impecabil.** Testele pică pe un bug injectat și trec pe codul curent; legate în CI; documentate
în `jurnal.md`. Atinge doar unelte/teste (nu neapărat app livrată) → dacă nu schimbă fișiere publicate,
nu cere bump de `CACHE`.

## T2 — „Raportează o greșeală"

**Scop.** Închide bucla cu utilizatorii reali — un elev semnalează un fapt greșit direct din lecție/
întrebare. Alimentează T5.
**Domeniu.** Buton discret pe lecție și în ecranul de rezultat al testului; salvează raportul **local**
(în stare) + îl poți exporta (ca la datele de progres) și/sau `mailto`. Zero-dependențe.
**Gata impecabil.** UI accesibilă (țintă ≥44px, aria), tot textul prin `esc()`, nu strică fluxurile
existente; bateria + `verificator-cod` + `verificator-ui` verzi; `CACHE` + `?v=` bump (atinge JS/CSS);
`test-sw.mjs`; cele trei jurnale + intrare `versiuni.json` scrisă pentru elev.

## T3 — ⭐ Imagini explicative la lecție (max 2/lecție)

**Scop.** Fiecare lecție primește **până la două** vizuale explicative (cronologie, schemă, hartă,
proces) care ajută înțelegerea. Cerere explicită a utilizatorului.

> [!success] Decizie de design — confirmată (T3.0, 2026-08-25): **SVG inline, NU raster**
> Recomandarea fermă: **SVG inline, NU imagini raster.** Motive:
> 1. etosul **zero-asset / zero-build / offline** — 1152 lecții × 2 rastere ar umfla precache-ul și
>    ar cere surse + licențe;
> 2. SVG e minuscul (text), intră în precache aproape gratis, se scalează perfect la 320px;
> 3. se **temează singur** prin `currentColor` + tokenii din `app.css` (luminos / întunecat /
>    contrast ridicat) — un raster nu poate;
> 4. se **generează din pipeline-ul de conținut**, ca restul materialului.
>
> Rasterul (PNG/foto) contrazice arhitectura și offline-ul — de evitat fără un motiv foarte puternic.
> **Rezolvat (T3.0):** „imagine = schemă/diagramă SVG desenată" — implementat cu `cronologie` și `schema`,
> temabile prin tokeni, fără hex fix, fără overflow la 320px.

**Domeniu / pipeline.**
- sintaxă nouă în DSL (`data/sursa/*.txt`) pentru un vizual (`tip` + date), compilată de
  `tools/text-in-modul.mjs` într-un câmp nou pe lecție (ex. `vizual`, listă de cel mult 2);
- randare în `viewLectie` (`assets/app.js`): SVG inline cu `role="img"` + `aria-label` +
  `<title>`/`<desc>` (sau `aria-hidden` dacă e pur decorativ);
- stil nou în `assets/app.css`: responsive, temabil, fără overflow orizontal;
- regulă în `tools/verifica-continut.mjs`: „≤2 vizuale/lecție" + validare de structură;
- opțional, vizualele și în notele din vault (via `tools/graphify.py`).

**Fazare — câte o sub-fază pe sesiune:**
- **T3.0 — Sistem + pipeline + pilot ✅ FĂCUT (2026-08-25).** Livrat: **2 tipuri** de vizual
  (`cronologie`, `schema`) — nu 3, ca să bounde scopul; DSL nou (`[cronologie]`/`[schema]` + `~`/`>`)
  compilat în câmpul `vizual` (listă de ≤2); randare SVG inline în `viewLectie` (tot textul prin
  `esc()`, `role="img"`+`aria-label`+`title`/`desc`, temabil prin tokeni, zero overflow la 320px);
  stil în `app.css` §18d; regulă de lint în `verifica-continut.mjs`. Pilot **aditiv** pe `istorie-9`:
  o schemă (etnogeneza, `ist9-06`) și o cronologie (lupta antiotomană, `ist9-11`). Bateria + `test-sw`
  + verificare UI proprie (42 combinații ecran×temă) verzi; `CACHE` v12, `?v=11`, `versiuni.json` v08.
- **T3.1…n — Roll-out (URMĂTORUL).** Câte un modul/materie pe sesiune, **disciplinele de BAC întâi**,
  fiecare complet + **aditiv** (nimic vechi nu se schimbă) + verificat, exact ca la v07. Reutilizează
  întreg pipeline-ul din T3.0 — se scrie doar conținut (blocuri `[cronologie]`/`[schema]` în surse).

**Gata impecabil (T3.0).** Pipeline funcțional; pilot cu ≤2 vizuale/lecție; SVG temabil pe
luminos/întunecat/contrast fără overflow la 320–1440px + peisaj; accesibil (aria/title); bateria +
`verificator-ui` (capturi pe pilot) + `verificator-cod` verzi; `CACHE` + `?v=` bump; `test-sw.mjs`;
cele trei jurnale + `versiuni.json` („Fiecare lecție are acum până la două imagini explicative").

## T4 — Moduri de examen în format bac + pregătire

**Scop.** Simularea de notă e generică (5×2p / 20 întrebări). Bacul real e specific pe disciplină.
**Domeniu.** Moduri de examen care oglindesc structura reală a subiectului (istorie: Subiectul I/II/III;
română: eseu + subiecte), simulare cronometrată cu **barem** pentru auto-notare, **countdown până în
iunie** + indicator „ești pregătit?" per probă care alimentează un plan personalizat.
**Gata impecabil.** Baterie + agenți; jurnale + `versiuni.json`; bump-uri de versiune.

## T5 — Verificarea conținutului vs. sursa oficială *(continuu)*

**Scop.** Riscul existențial: un fapt plauzibil-dar-greșit erodează încrederea.
**Domeniu.** Disciplină cu disciplină, **BAC întâi**: aliniere la programă (ME) + confruntare cu
subiecte reale; marcaj de proveniență/încredere ținut în `40-Verificare`; **lint-uri pedagogice** noi
în `tools/verifica-continut.mjs` (plauzibilitatea distractorilor, sanitatea cheii, definiții
non-triviale). Se ia câte o materie-an pe sesiune.
**Gata impecabil.** Corecțiile sunt aditive unde se poate; baterie verde; raport în `40-Verificare`;
jurnale + `versiuni.json` la fiecare lot.

## T6 — Durabilitatea parcursului

**Scop.** Progres pe 5 ani într-un singur browser = risc de pierdere la schimbarea dispozitivului.
**Domeniu (zero-dep, termen scurt).** Backup fără fricțiune (memento-uri de export, „copie la fiecare
N zile", predare prin fișier/QR) + avertisment onest. Migrare la **IndexedDB** dacă `localStorage`
devine strâmt. Sincronizarea multi-dispozitiv reală cere un mic backend → **decizie separată**, opt-in.

## T7 — Adâncirea buclei de învățare

**Scop.** Motorul e sofisticat; îmbogățește unde plătește.
**Domeniu.** Explicații mai bogate la greșeli („de ce", nu o linie); trasee de recuperare automate când
pregătirea la o materie e slabă. (Vizualul explicativ e tratat separat în T3.)

## T8 — Poziționare *(decizie a utilizatorului)*

Programa e națională; aplicația ar putea servi orice elev FR-umanist din România, sau cohorta școlii.
Alegere de poziționare, nu de inginerie — de decis de utilizator, nu de pornit din proprie inițiativă.

---

## Următorul task

- ✅ **T1 — făcut** (2026-08-25): plasa de teste comportamentale e în CI; `app.js` neatins.
- ✅ **T3.0 — făcut** (2026-08-25): sistemul + pipeline-ul + pilotul (istorie-9) pentru imaginile
  explicative. Epicul **T3 rămâne deschis** — urmează roll-out-ul.
- **Recomandat acum:** **T3.1** — roll-out pe prima materie de BAC (o materie-an pe sesiune, aditiv,
  reutilizând pipeline-ul din T3.0). Pipeline-ul e gata; e nevoie doar de conținut vizual în surse.
- Alternativă ieftină: **T2** („Raportează o greșeală").

La începutul sesiunii următoare, ia **unul** dintre ele (sau cel pe care îl ceri tu), și du-l la capăt
impecabil înainte de orice altceva.

## Definiția lui „gata impecabil" (Regula nr. 2 a proiectului)

1. **Verificatorii locali** trec toți: JSON valid pe `data/*.json` + `manifest.webmanifest`;
   `node --check assets/app.js sw.js`; `node tools/verifica-css.mjs`; `python3 tools/verifica_vault.py`;
   `node tools/verifica-continut.mjs` (dacă s-a atins conținut); `node tools/test-sw.mjs` cu server
   local (dacă s-a atins SW-ul).
2. **Echipa de agenți** rulează: `verificator-cod` (recitire adversarială a diff-ului) și, dacă s-a
   atins UI-ul, `verificator-ui` (capturi pe scara de ecrane + ambele teme). Ce găsesc **se corectează
   și se reverifică** — nu se declară rezolvat ce n-a fost reverificat empiric.
3. Totul verde → branch-ul se **îmbină în `main`** (automat) și push. Nimic neverificat nu se îmbină.
4. Dacă s-a schimbat aplicația: **`CACHE`** crește în `sw.js`; **`?v=`** în `index.html` + `SHELL`
   dacă s-a atins `app.css`/`app.js`; cele **trei jurnale** (`jurnal.md`, notă în `10-Jurnal` + link
   din MOC, `data/versiuni.json` scris pentru elev, cu `cache` = `CACHE`).
5. Actualizează *Starea* din tabelul acestei note.
