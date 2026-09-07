---
titlu: Raport verificare v04
tip: raport
versiune: "04"
actualizat: 2026-08-22
tags: [verificare, raport, v04, antrenament]
---

# Raport verificare v04

Legături: [[Științe Sociale — MOC]] · [[Jurnal 2026-08-22 — Antrenament v04]] ·
[[Sistemul de învățare]] · [[Versiuni]] · [[Raport verificare v03]]

Doi agenți independenți, lansați în paralel. **25 de defecte reale** — 15 pe cod, 10 pe
interfață. Toate corectate și reverificate cu măsurători, în condițiile în care au fost
raportate.

Spre deosebire de v03, verificatorul de cod a avut de data asta browser: a rulat 15 rute,
sesiuni complete, o simulare întreagă, la 320–768px, 100% și 150% text, cu CPU încetinit de
șase ori.

## Cele mai instructive constatări

### Regresia pe care n-o semnalasem — bazinul tezei

Refactorizarea traversării domeniului (`parcurge()`, extrasă din `domeniu()`) a schimbat
tăcut comportamentul tezei: în v03 întrebările de sinteză se **adăugau** peste cele ale
lecțiilor din semestru; în v04 le **înlocuiau**. Bazinul a scăzut de la 40 la 12.

Cu 12 întrebări în bazin și un test de 12, **fiecare teză ar fi ieșit identică**. Agentul a
măsurat-o pornind două servere în paralel, pe v03 și pe v04, și comparând aceeași rută:
„Întrebarea 1 din 40" față de „Întrebarea 1 din 12".

> [!warning] Lecția
> O refactorizare „fără schimbări de comportament" trebuie **măsurată**, nu declarată. Aici
> diferența era invizibilă în cod — o atribuire în loc de o adăugare — și invizibilă în
> interfață, fiindcă numărul de întrebări afișat e plafonat de setări.

Restaurat, plus eticheta corectată: spunea „12 întrebări de sinteză", acum spune
„12 de sinteză + tot semestrul".

### Un import stricat spărgea permanent ecranul Acasă

`sanitizeaza()` verifica doar că `note` și `antren` sunt obiecte, nu și ce e înăuntru. Un
fișier de import cu `"n": "9,50"` (șir, nu număr) trecea, se salva, iar de la următoarea
pornire `#/acasa` randa ecran gol — `n.toFixed is not a function` — la nesfârșit. Recuperare
doar prin golirea manuală a `localStorage`.

Mai rău: protecția de rollback scrisă la v03 **nu putea funcționa**. `render()` e `async`,
deci excepția devine promisiune respinsă, iar `try/catch`-ul sincron n-o prinde niciodată.
Aceeași clasă de bug pe care comentariul de deasupra o declara reparată — reapărută pe
câmpurile noi.

Corectat pe două straturi: sanitizare element cu element (interval, ușurință, scadență,
reușite, note — fiecare clamp-uit la un interval valid) și rollback mutat pe lanțul de
promisiuni. Verificat cu un import care conține `n: "9,50"`, `n: null`, `i: "abc"`,
`d: "maine"`, `lectiiCitite: null`: aplicația pornește, rândurile aberante sunt filtrate,
cele valide păstrate, zero erori.

### Butoanele vii, dar moarte

Cu calibrarea pornită, cele patru variante de răspuns erau randate **active**, deasupra
întrebării „cât de sigur ești". Pe telefon răspunsurile sunt sus, întrebarea jos: prima
atingere firească nu făcea nimic și nu spunea de ce.

Corectat: controlul de răspuns e blocat vizibil (opacitate 0,55, `disabled`) cât timp se
cere calibrarea. Verificat: înainte de calibrare butoanele sunt blocate și clicul nu schimbă
nimic; după alegerea încrederii sunt active.

### O cifră care nu era a nimănui

Hubul anunța „1744 de repetat" lângă „1744 neîncepute". `scadent()` întorcea `true` și pentru
elementele niciodată văzute, dar `alcatuiesteSesiune()` le excludea explicit din grupa
scadentă — deci cifra afișată nu era cifra folosită de sesiune. Elevul vedea un munte
inexistent înainte de a începe.

Corectat: se numără doar elementele **începute și scadente**. Pe profil nou: „0 de repetat"
lângă „2080 neîncepute".

### Contraste sub prag

Trei componente noi foloseau `--ink-faint`, comentat în paletă drept „doar decorativ":
bulinuțele punctelor, textul secundar din segmente și eticheta „RĂSPUNS". Măsurat pe pixeli:
**2,78:1 luminos**, sub pragul de 4,5:1. Modul „contrast ridicat" nu le repara, fiindcă
rescrie `--ink-muted`, nu `--ink-faint`.

Trecute pe `--ink-muted`. Măsurat după: **5,13:1 luminos, 7,24:1 întunecat**.

