#!/usr/bin/env python3
"""Spec (JSON) -> themed SVG chart, 1600x900, in the pitch's look: near-black, NVIDIA green, the faint core grid.

  python3 tools/render.py visuals/specs/x.json visuals/svg/x.svg

Spec format:
{
  "title": "Who NVIDIA sold to last quarter",        # numbers in a title must come from the data
  "subtitle": "Share of revenue, Q3 FY27",
  "kind": "bar" | "hbar" | "line" | "stacked" | "waterfall" | "kpi" | "table",
  "unit": "USD bn" | "%" | "x" | "USD" | "" ,
  "x": ["Hyperscalers", "AI clouds, industrial & enterprise"],
  "series": [{"name": "Share of revenue", "values": [51.9, 41.0], "facts": ["F0001", "F0002"]}],
     -- or, for our own model/Bloomberg data, instead of x + series:
  "dataset": {"key": "model_three_rates", "series": ["Value per share"]},
  "highlight": "Hyperscalers",                       # optional x to light up
  "total": true,                                     # waterfall: last bar is the running total
  "source": "NVIDIA 10-Q, Q3 FY27"                   # shown bottom left
}
Numbers are printed exactly as given in the data (formatted by unit); the renderer never computes new figures except a
waterfall's running total and stacked totals.
"""
import html
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from vault import VAULT, dataset  # noqa: E402

W, H = 1600, 900
BG, GRID, TEXT, MUTED, DIM = '#0b0d0a', '#141a10', '#f4f6f1', '#9aa094', '#39452f'
GREEN, LIME, AMBER, RED, BLUE = '#76b900', '#b7f04a', '#e8b04a', '#e5484d', '#4ea1d3'
PALETTE = [GREEN, AMBER, '#c9cdc4', BLUE, LIME, RED]
FONT = "'Archivo', 'Archivo Variable', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
L, R, T, B = 140, 80, 210, 140  # plot margins


def esc(s):
    return html.escape(str(s), quote=True)


def fmt(v, unit):
    if v is None:
        return '–'
    a = abs(v)
    nd = 0 if a >= 100 or float(v).is_integer() else 1 if a >= 10 else 2
    s = f'{v:,.{nd}f}'
    if unit in ('USD bn', '$bn'):
        return f'${s}bn'
    if unit in ('USD tn',):
        return f'${s}tn'
    if unit in ('USD m',):
        return f'${s}m'
    if unit == 'USD':
        return f'${v:,.2f}'
    if unit == '%':
        return f'{s}%'
    if unit == 'x':
        return f'{v:,.1f}x'
    return f'{s} {unit}'.strip()


def load_spec(p):
    spec = json.load(open(p if os.path.isabs(p) else os.path.join(VAULT, p), encoding='utf-8'))
    ds = spec.get('dataset')
    if ds:
        d = dataset(ds['key'])
        if not d:
            raise SystemExit(f'dataset {ds["key"]} not found in data/clean')
        names = ds.get('series') or list(d['series'])[:3]
        spec.setdefault('title', d.get('title', ds['key']))
        spec.setdefault('unit', (d.get('units') or {}).get(names[0], d.get('unit', '')))
        spec.setdefault('source', f"{d.get('source', '')} ({d.get('asOf', '')})")
        spec['x'] = d['x']
        spec['series'] = [{'name': n, 'values': d['series'][n]} for n in names]
    return spec


def frame(spec, body):
    title, sub = spec.get('title', ''), spec.get('subtitle', '')
    src = spec.get('source', '')
    src = src if len(src) < 190 else src[:187] + '…'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" font-family="{FONT}">
