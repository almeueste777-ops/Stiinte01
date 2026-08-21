# Jurnal de lucru — Științe Sociale (PWA)

Jurnal cronologic al lucrului asupra aplicației. Fiecare intrare notează **ce s-a făcut**,
**de ce** și **ce a rezultat**. Conținutul acestui jurnal este oglindit în vaultul Obsidian
din `vault/` (vezi `vault/10-Jurnal/`).

Convenție: o secțiune `## [dată] — [titlu]`, apoi intrări `### [oră] · [acțiune]`.

---

## 2026-08-21 — Faza 1: redesign estetic, versiunea 01

**Obiectiv primit:** o echipă de designeri să dea aplicației un design estetic real —
combinație între *glassmorphism* și *neomorfism*, culori calde, animații în stil iOS.
Tot ce se face se scrie în acest jurnal și apoi în vaultul Obsidian. Tot ce se creează
este verificat de un agent separat, ca să nu mai fie nevoie de audit ulterior.
Aplicația se notează **versiunea 01**. La final, totul intră pe `main`, commit și deploy.

### 1 · Inventarul aplicației existente

Am citit tot codul înainte de a schimba ceva. Starea de plecare:

| Fișier | Rol | Stare inițială |
|---|---|---|
| `index.html` | schelet + bară de navigare | 35 de linii, iconițe unicode geometrice (`●`, `☰`, `▣`, `✓`, `▦`) |
| `assets/app.css` | stiluri | 92 de linii, paletă **rece** (bleumarin `#1c3d5a`, gri-albastru), plat, fără animații |
| `assets/app.js` | rutare + toate ecranele | 359 de linii, IIFE, router pe `location.hash`, randare prin `innerHTML` |
| `sw.js` | service worker | precache `stiinte01-v1` |
| `data/curriculum.json` | plan de învățământ | 5 clase (IX–XIII), școală, probe bac |
| `data/continut.json` | conținut | 8 module, 25 de lecții, 41 de carduri, 25 de întrebări |

Ecrane existente: `acasa`, `materii`, `materie`, `lectie`, `carduri`, `test`, `plan`.

Vocabularul de clase CSS pe care orice redesign trebuie să-l acopere integral:
`.topbar`, `.icon-btn`, `.badge`, `.view`, `.card`, `.card.tap`, `.card.flash`, `.row`,
`.chips`, `.chip`, `.pill`, `.pill.soft`, `.btn`, `.btn.ghost`, `.btn.sm`, `.grid2`,
`ul.clean`, `.bar`, `.opt` (+ `.correct` / `.wrong`), `.tabbar`, `.tab`, `table`, `textarea`.

**Constrângeri tehnice de respectat:** zero dependențe, zero pas de build, funcționare 100%
offline. Deci: fără fonturi externe, fără CDN, fără biblioteci de animație. Tot designul
trebuie să fie CSS pur + SVG inline.

### 2 · Echipa de designeri — trei roluri paralele

Am împărțit lucrarea pe trei specializări, fiecare cu un brief propriu, lucrând în paralel:

1. **Art Director** — stratul de *design tokens*: paleta caldă (nisip / teracotă / chihlimbar),
   regulile de umbră neomorfică (`--nm-raised`, `--nm-pressed`), tokenurile de sticlă
   (`--glass-bg`, `--glass-blur`, `--glass-border`), scara tipografică și de spațiere,
   fundalul ambiental, tema întunecată **caldă** (nu negru-albăstrui) și dovada de contrast WCAG AA.
2. **Motion Designer** — sistemul de mișcare iOS: curbele de easing reale, tranzițiile
   push/pop între ecrane, intrarea în cascadă a listelor, feedbackul la atingere,
   întoarcerea 3D a cardurilor, indicatorul care alunecă în bara de taburi,
   pulsul/tremurul de la test și respectarea `prefers-reduced-motion`.
3. **UI / Component Designer** — stratul de componente: fiecare clasă din vocabularul de
   mai sus, bara de taburi flotantă din sticlă, bara de sus translucidă, iconițele SVG
   inline în locul celor unicode, tabelele planului, stările de focus și țintele de atingere ≥44px.

Fiecare designer a primit ordin să **nu modifice fișiere**, ci să întoarcă specificația ca text.
Motivul: trei agenți care scriu simultan în `app.css` s-ar suprascrie reciproc.
Integrarea o fac eu, într-un singur pas coerent.

### 3 · Vaultul Obsidian

Am creat `vault/` ca vault Obsidian propriu-zis (nu doar un folder cu fișiere `.md`):

- `.obsidian/app.json`, `appearance.json`, `core-plugins.json`, `graph.json` — configurație
  validată JSON, accent cald `#c96f3f`, legături `[[wikilink]]`, plugin-urile de bază active.
- `00-Index/` — harta de conținut (MOC).
- `10-Jurnal/` — oglinda acestui jurnal.
- `20-Design/` — sistemul de design, pe note legate între ele.
- `30-Aplicatie/` — arhitectura și versiunile.
- `40-Verificare/` — rapoartele agenților de verificare.

### 4 · Bancul de probă vizual (ca să nu fie nevoie de audit)

Înainte de orice modificare am construit un mecanism de verificare obiectivă, ca schimbările
de design să poată fi *dovedite*, nu doar afirmate:

- Server local `python3 -m http.server 8765` (aplicația nu merge din `file://` — service
  worker-ul și `fetch()` cer HTTP).
- Un script Playwright care deschide **toate cele 7 ecrane**, în **ambele teme**
  (deschisă și întunecată), într-un context de iPhone (390×844, DPR 2, touch), face capturi
  și **eșuează dacă apare vreo eroare JS în consolă**.
- Am salvat capturile de dinainte ca **referință „înainte”**: 14 imagini.

Rezultatul rulării pe codul inițial: *nicio eroare JS*. Deci orice eroare apărută după
redesign este introdusă de mine, nu preexistentă. Aceasta este linia de bază.

**Starea „înainte”, pe scurt:** bară de sus bleumarin plată, carduri albe cu umbră minimă,
paletă rece gri-albastru, iconițe unicode geometrice în bara de taburi, zero animații.
Funcțional — dar fără nicio identitate vizuală.

### 5 · Art Director — stratul de tokeni (livrat)

Teza estetică fixată: **„lumină de după-amiază pe hârtie de manual”**. Aplicația e o unealtă
de studiu ținută într-o mână — trebuie să pară hârtie caldă sub un soare jos, nu un tablou de bord.
Totul derivă din nisip, smântână, lut, teracotă și chihlimbar; cerneala e espresso, niciodată gri.

