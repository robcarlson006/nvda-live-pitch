import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LineChart, type Pt } from '../LineChart.tsx';
import { Appear, CountUp, Missing, Source, Words, fmt, get, num, useTween, usd1, type SceneProps } from '../primitives.tsx';
import { cells, color, dur, ease, fn } from '../tokens.ts';

/** Title at the top left of a scene. beat >= 1 always, so it builds as soon as the slide is live. */
export function Title({ text, show = true, size = 'sx-h2', delay = 0.2, style }: { text: string; show?: boolean; size?: string; delay?: number; style?: React.CSSProperties }) {
  return (
    <h1 className={size} style={{ position: 'absolute', left: 120, top: 100, maxWidth: 1680, fontSize: size === 'sx-h2' ? (text.length > 44 ? 58 : text.length > 34 ? 66 : 76) : undefined, ...style }}>
      <Words text={text} show={show} delay={delay} />
    </h1>
  );
}

// ---------- 1. The hook ----------
export function Hook({ slide, beat }: SceneProps) {
  const [lead, rest] = slide.title.split(/:\s*(.*)/s);
  return (
    <div className="sx-center" style={{ padding: '0 160px' }}>
      <h1 className="sx-display" style={{ fontSize: 132, lineHeight: 1.08, maxWidth: 1640, textWrap: 'balance' }}>
        <Words text={`${lead}:`} show={beat >= 1} delay={0.3} step={0.1} className="sx-green" />
        <br />
        <Words text={rest || ''} show={beat >= 1} delay={0.9} step={0.11} />
      </h1>
    </div>
  );
}

