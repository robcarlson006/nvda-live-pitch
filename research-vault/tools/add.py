#!/usr/bin/env python3
"""The only way to add rows to the vault. Each entry is checked before it is written; a bad one is refused with the reason.

FACT (from a saved web source; copy the quote word for word from the snapshot):
  python3 tools/add.py fact --topic customers --source S0004 --confidence high \
     --claim "Hyperscalers were about half of Data Center revenue in Q3 FY27" \
     --quote "large cloud service providers represented approximately 50% of Data Center revenue" \
     [--value 50 --unit % --period "Q3 FY27" --as-of 2026-10-25] [--tags a,b]
FACT (from our own data in data/clean, read-only):
  python3 tools/add.py fact --topic dcf --source local:model_three_rates --series "Value per share" --x "15.4% Bloomberg" \
     --value 226.87 --unit USD --claim "At Bloomberg's 15.4% WACC our DCF gives $226.87 a share" --confidence high
Q&A (an expected board question and a 1-4 bullet answer; every number must be in a linked fact):
  python3 tools/add.py qa --question "How much of revenue is from China?" --answer "bullet one | bullet two" \
     --facts F0012,F0013 [--variants "China exposure? | What if China is cut off?"] [--stance risk] [--visuals V0003]
VISUAL (write the spec first, see tools/render.py for the format):
  python3 tools/add.py visual --spec visuals/specs/china-revenue.json --facts F0012,F0013 --caption "..." [--qa Q0004]
"""
import argparse
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from check import check_fact, check_numbers, check_visual  # noqa: E402
from vault import TOPICS, VAULT, append, load, next_id, now  # noqa: E402


def split(s, sep=','):
    return [x.strip() for x in (s or '').split(sep) if x.strip()]


def refuse(problems):
    print('REFUSED:')
    for p in problems:
        print(' -', p)
    sys.exit(1)


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='kind', required=True)
    f = sub.add_parser('fact')
    f.add_argument('--topic', required=True, choices=TOPICS)
    f.add_argument('--claim', required=True)
    f.add_argument('--source', required=True)
    f.add_argument('--quote', default='')
    f.add_argument('--value', type=float)
    f.add_argument('--unit', default='')
    f.add_argument('--period', default='')
    f.add_argument('--as-of', default='')
    f.add_argument('--series', default='')
    f.add_argument('--x', default='')
    f.add_argument('--confidence', default='medium', choices=['high', 'medium', 'low'])
    f.add_argument('--tags', default='')
    q = sub.add_parser('qa')
    q.add_argument('--question', required=True)
    q.add_argument('--answer', required=True, help='bullets separated by |')
    q.add_argument('--facts', required=True)
    q.add_argument('--variants', default='')
    q.add_argument('--stance', default='neutral', choices=['strength', 'risk', 'neutral'])
    q.add_argument('--visuals', default='')
    v = sub.add_parser('visual')
    v.add_argument('--spec', required=True)
    v.add_argument('--facts', default='')
    v.add_argument('--caption', default='')
    v.add_argument('--qa', default='')
    a = ap.parse_args()

    facts = {x['id']: x for x in load('facts')}
    if a.kind == 'fact':
        row = {'id': next_id('facts'), 'topic': a.topic, 'claim': a.claim.strip(), 'source': a.source, 'quote': a.quote.strip(),
               'value': a.value, 'unit': a.unit, 'period': a.period, 'as_of': a.as_of, 'confidence': a.confidence,
               'tags': split(a.tags), 'added': now()}
        if a.source.startswith('local:'):
            row.update(series=a.series, x=a.x)
        if any(x['source'] == row['source'] and x.get('quote') and x['quote'] == row['quote'] and x['claim'] == row['claim'] for x in facts.values()):
            refuse(['the same fact from the same source is already in the vault'])
        problems = []
        check_fact(row, {s['id']: s for s in load('sources')}, problems)
        if problems:
            refuse(problems)
        append('facts', row)
        print(f"{row['id']} added")
    elif a.kind == 'qa':
        ids = split(a.facts)
        missing = [i for i in ids if i not in facts]
        answer = split(a.answer, '|')
        problems = [f'unknown fact {i}' for i in missing]
        if not 1 <= len(answer) <= 4:
            problems.append('give 1-4 answer bullets separated by |')
        if any(len(b) > 200 for b in answer):
            problems.append('keep each bullet under 200 characters: it is read aloud')
        check_numbers(' '.join(answer), [facts[i] for i in ids if i in facts], 'answer', problems)
        if problems:
            refuse(problems)
        row = {'id': next_id('qa'), 'question': a.question.strip(), 'variants': split(a.variants, '|'), 'answer': answer,
               'facts': ids, 'stance': a.stance, 'visuals': split(a.visuals), 'added': now()}
        append('qa', row)
        print(f"{row['id']} added")
    else:
        spec_path = a.spec if os.path.isabs(a.spec) else os.path.join(VAULT, a.spec)
        if not os.path.exists(spec_path):
            refuse([f'spec not found: {a.spec}'])
        vid = next_id('visuals')
        rel_spec = os.path.relpath(spec_path, VAULT)
        svg = f'visuals/svg/{vid}.svg'
        r = subprocess.run([sys.executable, os.path.join(VAULT, 'tools', 'render.py'), rel_spec, svg], capture_output=True, text=True, cwd=VAULT)
        if r.returncode:
            refuse([f'render failed: {(r.stderr or r.stdout).strip()[-400:]}'])
        spec = json.load(open(spec_path, encoding='utf-8'))
        fids = split(a.facts) or sorted({fid for s in spec.get('series', []) for fid in s.get('facts', []) if fid})
        if spec.get('custom_svg'):  # show the hand-drawn version; check.py vets its numbers against the spec
            svg = spec['custom_svg']
        row = {'id': vid, 'title': spec.get('title', ''), 'kind': spec.get('kind', ''), 'spec_file': rel_spec, 'svg_file': svg,
               'facts': fids, 'dataset': (spec.get('dataset') or {}).get('key'), 'caption': a.caption, 'qa': split(a.qa), 'added': now()}
        problems = []
        check_visual(row, facts, problems)
        if problems:
            os.remove(os.path.join(VAULT, svg)) if os.path.exists(os.path.join(VAULT, svg)) else None
            refuse(problems)
        append('visuals', row)
        print(f'{vid} added · {svg}')


if __name__ == '__main__':
    main()
