import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { formatValue, unitOf, type Dataset, type Slide } from '../../shared/schema.ts';
import { dur, ease, fn } from './tokens.ts';

export type Datasets = Record<string, Dataset>;
/** What every scene receives. `beat` counts the elements on screen: 1 = the title only, 2 = title and first beat, and so on. */
export type SceneProps = { slide: Slide; beat: number; datasets: Datasets; calm: boolean };

/** A looked-up number, or undefined if the dataset (or the point) is not there. Scenes never type a figure. */
export function get(ds: Datasets, key: string, series: string, x: string): number | undefined {
  const d = ds[key];
  const v = d?.series[series]?.[d.x.indexOf(x)];
  return v == null ? undefined : v;
}
export function fmt(ds: Datasets, key: string, series: string, x: string): string {
  const d = ds[key];
  const v = get(ds, key, series, x);
  return d && v != null ? formatValue(v, unitOf(d, series)) : '…';
}
export const num = (v: number | undefined, digits = 0) => (v == null ? '…' : v.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits }));
/** Whole-number-aware: 5 → "5", 5.01 → "5.0", for tidy count-ups of values like $215.9bn. */
export const usd1 = (v: number) => `$${v.toFixed(1)}bn`;

/** Animates a number toward `target` whenever it changes (rAF, eased). The value it returns is what to draw. */
export function useTween(target: number, opts: { dur?: number; ease?: (t: number) => number; delay?: number; from?: number } = {}): number {
  const { dur: d = 0.9, ease: e = fn.inOut, delay = 0, from } = opts;
  const [v, setV] = useState(from ?? target);
  const cur = useRef(from ?? target);
  useEffect(() => {
    const a = cur.current;
    if (a === target) return;
    let raf = 0;
    let t0 = 0;
    const start = () => {
      t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / (d * 1000));
        cur.current = a + (target - a) * e(p);
        setV(cur.current);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const to = setTimeout(start, delay * 1000);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps
  return v;
}

/** Something that arrives on its beat and leaves again if the operator steps back. Both directions work from `show` alone. */
export function Appear({ show, delay = 0, y = 32, children, style, className, scale }: { show: boolean; delay?: number; y?: number; children?: ReactNode; style?: CSSProperties; className?: string; scale?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y, scale: scale ?? 1 }}
      animate={show ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y, scale: scale ?? 1 }}
      transition={{ duration: show ? dur.beat : 0.25, delay: show ? delay : 0, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}

/** Masked word-by-word reveal. Words rise out of a clip, one after another. */
export function Words({ text, show, delay = 0, step = 0.08, className, style }: { text: string; show: boolean; delay?: number; step?: number; className?: string; style?: CSSProperties }) {
  const words = text.split(' ');
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="sx-mask">
            <motion.span initial={{ y: '115%' }} animate={{ y: show ? '0%' : '115%' }} transition={{ duration: show ? 0.7 : 0.2, delay: show ? delay + i * step : 0, ease: ease.out }}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  );
}

/** A number that counts up to its looked-up value when `active`. */
export function CountUp({ to, active, from = 0, delay = 0, seconds = dur.count, format }: { to: number; active: boolean; from?: number; delay?: number; seconds?: number; format: (v: number) => string }) {
  const v = useTween(active ? to : from, { dur: seconds, ease: fn.out, delay: active ? delay : 0, from });
  return <>{format(v)}</>;
}

/** The source line under a slide. Names every dataset the slide draws on, with its date. */
export function Source({ keys, datasets, show, extra }: { keys: string[]; datasets: Datasets; show: boolean; extra?: string }) {
  const parts = [...new Set(keys.map((k) => datasets[k]).filter((d): d is Dataset => !!d).map((d) => `${d.source.replace(/\s*\(via NotebookLM[^)]*\)/, '')}, as of ${d.asOf}`))];
  if (extra) parts.push(extra);
  return (
    <Appear show={show} y={8} className="sx-foot" delay={0.5}>
      {parts.length ? `Source: ${parts.join('; ')}` : ''}
    </Appear>
  );
}

/** Honest empty state: a scene whose data is missing says so instead of drawing something. */
export function Missing({ what }: { what: string }) {
  return (
    <div className="sx-center">
      <p className="sx-h2 sx-amber">Data missing</p>
      <p className="sx-label">{what}</p>
    </div>
  );
}
