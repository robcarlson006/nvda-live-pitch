"""Independent reader for the Bloomberg PDFs (does not use app/scripts/fa-parse.ts).

rows(pdf) -> list of (label, {period_end_date: value}, page). Each number goes to the column whose
period-end date finishes nearest above it. Segment pages with a % column keep the last value seen.
"""
import re, subprocess, functools, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "bloomberg-raw"
DATE = re.compile(r"\d{4}-\d{1,2}-\d{1,2}")
NUM = re.compile(r"(?<!\S)-?\d[\d,]*(?:\.\d+)?(?!\S)")


@functools.lru_cache(None)
def text(name):
    return subprocess.run(["pdftotext", "-layout", str(RAW / name), "-"], capture_output=True, text=True, check=True).stdout


@functools.lru_cache(None)
def rows(name):
    out = []
    for pageno, page in enumerate(text(name).split("\f"), 1):
        lines = page.split("\n")
        hdr = next((i for i, l in enumerate(lines) if l.startswith("For the period ending")), None)
        if hdr is None:
            continue
        cols = [(m.end(), m.group()) for m in DATE.finditer(lines[hdr])]
        for l in lines[hdr + 1:]:
            if l.startswith("This report may not"):
                break
            nums = list(NUM.finditer(l))
            if not nums:
                continue
            first = next((m for m in nums if re.search(r"\s{2,}$", l[:m.start()]) or m.start() == 0), None)
            if not first:
                continue
            label = re.sub(r"\s+", " ", l[:first.start()]).strip()
            vals = {}
            for m in nums:
                if m.start() < first.start():
                    continue
                edge, d = min(cols, key=lambda c: abs(c[0] - m.end()))
                if abs(edge - m.end()) <= 7:
                    vals.setdefault(d, []).append(float(m.group().replace(",", "")))
            out.append((label, vals, pageno))
    return out


def find(name, label, date, page=None):
    """All values printed for rows whose label starts with `label`, in the column ending `date`."""
    got = []
    for lab, vals, pg in rows(name):
        if lab.startswith(label) and date in vals and (page is None or pg == page):
            got += [(v, pg) for v in vals[date]]
    return got


def has(name, label, date, value, tol=0.0051):
    """(True, page) if the PDF prints `value` for that row and period."""
    for v, pg in find(name, label, date):
        if abs(v - value) <= tol:
            return True, pg
    return False, find(name, label, date)[:4]


NVDA_A = "nvda_fa_annual_FY1998-FY2026.pdf"
NVDA_Q = "nvda_fa_quarterly_FY24Q3-FY27Q3.pdf"
AMD, INTC, AVGO = "peer_amd_fa_annual_FY2014-FY2025.pdf", "peer_intc_fa_annual_FY2015-FY2025.pdf", "peer_avgo_fa_annual_FY2016-FY2025.pdf"
TSMC = "peer_tsmc_2330TT_fa_annual_FY2015-FY2025_USD.pdf"
DES, WACC = "nvda_des_2026-11-20.pdf", "nvda_wacc_2026-11-20.pdf"

# NVIDIA fiscal year end dates, straight from the page headers
FY_END = {"FY14": "2014-1-26", "FY15": "2015-1-25", "FY16": "2016-1-31", "FY17": "2017-1-29", "FY18": "2018-1-28", "FY19": "2019-1-27",
          "FY20": "2020-1-26", "FY21": "2021-1-31", "FY22": "2022-1-30", "FY23": "2023-1-29", "FY24": "2024-1-28", "FY25": "2025-1-26",
          "FY26": "2026-1-25", "FY27": "2027-1-31", "FY28": "2028-1-31", "FY00": "2000-1-30", "FY01": "2001-1-28", "FY02": "2002-1-27",
          "FY03": "2003-1-26", "FY04": "2004-1-25", "FY05": "2005-1-30", "FY06": "2006-1-29", "FY07": "2007-1-28", "FY08": "2008-1-27",
          "FY09": "2009-1-25", "FY10": "2010-1-31", "FY11": "2011-1-30", "FY12": "2012-1-29", "FY13": "2013-1-27"}
Q_END = {"FY24 Q1": "2023-4-30", "FY24 Q2": "2023-7-30", "FY24 Q3": "2023-10-29", "FY24 Q4": "2024-1-28", "FY25 Q1": "2024-4-28", "FY25 Q2": "2024-7-28",
         "FY25 Q3": "2024-10-27", "FY25 Q4": "2025-1-26", "FY26 Q1": "2025-4-27", "FY26 Q2": "2025-7-27", "FY26 Q3": "2025-10-26", "FY26 Q4": "2026-1-25",
         "FY27 Q1": "2026-4-26", "FY27 Q2": "2026-7-26", "FY27 Q3": "2026-10-25"}


def des(pattern):
    m = re.search(pattern, text(DES))
    return float(m.group(1).replace(",", "")) if m else None
