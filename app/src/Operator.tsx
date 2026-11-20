import { useState } from 'react';
import { elementCount } from '../shared/schema.ts';
import { demoSlides } from './demoSlides.ts';
import { useNavKeys, useShow } from './useShow.ts';

export function Operator() {
  const { state, spine, spineError, connected, clients, error, send } = useShow();
  const [said, setSaid] = useState('');
  useNavKeys(send);

  const cur = state && state.index >= 0 ? spine[state.index] : undefined;
  const total = state?.live ? elementCount(state.live) : 0;
  const waitingFor = cur && state && state.reveal < total ? cur.elementCues[state.reveal - 1] : null;
  const upNext = state ? spine[state.index + 1] : undefined;

  return (
    <div className="operator">
      <header className="op-top">
        <h2>Operator</h2>
        <span className={`pill ${connected ? 'ok' : 'bad'}`}>Server {connected ? 'connected' : 'offline'}</span>
        <span className="pill">{clients} screens</span>
        <label className="pill toggle">
          <input type="checkbox" checked={state?.autoCue ?? false} onChange={(e) => send({ type: 'autoCue', on: e.target.checked })} /> Follow speech
        </label>
        <a className="pill link" href="/stage" target="_blank">
          Open stage
        </a>
      </header>

      {error && <div className="op-error">{error}</div>}
      {spineError && <div className="op-error">Script not reloaded: {spineError}</div>}

      <section className="op-now">
        <div className="op-now-main">
          <div className="label">{cur ? `Slide ${state!.index + 1} of ${spine.length}, ${cur.speaker}` : state?.live ? 'Extra slide' : 'Standby'}</div>
          <div className="live-title">{state?.live?.title ?? 'Stage shows the NVIDIA standby screen'}</div>
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
          <div className="op-meta">Keys: → or Space next, ← back</div>
        </div>
      </section>

      <section className="op-speech">
        <div className="label">Heard since last cue</div>
        <div className="op-heard">{state?.heard || '…'}</div>
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
          <input value={said} onChange={(e) => setSaid(e.target.value)} placeholder="Type what a presenter says to test the cues, then Enter" />
        </form>
      </section>

      <section>
        <div className="label">Script ({spine.length} slides)</div>
        <ol className="op-spine">
          {spine.map((s, i) => (
            <li key={s.id} className={i === state?.index ? 'active' : ''} onClick={() => send({ type: 'goto', index: i })}>
              <span className="op-spine-speaker">{s.speaker}</span>
              <span className="op-spine-title">{s.title}</span>
              <span className="op-meta">{s.cues.join(' / ')}</span>
            </li>
          ))}
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
