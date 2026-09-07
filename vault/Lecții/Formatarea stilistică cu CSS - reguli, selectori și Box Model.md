---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-xi-a
aliases:
  - Formatarea stilistică cu CSS: reguli, selectori și Box Model
id: tic11-11
clasa: "a XI-a"
---
# Formatarea stilistică cu CSS: reguli, selectori și Box Model

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a XI-a]] · lecția 11 din 16

**Capitolul:** Dezvoltare web practică: HTML5 și CSS3 de bază — semestrul 2

## Rezumat

CSS (Cascading Style Sheets) oferă control deplin asupra aspectului vizual al paginilor web. Sintaxa fundamentală a unei reguli CSS: ```css selector { proprietate: valoare; proprietate: valoare; } ``` 1. Modalități de includere a stilurilor CSS: • CSS Extern (recomandat profesional): un fișier separat `.css` legat în `<head>` prin linia: `<link rel="stylesheet" href="stil.css">` • CSS Intern: scris direct în secțiunea `<head>` a paginii în interiorul unui bloc `<style>...</style>`; • CSS Inline: scris direct pe tag prin atributul `style="color: blue;"` (de evitat în proiecte mari). 2. Selectori fundamentale în CSS: • Selector de tip element (tag): `p { color: #333333; }` — aplică regula tuturor paragrafelor; • Selector de clasă (precedat de punct): `.buton-salvare { background-color: green; }` — aplicat oricărui element care conține `class="buton-salvare"`; o clasă poate fi reutilizată pe zeci de elemente; • Selector de identificator unic (precedat de diez): `#meniu-principal { width: 100%; }` — aplicat elementului cu `id="meniu-principal"`; id-ul trebuie să fie unic pe pagină. 3. Modelul cutiei (CSS Box Model): Fiecare element HTML este tratat de browser ca o cutie dreptunghiulară compusă din 4 straturi succesive din interior spre exterior: • Conținutul (Content): textul sau imaginea propriu-zisă; • Spațiul interior (Padding): spațiul liber dintre conținut și chenar; • Chenarul (Border): linia de contur ce înconjoară elementul; • Marginea exterioară (Margin): spațiul liber de respirație dintre chenar și elementele vecine din pagină.

## Idei-cheie

- Fișierul CSS extern se leagă în secțiunea `<head>` cu eticheta `<link rel="stylesheet">`.
- Selectorul de clasă începe cu punct (.nume), iar cel de identificator cu diez (#nume).
- Box Model este format din Conținut, Padding (spațiu interior), Border (chenar) și Margin (margine exterioară).
- Proprietățile fundamentale de text sunt: `color`, `font-size`, `font-family` și `text-align`.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Structura schelet a unei pagini HTML5 și elemente semantice]] · [[Legături hipertext, imagini și tabele în limbajul HTML]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]]
