---
titlu: Raport verificare v01
tip: verificare
versiune: "01"
actualizat: 2026-08-21
tags: [verificare, calitate, v01, accesibilitate, pwa]
---

# Raport verificare v01

Legături: [[Științe Sociale — MOC]] · [[Design System v01]] · [[Versiuni]] ·
[[Jurnal 2026-08-21 — Design v01]]

Cerința: tot ce se creează e verificat, ca să nu mai fie nevoie de un audit separat.
Verificarea are două straturi — ce am măsurat eu în timpul lucrului, și ce au găsit
**verificatori independenți**, care nu au scris codul.

---

## Stratul 1 — verificări făcute în timpul lucrului

### Randare

| Ce | Cum | Rezultat |
|---|---|---|
| 7 ecrane × 2 teme | Playwright, context iPhone 390×844 DPR 2, touch | 14 capturi, **zero erori JS** |
| Funcționare offline | service worker activat, rețea tăiată, pagină reîncărcată | se randează integral, insigna „offline” apare, zero erori |

### Interacțiune — apăsări reale, nu doar randare

| Pas | Rezultat |
|---|---|
| Răspuns la test: se marchează corectul și greșitul, apare explicația, opțiunile se dezactivează | trecut |
| Test complet de 12 întrebări → ecran de rezultat cu `--p` | trecut |
| Rotirea cardului: două fețe în DOM, matrice 3D chiar `rotateY(180°)`, butoane schimbate, `aria-hidden` mutat | trecut |
| Cardul următor: text schimbat, nu rămâne întors, contor avansat | trecut |
| Navigare înainte (`nav-push`) și înapoi cu butonul browserului (`nav-pop`) | trecut |
| Schimbare de tab: `nav-fade` + cascadă (14 elemente), indicator pe poziția corectă | trecut |
| Notițe salvate în `localStorage`, supraviețuiesc re-randării | trecut |
| Progresul se reflectă pe Acasă și bara chiar se randează după animație | trecut |

### Condiții de margine

4 formate (peisaj 844×390, portret 390×844, îngust 360×740, tabletă 834×1112) × 6 rute:

- zero derulare orizontală;
- bara de taburi rămâne în ecran;
- **zero ținte de atingere sub 44×44px**;
- **zero ocluziune reală**: la derulare 0 primul element e sub bara de sus, la derulare
  maximă ultimul element e deasupra barei de taburi.

> [!note] O verificare greșită a mea, corectată
> Prima variantă a testului de ocluziune raporta 16 „suprapuneri” cu bara de sus.
> Testul era greșit, nu codul: conținutul care curge pe sub sticla translucidă *este*
> intenția designului. L-am refăcut ca să măsoare exact ce contează — capetele de derulare.

### Preferințele utilizatorului

| Preferință | Verificat |
|---|---|
| `prefers-reduced-motion: reduce` | randare corectă, fără erori |
| `prefers-contrast: more` | neomorfismul cedează în contururi de 1px, sticla devine opacă, fundalul ambiental dispare |
| `prefers-reduced-transparency` | suprafețe opace |
| temă întunecată | espresso cald, umbre neomorfice recalculate |

### Paleta, ca număr

- **Nuanțele tuturor celor 58 de culori opace**: toate în arcul **4°–45°**, plus patru verzi
  la 96–104° (semantica „răspuns corect”). **Nicio culoare rece 170–290°.**
  Pentru comparație, vechiul bleumarin `#1c3d5a` era la 208°.
- **Completitudinea temei întunecate**: 155 de tokeni în tema deschisă, 56 redefiniți pe
  întuneric; verificare automată — **fiecare token de culoare are corespondent pe întuneric**.
- **Integritatea tokenilor**: toți cei 113 `var(--x)` folosiți sunt declarați. Singurele
  excepții sunt cele patru variabile puse din JS (`--p`, `--i`, `--tab-i`, `--tab-count`),
  fiecare cu valoare de rezervă în CSS.

### Accesibilitate la tastatură

