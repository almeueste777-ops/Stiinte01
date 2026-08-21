# Științe Sociale — aplicație PWA de studiu

Aplicație web progresivă (PWA) pentru elevii de liceu de la **filiera teoretică, profil umanist,
specializarea Științe sociale, forma cu frecvență redusă (clasele a IX-a – a XIII-a)**.

Construită pentru **Colegiul Tehnic „Alexandru Ioan Cuza”, Suceava**, dar conținutul este
editabil și poate fi adaptat oricărei alte școli.

## Ce face

- **Planul de învățământ** — toate disciplinele, pe clase, de la a IX-a la a XIII-a, cu marcarea celor care intră la bacalaureat.
- **Lecții** — rezumate și idei-cheie pentru fiecare materie.
- **Notițe personale** — salvate local pe dispozitiv, per lecție.
- **Carduri de memorare** — întrebare/răspuns, amestecate aleatoriu, cu autoevaluare.
- **Test grilă** — 12 întrebări cu explicații și istoric al scorului.
- **Progres** — câte lecții ai parcurs, media la teste.
- **Funcționează complet offline** și se instalează pe telefon ca aplicație.

## Designul — versiunea 01, „Sticlă caldă”

Aplicația are un sistem de design propriu: **glassmorphism cald + neomorfism**, cu animații
în stil iOS. Regula care ține totul laolaltă:

> **Adâncimea aparține conținutului. Transparența aparține cadrului.**
> Ce plutește *peste* conținut e sticlă mată (bara de sus, bara de taburi).
> Ce *este* conținut e relief neomorfic (carduri, butoane, chipsuri, opțiuni).
> Niciodată amândouă pe același element.

Paleta e caldă — nisip, smântână, lut, teracotă, chihlimbar — cu o temă întunecată tot caldă
(espresso, nu negru-albăstrui). Tot contrastul de text e verificat la nivel WCAG AA.
Mișcarea folosește curbele reale din iOS, iar `prefers-reduced-motion`,
`prefers-contrast: more` și `prefers-reduced-transparency` sunt tratate explicit.

Documentația completă a sistemului e în vaultul Obsidian din [`vault/`](vault/), în
`vault/20-Design/`. Jurnalul de lucru e în [`jurnal.md`](jurnal.md).

## Tehnologii

HTML + CSS + JavaScript simplu. **Zero dependențe, zero pas de build.** Fișierele din repo
sunt exact fișierele care ajung pe server — ceea ce înseamnă deploy instantaneu și nimic de întreținut.

## Rulare locală

```bash
python3 -m http.server 8765
# apoi deschide http://localhost:8765
```

> Deschiderea fișierului `index.html` direct (`file://`) **nu** funcționează:
> service worker-ul și `fetch()` au nevoie de un server HTTP.

## Structura proiectului

| Cale | Rol |
|---|---|
| `index.html` | scheletul paginii și bara de navigare |
| `assets/app.css` | stilurile, în patru straturi: tokeni → tokeni derivați → componente → mișcare |
| `assets/app.js` | toată logica: rutare, lecții, carduri, test, progres |
| `sw.js` | service worker — cache offline |
| `manifest.webmanifest` | metadatele de instalare (nume, icoane, culori) |
| `icons/` | icoanele aplicației (PNG generate din `icon-source.svg`) |
| `icons/icon-source.svg` | sursa vectorială a iconițelor |
| `data/curriculum.json` | planul de învățământ: clase și discipline |
| `data/continut.json` | lecțiile, cardurile și întrebările de test |
| `_headers` | anteturi HTTP pentru Cloudflare Pages |
| `docs/PLAN.md` | planul complet de realizare și pașii de publicare |
| `jurnal.md` | jurnalul de lucru: ce s-a făcut, de ce, cu ce rezultat |
| `vault/` | vault Obsidian — vezi mai jos |
| `tools/graphify.py` | generează jumătatea de *conținut* a vault-ului din `data/` |
| `tools/verifica_vault.py` | verifică legăturile din vault (rulează în CI) |
| `tools/verifica-css.mjs` | verifică structura foii de stil (acolade, imbricări nedorite) |
| `tools/genereaza-iconite.mjs` | regenerează iconițele PWA din sursa SVG |
| `.github/workflows/verificare.yml` | verificare automată: JSON valid, sintaxă JS, structură CSS, fișiere PWA, precache complet |
| `.github/workflows/graphify.yml` | regenerează vault-ul când se schimbă datele și îl comite înapoi |

