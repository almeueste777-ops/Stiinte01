---
titlu: Palete și tokenuri
tip: design
strat: 1
versiune: "01"
actualizat: 2026-08-21
tags: [design, culori, tokenuri, contrast, accesibilitate]
---

# Palete și tokenuri — stratul 1

Legături: [[Design System v01]] · [[Glass + Neomorfism]] · [[Animații iOS]] · [[Componente UI]]

> [!quote] Teza estetică
> **„Lumină de după-amiază pe hârtie de manual.”**
> Aplicația e o unealtă de studiu ținută într-o mână. Trebuie să pară hârtie caldă sub un
> soare jos — nu un tablou de bord. Suprafețele derivă din nisip, smântână și lut. Cerneala e
> espresso, niciodată gri.

> [!info] Revizuit în v05 — „bleumarin de miezul nopții + nisip cald”
> Paleta a fost recolorată după planșele de referință (Midnight Navy + Warm Sand + scara de
> aur). **Structura tokenilor e neatinsă**; s-au schimbat doar valori. Pe scurt: suprafețele
> temei luminoase rămân nisip cald; **brandul devine bleumarin** (`#234B6F`) în loc de
> teracotă, iar **accentul devine aur** (`#C8901E`). **Tema întunecată trece pe bleumarin de
> miezul nopții** (fundal `#141F33`), cu cerneală de nisip fildeș. Numerele de mai jos sunt
> actualizate; recalculul complet de contrast e în [[Jurnal 2026-08-22 — Cromatică v05]].

## Suprafețe — trei niveluri

Ierarhia de adâncime se face din **culoare**, nu din umbră. Umbra doar o confirmă.

| Nivel | Token | Deschis | Întunecat | Unde se folosește |
|---|---|---|---|---|
| îngropat | `--surface-sunken` | `#EDE0CE` | `#0E1626` | câmpuri, șanțul barei de progres, zone inactive |
| bază | `--surface-base` | `#F7EEE2` | `#141F33` | fundalul paginii |
| ridicat | `--surface-raised` | `#FDF6EC` | `#1E2C46` | carduri, butoane, foi |
| rezervă opacă | `--surface-overlay` | `#FBF2E6` | `#24334F` | ce devine sticla când nu există `backdrop-filter` |

Neutrele **temei luminoase** au **hue 20–40°** (portocaliu-cald) — diferența dintre „gri cu
un strop de cald” și *chiar* cald. Pe **întunecat**, din v05, suprafețele trec deliberat pe
**hue ~215°** (bleumarin de miezul nopții); cerneala rămâne însă nisip cald, ca să păstreze
„căldura” din „adâncime și căldură”.

## Cerneală, linii, brand

```
--ink        #2A1C12   espresso — text principal
--ink-muted  #6E5847   lut cenușiu cald — text secundar
--ink-faint  #9A8271   decorativ (exclus din pretențiile AA)
--hairline   #E0CDB6   linia de 1px, caldă, nu gri

--brand      #234B6F   bleumarin de miezul nopții — identitatea aplicației
--accent     #C8901E   aur / miere — DOAR umplutură
--accent-text #8A5410  fratele sigur pentru text
--ok         #3F6B2E   mușchi cald
--bad        #A32218   roșu-rugină
```

> [!warning] Capcana aurului
> `--accent` (#C8901E) dă doar **2,54:1** ca text pe smântână — mult sub pragul AA.
> De aceea are un frate dedicat, `--accent-text` (#8A5410, **5,83:1**), iar `--accent`
> rămâne **exclusiv culoare de umplutură**. Fără această despărțire, aplicația ar fi arătat
> bine și ar fi picat la audit.
>
> Astăzi `--accent-text` nu e folosit ca text nicăieri: e o valoare **rezervată**, pusă acolo
> ca următorul care are nevoie de aur pe text să nu ia varianta greșită. Aceeași
> capcană a fost prinsă a doua oară, la stările testului — vezi [[Design System v01]].

## Contrast măsurat

Calculat pe valorile hex reale (luminanță relativă sRGB). Pragul AA pentru text normal: **4.5:1**.

| Pereche | Deschis | Întunecat |
|---|---|---|
| `--ink` pe fundal | 14.36 | 14.01 |
| `--ink` pe card | 15.37 | 11.86 |
| `--ink-muted` pe card | 6.21 | 6.12 |
| `--ink` peste sticlă (compus pe cel mai defavorabil punct) | ≥13,96 | ≥12,81 |
| `--ink-muted` peste sticlă (idem) | ≥5,64 | ≥5,85 |
| `--brand` ca text pe card | 8.48 | 6.69 |
| `--ok` pe fundalul paginii | 5,45 | 7,94 |
| `--bad` pe fundalul paginii | 6,53 | 7,74 |
| `--ink-muted` la `prefers-contrast: more` | 7.82 (AAA) | 8.61 (AAA) |

Valorile pentru sticlă sunt **compuneri alfa** peste cel mai defavorabil punct al
gradientului ambiental — nu tokenul plat. Sunt deci **limite inferioare**: în practică ies mai
bine, fiindcă estomparea amestecă punctele extreme. Altfel cifra ar fi fost o minciună
confortabilă.

## Fundalul ambiental

Patru gradiente pure CSS (trei `radial-gradient` + un `linear-gradient`), aplicate `fixed`.

`fixed` nu e un detaliu: la derulare, sticla vede pete diferite de culoare pe dedesubt și
**pare reală**. Cu `scroll`, estomparea ar fi constantă și sticla ar arăta ca o folie mată.

Pe întuneric, aceleași centre, dar jar în loc de soare.

## Tipografie și spațiere

- **Font**: doar fonturi de sistem, `-apple-system` primul → pe iPhone se randează SF Pro,
  ceea ce dă instant senzația de aplicație nativă. Zero fonturi externe (constrângere offline).
- **Scară modulară** rație 1.2 (terță minoră), bază 16px: `--fs-100` … `--fs-700`.
  Corpul de text nu coboară niciodată sub 16px.
- **Spațiere**: grilă de 4px, `--sp-0` … `--sp-12`.
- **Raze**: `--r-1` (10px) … `--r-6` (38px), cu `--r-4` = **24px** ca rază-semnătură a cardului.
  Regula de imbricare: `raza_interioară = raza_exterioară − padding`.

## Preferințele utilizatorului — tratate, nu ignorate

| Preferință | Ce se întâmplă |
|---|---|
| `prefers-color-scheme: dark` | temă **bleumarin** de miezul nopții (din v05); umbrele neomorfice **recalculate** (pe întuneric „lumina” e o ridicare de oțel-bleu `#3E5474`, nu maro) |
| `prefers-reduced-transparency` | sticla devine opacă, gradientul ambiental dispare |
| `prefers-contrast: more` | umbrele moi devin linii de 1px reale, textul secundar urcă la AAA |
| `prefers-reduced-motion` | vezi [[Animații iOS]] |
| fără `backdrop-filter` | `@supports not (…)` → suprafață caldă opacă |

## Punte de compatibilitate

Numele vechi (`--bg`, `--card`, `--muted`, `--line`, `--radius`, `--shadow`) fuseseră
păstrate inițial ca alias-uri, fiindcă `app.js` scria un stil inline cu `var(--line)`.
Redesignul a scos acel stil inline, deci motivul a dispărut — iar cinci din cele șase
alias-uri nu mai erau citite de nimeni. **Au fost șterse**, iar utilizările lui `--line` au
trecut pe numele canonic `--hairline`. `app.js` nu mai scrie azi nicio variabilă CSS în afară
de `--p`, `--i`, `--tab-i` și `--tab-count`.
