---
titlu: Jurnal 2026-08-23 — Motivație și progres v06
tip: jurnal
versiune: "06"
actualizat: 2026-08-23
tags: [jurnal, motivatie, progres, insigne, gamificare, onboarding]
---

# Jurnal 2026-08-23 — v06, „Motivație și progres"

Legături: [[Științe Sociale — MOC]] · [[Motivație și progres]] · [[Arhitectura aplicației]] ·
[[Sistemul de învățare]] · [[Versiuni]] · [[Jurnal 2026-08-22 — Cromatică v05]] ·
[[Raport verificare v06]]

## Cererea

> „Fă un audit aplicației. Compară cu aplicațiile bune de pe piață. Vezi ce îi lipsește ca să
> fie o aplicație premium și implementează."

## Auditul

Aplicația era deja peste media pieței la **pedagogie** și **design**. Repetiția eșalonată de
aici e reală (variantă SM-2 cu calibrare și stăpânire cu prag — vezi [[Sistemul de învățare]]),
pe când multe aplicații „premium" numesc „spaced repetition" un simplu program fix de
reminder-e. Designul are sistem propriu, mișcare iOS reală, contrast WCAG verificat și
funcționare 100% offline — offline fiind chiar o funcție *plătită* la Duolingo Plus.

Ce le deosebește pe cele premium și lipsea aici, fezabil fără backend:

1. **Motivație / gamificare** — insigne, streak proeminent, momente de recompensă.
2. **Tablou de progres** — statistici detaliate, heatmap de activitate, tendințe.
3. **Onboarding** — primul contact.
4. (**Reminder-e push** — lăsate deoparte: fără backend nu pot livra ce promit.)

> [!note] De ce insigne, nu un sistem de puncte (XP)
> Un XP paralel peste stăpânirea deja măsurată ar fi fost gamificare de dragul gamificării.
> Insignele se leagă de învățare reală (o materie citită complet, o serie de studiu, nota 10),
> deci recompensa rămâne aliniată cu scopul aplicației, nu îl diluează. Detaliile deciziei:
> [[Motivație și progres]].

## Ce s-a implementat

Descrierea completă a stratului nou: [[Motivație și progres]]. Pe scurt:

- **20 de insigne**, grupate, derivate din starea existentă; monotone; sădire tăcută la migrare.
- **Sărbătoare**: toast (atașat pe `<body>`, supraviețuiește re-randării) + confetti CSS, cu
  respect pentru comutatorul „Sărbători" și pentru „mișcarea redusă".
- **Progresul (`#/progres`)**: streak, heatmap pe 18 săptămâni, cifre, stăpânire pe materii,
  note recente, „de reluat curând".
- **Seria** numără orice studiu (nu doar lecțiile citite): `state.activ` nou, migrat din `zile`.
- **Onboarding** la prima pornire (componentele `.sheet`/`.scrim`), reaccesibil din Setări.
- **Acasă** devine hub; Setări capătă „Sărbători" și „Revezi introducerea".

## O incoerență prinsă de verificatorul de cod

Resetările granulare din Setări curățau doar starea veche, nu și cea nouă: după „Șterge
antrenamentul" stăpânirea cădea la 0%, dar contorul „N sesiune" din Progres rămânea — două cifre
care se contraziceau exact pe ecranul introdus de v06. Corectat: fiecare resetare curăță acum și
starea nouă pe care o „deține" (`reset-progres` → `activ`; `reset-antren/teste/note` → contoarele
din `stats`), iar după „Șterge tot" insignele se re-sădesc, ca prima recâștigată să fie iar
sărbătorită.

> [!warning] Aceeași filozofie, aplicată consecvent
> „Nu inunda elevul vechi" era deja regula insignelor (sădire tăcută). Verificatorul a observat
> că onboarding-ul o încălca: un elev venit de pe v05 (fără câmpul `vazutIntro`) primea foaia
> „Bine ai venit!". Rezolvat în `sanitizeaza`: cine are progres anterior e considerat „a văzut".

## Versionare

- `sw.js`: `CACHE` v9 → **v10**; `?v=9` → `?v=10` (CSS + JS).
- `manifest`: `id` stabil + scurtătura „Progresul meu".
- `data/versiuni.json`: intrare nouă v06 (cache 10), scrisă pentru elev, `curenta` → „06".

## Verificare

Bateria locală trece integral. Smoke-test propriu (Playwright + chrome-headless-shell):
onboarding, heatmap fără derulare orizontală pe toată scara, 20 de medalioane, sărbătoare
end-to-end, zero erori de consolă. `tools/test-sw.mjs` (actualizat să sară onboarding-ul):
ciclul de update cu SW activ — trecut. Echipa de agenți: [[Raport verificare v06]].
