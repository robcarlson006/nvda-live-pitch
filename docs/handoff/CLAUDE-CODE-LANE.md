# Claude Code lane: result and integration notes (24 Nov 2026, late evening)

Branch `claude/pitch-deck`, from the common checkpoint `42fd8e5`. Local commit only: not merged, not pushed.

## Done in this lane

- **DCF summary table on stage.** `ChartSpec.display: 'table'` is rendered by `DataTable` in `app/src/Chart.tsx`. The `three-rates` slide shows rate, value per share, enterprise value and % above the reference price, with "Reference share price: $152.85, as of 2026-11-24" beneath it. A zoom step highlights a row. The model's `Upside to today` series (a % stored as USD) is renamed `Above reference price` with unit `%`. See `docs/financials/RECONCILE.md`.
- **Reconciliation and bridge.** Model export v Bloomberg inputs v the (stale) workbook, and the bridge from the round-one $232 target, in `RECONCILE.md`. New dataset `model_target_bridge` (written by `model.ts`, `verified: false`); the `target-revision` answer now shows it as a waterfall.
- **Price.** Not changed: 24 Nov quotes conflicted ($151.05–$165.05), so no named, timestamped source confirmed a new figure.
- **Deck.** Space-race timeline animates on cue (node switches on, rail grows to it, year in green). The stress slide now states stock downside and portfolio loss separately, like the bear case, and its end label no longer clips. Demand slide checked at 16:9 (concentration line kept). Script recounted with the demand slide: about 1,150 spoken words (`TIMING.md`).
- **Evidence.** Bank answers corrected after opening the primary sources: a dead 12 Nov 8-K link replaced; governance bullets now match the 23 Nov press release; Ecolab no longer implies NVIDIA tested "systems" or a water figure; US bills dated with status; UK statements dated with the entities they name; rankings use publisher figures from `research_people`; Porter's buyer force carries the 36% figure. New: `docs/qa-bank/UK-EVIDENCE.md`, `docs/qa-bank/DRILL.md`.
- **Stage contract.** Answer slides (`answer: true`) keep every revealed line at full contrast. A slide with `diagram` and no chart or stat renders `StaticDiagram` (in `Stage.tsx`) after its last bullet. `useNextVisual(state, spine)` is mounted in `Stage`.
- **Offline backup.** Rebuilt: 37 spine pages (the old 36-page set was one page short after `open-ai`, so every later backup page was off by one) plus a new 35-page `qa-bank.pdf`. The builder renders tables, diagrams and the timeline; it builds into a temp folder first; it writes `pages.json`; and it falls back to PyMuPDF when Poppler is missing. A test now fails if the backup and spine drift apart.

## What Codex needs to wire up

1. **Mount `AnswerVisual`** (integration commit, once `app/src/AnswerVisual.tsx` exists). In `app/src/Stage.tsx`, find the `INTEGRATION:` comment and replace `<StaticDiagram diagram={slide.diagram!} />` with `<AnswerVisual diagram={slide.diagram!} />`. Keep the surrounding `Reveal className="answer-diagram"`: it positions the visual on the right (38vw, clear of the text) and times it after the last bullet. `StaticDiagram` can stay as the fallback if `AnswerVisual` throws. The slot only appears when the slide has no chart and no stat, so a chart or stat still takes the visual slot, as `PARALLEL.md` says.
2. **CSS classes** on the slide root that `AnswerVisual` can rely on: `.is-answer` (any approved answer) and `.has-diagram` (statement text narrowed to the left 54%).
3. **Operator link (optional):** `Operator.tsx` links `/fallback/spine.pdf`. Add a second link to `/fallback/qa-bank.pdf`; the file is already served.
4. **No schema change needed.** `display: 'table'`, `answer` and `diagram` are used exactly as in `app/shared/schema.ts` at `42fd8e5`. Suggestion only: `ChartSpec.display: 'table'` could allow `type` to be omitted, since the table ignores it.
5. **`app/server/` untouched** in this lane. The new answers validate with the existing `checkSlide` (no hand-typed digits; `SC26` was rewritten as "the Supercomputing conference" for that reason).

## Still needs a real room or devices

- Timed full run with the lavalier mic and projector (`TIMING.md` estimate only).
- Projector legibility of the DCF table, timeline rail and answer diagrams at the back of the room (checked only in a 1920×1080 browser viewport).
- Pitch-morning share price from a named, timestamped source, then the rebuild routine in `RECONCILE.md` section 5.
- Workbook rebuild on a machine with LibreOffice before anyone shows `NVDA_DCF.xlsx`.
- The licensed WSJ clip (`app/public/media/jensen-reinstated.mp4`) on the presenting laptop.

## Unresolved evidence

- $232 and 11.1% (round one) are team-reported; the round-one model is not in the repo.
- The bear case's 38.8% margin and the stress-case shape are team judgement (documented in `assumptions.json`).
- No UK enforcement search (SFO, ICO, CMA beyond Arm, HMRC) was run; `UK-EVIDENCE.md` lists the gaps.
- Customer concentration (14/11/11%) and the governance timeline were verified against the SEC exhibits. The remaining datasets marked unverified in the operator are unchanged.
