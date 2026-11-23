import { motion } from 'framer-motion';
import { useState } from 'react';
import { Appear, CountUp, Missing, Source, Words, get, type SceneProps } from '../primitives.tsx';
import { cells, color, ease } from '../tokens.ts';
import { Title } from './rob.tsx';

// ---------- 18. Reason one: it is discovering things ----------
// Five items, one at a time. The newest is bright; the ones before step back; the last holds.
function Glyph({ i, on, datasets }: { i: number; on: boolean; datasets: SceneProps['datasets'] }) {
  const days = Math.round(get(datasets, 'research_discoveries', 'New antibiotic found in days', 'value') ?? 3);
  const nProb = Math.round(get(datasets, 'research_discoveries', 'AlphaEvolve open problems tried', 'value') ?? 50);
  const better = Math.round(((get(datasets, 'research_discoveries', 'AlphaEvolve improved on best known', 'value') ?? 20) / 100) * nProb);
  const more = get(datasets, 'research_facts', 'Sweden: more cancers found', 'value') ?? 20;
  const less = get(datasets, 'research_facts', 'Sweden: less reading work', 'value') ?? 44;
  const t = { duration: 0.9, ease: ease.out };
  if (i === 0) {
    // a medal: ring draws, then the disc fills
    return (
      <svg width={120} height={120} viewBox="0 0 120 120">
        <motion.circle cx={60} cy={60} r={46} fill="none" stroke={color.amber} strokeWidth={8} initial={{ pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={{ ...t, duration: 1.2 }} />
        <motion.circle cx={60} cy={60} r={30} fill={color.amber} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.4 }} transition={{ ...t, delay: 0.7 }} style={{ transformOrigin: '60px 60px' }} />
      </svg>
    );
  }
  if (i === 1) {
    // fifty open problems; the ones it beat the best known answer on are lit
    return (
      <svg width={200} height={100} viewBox="0 0 200 100">
        {Array.from({ length: nProb }, (_, k) => (
          <motion.rect key={k} x={(k % 10) * 20} y={Math.floor(k / 10) * 20} width={15} height={15} rx={2} initial={{ fill: color.core }} animate={{ fill: on ? (k >= nProb - better ? color.green : '#4a5045') : color.core }} transition={{ delay: on ? 0.2 + k * 0.025 : 0, duration: 0.25 }} />
        ))}
      </svg>
    );
  }
  if (i === 2) {
    // a map filling in: a few dots become many
    return (
      <svg width={200} height={110} viewBox="0 0 200 110">
        {Array.from({ length: 48 }, (_, k) => (
          <motion.circle key={k} cx={10 + (k % 12) * 16 + ((Math.floor(k / 12) % 2) * 8)} cy={12 + Math.floor(k / 12) * 26} r={5.5} initial={{ opacity: 0, fill: color.green }} animate={{ opacity: on ? (k < 4 ? 1 : 0.85) : 0, fill: k < 4 ? color.ink : color.green }} transition={{ delay: on ? (k < 4 ? 0 : 0.6 + k * 0.03) : 0, duration: 0.3 }} />
        ))}
      </svg>
    );
  }
  if (i === 3) {
    // one circle per day
    return (
      <svg width={200} height={100} viewBox="0 0 200 100">
        {Array.from({ length: days }, (_, k) => (
          <motion.circle key={k} cx={34 + k * 64} cy={50} r={28} fill="none" stroke={color.green} strokeWidth={8} initial={{ pathLength: 0 }} animate={{ pathLength: on ? 1 : 0 }} transition={{ delay: on ? 0.2 + k * 0.5 : 0, duration: 0.5 }} />
        ))}
      </svg>
    );
  }
  // two bars from one baseline: more cancers found (up), reading work (down)
  const s = 46 / Math.max(more, less);
  return (
    <svg width={200} height={110} viewBox="0 0 200 110">
      <line x1={0} x2={200} y1={55} y2={55} stroke={color.faint} strokeWidth={2} />
      <motion.rect x={30} width={50} rx={3} fill={color.green} initial={{ height: 0, y: 55 }} animate={{ height: on ? more * s : 0, y: on ? 55 - more * s : 55 }} transition={{ ...t, delay: 0.2 }} />
      <motion.rect x={120} y={55} width={50} rx={3} fill={color.amber} initial={{ height: 0 }} animate={{ height: on ? less * s : 0 }} transition={{ ...t, delay: 0.5 }} />
    </svg>
  );
}

