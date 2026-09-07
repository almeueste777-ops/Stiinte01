---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-xii-a
id: tic12-13
clasa: "a XII-a"
---
# Baze de date

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a XII-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a XII-a]] · lecția 13 din 16

**Capitolul:** Baze de date și căutare — semestrul 2

## Rezumat

Proiectarea și exploatarea bazelor de date relaționale la nivel avansat: 1. Constrângeri de integritate și validare la nivel de câmp: În Microsoft Access, modul Design View permite impunerea unor reguli stricte de validare (Field Properties): • Required: Yes (câmpul devine obligatoriu, nu poate fi lăsat necompletat); • Validation Rule (Regulă de validare): expresie logică (ex: `>= 1 And <= 10` pentru note, sau `> #01/01/2000#` pentru date calendaristice); • Validation Text: mesajul de eroare în limba română afișat pe ecran dacă utilizatorul introduce o valoare interzisă; • Default Value: valoarea completată automat dacă utilizatorul nu scrie nimic (ex: "Romania" la câmpul Țară). 2. Interogări complexe cu câmpuri calculate și totaluri: • Câmpuri calculate: într-o interogare se pot crea coloane noi inexistente fizic în tabel (ex: `Total: [Pret] * [Cantitate]` sau `MedieGenerala: ([Nota1] + [Nota2]) / 2`); • Interogări de totaluri (Totals - butonul Sigma): permit gruparea datelor (Group By) și aplicarea funcțiilor de agregare: Sum (suma vânzărilor pe orașe), Avg (media notelor pe clase), Count (numărul de elevi din fiecare profil). 3. Interogări de acțiune (Action Queries): Spre deosebire de interogările de selecție simple, interogările de acțiune modifică datele din tabele: • Update Query (interogare de actualizare): mărește prețurile cu 10% pentru o categorie; • Delete Query (interogare de ștergere): elimină automat înregistrările mai vechi de 5 ani; • Append Query: adaugă date dintr-un tabel în altul.

## Idei-cheie

- Proprietatea Required: Yes impune completarea obligatorie a unui câmp.
- Validation Rule blochează la nivel de bază de date introducerea cifrelor eronate.
- Câmpurile calculate într-o interogare efectuează operații matematice pe baza valorilor din paranteze drepte `[Camp]`.
- Interogările de totaluri (Totals) calculează sume, medii și numărători agregate pe grupuri de date.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Prezentările electronice]] · [[Căutarea și evaluarea informației]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a XII-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a XII-a)]]
