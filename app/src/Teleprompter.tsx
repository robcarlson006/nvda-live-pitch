import { useLayoutEffect, useRef } from 'react';
import type { SpineSlide } from '../shared/schema.ts';
import './teleprompter.css';

const emphasis = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

function spokenLine(text: string) {
  return text.split(emphasis).map((part, i) => {
    if (i % 2 === 0) return part;
    return part.startsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <em key={i}>{part.slice(1, -1)}</em>;
  });
}

function scrollToSlide(area: HTMLDivElement, slide: HTMLElement | null, animate: boolean) {
  const top = slide ? slide.offsetTop - area.clientHeight * 0.16 : 0;
  const smooth = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  area.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
}

export function Teleprompter({ spine, index, skipped, paused, resolve }: {
  spine: SpineSlide[];
  index: number;
  skipped: string[];
  paused: boolean;
  resolve: (text: string) => string;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const active = useRef<HTMLElement>(null);
  const followed = useRef(false);
  const current = spine[index];
  const visible = spine.filter((slide, i) => i === index || (slide.say && !skipped.includes(slide.id)));
  const positions = visible.map((slide) => slide.id).join('\0');

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
  }, [current?.id, paused, positions]);

  return (
    <aside className="teleprompter" aria-label="Teleprompter">
      <header>
        <span>Teleprompter</span>
        <div className="teleprompter-actions">
          <span className="op-meta" role="status">{paused ? 'Paused for Q&A' : current?.speaker ?? 'Standby'}</span>
          <button
            type="button"
            disabled={paused || !current}
            onKeyDown={(event) => {
              if (event.key === ' ') event.stopPropagation();
            }}
            onClick={() => {
              if (viewport.current) scrollToSlide(viewport.current, active.current, true);
            }}
          >
            Current slide
          </button>
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
        {visible.map((slide) => {
          const isCurrent = slide.id === current?.id;
          return (
            <section key={slide.id} ref={isCurrent ? active : null} aria-current={isCurrent ? 'step' : undefined}>
              <h3>{slide.speaker} · {resolve(slide.title)}</h3>
              {slide.say ? <p>{spokenLine(resolve(slide.say))}</p> : <span className="op-meta">No speaking notes</span>}
            </section>
          );
        })}
      </div>
    </aside>
  );
}