export function Discovering({ slide, beat, datasets }: SceneProps) {
  const n = slide.bullets.length;
  const latest = Math.min(n, beat - 1); // 1-based index of the newest item on screen
  return (
    <>
      <Title text={slide.title} />
      {slide.bullets.map((b, i) => {
        const on = beat >= i + 2;
        const newest = latest === i + 1;
        return (
          <motion.div key={i} className="sx-pos" style={{ left: 120, top: 262 + i * 142, width: 1680, display: 'flex', alignItems: 'center', gap: 56 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: on ? (newest ? 1 : 0.5) : 0, x: on ? 0 : -30 }} transition={{ duration: 0.7, ease: ease.out }}>
            <div style={{ width: 200, flexShrink: 0, display: 'flex', justifyContent: 'center' }}><Glyph i={i} on={on} datasets={datasets} /></div>
            <div className="sx-body" style={{ fontSize: 42, lineHeight: 1.22, maxWidth: 1380 }}>{b}</div>
          </motion.div>
        );
      })}
      <Source keys={['research_discoveries']} refs={[['research_facts', 'Sweden: more cancers found']]} datasets={datasets} show={beat >= 2} />
    </>
  );
}

// ---------- 19. Reason two: the AI race. Restrained: text and rules only ----------
export function Race({ slide, beat, datasets }: SceneProps) {
  const rows = slide.bullets.map((b) => {
    const [head, ...rest] = b.split('|');
    return { head, body: rest.join('|') };
  });
  const last = rows.length - 1;
  return (
    <>
      <Title text={slide.title} />
      {rows.map((r, i) => {
        const on = beat >= i + 2;
        const closing = i === last;
        return (
          <div key={i} className="sx-pos" style={{ left: 120, top: closing ? 800 : 270 + i * 255, width: 1680 }}>
            <motion.div style={{ height: 2, background: closing ? color.green : color.faint, originX: 0, marginBottom: 26 }} initial={{ scaleX: 0 }} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 1, ease: ease.out }} />
            <Appear show={on} delay={0.2} y={22}>
              {closing ? (
                <div className="sx-h1" style={{ fontSize: 88 }}>
                  <span style={{ color: color.ink }}>{r.head}</span> <span style={{ color: color.green }}>{r.body}</span>
                </div>
              ) : (
                <>
                  <div className="sx-label" style={{ fontSize: 34, color: color.green, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{r.head}</div>
                  <div className="sx-body" style={{ fontSize: 50, lineHeight: 1.22, marginTop: 10, maxWidth: 1560 }}>{r.body}</div>
                </>
              )}
            </Appear>
          </div>
        );
      })}
      <Source keys={[]} datasets={datasets} show={beat >= 2} extra={slide.sources.join('; ')} />
    </>
  );
}

