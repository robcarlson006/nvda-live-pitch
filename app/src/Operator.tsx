import { useEffect, useRef, useState } from 'react';
import { elementCount, isUnverified, resolveText, type ShowState, type SpineSlide } from '../shared/schema.ts';
import { pace, panicMessages } from '../shared/pace.ts';
import { LivePanel } from './LivePanel.tsx';
import { demoSlides } from './demoSlides.ts';
import { useSpeech, type Engine } from './useSpeech.ts';
import { useDatasets, useNavKeys, useShow } from './useShow.ts';

const TARGET_S = 240; // soft target for Rob's opening (beats 1–21)
const clock = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Last slide of the opening section: the run of slides by the first speaker. Same rule as the server's log. */
const sectionEnd = (spine: SpineSlide[]) => {
  const i = spine.findIndex((s) => s.speaker !== spine[0]?.speaker);
  return i < 0 ? spine.length - 1 : i - 1;
};

function useNow(ms = 500) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function Timer({ state, spine, send, text }: { state: ShowState | null; spine: SpineSlide[]; send: ReturnType<typeof useShow>['send']; text: (t: string) => string }) {
  const now = useNow();
  const run = state?.rehearsal ?? null;
  const end = sectionEnd(spine);
  const onSlide = state?.live ? now - state.liveSince : 0;
  const section = run
    ? run.entries.reduce((t, e, i) => (e.index <= end ? t + ((run.entries[i + 1]?.at ?? now) - e.at) : t), 0)
    : 0;
  const over = section > TARGET_S * 1000;
  const pc = pace(spine, state ?? { index: -1, skipped: [] }, run ? (now - run.startedAt) / 1000 : 0);

  return (
    <section className="op-timer">
      <div>
        <div className="label">This slide</div>
        <div className="op-clock">{state?.live ? clock(onSlide) : '–'}</div>
      </div>
      <div>
        <div className="label">Rob's opening (target {clock(TARGET_S * 1000)})</div>
        <div className={`op-clock ${over ? 'over' : ''}`}>{run ? clock(section) : '–'}</div>
      </div>
      <div>
        <div className="label">Whole run</div>
        <div className="op-clock">{run ? clock(now - run.startedAt) : '–'}</div>
      </div>
      {run && (
        <div>
          <div className="label">Time left vs script</div>
          <div className={`op-clock ${pc.over > 0 ? 'over' : ''}`}>
            {clock(pc.timeLeft * 1000)} / {clock(pc.plannedLeft * 1000)}
          </div>
          <div className="op-meta">
            {pc.over > 0 ? `Behind by about ${clock(pc.over * 1000)}. Consider cutting: ${pc.suggest.map((s) => `${text(spine.find((x) => x.id === s.id)!.title)} (${clock(s.seconds * 1000)})`).join(', ') || 'no ✂ slides left'}` : 'On time'}
          </div>
        </div>
      )}
      <div className="op-timer-actions">
        {run ? (
          <button className="primary" onClick={() => send({ type: 'rehearsal', action: 'stop' })}>
            Stop &amp; save run
          </button>
        ) : (
          <button onClick={() => send({ type: 'rehearsal', action: 'start' })}>Start rehearsal run</button>
        )}
        <div className="op-meta">{run ? `${run.entries.length} slides logged` : 'Logs each slide to rehearsal/'}</div>
      </div>
    </section>
  );
}

function MicMeter({ level }: { level: () => number }) {
  useNow(100); // re-render ten times a second
  return <meter className="op-meter" min={0} max={0.25} value={level()} title="Microphone level" />;
}

