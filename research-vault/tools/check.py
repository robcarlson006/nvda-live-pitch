#!/usr/bin/env python3
"""Validator for the whole vault. The loop script runs this after every iteration; a red result is repaired or rolled back.

Rules (the same ones tools/add.py enforces on entry):
  sources  : id, url, cache_file that exists, accessed date
  facts    : known topic; claim <= 240 chars; either a web source whose saved page contains the quote word for word,
             or a local dataset (local:<key>) whose value matches; a value, if given, must appear in the quote
  qa       : question, 1-4 answer bullets, >= 1 fact; every number in the answer appears in a linked fact
  visuals  : spec file exists and renders; every plotted value traces to a fact (same number) or to data/clean
Exit 0 = green. Prints counts by topic so the morning summary can show coverage.
"""
import json
import os
import re
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(__file__))
from vault import TOPICS, VAULT, dataset, load, numbers_in, snapshot_text, squash  # noqa: E402

TRIVIAL = {0, 1, 2, 3, 4, 5, 10, 100}


def decimals(v):
    s = repr(float(v))
    return 0 if s.endswith('.0') else min(4, len(s.split('.')[1]))


def close(a, b):
    """Equal once the more precise number is rounded to the other's decimals (51.9 ~ 51.911; 1994 != 1993),
    allowing million/billion/thousand scaling (57.006bn ~ 57,006m)."""
    for k in (1, 1000, 0.001, 1e6, 1e-6):
        x = b * k
        if abs(round(x, decimals(a)) - a) < 1e-9 or abs(round(a, decimals(x)) - x) < 1e-9:
            return True
    return False


def fact_values(fact):
    vals = []
    if isinstance(fact.get('value'), (int, float)):
        vals.append(float(fact['value']))
    vals += numbers_in(fact.get('quote', '')) + numbers_in(fact.get('claim', ''))
    return vals


def check_fact(f, sources, problems):
    fid = f.get('id', '?')
    if f.get('topic') not in TOPICS:
        problems.append(f'{fid}: topic "{f.get("topic")}" not in the topic list')
    claim = f.get('claim', '')
    if not claim or len(claim) > 240:
        problems.append(f'{fid}: claim missing or over 240 chars')
    src = str(f.get('source', ''))
    if src.startswith('local:'):
        ds = dataset(src[6:])
        if not ds:
            problems.append(f'{fid}: local dataset {src[6:]} not found in data/clean')
            return
        try:
            v = ds['series'][f['series']][ds['x'].index(f['x'])]
        except (KeyError, ValueError, TypeError):
            problems.append(f'{fid}: series/x not found in {src[6:]}')
            return
        if not isinstance(f.get('value'), (int, float)) or v is None or not close(float(f['value']), float(v)):
            problems.append(f'{fid}: value {f.get("value")} does not match {src[6:]} ({v})')
        return
    s = sources.get(src)
    if not s:
        problems.append(f'{fid}: unknown source {src}')
        return
    quote = f.get('quote', '')
    if len(quote) < 20:
        problems.append(f'{fid}: quote under 20 chars (copy the sentence that states it)')
        return
    page = snapshot_text(s)
    if not page:
        problems.append(f'{fid}: source {src} has no saved snapshot')
    elif squash(quote) not in squash(page):
        problems.append(f'{fid}: quote not found word for word in the saved page of {src}')
    if isinstance(f.get('value'), (int, float)):
        if not any(close(float(f['value']), n) for n in numbers_in(quote)):
            problems.append(f'{fid}: value {f["value"]} does not appear in its quote')
    if f.get('confidence') not in ('high', 'medium', 'low'):
        problems.append(f'{fid}: confidence must be high, medium or low')


def check_numbers(text, facts, label, problems):
    allowed = [v for f in facts for v in fact_values(f)]
    for n in numbers_in(text):
        if n in TRIVIAL or (1990 <= n <= 2040 and float(n).is_integer()):
            continue  # years and list numbers
        if not any(close(n, a) for a in allowed):
            problems.append(f'{label}: number {n:g} is not in any linked fact')


def spec_values(spec):
    """(value, fact id or None) for every plotted point, or dataset references."""
    out = []
    for s in spec.get('series', []):
        vals = s.get('values', [])
        fids = s.get('facts', [])
        for i, v in enumerate(vals):
            if v is None:
                continue
            out.append((v, fids[i] if i < len(fids) else None))
    return out