## Cum adaugi conținut

Editezi `data/continut.json`. Nu e nevoie să atingi codul.

```jsonc
{
  "id": "filosofie",              // identificator unic, fără spații
  "materie": "Filosofie",
  "clasa": "a XII-a",
  "descriere": "…",
  "lectii":     [{ "id": "filo-06", "titlu": "…", "rezumat": "…", "ideiCheie": ["…"] }],
  "flashcards": [{ "f": "întrebarea", "v": "răspunsul" }],
  "quiz":       [{ "intrebare": "…", "optiuni": ["a","b","c","d"], "corect": 1, "explicatie": "…" }]
}
```

`corect` este **indexul** răspunsului corect, numărat de la 0 (deci `1` = a doua variantă).

După orice modificare a fișierelor, **crește versiunea din `sw.js`** (de exemplu `stiinte01-v2` → `stiinte01-v3`),
altfel utilizatorii care au deja aplicația instalată vor primi în continuare versiunea veche din cache.

## Vault Obsidian (`vault/`)

Un singur vault [Obsidian](https://obsidian.md), cu **două jumătăți** care nu se calcă:

| Jumătate | Foldere | Cine o scrie |
|---|---|---|
| **Conținutul de studiu** — parcurs → clase → arii → materii → lecții, plus carduri și teste | `Curriculum/`, `Materii/`, `Lecții/`, `Carduri/`, `Teste/` | generată din `data/*.json` de `tools/graphify.py` |
| **Documentația proiectului** — sistemul de design, arhitectura, jurnalul de lucru, rapoartele de verificare | `00-Index/`, `10-Jurnal/`, `20-Design/`, `30-Aplicatie/`, `40-Verificare/` | scrisă de mână |

Puncte de intrare: **„00 Start aici”** pentru conținut, **„Științe Sociale — MOC”** pentru
documentație. Fiecare trimite la cealaltă, iar Graph View arată tot.

```bash
python3 tools/graphify.py        # regenerează jumătatea de conținut din data/*.json
python3 tools/verifica_vault.py  # verifică legăturile din tot vault-ul (0 rupte, 0 orfane)
```

Ca să-l deschizi: în Obsidian, *Open folder as vault* → alege folderul `vault`.

Generarea e **distructivă pentru folderele generate** (`Curriculum/`, `Materii/`, `Lecții/`,
`Carduri/`, `Teste/`) — nu edita notele de acolo, fiindcă se rescriu. Trei lucruri se păstrează:

- ce scrii sub titlul **„## Notițele mele”** din fiecare lecție (recuperat după `id`, deci
  rezistă și la redenumirea lecției);
- **folderele numerotate**, cu documentația scrisă de mână — generatorul nici nu le atinge;
- **configurația `.obsidian`** — se scrie doar dacă lipsește, ca reglajele de graf și de
  aspect să nu se piardă la fiecare regenerare.

Workflow-ul [`Graphify`](.github/workflows/graphify.yml) regenerează vault-ul pe GitHub la fiecare
modificare a datelor și îl comite înapoi, așa că `vault/` din repo e mereu la zi. Fiecare rulare
publică și o arhivă `vault-obsidian` descărcabilă din pagina Actions.

## Publicare

Vezi [`docs/PLAN.md`](docs/PLAN.md) — pașii exacți pentru GitHub și Cloudflare Pages.

## Surse pentru planul de învățământ

- Oferta educațională 2026–2027 a școlii: <https://www.ctalicuza.ro/>
- O.M.E.C. nr. 4.350/2025 — planuri-cadru pentru liceu, frecvență zi
- O.M.E.C. nr. 6.873/2025 — planuri-cadru pentru liceu, frecvență seral/redusă
- O.M.E. nr. 7.822/2024 — metodologia formei de învățământ cu frecvență redusă

Datele din aplicație au caracter orientativ. **Lista definitivă a disciplinelor pentru anul tău
se confirmă la secretariatul școlii.**
