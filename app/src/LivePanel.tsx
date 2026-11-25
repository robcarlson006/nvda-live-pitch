import { useRef, useState } from 'react';
import { resolveText, slideSources, type AiInfo, type ClientMsg, type Dataset, type Draft, type ServerMsg, type ShowState, type SpineSlide } from '../shared/schema.ts';
import { findSlide } from '../shared/router.ts';
import './live-panel.css';

type BankIndex = Extract<ServerMsg, { type: 'state' }>['bank'];

type Props = {
  state: ShowState | null;
  ai: AiInfo | null;
  connected: boolean;
  bank: BankIndex;
  answers: Draft[];
  datasets: Record<string, Dataset>;
  send: (m: ClientMsg) => void;
  spine: SpineSlide[];
  thumb: (id: string) => string | null;
};

const route = { prepared: 'Prepared answer', web: 'Scoped web research', claude: 'Local evidence check', slide: 'One of our slides' };
const answerStatus = (draft: Draft) => draft.evidenceGap ? 'Evidence gap' : route[draft.from];
const threadId = (draft: Draft) => draft.threadId ?? draft.id;

function AnswerBody({ draft, ai, datasets }: { draft: Draft; ai: AiInfo | null; datasets: Props['datasets'] }) {
  const { slide, links } = draft;
  const { stat, chart, diagram } = slide;
  const text = (value: string) => resolveText(value, datasets);
  const sources = slideSources(slide, datasets);
  const building = ai?.activeDraftId === draft.id && ai.busy === 'visual';
  const researching = ai?.activeDraftId === draft.id && ai.busy === 'research';

  return (
    <>
      <div className="live-title">{text(slide.title)}</div>
      {stat && <p className="op-answer-figure">{text(`{{${stat.datasetKey} | ${stat.series} | ${stat.x}}}`)} {text(stat.label)}</p>}
      {slide.bullets.length > 0 && (
        <ul className="op-answer-list">
          {slide.bullets.map((bullet, index) => <li key={index}>{text(bullet)}</li>)}
        </ul>
      )}
      {chart && (
        <p className="op-meta">
          {chart.display === 'table' ? 'Table' : 'Chart'} ready · {datasets[chart.datasetKey]?.title ?? chart.datasetKey} · {chart.series.join(', ')}
          {chart.range && <> · {chart.range.join(' – ')}</>}
          {chart.highlight && <> · Highlight {chart.highlight}</>}
        </p>
      )}
      {diagram && <p className="op-meta">Diagram ready · {diagram.kind} · {diagram.nodes.map(text).join(', ')}</p>}
      {stat && !chart && <p className="op-meta">Headline figure ready</p>}
      {draft.kind === 'answer' && !stat && !chart && !diagram && (
        <p className="op-meta" role="status">{building ? 'Building a visual… Text ready for review.' : 'Text answer ready'}</p>
      )}
      {researching && <p className="op-meta" role="status">Checking approved sources for this question…</p>}
      {(sources.length > 0 || !!links?.length) && (
        <div className="op-answer-sources">
          <div className="label">Sources</div>
          {!!links?.length && (
            <ul className="op-answer-list">
              {links.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
                  {link.publisher && <> · {link.publisher}</>}
                  {link.date && <> · {link.date}</>}
                  {link.updated && link.updated !== link.date && <> · Updated {link.updated}</>}
                  {!!link.claims?.length && (
                    <ul className="op-answer-list op-meta">
                      {link.claims.map((claim, index) => <li key={index}>{claim}</li>)}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
          {sources.length > 0 && (
            <ul className="op-answer-list op-meta">
              {sources.map((source) => <li key={source}>{source}</li>)}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

function PreparedBank({ bank, connected, send }: Pick<Props, 'bank' | 'connected' | 'send'>) {
  const [query, setQuery] = useState('');
  const words = (text: string) => text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
  const terms = words(query);
  const matches = bank.filter((entry) => {
    const searchable = words([entry.question, ...(entry.ask ?? [])].join(' '));
    return terms.every((term) => searchable.some((word) => word.startsWith(term)));
  });

  return (
    <details className="op-bank">
      <summary>Prepared answers ({bank.length})</summary>
      <label className="op-sim op-bank-search">
        <span className="label">Search questions or topics</span>
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="op-meta" role="status">
        {bank.length === 0 ? 'Prepared questions are unavailable until the local server loads the bank.'
          : !connected ? 'Search is available. Reconnect to open an answer for review.'
          : `${matches.length} of ${bank.length} questions · Available without internet`}
      </div>
      <div className="op-bank-results">
        {matches.map((entry) => (
          <button key={entry.id} disabled={!connected} onClick={() => send({ type: 'bank', id: entry.id })}>{entry.question}</button>
        ))}
      </div>
    </details>
  );
}

/** Board questions, operator-only conversation and slides awaiting stage approval. */
export function LivePanel({ state, ai, connected, bank, answers, datasets, send, spine, thumb }: Props) {
  const [typed, setTyped] = useState('');
  const [followupId, setFollowupId] = useState<string>();
  const composer = useRef<HTMLInputElement>(null);
  const asking = state?.mode === 'question';
  const busy = ai?.busy;
  const connectedToState = connected && !!state;
  const drafts = state?.drafts ?? [];
  const exchanges = new Map(answers.map((answer) => [threadId(answer), answer]));
  for (const draft of drafts) if (draft.kind === 'answer') exchanges.set(threadId(draft), draft);
  const followup = followupId ? exchanges.get(followupId) : undefined;
  const pendingIds = new Set(drafts.map((draft) => draft.id));
  const past = answers.filter((answer) => !pendingIds.has(answer.id)).reverse();
  const covered = Boolean(state?.live && (state.live.answer || /^(gen|qa)-/.test(state.live.id)));
  // As the operator types, our own slides that fit: one click shows that slide, fully built. Enter on a clear
  // request ("show the DCF again", "slide 20") jumps there too, with no AI.
  const jump = typed.trim() && !followupId ? findSlide(typed, spine) : null;
  const jumpTo = jump ? [jump.index, ...jump.alternatives] : [];

  function selectFollowup(answer: Draft) {
    setFollowupId(threadId(answer));
    composer.current?.focus();
  }

  return (
    <section className={`op-live ${asking ? 'asking' : ''}`} aria-labelledby="op-live-title">
      <h3 id="op-live-title" className="op-live-title">Live Q&amp;A</h3>
      {state && (
        <div className="op-mic">
          {asking ? (
            <>
              <button className="primary" disabled={!connected} onClick={() => send({ type: 'question', action: 'answer' })}>
                Answer it (Q)
              </button>
              <button disabled={!connected} onClick={() => send({ type: 'question', action: 'cancel' })}>Cancel capture</button>
            </>
          ) : (
            <button className="primary" disabled={!connected} onClick={() => send({ type: 'question', action: 'start' })}>
              Board question (Q)
            </button>
          )}
          {covered && <button disabled={!connected} onClick={() => send({ type: 'resume' })}>Back to script (R)</button>}
          {ai && (
            <span className={`pill ${!ai.hasKey || ai.spent >= ai.cap * 0.9 ? 'bad' : 'ok'}`}>
              {ai.hasKey ? `AI $${ai.spent.toFixed(2)} of $${ai.cap.toFixed(2)}` : bank.length ? 'Live AI unavailable · Prepared answers ready' : 'Live AI unavailable'}
            </span>
          )}
        </div>
      )}
      {asking && <div className="op-heard">{`${state.question} ${state.questionTail}`.trim() || 'Listening to the question…'}</div>}
      {busy && (
        <div className="op-meta" role="status">
          {busy === 'research' ? 'Searching approved sources…' : busy === 'answer' ? 'Checking local evidence…' : busy === 'visual' ? 'Building an answer visual…' : 'Building an off-script reaction…'}
          {ai.activeQuestion && <p className="op-answer-question">{ai.activeQuestion}</p>}
        </div>
      )}
      {ai?.stuck && (
        <div className={`op-stuck ${ai.stuck.kind}`} role="alert">
          <div className="op-stuck-head">
            <strong>{ai.stuck.kind === 'unclear' ? '⚠ Couldn’t answer: the question wasn’t clear' : ai.stuck.kind === 'no-data' ? '⚠ Couldn’t answer from our data' : '⚠ Couldn’t answer: the AI failed'}</strong>
            <button type="button" onClick={() => send({ type: 'dismissStuck' })}>Dismiss</button>
          </div>
          <p className="op-stuck-heard">Heard: “{ai.stuck.question}”</p>
          <p>{ai.stuck.reason}</p>
          <p className="op-stuck-say">
            {ai.stuck.kind === 'unclear'
              ? 'Say: “Sorry, could you repeat the question?” Then hold Q&A again, or type it below.'
              : 'Say: “Good question. We don’t want to guess; we’ll come back to you with the exact figure.” Or pick a prepared answer below.'}
          </p>
          {ai.stuck.kind === 'unclear' && (
            <button type="button" className="primary" onClick={() => { setTyped(ai.stuck!.question); composer.current?.focus(); }}>Edit what was heard and re-ask</button>
          )}
        </div>
      )}
      {ai?.note && <div className="op-error" role="status">{ai.note}</div>}
      {ai?.bankError && <div className="op-error">Prepared answers unavailable · {ai.bankError}</div>}

      {drafts.map((draft, index) => (
        <article key={draft.id} className="op-draft">
          <div className="label">Awaiting approval · {draft.kind === 'answer' ? answerStatus(draft) : 'Off-script reaction'}</div>
          <p className="op-answer-question">{draft.heard}</p>
          {draft.goto !== undefined ? (
            <div className="op-slide-card">
              {thumb(draft.slide.id) && <img src={thumb(draft.slide.id)!} alt="" />}
              <div className="live-title">Slide {draft.goto + 1}: {resolveText(draft.slide.title, datasets)}</div>
            </div>
          ) : <AnswerBody draft={draft} ai={ai} datasets={datasets} />}
          <div className="op-mic op-answer-actions">
            <button className="primary" disabled={!connected} onClick={() => send({ type: 'draft', action: 'show', id: draft.id })}>
              {draft.goto !== undefined ? 'Show this slide' : 'Approve and show'}{index === 0 ? ' (A)' : ''}
            </button>
            <button disabled={!connected} onClick={() => send({ type: 'draft', action: 'reject', id: draft.id })}>Reject{index === 0 ? ' (X)' : ''}</button>
            {draft.kind === 'answer' && draft.goto === undefined && <button disabled={!connected || asking} onClick={() => selectFollowup(draft)}>Ask a follow-up</button>}
          </div>
        </article>
      ))}

      <form
        className="op-sim op-chat"
        onSubmit={(event) => {
          event.preventDefault();
          const question = typed.trim();
          if (!connectedToState || asking || !question || (followupId && !followup)) return;
          send({ type: 'ask', text: question, followup: followupId });
          setTyped('');
          setFollowupId(undefined);
        }}
      >
        <label htmlFor="op-question" className="label">{followupId ? 'Follow-up question' : 'Type a board question'}</label>
        {followupId && (
          <div className="op-followup">
            <span>{followup ? `Replying to “${followup.heard}”` : 'The previous answer is no longer available'}</span>
            <button type="button" onClick={() => { setFollowupId(undefined); composer.current?.focus(); }}>Start a new question</button>
          </div>
        )}
        <div className="op-chat-input">
          <input ref={composer} id="op-question" value={typed} maxLength={1500} onChange={(event) => setTyped(event.target.value)} />
          <button type="submit" disabled={!connectedToState || asking || !typed.trim() || Boolean(followupId && !followup)}>{jump?.explicit ? 'Show slide' : 'Ask'}</button>
        </div>
        {jumpTo.length > 0 && (
          <div className="op-jump" role="group" aria-label="Show one of our slides">
            <span className="op-meta">{jump!.explicit ? 'Enter shows slide' : 'Or show our slide'}:</span>
            {jumpTo.map((i) => (
              <button
                key={spine[i].id}
                type="button"
                className={i === jump!.index ? 'primary' : undefined}
                disabled={!connectedToState}
                onClick={() => { send({ type: 'goto', index: i, full: true }); setTyped(''); }}
              >
                {thumb(spine[i].id) && <img src={thumb(spine[i].id)!} alt="" />}
                <span>{i + 1}. {resolveText(spine[i].title, datasets)}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {past.length > 0 && (
        <details className="op-chat-history">
          <summary>Earlier exchanges ({past.length})</summary>
          {past.map((answer) => (
            <article key={answer.id} className="op-answer-history">
              <div className="label">{answerStatus(answer)}</div>
              <p className="op-answer-question">{answer.heard}</p>
              <AnswerBody draft={answer} ai={ai} datasets={datasets} />
              <button disabled={!connected || asking} onClick={() => selectFollowup(answer)}>Ask a follow-up</button>
            </article>
          ))}
        </details>
      )}

      <PreparedBank bank={bank} connected={connectedToState} send={send} />

      {state && (
        <details className="op-live-settings">
          <summary>Speech and stage settings</summary>
          <div className="op-mic">
            <label className="pill toggle">
              Follow by
              <select disabled={!connected} value={state.follow} onChange={(event) => send({ type: 'follow', mode: event.target.value as 'script' | 'live' })}>
                <option value="script">cue words</option>
                <option value="live">meaning (AI)</option>
              </select>
            </label>
            <label className="pill toggle">
              <input type="checkbox" disabled={!connected} checked={state.riff} onChange={(event) => send({ type: 'setting', key: 'riff', on: event.target.checked })} /> React off script
            </label>
            <label className="pill toggle">
              <input type="checkbox" disabled={!connected} checked={state.motion !== false} onChange={(event) => send({ type: 'setting', key: 'motion', on: event.target.checked })} /> Motion (M)
            </label>
          </div>
          {state.follow === 'live' && ai && (
            <div className="op-meta">
              Following meaning{ai.follow.ms ? ` · ${ai.follow.ms} ms` : ''} · {ai.follow.text || 'Waiting for speech'}
            </div>
          )}
          {state.follow === 'live' && ai?.follow.error && <div className="op-error">{ai.follow.error}</div>}
        </details>
      )}
    </section>
  );
}
