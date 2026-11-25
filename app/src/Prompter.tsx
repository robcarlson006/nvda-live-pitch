import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { SpineSlide } from '../shared/schema.ts';
import './prompter.css';
import { advance, norm, type Word } from './prompterMatch.ts';

/**
 * Full-screen teleprompter, built the way broadcast prompters work:
 *   - big type in a narrow column, the reading line (eye line) fixed a third of the way down, marked by carets;
 *   - the word being said is lit, words already said dim, and the text glides up so the current line stays on the
 *     eye line (smooth, never jumping a page);
 *   - it follows the voice: each word heard moves the marker on. If a presenter skips words, or a whole sentence,
 *     it finds where they are and carries on from there; it never goes backwards on its own;
 *   - pace: a words-per-minute gauge with a plain hint (slow down / pick up), and the time left at this pace;
 *   - no dead air: after a few seconds of silence the next words are boxed, so the speaker finds their place at once;
 *   - fallback: if the mic is off, it can scroll by itself at a set pace, like a prompter operator's hand control.
 * Clicking any word puts the marker there.
 */

export type Feed = { text: string; final: boolean; seq: number };
const TARGET_WPM = 150; // TIMING.md's pace for the script; broadcast reads sit around 140–160
const BAND: [number, number] = [125, 170];
const PREFS = 'prompter-prefs';

