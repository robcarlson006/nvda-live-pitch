import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ClientMsg, SpineSlide } from '../shared/schema.ts';
import { cueMarks, type CueMark } from '../shared/cueMarks.ts';
import './teleprompter.css';

// Up/Down/Space scroll the script. Left/Right and the clicker's PageUp/PageDown are left to move the slides.
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'Home', 'End', ' ']);

type Style = '' | 'strong' | 'em';

/** "**bold** and *italic*" → the plain text, and the style of each character. */
function parse(text: string): { plain: string; styles: Style[] } {
  let plain = '';
  const styles: Style[] = [];
  text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).forEach((part, i) => {
    const style: Style = i % 2 === 0 ? '' : part.startsWith('**') ? 'strong' : 'em';
    const body = style === 'strong' ? part.slice(2, -2) : style === 'em' ? part.slice(1, -1) : part;
    plain += body;
    for (let k = 0; k < body.length; k++) styles.push(style);
  });
  return { plain, styles };
}

/** The script with its emphasis, and the trigger words marked: the slide's own trigger, each point's, and the next one heard for. */
function spokenLine(text: string, marks: CueMark[], next: number | null): ReactNode[] {
  const { plain, styles } = parse(text);
  const markAt = plain.split('').map(() => null as CueMark | null);
  for (const m of marks) for (let k = m.start; k < m.end; k++) markAt[k] = m;
  // Runs of one style inside [from, to): plain, bold or italic.
  const styled = (from: number, to: number) => {
    const parts: ReactNode[] = [];
    for (let k = from; k < to;) {
      let e = k + 1;
      while (e < to && styles[e] === styles[k]) e++;
      const t = plain.slice(k, e);
      parts.push(styles[k] === 'strong' ? <strong key={k}>{t}</strong> : styles[k] === 'em' ? <em key={k}>{t}</em> : <span key={k}>{t}</span>);
      k = e;
    }
    return parts;
  };
  // One box per trigger phrase, even when part of it is bold.
  const out: ReactNode[] = [];
  for (let k = 0; k < plain.length;) {
    const mark = markAt[k];
    let e = k + 1;
    while (e < plain.length && markAt[e] === mark) e++;
    if (mark) {
      const cls = `${mark.step < 0 ? 'cue-slide' : 'cue-point'}${mark.step === next ? ' cue-next' : ''}`;
      out.push(<mark key={k} className={cls} title={mark.step < 0 ? 'Brings this slide up' : 'Builds the next point'}>{styled(k, e)}</mark>);
    } else out.push(...styled(k, e));
    k = e;
  }
  return out;
}

function scrollToSlide(area: HTMLDivElement, slide: HTMLElement | null, animate: boolean) {
  const top = slide ? slide.offsetTop - area.clientHeight * 0.16 : 0;
  const smooth = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  area.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
}

/**
 * The speaking script beside the controls. It follows the deck, shows the trigger words to lean on, and doubles as a
 * manual control: click any slide's script to jump there, or use ←/→ (or the clicker) when a cue isn't heard.
 * Cue listening carries on whatever is pressed. Full screen puts it on the presenter's laptop, big.
 */