<defs><pattern id="core" width="18" height="18" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="14" height="14" rx="2" fill="{GRID}"/></pattern>
<linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{GREEN}" stop-opacity="0.18"/><stop offset="1" stop-color="{GREEN}" stop-opacity="0"/></linearGradient></defs>
<rect width="{W}" height="{H}" fill="{BG}"/><rect width="{W}" height="{H}" fill="url(#core)" opacity="0.55"/>
<rect x="0" y="0" width="10" height="{H}" fill="{GREEN}"/>
<text x="{L - 60}" y="96" fill="{TEXT}" font-size="54" font-weight="800" letter-spacing="-0.5">{esc(title)}</text>
<text x="{L - 60}" y="146" fill="{MUTED}" font-size="28" font-weight="500">{esc(sub)}</text>
{body}
<text x="{L - 60}" y="{H - 40}" fill="{MUTED}" font-size="19">{('Source: ' + esc(src)) if src else ''}</text>
<text x="{W - 40}" y="{H - 40}" fill="{DIM}" font-size="19" text-anchor="end" font-weight="700" letter-spacing="2">NVDA · RESEARCH VAULT</text>
</svg>
'''


def scale(lo, hi, a, b):
    span = (hi - lo) or 1
    return lambda v: a + (v - lo) / span * (b - a)


def bars(spec):
    x, s, unit = spec['x'], spec['series'][0]['values'], spec.get('unit', '')
    vals = [v for v in s if v is not None]
    lo, hi = min(0, min(vals)), max(0, max(vals))
    y = scale(lo, hi * 1.12 if hi > 0 else hi, H - B, T + 20)
    n = len(x)
    slot = (W - L - R) / n
    bw = min(150, slot * 0.62)
    out = [f'<line x1="{L}" x2="{W - R}" y1="{y(0):.1f}" y2="{y(0):.1f}" stroke="{DIM}" stroke-width="2"/>']
    hl = spec.get('highlight')
    for i, (lab, v) in enumerate(zip(x, s)):
        cx = L + slot * (i + 0.5)
        if v is not None:
            top, bot = sorted((y(v), y(0)))
            col = GREEN if (not hl or lab == hl) else DIM
            if hl and lab == hl:
                out.append(f'<rect x="{cx - bw / 2 - 8:.1f}" y="{top - 8:.1f}" width="{bw + 16:.1f}" height="{bot - top + 16:.1f}" rx="10" fill="url(#glow)"/>')
            out.append(f'<rect x="{cx - bw / 2:.1f}" y="{top:.1f}" width="{bw:.1f}" height="{max(2, bot - top):.1f}" rx="6" fill="{col}"/>')
            ty = top - 16 if v >= 0 else bot + 38
            out.append(f'<text x="{cx:.1f}" y="{ty:.1f}" fill="{TEXT}" font-size="{30 if n <= 8 else 22}" font-weight="750" text-anchor="middle">{esc(fmt(v, unit))}</text>')
        out.append(label(cx, H - B + 44, lab, slot))
    return ''.join(out)


def label(cx, y0, text, width):
    words, lines, cur = str(text).split(), [], ''
    maxc = max(6, int(width / 13))
    for w in words:
        if len(cur) + len(w) + 1 > maxc and cur:
            lines.append(cur)
            cur = w
        else:
            cur = f'{cur} {w}'.strip()
    lines.append(cur)
    return ''.join(f'<text x="{cx:.1f}" y="{y0 + k * 26:.1f}" fill="{MUTED}" font-size="22" text-anchor="middle">{esc(t)}</text>' for k, t in enumerate(lines[:3]))


def hbars(spec):
    x, s, unit = spec['x'], spec['series'][0]['values'], spec.get('unit', '')
    hi = max(v for v in s if v is not None) or 1
    left = 520
    w = scale(0, hi * 1.15, 0, W - R - left)
    gap = min(90, (H - T - B) / len(x))
    hl = spec.get('highlight')
    out = []
    for i, (lab, v) in enumerate(zip(x, s)):
        yy = T + 20 + i * gap
        col = GREEN if (not hl or lab == hl) else DIM
        out.append(f'<text x="{left - 24}" y="{yy + gap * 0.42:.1f}" fill="{TEXT if lab == hl else MUTED}" font-size="26" text-anchor="end" font-weight="{700 if lab == hl else 500}">{esc(lab)}</text>')
        if v is not None:
            out.append(f'<rect x="{left}" y="{yy:.1f}" width="{max(3, w(v)):.1f}" height="{gap * 0.62:.1f}" rx="6" fill="{col}"/>')
            out.append(f'<text x="{left + w(v) + 16:.1f}" y="{yy + gap * 0.45:.1f}" fill="{TEXT}" font-size="28" font-weight="750">{esc(fmt(v, unit))}</text>')
    return ''.join(out)


def lines(spec):
    x, unit = spec['x'], spec.get('unit', '')
    allv = [v for s in spec['series'] for v in s['values'] if v is not None]
    lo, hi = min(0, min(allv)), max(allv)
    y = scale(lo, hi * 1.1, H - B, T + 30)
    xs = scale(0, max(1, len(x) - 1), L + 20, W - R - 160)
    out = []
    for k in range(5):
        v = lo + (hi * 1.1 - lo) * k / 4
        out.append(f'<line x1="{L}" x2="{W - R}" y1="{y(v):.1f}" y2="{y(v):.1f}" stroke="{GRID}" stroke-width="2"/><text x="{L - 14}" y="{y(v) + 8:.1f}" fill="{DIM}" font-size="20" text-anchor="end">{esc(fmt(v, unit))}</text>')
    step = max(1, len(x) // 10)
    for i, lab in enumerate(x):
        if i % step == 0 or i == len(x) - 1:
            out.append(f'<text x="{xs(i):.1f}" y="{H - B + 40}" fill="{MUTED}" font-size="20" text-anchor="middle">{esc(lab)}</text>')
    for si, s in enumerate(spec['series']):
        col = PALETTE[si % len(PALETTE)]
        pts = [(xs(i), y(v)) for i, v in enumerate(s['values']) if v is not None]
        if not pts:
            continue
        d = ' '.join(f'{"M" if j == 0 else "L"}{px:.1f},{py:.1f}' for j, (px, py) in enumerate(pts))
        if si == 0:
            out.append(f'<path d="{d} L{pts[-1][0]:.1f},{y(lo):.1f} L{pts[0][0]:.1f},{y(lo):.1f} Z" fill="url(#glow)"/>')
        out.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{6 if si == 0 else 4}" stroke-linejoin="round" stroke-linecap="round"/>')
        last_i = max(i for i, v in enumerate(s['values']) if v is not None)
        lx, ly = xs(last_i), y(s['values'][last_i])
        out.append(f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="9" fill="{col}"/><text x="{lx + 18:.1f}" y="{ly + 9:.1f}" fill="{TEXT}" font-size="28" font-weight="750">{esc(fmt(s["values"][last_i], unit))}</text>')
    out.append(legend(spec))
    return ''.join(out)


def legend(spec):
    if len(spec['series']) < 2:
        return ''
    out, xx = [], L
    for si, s in enumerate(spec['series']):
        col = PALETTE[si % len(PALETTE)]
        out.append(f'<rect x="{xx}" y="{T - 30}" width="22" height="22" rx="4" fill="{col}"/><text x="{xx + 32}" y="{T - 12}" fill="{TEXT}" font-size="22">{esc(s["name"])}</text>')
        xx += 60 + len(s['name']) * 12
    return ''.join(out)


def stacked(spec):
    x, unit, ss = spec['x'], spec.get('unit', ''), spec['series']
    totals = [sum(s['values'][i] or 0 for s in ss) for i in range(len(x))]
    y = scale(0, max(totals) * 1.12, H - B, T + 20)
    slot = (W - L - R) / len(x)
    bw = min(150, slot * 0.62)
    out = []
    for i, lab in enumerate(x):
        cx, base = L + slot * (i + 0.5), 0
        for si, s in enumerate(ss):
            v = s['values'][i] or 0
            if v:
                out.append(f'<rect x="{cx - bw / 2:.1f}" y="{y(base + v):.1f}" width="{bw:.1f}" height="{y(base) - y(base + v):.1f}" fill="{PALETTE[si % len(PALETTE)]}" stroke="{BG}" stroke-width="2"/>')
            base += v
        out.append(f'<text x="{cx:.1f}" y="{y(base) - 14:.1f}" fill="{TEXT}" font-size="24" font-weight="750" text-anchor="middle">{esc(fmt(totals[i], unit))}</text>')
        out.append(label(cx, H - B + 40, lab, slot))
    return ''.join(out) + legend(spec)


def waterfall(spec):
    x, s, unit = spec['x'], spec['series'][0]['values'], spec.get('unit', '')
    steps, run = [], 0
    for i, v in enumerate(s):
        if spec.get('total') and i == len(s) - 1:
            steps.append((0, v, True))
        else:
            steps.append((run, run + (v or 0), False))
            run += v or 0
    allv = [a for p in steps for a in p[:2]]
    y = scale(min(0, min(allv)), max(allv) * 1.12, H - B, T + 20)
    slot = (W - L - R) / len(x)
    bw = min(140, slot * 0.6)
    out = []
    for i, ((a, b, tot), lab) in enumerate(zip(steps, x)):
        cx = L + slot * (i + 0.5)
        top, bot = sorted((y(a), y(b)))
        col = GREEN if tot else (LIME if b >= a else RED)
        out.append(f'<rect x="{cx - bw / 2:.1f}" y="{top:.1f}" width="{bw:.1f}" height="{max(2, bot - top):.1f}" rx="5" fill="{col}" opacity="{1 if tot else 0.85}"/>')
        if i < len(steps) - 1:
            out.append(f'<line x1="{cx + bw / 2:.1f}" x2="{cx + slot - bw / 2:.1f}" y1="{y(b):.1f}" y2="{y(b):.1f}" stroke="{DIM}" stroke-dasharray="6 6" stroke-width="2"/>')
        out.append(f'<text x="{cx:.1f}" y="{top - 14:.1f}" fill="{TEXT}" font-size="24" font-weight="750" text-anchor="middle">{esc(fmt(s[i], unit))}</text>')
        out.append(label(cx, H - B + 40, lab, slot))
    return ''.join(out)


def kpi(spec):
    x, s, unit = spec['x'], spec['series'][0]['values'], spec.get('unit', '')
    n = len(x)
    cols = min(n, 4)
    cw = (W - L - R + 60) / cols
    out = []
    for i, (lab, v) in enumerate(zip(x, s)):
        cx, cy = L - 60 + cw * (i % cols), T + 40 + (i // cols) * 300
        out.append(f'<rect x="{cx:.1f}" y="{cy:.1f}" width="{cw - 30:.1f}" height="250" rx="14" fill="#10150c" stroke="{DIM}" stroke-width="2"/>')
        out.append(f'<rect x="{cx:.1f}" y="{cy:.1f}" width="6" height="250" rx="3" fill="{GREEN}"/>')
        out.append(f'<text x="{cx + 36:.1f}" y="{cy + 130:.1f}" fill="{LIME}" font-size="{84 if cols <= 3 else 64}" font-weight="800">{esc(fmt(v, unit))}</text>')
        out.append(f'<text x="{cx + 36:.1f}" y="{cy + 196:.1f}" fill="{MUTED}" font-size="26">{esc(lab)}</text>')
    return ''.join(out)


def table(spec):
    x, ss, unit = spec['x'], spec['series'], spec.get('unit', '')
    units = spec.get('units', {})
    rows = min(len(x), 12)
    rh = (H - T - B) / (rows + 1)
    c0 = 620
    cw = (W - R - c0) / max(1, len(ss))
    out = []
    for j, s in enumerate(ss):
        out.append(f'<text x="{c0 + cw * (j + 0.5):.1f}" y="{T + rh * 0.6:.1f}" fill="{MUTED}" font-size="22" font-weight="700" text-anchor="middle">{esc(s["name"])}</text>')
    for i in range(rows):
        yy = T + rh * (i + 1)
        out.append(f'<rect x="{L - 60}" y="{yy:.1f}" width="{W - R - L + 60}" height="{rh - 6:.1f}" rx="6" fill="{"#10150c" if i % 2 == 0 else BG}"/>')
        out.append(f'<text x="{L - 36}" y="{yy + rh * 0.62:.1f}" fill="{TEXT}" font-size="24">{esc(x[i])}</text>')
        for j, s in enumerate(ss):
            out.append(f'<text x="{c0 + cw * (j + 0.5):.1f}" y="{yy + rh * 0.62:.1f}" fill="{TEXT}" font-size="26" font-weight="700" text-anchor="middle">{esc(fmt(s["values"][i], units.get(s["name"], unit)))}</text>')
    return ''.join(out)


KINDS = {'bar': bars, 'hbar': hbars, 'line': lines, 'stacked': stacked, 'waterfall': waterfall, 'kpi': kpi, 'table': table}


def render(spec):
    kind = spec.get('kind', 'bar')
    if kind not in KINDS:
        raise SystemExit(f'unknown kind {kind}; use one of {", ".join(KINDS)}')
    if not spec.get('x') or not spec.get('series'):
        raise SystemExit('spec needs x and series (or dataset)')
    for s in spec['series']:
        if len(s.get('values', [])) != len(spec['x']):
            raise SystemExit(f'series "{s.get("name")}" has {len(s.get("values", []))} values for {len(spec["x"])} x labels')
    return frame(spec, KINDS[kind](spec))


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    spec = load_spec(sys.argv[1])
    out = sys.argv[2] if os.path.isabs(sys.argv[2]) else os.path.join(VAULT, sys.argv[2])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write(render(spec))
    print(out)


if __name__ == '__main__':
    main()
