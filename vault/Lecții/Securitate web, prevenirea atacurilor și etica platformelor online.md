---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-xi-a
id: tic11-16
clasa: "a XI-a"
---
# Securitate web, prevenirea atacurilor și etica platformelor online

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a XI-a]] · lecția 16 din 16

**Capitolul:** Managementul echipei, securitate și etică web — semestrul 2

## Rezumat

Securitatea aplicațiilor web este o necesitate critică, serverele fiind expuse permanent tentativelor de intruziune automatizate: 1. Amenințări cibernetice comune pe web: • Injecția SQL (SQL Injection): introducerea de comenzi malițioase de baze de date în câmpurile unui formular web nesecurizat pentru a fura parole sau a șterge întreaga bază de date; protecția impune utilizarea interogărilor parametrizate (Prepared Statements); • Cross-Site Scripting (XSS): injectarea de scripturi malițioase JavaScript în paginile vizualizate de alți utilizatori (ex: într-un comentariu pe forum), având ca scop furtul cookie-urilor de sesiune; • Stocarea nesigură a parolelor: este strict interzisă păstrarea parolelor în clar (Plain Text) în bazele de date; parolele trebuie trecute printr-o funcție criptografică de dispersie (Hashing: bcrypt, Argon2, SHA-256) cu adăugarea unei valori aleatorii de securitate (Salt). 2. Etica digitală și responsabilitatea platformelor: • Algoritmii de recomandare ai rețelelor sociale tind să promoveze conținut senzaționalist, polarizant și știri false (Clickbait) pentru a maximiza timpul petrecut pe ecran; • Bulele informaționale (Echo Chambers) izolează utilizatorii în grupuri ce împărtășesc aceleași opinii, reducând gândirea critică și dialogul democratic; • Respectarea vieții private a utilizatorilor și colectarea exclusivă a datelor strict necesare (Data Minimization conform GDPR) constituie o obligație juridică și etică a oricărui dezvoltator web.

## Idei-cheie

- Parolele utilizatorilor nu se stochează niciodată în clar, ci exclusiv sub formă de hash criptografic.
- Injecția SQL exploatează formularele nevalidate pentru a manipula baza de date de pe server.
- Atacurile XSS încearcă să execute cod JavaScript malițios în browserul altor vizitatori.
- Principiul minimizării datelor din GDPR impune colectarea doar a informațiilor strict necesare.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Roluri în proiectele digitale, versionare cu Git și lucru colaborativ]]

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]]
