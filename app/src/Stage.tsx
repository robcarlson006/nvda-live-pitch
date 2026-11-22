import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { elementCount, lookup, resolveText, slideSources, tokenRefs, type Dataset, type Slide, type SpineSlide } from '../shared/schema.ts';
import { Chart } from './Chart.tsx';
import { Field } from './cores/Field.tsx';
import { useDatasets, useNavKeys, useShow } from './useShow.ts';

// Elements revealed together come in one after another, this far apart (seconds).
const GAP = 0.7;
const TITLE_AT = 0.25;

function statValue(slide: Slide, datasets: Record<string, Dataset>): string | undefined {
  const s = slide.stat;
  return s ? lookup(datasets, s.datasetKey, s.series, s.x) : undefined;
}

export function Stage() {
  const { state, send, spine, ai, pending, live } = useShow();
  const [calm, setCalm] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const datasets = useDatasets();
  useNavKeys(send, state, pending);
  const slide = state?.live ?? null;
  // A board question: the stage listens, then says honestly where it is looking, so the wait is part of the show.
  const waiting = state?.drafts.some((d) => d.kind === 'answer');
  const asking =
    state?.mode === 'question' ? 'Listening to your question.'
    : ai?.busy === 'research' ? 'Not in our data. Searching the web.'
    : ai?.busy === 'answer' ? 'Looking it up in our data.'
    : waiting && !/^(gen|qa)-/.test(slide?.id ?? '') ? 'Checking the answer.'
    : '';
  const seen = (state?.seen ?? []).map((id) => spine.find((s) => s.id === id)).filter((s) => !!s);
  const glyph = slide ? (slide.layout === 'number' ? statValue(slide, datasets) : undefined) : 'NVIDIA';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'm') setCalm((c) => !c);
      if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className={`stage${calm ? ' calm' : ''}`}>
      <Field buildKey={state?.liveSince ?? 0} slide={slide} reveal={state?.reveal ?? 0} datasets={datasets} asking={!!asking} seen={seen} calm={calm} live={live} glyph={glyph} />
      {asking ? (
        <main className="slide layout-statement has-effect" key={asking}>
          <h1 className="statement"><span className="word" style={{ '--at': '0.1s' } as CSSProperties}>{asking}</span></h1>
        </main>
      ) : (
        slide && <SlideView key={state!.liveSince} slide={withFigures(slide, datasets)} reveal={state!.reveal} datasets={datasets} figure={glyph} />
      )}
      {slide?.effect === 'compare' && slide.stat && !asking && (
        <>
          <span className="bar-name" style={{ left: '60vw' }}>{tokenRefs(slide.title)[0]?.series.split(' ')[0]}</span>
          <span className="bar-name" style={{ left: '78.75vw' }}>{slide.stat.x}</span>
        </>
      )}
      {slide?.id === 'built-live' && !asking && state && (
        <div className="session">
          <span><b>{state.seen.length}</b> slides built</span>
          {state.words > 0 && <span><b>{state.words.toLocaleString('en-GB')}</b> words heard</span>}
          {state.startedAt > 0 && state.liveSince - state.startedAt > 60_000 && <span><b>{Math.round((state.liveSince - state.startedAt) / 60_000)}</b> {Math.round((state.liveSince - state.startedAt) / 60_000) === 1 ? 'minute' : 'minutes'}</span>}
        </div>
      )}
      {slide && <LoopStrip spine={spine} seen={state!.seen} current={slide.id} />}
    </div>
  );
}

/** The loop pedal: every slide shown so far leaves a layer here, as tall as the number of things built on it. */
function LoopStrip({ spine, seen, current }: { spine: SpineSlide[]; seen: string[]; current: string }) {
  return (
    <div className="loop" aria-hidden>
      {spine.map((s, i) => {
        const on = seen.includes(s.id);
        return (
          <span key={s.id} className={`${on ? 'on' : ''}${s.id === current ? ' now' : ''}${i && spine[i - 1].speaker !== s.speaker ? ' gap' : ''}`}>
            {on && Array.from({ length: Math.min(5, elementCount(s)) }, (_, k) => <i key={k} />)}
          </span>
        );
      })}
    </div>
  );
}

