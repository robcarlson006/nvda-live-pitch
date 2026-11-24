import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import type { SceneProps } from './index.tsx';

/**
 * "A race can change the world." Built point by point with the speaker:
 *   title  — a starfield and the curve of the Earth rise into view
 *   1 Sputnik  — an orbit is drawn and Sputnik circles it, beeping
 *   2 Moon     — the Moon rises; a trajectory draws from Earth and a capsule flies it and lands
 *   3 Earth observation — a ring of satellites sweeps the planet with scanning beams: the by-product
 *   4 AI is a race — the camera pulls back; the two races are laid side by side from their starting guns,
 *                    and the AI race is still running.
 * The dates are the same ones the slide says (1957, 1969) and the deck's AlexNet slide (2012). Nothing else is a figure.
 */

const EARTH = { cx: 400, cy: 1180, r: 520 };
const ORBIT_R = 620;
const SAT_R = 575;
const SPACE = { start: 1957, end: 1969 };
const AI_START = 2012; // AlexNet, the deck's own "AI found CUDA" moment
const NOW = new Date().getFullYear();

// Sputnik's arc across the top of its orbit, from off-screen left to off-screen right.
const SPUTNIK_PATH = `M -180 ${EARTH.cy - Math.sqrt(ORBIT_R ** 2 - 580 ** 2)} A ${ORBIT_R} ${ORBIT_R} 0 0 1 980 ${EARTH.cy - Math.sqrt(ORBIT_R ** 2 - 580 ** 2)}`;
const MOON = { cx: 642, cy: 300, r: 56 };
const LUNAR_PATH = `M 318 668 C 290 470, 470 292, ${MOON.cx - MOON.r - 6} ${MOON.cy + 14}`;

/**
 * Moves a group along an SVG path: once (ending at the path's end) or looping. Plain rAF, so it starts exactly when mounted.
 * The path must be in the document (a detached path measures as zero length), so the caller renders it, invisible.
 */
