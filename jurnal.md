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

---

## 2026-08-21, noaptea — v02.1: primul utilizator real găsește ce n-a găsit echipa

**Raportul:** la deschiderea linkului `stiinte01.pages.dev`, pagină nestilizată —
fundal bleumarin, iconițe SVG uriașe, totul stivuit. Adică exact ce nu arătase
niciuna dintre cele câteva zeci de capturi de verificare.

### 32 · Diagnoza, făcută pe serverul live

Fetch pe fișierele publicate (printr-un serviciu extern, fiindcă proxy-ul mediului
nu lasă accesul direct): **CSS-ul de pe server e cel nou, corect** — conține
`--rail-w`, `body::before`, tot v02-ul. Deci Cloudflare e conectat și publică
automat din `main`; serverul e nevinovat.

Vinovatul e **amestecul de versiuni din cache-ul browserului**: `index.html` e
`no-cache` (mereu proaspăt), dar `_headers` dădea `/assets/*` cu
`max-age=604800` — 7 zile — iar fișierele nu au amprentă în nume. Un browser
care văzuse aplicația în prima ei zi (v00, paleta rece bleumarin) a primit azi
HTML-ul v02 cu **CSS-ul v00 din cache**: stilurile vechi nu cunosc SVG-urile și
clasele noi, deci iconițele explodează la mărimea naturală, pe fundal navy.
Mai rău: `caches.addAll()` al unui service worker nou trece tot prin cache-ul
HTTP, deci putea „precacha" solemn fișiere vechi în numele versiunii noi.

### 33 · De ce nu l-a prins echipa

Bateria de verificare rula cu service worker-ul **blocat** și cu profiluri de
browser **curate** — adică exact scenariul în care bug-ul nu poate apărea.
Amestecul de versiuni cere un istoric: un cache de acum câteva ore. Lecția:
verificarea trebuie să acopere și **drumul dintre versiuni**, nu doar versiunea.

### 34 · Reparația, pe trei straturi

1. **`sw.js` (CACHE v4):** precache-ul folosește `new Request(u, {cache:'reload'})`
   — ocolește cache-ul HTTP; revalidările de fundal folosesc `{cache:'no-cache'}`
   (cerere condiționată, 304 dacă nu s-a schimbat nimic).
2. **`app.js`:** când un SW nou preia controlul, pagina se **reîncarcă singură o
   dată** (gardă anti-buclă; la prima instalare nu se reîncarcă nimic). Nimeni nu
   mai rămâne pe un amestec HTML nou + CSS vechi nici măcar până la următorul F5.
3. **`_headers`:** `/assets/*` trece pe `no-cache`. Viteza n-o pierdem: o dă
   service worker-ul, care e cache-first; stratul HTTP doar revalidează.

### 35 · Verificatorul de cod, pe reparație: trei constatări, toate încorporate

1. **Reload-ul automat ar fi aruncat munca omului** — un test la întrebarea
   10/12, un pachet de carduri, notițele în curs de tastare trăiesc doar în
   memorie. Acum reload-ul se **amână** pe ecranele cu stare (test, carduri,
   textarea focalizat) până la următoarea navigare sau până când tab-ul trece
   în fundal; iar notițele se salvează imediat la părăsirea câmpului, nu doar
   după pauza de 400ms.
2. **Browserele fără service worker** ar fi rămas pe CSS-ul vechi până la 7
   zile: intrarea de cache existentă nu află niciodată de noul `no-cache`.
   Spart cu versionarea URL-urilor: `app.css?v=4` / `app.js?v=4`, crescute
   odată cu `CACHE` — iar CI-ul verifică de-acum **sincronizarea** celor trei
   locuri (`sw.js` CACHE, `sw.js` ASSETS, `index.html`).
3. **Jurnalul afirma o unealtă care nu era în repo** — clasa istorică de
   greșeală „afirmații neverificabile în documentație". Testul de ciclu de
   viață al SW-ului e acum `tools/test-sw.mjs`, rulabil de oricine.

### 36 · Verificat cu service worker ACTIV, de data asta

`tools/test-sw.mjs`: prima instalare — zero reîncărcări; aplicația stilizată și
funcțională sub SW; un release simulat (bump de CACHE în fișierul servit) —
**exact o reîncărcare** pe un ecran fără stare, apoi stabil; zero erori JS. Și
testul de amânare: update-ul sosit **în mijlocul unui test grilă** nu reîncarcă
nimic (feedback-ul întrebării rămâne pe ecran), iar la părăsirea ecranului
reload-ul se execută o singură dată. Plus verificatorii locali, ca de obicei.

**Pentru cine vede încă pagina stricată:** un singur refresh forțat
(Ctrl+Shift+R / Cmd+Shift+R) o repară definitiv; din v02.1, realinierea se face
singură — la momentul potrivit, nu peste munca omului.

---

## 2026-08-22 — Versiunea 03, „Temă, setări, conținut complet"

Trei cerințe, formulate de utilizator: *aplicația am găsit-o pe modul dark, vreau
să aibă și modul luminos*; *aplicația nu are setări, implementează tot felul de
setări*; *vreau să lucrăm pe module — fiecare materie în parte, toate lecțiile pe
capitole, în fiecare an, cât mai complex, apoi test din fiecare lecție și test pe
semestru*.

### 37 · Tema: din media query în atribut

Paleta întunecată exista, dar era prizonieră în `@media (prefers-color-scheme:
dark)` — adică urma exclusiv setarea sistemului, fără ca utilizatorul să poată
alege. Toate blocurile de temă au trecut pe atribute puse pe `<html>`:

```css
:root:where([data-tema="intunecat"]) { /* aceeași paletă, altă poartă */ }
```

`:where()` nu adaugă specificitate, deci cascada a rămas bit cu bit aceeași — nu
s-a rescris nicio componentă. Același tratament au primit `prefers-contrast`,
`prefers-reduced-motion` și `prefers-reduced-transparency`, care sunt acum
`data-contrast`, `data-miscare`, `data-transparenta` și au fiecare trei stări:
automat (urmează sistemul), pornit, oprit.

Capcana pe care am prins-o abia la a doua citire: câteva blocuri erau
`@media (prefers-color-scheme: dark)` **imbricate** în `@supports` sau în alt
media query. Desfăcute naiv, condiția exterioară dispărea în tăcere. Soluția:
atribute combinate, `[data-transparenta="redusa"][data-tema="intunecat"]`.

Ca prima pictură să fie deja corectă, temele se pun **înainte** de foaia de stil,
dintr-un script inline din `<head>` care citește `localStorage` sincron. Fără el,
un utilizator cu temă întunecată ar vedea o clipire albă la fiecare pornire.

### 38 · Setări: un ecran, nu un meniu

Ruta nouă `#/setari` (rotița din bara de sus) adună: **aspect** — temă, contrast,
transparență, mișcare, densitate (compact / confortabil / spațios), font (sistem
/ serif / lizibil), mărimea textului 80–150%; **studiu** — clasa implicită,
amestecarea întrebărilor și a opțiunilor, afișarea explicațiilor, cronometru,
numărul de întrebări; **date** — export și import JSON, plus resetări separate
(progres, teste, carduri, notițe, setări, tot).

Setările nu sunt decorative: densitatea rescrie scara de spațiere, fontul
rescrie familia și înălțimea rândului, mărimea textului scalează `font-size` pe
`html`. Fiind toate tokeni, se propagă în tot fișierul fără nicio excepție
scrisă de mână.

### 39 · Conținutul: DSL text -> JSON -> index generat

Cerința a treia era, de departe, cea mai mare: **60 de module** (materie × an),
adică toată matricea planului-cadru, cu lecțiile grupate pe capitole, test la
fiecare lecție și teză la fiecare semestru.

Un singur `data/continut.json` ar fi devenit un fișier de câțiva megaocteți,
descărcat integral la fiecare pornire. Modelul e acum împărțit:

| Fișier | Rol |
|---|---|
| `data/sursa/*.txt` | conținutul scris de om, într-un DSL de o pagină |
| `data/module/<id>.json` | sursa de adevăr, un fișier per materie×an |
| `data/continut.json` | **index generat**: titluri, cifre, structura capitolelor |
| blocul `MODULE` din `sw.js` | **listă generată** de precache |

`tools/text-in-modul.mjs` convertește DSL-ul, `tools/construieste-index.mjs`
scrie indexul și rescrie blocul din `sw.js`, `tools/verifica-continut.mjs` refuză
tot ce nu ține: materie care nu există în planul-cadru, id duplicat, întrebare
sub 8 caractere, opțiuni identice, explicație lipsă, rezumat sub 120 de
caractere, mai puțin de trei carduri sau trei întrebări, teză lipsă la un
semestru. A prins, în timpul scrierii, exact ce trebuia să prindă: o teză cu o
întrebare de șapte caractere și o grilă de franceză cu aceeași opțiune greșită
scrisă de două ori.

Aplicația cere modulul abia când e deschis (`ceriModul`, memoizat), cu un token
de randare care anulează rezultatul dacă utilizatorul a navigat între timp, și
cu un indicator de încărcare care apare doar după 400 ms — cât să nu clipească
pe conexiuni bune. Toate cele 60 de fișiere rămân însă în precache: altfel
aplicația instalată ar avea lecțiile doar cât timp există rețea.

**Bilanț: 60 de module, 206 capitole, 580 de lecții, 2320 de carduri, 3614
întrebări** — teste de lecție și teze semestriale.

### 40 · Vaultul, adaptat la modelul pe module

`tools/graphify.py` presupunea un modul per materie, cu `flashcards` și `quiz` la
rădăcină. Acum citește `data/module/*.json`, aplatizează capitolele păstrând pe
fiecare lecție capitolul din care vine, și cheia devine **materie + clasă** —
altfel „Istorie" din clasa a IX-a și cea din a XII-a s-ar fi suprascris. Folder
nou `vault/Module`, câte o notă per materie×an; nota de materie devine umbrelă,
cu un rând per an. Harta mermaid, care ar fi avut 60 de noduri ilizibile, s-a
regrupat pe clase și arii.

Vaultul are acum **811 note** și **5367 de wikilink-uri**, fără legături rupte.

### 41 · Verificare

Verificatorii locali (JSON, sintaxă JS, CSS, vault), plus doi noi în CI:
validarea celor 60 de module și `verifica-continut.mjs`. Un al treilea pas de CI
rulează generatorul de index și cere ca `data/continut.json` și `sw.js` să nu se
schimbe — adică indexul comis să fie chiar cel generat din module.

`tools/test-sw.mjs`, cu service worker activ: prima instalare fără reîncărcare,
60 de carduri de materii vizibile sub SW, exact o reîncărcare la update, stabil
după, zero erori JS.

### 42 · Ce a găsit echipa de agenți — 20 de defecte reale

Cei doi verificatori au adus 20 de defecte, toate corectate și **reverificate
empiric**. Câteva merită reținute, fiindcă sunt clase de greșeală, nu accidente:

**Migrarea tăcută.** `KEY` rămăsese `stiinte01:v1`, dar spațiul de id-uri se
schimbase complet: `filo-01` devenise `filo12-01`, cheile de card și de test la
fel. Intersecția cu v02: zero. Un elev venit de pe versiunea veche ar fi văzut
„20/580 lecții citite" și o medie calculată din teste fără domeniu, în timp ce
fiecare lecție apărea necitită. Nimic nu ar fi semnalat problema — nici o
excepție, nici o eroare de consolă. Lecția: **când se schimbă forma datelor,
cheia veche trebuie fie migrată, fie curățată; păstrată intactă e cea mai
proastă dintre cele trei variante.**

