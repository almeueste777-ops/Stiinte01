---
titlu: Jurnal 2026-09-07 — Liceul Ion Creanga, Emblema, Istorie si Geografie v15
tip: jurnal
versiune: "15"
actualizat: 2026-09-07
tags: [jurnal, liceul-ion-creanga, targu-neamt, profil-real, emblema, istorie, geografie, bacalaureat]
---

# Jurnal 2026-09-07 — v15, Liceul Tehnologic „Ion Creangă” Târgu Neamț (Profil Real), emblemă nouă regală, Istorie și Geografie Bacalaureat

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]] · [[Școala|Liceul Tehnologic „Ion Creangă”]] · [[Parcurs școlar]]

## Cerințele utilizatorului

1. **Date instituționale:** Actualizarea liceului și profilului în aplicație: elev la **Liceul Tehnologic „Ion Creangă” din Târgu Neamț, profil real**.
2. **Emblema aplicației:** Schimbarea emblemei aplicației într-una foarte elegantă, modernă și atractivă (actualizarea iconițelor PWA de 192x192, 512x512, maskable și afișarea ei în interfață).
3. **Istorie și Geografie:** Completarea și consolidarea materiilor Geografie și Istorie în aplicație în același stil detaliat și riguros folosit pentru limbile moderne (bază solidă de la zero/gimnaziu până la cerințele integrale de Bacalaureat).

## Ce s-a implementat

### 1. Datele liceului și profilul real
- Actualizat `data/curriculum.json`:
  - Școala: **Liceul Tehnologic „Ion Creangă”**, localitatea **Târgu Neamț**, județul Neamț, Bulevardul Ștefan cel Mare nr. 64, telefon 0233 790 357, site `https://liceulioncreangatgneamt.ro/`.
  - Parcurs: **Filiera Tehnologică / Teoretică**, **Profil Real**, forma frecvență redusă / zi, clasele IX–XIII.
- Actualizat `README.md`, `vault/00-Index/Științe Sociale — MOC.md`.
- Regenerat automat notele de curriculum din vault prin `tools/graphify.py`: `vault/Curriculum/Școala.md` și `vault/Curriculum/Parcurs școlar.md`.

### 2. Emblema oficială a aplicației — design regal, elegant și atractiv
- Generat blazonul heraldic modern pe fundal safir și albastru de miezul nopții, cu ramă dublă aurită:
  - **Cartea deschisă a cunoașterii** (înțelepciune, literatură, patronul spiritual Ion Creangă).
  - **Orbitele atomului și nucleul radiant** (simbolul profilului real: științe ale naturii, fizică, chimie, biologie, tehnologie).
  - **Condeiul de aur și Steaua excelenței** în 5 colțuri.
  - **Cununa de lauri** aurită și panglica heraldică „LICEUL TEHNOLOGIC ION CREANGĂ · REAL”.
- Create fișierele de iconițe PWA: `icons/icon-192.png`, `icons/icon-512.png`, `icons/icon-maskable-512.png` (cu zonă de siguranță optimizată) și `assets/emblema.png`.
- Creată sursa vectorială `icons/icon-source.svg`.
- Adăugat stilul CSS `.emblema-scoala` și `.scoala-card-row` în `assets/tema-aurora.css` și integrată emblema direct pe ecranul **Acasă** (în cardul principal de progres), pe ecranul **Plan de învățământ** și în subsolul ecranului de **Setări / Despre**.

### 3. Consolidare Istorie: De la zero la Bacalaureat Proba E.c
- **Clasa a IX-a (`data/sursa/istorie-9.txt` › `ist9-01`):** Ghid complet de la zero privind timpul istoric și cronologia: calculul secolelor și mileniilor, axa timpului (lipsa anului 0, numărarea descrescătoare î.Hr. și crescătoare d.Hr.), tipologia completă a izvoarelor (nescrise: arheologice, numismatice, cartografice, orale; scrise: epigrafice, cronici, letopisețe, hrisoave, presă), critica externă (autenticitate) și critica internă (credibilitate), periodizarea clasică a istoriei.
- **Clasa a XIII-a (`data/sursa/istorie-13.txt` › `ist13-08`, `ist13-09`):** Metodologia completă de examen:
  - Subiectele I și II: identificare pe text-suport, șablonul relației cauză–efect cu conectori logici obligatorii („deoarece/întrucât” și „drept urmare/prin urmare”), formularea punctului de vedere argumentat susținut de două informații distincte din sursă.
  - Subiectul III: structura eseului de 400 de cuvinte și sinteza celor 7 mari teme de Bacalaureat (Romanitatea românilor, Autonomii locale și instituții medievale, Spațiul românesc între diplomație și conflict, Statul român modern, Constituțiile României, Totalitarism vs. democrație în secolul XX, România în Războiul Rece și integrarea euroatlantică).

### 4. Consolidare Geografie: De la zero la Bacalaureat Proba E.d
- **Clasa a IX-a (`data/sursa/geografie-9.txt` › `geo9-01`, `geo9-02`):** Ghid complet de la zero: coordonate geografice (latitudine 0°–90° N/S pornind de la Ecuator, longitudine 0°–180° E/V pornind de la Meridianul Greenwich), scara hărții numerică și grafică, mișcarea de rotație, forța Coriolis și calculul fusurilor orare (15° longitudine = 1 oră), mișcarea de revoluție și momentele astronomice cheie (solstițiul de vară 21 iunie, echinocțiul de toamnă 23 septembrie, solstițiul de iarnă 21/22 decembrie, echinocțiul de primăvară 21 martie).
- **Clasa a XIII-a (`data/sursa/geografie-13.txt` › `geo13-18`, `geo13-20`):** Metodologia completă de examen:
  - Algoritmul comparativ simetric de barem pentru relief (geneză/orogeneză, roci, altitudini, fragmentare/orientare, relief specific glaciar/carstic/vulcanic) și climă (etaj climatic, influențe, temperaturi medii, precipitații anuale, vânturi).
  - Toate formulele exacte de calcul pentru Subiectul III: Densitatea populației ($D = P / S$), Bilanțul natural ($SN = N - M$), Rata sporului natural ($sn = n - m$), Bilanțul migratoriu ($SM = I - E$), Bilanțul total ($ST = SN + SM$), Amplitudinea termică ($A_t = T_{\max} - T_{\min}$) și panta/căderea râului.

### 5. Verificare, Versionare (v15) & Precache
- Toate sursele compilate cu `node tools/text-in-modul.mjs`.
- Verificat conținutul cu `node tools/verifica-continut.mjs` (63 module, 1177 lecții valide).
- Sincronizat indexul și precache-ul cu `node tools/construieste-index.mjs`.
- Actualizat versiunea la **v15** în `data/versiuni.json`.
- Bump cache la **stiinte01-v19** în `sw.js` (incluzând `./assets/emblema.png`) și query string `?v=19` în `index.html`.
- Regenerat vaultul Obsidian prin `python tools/graphify.py`.
