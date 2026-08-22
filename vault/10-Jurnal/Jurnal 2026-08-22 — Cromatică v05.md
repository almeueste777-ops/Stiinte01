---
titlu: Jurnal 2026-08-22 — Cromatică v05
tip: jurnal
versiune: "05"
actualizat: 2026-08-22
tags: [jurnal, culori, paleta, cromatica, contrast]
---

# Jurnal 2026-08-22 — v05, „Bleumarin de miezul nopții + nisip cald”

Legături: [[Științe Sociale — MOC]] · [[Palete și tokenuri]] · [[Design System v01]] ·
[[Versiuni]] · [[Jurnal 2026-08-22 — Antrenament v04]]

## Cerința

> „Caută și îmbunătățește aplicația cu culorile din imagini, schimbând doar cromatica și
> foarte puțin designul. Fă cele mai reușite combinații.”

Trei planșe de paletă, ca referință:

1. **Midnight Navy + Warm Sand** — un bleumarin adânc lângă un nisip cald, cu detalii de
   aur; eticheta planșei: *„Perfect together — balance of depth and warmth.”*
2. **Beige → Espresso** — neutre calde: bej, nisip, fildeș, cacao, ciocolată, espresso.
3. **Cream → Bronze** — o scară de galben-auriu: miere, aur, muștar, chihlimbar, bronz.

Deci o **recolorare**, nu un redesign: se schimbă valorile de culoare, nu structura.

## Decizia de design

Planșa 1 e vedeta („perfect împreună”), și se mapează curat pe cele două teme ale aplicației:

- **Tema luminoasă = lumea „Warm Sand”.** Suprafețele de nisip/smântână/lut rămân neatinse
  (erau deja exact paleta „Warm Sand”: Light Sand, Ivory Sand, Soft Beige). Cerneala rămâne
  espresso (planșa 2 — „espresso, niciodată gri”). **Bleumarinul intră ca brand** (butoane,
  linkuri, focus, tab activ), în locul teracotei. **Aurul/mierea** (planșa 3) devine accentul.
- **Tema întunecată = lumea „Midnight Navy”.** Suprafețele espresso devin **bleumarin de
  miezul nopții** (#141F33 / #1E2C46 / #0E1626). Cerneala rămâne **nisip fildeș cald**
  (#F3ECDC) — aici e „căldura” din „adâncime și căldură”. Brandul devine un **oțel-bleu
  deschis** (#9DB6D2), ca să reziste pe fundal închis. Accentul rămâne **aur** (#E7B267).

Aurul e firul comun al ambelor teme — exact rolul pe care îl are în planșa 1, unde toate
liniile, busolele și ramele sunt aurii, legând panoul bleumarin de cel de nisip.

> [!note] De ce brandul, și nu cerneala, devine bleumarin
> „Espresso, niciodată gri” rămâne teza pe lumină: dacă tot corpul de text ar deveni
> bleumarin, s-ar pierde senzația de hârtie caldă. Bleumarinul e o culoare de *identitate*
> (butoane, linkuri), nu de *lectură*. Așa, cele patru familii din planșe sunt toate
> prezente pe lumină: nisip (suprafețe) + espresso (cerneală) + bleumarin (brand) + aur
> (accent). Rolurile tokenilor nu s-au mutat — s-au schimbat doar valorile.

## Ce s-a schimbat, la nivel de token

Nimic structural. Doar valori în stratul 1 (paletă) și 1b (derivate) din `app.css`, plus
oglindirea culorii de temă întunecată în cele două locuri care o scriu în JS.

| Token | Luminos: vechi → nou | Întunecat: vechi → nou |
|---|---|---|
| `--brand` | #9E4119 → **#234B6F** | #EE9068 → **#9DB6D2** |
| `--brand-ink` | #FFF7EF → #F7F1E4 | #2A1206 → #10192A |
| `--accent` | #B4761A → **#C8901E** | #E7B267 (neschimbat) |
| `--surface-base` | #F7EEE2 (neschimbat) | #191310 → **#141F33** |
| `--surface-raised` | #FDF6EC (neschimbat) | #241B15 → **#1E2C46** |
| `--surface-sunken` | #EDE0CE (neschimbat) | #120D0A → **#0E1626** |
| `--ink` | #2A1C12 (neschimbat) | #F4E7D6 → #F3ECDC |
| `--ink-muted` | #6E5847 (neschimbat) | #B49A80 → #BCA98E |

Recalculate coerent cu paleta nouă: `--brand-2`, `--brand-glow`, `--accent-2`,
`--accent-glow`, `--accent-halo`, `--hover-tint`, `--focus-ring`, mesh-ul ambiental nocturn,
neumorfismul nocturn (`--nm-l` trece de la ridicare maro #5C4634 la oțel-bleu #3E5474) și
sticla nocturnă (tentă bleumarin, muchie de aur discretă, firul de lumină rece).

Suprafețele de nisip ale temei luminoase au rămas **identice** — de aceea neumorfismul cald
al temei luminoase (`--nm-l`/`--nm-d`) nu s-a atins.

## Contrast — recalculat, nu presupus

Fiindcă s-au schimbat brandul (luminos) și suprafețele + cerneala + brandul (întunecat), am
recalculat perechile critice pe valorile hex reale (luminanță sRGB, prag AA = 4.5:1). Toate
trec, majoritatea la AAA:

| Pereche | Luminos | Întunecat |
|---|---|---|
| `--brand` ca text pe card | 8.48 | 6.69 |
| `--brand` ca text pe fundal | 7.92 | 7.90 |
| `--brand-ink` pe umplutură de brand | 8.09 | 8.42 |
| `--brand-ink` pe capătul deschis al gradientului (`--brand-2`) | 6.22 | 10.78 |
| `--accent-ink` pe umplutură de aur | 6.49 | 9.44 |
| `--ink` pe card | 15.37 | 11.86 |
| `--ink-muted` pe card | 6.21 | 6.12 |
| stare „corect” (text pe fundalul compus al opțiunii) | 6.95 | 6.88 |
| stare „greșit” (idem) | 7.99 | 6.38 |

Cea mai strânsă pereche e 6.22:1 (`--brand-ink` pe cel mai deschis punct al gradientului de
buton) — confortabil peste 4.5. Stările „corect/greșit” din tema întunecată au fost
recalculate pe fundalul **compus** (tenta semantică peste noul bleumarin), nu pe token plat.

## Versionare

- `sw.js`: `CACHE` `stiinte01-v8` → `v9`.
- `index.html` + `sw.js`: `?v=8` → `?v=9` (și pentru CSS, și pentru JS — ambele s-au schimbat).
- `index.html` + `app.js`: `meta[theme-color]` pe întunecat #191310 → #141F33 (bara de stare
  a browserului urmează noul fundal).
- `data/versiuni.json`: intrare nouă v05 (cache 9), scrisă pentru elev, `curenta` → "05".

## Verificare

Bateria locală: parse JSON pe toate datele + manifest, `node --check` pe `app.js` și `sw.js`,
`node tools/verifica-css.mjs` (structură validă, acolade echilibrate), `python3
tools/verifica_vault.py` (fără legături rupte). Toate trec.

Echipa de agenți: [[Raport verificare v05]].
