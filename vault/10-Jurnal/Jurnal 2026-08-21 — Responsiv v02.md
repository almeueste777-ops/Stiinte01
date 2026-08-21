---
titlu: Jurnal 2026-08-21 — Responsiv v02
tip: jurnal
versiune: "02"
actualizat: 2026-08-21
tags: [jurnal, responsiv, performanta]
---

# Jurnal 2026-08-21 — Responsiv v02, „Responsiv total"

Legături: [[Științe Sociale — MOC]] · [[Responsivitate și viteză]] · [[Versiuni]] ·
[[Jurnal 2026-08-21 — Design v01]]

## Cerința

Aplicația arăta bine, dar era proiectată ca o coloană de telefon: pe desktop, o fâșie
de 760px într-un ocean de nisip. Cerința: **utilizabilă pe toate dimensiunile de
ecran, foarte responsivă, cu viteză de reacție foarte mare.** Plus proces: ce se
lucrează pe branch se îmbină în `main`, totul se scrie în jurnal și în vault, iar
fiecare rulare are agenți care verifică.

## Ce s-a făcut și de ce

### Layout pe toată scara de ecrane

- **≤340px** — scara tipografică coboară la 15px bază; nimic nu se mai înghesuie.
- **≥700px** — listele de carduri (Materii, „Continuă unde ai rămas", lecțiile unei
  materii) trec pe **2 coloane** printr-un container nou, `.grid-cards`.
- **≥900px** — lecția devine **două coloane**: textul la stânga, notițele lipicioase
  la dreapta (nu mai derulezi ca să notezi). Planul de învățământ: clasele pe 2 coloane.
- **≥1024px** — bara de taburi devine **rail vertical** ancorat la stânga, ca pe
  iPadOS; pastila indicatoare alunecă acum pe verticală, cu aceleași variabile
  `--tab-i`/`--tab-count` puse de JS. Coloana de conținut crește la 900px.
- **≥1440px** — 3 coloane pentru liste, coloană de 1000px.
- **Safe-area stânga/dreapta** — pe telefon în peisaj, decupajul camerei nu mai
  mușcă din conținut.
- `manifest.webmanifest`: `orientation: any` — aplicația instalată nu mai e blocată
  în portret, ceea ce ar fi contrazis toată treaba de mai sus.

Detaliile și motivele fiecărei trepte: [[Responsivitate și viteză]].

### Viteză de reacție

- **Service worker cache-first la navigare** — aplicația pornește instantaneu din
  cache, chiar și pe rețea proastă; versiunea nouă se descarcă în fundal. Înainte era
  network-first: fiecare pornire aștepta rețeaua.
- **Preload pentru JSON-uri** — datele pleacă la drum odată cu CSS-ul, nu abia după
  ce rulează JS-ul.
- **Delegare de evenimente** — un singur ascultător pe `#view` pentru toată navigarea
  `[data-go]`, în loc de re-legare la fiecare randare.
- **Schimbarea clasei pe Acasă** rescrie doar panoul cu tabelul (~80ms măsurat), nu
  tot ecranul — fără repornirea animațiilor, fără pierderea derulării.
- **Fundalul ambiental** s-a mutat de pe `background-attachment: fixed` (care forța
  repictarea gradientului la fiecare cadru de derulare și e ignorat de iOS Safari) pe
  un pseudo-element `body::before` fix, compus o singură dată pe GPU.

### Un bug prins la verificare, instructiv

Prima variantă a rail-ului punea geometria verticală a pastilei `.tab-ind` în
secțiunea responsivă din **stratul 2**. Dar stilul de bază al pastilei stă în
**stratul 3** (mișcare), mai jos în fișier — deci la aceeași specificitate câștiga
el, iar pastila rămânea o fâșie îngustă care glisa orizontal. Capturile automate au
prins-o imediat; mutarea suprascrierii în stratul 3 a rezolvat-o. Morala veche a
fișierului se confirmă: **ordinea straturilor nu e decorativă.**

### Proces

- `CLAUDE.md` nou la rădăcină, cu **regula nr. 1: cine citește CLAUDE.md citește și
  vault-ul** (MOC + ultima notă de jurnal) — memoria proiectului e aici, nu în chat.
- **Echipa de verificare** e acum instituție: agenții `verificator-cod` și
  `verificator-ui` din `.claude/agents/`, lansați la fiecare rulare care schimbă cod.
- Workflow nou `publicare-pages.yml`: fiecare push pe `main` publică aplicația pe
  GitHub Pages.

## Verificare

Bateria completă: verificatorii din CI local (JSON, sintaxă JS, structură CSS,
precache), capturi Playwright pe **8 viewporturi × 2 teme × 7 ecrane** cu măsurători
automate (fără derulare orizontală, rail corect poziționat, ținte ≥44px), test de
interacțiune cap-coadă, plus **doi agenți independenți** — unul adversarial pe cod,
unul empiric pe interfață. Rezultatul lor: [[Raport verificare v02]].