// ---------- 2. 1993 ----------
export function Founding({ slide, beat }: SceneProps) {
  const [year, rest] = slide.title.split(/\.\s+(.*)/s);
  return (
    <>
      <div className="sx-pos" style={{ left: 110, top: 150 }}>
        <div className="sx-display" style={{ fontSize: 430, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          <Words text={`${year}.`} show={beat >= 1} delay={0.2} step={0.16} className="sx-green" />
        </div>
        <div className="sx-h1" style={{ marginTop: 10, fontSize: 104 }}>
          <Words text={rest || ''} show={beat >= 1} delay={0.9} step={0.1} />
        </div>
      </div>
      <Appear show={beat >= 2} className="sx-body" style={{ position: 'absolute', left: 120, bottom: 150, maxWidth: 1500, color: color.dim }}>
        {slide.bullets[0]}
      </Appear>
    </>
  );
}

// ---------- 3. 249,000 of 250,000, then the GPU ----------
export function FirstChip({ slide, beat, datasets }: SceneProps) {
  const made = get(datasets, 'research_facts', 'NV1 chips made', 'value');
  const back = get(datasets, 'research_facts', 'NV1 chips returned', 'value');
  if (made == null || back == null) return <Missing what="research_facts: NV1 chips made / returned" />;
  const cells = Math.round(made / 1000); // one cell = 1,000 chips
  const bad = Math.round(back / 1000);
  const COLS = 50;
  const gpu = beat >= 2;
  return (
    <>
      <Appear show={beat >= 1 && !gpu} y={20} style={{ position: 'absolute', left: 120, top: 120 }}>
        <div className="sx-display" style={{ fontSize: 290, color: color.amber }}>
          <CountUp to={back} active={beat >= 1 && !gpu} seconds={1.8} format={(v) => num(Math.round(v))} />
        </div>
        <div className="sx-h2" style={{ marginTop: 8 }}>
          of <span style={{ color: color.ink }}>{num(made)}</span> chips came back.
        </div>
        <div className="sx-label" style={{ marginTop: 14 }}>{slide.title}</div>
      </Appear>
      <div className="sx-pos" style={{ left: 120, top: 700, width: 1680, opacity: gpu ? 0 : 1, transition: 'opacity .8s' }}>
        {Array.from({ length: cells }, (_, i) => (
          <motion.span
            key={i}
            style={{ position: 'absolute', left: (i % COLS) * 33.6, top: Math.floor(i / COLS) * 36, width: 24, height: 24, borderRadius: 3 }}
            initial={{ backgroundColor: color.greenDeep }}
            animate={{ backgroundColor: beat >= 1 && i < bad ? color.amber : i < bad ? color.greenDeep : color.green, scale: beat >= 1 && i >= bad ? 1.5 : 1 }}
            transition={{ delay: beat >= 1 ? 0.5 + i * 0.008 : 0, duration: 0.3 }}
          />
        ))}
      </div>
      <Appear show={beat >= 1 && !gpu} delay={2.6} style={{ position: 'absolute', left: 120, top: 892 }} y={8}>
        <span className="sx-label"><span className="sx-amber">■</span> came back &nbsp; <span className="sx-green">■</span> worked &nbsp; each square is 1,000 chips</span>
      </Appear>
      <div className="sx-center" style={{ pointerEvents: 'none' }}>
        <Appear show={gpu} y={36}>
          <div className="sx-label" style={{ fontSize: 40 }}>Six years later</div>
          <div className="sx-display" style={{ fontSize: 330, color: color.green }}>{slide.bullets[0]?.split('|')[0]}</div>
          <div className="sx-h1" style={{ fontSize: 96 }}>GeForce 256</div>
          <div className="sx-body" style={{ marginTop: 22, color: color.dim, maxWidth: 1300 }}>{slide.bullets[0]?.split('|')[1]}</div>
        </Appear>
      </div>
      <Source keys={[]} refs={[['research_facts', 'NV1 chips returned']]} datasets={datasets} show={beat >= 1} extra={gpu ? slide.sources.join('; ') : undefined} />
    </>
  );
}

// ---------- 4 + 5. The revenue line: FY07 → FY16, then the same line continues to FY26 ----------
export function RevenueLine({ slide, beat, datasets }: SceneProps) {
  const ds = datasets.nvda_revenue_annual;
  const err = datasets.research_alexnet;
  const pts: Pt[] = useMemo(() => (ds ? ds.x.map((label, i) => ({ label, v: ds.series.Revenue[i] })).filter((p) => +p.label.slice(2) >= 7) : []), [ds]);
  const i16 = pts.findIndex((p) => p.label === 'FY16');
  const i26 = pts.length - 1;
  const stage2 = slide.id === 'alexnet';
  // Targets by (slide, beat). The line is only ever extended, never redrawn, so slide 5 continues what slide 4 drew.
  const want = !ds ? 0 : stage2 ? (beat >= 3 ? i26 : i16) : beat >= 2 ? i16 : 0;
  const wide = stage2 && beat >= 3;
  const spread = useTween(wide ? 1 : 0, { dur: 3.4, ease: fn.inOut, delay: wide ? 0.3 : 0 }); // 0 = zoomed on FY07–16, 1 = the whole line
  const draw = useTween(want, { dur: wide ? 3.4 : 2.4, ease: wide ? fn.inOut : fn.out, delay: wide ? 0.5 : 0.3 });
  const i1 = useTween(wide ? i26 : i16, { dur: 3.4, ease: fn.inOut, delay: wide ? 0.3 : 0 });
  const ymax = useTween(wide ? Math.ceil((pts[i26]?.v ?? 200) * 1.08) : 6.4, { dur: 3.4, ease: fn.inOut, delay: wide ? 0.3 : 0 });
  if (!ds || !pts.length) return <Missing what="nvda_revenue_annual" />;
  const ticks = wide ? [0, 3, 6, 9, 12, 15, 19].filter((i) => i <= i26) : [0, 3, 6, 9];
  const first = pts[0].v!;
  const mid = pts[i16].v!;
  const last = pts[i26].v!;
  const [a, b] = err ? [get(datasets, 'research_alexnet', 'Top-5 error', err.x[0]), get(datasets, 'research_alexnet', 'Top-5 error', err.x[1])] : [undefined, undefined];
  const panel = stage2 && beat >= 2 && beat < 3;
  return (
    <>
      <Title text={slide.title} />
      {(beat >= 2 || stage2) && <LineChart
        pts={pts}
        box={{ x: 150, y: 330, w: 1620, h: 560 }}
        i0={0}
        i1={i1}
        ymax={ymax}
        draw={draw}
        ticks={ticks}
        dim={panel ? 1 : 0}
        marks={[
          { i: 0, align: 'left', dy: 118 - 142 * spread, node: <b className="sx-h2 sx-dim" style={{ fontWeight: 700 }}>{usd1(first)}</b> },
          { i: i16, align: wide ? 'center' : 'right', dy: -22, node: <b className="sx-h2" style={{ fontWeight: 700 }}>{usd1(mid)}</b> },
          { i: i26, align: 'right', dy: -30, show: wide, node: <b className="sx-display" style={{ fontSize: 130, color: color.green }}><CountUp to={last} active={wide} from={mid} seconds={3} format={usd1} /></b> },
        ]}
      />}
      {/* the 2012 image contest: two bars, then they step aside and the line carries on */}
      <Appear show={panel} y={40} style={{ position: 'absolute', left: 330, top: 250, width: 1260 }}>
        <p className="sx-label" style={{ fontSize: 36, marginBottom: 30 }}>2012 image-recognition contest: share of answers wrong (lower is better)</p>
        {[
          { n: 'First place, trained on two NVIDIA gaming cards', v: a, c: color.green },
          { n: 'Runner-up', v: b, c: color.core },
        ].map((r, k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 26 }}>
            <div style={{ width: 380, fontSize: 30, color: color.ink, lineHeight: 1.2 }}>{r.n}</div>
            <motion.div style={{ height: 78, background: r.c, backgroundImage: cells, borderRadius: 4 }} initial={{ width: 0 }} animate={{ width: panel && r.v != null ? (r.v / 30) * 640 : 0 }} transition={{ duration: 1.1, delay: 0.5 + k * 0.6, ease: ease.out }} />
            <div className="sx-h2" style={{ color: k ? color.dim : color.green }}>{r.v != null ? `${r.v}%` : '…'}</div>
          </div>
        ))}
      </Appear>
      <Appear show={beat >= 2 && !stage2} y={10} style={{ position: 'absolute', left: 150, top: 232 }}>
        <span className="sx-label">Revenue by year. The year CUDA launched, to nine years later.</span>
      </Appear>
      <Source keys={[stage2 && beat >= 2 ? (panel ? 'research_alexnet' : 'nvda_revenue_annual') : 'nvda_revenue_annual']} datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 6. Twenty years ----------
export function TwentyYears({ slide, beat, datasets }: SceneProps) {
  const years = get(datasets, 'research_cuda', 'Years of CUDA', 'value');
  const libs = get(datasets, 'research_facts', 'CUDA-X libraries', 'value');
  const devs = get(datasets, 'research_facts', 'CUDA developers', 'value');
  if (years == null) return <Missing what="research_cuda" />;
  return (
    <>
      <div className="sx-pos" style={{ left: 120, top: 80, display: 'flex', alignItems: 'baseline', gap: 36 }}>
        <div className="sx-display" style={{ fontSize: 520, lineHeight: 1, color: color.green }}>
          <CountUp to={years} active={beat >= 1} seconds={1.6} format={(v) => String(Math.round(v))} />
        </div>
        <div>
          <Words text={slide.title} show={beat >= 1} delay={0.5} className="sx-h1" style={{ display: 'block', maxWidth: 800 }} />
        </div>
      </div>
      {/* one tick per year, 2006 to 2026 */}
      <div className="sx-pos" style={{ left: 120, top: 640, width: 1680, height: 70 }}>
        {Array.from({ length: Math.round(years) }, (_, i) => (
          <motion.span key={i} style={{ position: 'absolute', left: i * (1680 / years), bottom: 0, width: 36, background: i === years - 1 ? color.green : color.greenDeep, borderRadius: 2 }} initial={{ height: 0 }} animate={{ height: beat >= 1 ? 22 + i * 2.4 : 0 }} transition={{ delay: beat >= 1 ? 0.4 + i * 0.07 : 0, duration: 0.5, ease: ease.out }} />
        ))}
      </div>
      <Appear show={beat >= 1} delay={1.8} y={8} style={{ position: 'absolute', left: 120, top: 725 }}>
        <span className="sx-label">One bar for each year since November 2006</span>
      </Appear>
      <Appear show={beat >= 2} style={{ position: 'absolute', left: 120, top: 810, display: 'flex', gap: 120 }}>
        <div className="sx-h1" style={{ fontSize: 96 }}>
          <CountUp to={libs ?? 0} active={beat >= 2} seconds={1.2} format={(v) => `${num(Math.round(v))}+`} /> <span className="sx-dim" style={{ fontSize: 56, fontWeight: 500 }}>libraries</span>
        </div>
        <div className="sx-h1" style={{ fontSize: 96 }}>
          <CountUp to={devs ?? 0} active={beat >= 2} seconds={1.2} format={(v) => `${Math.round(v)} million`} /> <span className="sx-dim" style={{ fontSize: 56, fontWeight: 500 }}>developers</span>
        </div>
      </Appear>
      <Source keys={[]} refs={[['research_cuda', 'Years of CUDA'], ['research_facts', 'CUDA developers'], ['research_facts', 'CUDA-X libraries']]} datasets={datasets} show={beat >= 1} />
    </>
  );
}

// ---------- 7. Four layers ----------
export function FourLayers({ slide, beat, datasets }: SceneProps) {
  const rows = [
    { name: 'Chips', big: `${num(get(datasets, 'peers_datacenter_revenue', 'Multiple of AMD', 'NVIDIA'), 1)}×`, small: "AMD's data-centre sales" },
    { name: 'Software', big: `${num(get(datasets, 'research_facts', 'CUDA developers', 'value'))} million`, small: 'developers writing for it' },
    { name: 'Networking', big: num(get(datasets, 'research_facts', 'GPUs per NVL72 rack', 'value')), small: 'chips wired into one machine' },
    { name: 'Supply', big: `~${num(get(datasets, 'research_cowos_share', 'Share of CoWoS', 'NVIDIA'))}%`, small: "of TSMC's advanced packaging booked" },
  ];
  return (
    <>
      <Title text={slide.title} />
      {rows.map((r, i) => (
        <div key={r.name} className="sx-pos" style={{ left: 120, top: 270 + i * 156, width: 1680 }}>
          <Appear show={beat >= i + 2} y={26} style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
            <div className="sx-h1" style={{ width: 700, fontSize: 92 }}>{r.name}</div>
            <div className="sx-display" style={{ fontSize: 96, color: color.green, width: 470 }}>{r.big}</div>
            <div className="sx-body" style={{ color: color.dim, fontSize: 34, maxWidth: 470, lineHeight: 1.15 }}>{r.small}</div>
          </Appear>
          <motion.div style={{ height: 3, background: color.green, marginTop: 14, originX: 0, opacity: 0.55 }} initial={{ scaleX: 0 }} animate={{ scaleX: beat >= i + 2 ? 1 : 0 }} transition={{ duration: 0.9, ease: ease.out }} />
        </div>
      ))}
      <Source keys={['peers_datacenter_revenue', 'research_cowos_share']} refs={[['research_facts', 'CUDA developers'], ['research_facts', 'GPUs per NVL72 rack']]} datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 8. Share of AI chip supply ----------
export function ChipShare({ slide, beat, datasets }: SceneProps) {
  const ds = datasets.research_ai_chip_share;
  if (!ds) return <Missing what="research_ai_chip_share" />;
  const H = 560;
  return (
    <>
      <Title text={slide.title} />
      <div className="sx-pos" style={{ left: 0, top: 0, width: 1920, height: 1080 }}>
        <div className="sx-pos" style={{ left: 330, top: 800, width: 1260, height: 3, background: color.faint }} />
        {ds.x.map((name, i) => {
          const v = ds.series['Share of AI chip supply'][i] ?? 0;
          const on = beat >= i + 2;
          const left = 480 + i * 560;
          const nv = name === 'NVIDIA';
          return (
            <div key={name}>
              <motion.div style={{ position: 'absolute', left, bottom: 280, width: 320, background: nv ? color.green : color.core, backgroundImage: cells, borderRadius: '6px 6px 0 0', boxShadow: nv ? '0 0 60px rgba(118,185,0,.35)' : undefined }} initial={{ height: 0 }} animate={{ height: on ? (v / 100) * H : 0 }} transition={{ duration: 1.5, ease: ease.out }} />
              <Appear show={on} delay={0.9} y={14} style={{ position: 'absolute', left, width: 320, top: 800 - (v / 100) * H - 140, textAlign: 'center' }}>
                <div className="sx-display" style={{ fontSize: 110, color: nv ? color.green : color.ink }}>
                  <CountUp to={v} active={on} seconds={1.4} format={(x) => `${Math.round(x)}%`} />
                </div>
              </Appear>
              <div className="sx-h2" style={{ position: 'absolute', left, width: 320, top: 830, textAlign: 'center', fontSize: 56 }}>{name}</div>
            </div>
          );
        })}
      </div>
      <Source keys={['research_ai_chip_share']} datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 9. The question ----------
export function Question({ slide, beat }: SceneProps) {
  return (
    <div className="sx-center" style={{ padding: '0 140px' }}>
      <h1 className="sx-display" style={{ fontSize: 176 }}>
        <Words text={slide.title} show={beat >= 1} delay={0.5} step={0.16} />
      </h1>
      <motion.div style={{ height: 6, width: 220, background: color.green, marginTop: 40, originX: 0.5, boxShadow: '0 0 30px rgba(118,185,0,.7)' }} initial={{ scaleX: 0 }} animate={{ scaleX: beat >= 1 ? 1 : 0 }} transition={{ delay: 1.3, duration: dur.slow / 3, ease: ease.out }} />
    </div>
  );
}

void fmt;
