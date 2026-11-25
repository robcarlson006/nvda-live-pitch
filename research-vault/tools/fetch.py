#!/usr/bin/env python3
"""Read a page through Obscura, save a snapshot, register it as a source.

  python3 tools/fetch.py URL [--publisher "Reuters"] [--published 2026-11-19] [--kind primary|major-press|secondary|data]
Prints the source id (e.g. S0007), the snapshot path and the page length. Read the snapshot with sed -n / grep, never cat.
Fetching the same URL again returns the existing source id (re-fetch with --refresh).
PDFs are saved and converted to text with pdftotext.
"""
import argparse
import hashlib
import os
import re
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from vault import CACHE, VAULT, append, load, next_id, now  # noqa: E402

OBSCURA = ['obscura', '--stealth', '--storage-dir', os.path.join(VAULT, 'cache', 'obscura')]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('url')
    ap.add_argument('--publisher', default='')
    ap.add_argument('--published', default='', help='publication date YYYY-MM-DD if shown on the page')
    ap.add_argument('--kind', default='secondary', choices=['primary', 'major-press', 'secondary', 'data'])
    ap.add_argument('--refresh', action='store_true')
    a = ap.parse_args()
    if not re.match(r'https?://', a.url):
        raise SystemExit('URL must start with http(s)://')

    known = {s['url']: s for s in load('sources')}
    if a.url in known and not a.refresh:
        s = known[a.url]
        print(f"{s['id']} (already saved) · {s['cache_file']} · {s.get('title', '')}")
        return

    os.makedirs(CACHE, exist_ok=True)
    h = hashlib.sha1(a.url.encode()).hexdigest()[:12]
    is_pdf = a.url.lower().split('?')[0].endswith('.pdf')
    title = ''
    try:
        if is_pdf:
            pdf = os.path.join(CACHE, f'{h}.pdf')
            with open(pdf, 'wb') as f:
                subprocess.run(OBSCURA + ['fetch', a.url, '--dump', 'original'], stdout=f, stderr=subprocess.DEVNULL, timeout=120)
            txt = os.path.join(CACHE, f'{h}.txt')
            subprocess.run(['pdftotext', '-layout', pdf, txt], timeout=120, check=False)
            body = open(txt, encoding='utf-8', errors='replace').read() if os.path.exists(txt) else ''
            rel = f'cache/pages/{h}.txt'
        else:
            r = subprocess.run(OBSCURA + ['fetch', a.url, '--dump', 'markdown'], capture_output=True, text=True, timeout=90)
            m = re.search(r'Page loaded: \S+ - "(.*)"', r.stderr + r.stdout)
            title = m.group(1) if m else ''
            body = re.sub(r'^(Fetching|Page loaded:).*\n', '', r.stdout, flags=re.M)
            rel = f'cache/pages/{h}.md'
            with open(os.path.join(VAULT, rel), 'w', encoding='utf-8') as f:
                f.write(f'<!-- url: {a.url} · fetched {now()} · title: {title} -->\n{body}')
    except subprocess.TimeoutExpired:
        raise SystemExit('fetch timed out; try another source')

    if len(body.strip()) < 300:
        raise SystemExit(f'page too short ({len(body.strip())} chars): blocked, paywalled or empty. Not saved as a source; try another URL')
    if re.search(r'captcha|verify you are a human|access denied|enable javascript and cookies', body[:3000], re.I):
        raise SystemExit('page is a bot check / access denied. Do not work around it; use another source')

    if a.url in known:  # refresh: keep the id, point at the new snapshot
        print(f"{known[a.url]['id']} (refreshed) · {rel}")
        return
    sid = next_id('sources')
    append('sources', {'id': sid, 'url': a.url, 'title': title or a.url, 'publisher': a.publisher, 'published': a.published,
                       'accessed': now()[:10], 'kind': a.kind, 'cache_file': rel})
    print(f'{sid} · {rel} · {len(body):,} chars · {title}')


if __name__ == '__main__':
    main()
