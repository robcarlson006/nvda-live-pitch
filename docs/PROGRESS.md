# Progress log

Pitch: **Wednesday 25 Nov 2026**, 8–9 min. Rob (why) → Panshul (financials) → Mi'kael (ESG) → Rob (close).

The live Q&A and operator lane passed Node 24, browser and provider checks on 24 November. Stage mounting, the combined fallback export and venue rehearsal are tracked in the [live lane handoff](handoff/LIVE-LANE.md).

## Projector DCF (24 Nov)

- Added the animated five-year DCF worksheet between the free-cash-flow forecast and the valuation waterfall. The worksheet uses the same base-case model as the bridge and three-rate comparison. The static fallback includes the worksheet.

## Combined rehearsal build (24 Nov)

- Combined the live lane at `e1b6bee` and the deck lane at `f9263bc` on `codex/pitch-integration`. The stage uses the shared answer visual, and the operator opens both fallback PDFs.
- Node 24.14.1 typecheck, all 98 tests and production build passed. A 1920×1080 browser run without provider keys checked approval, the answer diagram, the three-rate DCF table, both PDF links, whole-page backup navigation and return to live. The rebuilt fallback has 37 spine pages and 35 prepared answers.
- Venue checks remain. Run the physical lavalier, projector and clicker rehearsal, confirm the dated reference-price input, and place the licensed clip on the presenting laptop if it is available. Follow [the rehearsal guide](REHEARSAL.md).

## How to run
**On the day:** `./start.sh` in the repo folder (checks keys, builds, opens both screens in Chrome). Works without npm or git access once installed.

```bash
cd app && npm install && npm run dev
```
- Stage (projector): http://localhost:5173/stage. Press `f` for fullscreen.
- Operator (laptop screen): http://localhost:5173/operator
- Rehearse by speaking: open the operator page in **Chrome**, press **Start mic**, allow the microphone, then **Start rehearsal run**. Uses Deepgram (key in `app/.env`), with Chrome's speech-to-text as the backup. Both need internet.
- Checks: `npm test` and `npm run typecheck`
- For the pitch itself: `npm run build && npm start` (no dev tooling running).

## Done
- **Claude Code lane, `claude/pitch-deck`** (24 Nov, late evening): DCF summary table on stage (`display: table`), reconciliation and round-one bridge (`docs/financials/RECONCILE.md`), animated space-race timeline, stress slide wording and label fix, bank answers corrected against primary sources, UK evidence matrix and board drill, answer diagrams on stage and in the backup, backup rebuilt to 37 pages plus `qa-bank.pdf`. Details and Codex integration steps: `docs/handoff/CLAUDE-CODE-LANE.md`. Price unchanged at $152.85 (unverified; confirm on pitch morning).
- **M1: stage + operator skeleton** (20 Nov)
  - Single Node process: Vite in dev, static files in prod, WebSocket at `/ws`.
  - The backend holds show state (`app/state.json`, written atomically), so a refresh or restart keeps the current slide.
  - Every pushed slide is validated against the slide format in `app/shared/schema.ts`. Its chart must name an existing dataset and series.
  - The stage builds title → bullets → chart, with the source line under every chart. Clients auto-reconnect.
  - The operator panel has connection status, a count of screens connected, push test slides, clear the stage, and a history of slides built this session.
  - `data/clean/` has two real datasets typed from the Bloomberg exports: quarterly revenue vs consensus, and annual revenue FY22–26. M2 will regenerate these with scripts.

- **Stage redesign** (20 Nov): so it doesn't look like an AI template.
  - **The screen is a GPU die.** A full-screen field of tiny cores (canvas) runs a left-to-right compute pass on every build. Headline figures and the standby "NVIDIA" are drawn *by the cores*, which light up in parallel.
  - **Colour:** pure black, because a projector shows black as no light. Silicon-grey cores, with NVIDIA green only where cores are computing.
  - **Type:** one family, Archivo (bundled locally, so it works offline), used across its width axis: expanded for claims, normal width for detail. No eyebrow labels, bullet dashes or cards.
  - **Four slide layouts:**
    - `statement`: one huge line, appearing word by word
    - `number`: a figure looked up from data and rendered by the cores
    - `chart`: the chart fills the slide
    - `split`: text beside a chart

    Bar charts are stacks of cores; line charts are labelled directly at the line ends instead of with a legend.
  - Text reveals in steps, like a pass over the cores, rather than soft fades.

