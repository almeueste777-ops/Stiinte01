#!/usr/bin/env python3
"""Graphify — transformă datele aplicației într-un vault Obsidian interconectat.

Citește `data/curriculum.json` și `data/continut.json` și scrie folderul `vault/`
cu note Markdown legate prin wikilink-uri, astfel încât Graph View din Obsidian
să arate întreaga structură a liceului: parcurs -> clase -> materii -> lecții.

Rulare:  python3 tools/graphify.py
Ieșirea este deterministă: aceleași date de intrare produc aceleași fișiere.
"""

import json
import os
import re
import shutil
import sys

RADACINA = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VAULT = os.path.join(RADACINA, "vault")

NELEGAL = re.compile(r'[\\/:*?"<>|#^\[\]]')

# Note fixe, ca să nu apară „magic strings” prin tot fișierul.
N_START = "00 Start aici"
N_PARCURS = "Parcurs școlar"
N_BAC = "Bacalaureat"
N_SCOALA = "Școala"
N_HARTA = "Hartă de învățare"


def nume_fisier(text):
    """Curăță un titlu ca să fie nume de fișier valid pe Windows și în Obsidian."""
    curat = NELEGAL.sub(" ", text.replace(":", " -"))
    curat = re.sub(r"\s+", " ", curat).strip().strip(".")
    return curat or "fara-titlu"


def link(nume, eticheta=None):
    return "[[%s|%s]]" % (nume, eticheta) if eticheta else "[[%s]]" % nume


def yaml_lista(valori):
    return "\n".join("  - %s" % v for v in valori)


def frontmatter(tags, aliases=None, extra=None):
    linii = ["---", "tags:", yaml_lista(tags)]
    if aliases:
        linii += ["aliases:", yaml_lista(aliases)]
    for cheie, valoare in (extra or {}).items():
        linii.append("%s: %s" % (cheie, valoare))
    linii.append("---")
    return "\n".join(linii)


def scrie(cale_relativa, continut):
    cale = os.path.join(VAULT, cale_relativa)
    os.makedirs(os.path.dirname(cale), exist_ok=True)
    with open(cale, "w", encoding="utf-8", newline="\n") as f:
        f.write(continut.rstrip() + "\n")


def slug_tag(text):
    """Tag Obsidian valid: fără spații, fără diacritice problematice."""
    tabel = str.maketrans("ăâîșțĂÂÎȘȚ", "aaistAAIST")
    curat = text.translate(tabel).lower()
    curat = re.sub(r"[^a-z0-9]+", "-", curat).strip("-")
    return curat or "diverse"


# --------------------------------------------------------------------------
# Generarea notelor
# --------------------------------------------------------------------------

def nota_scoala(scoala, parcurs):
    corp = [
        frontmatter(["scoala"], extra={"cssclasses": "fisa"}),
        "# %s" % scoala["nume"],
        "",
        "> [!info] Date de contact",
        "> **Localitate:** %s" % scoala["localitate"],
        "> **Adresă:** %s" % scoala["adresa"],
        "> **Secretariat:** %s (%s)" % (scoala["telefonSecretariat"], scoala["programSecretariat"]),
        "> **E-mail:** %s" % scoala["email"],
        "> **Site:** %s" % scoala["site"],
        "",
        "Aici urmez %s, %s, specializarea **%s**, %s."
        % (link(N_PARCURS, parcurs["filiera"].lower()), parcurs["profil"].lower(),
           parcurs["specializare"], parcurs["forma"].lower()),
        "",
        "## Legături",
        "- %s" % link(N_PARCURS),
        "- %s" % link(N_BAC),
        "- %s" % link(N_START),
    ]
    return "\n".join(corp)


def nota_parcurs(parcurs, clase, scoala):
    randuri = ["| Clasă | An | Materii |", "| --- | --- | --- |"]
    for cl in clase:
        nume = "Clasa %s" % cl["clasa"]
        randuri.append("| %s | %s | %d |" % (link(nume), cl["an"], len(cl["materii"])))

    corp = [
        frontmatter(["parcurs"], extra={"cssclasses": "fisa"}),
        "# Parcurs școlar",
        "",
        "| Câmp | Valoare |",
        "| --- | --- |",
        "| Filieră | %s |" % parcurs["filiera"],
        "| Profil | %s |" % parcurs["profil"],
        "| Specializare | %s |" % parcurs["specializare"],
        "| Formă de învățământ | %s |" % parcurs["forma"],
        "| Durată | %s |" % parcurs["durata"],
        "| Locuri în oferta 2026–2027 | %s |" % parcurs["locuriOferta20262027"],
        "",
        "> [!warning] Cum se comprimă materia la frecvență redusă",
        "> %s" % parcurs["observatie"],
        "",
        "## Cei cinci ani",
        "",
        "\n".join(randuri),
        "",
        "## Legături",
        "- %s" % link(N_SCOALA, scoala["nume"]),
        "- %s" % link(N_BAC),
    ]
    return "\n".join(corp)


