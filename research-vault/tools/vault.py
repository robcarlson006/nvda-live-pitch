"""Shared helpers for the research vault. Standard library only.

The vault is four JSON-lines tables in db/ (sources, facts, qa, visuals). Every fact points at a source, and every
source has a saved snapshot of the page in cache/pages/, so a quote can always be checked against what was read.
"""
import json
import os
import re
import time

VAULT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT = os.path.dirname(VAULT)
DB = os.path.join(VAULT, 'db')
CACHE = os.path.join(VAULT, 'cache', 'pages')
CLEAN = os.path.join(PROJECT, 'data', 'clean')  # the app's datasets: read-only for the loop
TABLES = ('sources', 'facts', 'qa', 'visuals')
PREFIX = {'sources': 'S', 'facts': 'F', 'qa': 'Q', 'visuals': 'V'}

TOPICS = [
    'financials', 'segments', 'customers', 'guidance', 'valuation', 'dcf', 'peers', 'competition', 'products',
    'software-cuda', 'networking', 'supply-chain', 'china-export', 'regulation', 'governance', 'management',
    'esg-environment', 'esg-social', 'energy-ai', 'water', 'emissions', 'risks', 'bear-case', 'bull-case',
    'macro', 'ai-demand', 'sovereign-ai', 'uk', 'history', 'shareholder-returns', 'analysts', 'market', 'other',
]


def now():
    return time.strftime('%Y-%m-%dT%H:%M:%S')


def path(table):
    return os.path.join(DB, f'{table}.jsonl')


def load(table):
    rows = []
    p = path(table)
    if not os.path.exists(p):
        return rows
    with open(p, encoding='utf-8') as f:
        for n, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError as e:
                raise SystemExit(f'db/{table}.jsonl line {n} is not valid JSON: {e}')
    return rows


def append(table, row):
    with open(path(table), 'a', encoding='utf-8') as f:
        f.write(json.dumps(row, ensure_ascii=False) + '\n')


def next_id(table):
    rows = load(table)
    nums = [int(r['id'][1:]) for r in rows if re.fullmatch(r'[A-Z]\d+', str(r.get('id', '')))]
    return f"{PREFIX[table]}{(max(nums) + 1) if nums else 1:04d}"


def squash(text):
    """Text compared for quotes: lower case, one space, plain quotes and dashes, no markdown emphasis or links."""
    t = text.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"')
    t = t.replace('–', '-').replace('—', '-').replace(' ', ' ')
    t = re.sub(r'\[\[[^\]]*\]\]\([^)]*\)', '', t)  # [[5]](#cite_note-6) citation markers
    for _ in range(2):
        t = re.sub(r'\[([^\[\]]*)\]\([^)]*\)', r'\1', t)  # [text](link) -> text (twice: links inside links)
    t = re.sub(r'\[(\d+|[a-z])\]', '', t)  # [5], [a]
    t = re.sub(r'\(https?://[^)]*\)', '', t)
    t = re.sub(r'[*_`#>|]', ' ', t)
    return re.sub(r'\s+', ' ', t).strip().lower()


def numbers_in(text):
    """Numbers as written: 1,234.5 -> 1234.5. Years and small list markers are kept; callers decide."""
    return [float(n.replace(',', '')) for n in re.findall(r'(?<![\w.])-?\d[\d,]*(?:\.\d+)?', text)]


def snapshot_text(source):
    f = source.get('cache_file')
    if not f:
        return ''
    p = os.path.join(VAULT, f)
    if not os.path.exists(p):
        return ''
    with open(p, encoding='utf-8', errors='replace') as fh:
        return fh.read()


def dataset(key):
    p = os.path.join(CLEAN, f'{key}.json')
    if not os.path.exists(p):
        return None
    with open(p, encoding='utf-8') as f:
        return json.load(f)
