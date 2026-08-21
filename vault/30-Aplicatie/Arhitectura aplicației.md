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
| `data/continut.json` | 8 module: lecții, carduri, întrebări |
| `_headers` | anteturi HTTP pentru Cloudflare Pages |
| `jurnal.md` | jurnalul de lucru (oglindit în [[10-Jurnal]]) |
| `vault/` | acest vault Obsidian |

## Rutare

Router pe `location.hash`, fără bibliotecă. Formatul: `#/nume/arg1/arg2`.

```
#/acasa                    ecranul principal: progres, continuare, materiile clasei
#/materii                  lista modulelor de studiu
#/materie/{id}             un modul: lecțiile lui + butoane spre carduri și test
#/lectie/{modul}/{lectie}  lecția: rezumat, idei-cheie, notițe personale
#/carduri[/{modul}]        carduri de memorare, amestecate
#/test[/{modul}]           test grilă, maximum 12 întrebări
#/plan                     planul de învățământ, toate clasele
```

Randarea: `view.innerHTML = ''` urmat de funcția ecranului. Simplu și rapid — dar înseamnă
că orice animație de tranziție trebuie declanșată *în jurul* acestei înlocuiri, nu în interiorul ei.
Vezi [[Animații iOS]].

## Date și persistență

- **Conținutul** vine din cele două fișiere JSON, încărcate o singură dată la pornire.
- **Progresul elevului** (lecții citite, notițe, scoruri, statistica cardurilor) stă exclusiv
  în `localStorage`, sub cheia `stiinte01:v1`. Nu există server, nu există cont, nu pleacă
  nimic de pe dispozitiv.

## Offline

Service worker cu precache pentru scheletul aplicației. Navigările: *network-first* cu
`index.html` din cache ca rezervă. Restul: *cache-first* cu revalidare în fundal.

> [!warning] Regula de aur la fiecare modificare
> Versiunea din `sw.js` (`const CACHE = 'stiinte01-vN'`) trebuie **crescută**, altfel
> dispozitivele care au deja aplicația instalată rămân pe versiunea veche din cache.
