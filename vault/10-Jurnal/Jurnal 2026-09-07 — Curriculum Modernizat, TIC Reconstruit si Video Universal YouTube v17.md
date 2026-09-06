---
titlu: Jurnal 2026-09-07 — Curriculum Modernizat, TIC Reconstruit si Video Didactic Universal YouTube (v17)
data: 2026-09-07
versiune: v17
cache: 21
tip: jurnal
---

# 2026-09-07 — Faza 17: Curriculum Modernizat (Psihologie, Economie, Antreprenoriat), TIC Reconstruit Complet și Video Didactic Universal YouTube cu Link Direct (v17)

**Obiective primite:**
1. Eliminare definitivă din aplicație: Filosofia, Studiile Sociale, Religia, Matematica aplicată în științele sociale (MASS) și ȘTIAM radiate complet din curriculum, surse, module, vault și cache.
2. Adăugarea și structurarea completă a materiilor socio-umane moderne: Psihologia (clasa a X-a), Economia (clasa a XI-a) și Educația antreprenorială (clasele a X-a și a XII-a), construite riguros pentru liceu și examenul de Bacalaureat.
3. Reconstruirea integrală a disciplinei TIC (Tehnologia Informației și a Comunicațiilor) pentru clasele IX–XII (64 de lecții detaliate), acoperind exhaustiv cerințele practice pentru Proba D (Competențe Digitale) de Bacalaureat.
4. Generalizarea funcționalității video didactice YouTube la toate materiile din aplicație unde există materiale educaționale, integrând player securizat fără reclame și buton direct „↗ Deschide pe YouTube”.

### 1. Eliminarea materiilor radiate & refacerea curriculumului
- Actualizat `data/curriculum.json`: eliminate Filosofia (XII–XIII), Religia (IX–XIII), Studiile Sociale (XI–XIII), MASS (XI–XII) și ȘTIAM (XI–XII).
- Șterse fizic toate sursele DSL (`data/sursa/*.txt`) și modulele JSON orfane asociate materiilor eliminate.
- Curățat vault-ul Obsidian de notele vechi orfane prin mecanism automat de curățare în `tools/graphify.py`.

### 2. Dezvoltarea noilor module: Economie, Educație Antreprenorială și Psihologie
- **Economie (clasa a XI-a):** 9 capitole, 24 de lecții, 2 teze semestriale cu 10 întrebări fiecare (nevoi, resurse, cost de oportunitate, cerere, ofertă, piață concurențială, costuri, profit, piață monetară, bănci, inflație, șomaj, PIB).
- **Educație antreprenorială (clasa a X-a):** 6 capitole, 18 lecții, 2 teze semestriale (profilul antreprenorului, distrugerea creatoare Schumpeter, oportunități de afaceri, BMC - Business Model Canvas, marketing mix cei 4P, forme juridice PFA/SRL/SA, pași ONRC, bilanț și cash flow).
- **Educație antreprenorială (clasa a XII-a):** 5 capitole, 12 lecții, 2 teze semestriale (finanțare avansată, bootstrapping, Business Angels, fonduri europene, pitch deck 10/20/30 Guy Kawasaki, funnel de vânzări CAC/LTV, CRM, scalare și metodologii agile).
- **Psihologie (clasa a X-a):** 9 capitole, 24 de lecții, 2 teze (psihicul ca formă a vieții de relație, conștiință, inconștient, senzații, percepții, gândire, limbaj, memorie, imaginație, afectivitate, voință, personalitate - temperament, aptitudini, caracter).

