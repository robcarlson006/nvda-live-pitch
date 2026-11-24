#!/usr/bin/env python3
"""Build a data-resolved, offline 16:9 PDF and stage backup images."""
from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
import tempfile
import textwrap
from pathlib import Path

import yaml
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SPINE = ROOT / "docs/script/spine.yaml"
BANK = ROOT / "docs/qa-bank/answers.yaml"
QA_PDF = ROOT / "fallback/qa-bank.pdf"
DATA = ROOT / "data/clean"
PDF = ROOT / "fallback/spine.pdf"
IMAGES = ROOT / "app/public/fallback"
W, H = 960, 540
GREEN = HexColor("#76b900")
WHITE = HexColor("#f4f6f1")
DETAIL = HexColor("#c8cec0")
FAINT = HexColor("#8e9587")

FONT = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
BOLD = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
pdfmetrics.registerFont(TTFont("Pitch", str(FONT)))
pdfmetrics.registerFont(TTFont("PitchBold", str(BOLD)))

datasets = {p.stem: json.loads(p.read_text()) for p in DATA.glob("*.json")}
slides = yaml.safe_load(SPINE.read_text())
bank = yaml.safe_load(BANK.read_text())
token = re.compile(r"\{\{\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\}\}")


def fmt(v: float, unit: str) -> str:
    if unit == "USD bn": return f"${v:g}bn" if v == int(v) else f"${v:.1f}bn"
    if unit == "USD tn": return "$" + f"{v:.2f}".rstrip("0").rstrip(".") + "tn"
    if unit == "USD m": return f"${v:,.0f}m"
    if unit == "USD": return f"${v:.2f}"
    if unit == "%": return f"{v:g}%"
    if unit == "x": return f"{int(v)}x" if v == int(v) else f"{v:.1f}x"
    if unit == "bn": return f"{v:g}bn"
    if unit == "m": return f"{v:g}m"
    if unit == "": return f"{int(v):,}" if v == int(v) else f"{v:,g}"
    if unit == "year": return f"{v:g}"
    if unit == "tonnes CO2": return f"{v*1000:.0f} kg" if v < 1 else f"{v:.1f} tonnes" if v < 10 else f"{v:.0f} tonnes"
    if unit == "'000 t CO2e": return f"{v/1000:.1f}m t CO2e" if v >= 1000 else f"{v:.0f}k t CO2e"
    if unit == "'000 MWh": return f"{v:,.0f} GWh"
    return f"{v:g} {unit}".strip()


def value(key: str, series: str, x: str) -> str:
    ds = datasets[key]
    v = ds["series"][series][ds["x"].index(x)]
    if v is None: raise ValueError((key, series, x))
    return fmt(v, ds.get("units", {}).get(series, ds["unit"]))


def resolve(s: str) -> str:
    return token.sub(lambda m: value(*(g.strip() for g in m.groups())), s)


def fit_lines(c: canvas.Canvas, text: str, width: float, font: str, size: float, max_lines: int) -> list[str]:
    words = text.split()
    out: list[str] = []
    line = ""
    for word in words:
        trial = (line + " " + word).strip()
        if pdfmetrics.stringWidth(trial, font, size) <= width:
            line = trial
        else:
            if line: out.append(line)
            line = word
    if line: out.append(line)
    if len(out) > max_lines: raise ValueError(f"Text needs {len(out)} lines (max {max_lines}): {text[:75]}")
    return out


def draw_lines(c: canvas.Canvas, text: str, x: float, y: float, width: float, size: float, max_lines: int, leading: float, bold=False, color=WHITE) -> float:
    font = "PitchBold" if bold else "Pitch"
    lines = fit_lines(c, text, width, font, size, max_lines)
    c.setFont(font, size); c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def sources(slide: dict) -> list[str]:
    out = list(slide.get("sources", []))
    refs = []
    for s in [slide.get("title", ""), *[b if isinstance(b, str) else b.get("text", "") for b in slide.get("bullets", [])]]:
        refs.extend(token.findall(s))
    # Input groups use source tags on the slide. Keep their shared dataset's
    # summary attribution in the footer so all four source groups are cited.
    for group in slide.get("groups", []):
        for item in group.get("items", []):
            for key, _, _ in token.findall(item if isinstance(item, str) else item.get("text", "")):
                ds = datasets[key.strip()]
                if ds["source"] not in out: out.append(ds["source"])
    for ref in [slide.get("chart", {}).get("datasetKey"), slide.get("stat", {}).get("datasetKey")]:
        if ref: refs.append((ref, "", ""))
    for key, series, _ in refs:
        ds = datasets[key.strip()]
        src = ds.get("seriesSources", {}).get(series.strip()) or f"{ds['source']}, as of {ds['asOf']}"
        if src not in out: out.append(src)
    return out


