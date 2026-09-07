---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
aliases:
  - Tipuri de referințe de celule: relative, absolute și mixte în Excel
id: tic10-10
clasa: "a X-a"
---
# Tipuri de referințe de celule: relative, absolute și mixte în Excel

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 10 din 16

**Capitolul:** Calcul tabelar aprofundat: referințe și funcții logice — semestrul 2

## Rezumat

La copierea sau extinderea unei formule (prin tragerea colțului din dreapta-jos al celulei — mânerul de umplere / Fill Handle), adresele celulelor implicate se modifică sau rămân fixe în funcție de tipul de referință utilizat: 1. Referințe Relative (ex: A1): este modul implicit din Excel. Indică poziția celulei relative la celula în care se află formula. Dacă formula din C1 este =A1+B1, la copierea ei cu un rând mai jos în C2, referințele se vor ajusta automat la noul rând: =A2+B2. La copierea spre dreapta în D1, formula devine =B1+C1. 2. Referințe Absolute (ex: $A$1): ambele componente (coloana și rândul) sunt blocate prin prefixarea cu semnul dolarului ($). O referință absolută NU se modifică niciodată la copiere, indiferent unde este mutată formula pe foaie. Este indispensabilă atunci când toate rândurile unui tabel se raportează la o celulă fixă (de exemplu: rata TVA de 19% aflată în celula $F$1, sau cursul de schimb valutar). Comutarea rapidă între modurile de referință (A1 -> $A$1 -> A$1 -> $A1 -> A1) se face apăsând tasta funcțională F4 imediat după selectarea celulei în bara de formule. 3. Referințe Mixte (ex: $A1 sau A$1): una dintre componente este blocată, iar cealaltă este liberă să se modifice: • $A1 — coloana A este înghețată (fixă), dar rândul se modifică la copiere verticală; • A$1 — rândul 1 este înghețat, dar coloana se ajustează la copiere orizontală (utilă la tabele de înmulțire cu dublă intrare).

## Idei-cheie

- Referința relativă A1 se ajustează automat la deplasarea pe linii și coloane.
- Referința absolută $A$1 rămâne strict neschimbată la copierea formulei în orice direcție.
- Tasta funcțională F4 ciclează automat prin tipurile de referințe ($A$1, A$1, $A1, A1).
- În calculele de cote, TVA sau reduceri raportate la o singură celulă se folosește referința absolută.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Gândire computațională - descompunere, recunoașterea tiparelor și abstractizare]] · [[Funcții logice și calcul condiționat - IF, COUNTIF și SUMIF]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
