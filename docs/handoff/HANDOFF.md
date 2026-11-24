# Handoff: v2 final-pitch build (paused 24 Nov 2026, late evening)

Pitch: **Wed 25 Nov 2026, 9:00 hard limit.** The full spec is [`docs/script/CLAUDE_CODE_PROMPT_v2.md`](../script/CLAUDE_CODE_PROMPT_v2.md).
Branch: **`v2-final-pitch`**. Backup of the old deck: git tag **`pre-v2-backup`**.

## Continuation update — 24 Nov 2026

The newer work is on this checkout, after the handoff below. Content sections 1c–1h are implemented: space-race timeline, staff comparison (12.9% LinkedIn 2022, directional), TSMC removed from the emissions peer chart, trims and governance source correction. The script is 1,182 spoken words; see `docs/script/TIMING.md`. Section 1i has a 36-page PDF and an operator **B** static backup. The clipped DCF line is repaired and visually checked. See `docs/REHEARSAL.md` for the current keys.

Still open: a timed rehearsal with the real mic and projector, morning share-price refresh, remaining unverified claims, and the shared camera/morph work in section 2. The older "Next steps" below records the previous pause and is not the current queue.

## How to continue (new Claude account or new computer)
1. `git clone https://github.com/robcarlson006/nvda-live-pitch.git && cd nvda-live-pitch && git checkout v2-final-pitch`
2. Copy over two things git does not carry: **`app/.env`** (Deepgram + Anthropic keys) and **`app/public/media/`** (the WSJ clip).
3. `cd app && npm ci`
4. Open Claude Code in the repo root and say:
   *"Read @docs/handoff/HANDOFF.md and @docs/script/CLAUDE_CODE_PROMPT_v2.md. Continue the build from 'Next steps' below. Finances first, animations after. Stop at each section-4 checkpoint with the evidence it asks for."*

## Done so far
**Section 0 (safety)**
- Tag `pre-v2-backup` = the deck before v2. `./restore-pre-v2.sh` puts it back and rebuilds `app/dist` offline (tested once). The script is committed after the tag, so it is only on this branch.
- `.claude/settings.json` denies Read of `./app/.env` and `./.env`.
- Motion kill-switch: `motion` in server state (survives refresh, syncs stage ↔ operator). Operator checkbox "Motion (m)", key **m**, and `?motion=off` on the stage URL (`?motion=on` clears it). It only sets a `motion`/`no-motion` class on `.stage` so far.

**1a data (price $152.85; rates 10.55 / 14.45 / 15.4).** See the before/after table below. The model was re-run after all the work below with **zero diff in `data/clean`: no headline figure moved.**

| Figure | Before ($165.05) | After ($152.85) |
|---|---|---|
| Base / Bull | $391.38 / $434.36 | same |
| Bear (rivals take share) | $101.56 | same (−33.6% vs price) |
| If AI ended for good | $64.41 | same (−57.9%; costs a 3% position 1.74%) |
| Base at 10.55% / 14.45% | $391.38 / $248.69 | same |
| Base at 15.4% | not computed | **$227.68** |
| Implied growth (reverse DCF) | 13.43%/yr | **11.47%/yr** (base case 35.55%) |
| NVIDIA forward P/E | 17.12x | 15.86x |

**Finance section, steps 1 and 2 (done)**
- Every `say` line and Q&A answer uses the new numbers. Nothing above 15.4% appears anywhere the board sees or hears: 19.3%, 16.42% and Stock Analysis are removed. The trailing P/E is said as "about sixteen and a half times".
- "Stress case" is renamed to **"If AI ended for good"** everywhere. The bear case is always "our bear case, where rivals take share".
- The `discount-rate` answer covers only 10.55 / 14.45 / 15.4 and uses the bridge chart.
- `app/server/ai.ts`: `capRates()` + `MAX_RATE = 15.4`. `usable()` strips any discount rate above 15.4% from the data Claude sees.
- `spine.yaml`: `valuation` is replaced by **dcf-inputs** (layout `inputs`, 4 groups: Bloomberg / Google Finance / Damodaran (NYU) / Our two choices) → **fcf** (layout `chart`, FY22–FY32) → **dcf-bridge** (waterfall at 10.55%) → **three-rates** (`refLine` at the share price) → **reverse-dcf** (ends with `{ zoom: all }`) → **bear-case** → **ai-ended** (muted line, effect `dark`).
- Done early from spec 1f: the "$64 stress case" bullet is cut from `if-it-pops`; the `recommendation` slide uses the three-rate summary plus both downside costs. Every new or trimmed line is marked `# DRAFT say`.
- `schema.ts`: input items may be up to 260 characters raw (the 80-character on-screen limit is unchanged).
- `Chart.tsx`: a stackedBar column holding only one series gets a value label. Truly stacked columns don't, so the segments chart is unaffected.
- Tests: new `app/server/finance.test.ts` (the bridge adds up at each rate; the base case is above the price at all three rates; no rate above 15.4% anywhere; bear and "If AI ended for good" labels never swapped). The old `state.test.ts` check on `valuation` now uses `dcf-bridge`. **78/78 pass, typecheck clean.**
- 1920x1080 screenshots: `rehearsal/screens/01–13`. Taken with a scratchpad script over Chrome DevTools (not in the repo): it drives the server over `/ws` (with an `Origin` header), then captures `/stage` in headless Chrome after a real wait of about 10 s. Headless `--virtual-time-budget` does **not** work for the timed reveals. Some files may come from the last run, which was stopped part-way.
- `.claude/launch.json` runs `npm` through zsh, with `~/.local/node/bin` on PATH (this Mac has no system Node).
- Note: `pdftotext` is missing on this Mac, so `npm run data` fails at `build-data.ts`. Use `npx tsx scripts/research-data.ts && npx tsx scripts/model.ts`.

## Next steps (in this order)
a. **dcf-bridge clipping.** The bullet "÷ 24.1bn shares = $391.38 a share, against $152.85 today" is cut at "agains" in headless captures, but looks fine in the in-app browser. Diagnosis so far: the `wipe` animation in `app/src/styles.css` (`steps(12, end)`, ending at `inset(-10% -2% -10% 0)`) was reported as finished, yet the computed clip-path stayed at the 11th step, `inset(-10% 6.5% -10% 0)`. That crops about 6.5% off the right of **every** revealed line, on every slide. Proposed fix (made, then reverted at the pause; not verified): end the keyframe at `inset(-10% -12% -10% 0)`, so step 11 already shows the whole line and nothing changes visually. Check whether a fresh browser (like the projector laptop) clips too. If unsure, apply the fix, or shorten the line.
b. ~~reverse-dcf: add a final `{ zoom: all }`~~ **Done** (in `spine.yaml`). Re-shoot `09-reverse-dcf` to confirm.
c. Review screenshots 10–13 (bear-case, ai-ended, peers, recommendation) and fix anything clipped.
d. Known limit, for the section 2 camera: zooming to the 14.45% bar on three-rates cuts off the 15.4% label.
e. Then **checkpoint 1** (report to the team): before/after numbers (all unchanged, table above) plus the screenshots.
f. Then spec 1c–1i, section 2 and section 3, all still untouched.