**Regula hibridă, formulată explicit** (și respectată peste tot în cod):

> *Adâncimea aparține conținutului, transparența aparține cadrului.*
> Ce **plutește peste** conținut și trebuie să lase conținutul să se ghicească dedesubt este
> **sticlă**: bara de sus, bara de taburi, foile modale. Ce **este** conținut, se apasă cu
> degetul și trebuie să rămână lizibil la derulare, este **neomorfic**: carduri, butoane,
> chipsuri, opțiuni de test, bare de progres. **Niciodată amândouă pe același element.**

Justificarea nu e stilistică, ci fizică și de performanță: sticla își merită estomparea doar
dacă are ceva de estompat în spate (de aici gradientul ambiental `fixed`), iar neomorfismul se
citește ca „apăsabil” tocmai fiindcă e opac și nemișcat.

**Cum am rezolvat problema clasică de accesibilitate a neomorfismului.** Neomorfismul cade
la contrast fiindcă lumea scrie text peste umbre moi. Regula adoptată: adâncimea descrie
**doar conturul containerului**; lizibilitatea o duce exclusiv perechea cerneală/suprafață.

Rezultatul măsurat (raport de contrast WCAG 2.1, calculat pe valorile hex reale, prag AA = 4.5):

| Pereche | Temă deschisă | Temă întunecată |
|---|---|---|
| `--ink` pe fundalul paginii | 14.36 | 15.10 |
| `--ink` pe card | 15.37 | 13.88 |
| `--ink-muted` pe card | 6.21 | 6.34 |
| `--ink` peste sticlă (compus pe cel mai defavorabil punct) | ≥13,96 | ≥12,81 |
| `--ink-muted` peste sticlă (idem) | ≥5,64 | ≥5,85 |
| `--brand` ca text pe card | 6.07 | 7.10 |
| `--ok` / `--bad` pe fundalul paginii | 5,45 / 6,53 | 9,37 / 9,06 |

