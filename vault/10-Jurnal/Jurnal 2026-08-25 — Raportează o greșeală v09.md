---
titlu: Jurnal 2026-08-25 — Raportează o greșeală v09
tip: jurnal
versiune: "09"
actualizat: 2026-08-25
tags: [jurnal, feedback, raportare, accesibilitate, localstorage]
---

# Jurnal 2026-08-25 — v09, „Raportează o greșeală"

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Strategie și foaie de parcurs]] ·
[[Versiuni]] · [[Jurnal 2026-08-25 — Imagini explicative v08]]

## Cererea

Task-ul **T2** din foaia de parcurs (pilon 1 — încrederea în conținut): un elev să poată semnala o
greșeală direct din lecție sau de la rezultatul testului. Închide bucla cu utilizatorii reali și
alimentează T5 (verificarea conținutului). Cerut „cu consum minim de tokeni" — munca grea în subagenți
izolați, verificare independentă cu cei doi agenți.

## Ce s-a implementat

- **Buton pe lecție** (`#raporteaza` în `viewLectie`) și **link per întrebare** în lista „De recitit"
  de la rezultatul testului (`.rap-link[data-rap-q]`, capturează enunțul întrebării ca context).
- **Dialog accesibil** (reutilizează `.scrim`/`.sheet`): `role="dialog"` + `aria-modal` +
  `aria-labelledby`, capcană de focus (Tab ciclează), Escape / „Renunță" / atingerea fundalului închid,
  focusul revine pe declanșator; ținte ≥44px; tot textul prin `esc()`.
- **Stocare locală**: `state.rapoarte` = `{id, tip, refId, motiv, nota, data, context}`, sanitizat la
  încărcare (aditiv: absent → `[]`, intrări stricate aruncate, plafon ultimele 200).
- **Export, fără e-mail**: rapoartele intră automat în copia completă de rezervă ȘI au un export
  dedicat („Exportă rapoartele de greșeli"), prin aceeași cale Blob/anchor. **Fără `mailto`, fără e-mail
  hardcodat** — ar fi expus o adresă personală într-o aplicație publică. Salvare locală + export.
- **Management în Setări → „Datele mele"**: numărul de rapoarte + export + ștergere.

## Versionare

- `sw.js`: `CACHE` v12 → **v13**; `?v=` 12 → **13** (index.html + SHELL, cf. regulii #4; CI cere
  `?v == CACHE`).
- `data/versiuni.json`: intrare nouă **v09 „Raportează o greșeală"** (cache 13), scrisă pentru elev;
  `curenta` → „09".

## Verificare

Bateria locală integral verde; `node --test` **33/33** (suita T1 + un test nou pentru sanitizarea
`rapoarte`, cu dinți: pică pe o copie fără blocul de sanitizare); CI `CACHE v13 ↔ ?v=13` OK;
`test-sw.mjs` TRECUT (o reîncărcare pe v13, zero erori JS).

**Echipa de agenți.** `verificator-cod`: **CURAT** — XSS închis (fiecare câmp de raport e escapat sau
nu ajunge în DOM; câmpurile libere doar se exportă ca JSON, nu în DOM), sanitizare aditivă robustă,
fără TDZ, fără scurgeri la export, fluxuri intacte, versiuni sincrone. `verificator-ui`: **CURAT** pe
24 de combinații (5 lățimi + peisaj × 4 teme) + rezultatul testului + setări — zero derulare
orizontală, ținte ≥44px, contrast ≥AA, focus vizibil.

**O corecție** (defect real, neblocant, prins de `verificator-cod`): dialogul rămânea orfan peste
ecranul nou dacă utilizatorul naviga (Back din browser) cu foaia deschisă → adăugat un ascultător
`hashchange` care închide foaia (simetric cu teardown-ul de `keydown`), reverificat empiric.

## Polish de accesibilitate rămas (tipar preexistent, nu regresie T2)

Partajate cu onboarding-ul, deci de reparat într-o trecere unitară, nu doar în T2:
- fundalul nu e `inert`/`aria-hidden` cât timp modalul e deschis (capcana de focus acoperă tastatura);
- două toasturi se pot suprapune (poziție `top` fixă comună);
- în contrast-ridicat, bordura câmpurilor select/textarea e sub pragul WCAG 1.4.11 (≥3:1) — câmpurile
  rămân identificabile prin umplere + umbră + inel de focus.

## Ce urmează

Coada: **T3.1+** (roll-out imagini explicative, BAC întâi), **T4** (moduri de examen), **T5** (alimentat
acum de rapoarte). Un singur task pe sesiune.