### 3. Reconstrucția completă TIC (clasele IX–XII, 64 de lecții) pentru Bacalaureat Proba D
- **TIC 9:** Arhitectură hardware, CPU, RAM volatil vs stocare SSD/HDD, sistemul de operare Windows, scurtături de tastatură, rețele LAN/WAN, IP, DNS, HTTPS, tehnoredactare Word elementară, PowerPoint, securitate cibernetică, 2FA, malware, etică digitală, reprezentare binară, codificare text UTF-8 și imagine RGB, porturi USB-C/HDMI, ergonomie și backup 3-2-1.
- **TIC 10:** Calcul tabelar avansat Excel (formule, funcții SUM, AVERAGE, COUNT, MAX, MIN, IF, COUNTIF, SUMIF), referințe relative și absolute ($A$1 cu F4), diagrame coloane/plăcintă, sortare și filtrare, baze de date Access (tabele, tipuri de câmpuri, Cheie Primară, interogări cu criterii BETWEEN și LIKE, formulare, rapoarte), grafică raster vs vectorială SVG, algoritmi, scheme logice, structuri de control (FOR, WHILE, IF-ELSE), vectori și gândire computațională.
- **TIC 11:** Tehnologii Web (arhitectură client-server, protocoale HTTP/HTTPS, găzduire), structură HTML5 semantică (`<nav>`, `<header>`, `<main>`, `<footer>`), stilizare CSS3 (clase `.clasa`, id-uri `#id`, CSS Box Model: padding, border, margin), legături hipertext `<a>`, tabele HTML, multimedia nativă (`<audio controls>`, `<video controls poster>`), montaj video pe Timeline, lucru în echipă cu Git (commit, branches, GitHub) și securitate web (prevenire SQL Injection, XSS, hashing parole).
- **TIC 12:** Pregătire dedicată pentru Bacalaureat Proba D:
  - **Fișa A (15 min, cu internet):** căutare avansată în Google cu operatori booleeni, ghilimele `" "`, `site:`, `filetype:pdf`, descărcarea imaginilor în folderul de candidat și redactarea e-mailului oficial cu atașament conform cerințelor de barem.
  - **Fișa B (75 min, fără internet):**
    - Subiectul I (Word - 30p): configurare pagină A4 cu margini, orientare, împărțire pe coloane cu linie despărțitoare, efecte exponent/indice, antet și subsol cu număr de pagină fără prima pagină (Different First Page), tabele și borduri.
    - Subiectul II (Excel - 30p): tabele cu formatare valută/procent, formule aritmetice, funcția condiționată `=IF(E3>=6, "ADMIS", "RESPINS")`, generare grafic Column/Pie cu titlu, legendă și etichete de date (Data Labels).
    - Subiectul III (Opționale - 30p): PowerPoint (machete, fundal degrade diferențiat pe slide-ul 2 fără Apply to All, animații, export .ppsx), Access (Design View, cheie primară, interogare de selecție cu criteriu) sau HTML scris în Notepad.
    - Tehnologii contemporane: Cloud Computing (IaaS, PaaS, SaaS), Big Data (cei 5V), IoT, Edge Computing, Machine Learning, modele LLM, rețele neuronale, etică AI și prevenirea discriminării algoritmice.

### 4. Generalizarea Video Didactic YouTube pe toate materiile
- Baza de date `data/mate-didactic.json` extinsă la 152 de lecții acoperite cu clipuri educaționale YouTube de înaltă calitate:
  - **Matematică:** toate cele 36 de lecții cu video + Tabla Pas-cu-Pas interactivă offline fără pași omiși.
  - **TIC:** toate cele 64 de lecții din clasele IX–XII acoperite cu tutoriale practice pentru Word, Excel, PowerPoint, Access, HTML, Securitate și rezolvări de bilete Bac Proba D.
  - **Limba și literatura română:** 12 lecții pentru operele canonice de Bac (Harap-Alb, Moara cu noroc, Luceafărul, Plumb, O scrisoare pierdută, Ion, Ultima noapte, Enigma Otiliei, Baltagul, Moromeții, Iona, Testament).
  - **Istorie:** 8 lecții de sinteză pentru Bac (Romanitatea românilor, Instituții medievale, Războaiele cu otomanii, Statul român modern 1859, Constituțiile României, Marea Unire 1918, Comunismul sub Dej și Ceaușescu).
  - **Geografie:** 6 lecții esențiale pentru Bac (Relieful României, Clima, Hidrografia, Populația și orașele, Relieful Europei).
  - **Biologie:** 6 lecții fundamentale pentru Bac (Celula eucariotă, Mitoza și meioza, Legile lui Mendel, Sistemul nervos, Sistemul circulator, Genetica umană).
  - **Psihologie, Economie, Antreprenoriat, Logică, Limba Engleză și Limba Franceză** completate cu clipuri didactice tematice.
- În `assets/app.js`: eliminată restricția de materie din `mateDidacticHTML` și `legaMateDidactic`, astfel încât orice lecție ce conține date video afișează playerul securizat `youtube-nocookie.com`.
- Adăugat butonul direct `[ ↗ Deschide pe YouTube ]` în playerul fiecărei lecții, stilizat elegant în `assets/tema-aurora.css` (`.btn-video-yt`).

### 5. Validare, Versionare (v17) & Deploy
- Verificare conținut: `node tools/verifica-continut.mjs` — 52 module, 973 lecții, 3895 carduri, 5477 întrebări de test, 0 erori.
- Toate cele 33 de teste de comportament trecute (`node tools/test-comportament.mjs` — 33/33 pass).
- Verificare CSS: `assets/app.css` (2186 linii) și `assets/tema-aurora.css` (810 linii) — structură validă, acolade echilibrate.
- Precache Service Worker: `sw.js` actualizat la `stiinte01-v21`, toate cele 52 de fișiere de modul verificate și prezente.
- Cache-busting în `index.html`: actualizat la `?v=21`.
- Vault Obsidian regenerat: 1168 de note, 7942 wikilink-uri, 0 legături rupte, 0 note orfane (`python tools/verifica_vault.py`).
- Actualizat `data/versiuni.json` la versiunea 17 (cache 21).




