---
titlu: Raport verificare v03
tip: raport
versiune: "03"
actualizat: 2026-08-22
tags: [verificare, raport, v03]
---

# Raport verificare v03

Legături: [[Științe Sociale — MOC]] · [[Jurnal 2026-08-22 — Temă, setări, conținut v03]] ·
[[Versiuni]] · [[Raport verificare v02]]

Doi agenți independenți, lansați în paralel: unul adversarial pe cod, unul empiric pe
interfață. Au găsit **20 de defecte reale**. Toate corectate și **reverificate empiric** —
niciunul declarat rezolvat fără măsurătoare.

## Verificatorii locali

| Verificator | Rezultat |
|---|---|
| `JSON.parse` pe `data/*.json` + `manifest.webmanifest` | trecut |
| `JSON.parse` pe cele 60 de `data/module/*.json` | trecut |
| `node --check` pe `app.js`, `sw.js`, unelte | trecut |
| `tools/verifica-css.mjs` | trecut — 1822 linii, acolade echilibrate |
| `tools/verifica-continut.mjs` | trecut — 60 module, 580 lecții |
| `tools/construieste-index.mjs` (round-trip) | index și `sw.js` identice după regenerare |
| `tools/graphify.py` + `tools/verifica_vault.py` | trecut — 812 note, 5379 wikilink-uri |
| `tools/test-sw.mjs`, cu SW **activ** | trecut — instalare fără reîncărcare, exact 1 la update, zero erori JS |

## Ce a găsit verificatorul de cod

> [!bug] Blocant
> **B1.** Trei wikilink-uri către această notă, care nu exista încă. Rezolvat prin
> scrierea ei — după ce ambii agenți au raportat, nu înainte.

**Important**

1. **Progresul din v02 rămânea numărat.** Spațiul de id-uri s-a schimbat complet
   (`filo-01` → `filo12-01`), cu intersecție zero. Un elev venit de pe versiunea veche
   vedea „20/580 lecții citite" și o medie din teste care nu mai corespundeau niciunui
   domeniu, în timp ce fiecare lecție apărea necitită.
   *Corectat:* curățare a cheilor orfane la pornire.
   *Verificat:* am scris progres v02 + v03 în `localStorage`; după reload au rămas exact
   cheile v03 (`ist9-01`, `materie:istorie-9`, `an:4`), au dispărut cele v02, iar Acasă
   arată „1/580".
2. **„Caută o versiune nouă" era distructiv fără plasă.** Ștergea ~2,8 MB de precache și
   dezînregistra service worker-ul, fără confirmare și fără test de rețea — offline,
   reload-ul de după nu mai avea de unde încărca nimic.
   *Corectat:* refuz explicit offline, plus confirmare.
   *Verificat:* cu `navigator.onLine = false`, mesaj clar și niciun reload.
3. **`addAll` atomic peste 70 de fișiere.** Un singur timeout dintre 60 de module anula
   instalarea întregii versiuni; `skipWaiting()` nu mai rula și utilizatorul rămânea
   tăcut pe versiunea veche. La v02 lista avea ~10 fișiere — riscul crescuse cu un ordin
   de mărime.
   *Corectat:* precache împărțit — scheletul atomic, modulele prin `allSettled`.
   *Verificat:* `test-sw.mjs` trece cu noul precache.
4. **Importul salva înainte de a valida.** `{"lectiiCitite": null}` trecea de „e obiect",
   se persista, apoi randarea arunca — iar la fiecare pornire ulterioară aplicația arăta
   „Nu s-au putut încărca datele", un mesaj care trimitea spre fișierele aplicației, nu
   spre cauza reală.
   *Corectat:* sanitizare completă înainte de înlocuire, cu revenire la starea precedentă.
   *Verificat:* `lectiiCitite: null` + `tema: "banana"` + `marimeText: 5000` → aplicație
   funcțională, zero erori.
5. **Un modul căzut din 13 ascundea tot ecranul.** `Promise.all` e totul-sau-nimic.
   *Corectat:* `allSettled`; se randează ce există, cu un banner onest.
   *Verificat:* un modul blocat → cardurile apar plus bannerul; toate blocate → ecran cu
   „Reîncearcă" și mesaj de rețea.