// ---------- 20. Own emissions, log scale ----------
const sig = (v: number) => (v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : String(Math.round(v)));
export function Emissions({ slide, beat, datasets }: SceneProps) {
  const ds = datasets.peers_emissions_intensity;
  if (!ds) return <Missing what="peers_emissions_intensity" />;
  const rows = ds.x.map((n, i) => ({ n, v: ds.series['Emissions intensity'][i] ?? 0 })).sort((a, b) => a.v - b.v);
  const LO = 0.01;
  const DEC = 5; // 0.01 … 1,000
  const X0 = 480;
  const PER = 220; // px per factor of ten
  const x = (v: number) => X0 + (Math.log10(v / LO) / 1) * PER;
  const decades = Array.from({ length: DEC + 1 }, (_, k) => LO * 10 ** k);
  const TOP = 330;
  const PITCH = 100;
  return (
    <>
      <Title text={slide.title} />
      <Appear show={beat >= 2} y={8} style={{ position: 'absolute', left: 120, top: 236 }}>
        <span className="sx-label" style={{ fontSize: 34 }}>Own operations: tonnes of CO2 per $1m of sales. Log scale: each line is ten times the one before.</span>
      </Appear>
      {/* the log axis: a gridline per power of ten, so the tiny bar is visibly tiny on the same ruler */}
      {decades.map((d, k) => (
        <div key={k}>
          <div className="sx-pos" style={{ left: x(d), top: TOP - 14, width: 2, height: PITCH * rows.length + 8, background: color.grid, opacity: beat >= 2 ? 1 : 0, transition: 'opacity .8s' }} />
          <div className="sx-pos" style={{ left: x(d) - 80, top: TOP + PITCH * rows.length + 4, width: 160, textAlign: 'center', fontSize: 26, color: color.dim, opacity: beat >= 2 ? 1 : 0, transition: 'opacity .8s' }}>{d < 1 ? String(d) : d.toLocaleString('en-GB')}</div>
        </div>
      ))}
      {rows.map((r, k) => {
        const on = beat >= k + 2;
        const nv = r.n === 'NVIDIA';
        const w = x(r.v) - X0;
        return (
          <div key={r.n}>
            <Appear show={on} delay={0} y={0} style={{ position: 'absolute', left: 120, top: TOP + k * PITCH + 10, width: 330, textAlign: 'right' }}>
              <span className="sx-h2" style={{ fontSize: 50, color: nv ? color.green : color.ink }}>{r.n}</span>
            </Appear>
            <motion.div style={{ position: 'absolute', left: X0, top: TOP + k * PITCH + 8, height: 68, background: nv ? color.green : color.core, backgroundImage: cells, borderRadius: '0 5px 5px 0', boxShadow: nv ? '0 0 50px rgba(118,185,0,.55)' : undefined }} initial={{ width: 0 }} animate={{ width: on ? w : 0 }} transition={{ duration: on ? 1.3 : 0.2, ease: ease.out }} />
            <Appear show={on} delay={0.9} y={0} style={{ position: 'absolute', left: X0 + w + 22, top: TOP + k * PITCH + 4, whiteSpace: 'nowrap' }}>
              <span className="sx-h2" style={{ fontSize: nv ? 76 : 56, color: nv ? color.green : color.ink }}>
                <CountUp to={r.v} active={on} delay={0.3} seconds={1.1} format={sig} />
              </span>
              <span className="sx-label" style={{ marginLeft: 12 }}>tonnes</span>
            </Appear>
          </div>
        );
      })}
      <Source keys={['peers_emissions_intensity']} datasets={datasets} show={beat >= 2} extra="Own operations only (Scope 1 and 2). Suppliers and customers (Scope 3) are not in these bars" />
    </>
  );
}

// ---------- 21. Governance ----------
export function Governance({ slide, beat }: SceneProps) {
  return (
    <>
      <Title text={slide.title} size="sx-display" style={{ fontSize: 130 }} />
      {slide.bullets.map((b, i) => {
        const on = beat >= i + 2;
        return (
          <div key={i} className="sx-pos" style={{ left: 120, top: 330 + i * 230, width: 1680, display: 'flex', gap: 44, alignItems: 'flex-start' }}>
            <motion.div style={{ width: 10, background: color.green, borderRadius: 3, originY: 0, marginTop: 8, boxShadow: '0 0 24px rgba(118,185,0,.6)' }} initial={{ height: 0 }} animate={{ height: on ? 150 : 0 }} transition={{ duration: 0.8, ease: ease.out }} />
            <Appear show={on} delay={0.2} y={24} style={{ maxWidth: 1500 }}>
              <div className="sx-body" style={{ fontSize: 58, lineHeight: 1.18, fontWeight: 560 }}>{b}</div>
            </Appear>
          </div>
        );
      })}
    </>
  );
}

// ---------- 22. The finale ----------
// beat 1: the screen clears (the host fades the backdrop to black), a long pause, then one large line.
// beat 2: after "thank you" the line goes, and the logo fades in on black. Drop the official logo at app/public/nvidia-logo.svg.
export function Finale({ slide, beat }: SceneProps) {
  const [noLogo, setNoLogo] = useState(false);
  const line = beat >= 1 && beat < 2;
  return (
    <>
      <div className="sx-center" style={{ padding: '0 150px' }}>
        <motion.h1 className="sx-display" style={{ fontSize: 142, lineHeight: 1.1, maxWidth: 1620 }} initial={{ opacity: 1 }} animate={{ opacity: beat >= 2 ? 0 : 1 }} transition={{ duration: 0.8, ease: ease.inOut }}>
          <Words text={slide.title} show={line || beat >= 2} delay={2.8} step={0.13} />
        </motion.h1>
      </div>
      <motion.div className="sx-center" initial={{ opacity: 0 }} animate={{ opacity: beat >= 2 ? 1 : 0 }} transition={{ duration: 1.6, delay: beat >= 2 ? 1.1 : 0, ease: ease.inOut }}>
        {noLogo ? (
          <div className="sx-display" style={{ fontSize: 170, letterSpacing: '0.04em', color: color.ink }}>NVIDIA</div>
        ) : (
          <img src="/nvidia-logo.svg" alt="NVIDIA" style={{ width: 760 }} onError={() => setNoLogo(true)} />
        )}
      </motion.div>
    </>
  );
}
