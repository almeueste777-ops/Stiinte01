---
titlu: Jurnal 2026-08-22 — Temă, setări, conținut v03
tip: jurnal
versiune: "03"
actualizat: 2026-08-22
tags: [jurnal, tema, setari, continut]
---

# Jurnal 2026-08-22 — v03, „Temă, setări, conținut complet"

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Palete și tokenuri]] ·
[[Versiuni]] · [[Jurnal 2026-08-21 — Responsiv v02]]

## Cerința

Trei lucruri, spuse de utilizator:

1. **„Aplicația am găsit-o pe modul dark, vreau să aibă și modul luminos."**
2. **„Aplicația nu are setări. Implementează tot felul de setări."**
3. **„Vreau să lucrăm pe module"** — fiecare materie în parte, toate lecțiile pe capitole,
   în fiecare an, cât mai complex, apoi test din fiecare lecție și test pe semestru.

## Ce s-a făcut

### Tema comutabilă

Paleta întunecată exista, dar stătea într-un `@media (prefers-color-scheme: dark)`:
urma sistemul, iar utilizatorul nu avea niciun cuvânt de spus. Toate blocurile de
preferință au trecut pe **atribute pe `<html>`**, puse de un bootstrap inline din
`<head>`, înainte de foaia de stil — ca prima pictură să fie deja corectă, fără clipire:

| Atribut | Valori |
|---|---|
| `data-tema` | `luminos` · `intunecat` (automat = preferința sistemului) |
| `data-contrast` | `normal` · `ridicat` |
| `data-miscare` | `completa` · `redusa` |
| `data-transparenta` | `completa` · `redusa` |
| `data-densitate` | `compact` · `confortabil` · `spatios` |
| `data-font` | `sistem` · `serif` · `lizibil` |

Selectorii folosesc `:where()`, care nu adaugă specificitate: cascada a rămas
identică, nu s-a rescris nicio componentă.

> [!warning] Capcana imbricării
> Câteva blocuri erau `@media (prefers-color-scheme: dark)` **înăuntrul** unui
> `@supports` sau al altui media query. Desfăcute naiv, condiția exterioară dispărea
> în tăcere. Rezolvat prin atribute combinate:
> `[data-transparenta="redusa"][data-tema="intunecat"]`.

### Ecranul de setări

Ruta `#/setari`, deschisă din rotița barei de sus. Trei secțiuni: **aspect** (temă,
contrast, transparență, mișcare, densitate, font, mărimea textului 80–150%),
**studiu** (clasa implicită, amestecarea întrebărilor și opțiunilor, explicații,
cronometru, număr de întrebări) și **date** (export/import JSON, resetări separate).

Setările lucrează prin tokeni, nu prin excepții: densitatea rescrie scara de spațiere,
fontul rescrie familia și înălțimea rândului, mărimea textului scalează `font-size` pe
`html`. De aceea se propagă în toată aplicația fără cod special.

### Conținutul: 60 de module

Toată matricea planului-cadru, materie × an. Un singur fișier ar fi însemnat câțiva
megaocteți descărcați la fiecare pornire, așa că modelul s-a împărțit:

```
data/sursa/*.txt        DSL text, scris de om
   └─ tools/text-in-modul.mjs
data/module/<id>.json   sursa de adevăr, un fișier per materie×an
   └─ tools/construieste-index.mjs
data/continut.json      index generat (titluri, cifre, structura capitolelor)
sw.js  /* MODULE */     listă de precache generată
```

`tools/verifica-continut.mjs` refuză tot ce nu ține: materie inexistentă în
planul-cadru, id duplicat, întrebare sub 8 caractere, opțiuni identice, explicație
lipsă, rezumat sub 120 de caractere, sub trei carduri sau trei întrebări, teză lipsă
la un semestru. A prins, în timpul scrierii, o teză cu o întrebare de șapte caractere
și o grilă de franceză cu aceeași opțiune greșită scrisă de două ori.

Modulele se cer **leneș**, la deschidere, cu memoizare, cu un token de randare care
anulează rezultatul dacă utilizatorul a navigat între timp și cu un indicator de
încărcare care apare doar după 400 ms. Rămân totuși toate în precache: altfel
aplicația instalată ar avea lecțiile doar cât timp există rețea.

> [!abstract] Bilanț de conținut
> **60 de module · 206 capitole · 580 de lecții · 2320 de carduri · 3614 întrebări**
> — test la fiecare lecție, teză la fiecare semestru.

### Vaultul, adaptat

[[Arhitectura aplicației]] descrie modelul vechi, cu un modul per materie.
`tools/graphify.py` citește acum `data/module/*.json`, aplatizează capitolele
păstrând pe fiecare lecție capitolul din care vine, iar cheia devine **materie +
clasă** — altfel Istoria din clasa a IX-a ar fi suprascris-o pe cea din a XII-a.
Folder nou `Module`, câte o notă per materie×an; nota de materie a devenit umbrelă,
cu un rând per an. Harta mermaid, care ar fi avut 60 de noduri ilizibile, s-a
regrupat pe clase și arii.

Vaultul are acum **811 note** și **5367 de wikilink-uri**, fără legături rupte și
fără note orfane.

## Verificare

- Verificatorii locali: JSON, sintaxă JS, structură CSS, vault — toți trecuți.
- **Pași noi în CI:** validarea celor 60 de module, `verifica-continut.mjs` și un pas
  care rulează generatorul de index și cere ca `data/continut.json` și `sw.js` să nu
  se schimbe — adică indexul comis să fie chiar cel generat din module.
- `tools/test-sw.mjs`, cu service worker **activ**: prima instalare fără reîncărcare,
  60 de carduri de materii vizibile sub SW, exact o reîncărcare la update, stabil
  după, zero erori JS.
- Echipa de agenți, ca la fiecare rulare: [[Raport verificare v03]].