function useAlongPath(active: boolean, ms: number, loop: boolean, motion: boolean, delayMs = 0) {
  const g = useRef<SVGGElement>(null);
  const track = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = g.current;
    const p = track.current;
    if (!el || !p) return;
    const len = p.getTotalLength();
    const place = (t: number) => {
      const a = p.getPointAtLength(t * len);
      const b = p.getPointAtLength(Math.min(len, t * len + 1));
      const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
      el.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${angle})`);
    };
    if (!motion) return place(loop ? 0.5 : 1);
    let raf = 0;
    const t0 = performance.now() + delayMs;
    place(0);
    const tick = (now: number) => {
      const raw = Math.max(0, now - t0) / ms;
      if (!loop && raw >= 1) return place(1);
      place(loop ? raw % 1 : easeInOut(raw)); // the one-way flight eases out of Earth and into the Moon
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, ms, loop, motion, delayMs]); // `active`: the group only exists once its point has been said
  return [g, track] as const;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** A deterministic starfield (same stars every run, so rehearsals look the same). */
function useStars(n: number) {
  return useMemo(() => {
    let s = 7;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: n }, () => ({ x: rnd() * 800, y: rnd() * 640, r: 0.6 + rnd() * 1.6, d: rnd() * 6, o: 0.25 + rnd() * 0.6 }));
  }, [n]);
}

function polar(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: EARTH.cx + r * Math.sin(a), y: EARTH.cy - r * Math.cos(a) };
}

export function SpaceRace({ stage, motion }: SceneProps) {
  const stars = useStars(90);
  const [sputnik, sputnikTrack] = useAlongPath(stage >= 1, 14000, true, motion);
  const [capsule, capsuleTrack] = useAlongPath(stage >= 2, 2600, false, motion, 500);
  const sats = Array.from({ length: 18 }, (_, i) => i * 20);
  const racing = stage >= 4;

  return (
    <svg className={`space-race${racing ? ' racing' : ''}`} viewBox="0 0 800 900" preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="sr-earth" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#14230d" />
          <stop offset="45%" stopColor="#070a06" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
        <linearGradient id="sr-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#76b900" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#76b900" stopOpacity="0" />
        </linearGradient>
        <filter id="sr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <clipPath id="sr-earth-clip">
          <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} />
        </clipPath>
      </defs>

      {/* Everything from the space race. When the AI race arrives, the camera pulls back and this steps behind it. */}
      <g className="sr-space">
        <g className="sr-stars">
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} style={{ '--d': `${s.d}s`, '--o': s.o } as CSSProperties} />
          ))}
        </g>

        {/* The Earth: a dark globe with a green atmosphere, latitude lines like a wireframe. */}
        <g className="sr-earth">
          <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r + 8} fill="none" stroke="#76b900" strokeWidth="10" opacity="0.35" filter="url(#sr-glow)" className="sr-atmos" />
          <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} fill="url(#sr-earth)" />
          <g clipPath="url(#sr-earth-clip)" stroke="#1f2c18" strokeWidth="1.2" fill="none">
            {[80, 160, 250, 350].map((d) => (
              <ellipse key={d} cx={EARTH.cx} cy={EARTH.cy - EARTH.r + d + 40} rx={Math.sqrt(EARTH.r ** 2 - (EARTH.r - d - 40) ** 2) || 1} ry={d * 0.22} />
            ))}
            {[-60, -30, 0, 30, 60].map((d) => (
              <ellipse key={d} cx={EARTH.cx} cy={EARTH.cy} rx={Math.abs(Math.sin((d * Math.PI) / 180)) * EARTH.r + 1} ry={EARTH.r} />
            ))}
          </g>
          <circle cx={EARTH.cx} cy={EARTH.cy} r={EARTH.r} fill="none" stroke="#9fd04a" strokeWidth="1.5" opacity="0.7" />
        </g>

        {/* 1957: Sputnik's orbit draws, and Sputnik circles it, beeping. */}
        {stage >= 1 && (
          <g className="sr-sputnik">
            <circle className="sr-orbit" cx={EARTH.cx} cy={EARTH.cy} r={ORBIT_R} pathLength={1} />
            <path ref={sputnikTrack} d={SPUTNIK_PATH} fill="none" stroke="none" />
            <g ref={sputnik}>
              <circle className="sr-beep" r="8" />
              <line x1="-3" y1="-2" x2="-24" y2="-12" />
              <line x1="-3" y1="2" x2="-24" y2="12" />
              <line x1="-3" y1="-1" x2="-28" y2="-4" />
              <line x1="-3" y1="1" x2="-28" y2="4" />
              <circle r="7" className="sr-sat-body" />
            </g>
            <g className="sr-label" transform="translate(70 528)">
              <text className="sr-year">1957</text>
              <text y="30">Sputnik</text>
            </g>
          </g>
        )}

        {/* 1969: the Moon rises, a trajectory draws from the Earth, and a capsule flies it and lands. */}
        {stage >= 2 && (
          <g className="sr-moon-group">
            <g className="sr-moon">
              <circle cx={MOON.cx} cy={MOON.cy} r={MOON.r + 4} fill="#d9dccf" opacity="0.18" filter="url(#sr-glow)" />
              <circle cx={MOON.cx} cy={MOON.cy} r={MOON.r} fill="#cfd3c6" />
              <circle cx={MOON.cx - 18} cy={MOON.cy - 12} r="11" fill="#b4b9ae" />
              <circle cx={MOON.cx + 16} cy={MOON.cy + 14} r="8" fill="#b4b9ae" />
              <circle cx={MOON.cx + 6} cy={MOON.cy - 26} r="5" fill="#b4b9ae" />
              <circle cx={MOON.cx - 10} cy={MOON.cy + 26} r="6" fill="#bdc2b6" />
              <circle className="sr-touchdown" cx={MOON.cx} cy={MOON.cy} r={MOON.r} />
            </g>
            <path className="sr-trajectory" d={LUNAR_PATH} pathLength={1} />
            <path ref={capsuleTrack} d={LUNAR_PATH} fill="none" stroke="none" />
            <g ref={capsule}>
              <circle r="10" fill="#76b900" opacity="0.35" filter="url(#sr-glow)" />
              <path d="M 8 0 L -6 -5 L -6 5 Z" fill="#f4f6f1" />
            </g>
            <g className="sr-label sr-label-moon" transform={`translate(${MOON.cx} ${MOON.cy - MOON.r - 54})`}>
              <text className="sr-year" textAnchor="middle">1969</text>
              <text y="30" textAnchor="middle">The Moon</text>
            </g>
          </g>
        )}

        {/* The by-product: a ring of satellites sweeping the planet with scanning beams. */}
        {stage >= 3 && (
          <g className="sr-observe">
            <g className="sr-ring">
              {sats.map((deg, i) => {
                const s = polar(SAT_R, deg);
                const a = polar(EARTH.r + 2, deg - 3.2);
                const b = polar(EARTH.r + 2, deg + 3.2);
                return (
                  <g key={deg} className="sr-obs" style={{ '--i': i } as CSSProperties}>
                    <polygon className="sr-beam" points={`${s.x},${s.y} ${a.x},${a.y} ${b.x},${b.y}`} />
                    <g transform={`translate(${s.x} ${s.y}) rotate(${deg})`}>
                      <rect x="-12" y="-2" width="24" height="4" fill="#7a8174" />
                      <rect x="-4" y="-5" width="8" height="10" fill="#f4f6f1" />
                    </g>
                  </g>
                );
              })}
            </g>
            <g className="sr-label sr-label-earth" transform={`translate(${EARTH.cx} 770)`}>
              <text className="sr-year" textAnchor="middle">Today</text>
              <text y="30" textAnchor="middle">Satellites watch our climate and forests</text>
            </g>
          </g>
        )}
      </g>

      {/* AI is a race now: both races from their starting gun, on one scale of years. The AI race has no finish line yet. */}
      {racing && <TwoRaces />}
    </svg>
  );
}

function TwoRaces() {
  const x0 = 40;
  const span = 16; // years shown on the track
  const k = 640 / span;
  const spaceYears = SPACE.end - SPACE.start;
  const aiYears = Math.min(span - 1, NOW - AI_START);
  return (
    <g className="sr-race" transform="translate(0 70)">
      <text className="sr-race-head" x={x0} y={70}>Two races, from the starting gun</text>

      <g transform="translate(0 130)">
        <text className="sr-race-name" x={x0} y={-16}>Space race</text>
        <rect className="sr-track" x={x0} y={0} width={640} height={14} rx={7} />
        <rect className="sr-bar sr-bar-space" x={x0} y={0} width={spaceYears * k} height={14} rx={7} />
        <circle className="sr-finish" cx={x0 + spaceYears * k} cy={7} r={11} />
        <text className="sr-race-tick" x={x0} y={44}>{SPACE.start}</text>
        <text className="sr-race-tick sr-race-end" x={x0 + spaceYears * k} y={44} textAnchor="middle">{SPACE.end} · the Moon</text>
      </g>

      <g transform="translate(0 250)">
        <text className="sr-race-name sr-race-ai" x={x0} y={-16}>AI race</text>
        <rect className="sr-track" x={x0} y={0} width={640} height={14} rx={7} />
        <rect className="sr-bar sr-bar-ai" x={x0} y={0} width={aiYears * k} height={14} rx={7} />
        <line className="sr-ahead" x1={x0 + aiYears * k + 14} y1={7} x2={x0 + 640 + 40} y2={7} />
        <circle className="sr-head" cx={x0 + aiYears * k} cy={7} r={11} />
        <text className="sr-race-tick" x={x0} y={44}>{AI_START} · AlexNet</text>
        <text className="sr-race-tick sr-race-now" x={x0 + aiYears * k} y={44} textAnchor="middle">Today</text>
        <text className="sr-question" x={x0 + 640 + 30} y={-16} textAnchor="end">still running</text>
      </g>
    </g>
  );
}