O singură culoare nu trece ca text: chihlimbarul `--accent` (#B4761A) dă 3.53:1 pe smântână.
De aceea are un frate dedicat, `--accent-text` (#8A5410, 5.83:1), iar `--accent` rămâne
**doar culoare de umplutură**. Aceasta e genul de detaliu care, altfel, ar fi ieșit la audit.

**Ce mai conține stratul:** paleta pe trei niveluri de suprafață (îngropat / bază / ridicat),
gradientul ambiental mesh din patru gradiente pure CSS (trei radiale și unul liniar), umbrele neomorfice derivate
din culoarea suprafeței (umbră **caldă** `#AC855A`, nu neagră), tokenurile de sticlă cu muchia
luminoasă de sus, scara tipografică modulară (rație 1.2), grila de spațiere de 4px, scara de
raze în stil iOS (24px raza „semnătură” a cardului) și **temă întunecată caldă** — espresso
`#191310`, nu negru-albăstrui — cu umbrele neomorfice **recalculate**, fiindcă pe întuneric
„lumina” nu mai e albă, ci o ridicare caldă slabă.

Patru blocuri de preferințe ale utilizatorului sunt tratate explicit, nu ignorate:
`prefers-color-scheme`, `prefers-reduced-transparency` (sticla devine opacă), `prefers-contrast: more`
(umbrele moi dispar și devin linii de 1px reale) și un `@supports not (backdrop-filter)` pentru
browserele fără estompare.

### 6 · Iconițele aplicației, refăcute

Iconițele PWA erau un pătrat bleumarin plat cu o histogramă — se băteau cap în cap cu paleta caldă.
Le-am regenerat: squircle cu gradient teracotă (nisip → `--brand` → teracotă adâncă), luciu
specular în stânga-sus, muchie interioară luminoasă și coloanele în smântână și chihlimbar.
Generatorul e versionat în depozit (`tools/genereaza-iconite.mjs` + `icons/icon-source.svg`):
randează SVG-ul în Chromium și salvează PNG la dimensiune exactă — deci iconițele se pot regenera oricând din sursă, la orice
dimensiune, fără editor grafic. Varianta *maskable* ține conținutul în cercul de siguranță de 80%.

### 7 · Motion Designer — sistemul de mișcare (livrat)

Teza: **mișcarea iOS se citește ca fizică fiindcă este asimetrică.** Curba de navigație
UIKit, `cubic-bezier(.32,.72,0,1)`, consumă majoritatea distanței în prima treime a timpului,
apoi planează până la oprire — acea coadă lungă e ceea ce ochiul citește ca *masă*, nu ca
interpolare cronometrată. Un `ease-in-out` simetric pare mecanic prin comparație.
Iar apăsarea cade instantaneu și revine încet: **acea asimetrie apăsare/eliberare, mai mult
decât orice curbă, e ceea ce mâna recunoaște ca iOS.**

Ce s-a livrat:

| Element | Mișcarea |
|---|---|
| Navigare înainte | ecranul intră din dreapta cu fade + scalare 0,99 → 1, iar cel vechi face parallax spre stânga (clonă animată în paralel) — semnătura `UINavigationController` |
| Navigare înapoi | oglinda: intră din stânga, cel vechi pleacă spre dreapta |
| Schimbare de tab | **nu alunecă lateral** — fade + cascadă de listă, ca între rădăcini |
| Re-randare pe același ecran | doar 140 ms de opacitate: nimic nu s-a „navigat”, deci nimic nu alunecă |
| Liste | intrare în cascadă, cu plafon de 256 ms (o listă de 40 de elemente nu durează 4 secunde) |
| Atingere | scalare descrescătoare cu suprafața: 2% pe card, 4% pe buton, 6% pe chip, 12% pe iconiță |
| Card de memorare | rotire 3D reală, `rotateY(180deg)`, cu arc blând |
| Bara de taburi | pastila alunecă între sloturi cu arc, iconița „pocnește” |
| Răspuns corect | puls scurt de scalare |
| Răspuns greșit | scuturatul de la codul de acces iOS: 3 oscilații amortizate, 400 ms |
| Bara de progres | crește de la zero cu arc |

**Nouă curbe numite, fiecare cu rolul ei declarat** — curba implicită Core Animation pentru
schimbări neutre de stare, curba de navigație, decelerare pură pentru intrări, accelerare
pură pentru ieșiri, două arcuri (unul de 7% depășire pentru elemente mici, unul de 3% pentru
suprafețe mari — pe o suprafață lată, 7% se citește „elastic”, nu „solid”), o curbă de
micro-interacțiune și una de apăsare.

`prefers-reduced-motion: reduce` **nu e o notă de subsol**: dezactivează explicit fiecare
translație, scalare, rotire și scuturat, păstrează doar estompările de opacitate, elimină
clona de parallax și transformă rotirea cardului într-un fade încrucișat între fețe.

### 8 · Integrarea — unde s-au ciocnit cei trei și cum am arbitrat

Trei designeri care lucrează în paralel produc trei convenții de denumire. Nu am cerut
niciunuia să se conformeze altuia (asta ar fi serializat lucrul); am arbitrat la integrare.

**Conflictele reale și deciziile:**

1. **Scara de spațiere.** UI designerul a folosit `--sp-1…6` = 4/8/12/16/20/28px; art
   directorul `--sp-1…12` pe grila canonică de 4px (2/4/6/8/12/16/20/24/…). Aceleași nume,
   valori diferite. *Decizie:* rămâne grila canonică; cele 57 de referințe din stratul de
   componente au fost remapate mecanic.
2. **`--glass-blur`.** La art director e o valoare completă de filtru
   (`blur(20px) saturate(180%)`); la UI designer o lungime, folosită ca `blur(var(--glass-blur))`.
   *Decizie:* rămâne valoarea completă — fiindcă doar așa rezerva `--glass-blur: none` produce
   `backdrop-filter: none` valid. Cu varianta „lungime”, rezerva ar fi generat `blur(none)`, adică nimic.
3. **`--ok-ink` / `--bad-ink`.** Art directorul le-a definit ca text **pe umplutură plină**
   (alb). UI designerul le-a folosit ca text **pe fundal difuz**. Alb pe verde-pal = ilizibil.
   *Decizie:* tokenuri noi, `--ok-text` / `--bad-text`, cu valori calculate și verificate
   (minimum 5,37:1 și 6,20:1 pe fundalul real al opțiunii — care e pagina, nu un card). **Acesta e exact genul de defect care ar fi
   trecut nevăzut la o simplă privire și ar fi ieșit abia la audit.**
4. **Indicatorul barei de taburi — două implementări concurente.** UI designerul: pseudo-element
   `::before` poziționat prin `:has()`. Motion designerul: element `<span class="tab-ind">`
   condus din JS. *Decizie:* rămâne elementul, cu aspectul propus de UI designer (pastilă cu
   gradient de brand, text alb). Motivul: `:has()` e o dependență inutilă pentru ceva ce JS
   oricum calculează, iar elementul merge peste tot. Fiind `position:absolute`, nu intră în
   grila de 5 coloane a barei.
5. **Iconițele de tab.** Motion designerul scria selectori pe `.tab span`; UI designerul a
   înlocuit caracterele unicode cu `<svg class="ico">` plus `<span class="tab-label">`.
   Selectorii ar fi animat eticheta în locul iconiței. *Decizie:* toți selectorii de mișcare
   mutați pe `.ico`.
6. **Bara de progres.** Motion designerul a propus `scaleX` în loc de `width`, ca animația să
   ruleze integral pe compozitor. Corect ca performanță, dar `scaleX` turtește capătul rotund
   al pilulei și deformează haloul. *Decizie:* rămâne `width`, animat din `--p` (număr 0…1).
   Cost: un singur element, o singură dată la intrarea în ecran. **Am ales aspectul, conștient,
   și am notat abaterea aici** — nu am lăsat-o nedocumentată.
7. **Blocurile `prefers-reduced-motion`.** Amândoi aveau câte unul; cel al UI designerului era
   un `*{animation-duration:.01ms}` global. *Decizie:* rămâne doar cel al motion designerului,
   care e specific și tratează inclusiv rotirea 3D.

Rezultatul: `assets/app.css` = **1375 de linii**, în patru straturi cu ordine impusă
(tokeni → tokeni derivați → componente → mișcare), toate comentate în română.
O verificare automată confirmă că **toți cei 113 tokeni folosiți sunt declarați** — singurele
excepții sunt cele patru variabile puse din JS (`--p`, `--i`, `--tab-i`, `--tab-count`),
fiecare cu valoare de rezervă în CSS.

### 9 · Modificările efective, fișier cu fișier

| Fișier | Ce s-a schimbat |
|---|---|
| `assets/app.css` | rescris integral: 92 → **1375 de linii**, patru straturi |
| `assets/app.js` | 15 444 → **25 290 de octeți**: infrastructura de mișcare, `render()` rescris, `drawCard()` rescris pentru rotire 3D, cascadă la test, bare pe `--p`, stil inline eliminat de pe `textarea` |
| `index.html` | bara de sus și cea de taburi refăcute, **6 iconițe SVG inline** (5 taburi + chevronul „înapoi”) în locul caracterelor unicode, scena de tranziție `#stage`, pastila `.tab-ind`, `theme-color` pe temă |
| `icons/*.png` | regenerate în paleta caldă, din `icons/icon-source.svg` |
| `manifest.webmanifest` | `theme_color` și `background_color` → nisip cald `#F7EEE2` |
| `sw.js` | cache `stiinte01-v1` → `stiinte01-v2` (altfel telefoanele instalate rămâneau pe versiunea veche) |
| `jurnal.md` | acest jurnal |
| `vault/` | vaultul Obsidian |

**Ce NU s-a atins, intenționat:** conținutul din `data/` (8 module, 25 de lecții, 41 de carduri,
25 de întrebări), logica de progres și de notare, și **cheia de `localStorage`** (`stiinte01:v1`)
— progresul elevilor care folosesc deja aplicația nu se pierde.

### 10 · Verificarea proprie, înainte de a chema verificatorii

Nu am declarat nimic „gata” pe baza faptului că arată bine într-o captură. Am rulat:

**a) Toate ecranele, ambele teme** — 7 rute × 2 teme = 14 capturi, într-un context de iPhone
(390×844, DPR 2, touch). Zero erori JS în consolă.

**b) Un test de interacțiune care chiar apasă prin aplicație** (nu doar randează):

| Pas | Ce s-a verificat | Rezultat |
|---|---|---|
| Răspuns la test | se marchează corectul, se marchează greșitul, apare explicația, toate opțiunile se dezactivează | trecut |
| Testul complet, 12 întrebări | se ajunge la ecranul de rezultat, bara are `--p` | trecut (`--p:0.17`) |
| Rotirea cardului | două fețe în DOM, `is-flipped` se aplică, matricea 3D e chiar `rotateY(180°)`, butoanele se schimbă, fața din față devine `aria-hidden` | trecut |
| Cardul următor | textul se schimbă, cardul nou **nu** rămâne întors, contorul avansează | trecut |
| Navigare înainte | clasa `nav-push`, indicatorul de tab pe poziția corectă | trecut |
| Navigare înapoi (butonul browserului) | clasa `nav-pop` | trecut |
| Schimbare de tab | `nav-fade` + `stagger`, 14 elemente în cascadă, indicator pe poziția 4 | trecut |
| Notițe + marcare lecție | se salvează în `localStorage`, notița supraviețuiește re-randării | trecut |
| Progres pe Acasă | bara reflectă lecția marcată și chiar se randează după animație | trecut |