Parcurgere cu `Tab`: fiecare element focalizat primește un inel `2px solid rgb(158,65,25)` —
teracotă. **Niciun inel albastru implicit.** `#view` (cu `tabindex="-1"`) nu intră în
parcurgere, fiindcă primește focus doar programatic.

### Verificările din CI, rulate local

`data/*.json` și `manifest.webmanifest` parsează; `node --check` trece pe `app.js` și `sw.js`;
toate fișierele obligatorii ale PWA există; toate cele 9 intrări din precache-ul service
worker-ului există în depozit.

### Un defect găsit singur, înainte de verificatori

`--glass-specular` era definit corect și stins corect în cele trei blocuri de rezervă, dar
**nu-l folosea nimic** — sticla avea trei ingrediente din patru. Conectat la bara de sus și
la cardul de memorare. Vezi [[Glass + Neomorfism]].

---

## Stratul 2 — verificatori independenți

Trei agenți care **nu au scris codul**, fiecare pe o zonă care nu se suprapune cu celelalte,
fiecare cu instrucțiunea explicită de a fi adversarial și de a nu da o aprobare de complezență.

> [!important] Toți trei au întors „nu e bun așa cum e”
> Exact ce trebuia. Un verificator care aprobă tot nu verifică nimic.

### Verificatorul CSS — 4 majore, 8 minore

| # | Defect | Cum se vedea | Stare |
|---|---|---|---|
| 1 | `:focus-visible` avea `border-radius`, cu aceeași specificitate ca `.chip`/`.tab`, dar mai jos în fișier | butonul rotund „înapoi” trecea de la 999px la 18px **exact la focus** | corectat |
| 2 | umplerea barei de progres la **1,23:1** față de șanț, pe tema deschisă | elevul nu vedea cât a parcurs, pe 3 ecrane | corectat: contur de 1px, **4,81:1** |
| 3 | rezerva pentru browsere fără `:has()` era scrisă în aceeași **listă de selectori** | listele nu sunt tolerante → regula întreagă cădea, cu rezervă cu tot | corectat: reguli separate + `app.js` emite clasa `.score` |
| 4 | `.icon-btn` era sticlă **și** relief | încălcarea propriei reguli | corectat: sticlă curată |

Minorele, toate corectate: textul-fantomă din notițe la 3,14:1 · variantele greșite de la test
la 3,25:1 **după** răspuns (rămân de citit, deci trebuie lizibile) · `.flash:focus-visible` nu
se potrivea cu nimic (focalizabil e `.flip`) · `min(46svh,300px)` fără rezervă pentru motoarele
fără `svh` · rezerva `overflow-x:hidden` transforma `.stage` în container de derulare și omora
antetul lipicios al tabelelor · animațiile de la test câștigau doar fiindcă JS scotea o clasă
întâi, deci CSS-ul nu era autonom · înălțimea barei de taburi în peisaj subestimată cu 4,5px ·
bara de taburi pusă pe stratul foilor modale în loc de cel al cadrului.

### Verificatorul JavaScript — 3 majore, 6 minore

| # | Defect | Cum se vedea | Stare |
|---|---|---|---|
| 1 | clona ecranului care pleacă **moștenea clasa de navigație anterioară** | la cea mai frecventă navigare din aplicație, parallaxul lipsea, iar cele două jumătăți se desincronizau cu 100ms | corectat |
| 2 | `navDirection()` întorcea direcția greșită: ramura de stivă testată înaintea celei de rădăcină, adâncime calculată inconsistent, stiva golită greșit | un tab se anima ca „înapoi” și pierdea cascada; intrarea în carduri se anima ca ieșire; „înapoi” se anima **înainte** | corectat |
| 3 | `role="button"` + `aria-label` pe card făceau conținutul prezentațional | **întrebarea ȘI răspunsul dispăreau din arborele de accesibilitate** — un elev nevăzător nu mai putea învăța de pe carduri | corectat |

