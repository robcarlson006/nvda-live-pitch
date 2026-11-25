#!/usr/bin/env python3
"""A themed chart for every one of our own datasets (data/clean), so every part of the DCF, the reverse DCF, the three
discount rates and the Bloomberg data has a ready visual even if the overnight loop produces nothing. No model needed.
Idempotent: a dataset that already has a baseline visual is skipped.
"""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from vault import CLEAN, VAULT, load  # noqa: E402

# Shape → chart kind. Waterfalls for bridges; tables for grids; KPI tiles for one-column summaries.
KIND = {
    'model_dcf_bridge': 'waterfall', 'model_target_bridge': 'waterfall', 'model_dcf_summary': 'table', 'model_dcf_detail': 'table',
    'model_dcf_inputs': 'table', 'model_sensitivity': 'table', 'model_three_rates': 'bar', 'model_downside': 'table',
    'model_implied_growth': 'bar', 'model_vs_analysts': 'bar', 'model_valuation': 'table',
}


def guess(d):
    key = d['key']
    if key in KIND:
        return KIND[key]
    x = d['x']
    if len(x) >= 6 and all(isinstance(v, str) and (v.startswith('FY') or v[:2].isdigit()) for v in x):
        return 'line'
    if len(d['series']) >= 3:
        return 'table'
    return 'bar' if len(x) <= 12 else 'line'


def main():
    done = {v.get('dataset') for v in load('visuals') if v.get('baseline')}
    made = 0
    for name in sorted(os.listdir(CLEAN)):
        if not name.endswith('.json') or ' ' in name:
            continue
        d = json.load(open(os.path.join(CLEAN, name), encoding='utf-8'))
        key = d.get('key') or name[:-5]
        if key in done or not d.get('x') or not d.get('series'):
            continue
        kind = guess(d)
        names = list(d['series'])
        if kind != 'table':
            names = names[:3 if kind == 'line' else 1]
        if kind == 'table':
            names = names[:5]
        spec = {'title': d.get('title', key), 'subtitle': f'Our data · {key}', 'kind': kind, 'dataset': {'key': key, 'series': names}}
        if 'units' in d:
            spec['units'] = d['units']
        if kind == 'waterfall':
            spec['total'] = True
        if 'NVIDIA' in d['x']:
            spec['highlight'] = 'NVIDIA'
        sp = f'visuals/specs/base-{key}.json'
        json.dump(spec, open(os.path.join(VAULT, sp), 'w', encoding='utf-8'), indent=1)
        r = subprocess.run([sys.executable, os.path.join(VAULT, 'tools', 'add.py'), 'visual', '--spec', sp, '--caption', f'Baseline chart of our dataset {key}'],
                           capture_output=True, text=True, cwd=VAULT)
        if r.returncode:
            print(f'skip {key}: {r.stdout.strip()[-200:]} {r.stderr.strip()[-200:]}')
            os.remove(os.path.join(VAULT, sp))
            continue
        made += 1
    # mark them as baseline (add.py writes the row; flag it here)
    rows = load('visuals')
    with open(os.path.join(VAULT, 'db', 'visuals.jsonl'), 'w', encoding='utf-8') as f:
        for v in rows:
            if v.get('spec_file', '').startswith('visuals/specs/base-'):
                v['baseline'] = True
            f.write(json.dumps(v, ensure_ascii=False) + '\n')
    print(f'baseline visuals made: {made}')


if __name__ == '__main__':
    main()
