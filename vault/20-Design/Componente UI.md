---
titlu: Componente UI
tip: design
strat: 2
versiune: "01"
actualizat: 2026-08-21
tags: [design, componente, iconite, responsiv, accesibilitate]
---

# Componente UI — stratul 2

Legături: [[Design System v01]] · [[Palete și tokenuri]] · [[Glass + Neomorfism]] · [[Animații iOS]]

> [!quote] Conceptul
> Cadrul plutește: o bară de sus din sticlă mată pe sub care curge pagina, și o pilulă de
> sticlă desprinsă de marginile ecranului. Tot ce e în pagină e opusul: relief moale,
> luminat cald. Cardurile se ridică, apăsările se scufundă, șanțul barei de progres e
> săpat în suprafață și umplut cu un gradient de chihlimbar care strălucește.

## Bara de taburi — piesa de semnătură

Nu e o bară lipită de marginea de jos. E o **pilulă de sticlă mată**, desprinsă de margini,
ridicată deasupra zonei sigure (`env(safe-area-inset-bottom)`), cu o pastilă de brand care
alunecă sub tabul selectat.

Detalii care contează:
- lățime `min(100% − 24px, 430px)` — pe tabletă nu se întinde absurd;
- `.tab-ind` e `position:absolute`, deci **nu intră** în grila de 5 coloane;
- poziția vine din `--tab-i`, scris din `app.js` — fără dependență de `:has()`;
- la `prefers-reduced-motion` pastila sare, nu alunecă.

## Bara de sus

Sticlă translucidă, `position:fixed`, conținutul curge pe dedesubt. `body` primește
`padding-top` egal cu înălțimea ei plus zona sigură de sus.

## Iconițele

Caracterele unicode geometrice (`●`, `☰`, `▣`, `✓`, `▩`) au fost înlocuite cu **SVG inline**,
24×24, `stroke="currentColor"`, grosime 1,75, capete rotunde, fără umplere — geometrie în
spiritul SF Symbols.

| Tab | Simbol |
|---|---|
| Acasă | casă |
| Materii | straturi suprapuse |
| Carduri | două carduri suprapuse |
| Test | clipboard cu bifă |
| Plan | calendar cu grilă de puncte |

Plus un chevron pentru butonul „înapoi”. Fiindcă moștenesc `currentColor`, starea activă
(alb pe pastila de brand) nu cere nicio regulă în plus.

> [!tip] Punctele din iconița „Plan”
> Sunt subtrasee de lungime aproape zero (`M8 13.9h.01`), randate ca puncte de
> `stroke-linecap="round"`. Zero noduri în plus.

## Componentele, pe scurt

| Componentă | Concept |
|---|---|
| `.card` | placă neumorfică ridicată, cu luciu în muchia de sus |
| `.card.tap` | se **scufundă** la apăsare (`--nm-pressed`), nu clipește; chevron doar pe cardurile-listă, nu pe dalele din `.grid2` |
| `.chip` | pastilă neumorfică; selectată = umplută cu gradient de brand |
| `.pill` | insigna BAC, chihlimbar plin; `.pill.soft` = pastilă scufundată |
| `.btn` | relief ridicat; apăsarea îl împinge în suprafață (`translateY(1px)` + inset) |
| `.bar` | șanț neumorfic + umplere de chihlimbar cu halou și sclipire pe jumătatea de sus |
| `.opt` | ridicat → apăsat → rezolvat; bulinuță scufundată ca un buton radio tactil |
| `.opt.correct` | salvie caldă + bifă desenată din două muchii de bordură |
| `.opt.wrong` | lut ars + X din două gradiente liniare |
| `.flash` | sticlă înaltă cu reflex specular oblic și căldură în muchia de jos |
| `textarea` | puț neumorfic scufundat |
| tabele | rânduri aerisite pe o placă, antet lipicios sub bara de sus |

## Tabelele — trucul marginilor negative

Ecranul „Plan” e plin de tabele. Rândurile trebuie să atingă muchiile plăcii, altfel antetul
lipicios plutește ciudat în interiorul cardului.

```css
.card:has(> table){ overflow:clip }          /* clip, NU hidden — hidden ucide sticky */
.card > table{
  width:  calc(100% + var(--sp-6) * 2);
  margin: calc(var(--sp-6) * -1);            /* anulează exact padding-ul cardului */
}
th{ position:sticky; top:calc(var(--topbar-h) + var(--safe-t)) }
```

> [!warning] `overflow:hidden` ar fi ucis `position:sticky`
> `hidden` creează un container de derulare; antetul s-ar fi lipit de el, nu de pagină.
> `clip` nu creează container de derulare. Aceeași logică pentru `.stage` din
> [[Animații iOS]], unde `overflow-x:clip` păstrează `sticky` funcțional.

## Stări detectate din structură

Fără să atingem `app.js`, trei stări sunt detectate din forma DOM-ului:

| Selector | Ce recunoaște |
|---|---|
| `.card > p:only-child:not(.muted)` | stare goală → text centrat, aerisit |
| `.card > p.muted:only-child` | notă liniștită → riglă caldă în stânga |
| `.card:has(> .bar):has(> .btn)` | **cardul de rezultat al testului** — singurul care are și bară, și butoane → titlu mare, halou de chihlimbar, centrat |

## Accesibilitate

- Inel de focus **cald** (`outline` de 2,5px în teracotă + halou), niciodată albastrul implicit.
- Ținte de atingere ≥ 44×44px — verificat automat pe toate ecranele și toate lățimile.
- Contrastul textului e păstrat și peste sticlă (vezi [[Palete și tokenuri]]).
- La `prefers-contrast: more`, cardurile, opțiunile și chipsurile primesc contur de cerneală,
  iar textul secundar urcă la nivel AAA.

## Responsiv

| Prag | Ce se schimbă |
|---|---|
| ≤ 380px | marginile și padding-urile scad cu o treaptă, tabelele se strâng, bara de taburi se lățește până la marginile disponibile |
| ≥ 768px | mai mult aer, raze mai mari, cardul de memorare urcă la 320px înălțime; coloana rămâne la 760px |
| peisaj, ≤ 520px înălțime | cromul se subțiază (bara de sus 46px, taburile 40px), cardul de memorare coboară la 150px |