**c) Condiții de margine** — 360px, 844×390 (peisaj), 834×1112 (tabletă), `prefers-reduced-motion`,
`prefers-contrast: more`, `prefers-reduced-transparency`. Verificat automat, pentru fiecare:
zero derulare orizontală, bara de taburi în ecran, **zero ținte de atingere sub 44×44px**.

**d) Dovada că sticla e sticlă**, nu o culoare opacă: valorile calculate în browser sunt
`backdrop-filter: blur(20px) saturate(1.8)` peste `rgba(255,247,236,.62)` (temă deschisă) și
`blur(22px) saturate(1.6)` peste `rgba(46,34,26,.58)` (temă întunecată), cu captură la derulare
în care conținutul se vede efectiv estompat pe sub bara de sus și pe sub bara de taburi.

**e) La `prefers-contrast: more`** neomorfismul cedează primul, exact cum a fost proiectat:
umbrele moi devin contururi de 1px, sticla devine opacă, fundalul ambiental dispare.

**f) Funcționarea offline**, verificată efectiv, nu presupusă: service worker activat,
cache `stiinte01-v2` cu 10 intrări, rețea tăiată, pagină reîncărcată — aplicația se randează
integral, cu stilurile noi, insigna „offline” apare, zero erori JS.

### 11 · Verificarea independentă — trei agenți, câte unul pe zonă

Cerința era ca tot ce se creează să fie verificat de un agent separat, ca să nu mai fie
nevoie de audit. Am împărțit verificarea pe trei zone care nu se suprapun, fiecare cu
instrucțiunea explicită de a fi **adversarial** și de a nu da o aprobare de complezență:

1. **Verificator CSS** — tokeni nedefiniți, completitudinea temei întunecate, respectarea
   regulii hibride, urme de culori reci, ordinea straturilor și dacă suprascrierile chiar
   câștigă, degradarea funcțiilor moderne (`:has()`, `@property`, `overflow:clip`, `svh`, `inert`), capcane de layout, selectori care nu se potrivesc cu markupul real,
   recalcularea contrastelor și cod mort.
2. **Verificator JavaScript** — scurgeri de ascultători și clone orfane, temporizatoare
   rămase după demontarea ecranului, corectitudinea stivei de navigație pe secvențe concrete,
   ID-uri duplicate în clonă, accesul de la tastatură la card, regresii în logica testului,
   păstrarea formatului din `localStorage`, aritmetica barelor, corectitudinea PWA și
   rularea reală a verificărilor din CI.
3. **Verificator documentație** — **acuratețea factuală** a fiecărei cifre din jurnal și din
   vault (recalculate independent, nu preluate pe încredere), validitatea vaultului Obsidian
   (JSON, frontmatter YAML, `[[wikilink]]`-uri care chiar rezolvă, note orfane), consistența
   dintre jurnal și oglinda lui, prospețimea README-ului, diacriticele corecte
   (ș/ț cu virgulă, nu cu sedilă) și supra-afirmațiile.

### 12 · Două verificări proprii, în plus, cât rulau verificatorii

**Ocluziunea cromului plutitor.** Cu bara de sus și cea de taburi devenite `position:fixed`,
riscul real e ca o bucată de conținut să rămână permanent ascunsă sub ele. Am măsurat
automat, pe 4 formate (peisaj 844×390, portret 390×844, îngust 360×740, tabletă 834×1112)
× 6 rute (toate ecranele mai puțin `#/materie/{id}`, structural identic cu `#/materii`): la derulare 0 primul element de conținut e sub bara de sus, iar la derulare maximă
ultimul element e deasupra barei de taburi. **Zero ocluziune reală.**

> Prima variantă a acestui test raporta 16 „suprapuneri” cu bara de sus. Testul era greșit,
> nu codul: conținutul care curge pe sub sticla translucidă *este* intenția designului.
> Am refăcut verificarea ca să măsoare exact ce contează — capetele de derulare.

**Navigarea de la tastatură.** Parcurgere cu `Tab` prin ecranul de test: fiecare element
focalizat primește un contur declarat de 2,5px în `rgb(158, 65, 25)` — teracotă
(browserul îl raportează rotunjit la 2px). **Niciun inel albastru
implicit nicăieri.** Ordinea de focus e corectă, iar `#view` (cu `tabindex="-1"`) nu intră în
parcurgere, fiindcă primește focus doar programatic, la schimbarea ecranului.

### 13 · Documentația, adusă la zi

- `README.md` — secțiune nouă despre sistemul de design v01, tabelul de structură completat
  cu `jurnal.md`, `vault/` și `icons/icon-source.svg`, exemplul de creștere a cache-ului
  actualizat la versiunea reală.
- `docs/PLAN.md` — ramura de dezvoltare corectată (indica încă ramura versiunii anterioare),
  exemplul de cache actualizat, iar lista de verificare din Etapa 4 completată cu **șapte
  puncte noi**, scrise pentru cineva care verifică cu ochiul: sticla translucidă, pastila
  care alunecă, alunecarea ecranelor, rotirea cardului, scuturatul la răspuns greșit, tema
  întunecată caldă și comportamentul cu „Reduce motion” activat.

### 14 · Două dovezi numerice despre paletă

Cerința era „culori calde”. Am verificat-o ca număr, nu ca impresie.

**Nuanțele tuturor celor 58 de culori opace din foaia de stil**, sortate:
toate stau în arcul **4°–45°** (roșu-rugină → teracotă → chihlimbar → nisip → smântână),
plus **patru** culori verzi la 96–104°, care sunt exact cele semantice pentru „răspuns corect”.
**Nicio culoare în intervalul rece 170–290°** (albastru/violet) în tot fișierul. Vechea
paletă avea bleumarinul `#1c3d5a` la 208°.

**Completitudinea temei întunecate:** 155 de tokeni în tema deschisă, 56 redefiniți pe
întuneric. Verificare automată: **fiecare token de culoare din tema deschisă are un
corespondent pe întuneric.** Zero scăpări — deci nicio suprafață nu rămâne cu o valoare de
zi pe fundal de espresso.

