---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-xi-a
id: tic11-10
clasa: "a XI-a"
---
# Structura schelet a unei pagini HTML5 și elemente semantice

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a XI-a]] · lecția 10 din 16

**Capitolul:** Dezvoltare web practică: HTML5 și CSS3 de bază — semestrul 2

## Rezumat

O pagină web validă respectă o structură arborescentă strictă definită de limbajul HTML5. Fișierul se salvează obligatoriu cu extensia `.html` (de regulă `index.html` pentru pagina principală de pornire a oricărui site). Structura de bază minimală a unui document HTML5: ```html <!DOCTYPE html> <html lang="ro"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Titlul Paginii în Fila Browserului</title> </head> <body> <!-- Conținutul vizibil pe ecran se scrie aici --> </body> </html> ``` Elementele structurale principale: 1. `<!DOCTYPE html>`: declară versiunea modernă HTML5 și forțează browserul să randeze în modul standard corect; 2. `<html>`: elementul rădăcină (root) care înglobează întregul document; 3. `<head>`: conține metadate (informații despre pagină care nu se afișează direct în corpul paginii): codificarea caracterelor (`UTF-8` pentru diacritice românești), setările pentru dispozitive mobile (`viewport`), legătura către fișierul extern de stiluri CSS și textul din fila browserului (`<title>`); 4. `<body>`: conține tot ceea ce vede și cu ce interacționează utilizatorul pe ecran; 5. Elemente de conținut și semantice: • Titluri ierarhice: `<h1>` (titlul principal al paginii, unic), `<h2>`, `<h3>` până la `<h6>`; • Paragrafe: tagul `<p>`; • Întrerupere de rând forțată: tagul vid `<br>`; • Linie orizontală despărțitoare: tagul vid `<hr>`; • Text evidențiat: `<strong>` (text îngroșat semantic) și `<em>` (text cursiv cu accent).

## Idei-cheie

- Declarația `<!DOCTYPE html>` instruiește browserul că documentul folosește standardul HTML5.
- În interiorul `<head>` se plasează metadatele, setarea UTF-8 și legăturile către stiluri.
- Tot conținutul vizibil pe ecranul paginii se scrie în interiorul tagului `<body>`.
- Ierarhia titlurilor pornește de la `<h1>` (cel mai important) până la `<h6>` (cel mai mărunt).

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Documentarea tehnică, manualul utilizatorului și prezentarea produsului]] · [[Formatarea stilistică cu CSS - reguli, selectori și Box Model]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]]
