---
titlu: Animații iOS
tip: design
strat: 3
versiune: "01"
actualizat: 2026-08-21
tags: [design, animatii, ios, miscare, accesibilitate]
---

# Animații iOS — stratul 3

Legături: [[Design System v01]] · [[Componente UI]] · [[Arhitectura aplicației]]

> [!quote] Teza
> **Mișcarea iOS se citește ca fizică fiindcă este asimetrică.**
> Curba de navigație UIKit, `cubic-bezier(.32,.72,0,1)`, consumă majoritatea distanței în
> prima treime a timpului, apoi planează până la oprire. Acea coadă lungă e ceea ce ochiul
> citește ca **masă**, nu ca interpolare cronometrată. Un `ease-in-out` simetric pare
> mecanic prin comparație.
>
> Iar apăsarea cade instantaneu și revine încet. **Acea asimetrie apăsare/eliberare, mai
> mult decât orice curbă, e ceea ce mâna recunoaște ca iOS.**

## Cele nouă curbe

Fiecare are un rol declarat. O curbă fără rol e o curbă folosită greșit.

| Token | Valoare | Pentru ce |
|---|---|---|
| `--ease-ios` | `.25,.1,.25,1` | curba implicită Core Animation: schimbări neutre de stare |
| `--ease-in-out-ios` | `.42,0,.58,1` | mișcări scurte care încep și se termină pe ecran |
| `--ease-nav` | `.32,.72,0,1` | **curba care „sună” a iOS**: push/pop de ecran, foi modale |
| `--ease-out-ios` | `.16,1,.3,1` | decelerare pură — INTRĂRI |
| `--ease-in-ios` | `.42,0,1,1` | accelerare pură — IEȘIRI |
| `--ease-spring` | `.34,1.56,.64,1` | arc cu depășire ~7%, o singură oscilație |
| `--ease-spring-soft` | `.22,1.2,.36,1` | arc de ~3% pentru suprafețe mari |
| `--ease-snap` | `.25,.46,.45,.94` | micro-interacțiuni, fără depășire |
| `--ease-press` | `.4,0,.6,1` | apăsarea: aproape liniară la început, ca degetul să „prindă” |

> [!tip] De ce două arcuri
> Pe o suprafață lată, o depășire de 7% se citește ca **elastic**; pe una mică, ca **solid**.
> De aceea cardul care se rotește folosește arcul blând, iar pastila de tab pe cel normal.

## Durate

iOS e rapid. `--dur-micro` 140ms (apăsare) · `--dur-fast` 180ms (eliberare) ·
`--dur-base` 240ms (fade, element de listă) · `--dur-nav` 340ms (ecran complet —
`UINavigationController` folosește 0,35s) · `--dur-flip` 460ms · `--dur-bar` 560ms.

## Ce se mișcă și cum

| Element | Mișcarea |
|---|---|
| Navigare înainte | intră din dreapta cu fade + scalare 0,99→1; cel vechi face **parallax** spre stânga |
| Navigare înapoi | oglinda |
| Schimbare de tab | **nu alunecă lateral** — fade + cascadă, ca între rădăcini |
| Re-randare pe același ecran | doar 140ms de opacitate |
| Liste | cascadă, cu **plafon de 256ms** |
| Atingere | scalare descrescătoare cu suprafața: card 2%, buton 4%, chip 6%, iconiță 12% |
| Card de memorare | rotire 3D reală, `rotateY(180deg)` |
| Bara de taburi | pastila alunecă cu arc, iconița „pocnește” |
| Răspuns corect | puls scurt de scalare |
| Răspuns greșit | **scuturatul de la codul de acces iOS**: 3 oscilații amortizate, 400ms |

> [!important] Parallaxul cere o clonă
> Routerul face `view.innerHTML = ''`. Ecranul vechi dispare instantaneu — deci nu are ce
> face parallax. Soluția: `spawnGhost()` clonează `#view` *înainte* de golire, îi scoate
> `id`-urile (ca să nu existe duplicate), îl marchează `inert` + `aria-hidden`, îi
> compensează poziția de scroll prin `--ghost-y`, și îl animează în paralel.
> Clona se autodistruge la `animationend`. Ecranele grele (peste 400 de noduri — Planul)
> sar peste clonă și fac fade: parallaxul nu merită costul acolo.

## Plafonul cascadei

```css
animation-delay: min(calc(var(--i,0) * var(--stagger-step)), var(--stagger-max));
```

Fără `min()`, o listă de 40 de elemente × 32ms ar dura **1,3 secunde** până apare ultimul.
Cu plafon la 256ms, primele 8 elemente cascadează, restul intră odată. Nimeni nu observă
diferența, dar toată lumea observă întârzierea.

## `prefers-reduced-motion` — nu e o notă de subsol

Blocul dezactivează **explicit** fiecare translație, scalare, rotire și scuturat:
- tranzițiile de ecran devin un fade simplu, fără cascadă;
- clona de parallax nu se mai creează deloc;
- apăsarea nu mai scalează — devine o estompare;
- **rotirea 3D a cardului devine un fade încrucișat între fețe**, în același loc;
- bara de progres sare direct la valoare.

## Performanță

Se animează aproape exclusiv `transform` și `opacity` → totul rulează pe compozitor.

**Două excepții, ambele o singură dată per interacțiune:**
1. `background-color` la `.opt.correct/.wrong` — o dată per întrebare;
2. `width` la `.bar > i` — abatere deliberată de la propunerea inițială (`scaleX`), fiindcă
   `scaleX` turtește capătul rotund al pilulei și deformează haloul. Aspectul a câștigat.

`will-change` ajută pe `.flip-inner` și `.tab-ind` (elemente unice, animate repetat) și
**strică** pe `.card` / `.opt` / `.chip`: o listă de 40 de carduri ar deveni 40 de straturi
de compozitor, iar pe telefoane ieftine memoria GPU se termină și derularea începe să sară.
