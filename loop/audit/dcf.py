"""PV-M1: independent DCF rebuild. Written from assumptions.json + clean data + DES/WACC PDFs, before reading model.ts.
Run:  /usr/bin/python3 loop/audit/dcf.py"""
import json, re, statistics, sys, datetime as dt
sys.dont_write_bytecode = True
from bbg import *

A = json.loads((ROOT / "data/model/assumptions.json").read_text())
C = lambda k: json.loads((ROOT / f"data/clean/{k}.json").read_text())
at = lambda d, s, x: d["series"][s][d["x"].index(x)]
bad = 0


def check(name, mine, theirs, tol):
    global bad
    ok = abs(mine - theirs) <= tol
    bad += not ok
    print(f"  {'ok ' if ok else 'BAD'} {name:46s} mine {mine:12.4f}  file {theirs:10.4f}")


# ---- inputs, read from the PDFs
price = des(r"Last Px\s+USD/([\d.]+)")
shares = des(r"Curr Shares Out\s+([\d.]+)B")
mcap, ev = des(r"~ Mkt Cap\s+([\d,.]+)B"), des(r"Curr EV\s+([\d,.]+)B")
eps27 = des(r"Est EPS\s+([\d.]+)")
net_cash = mcap - ev
wacc = float(re.search(r"WACC\s+([\d.]+)%", text(WACC)).group(1)) / 100
g = A["terminalGrowth"]["value"] / 100
fc, rev, fcf = C("nvda_revenue_forecast"), C("nvda_revenue_annual"), C("nvda_fcf_annual")
r27, r28 = at(fc, "Consensus estimate", "FY27"), at(fc, "Consensus estimate", "FY28")
fy = A["fcfMarginYears"]["value"]
mar = statistics.mean(at(fcf, "Free cash flow", y) / at(rev, "Revenue", y) for y in fy)
print(f"price {price} shares {shares} net cash {net_cash:.1f} wacc {wacc:.3%} eps27 {eps27} r27 {r27} r28 {r28} margin {mar:.4%}")
print("  yearly FCF margins:", {y: round(100 * at(fcf, 'Free cash flow', y) / at(rev, 'Revenue', y), 2) for y in fy})

VD = dt.date(2026, 11, 20)
t1 = (dt.date(2028, 1, 31) - VD).days / 365.25
print(f"  exact years to 31 Jan 2028: {t1:.4f} (valuation.csv prints 1.2)")
T = [(dt.date(2028 + i, 1, 31) - VD).days / 365.25 for i in range(5)]  # exact days; valuation.csv prints these rounded to 1.2, 2.2 ...
ROUNDED = [1.2 + i for i in range(5)]


def path(kind, fy28=None, growth=None):
    if kind == "fade":  # FY28 consensus growth, then a straight line to g in FY32
        g0 = r28 / r27 - 1
        gs = [g0 + (g - g0) * i / 4 for i in range(5)]
    else:
        gs = [0.0] + [x / 100 for x in growth]
    out, r = [], r27
    for x in gs:
        r *= 1 + x
        out.append(r)
    return out, gs


def value(revs, m, w=wacc, tg=g, t=T, cash=net_cash, sh=shares, extra=0.0):
    f = [r * m for r in revs]
    pv = [x / (1 + w) ** k for x, k in zip(f, t)]
    tv = f[-1] * (1 + tg) / (w - tg)
    ptv = tv / (1 + w) ** t[-1]
    e = sum(pv) + ptv
    return dict(ps=(e + cash + extra) / sh, ev=e, pv=pv, ptv=ptv, tvshare=ptv / e, f=f, tv=tv)


base_r, base_g = path("fade")
bear_r, bear_g = path("bear", growth=A["scenarios"]["bear"]["growth"])
res = {"Base case": value(base_r, mar), "Bull case": value(base_r, mar + A["scenarios"]["bull"]["marginShift"] / 100),
       "Bear case": value(bear_r, mar + A["scenarios"]["bear"]["marginShift"] / 100)}

print("\n1. DCF vs data/clean/model_valuation.json (to the cent)")
mv = C("model_valuation")
for k, v in res.items():
    check(k, round(v["ps"], 2), at(mv, "Value per share", k), 0.005)
check("Share price", price, at(mv, "Value per share", "Share price today"), 0.005)
pe = C("peers_pe")
med = statistics.median(v for x, v in zip(pe["x"], pe["series"]["Forward P/E"]) if x != "NVIDIA")
check("Peer P/E check", round(med * eps27, 2), at(mv, "Value per share", "Peer P/E check"), 0.005)

print("\n2. Revenue paths")
mp = C("model_revenue_paths")
for s, rs in (("Base", base_r), ("Bull", base_r), ("Bear", bear_r)):
    for i, y in enumerate(["FY28", "FY29", "FY30", "FY31", "FY32"]):
        check(f"{s} {y}", round(rs[i], 2), at(mp, s, y), 0.005)