**Atomicitatea care se scumpește pe tăcute.** `addAll` peste ~10 fișiere și 150 KB
era rezonabil la v02. Aceeași linie de cod, peste 70 de fișiere și 2,8 MB, a
devenit o loterie: un singur timeout anula instalarea întregii versiuni, iar
utilizatorul rămânea pe versiunea veche fără niciun semn. **Codul nu s-a
schimbat; datele din jurul lui da — și asta a fost de ajuns.**

**Ordinea scrie/validează.** Importul făcea `save()` înainte să se convingă că
starea e utilizabilă. Un fișier cu `lectiiCitite: null` trecea de verificarea „e
obiect", se persista, randarea arunca — iar de atunci înainte aplicația afișa la
fiecare pornire „Nu s-au putut încărca datele. Verifică fișierele din `data/`",
adică arăta cu degetul exact în direcția greșită. Recuperare doar prin golirea
manuală a `localStorage`.

**Eșecul totul-sau-nimic.** `Promise.all` peste 13 module: 12 sosite complet și
unul căzut dădeau un ecran de eroare. Acum se randează ce există, cu un banner
onest despre ce lipsește.

**Regresii de layout pe care doar măsurătoarea le prinde.** Ținta segmentelor era
de 40px, deși comentariul din CSS afirma ≥44 — afirmație nemăsurată, exact clasa
de greșeală pe care jurnalul o critica la v02.1. Pastila „BAC" se întindea pe
806px din 858, fiindcă o regulă `display:block` pentru textul secundar prindea și
`<span class="pill">`. Titlul „Termeni" era acoperit de tabel cu 16px, pe toate
cele 580 de lecții. Switch-ul oprit avea 1,07:1 față de fundal — practic
invizibil, sub pragul WCAG de 3:1.

**Reverificare finală:** 616 combinații (7 viewporturi × 2 teme × 11 rute × 4
seturi de preferințe) — zero derulare orizontală, zero ecrane goale, zero
suprapuneri, zero ținte sub 44px, zero erori de consolă. Detaliile, cu
măsurătorile de dinainte și de după: [[Raport verificare v03]] (`vault/40-Verificare/`).

### 43 · Al treilea jurnal: cel pe care îl citește elevul

Până acum, o livrare se scria în două locuri — `jurnal.md`, pentru cine întreține
codul, și vault, pentru memoria proiectului. Amândouă sunt scrise pentru noi.
Utilizatorul aplicației nu are cum să afle ce s-a schimbat: deschide aplicația și
găsește altceva decât ieri, fără nicio explicație.

Al treilea jurnal e `data/versiuni.json`, arătat în aplicație la **Setări →
Despre → „Ce s-a schimbat"**, chiar lângă *Caută o versiune nouă*. Regula lui e
alta decât a celorlalte două: **se scrie pentru elev, nu pentru programator.**
„Lecțiile se descarcă doar când sunt deschise, dar rămân salvate pe dispozitiv
pentru offline" — nu „încărcare leneșă cu memoizare și token de randare".

Fiind un fișier de date, nu cod, poate fi corectat fără atingerea aplicației, iar
CI-ul îl verifică: versiunea `curenta` trebuie să fie prima din listă, câmpul
`cache` al ei trebuie să fie **același număr** cu `CACHE` din `sw.js`, versiunea
de sus trebuie să aibă schimbări scrise, iar datele trebuie să fie valide. Adică
exact tipul de sincronizare care se pierde tăcut dacă nu o verifică nimic — vezi
§35, unde jurnalul afirma o unealtă care nu exista în repo.

`CLAUDE.md` are acum regula scrisă negru pe alb: **trei jurnale la fiecare
livrare, toate trei, mereu** — plus îmbinarea în `main` ca pas automat, nu ca
întrebare pusă de fiecare dată.

Un defect prins la reverificare, instructiv fiindcă e o repetare: „Înapoi" din
„Ce s-a schimbat" anima ca **intrare**, nu ca ieșire — exact bug-ul corectat cu
câteva ore înainte la ecranul Setări. Prima corecție tratase suprapunerile ca
mereu-intrare; a doua verifică întâi dacă ecranul e deja în stivă. Morala:
**când corectezi un caz special, întreabă-te dacă e singurul din clasa lui.**

---

## 2026-08-22, mai târziu — Versiunea 04, „Antrenament și simulare de notă"

Cerința: *un sistem de învățare nou, care să implice elemente din mai multe
sisteme, cele mai bune* — plus *teste grilă cu punctul 1, 2, 3, 4, 5, câte două
puncte de fiecare, care să calculeze dacă sunt elev de nota 9 sau mai puțin, la
fiecare materie.*

### 44 · Șapte mecanisme, nu șapte trucuri

Aplicația avea două unelte separate: carduri și test grilă. Amândouă bune,
amândouă incomplete — cardurile nu știau ce ai uitat, testul nu te învăța nimic,
iar între ele nu exista nicio legătură.

Antrenamentul le adună într-un sistem construit din șapte mecanisme, fiecare
alese pentru un **mod concret în care învățatul obișnuit eșuează**, nu fiindcă
sună bine:

| Mecanism | Ce eșec repară |
|---|---|
| repetiție eșalonată | uiți exact ce n-ai mai atins |
| recuperare activă | recitirea dă iluzia că știi |
| intercalare | blocul „o lecție pe rând" se uită repede |
| efect de generare | recunoști, dar nu poți produce |
| calibrare | „credeam că știu" |
| practică deliberată | repeți ce știi deja |
| stăpânire cu prag | „am citit-o" ≠ „o știu" |

Detaliile fiecăruia, cu matematica programării: [[Sistemul de învățare]] din vault.

**Calibrarea e piesa care lipsește din aproape toate aplicațiile de învățare** și
cea care schimbă cel mai mult rezultatul la teză. Elevul nu pică fiindcă nu știe
nimic; pică fiindcă nu știe *ce* nu știe. „Îmi sună cunoscut" e produs de
recunoaștere, nu de stăpânire, iar recitirea îl întărește fără să adauge nimic.
Singurul mod de a sparge iluzia e s-o măsori: aplicația întreabă cât ești de
sigur **înainte** de răspuns și îți spune la final de câte ori ai zis „sigur" și
ai greșit.

### 45 · Cinci tipuri de exercițiu, zero conținut nou

Grilă, card, termen, completare, explicație — toate **derivate din conținutul
existent**. `l.termeni` dă și „Termen → definiție" (recunoaștere), și
„Completează" (producere, cu răspuns scris); `l.ideiCheie` dă „Explică".

Deosebirea dintre grilă și completare e cea mai utilă informație din raport:
grila se nimerește, completarea nu. 90% la grilă și 40% la completare înseamnă că
elevul **recunoaște** materia fără s-o poată **produce** — exact diferența care
se vede la un subiect cu răspuns scris.

Completarea acceptă răspunsuri fără diacritice, fără majuscule și cu o literă
greșită (Levenshtein 1 la cuvinte de peste 5 litere). Elevul nu e la un concurs
de ortografie; dacă „constituţie" ar fi respins, mecanismul ar antrena frustrarea,
nu materia.

### 46 · Simularea de notă, exact pe structura cerută

Cinci puncte, fiecare de 2 puncte, total 10. Fiecare punct are **4 întrebări a
câte 0,5p** — și asta nu e o alegere estetică: cu un singur item de 2p pe punct,
notele ar sări din 2 în 2 și **nota 9 n-ar fi accesibilă**, adică fix cifra pe
care a cerut-o utilizatorul.

Punctele trag din capitole diferite, prin cozi rotite pe capitol: proba acoperă
materia, nu o lecție. Fără feedback până la final, ca la o teză adevărată.
Punctajul obținut **este** nota. Grilele din simulare hrănesc și programarea
eșalonată — o teză dată degeaba ar fi o ocazie ratată de învățare.

Verificat cu cheia de răspuns citită din datele modulului: **20/20 → 10,00**,
**18/20 → 9,00 „Ești elev de nota 9"**, **14/20 → 7,00**.

### 47 · O regresie prinsă de măsurătoare, nu de privit

`.grid2` era `1fr 1fr`. `1fr` înseamnă `minmax(auto, 1fr)`, iar `auto` nu coboară
sub lățimea min-content. Cu etichetele noi, mai lungi, la 150% mărime text grila
cerea **364px într-un ecran de 320**. Trecut pe
`repeat(auto-fit, minmax(min(100%, 9rem), 1fr))`: la text mare trece singură pe o
coloană.

Instructiv e cum era să-mi scape: am măsurat întâi la mărimea implicită, am văzut
zero depășiri și eram gata să pun rezultatul pe seama animației de intrare.
Defectul apărea **doar** la 140–150%. **Când o măsurătoare contrazice un raport,
verifici în condițiile raportului, nu în ale tale.**

### 48 · Echipa de verificare: 25 de defecte, două lecții care se repetă

Cei doi agenți au adus **25 de defecte reale** — 15 pe cod, 10 pe interfață.
Toate corectate și reverificate în condițiile în care au fost raportate.
Raportul complet, cu măsurătorile de dinainte și de după:
[[Raport verificare v04]] din vault. Două merită repetate aici, fiindcă sunt
clase de greșeală, nu accidente.

**Refactorizarea „fără schimbări de comportament" avea una.** Extragerea lui
`parcurge()` din `domeniu()` a transformat, la ramura tezei, o **adăugare** într-o
**atribuire**: bazinul a scăzut de la 40 de întrebări la 12. Cu 12 în bazin și un
test de 12, fiecare teză ar fi ieșit identică. Nu se vedea în cod — o linie
aproape la fel — și nu se vedea în interfață, fiindcă numărul afișat e plafonat
de setări. Agentul a prins-o pornind **două servere în paralel**, pe v03 și pe
v04, și comparând aceeași rută. Morala: o refactorizare fără schimbări de
comportament se **măsoară**, nu se declară.

**Protecția scrisă la v03 nu funcționa.** Importul avea un `try/catch` care
trebuia să readucă starea precedentă dacă randarea cădea. Dar `render()` e
`async`: excepția devine promisiune respinsă, iar `catch`-ul sincron n-o prinde
niciodată. Un fișier de import cu `"n": "9,50"` — șir în loc de număr — se
salva, iar de la următoarea pornire ecranul Acasă rămânea gol la nesfârșit, cu
`n.toFixed is not a function`. Recuperare doar prin golirea manuală a
`localStorage`. Ironia: comentariul de deasupra declara clasa asta de bug
reparată. Era, pe câmpurile vechi.

Reparat pe două straturi, fiindcă unul singur nu ajunge: **sanitizare în
adâncime** (fiecare câmp din `antren` și `note` clamp-uit la un interval valid,
la fiecare citire) și rollback mutat pe lanțul de promisiuni. Prima e cea care
contează — a doua e plasă.

