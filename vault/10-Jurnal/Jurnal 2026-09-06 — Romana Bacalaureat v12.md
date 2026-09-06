---
titlu: Jurnal 2026-09-06 — Limba și literatura română Bacalaureat v12
tip: jurnal
versiune: "12"
actualizat: 2026-09-06
tags: [jurnal, romana, bacalaureat, autori-canonici, subiectul-II]
---

# Jurnal 2026-09-06 — v12, Limba și literatura română completă pentru Bacalaureat (clasele IX – XIII)

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]]

## Cerința

Structurarea riguroasă a întregii materii de Limba și literatura română (clasele a IX-a până la a XIII-a / finalul liceului), aliniată cu cerințele actuale ale examenului de Bacalaureat din anii recenți.

## Ce s-a implementat

1. **Conținut actualizat & structurat:**
   - Am verificat și aprofundat modulele de română (`romana-9`, `romana-10`, `romana-11`, `romana-12` și `romana-13`), însumând 100 de lecții structurate complet (rezumate, termeni, carduri de memorare, întrebări grilă, teze).
   - În `romana-13.txt` am detaliat cerințele și structura recentă a probei scrise:
     * **Subiectul I:** Partea A (cele 5 cerințe punctuale de câte 6 puncte, sensul contextual al secvențelor, justificarea prin citat) și Partea B (algoritmul textului argumentativ de min. 150 de cuvinte, conectori logici, exemplu din textul-suport + exemplu cultural/personal).
     * **Subiectul al II-lea (10 puncte):** Cele 4 tipare recurente din sesiunile recente de Bacalaureat: (1) perspectiva narativă (obiectivă vs. subiectivă), (2) rolul didascaliilor în textul dramatic, (3) relația dintre ideea poetică și mijloacele artistice, (4) modalitățile de caracterizare a personajului (directă și indirectă).
     * **Subiectul al III-lea (30 puncte):** Prezentarea completă a autorilor canonici (marii clasici, moderniști, interbelici, postbelici, critici literari), distincția profil real (temă și viziune, particularități) vs. profil umanist (relația dintre două personaje), baremul de redactare (12p) și pragul minim de 400 de cuvinte.

2. **Date & PWA:**
   - Recompilat cu `tools/text-in-modul.mjs` și validat cu `tools/verifica-continut.mjs`.
   - Reconstruit indexul `data/continut.json` și lista de precache cu `tools/construieste-index.mjs`.
   - Bump versiune la **v12**, `CACHE` în `sw.js` la `stiinte01-v16`, sincronizat `?v=16` în `index.html` și adăugat jurnalul de versiune în `data/versiuni.json`.

3. **Obsidian Vault:**
   - Regenerat complet prin `tools/graphify.py` și validat cu `tools/verifica_vault.py`.
