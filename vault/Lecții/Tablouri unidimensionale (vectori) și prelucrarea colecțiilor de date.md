---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
id: tic10-14
clasa: "a X-a"
---
# Tablouri unidimensionale (vectori) și prelucrarea colecțiilor de date

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 14 din 16

**Capitolul:** Tehnici algoritmice și colecții de date (vectori) — semestrul 2

## Rezumat

În rezolvarea problemelor practice cu volume mari de date de același tip (notele celor 30 de elevi ai unei clase, temperaturile măsurate într-o lună), declararea a 30 de variabile separate (n1, n2, ..., n30) este imposibil de gestionat. Soluția o reprezintă Tabloul unidimensional (Vectorul / Array) — o colecție finită și ordonată de elemente omogene (de același tip de date), stocate în locații de memorie succesive. Fiecare element din vector este identificat prin numele vectorului și un indice numeric (index) scris între paranteze drepte: V[1], V[2], ..., V[n] (în pseudocod, de la 1 la n) sau V[0], V[1], ..., V[n-1] (în limbajele de programare C++ sau Python). Operațiile fundamentale pe vectori includ: 1. Citirea și parcurgerea completă a vectorului cu o buclă FOR: pentru i = 1 până la n execută citește V[i] sfârșit_pentru 2. Calculul sumei și mediei aritmetice a elementelor: suma = 0 pentru i = 1 până la n execută suma = suma + V[i] sfârșit_pentru media = suma / n 3. Găsirea elementului maxim (sau minim): se inițializează maximul cu primul element V[1], apoi se compară succesiv cu restul: max = V[1] pentru i = 2 până la n execută dacă V[i] > max atunci max = V[i] sfârșit_dacă sfârșit_pentru 4. Căutarea liniară (secvențială) a unei valori în vector.

## Idei-cheie

- Vectorul memorează o colecție de date de același tip sub un singur nume comun.
- Elementele se accesează direct prin indicele lor numeric: V[i].
- Parcurgerea tuturor elementelor dintr-un vector se realizează clasic cu o buclă FOR.
- Determinarea maximului presupune compararea pe rând a fiecărui element cu maximul curent.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Tehnici de decizie în algoritmi și condiții compuse]] · [[Modelul relațional - tabele legate, chei străine și tipuri de relații]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