/** Figures written {{dataset | series | x}} in the text are looked up here, so the stage never shows a typed number. */
function withFigures(s: Slide, datasets: Record<string, Dataset>): Slide {
  const r = (t: string) => resolveText(t, datasets);
  return { ...s, title: r(s.title), bullets: s.bullets.map(r), stat: s.stat && { ...s.stat, label: r(s.stat.label) }, sources: slideSources(s, datasets) };
}

/** Animates in once, when first mounted; the delay is fixed at mount so later re-renders never replay it. */
function Reveal({ at, children, className, as: Tag = 'div' }: { at: number; children: ReactNode; className?: string; as?: 'div' | 'h1' | 'p' }) {
  const [delay] = useState(at);
  return (
    <Tag className={`reveal ${className ?? ''}`} style={{ '--at': `${delay}s` } as CSSProperties}>
      {children}
    </Tag>
  );
}

function Delayed({ at, children }: { at: number; children: ReactNode }) {
  const [ready, setReady] = useState(at <= 0);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), at * 1000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready ? <>{children}</> : null;
}

function SlideView({ slide, reveal, datasets, figure }: { slide: Slide; reveal: number; datasets: Record<string, Dataset>; figure?: string }) {
  // Elements: 0 = title, 1..n = bullets, n+1 = chart. Those revealed in the same step are staggered.
  const prev = useRef(0);
  const batchStart = prev.current;
  useEffect(() => {
    prev.current = reveal;
  });
  const at = (k: number) => (batchStart === 0 ? (k === 0 ? TITLE_AT : 0.5 + k * GAP) : 0.1 + (k - batchStart) * GAP);
  const shown = (k: number) => k < reveal;

  const dataset = slide.chart ? datasets[slide.chart.datasetKey] : undefined;
  const chartIdx = 1 + slide.bullets.length;
  const sources = slide.sources; // already includes every dataset the slide uses (withFigures)

  const title = slide.layout === 'statement' ? (
    <h1 className="statement">
      {slide.title.split(' ').map((w, i) => (
        <span key={i}>
          <span className="word" style={{ '--at': `${TITLE_AT + i * 0.09}s` } as CSSProperties}>
            {w}
          </span>{' '}
        </span>
      ))}
    </h1>
  ) : (
    <Reveal as="h1" at={slide.layout === 'number' ? 1.3 : TITLE_AT}>
      {slide.title}
    </Reveal>
  );

  const points = (
    <div className="points">
      {slide.bullets.map((b, i) =>
        shown(i + 1) ? (
          <Reveal key={i} as="p" className="point" at={at(i + 1)}>
            {b}
          </Reveal>
        ) : null,
      )}
    </div>
  );

  const chart = slide.chart && (
    <figure className="chart">
      {shown(chartIdx) &&
        (dataset ? (
          <Delayed at={at(chartIdx)}>
            <figcaption>
              {dataset.title}{dataset.unit && `, ${dataset.unit}`}
              {dataset.placeholder && <span className="placeholder">Placeholder data</span>}
            </figcaption>
            <div className="chart-body">
              <Chart spec={slide.chart} dataset={dataset} />
            </div>
          </Delayed>
        ) : (
          <figcaption>No data loaded for this chart yet</figcaption>
        ))}
    </figure>
  );

  return (
    <main className={`slide layout-${slide.layout} id-${slide.id}${slide.bullets.length ? ' has-points' : ''}${slide.effect || slide.icons?.length ? ' has-effect' : ''}${slide.id.startsWith('gen-web') ? ' is-web' : ''}`}>
      {slide.layout === 'statement' && (
        <>
          {title}
          {points}
        </>
      )}
      {slide.layout === 'number' && (
        <>
          <span className="sr-only">{figure}</span>
          <div className="number-text">
            {title}
            {slide.stat && (
              <Reveal as="p" className="point" at={1.7}>
                {slide.stat.label}
              </Reveal>
            )}
            {points}
          </div>
        </>
      )}
      {slide.layout === 'split' && (
        <>
          <div className="text">
            {title}
            {points}
          </div>
          {chart}
        </>
      )}
      {slide.layout === 'chart' && (
        <>
          {title}
          {points}
          {chart}
        </>
      )}
      {sources.length > 0 && (
        <Reveal className="sources" at={2.2}>
          Source: {sources.join('; ')}
        </Reveal>
      )}
    </main>
  );
}