function tokenize(spine: SpineSlide[], skipped: string[], resolve: (t: string) => string) {
  const words: Word[] = [];
  const starts = new Map<number, number>(); // spine index → first word
  spine.forEach((slide, si) => {
    if (!slide.say || skipped.includes(slide.id)) return;
    starts.set(si, words.length);
    const parts = resolve(slide.say).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    let first = true;
    parts.forEach((part, pi) => {
      const style = pi % 2 === 0 ? '' : part.startsWith('**') ? 'strong' : 'em';
      const body = style === 'strong' ? part.slice(2, -2) : style === 'em' ? part.slice(1, -1) : part;
      for (const text of body.split(/\s+/).filter(Boolean)) {
        words.push({ text, norm: norm(text), slide: si, style, eos: /[.?!]["”’)]?$/.test(text), first });
        first = false;
      }
    });
  });
  return { words, starts };
}

function loadPrefs(): { size: number; wpm: number } {
  try {
    const p = JSON.parse(localStorage.getItem(PREFS) ?? '{}');
    return { size: Number(p.size) || 56, wpm: Number(p.wpm) || TARGET_WPM };
  } catch {
    return { size: 56, wpm: TARGET_WPM };
  }
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, Math.round(s % 60))).padStart(2, '0')}`;

export function Prompter({ spine, index, skipped, paused, resolve, feed, micOn }: {
  spine: SpineSlide[];
  index: number;
  skipped: string[];
  paused: boolean;
  resolve: (t: string) => string;
  feed: Feed | null;
  micOn: boolean;
}) {
  const { words, starts } = useMemo(() => tokenize(spine, skipped, resolve), [spine, skipped, resolve]);
  const [committed, setCommitted] = useState(-1); // last word said, from final transcripts
  const [shown, setShown] = useState(-1); // committed, moved on by the words still being heard (interim)
  const [skippedWords, setSkippedWords] = useState<Set<number>>(new Set());
  const [prefs, setPrefs] = useState(loadPrefs);
  const [auto, setAuto] = useState(false); // scroll by itself at prefs.wpm (no mic)
  const [lastHeard, setLastHeard] = useState(0);
  const [now, setNow] = useState(Date.now());
  const stamps = useRef<number[]>([]); // when each said word was heard, for the pace gauge
  const lastWord = useRef<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const pos = useRef(0);

  useEffect(() => {
    try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch { /* private mode: fine */ }
  }, [prefs]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  // The deck moved (a cue, Next, Back or a click on the script): start that slide's words, unless already in it.
  useEffect(() => {
    const start = starts.get(index);
    if (start === undefined) return;
    setCommitted((c) => (words[c]?.slide === index || (words[c + 1]?.slide === index && c + 1 === start) ? c : start - 1));
  }, [index, words.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => setShown(committed), [committed]);

  // Words heard: interim moves the marker for now; final commits it.
  useEffect(() => {
    if (!feed || paused || auto) return;
    const heard = feed.text.split(/\s+/).filter(Boolean);
    let at = committed;
    let prev = lastWord.current;
    const passed: number[] = [];
    for (const h of heard) {
      const next = advance(words, at, h, prev);
      if (next > at) {
        for (let k = at + 1; k < next; k++) passed.push(k);
        at = next;
      }
      prev = h;
    }
    setLastHeard(Date.now());
    if (feed.final) {
      if (at > committed) {
        const t = Date.now();
        for (let k = committed + 1; k <= at; k++) if (!passed.includes(k)) stamps.current.push(t);
        stamps.current = stamps.current.filter((s) => t - s < 20_000);
      }
      lastWord.current = heard.at(-1) ?? lastWord.current;
      if (passed.length) setSkippedWords((s) => new Set([...s, ...passed]));
      setCommitted(at);
    } else setShown(at);
  }, [feed?.seq]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll fallback: one word every 60/wpm seconds.
  useEffect(() => {
    if (!auto || paused) return;
    const t = setInterval(() => setCommitted((c) => Math.min(words.length - 1, c + 1)), 60_000 / prefs.wpm);
    return () => clearInterval(t);
  }, [auto, paused, prefs.wpm, words.length]);

  // Glide: keep the current word's line on the eye line, with an eased follow (no jumps).
  useLayoutEffect(() => {
    let raf = 0;
    const tick = () => {
      const area = scroller.current;
      const el = area?.querySelector<HTMLElement>(`[data-w="${Math.max(0, shown + 1)}"]`) ?? area?.querySelector<HTMLElement>(`[data-w="${Math.max(0, shown)}"]`);
      if (area && el) {
        const target = Math.max(0, el.offsetTop - area.clientHeight * 0.33);
        pos.current += (target - pos.current) * 0.09;
        if (Math.abs(target - pos.current) < 0.5) pos.current = target;
        area.scrollTop = pos.current;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shown]);

  const recent = stamps.current.filter((s) => now - s < 20_000);
  const span = recent.length > 1 ? Math.max(5_000, now - recent[0]) : 0;
  const wpm = auto ? prefs.wpm : span ? Math.round((recent.length / span) * 60_000) : 0;
  const pace = !wpm ? 'idle' : wpm > BAND[1] ? 'fast' : wpm < BAND[0] ? 'slow' : 'good';
  const left = words.length - 1 - Math.max(-1, shown);
  const silent = !paused && !auto && micOn && shown >= 0 && shown < words.length - 1 && now - lastHeard > 3500;
  const speaker = spine[words[Math.max(0, shown + 1)]?.slide ?? index]?.speaker;

  const fullscreen = () => {
    const el = root.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.();
  };

  return (
    <div className={`prompter${paused ? ' is-paused' : ''}${silent ? ' is-silent' : ''}`} ref={root} style={{ '--pf': `${prefs.size}px` } as CSSProperties}>
      <div className="pr-bar">
        <span className="pr-speaker">{speaker ?? 'Standby'}</span>
        <span className={`pr-pace ${pace}`} title="Words per minute over the last 20 seconds">
          <b>{wpm || '–'}</b> wpm
          <i>{pace === 'fast' ? 'Slow down' : pace === 'slow' ? 'Pick up the pace' : pace === 'good' ? 'Good pace' : micOn ? 'Listening' : 'Mic off'}</i>
        </span>
        <span className="pr-meter" aria-hidden="true">
          <span style={{ left: `${Math.min(100, Math.max(0, ((wpm || 0) - 90) / 1.2))}%` }} />
        </span>
        <span className="pr-left">{clock((left / (wpm || TARGET_WPM)) * 60)} left at {wpm ? 'this' : 'target'} pace</span>
        <span className="pr-tools">
          <button type="button" onClick={() => setPrefs((p) => ({ ...p, size: Math.max(32, p.size - 6) }))} title="Smaller text">A−</button>
          <button type="button" onClick={() => setPrefs((p) => ({ ...p, size: Math.min(110, p.size + 6) }))} title="Bigger text">A+</button>
          <button type="button" className={auto ? 'primary' : ''} onClick={() => setAuto((a) => !a)} title="Scroll by itself, without the mic">
            {auto ? `Auto ${prefs.wpm} wpm` : 'Follow voice'}
          </button>
          {auto && (
            <>
              <button type="button" onClick={() => setPrefs((p) => ({ ...p, wpm: Math.max(90, p.wpm - 10) }))}>−</button>
              <button type="button" onClick={() => setPrefs((p) => ({ ...p, wpm: Math.min(220, p.wpm + 10) }))}>+</button>
            </>
          )}
          <button type="button" onClick={fullscreen}>Full screen</button>
        </span>
      </div>

      <div className="pr-view">
        <div className="pr-eye" aria-hidden="true"><span>▶</span><span>◀</span></div>
        {paused && <div className="pr-paused">Q&amp;A: prompter paused</div>}
        <div className="pr-scroll" ref={scroller}>
          <div className="pr-text">
            {words.map((w, i) => {
              const cls = [
                'pr-w',
                i <= shown ? (skippedWords.has(i) ? 'skipped' : 'said') : '',
                i === shown + 1 ? 'now' : '',
                silent && i > shown && i <= shown + 3 ? 'find' : '',
                w.style,
                w.eos ? 'eos' : '',
              ].filter(Boolean).join(' ');
              return (
                <span key={i}>
                  {w.first && <span className="pr-slide" data-speaker={spine[w.slide].speaker}>{spine[w.slide].speaker !== spine[words[i - 1]?.slide]?.speaker ? `▸ ${spine[w.slide].speaker}` : ''}</span>}
                  <span className={cls} data-w={i} onClick={() => { setCommitted(i - 1); setShown(i - 1); }}>{w.text}</span>{' '}
                </span>
              );
            })}
            <span className="pr-end">— End —</span>
          </div>
        </div>
      </div>
    </div>
  );
}
