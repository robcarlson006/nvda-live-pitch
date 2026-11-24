# Project: "Live-Built" NVIDIA Stock Pitch

## What this is
Three University of Stirling students are pitching NVIDIA (NVDA) as a stock to an
investment board that is sceptical of NVIDIA and very ESG-focused. The pitch is part
sales, part show. We are building a **web app that builds the slideshow live while we
present**: it listens to the presenters through a microphone, and slides, charts and
text assemble on screen in sync with what is said, like Ed Sheeran building a song
live with a loop pedal. When a board member asks a question, the app generates an
answer slide (chart + short text) from our data.

The closing line: *"Everything you just watched was built and run by AI. That AI runs
on infrastructure NVIDIA built. If three university students can do this for a stock
pitch, imagine what the world's companies are doing."*

The app itself is the evidence for the investment thesis. It must be impressive AND
reliable, because a crash in front of a sceptical board ends the pitch.

## Core principles (do not violate)
1. **Never let the AI invent numbers.** Every figure and chart must come from the
   datasets in `data/clean/`. The LLM only *chooses* which series/metrics to show and
   writes short commentary. Chart data is looked up by key in code, never typed by
   the model. If the data to answer something is missing, the slide says so honestly.
2. **The main pitch only looks live.** The main narrative is a scripted
   "spine" of slides in `docs/script/`. Each slide is tied to cue phrases. When the
   speech-to-text hears a cue, that slide's elements build on screen in time with
   the speaker. Only Q&A is truly generated on the spot.
3. **A human is always in control.** An operator (one of us) has a control panel on a
   second device: approve/reject a generated slide before it goes live, manual
   next/back, pause listening, and a one-key switch to the backup deck.
4. **Always have a fallback.** If network, mic, speech-to-text or the AI fails, the
   presentation keeps going: manual advance through the pre-built spine, plus
   pre-generated answers for the expected questions in `docs/qa-bank/`.
5. **Low latency matters more than perfection.** Q&A slides should start appearing
   within a few seconds, building element by element (title → chart → text) so the
   wait feels like part of the show.

## Architecture (suggested; push back if something is better)
- `app/` — one project, TypeScript throughout.
  - **Frontend:** Vite + React. Routes:
    - `/stage` — full-screen projector view. Dark, cinematic, NVIDIA-green accent.
      Elements animate in (Framer Motion). Charts with ECharts or Recharts, animated draw-in.
      Persistent small live NVDA ticker in a corner.
    - `/operator` — control panel: live transcript, current/next slide, queue of
      generated slides with Approve / Reject / Edit, manual nav, "panic → fallback"
      button, mic level meter, connection status for every service.
  - **Backend:** Node (Express or Fastify) + WebSocket. Holds ALL API keys (never in
    the browser). Relays audio to speech-to-text, sends transcript + state to Codex,
    pushes slide updates to `/stage` and `/operator`.
- **Speech-to-text:** streaming (Deepgram preferred; Chrome Web Speech API as a
  zero-cost fallback). Must handle a UK/US accent mix and finance terms (EBITDA, P/E,
  CUDA, Blackwell, hyperscaler, Scope 1/2/3).
- **Audio input:** wireless lavalier mic plugged into the presenting laptop (USB/
  receiver). Phone-as-mic is an optional stretch goal only.
- **LLM:** Codex API (check docs.claude.com for current model IDs; favour a fast
  model for live cues and Q&A). Use tool use / structured JSON output with a strict
  slide schema, e.g.
  `{ layout, title, bullets[], chart: { type, datasetKey, series[], range, highlight }, speakerNote, sources[] }`.
  Validate every response against the schema; reject + retry or fall back on failure.
- **Question detection:** operator holds a hotkey (or clicks "Q&A mode") while the
  board member is speaking. Don't rely on auto-detecting questions.
- **Live ticker:** free market-data API (Finnhub or Twelve Data). Show
  "Market closed — last close" when US markets are shut (approx 14:30–21:00 UK time open).
  Bloomberg data is NOT streamed live; it's exported files only.
- **Slide state** lives on the backend as the single source of truth so stage and
  operator always match, and a browser refresh doesn't lose the show.

## Data
- `data/bloomberg-raw/` — raw exports from the Bloomberg Terminal (xlsx/csv/pdf), as dropped in.
  Never edit these.
- `data/clean/` — normalised JSON/CSV the app reads (scripts in `app/scripts/` convert raw → clean).
  Expected datasets (keys used by charts): price history, revenue by segment
  (Data Center, Gaming, Pro Viz, Auto), margins, EPS + consensus estimates,
  forward projections, valuation multiples vs peers (AMD, Intel, Broadcom, TSMC, hyperscalers),
  analyst ratings/targets.
- `data/esg/` — ESG material: NVIDIA sustainability report data, emissions (Scope 1/2/3),
  energy-efficiency/performance-per-watt, renewable energy usage, water, supply chain
  (TSMC), governance, Bloomberg ESG scores, controversies. **The board is ESG-focused:
  the Q&A must be strongest here.** Expect: "AI's energy use is an environmental
  disaster — and you just used it for a slideshow." That question must produce a great slide.
- Every clean dataset must keep its source + date so slides can cite it.

## Content
- `docs/script/` — the scripted spine: one entry per slide with cue phrases,
  intended elements, and which datasets it uses.
- `docs/qa-bank/` — expected board questions with pre-generated, pre-approved answer slides
  (cache these so they appear instantly if matched).
- `assets/` — logos, images, video (we may generate visuals with AI image/video tools).
- `fallback/` — exported static deck (PDF) of the spine + Q&A bank. Generate it from the app.
- `rehearsal/` — transcripts/logs from rehearsals for tuning cues and latency.

## Accuracy notes for the content
- Don't claim the AI used here runs exclusively on NVIDIA hardware; AI providers use a
  mix of chips. Frame the closing claim around the AI industry being built on NVIDIA.
- All market/financial facts on slides come from `data/`, with sources shown.

## Working style
- Build in milestones (see kickoff prompt), each one demo-able on its own.
- Keep a `docs/PROGRESS.md` log: what's done, what's next, known risks.
- Ask before adding paid services. Keep secrets in `app/.env` (gitignored); list required
  keys in `app/.env.example`.
- Prioritise reliability over features. Every live service needs a timeout and a fallback.
