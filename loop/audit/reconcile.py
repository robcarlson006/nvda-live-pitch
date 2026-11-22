"""PV-M1: reconcile every figure on every slide and every number spoken, plus clean data vs raw Bloomberg PDFs.
Run:  /usr/bin/python3 loop/audit/reconcile.py        (needs PyYAML and poppler's pdftotext)"""
import json, re, sys, yaml
sys.dont_write_bytecode = True
from bbg import *

DS = {p.stem: json.loads(p.read_text()) for p in (ROOT / "data/clean").glob("*.json")}
SPINE = yaml.safe_load((ROOT / "docs/script/spine.yaml").read_text())
QA = yaml.safe_load((ROOT / "docs/qa-bank/answers.yaml").read_text())


def val(k, s, x):
    d = DS[k]
    return d["series"][s][d["x"].index(str(x))]


def fmt(v, u):  # what the stage prints (schema.ts formatValue)
    w = float(v).is_integer(); f = lambda n: f"{int(v)}" if w else f"{v:.{n}f}"
    return {"USD bn": f"${f(1)}bn", "USD m": f"${f(0)}m", "%": f"{f(1)}%", "USD": f"${v:.2f}", "x": f"{f(1)}x", "m": f"{f(1)}m", "": f"{v:,g}",
            "'000 t CO2e": f"{v / 1000:.1f}m t CO2e" if v >= 1000 else f"{round(v)}k t CO2e", "'000 MWh": f"{round(v):,} GWh"}.get(u, f"{v} {u}")


TOK = re.compile(r"\{\{\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\|\s*([^|}]+?)\s*\}\}")
n = dict(slide=0, slidebad=0, chart=0, chartbad=0, spoken=0, spokenbad=0, raw=0, rawbad=0)
print("A. FIGURES ON SLIDES (tokens, stats, charts)")
for s in SPINE + [dict(q["slide"], id="qa:" + q["id"]) for q in QA]:
    out = []
    texts = [s["title"]] + [b if isinstance(b, str) else b["text"] for b in s.get("bullets", [])]
    refs = [m.groups() for t in texts + [s.get("stat", {}).get("label", "")] for m in TOK.finditer(t)]
    if "stat" in s:
        refs.append((s["stat"]["datasetKey"], s["stat"]["series"], s["stat"]["x"]))
    for k, se, x in refs:
        n["slide"] += 1
        try:
            d = DS[k]; out.append(f"{se}@{x}={fmt(val(k, se, x), d.get('units', {}).get(se, d['unit']))}" + ("" if d.get("verified", True) else " [UNVERIFIED]"))
        except Exception as e:
            n["slidebad"] += 1; out.append(f"MISSING {k}|{se}|{x}")
    c = s.get("chart")
    if c:
        d = DS[c["datasetKey"]]; xs = d["x"]
        lo, hi = c.get("range", [xs[0], xs[-1]])
        for se in c["series"]:
            n["chart"] += 2
            ok = se in d["series"] and lo in xs and hi in xs and (c.get("highlight") in xs + [None])
            n["chartbad"] += 0 if ok else 2
            if ok:
                i, j = xs.index(lo), xs.index(hi); vs = d["series"][se]
                out.append(f"chart {se}: {lo}={fmt(vs[i], d['unit']) if vs[i] is not None else None} .. {hi}={fmt(vs[j], d['unit']) if vs[j] is not None else None}" if d["x"][0].startswith("FY") else f"chart {se}: " + ", ".join(f"{x}={fmt(v, d['unit'])}" for x, v in zip(xs, vs)))
    if out:
        print(f"  {s['id']:22s} " + "; ".join(out))

