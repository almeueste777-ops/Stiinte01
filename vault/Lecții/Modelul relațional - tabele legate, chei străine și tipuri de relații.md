---
tags:
  - lectie
  - materie/tehnologia-informatiei-si-a-comunicatiilor-tic
  - clasa/a-x-a
aliases:
  - Modelul relațional: tabele legate, chei străine și tipuri de relații
id: tic10-15
clasa: "a X-a"
---
# Modelul relațional: tabele legate, chei străine și tipuri de relații

[[Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)|Tehnologia informației și a comunicațiilor (TIC)]] · [[Clasa a X-a]] · lecția 15 din 16

**Capitolul:** Baze de date relaționale: relații și integritate — semestrul 2

## Rezumat

Într-o bază de date profesională, informațiile nu se stochează de-a valma într-un singur tabel uriaș (ceea ce ar produce redundanță masivă, spațiu irosit și erori la actualizare), ci sunt împărțite în tabele specializate pe entități distincte: de exemplu, un tabel Profesori, un tabel Clase și un tabel Elevi. Conectarea logică între aceste tabele se realizează prin intermediul Relațiilor bazate pe Chei Străine (Foreign Keys): • Cheia Străină (Foreign Key) este un câmp dintr-un tabel care face referire la Cheia Primară a altui tabel asociat. Tipurile fundamentale de relații între tabele sunt: 1. Relația Unu-la-Mulți (One-to-Many / 1:N): este cea mai frecventă relație. O înregistrare din tabelul A se asociază cu mai multe înregistrări din tabelul B, dar o înregistrare din B corespunde unei singure înregistrări din A. De exemplu: o Clasă are mai mulți Elevi (1:N), dar un elev aparține unei singure clase. 2. Relația Unu-la-Unu (One-to-One / 1:1): o înregistrare din tabelul A corespunde exact unei singure înregistrări din B (ex: un Cetățean are un singur Pașaport). 3. Relația Mulți-la-Mulți (Many-to-Many / N:M): o înregistrare din A se asociază cu mai multe din B, și invers. De exemplu: un Elev studiază mai multe Materii, iar la o Materie participă mai mulți Elevi. În bazele de date relaționale, o relație N:M nu se poate implementa direct, ci se descompune în două relații 1:N prin intermediul unui tabel de legătură (Junction Table, ex: tabelul Note).

## Idei-cheie

- Tabelele specializate elimină redundanța (duplicarea inutilă a datelor).
- Cheia străină (Foreign Key) leagă înregistrarea curentă de cheia primară a tabelului părinte.
- Relația 1:N (unul la mulți) este cea mai răspândită structură în bazele de date.
- Relația mulți-la-mulți (N:M) se descompune în două relații 1:N printr-un tabel intermediar de legătură.

## Notițele mele

%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%

---

⬅ [[Tablouri unidimensionale (vectori) și prelucrarea colecțiilor de date]] · [[Integritatea referențială și normalizarea bazelor de date]] ➡

Exersează: [[Carduri - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]] · [[Test - Tehnologia informației și a comunicațiilor (TIC) (clasa a X-a)]]
