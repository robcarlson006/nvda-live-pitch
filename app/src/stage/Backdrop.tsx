import { useEffect, useRef } from 'react';
import { H, W } from './tokens.ts';

type P = { x: number; y: number; z: number; vx: number; vy: number; g: boolean };
type Props = { pulse: number; dim: number; calm: boolean; level?: { current: { level: number } } };

/**
 * The background: a slow field of particles on three depths (parallax), joined by faint lines when they drift close,
 * and a soft green wash. Every beat sends a ripple through it. `dim` fades it to nothing for the finale.
 * One canvas, about 90 particles, no allocation per frame: it holds 60 fps on a mid-range laptop.
 */
export function Backdrop({ pulse, dim, calm, level }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const live = useRef({ pulse, dim, cur: 0, calm, pulseAt: -1e9, lastPulse: pulse });
  live.current.dim = dim;
  live.current.calm = calm;
  if (pulse !== live.current.lastPulse) {
    live.current.lastPulse = pulse;
    live.current.pulseAt = performance.now();
  }

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d');
    if (!ctx) return; // no canvas: the stage is plain black, which is fine
    const rnd = (() => {
      let s = 20261125; // fixed seed: the field looks the same on every run
      return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    })();
    const N = 90;
    const ps: P[] = Array.from({ length: N }, () => {
      const z = rnd() < 0.5 ? 0 : rnd() < 0.6 ? 1 : 2;
      return { x: rnd() * W, y: rnd() * H, z, vx: (rnd() - 0.5) * (6 + z * 7), vy: (rnd() - 0.5) * (4 + z * 5), g: rnd() < 0.16 };
    });
    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const L = live.current;
      L.cur += (L.dim - L.cur) * Math.min(1, dt * 2.2); // the fade to black is smooth, never a cut
      const k = 1 - L.cur;
      ctx.clearRect(0, 0, W, H);
      if (k > 0.01) {
        const sinceP = (now - L.pulseAt) / 1000;
        const ripple = sinceP < 1.6 ? sinceP * 900 : -1;
        const breath = L.calm ? 0 : Math.min(1, (level?.current.level ?? 0) * 3);
        // soft green wash, low in the frame
        const g = ctx.createRadialGradient(W * 0.72, H * 1.05, 0, W * 0.72, H * 1.05, 900);
        g.addColorStop(0, `rgba(118,185,0,${(0.1 + 0.05 * breath) * k})`);
        g.addColorStop(1, 'rgba(118,185,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        for (const p of ps) {
          p.x += p.vx * dt * (L.calm ? 0.3 : 1);
          p.y += p.vy * dt * (L.calm ? 0.3 : 1);
          if (p.x < -20) p.x = W + 20;
          else if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          else if (p.y > H + 20) p.y = -20;
        }
        // lines between near neighbours
        ctx.lineWidth = 1;
        for (let i = 0; i < N; i++) {
          const a = ps[i];
          for (let j = i + 1; j < N; j++) {
            const b = ps[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 36000) {
              ctx.strokeStyle = `rgba(110,125,100,${(1 - d2 / 36000) * 0.22 * k})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
        for (const p of ps) {
          let lit = 0;
          if (ripple >= 0) {
            const d = Math.hypot(p.x - W * 0.5, p.y - H * 0.55);
            lit = Math.max(0, 1 - Math.abs(d - ripple) / 160) * (1 - sinceP / 1.6);
          }
          const r = 1.6 + p.z * 1.1 + lit * 2.2;
          ctx.fillStyle = lit > 0.05 || p.g ? `rgba(118,185,0,${Math.min(1, (p.g ? 0.5 : 0.1) + lit) * k})` : `rgba(150,160,140,${(0.28 + p.z * 0.12) * k})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, 6.2832);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  return <canvas ref={ref} className="sx-backdrop" width={W} height={H} aria-hidden />;
}
