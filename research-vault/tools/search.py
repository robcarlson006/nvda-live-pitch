#!/usr/bin/env python3
"""Web search through Obscura (headless browser), Bing results.

  python3 tools/search.py "nvidia sovereign ai revenue 2026"          # web
  python3 tools/search.py --news "nvidia export controls china"       # news
Prints: rank. title — real URL. Never solve or work around a CAPTCHA: if one appears, change the query or the site.
"""
import base64
import os
import re
import subprocess
import sys
import urllib.parse

sys.path.insert(0, os.path.dirname(__file__))
from vault import VAULT, now  # noqa: E402


def real_url(link):
    q = urllib.parse.parse_qs(urllib.parse.urlparse(link).query)
    u = q.get('u', [''])[0]
    if u.startswith('a1'):
        b = u[2:]
        b += '=' * (-len(b) % 4)
        try:
            return base64.urlsafe_b64decode(b).decode('utf-8', 'replace')
        except Exception:
            return link
    return link


def main():
    args = sys.argv[1:]
    news = '--news' in args
    args = [a for a in args if a != '--news']
    if not args:
        raise SystemExit(__doc__)
    q = ' '.join(args)
    base = 'https://www.bing.com/news/search' if news else 'https://www.bing.com/search'
    url = f'{base}?q={urllib.parse.quote_plus(q)}&setlang=en-GB&cc=GB'
    try:
        out = subprocess.run(['obscura', '--stealth', '--storage-dir', os.path.join(VAULT, 'cache', 'obscura'), 'fetch', url, '--dump', 'markdown'],
                             capture_output=True, text=True, timeout=75).stdout
    except subprocess.TimeoutExpired:
        raise SystemExit('search timed out; try a shorter query')
    if re.search(r'captcha|verify you are a human|unusual traffic', out, re.I):
        raise SystemExit('search engine showed a human check. Do not try to solve it: wait, or rephrase, or fetch a known primary site directly')
    seen = set()
    rank = 0
    for m in re.finditer(r'^#{2,3} \[(.+?)\]\((\S+?)\)\s*$', out, re.M):
        title = re.sub(r'\*\*', '', m.group(1)).strip()
        link = real_url(m.group(2))
        if not link.startswith('http') or 'bing.com' in link or link in seen:
            continue
        seen.add(link)
        rank += 1
        print(f'{rank}. {title} — {link}')
    if not rank:
        print('no results parsed; rephrase the query')
    with open(os.path.join(VAULT, 'state', 'logs', 'searches.log'), 'a', encoding='utf-8') as f:
        f.write(f'{now()}\t{"news" if news else "web"}\t{q}\t{rank}\n')


if __name__ == '__main__':
    main()
