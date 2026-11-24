import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { lookup, resolveText, slideSources, stepsOf, zoomAt, type Dataset, type Slide } from '../shared/schema.ts';
import { Chart } from './Chart.tsx';
import { CoreArray } from './CoreArray.tsx';
import { useDatasets, useNavKeys, useShow } from './useShow.ts';

// Units every formatted value already carries ("48 kg", "10.7m t CO2e"), so the chart caption needn't repeat them.
const UNIT_IN_VALUES = new Set(['tonnes CO2', "'000 t CO2e", "'000 MWh"]);

// Elements revealed together come in one after another, this far apart (seconds).
const GAP = 0.7;
const TITLE_AT = 0.25;

function statValue(slide: Slide, datasets: Record<string, Dataset>): string | undefined {
  const s = slide.stat;
  return s ? lookup(datasets, s.datasetKey, s.series, s.x) : undefined;
}

/** ?motion=off on the stage URL forces motion off on this screen (remembered here until ?motion=on), whatever the operator sets. */
function urlMotionOff(): boolean {
  const q = new URLSearchParams(location.search).get('motion');
  if (q === 'off' || q === 'on') localStorage.setItem('motion', q);
  return localStorage.getItem('motion') === 'off';
}

export function Stage() {
  const { state, send } = useShow();
  const [forcedOff] = useState(urlMotionOff);
  const motion = !forcedOff && state?.motion !== false;
  const datasets = useDatasets();
  useNavKeys(send, state);
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
    <div className={`stage${motion ? ' motion' : ' no-motion'}`}>
      <CoreArray buildKey={state?.liveSince ?? 0} glyph={glyph} compact={!!slide?.bullets.length} effect={slide?.effect} reveal={state?.reveal ?? 0} />
      {slide && <SlideView key={state!.liveSince} slide={withFigures(slide, datasets)} reveal={state!.reveal} datasets={datasets} figure={glyph} />}
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

/** Muted, looping, no controls. If the file is missing (a laptop without app/public/media), the clip and its credit hide. */
function SlideVideo({ file }: { file: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed) document.querySelector('.slide-video')?.classList.add('missing');
  }, [failed]);
  return failed ? null : <video src={`/media/${encodeURIComponent(file)}`} autoPlay muted loop playsInline preload="auto" onError={() => setFailed(true)} />;
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
  // Elements: 0 = title, then one per step (by default the bullets, then the chart). Those revealed together are staggered.
  const prev = useRef(0);
  const batchStart = prev.current;
  useEffect(() => {
    prev.current = reveal;
  });
  const at = (k: number) => (batchStart === 0 ? (k === 0 ? TITLE_AT : 0.5 + k * GAP) : 0.1 + (k - batchStart) * GAP);
  const shown = (k: number) => k < reveal;

  const dataset = slide.chart ? datasets[slide.chart.datasetKey] : undefined;
  const steps = stepsOf(slide);
  const chartIdx = 1 + steps.findIndex((st) => 'chart' in st);
  const bulletIdx = (i: number) => 1 + steps.findIndex((st) => 'bullet' in st && st.bullet === i);
  const shownBullets = slide.bullets.map((_, i) => i).filter((i) => shown(bulletIdx(i)));
  // The point just said is in focus; earlier ones step back, so the eye follows the speaker.
  const newest = shownBullets.length > 1 ? shownBullets.reduce((a, b) => (bulletIdx(b) > bulletIdx(a) ? b : a)) : -1;
  const zoom = zoomAt(slide, reveal);
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
        shown(bulletIdx(i)) ? (
          <Reveal key={i} as="p" className={`point${newest >= 0 && i !== newest ? ' past' : ''}`} at={at(bulletIdx(i))}>
            {b}
          </Reveal>
        ) : null,
      )}
    </div>
  );

  const chart = slide.chart && (
    <figure className={`chart${zoom ? ' zoomed' : ''}`}>
      {shown(chartIdx) &&
        (dataset ? (
          <Delayed at={at(chartIdx)}>
            <figcaption>
              {dataset.title}
              {!dataset.unit || UNIT_IN_VALUES.has(dataset.unit) ? '' : `, ${dataset.unit}`}
              {dataset.placeholder && <span className="placeholder">Placeholder data</span>}
            </figcaption>
            <div className="chart-body">
              <Chart spec={slide.chart} dataset={dataset} zoom={zoom} />
            </div>
          </Delayed>
        ) : (
          <figcaption>No data loaded for this chart yet</figcaption>
        ))}
    </figure>
  );

  const video = slide.video && (
    <Reveal className="slide-video" at={TITLE_AT + 0.4}>
      <SlideVideo file={slide.video.file} />
      <p className="video-credit">Video: {slide.video.credit}</p>
    </Reveal>
  );

  return (
    <main className={`slide layout-${slide.layout}${slide.video ? ' has-video' : ''}${slide.bullets.length ? ' has-points' : ''}${slide.bullets.length >= 3 ? ' many-points' : ''}${slide.bullets.length >= 4 ? ' four-points' : ''}${slide.effect ? ' has-effect' : ''}${slide.id.startsWith('gen-web') ? ' is-web' : ''}`}>
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
      {video}
      {sources.length > 0 && (
        <Reveal className="sources" at={2.2}>
          Source: {sources.join('; ')}
        </Reveal>
      )}
    </main>
  );
}
