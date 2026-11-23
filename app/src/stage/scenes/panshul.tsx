import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LineChart, type Pt } from '../LineChart.tsx';
import { Appear, CountUp, Missing, Source, Words, get, num, useTween, usd1, type SceneProps } from '../primitives.tsx';
import { cells, color, ease, fn } from '../tokens.ts';
import { Title } from './rob.tsx';

const usd0 = (v: number) => `$${Math.round(v).toLocaleString('en-GB')}`;
const usd2 = (v: number) => `$${v.toFixed(2)}`;
const pct0 = (v: number) => `${Math.round(v)}%`;
const signed = (v: number) => `${v < 0 ? '−' : '+'}${Math.abs(Math.round(v))}%`;

/** A vertical bar standing on a baseline, growing up from it. */
function VBar({ x, w, base, h, fill, on, delay = 0, glow = false, outline = false }: { x: number; w: number; base: number; h: number; fill: string; on: boolean; delay?: number; glow?: boolean; outline?: boolean }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, bottom: 1080 - base, width: w, background: outline ? "transparent" : fill, backgroundImage: outline ? undefined : cells, border: outline ? `4px solid ${fill}` : undefined, borderBottom: 'none', borderRadius: '6px 6px 0 0', boxShadow: glow ? `0 0 70px ${fill}66` : undefined, boxSizing: 'border-box' }}
      initial={{ height: 0 }}
      animate={{ height: on ? h : 0 }}
      transition={{ duration: on ? 1.2 : 0.25, delay: on ? delay : 0, ease: ease.out }}
    />
  );
}

// ---------- 10. Revenue FY22 → FY26, Data Center shaded, drawn slowly ----------
export function RevenueRecent({ slide, beat, datasets }: SceneProps) {
  const rev = datasets.nvda_revenue_annual;
  const seg = datasets.nvda_segments_annual;
  const pts: Pt[] = useMemo(() => (rev ? rev.x.map((label, i) => ({ label, v: rev.series.Revenue[i] })).filter((p) => +p.label.slice(2) >= 7) : []), [rev]);
  const dc = useMemo(() => pts.map((p) => (seg ? (seg.series['Data Center'][seg.x.indexOf(p.label)] ?? null) : null)), [pts, seg]);
  const i22 = pts.findIndex((p) => p.label === 'FY22');
  const i26 = pts.length - 1;
  // The chart opens on the whole twenty-year line, then zooms in on the last four years: the same line, closer.
  const i0 = useTween(beat >= 1 ? i22 : 0, { dur: 2.6, ease: fn.inOut, delay: 0.5, from: 0 });
  const draw = useTween(beat >= 1 ? i26 : i22, { dur: 4.6, ease: fn.inOut, delay: 2.4, from: i22 });
  const shadeTo = useTween(beat >= 2 ? i26 : i22, { dur: 3.0, ease: fn.inOut, delay: 0.2, from: i22 });
  const shade = Math.min(shadeTo, draw); // the shading never runs ahead of the line it sits under
  if (!rev || !seg || !pts.length) return <Missing what="nvda_revenue_annual, nvda_segments_annual" />;
  const first = pts[i22].v!;
  const last = pts[i26].v!;
  const dcLast = dc[i26]!;
  return (
    <>
      <Title text={slide.title} />
      <LineChart
        pts={pts}
        box={{ x: 150, y: 300, w: 1620, h: 580 }}
        i0={i0}
        i1={i26 + 0.0001}
        ymax={Math.ceil(last * 1.12)}
        draw={Math.max(draw, Math.min(i0 + 0.0, i22))}
        ticks={[i22, i22 + 1, i22 + 2, i22 + 3, i26]}
        shade={beat >= 2 ? { v: dc, draw: shade } : undefined}
        marks={[
          { i: i22, align: 'left', dy: -26, show: draw > i22 + 0.05, node: <b className="sx-h2" style={{ fontWeight: 700 }}>{usd1(first)}</b> },
          { i: i26, align: 'right', dy: -34, show: draw >= i26 - 0.02, node: <b className="sx-display" style={{ fontSize: 130, color: color.ink }}><CountUp to={last} from={first} active={beat >= 1} delay={3.2} seconds={5} format={usd1} /></b> },
        ]}
      />
      <Appear show={beat >= 2} delay={1.2} style={{ position: 'absolute', left: 1130, top: 600 }} y={14}>
        <div className="sx-label" style={{ fontSize: 38, color: color.green }}>of which Data Center</div>
        <div className="sx-h1" style={{ fontSize: 84, color: color.green }}><CountUp to={dcLast} active={beat >= 2} delay={1.2} seconds={2.5} format={usd1} /></div>
      </Appear>
      <Source keys={[]} text="Bloomberg FA, NVDA US, annual revenue and Data Center segment; fiscal years end late January; 20 Nov 2026" datasets={datasets} show={beat >= 1} />
    </>
  );
}

