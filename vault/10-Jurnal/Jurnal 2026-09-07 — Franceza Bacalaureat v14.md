---
titlu: Jurnal 2026-09-07 — Franceza Bacalaureat v14
tip: jurnal
versiune: "14"
actualizat: 2026-09-07
tags: [jurnal, franceza, bacalaureat, proba-b, cefr, gramatica-de-baza]
---

# Jurnal 2026-09-07 — v14, Limba modernă 2 (Franceză) de la zero (gimnaziu VI–VIII) la Bacalaureat Proba B (IX–XIII)

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]]

## Cerința

Consolidarea completă a materiei de Limba Franceză pentru toate nivelurile liceale (clasele a IX-a până la a XIII-a), oferind o punte solidă pentru elevii fără bază din gimnaziu (clasele VI–VIII) și ducând conținutul până la nivelul de competențe B2 cerut la Bacalaureat (Proba B).

## Ce s-a implementat

1. **Punte de pornire de la zero (bază gimnazială integrată în clasa a IX-a):**
   - Fonetică & alfabet: 26 de litere, 5 semne diacritice (accent aigu, grave, circonflexe, cédille, tréma), regula consoanelor finale mute și a consoanelor sonore CaReFuL.
   - Valori fonetice fixe: „ou” [u], „au/eau” [o], „ai/ei” [ɛ], „oi” [wa], „ch” [ʃ], „gn” [ɲ], vocalele nazale (an, on, in, un) și mecanismul de liaison sonoră (les amis -> [lezami]).
   - Verbele fundamentale: conjugarea completă a verbelor neregulate uzuale (être, avoir, aller, faire, venir, prendre, pouvoir, vouloir), expresiile idiomatice cu „avoir” (avoir faim/soif/chaud/peur/sommeil/16 ans) și distincția fonetică esențială „ils ont” [ilzɔ̃] vs „ils sont” [ilsɔ̃].
   - Mecanismul negației: ne... pas/plus/jamais/rien/que și regula de aur a transformării articolelor partitive/nehotărâte în „de” (je ne bois pas de café).
   - Cele 3 registre interogative: familiar (intonație), standard (est-ce que) și formal (inversiune verb-subiect).

2. **Standardul complet pentru Bacalaureat Proba B (clasa a XIII-a):**
   - Subiectul 1 (80–100 de cuvinte): text funcțional informal/semi-formal (scrisoare/e-mail prietenesc, formule specifice de deschidere și încheiere, nivel A1–B1).
   - Subiectul 2 (160–180 de cuvinte): eseu de opinie / text argumentativ academic (registru formal, conectori logici, structură pe paragrafe, nivel B2).
   - Structura completă a celor 4 probe: înțelegerea orală (compréhension orale), înțelegerea scrisă (compréhension des écrits), producerea scrisă (production écrite) și producerea/interacțiunea orală (production orale).

3. **Validare, PWA & Obsidian Vault:**
   - Compilat modulele cu `tools/text-in-modul.mjs` (0 erori).
   - Validat structura cu `tools/verifica-continut.mjs` (63 module, 1.177 lecții).
   - Reconstruit indexul `data/continut.json` și lista de precache prin `tools/construieste-index.mjs`.
   - Bump versiune la **v14**, actualizat `data/versiuni.json`, crescut cache la `stiinte01-v18` în `sw.js` și `index.html`.
   - Regenerat vaultul Obsidian cu `tools/graphify.py` și adăugat jurnal dedicat în vault.