**Restul, pe scurt:** butoane de răspuns randate active dar inerte până
răspundeai la calibrare; o cifră afișată („1744 de repetat") pe care sesiunea
n-o folosea; trei componente noi cu contrast de 2,78:1, sub prag, pe care nici
modul „contrast ridicat" nu le repara; câmpuri de scris la 15px, adică exact sub
pragul de la care Safari pe iOS mărește singur pagina; `save()` care înghițea
tăcut depășirea de cotă, deci un elev putea antrena o oră fără să se salveze
nimic.

**Reverificare finală:** 896 de combinații (7 viewporturi × 2 teme × 16 rute × 4
seturi de preferințe) — zero derulare orizontală, zero ecrane goale, zero
suprapuneri, zero ținte sub 44px, zero erori de consolă. Simularea de notă,
verificată cu cheia de răspuns citită din date: 20/20 → 10,00, **18/20 → 9,00**,
14/20 → 7,00. Testul de service worker cu SW activ: trecut.

## 2026-08-22, mai târziu — Versiunea 05, „Bleumarin de miezul nopții + nisip cald"

Cererea: „caută și îmbunătățește aplicația cu culorile din imagini, schimbând
doar cromatica și foarte puțin designul. Fă cele mai reușite combinații." Trei
planșe de paletă atașate: **Midnight Navy + Warm Sand** (cu detalii de aur, sub
eticheta *„perfect together — balance of depth and warmth"*), o scară de
**neutre calde** (bej → espresso) și o scară de **auriu** (cream → bronz).

O recolorare, deci, nu un redesign. Și fiindcă tot sistemul de culoare stă
centralizat în stratul 1–1b din `app.css` — **zero hex-uri hardcodate după linia
400**, verificat cu grep — schimbarea a fost curată: doar valori de tokeni, nicio
regulă de componentă atinsă.

**Cum s-au mapat planșele pe cele două teme.** Planșa 1 e vedeta, și se așază de
la sine peste comutatorul luminos/întunecat al aplicației:

- **Tema luminoasă = lumea „Warm Sand".** Suprafețele de nisip/smântână/lut erau
  deja, la propriu, paleta „Warm Sand" din planșă (Light Sand, Ivory Sand, Soft
  Beige) — au rămas neatinse. Cerneala rămâne espresso (planșa 2). **Bleumarinul
  intră ca brand** în locul teracotei: `--brand` #9E4119 → **#234B6F**. **Aurul**
  devine accentul: `--accent` #B4761A → **#C8901E**.
- **Tema întunecată = lumea „Midnight Navy".** Suprafețele espresso devin
  bleumarin de miezul nopții: `--surface-base` #191310 → **#141F33**, `raised`
  #241B15 → **#1E2C46**, `sunken` #120D0A → **#0E1626**. Cerneala rămâne nisip
  fildeș cald (#F3ECDC) — aici e „căldura" din „adâncime și căldură". Brandul
  devine oțel-bleu deschis (#9DB6D2), ca să reziste pe fundal închis; accentul
  rămâne aur (#E7B267).

Aurul e firul comun al ambelor teme — exact rolul lui în planșa 1, unde liniile,
busolele și ramele aurii leagă panoul bleumarin de cel de nisip.

**Ce NU s-a atins, deliberat.** Cerneala de lectură pe lumină rămâne espresso, nu
bleumarin: „espresso, niciodată gri" e teza, iar bleumarinul e culoare de
*identitate* (butoane, linkuri, focus), nu de *lectură*. Rolurile tokenilor n-au
migrat — h1/h2 folosesc tot `--ink`, nu brandul. Suprafețele de nisip ale temei
luminoase fiind identice, neumorfismul cald al temei luminoase (`--nm-l`/`--nm-d`)
a rămas neschimbat. Pe întuneric, în schimb, „lumina" neumorfică a trebuit
recalculată: o ridicare maro (#5C4634) pe o suprafață bleumarin arată noroios, așa
că a devenit oțel-bleu (#3E5474). La fel, mesh-ul ambiental nocturn și tenta
sticlei nocturne au trecut pe bleumarin (cu o muchie de aur discretă, ca liniile
din planșă).

**Contrastul, recalculat, nu presupus.** Fiindcă s-au schimbat brandul (luminos)
și suprafețele + cerneala + brandul (întunecat), am recalculat perechile critice
pe valorile hex reale (luminanță sRGB, prag AA 4,5:1). Toate trec, majoritatea la
AAA. Cea mai strânsă: `--brand-ink` pe capătul deschis al gradientului de buton,
**6,22:1**. `--brand` ca text (linkuri, scorul de la simulare) urcă la 8,48:1 pe
lumină și 6,69:1 pe întuneric. Stările corect/greșit din tema întunecată au fost
verificate pe fundalul **compus** (tenta semantică peste noul bleumarin), nu pe
tokenul plat: 6,88:1 și 6,38:1.

**Capcana, a doua oară.** `--accent` #C8901E dă doar **2,54:1** ca text pe
smântână — și mai jos decât chihlimbarul vechi (3,53:1). Fără regula „accentul e
DOAR umplutură, cu fratele `--accent-text` pentru text", recolorarea ar fi arătat
bine și ar fi picat la audit. Regula a ținut fiindcă exista deja.

**Versionare.** `CACHE` `stiinte01-v8` → `v9`; `?v=8` → `?v=9` în `index.html` și
`sw.js`, și pentru CSS și pentru JS (ambele s-au schimbat). `meta[theme-color]`
pe întunecat #191310 → #141F33, în cele două locuri care o scriu (bootstrap-ul din
`index.html` și `app.js`). `data/versiuni.json`: intrare v05 nouă (cache 9),
scrisă pentru elev, `curenta` → "05".

**Reverificare.** Bateria locală trece integral. Echipa de agenți (lansată în
paralel): verificatorul de cod a găsit **trei constatări reale** — cea mai
importantă, un token de sticlă densă rămas espresso în tema întunecată
(`--glass-bg-strong`), care făcea butonul „înapoi" și fața cardului de memorare
să apară **maro pe fundal navy** în modul implicit; plus un comentariu de
contrast învechit și iconița PWA rămasă pe brandul teracotă. Toate trei
corectate: sticla densă pe navy (`rgba(30,44,70,.82)`), comentariul recalculat
(8,99:1 pe bleumarin), iconița regenerată pe paleta v05. Corecția sticlei,
reverificată empiric prin eșantionare DOM + captură pe cele două ecrane afectate:
`rgba(30,44,70,.82)`, fără maro. Verificatorul vizual: **238 de capturi**, zero
derulare orizontală, zero ținte sub 44px, `theme-color` corect, stările
corect/greșit distincte și lizibile pe bleumarin în tema întunecată, preferințele
de accesibilitate lizibile — **niciun defect vizual**. Raport complet:
[[Raport verificare v05]] din vault.

---

## 2026-08-23 — v06, „Motivație și progres" (audit premium + implementare)

**Cererea.** „Fă un audit aplicației. Compară cu aplicațiile bune de pe piață. Vezi ce îi
lipsește ca să fie o aplicație premium și implementează."

**Auditul.** Aplicația era deja peste media pieței la două capitole unde multe aplicații
„premium" doar se prefac: **pedagogia** (repetiție eșalonată reală SM-2, calibrare, stăpânire cu
prag — Duolingo/Quizlet numesc adesea „spaced repetition" un simplu program fix de reminder-e) și
**designul** (sistem propriu glass+neomorfism, mișcare iOS reală, contrast WCAG verificat,
responsiv 320→1440px, offline complet — offline fiind chiar o funcție *plătită* la Duolingo Plus).
Ce le deosebește pe cele premium și lipsea aici, fezabil offline fără backend: (1) un **strat de
motivație** (insigne, streak proeminent, momente de recompensă); (2) un **tablou de progres**
(statistici, heatmap de activitate, tendințe); (3) **onboarding**. Reminder-ele push le-am lăsat
deoparte, cinstit: fără backend nu pot livra ce promit.

**Ce s-a implementat.**
- **Fundații (§2).** `state.activ` (intensitatea de studiu pe zi — heatmap + serie), `state.stats`
  (contoare cumulative), `state.insigne` (`{id: moment}`; `undefined` = nesădit), `state.vazutIntro`,
  setarea `sarbatori`. `sanitizeaza` validează tot și **migrează** `activ` din `zile` la trecerea
  de pe v05. Seria (`serie()`) numără acum orice studiu, nu doar lecțiile citite; `zile` rămâne
  strict pentru obiectivul zilnic. Noi: `serieMax`, `zileActiveIn`, `marcheazaActivitate`.
- **Realizări (§7d).** 20 de insigne pe șase grupuri, toate derivate din stare. `verificaInsigne`
  sădește **tăcut** la prima pornire pe v06 ce e deja meritat (ca elevii vechi să nu fie inundați),
  apoi celebrează. Ecran `#/realizari`. Sărbătoare: toast pe `<body>` (supraviețuiește re-randării)
  + confetti CSS, cu respect pentru „Sărbători" din Setări și „mișcare redusă".
- **Progres (`#/progres`).** Card-erou de streak, heatmap pe 18 săptămâni, cifrele tale, stăpânire
  pe materii, note recente, „de reluat curând".
- **Onboarding.** Foaie de bun-venit la prima pornire (folosește `.sheet`/`.scrim`, pregătite din
  v01 și nefolosite), reaccesibilă din Setări. **Acasă** devine hub; Setări capătă „Sărbători" și
  „Revezi introducerea". Rutele noi sunt suprapuneri (alunecă, „înapoi" corect).
- **Meta.** `CACHE` v9→v10, `?v=9`→`?v=10` (CSS+JS), `manifest` `id`+scurtătură, `versiuni.json` v06.

**Verificare.** Bateria locală trece integral (JSON, `node --check`, CSS, conținut, index
sincronizat, `versiuni.json` v06 ↔ CACHE 10, vault). Smoke-test propriu (Playwright +
chrome-headless-shell): onboarding la pornire, heatmap fără derulare orizontală pe 320–1440px +
peisaj, 20 de medalioane, sărbătoare end-to-end (marcarea unei lecții deblochează „Prima lecție"),
zero erori de consolă. `tools/test-sw.mjs` (actualizat să sară onboarding-ul): prima instalare
fără reload, 60 de carduri sub SW, exact o reîncărcare la update, stabil, zero erori JS.

Echipa de agenți: **verificator-ui** — verdict curat, un singur defect minor (o țintă de 40px);
**verificator-cod** — niciun blocant, câteva constatări minore. Corectate și **reverificate
empiric**: ținta de 40px → pastilă neinteractivă; resetările granulare curăță acum și starea nouă
(`reset-progres`→`activ`, `reset-antren/teste/note`→contoarele `stats`); după `reset-tot` insignele
se re-sădesc, ca prima recâștigată să fie iar sărbătorită; onboarding-ul nu mai apare elevilor cu
progres anterior; copie „peste douăzeci" → „douăzeci"; ramură moartă în Setări eliminată. Raport
complet: [[Raport verificare v06]]. Nota de rulare: [[Jurnal 2026-08-23 — Motivație și progres v06]].

## 2026-08-24 — v07, „Mai multe lecții la fiecare materie"

**Cererea.** Două cereri legate: (1) „m-am uitat pe programa lecțiilor implementate la fiecare
materie, pe fiecare an, și mi se pare foarte săracă. Lecțiile sunt puține. Compară cu alte
aplicații de acest gen, vezi dacă au mai multe lecții și implementează și în aplicație, chiar
dacă durează mai mult." (2) Rafinare de proces: „iei doar un singur modul și îl termini, nu toate
odată. Unul singur, cap-coadă."

**Diagnoza.** Cele 60 de module aveau în medie **9,7 lecții** fiecare (206 capitole, 580 de lecții
în total) — de obicei un singur capitol pe semestru. Aplicațiile serioase de studiu pentru bac
acoperă programa mult mai fin: mai multe teme pe semestru, fiecare cu recapitulare proprie. Lipsa
nu era de *sistem* (cardurile, testele, tezele, repetiția eșalonată existau), ci de *acoperire*.

**Ce s-a făcut.** Fiecare modul a fost **extins aditiv**: s-au adăugat 2–3 capitole noi pe modul
(de regulă `c4/c5/c6`), cu lecții noi, fără să se atingă nimic din ce exista. Conținutul se scrie
în DSL-ul text din `data/sursa/*.txt` și se compilează cu `tools/text-in-modul.mjs`; fiecare lecție
nouă vine cu rezumat, idei-cheie, termeni, carduri și grilă, iar ambele teze semestriale au primit
întrebări în plus, ancorate pe materialul nou.

| | Înainte | După |
|---|---|---|
| Module | 60 | 60 |
| Capitole | 206 | **412** |
| Lecții | 580 | **1152** |
| Carduri | 2320 | **4608** |
| Întrebări de lecție | 2320 | **4608** |
| Întrebări de teză | 1294 | **1942** |

**Proces — un modul, cap-coadă.** După feedbackul din a doua cerere, restul modulelor s-au făcut
**unul câte unul**: pentru fiecare — editarea sursei (capitole + teze), `text-in-modul`, verificarea
aditivității, `verifica-continut`, regenerarea indexului, commit, push. Nu s-a trecut la modulul
următor înainte ca cel curent să fie complet și împins. Ultimul închis: `stiam-12` (9 → 16 lecții).

**Aditivitatea, garantată mecanic.** Un verificator scris pentru rulare
(`scratchpad/verifica-aditiv.mjs`) compară fiecare modul cu un snapshot al stării inițiale și
respinge orice lecție, capitol sau întrebare de teză **veche** modificată sau ștearsă — acceptă
doar adăugiri. Verdict final pe tot setul: **580 vechi + 572 noi = 1152, tot ce era vechi
neschimbat.** Așa, elevii care aveau deja progres pe lecțiile vechi nu pierd nimic; lecțiile noi
apar pur și simplu lângă ele.

**Meta.** `CACHE` v10→**v11** (fișiere publicate schimbate: modulele și indexul). *Nu* s-a atins
`?v=` din `index.html`/`SHELL`, fiindcă `app.css`/`app.js` au rămas neschimbate. `data/versiuni.json`:
intrare nouă v07 (cache 11), scrisă pentru elev, `curenta`→„07".

**Verificare.** Bateria locală trece integral: JSON valid pe toate modulele + index, `verifica-continut`
(60 module, 1152 lecții, structură validă), index regenerat și sincronizat, `versiuni.json` v07 ↔
CACHE 11, `node --check` pe JS, CSS, vault. `test-sw.mjs`: ciclul de update cu SW activ — exact o
reîncărcare la trecerea pe v11, 60 de carduri, zero erori. Smoke propriu de conținut (Playwright):
84 combinații rută × lățime × temă pe modulele mari — fără derulare orizontală, conținut randat.

**Echipa de agenți.** `verificator-ui` — verdict curat, 154 de capturi (320–1440 + peisaj, ambele
teme, 11 rute): zero derulare orizontală, zero ținte sub 44px, zero overflow; separarea pe semestre
(riscul principal al listelor lungi) — corectă, aplicația grupează capitolele pe semestru indiferent
de ordinea din fișier. `verificator-cod` — curat pe blocante, o constatare reală neblocantă:
**întrebări duplicate în interiorul unor teze** (10 perechi în 7 module: comunism-13, filosofie-13,
geografie-12, geografie-13, religie-12, religie-13, romana-12). Cauza: la extinderea tezelor am
adăugat, în câteva cazuri, o întrebare care repeta una deja existentă în aceeași teză.

**Corecția.** Fiecare a doua apariție (cea adăugată de mine) a fost înlocuită cu o întrebare nouă,
distinctă, din materialul aceluiași modul — întrebarea veche (prima apariție) rămâne neatinsă, deci
aditivitatea se păstrează. Detector propriu pe toate cele 60 de module: **0 perechi duplicate** după
corecție; aditivitatea reconfirmată (580 vechi neschimbate). În plus, am **întărit validatorul**:
`verifica-continut.mjs` respinge acum enunțurile de teză identice (clasa de defect, nu doar
instanța), regulă care ar fi prins problema în CI. Nota de rulare: [[Jurnal 2026-08-24 — Mai multe lecții v07]].

## 2026-08-25 — T1, „Plasă de siguranță: teste comportamentale"

**De ce.** CI-ul verifica structură și sintaxă (JSON valid, `node --check`, acolade CSS), dar nu
*comportament*. Un refactor putea rescrie tăcut morfologia răspunsurilor sau programarea eșalonată cu
toate verificările verzi. T1 din foaia de parcurs închide gaura, în etosul proiectului: **zero
dependențe, zero build** — doar `node --test` din Node.

**Cum, fără să atingem fișierul livrat.** `app.js` e un IIFE fără exporturi. Modificarea lui ar fi
cerut bump de `CACHE` + `?v=` + reverificare UI — cost pe care T1 nu-l justifică. Soluția e un
**shim de test** în `tools/test-comportament.mjs`: fișierul citește `assets/app.js` ca text, îi pune
la dispoziție un DOM minim (stub prin `node:vm`) și, chiar înainte de `})();`, injectează **o
singură linie** care predă funcțiile deja definite unei funcții-capcană din gazdă. Rulează astfel
**exact codul livrat**, nu o copie rescrisă de mână, iar `app.js` de pe disc rămâne **neatins, octet
cu octet**. Prin urmare: **fără bump de `CACHE`/`?v=`**, fără intrare în `versiuni.json` (nimic nu se
schimbă pentru elev — e o plasă internă de inginerie).

**Ce acoperă (32 de teste, în ordinea riscului din foaia de parcurs).**
- `normaliz` / `distanta` / `faraArticol` / `raspunsPotrivit` — morfologia românească: ambele forme
  de „ț" (virgulă și cedilă) → aceeași normalizare; toleranța de o literă doar la cuvinte ≥5;
  forma articulată acceptată în ambele sensuri; răspuns gol niciodată corect; plus o **limită
  cunoscută** documentată (articolul se scoate doar de pe ultimul cuvânt → „statul de drept" ≠
  „stat de drept").
- `programeaza` (SM-2 simplificat) — intervale 1/2/3, ușurința mărginită la [130, 280], intervalul la
  365 de zile, răspunsul greșit care resetează și readuce elementul în aceeași sesiune, scrierea
  înapoi în stare.
- `sanitizeaza` — intrare non-obiect → stare goală validă; filtrarea element-cu-element a lui `antren`
  (bug-ul istoric „n.toFixed is not a function"); `note` cu `n` numeric obligatoriu (nota 0 se
  păstrează, `null` se aruncă); `activ` doar cu chei-dată; migrarea v05→v06 din `zile`; insignele
  sădite vs. nesădite; `data-tema=banana` → implicit.
- `pct` — procent rotunjit și garda `Math.max(1, b)` care ține scorul unui test gol la 0, nu la NaN.

**Dovada că nu-s vacue.** Patru bug-uri injectate în **copii** din scratchpad (niciodată în `app.js`
real), rulate prin `STIINTE_APP_JS=<copie> node --test`: garda `pct` scoasă → pică testul „NaN";
plafonul de interval scos → pică „365 de zile"; ieșirea scurtă din `distanta` schimbată → pică
„distanta"; regexul din `faraArticol` neutralizat → pică „faraArticol" + „forma articulată". Pe
fișierul real: **32/32 verzi**. (`raspunsPotrivit` are o a doua cale de potrivire fuzzy, redundantă —
un singur prag stricat nu o dărâmă; de aceea bug-ul-dovadă a țintit `distanta`/`faraArticol`.)

**Cârlig în CI.** Pas nou în `.github/workflows/verificare.yml`, „Teste comportamentale (funcții pure
din app.js)", imediat după verificarea de sintaxă: `node --test tools/test-comportament.mjs`.

**Verificare.** Bateria locală integral verde: JSON valid (`data/*.json` + manifest), `node --check`
pe `app.js`/`sw.js`, `verifica-css.mjs`, `verifica_vault.py` (1388 note, 0 rupte, 0 orfane),
`node --test` 32/32. `git status`: **doar** fișierul nou de teste + editarea workflow-ului; niciun
fișier publicat atins.

## 2026-08-25 — T3.0, „Imagini explicative: sistem + pipeline + pilot istorie-9"

Punctul de intrare al epicului **T3** (vizuale explicative la lecție, cf. [[Strategie și foaie de
parcurs]]). Scop deliberat **minimal**, ca să nu explodeze scopul: se construiește capacitatea
cap-coadă (DSL → JSON → randare → stil → lint) și se **demonstrează pe un singur modul-pilot** cu
**exact 2 vizuale**. Roll-out-ul (T3.1+) e altă poveste, o materie pe sesiune.

**Decizia de design (confirmată): SVG inline, nu raster.** Motivele din foaia de parcurs țin —
zero-asset/offline, minuscul (text), se scalează perfect la 320px și, esențial, **se temează singur**
prin `currentColor` + tokenii din `app.css` (luminos / întunecat / contrast ridicat). Un raster n-ar
putea niciunul dintre acestea.

**Două tipuri, atât (bounding scope).**
- `cronologie` — repere pe o linie verticală: `{tip, titlu?, pasi:[{an, text}]}`.
- `schema` — blocuri etichetate legate cu săgeți: `{tip, titlu?, blocuri:[{eticheta, text?}], legaturi?:[[i,j]]}`.

**DSL (în `data/sursa/*.txt`, compilat de `tools/text-in-modul.mjs`).** Un bloc începe cu antetul
`[cronologie]`/`[schema]` (titlu opțional pe aceeași linie), urmat de elemente `~` și, la schemă, o
linie de legături `>`. Blocul ține până la prima altă directivă. Exemplu:

```
[cronologie] Lupta antiotomană a Țărilor Române
~ 1475 :: Ștefan cel Mare învinge la Vaslui (Podul Înalt)
[schema] Formarea limbii și a poporului român
~ Substrat geto-dac :: circa 160 de cuvinte și toponime
> 0-3, 1-3, 2-3
```

Compilatorul le adună în câmpul nou `vizual` al lecției (**listă de cel mult 2**). Markerele `[`, `~`,
`>` nu existau în DSL, deci nu intră în coliziune cu conținutul vechi. Elementele `~`/`>` se tratează
înainte de a închide blocul; orice altă directivă îl închide (`vizual = null`). Recompilarea sursei
**fără** nicio schimbare produce bytes identici cu înainte (schimbarea de compilator e neutrală la
serializare — verificat cu `diff`).

**Randare (`assets/app.js`, `viewLectie`).** Funcțiile `svgCronologie` / `svgSchema` / `vizualeHTML`
construiesc SVG-ul și îl injectează **după rezumat, înainte de „Idei-cheie"**. Reguli respectate:
- **XSS.** Tot textul dinamic — inclusiv `aria-label`, `<title>`, `<desc>` — trece prin `esc()`.
  Nicio interpolare neescapată (regula de aur a proiectului, lăudată la audit).
- **Accesibilitate.** `<svg role="img">` cu `aria-label` rezumativ + `<title>`/`<desc>`; internele nu
  sunt citite separat de cititoarele de ecran.
- **Fără overflow.** Textul se rupe în **pipeline** (`vizRupe`, greedy pe cuvinte, cu tăiere dură
  pentru un cuvânt mai lung decât linia), nu de browser — deci nimic nu depășește `viewBox`-ul (lat
  de 300 de unități), iar SVG-ul are `max-width:100%; height:auto`. Zero derulare orizontală, garantat.
- **Teme.** Culorile ies exclusiv din tokeni (`--ink`, `--brand`, `--accent`, `--surface-sunken`,
  `--hairline`); **niciun hex fix**. Un marker de săgeată cu `id` unic per vizual (`vz-sg-N`), ca două
  scheme pe aceeași lecție să nu împartă `id`.

Schema stivuiește blocurile pe verticală; legăturile adiacente sunt săgeți drepte, cele neadiacente
se rutează pe o **șină în marginea dreaptă** — suficient pentru tiparul „mai multe surse converg în
rezultat" (etnogeneza), fără motor de layout de graf.

**Stil (`assets/app.css`, secțiune nouă §18d).** Bloc mic, comentat, cu tokeni; `.vizual` resetează
marginea implicită de `<figure>`; `.vizual-svg{max-width:440px;margin-inline:auto}` (centrat pe
coloana lată de desktop, ca textul să nu se umfle). Override de contrast ridicat: liniile fine devin
cerneală, ca restul UI-ului.

**Lint (`tools/verifica-continut.mjs`).** Regulă nouă: `≤2 vizuale/lecție`, doar tipurile implementate,
câmpuri obligatorii prezente și nevide, legături cu indici în interval — **orice vizual stricat =
eroare de validare**. Dovadă empirică că regula chiar declanșează: pe o copie a `istorie-9` cu
vizuale malformate (tip necunoscut, schemă cu 1 bloc, 3 vizuale) validatorul a raportat exact acele
3 erori; pe conținutul bun, `OK`.

**Pilotul: `istorie-9` (Istorie, cl. a IX-a), pur aditiv.**
- `ist9-06` „Etnogeneza românească și romanitatea" → **schemă**: substrat geto-dac + strat latin +
  adstrat slav → limba și poporul român (legături `[[0,3],[1,3],[2,3]]`).
- `ist9-11` „Domnii și lupta antiotomană" → **cronologie**: Nicopole 1396, Belgrad 1456, Târgoviște
  1462, Vaslui 1475, unirea 1600.

**Aditivitate garantată mecanic.** Comparat modulul recompilat cu snapshotul dinainte: cele 24 de
lecții și cele 2 teze sunt neschimbate; **singura** diferență este câte o cheie `vizual` nouă la
`ist9-06` și `ist9-11` (66 de inserții, 0 ștergeri la nivel de `git`). Antetul și structura
capitolelor — identice.

**Versionare.** S-au atins fișiere publicate (JS/CSS/HTML + modul + index de conținut):
- `sw.js`: `CACHE` v11 → **v12**; lista `MODULE` neatinsă (id-uri de fișier neschimbate).
- `?v=` din `index.html` + `SHELL`: 10 → **12** (s-au schimbat `app.css`/`app.js`; ridicat direct la
  `N` = numărul CACHE, cf. regulii #4 — asta resincronizează și checkul CI `CACHE ↔ ?v=`, care cerea
  `?v == CACHE` și rămăsese roșu de la release-ul doar-date v07).
- `data/versiuni.json`: intrare nouă **v08 „Imagini explicative"** (cache 12), scrisă pentru elev;
  `curenta` → „08".
- `data/continut.json`: **neschimbat** — vizualele nu intră în index (nu schimbă titluri/contoare),
  deci regenerarea nu produce nicio diferență (index deja sincronizat).

**Verificare (toată bateria verde).** JSON valid (`data/*.json` + manifest); `node --check`
`app.js`/`sw.js`; `verifica-css`; `verifica-continut` (60 module, 1152 lecții); `verifica_vault`
(1388 note, 0 rupte, 0 orfane); `node --test` **32/32** (suita T1 neatinsă — funcțiile de vizual sunt
interne, necaptate). `test-sw.mjs` cu SW activ: **exact o reîncărcare** la trecerea pe v12, 60 de
carduri, **zero erori JS**. Verificare UI proprie (Playwright, headless): cele 2 lecții-pilot × 6
lățimi (320/360/390/768/1024/1440) + peisaj 844×390 × 3 teme (luminos/întunecat/contrast) = 42 de
combinații — **zero derulare orizontală**, SVG randat și încadrat în coloană peste tot; capturi
confirmă lizibilitatea în ambele teme. `git status`: doar fișierele așteptate.

**Echipa de verificare (independentă) + corecții.** `verificator-cod`: **CURAT** — a reprodus empiric
escaparea (payload-uri XSS neutralizate în titlu/an/etichetă/`aria-label`), aditivitatea (recompilarea
sursei vechi dă modul byte-identic), parserul care cade zgomotos la malformări și declanșarea lintului.
`verificator-ui`: **CURAT** — zero derulare orizontală / tăiere / ținte sub 44px pe 56 de combinații
(7 lățimi × 4 teme), cu două observații cosmetice, ambele corectate și **reverificate**:
**C1** — linia cronologiei era aproape invizibilă pe tema întunecată normală (`--hairline`, ~1,24:1) →
trecută pe `--ink-faint` (~3,5:1), vizibilă pe ambele teme; overrideul de contrast ridicat rămâne.
**C2** — anii cronologiei nu primeau albastrul de brand din cauza specificității (`.vizual-svg text`
bătea `.vz-an`) → regula ridicată la `.vizual-svg .vz-an`. Tot atunci am corectat **`?v=` 11 → 12**
(vezi Versionare) — constatare `verificator-cod`: altfel checkul CI `CACHE ↔ ?v=` rămânea roșu.

## 2026-08-25 — T2, „Raportează o greșeală"

Din foaia de parcurs, task-ul **T2** (pilonul „încrederea în conținut", alimentează T5): un elev
trebuie să poată semnala un fapt greșit **direct** din lecție și de la rezultatul testului. Scop mic,
strict aditiv — nimic din fluxurile existente (citit, test, setări, export) nu se schimbă.

**Ce s-a făcut.**
- **Buton discret pe lecție** (`viewLectie`): „Raportează o greșeală", jos în coloana laterală, sub
  „Lecția următoare". Deschide o foaie modală (reutilizează `.scrim`/`.sheet` de la onboarding) cu un
  `<select>` de motive („Fapt greșit", „Greșeală de scriere", „Întrebare sau răspuns greșit",
  „Altceva") + un `<textarea>` opțional de detalii. La trimitere salvează raportul și arată un toast
  „Mulțumim — raportul a fost salvat.".
- **Raport de la rezultatul testului** (`rezultatTest`): fiecare întrebare din lista „De recitit"
  primește un link discret „Raportează întrebarea", care deschide același formular și **captează textul
  întrebării** (plus materia/lecția) în context.
- **Setări → Datele mele:** rând care arată „N rapoarte salvate", cu acțiuni de **export** dedicat și de
  **ștergere** (cu confirmare). Când nu există rapoarte, un rând informativ liniștit în loc.

**Stocare.** `state.rapoarte` = tablou de `{id, tip:'lectie'|'intrebare', refId, motiv, nota, data,
context}` (`context` = etichetă lizibilă — materie + titlu de lecție / textul întrebării — ca cel care
întreține conținutul să găsească rapid locul). `data` = `Date.now()`. `sanitizeaza` a fost extins
**aditiv**: câmp absent ⇒ rămâne `[]` (deci copiile vechi se încarcă neschimbat), intrare stricată se
aruncă element-cu-element (tip invalid, non-obiect), câmpurile se coerc și se plafonează, iar lista se
taie la ultimele 200 (ostilitate din import). `uid()` a fost mutat **înaintea** lui `sanitizeaza` și a
lui `state = load()`, ca rezerva de id lipsă să nu cadă în zona moartă temporală.

**Export.** Copia completă (`Setări → Salvează o copie`) serializează tot `state`, deci include acum și
`rapoarte` — fără nicio schimbare de format. Exportul dedicat („Exportă rapoartele de greșeli")
scoate `{aplicatie, exportat, rapoarte}` printr-un mic helper `descarcaJSON` (același drum Blob/anchor
ca exportul existent, refactorizat o dată, folosit de amândouă). **Fără e-mail, fără `mailto`, fără
nicio trimitere în rețea** — aplicația e publică; totul rămâne local + export manual.

**Accesibilitate.** Formularul e `role="dialog"` + `aria-modal="true"` + `aria-labelledby`; `<label
for=…>` legat corect de select și textarea. La deschidere focusul trece pe primul control, la închidere
revine pe declanșator; **Tab ciclează în interior** (capcană de focus cu ieșire mereu disponibilă),
**Escape** / „Renunță" / atingerea fundalului o închid (scrimul, la `--z-sheet`=30, acoperă tabbarul de
la `--z-chrome`=20, deci atingerea „în afară" nu poate naviga tăcut). Ținte de atingere: linkul discret
44px, `<select>` 48px, `.btn` 50px, textarea 84px. Tot textul dinamic trece prin `esc()`. Toastul de
confirmare e `role="status"` și **nu** depinde de setarea „Sărbători" (e feedback, nu felicitare).

**Versionare.** S-au atins fișiere publicate (JS/CSS/HTML):
- `sw.js`: `CACHE` v12 → **v13**; lista `MODULE`/`SHELL` neatinsă în afară de `?v=`.
- `?v=` din `index.html` (2 linii) + `SHELL` din `sw.js` (2 linii): 12 → **13** = numărul CACHE
  (regula #4; CI cere `?v == CACHE`).
- `data/versiuni.json`: intrare nouă **v09 „Raportează o greșeală"** (cache 13), scrisă pentru elev;
  `curenta` → „09". `data/continut.json` neschimbat (regenerarea nu produce diferență).

**Verificare (toată bateria verde).** JSON valid (`data/*.json` + manifest); `node --check`
`app.js`/`sw.js`; `verifica-css` (2186 linii, acolade echilibrate); `verifica-continut` (60 module,
1152 lecții); `verifica_vault` (1389 note, 0 rupte, 0 orfane); checkul CI `CACHE ↔ ?v=` **OK v13**;
`construieste-index` fără diferențe (index deja sincronizat). `node --test` **33/33**: suita T1 intactă
plus **un test nou** pentru sanitizarea `rapoarte` (absent → `[]`, non-array → `[]`, intrări stricate
aruncate, id lipsă sintetizat, `data` negativă → 0). Testul are dinți: pe o copie cu blocul `rapoarte`
scos din `sanitizeaza` **pică** (`not ok`), pe fișierul curent trece. `test-sw.mjs` cu SW activ: **exact
o reîncărcare** la trecerea pe v13, 60 de carduri, **zero erori JS**.

**Verificare UI proprie (Playwright, headless, 320px, luminos + întunecat).** Formularul se deschide și
din lecție, și de la rezultatul testului; **zero derulare orizontală**; toate țintele ≥44px; focusul
ajunge pe `#rap-motiv` la deschidere; **Escape** închide; trimiterea **salvează** în stare (verificat
în `localStorage`) și arată **toastul** de confirmare; titlul dialogului de întrebare = „Raportează
întrebarea". Capturi în ambele teme confirmă lizibilitatea și încadrarea. `git status`: doar fișierele
așteptate (`app.js`, `app.css`, `sw.js`, `index.html`, `data/versiuni.json`, `tools/test-comportament.mjs`),
zero artefacte (symlink-ul temporar `node_modules/playwright` și serverul local, curățate).

**Echipa de agenți (gate-ul de merge) + o corecție.** `verificator-cod`: **CURAT** — a trasat fiecare
drum al datelor de raport spre DOM (dialog, toast, setări): tot prin `esc()`, iar câmpurile libere
(`nota`/`motiv`) nu se randează nicăieri, doar se serializează la export (Blob, nu DOM) — XSS închis.
A confirmat sanitizarea aditivă (plafon 200 = ultimele), lipsa TDZ, zero `mailto`/e-mail, fluxuri
intacte, versiuni sincrone (CI `CACHE v13 ↔ ?v=13`). `verificator-ui`: **CURAT** pe 24 de combinații
(5 lățimi + peisaj × 4 teme) + rezultatul testului + setări — zero derulare orizontală, ținte ≥44px,
contrast ≥AA, focus vizibil. **Corecție** a unui defect real (neblocant) găsit de `verificator-cod`:
dialogul rămânea orfan peste ecranul nou dacă utilizatorul naviga (Back din browser) cu foaia deschisă
→ am adăugat un ascultător `hashchange` care închide foaia (simetric cu teardown-ul de `keydown`).
Rămân, ca *polish* de accesibilitate viitor (tipar preexistent, partajat cu onboarding-ul, deci nu se
repară doar în T2): fundal `inert` sub modal, suprapunerea a două toasturi, bordura câmpurilor în
contrast-ridicat (WCAG 1.4.11, ≥3:1).

## 2026-08-26 — v10, supra-tema „Auroră"

**Cerința.** Un pachet de design extern (`HANDOFF.md` + `assets/tema-aurora.css` gata scris): paletă
mai spectaculoasă pe ambele teme, mai multă transluciditate și efecte de mișcare, **fără** a rescrie
arhitectura din `app.css`. Sarcina — traducerea lui în repo, în stilul repo-ului.

**Abordarea.** Aurora e un **strat de tokeni**, nu un redesign. Se încarcă în `index.html` imediat după
`app.css` și rescrie doar paleta/sticla/relieful. Zero reguli de componentă rescrise, cu o singură
excepție documentată (§4.8): gradientele de brand trec de la două trepte la trei (intră `--brand-3`,
cyan), iar o declarație în două trepte nu poate folosi un token nou. Regula „adâncimea aparține
conținutului, transparența aparține cadrului" rămâne intactă.

- **Luminos „porțelan de iris":** `--surface-base #F7EEE2 → #F4F1FC`, brand `#234B6F → #5B4BD6` (iris),
  accent `#C8901E → #F2A118` (ambră), `--brand-3 #1FA8C4` (cyan) doar în gradiente.
- **Întunecat „auroră de indigo":** `#141F33 → #0D1226`, brand `#A99BFF`, accent `#FFC24B`, cyan `#4FD8E8`.
- **Sticlă:** alfa `.62/.58 → .42/.34`, blur `20/22 → 30/32px`, saturație `→200%`, muchii bicolore.
- **Neumorfism** recalculat pe noile suprafețe (umbră de iris, nu gri); **mesh** pe ambră/iris/cyan.
- **Efecte opt-in** (doar prin clase noi): `aur-sheen` (reflex specular pe carduri hero), `aur-live`
  (shimmer în bare), `aur-numar` (cifră-erou în degrade), `aur-jump` (turtirea indicatorului de tab),
  `aur-island` (toast tip Dynamic Island).

**Ce s-a atins.** NOU `assets/tema-aurora.css`; `index.html` (link temă + `theme-color`/bootstrap pe
noile suprafețe, `?v=13→14`); `app.js` (clase opt-in: `aur-sheen` pe „Astăzi" și „Antrenamentul de azi",
`aur-live` pe bara „Astăzi" și de rezultat, `aur-numar` pe titlul de rezultat, turtirea `.tab-ind` cu
reflow, `aur-island` pe toasturi); `sw.js` (`CACHE v13→v14`, `SHELL` cu `?v=14` + `tema-aurora.css`
precache-uit); `data/versiuni.json` (intrare nouă v10 pentru elev, `curenta→"10"`).

**Corecții față de pachet (înainte de merge).** (1) Regula de mișcare redusă forțată din Setări folosea
pseudo-elemente într-un `:is()` — invalid, ignorat de parser: efectele NU s-ar fi oprit la
`[data-miscare="redusa"]` fără preferință de sistem. Rescrisă cu selectoare separate. (2) Heatmap-ul
(Progres) rămăsese pe rampa veche (nisip → bleumarin): `--hm-0..4` re-declarați pe iris, cinci trepte
distincte, ambele teme (confirmat empiric). (3) `aur-numar` (nota de la rezultat = text informativ) avea
contrast sub 3:1 pe luminos: gradientul devine per-temă (`--aur-numar-grad`) — pe luminos
iris/ambră-text/smarald (6,4 · 8,1 · ~4,8 : 1), pe întunecat culorile vii se păstrează. (4) `aur-breathe`
nu rula (`.view.stagger .enter` din app.css, specificitate 0,3,0, bate `.aur-breathe` 0,1,0); a o forța
ar fi stricat animația de intrare — clasa scoasă din markup, regula CSS rămâne ca utilitar opt-in cu notă
de avertizare.

**Verificare (toată bateria verde).** JSON valid; `node --check` `app.js`/`sw.js`; `verifica-css` pe
`app.css` (2186) și `tema-aurora.css` (444); `verifica_vault` (0 rupte); comportament **33/33**;
sincronizare `CACHE v14 ↔ ?v=14 ↔ versiuni.json` OK; `test-sw.mjs` cu SW activ — **o singură reîncărcare**
pe v14, 60 carduri, zero erori JS, fundal `#F4F1FC` servit prin SW. **`verificator-cod`**: niciun
blocant; a găsit heatmap-ul și contrastul `aur-numar` (corectate). **`verificator-ui`** (Playwright,
69 capturi, 320–1440 + peisaj × 2 teme × 3 ecrane + a11y): zero derulare orizontală, ținte ≥44px,
sclipirea nu iese din card, cele trei moduri de accesibilitate corecte (opacizare, linii, oprirea
mișcării fără deplasare de layout); a găsit `aur-numar` (corectat) și `aur-breathe` care nu rula (scos).
Toate constatările corectate și reverificate înainte de merge.

## 2026-09-06 — v11, Biologie completă pentru Bacalaureat (clasele IX – XIII)

**Cerința.** Adaptarea conținutului pentru profil real și pregătirea examenului de Bacalaureat la disciplina Biologie: integrarea întregii materii din clasele a IX-a până la a XIII-a (atât Biologie vegetală și animală, cât și Anatomie, fiziologie umană, genetică și ecologie).

**Ce s-a făcut.**
1. **Conținut adăugat:** Am creat de la zero modulele `biologie-11.txt`, `biologie-12.txt` și `biologie-13.txt` în DSL-ul aplicației:
   - Clasa a XI-a: 11 lecții detaliate de anatomie și fiziologie umană (sistem nervos, analizatori, glande endocrine, locomotor, nutriție, respirație, circulație, excreție, reproducere), 44 întrebări grilă, 16 de teză și 44 carduri.
   - Clasa a XII-a: 8 lecții de genetică moleculară (acizi nucleici, sinteza proteinelor, legile mendeliene, mutații, inginerie genetică) și ecologie generală, 32 întrebări de lecție, 16 de teză și 32 carduri.
   - Clasa a XIII-a: 6 lecții aplicative de pregătire intensivă de Bacalaureat (rezolvarea problemelor de monohibridare, dihibridare, grupe sanguine, calcul ADN/ARN, corelații fiziologice în efort, imunitate, tehnica Subiectului I, II și III / mini-eseu).
   - Clasele a IX-a și a X-a: marcat `bac: da` pentru ambele filiere de examen.
2. **Arhitectură & date:** Actualizat `data/curriculum.json` cu Biologie la clasele 11-13 și marcat la proba de Bacalaureat. Reconstruit indexul `data/continut.json` (63 module, 1.177 lecții, 4.708 carduri, 6.698 întrebări).
3. **PWA & Cache:** Bump `CACHE` în `sw.js` de la `stiinte01-v14` la `stiinte01-v15`, sincronizat `?v=15` în `index.html` și adăugat jurnalul de versiune v11 în `data/versiuni.json`.
4. **Obsidian Vault:** Regenerat integral prin `tools/graphify.py` (1.425 note, 9.677 wikilink-uri), validat cu `tools/verifica_vault.py`.

## 2026-09-06 — v12, Limba și literatura română completă și actualizată pentru Bacalaureat (clasele IX – XIII)

**Cerința.** Structurarea riguroasă a întregii materii de Limba și literatura română (clasele a IX-a până la a XIII-a / finalul liceului), aliniată cu cerințele actuale ale examenului de Bacalaureat din anii recenți.

**Ce s-a făcut.**
1. **Conținut actualizat & structurat:**
   - Am verificat și aprofundat modulele de română (`romana-9`, `romana-10`, `romana-11`, `romana-12` și `romana-13`), însumând 100 de lecții structurate complet (rezumate, termeni, carduri de memorare, întrebări grilă, teze).
   - În `romana-13.txt` am detaliat cerințele și structura recentă a probei scrise:
     * **Subiectul I:** Partea A (cele 5 cerințe punctuale de câte 6 puncte, sensul contextual al secvențelor, justificarea prin citat) și Partea B (algoritmul textului argumentativ de min. 150 de cuvinte, conectori logici, exemplu din textul-suport + exemplu cultural/personal).
     * **Subiectul al II-lea (10 puncte):** Cele 4 tipare recurente din sesiunile recente de Bacalaureat: (1) perspectiva narativă (obiectivă vs. subiectivă), (2) rolul didascaliilor în textul dramatic, (3) relația dintre ideea poetică și mijloacele artistice, (4) modalitățile de caracterizare a personajului (directă și indirectă).
     * **Subiectul al III-lea (30 puncte):** Prezentarea completă a autorilor canonici (marii clasici, moderniști, interbelici, postbelici, critici literari), distincția profil real (temă și viziune, particularități) vs. profil umanist (relația dintre două personaje), baremul de redactare (12p) și pragul minim de 400 de cuvinte.
2. **Date & PWA:**
   - Recompilat cu `tools/text-in-modul.mjs` și validat cu `tools/verifica-continut.mjs`.
   - Reconstruit indexul `data/continut.json` și lista de precache cu `tools/construieste-index.mjs`.
   - Bump versiune la **v12**, `CACHE` în `sw.js` la `stiinte01-v16`, sincronizat `?v=16` în `index.html` și adăugat jurnalul de versiune în `data/versiuni.json`.
3. **Obsidian Vault:** Regenerat complet prin `tools/graphify.py` (1.426 note, 9.681 wikilink-uri), validat cu `tools/verifica_vault.py` (fără legături rupte).

## 2026-09-07 — v13, Limba modernă 1 (Engleză) de la zero (gimnaziu VI–VIII) la Bacalaureat Proba B (IX–XIII)

**Cerința.** Consolidarea completă a materiei de Limba Engleză pentru toate nivelurile liceale (clasele a IX-a până la a XIII-a), oferind o punte solidă pentru elevii fără bază din gimnaziu (clasele VI–VIII) și ducând conținutul până la nivelul de competențe B2 cerut la Bacalaureat (Proba B).

**Ce s-a făcut.**
1. **Punte de pornire de la zero (bază gimnazială integrată în clasa a IX-a):**
   - Fonetică & ortografie: 26 litere, peste 40 de foneme (`th` [θ]/[ð], `sh`, `ch`, vocale lungi `ee`/`ea`, `oo`), regulile fonetice pentru citirea terminației de trecut `-ed` (/ɪd/ după t/d, /t/ după consoane surde, /d/ după vocale și consoane sonore).
   - Verbele fundamentale: `to be` și `to have got` pe toate formele (afirmativ, negativ, interogativ prin inversiune), precum și lista celor mai frecvente verbe neregulate (be, do, have, go, see, get, make, take, come, say etc.).
   - Tiparele timpurilor de bază: Present Simple (cu -s la pers. a III-a și auxiliarul do/does) vs Present Continuous (am/is/are + verb-ing) și regulile verbelor de stare.
   - Gramatică esențială: pronume subiect (I, you, he...) vs pronume complement/obiect (me, you, him...), adjective posesive (my, your...) vs pronume posesive (mine, yours...), substantive numărabile vs nenumărabile, determinanți (`some`, `any`, `much`, `many`, `a few`, `a little`) și formula de aur a întrebărilor Q-A-S-V.
2. **Standardul complet pentru Bacalaureat Proba B (clasa a XIII-a):**
   - Subiectul 1 (80–100 de cuvinte): text funcțional informal (scrisoare/e-mail către un prieten, formule specifice de deschidere și încheiere, nivel A1–B1).
   - Subiectul 2 (180–200 de cuvinte): eseu de opinie / text argumentativ academic (registru formal, fără contracții, conectori de argumentare, nivel B2).
   - Detalierea baremului oficial de corectare al Ministerului Educației pe cele 4 criterii (Task achievement, Cohesion & Organization, Vocabulary, Grammatical accuracy) și descriptorii CEFR (A1, A2, B1, B2).
3. **Validare, PWA & Obsidian Vault:**
   - Compilat modulele cu `tools/text-in-modul.mjs` (0 erori).
   - Validat structura cu `tools/verifica-continut.mjs` (63 module, 1.177 lecții).
   - Reconstruit indexul `data/continut.json` și lista de precache prin `tools/construieste-index.mjs`.
   - Bump versiune la **v13**, actualizat `data/versiuni.json`, crescut cache la `stiinte01-v17` în `sw.js` și `index.html`.
   - Regenerat vaultul Obsidian cu `tools/graphify.py` și adăugat jurnal dedicat în vault.

# Jurnal 2026-09-07 — v14, Limba modernă 2 (Franceză) de la zero (gimnaziu VI–VIII) la Bacalaureat Proba B (IX–XIII)

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]]

## Cerința

Consolidarea completă a materiei de Limba Franceză pentru toate nivelurile liceale (clasele a IX-a până la a XIII-a), oferind o punte solidă pentru elevii fără bază din gimnaziu (clasele VI–VIII) și ducând conținutul până la nivelul de competențe B2 cerut la Bacalaureat (Proba B).

## Ce s-a implementat

1. **Punte de pornire de la zero (bază gimnazială integrată în clasa a IX-a):**
   - Fonetică & alfabet: 26 de litere, 5 semne diacritice (accent aigu, grave, circonflexe, cédille, tréma), regula consoanelor finale mute și a consoanelor sonore CaReFuL.
   - Valori fonetice fixe: „ou” [u], „au/eau” [o], „ai/ei” [ɛ], „oi” [wa], „ch” [ʃ], „gn” [ɲ], vocalele nazale (an, on, in, un) și mecanismul de liaison sonoră (les amis -> [lezami]).
   - Verbele fundamentale: conjugarea completă a verbelor neregulate uzuale (être, avoir, aller, faire, venir, prendre, pouvoir, vouloir), expresiile idiomatice cu „avoir” (avoir faim/soif/chaud/peur/sommeil/16 ans) și distincția fonetică esențială „ils ont” [ilzɔ̃] vs „ils sont” [ilsɔ̃].
   - Mecanismul negației: ne... pas/plus/jamais/rien/que și regula de aur a transformării articolelor partitive/nehotărâte în „de” (je ne bois pas de café).
   - Cele 3 registre interogative: familiar (intonație), standard (est-ce que) și formal (inversiune verb-subiect).

2. **Standardul complet pentru Bacalaureat Proba B (clasa a XIII-a):**
   - Subiectul 1 (80–100 de cuvinte): text funcțional informal/semi-formal (scrisoare/e-mail prietenesc, formule specifice de deschidere și încheiere, nivel A1–B1).
   - Subiectul 2 (160–180 de cuvinte): eseu de opinie / text argumentativ academic (registru formal, conectori logici, structură pe paragrafe, nivel B2).
   - Structura completă a celor 4 probe: înțelegerea orală (compréhension orale), înțelegerea scrisă (compréhension des écrits), producerea scrisă (production écrite) și producerea/interacțiunea orală (production orale).

3. **Validare, PWA & Obsidian Vault:**
   - Compilat modulele cu `tools/text-in-modul.mjs` (0 erori).
   - Validat structura cu `tools/verifica-continut.mjs` (63 module, 1.177 lecții).
   - Reconstruit indexul `data/continut.json` și lista de precache prin `tools/construieste-index.mjs`.
   - Bump versiune la **v14**, actualizat `data/versiuni.json`, crescut cache la `stiinte01-v18` în `sw.js` și `index.html`.
   - Regenerat vaultul Obsidian cu `tools/graphify.py` și adăugat jurnal dedicat în vault.

# Jurnal 2026-09-07 — v15, Liceul Tehnologic „Ion Creangă” Târgu Neamț (Profil Real), emblemă nouă regală, Istorie și Geografie Bacalaureat

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]] · [[Școala|Liceul Tehnologic „Ion Creangă”]] · [[Parcurs școlar]]

## Cerințele utilizatorului

1. **Date instituționale:** Actualizarea liceului și profilului în aplicație: elev la **Liceul Tehnologic „Ion Creangă” din Târgu Neamț, profil real**.
2. **Emblema aplicației:** Schimbarea emblemei aplicației într-una foarte elegantă, modernă și atractivă (actualizarea iconițelor PWA de 192x192, 512x512, maskable și afișarea ei în interfață).
3. **Istorie și Geografie:** Completarea și consolidarea materiilor Geografie și Istorie în aplicație în același stil detaliat și riguros folosit pentru limbile moderne (bază solidă de la zero/gimnaziu până la cerințele integrale de Bacalaureat).

## Ce s-a implementat

### 1. Datele liceului și profilul real
- Actualizat `data/curriculum.json`:
  - Școala: **Liceul Tehnologic „Ion Creangă”**, localitatea **Târgu Neamț**, județul Neamț, Bulevardul Ștefan cel Mare nr. 64, telefon 0233 790 357, site `https://liceulioncreangatgneamt.ro/`.
  - Parcurs: **Filiera Tehnologică / Teoretică**, **Profil Real**, forma frecvență redusă / zi, clasele IX–XIII.
- Actualizat `README.md`, `vault/00-Index/Științe Sociale — MOC.md`.
- Regenerat automat notele de curriculum din vault prin `tools/graphify.py`: `vault/Curriculum/Școala.md` și `vault/Curriculum/Parcurs școlar.md`.

### 2. Emblema oficială a aplicației — design regal, elegant și atractiv
- Generat blazonul heraldic modern pe fundal safir și albastru de miezul nopții, cu ramă dublă aurită:
  - **Cartea deschisă a cunoașterii** (înțelepciune, literatură, patronul spiritual Ion Creangă).
  - **Orbitele atomului și nucleul radiant** (simbolul profilului real: științe ale naturii, fizică, chimie, biologie, tehnologie).
  - **Condeiul de aur și Steaua excelenței** în 5 colțuri.
  - **Cununa de lauri** aurită și panglica heraldică „LICEUL TEHNOLOGIC ION CREANGĂ · REAL”.
- Create fișierele de iconițe PWA: `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png` (cu zonă de siguranță optimizată) și `assets/emblema.png`.
- Creată sursa vectorială `icons/icon-source.svg`.
- Adăugat stilul CSS `.emblema-scoala` și `.scoala-card-row` în `assets/tema-aurora.css` și integrată emblema direct pe ecranul **Acasă** (în cardul principal de progres), pe ecranul **Plan de învățământ** și în subsolul ecranului de **Setări / Despre**.

### 3. Consolidare Istorie: De la zero la Bacalaureat Proba E.c
- **Clasa a IX-a (`data/sursa/istorie-9.txt` › `ist9-01`):** Ghid complet de la zero privind timpul istoric și cronologia: calculul secolelor și mileniilor, axa timpului (lipsa anului 0, numărarea descrescătoare î.Hr. și crescătoare d.Hr.), tipologia completă a izvoarelor (nescrise: arheologice, numismatice, cartografice, orale; scrise: epigrafice, cronici, letopisețe, hrisoave, presă), critica externă (autenticitate) și critica internă (credibilitate), periodizarea clasică a istoriei.
- **Clasa a XIII-a (`data/sursa/istorie-13.txt` › `ist13-08`, `ist13-09`):** Metodologia completă de examen:
  - Subiectele I și II: identificare pe text-suport, șablonul relației cauză–efect cu conectori logici obligatorii („deoarece/întrucât” și „drept urmare/prin urmare”), formularea punctului de vedere argumentat susținut de două informații distincte din sursă.
  - Subiectul III: structura eseului de 400 de cuvinte și sinteza celor 7 mari teme de Bacalaureat (Romanitatea românilor, Autonomii locale și instituții medievale, Spațiul românesc între diplomație și conflict, Statul român modern, Constituțiile României, Totalitarism vs. democrație în secolul XX, România în Războiul Rece și integrarea euroatlantică).

### 4. Consolidare Geografie: De la zero la Bacalaureat Proba E.d
- **Clasa a IX-a (`data/sursa/geografie-9.txt` › `geo9-01`, `geo9-02`):** Ghid complet de la zero: coordonate geografice (latitudine 0°–90° N/S pornind de la Ecuator, longitudine 0°–180° E/V pornind de la Meridianul Greenwich), scara hărții numerică și grafică, mișcarea de rotație, forța Coriolis și calculul fusurilor orare (15° longitudine = 1 oră), mișcarea de revoluție și momentele astronomice cheie (solstițiul de vară 21 iunie, echinocțiul de toamnă 23 septembrie, solstițiul de iarnă 21/22 decembrie, echinocțiul de primăvară 21 martie).
- **Clasa a XIII-a (`data/sursa/geografie-13.txt` › `geo13-18`, `geo13-20`):** Metodologia completă de examen:
  - Algoritmul comparativ simetric de barem pentru relief (geneză/orogeneză, roci, altitudini, fragmentare/orientare, relief specific glaciar/carstic/vulcanic) și climă (etaj climatic, influențe, temperaturi medii, precipitații anuale, vânturi).
  - Toate formulele exacte de calcul pentru Subiectul III: Densitatea populației ($D = P / S$), Bilanțul natural ($SN = N - M$), Rata sporului natural ($sn = n - m$), Bilanțul migratoriu ($SM = I - E$), Bilanțul total ($ST = SN + SM$), Amplitudinea termică ($A_t = T_{\max} - T_{\min}$) și panta/căderea râului.

### 5. Verificare, Versionare (v15) & Precache
- Toate sursele compilate cu `node tools/text-in-modul.mjs`.
- Verificat conținutul cu `node tools/verifica-continut.mjs` (63 module, 1177 lecții valide).
- Sincronizat indexul și precache-ul cu `node tools/construieste-index.mjs`.
- Actualizat versiunea la **v15** în `data/versiuni.json`.
- Bump cache la **stiinte01-v19** în `sw.js` (incluzând `./assets/emblema.png`) și query string `?v=19` în `index.html`.
- Regenerat vaultul Obsidian prin `python tools/graphify.py`.

---

## 2026-09-07 — Faza 16: Tastatură Matematică Nativă, Ciornă, Video Explicativ cu profesor și Tablă Pas-cu-Pas (v16)

**Obiectiv primit:** Rezolvarea nevoilor esențiale pentru studiul individual al matematicii la profilul real fără profesor:
1. O tastatură matematică nativă cu care elevul să poată scrie formule și exerciții și să le rezolve în cadrul testelor și antrenamentelor, accesibilă nativ direct din aplicație.
2. Un video explicativ dedicat pentru fiecare lecție de matematică.
3. Explicații în pași mici, fără să se sară peste vreun pas intermediar („fără pași omiși”).

### 1. Tastatură Matematică Nativă & Ciornă Retractabilă
- Creată componenta nativă accesibilă prin butonul `[ √x ]` din bara de sus, precum și din interiorul testelor, lecțiilor și antrenamentului.
- Panou modal retractabil cu 4 categorii organizate pe tab-uri:
  - **Bază & Algebră:** cifre 0–9, operații $+$, $-$, $\times$, $\div$, $=$, $\neq$, $\pm$, radical $\sqrt{\ }$, puteri $x^2, x^3, x^n$, fracții $\frac{a}{b}$, paranteze și modul $|x|$.
  - **Mulțimi & Relații:** $<, >, \le, \ge, \in, \notin, \subset, \subseteq, \cup, \cap, \emptyset, \mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \Rightarrow, \Leftrightarrow, \forall, \exists$.
  - **Litere & Simboluri:** $x, y, z, t, a, b, c, \Delta, \pi, \alpha, \beta, \theta, \infty, ^\circ, \perp, \parallel, \sin, \cos, \text{tg}, \text{ctg}, x_1$.
  - **Funcții & Bacalaureat:** $f(x), f'(x), \log_a, \ln, \lim, \sum, \int, e, \frac{1}{x}, x_2, x_n, \sqrt{\Delta}, V(-b/2a, -\Delta/4a), i^2 = -1$.
- Încorporat câmp de ciornă cu previzualizare matematică tipografică în timp real și buton inteligent `[ 📋 Copiază în răspuns ]` care transferă direct calculul în câmpul de test activ.

### 2. Micro-Motor Tipografic de Formule Matematice (100% Offline)
- Implementată funcția `formateazaMateHTML(str)` în `assets/app.js`:
  - Randează fracții etajate verticale cu bară orizontală: `<span class="math-frac"><span class="math-num">...</span><span class="math-den">...</span></span>`.
  - Randează radicali cu bară continuă: `<span class="math-rad"><span class="math-rad-sym">&radic;</span><span class="math-rad-line">...</span></span>`.
  - Exponenți `<sup>...</sup>`, indici `<sub>...</sub>`, litere grecești ($\Delta, \pi, \alpha, \beta$) și simboluri de relație ($\le, \ge, \neq, \pm, \Rightarrow$).
- Integrat în toate lecțiile, grilele de test, antrenamente și recapitulări de rezultate.

### 3. Sistem Dual Video Explicativ & Tablă Didactică Pas-cu-Pas
- Generată baza de date didactică completă `data/mate-didactic.json` pentru toate cele 36 de lecții de matematică (clasele a IX-a și a X-a).
- **Online:** Card dedicat de video cu profesor (Pauza de Mate / Proful Online), integrat nativ cu player embed YouTube la click (`▶ Vizionează lecția video`).
- **Offline («Tabla Neagră Pas-cu-Pas»):** Tablă interactivă pe stil chalkboard întunecat cu contrast ridicat, care descompune problema cheie a fiecărei lecții în pași atomici:
  - Pasul 1: Ipoteză & formulă aplicabilă.
  - Pasul 2: Condiții de existență (numitor $\neq 0$, radicand $\ge 0$, argument logaritm $>0$).
  - Pasul 3: Transformări algebrice fără pași omiși (semne schimbate, numitor comun).
  - Pasul 4: Calcul intermediar complet (calculul pas cu pas al lui $\Delta$, etc.).
  - Pasul 5: Concluzia și mulțimea de soluții $S$.
  - Butoane interactive de navigare între pași: `‹ Pasul anterior`, `Pasul următor ›`, `↺ Reia de la început`.

### 4. Versionare (v16) & Validare
- Modul compilat și verificat cu `node tools/verifica-continut.mjs` (63 module, 1177 lecții valide).
- Toate cele 33 de teste de comportament trecute (`node tools/test-comportament.mjs` — 33/33 pass).
- Verificat CSS: `assets/app.css` și `assets/tema-aurora.css` (0 erori sintactice).
- Verificat precache service worker: 77 resurse, 0 erori.
- Actualizat la versiunea **v16** (cache v20).
- Vault Obsidian actualizat (`python tools/graphify.py` și `python tools/verifica_vault.py` — 0 erori, 0 legături rupte).

---

## 2026-09-07 — Faza 17: Curriculum Modernizat (Psihologie, Economie, Antreprenoriat), TIC Reconstruit Complet și Video Didactic Universal YouTube cu Link Direct (v17)

**Obiective primite:**
1. Eliminare definitivă din aplicație: Filosofia, Studiile Sociale, Religia, Matematica aplicată în științele sociale (MASS) și ȘTIAM radiate complet din curriculum, surse, module, vault și cache.
2. Adăugarea și structurarea completă a materiilor socio-umane moderne: Psihologia (clasa a X-a), Economia (clasa a XI-a) și Educația antreprenorială (clasele a X-a și a XII-a), construite riguros pentru liceu și examenul de Bacalaureat.
3. Reconstruirea integrală a disciplinei TIC (Tehnologia Informației și a Comunicațiilor) pentru clasele IX–XII (64 de lecții detaliate), acoperind exhaustiv cerințele practice pentru Proba D (Competențe Digitale) de Bacalaureat.
4. Generalizarea funcționalității video didactice YouTube la toate materiile din aplicație unde există materiale educaționale, integrând player securizat fără reclame și buton direct „↗ Deschide pe YouTube”.

### 1. Eliminarea materiilor radiate & refacerea curriculumului
- Actualizat `data/curriculum.json`: eliminate Filosofia (XII–XIII), Religia (IX–XIII), Studiile Sociale (XI–XIII), MASS (XI–XII) și ȘTIAM (XI–XII).
- Șterse fizic toate sursele DSL (`data/sursa/*.txt`) și modulele JSON orfane asociate materiilor eliminate.
- Curățat vault-ul Obsidian de notele vechi orfane prin mecanism automat de curățare în `tools/graphify.py`.

### 2. Dezvoltarea noilor module: Economie, Educație Antreprenorială și Psihologie
- **Economie (clasa a XI-a):** 9 capitole, 24 de lecții, 2 teze semestriale cu 10 întrebări fiecare (nevoi, resurse, cost de oportunitate, cerere, ofertă, piață concurențială, costuri, profit, piață monetară, bănci, inflație, șomaj, PIB).
- **Educație antreprenorială (clasa a X-a):** 6 capitole, 18 lecții, 2 teze semestriale (profilul antreprenorului, distrugerea creatoare Schumpeter, oportunități de afaceri, BMC - Business Model Canvas, marketing mix cei 4P, forme juridice PFA/SRL/SA, pași ONRC, bilanț și cash flow).
- **Educație antreprenorială (clasa a XII-a):** 5 capitole, 12 lecții, 2 teze semestriale (finanțare avansată, bootstrapping, Business Angels, fonduri europene, pitch deck 10/20/30 Guy Kawasaki, funnel de vânzări CAC/LTV, CRM, scalare și metodologii agile).
- **Psihologie (clasa a X-a):** 9 capitole, 24 de lecții, 2 teze (psihicul ca formă a vieții de relație, conștiință, inconștient, senzații, percepții, gândire, limbaj, memorie, imaginație, afectivitate, voință, personalitate - temperament, aptitudini, caracter).

### 3. Reconstrucția completă TIC (clasele IX–XII, 64 de lecții) pentru Bacalaureat Proba D
- **TIC 9:** Arhitectură hardware, CPU, RAM volatil vs stocare SSD/HDD, sistemul de operare Windows, scurtături de tastatură, rețele LAN/WAN, IP, DNS, HTTPS, tehnoredactare Word elementară, PowerPoint, securitate cibernetică, 2FA, malware, etică digitală, reprezentare binară, codificare text UTF-8 și imagine RGB, porturi USB-C/HDMI, ergonomie și backup 3-2-1.
- **TIC 10:** Calcul tabelar avansat Excel (formule, funcții SUM, AVERAGE, COUNT, MAX, MIN, IF, COUNTIF, SUMIF), referințe relative și absolute ($A$1 cu F4), diagrame coloane/plăcintă, sortare și filtrare, baze de date Access (tabele, tipuri de câmpuri, Cheie Primară, interogări cu criterii BETWEEN și LIKE, formulare, rapoarte), grafică raster vs vectorială SVG, algoritmi, scheme logice, structuri de control (FOR, WHILE, IF-ELSE), vectori și gândire computațională.
- **TIC 11:** Tehnologii Web (arhitectură client-server, protocoale HTTP/HTTPS, găzduire), structură HTML5 semantică (`<nav>`, `<header>`, `<main>`, `<footer>`), stilizare CSS3 (clase `.clasa`, id-uri `#id`, CSS Box Model: padding, border, margin), legături hipertext `<a>`, tabele HTML, multimedia nativă (`<audio controls>`, `<video controls poster>`), montaj video pe Timeline, lucru în echipă cu Git (commit, branches, GitHub) și securitate web (prevenire SQL Injection, XSS, hashing parole).
- **TIC 12:** Pregătire dedicată pentru Bacalaureat Proba D:
  - **Fișa A (15 min, cu internet):** căutare avansată în Google cu operatori booleeni, ghilimele `" "`, `site:`, `filetype:pdf`, descărcarea imaginilor în folderul de candidat și redactarea e-mailului oficial cu atașament conform cerințelor de barem.
  - **Fișa B (75 min, fără internet):**
    - Subiectul I (Word - 30p): configurare pagină A4 cu margini, orientare, împărțire pe coloane cu linie despărțitoare, efecte exponent/indice, antet și subsol cu număr de pagină fără prima pagină (Different First Page), tabele și borduri.
    - Subiectul II (Excel - 30p): tabele cu formatare valută/procent, formule aritmetice, funcția condiționată `=IF(E3>=6, "ADMIS", "RESPINS")`, generare grafic Column/Pie cu titlu, legendă și etichete de date (Data Labels).
    - Subiectul III (Opționale - 30p): PowerPoint (machete, fundal degrade diferențiat pe slide-ul 2 fără Apply to All, animații, export .ppsx), Access (Design View, cheie primară, interogare de selecție cu criteriu) sau HTML scris în Notepad.
    - Tehnologii contemporane: Cloud Computing (IaaS, PaaS, SaaS), Big Data (cei 5V), IoT, Edge Computing, Machine Learning, modele LLM, rețele neuronale, etică AI și prevenirea discriminării algoritmice.

### 4. Generalizarea Video Didactic YouTube pe toate materiile
- Baza de date `data/mate-didactic.json` extinsă la 152 de lecții acoperite cu clipuri educaționale YouTube de înaltă calitate:
  - **Matematică:** toate cele 36 de lecții cu video + Tabla Pas-cu-Pas interactivă offline fără pași omiși.
  - **TIC:** toate cele 64 de lecții din clasele IX–XII acoperite cu tutoriale practice pentru Word, Excel, PowerPoint, Access, HTML, Securitate și rezolvări de bilete Bac Proba D.
  - **Limba și literatura română:** 12 lecții pentru operele canonice de Bac (Harap-Alb, Moara cu noroc, Luceafărul, Plumb, O scrisoare pierdută, Ion, Ultima noapte, Enigma Otiliei, Baltagul, Moromeții, Iona, Testament).
  - **Istorie:** 8 lecții de sinteză pentru Bac (Romanitatea românilor, Instituții medievale, Războaiele cu otomanii, Statul român modern 1859, Constituțiile României, Marea Unire 1918, Comunismul sub Dej și Ceaușescu).
  - **Geografie:** 6 lecții esențiale pentru Bac (Relieful României, Clima, Hidrografia, Populația și orașele, Relieful Europei).
  - **Biologie:** 6 lecții fundamentale pentru Bac (Celula eucariotă, Mitoza și meioza, Legile lui Mendel, Sistemul nervos, Sistemul circulator, Genetica umană).
  - **Psihologie, Economie, Antreprenoriat, Logică, Limba Engleză și Limba Franceză** completate cu clipuri didactice tematice.
- În `assets/app.js`: eliminată restricția de materie din `mateDidacticHTML` și `legaMateDidactic`, astfel încât orice lecție ce conține date video afișează playerul securizat `youtube-nocookie.com`.
- Adăugat butonul direct `[ ↗ Deschide pe YouTube ]` în playerul fiecărei lecții, stilizat elegant în `assets/tema-aurora.css` (`.btn-video-yt`).

### 5. Validare, Versionare (v17) & Deploy
- Verificare conținut: `node tools/verifica-continut.mjs` — 52 module, 973 lecții, 3895 carduri, 5477 întrebări de test, 0 erori.
- Toate cele 33 de teste de comportament trecute (`node tools/test-comportament.mjs` — 33/33 pass).
- Verificare CSS: `assets/app.css` (2186 linii) și `assets/tema-aurora.css` (810 linii) — structură validă, acolade echilibrate.
- Precache Service Worker: `sw.js` actualizat la `stiinte01-v21`, toate cele 52 de fișiere de modul verificate și prezente.
- Cache-busting în `index.html`: actualizat la `?v=21`.
- Vault Obsidian regenerat: 1168 de note, 7942 wikilink-uri, 0 legături rupte, 0 note orfane (`python tools/verifica_vault.py`).
- Actualizat `data/versiuni.json` la versiunea 17 (cache 21).




