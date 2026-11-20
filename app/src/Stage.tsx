import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { formatValue, type Dataset, type Slide } from '../shared/schema.ts';
import { Chart } from './Chart.tsx';
import { CoreArray } from './CoreArray.tsx';
import { useDatasets, useNavKeys, useShow } from './useShow.ts';

// Elements revealed together come in one after another, this far apart (seconds).
const GAP = 0.7;
const TITLE_AT = 0.25;

function statValue(slide: Slide, datasets: Record<string, Dataset>): string | undefined {
  const s = slide.stat;
  const ds = s && datasets[s.datasetKey];
  if (!s || !ds) return undefined;
  const v = ds.series[s.series]?.[ds.x.indexOf(s.x)];
  return v == null ? undefined : formatValue(v, ds.unit);
}

export function Stage() {
  const { state, send } = useShow();
  const datasets = useDatasets();
  useNavKeys(send);
  const slide = state?.live ?? null;
  const glyph = slide ? (slide.layout === 'number' ? statValue(slide, datasets) : undefined) : 'NVIDIA';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="stage">
      <CoreArray buildKey={state?.liveSince ?? 0} glyph={glyph} />
      {slide && <SlideView key={state!.liveSince} slide={slide} reveal={state!.reveal} datasets={datasets} figure={glyph} />}
    </div>
  );
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
  const statDs = slide.stat ? datasets[slide.stat.datasetKey] : undefined;
  const chartIdx = 1 + slide.bullets.length;
  const sources = [...new Set([...slide.sources, ...[dataset, statDs].filter(Boolean).map((d) => `${d!.source}, as of ${d!.asOf}`)])];

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
              {dataset.title}, {dataset.unit}
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
    <main className={`slide layout-${slide.layout}`}>
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
