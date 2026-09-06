---
titlu: Jurnal 2026-09-06 — Biologie Bacalaureat v11
tip: jurnal
versiune: "11"
actualizat: 2026-09-06
tags: [jurnal, biologie, bacalaureat, real, curriculum]
---

# Jurnal 2026-09-06 — v11, Biologie completă pentru Bacalaureat (clasele IX – XIII)

Legături: [[Științe Sociale — MOC]] · [[Arhitectura aplicației]] · [[Versiuni]]

## Cerința

Adaptarea aplicației pentru profilul real și pregătirea examenului național de Bacalaureat la Biologie: integrarea ambelor variante oficiale de programă (atât Biologie vegetală și animală din clasele IX-X, cât și Anatomie, fiziologie umană, genetică și ecologie din clasele XI-XIII).

## Ce s-a implementat

1. **Module noi de conținut:**
   - `data/sursa/biologie-11.txt`: 11 lecții de anatomie și fiziologie umană (sistem nervos, analizatori, glande endocrine, locomotor, nutriție, respirație, circulație, excreție, reproducere), 44 carduri, 44 întrebări grilă, 2 teze semestriale.
   - `data/sursa/biologie-12.txt`: 8 lecții de genetică moleculară (acizi nucleici, transcripție, translație, mendelism, mutații, inginerie genetică) și ecologie generală, 32 carduri, 32 întrebări, 2 teze.
   - `data/sursa/biologie-13.txt`: 6 lecții aplicative de sinteză pentru Bacalaureat (rezolvarea problemelor de genetică mendeliană și grupe sanguine, calcul ADN/ARN, corelații fiziologice în efort, imunitate, tehnica de rezolvare și redactare pentru Subiectul I, II și III).
   - Clasele a IX-a și a X-a: marcat `bac: da` în ambele surse și în planul de învățământ.

2. **Arhitectură și date:**
   - Actualizat `data/curriculum.json` pentru a cuprinde Biologia în clasele IX-XIII cu statut de probă de Bacalaureat (`bac: true`).
   - Compilat cu `tools/text-in-modul.mjs` și reconstruit indexul prin `tools/construieste-index.mjs`: aplicația atinge **63 de module, 1.177 lecții, 4.708 carduri și 6.698 întrebări**.

3. **PWA și precache offline:**
   - Actualizat Service Worker (`sw.js`) la `CACHE = 'stiinte01-v15'` și lista de precache `MODULE`.
   - Sincronizat `?v=15` în `index.html` pentru `app.css`, `tema-aurora.css` și `app.js`.
   - Adăugat jurnalul de versiune v11 pentru elev în `data/versiuni.json`.

4. **Vault Obsidian:**
   - Regenerat automat prin `tools/graphify.py` (1.425 note, 9.677 legături).
   - Validat cu `tools/verifica_vault.py` (0 legături rupte, 0 note orfane).
