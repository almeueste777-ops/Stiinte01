---
titlu: Glass + Neomorfism — regula hibridă
tip: design
strat: 1
versiune: "01"
actualizat: 2026-08-21
tags: [design, glassmorphism, neomorfism, regula-hibrida]
---

# Glass + Neomorfism — regula hibridă

Legături: [[Design System v01]] · [[Palete și tokenuri]] · [[Componente UI]]

Cele două stiluri sunt, de obicei, amestecate la întâmplare: puțină transparență ici, puțină
umbră moale colo. Rezultatul e zgomot. Aici există **o singură regulă**, aplicată fără excepție.

> [!important] Regula
> **Adâncimea aparține conținutului. Transparența aparține cadrului.**
>
> - Ce **plutește peste** conținut și trebuie să lase conținutul să se ghicească dedesubt → **STICLĂ**
> - Ce **este** conținut, se apasă cu degetul, trebuie să rămână lizibil la derulare → **NEOMORFIC**
> - **Niciodată amândouă pe același element.**

## Repartiția, element cu element

| Sticlă (cadru plutitor) | Neomorfic (conținut în pagină) |
|---|---|
| `.topbar` | `.card` |
| `.tabbar` | `.btn`, `.btn.ghost` |
| foi modale / overlay | `.chip` |
| `.badge` (stare de rețea, plutește) | `.opt` (opțiunile testului) |
| — | `.bar` (șanț îngropat) |
| — | `.flash` (cardul de memorare) |
| — | `textarea` (puț îngropat) |

## De ce regula asta și nu alta

Justificarea nu e stilistică, ci **fizică și de performanță**:

1. **Sticla își merită estomparea doar dacă are ceva de estompat.** Un `backdrop-filter` peste
   o suprafață plată e cost de GPU pentru zero informație vizuală. De aceea există gradientul
   ambiental `fixed` — el e „materia primă” pe care o vede sticla. Vezi [[Palete și tokenuri]].
2. **Neomorfismul se citește ca „apăsabil” tocmai pentru că e opac și nemișcat.** Un card
   semi-transparent care își schimbă fundalul la derulare nu mai pare un obiect solid, deci
   nu mai pare că se poate apăsa.
3. **Costul de randare stă unde trebuie.** Sticla e scumpă (estompare pe fiecare cadru), dar
   se aplică doar la **două** elemente fixe. Neomorfismul e ieftin (umbre statice), și se
   aplică la zecile de carduri care se derulează.

## Anatomia sticlei

Patru ingrediente. Lipsa oricăruia și efectul se prăbușește în „dreptunghi cețos”:

```css
background: var(--glass-bg);                    /* 1. tentă caldă semi-transparentă */
backdrop-filter: var(--glass-blur);             /* 2. blur(20px) saturate(180%)     */
border-…: 1px solid var(--glass-border);        /* 3. muchia care „vinde” sticla    */
box-shadow: var(--glass-shadow);                /* 4. umbră + linie interioară sus  */
```

Plus un pseudo-element cu `--glass-specular` pentru sclipirea diagonală.

> [!tip] `saturate(180%)`
> Fără el, culorile de dedesubt se spală și sticla arată murdară. Cu el, teracota din
> gradientul ambiental răzbate prin sticlă și o face să pară **caldă**, nu albă.

## Anatomia neomorfismului

Umbrele **derivă din culoarea suprafeței**, nu sunt negru cu opacitate mică. Aceasta e
diferența dintre neomorfism adevărat și „card cu box-shadow”.

```
--nm-l  255,253,247   nisipul dus spre alb   (lumina, stânga-sus)
--nm-d  172,133,90    nisipul dus spre lut   (umbra,  dreapta-jos) — CALDĂ, nu neagră
```

Patru stări:

| Token | Efect | Unde |
|---|---|---|
| `--nm-raised` | ridicat, ±7px | carduri, butoane |
| `--nm-subtle` | ridicat discret, ±3px | elemente mici, chipsuri |
| `--nm-pressed` | `inset` — apăsat | `:active`, câmpuri, șanțuri |
| `--nm-flat` | linie de 1px + umbră minimă | rezervă la contrast ridicat |

Pe temă întunecată tripletele se **recalculează**: `--nm-l` devine `92,70,52` (o ridicare
caldă slabă, nu alb) și `--nm-d` devine beznă curată. Aceeași formulă cu valori de lumină de
temă deschisă ar fi dat, pe espresso, un contur cenușiu murdar.

## Problema de accesibilitate, rezolvată

Neomorfismul are o reputație proastă la accesibilitate — pe merit, fiindcă lumea scrie text
peste umbre moi și contrastul se duce.

**Soluția adoptată:** adâncimea neomorfică descrie **doar conturul containerului**.
Lizibilitatea o duce exclusiv perechea cerneală/suprafață — care e verificată la ≥ 4.7:1
pentru text secundar și ≥ 12:1 pentru text principal. *Nu se scrie niciodată text pe umbre.*

Iar când utilizatorul cere `prefers-contrast: more`, neomorfismul **cedează primul**: umbrele
moi se transformă în linii de 1px reale. Efectul decorativ dispare, informația rămâne.