def nota_bacalaureat(bac, materii_bac):
    probe = [
        ("E)a)", bac["probaEa"]),
        ("E)b)", bac["probaEb"]),
        ("E)c)", bac["probaEc"]),
        ("E)d)", bac["probaEd"]),
        ("A", bac["probaA"]),
        ("B", bac["probaB"]),
        ("D", bac["probaD"]),
    ]
    randuri = ["| Probă | Disciplină / competență |", "| --- | --- |"]
    randuri += ["| **%s** | %s |" % (cod, text) for cod, text in probe]

    corp = [
        frontmatter(["bacalaureat"], extra={"cssclasses": "fisa"}),
        "# Bacalaureat",
        "",
        "\n".join(randuri),
        "",
        "## Materii care intră la bac",
        "",
        "\n".join("- %s" % link(m) for m in materii_bac),
        "",
        "## Legături",
        "- %s" % link(N_PARCURS),
        "- %s" % link(N_START),
    ]
    return "\n".join(corp)


def nota_clasa(cl, clase, module_dupa_materie):
    nume = "Clasa %s" % cl["clasa"]
    indice = [c["clasa"] for c in clase].index(cl["clasa"])
    vecini = []
    if indice > 0:
        vecini.append("⬅ %s" % link("Clasa %s" % clase[indice - 1]["clasa"]))
    if indice < len(clase) - 1:
        vecini.append("%s ➡" % link("Clasa %s" % clase[indice + 1]["clasa"]))

    pe_arii = {}
    for m in cl["materii"]:
        pe_arii.setdefault(m["arie"], []).append(m)

    sectiuni = []
    for arie in sorted(pe_arii):
        sectiuni.append("### %s" % link("Arie - %s" % arie, arie))
        for m in pe_arii[arie]:
            semne = []
            if m["bac"]:
                semne.append("🎓 bac")
            if m["nume"] in module_dupa_materie:
                mod = module_dupa_materie[m["nume"]]
                semne.append("📘 %d lecții în aplicație" % len(mod["lectii"]))
            sufix = " — %s" % ", ".join(semne) if semne else ""
            sectiuni.append("- %s%s" % (link(m["nume"]), sufix))
        sectiuni.append("")

    corp = [
        frontmatter(["clasa", "clasa/%s" % slug_tag(cl["clasa"])],
                    extra={"an": cl["an"], "cssclasses": "fisa"}),
        "# %s" % nume,
        "",
        "Anul **%d** din cei 5 ai parcursului %s." % (cl["an"], link(N_PARCURS)),
        "",
        " · ".join(vecini) if vecini else "",
        "",
        "## Materii (%d)" % len(cl["materii"]),
        "",
        "\n".join(sectiuni),
    ]
    return nume, "\n".join(corp)


def nota_arie(arie, materii_din_arie, clase_din_arie):
    nume = "Arie - %s" % arie
    corp = [
        frontmatter(["arie-curriculara"], aliases=[arie], extra={"cssclasses": "fisa"}),
        "# %s" % arie,
        "",
        "Arie curriculară din planul-cadru.",
        "",
        "## Materii",
        "",
        "\n".join("- %s" % link(m) for m in materii_din_arie),
        "",
        "## Se studiază în",
        "",
        "\n".join("- %s" % link("Clasa %s" % c) for c in clase_din_arie),
    ]
    return nume, "\n".join(corp)