print("\nB. NUMBERS SPOKEN (`say`) vs the dataset")
# (slide id, exact words in `say`, data value or None if nothing in data/clean, spoken value, tolerance, note)
F, U = "research_facts", "research_facts_unverified"
R = lambda fy: val("nvda_revenue_annual", "Revenue", fy)
rq, infra = DS["nvda_revenue_quarterly"], DS["research_infra_gdp"]
beats = sum(a > c for a, c in zip(rq["series"]["Revenue"], rq["series"]["Consensus"]))
f7_13 = [R(f"FY{i:02d}") for i in range(7, 17)]
CLAIMS = [
    ("near-bust", "Of 250,000 made", val(F, "NV1 chips made", "value"), 250000, 0, ""),
    ("near-bust", "about 249,000 came back", val(F, "NV1 chips returned", "value"), 249000, 0, ""),
    ("near-bust", "five million dollars", val(F, "Sega investment", "value"), 5, 0, ""),
    ("near-bust", "a million units in four months", val(F, "RIVA 128 sold in four months", "value"), 1, 0, ""),
    ("near-bust", "less than six months of cash", None, 6, 0, "no dataset"),
    ("near-bust", "about one month of payroll", None, 1, 0, "no dataset"),
    ("first-gpu", "two hundred million dollars", val(F, "Xbox advance", "value"), 200, 0, ""),
    ("wall-street", "around half a billion dollars a year", val(U, "CUDA spend per year", "value"), .5, 0, "unverified"),
    ("wall-street", "The stock fell by more than half in 2008", None, 0, 0, "no dataset"),
    ("wall-street", "stuck at three to four billion dollars for years", max(R(f"FY{i:02d}") for i in range(7, 14)), 4, .3, "FY07-FY13 3.07-4.28; the chart opens at FY05 $2.0bn"),
    ("alexnet", "up to 70 times faster", val(F, "Stanford speed-up", "value"), 70, 0, ""),
    ("alexnet", "15 percent against 26", val("research_alexnet", "Top-5 error", "AlexNet, on NVIDIA GPUs"), 15, .5, ""),
    ("alexnet", "15 percent against 26", val("research_alexnet", "Top-5 error", "Runner-up"), 26, .5, ""),
    ("alexnet", "more than ten points", val("research_alexnet", "Top-5 error", "Runner-up") - val("research_alexnet", "Top-5 error", "AlexNet, on NVIDIA GPUs"), 10.9, .05, ""),
    ("revenue-long", "Twenty-seven years of revenue", len(DS["nvda_revenue_annual"]["x"]), 27, 0, ""),
    ("revenue-long", "Three to four billion a year for a decade", sum(3 <= v < 4.5 for v in f7_13), 10, 0, "only 8 years (FY07-FY14) are $3.0-4.3bn; FY15 4.7, FY16 5.0"),
    ("chips", "288 gigabytes", val(F, "AMD MI355X memory", "value"), 288, 0, ""),
    ("chips", "against 192", val(F, "NVIDIA B200 memory", "value"), 192, 0, ""),
    ("chips", "about twelve", val("peers_datacenter_revenue", "Multiple of AMD", "NVIDIA"), 12, .5, "11.646: slide shows 11.6x"),
    ("chips", "about 194 billion", val("peers_datacenter_revenue", "Data centre revenue", "NVIDIA"), 194, .5, ""),
    ("chips", "dollars against 17", val("peers_datacenter_revenue", "Data centre revenue", "AMD"), 17, .5, ""),
    ("software", "More than six million", val(F, "CUDA developers", "value"), 6, 0, ""),
    ("software", "over a thousand libraries", val(F, "CUDA-X libraries", "value"), 1000, 0, ""),
    ("software", "nine years behind", 2016 - 2007, 9, 0, "CUDA released 2007"),
    ("connections", "wires 72 chips", val(F, "GPUs per NVL72 rack", "value"), 72, 0, ""),
    ("connections", "about seven billion dollars", val(F, "Mellanox price", "value"), 7, .5, ""),
    ("connections", "more than 31 billion", has(NVDA_A, "Networking", FY_END["FY26"], 31376)[0] and 31.376 or val(U, "Networking revenue FY26", "value"), 31.376, .001, "Bloomberg FA PGEO prints 31,376: should no longer be 'unverified'"),
    ("supply", "nine in ten", val(F, "TSMC share of leading-edge chips", "value"), 90, 0, ""),
    ("supply", "around 60 percent", val("research_cowos_share", "Share of CoWoS", "NVIDIA"), 60, 0, ""),
    ("supply", "279 billion", val(U, "Supply commitments", "value"), 279, 0, "unverified"),
    ("catch-up", "eleven years", 2026 - 2015, 11, 0, ""),
    ("catch-up", "over 90 percent", val(U, "Share of AI training", "value"), 90, 0, "unverified; says 'over', slide shows 90%"),
    ("catch-up", "about 80 percent", val(U, "Share of AI chip spending", "value"), 80, 0, "unverified"),
    ("bubble", "about 1.1 percent", infra["series"]["Average yearly spend"][0], 1.1, .05, ""),
    ("bubble", "1.4 percent", infra["series"]["Average yearly spend"][1], 1.4, .05, "chart shows 1.1% (average); 1.39% is the 2000 peak"),
    ("bubble", "The railroads: 2.2", infra["series"]["Average yearly spend"][2], 2.2, .05, ""),
    ("bubble", "more than 3.6 percent", infra["series"]["Average yearly spend"][3], 3.6, .05, ""),
    ("different", "about 140 times", val(F, "Cisco forward P/E, March 2000", "value"), 140, 0, ""),
    ("different", "a fraction of that", val("peers_pe", "Forward P/E", "NVIDIA") / 140, .1, .01, ""),
    ("different", "only a few percent of the fibre", None, 0, 0, "no dataset (research notes: 2.7-5%)"),
    ("already-doing", "under 30 months", val(F, "Drug: idea to trials, months", "value"), 30, 0, ""),
    ("already-doing", "20 percent more breast cancers", val(F, "Sweden: more cancers found", "value"), 20, 0, ""),
    ("already-doing", "by 44 percent", val(F, "Sweden: less reading work", "value"), 44, 0, ""),
    ("everyday", "40 percent faster", val(F, "Writers: faster", "value"), 40, 0, "study: 40% less time, i.e. 1.67x speed"),
    ("everyday", "14 percent more problems", val(F, "Support: more solved", "value"), 14, 0, ""),
    ("everyday", "new staff 34 percent more", val(F, "Support: more solved, new staff", "value"), 34, 0, ""),
    ("security", "zero humans", val(U, "Humans in the loop", "value"), 0, 0, "unverified"),
    ("security", "80 to 90 percent", val(F, "Spying campaign run by AI, low", "value"), 80, 0, ""),
    ("security", "80 to 90 percent", val(F, "Spying campaign run by AI, high", "value"), 90, 0, ""),
    ("beats", "Thirteen quarters in a row", beats, 13, 0, f"{beats} of {len(rq['x'])} quarters in the file; EPS missed in FY26 Q1 (0.81 v 0.93)"),
    ("peers", "cheapest of the five", min(zip(DS["peers_pe"]["series"]["Forward P/E"], DS["peers_pe"]["x"]))[1] == "NVIDIA", True, 0, ""),
    ("peers", "The share price has fallen since the CEO resigned", None, 0, 0, "no price history in data/clean"),
    ("peers", "The earnings forecasts haven't", None, 0, 0, "no estimate-revision history in any export"),
    ("valuation", "five-year", 5, 5, 0, ""),
    ("valuation", "Our base case uses analysts' forecasts", .067, 1, .5, "only FY28 is consensus: 6.7% of EV. FY29-FY32 is a team-chosen fade"),
    ("valuation", "Even our bear case", val("model_valuation", "Value per share", "Bear case") > val("model_valuation", "Value per share", "Share price today"), True, 0, "bear $31.40 is 77% BELOW the price"),
    ("governance", "The founder resigned last week", None, 0, 0, "12 Nov is 13 days before 25 Nov; also a co-founder (beat 1 says three)"),
    ("renewables", "about a third in 2018", val("nvda_renewable_share", "Renewable", "FY18"), 33.3, 1, "FY18 = 33.8%"),
    ("renewables", "own operations now run on renewable energy", val("nvda_renewable_share", "Renewable", "FY26"), 100, 0, "market-based: location-based Scope 2 is 308.9kt"),
    ("scope3", "they rise as NVIDIA sells more", val("nvda_emissions", "Scope 3", "FY26") > val("nvda_emissions", "Scope 3", "FY25"), True, 0, ""),
]
SAY = {s["id"]: s.get("say", "") for s in SPINE}
for sid, words, data, spoken, tol, note in CLAIMS:
    n["spoken"] += 1
    if words.lower() not in SAY[sid].lower():
        print(f"  ??  {sid}: script no longer says \"{words}\""); n["spokenbad"] += 1; continue
    st = "n/a" if data is None else ("ok " if abs(float(data) - float(spoken)) <= tol + 1e-9 else "BAD")
    n["spokenbad"] += st != "ok "
    if st != "ok " or note:
        print(f"  {st} {sid:14s} \"{words}\"  data={data}  {note}")