export function Operator() {
  const { state, spine, spineError, connected, clients, error, notice, send, ai, bank, pending, live } = useShow();
  const datasets = useDatasets();
  const [said, setSaid] = useState('');
  const mic = useSpeech((text, final) => send({ type: 'transcript', text, final }));
  useNavKeys(send, state, pending);

  // Tell the server (and so the stage) what the microphone is doing, and how loud the room is.
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    if (connected) sendRef.current({ type: 'micStatus', on: mic.on, listening: mic.listening, engine: mic.engine, lang: mic.lang, device: mic.device.slice(0, 200), problem: mic.problem?.slice(0, 300) ?? null });
  }, [connected, mic.on, mic.listening, mic.engine, mic.lang, mic.device, mic.problem]);
  useEffect(() => {
    if (!mic.listening) return;
    const t = setInterval(() => sendRef.current({ type: 'level', v: Math.min(1, mic.level() * 4) }), 120);
    return () => (clearInterval(t), sendRef.current({ type: 'level', v: 0 }));
  }, [mic.listening]); // eslint-disable-line react-hooks/exhaustive-deps
  live.current.micCmd = (m) => (m.action === 'start' ? mic.start() : mic.stop());

  const cur = state && state.index >= 0 ? spine[state.index] : undefined;
  const total = state?.live ? elementCount(state.live) : 0;
  const waitingFor = cur && state && state.reveal < total ? cur.elementCues[state.reveal - 1] : null;
  const skipped = state?.skipped ?? [];
  const upNext = state ? spine.slice(state.index + 1).find((s) => !skipped.includes(s.id)) : undefined;
  const text = (t: string) => resolveText(t, datasets);
  const unverified = (s: SpineSlide) => isUnverified(s, datasets);

  return (
    <div className="operator">
      <header className="op-top">
        <h2>Operator</h2>
        <span className={`pill ${connected ? 'ok' : 'bad'}`}>Server {connected ? 'connected' : 'offline'}</span>
        <span className="pill">{clients} screens</span>
        <span className={`pill ${mic.listening ? 'ok' : mic.problem || mic.on ? 'bad' : ''}`}>
          Mic {mic.listening ? `on: ${mic.engine === 'deepgram' ? 'Deepgram' : 'Chrome'} (${mic.lang})` : mic.on ? 'connecting…' : 'off'}
        </span>
        <label className="pill toggle">
          <input type="checkbox" checked={state?.autoCue ?? false} onChange={(e) => send({ type: 'autoCue', on: e.target.checked })} /> Follow speech
        </label>
        {ai && state?.follow === 'live' && <span className={`pill ${ai.follow.error ? 'bad' : 'ok'}`}>{ai.follow.error ?? `Following meaning${ai.follow.ms ? ` (${(ai.follow.ms / 1000).toFixed(1)} s)` : ''}`}</span>}
        <a className="pill link" href="/stage" target="_blank">
          Open stage
        </a>
      </header>

      {error && <div className="op-error">{error}</div>}
      {spineError && <div className="op-error">Script not reloaded: {spineError}</div>}
      {notice && <div className="op-notice">{notice}</div>}

      <section className="op-now">
        <div className="op-now-main">
          <div className="label">
            {cur ? `Slide ${state!.index + 1} of ${spine.length}, ${cur.speaker}` : state?.live ? 'Extra slide' : 'Standby'}
            {cur && unverified(cur) && <span className="tag-unverified">unverified</span>}
            {cur?.optional && <span className="tag-optional">✂ optional</span>}
          </div>
          <div className="live-title">{state?.live ? text(state.live.title) : 'Stage shows the NVIDIA standby screen'}</div>
          {state?.live && (
            <div className="op-meta">
              Built {state.reveal} of {total} elements
              {waitingFor && <> · waiting for “{waitingFor}”</>}
            </div>
          )}
          {cur?.say && <p className="op-say">{cur.say}</p>}
        </div>
        <div className="op-nav">
          <button onClick={() => send({ type: 'back' })}>Back</button>
          <button className="primary big" onClick={() => send({ type: 'next' })}>
            Next
          </button>
          <button onClick={() => send({ type: 'clear' })}>Standby</button>
          <button className="primary" title="Esc or P" onClick={() => panicMessages().forEach(send)}>Panic: stop following, standby (Esc)</button>
          <div className="op-meta">Keys: → or Space next, ← back</div>
        </div>
      </section>

      <LivePanel state={state} ai={ai} bank={bank} pending={pending} datasets={datasets} send={send} />

      <Timer state={state} spine={spine} send={send} text={text} />

      <section className="op-speech">
        <div className="op-mic">
          {mic.on ? (
            <button className="danger" onClick={mic.stop}>
              Stop mic
            </button>
          ) : (
            <button className="primary" onClick={mic.start}>
              Start mic
            </button>
          )}
          <label className="op-meta">
            Accent{' '}
            <select value={mic.lang} onChange={(e) => mic.changeLang(e.target.value as 'en-GB' | 'en-US')}>
              <option value="en-GB">English (UK)</option>
              <option value="en-US">English (US)</option>
            </select>
          </label>
          <label className="op-meta">
            Engine{' '}
            <select value={mic.engine} onChange={(e) => mic.changeEngine(e.target.value as Engine)}>
              <option value="deepgram">Deepgram</option>
              <option value="chrome" disabled={!mic.supported}>
                Chrome (backup)
              </option>
            </select>
          </label>
          {mic.on && mic.engine === 'deepgram' && <MicMeter level={mic.level} />}
          <span className="op-meta">{mic.device || 'Both engines need internet. Speak, and the deck follows.'}</span>
        </div>
        {mic.problem && <div className="op-error">{mic.problem}</div>}
        <div className="label">Heard since last cue</div>
        <div className="op-heard">
          {state?.heard || (mic.interim ? '' : '…')} {mic.interim && <span className="op-interim">{mic.interim}</span>}
        </div>
        {state?.lastCue && (
          <div className="op-meta">
            Last cue: “{state.lastCue.phrase}” → {state.lastCue.target}
          </div>
        )}
        {upNext && <div className="op-meta">Next slide listens for: {upNext.cues.map((c) => `“${c}”`).join(', ')}</div>}
        <form
          className="op-sim"
          onSubmit={(e) => {
            e.preventDefault();
            if (said.trim()) send({ type: 'transcript', text: said, final: true });
            setSaid('');
          }}
        >
          <input value={said} onChange={(e) => setSaid(e.target.value)} placeholder="Or type what a presenter says to test the cues, then Enter" />
        </form>
      </section>

      <section>
        <div className="label">
          Script ({spine.length} slides). Untick ✂ slides to skip them.
        </div>
        <ol className="op-spine">
          {spine.map((s, i) => {
            const off = skipped.includes(s.id);
            return (
              <li key={s.id} className={`${i === state?.index ? 'active' : ''} ${off ? 'skipped' : ''}`} onClick={() => send({ type: 'goto', index: i })}>
                <span className="op-spine-speaker">
                  {i + 1}. {s.speaker}
                </span>
                <span className="op-spine-title">
                  {text(s.title)}
                  {unverified(s) && <span className="tag-unverified">unverified</span>}
                  {s.optional && (
                    <label className="tag-optional" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={!off} onChange={(e) => send({ type: 'skip', id: s.id, on: !e.target.checked })} /> ✂ {off ? 'skipped' : 'in'}
                    </label>
                  )}
                </span>
                <span className="op-meta">
                  {s.layout} · {s.cues.join(' / ')}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <details>
        <summary className="label">Extra slides (not in the script)</summary>
        <div className="op-slides">
          {demoSlides.map((s) => (
            <div key={s.id} className="op-card">
              <div className="op-card-title">{s.title}</div>
              <button onClick={() => send({ type: 'push', slide: s })}>Show now</button>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
