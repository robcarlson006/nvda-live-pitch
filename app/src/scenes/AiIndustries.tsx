import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { SceneProps } from './index.tsx';
import './ai-industries.css';

/**
 * "AI is already delivering results": four industries where AI has already changed the work, two of them with NVIDIA
 * directly involved. When a point the speaker says matches a panel, the camera zooms into that panel for a moment and
 * comes back out; the panel stays lit. Matching is on what the point says (not its position), so the panels follow the
 * script as it changes. A panel the script never mentions is still shown, plainly, so the board reads as a whole.
 *
 * Facts: Science and Healthcare are the slide's own points (sources on the slide). Farming and Data centres are from
 * docs/research/ai-breakthroughs-50.md (#20, checked) and the Ecolab answer in docs/qa-bank/answers.yaml (Ecolab's own
 * releases of 2 Jul and 16 Nov 2026). Worded without figures. Only those two claim NVIDIA involvement.
 */
type Line = { text: string; match: RegExp };
type Panel = { key: string; industry: string; head: string; lines: Line[]; source: string; nvidia?: string; art: () => ReactNode };

const PANELS: Panel[] = [
  {
    key: 'science', industry: 'Science', head: 'AI that predicts and designs proteins',
    lines: [{ text: 'Won the 2024 Nobel Prize in Chemistry', match: /nobel|protein|chemistry/i }],
    source: 'Nobel Prize in Chemistry 2024', art: Protein,
  },
  {
    key: 'health', industry: 'Healthcare', head: 'Faster medicines, earlier diagnoses',
    lines: [
      { text: 'A lung-disease drug went from idea to clinical trials', match: /drug|trial|medicine/i },
      { text: 'Breast screening in Sweden finds more cancers', match: /breast|cancer|screen|sweden/i },
    ],
    source: 'Insilico Medicine; Swedish MASAI trial', art: Scan,
  },
  {
    key: 'farming', industry: 'Farming', head: 'See & Spray sprays only the weeds',
    lines: [{ text: 'John Deere’s sprayer spots each weed as it drives', match: /deere|spray|weed|farm|crop/i }],
    source: 'John Deere; NVIDIA developer blog', nvidia: 'Runs on NVIDIA GPUs', art: Spray,
  },
  {
    key: 'cooling', industry: 'Data centres', head: 'Liquid cooling for AI chips',
    lines: [{ text: 'Ecolab worked with NVIDIA engineers on coolant and monitoring', match: /ecolab|cool|water/i }],
    source: 'Ecolab, 2 Jul and 16 Nov 2026', nvidia: 'With NVIDIA engineers', art: Coolant,
  },
];

const ZOOM_HOLD_MS = 3400;