# coverage: any digit or number word in `say` that no claim above covers
NW = r"\b(?:\d[\d,.]*|two|three|four|five|six|seven|nine|ten|eleven|twelve|fifteen|twenty|thirty|hundred|thousand|million|billion|zero|half|third|decade|once|one month)\b"
print("  numbers in `say` not covered above (dates and structural counts expected):")
for sid, say in SAY.items():
    rest = say
    for c in CLAIMS:
        if c[0] == sid:
            rest = re.sub(re.escape(c[1]), " ", rest, flags=re.I)
    left = re.findall(NW, rest, flags=re.I)
    if left:
        print(f"     {sid}: {left}")

print("\nC. CLEAN DATA vs RAW BLOOMBERG PDFs")
BAD = []


def raw(tag, pdf, label, date, value, tol=.0051, scale=1.0):
    n["raw"] += 1
    if "--mutate" in sys.argv:  # self-test: every value is nudged, so nearly every row should now fail
        value = value * 1.03 + .02
    ok, where = has(pdf, label, date, value * scale, tol)
    if not ok:
        n["rawbad"] += 1; BAD.append(f"{tag}: clean {value} not found at {label!r} {date}: {where}")
    return ok


def series(k, s, pdf, label, ends, scale=1.0, tol=.0051, only=None):
    d = DS[k]; miss = 0
    for x, v in zip(d["x"], d["series"][s]):
        if v is not None and x in ends and (only is None or x in only):
            raw(f"{k}|{s}|{x}", pdf, label, ends[x], v, tol, scale)