- **M2: data pipeline + valuation model** (20 Nov)
  - `npm run data` turns every raw PDF into clean datasets, then runs the valuation model. The parser is `app/scripts/fa-parse.ts`; it uses `pdftotext` from poppler, which is installed via Homebrew.
  - **23 datasets** in `data/clean/`, each with its source and Bloomberg export date:
    - **Revenue:** 27-year revenue, consensus forecast to FY28, quarterly revenue/EPS vs consensus, Data Center by quarter, and revenue by market.
    - **Profitability and valuation history:** margins, free cash flow, and P/E history.
    - **ESG:** emissions (Scope 1/2/3), energy use and renewable share.
    - **Peers (NVIDIA, AMD, Intel, Broadcom, TSMC):** P/E, EV/EBITDA, EPS growth, PEG, operating margin, and emissions intensity.
  - **Model** (`app/scripts/model.ts`; choices in `data/model/assumptions.json`; full workings in `data/model/valuation.csv` for Excel):
    - 5-year free-cash-flow DCF (FY28–FY32), base/bull/bear scenarios.
    - Sensitivity table: discount rate 10–19.3% × terminal growth 2–4%.
    - Reverse DCF.
    - Peer forward-P/E cross-check.
  - **Results at $135.46, WACC 12%, terminal growth 3%:**

    | Case | Value per share |
    |---|---|
    | Base | $323.72 |
    | Bull | $359.22 |
    | Bear | $54.52 |
    | Peer P/E check | $297.49 |

    The price implies 13.1% a year revenue growth FY28–FY32, vs 35.6% in the consensus-based base case. Even at Bloomberg's 19.3% WACC, the base case is $167.50.
  - Tests: 8, including spot checks against values read from the PDFs, a DCF closed-form check and a reverse-DCF round trip.

