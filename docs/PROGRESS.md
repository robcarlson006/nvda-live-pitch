# Progress log

Pitch: **Wednesday 25 Nov 2026**, 8–9 min. Rob (why) → Mi'kael (financials) → Panshul (ESG).

## How to run
```bash
cd app && npm install && npm run dev
```
- Stage (projector): http://localhost:5173/stage. Press `f` for fullscreen.
- Operator (laptop screen): http://localhost:5173/operator
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

## Data received
- NVDA FA, annual FY1998–FY2026 and quarterly FY24 Q3–FY27 Q3, both including ESG.
- Peer FA: AMD, INTC, AVGO, TSMC (TSMC in both TWD and USD).
- NVDA WACC and DES snapshots, 20 Nov 2026.
- Still missing: HP (price history), ANR (analyst targets), SPLC (customers/suppliers), RV. Possibly next week via Excel.

## Next
- **M2:** PDF → clean datasets script, plus the valuation model:
  - peer multiples / PEG
  - 5-year DCF
  - bull / base / bear scenarios
  - sensitivity table
  - reverse DCF
- Then M5 (script spine), M4 (listening), M7 (fallback), M6 (Q&A), M8 (finale).

## Risks / open
- **Jensen Huang resigned (12 Nov 2026).** Colette Kress is interim CEO. The stock is at its 52-week low (~$135, P/E ~16). Governance is the obvious first ESG question, so it needs a Q&A-bank slide and possibly a line in the main pitch. Verify with a major outlet before quoting.
- Bloomberg WACC = 19.3%, far above the typical 9–12%. Show the sensitivity range rather than silently picking one number.
- The share price will move before Wednesday. The model takes the price as a dated input; update it on the morning of the pitch.
