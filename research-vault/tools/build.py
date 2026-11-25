#!/usr/bin/env python3
"""Compile the vault for people and for the app. No model needed; the loop runs it after every iteration.

  vault.sqlite   tables sources, facts, qa, visuals (+ fact_visuals, qa_facts) for querying
  INDEX.md       every fact by topic, with its source; every Q&A with its answer
  gallery.html   every visual with its caption, linked facts and sources; searchable; open it in a browser
  catalog.json   one record per visual / Q&A for the app to import later
"""
import html
import json
import os
import sqlite3
import sys
from collections import defaultdict

sys.path.insert(0, os.path.dirname(__file__))
from vault import VAULT, load, now  # noqa: E402

E = html.escape


def main():
    sources = {s['id']: s for s in load('sources')}
    facts = load('facts')
    fb = {f['id']: f for f in facts}
    qa = load('qa')
    visuals = load('visuals')

    db = os.path.join(VAULT, 'vault.sqlite')
    if os.path.exists(db):
        os.remove(db)
    c = sqlite3.connect(db)
    c.executescript('''
      create table sources(id text primary key, url text, title text, publisher text, published text, accessed text, kind text, cache_file text);
      create table facts(id text primary key, topic text, claim text, value real, unit text, period text, as_of text, source text, quote text, confidence text, tags text);
      create table qa(id text primary key, question text, variants text, answer text, stance text);
      create table qa_facts(qa text, fact text);
      create table visuals(id text primary key, title text, kind text, svg_file text, spec_file text, dataset text, caption text);
      create table fact_visuals(fact text, visual text);''')
    c.executemany('insert into sources values (?,?,?,?,?,?,?,?)', [(s['id'], s.get('url'), s.get('title'), s.get('publisher'), s.get('published'), s.get('accessed'), s.get('kind'), s.get('cache_file')) for s in sources.values()])
    c.executemany('insert into facts values (?,?,?,?,?,?,?,?,?,?,?)', [(f['id'], f.get('topic'), f.get('claim'), f.get('value'), f.get('unit'), f.get('period'), f.get('as_of'), f.get('source'), f.get('quote'), f.get('confidence'), ','.join(f.get('tags', []))) for f in facts])
    c.executemany('insert into qa values (?,?,?,?,?)', [(q['id'], q['question'], ' | '.join(q.get('variants', [])), ' | '.join(q['answer']), q.get('stance')) for q in qa])
    c.executemany('insert into qa_facts values (?,?)', [(q['id'], f) for q in qa for f in q.get('facts', [])])
    c.executemany('insert into visuals values (?,?,?,?,?,?,?)', [(v['id'], v.get('title'), v.get('kind'), v.get('svg_file'), v.get('spec_file'), v.get('dataset'), v.get('caption')) for v in visuals])
    c.executemany('insert into fact_visuals values (?,?)', [(f, v['id']) for v in visuals for f in v.get('facts', [])])
    c.commit()
    c.close()

    def cite(sid):
        if str(sid).startswith('local:'):
            return f'our data: data/clean/{sid[6:]}.json'
        s = sources.get(sid, {})
        return f"{s.get('publisher') or s.get('title', '')} ({s.get('published') or s.get('accessed', '')}) {s.get('url', '')}"

    by_topic = defaultdict(list)
    for f in facts:
        by_topic[f.get('topic', 'other')].append(f)
    lines = [f'# NVDA research vault — index', f'Built {now()} · {len(sources)} sources · {len(facts)} facts · {len(qa)} Q&A · {len(visuals)} visuals', '',
             'Open `gallery.html` for the visuals. Every fact below quotes its source word for word (checked against the saved page).', '']
    lines.append('## Board questions (prepared answers)')
    for q in qa:
        lines.append(f"### {q['id']} · {q['question']}  _{q.get('stance', '')}_")
        lines += [f'- {b}' for b in q['answer']]
        lines.append(f"  - facts: {', '.join(q.get('facts', []))}" + (f" · visuals: {', '.join(q['visuals'])}" if q.get('visuals') else ''))
    lines.append('')
    for t in sorted(by_topic):
        lines.append(f'## {t} ({len(by_topic[t])})')
        for f in by_topic[t]:
            lines.append(f"- **{f['id']}** {f['claim']} _[{f.get('confidence', '')}; {f.get('period') or f.get('as_of') or ''}]_ — {cite(f['source'])}")
        lines.append('')
    open(os.path.join(VAULT, 'INDEX.md'), 'w', encoding='utf-8').write('\n'.join(lines))

    cards = []
    for v in visuals:
        svg = os.path.join(VAULT, v.get('svg_file') or '')
        custom = v.get('html_file')
        linked = [fb[i] for i in v.get('facts', []) if i in fb]
        srcs = sorted({cite(f['source']) for f in linked} | ({f"our data: data/clean/{v['dataset']}.json"} if v.get('dataset') else set()))
        img = f'<img loading="lazy" src="{E(v["svg_file"])}" alt="{E(v.get("title", ""))}">' if os.path.exists(svg) else ''
        cards.append(f'''<article data-q="{E((v.get('title', '') + ' ' + v.get('caption', '') + ' ' + ' '.join(f['claim'] for f in linked)).lower())}">
<a href="{E(v.get('svg_file', ''))}" target="_blank">{img}</a><h3>{E(v['id'])} · {E(v.get('title', ''))}</h3><p>{E(v.get('caption', ''))}</p>
<details><summary>Facts &amp; sources ({len(linked)})</summary><ul>{''.join(f"<li><b>{E(f['id'])}</b> {E(f['claim'])}</li>" for f in linked)}</ul><ul class="src">{''.join(f'<li>{E(s)}</li>' for s in srcs)}</ul></details></article>''')
    qa_html = ''.join(f'''<article class="qa" data-q="{E((q['question'] + ' ' + ' '.join(q.get('variants', [])) + ' ' + ' '.join(q['answer'])).lower())}"><h3>{E(q['id'])} · {E(q['question'])}</h3><ul>{''.join(f'<li>{E(b)}</li>' for b in q['answer'])}</ul><p class="src">{E(', '.join(q.get('facts', [])))}{(' · visuals ' + E(', '.join(q['visuals']))) if q.get('visuals') else ''}</p></article>''' for q in qa)
    page = f'''<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NVDA research vault</title>
<style>:root{{color-scheme:dark}}body{{margin:0;background:#0b0d0a;color:#f4f6f1;font:16px/1.4 system-ui,-apple-system,sans-serif}}header{{position:sticky;top:0;background:#0b0d0aee;padding:16px 24px;border-bottom:1px solid #253020;display:flex;gap:16px;align-items:center;flex-wrap:wrap}}
h1{{margin:0;font-size:22px}}h1 b{{color:#76b900}}input{{flex:1;min-width:220px;padding:10px 14px;border-radius:8px;border:1px solid #39452f;background:#10150c;color:#fff;font-size:16px}}
main{{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:18px;padding:20px 24px}}article{{background:#10150c;border:1px solid #253020;border-radius:12px;padding:12px}}article img{{width:100%;border-radius:8px;display:block}}
h2{{grid-column:1/-1;margin:12px 0 0;color:#76b900}}h3{{margin:10px 0 4px;font-size:16px}}p{{margin:4px 0;color:#c9cdc4}}.src{{color:#9aa094;font-size:13px}}summary{{cursor:pointer;color:#9aa094}}.qa ul{{padding-left:18px}}</style>
<header><h1><b>NVDA</b> research vault</h1><span class="src">{len(visuals)} visuals · {len(qa)} answers · {len(facts)} facts · built {E(now())}</span><input id="q" placeholder="Search: china, scope 3, dcf, water…" autofocus></header>
<main><h2>Visuals</h2>{''.join(cards) or '<p>None yet.</p>'}<h2>Prepared answers</h2>{qa_html or '<p>None yet.</p>'}</main>
<script>document.getElementById('q').addEventListener('input',e=>{{const t=e.target.value.toLowerCase().trim();document.querySelectorAll('article').forEach(a=>a.style.display=!t||a.dataset.q.includes(t)?'':'none')}})</script>'''
    open(os.path.join(VAULT, 'gallery.html'), 'w', encoding='utf-8').write(page)

    catalog = {'built': now(), 'visuals': [{**v, 'sources': sorted({cite(fb[i]['source']) for i in v.get('facts', []) if i in fb})} for v in visuals],
               'qa': [{**q, 'sources': sorted({cite(fb[i]['source']) for i in q.get('facts', []) if i in fb})} for q in qa]}
    json.dump(catalog, open(os.path.join(VAULT, 'catalog.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'built INDEX.md, gallery.html, catalog.json, vault.sqlite · {len(facts)} facts, {len(qa)} qa, {len(visuals)} visuals')


if __name__ == '__main__':
    main()