def nota_materie(nume, arie, clase_unde, la_bac, modul):
    tags = ["materie", "materie/%s" % slug_tag(nume)]
    if la_bac:
        tags.append("bac")

    corp = [
        frontmatter(tags, extra={"cssclasses": "fisa"}),
        "# %s" % nume,
        "",
        "> [!abstract] Pe scurt",
        "> **Arie curriculară:** %s" % link("Arie - %s" % arie, arie),
        "> **Se studiază în:** %s" % ", ".join(link("Clasa %s" % c) for c in clase_unde),
        "> **La bacalaureat:** %s" % ("da 🎓" if la_bac else "nu"),
    ]

    if modul:
        corp += [
            "",
            "%s" % modul["descriere"],
            "",
            "## Lecții (%d)" % len(modul["lectii"]),
            "",
        ]
        for lectie in modul["lectii"]:
            corp.append("- %s" % link(nume_fisier(lectie["titlu"])))
        corp += [
            "",
            "## Exersare",
            "- %s — %d carduri" % (link("Carduri - %s" % nume_fisier(nume)),
                                   len(modul["flashcards"])),
            "- %s — %d întrebări" % (link("Test - %s" % nume_fisier(nume)),
                                     len(modul["quiz"])),
        ]
    else:
        corp += [
            "",
            "> [!todo] Fără conținut în aplicație",
            "> Materia apare în planul-cadru, dar încă nu are lecții în `data/continut.json`.",
            "> Adaugă un modul acolo și rulează din nou `graphify` ca să apară aici.",
        ]

    corp += ["", "## Legături", "- %s" % link(N_START), "- %s" % link(N_PARCURS)]
    return "\n".join(corp)


PLACEHOLDER_NOTITE = "%% Scrie aici cu cuvintele tale — asta e partea care rămâne. %%"
BLOC_NOTITE = re.compile(r"^## Notițele mele\n\n(.*?)\n\n---\n", re.M | re.S)
ID_LECTIE = re.compile(r"^id: (\S+)$", re.M)


def notite_existente():
    """Recuperează ce a scris utilizatorul la „Notițele mele”, indexat după id-ul lecției.

    Notele sunt regenerate de la zero la fiecare rulare, așa că textul propriu
    trebuie citit înainte de ștergere și pus la loc după. Cheia este id-ul din
    frontmatter, nu numele fișierului, ca redenumirea unei lecții să nu piardă nimic.
    """
    pastrate = {}
    folder = os.path.join(VAULT, "Lecții")
    if not os.path.isdir(folder):
        return pastrate
    for fisier in os.listdir(folder):
        if not fisier.endswith(".md"):
            continue
        with open(os.path.join(folder, fisier), encoding="utf-8") as f:
            text = f.read()
        id_gasit = ID_LECTIE.search(text)
        bloc = BLOC_NOTITE.search(text)
        if not id_gasit or not bloc:
            continue
        scris = bloc.group(1).strip()
        if scris and scris != PLACEHOLDER_NOTITE:
            pastrate[id_gasit.group(1)] = scris
    return pastrate


def nota_lectie(lectie, modul, indice, total, notite=""):
    nume = nume_fisier(lectie["titlu"])
    materie = modul["materie"]

    vecini = []
    if indice > 0:
        vecini.append("⬅ %s" % link(nume_fisier(modul["lectii"][indice - 1]["titlu"])))
    if indice < total - 1:
        vecini.append("%s ➡" % link(nume_fisier(modul["lectii"][indice + 1]["titlu"])))

    corp = [
        frontmatter(["lectie", "materie/%s" % slug_tag(materie)],
                    aliases=[lectie["titlu"]] if lectie["titlu"] != nume else None,
                    extra={"id": lectie["id"], "clasa": '"%s"' % modul["clasa"]}),
        "# %s" % lectie["titlu"],
        "",
        "%s · %s · lecția %d din %d"
        % (link(materie), link("Clasa %s" % modul["clasa"]), indice + 1, total),
        "",
        "## Rezumat",
        "",
        lectie["rezumat"],
        "",
        "## Idei-cheie",
        "",
        "\n".join("- %s" % ideea for ideea in lectie["ideiCheie"]),
        "",
        "## Notițele mele",
        "",
        notite or PLACEHOLDER_NOTITE,
        "",
        "---",
        "",
        " · ".join(vecini) if vecini else "",
        "",
        "Exersează: %s · %s"
        % (link("Carduri - %s" % nume_fisier(materie)),
           link("Test - %s" % nume_fisier(materie))),
    ]
    return nume, "\n".join(corp)