print("\n3. Sensitivity (to the cent)")
ms = C("model_sensitivity")
for s, vs in ms["series"].items():
    tg = float(re.search(r"(\d+)%", s).group(1)) / 100
    for x, v in zip(ms["x"], vs):
        # NB the fade target moves with terminal growth in their table if fadeTo == 'terminal'
        g0 = r28 / r27 - 1
        revs, r = [], r27
        for i in range(5):
            r *= 1 + g0 + (tg - g0) * i / 4
            revs.append(r)
        a = value(revs, mar, w=float(x[:-1]) / 100, tg=tg)["ps"]
        b = value(base_r, mar, w=float(x[:-1]) / 100, tg=tg)["ps"]
        pick = a if abs(a - v) < abs(b - v) else b
        check(f"{s} @ {x} ({'fade moves' if pick == a and a != b else 'fade fixed at base'})", round(pick, 2), v, 0.005)

print("\n4. Reverse DCF (constant growth FY28-FY32, base margin)")
lo, hi = -0.5, 2.0
for _ in range(200):
    mid = (lo + hi) / 2
    revs = [r27 * (1 + mid) ** (i + 1) for i in range(5)]
    lo, hi = (mid, hi) if value(revs, mar)["ps"] < price else (lo, mid)
mi = C("model_implied_growth")
check("Priced in today %", round(100 * lo, 2), at(mi, "Growth per year", "Priced in today"), 0.01)
check("Base case CAGR %", round(100 * ((base_r[-1] / r27) ** 0.2 - 1), 2), mi["series"]["Growth per year"][1], 0.01)

print("\n5. What the value rests on")
for k, v in res.items():
    first = v["pv"][0] / v["ev"]
    print(f"  {k}: terminal value {v['tvshare']:.1%} of EV; FY28 (only consensus year) {first:.1%}; vs price {v['ps'] / price - 1:+.1%}")
b = res["Base case"]
print(f"  Base: PV FY28 ${b['pv'][0]:.0f}bn of EV ${b['ev']:.0f}bn; team-chosen growth FY29-32 {[round(100 * x, 1) for x in base_g[1:]]} drives the other {1 - b['pv'][0] / b['ev']:.1%}")
print(f"  Base FY32 revenue ${base_r[-1]:.0f}bn = {base_r[-1] / at(rev, 'Revenue', 'FY26'):.1f}x FY26; FY32 FCF ${b['f'][-1]:.0f}bn")

v3 = [res[k]["ps"] for k in res]
bp, be = res["Base case"]["ps"], res["Bear case"]["ps"]
print(f"  Equal-weight average of base/bull/bear ${statistics.mean(v3):.2f} vs price ${price}; bear probability at which base+bear average = price: {(bp - price) / (bp - be):.1%}; upside ${bp - price:.2f}, downside ${price - be:.2f}")
for tg in (.02, .04):
    g0_ = r28 / r27 - 1; rr, r = [], r27
    for i in range(5):
        r *= 1 + g0_ + (tg - g0_) * i / 4; rr.append(r)
    print(f"  sensitivity at {tg:.0%} if the fade also ended at {tg:.0%} (file keeps it at 3%): ${value(rr, mar, tg=tg)['ps']:.2f}")

print("\n6. Attacks (base value per share after each change)")
ps = lambda **k: value(k.pop("revs", base_r), k.pop("m", mar), **k)["ps"]
def fade(gs):
    out, r = [], r27
    for x in gs:
        r *= 1 + x / 100
        out.append(r)
    return out
