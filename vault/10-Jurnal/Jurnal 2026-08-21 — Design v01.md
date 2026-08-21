---
titlu: Jurnal 2026-08-21 — Design v01
tip: jurnal
data: 2026-08-21
versiune: "01"
tags: [jurnal, design, v01, proces]
---

# Jurnal 2026-08-21 — Design v01

Oglinda intrării din `jurnal.md` (rădăcina depozitului). Jurnalul e sursa cronologică;
aici e varianta legată de restul vaultului.

Legături: [[Științe Sociale — MOC]] · [[Design System v01]] · [[Palete și tokenuri]] ·
[[Glass + Neomorfism]] · [[Animații iOS]] · [[Componente UI]] · [[Raport verificare v01]] ·
[[Versiuni]] · [[Arhitectura aplicației]]

> [!abstract] Obiectivul primit
> O echipă de designeri să dea aplicației un design estetic real — combinație între
> *glassmorphism* și *neomorfism*, culori calde, animații în stil iOS. Tot ce se face se
> scrie în jurnal și apoi în vaultul Obsidian. Tot ce se creează este verificat de un agent
> separat, ca să nu mai fie nevoie de audit ulterior. Aplicația se notează **versiunea 01**.
> La final, totul intră pe `main`, commit și deploy.

---

## 1 · Inventarul aplicației existente

Am citit tot codul înainte de a schimba ceva. Starea de plecare:

| Fișier | Rol | Stare inițială |
|---|---|---|
| `index.html` | schelet + bară de navigare | 30 de linii, iconițe unicode geometrice (`●`, `☰`, `▣`) |
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

## 2 · Echipa de designeri — trei roluri paralele

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

## 3 · Vaultul Obsidian

Am creat `vault/` ca vault Obsidian propriu-zis (nu doar un folder cu fișiere `.md`):

- `.obsidian/app.json`, `appearance.json`, `core-plugins.json`, `graph.json` — configurație
  validată JSON, accent cald `#c96f3f`, legături `[[wikilink]]`, plugin-urile de bază active.
- `00-Index/` — harta de conținut (MOC).
- `10-Jurnal/` — oglinda acestui jurnal.
- `20-Design/` — sistemul de design, pe note legate între ele.
- `30-Aplicatie/` — arhitectura și versiunile.
- `40-Verificare/` — rapoartele agenților de verificare.

## 4 · Bancul de probă vizual (ca să nu fie nevoie de audit)

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

## 5 · Art Director — stratul de tokeni (livrat) — vezi [[Palete și tokenuri]] și [[Glass + Neomorfism]]

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
| `--ink` peste sticlă (compus real, nu tokenul plat) | 14.18 | 13.01 |
| `--ink-muted` peste sticlă | 5.73 | 5.94 |
| `--brand` ca text pe card | 6.07 | 7.10 |
| `--ok` / `--bad` pe fundal | 5.45 / 6.53 | 8.61 / 8.33 |

O singură culoare nu trece ca text: chihlimbarul `--accent` (#B4761A) dă 3.53:1 pe smântână.
De aceea are un frate dedicat, `--accent-text` (#8A5410, 5.83:1), iar `--accent` rămâne
**doar culoare de umplutură**. Aceasta e genul de detaliu care, altfel, ar fi ieșit la audit.

**Ce mai conține stratul:** paleta pe trei niveluri de suprafață (îngropat / bază / ridicat),
gradientul ambiental mesh din patru `radial-gradient`-uri pure CSS, umbrele neomorfice derivate
din culoarea suprafeței (umbră **caldă** `#AC855A`, nu neagră), tokenurile de sticlă cu muchia
luminoasă de sus, scara tipografică modulară (rație 1.2), grila de spațiere de 4px, scara de
raze în stil iOS (24px raza „semnătură” a cardului) și **temă întunecată caldă** — espresso
`#191310`, nu negru-albăstrui — cu umbrele neomorfice **recalculate**, fiindcă pe întuneric
„lumina” nu mai e albă, ci o ridicare caldă slabă.

Patru blocuri de preferințe ale utilizatorului sunt tratate explicit, nu ignorate:
`prefers-color-scheme`, `prefers-reduced-transparency` (sticla devine opacă), `prefers-contrast: more`
(umbrele moi dispar și devin linii de 1px reale) și un `@supports not (backdrop-filter)` pentru
browserele fără estompare.

## 6 · Iconițele aplicației, refăcute

Iconițele PWA erau un pătrat bleumarin plat cu o histogramă — se băteau cap în cap cu paleta caldă.
Le-am regenerat: squircle cu gradient teracotă (nisip → `--brand` → teracotă adâncă), luciu
specular în stânga-sus, muchie interioară luminoasă și coloanele în smântână și chihlimbar.
Generatorul (`icons/icon-source.svg` + script Playwright) randează SVG-ul în Chromium și
salvează PNG la dimensiune exactă — deci iconițele se pot regenera oricând din sursă, la orice
dimensiune, fără editor grafic. Varianta *maskable* ține conținutul în cercul de siguranță de 80%.

## 7 · Motion Designer — sistemul de mișcare (livrat) — vezi [[Animații iOS]]

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

## 8 · Integrarea — unde s-au ciocnit cei trei și cum am arbitrat — rezumat în [[Design System v01]]

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
   (6.95:1 și 7.99:1 pe fundalul compus real). **Acesta e exact genul de defect care ar fi
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

Rezultatul: `assets/app.css` = **1342 de linii**, în patru straturi cu ordine impusă
(tokeni → tokeni derivați → componente → mișcare), toate comentate în română.
O verificare automată confirmă că **toți cei 113 tokeni folosiți sunt declarați** — singurele
excepții sunt cele patru variabile puse din JS (`--p`, `--i`, `--tab-i`, `--tab-count`),
fiecare cu valoare de rezervă în CSS.

## 9 · Modificările efective, fișier cu fișier

| Fișier | Ce s-a schimbat |
|---|---|
| `assets/app.css` | rescris integral: 92 → **1342 de linii**, patru straturi |
| `assets/app.js` | 15 349 → **22 162 de octeți**: infrastructura de mișcare, `render()` rescris, `drawCard()` rescris pentru rotire 3D, cascadă la test, bare pe `--p`, stil inline eliminat de pe `textarea` |
| `index.html` | bara de sus și cea de taburi refăcute, **5 iconițe SVG inline** în locul caracterelor unicode, scena de tranziție `#stage`, pastila `.tab-ind`, `theme-color` pe temă |
| `icons/*.png` | regenerate în paleta caldă, din `icons/icon-source.svg` |
| `manifest.webmanifest` | `theme_color` și `background_color` → nisip cald `#F7EEE2` |
| `sw.js` | cache `stiinte01-v1` → `stiinte01-v2` (altfel telefoanele instalate rămâneau pe versiunea veche) |
| `jurnal.md` | acest jurnal |
| `vault/` | vaultul Obsidian |

**Ce NU s-a atins, intenționat:** conținutul din `data/` (8 module, 25 de lecții, 41 de carduri,
25 de întrebări), logica de progres și de notare, și **cheia de `localStorage`** (`stiinte01:v1`)
— progresul elevilor care folosesc deja aplicația nu se pierde.

## 10 · Verificarea proprie, înainte de a chema verificatorii

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
