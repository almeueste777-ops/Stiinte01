---
titlu: Raport verificare v05
tip: raport
versiune: "05"
actualizat: 2026-08-22
tags: [verificare, raport, v05, culori, contrast]
---

# Raport verificare v05

Legături: [[Științe Sociale — MOC]] · [[Jurnal 2026-08-22 — Cromatică v05]] ·
[[Palete și tokenuri]] · [[Versiuni]] · [[Raport verificare v04]]

Livrare de **cromatică**: se schimbă valorile tokenilor de culoare, nu structura. Verificarea
s-a concentrat de aceea pe două riscuri specifice recolorării — **lizibilitatea** (contrast
sub prag după schimbarea culorilor) și **tokenii orfani** (un literal vechi rămas neschimbat,
o referință fără definiție) — pe lângă bateria obișnuită.

## Bateria locală

- Parse JSON pe `data/*.json` + `manifest.webmanifest`: trece.
- `node --check assets/app.js && node --check sw.js`: trece.
- `node tools/verifica-css.mjs assets/app.css`: structură validă, acolade echilibrate (1976 linii).
- `python3 tools/verifica_vault.py`: fără legături rupte, fără note orfane.
- Sincronizarea versiunilor: `CACHE` = v9, `cache` din intrarea de sus din `versiuni.json` = 9,
  `?v=9` în `index.html` și `sw.js` (CSS + JS) — coerente. Niciun `?v=8` sau `#191310` rătăcit.

## Contrast — recalcul independent pe valorile hex reale

Prag AA = 4,5:1. Toate perechile critice trec; cea mai strânsă e 6,22:1.

| Pereche | Luminos | Întunecat |
|---|---|---|
| `--brand` ca text pe card | 8,48 | 6,69 |
| `--brand` ca text pe fundal | 7,92 | 7,90 |
| `--brand-ink` pe umplutură de brand | 8,09 | 8,42 |
| `--brand-ink` pe capătul deschis al gradientului de buton | 6,22 | 10,78 |
| `--accent-ink` pe umplutură de aur | 6,49 | 9,44 |
| `--ink` pe card | 15,37 | 11,86 |
| `--ink-muted` pe card | 6,21 | 6,12 |
| „corect" (text pe fundalul compus al opțiunii) | 6,95 | 6,88 |
| „greșit" (idem) | 7,99 | 6,38 |
| `--ink-muted` la contrast ridicat | 7,82 (AAA) | 8,61 (AAA) |

Stările corect/greșit din tema întunecată sunt calculate pe fundalul **compus** (tenta
semantică peste noul bleumarin), nu pe tokenul plat — altfel cifra ar fi fost prea optimistă.

## Constatările echipei de agenți

Doi agenți independenți, lansați în paralel: `verificator-cod` (recitire adversarială a
diff-ului + bateria locală) și `verificator-ui` (server local + capturi Playwright pe scara
320–1440px plus peisaj, ambele teme, cu contrast ridicat și transparență redusă).

### verificator-cod — 3 constatări corectate, niciun blocant

- **#1 (important, corectat).** `--glass-bg-strong` din tema întunecată rămăsese espresso
  (`rgba(52,39,30,.80)`) — sticla densă de sub **butonul „înapoi"** (`.icon-btn`, prezent pe
  fiecare ecran de detaliu) și **fața cardului de memorare** (`#/carduri`). Rezultat: apăreau
  maro pe fundal navy, exact în modul implicit (transparență + contrast normale) — o regresie
  cromatică pe care niciun verificator structural n-o prinde. Corectat pe navy
  `rgba(30,44,70,.82)`, aliniat cu `--glass-bg`. (La transparență redusă / contrast ridicat
  tokenul cădea deja pe `surface-raised` navy, deci defectul era doar în modul implicit.)
- **#2 (minor, corectat).** Comentariul de la override-ul `--ink-muted` de contrast ridicat
  (întunecat) spunea „10.03:1 pe espresso"; fundalul e acum navy → raportul real e **8,99:1**
  (tot AAA). Comentariu actualizat.
- **#3 (minor, corectat).** Iconița PWA (`icons/`) folosea încă gradientul teracotă vechi
  (`#9E4119`). Regenerată pe paleta v05 — câmp bleumarin, bare de nisip fildeș + aur (concept
  preluat din planșa 1) — cu `tools/genereaza-iconite.mjs`.
- **#4 (pre-existent, lăsat).** Câteva umbre calde `rgba(90,58,32,.x)` din stratul de
  componente randează în ambele teme; alfa mic (.10–.30), abia perceptibile pe navy, nu-s
  regresie v05.
- În rest: toți verificatorii locali trec, versiunile sincronizate (v9 / cache 9 / `?v=9`),
  zero tokeni de culoare orfani, contrast recalculat independent — toate perechile AA.

### verificator-ui — curat, niciun defect vizual

**238 de capturi** (9 viewporturi × 2 teme × 9 ecrane statice = 162, plus flux interactiv,
preferințe și comutare de temă), cu măsurători DOM pe fiecare. Rezultat:

- Zero derulare orizontală (`scrollWidth − innerWidth = −15px` peste tot — doar jgheabul de
  scrollbar), zero ținte sub 44px, zero overflow în carduri/tabele/liste.
- Bara de taburi corectă: pilulă flotantă jos sub 1024px, rail vertical stânga (x=16, w=96)
  la ≥1024px cu **overlap conținut = 0**. `meta[theme-color]` corect pe fiecare combinație
  (#F7EEE2 / #141F33). Zero erori de consolă.
- Contrast/lizibilitate confirmate pe capturi: butoane primare (navy în luminos / steel-blue
  în întunecat) net distincte de cele ghost; **stările corect/greșit distincte și lizibile pe
  fundalul bleumarin în tema întunecată** — exact preocuparea semnalată — cu redundanță de
  iconuri (✓/×), nu doar culoare; chipsuri/badge-uri de aur lizibile; sticla cu muchie de aur
  discretă, nu stridentă.
- Preferințe (contrast ridicat, transparență redusă, ambele combinate) pe mai multe ecrane:
  totul opac, cu hairline de 1px, lizibil; stările verde/roșu rămân distincte. Comutarea temei
  live funcționează (fără reîncărcare, `theme-color` urmează tema).

**Confirmarea corecției #1 (după fix).** Am reverificat empiric, pe starea corectată, cele
două suprafețe afectate în tema întunecată: butonul „înapoi" (`.icon-btn`, ecran de materie
și de lecție) și fața cardului de memorare (`#/carduri`) randează acum bleumarin
`rgba(30,44,70,.82)` pe fundal bleumarin — verificat prin eșantionare DOM și captură. Fără
maro.

## Verdict

Livrare curată. Toate constatările verificatorului de cod corectate și reverificate; zero
defecte vizuale. Contrast AA peste tot, majoritatea AAA. Gata de îmbinare.