g0 = 100 * (r28 / r27 - 1)
ltm = 148.724 / 361.807
ytd = (48.587 + 21.400 + 43.831) / (81.615 + 96.221 + 115.844)
sbc = {"FY24": 3.549, "FY25": 4.737, "FY26": 6.386}
mar_sbc = statistics.mean((at(fcf, 'Free cash flow', y) - sbc[y]) / at(rev, 'Revenue', y) for y in fy)
rows_ = [
    ("as published", ps()),
    ("student rebuild using the printed 1.2, 2.2 ... 5.2", ps(t=ROUNDED)),
    ("mid-year flows, TV still at FY32 end", (lambda v: (sum(x / (1 + wacc) ** (k - .5) for x, k in zip(v['f'], T)) + v['ptv'] + net_cash) / shares)(b)),
    ("add FY27 Q4 FCF $60.9bn (Bloomberg Q4 est) @0.2y", ps(extra=60.949 / (1 + wacc) ** 0.2)),
    ("add FY27 Q4 FCF $69.9bn (FY27 est less 9 months) @0.2y", ps(extra=(183.728 - 113.818) / (1 + wacc) ** 0.2)),
    ("diluted shares 24.186bn (FY27 Q3)", ps(sh=24.186)),
    ("add LT investments $65.5bn at book", ps(extra=65.528)),
    (f"FCF margin = last 12 months {ltm:.1%}", ps(m=ltm)),
    (f"FCF margin = FY27 first 9 months {ytd:.1%}", ps(m=ytd)),
    (f"FCF margin after SBC {mar_sbc:.1%}", ps(m=mar_sbc)),
    ("margin -5pp", ps(m=mar - .05)), ("margin -10pp", ps(m=mar - .10)), ("margin 30%", ps(m=.30)),
    ("WACC 12%", ps(w=.12)), ("WACC 15%", ps(w=.15)), ("WACC 18.3%", ps(w=.183)), ("WACC 20.3%", ps(w=.203)), ("WACC 22%", ps(w=.22)),
    ("terminal growth 2%, revenue path unchanged", ps(tg=.02)), ("terminal growth 4%, revenue path unchanged", ps(tg=.04)), ("terminal growth 0%, revenue path unchanged", ps(tg=0)),
    ("growth 72.6/40/20/10/3", ps(revs=fade([g0, 40, 20, 10, 3]))),
    ("growth 72.6/30/15/8/3", ps(revs=fade([g0, 30, 15, 8, 3]))),
    ("growth 72.6/20/10/5/3", ps(revs=fade([g0, 20, 10, 5, 3]))),
    ("growth 72.6/3/3/3/3 (consensus, then flat-ish)", ps(revs=fade([g0, 3, 3, 3, 3]))),
    ("FY28 consensus 20% too high, same fade", ps(revs=fade([100 * (0.8 * r28 / r27 - 1)] + [100 * x for x in base_g[1:]]))),
    ("bear revenue, base margin", ps(revs=bear_r)), ("bear revenue, base margin, WACC 12%", ps(revs=bear_r, w=.12)),
    ("bear case at WACC 12%", ps(revs=bear_r, m=mar - .10, w=.12)), ("bear case at WACC 10%", ps(revs=bear_r, m=mar - .10, w=.10)),
    ("consensus FY28 FCF (46.4% margin)", ps(m=338.217 / 728.636)),
]
for n, v in rows_:
    print(f"  {n:60s} ${v:8.2f}  {v / price - 1:+7.1%} vs price  {v - b['ps']:+8.2f} vs base")
lo, hi = 0.1, 0.6
for _ in range(100):
    mid = (lo + hi) / 2; lo, hi = (mid, hi) if ps(w=mid) > price else (lo, mid)
print(f"  break-even WACC (base = price): {lo:.2%}")
lo, hi = 0.05, 0.6
for _ in range(100):
    mid = (lo + hi) / 2; lo, hi = (mid, hi) if ps(m=mid) < price else (lo, mid)
print(f"  break-even FCF margin (base = price): {lo:.2%}")
for scale in (1, .9, .8, .75, .7, .65, .6, .5):
    print(f"   FY29-31 growth x{scale}: {[round(100 * x * scale, 1) for x in base_g[1:4]]} -> ${ps(revs=fade([g0] + [100 * x * scale for x in base_g[1:4]] + [3])):.2f}")

print("\n6b. All corrections that favour the sceptic, then all that favour us")
sceptic = value(base_r, ytd, sh=24.186)
print(f"  FY27 year-to-date margin + diluted shares: ${sceptic['ps']:.2f}")
hk = dict(cash=net_cash + 60.949 / (1 + wacc) ** 0.2, sh=24.186)
print(f"  add Q4 FCF + diluted shares (pure timing/count tidy-up): ${value(base_r, mar, **hk)['ps']:.2f}")
for pe_, lab in ((17.98, "TSMC only (lowest peer)"), ((17.98 + 26.31) / 2, "TSMC/Broadcom average (profitable AI peers)"), ((17.98 + 26.31 + 35.41 + 53.35) / 4, "mean of four")):
    print(f"  Peer check with {lab}: {pe_:.2f}x x {eps27} = ${pe_ * eps27:.2f}")

print("\n7. WACC screen consistency")
mc = float(re.search(r"Market Capitalization\s+([\d,.]+)", text(WACC)).group(1).replace(",", "")) / 1000
tot = float(re.search(r"Total\s+([\d,.]+)\s+100", text(WACC)).group(1).replace(",", "")) / 1000
print(f"  market cap on WACC screen ${mc:.1f}bn vs DES ${mcap:.1f}bn (screen implies ${mc / shares:.2f} a share: the 25 Oct quarter-end cap). Debt implied ${tot - mc:.1f}bn (FY27 Q3 total debt 38.148)")
d = tot - mc
print(f"  re-weighted at today's cap: {(mcap * .194 + d * .049) / (mcap + d):.2%}")
print(f"  debt 38.148, cash 97.731 at 25 Oct 2026 -> net cash {97.731 - 38.148:.3f} (model uses {net_cash:.1f})")
print("\nMISMATCHES:", bad)