### 15 · O inconsecvență găsită singur, înainte de verificatori

`--glass-specular` era definit corect în stratul de tokeni — și stins corect în toate cele
trei blocuri de rezervă (fără `backdrop-filter`, transparență redusă, contrast ridicat) —
dar **nu-l folosea nimic**. Sticla avea trei ingrediente din patru.

Am conectat luciul: bara de sus primește sclipirea diagonală printr-un pseudo-element,
iar cardul de memorare trece de la un gradient scris de mână la tokenul de sistem — deci
se stinge singur, odată cu celelalte, la preferințele de accesibilitate.

Nota din vault despre anatomia sticlei descria patru ingrediente. Acum descrierea e adevărată.

### 16 · Ce au găsit verificatorii independenți

Toți trei au întors verdict **„nu e bun așa cum e”**. Exact ce trebuia: dacă ar fi aprobat
totul, verificarea n-ar fi însemnat nimic. Ce au găsit:

#### Verificatorul CSS — 4 defecte majore

1. **`:focus-visible` rescria raza oricărui element focalizat.** Regula avea
   `border-radius:var(--r-md)` și aceeași specificitate ca `.chip` / `.tab` / `.icon-btn`, dar
   stătea mai jos în fișier — deci câștiga. Măsurat: butonul rotund „înapoi” trecea de la
   999px la 18px **exact când primea focus**, apoi sărea înapoi la pierderea lui. Pentru un
   utilizator de tastatură arăta ca un bug de randare. *Corectat:* linia a dispărut — browserul
   urmează oricum raza proprie a elementului când desenează conturul.
2. **Umplerea barei de progres era invizibilă pe tema deschisă.** Măsurat pe pixeli:
   **1,23:1** între muchia umplerii și șanț, față de pragul de 3:1. Cauza e subtilă — gradientul
   se întinde pe lățimea *umplerii*, deci capătul lui deschis (`--amber`) cădea mereu fix pe
   muchia pe care ochiul o caută. Elevul nu putea vedea cât a parcurs, pe ecranul „Acasă”, pe
   toate cele 8 carduri de materie și pe cardul de rezultat. *Corectat:* un contur de 1px în
   chihlimbar închis, **4,81:1** față de șanț. Se vede acum la orice procent.
3. **Rezerva pentru browserele fără `:has()` era anulată de propria ei scriere.** Regulile
   erau scrise ca listă, `​.card:has(…), .card.score { … }` — dar **listele de selectori nu sunt
   tolerante**: un selector nesuportat invalidează regula întreagă, inclusiv jumătatea scrisă
   ca plasă de siguranță. *Corectat:* reguli separate, iar `app.js` chiar emite acum clasa
   `.score` (înainte n-o emitea nimeni, deci rezerva era dublu moartă).
4. **Butonul-icoană era sticlă și relief în același timp** — încălcarea propriei reguli.
   *Corectat:* umbrele neomorfice au dispărut, a rămas sticlă curată.

Plus opt observații minore, toate corectate: textul-fantomă din notițe la 3,14:1, variantele
greșite de la test la 3,25:1 după răspuns (rămân de citit, deci trebuie lizibile),
`.flash:focus-visible` care nu se potrivea cu nimic (focalizabil e `.flip`),
`min(46svh,300px)` fără rezervă pentru motoarele fără `svh`, rezerva `overflow-x:hidden` care
transforma `.stage` în container de derulare și omora antetul lipicios al tabelelor,
animațiile de la test care câștigau doar fiindcă JS scotea o clasă întâi (CSS-ul nu era
autonom), înălțimea barei de taburi în peisaj subestimată cu 4,5px, și bara de taburi pusă
pe stratul foilor modale în loc de cel al cadrului.

#### Verificatorul JavaScript — 3 defecte majore

1. **Clona ecranului care pleacă moștenea clasa de navigație a randării anterioare.**
   `spawnGhost()` rulează la începutul lui `render()`, când `#view` încă poartă clasa veche;
   `cloneNode` o copia, iar codul scotea doar `stagger`. Două clase `nav-*` pe același element
   se decid pe **ordinea din CSS**, nu pe intenție. Măsurat: la cea mai obișnuită navigare din
   aplicație — Materii → o materie — clona juca `nav-fade-out` în loc de `nav-push-out`.
   Adică **parallaxul lipsea exact acolo unde se vede cel mai des**, iar cele două jumătăți se
   desincronizau (240ms față de 340ms), deci ecranul vechi dispărea cu 100ms mai devreme.
2. **`navDirection()` întorcea direcția greșită la cele mai frecvente două navigări.**
   Trei erori suprapuse: ramura de stivă era testată înaintea celei de rădăcină (deci un tab
   redevenea „înapoi” și pierdea cascada); adâncimea rutei era calculată inconsistent, așa că
   `#/carduri/filosofie` ieșea *mai puțin adânc* decât `#/materie/filosofie`, deci intrarea în
   carduri se anima ca ieșire; iar fiindcă ramura aceea golea stiva, următorul „înapoi” al
   browserului se anima **înainte**.
3. **Regresie de accesibilitate pe carduri.** Făcusem `.flip` un `role="button"` cu
   `aria-label`. ARIA face copiii unui buton *prezentaționali*, iar `aria-label` bate numele
   din conținut — deci **și întrebarea, și răspunsul dispăreau complet din arborele de
   accesibilitate**. Măsurat cu `accessibility.snapshot()`: ecranul de carduri se reducea la
   „Cardul 1 din 41” plus două butoane identice numite „Arată răspunsul”. Un elev nevăzător nu
   mai putea învăța deloc de pe carduri. *Corectat:* cardul rămâne apăsabil cu degetul, dar nu
   mai e buton; controlul accesibil e butonul propriu-zis, care acoperă și tastatura.

Plus șase minore și patru observații, toate corectate: răspunsul se putea găsi cu Ctrl+F și
selecta cu degetul **înainte** de întoarcere (adică jocul de memorare nu mai avea rost); o
clonă rămânea agățată în DOM pentru totdeauna dacă utilizatorul activa „mișcare redusă” în
timpul unei tranziții; o apăsare de tab după o încărcare eșuată a datelor golea ecranul și
arunca, blocând aplicația până la reîncărcare; temporizatorul de autosalvare scria „Salvat.”
pe linia de stare a **lecției următoare**; clona păstra înălțimea ecranului „Plan” (~6000px)
în overflow-ul paginii pe toată durata tranziției; barele de progres din clonă reporneau
animația și se vedeau golindu-se; `--p` putea deveni `NaN`, iar rezerva `var(--p,1)` randa o
bară **plină**; `#/carduri/{modul}` nu arăta butonul „înapoi”; o rută necunoscută lăsa pastila
sub tabul greșit; stiva de navigație nu avea plafon; iar `inert` — singurul lucru care ținea
clona în afara ordinii Tab — nu există pe motoare mai vechi.

