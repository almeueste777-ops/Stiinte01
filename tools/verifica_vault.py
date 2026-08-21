#!/usr/bin/env python3
"""Verifică vault-ul generat: wikilink-uri rupte, note orfane, YAML de bază.

Rulare:  python3 tools/verifica_vault.py
Iese cu cod 1 dacă găsește probleme, ca să poată opri build-ul din CI.
"""

import collections
import os
import re
import sys

RADACINA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VAULT = os.path.join(RADACINA, "vault")

LINK = re.compile(r"\[\[([^\]|#]+)")
ALIASES = re.compile(r"^aliases:\n((?:  - .*\n)+)", re.M)


def citeste_notele():
    note = {}
    for radacina, _, fisiere in os.walk(VAULT):
        if ".obsidian" in radacina:
            continue
        for fisier in fisiere:
            if fisier.endswith(".md"):
                cale = os.path.join(radacina, fisier)
                with open(cale, encoding="utf-8") as f:
                    note[fisier[:-3]] = f.read()
    return note


def main():
    if not os.path.isdir(VAULT):
        print("EROARE: nu există folderul vault/. Rulează întâi tools/graphify.py.")
        return 1

    note = citeste_notele()
    if not note:
        print("EROARE: vault-ul e gol.")
        return 1

    alias_catre_nota = {}
    for nume, text in note.items():
        for bloc in ALIASES.findall(text):
            for linie in bloc.strip().split("\n"):
                alias_catre_nota[linie.strip()[2:].strip()] = nume

    rupte = collections.Counter()
    intrari = collections.Counter()
    total_linkuri = 0

    for nume, text in note.items():
        for tinta in LINK.findall(text):
            tinta = tinta.strip()
            total_linkuri += 1
            rezolvat = alias_catre_nota.get(tinta, tinta)
            if rezolvat not in note:
                rupte["%s  (din: %s)" % (tinta, nume)] += 1
            else:
                intrari[rezolvat] += 1

    orfane = sorted(n for n in note if intrari[n] == 0)
    fara_frontmatter = sorted(n for n, t in note.items() if not t.startswith("---\n"))

    print("Note: %d | wikilink-uri: %d" % (len(note), total_linkuri))

    probleme = 0
    if rupte:
        probleme += 1
        print("\nLegături rupte (%d):" % sum(rupte.values()))
        for descriere, numar in rupte.most_common():
            print("  - %s x%d" % (descriere, numar))
    if orfane:
        probleme += 1
        print("\nNote fără nicio legătură către ele (%d):" % len(orfane))
        for nume in orfane:
            print("  - %s" % nume)
    if fara_frontmatter:
        probleme += 1
        print("\nNote fără frontmatter YAML (%d):" % len(fara_frontmatter))
        for nume in fara_frontmatter:
            print("  - %s" % nume)

    if probleme:
        return 1

    print("Vault valid: fără legături rupte, fără note orfane.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