6. **O sursă DSL stricată oprea toată conversia.** Fișierele de după ea rămâneau tăcut la
   conținutul vechi, validatorul le confirma, CI-ul rămânea verde. Divergență sursă↔ieșire
   nedetectabilă.
   *Corectat:* izolare pe fișier, gardă pentru directive fără lecție, și nu se scrie
   nimic dintr-o sursă cu erori.
   *Verificat:* sursă stricată pusă prima alfabetic → `exit 1`, mesaj `fișier:linie`,
   celelalte 60 convertite, niciun fișier defect pe disc.

**Minore, toate corectate:** cascada nu mai prindea ecranul Materii (regresie față de
v02); Setările goleau stiva de navigație, iar „Înapoi" anima ca intrare în adâncime;
`marimeText` interpolat fără `esc()`; cardul materiei promitea 72 de întrebări, testul
trăgea din 48; fără JS, `prefers-reduced-motion` nu mai avea niciun efect; două funcții
filtrau clasa după chei diferite; `aplicaPreferinte()` nu valida nimic.

## Ce a găsit verificatorul de interfață

762 de capturi și măsurători DOM, pe toată scara de ecrane și pe ambele teme.

| # | Defect | Corectat | Măsurat după |
|---|---|---|---|
| D1 | Segmentele aveau ținta clicabilă de 40px, sub pragul de 44 | `min-height:44px` pe buton, nu pe container | 45px pe toate cele 24 de segmente |
| D2 | Etichete trunchiate la 320px („Confortabil" → „Conforta…") | rupere pe două rânduri în loc de „…" | zero etichete trunchiate la 320px, 150% și spațios+150% |
| D3 | Textul rândului intra sub butoanele stepperului (până la 48px) | `flex-wrap` pe rând: controlul coboară sub text | zero suprapuneri în cele trei configurații |
| D4 | Titlul „Termeni" era acoperit de tabel cu 16px, pe toate cele 580 de lecții | marginea negativă de sus doar când tabelul e primul | −8px, adică 8px spațiu, la 390 și 768 |
| D5 | Pastila „BAC" devenea bară de 806px pe Acasă | `:not(.pill)` pe regula care punea `display:block` | 40px într-un rând de 858px |
| D6 | Al doilea buton din pereche cobora cu 8px și era mai scund | excludere din regula `.btn + .btn` | ambele la `top:498`, `height:51`, `margin-top:0` |
| D7 | Switch-ul oprit avea 1,07:1 față de fundal — sub pragul WCAG de 3:1 | contur `--ink-faint` (`--hairline-strong` ajungea doar la 1,8:1) | 3,37:1 luminos, 3,78:1 întunecat |
| D8 | Antetul rupea cuvântul: „TERME / N" | `overflow-wrap:anywhere` doar în celulele de date | antet întreg, fără rupere |
| D9 | Cursorul oferea 85–140%, bootstrap-ul accepta 80–150% | cursorul aliniat la 80–150 | — |

Plus două ținte găsite de reverificarea proprie, în combinații extreme pe care raportul
le semnalase ca marginale: taburile scădeau la 42px lățime (320px + text 150%) și la
42px înălțime (peisaj + densitate compactă). Corectate; măsurat după: minimul e 44px în
toate cele șase configurații testate.

## Reverificare finală

**616 combinații** — 7 viewporturi × 2 teme × 11 rute × 4 seturi de preferințe (implicit,
spațios+150%, compact+80%, lizibil+140%):

> [!success] Zero probleme
> Zero derulare orizontală · zero ecrane goale · zero elemente în afara ferestrei ·
> zero suprapuneri text/control · zero ținte sub 44px · zero erori de consolă.

Fluxurile de interacțiune, reverificate după modificările de CSS: comutarea temei din
Setări schimbă paleta și `theme-color` și persistă după reload; switch-urile și stepperele
răspund; testul dă feedback la răspuns; cardul se întoarce; navigarea adâncă urmată de
Setări și „Înapoi" revine la ecranul corect, cu animație de ieșire, nu de intrare.

## Ce NU s-a verificat

Verificatorul de cod n-a putut rula `tools/test-sw.mjs` (fără `playwright` în mediul lui)
și n-a avut browser, deci analiza lui pe `app.js` a fost statică. Golul a fost acoperit
de reverificarea proprie: testul de service worker a rulat de trei ori pe parcurs — cu SW
activ, ultima oară după toate corecțiile.

Aplicația nu a fost testată pe dispozitive reale, doar în Chromium. Safari pe iOS și
Firefox rămân neverificate empiric în această rulare, ca și la v02.
