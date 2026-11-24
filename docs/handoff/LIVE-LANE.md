# Live Q&A and operator handoff

The live lane starts at `42fd8e5`. It keeps the existing Anthropic provider and spending ledger. An incoming question checks the prepared bank, then verified local datasets, then approved web sources when the first two paths leave an evidence gap. A follow-up sends the previous question and answer as context and checks evidence again. Selecting a prepared answer works with the laptop offline while the local app is running.

The operator sees citations and available dates, visual status, and the current version of each answer. A chart or diagram can arrive after the text. It creates a new approval ID while retaining the chat thread. Approving text before enrichment cancels the enrichment. The stage keeps the script position underneath the answer. Use **R** or **Back to script** to return.

## Combined branch

1. Compare both lane tips with `42fd8e5` and integrate them on a separate branch. Keep the deck lane's script, prepared answer content, curated data, valuation and stage composition.
2. In `app/src/Stage.tsx`, mount the named `AnswerVisual` export from `app/src/AnswerVisual.tsx` for `slide.diagram` when a chart or stat does not occupy the visual slot. Prefer the named diagram over decorative icons. Keep revealed answer text at full contrast and display the publisher/source line. Mount `useNextVisual(state, spine)` unconditionally in the stage component.
3. Rebuild the static deck and images from the combined branch, including prepared diagrams and tables. Use Node 24 for `npm ci`, `npm run typecheck`, `npm test` and `npm run build`. Verify the stage and fallback PDF on the presenting laptop with networking disabled.
4. Rehearse with the lavalier, projector, operator display and clicker. Check cue dispatch in a saved rehearsal run, follow-ups, a slow or unsupported web answer, the **B** backup switch, and a return to the script from a live answer. The existing WebSockets accept loopback connections. Run stage and operator on the presenting laptop for this handoff.
5. Keep the local provider keys in `app/.env` and the existing spend cap. Keep the keys, state, spend ledger, licensed media and new raw exports out of commits.

## Verification and limits

- Node 24.14.1 passed typecheck, all 95 tests and the production build. Vite reported its existing large-bundle advisory.
- Headless Chrome exercised teleprompter follow, pause and resume, cue timing, prepared search and citations, operator approval, follow-up and an evidence gap with both provider keys removed.
- Live Anthropic calls returned a local Scope 3 answer, a verified local emissions chart and a cited IEA research result. Live Deepgram authenticated and accepted streamed test audio. Diagram generation, cancellation and unavailable-provider paths have mocked regression coverage.
- Anthropic rejects `reuters.com` and `apnews.com` as search filters because its crawler cannot access them. The code registry retains both approved publishers and omits them from the Anthropic request. The citation validator still requires a matching approved search result and a verified passage.
- Research accepts short, directly supported sentences. Sparse excerpts, inaccessible source pages and ambiguous compound questions can result in an evidence gap. Some results expose age since update instead of a publication date. Check whether each source answers the question during approval.
- The physical mic, room timing and projector remain venue checks. Draft history and follow-up context last for the local server session.
