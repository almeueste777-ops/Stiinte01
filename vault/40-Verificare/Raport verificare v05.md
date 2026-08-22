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

_(Se completează cu constatările lor la finalul rulării.)_
