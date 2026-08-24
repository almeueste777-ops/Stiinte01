---
titlu: Jurnal 2026-08-24 — Mai multe lecții v07
tip: jurnal
versiune: "07"
actualizat: 2026-08-24
tags: [jurnal, continut, lectii, programa, expansiune]
---

# Jurnal 2026-08-24 — v07, „Mai multe lecții la fiecare materie"

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]] ·
[[Jurnal 2026-08-23 — Motivație și progres v06]]

## Cererea

> „M-am uitat pe programa lecțiilor implementate la fiecare materie, pe fiecare an, și mi se pare
> foarte săracă. Lecțiile sunt puține. Compară cu alte aplicații de acest gen, vezi dacă au mai
> multe lecții și implementează și în aplicație, chiar dacă durează mai mult."

Și, după prima încercare de a le face pe toate deodată, o rafinare de proces:

> „Iei doar un singur modul și îl termini, nu toate odată. Unul singur, cap-coadă."

## Diagnoza

Sistemul de învățare era bogat (carduri, teste, teze, repetiție eșalonată — vezi
[[Sistemul de învățare]]), dar **acoperirea programei** era subțire: 60 de module cu în medie
**9,7 lecții** fiecare, de obicei un singur capitol pe semestru. Nu lipsea mecanismul, lipsea
materialul. Aplicațiile serioase de bac tratează fiecare temă din programă separat, cu recapitulare
proprie.

## Ce s-a implementat

Fiecare modul a fost **extins aditiv** — 2–3 capitole noi (de regulă `c4/c5/c6`), fiecare cu lecții
complete (rezumat, idei-cheie, termeni, carduri, grilă), plus întrebări noi la ambele teze
semestriale. Conținutul se scrie în DSL-ul din `data/sursa/*.txt` și se compilează cu
`tools/text-in-modul.mjs`; indexul (`data/continut.json`) și lista MODULE din `sw.js` se regenerează
cu `tools/construieste-index.mjs`.

| | Înainte | După |
|---|---|---|
| Capitole | 206 | **412** |
| Lecții | 580 | **1152** |
| Carduri | 2320 | **4608** |
| Întrebări de lecție | 2320 | **4608** |
| Întrebări de teză | 1294 | **1942** |

> [!note] De ce aditiv, nu rescris
> Elevii au deja progres pe lecțiile vechi (lecții citite, carduri stăpânite, note). A rescrie
> conținutul ar fi însemnat să le pierdem urma. Regula rulării: **nimic vechi nu se schimbă, doar
> se adaugă** — lecțiile noi apar lângă cele existente, cu id-uri noi.

## Proces — un modul, cap-coadă

Prima abordare a fost paralelizarea (mai mulți agenți, câte un modul fiecare). Cererea a doua a
oprit-o: fiecare modul se face **complet** înainte de următorul. Rutina per modul:

1. editarea sursei (`data/sursa/<id>.txt`) — capitole noi + completarea tezelor;
2. `node tools/text-in-modul.mjs data/sursa/<id>.txt` → `data/module/<id>.json`;
3. verificarea aditivității față de snapshot;
4. `node tools/verifica-continut.mjs`;
5. `node tools/construieste-index.mjs` (index + MODULE);
6. commit + push (cu `fetch`+`rebase` la nevoie — vezi mai jos).

Ultimul modul închis: `stiam-12` (științe integrate, cl. a XII-a), 9 → 16 lecții.

## Aditivitatea, garantată mecanic

Un verificator scris pentru rulare (`scratchpad/verifica-aditiv.mjs`) compară fiecare modul cu un
snapshot al stării dinainte de expansiune și **respinge** orice lecție, capitol sau întrebare de
teză *veche* modificată sau ștearsă; acceptă doar adăugiri. De asemenea verifică antetul (materie,
clasă, arie, bac) neschimbat. Verdict final pe tot setul:

```
TOTAL: 580 vechi + 572 noi = 1152 lecții
ADITIV: OK — tot conținutul vechi e neschimbat, doar adaugiri.
```

## Versionare

- `sw.js`: `CACHE` v10 → **v11** (s-au schimbat fișiere publicate — modulele și indexul, pe care
  aplicația le descarcă la runtime). Lista MODULE din `sw.js` **nu** s-a schimbat: id-urile
  (căile fișierelor) au rămas aceleași, doar conținutul lor a crescut.
- `?v=` din `index.html`/`SHELL`: **neatins** — `app.css`/`app.js` n-au fost modificate.
- `data/versiuni.json`: intrare nouă v07 (cache 11), scrisă pentru elev, `curenta` → „07".

## Verificare

Bateria locală trece integral: JSON valid pe toate cele 60 de module + index; `verifica-continut`
— *60 module, 1152 lecții, structură validă*; index regenerat și `git diff` curat (continut.json
și MODULE sincronizate); `versiuni.json` v07 ↔ CACHE 11; `node --check` pe JS; CSS; vault fără
legături rupte. Nu s-a atins codul aplicației (JS/CSS/HTML), deci comportamentul UI rămâne cel
verificat la v06.

> [!info] Divergență la push (graphify)
> Workflow-ul `graphify.yml` regenerează jumătatea de conținut a vaultului la fiecare push în
> `data/` și face un commit înapoi pe branch. De aceea fiecare push al rulării a cerut adesea
> `git fetch` + `git rebase origin/<branch>` înainte de retry. Nu e conflict real: eu ating
> `data/`, generatorul atinge `vault/` — fișiere disjuncte.