export function AiIndustries({ stage, points = [], total = 0, motion }: SceneProps) {
  const said = (l: Line) => points.some((p) => l.match.test(p));
  const newest = points[points.length - 1];
  const focusIdx = newest ? PANELS.findIndex((p) => p.lines.some((l) => l.match.test(newest))) : -1;
  const [zoomed, setZoomed] = useState(-1);
  // Zooming out keeps the panel's corner as the origin, so the board shrinks back into place instead of jumping.
  const origin = useRef('50% 50%');
  if (zoomed >= 0) origin.current = `${(zoomed % 2) * 100}% ${Math.floor(zoomed / 2) * 100}%`;

  // On each new point: zoom into the panel it is about, hold, then pull back out. (Safe to run twice: the second run
  // simply sets the same zoom and a fresh timer.)
  useEffect(() => {
    if (!motion || stage === 0 || focusIdx < 0) return setZoomed(-1);
    setZoomed(focusIdx);
    const t = setTimeout(() => setZoomed(-1), ZOOM_HOLD_MS);
    return () => clearTimeout(t);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const done = total > 0 && stage >= total;
  return (
    <div className="ai4-frame">
      <div className={`ai4-board${zoomed >= 0 ? ' zoomed' : ''}${done ? ' done' : ''}`} style={{ transformOrigin: origin.current }}>
        {PANELS.map((p, i) => {
          const any = p.lines.some(said);
          const state = i === focusIdx && !done ? 'now' : any ? 'said' : done ? 'lit' : 'idle';
          const Art = p.art;
          return (
            <article key={p.key} className={`ai4-panel ${state}${zoomed === i ? ' in-focus' : ''}${p.nvidia ? ' nvidia' : ''}`} style={{ '--i': i } as CSSProperties}>
              <header>
                <p className="ai4-industry">{p.industry}</p>
                {p.nvidia && <p className="ai4-nv">{p.nvidia}</p>}
              </header>
              <div className="ai4-art"><Art /></div>
              <h2 className="ai4-head">{p.head}</h2>
              <ul className="ai4-lines">
                {p.lines.map((l) => (
                  <li key={l.text} className={said(l) ? 'on' : ''}>{l.text}</li>
                ))}
              </ul>
              <p className="ai4-source">{p.source}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Small line drawings, one per panel. Each moves gently, and only in a way that says what the panel says. ---- */

function Protein() {
  // A ribbon folding into shape: a helix that draws itself, with residues lighting along it.
  const d = 'M 10 60 C 30 10, 50 10, 60 40 S 90 90, 110 50 S 140 0, 160 40 S 190 90, 210 50';
  return (
    <svg viewBox="0 0 220 100" className="art art-protein">
      <path d={d} pathLength={1} className="art-draw" />
      <path d={d} pathLength={1} className="art-draw art-echo" transform="translate(0 8)" />
      {[20, 60, 110, 160, 205].map((x, k) => (
        <circle key={x} cx={x} cy={[45, 40, 50, 40, 50][k]} r="4.5" className="art-node" style={{ '--k': k } as CSSProperties} />
      ))}
    </svg>
  );
}

function Scan() {
  // A scan sweeping across tissue: dots, one of which is flagged as it passes.
  const dots = [[40, 40], [70, 62], [96, 34], [124, 58], [150, 42], [178, 66], [60, 30], [140, 70]];
  return (
    <svg viewBox="0 0 220 100" className="art art-scan">
      <ellipse cx="110" cy="50" rx="96" ry="40" className="art-outline" />
      {dots.map(([x, y], k) => <circle key={k} cx={x} cy={y} r={k === 3 ? 6 : 3.5} className={k === 3 ? 'art-flag' : 'art-dot'} />)}
      <rect x="14" y="8" width="3" height="84" className="art-sweep" />
    </svg>
  );
}

function Spray() {
  // Rows of crops; the boom passes over and sprays only where a weed is.
  const crops = Array.from({ length: 9 }, (_, k) => 18 + k * 23);
  const weeds = [64, 156];
  return (
    <svg viewBox="0 0 220 100" className="art art-spray">
      {crops.map((x) => <path key={x} d={`M ${x} 86 q -7 -14 0 -24 q 7 10 0 24`} className="art-crop" />)}
      {weeds.map((x) => <path key={x} d={`M ${x} 88 l -6 -10 m 6 10 l 0 -13 m 0 13 l 6 -10`} className="art-weed" />)}
      <g className="art-boom">
        <rect x="-20" y="22" width="40" height="5" rx="2" />
        <path d="M 0 27 l -8 24 h 16 z" className="art-mist" />
      </g>
    </svg>
  );
}

function Coolant() {
  // A chip with liquid running through a cold plate: the flow keeps moving.
  return (
    <svg viewBox="0 0 220 100" className="art art-cool">
      <rect x="78" y="22" width="64" height="56" rx="4" className="art-chip" />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={86 + k * 16} y1="16" x2={86 + k * 16} y2="22" className="art-pin" />)}
      {[0, 1, 2, 3].map((k) => <line key={`b${k}`} x1={86 + k * 16} y1="78" x2={86 + k * 16} y2="84" className="art-pin" />)}
      <path d="M 6 38 H 70 V 62 H 150 V 38 H 214" className="art-pipe" />
      <path d="M 6 38 H 70 V 62 H 150 V 38 H 214" className="art-flow" />
    </svg>
  );
}