// ---------- 11. Operating margin bars + free cash flow ----------
export function Margins({ slide, beat, datasets }: SceneProps) {
  const ds = datasets.margin_compare;
  const fcf = get(datasets, 'nvda_fcf_annual', 'Free cash flow', 'FY26');
  if (!ds || fcf == null) return <Missing what="margin_compare, nvda_fcf_annual" />;
  const names = ['NVIDIA', 'AMD (expected)', 'Intel (expected)'];
  const BASE = 860;
  const H = 520; // 100% of each dollar
  return (
    <>
      <Title text={slide.title} />
      <div className="sx-pos" style={{ left: 150, top: BASE, width: 1000, height: 3, background: color.faint }} />
      {ds.x.map((n, i) => {
        const v = ds.series['Operating margin'][i] ?? 0;
        const x = 190 + i * 330;
        const on = beat >= 2;
        return (
          <div key={n}>
            <VBar x={x} w={240} base={BASE} h={(v / 100) * H} fill={i === 0 ? color.green : color.core} on={on} delay={i * 0.55} glow={i === 0} />
            <Appear show={on} delay={0.8 + i * 0.55} y={12} style={{ position: 'absolute', left: x, width: 240, top: BASE - (v / 100) * H - 96, textAlign: 'center' }}>
              <div className="sx-h1" style={{ fontSize: 80, color: i === 0 ? color.green : color.ink }}><CountUp to={v} active={on} delay={0.8 + i * 0.55} seconds={1} format={pct0} /></div>
            </Appear>
            <div className="sx-label" style={{ position: 'absolute', left: x - 40, width: 320, top: BASE + 22, textAlign: 'center', fontSize: 30, color: color.ink }}>{names[i]}</div>
          </div>
        );
      })}
      <Appear show={beat >= 2} delay={0.2} y={10} style={{ position: 'absolute', left: 150, top: 232 }}>
        <span className="sx-label">Operating profit kept from each dollar of sales</span>
      </Appear>
      <Appear show={beat >= 3} y={40} style={{ position: 'absolute', left: 1200, top: 300, width: 640 }}>
        <div className="sx-label" style={{ fontSize: 36 }}>Free cash flow, last year</div>
        <div className="sx-display" style={{ fontSize: 140, color: color.green, marginTop: 10, whiteSpace: 'nowrap' }}>
          <CountUp to={fcf} active={beat >= 3} seconds={1.8} format={usd1} />
        </div>
        <div className="sx-label" style={{ marginTop: 14 }}>cash left after running the business and building new chips</div>
      </Appear>
      <Source keys={[]} text="Bloomberg FA, 20 Nov 2026. NVIDIA reported FY26 (year to Jan 2026); AMD and Intel are analyst consensus for this fiscal year" datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 12. Consensus forecast + the beat ----------
export function Forecast({ slide, beat, datasets }: SceneProps) {
  const a = get(datasets, 'nvda_revenue_forecast', 'Actual', 'FY26');
  const b = get(datasets, 'nvda_revenue_forecast', 'Consensus estimate', 'FY27');
  const c = get(datasets, 'nvda_revenue_forecast', 'Consensus estimate', 'FY28');
  const g27 = get(datasets, 'model_forecast_growth', 'Growth', 'FY27');
  const g28 = get(datasets, 'model_forecast_growth', 'Growth', 'FY28');
  const q = datasets.nvda_revenue_quarterly;
  const e = datasets.nvda_eps_quarterly;
  const rev = q && get(datasets, 'nvda_revenue_quarterly', 'Revenue', q.x.at(-1)!);
  const revC = q && get(datasets, 'nvda_revenue_quarterly', 'Consensus', q.x.at(-1)!);
  const eps = e && get(datasets, 'nvda_eps_quarterly', 'EPS', e.x.at(-1)!);
  const epsC = e && get(datasets, 'nvda_eps_quarterly', 'Consensus', e.x.at(-1)!);
  if (a == null || b == null || c == null || g27 == null || g28 == null || rev == null || revC == null || eps == null || epsC == null) return <Missing what="revenue forecast, growth, last quarter" />;
  const BASE = 800;
  const H = 430;
  const bars = [
    { name: 'FY26', sub: 'reported', v: a, on: beat >= 1, c: color.core },
    { name: 'FY27', sub: 'analysts expect', v: b, on: beat >= 2, c: color.greenDeep },
    { name: 'FY28', sub: 'analysts expect', v: c, on: beat >= 3, c: color.green },
  ];
  const panel = beat >= 4;
  return (
    <>
      <Title text={slide.title} />
      <div className="sx-pos" style={{ left: 130, top: BASE, width: 1000, height: 3, background: color.faint }} />
      {bars.map((r, i) => {
        const x = 150 + i * 330;
        const h = (r.v / c) * H;
        const growth = i === 1 ? g27 : i === 2 ? g28 : null;
        return (
          <div key={r.name}>
            <VBar x={x} w={250} base={BASE} h={h} fill={r.c} on={r.on} glow={i === 2} />
            <Appear show={r.on} delay={0.7} y={12} style={{ position: 'absolute', left: x - 30, width: 310, top: BASE - h - 100, textAlign: 'center' }}>
              <div className="sx-h1" style={{ fontSize: 66, color: i === 2 ? color.green : color.ink }}><CountUp to={r.v} active={r.on} seconds={1.3} format={usd1} /></div>
            </Appear>
            {growth != null && (
              <Appear show={r.on} delay={1.2} y={10} style={{ position: 'absolute', left: x - 30, width: 310, top: BASE - h - 170, textAlign: 'center' }}>
                <span className="sx-label" style={{ fontSize: 40, color: color.green, fontWeight: 700 }}>+{Math.round(growth)}%</span>
              </Appear>
            )}
            <div className="sx-label" style={{ position: 'absolute', left: x - 30, width: 310, top: BASE + 18, textAlign: 'center', color: color.ink, fontSize: 36, fontWeight: 650 }}>{r.name}</div>
            <div className="sx-label" style={{ position: 'absolute', left: x - 30, width: 310, top: BASE + 60, textAlign: 'center', fontSize: 26 }}>{r.sub}</div>
          </div>
        );
      })}
      <Appear show={panel} y={36} style={{ position: 'absolute', left: 1230, top: 330, width: 570 }}>
        <div className="sx-label" style={{ fontSize: 34, color: color.green }}>Last quarter ({q!.x.at(-1)})</div>
        {[
          { n: 'Revenue', v: usd1(rev), x: usd1(revC) },
          { n: 'Profit per share', v: usd2(eps), x: usd2(epsC) },
        ].map((r) => (
          <div key={r.n} style={{ marginTop: 30 }}>
            <div className="sx-label" style={{ fontSize: 30 }}>{r.n}</div>
            <div className="sx-h1" style={{ fontSize: 88, color: color.ink }}>{r.v}</div>
            <div className="sx-label" style={{ fontSize: 30 }}>against {r.x} expected</div>
          </div>
        ))}
      </Appear>
      <Source keys={[]} text="Bloomberg FA, NVDA US: annual consensus estimates and quarterly results vs consensus (FY27 Q3 preliminary), 20 Nov 2026. Growth computed from the consensus" datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 13. What is one share worth? Two discount rates ----------
export function Worth({ slide, beat, datasets }: SceneProps) {
  const bb = get(datasets, 'model_rates', 'Discount rate', 'Bloomberg');
  const us = get(datasets, 'model_rates', 'Discount rate', 'US semiconductor average');
  if (bb == null || us == null) return <Missing what="model_rates" />;
  const SC = 1500 / 20; // px per percentage point on a 0–20% scale
  const rates = [
    { v: bb, name: 'Bloomberg', sub: 'a very high bar', on: beat >= 2, c: color.amber },
    { v: us, name: 'Average US semiconductor company', sub: 'the second rate', on: beat >= 3, c: color.green },
  ];
  return (
    <>
      <div className="sx-pos" style={{ left: 120, top: 100, width: 1700 }}>
        <h1 className="sx-display" style={{ fontSize: 100 }}><Words text={slide.title} show={beat >= 1} delay={0.2} step={0.12} /></h1>
        <Appear show={beat >= 1} delay={1.6} y={10}><p className="sx-label" style={{ marginTop: 28, fontSize: 38 }}>The return investors demand: the rate we shrink future cash back by.</p></Appear>
      </div>
      {/* a 0–20% scale with the two rates marked on it */}
      <div className="sx-pos" style={{ left: 210, top: 806, width: 1500, height: 3, background: color.faint }} />
      {[0, 5, 10, 15, 20].map((t) => (
        <div key={t} className="sx-pos" style={{ left: 210 + t * SC - 30, top: 822, width: 60, textAlign: 'center', fontSize: 28, color: color.dim }}>{t}%</div>
      ))}
      {rates.map((r, i) => (
        <div key={r.name}>
          <motion.div style={{ position: 'absolute', left: 210, top: 726 + i * 40, height: 30, background: r.c, backgroundImage: cells, borderRadius: 4, boxShadow: `0 0 40px ${r.c}55` }} initial={{ width: 0 }} animate={{ width: r.on ? r.v * SC : 0 }} transition={{ duration: 1.5, ease: ease.out, delay: r.on ? 0.15 : 0 }} />
          <Appear show={r.on} delay={0.1} y={30} style={{ position: 'absolute', left: i ? 1040 : 210, top: 390, width: 800 }}>
            <div className="sx-display" style={{ fontSize: 190, color: r.c, lineHeight: 1 }}><CountUp to={r.v} active={r.on} seconds={1.4} format={(x) => `${x.toFixed(x >= 15 ? 1 : 2).replace(/0$/, '')}%`} /></div>
            <div className="sx-h2" style={{ fontSize: 46, marginTop: 6 }}>{r.name}</div>
            <div className="sx-label" style={{ marginTop: 6 }}>{r.sub}</div>
          </Appear>
        </div>
      ))}
      <Source keys={[]} text="Bloomberg WACC screen, NVDA US Equity, 20 Nov 2026; Damodaran (NYU Stern), Cost of Capital by Industry, US semiconductors (66 firms), Jan 2026" datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 14. The valuation bars ----------
export function ValueBars({ slide, beat, datasets }: SceneProps) {
  const v = (x: string) => get(datasets, 'model_valuation', 'Value per share', x);
  const bear = v('Bear case');
  const base = v('Base case');
  const hi = v('Base case at rival-average rate');
  const bull = v('Bull case');
  const today = v('Share price today');
  const bb = get(datasets, 'model_rates', 'Discount rate', 'Bloomberg');
  const us = get(datasets, 'model_rates', 'Discount rate', 'US semiconductor average');
  if (bear == null || base == null || hi == null || bull == null || today == null || bb == null || us == null) return <Missing what="model_valuation, model_rates" />;
  const BASE = 800;
  const H = 470;
  const top = Math.max(bear, base, hi, bull, today);
  const px = (x: number) => (x / top) * H;
  const rate = (r: number) => `${r}%`;
  // [label, sub, value, beat it arrives on, column, fill, format]
  const cols = [
    { n: 'Bear', s: `AI spending pauses, ${rate(bb)}`, val: bear, at: 6, col: 0, c: color.amber, f: usd0 },
    { n: 'Base', s: `at ${rate(bb)}`, val: base, at: 2, col: 1, c: color.greenDeep, f: usd2 },
    { n: `Base at ${rate(us)}`, s: 'the industry rate', val: hi, at: 4, col: 2, c: color.green, f: usd0, glow: true },
    { n: 'Bull', s: `at ${rate(bb)}`, val: bull, at: 5, col: 3, c: color.greenDeep, f: usd0 },
    { n: 'Today', s: 'share price', val: today, at: 3, col: 4, c: color.ink, f: usd2, outline: true },
  ];
  const X = (col: number) => 190 + col * 330;
  return (
    <>
      <Title text={slide.title} />
      <div className="sx-pos" style={{ left: 150, top: BASE, width: 1650, height: 3, background: color.faint }} />
      {/* today's price as a line across everything, so every bar is judged against it */}
      <motion.div style={{ position: 'absolute', left: 150, top: BASE - px(today), height: 0, borderTop: `3px dashed ${color.ink}`, opacity: 0.7, originX: 0 }} initial={{ width: 0 }} animate={{ width: beat >= 3 ? 1650 : 0 }} transition={{ duration: 1.1, ease: ease.out }} />
      {cols.map((r) => {
        const on = beat >= r.at;
        return (
          <div key={r.n}>
            <VBar x={X(r.col)} w={240} base={BASE} h={px(r.val)} fill={r.c} on={on} glow={r.glow} outline={r.outline} />
            <Appear show={on} delay={0.8} y={12} style={{ position: 'absolute', left: X(r.col) - 45, width: 330, top: BASE - px(r.val) - 98, textAlign: 'center' }}>
              <div className="sx-h1" style={{ fontSize: r.glow ? 92 : 72, color: r.glow ? color.green : r.c === color.amber ? color.amber : color.ink }}>{r.f(r.val)}</div>
            </Appear>
            <Appear show={on} delay={0.3} y={0} style={{ position: 'absolute', left: X(r.col) - 45, width: 330, top: BASE + 20, textAlign: 'center' }}>
              <div className="sx-label" style={{ fontSize: 32, color: color.ink, fontWeight: 650, lineHeight: 1.15 }}>{r.n}</div>
              <div className="sx-label" style={{ fontSize: 24, marginTop: 4 }}>{r.s}</div>
            </Appear>
          </div>
        );
      })}
      <Source keys={[]} text="Team DCF model on Bloomberg data, valuation date 20 Nov 2026. Rates: Bloomberg WACC screen; Damodaran (NYU Stern) US semiconductors, Jan 2026" datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 15. The reverse DCF ----------
export function Implied({ slide, beat, datasets }: SceneProps) {
  const ds = datasets.model_implied_sales;
  const g = get(datasets, 'model_implied_sales', 'Growth per year', 'FY27');
  if (!ds || g == null) return <Missing what="model_implied_sales" />;
  const sales = ds.series.Sales;
  const top = sales.at(-1) ?? 1;
  const BASE = 820;
  const H = 480;
  return (
    <>
      <Title text={slide.title} />
      <Appear show={beat >= 1} delay={0.7} y={40} style={{ position: 'absolute', left: 120, top: 270, width: 800 }}>
        <div className="sx-display" style={{ fontSize: 330, color: color.green, lineHeight: 1 }}><CountUp to={g} active={beat >= 1} delay={0.7} seconds={1.6} format={pct0} /></div>
        <div className="sx-h2" style={{ marginTop: 10 }}>a year, for five years</div>
        <div className="sx-label" style={{ marginTop: 16, fontSize: 32, maxWidth: 640 }}>the growth in sales that today's price assumes, at Bloomberg's rate</div>
      </Appear>
      <div className="sx-pos" style={{ left: 980, top: BASE, width: 830, height: 3, background: color.faint }} />
      {ds.x.map((x, i) => {
        const on = beat >= 2 || (beat >= 1 && i === 0);
        const left = 990 + i * 138;
        const h = ((sales[i] ?? 0) / top) * H;
        return (
          <div key={x}>
            <VBar x={left} w={108} base={BASE} h={h} fill={i === sales.length - 1 ? color.green : color.greenDeep} on={on} delay={i * 0.38} glow={i === sales.length - 1} />
            <div className="sx-label" style={{ position: 'absolute', left, width: 108, top: BASE + 16, textAlign: 'center', fontSize: 26 }}>{x}</div>
          </div>
        );
      })}
      <Appear show={beat >= 2} delay={2.3} y={20} style={{ position: 'absolute', left: 980, top: 208, width: 830, textAlign: 'right' }}>
        <div className="sx-display" style={{ fontSize: 100, color: color.green, whiteSpace: 'nowrap' }}>${(top / 1000).toFixed(1)} trillion</div>
        <div className="sx-label" style={{ fontSize: 32 }}>of sales in {ds.x.at(-1)}</div>
      </Appear>
      <Source keys={[]} text="Team DCF model on Bloomberg consensus (reverse DCF at the Bloomberg 19.3% rate), valuation date 20 Nov 2026" datasets={datasets} show={beat >= 1} />
    </>
  );
}

// ---------- 16 + 17. The bear case: two bars held, then the $31 bar returns, alone and large ----------
export function Bear({ slide, beat, datasets }: SceneProps) {
  const v = (x: string, s = 'Value per share') => get(datasets, 'model_bear_bull_rates', s, x);
  const a = v('Bear at Bloomberg rate');
  const b = v('Bear at US semiconductor average');
  const da = v('Bear at Bloomberg rate', 'Change from today');
  const db = v('Bear at US semiconductor average', 'Change from today');
  const today = get(datasets, 'model_valuation', 'Value per share', 'Share price today');
  const bb = get(datasets, 'model_rates', 'Discount rate', 'Bloomberg');
  const us = get(datasets, 'model_rates', 'Discount rate', 'US semiconductor average');
  const alone = slide.id === 'bear-alone';
  // alone = the axis zooms in on the $31 bar until it fills the frame; the other bar and today's line leave
  const p = useTween(alone ? 1 : 0, { dur: 2.2, ease: fn.inOut, delay: 0.2 });
  if (a == null || b == null || da == null || db == null || today == null || bb == null || us == null) return <Missing what="model_bear_bull_rates" />;
  const BASE = 810;
  const ymax = today * 1.08 + (a * 1.2 - today * 1.08) * p;
  const px = (x: number) => (x / ymax) * 560;
  const x1 = 440 + (1000 - 440) * p;
  const w = 280 + 280 * p;
  const shown1 = alone || beat >= 2;
  const shown2 = !alone && beat >= 3;
  const fade = 1 - p;
  return (
    <>
      <Title text={slide.title} />
      <div className="sx-pos" style={{ left: 250, top: BASE, width: 1420, height: 3, background: color.faint }} />
      {/* today's price: the line every bar is judged against */}
      <div className="sx-pos" style={{ left: 250, top: BASE - px(today), width: 1420, opacity: fade * (beat >= 1 ? 1 : 0), transition: 'opacity .5s' }}>
        <div style={{ borderTop: `3px dashed ${color.ink}`, opacity: 0.7 }} />
        <div className="sx-label" style={{ position: 'absolute', right: 0, top: -48, color: color.ink }}>Today {usd2(today)}</div>
      </div>
      <VBar x={x1} w={w} base={BASE} h={px(a)} fill={color.amber} on={shown1} glow />
      <VBar x={1000} w={280} base={BASE} h={px(b) * fade} fill={color.amber} on={shown2} />
      <Appear show={shown1} delay={0.9} y={14} style={{ position: 'absolute', left: x1 - 100, width: w + 200, top: BASE - px(a) - (alone ? 250 : 190), textAlign: 'center' }}>
        <div className="sx-display" style={{ fontSize: alone ? 190 : 112, color: color.amber, lineHeight: 1 }}>{usd0(a)}</div>
        {!alone && <div className="sx-h2" style={{ fontSize: 54, color: color.amber }}>{signed(da)}</div>}
      </Appear>
      <Appear show={shown2} delay={0.9} y={14} style={{ position: 'absolute', left: 900, width: 480, top: BASE - px(b) * fade - 190, textAlign: 'center', opacity: fade }}>
        <div className="sx-display" style={{ fontSize: 112, color: color.amber, lineHeight: 1 }}>{usd0(b)}</div>
        <div className="sx-h2" style={{ fontSize: 54, color: color.amber }}>{signed(db)}</div>
      </Appear>
      {!alone && (
        <>
          <Appear show={shown1} delay={0.4} y={0} style={{ position: 'absolute', left: x1 - 40, width: w + 80, top: BASE + 20, textAlign: 'center' }}>
            <div className="sx-label" style={{ fontSize: 30, color: color.ink }}>at Bloomberg's rate, {bb}%</div>
          </Appear>
          <Appear show={shown2} delay={0.4} y={0} style={{ position: 'absolute', left: 960, width: 360, top: BASE + 20, textAlign: 'center' }}>
            <div className="sx-label" style={{ fontSize: 30, color: color.ink }}>at the industry rate, {us}%</div>
          </Appear>
        </>
      )}
      {alone && (
        <Appear show={beat >= 2} y={20} style={{ position: 'absolute', left: 120, right: 120, top: 856, textAlign: 'center' }}>
          <div className="sx-h2">{slide.bullets[0]}</div>
        </Appear>
      )}
      <Appear show={alone && beat >= 1} delay={1.8} y={0} style={{ position: 'absolute', left: 120, top: 235 }}>
        <div className="sx-label" style={{ maxWidth: 640 }}>Our bear case, at Bloomberg's {bb}% rate: {signed(da)} from today</div>
      </Appear>
      <Source keys={[]} text="Team DCF model on Bloomberg data, valuation date 20 Nov 2026. Bear case = AI spending pauses. Rates: Bloomberg WACC screen; Damodaran (NYU Stern), Jan 2026" datasets={datasets} show={beat >= 2} />
    </>
  );
}

void num;
