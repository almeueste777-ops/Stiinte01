---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
aliases:
  - Modelul relațional: tabele, chei și relații
id: tic10-15
clasa: "a X-a"
---
# Modelul relațional: tabele, chei și relații

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 15 din 16

**Capitolul:** Baze de date relaționale — semestrul 2

## Rezumat

O bază de date relațională organizează informația în tabele legate între ele. Fiecare tabel descrie o singură categorie de lucruri (elevi, cărți, comenzi): rândurile sunt înregistrări, coloanele sunt câmpuri (atribute). Un câmp special, cheia primară, identifică unic fiecare înregistrare (de exemplu un cod de elev), astfel încât să nu existe confuzii între rânduri. Legăturile dintre tabele se fac prin chei externe: un câmp dintr-un tabel care trimite la cheia primară a altui tabel. De exemplu, tabelul „Împrumuturi” conține codul cititorului (cheie externă spre tabelul „Cititori”) și codul cărții (cheie externă spre „Cărți”). Astfel, în loc să repetăm datele cititorului la fiecare împrumut, le păstrăm o singură dată și le legăm. Avantajul modelului relațional este eliminarea redundanței: fiecare informație se scrie o singură dată, la un singur loc. Asta reduce spațiul, dar mai ales previne contradicțiile — dacă un cititor își schimbă adresa, ea se modifică într-un singur rând, nu în sute de împrumuturi. Interogările pot apoi combina tabelele legate pentru a răspunde la întrebări complexe.

## Idei-cheie

- Baza de date relațională organizează informația în tabele legate.
- Rândurile sunt înregistrări, coloanele sunt câmpuri.
- Cheia primară identifică unic fiecare înregistrare.
- Cheia externă leagă un tabel de cheia primară a altuia, eliminând repetarea datelor.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Tablouri (vectori) și prelucrarea colecțiilor]] · [[Integritatea datelor și normalizarea]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
