# Parallel pitch work

Work from the common handoff commit, which includes the staged readiness changes on top of `v2-final-pitch` at `bbcb303`. Keep each lane in its own checkout and commit the work locally. Record the final commit SHA, files with an integration dependency, test results and any missing venue checks.

| Lane | Owns | Boundary |
| --- | --- | --- |
| Claude Code | Script, prepared answer bank and evidence, curated datasets, valuation, stage composition, `Chart.tsx` and offline exports | Mount Codex's `AnswerVisual` and `useNextVisual` in `Stage.tsx`. Request any shared schema change from Codex. |
| Codex | Live Q&A, source policy enforcement, generated diagrams, operator UI, speech timing, `app/server/` and `app/shared/` | Implement `AnswerVisual` in its own component and CSS. Leave `Stage.tsx`, the script and the bank to Claude Code. |
| Integration | Codex or Claude Code, after both lane tips are ready | Merge both into an integration branch from the common checkpoint. Rebuild generated assets and run the rehearsal checks against the combined build. |

The current contract is `Slide.answer?: true` and `Slide.diagram?: { kind: 'flow' | 'comparison' | 'map'; nodes: string[] }`. Codex exposes `AnswerVisual({ diagram })` from `app/src/AnswerVisual.tsx`. The stage should render the component when a Q&A slide has a diagram, and keep all revealed answer text at full contrast. A valid chart or stat can take the visual slot. Claude Code can build and test its stage using the existing typed data while that component is in progress. Leave the import and mounting to an integration commit if the component has yet to land.

The current `ChartSpec.display: 'table'` should be rendered by the deck lane. Use the existing DCF data and sources. The deck lane can propose schema/validator changes in its handoff summary. Codex applies those changes in the shared-code lane.

## Start and verify

Use a working Node 24 installation. From `app/`, run `npm ci`, `npm run typecheck`, `npm test` and `npm run build`. The Deepgram suite requires local socket binding. Run the two dev servers on different ports if they need to run simultaneously. Keep keys in the local `app/.env` for the checkout testing live services. Import licensed demo media locally if needed.

Do not run either lane against the presentation checkout. Commit reviewed files by path. Leave `.env`, keys, raw Bloomberg files, dependency folders, runtime state, API spend files and locally licensed video outside commits. Existing tracked raw Bloomberg exports are inputs and should remain byte-for-byte. Compare lane commits against the common checkpoint before merging. Build static exports from the combined branch, then test offline fallback and the live stage.
