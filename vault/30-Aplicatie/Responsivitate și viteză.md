---
titlu: Responsivitate și viteză
tip: decizie-tehnica
versiune: "02"
actualizat: 2026-08-21
tags: [responsiv, performanta, css, service-worker]
---

# Responsivitate și viteză

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Design System v01]] ·
[[Jurnal 2026-08-21 — Responsiv v02]]

Cum se adaptează aplicația la orice ecran și de ce reacționează instantaneu.
Sursa de adevăr în cod: `assets/app.css` secțiunea 19 („Responsiv") și stratul 3 §7,
`assets/app.js`, `sw.js`.

## Scara de ecrane

| Prag | Ce se schimbă | De ce |
|---|---|---|
| ≤340px | baza tipografică 15px | pe Galaxy Fold închis totul rămâne pe un rând |
| ≤380px | spațieri strânse, tabele compacte | telefoane înguste |
| ≥700px | `.grid-cards` pe 2 coloane | listele nu mai sunt un turn de carduri late |
| ≥768px | mai mult aer, raze mai mari | tabletă |
| ≥900px | lecția: text + notițe alături (`.two-col`), notițele lipicioase; planul pe 2 coloane | citești și notezi fără derulare |
| peisaj scund | crom compact | telefon culcat |
| ≥1024px | tab-urile devin **rail vertical** la stânga; coloană de 900px | desktop real, nu telefon lățit |
| ≥1440px | 3 coloane pentru liste; coloană de 1000px | monitoare mari |

Reguli care țin scara în frâu:

- **`minmax(0,1fr)`, nu `1fr`** în grile — un cuvânt lung nu poate lărgi coloana.
- **Rail-ul refolosește mecanica pilulei**: aceleași `--tab-i`/`--tab-count` din JS;
  doar axa transformării se schimbă în CSS. JS-ul nu știe de existența rail-ului.
- **Geometria verticală a pastilei stă în stratul 3**, nu în secțiunea responsivă a
  stratului 2 — stilul de bază al `.tab-ind` e în stratul 3, care vine mai târziu în
  fișier și ar câștiga la specificitate egală. (Bug real, prins la capturi.)
- **Safe-area pe toate laturile**: sus/jos din v01, stânga/dreapta din v02 (decupajul
  camerei în peisaj).
- `scrollbar-gutter: stable` — apariția barei de derulare nu mai mută coloana centrată.
- `manifest.webmanifest`: `orientation: any` — instalarea nu blochează peisajul.

## Viteza de reacție

| Mecanism | Unde | Efect |
|---|---|---|
| SW **cache-first la navigare**, revalidare în fundal | `sw.js` | pornire instantanee, chiar și offline sau pe 2G; prospețimea o dă bump-ul de `CACHE` |
| `<link rel="preload" as="fetch" crossorigin>` pentru ambele JSON-uri | `index.html` | datele se descarcă în paralel cu CSS-ul; `crossorigin` e obligatoriu ca preload-ul să se potrivească cu `fetch()` (mod CORS) — altfel se descarcă dublu |
| delegare de evenimente pe `#view` | `app.js` | zero muncă de legare per randare |
| schimbarea clasei rescrie doar `#clasa-panou` | `app.js` | ~80ms măsurat, fără repornirea animațiilor |
| fundal ambiental pe `body::before` fix | `app.css` | `background-attachment: fixed` forța repictarea la fiecare cadru de scroll și e ignorat de iOS Safari; pseudo-elementul fix se compune o dată pe GPU |
| `touch-action: manipulation` pe tot ce se apasă (din v01) | `app.css` | fără întârzierea dublului-tap |
| animații doar pe transform/opacity (din v01) | `app.css` strat 3 | totul pe compozitor |

## Ce NU s-a schimbat

- Formatul datelor (`data/*.json`) și cheia `localStorage` (`stiinte01:v1`) —
  progresul elevilor existenți e intact.
- Regula hibridă a designului ([[Glass + Neomorfism]]) și curbele de mișcare
  ([[Animații iOS]]) — v02 nu atinge estetica, doar o întinde pe toate ecranele.

## Cum verifici

Empiric, nu citind codul: capturi Playwright pe scara completă de viewporturi ×
ambele teme × toate ecranele, cu măsurători automate (fără derulare orizontală,
rail/pilulă pe poziție, ținte ≥44px). Procedura completă e în agentul
`.claude/agents/verificator-ui.md`; rezultatele rulării v02: [[Raport verificare v02]].
