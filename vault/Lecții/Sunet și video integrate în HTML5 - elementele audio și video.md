---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-xi-a
aliases:
  - Sunet și video integrate în HTML5: elementele audio și video
id: tic11-14
clasa: "a XI-a"
---
# Sunet și video integrate în HTML5: elementele audio și video

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a XI-a]] · lecția 14 din 16

**Capitolul:** Multimedia avansată și proiecte web — semestrul 2

## Rezumat

Înainte de HTML5, redarea conținutului multimedia pe web impunea instalarea de pluginuri terțe nesigure și consumatoare de baterie (precum Adobe Flash). Standardul HTML5 a revoluționat industria prin introducerea elementelor multimedia native `<audio>` și `<video>`: 1. Eticheta `<audio>` pentru fișiere de sunet: ```html <audio controls preload="auto"> <source src="muzica/podcast.mp3" type="audio/mpeg"> <source src="muzica/podcast.ogg" type="audio/ogg"> Browserul dumneavoastră nu suportă redarea audio HTML5. </audio> ``` Atribute esențiale: • `controls`: afișează bara standard a browserului cu butoane de Play/Pauză, volum și progres; • `autoplay`: pornește automat redarea (adesea blocat de browsere dacă sunetul nu este pe mut); • `loop`: reia redarea de la început în mod continuu; • `muted`: pornește sunetul oprit. 2. Eticheta `<video>` pentru filme și animații: ```html <video width="800" height="450" controls poster="imagini/coperta.jpg"> <source src="video/lectie.mp4" type="video/mp4"> <source src="video/lectie.webm" type="video/webm"> Mesaj de rezervă pentru browsere învechite. </video> ``` Atribute suplimentare specifice video: • `poster`: specifică o imagine statică afișată ca și copertă înainte de apăsarea butonului Play; • `width` și `height`: stabilesc dimensiunea exactă a casetei video pentru a preveni saltul vizual al paginii în timpul încărcării; Tagul `<source>` din interior permite specificarea mai multor formate alternative; browserul îl va alege și reda automat pe primul pe care îl suportă nativ.

## Idei-cheie

- HTML5 redă audio și video direct în browser fără a necesita pluginuri nesigure precum Flash.
- Atributul `controls` este obligatoriu pentru a oferi utilizatorului butoanele de Play și volum.
- Atributul `poster` afișează o imagine de copertă peste caseta video înainte de pornire.
- Se pot include mai multe taguri `<source>` pentru a asigura compatibilitatea pe orice sistem.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Grafică digitală avansată - straturi, măști și optimizare pentru web]] · [[Roluri în proiectele digitale, versionare cu Git și lucru colaborativ]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a XI-a)]]
