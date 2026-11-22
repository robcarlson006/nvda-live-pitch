# Prompt for Claude Code: load Rob's script into the live deck for rehearsal

Paste everything below the line into Claude Code, opened in the "Nvidia stock pitch" folder.

---

Read these first: `CLAUDE.md`, `docs/PROGRESS.md`, `docs/script/spine.yaml`, `app/shared/schema.ts`, `app/server/cues.ts`, then the two new files:

- `docs/script/rob-why-script.md`: my rough script, 23 beats. Each beat has **Cue** (phrases the mic listens for), **Builds** (what should appear on stage) and the spoken text.
- `docs/research/notebooklm-research.md`: the research behind it. Every figure in the script comes from here or from the Bloomberg data in `data/`.

**Goal:** I want to rehearse my section out loud tonight and watch the deck build itself as I speak. This is a rough script, so prioritise getting it running end to end over polish. Reliability rules in CLAUDE.md still apply.

## 1. Fix the running order
The order is now **Rob (why) → Panshul (financials) → Mi'kael (ESG) → Rob (close)**. In `spine.yaml`, the financial slides currently say `speaker: Mi'kael` and the ESG slides say `speaker: Panshul`. Swap them, and update the line at the top of `docs/PROGRESS.md`. Don't change those slides' content.

## 2. Replace my slides with the script
- Replace Rob's existing slides (`founding`, `cuda`, `alexnet`, `revenue-long`) with one slide per beat 1–21, in order, before the financials. Replace `built-live` and `close` with beats 22–23.
- `say` = the spoken text, verbatim. `cues` = the beat's cue phrases, plus variants the speech-to-text is likely to produce (numbers as words AND digits, "CUDA"/"cooda"/"kuda", "AlexNet"/"Alex net", "TSMC"/"T S M C", "Mellanox"/"Mellon ox", "Denny's"/"Dennys"). Give each slide at least 3 cues.
- Use **Builds** to pick the layout (`statement`, `number`, `chart`, `split`) and the title and bullets. Where a bullet lands mid-sentence, give it its own element `cue`.
- Keep the ✂ beats in, but give them `optional: true` (or the nearest equivalent the schema allows) so I can skip them from the operator panel. Add the field to the schema if it doesn't exist.

## 3. Numbers: no hand-typed figures (CLAUDE.md principle 1)
- **Bloomberg-backed numbers:** use existing datasets in `data/clean/`. Revenue history uses `nvda_revenue_annual` (beat 5 shows FY05–FY13; beat 7 shows all years). Beat 16 uses NVIDIA's P/E from `peers_pe`. For beat 9 (NVIDIA vs AMD data centre revenue), try to parse AMD's Data Center segment from `data/bloomberg-raw/peer_amd_fa_annual_FY2014-FY2025.pdf` in `build-data.ts`. If the segment isn't in that export, fall back to the research figures below and tell me.
- **Research-backed numbers** (GDP shares, AlexNet error rates, CoWoS shares, developer count, networking revenue, etc.): create small curated datasets in `data/clean/`, e.g. `research_infra_gdp.json`, `research_alexnet.json`, `research_cowos_share.json`, `research_facts.json`. Use the same shape as the existing datasets, with `source` (publisher + date, from the research file) and `asOf`. Add `"curated": true`. Add `"verified": false` for any figure the script marks **[VERIFY]**.
- On the operator panel, show a small amber "unverified" tag on any slide whose data is `verified: false`. Never show it on the stage.
- Years and dates in titles ("1993", "2006") are fine as text. Quantities are not.

## 4. Stage visuals (only if low-risk)
The stage is already a field of GPU cores (`CoreArray.tsx`). Two beats would really land if the cores do the explaining:
- **Beat 4 (CUDA):** first a handful of cores light one after another (a CPU), then thousands light at once (a GPU).
- **Beat 11 (connections):** 72 clusters of cores merge into one block.

Add them as optional slide `effect`s. If either takes more than about an hour or risks stability, skip it, fall back to a `statement` slide, and note it in PROGRESS.md.

## 5. Let me rehearse by speaking
M4 (mic → speech-to-text) isn't built yet. For tonight, add the **Chrome Web Speech API** as the transcript source: free, no key needed, runs in the operator browser and sends results over the existing `transcript` message. Add a start/stop mic button and a live transcript on the operator panel. Set the language to `en-GB` with an `en-US` toggle. **Do not add Deepgram or any paid service without asking me.**

Also add a **rehearsal timer** on the operator panel: elapsed time per slide and total for my section, with a soft target of 4:00 for beats 1–21. Log each run to `rehearsal/<timestamp>.json` (slide id, time spent, which cue fired or whether it was a manual Next).

## 6. Check and report
- Run `npm test` and `npm run typecheck`. Make sure `spine.yaml` validates against the data.
- Add a test that no cue phrase is shared by a slide and either of the next two slides, so the deck can't skip ahead.
- Then stop and give me:
  1. the slide list (id, layout, cues),
  2. every figure marked unverified,
  3. anything in the script you couldn't build and why,
  4. the exact commands and URLs to start a rehearsal.

Update `docs/PROGRESS.md` when done. Don't touch `data/bloomberg-raw/`.