#### Verificatorul de documentație — ~15 erori factuale

Aici a fost cel mai neplăcut, fiindcă erau greșeli în **propriile mele afirmații**:
`index.html` avea 35 de linii, nu 30; cifrele de mărime a lui `app.js` erau caractere
etichetate drept octeți; „o listă de 40 de elemente nu durează 4 secunde” — 40 × 32ms
înseamnă 1,3 secunde, nu 4; „patru `radial-gradient`-uri” erau de fapt trei radiale și unul
liniar; două rânduri din tabelul de contrast pentru tema întunecată fuseseră măsurate față de
card, nu față de fundalul paginii; iconițele SVG erau 6, nu 5; caracterul unicode înlocuit pe
tabul „Plan” era `▦`, nu `▩`; iar afirmația că iconițele „se pot regenera oricând din sursă”
era falsă — **generatorul nu era în depozit**.

A infirmat și o afirmație pe care o făcusem cu prea multă încredere: **iconița *maskable* nu
încăpea în cercul de siguranță.** A decodat PNG-ul pixel cu pixel și a măsurat 84,3% diametru
efectiv, cu 450 de pixeli în afara cercului de 80% — capetele barei de bază ar fi fost tăiate
de măștile circulare. *Corectat:* marginea se calculează acum, nu se ghicește (colțurile cutiei
de conținut trebuie să încapă în cerc, nu doar laturile ei), iar remăsurarea dă rază maximă
196,7px față de un cerc de 204,8px — **zero pixeli în afară**.

A greșit o singură dată: a susținut că stilul inline de pe `textarea` nu fusese eliminat
niciodată. `git show 47fbda9:assets/app.js` arată că exista, iar acum nu mai există. Grep-ul
lui pe fișierul curent întorcea zero **tocmai fiindcă** ștergerea se făcuse.

### 17 · O greșeală proprie, prinsă de o unealtă pe care am scris-o după ea

Corectând defectul cu inelul de focus, am șters din greșeală **acolada de închidere** a
regulii. Chromium acceptă azi imbricarea CSS, așa că nu a raportat nicio eroare: pur și simplu
a interpretat **tot restul fișierului** ca reguli imbricate în `:focus-visible`. Efectul —
jumătate din stiluri se aplicau doar elementelor focalizate, iar rotirea 3D a cardului nu mai
funcționa deloc.

Toată bateria de teste a trecut și cu fișierul stricat: verifică erori JS, layout, ținte de
atingere — nu structura foii de stil. Am prins-o doar fiindcă am observat că matricea 3D a
cardului raportează `none` în loc de `rotateY(180deg)`.

Am scris atunci `tools/verifica-css.mjs`: verifică echilibrul acoladelor ignorând comentariile
și șirurile, și semnalează orice selector imbricat — fiindcă în acest proiect imbricarea nu se
folosește, deci apariția ei înseamnă aproape sigur o acoladă uitată. Am reprodus greșeala
originală pe o copie: unealta o prinde, cu linia exactă. Am adăugat-o în CI, ca să nu mai
depindă de norocul cuiva care se uită la o matrice.

### 18 · Publicarea

Ordinea: ramura de lucru → verificare automată verde → `main` → verificare automată verde.

- Ramura `claude/app-design-aesthetic-v01-z15j8c`, trei commituri: redesignul, luciul
  specular, corecturile de la verificatori. Verificarea automată de pe GitHub: **verde**.
