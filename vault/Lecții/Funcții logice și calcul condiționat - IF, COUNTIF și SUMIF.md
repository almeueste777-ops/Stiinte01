---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
aliases:
  - Funcții logice și calcul condiționat: IF, COUNTIF și SUMIF
id: tic10-11
clasa: "a X-a"
---
# Funcții logice și calcul condiționat: IF, COUNTIF și SUMIF

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 11 din 16

**Capitolul:** Calcul tabelar aprofundat: referințe și funcții logice — semestrul 2

## Rezumat

Analiza inteligentă a datelor presupune generarea automată a unor concluzii pe baza îndeplinirii unor condiții: 1. Funcția logică =IF (Dacă): Sintaxa generală: =IF(test_logic, valoare_dacă_adevărat, valoare_dacă_fals) Exemplu practic de notare: =IF(B2>=5, "Promovat", "Respins"). Dacă celula B2 conține o notă mai mare sau egală cu 5, formula va afișa automat cuvântul „Promovat”; în caz contrar, va afișa „Respins”. Funcțiile IF pot fi imbricate (Nested IF) pentru decizii multiple: Exemplu de IF imbricat: =IF(B2>=9, "Foarte Bine", IF(B2>=7, "Bine", "Suficient")) 2. Funcția de numărare condiționată =COUNTIF: Sintaxa: =COUNTIF(interval, criteriu) Numără câte celule dintr-un interval satisfac o condiție anume. De exemplu: • =COUNTIF(C2:C50, "Bucuresti") — numără câte înregistrări sunt din București; • =COUNTIF(D2:D50, ">=10") — numără câți elevi au media 10 curat. 3. Funcția de însumare condiționată =SUMIF: Sintaxa: =SUMIF(interval_criteriu, criteriu, [interval_de_adunat]) Adună doar valorile care îndeplinesc o condiție. De exemplu: • =SUMIF(B2:B30, "Laptop", C2:C30) — calculează valoarea totală a vânzărilor (din coloana C) exclusiv pentru produsele din categoria „Laptop” (din coloana B). 4. Operatori logici auxiliari: AND (Și — toate condițiile trebuie să fie adevărate) și OR (Sau — cel puțin o condiție este adevărată).

## Idei-cheie

- Funcția IF returnează un rezultat dacă o condiție este adevărată și altul dacă este falsă.
- Textul afișat ca rezultat într-o formulă se scrie obligatoriu între ghilimele duble (" ").
- COUNTIF numără celulele care bifează un anumit criteriu stabilit.
- SUMIF calculează suma valorilor doar pentru rândurile care respectă criteriul impus.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Tipuri de referințe de celule - relative, absolute și mixte în Excel]] · [[Sortare, filtrare avansată și tabele pivot (Pivot Tables)]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