export function Teleprompter({ spine, index, reveal, onScript, skipped, paused, resolve, send }: {
  spine: SpineSlide[];
  index: number;
  reveal: number; // elements built on the live slide
  onScript: boolean; // the live slide is spine[index] (not a Q&A slide covering it)
  skipped: string[];
  paused: boolean;
  resolve: (text: string) => string;
  send: (m: ClientMsg) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLElement>(null);
  const followed = useRef(false);
  const [full, setFull] = useState(false);
  const current = spine[index];
  const visible = spine.map((slide, i) => ({ slide, i })).filter(({ slide, i }) => i === index || (slide.say && !skipped.includes(slide.id)));
  const positions = visible.map(({ slide }) => slide.id).join('\0');
  const nextOn = spine.findIndex((s, i) => i > index && !skipped.includes(s.id));
  const marks = useMemo(() => new Map(spine.map((s) => [s.id, s.say ? cueMarks(parse(resolve(s.say)).plain, s.cues, s.elementCues) : []])), [spine, resolve]);

  // The trigger the deck is listening for now: this slide's next point, or once it is built, the next slide's own.
  const total = current ? 1 + current.elementCues.length : 0;
  const listening = paused || !onScript ? null : current && reveal < total ? { id: current.id, step: reveal - 1 } : nextOn >= 0 ? { id: spine[nextOn].id, step: -1 } : null;

  useLayoutEffect(() => {
    const area = viewport.current;
    if (!area) return;
    if (paused) {
      area.scrollTo({ top: area.scrollTop, behavior: 'instant' });
      followed.current = false;
      return;
    }
    scrollToSlide(area, active.current, followed.current);
    followed.current = true;
  }, [current?.id, paused, positions, full]);

  // Full screen fills the window at once, and also asks the browser for true full screen where it is allowed.
  // Esc (or the browser's own exit) leaves it.
  useEffect(() => {
    const onChange = () => { if (!document.fullscreenElement) setFull(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    document.addEventListener('fullscreenchange', onChange);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('fullscreenchange', onChange); window.removeEventListener('keydown', onKey); };
  }, []);

  const toggleFull = () => {
    if (full) {
      setFull(false);
      if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
      return;
    }
    setFull(true);
    viewport.current?.focus();
    root.current?.requestFullscreen?.().catch(() => {}); // not allowed here: the window-filling view still works
  };
  const noSpace = (event: React.KeyboardEvent) => {
    if (event.key === ' ') event.stopPropagation(); // Space on a button presses it; it must not also move the deck
  };

  return (
    <aside className={`teleprompter${full ? ' is-full' : ''}`} aria-label="Teleprompter" ref={root}>
      <header>
        <span className="tp-where">
          {full && current ? <>Slide {index + 1} of {spine.length} · {current.speaker}</> : 'Teleprompter'}
        </span>
        <div className="teleprompter-actions">
          <span className="op-meta" role="status">{paused ? 'Paused for Q&A' : full ? '← back · → next · click a slide to jump' : current?.speaker ?? 'Standby'}</span>
          {full && (
            <>
              <button type="button" onKeyDown={noSpace} onClick={() => send({ type: 'back' })}>← Back</button>
              <button type="button" className="primary" onKeyDown={noSpace} onClick={() => send({ type: 'next' })}>Next →</button>
            </>
          )}
          <button
            type="button"
            disabled={paused || !current}
            onKeyDown={noSpace}
            onClick={() => {
              if (viewport.current) scrollToSlide(viewport.current, active.current, true);
            }}
          >
            Current slide
          </button>
          <button type="button" onKeyDown={noSpace} onClick={toggleFull}>{full ? 'Exit full screen' : 'Full screen'}</button>
        </div>
      </header>
      <div
        className="teleprompter-scroll"
        ref={viewport}
        tabIndex={0}
        aria-label="Speaking script"
        onKeyDown={(event) => {
          if (scrollKeys.has(event.key)) event.stopPropagation();
        }}
      >
        {visible.map(({ slide, i }) => {
          const isCurrent = slide.id === current?.id;
          const next = listening?.id === slide.id ? listening.step : null;
          return (
            <section
              key={slide.id}
              ref={isCurrent ? active : null}
              aria-current={isCurrent ? 'step' : undefined}
              className={isCurrent ? undefined : 'tp-jump'}
              title={isCurrent ? undefined : `Jump to slide ${i + 1}`}
              onClick={() => {
                if (!isCurrent && !window.getSelection()?.toString()) send({ type: 'goto', index: i });
              }}
            >
              <h3>{i + 1}. {slide.speaker} · {resolve(slide.title)}</h3>
              {slide.say ? <p>{spokenLine(resolve(slide.say), marks.get(slide.id) ?? [], next)}</p> : <span className="op-meta">No speaking notes</span>}
            </section>
          );
        })}
      </div>
    </aside>
  );
}
