---
titlu: Arhitectura aplicației
tip: arhitectura
versiune: "01"
actualizat: 2026-08-21
tags: [arhitectura, pwa, offline]
---

# Arhitectura aplicației

Legături: [[Științe Sociale — MOC]] · [[Versiuni]] · [[Design System v01]]

## Principiul de bază

**Fișierele din depozit sunt exact fișierele care ajung pe server.** Nu există pas de build,
nu există dependențe, nu există `node_modules`. Consecința: deploy instantaneu și nimic de
întreținut — dar și o constrângere reală asupra designului: *tot ce se desenează trebuie să
fie CSS pur și SVG inline*, fără fonturi externe și fără biblioteci de animație.

## Fișiere

| Cale | Rol |
|---|---|
| `index.html` | scheletul paginii, bara de sus, bara de taburi |
| `assets/app.css` | întregul strat vizual: tokenuri → componente → mișcare |
| `assets/app.js` | rutare, ecrane, carduri, test, progres, persistență |
| `sw.js` | service worker: precache + strategii de cache |
| `manifest.webmanifest` | metadatele de instalare |
| `data/curriculum.json` | planul de învățământ: 5 clase, discipline, probe bac |
| `data/continut.json` | **index generat**: titluri, capitole, cifre — nu conținutul propriu-zis |
| `data/module/<id>.json` | sursa de adevăr: un modul = o materie într-un an |
| `data/sursa/*.txt` | conținutul scris de om, în DSL text |
| `_headers` | anteturi HTTP pentru Cloudflare Pages |
| `jurnal.md` | jurnalul de lucru (oglindit în [[Jurnal 2026-08-21 — Design v01]]) |
| `vault/` | acest vault Obsidian, cu două jumătăți — vezi [[Științe Sociale — MOC]] |
| `tools/verifica-css.mjs` | verifică structura foii de stil (rulat și în CI) |
| `tools/genereaza-iconite.mjs` | regenerează iconițele PWA din sursa SVG |
| `tools/text-in-modul.mjs` | convertește DSL-ul din `data/sursa/` în module JSON |
| `tools/construieste-index.mjs` | scrie `data/continut.json` și blocul MODULE din `sw.js` |
| `tools/verifica-continut.mjs` | validează modulele față de planul-cadru (rulat în CI) |
| `tools/test-sw.mjs` | testează ciclul de update cu service worker activ |
| `tools/graphify.py` | generează jumătatea de conținut a vaultului din `data/` |
| `tools/verifica_vault.py` | verifică legăturile din tot vaultul (rulat în CI) |

## Rutare

Router pe `location.hash`, fără bibliotecă. Formatul: `#/nume/arg1/arg2`.

```
#/acasa                    ecranul principal: progres, continuare, materiile clasei
#/materii                  toate materiile, grupate pe ani
#/an/{n}                   un an de studiu: materiile lui
#/materie/{id}             un modul: capitolele lui, teze, carduri, test
#/capitol/{modul}/{cap}    un capitol: lecțiile lui + testul de capitol
#/lectie/{modul}/{lectie}  lecția: rezumat, idei-cheie, termeni, notițe
#/carduri[/{tip}/{a}/{b}]  carduri de memorare, amestecate
#/test[/{tip}/{a}/{b}]     test grilă: lecție, capitol, materie, teză, an sau clasă
#/plan                     planul de învățământ, toate clasele
#/setari                   preferințe de aspect, de studiu și gestiunea datelor
```

Randarea: `view.innerHTML = ''` urmat de funcția ecranului. Simplu și rapid — dar înseamnă
că orice animație de tranziție trebuie declanșată *în jurul* acestei înlocuiri, nu în interiorul ei.
Vezi [[Animații iOS]].

## Date și persistență

- **Conținutul** e împărțit: `curriculum.json` și indexul `continut.json` se încarcă o
  singură dată la pornire (sunt mici), iar modulul propriu-zis se cere **leneș**, abia
  când e deschis, și rămâne memoizat. Un token de randare anulează rezultatul dacă
  utilizatorul a navigat între timp; indicatorul de încărcare apare doar după 400 ms.
  Toate modulele rămân totuși în precache-ul service worker-ului — altfel aplicația
  instalată ar avea lecțiile doar cât timp există rețea.
- **Progresul elevului** (lecții citite, notițe, scoruri, statistica cardurilor) și
  **setările** stau exclusiv în `localStorage`, sub cheia `stiinte01:v1`. Nu există server,
  nu există cont, nu pleacă nimic de pe dispozitiv. Setările se pot exporta și importa ca
  JSON din ecranul `#/setari`.
- **Preferințele vizuale** se aplică prin atribute pe `<html>` (`data-tema`,
  `data-contrast`, `data-miscare`, `data-transparenta`, `data-densitate`, `data-font`),
  puse de un script inline din `<head>` **înainte** de foaia de stil, ca prima pictură să
  fie deja corectă. Vezi [[Palete și tokenuri]].

## Offline

Service worker cu precache pentru scheletul aplicației **și pentru toate cele 60 de module
de conținut** — lista lor din `sw.js` e generată de `tools/construieste-index.mjs`, între
marcajele `/* MODULE:START */` și `/* MODULE:STOP */`, și nu se editează de mână.
Navigările: *cache-first* cu revalidare în fundal. Restul: la fel.

> [!warning] Regula de aur la fiecare modificare
> Versiunea din `sw.js` (`const CACHE = 'stiinte01-vN'`) trebuie **crescută**, altfel
> dispozitivele care au deja aplicația instalată rămân pe versiunea veche din cache.
