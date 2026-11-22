# Progress log

Pitch: **Wednesday 25 Nov 2026**, 8–9 min. Rob (why) → Panshul (financials) → Mi'kael (ESG) → Rob (close).

## How to run
```bash
cd app && npm install && npm run dev
```
- Stage (projector): http://localhost:5173/stage. Press `f` for fullscreen.
- Operator (laptop screen): http://localhost:5173/operator
- Rehearse by speaking: open the operator page in **Chrome**, press **Start mic**, allow the microphone, then **Start rehearsal run**. Uses Deepgram (key in `app/.env`), with Chrome's speech-to-text as the backup. Both need internet.
- Checks: `npm test` and `npm run typecheck`
- For the pitch itself: `npm run build && npm start` (no dev tooling running).

## Done
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

- **Base WACC switched to Bloomberg's 19.3%** (20 Nov): sourced and conservative.
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

## Data received
- NVDA FA, annual FY1998–FY2026 and quarterly FY24 Q3–FY27 Q3, both including ESG.
- Peer FA: AMD, INTC, AVGO, TSMC (TSMC in both TWD and USD).
- NVDA WACC and DES snapshots, 20 Nov 2026.
- Still missing: HP (price history), ANR (analyst targets), SPLC (customers/suppliers), RV. Possibly next week via Excel.

## Next
- Rob: rehearse with the mic, then cut to 3–4 minutes (untick ✂ beats first). Fix cues that misfire from the rehearsal logs.
- M7 (fallback), M6 (Q&A), M8 (finale).
- Team: rewrite `say` and cues in docs/script/spine.yaml in your own words.
- When the Excel exports arrive (HP, ANR, SPLC): add parsers to `build-data.ts`, then rerun `npm run data`.

## Risks / open
- **Unverified figures on Rob's slides** (amber on the operator panel): CUDA spend ~$0.5bn/yr (beat 5), networking revenue $31bn (beat 11), supply commitments $279bn (beat 12), ~90% of AI training and ~80% of AI chip spend (beat 13), and "zero humans" (beat 19). Find primary sources or cut them before Wednesday.
- **Beat 15 says "fibre boom at its peak: 1.4 percent",** but the chart shows each build-out's *average* (fibre 1.1%), so it is like-for-like with the AI 3.6% average. Say "1.1 percent a year on average", or the board hears one number and sees another.
- **Beat 16:** the research quotes NVIDIA at ~22.7x forward earnings; Bloomberg (on the slide) says 14.1x. Both are "a fraction of 140x", but Panshul's numbers must match.
- **Both speech engines need internet** (audio goes to Deepgram, or to Google if on the Chrome backup). If the venue Wi-Fi fails, use the clicker/Next.
- **The model's WACC (12%) and the scenario choices are team assumptions.** Mi'kael must own them and be able to defend them (see assumptions.json).
- **Scope 3 (supply chain) emissions rose from 6.9 to 10.7 million t CO2e in FY26.** Own operations are on 100% renewable energy, but the ESG board will see Scope 3.
- **Emissions per $ of revenue flatters NVIDIA vs TSMC/Intel,** because NVIDIA doesn't own factories: its manufacturing emissions are in TSMC's numbers and NVIDIA's own Scope 3. Say so if we show it.
- **Bloomberg ESG score methodology changed in FY22,** so don't chart FY15–21 and FY22–24 scores as one line.
- **Jensen Huang resigned (12 Nov 2026).** Colette Kress is interim CEO. The stock is at its 52-week low (~$135, P/E ~16). Governance is the obvious first ESG question, so it needs a Q&A-bank slide and possibly a line in the main pitch. Verify with a major outlet before quoting.
- Bloomberg WACC = 19.3%, far above the typical 9–12%. Show the sensitivity range rather than silently picking one number.
- The share price will move before Wednesday. The model takes the price as a dated input; update it on the morning of the pitch.
