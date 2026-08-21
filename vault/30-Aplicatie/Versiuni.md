---
titlu: Versiuni
tip: registru
versiune: "01"
actualizat: 2026-08-21
tags: [versiuni, changelog]
---

# Versiuni

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Design System v01]]

Schema de numerotare: **versiunea aplicației** (`01`, `02`, …) marchează o etapă vizibilă
pentru utilizator. Ea este independentă de versiunea cache-ului din `sw.js`, care crește la
*fiecare* modificare de fișiere, oricât de mică.

## v01 — 2026-08-21 · „Sticlă caldă”

Prima versiune cu identitate vizuală proprie. Faza 1: **doar design**, fără funcționalități noi.

**Ce s-a schimbat**
- Sistem de design complet: paletă caldă, hibrid sticlă + neomorfism, mișcare în stil iOS.
- Bară de taburi flotantă din sticlă mată, cu indicator care alunecă.
- Bară de sus translucidă, conținutul curge pe sub ea.
- Iconițe SVG inline în locul caracterelor unicode geometrice.
- Tranziții push/pop între ecrane, intrare în cascadă a listelor, feedback la atingere.
- Temă întunecată caldă (nu negru-albăstrui).

**Ce NU s-a schimbat** — intenționat, fiindcă faza 1 e strict estetică:
- Conținutul din `data/` (8 module, 25 de lecții, 41 de carduri, 25 de întrebări).
- Logica de rutare, de progres, de test.
- Formatul datelor din `localStorage` (cheia `stiinte01:v1` rămâne — progresul elevilor
  existenți nu se pierde).

**Verificare:** vezi [[Raport verificare v01]].

**După v01 — unificarea vaultului.** Ramura care conținea generatorul de vault
(`tools/graphify.py`) a fost îmbinată în `main`. Vaultul are acum **două jumătăți** în același
folder: conținutul de studiu, generat din `data/`, și documentația proiectului, scrisă de mână.
Generatorul a fost ajustat ca să nu suprascrie configurația `.obsidian`, iar verificatorul lui
ca să nu mai raporteze drept legături rupte wikilink-urile scrise în cod inline.
Total: **89 de note**, zero legături rupte, zero orfane. Vezi [[Științe Sociale — MOC]].

## v00 — punct de plecare

Aplicația funcțională, fără identitate vizuală: paletă rece bleumarin/gri, carduri plate,
iconițe unicode, zero animații.
