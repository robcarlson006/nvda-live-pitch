# Paste this into Claude Code (opened in the "Nvidia stock pitch" folder)

Read CLAUDE.md first. It has the full brief, principles and suggested architecture.

We're building a web app that builds our NVIDIA stock-pitch slideshow live while we
present: it listens through a mic, builds slides/charts in sync with our speech, and
generates answer slides when the board asks questions, all from our Bloomberg data.
The board is ESG-focused and sceptical of NVIDIA, so reliability and honest data matter
more than flash, but it still has to look spectacular.

Before writing code:
1. Check what's in the folder (data may or may not be in yet).
2. Reply with a short build plan, your chosen stack, the list of API keys/accounts I
   need to create, and any questions. Wait for my OK.

Then build in these milestones, stopping after each one so I can test it:

**M1: Stage + operator skeleton.** `/stage` and `/operator` routes, backend with
WebSocket, shared slide state. Operator can push a hard-coded slide and it animates
onto the stage (title → bullets → chart building in). Make the look cinematic: dark,
NVIDIA green accents, smooth motion.

**M2: Data pipeline.** Scripts that turn whatever is in `data/bloomberg-raw/` into
clean JSON in `data/clean/` with source + date on every dataset. Use realistic
placeholder data clearly marked `PLACEHOLDER` until my real exports arrive. Chart
component that renders any dataset by key.

**M3: Live ticker.** NVDA price widget on the stage with a market-closed state.

**M4: Listening.** Mic → streaming speech-to-text → live transcript on the operator
panel. Mic level meter and connection status.

**M5: Scripted spine.** Load slides from `docs/script/`, match cue phrases in the
transcript (fuzzy matching), build each slide's elements in time with the speaker.
Operator can override at any time.

**M6: Live Q&A.** Operator hotkey captures a question → Claude (structured output,
strict schema, data lookup by key only, never invented numbers) → generated slide
goes to the operator's approval queue → approved slide builds on stage. Instant match
against cached answers in `docs/qa-bank/` first.

**M7: Fallback + hardening.** Panic button to static fallback, timeouts and retries on
every service, offline mode, exported PDF backup deck in `fallback/`, rehearsal logging
to `rehearsal/` with latency stats.

**M8: The finale.** A closing sequence that reveals "this whole presentation was built
live by AI", with a recap montage of every slide that was built during the session.

Keep `docs/PROGRESS.md` updated as you go.