- `main` avansat prin *fast-forward*, fără commit de îmbinare. Verificarea automată pe `main`:
  **verde** (rulare #6 — JSON valid, sintaxă JS, **structură CSS**, fișiere PWA, precache complet).

**Despre „live”, exact:** fiecare `git push` pe `main` declanșează republicarea automată pe
Cloudflare Pages — asta e legătura descrisă în `docs/PLAN.md`, Etapa 5. Push-ul e făcut și
verificarea e verde, deci partea care ține de depozit e completă.

**Nu am putut confirma pagina publică din acest mediu**, fiindcă accesul la internet de aici e
limitat la o listă de gazde permise, iar `*.pages.dev` nu e pe ea. Verificarea vizuală rămâne
de făcut la deschiderea adresei. Dacă pagina nu s-a schimbat, singura cauză plauzibilă e că
proiectul Cloudflare Pages nu a fost încă legat de depozit — pașii sunt în `docs/PLAN.md`,
Etapa 5, și se fac o singură dată.

**Pentru cine are deja aplicația instalată pe telefon:** versiunea din `sw.js` a fost crescută
la `stiinte01-v2`, deci noul design ajunge la ei singur, la următoarea deschidere. Fără acest
pas ar fi rămas pe stilurile vechi din cache, la nesfârșit.

---

## Bilanț — versiunea 01, „Sticlă caldă”

**Ce s-a livrat, faza 1 (doar design, cum s-a cerut):**

| | |
|---|---|
| Sistem de design | 1375 de linii CSS, patru straturi, 114 tokeni, toți declarați |
| Paletă | 58 de culori opace, toate în arcul cald 4°–45° (plus 4 verzi semantice). Zero culori reci |
| Temă întunecată | espresso cald, umbre neomorfice recalculate, fiecare token de culoare acoperit |
| Mișcare | 9 curbe iOS cu rol declarat, tranziții push/pop cu parallax, cascade, rotire 3D |
| Iconițe | 6 SVG inline + 3 PNG regenerabile din sursă, cu *maskable* verificat pixel cu pixel |
| Accesibilitate | contrast AA peste tot, ținte ≥44px, inel de focus cald, 4 preferințe de sistem tratate |
| Documentație | jurnal + vault Obsidian de 10 note, validat automat |
| Unelte noi | verificator de structură CSS (în CI) + generator de iconițe |

**Ce nu s-a atins, intenționat:** conținutul din `data/`, logica de progres și de notare, și
cheia de `localStorage` — deci progresul elevilor care folosesc deja aplicația e intact.

**Despre verificare.** Cerința era ca tot ce se creează să fie verificat, ca să nu mai fie
nevoie de audit. Trei verificatori independenți au găsit **7 defecte majore** pe care nu le
prinsesem: unul rescria raza fiecărui element focalizat, unul făcea bara de progres invizibilă
pe tema deschisă, unul anula rezerva pentru browserele vechi, unul strica animația la cea mai
frecventă navigare din aplicație, unul întorcea direcția greșită la navigare, unul ștergea
întrebarea și răspunsul din arborele de accesibilitate, și unul rupea propria regulă a
sistemului. Plus ~14 minore și ~15 erori factuale în documentație.

Toate sunt corectate și **reverificate empiric**, nu doar declarate rezolvate.

Onest, două lucruri pe care le-am greșit eu și care merită reținute mai mult decât lista de
corecturi: am scris cifre în documentație fără să le recalculez, și am rupt tăcut foaia de
stil ștergând o acoladă — iar propria mea baterie de teste a trecut fără să observe. Prima
greșeală a fost prinsă de un verificator; a doua, de o unealtă pe care am scris-o abia după
ce s-a întâmplat. Amândouă rulează acum automat, la fiecare push.

---

## 2026-08-21, mai târziu — Unificarea vaultului

**Observația care a declanșat asta:** notasem cealaltă ramură ca pe o „ciocnire viitoare” și
o lăsasem acolo. Corect era invers — asta e chiar logica lui git: ce se lucrează pe o ramură
se îmbină în `main`. Un avertisment lăsat în jurnal nu e o soluție, e o amânare.

### 19 · Ce era pe cealaltă ramură

`claude/pwa-social-sciences-app-yzli16`, un singur commit: `tools/graphify.py`, un generator
care transformă `data/curriculum.json` și `data/continut.json` într-un vault Obsidian de
**79 de note** legate prin wikilink-uri — parcurs → clase → arii curriculare → materii →
lecții, plus câte o notă de carduri și una de test pentru fiecare materie. Plus
`tools/verifica_vault.py` și un workflow care regenerează vaultul când se schimbă datele.

### 20 · Suprafața reală de conflict — mult mai mică decât părea

Am măsurat-o înainte de a atinge ceva. Din 87 de fișiere adăugate, se suprapuneau **cinci**:

| Cale | De ce |
|---|---|
| `README.md` | ambele ramuri au modificat tabelul de structură |
| `vault/.obsidian/*.json` (×4) | ambele au creat configurația vaultului |

**Restul stă în foldere diferite.** Jumătatea mea: `00-Index`, `10-Jurnal`, `20-Design`,
`30-Aplicatie`, `40-Verificare`. Jumătatea generată: `Curriculum`, `Materii`, `Lecții`,
`Carduri`, `Teste`. Deci nu erau două vaulturi concurente, ci **două jumătăți ale aceluiași
vault**: una descrie cum e făcută aplicația, cealaltă descrie ce se învață din ea.

### 21 · Riscul real, verificat înainte de îmbinare

Generatorul face `shutil.rmtree` pe foldere din `vault/`. Dacă ar fi șters tot, notele mele ar
fi dispărut la prima regenerare de pe GitHub — tăcut, printr-un commit al robotului.

Am citit codul înainte: șterge **doar cele cinci foldere ale lui**, cu comentariu explicit că
notele proprii rămân. Deci convieţuirea era posibilă. Două lucruri au trebuit totuși reparate:

1. **Suprascria configurația `.obsidian` la fiecare rulare.** Culorile grafului și lista de
   plugin-uri sunt reglate acum pentru amândouă jumătățile; o rescriere le-ar fi pierdut de
   fiecare dată. Acum scrie doar fișierele care **lipsesc** — adică la prima generare, sau
   dacă cineva le șterge intenționat ca să le refacă.
2. **`verifica_vault.py` raporta trei legături rupte care nu existau.** Notele mele conțin
   literalul `[[wikilink]]` scris în cod inline, ca explicație a convenției. Un link în
   interiorul unui bloc de cod nu e un link — Obsidian nu-l interpretează. Am reparat
   **verificatorul**, nu textul: ignoră acum blocurile de cod și codul inline, exact cum face
   și verificatorul meu.

### 22 · Legarea celor două jumătăți

Nota de start a jumătății generate se rescrie la fiecare rulare, deci legătura către
documentație nu putea fi pusă în fișier — ar fi dispărut. Am pus-o **în generator**, așa că
supraviețuiește oricărei regenerări. Invers, harta de conținut scrisă de mână trimite la nota
de start și își enumeră acum și folderele generate, cu mențiunea cine le scrie.

### 23 · Verificare după îmbinare

- **Regenerare de probă:** am rulat generatorul pe vaultul unificat. Cele 10 note scrise de
  mână au supraviețuit intacte, iar configurația a păstrat accentul cald.
- **Ambii verificatori, pe tot vaultul:** 89 de note, 632 de wikilink-uri, **zero legături
  rupte, zero note orfane**. Al meu confirmă în plus: JSON valid, frontmatter valid,
  diacritice cu virgulă, tabele consecvente, blocuri de cod echilibrate.
- **Aplicația nu a fost atinsă** de îmbinare — niciun fișier din `assets/`, `data/`, `icons/`,
  `index.html`, `sw.js`, `manifest.webmanifest`. Am rulat oricum toată bateria: capturi pe
  toate ecranele, testul de interacțiune, verificările din CI. Totul verde.

**Rezultat:** un singur vault, 89 de note, două jumătăți care nu se calcă, cu două puncte de
intrare care trimit una la alta. Și ambele unelte de verificare rulează în CI.

---

## 2026-08-21, seara — Versiunea 02, „Responsiv total"

**Cerința:** aplicația să fie utilizabilă pe toate dimensiunile de ecran, foarte
responsivă, cu viteză de reacție foarte mare. Plus proces permanent: branch → merge în
`main`, jurnal + vault la fiecare livrare, echipă de agenți care verifică la fiecare
rulare, iar la final — linkul aplicației.

### 24 · Diagnoza: o coloană de telefon, oriunde ai deschide-o

V01 arăta impecabil pe telefon, dar era *doar* un telefon: aceeași coloană de 760px
pe un monitor de 27", cu bara de taburi jos, în stil telefon, și spațiu gol în rest.
Iar la pornire, service worker-ul cerea întâi rețeaua — pe o conexiune proastă,
aplicația „instalată" se deschidea cu întârziere vizibilă.

### 25 · Scara de layout, treaptă cu treaptă

Nicio schimbare de estetică — v01 rămâne intactă vizual — doar întinsă corect:

| Prag | Schimbarea |
|---|---|
| ≤340px | baza tipografică coboară la 15px; nimic nu se rupe pe Galaxy Fold închis |
| ≥700px | listele de carduri trec pe 2 coloane (`.grid-cards`, `minmax(0,1fr)`) |
| ≥900px | lecția: text la stânga, notițe lipicioase la dreapta; planul pe 2 coloane |
| ≥1024px | bara de taburi devine **rail vertical** la stânga, ca pe iPadOS; coloană de 900px |
| ≥1440px | 3 coloane pentru liste, coloană de 1000px |

Rail-ul refolosește întreaga mecanică a pilulei: JS-ul pune aceleași `--tab-i` și
`--tab-count`, doar axa transformării se schimbă în CSS. Plus safe-area pe toate
laturile (decupajul camerei în peisaj) și `orientation: any` în manifest — pastila
de instalare nu mai blochează peisajul, ceea ce ar fi contrazis tot restul.

### 26 · Viteza: patru mutări, fiecare cu motivul ei

1. **Cache-first la navigare** în `sw.js`: pornire instantanee din cache, revalidare
   în fundal. Prospețimea reală o dă oricum bump-ul de `CACHE` (acum `v3`).
2. **Preload pentru ambele JSON-uri** în `<head>`, cu `crossorigin` — fără atribut,
   preload-ul nu s-ar potrivi cu `fetch()`-ul (mod CORS) și totul s-ar descărca dublu.
3. **Delegare de evenimente**: un ascultător pe `#view` pentru tot `[data-go]`, în
   locul re-legării la fiecare randare. `bindGo()` a dispărut cu totul.
4. **Schimbarea clasei pe Acasă** rescrie doar panoul cu tabelul: **80ms măsurat**,
   fără repornirea animațiilor de intrare, fără săritura de scroll a re-randării.

Și una de fond: fundalul ambiental stătea pe `background-attachment: fixed`, care
forțează repictarea gradientului la fiecare cadru de derulare și e ignorat de iOS
Safari. Acum e un `body::before` fix — compus o singură dată pe GPU.

### 27 · Bug-ul rulării: pastila care a slăbit

Prima variantă punea geometria verticală a pastilei `.tab-ind` în secțiunea
responsivă a stratului 2. Dar stilul de bază al pastilei e în stratul 3, mai jos în
fișier — la specificitate egală câștiga el, iar pastila rămânea o fâșie de 17px care
glisa orizontal peste rail. Capturile automate au prins-o din prima rulare; mutarea
suprascrierii în stratul 3, cu comentariu care explică de ce, a închis-o. Avertismentul
din capul fișierului — „ordinea straturilor NU e decorativă" — s-a dovedit din nou.

### 28 · Procesul devine instituție

- **`CLAUDE.md`** nou la rădăcină. Regula nr. 1: *cine citește CLAUDE.md citește și
  vault-ul Obsidian* — MOC-ul plus ultima notă de jurnal. Regula nr. 2: *echipa de
  verificare la fiecare rulare* — nimic nu se îmbină neverificat.
- **`.claude/agents/`**: `verificator-cod` (adversarial, pe diff) și `verificator-ui`
  (empiric, cu capturi pe toată scara de ecrane). Definiți în repo, deci disponibili
  oricărei rulări viitoare.
- **`publicare-pages.yml`**: fiecare push pe `main` publică aplicația pe GitHub Pages —
  un link public care nu depinde de configurarea manuală a Cloudflare.

### 29 · Verificarea

Bateria proprie: verificatorii din CI local (JSON, sintaxă, structură CSS, precache),
apoi capturi Playwright pe **8 viewporturi × 2 teme × 7 ecrane**, cu măsurători
automate: fără derulare orizontală nicăieri, rail-ul vertical exact de la 1024px,
pilula orizontală sub, toate țintele ≥44px, interacțiunea cap-coadă (navigare,
întoarcere de card, test, schimbare de clasă). Apoi **doi agenți independenți** —
unul pe cod, unul pe interfață — ale căror constatări sunt în
`vault/40-Verificare/Raport verificare v02.md`.

### 30 · Ce a găsit echipa — și de ce a meritat

Verificatorul de cod a găsit **un blocant** pe care bateria mea nu-l prinsese:
`content:""` de pe `body::before` ajunsese în fișier cu ghilimele **tipografice**
(U+201D) — unealta de editare „înfrumusețase" ghilimelele într-un fișier plin de
comentarii românești. Declarația invalidă era aruncată tăcut, deci fundalul ambiental
— exact funcția mutată în acest commit — nu se mai desena deloc, în ambele teme. A
trecut prin verificatorul de CSS (care număra doar acolade) și prin toate capturile
anterioare (care arătau fundal plat fără să știe că trebuia mesh). Plus un
**important**: cache-first-ul de la navigare putea stoca un răspuns `redirected`,
care pe Cloudflare Pages (308 la `/index.html`) ar fi blocat pornirea aplicației la
fiecare deschidere. Verificatorul de UI a confirmat empiric toată scara (48 de
combinații viewport × rută, zero scroll orizontal, zero erori JS) și a prins pragul
greșit al planului (700 în loc de 900).

Toate corectate și **reverificate empiric** — mesh-ul se vede acum pe captură, iar
`verifica-css.mjs` detectează de-acum ghilimelele tipografice în afara comentariilor,
în CI, ca eroare. Clasa de bug e închisă definitiv. Detalii:
`vault/40-Verificare/Raport verificare v02.md`.

### 31 · Publicarea — totul automat, minus un clic care nu poate fi al meu

Prima variantă de workflow (actions/deploy-pages) a picat exact cum anticipase
verificatorul de cod: `GITHUB_TOKEN` nu poate CREA situl Pages — „Resource not
accessible by integration". A doua variantă împinge ramura clasică `gh-pages` (cu
`.nojekyll`, ca Jekyll să nu arunce fișierele cu underscore și să nu proceseze
markdown-ul din vault): rulează verde, ramura există și se reîmprospătează la fiecare
push pe `main`.

Ce nu se poate face din acest mediu: activarea inițială a sitului, care e un drept de
administrator — un clic în **Settings → Pages → Source: Deploy from a branch →
`gh-pages`**. După el, adresa e `https://almeueste777-ops.github.io/Stiinte01/` și nu
mai atinge nimeni nimic manual. (Alternativa Cloudflare din `docs/PLAN.md`, Etapa 5,
rămâne valabilă în paralel: dacă proiectul `stiinte01.pages.dev` a fost legat de depozit,
merge-ul de azi l-a republicat deja automat.) Nici adresa publică nu poate fi deschisă
de aici — proxy-ul mediului nu lasă `*.github.io` — deci confirmarea vizuală finală
rămâne primul lucru de bifat la deschiderea linkului.
