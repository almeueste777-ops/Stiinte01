---
titlu: Jurnal 2026-08-22 — Antrenament v04
tip: jurnal
versiune: "04"
actualizat: 2026-08-22
tags: [jurnal, invatare, antrenament, nota]
---

# Jurnal 2026-08-22 — v04, „Antrenament și simulare de notă"

Legături: [[Științe Sociale — MOC]] · [[Sistemul de învățare]] · [[Arhitectura aplicației]] ·
[[Versiuni]] · [[Jurnal 2026-08-22 — Temă, setări, conținut v03]]

## Cerința

> „Totul e live și e foarte bun, dar aș vrea să te gândești și să introduci alt sistem de
> învățare, prin care poți învăța mai repede, mai exact și mai intuitiv. Cu cardurile este o
> idee bună, totuși eu aș vrea și teste grilă, cu punctul 1, 2, 3, 4, 5, câte două puncte de
> fiecare, care să calculeze dacă sunt elev de nota 9 sau mai puțin. Și asta la fiecare
> materie. Creează un sistem de învățare nou care să implice elemente din mai multe sisteme,
> cele mai bune, și implementează-l aici."

Două lucruri, deci: **un sistem de învățare compus**, și **o simulare de notă** cu structură
românească de teză — cinci puncte a câte două.

## Ce s-a făcut

### Antrenamentul

Șapte mecanisme, fiecare rezolvând un mod concret în care învățatul obișnuit eșuează.
Descrierea completă, cu motivele fiecăruia: [[Sistemul de învățare]].

Pe scurt: **repetiție eșalonată** (fiecare element are scadență proprie), **recuperare
activă** (produci răspunsul, nu recitești), **intercalare** (sesiunea amestecă lecții și
tipuri), **efect de generare** (scrii, nu alegi), **calibrare** (spui cât ești de sigur
înainte), **practică deliberată** (ce greșești revine), **stăpânire** (prag, nu bifă).

Cinci tipuri de exercițiu, toate derivate din conținutul care exista deja — **nicio linie
nouă de material scris**: grilă, card, termen, completare și explicație.

> [!important] Piesa care lipsește din aproape toate aplicațiile de învățare
> **Calibrarea.** Elevul nu pică pentru că nu știe nimic, ci pentru că nu știe *ce* nu știe:
> „îmi sună cunoscut" e recunoaștere, nu stăpânire, iar recitirea o întărește fără să adauge
> nimic. Singurul mod de a sparge iluzia e s-o măsori. De aceea aplicația întreabă cât ești
> de sigur **înainte** de răspuns și îți spune la final de câte ori ai zis „sigur" și ai
> greșit.

### Simularea de notă

Structura cerută, respectată la literă: cinci puncte, fiecare de 2 puncte, total 10. Fiecare
punct are 4 întrebări a câte 0,5p — altfel notele ar sări din 2 în 2, iar **nota 9 n-ar fi
accesibilă**, adică exact cifra pe care a cerut-o utilizatorul.

Punctele trag din capitole diferite, prin cozi rotite: proba acoperă materia, nu o lecție.
Fără feedback până la final, ca la o teză. Punctajul obținut **este** nota. Înainte de probă
îți spui singur ce notă crezi că iei; la final compari.

Verificat empiric, cu cheia de răspuns citită din datele modulului:

| Răspunsuri corecte | Nota afișată | Verdict |
|---|---|---|
| 20 din 20 | **10,00** | „Ești elev de nota 10." |
| 18 din 20 | **9,00** | **„Ești elev de nota 9."** |
| 14 din 20 | **7,00** | „Ești elev de nota 7." |

### Ce s-a schimbat în jur

- Tabul **„Carduri" a devenit „Antrenez"**; cardurile clasice rămân, accesibile din hub și
  din fiecare lecție. Antrenamentul e acum acțiunea principală, cardurile o rămășiță utilă.
- **Acasă** arată câte elemente ai de repetat azi și ultima notă din simulări.
- Fiecare **materie** are buton de antrenament și de simulare; fiecare **capitol** și fiecare
  **lecție**, buton de antrenament.
- Setări noi: mărimea sesiunii și comutatorul de calibrare. Resetări separate pentru
  antrenament și pentru note.

## O regresie prinsă la măsurătoare, nu la privit

`.grid2` era `grid-template-columns: 1fr 1fr`. `1fr` înseamnă `minmax(auto, 1fr)`, iar `auto`
nu coboară sub lățimea min-content a conținutului. Cu etichetele noi, mai lungi
(„Antrenament", „Simulare de notă"), la 150% mărime text grila cerea **364px într-un ecran de
320** — depășire reală, pe patru ecrane.

Trecut pe `repeat(auto-fit, minmax(min(100%, 9rem), 1fr))`: grila trece singură pe o coloană
când două nu mai încap, iar `min(100%, …)` o ține în frâu și pe containere înguste.

> [!warning] De ce n-a prins-o prima măsurătoare
> Am măsurat întâi la mărimea implicită de text și am văzut zero depășiri — și era gata să
> pun rezultatul pe seama animației de intrare. Defectul apărea **doar** la 140–150%.
> Morala: când o măsurătoare contrazice un raport, verifică în condițiile raportului, nu în
> ale tale.

## Verificare

Bateria completă, plus **896 de combinații** (7 viewporturi × 2 teme × 16 rute × 4 seturi de
preferințe) — zero derulare orizontală, zero ecrane goale, zero suprapuneri, zero ținte sub
44px, zero erori de consolă. Testul de service worker cu SW activ: trecut.

Rezultatele echipei de agenți: [[Raport verificare v04]].