series("nvda_revenue_annual", "Revenue", NVDA_A, "Revenue", FY_END, 1000, .51)
series("nvda_revenue_forecast", "Consensus estimate", NVDA_A, "Consensus Estimate", FY_END, 1000, .51)
series("nvda_revenue_quarterly", "Revenue", NVDA_Q, "Comparable Actual", Q_END, 1000, .51)
series("nvda_revenue_quarterly", "Consensus", NVDA_Q, "Consensus Estimate", Q_END, 1000, .51)
series("nvda_revenue_surprise", "Revenue surprise", NVDA_Q, "Revenue Surprise %", Q_END)
series("nvda_eps_quarterly", "EPS", NVDA_Q, "Comparable Actual", Q_END)
series("nvda_eps_quarterly", "Consensus", NVDA_Q, "Consensus Estimate", Q_END)
series("nvda_datacenter_quarterly", "Data Center", NVDA_Q, "Data Center", Q_END, 1000, .51)
for s, lab in (("Data Center", "| Data Center"), ("Gaming", "| Gaming"), ("Automotive", "| Automotive"), ("OEM & Other", "| OEM"), ("Pro Visualization", "| Professional")):
    series("nvda_segments_annual", s, NVDA_A, lab.replace("| ", ""), FY_END, 1000, .51)
series("nvda_fcf_annual", "Free cash flow", NVDA_A, "Free Cash Flow", FY_END, 1000, .51)
series("nvda_margins_annual", "Gross margin", NVDA_A, "Gross Margin", FY_END)
series("nvda_margins_annual", "Operating margin", NVDA_A, "Operating Margin", FY_END)
for s, lab in (("Scope 1", "GHG Scope 1"), ("Scope 2 (market-based)", "GHG Scope 2 Market-"), ("Scope 3", "GHG Scope 3")):
    series("nvda_emissions", s, NVDA_A, lab, FY_END)
