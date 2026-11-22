"""Contact sheets: /usr/bin/env python3 loop/sheet.py <shots dir> [c|abc] [ids,...]  -> <dir>/sheet-N.png"""
import sys, os, glob
from PIL import Image, ImageDraw
d = sys.argv[1]; which = sys.argv[2] if len(sys.argv) > 2 else 'abc'
ids = sys.argv[3].split(',') if len(sys.argv) > 3 else None
order = [l.split('id:')[1].strip() for l in open('docs/script/spine.yaml') if l.startswith('- id:')]
have = [i for i in order if os.path.exists(f'{d}/{i}-c.png') and (not ids or i in ids)]
W, H = 800, 450
cells = [(i, s) for i in have for s in which]
if which == 'qa': cells = [(os.path.basename(f)[:-4], None) for f in sorted(glob.glob(f'{d}/qa-*.png'))]
cols = 3 if len(which) != 2 else 2
per = cols * 4
for n in range(0, len(cells), per):
    im = Image.new('RGB', (W * cols, H * 4), '#333')
    for k, (i, s) in enumerate(cells[n:n + per]):
        p = f'{d}/{i}-{s}.png' if s else f'{d}/{i}.png'
        if not os.path.exists(p): continue
        t = Image.open(p).convert('RGB').resize((W - 4, H - 4))
        x, y = (k % cols) * W, (k // cols) * H
        im.paste(t, (x, y)); ImageDraw.Draw(im).text((x + 6, y + 4), f'{i} {s or ""}', fill='#ff0')
    im.save(f'{d}/sheet-{n // per}.png'); print(f'{d}/sheet-{n // per}.png')
