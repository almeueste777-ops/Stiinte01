---
titlu: Design System v01 — „Sticlă caldă”
tip: design
versiune: "01"
actualizat: 2026-08-21
tags: [design, sistem, v01, glassmorphism, neomorfism, ios]
---

# Design System v01 — „Sticlă caldă”

Nota-umbrelă a sistemului de design. Legături:
[[Științe Sociale — MOC]] · [[Palete și tokenuri]] · [[Glass + Neomorfism]] ·
[[Animații iOS]] · [[Componente UI]] · [[Raport verificare v01]] · [[Versiuni]]

> [!quote] Teza
> **„Lumină de după-amiază pe hârtie de manual.”**

## Cum a fost făcut

O echipă de trei designeri, lucrând **în paralel**, fiecare cu un brief propriu și cu
interdicția explicită de a modifica fișiere — fiindcă trei agenți care scriu simultan în
`app.css` s-ar suprascrie reciproc. Fiecare a livrat o specificație; integrarea a fost un
singur pas coerent, cu arbitraj asupra conflictelor.

| Rol | A livrat | Nota |
|---|---|---|
| Art Director | paleta, sticla, relieful, tipografia, spațierea, contrastul | [[Palete și tokenuri]], [[Glass + Neomorfism]] |
| Motion Designer | curbele, tranzițiile, feedbackul la atingere | [[Animații iOS]] |
| UI / Component Designer | fiecare componentă, iconițele, tabelele, responsivul | [[Componente UI]] |

## Structura fișierului `assets/app.css`

Patru straturi, **cu ordine impusă** — stratul 3 suprascrie intenționat reguli din stratul 2:

```
1   TOKENI            paleta caldă, sticla, relieful, tipografia, spațierea
1b  TOKENI DERIVAȚI   puntea dintre paletă și componente (fără culori noi)
2   COMPONENTE        fiecare element vizibil
3   MIȘCARE           curbele, tranzițiile de ecran, feedbackul la atingere
```

**1342 de linii**, toate comentate în română. O verificare automată confirmă că toți cei
113 tokeni folosiți sunt declarați; singurele excepții sunt cele patru variabile puse din JS
(`--p`, `--i`, `--tab-i`, `--tab-count`), fiecare cu valoare de rezervă în CSS.

## Regula care ține totul laolaltă

> **Adâncimea aparține conținutului. Transparența aparține cadrului.**

Detaliat în [[Glass + Neomorfism]].

## Conflictele dintre designeri și arbitrajul lor

Trei designeri în paralel produc trei convenții de denumire. Conflictele n-au fost prevenite
(asta ar fi serializat lucrul), ci arbitrate la integrare:

| # | Conflict | Decizie |
|---|---|---|
| 1 | `--sp-1…6` cu valori diferite | rămâne grila canonică de 4px; 57 de referințe remapate mecanic |
| 2 | `--glass-blur`: filtru complet vs. lungime | rămâne filtrul complet — doar așa rezerva `none` produce `backdrop-filter: none` valid |
| 3 | `--ok-ink` folosit ca text pe fundal difuz | tokenuri noi `--ok-text` / `--bad-text`, calculate și verificate |
| 4 | două implementări de indicator de tab | rămâne elementul `.tab-ind` (fără dependență de `:has()`), cu aspectul propus de UI designer |
| 5 | selectorii de mișcare pe `.tab span` (eticheta) | mutați pe `.ico` (iconița) |
| 6 | bara de progres: `scaleX` vs `width` | rămâne `width` — `scaleX` turtește capătul rotund al pilulei |
| 7 | două blocuri `prefers-reduced-motion` | rămâne cel specific, care tratează și rotirea 3D |

> [!note] Conflictul nr. 3 e cel important
> Alb pe verde-pal e ilizibil. Era un defect invizibil la o simplă privire, care ar fi ieșit
> abia la audit. Vezi capcana chihlimbarului din [[Palete și tokenuri]] — același tipar:
> o culoare bună ca umplutură, proastă ca text.

## Ce s-a schimbat în v01

Vezi [[Versiuni]] pentru lista completă.

## Ce NU s-a atins, intenționat

Faza 1 e strict estetică:
- conținutul din `data/` — 8 module, 25 de lecții, 41 de carduri, 25 de întrebări;
- logica de progres și de notare;
- cheia de `localStorage` (`stiinte01:v1`) — **progresul elevilor existenți nu se pierde**.