def nota_carduri(modul):
    materie = modul["materie"]
    nume = "Carduri - %s" % nume_fisier(materie)

    corp = [
        frontmatter(["carduri", "materie/%s" % slug_tag(materie)],
                    extra={"cssclasses": "carduri"}),
        "# Carduri — %s" % materie,
        "",
        "%d carduri pentru %s. Formatul `întrebare::răspuns` este cel folosit de "
        "pluginul *Spaced Repetition*; fără plugin rămân simple linii de recapitulare."
        % (len(modul["flashcards"]), link(materie)),
        "",
        "#flashcards/%s" % slug_tag(materie),
        "",
    ]
    for card in modul["flashcards"]:
        corp.append("%s::%s" % (card["f"], card["v"]))
        corp.append("")

    corp += ["---", "", "Înapoi la %s · %s" % (link(materie), link("Test - %s" % nume_fisier(materie)))]
    return nume, "\n".join(corp)


def nota_test(modul):
    materie = modul["materie"]
    nume = "Test - %s" % nume_fisier(materie)

    corp = [
        frontmatter(["test", "materie/%s" % slug_tag(materie)],
                    extra={"cssclasses": "test"}),
        "# Test — %s" % materie,
        "",
        "%d întrebări din %s. Răspunsurile sunt ascunse: apasă pe săgeata "
        "callout-ului ca să le vezi." % (len(modul["quiz"]), link(materie)),
        "",
    ]
    for i, intrebare in enumerate(modul["quiz"], start=1):
        corp.append("### %d. %s" % (i, intrebare["intrebare"]))
        corp.append("")
        for j, optiune in enumerate(intrebare["optiuni"]):
            corp.append("- %s. %s" % (chr(ord("a") + j), optiune))
        corp.append("")
        corect = intrebare["optiuni"][intrebare["corect"]]
        corp.append("> [!success]- Răspuns")
        corp.append("> **%s. %s**" % (chr(ord("a") + intrebare["corect"]), corect))
        corp.append("> ")
        corp.append("> %s" % intrebare["explicatie"])
        corp.append("")

    corp += ["---", "", "Înapoi la %s · %s" % (link(materie), link("Carduri - %s" % nume_fisier(materie)))]
    return nume, "\n".join(corp)


def nota_start(curriculum, module, statistici):
    parcurs = curriculum["parcurs"]
    corp = [
        frontmatter(["moc"], extra={"cssclasses": "start"}),
        "# Științe sociale — vault de studiu",
        "",
        "Vault-ul are **două jumătăți**, în același folder:",
        "",
        "1. **Conținutul de studiu** — notele de mai jos, *generate automat* din datele "
        "aplicației (`data/curriculum.json` și `data/continut.json`). Nu le edita direct: "
        "modifică datele și rulează din nou `python3 tools/graphify.py`.",
        "2. **Documentația proiectului** — scrisă de mână, în folderele numerotate: "
        "[[Științe Sociale — MOC]] e punctul de intrare, de acolo se ajunge la sistemul "
        "de design, la arhitectură, la jurnalul de lucru și la rapoartele de verificare. "
        "Generatorul **nu** atinge acele foldere.",
        "",
        "> [!tip] Unde scrii tu",
        "> Secțiunea **Notițele mele** din fiecare lecție și orice notă nouă pe care o "
        "> creezi în afara folderelor generate rămân neatinse.",
        "",
        "## Parcursul",
        "- %s — %s, %s, %s" % (link(N_PARCURS), parcurs["filiera"], parcurs["specializare"], parcurs["forma"]),
        "- %s" % link(N_SCOALA),
        "- %s" % link(N_BAC),
        "- %s" % link(N_HARTA),
        "",
        "## Clasele",
        "",
        "\n".join("- %s" % link("Clasa %s" % cl["clasa"]) for cl in curriculum["clase"]),
        "",
        "## Materii cu lecții în aplicație",
        "",
    ]
    for modul in module:
        corp.append("- %s — %d lecții, %d carduri, %d întrebări (%s)"
                    % (link(modul["materie"]), len(modul["lectii"]),
                       len(modul["flashcards"]), len(modul["quiz"]),
                       link("Clasa %s" % modul["clasa"])))

    corp += [
        "",
        "## Cifre",
        "",
        "| | |",
        "| --- | --- |",
        "| Clase | %d |" % statistici["clase"],
        "| Materii distincte | %d |" % statistici["materii"],
        "| Materii cu conținut | %d |" % statistici["module"],
        "| Lecții | %d |" % statistici["lectii"],
        "| Carduri | %d |" % statistici["carduri"],
        "| Întrebări de test | %d |" % statistici["intrebari"],
        "| Note în vault | %d |" % statistici["note"],
    ]
    return "\n".join(corp)


