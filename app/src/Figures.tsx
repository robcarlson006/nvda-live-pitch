import { useEffect, useRef, useState, type CSSProperties } from 'react';

/**
 * Figures in a point ("$441.2bn", "-33.55%", "1.01%", "3.7x") count up to their value as the point lands, and settle on
 * exactly the text the data lookup produced. Nothing here makes a number: it only animates towards the one already in
 * the text, and always ends on that text. Years and labels ("2024", "FY29", "Q3") are left alone.
 */
const FIGURE = /([-−+]?[$£€]?)(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(\s?(?:%|x|bn|tn|m|k|pp)\b|%)?/g;

type Part = { text: string; figure?: { sign: string; whole: number; decimals: number; suffix: string; value: number } };

export function splitFigures(text: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const mt of text.matchAll(FIGURE)) {
    const [all, pre = '', int, frac = '', suffix = ''] = mt;
    const i = mt.index ?? 0;
    const before = text[i - 1] ?? ' ';
    // A figure must look like a quantity: a currency, a unit, or decimals. "FY29", "#3", "2024" and "Q3" stay as text.
    const isQuantity = /[$£€]/.test(pre) || suffix.trim() !== '' || frac !== '';
    if (!isQuantity || /[A-Za-z#]/.test(before)) continue;
    if (i > last) out.push({ text: text.slice(last, i) });
    const value = Number(int.replace(/,/g, '') + frac);
    out.push({ text: all, figure: { sign: pre, whole: int.includes(',') ? 1 : 0, decimals: frac ? frac.length - 1 : 0, suffix, value } });
    last = i + all.length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

function CountUp({ text, figure, at, motion }: { text: string; figure: NonNullable<Part['figure']>; at: number; motion: boolean }) {
  const [shown, setShown] = useState(motion ? format(0) : text);
  const done = useRef(!motion);
  function format(v: number) {
    const n = figure.whole
      ? v.toLocaleString('en-GB', { minimumFractionDigits: figure.decimals, maximumFractionDigits: figure.decimals })
      : v.toFixed(figure.decimals);
    return `${figure.sign}${n}${figure.suffix}`;
  }
  useEffect(() => {
    if (done.current) return;
    let raf = 0;
    const start = performance.now() + at * 1000 + 150;
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      const eased = 1 - Math.pow(1 - t, 4);
      if (t >= 1) {
        done.current = true;
        setShown(text); // always end on the exact text the data produced
        return;
      }
      setShown(format(figure.value * eased));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    // The final text sits invisibly underneath, so the line keeps its width while the digits run and nothing reflows.
    // --mark-at: the highlighter sweeps under the figure once it has finished counting.
    <span className="fig" style={{ '--mark-at': `${at + 1.15}s` } as CSSProperties}>
      <span className="fig-final" aria-hidden="true">{text}</span>
      <span className="fig-live">{shown}</span>
    </span>
  );
}

export function Figures({ text, at, motion }: { text: string; at: number; motion: boolean }) {
  const parts = splitFigures(text);
  if (!parts.some((p) => p.figure)) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (p.figure ? <CountUp key={i} text={p.text} figure={p.figure} at={at} motion={motion} /> : <span key={i}>{p.text}</span>))}
    </>
  );
}
