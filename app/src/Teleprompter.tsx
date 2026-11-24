import { useEffect, useRef } from 'react';
import type { SpineSlide } from '../shared/schema.ts';
import './teleprompter.css';

const emphasis = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;

function spokenLine(text: string) {
  return text.split(emphasis).map((part, i) => {
    if (i % 2 === 0) return part;
    return part.startsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <em key={i}>{part.slice(1, -1)}</em>;
  });
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
  const previous = useRef<number | null>(null);
  const activeId = spine[index]?.id;

  useEffect(() => {
    const area = viewport.current;
    if (!area) return;
    if (paused) {
      // Interrupt an in-flight smooth scroll when the operator opens Q&A.
      area.scrollTo({ top: area.scrollTop, behavior: 'instant' });
      return;
    }
    if (previous.current === index) return;
    const top = active.current ? active.current.offsetTop - area.clientHeight * 0.16 : 0;
    const smooth = previous.current !== null && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    area.scrollTo({ top: Math.max(0, top), behavior: smooth ? 'smooth' : 'instant' });
    previous.current = index;
  }, [index, paused, activeId]);

  return (
    <aside className="teleprompter" aria-label="Teleprompter">
      <header>
        <span>Teleprompter</span>
        <span className="op-meta">{paused ? 'Paused for Q&A' : spine[index]?.speaker ?? 'Standby'}</span>
      </header>
      <div className="teleprompter-scroll" ref={viewport} tabIndex={0} aria-label="Speaking script">
        {spine.map((slide, i) => {
          if (!slide.say || (i !== index && skipped.includes(slide.id))) return null;
          return (
            <section key={slide.id} ref={i === index ? active : null} aria-current={i === index ? 'step' : undefined}>
              <h3>{slide.speaker} · {resolve(slide.title)}</h3>
              <p>{spokenLine(resolve(slide.say))}</p>
            </section>
          );
        })}
      </div>
    </aside>
  );
}
