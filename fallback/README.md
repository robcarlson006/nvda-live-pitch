# Offline backup deck

- `spine.pdf`: the static **32-page** backup of the scripted pitch, one page per spine slide, in spine order. The same pages are bundled as JPEGs in `app/public/fallback/` so the stage can show them without speech recognition, APIs or animation. On the operator screen press **B** or **Backup deck**; **Next** and **Back** then advance whole pages. Press **B** again to resume the live view. The **Open backup PDF** link is a separate printable copy.
- `qa-bank.pdf`: every prepared answer in `docs/qa-bank/answers.yaml` (42 pages), with its chart, table or diagram. Also copied to `app/public/fallback/qa-bank.pdf` (served at `/fallback/qa-bank.pdf`). Open it in a PDF viewer if the app fails during questions.
- `app/public/fallback/pages.json`: the spine and bank ids each page was built from. `npm test` fails if the backup's page count or order no longer matches the spine, because backup page *N* is shown for spine slide *N*.

After editing `docs/script/spine.yaml`, `docs/qa-bank/answers.yaml` or data in `data/clean/`, regenerate:

```bash
python3 fallback/build.py
```

```bash
cd app && npm test && npm run build
```

The build script needs Python 3 with PyYAML and ReportLab (ReportLab 4.0.x on Python 3.9). It rasterises with `pdftoppm` (Poppler) when installed, otherwise with PyMuPDF (`pip install pymupdf`). It builds in a temporary folder and replaces the checked-in pages only after every page has rendered and the image count matches the spine, so a failed build leaves the previous backup untouched. It resolves every `{{dataset | series | x}}` token from `data/clean/` and raises an error when a value or text block cannot fit.

What the static pages show: titles, bullets, headline figures, charts, the DCF summary table (`display: table`), answer diagrams (`flow` as boxes with arrows, `comparison` and `map` as a grid), and the space-race timeline as dated nodes on a rail. Inspect the PDFs after regenerating. They are checked in for pitch-day use even if the generator tools are unavailable.