series("nvda_energy", "Total energy", NVDA_A, "Total Energy Consumption", FY_END)
series("nvda_energy", "Renewable energy", NVDA_A, "Renewable Energy Use", FY_END)
series("nvda_renewable_share", "Renewable", NVDA_A, "Percentage Renewable", FY_END, tol=.011)
PEER = {"NVIDIA": (NVDA_A, "2027-1-31", "2028-1-31"), "AMD": (AMD, "2026-12-31", "2027-12-31"), "Intel": (INTC, "2026-12-31", "2027-12-31"),
        "Broadcom": (AVGO, "2026-10-31", "2027-10-31"), "TSMC": (TSMC, "2026-12-31", "2027-12-31")}
for x, (pdf, d1, d2) in PEER.items():
    raw(f"peers_pe fwd {x}", pdf, "P/E", d1, val("peers_pe", "Forward P/E", x))
    raw(f"peers_ev_ebitda {x}", pdf, "EV/EBITDA", d1, val("peers_ev_ebitda", "EV/EBITDA", x))
    raw(f"peers_operating_margin {x}", pdf, "Operating Margin", d1, val("peers_operating_margin", "Operating margin", x))
raw("AMD data centre FY25", AMD, "Data Center", "2025-12-27", val("peers_datacenter_revenue", "Data centre revenue", "AMD"), .51, 1000)
for k, lo in (("NVIDIA", (318.71, 10.39, 215.938)), ("AMD", (120.26, 42.97, 34.639)), ("Intel", (4584.55, 1322.99, 52.853)), ("Broadcom", (248.18, 180.15, 63.887)), ("TSMC", (15826.30, 13327.10, 122.55568))):
    n["raw"] += 1
    if abs(lo[1] / lo[2] - val("peers_emissions_intensity", "Emissions intensity", k)) > .001:
        n["rawbad"] += 1; BAD.append(f"emissions intensity {k}")
    print(f"  emissions intensity {k:9s} market-based {lo[1] / lo[2]:8.3f} (slide)   location-based {lo[0] / lo[2]:8.3f}")
for lab, v, f in (("price", 135.46, r"Last Px\s+USD/([\d.]+)"), ("shares", 24.1, r"Curr Shares Out\s+([\d.]+)B"), ("EPS FY27", 9.64, r"Est EPS\s+([\d.]+)"), ("mkt cap", 3264.6, r"~ Mkt Cap\s+([\d,.]+)B"), ("EV", 3205.0, r"Curr EV\s+([\d,.]+)B")):
    n["raw"] += 1
    if des(f) != v: n["rawbad"] += 1; BAD.append("DES " + lab)
print("\n".join("  BAD " + b for b in BAD) or "  all match")

print("\nD. EXTRA EVIDENCE FROM THE RAW PDFs (used in AUDIT.md)")
show = lambda t, pdf, lab, d: print(f"  {t}: {find(pdf, lab, d)[:3]}")
show("networking FY26 (PGEO)", NVDA_A, "Networking", FY_END["FY26"])
show("water withdrawal FY26 ('000 m3)", NVDA_A, "Total Water Withdrawal", FY_END["FY26"])
show("water consumption FY26", NVDA_A, "Water Consumption", FY_END["FY26"])
show("Scope 2 location-based FY26", NVDA_A, "GHG Scope 2 Location-", FY_END["FY26"])
show("Scope 3 purchased goods FY26", NVDA_A, "Scope 3 Purchased Goods", FY_END["FY26"])
show("electricity FY26", NVDA_A, "Electricity Used", FY_END["FY26"])
show("fuel consumed FY26", NVDA_A, "Total Fuel Consumed", FY_END["FY26"])
show("FCF FY27E", NVDA_A, "Free Cash Flow", FY_END["FY27"]); show("FCF FY28E", NVDA_A, "Free Cash Flow", FY_END["FY28"])
show("market cap 25 Oct", NVDA_Q, "Market Capitalization", "2026-10-25")
cats = [954.86, 103.39, 137.75, 2.29, 48.61, 99.43, 52.88, 9301.74]
print(f"  Scope 3 FY26 reported categories add to {sum(cats):.2f} vs total 10,700.90: no downstream / use-of-products category. Purchased goods = {9301.74 / 10700.9:.1%}")
print("\nCOUNTS", n)
