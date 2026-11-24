#!/usr/bin/env python3
"""Build a data-resolved, offline 16:9 PDF and stage backup images."""
from __future__ import annotations

import json
import math
import re
import shutil
import subprocess
import textwrap
from pathlib import Path

import yaml
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
SPINE = ROOT / "docs/script/spine.yaml"
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


def chart(c: canvas.Canvas, slide: dict, box: tuple[float, float, float, float]) -> None:
    spec = slide["chart"]
    ds = datasets[spec["datasetKey"]]
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
    colors = [GREEN, WHITE, FAINT, HexColor("#596051")]
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


def page(c: canvas.Canvas, slide: dict, index: int) -> None:
    c.setFillColor(HexColor("#000000")); c.rect(0,0,W,H,fill=1,stroke=0)
    c.setFont("Pitch", 8); c.setFillColor(FAINT); c.drawString(52,H-30,f"{index:02d}  /  {slide.get('speaker','')}  /  STATIC BACKUP")
    layout=slide.get("layout","split")
    has_chart=bool(slide.get("chart"))
    title=resolve(slide["title"])
    title_width=390 if has_chart and layout == "split" else 840
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
    if has_chart: chart(c,slide,(cx,cy,cw,ch))
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
    for b in bullets:
        if y < 115: raise ValueError(f"Slide {slide['id']} bullets overflow")
        y=draw_lines(c,b,52,y-17,title_width,17 if has_chart else 21,4,22 if has_chart else 27,color=DETAIL)
    src="  •  ".join(sources(slide))
    c.setFillColor(HexColor("#171b15")); c.rect(0,0,W,55,fill=1,stroke=0)
    draw_lines(c,"Source: "+src,52,42,850,8,5,9,color=FAINT)
    c.showPage()


def main() -> None:
    PDF.parent.mkdir(exist_ok=True)
    IMAGES.mkdir(parents=True,exist_ok=True)
    c=canvas.Canvas(str(PDF),pagesize=(W,H),pageCompression=1)
    c.setTitle("NVIDIA stock pitch — static fallback")
    for i,s in enumerate(slides,1): page(c,s,i)
    c.save()
    shutil.copy2(PDF, IMAGES / "spine.pdf")
    subprocess.run(["pdftoppm","-jpeg","-jpegopt","quality=86","-r","96",str(PDF),str(IMAGES/"slide")],check=True)
    generated=sorted(IMAGES.glob("slide-*.jpg"))
    assert len(generated)==len(slides),(len(generated),len(slides))
    print(f"{len(slides)} pages, {len(generated)} images: {PDF}")

if __name__ == "__main__": main()
