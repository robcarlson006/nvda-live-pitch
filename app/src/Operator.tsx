import { demoSlides } from './demoSlides.ts';
import { useShow } from './useShow.ts';

export function Operator() {
  const { state, connected, clients, error, send } = useShow();

  return (
    <div className="operator">
      <header className="op-top">
        <h2>Operator</h2>
        <span className={`pill ${connected ? 'ok' : 'bad'}`}>Server {connected ? 'connected' : 'offline'}</span>
        <span className="pill">{clients} screen{clients === 1 ? '' : 's'} connected</span>
        <a className="pill link" href="/stage" target="_blank">
          Open stage ↗
        </a>
      </header>

      {error && <div className="op-error">{error}</div>}

      <section className="op-live">
        <div className="label">On stage now</div>
        <div className="live-title">{state?.live?.title ?? '— nothing (standing by) —'}</div>
        <button onClick={() => send({ type: 'clear' })} disabled={!state?.live}>
          Clear stage
        </button>
      </section>

      <section>
        <div className="label">Test slides</div>
        <div className="op-slides">
          {demoSlides.map((s) => (
            <div key={s.id} className={`op-card ${state?.live?.id === s.id ? 'active' : ''}`}>
              <div className="op-card-meta">
                {s.speaker} · {s.kicker}
              </div>
              <div className="op-card-title">{s.title}</div>
              <div className="op-card-meta">{s.chart ? `Chart: ${s.chart.datasetKey}` : 'Text only'}</div>
              <button className="primary" onClick={() => send({ type: 'push', slide: s })}>
                Push to stage
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="label">Built this session ({state?.history.length ?? 0})</div>
        <ol className="op-history">
          {state?.history.map((s, i) => <li key={i}>{s.title}</li>)}
        </ol>
      </section>
    </div>
  );
}