def nota_harta(module, clase):
    """O notă-diagramă: harta parcursului, ca să existe și o vedere vizuală."""
    linii = ["```mermaid", "graph LR"]
    linii.append('  P["Științe sociale · FR"]')
    for i, cl in enumerate(clase):
        linii.append('  C%d["Clasa %s"]' % (i, cl["clasa"]))
        linii.append("  P --> C%d" % i)
    for j, modul in enumerate(module):
        indice = [c["clasa"] for c in clase].index(modul["clasa"])
        eticheta = modul["materie"].split(",")[0].split("(")[0].strip()
        linii.append('  M%d["%s<br/>%d lecții"]' % (j, eticheta, len(modul["lectii"])))
        linii.append("  C%d --> M%d" % (indice, j))
    linii.append("```")

    corp = [
        frontmatter(["moc"], extra={"cssclasses": "harta"}),
        "# Hartă de învățare",
        "",
        "Unde stă fiecare materie cu conținut în cei cinci ani.",
        "",
        "\n".join(linii),
        "",
        "## Ordinea recomandată",
        "",
    ]
    for i, modul in enumerate(module, start=1):
        corp.append("%d. %s — %s" % (i, link(modul["materie"]), link("Clasa %s" % modul["clasa"])))

    corp += ["", "Înapoi la %s" % link(N_START)]
    return "\n".join(corp)


def config_obsidian():
    """Configurație minimă, ca vault-ul să se deschidă gata aranjat."""
    return {
        "app.json": {
            "attachmentFolderPath": "Atasamente",
            "newLinkFormat": "shortest",
            "useMarkdownLinks": False,
            "alwaysUpdateLinks": True,
            "defaultViewMode": "preview",
        },
        "appearance.json": {"accentColor": "#1c3d5a", "theme": "system"},
        "core-plugins.json": [
            "file-explorer", "global-search", "switcher", "graph", "backlink",
            "outgoing-link", "tag-pane", "page-preview", "note-composer",
            "command-palette", "outline", "word-count", "file-recovery",
        ],
        "graph.json": {
            "collapse-filter": False,
            "search": "",
            "showTags": True,
            "showAttachments": False,
            "collapse-color-groups": False,
            "colorGroups": [
                {"query": "tag:#lectie", "color": {"a": 1, "rgb": 5025616}},
                {"query": "tag:#materie", "color": {"a": 1, "rgb": 14701138}},
                {"query": "tag:#clasa", "color": {"a": 1, "rgb": 1852506}},
                {"query": "tag:#carduri", "color": {"a": 1, "rgb": 10233776}},
                {"query": "tag:#test", "color": {"a": 1, "rgb": 13391189}},
                {"query": "tag:#moc OR tag:#bacalaureat", "color": {"a": 1, "rgb": 16750592}},
            ],
            "collapse-display": False,
            "showArrow": True,
            "textFadeMultiplier": -0.3,
            "nodeSizeMultiplier": 1.2,
            "lineSizeMultiplier": 1,
            "collapse-forces": False,
            "centerStrength": 0.5,
            "repelStrength": 12,
            "linkStrength": 1,
            "linkDistance": 180,
            "scale": 0.7,
        },
    }


# --------------------------------------------------------------------------