Minorele, toate corectate: răspunsul se găsea cu Ctrl+F și se selecta cu degetul **înainte**
de întoarcere · o clonă rămânea agățată în DOM dacă „mișcare redusă” se activa în timpul unei
tranziții · o apăsare de tab după o încărcare eșuată golea ecranul și bloca aplicația ·
autosalvarea scria „Salvat.” pe linia de stare a **lecției următoare** · clona păstra
înălțimea ecranului „Plan” (~6000px) în overflow-ul paginii · barele din clonă reporneau
animația și se vedeau golindu-se · `--p` putea fi `NaN`, iar rezerva randa o bară **plină** ·
`#/carduri/{modul}` nu arăta „înapoi” · o rută necunoscută lăsa pastila sub tabul greșit ·
stiva nu avea plafon · `inert` nu există pe motoare vechi.

### Verificatorul de documentație — ~15 erori factuale

Greșeli în propriile mele afirmații, toate corectate: `index.html` avea 35 de linii, nu 30 ·
mărimile lui `app.js` erau caractere etichetate drept octeți · „40 de elemente nu durează 4
secunde” — sunt 1,3 · „patru `radial-gradient`-uri” erau trei radiale și unul liniar · două
rânduri de contrast pentru tema întunecată fuseseră măsurate față de card, nu față de pagină ·
iconițele SVG sunt 6, nu 5 · caracterul înlocuit pe tabul „Plan” era `▦`, nu `▩` · iar
afirmația că iconițele „se pot regenera oricând din sursă” era falsă, fiindcă **generatorul nu
era în depozit**.

A infirmat și o afirmație făcută cu prea multă încredere: **iconița *maskable* nu încăpea în
cercul de siguranță**. A decodat PNG-ul pixel cu pixel: 84,3% diametru efectiv, 450 de pixeli
în afara cercului de 80%. Corectat — marginea se **calculează** acum (colțurile cutiei de
conținut trebuie să încapă în cerc, nu doar laturile ei), iar remăsurarea dă rază maximă
196,7px față de un cerc de 204,8px, **zero pixeli în afară**.

> [!note] A greșit o singură dată
> A susținut că stilul inline de pe `textarea` nu fusese eliminat niciodată. `git show` arată
> că exista înainte și că nu mai există acum. Grep-ul lui pe fișierul curent întorcea zero
> **tocmai fiindcă** ștergerea se făcuse. Un raport de verificare nu se ia pe încredere mai
> mult decât codul pe care îl verifică.

---

## Stratul 3 — ce a ieșit din verificare ca unealtă permanentă

Corectând defectul cu inelul de focus, am șters din greșeală **acolada de închidere** a regulii.
Chromium acceptă azi imbricarea CSS, deci nu a raportat nicio eroare: a interpretat tot restul
fișierului ca reguli imbricate în `:focus-visible`. Jumătate din stiluri se aplicau doar
elementelor focalizate, iar rotirea 3D a cardului nu mai funcționa deloc.

**Toată bateria de teste a trecut și cu fișierul stricat** — verifică erori JS, layout și ținte
de atingere, nu structura foii de stil.

De aici a ieșit `tools/verifica-css.mjs`: verifică echilibrul acoladelor ignorând comentariile
și șirurile, și semnalează orice selector imbricat — fiindcă în acest proiect imbricarea nu se
folosește, deci apariția ei înseamnă aproape sigur o acoladă uitată. Greșeala originală a fost
reprodusă pe o copie: unealta o prinde, cu linia exactă. Rulează acum și în CI, la fiecare push.

## După corecturi

Toată bateria de teste a fost rulată din nou, iar fiecare defect corectat a fost **verificat
empiric**, nu doar declarat rezolvat: raza elementelor nu se mai schimbă la focus · bara de
progres are contur vizibil · `.flash` nu mai conține semnătura neomorfică · răspunsul nu se
mai găsește cu Ctrl+F înainte de întoarcere · întrebarea apare în arborele de accesibilitate,
iar răspunsul apare **după** întoarcere · clona are exact o clasă de navigație și joacă
animația corectă.