def unit_of(ds: dict, series: str) -> str:
    return ds.get("units", {}).get(series, ds["unit"])


def table(c: canvas.Canvas, spec: dict, ds: dict, box: tuple[float, float, float, float]) -> None:
    """ChartSpec.display == 'table': one row per x value, one column per series, refLine as a dated footer."""
    xx, yy, ww, hh = box
    rows = [x for x in ds["x"] if x not in spec.get("exclude", [])]
    cols = spec["series"]
    worksheet = ds["key"] == "model_dcf_detail"
    label_w = ww * (0.30 if worksheet else 0.36)
    col_w = (ww - label_w) / len(cols)
    row_h = min(54, hh / (len(rows) + 2))
    top = yy + hh
    c.setFont("Pitch", 12 if worksheet else 10); c.setFillColor(FAINT)
    c.drawString(xx, top + 10, ds["title"])
    heading_size = 13 if worksheet else 9
    c.setFont("PitchBold", heading_size); c.setFillColor(DETAIL)
    for k, name in enumerate(cols):
        lines = fit_lines(c, name.upper(), col_w - 8, "PitchBold", heading_size, 3)
        for j, line in enumerate(lines):
            c.drawRightString(xx + label_w + (k + 1) * col_w - 4, top - 14 - j * 11, line)
    y = top - 56 - row_h * 0.5
    for x in rows:
        i = ds["x"].index(x)
        hi = x == spec.get("highlight")
        if hi:
            c.setFillColor(HexColor("#10140b")); c.rect(xx - 4, y - row_h * 0.3, ww + 8, row_h, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#30362b")); c.setLineWidth(.6); c.line(xx, y - row_h * 0.3, xx + ww, y - row_h * 0.3)
        draw_lines(c, x, xx, y + 4, label_w - 8, 16 if worksheet else 13, 2, 17 if worksheet else 14, color=WHITE if hi else DETAIL)
        for k, name in enumerate(cols):
            v = ds["series"][name][i]
            cell = "–"
            if v is not None:
                if worksheet:
                    cell = f"{v:.4f}" if x == "Discount factor" else f"{v:,.2f}"
                else:
                    cell = fmt(v, unit_of(ds, name))
            c.setFont("PitchBold", 24 if worksheet else 20)
            c.setFillColor(GREEN if hi and (worksheet or k == 0) else WHITE)
            c.drawRightString(xx + label_w + (k + 1) * col_w - 4, y, cell)
        y -= row_h
    ref = spec.get("refLine")
    if ref:
        v = next(v for v in ds["series"][ref["series"]] if v is not None)
        name = "Reference share price" if ref["series"] == "Share price today" else ref["series"]
        c.setFont("Pitch", 12); c.setFillColor(DETAIL)
        c.drawRightString(xx + ww, y + row_h * 0.2, f"{name}: {fmt(v, unit_of(ds, ref['series']))}, as of {ds['asOf']}")


def diagram(c: canvas.Canvas, d: dict, box: tuple[float, float, float, float]) -> None:
    """Slide.diagram as static boxes: a vertical flow with arrows, or a two-column grid (comparison, map)."""
    xx, yy, ww, hh = box
    nodes = d["nodes"]
    grid = d["kind"] != "flow"
    per_row = 2 if grid else 1
    n_rows = math.ceil(len(nodes) / per_row)
    gap = 16
    bh = min(56, (hh - gap * (n_rows - 1)) / n_rows)
    bw = (ww - gap * (per_row - 1)) / per_row
    top = yy + hh
    for k, node in enumerate(nodes):
        r, col = divmod(k, per_row)
        last_alone = grid and k == len(nodes) - 1 and len(nodes) % 2 == 1
        bx = xx + col * (bw + gap)
        w = ww if last_alone else bw
        by = top - (r + 1) * bh - r * gap
        emphasis = k == len(nodes) - 1 and d["kind"] != "map"
        c.setFillColor(HexColor("#0b0d0a")); c.setStrokeColor(GREEN if emphasis else HexColor("#3c4436")); c.setLineWidth(1.2)
        c.rect(bx, by, w, bh, fill=1, stroke=1)
        if d["kind"] == "map":
            c.setFillColor(GREEN); c.rect(bx, by, 3, bh, fill=1, stroke=0)
        lines = fit_lines(c, node, w - 24, "Pitch", 14, 2)
        ly = by + bh / 2 + (len(lines) - 1) * 8 - 5
        c.setFont("Pitch", 14); c.setFillColor(WHITE)
        for line in lines:
            c.drawString(bx + 12, ly, line); ly -= 16
        if not grid and k < len(nodes) - 1:
            c.setStrokeColor(GREEN); c.setLineWidth(1.5)
            ax = bx + w / 2
            c.line(ax, by, ax, by - gap + 3)
            c.line(ax - 4, by - gap + 8, ax, by - gap + 3); c.line(ax + 4, by - gap + 8, ax, by - gap + 3)


def chart(c: canvas.Canvas, slide: dict, box: tuple[float, float, float, float]) -> None:
    spec = slide["chart"]
    ds = datasets[spec["datasetKey"]]
    if spec.get("display") == "table":
        return table(c, spec, ds, box)
    xvals = ds["x"]
    idx = list(range(len(xvals)))
    if spec.get("range"):
        a, b = (xvals.index(v) for v in spec["range"])
        idx = [i for i in idx if a <= i <= b]
    idx = [i for i in idx if xvals[i] not in spec.get("exclude", [])]
    xx, yy, ww, hh = box
    c.setFont("Pitch", 10); c.setFillColor(FAINT)
    c.drawString(xx, yy + hh + 10, ds["title"] + (f", {ds['unit']}" if ds["unit"] else ""))
    series = spec["series"]
    vals = [ds["series"][name] for name in series]
    nums = [v[i] for arr in vals for i in idx if (v := arr)[i] is not None]
    if not nums: return
    maxv = max(nums + [0])
    if spec["type"] == "stackedBar": maxv = max(sum((arr[i] or 0) for arr in vals) for i in idx)
    if spec["type"] == "waterfall": maxv = max(nums)
    ref = spec.get("refLine")
    refv = ds["series"][ref["series"]][0] if ref else None
    if refv is not None: maxv = max(maxv, refv)
    maxv = maxv * 1.12 or 1
    py = lambda v: yy + max(0, v) / maxv * hh
    n = len(idx)
    gap = ww / max(n, 1)
    c.setLineWidth(.8); c.setStrokeColor(HexColor("#454c40")); c.line(xx, yy, xx+ww, yy)
    if refv is not None:
        c.setStrokeColor(FAINT); c.setDash(3, 3); c.line(xx, py(refv), xx+ww, py(refv)); c.setDash()
        c.setFont("Pitch", 8); c.setFillColor(FAINT); c.drawRightString(xx+ww, py(refv)+3, fmt(refv, ds.get("units", {}).get(ref["series"], ds["unit"])))
    # muted: the first series in grey, as on stage, so "If AI ended for good" never looks like the green bear case
    colors = [HexColor("#d9dccf") if spec.get("muted") else GREEN, FAINT if spec.get("muted") else WHITE, FAINT, HexColor("#596051")]
    if spec["type"] == "line":
        for si, arr in enumerate(vals):
            c.setStrokeColor(colors[si % len(colors)]); c.setLineWidth(3 if si == 0 else 2)
            pts = [(xx+(k+.5)*gap, py(arr[i])) for k, i in enumerate(idx) if arr[i] is not None]
            for a, b in zip(pts, pts[1:]): c.line(*a, *b)
            if pts:
                c.setFont("Pitch", 9); c.setFillColor(colors[si % len(colors)])
                c.drawRightString(min(xx+ww, pts[-1][0]), pts[-1][1]+5+si*10, series[si] + ": " + fmt(arr[idx[-1]], ds.get("units", {}).get(series[si], ds["unit"])))
    elif spec["type"] == "waterfall":
        running = 0
        for k, i in enumerate(idx):
            v = vals[0][i] or 0
            total = xvals[i] in spec.get("totals", [])
            bottom = 0 if total else running
            if total: running = v
            else: running += v
            bx = xx+(k+.18)*gap; bw = gap*.64
            c.setFillColor(GREEN if total else HexColor("#506d26")); c.rect(bx, py(bottom), bw, max(2, py(bottom+v)-py(bottom)), fill=1, stroke=0)
            c.setFont("Pitch", 9); c.setFillColor(WHITE)
            c.drawCentredString(bx+bw/2, min(yy+hh+2, py(bottom+v)+3), fmt(v, ds.get("units", {}).get(series[0], ds["unit"])))
    else:
        for k, i in enumerate(idx):
            bx = xx+(k+.12)*gap; bw = gap*.76
            if spec["type"] == "stackedBar":
                bottom = 0
                for si, arr in enumerate(vals):
                    v = arr[i] or 0
                    c.setFillColor(colors[si % len(colors)]); c.rect(bx, py(bottom), bw, max(1,py(bottom+v)-py(bottom)), fill=1, stroke=0)
                    bottom += v
            else:
                for si, arr in enumerate(vals):
                    v = arr[i] or 0
                    sub = bw / len(vals)
                    c.setFillColor(colors[si % len(colors)]); c.rect(bx+si*sub, yy, sub*.92, max(1,py(v)-yy), fill=1, stroke=0)
            if n <= 8 and len(vals) == 1:
                v = vals[0][i]
                if v is not None:
                    c.setFont("Pitch", 9); c.setFillColor(WHITE)
                    c.drawCentredString(bx+bw/2, min(yy+hh+2,py(v)+4), fmt(v, ds.get("units", {}).get(series[0],ds["unit"])))
    step = max(1, math.ceil(n/8))
    c.setFont("Pitch", 8); c.setFillColor(DETAIL)
    for k, i in enumerate(idx):
        if k % step and k != n-1: continue
        label = xvals[i]
        words = label.split()
        rows = [""]
        for word in words:
            trial = (rows[-1] + " " + word).strip()
            if pdfmetrics.stringWidth(trial, "Pitch", 8) <= gap*.86:
                rows[-1] = trial
            else:
                rows.append(word)
        if len(rows) > 2:
            rows = [rows[0], textwrap.shorten(" ".join(rows[1:]), width=max(8, int(gap/5)), placeholder="…")]
        for line_no, row in enumerate(rows):
            c.drawCentredString(xx+(k+.5)*gap, yy-13-line_no*9, row)
    if len(series) > 1 and spec["type"] != "line":
        c.setFont("Pitch", 8)
        for si, name in enumerate(series):
            c.setFillColor(colors[si%len(colors)]); c.drawString(xx+si*ww/max(1,len(series)), yy-28, name)


def page(c: canvas.Canvas, slide: dict, index: int, header: str | None = None) -> None:
    c.setFillColor(HexColor("#000000")); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFont("Pitch", 8); c.setFillColor(FAINT); c.drawString(52,H-30,header or f"{index:02d}  /  {slide.get('speaker','')}  /  STATIC BACKUP")
    layout=slide.get("layout","split")
    has_chart=bool(slide.get("chart"))
    full_width_table=layout == "chart" and slide.get("chart", {}).get("display") == "table"
    has_diagram=bool(slide.get("diagram")) and not has_chart and not slide.get("stat")
    title=resolve(slide["title"])
    title_width=390 if (has_chart and layout == "split") or has_diagram else 840
    title_size=30 if len(title)>45 else 39
    y=draw_lines(c,title,52,H-100,title_width,title_size,4,title_size*1.12,bold=True)
    if slide.get("stat"):
        s=slide["stat"]
        figure=value(s["datasetKey"],s["series"],s["x"])
        c.setFont("PitchBold",74); c.setFillColor(GREEN); c.drawString(52,y-62,figure)
        y-=105
        y=draw_lines(c,resolve(s.get("label","")),52,y,title_width,18,3,24,color=DETAIL)
    bullets=[b if isinstance(b,str) else b.get("text","") for b in slide.get("bullets",[])]
    bullets=[resolve(b) for b in bullets if b]
    if has_chart and layout == "split":
        cy=140; ch=270; cx=490; cw=410
    elif has_chart:
        cy=100; ch=max(150, y-130); cx=66; cw=830
    else: cy=ch=cx=cw=0
    if has_chart and not full_width_table: chart(c,slide,(cx,cy,cw,ch))
    if layout == "inputs":
        groups = slide.get("groups", [])
        if len(groups) > 4: raise ValueError("Too many input groups")
        for gi, group in enumerate(groups):
            gx = 52 + gi * 211
            gy = min(365, y - 32)
            c.setStrokeColor(HexColor("#30362b"))
            c.line(gx, gy + 14, gx + 195, gy + 14)
            gy = draw_lines(c, group["tag"], gx, gy, 195, 15, 2, 20, bold=True, color=GREEN) - 8
            for item in group["items"]:
                label = item if isinstance(item, str) else item["text"]
                gy = draw_lines(c, resolve(label), gx, gy, 195, 13, 4, 17, color=DETAIL) - 10
            if gy < 65: raise ValueError(f"Input group {group['tag']} overflows the source footer")
    if has_diagram: diagram(c, slide["diagram"], (500, 110, 400, 300))
    if layout == "timeline":
        # A rail with a node per date; the year in green so it reads from the back of the room.
        rail_x = 62; y -= 14
        for k, b in enumerate(bullets):
            if y < 115: raise ValueError(f"Slide {slide['id']} timeline overflows")
            m = re.match(r"^(\d{4}):\s*(.*)$", b)
            c.setFillColor(GREEN); c.rect(rail_x - 5, y - 2, 10, 10, fill=1, stroke=0)
            if m:
                c.setFont("PitchBold", 22); c.setFillColor(GREEN); c.drawString(rail_x + 22, y - 4, m.group(1))
                ny = draw_lines(c, m.group(2), rail_x + 100, y - 4, 520, 22, 2, 27, color=WHITE)
            else:
                ny = draw_lines(c, b, rail_x + 22, y - 4, 600, 22, 2, 27, color=WHITE)
            if k < len(bullets) - 1:
                c.setStrokeColor(HexColor("#50594a")); c.setLineWidth(2); c.line(rail_x, y - 4, rail_x, ny - 4)
            y = ny - 14
        bullets = []
    for b in bullets:
        if y < 115: raise ValueError(f"Slide {slide['id']} bullets overflow")
        y=draw_lines(c,b,52,y-17,title_width,17 if has_chart or has_diagram else 21,4,22 if has_chart or has_diagram else 27,color=DETAIL)
    if full_width_table:
        table_bottom = 85
        table_top = y - 18
        chart(c, slide, (52, table_bottom, 856, table_top - table_bottom))
    src="  •  ".join(sources(slide))
    c.setFillColor(HexColor("#171b15")); c.rect(0,0,W,55,fill=1,stroke=0)
    draw_lines(c,"Source: "+src,52,42,850,8,5,9,color=FAINT)
    c.showPage()


def rasterise(pdf: Path, out: Path) -> None:
    """JPEG pages for the stage backup: pdftoppm (Poppler) if installed, else PyMuPDF."""
    if shutil.which("pdftoppm"):
        subprocess.run(["pdftoppm","-jpeg","-jpegopt","quality=86","-r","96",str(pdf),str(out/"slide")],check=True)
        return
    import fitz  # PyMuPDF
    doc = fitz.open(str(pdf))
    width = len(str(len(doc)))
    for i, pg in enumerate(doc, 1):
        pg.get_pixmap(dpi=96).save(str(out / f"slide-{i:0{max(2, width)}d}.jpg"), jpg_quality=86)


def main() -> None:
    PDF.parent.mkdir(exist_ok=True)
    IMAGES.mkdir(parents=True,exist_ok=True)
    # Build everything in a temporary folder first: the checked-in backup is only replaced once the new one is complete.
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        spine_pdf = tmp / "spine.pdf"
        c=canvas.Canvas(str(spine_pdf),pagesize=(W,H),pageCompression=1)
        c.setTitle("NVIDIA stock pitch — static fallback")
        for i,s in enumerate(slides,1): page(c,s,i)
        c.save()
        qa_pdf = tmp / "qa-bank.pdf"
        q=canvas.Canvas(str(qa_pdf),pagesize=(W,H),pageCompression=1)
        q.setTitle("NVIDIA stock pitch — prepared answers")
        for i,e in enumerate(bank,1):
            page(q,{**e["slide"],"id":e["id"]},i,header=f"Q&A {i:02d}  /  {e['question'][:110]}")
        q.save()
        images = tmp / "images"; images.mkdir()
        rasterise(spine_pdf, images)
        generated=sorted(images.glob("slide-*.jpg"))
        assert len(generated)==len(slides),(len(generated),len(slides))
        # Verified: replace the old copies.
        for old in IMAGES.glob("slide-*.jpg"): old.unlink()
        for img in generated: shutil.copy2(img, IMAGES / img.name)
        shutil.copy2(spine_pdf, PDF); shutil.copy2(spine_pdf, IMAGES / "spine.pdf")
        shutil.copy2(qa_pdf, QA_PDF); shutil.copy2(qa_pdf, IMAGES / "qa-bank.pdf")
        (IMAGES / "pages.json").write_text(json.dumps({"spine": [s["id"] for s in slides], "qaBank": [e["id"] for e in bank]}, indent=1) + "\n")
    print(f"{len(slides)} spine pages, {len(generated)} images, {len(bank)} Q&A pages: {PDF}, {QA_PDF}")

if __name__ == "__main__": main()