def main():
    with open(os.path.join(RADACINA, "data", "curriculum.json"), encoding="utf-8") as f:
        curriculum = json.load(f)
    with open(os.path.join(RADACINA, "data", "continut.json"), encoding="utf-8") as f:
        continut = json.load(f)

    module = continut["module"]
    clase = curriculum["clase"]
    module_dupa_materie = {m["materie"]: m for m in module}

    # Notițele proprii se citesc înainte de ștergere și se pun la loc mai jos.
    notite = notite_existente()

    # Curăț DOAR folderele generate. Restul vault-ului — documentația scrisă de
    # mână din 00-Index, 10-Jurnal, 20-Design, 30-Aplicatie, 40-Verificare, plus
    # orice notă proprie — rămâne neatins.
    for folder in ("Curriculum", "Materii", "Lecții", "Carduri", "Teste"):
        cale = os.path.join(VAULT, folder)
        if os.path.isdir(cale):
            shutil.rmtree(cale)

    scrise = 0

    # Materii distincte, cu ariile și clasele în care apar.
    materii = {}
    for cl in clase:
        for m in cl["materii"]:
            fisa = materii.setdefault(m["nume"], {"arie": m["arie"], "clase": [], "bac": False})
            fisa["clase"].append(cl["clasa"])
            fisa["bac"] = fisa["bac"] or m["bac"]

    arii = {}
    for nume, fisa in materii.items():
        intrare = arii.setdefault(fisa["arie"], {"materii": [], "clase": set()})
        intrare["materii"].append(nume)
        intrare["clase"].update(fisa["clase"])

    ordine_clase = [c["clasa"] for c in clase]

    # Curriculum
    scrie("Curriculum/%s.md" % N_SCOALA, nota_scoala(curriculum["scoala"], curriculum["parcurs"]))
    scrie("Curriculum/%s.md" % N_PARCURS, nota_parcurs(curriculum["parcurs"], clase, curriculum["scoala"]))
    materii_bac = sorted(n for n, f in materii.items() if f["bac"])
    scrie("Curriculum/%s.md" % N_BAC, nota_bacalaureat(curriculum["bacalaureat"], materii_bac))
    scrise += 3

    for cl in clase:
        nume, text = nota_clasa(cl, clase, module_dupa_materie)
        scrie("Curriculum/%s.md" % nume_fisier(nume), text)
        scrise += 1

    for arie in sorted(arii):
        clase_sortate = sorted(arii[arie]["clase"], key=ordine_clase.index)
        nume, text = nota_arie(arie, sorted(arii[arie]["materii"]), clase_sortate)
        scrie("Curriculum/%s.md" % nume_fisier(nume), text)
        scrise += 1

    # Materii
    for nume in sorted(materii):
        fisa = materii[nume]
        text = nota_materie(nume, fisa["arie"], fisa["clase"], fisa["bac"],
                            module_dupa_materie.get(nume))
        scrie("Materii/%s.md" % nume_fisier(nume), text)
        scrise += 1

    # Lecții, carduri, teste
    total_lectii = total_carduri = total_intrebari = 0
    for modul in module:
        for i, lectie in enumerate(modul["lectii"]):
            nume, text = nota_lectie(lectie, modul, i, len(modul["lectii"]),
                                     notite.get(lectie["id"], ""))
            scrie("Lecții/%s.md" % nume, text)
            scrise += 1
            total_lectii += 1

        nume, text = nota_carduri(modul)
        scrie("Carduri/%s.md" % nume, text)
        scrise += 1
        total_carduri += len(modul["flashcards"])

        nume, text = nota_test(modul)
        scrie("Teste/%s.md" % nume, text)
        scrise += 1
        total_intrebari += len(modul["quiz"])

    statistici = {
        "clase": len(clase),
        "materii": len(materii),
        "module": len(module),
        "lectii": total_lectii,
        "carduri": total_carduri,
        "intrebari": total_intrebari,
        "note": scrise + 2,
    }

    scrie("%s.md" % N_START, nota_start(curriculum, module, statistici))
    scrie("%s.md" % N_HARTA, nota_harta(module, clase))

    # Configurația .obsidian aparține utilizatorului, nu generatorului: vault-ul
    # conține și note scrise de mână (sistemul de design, jurnalul, verificările),
    # iar culorile grafului și lista de plugin-uri sunt reglate pentru amândouă
    # jumătățile. O rescriere la fiecare rulare ar șterge acele reglaje.
    # De aceea scriem doar fișierele care lipsesc — adică la prima generare, sau
    # dacă cineva le șterge intenționat ca să le refacă.
    for fisier, valoare in config_obsidian().items():
        cale = os.path.join(VAULT, ".obsidian", fisier)
        if os.path.exists(cale):
            continue
        os.makedirs(os.path.dirname(cale), exist_ok=True)
        with open(cale, "w", encoding="utf-8", newline="\n") as f:
            json.dump(valoare, f, ensure_ascii=False, indent=2)
            f.write("\n")

    print("Vault generat în %s" % VAULT)
    for cheie in ("clase", "materii", "module", "lectii", "carduri", "intrebari", "note"):
        print("  %-10s %d" % (cheie, statistici[cheie]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
