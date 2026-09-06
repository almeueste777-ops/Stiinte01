---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
id: tic10-16
clasa: "a X-a"
---
# Integritatea referențială și normalizarea bazelor de date

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 16 din 16

**Capitolul:** Baze de date relaționale: relații și integritate — semestrul 2

## Rezumat

Pentru a împiedica apariția datelor orfane sau corupte, SGBD-ul aplică reguli stricte de integritate: 1. Integritatea referențială: este o regulă fundamentală care garantează că o relație între două tabele rămâne validă. Concret, nu se poate introduce o înregistrare în tabelul copil dacă valoarea cheii străine nu există deja ca o cheie primară validă în tabelul părinte. De exemplu, nu poți înscrie un elev într-o clasă cu ID-ul 99 dacă această clasă nu există în tabelul Clase. În Microsoft Access, la crearea relației se bifează opțiunea Enforce Referential Integrity (Impune integritatea referențială), însoțită opțional de: • Cascade Update Related Fields — modificarea unei chei primare actualizează automat toate cheile străine asociate; • Cascade Delete Related Records — ștergerea unei înregistrări din tabelul părinte șterge automat toate înregistrările copil asociate (de exemplu, ștergerea unei comenzi șterge automat toate produsele din acea comandă). 2. Normalizarea bazelor de date: este procesul teoretic de structurare a tabelelor pentru a reduce redundanța și anomaliile: • Forma Normală 1 (1NF) — fiecare câmp conține valori atomice (indivizibile), fără liste repetate de valori în aceeași celulă; • Forma Normală 2 (2NF) — respectă 1NF și toate câmpurile necheie depind în totalitate de întreaga cheie primară; • Forma Normală 3 (3NF) — respectă 2NF și nu conține dependențe tranzitive (câmpurile necheie depind direct de cheie, nu prin intermediul altui câmp).

## Idei-cheie

- Integritatea referențială împiedică introducerea de date eronate fără corespondent în tabelul părinte.
- Cascade Delete șterge automat rândurile asociate din tabelul secundar la eliminarea părintelui.
- În Forma Normală 1 (1NF), toate valorile din celule trebuie să fie atomice (indivizibile).
- Normalizarea garantează o bază de date robustă, flexibilă și ferită de anomalii logice.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Modelul relațional - tabele legate, chei străine și tipuri de relații]]

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
