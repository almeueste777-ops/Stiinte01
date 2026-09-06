# -*- coding: utf-8 -*-
def make_header(materie, clasa, an, arie, descriere, bac=True, socioUman=True):
    lines = [
        f'materie: {materie}',
        f'clasa: {clasa}',
        f'an: {an}',
        f'arie: {arie}',
        'bac: da' if bac else 'bac: nu',
    ]
    if socioUman:
        lines.append('socioUman: da')
    lines.append(f'descriere: {descriere}')
    lines.append('')
    return '\n'.join(lines)

def make_chapter(semestru, id, title):
    return f'## {semestru} | {id} | {title}\n'

def make_lesson(id, title, summary, ideas, terms, cards, questions):
    lines = [f'### {id} | {title}']
    for p in summary:
        lines.append(p)
    for i in ideas:
        lines.append(f'* {i}')
    for t, d in terms:
        lines.append(f'= {t} :: {d}')
    for q, a in cards:
        lines.append(f'@ {q} :: {a}')
    for q, c, ws, exp in questions:
        lines.append(f'? {q}')
        lines.append(f'+ {c}')
        for w in ws:
            lines.append(f'- {w}')
        lines.append(f'! {exp}')
    lines.append('')
    return '\n'.join(lines)

def make_teza(semestru, questions):
    lines = [f'%% teza {semestru}']
    for q, c, ws, exp in questions:
        lines.append(f'? {q}')
        lines.append(f'+ {c}')
        for w in ws:
            lines.append(f'- {w}')
        lines.append(f'! {exp}')
    lines.append('')
    return '\n'.join(lines)