## Toate constatările

| # | Sursă | Defect | Măsurat după corecție |
|---|---|---|---|
| 1 | cod | vault: legături către un raport inexistent | această notă |
| 2 | cod | import stricat → Acasă spart permanent | rânduri aberante filtrate, aplicația pornește |
| 3 | cod | update de SW în mijlocul sesiunii arunca munca | rutele noi intră în „stare nepersistată" |
| 4 | cod | variantele de grilă, vii dar moarte până la calibrare | blocate vizibil, apoi active |
| 5 | cod | „N de repetat" număra și elementele nevăzute | „0 de repetat" pe profil nou |
| 6 | cod | cifrele de pe Acasă nu apăreau (prefetch 8 din 13) | se cer toate modulele clasei |
| 7 | cod | bazinul tezei scăzut tăcut 40 → 12 | „Întrebarea 1 din 40" |
| 8 | cod | bara de antrenament scăpa de „mișcare redusă" | `transition:none` |
| 9 | cod | cascada nu acoperea ecranele noi | selectori adăugați |
| 10 | cod | `antren` nevalidat la import | clamp pe fiecare câmp |
| 11 | cod | antrenamentul nu conta pentru serie | scrierea inutilă scoasă |
| 12 | cod | scurtătura din manifest, pe rută veche | „Antrenament" + „Simulare de notă" |
| 13 | cod | documentație nerecalculată | rute, persistență, „cinci numere" |
| 14 | cod | „Completează" respingea articolul hotărât | „statul" ≟ „stat" acceptat |
| 15 | cod | `aria-label` pe `div` fără rol | `role="img"` |
| 16 | ui | cardul de hub prindea stilul cardului de scor | reguli structurale scoase |
| 17 | ui | cardul de calibrare rămânea gol la „Cred" peste tot | text explicativ |
| 18 | ui | „Ce ai greșit" fără separare vizuală | acelaşi markup ca la test |
| 19 | ui | `.punct-bulina` 2,78:1 | 5,13 / 7,24:1 |
| 20 | ui | text secundar din segmente 2,78:1 | 5,13 / 7,24:1 |
| 21 | ui | `.rb-eticheta` 3,37:1 | 5,13 / 7,24:1 |
| 22 | ui | `.stats` ieșea din card la 150% | zero depășiri, 320–768px |
| 23 | ui | sub-etichetele segmentului ieșeau la 320+150% | toate patru încap |
| 24 | ui | câmpurile de scris 15px → iOS mărește pagina | 16px |
| 25 | ui | `.grid2` dădea 3–4 coloane peste 768px | 2 coloane la 768/1024/1440 |

Plus, din observațiile agentului de cod: `save()` înghițea tăcut depășirea de cotă — un elev
putea antrena o oră fără ca nimic să se salveze. Acum anunță o singură dată.

## Ce a trecut fără obiecții

Verificatorul de cod a confirmat, cu măsurători proprii: **`distanta()` e corectă** (20 000
de perechi aleatorii contra unei implementări de referință, zero nepotriviri); **reintroducerea
greșelilor nu e buclă** (punct fix la ≈N/3, măsurat 20 → 26 la 15 greșeli); **sesiunea n-are
duplicate și nu iese goală**; **`construiesteProba` nu poate pica** (minimul pe repo e 36 de
grile pe modul, pragul e 20); **zero breșe de injecție** în §7b; **service worker-ul e sincron**
pe toate cele trei locuri și trece testul cu SW activ.

Verificatorul de interfață: **zero derulare orizontală** în 887 de măsurători, **zero ținte sub
44px** pe ecranele noi, **zero erori de consolă**, rail vertical corect peste 1024px, toate cele
cinci tipuri de exercițiu randate și parcurse pe fiecare lățime și temă.

## Reverificare finală

Bateria completă, plus **896 de combinații** (7 viewporturi × 2 teme × 16 rute × 4 seturi de
preferințe): zero derulare orizontală, zero ecrane goale, zero suprapuneri, zero ținte sub
44px, zero erori de consolă. Testul de service worker cu SW activ: trecut.

## Ce NU s-a verificat

Safari pe iOS și Firefox — doar Chromium, ca la toate rulările de până acum. `min()` în
`minmax()` cu `auto-fit`, folosit acum în trei locuri, se poate comporta diferit.

Comportamentul programării **în timp** (zile, săptămâni) n-a putut fi verificat: nu s-a putut
deplasa ceasul. S-a verificat doar aritmetica unui pas.

Epuizarea cotei de `localStorage` cu `state.antren` complet populat (≈9400 de elemente,
estimat 550 KB) — nu s-a putut provoca. `antren` rămâne singura colecție fără plafon; `zile`
e limitat la 400 de intrări, `note` la 20 per materie. Dacă apare în practică, plafonarea lui
`antren` e următorul pas.
