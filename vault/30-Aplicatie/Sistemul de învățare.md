---
titlu: Sistemul de învățare
tip: arhitectura
versiune: "04"
actualizat: 2026-08-22
tags: [invatare, antrenament, repetitie-esalonata, calibrare]
---

# Sistemul de învățare

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]] ·
[[Jurnal 2026-08-22 — Antrenament v04]]

Până la v04, aplicația avea două unelte separate: **carduri** (repetiție) și **test grilă**
(verificare). Amândouă bune, amândouă incomplete — cardurile nu știau ce ai uitat, testul nu
te învăța nimic, iar între ele nu exista nicio legătură.

v04 le adună într-un singur sistem, **Antrenamentul**, construit din șapte mecanisme cu
sprijin în cercetarea învățării. Nu e o colecție de trucuri: fiecare piesă rezolvă un mod
concret în care învățatul obișnuit eșuează.

## Cele șapte mecanisme

> [!abstract] Ce rezolvă fiecare
> | Mecanism | Ce eșec repară | Cum apare în aplicație |
> |---|---|---|
> | **Repetiție eșalonată** | uiți exact ce n-ai mai atins | fiecare element are scadență proprie; sesiunea aduce ce e scadent |
> | **Recuperare activă** | recitirea dă iluzia că știi | toate cele 5 tipuri cer producerea răspunsului |
> | **Intercalare** | blocul „o lecție pe rând” se uită repede | sesiunea amestecă lecții, capitole și tipuri |
> | **Efect de generare** | recunoști, dar nu poți produce | „Completează” și „Explică” cer scris |
> | **Calibrare metacognitivă** | „credeam că știu” | spui cât ești de sigur ÎNAINTE; raportul îți arată supraîncrederea |
> | **Practică deliberată** | repeți ce știi deja | ce greșești revine în aceeași sesiune și, apoi, mai des |
> | **Învățare până la stăpânire** | „am citit-o” ≠ „o știu” | lecția e stăpânită abia peste prag, nu la prima deschidere |

### De ce calibrarea e piesa centrală

Celelalte șase sunt cunoscute. Calibrarea e cea care lipsește din aproape toate aplicațiile
de învățare, și e cea care schimbă cel mai mult rezultatul la teză.

Elevul nu pică pentru că nu știe nimic. Pică pentru că **nu știe ce nu știe**: senzația de
„îmi sună cunoscut” e produsă de recunoaștere, nu de stăpânire, iar recitirea o întărește
fără să adauge nimic. Singurul mod de a sparge iluzia e s-o măsori: te întrebăm cât ești de
sigur *înainte* de răspuns, iar la final îți spunem de câte ori ai zis „sigur" și ai greșit.

Aceeași idee, la scară mare, e în **simularea de notă**: îți ceri singur nota înainte de
probă, apoi compari.

## Cele cinci tipuri de exercițiu

Derivate din conținutul care exista deja — nu s-a scris nicio linie nouă de material.

| Tip | Sursă în modul | Ce antrenează |
|---|---|---|
| **Grilă** | `lectie.test` | recunoaștere rapidă, exact formatul de la teză |
| **Card** | `lectie.carduri` | reamintire liberă, cu autoevaluare |
| **Termen** | `lectie.termeni` | vocabularul de specialitate |
| **Completează** | `lectie.termeni`, invers | producere, nu recunoaștere |
| **Explică** | `lectie.ideiCheie` | reformulare cu cuvinte proprii |

> [!tip] De ce contează diferența dintre Grilă și Completează
> Grila se poate nimeri; completarea, nu. Dacă raportul arată 90% la grilă și 40% la
> completare, elevul **recunoaște** materia fără s-o poată **produce** — exact diferența
> care se vede la un subiect de teză cu răspuns scris.

## Programarea

Variantă simplificată de SM-2. Fiecare element ține cinci numere: interval în zile (`i`),
ușurință (`e`, ×100, ca să rămână întreagă în `localStorage`), scadență (`d`), reușite
consecutive (`r`) și numărul total de greșeli (`g`, ținut pentru diagnostic, fără efect
asupra programării).

| Calificativ | De unde vine | Efect |
|---|---|---|
| **Greșit (0)** | grilă/completare greșită, sau autoevaluare „Deloc” | reușitele la zero, revine în aceeași sesiune, ușurința −20 |
| **Cu greu (1)** | autoevaluare | interval ×1,2, ușurința −15 |
| **Bine (2)** | răspuns corect, sau autoevaluare | 1 zi → 3 zile → interval × ușurință |
| **Ușor (3)** | autoevaluare | ca la „bine”, dar ×1,3; ușurința +15 |

Ușurința rămâne între 1,30 și 2,80; intervalul, între 1 și 365 de zile.

**Stăpânire:** un element e stăpânit la **3 reușite consecutive și interval de cel puțin o
săptămână**. Pragul e ales ca să nu se declare „știu" după o singură nimereală.

## Alcătuirea unei sesiuni

1. Întâi elementele **scadente** — repetiția eșalonată funcționează doar dacă respecți
   scadențele.
2. Apoi elemente **noi**, cel mult jumătate din sesiune. O sesiune numai din material nou nu
   consolidează nimic; una numai din restanțe nu avansează materia.
3. Dacă tot ce era scadent s-a epuizat, se completează cu nescadente — repetiția în avans e
   mai bună decât un ecran gol.
4. Totul se amestecă la final: asta e intercalarea.

## Simularea de notă

Structura cerută de utilizator, respectată exact: **cinci puncte, fiecare valorând 2 puncte**,
total 10. Fiecare punct are **4 întrebări a câte 0,5p** — altfel notele ar sări din 2 în 2 și
nota 9 n-ar fi accesibilă.

- Punctele trag din **capitole diferite**, prin cozi rotite pe capitol: proba acoperă materia,
  nu o singură lecție.
- **Fără feedback până la final**, ca la o teză adevărată.
- Punctajul obținut **este** nota: 18 din 20 de întrebări → 9,00 → „Ești elev de nota 9".
- Grilele din simulare hrănesc și programarea eșalonată — o teză dată degeaba ar fi o ocazie
  ratată de învățare.
- Se păstrează ultimele 20 de simulări per materie, cu medie.

## Unde stă starea

`state.antren` — un rând per element antrenabil, cheia `<tip>:<idLecție>:<index>`.
`state.note` — istoricul simulărilor, pe module.

Ambele sunt curățate de `curataProgresulOrfan()` la pornire: dacă id-urile din conținut se
schimbă, „stăpânit 40%" nu are voie să se calculeze peste elemente care nu mai există.

## Ce NU face sistemul

- Nu corectează automat „Card", „Termen" și „Explică" — nu poate. Elevul se autoevaluează,
  dar **numai după ce a încercat**, altfel dispare tot efectul de recuperare.
- Nu compară semantic explicația scrisă cu ideea-cheie. Ar cere un model de limbaj; aplicația
  are zero dependențe și merge offline.
- Nu adaptează dificultatea întrebărilor — toate grilele sunt tratate la fel. Un sistem de
  dificultate ar cere date de la mulți elevi, iar aplicația nu trimite nimic nicăieri.