- **Headline WACC now 10.55% (team choice, later in the evening of 24 Nov; first set to Google Finance's 14.45%), realistic bear, finance section rebuilt on the Q3 call** (24 Nov): `assumptions.json` has WACC 10.55% (US semiconductor average; Google Finance 14.45%, beta 2.21, and Bloomberg 19.3% shown beside it), price $165.05, bear = share loss and one soft year ($101.56), stress = old AI pause ($64.41), base $391.38 (above every analyst target; the `analysts` slide says so). New data: `research_market` (Google Finance price, beta, analyst ratings and targets), `research_q3_call` (earnings-call figures, unverified), `nvda_analyst_ratings`, `nvda_revenue_guidance`, `model_vs_analysts`; NVIDIA's forward P/E on `peers_pe` is re-priced in `model.ts`. Spine: reworked `last-quarter`, `beats`, `segments`, `peers`, `valuation`, `recommendation`; new `guidance`, `returns`, `analysts`. Q&A: reworked `discount-rate`, `bubble`, `circular`, `competition`, `china-export`, `governance`; new `margins`, `buybacks`, `analyst-targets`. Risks from the call are Q&A only (see `docs/qa-bank/QA_PREP.md` Part 5). Insider selling deliberately not used. **Unverified:** the call and Google Finance figures are from a pasted transcript/page; the page's WACC inputs sum to ~14.9%, not 14.45%; the spreadsheet (`xlsx`) is not rebuilt.
- **Base WACC switched to Bloomberg's 19.3%** (20 Nov): sourced and conservative (superseded 24 Nov, see above).
  - Base case is now $167.50 (+24%), bull $185.74, bear $31.40. The sensitivity table still shows 10–16%.
  - At 19.3% the reverse DCF gives 32.1% a year priced in, vs 35.6% from consensus, so "the market prices in far less growth" only works at lower discount rates.
- **M5: scripted spine** (20 Nov)
  - The whole pitch is in `docs/script/spine.yaml`: 14 draft slides, Rob → Mi'kael → Panshul.
    - Each slide has cue phrases, a `say` script for the operator, and optional cues on individual bullets/charts so they land as they're spoken.
    - The server validates it against the data and reloads it on save. A broken edit shows an error on the operator panel and keeps the last good version.
  - **Cue matcher** (`server/cues.ts`):
    - Fires when ~75%+ of a cue's meaningful words are heard, tolerating one-letter speech-to-text slips on longer words.
    - Listens only for the next element and the next two slides.
    - The buffer clears after each cue. An interim result can fire, and its final copy is then ignored.
  - **Operator panel:** current slide, speaker script, what it's waiting for, Next/Back/Standby, a "Follow speech" toggle, and a box to type speech for testing cues before the mic exists. Click any script row to jump to it.
  - Keys work on both screens: → / Space / PageDown next, ← / PageUp back. A USB clicker works without any setup.
  - Tests: 11, covering element stepping, forward-only cues, typo tolerance and the interim/final de-duplication.

- **Rob's script in the live deck, for rehearsal** (21 Nov)
  - Running order is now Rob → Panshul (financials) → Mi'kael (ESG) → Rob (close). Only the speaker names on the financial and ESG slides changed.
  - Rob's old slides are replaced by one slide per beat of `docs/script/rob-why-script.md` (beats 1–21, then 22–23 as the close). `say` is the script verbatim.
    - Cues come from each beat's first sentence, plus speech-to-text variants.
    - Bullets have their own cues so they land as they are said.
  - **✂ beats** (2, 7, 14, 16, 18) are `optional: true`. Untick them on the operator panel and Next, Back and the mic all skip them.
  - **Numbers:**
    - Figures in slide text are written `{{dataset | series | x}}` and looked up. The server refuses any other digits, apart from years, dates, FY/Q labels, Scope 1/2/3 and product names.
    - New Bloomberg dataset `peers_datacenter_revenue`: AMD's Data Center segment, parsed from the AMD FA export (FY25 $16.6bn vs NVIDIA FY26 $193.7bn).
    - Research figures are in `data/clean/research_*.json` (`curated: true`, each with its publisher), made by `app/scripts/research-data.ts`.
    - The [VERIFY] figures are in `research_facts_unverified` (`verified: false`). The operator panel tags those slides with an amber "unverified" tag; the stage never shows it.
  - **Stage effects:**
    - `cpu-gpu` (beat 4): four big cores light one after another, then a block of thousands at once.
    - `merge72` (beat 11): 72 clusters merge into one block.
    - Both are drawn by the core array and timed to bullet cues. If an effect throws, it switches itself off.
  - **Mic:** Chrome Web Speech API on the operator panel. Start/stop button, UK/US accent switch, live transcript (grey = still being recognised). It sends over the existing `transcript` message; no new paid service.
  - **Cue matcher:**
    - Words after a cue now carry on, so a bullet said in the same breath as its slide still lands.
    - Interim results no longer cost a disk write each.
    - If `spine.yaml` changes mid-show, the live slide is found again by id.
  - **Rehearsal timer and log:**
    - The operator panel shows time on this slide, Rob's opening against a 4:00 target, and the whole run.
    - **Stop & save run** writes `rehearsal/<timestamp>.json`: time per slide, plus which cue moved it or whether it was Next/Back/a click.
  - **Tests (25 in all):**
    - No cue overlaps a cue of the next two slides.
    - Reading any slide's script never fires the next two slides.
    - Reading Rob's whole script aloud, sentence by sentence and word by word, builds every slide and bullet in order, with and without the ✂ beats.
  - Changed a team slide: `governance` no longer has the cue "the ceo". Panshul's `peers` script says "the CEO resigned", which would have jumped straight to the ESG section.

- **M4: Deepgram microphone** (22 Nov)
  - Operator browser captures 16 kHz audio (`src/deepgramMic.ts`, `public/pcm-worklet.js`) → our server's `/audio` socket → Deepgram nova-3 (`server/deepgram.ts`) → the same `transcript` message as before. The key stays on the server and is read at each mic start.
  - Key terms (CUDA, ROCm, Mellanox, names, finance and ESG words) are sent to Deepgram. Number formatting is off on purpose: it rewrites words between interim and final text.
  - **If it breaks:** audio is held for up to 5 s and the connection retried, including a connection that dies silently. After about 6 s, or at once on a bad key / no credit / no key, the mic switches itself to Chrome and says so. It does not switch back by itself: pick Deepgram in the Engine list.
  - A half-heard sentence is kept when the stream breaks (it could previously block later cues).
  - `/audio` only accepts this laptop and our own page. Operator panel: engine choice, level meter, name of the microphone in use.
  - **Cue matcher fix:** a cue's words must now be heard close together. Deepgram writes numbers as words, and "two thousand … six" scattered through beat 2 was firing beat 4.
  - 37 tests: the relay against a fake Deepgram, and the whole script read with numbers as words.

- **M6: live Q&A and off-script slides** (22 Nov)
  - **Board question (Q):** speech is collected as the question and fires no cues. Q again builds the answer. A prepared answer (`docs/qa-bank/answers.yaml`, 10, mostly ESG) is used if it matches; otherwise Claude Sonnet 5.5 (`ANTHROPIC_MODEL` to change).
  - **Off script:** noticed locally and free (`offScript` in `state.ts`), then Claude decides whether a slide helps. At most one every 25 s.
  - **Approval:** slides queue for A (show) / X (reject), unless "Show without approval" is ticked. R returns to the script at the same place.
  - **No invented numbers:** Claude names data; the app looks it up. Digits or number words in its text are rejected, retried once, then that bullet is dropped. Unverified datasets are not offered. It can still phrase a claim badly: the operator reads before showing.
  - **Spending:** `app/ai-spend.json` keeps a running total across restarts; calls stop at $4 (`AI_SPEND_CAP`). It counts only this app's calls.
  - Both sockets accept only this laptop and our own page, so there is no second-device operator for now.

- **Web research when our data has no answer** (22 Nov, at Rob's request; `server/research.ts`)
  - Claude says whether the slide answers the question. If not, the honest "not in our data" slide is queued straight away and the web is searched; the researched slide replaces it (about 8–10 s in all, about 5 cents). **Search the web** on any answer does it by hand.
  - **This is the one exception to "every figure comes from data/clean/".** In its place: each fact must cite a source, and every figure with its unit must appear in the cited excerpt, or close together on the cited page, or the fact is dropped. The title may only name the subject. Private lives and unproven allegations about people are blocked in code.
  - The stage says "Live web research, <date>, not our own data" and names the sites. The operator sees the links.
  - It **always** waits for approval, even with "Show without approval" on.
  - The check proves a figure is in the source, not that the source is right or that the sentence is fair: read it before pressing A.

- **Live follow: the deck follows what we mean, not just cue words** (23 Nov; `server/director.ts`, wired in `server/index.ts`)
  - **Switch:** operator panel → "Follow by" → *meaning (AI)*. Default is still *cue words*. Needs "Follow speech" on and the mic running.
  - Every few words Claude Haiku 5.5 is told where the talk is: same slide, further down its points, another slide, or a tangent. It only picks among our own slides and points; it writes nothing that reaches the stage, so no number can be invented.
  - **Cue words keep working beside it.** If the AI is slow, wrong, over budget or the Wi-Fi drops, the panel shows "Not following (AI unreachable)" and cues, Next and the clicker carry on as before.
  - Big moves need care: the next two slides move at once; anything further, or a tangent, needs two verdicts in a row. A verdict that arrives after the operator pressed Next, or a cue fired, is thrown away. Pressing Next/Back, switching mode or starting a question forgets the speech heard so far.
  - A tangent uses the same path as "react off script": a slide built from our data, queued for A/X unless "Show without approval" is ticked. (`approveTangents` in the state is not used yet.)
  - **Cost:** about 2 cents for 170 calls on the Haiku price table; counts against the same $4 cap.
  - **Measured** (`npm run`-less: `cd app && npx tsx scripts/follow-eval.ts --set dev|holdout --variant nocue|verbatim`; `--dry` estimates the cost; replies are cached in `app/eval-cache/`). It reads each slide's `say` text aloud with the slide's own cue words removed, so only meaning can move the deck, and applies verdicts as the server does:
    - dev (first 16 slides): 14/16 on strict scoring, **16/16** when a slide is judged 4 words before its end (the tolerance was chosen after seeing the first run); median 5 words late; no wrong moves.
    - **holdout (last 15 slides, run once, not tuned on): 13/15 = 87%, below the 90% target.** Median 4 words late; 1 early move to the next slide. Missed: `handoff` and `last-quarter` (short slides with little to hear).
    - These are read-aloud transcripts: no mic errors, no ums, no real paraphrasing. **A live rehearsal is still needed** before trusting it on the day.
  - The earlier numbers in the old loop queue (89%, 23 words late) have no harness or log behind them; ignore them.
  - 12 tests in `server/director.test.ts` (fake model): moves, jump rules, never un-building, unreachable AI, spending cap, garbled replies.
  - Also fixed: `tsc` was failing (`ServerMsg` required `mic`/`pending` that nothing sends; now optional).

- **Nine-minute script, chart zooms, fuller slides** (24 Nov, evening; draft 7, `docs/script/pitch-script-v7.md`)
  - **Script cut from ~2,200 to 1,205 words.** Read aloud at 150 words a minute with a short pause between slides it runs 9:05 (Rob 5:18, Panshul 2:08, Mi'kael 1:39). Removed `different` (Cisco) and `security` (its "zero humans" figure was unverified); national security is one line on `superpowers`. The bubble slide now says the fibre boom was "about the same" as the highways (fixes the 1.4 vs 1.1 risk below).
  - **Emissions slide in plain English:** "48 kg" against "109 tonnes" for every $1m of sales (unit `tonnes CO2`), no bold labels, and a line saying TSMC makes NVIDIA's chips, so the factory emissions are in TSMC's number.
  - **Zoom steps:** an item `{ zoom: <x value>, cue }` in a slide's `bullets` zooms the chart onto that bar or point as the cue is said (`{ zoom: all }` zooms out); `chartFirst: true` builds the chart with the title. Used on bubble, beats, guidance, peers, valuation and emissions. The chart is drawn at a higher resolution so a zoom stays sharp. Wrong zooms (unknown x value, before the chart) are refused when the spine loads.
  - **Stage:** bigger text everywhere (points about 25% larger, charts taller, axis labels larger and wrapping), a slow push-in on every slide, and earlier points fade back when a new one lands, so the eye follows the speaker. Statements with three or four points use a smaller title so everything fits at 16:9.
  - **Deepgram run-through:** `cd app && npx tsx scripts/deepgram-run.ts` reads the whole script with the Mac's British voice, streams it to Deepgram with the app's settings and feeds the transcript to the cue matcher. Last run: 28/28 slides went live in order and fully built by speech alone, each 1.6–4.4 s into its lines. About 5 cents of Deepgram credit per run. A synthetic voice is cleaner than a real room, so still rehearse with the real mic.
  - 70 tests (new: zoom steps and the plain-English emissions units).

- **A deeper ESG section** (24 Nov, late; draft 8, `docs/script/pitch-script-v8.md` / `.pdf`)
  - **Governance + WSJ video:** the governance slide plays the Wall Street Journal clip of staff welcoming Jensen Huang back, muted and looping, credited on screen (`video:` in spine.yaml). The file is `app/public/media/jensen-reinstated.mp4`, **kept out of git** (the repo is public; it is WSJ's footage). On a laptop without it the slide simply shows no video. Copy it across before the pitch if presenting from another machine.
  - **New `open-ai` slide (competition):** NVIDIA funds open-model companies that compete with the AI giants: Hugging Face (agreed 3 Sep 2026, pending approval: never say "bought"), Mistral, Black Forest Labs, AI21 Labs, Fireworks AI, Together AI, Replicate. The circular-money risk is said out loud. Source: `docs/research/nvidia-open-ai-ecosystem-report.md`. We say "keeps the giants' prices in check", not "forces them to open-source their models", because the report supports the first, not the second.
  - **New `people` slide (social):** staff turnover 3.7% (Bloomberg FY26), Glassdoor Best Places to Work 2026 #3 (US), Fortune 100 Best Companies to Work For top 6 every year 2022–2026, TIME World's Best Companies in Sustainable Growth 2026 #6. Each checked on the publisher's page (`data/clean/research_people.json`, per-figure sources). Says the weak spot: less social data published.
  - **New prepared answer `social-score`:** Bloomberg's Social pillar fell 6.29 → 3.63 (FY22–FY25) as its social disclosure score fell 52 → 5, while E rose to 7.48 and G to 7.10 (`data/clean/nvda_esg_scores.json`, from the annual FA export's ESG pages).
  - **Cut:** the `superpowers` slide (export controls stay in the Q&A bank). Several lines tightened. Read aloud it runs 9:11 (Rob 4:50, Panshul 2:01, Mi'kael 2:20), ~9:04 with the optional slide off; Deepgram run-through: 29/29 slides built in order by speech alone.
  - **Not yet in the pitch, from round 1 (worth Q&A prep at least):** top-5 hyperscaler capex $0.8tn → $1.3tn (2027); 3 customers = 44% of revenue; ACIE (AI clouds, sovereigns, enterprise) 45% of Data Center, +138%; Sustainalytics 12.5 low risk (5th of 377 semis); NVIDIA ≈ 5.5% of FTSE Developed (holding none is an active bet); dated catalysts. Expect "why did the target move from $232 to $391?" (WACC 11.1% → 10.55%, Q3 beat).
  - **From Bloomberg's annual ESG pages, to know:** board 13 → 10 in FY26, independent directors 12 → 9 (still 90%), women on the board 5 → 3; auditor in place 22 years.

## Data received
- NVDA FA, annual FY1998–FY2026 and quarterly FY24 Q3–FY27 Q3, both including ESG.
- Peer FA: AMD, INTC, AVGO, TSMC (TSMC in both TWD and USD).
- NVDA WACC and DES snapshots, 20 Nov 2026.
- Still missing: HP (price history), ANR (analyst targets), SPLC (customers/suppliers), RV. Possibly next week via Excel.

## Next
- **Rehearse in Live mode** with the real mic, speaking from memory, and save the runs (`Stop & save run`; live moves show as `live` in `rehearsal/*.json`). Then fix `handoff` / `last-quarter` style short slides (cue words or prompt), not by loosening the cues.
- Rob: rehearse with the mic, then cut to 3–4 minutes (untick ✂ beats first). Fix cues that misfire from the rehearsal logs.
- M7 (fallback deck), M8 (finale).
- Team: rewrite `say` and cues in docs/script/spine.yaml in your own words.
- When the Excel exports arrive (HP, ANR, SPLC): add parsers to `build-data.ts`, then rerun `npm run data`.

## Risks / open
- **Unverified figures on Rob's slides** (amber on the operator panel): CUDA spend ~$0.5bn/yr (beat 5), networking revenue $31bn (beat 11) and ~80% of AI chip spend (beat 13). Supply commitments and "zero humans" were cut in draft 7. Find primary sources or cut them before Wednesday.
- ~~**Beat 15 says "fibre boom at its peak: 1.4 percent",**~~ Fixed 24 Nov (draft 7 says "about the same"). but the chart shows each build-out's *average* (fibre 1.1%), so it is like-for-like with the AI 3.6% average. Say "1.1 percent a year on average", or the board hears one number and sees another.
- **Beat 16:** the research quotes NVIDIA at ~22.7x forward earnings; Bloomberg (on the slide) says 14.1x. Both are "a fraction of 140x", but Panshul's numbers must match.
- **Both speech engines need internet** (audio goes to Deepgram, or to Google if on the Chrome backup). If the venue Wi-Fi fails, use the clicker/Next.
- **The model's WACC (12%) and the scenario choices are team assumptions.** Mi'kael must own them and be able to defend them (see assumptions.json).
- **Scope 3 (supply chain) emissions rose from 6.9 to 10.7 million t CO2e in FY26.** Own operations are on 100% renewable energy, but the ESG board will see Scope 3.
- **Emissions per $ of revenue flatters NVIDIA vs TSMC/Intel,** because NVIDIA doesn't own factories: its manufacturing emissions are in TSMC's numbers and NVIDIA's own Scope 3. Say so if we show it.
- **Bloomberg ESG score methodology changed in FY22,** so don't chart FY15–21 and FY22–24 scores as one line.
- **Jensen Huang resigned (12 Nov 2026).** Colette Kress is interim CEO. The stock is at its 52-week low (~$135, P/E ~16). Governance is the obvious first ESG question, so it needs a Q&A-bank slide and possibly a line in the main pitch. Verify with a major outlet before quoting.
- Bloomberg WACC = 19.3%, far above the typical 9–12%. Show the sensitivity range rather than silently picking one number.
- The share price will move before Wednesday. The model takes the price as a dated input; update it on the morning of the pitch.

## 24 Nov continuation: content, timing, fallback

- Repaired the stepped reveal's right-edge clipping; checked the full DCF bridge and reverse DCF on the stage.
- Added a four-stop space-race timeline, a sourced staff-turnover comparison, and the TSMC exclusion on the main emissions chart. LinkedIn's 12.9% benchmark is from 2022 and is a directional comparison to Bloomberg FY26, not a like-for-like statistic.
- Tightened the `say` script to 1,182 words. See `docs/script/TIMING.md`. All speech-cue tests pass with digits and spoken numbers.
- Built `fallback/spine.pdf` and 36 bundled static slide images. Operator **B** switches to them; Next/Back advance full pages. The switch, navigation and return to live were observed in the browser.
- Updated governance wording to the board investigation and ongoing government inquiries, supported by NVIDIA's 12 and 23 Nov releases and Form 8-K. The pitch-morning price, real microphone, room timing, projector dimensions and motion/performance checks still need a live rehearsal. Full camera/morph authoring in the v2 spec remains open.

## 24 Nov late: app and spreadsheet agree (diluted shares, three WACCs)

- Value per share now divides by **diluted shares, 24.186bn** (Bloomberg FA quarterly, diluted weighted average, Q3 FY27), not the 24.1bn basic count from DES. `app/scripts/model.ts` reads it from the PDF. Base moves $391.38 → **$389.99**.
- Three rates everywhere: **10.55%** Damodaran (headline), **14.45%** Google Finance, **15.4%** Bloomberg Q3 2026. The 19.3% screen is reference only.
- `NVDA_DCF_final.xlsx`: price $152.85, diluted shares, Bloomberg 15.4%, Google Finance 14.45% added (Inputs row 23), switch B7 = 1/2/3, Sensitivity columns at the three rates, Checks re-pointed. Recalculated in LibreOffice: every check passes and it matches the app to the cent.
- New dataset `model_dcf_summary` (forecast period, CAGR, EBIT margin, PV of FCFs, PV of TV, TV % of EV, EV, net debt, equity, diluted shares, implied price, price, upside) for the new DCF slides. New test checks it adds up.
- The three-rates `say` line now uses lookups instead of typed numbers.
- Next: the DCF slides in `docs/handoff/DCF-SLIDES-PLAN.md`.

## 24 Nov late night: every DCF output on stage (branch `rob/dcf-slides`)

- New `dcf-drivers` (forecast period, revenue CAGR, EBIT vs FCF margin) and `dcf-summary` (the DCF on one page) slides, each with an animated scene that reads figures from `data/clean`.
- `dcf-bridge` now says the terminal value's share of EV (76%) and "no net debt".
- `already-doing` moved after `space-race` (Mi'kael), four industries.
- Backup deck rebuilt (40 pages); the summary page has the full number grid. Keyterms add John Deere, Ecolab, EBIT, CAGR.
- Speech is about 8.9 min + ~20 s transitions. See TIMING.md for cuts. Notes for Panshul in `docs/script/GRAPHICS-NOTES.md`.
- Checked on `/stage` at 1600×900: drivers, bridge, summary, already-doing. Not yet checked on the projector.

## 25 Nov, 01:00–02:30: final fixes, teleprompter, research vault

- **Close:** after "Our recommendation is to buy." lands, everything else falls away and the line zooms to the centre; the show ends there (`Stage.tsx`, `close.css`).
- **Recommendation graphic:** the red outline now says "even if NVDA went to zero: at most these 3%" and prints the bear-case and AI-ended costs to the portfolio (1.01% / 1.74%, `model_downside`). The old "the most we can lose" was true but read as the bear case.
- **P/E slide:** 15.9x (forward: $152.85 ÷ FY27 consensus EPS $9.64) and 16.4x (trailing: ÷ last-12-months EPS $9.31) are both right; the bullet now says why they differ.
- **Beyond the hyperscalers:** Bloomberg's quarterly FA splits Data Center by customer type. Q3 FY27: hyperscalers $60.1bn = 51.9% of revenue (+71% y/y); AI clouds, industrial & enterprise $47.5bn = 41.0% (+195% y/y); 48.1% of revenue came from outside the hyperscalers. New datasets `nvda_dc_customers`, `nvda_dc_customer_mix` (build-data.ts); the slide's streams are drawn to scale. Bloomberg's label does not say "sovereign/government": don't claim that split without NVIDIA's CFO commentary.
- **Q&A "couldn't answer" alert:** if Claude can't tell what was asked it returns `clarify` instead of guessing; the operator gets an amber alert with what was heard, why, a line to say, and "edit and re-ask". Also shown for no-data and AI failures.
- **Operator tabs:** Controls | Teleprompter. The teleprompter follows the voice word by word (skips words and whole sentences, never jumps back on a common word), eye-line, smooth glide, pace gauge, "find your place" boxes after 3 s silence, auto-scroll fallback, full screen. Matching tested in `server/prompter.test.ts`.
- **Chart library** on the operator: every dataset (all DCF steps, reverse DCF, three rates…) one click to the stage; all 51 pass the stage's checks (`server/library.test.ts`).
- **research-vault/** (new, GPT overnight loop, sandboxed to that folder): see its README. Started 01:46; research until 07:46, visuals (gpt-6.2-sol) until 09:46.
- **Script length:** the spine is ~2,360 spoken words (~15½ min), not the 8.9 min in TIMING.md. Proposal: `docs/script/CUT-PROPOSAL.md` (28 slides, ~9½ min). Not applied.
- **Not done:** backup deck (`fallback/spine.pdf` + slide images) not regenerated for tonight's slide changes; prompter not yet tried with the real mic.

## 25 Nov, afternoon: the 9-minute cut (branch `panshul/nine-minute-cut`)

- **Script: 32 slides, 8:58 of speech** (was 40 slides, 15:45), Rob 3:33 · Panshul 3:10 · Mi'kael 2:15. Details in `docs/script/TIMING.md`; readable script `docs/script/pitch-script-v10.md`.
- **How it was decided:** a cut quiz (`app/scripts/cut-quiz/`, candidates in `docs/script/cut-candidates.yaml`, picks in `docs/script/cut-choices.json`). The team kept `revenue-long` and `dcf-worksheet` (so `fcf` went); Claude chose the rest, repeated material first: the DCF method slides that `dcf-summary` already covers, buybacks, the space-race analogy, open-model funding and the two bubble slides.
- **Nothing lost:** every cut slide is a prepared answer. New: `fcf-forecast`, `dcf-drivers`, `dcf-bridge`, `ai-build-out`, `ai-race`, `open-models`, and `huang-key-person` (the "one-man company / no successor" question, as a rebuttal: flat organisation, the quarter beat expectations with Huang out, one share class). Rewritten to argue rather than concede: `bubble` (if it pops, NVIDIA survives), `huang-departure`, `concentration` (nearly half of revenue from outside the hyperscalers, from Bloomberg's split). Water questions now reach `ecolab-water`. Bank: 42 answers.
- **Every DCF item is still on stage**: `dcf-summary` shows implied and current price, upside, WACC, terminal growth, forecast period, CAGR, EBIT margin, PV of FCFs and TV, TV % of EV, EV, net debt, equity value, diluted shares; `dcf-worksheet` has each year's FCF.
- **No unverified figure on stage now:** networking revenue and the AI-chip-spend share are gone from both speech and screen (`catch-up` is now a plain statement slide).
- **Stage:** section card "Part three" now opens on `already-doing`; the DCF tracker has five steps; the first-GPU scene runs 1999 → stop (no Xbox/Forbes). The closing "Our recommendation is to buy." is centred properly (it overflowed its box). The red hand-drawn ring no longer appears on Q&A answer slides (it sometimes landed in the wrong place); the main deck keeps it.
- Backup deck rebuilt: 32 spine pages, 42 Q&A pages. 118 tests pass; typecheck clean. Checked on `/stage` at 1600×900.
- **Not done:** a timed run with the real mic; the cue changes (alexnet, handoff, wall-street, close) are proven only by the read-aloud tests.

