---
titlu: Științe Sociale — hartă de conținut
tip: moc
versiune: "10"
actualizat: 2026-08-26
tags: [moc, stiinte-sociale, pwa]
---

# Științe Sociale — hartă de conținut

Punctul de intrare în **jumătatea scrisă de mână** a vault-ului: cum e făcută aplicația.

> [!abstract] Vault-ul are două jumătăți
> **Aceasta** — documentația proiectului: sistemul de design, arhitectura, jurnalul de lucru,
> rapoartele de verificare. Scrisă de mână, în folderele numerotate.
>
> **Cealaltă** — [[00 Start aici|conținutul de studiu]]: parcurs → clase → arii → materii →
> module → capitole → lecții, plus carduri și teste. **Generată automat** din
> `data/curriculum.json` și `data/module/*.json` de `tools/graphify.py`, deci nu se
> editează direct.
>
> Generatorul curăță doar folderele lui (`Curriculum`, `Materii`, `Module`, `Lecții`,
> `Carduri`, `Teste`) și nu scrie peste configurația `.obsidian`. Cele două jumătăți nu se calcă.

> [!info] Aplicația
> PWA de studiu pentru liceu, **Liceul Tehnologic „Ion Creangă” din Târgu Neamț, profil real**
> (clasele a IX-a – a XIII-a).
> Zero dependențe, zero build, funcționare 100% offline.

## Aplicația

- [[Strategie și foaie de parcurs]] — **auditul + backlogul de task-uri** (un singur task pe sesiune)
- [[Arhitectura aplicației]] — fișiere, rutare, date, service worker
- [[Sistemul de învățare]] — cele șapte mecanisme din spatele Antrenamentului (v04)
- [[Motivație și progres]] — stratul premium (v06): insigne, streak, heatmap, onboarding
- [[Responsivitate și viteză]] — scara de ecrane (v02) și de ce reacția e instantanee
- [[Versiuni]] — istoricul versiunilor aplicației

## Sistemul de design — versiunea 01

- [[Design System v01]] — nota-umbrelă: teza estetică și cele trei straturi
- [[Palete și tokenuri]] — culorile calde, scara tipografică, spațierea, contrastul
- [[Glass + Neomorfism]] — regula hibridă: când e sticlă, când e relief
- [[Animații iOS]] — curbele, tranzițiile, feedbackul la atingere
- [[Componente UI]] — fiecare componentă, ecran cu ecran

## Proces

- [[Jurnal 2026-09-07 — Tastatura Matematica, Video si Tabla Didactica v16]] — Tastatură matematică nativă, ciornă, video explicativ cu profesor și tablă pas-cu-pas fără pași omiși
- [[Jurnal 2026-09-07 — Liceul Ion Creanga, Emblema, Istorie si Geografie v15]] — Liceul Tehnologic „Ion Creangă” Tg. Neamț (profil real), emblemă nouă, Istorie și Geografie Bacalaureat
- [[Jurnal 2026-09-07 — Franceza Bacalaureat v14]] — limba modernă 2 (franceză) de la zero la bacalaureat proba B (clasele IX – XIII)
- [[Jurnal 2026-09-07 — Engleza Bacalaureat v13]] — limba modernă 1 (engleză) de la zero la bacalaureat proba B (clasele IX – XIII)
- [[Jurnal 2026-09-06 — Romana Bacalaureat v12]] — limba și literatura română completă pentru bacalaureat (clasele IX – XIII), structură actualizată
- [[Jurnal 2026-09-06 — Biologie Bacalaureat v11]] — biologie completă pentru bacalaureat (clasele IX – XIII), profil real
- [[Jurnal 2026-08-26 — Supra-tema Auroră v10]] — paletă nouă pe ambele teme, sticlă mai transparentă, efecte opt-in de mișcare
- [[Jurnal 2026-08-25 — Raportează o greșeală v09]] — buton „raportează o greșeală" pe lecție și pe întrebare, salvat local + export
- [[Jurnal 2026-08-25 — Imagini explicative v08]] — vizuale SVG explicative la lecție: sistem + pipeline + pilot istorie-9
- [[Jurnal 2026-08-24 — Mai multe lecții v07]] — extinderea conținutului: 580 → 1152 de lecții, aditiv
- [[Jurnal 2026-08-23 — Motivație și progres v06]] — auditul premium și implementarea stratului de motivație
- [[Jurnal 2026-08-22 — Cromatică v05]] — recolorarea „bleumarin de miezul nopții + nisip cald”
- [[Jurnal 2026-08-22 — Antrenament v04]] — sistemul de învățare și simularea de notă
- [[Jurnal 2026-08-22 — Temă, setări, conținut v03]] — temă comutabilă, setări, 60 de module
- [[Jurnal 2026-08-21 — Responsiv v02]] — responsiv pe toate ecranele + viteză
- [[Jurnal 2026-08-21 — Design v01]] — ce s-a făcut, în ordine
- [[Raport verificare v06]] — echipa de agenți a rulării v06 (motivație și progres)
- [[Raport verificare v05]] — echipa de agenți a rulării v05 (cromatică)
- [[Raport verificare v04]] — echipa de agenți a rulării v04
- [[Raport verificare v03]] — echipa de agenți a rulării v03
- [[Raport verificare v02]] — echipa de agenți a rulării v02
- [[Raport verificare v01]] — verificarea independentă, în locul auditului

## Conținutul de studiu (jumătatea generată)

- [[00 Start aici]] — nota de start a conținutului: clase, materii, cifre
- [[Hartă de învățare]] — ordinea recomandată de parcurgere
- [[Parcurs școlar]] · [[Școala]] · [[Bacalaureat]]

## Convenții în acest vault

| Folder | Ce conține | Scris de |
|---|---|---|
| `00-Index` | hărți de conținut | mână |
| `10-Jurnal` | jurnalul de lucru, cronologic | mână |
| `20-Design` | sistemul de design | mână |
| `30-Aplicatie` | arhitectură, versiuni, decizii tehnice | mână |
| `40-Verificare` | rapoartele agenților de verificare | mână |
| `Curriculum` | parcurs, școală, clase, arii curriculare | `graphify.py` |
| `Materii` | câte o notă-umbrelă per disciplină | `graphify.py` |
| `Module` | o materie într-un an, cu capitolele ei | `graphify.py` |
| `Lecții` | cele 580 de lecții, cu „Notițele mele” păstrate | `graphify.py` |
| `Carduri` | cardurile de memorare, per modul | `graphify.py` |
| `Teste` | întrebările de test și tezele, per modul | `graphify.py` |

Notele sunt legate cu `[[wikilink]]`. Fiecare notă are frontmatter cu `tip`, `versiune`, `tags`.
