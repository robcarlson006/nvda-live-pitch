import { useState } from 'react';
import { resolveText, type AiInfo, type ClientMsg, type Dataset, type ShowState } from '../shared/schema.ts';

type Props = { state: ShowState | null; ai: AiInfo | null; bank: { id: string; question: string }[]; datasets: Record<string, Dataset>; send: (m: ClientMsg) => void };

/** Questions from the board, off-script reactions, and the queue of slides waiting for approval. */
export function LivePanel({ state, ai, bank, datasets, send }: Props) {
  const [typed, setTyped] = useState('');
  if (!state || !ai) return null;
  const asking = state.mode === 'question';
  const text = (t: string) => resolveText(t, datasets);
  const covered = !!state.live && /^(gen|qa)-/.test(state.live.id);

  return (
    <section className={`op-live ${asking ? 'asking' : ''}`}>
      <div className="op-mic">
        {asking ? (
          <>
            <button className="primary" onClick={() => send({ type: 'question', action: 'answer' })}>
              Answer it (Q)
            </button>
            <button onClick={() => send({ type: 'question', action: 'cancel' })}>Cancel</button>
          </>
        ) : (
          <button className="primary" onClick={() => send({ type: 'question', action: 'start' })}>
            Board question (Q)
          </button>
        )}
        {covered && <button onClick={() => send({ type: 'resume' })}>Back to script (R)</button>}
        <label className="pill toggle">
          <input type="checkbox" checked={state.riff} onChange={(e) => send({ type: 'setting', key: 'riff', on: e.target.checked })} /> React off script
        </label>
        <label className="pill toggle">
          <input type="checkbox" checked={state.autoShow} onChange={(e) => send({ type: 'setting', key: 'autoShow', on: e.target.checked })} /> Show without approval
        </label>
        <span className={`pill ${!ai.hasKey || ai.spent >= ai.cap * 0.9 ? 'bad' : 'ok'}`}>
          {ai.hasKey ? `AI $${ai.spent.toFixed(2)} of $${ai.cap.toFixed(2)}` : 'No Anthropic key'}
        </span>
        {ai.busy && <span className="pill ok">Building {ai.busy === 'answer' ? 'answer' : 'reaction'}…</span>}
      </div>
      {asking && <div className="op-heard">{`${state.question} ${state.questionTail}`.trim() || 'Listening to the question…'}</div>}
      {ai.note && <div className="op-error">{ai.note}</div>}
      {ai.bankError && <div className="op-error">Prepared answers not loaded: {ai.bankError}</div>}

      {state.drafts.map((d, i) => (
        <div key={d.id} className="op-draft">
          <div className="label">
            {d.kind === 'answer' ? 'Answer' : 'Off-script reaction'} · {d.from === 'prepared' ? 'prepared' : 'Claude'} · heard “{d.heard.slice(-140)}”
          </div>
          <div className="live-title">{text(d.slide.title)}</div>
          {d.slide.stat && <div className="op-meta">Figure: {text(`{{${d.slide.stat.datasetKey} | ${d.slide.stat.series} | ${d.slide.stat.x}}}`)} {text(d.slide.stat.label)}</div>}
          {d.slide.bullets.map((b) => (
            <div key={b} className="op-meta">• {text(b)}</div>
          ))}
          {d.slide.chart && <div className="op-meta">Chart: {datasets[d.slide.chart.datasetKey]?.title} ({d.slide.chart.series.join(', ')})</div>}
          <div className="op-mic">
            <button className="primary" onClick={() => send({ type: 'draft', action: 'show', id: d.id })}>
              Show{i === 0 ? ' (A)' : ''}
            </button>
            <button onClick={() => send({ type: 'draft', action: 'reject', id: d.id })}>Reject{i === 0 ? ' (X)' : ''}</button>
            {d.from === 'prepared' && (
              <button
                onClick={() => {
                  send({ type: 'draft', action: 'reject', id: d.id });
                  send({ type: 'ask', text: d.heard, fresh: true });
                }}
              >
                Ask Claude instead
              </button>
            )}
          </div>
        </div>
      ))}

      <form
        className="op-sim"
        onSubmit={(e) => {
          e.preventDefault();
          if (typed.trim()) send({ type: 'ask', text: typed.trim() });
          setTyped('');
        }}
      >
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Or type a question, then Enter" />
      </form>
      <details>
        <summary className="label">Prepared answers ({bank.length}): free, instant, work offline</summary>
        <div className="op-slides">
          {bank.map((b) => (
            <button key={b.id} onClick={() => send({ type: 'bank', id: b.id })}>
              {b.question}
            </button>
          ))}
        </div>
      </details>
    </section>
  );
}