def check_visual(v, facts_by_id, problems):
    vid = v.get('id', '?')
    sp = os.path.join(VAULT, v.get('spec_file', ''))
    if not v.get('spec_file') or not os.path.exists(sp):
        problems.append(f'{vid}: spec file missing')
        return
    try:
        spec = json.load(open(sp, encoding='utf-8'))
    except Exception as e:  # noqa: BLE001
        problems.append(f'{vid}: spec is not valid JSON ({e})')
        return
    ds = spec.get('dataset')
    if ds:
        d = dataset(ds.get('key', ''))
        if not d:
            problems.append(f'{vid}: data/clean dataset {ds.get("key")} not found')
        else:
            for name in ds.get('series', []):
                if name not in d['series']:
                    problems.append(f'{vid}: series "{name}" not in {ds["key"]}')
    else:
        pts = spec_values(spec)
        if not pts:
            problems.append(f'{vid}: no data (give "dataset" or "series" with values and facts)')
        for val, fid in pts:
            f = facts_by_id.get(fid)
            if not f:
                problems.append(f'{vid}: value {val} has no linked fact')
            elif not any(close(float(val), a) for a in fact_values(f)):
                problems.append(f'{vid}: value {val} does not match fact {fid}')
    for key in ('svg_file',):
        if v.get(key) and not os.path.exists(os.path.join(VAULT, v[key])):
            problems.append(f'{vid}: {key} missing')
    custom = spec.get('custom_svg')
    if custom:  # a hand-drawn SVG: every number written on it must be in its spec's data or linked facts
        cp = os.path.join(VAULT, custom)
        if not os.path.exists(cp):
            problems.append(f'{vid}: custom_svg {custom} missing')
        else:
            text = re.sub(r'<[^>]+>', ' ', re.sub(r'<(style|defs|script)[\s\S]*?</\1>', ' ', open(cp, encoding='utf-8').read()))
            allowed = [{'value': p[0]} for p in spec_values(spec)] + [facts_by_id[i] for i in v.get('facts', []) if i in facts_by_id]
            if ds and dataset(ds.get('key', '')):
                d = dataset(ds['key'])
                allowed += [{'value': x} for n in ds.get('series', []) for x in d['series'].get(n, []) if isinstance(x, (int, float))]
            check_numbers(text, allowed, f'{vid} custom svg', problems)
    if not ds:  # words on a fact-based chart may only use numbers that are in its facts or its plotted values
        linked = [facts_by_id[i] for i in v.get('facts', []) if i in facts_by_id] + [{'value': p[0]} for p in spec_values(spec)]
        check_numbers(f"{spec.get('title', '')} {spec.get('subtitle', '')}", linked, f'{vid} title', problems)
        check_numbers(v.get('caption', ''), linked, f'{vid} caption', problems)


def main():
    problems = []
    sources = {s['id']: s for s in load('sources')}
    for s in sources.values():
        if not s.get('url') or not s.get('cache_file') or not os.path.exists(os.path.join(VAULT, s['cache_file'])):
            problems.append(f'{s.get("id")}: source missing url or snapshot')
    facts = load('facts')
    ids = Counter(r.get('id') for t in ('sources', 'facts', 'qa', 'visuals') for r in load(t))
    problems += [f'duplicate id {i}' for i, n in ids.items() if n > 1]
    for f in facts:
        check_fact(f, sources, problems)
    by_id = {f['id']: f for f in facts}
    for q in load('qa'):
        qid = q.get('id', '?')
        if not q.get('question') or not (1 <= len(q.get('answer', [])) <= 4):
            problems.append(f'{qid}: needs a question and 1-4 answer bullets')
        linked = [by_id[i] for i in q.get('facts', []) if i in by_id]
        if not linked:
            problems.append(f'{qid}: no valid linked facts')
        check_numbers(' '.join(q.get('answer', [])), linked, qid, problems)
    for v in load('visuals'):
        check_visual(v, by_id, problems)

    topics = Counter(f.get('topic') for f in facts)
    print(f'sources {len(sources)} · facts {len(facts)} · qa {len(load("qa"))} · visuals {len(load("visuals"))}')
    print('facts by topic: ' + ', '.join(f'{t} {n}' for t, n in topics.most_common()))
    if problems:
        print(f'\nRED: {len(problems)} problem(s)')
        for p in problems[:60]:
            print(' -', p)
        sys.exit(1)
    print('GREEN')


if __name__ == '__main__':
    main()
