# Offline backup deck

`spine.pdf` is the static 36-page backup of the current scripted pitch. The same pages are bundled as JPEGs in `app/public/fallback/` so the stage can show them without speech recognition, APIs or animation. On the operator screen press **B** or **Backup deck**; **Next** and **Back** then advance whole pages. Press **B** again to resume the live view. The **Open backup PDF** link is a separate printable copy.

After editing `docs/script/spine.yaml` or data in `data/clean/`, regenerate both copies:

```bash
python3 fallback/build.py
cd app && npm run build
```

The build script needs Python 3 with PyYAML and ReportLab plus `pdftoppm` (Poppler). It resolves every `{{dataset | series | x}}` token from `data/clean/`; it raises an error when a value or text block cannot fit. The deck is a simplified static rendering of the same titles, bullets, figures and charts, so inspect the PDF after regeneration. The PDF and images are checked in for pitch-day use even if the generator tools are unavailable.
