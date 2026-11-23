# Stage demo: how to run the show

Repo: `~/Developer/nvidia-pitch-loop`. Script: `docs/script/pitch-script-v4.md`; the machine-readable spine is `docs/script/spine.yaml` (22 slides).

## Start
```bash
cd ~/Developer/nvidia-pitch-loop/app
npm start          # or ./start.sh from the repo root
```
- Projector: `http://localhost:5173/stage` (press **F** there for full screen; **M** calm mode).
- Second device: `http://localhost:5173/operator`.
- Port 5173 is the default; set `PORT=...` to change it.

## Keys (operator view)
| Key | Does |
|---|---|
| Space / → | next beat (then next slide) |
| Backspace / ← | back one beat |
| N / P | next / previous slide |
| B | backup deck on / off (static pictures of every slide and answer) |
| F | freeze: speech stops moving the deck (toggle) |
| Q | question mode; A / X approve / reject a generated slide |
| R | resume following speech |
| Esc | panic: stop following, standby screen |

Every beat can also be fired by its cue phrase, and every slide can be clicked in the list. **Auto-play (9 min)** on the operator view plays the whole spine by itself, one beat at a time, paced by each slide's share of the spoken words.

## Check it
```bash
npm test                    # 83 tests
npm run typecheck
npm run build
npm run shoot -- --out ../loop/shots/x   # screenshots of every beat at 1920×1080 (add --no-perf to skip the frame-time run)
npm run fallback            # regenerate the static backup deck after any visual change
npm run price -- <price>    # update today's share price; the valuation bars move with it
```

## Not verified
- A real microphone and a real projector. Everything was run in headless Chromium and the in-app browser.
- Frame rate on the pitch laptop (profile with `npm run shoot` on that machine).
- `research_ai_chip_share` (68% v 19%) is copied from the script's table, not re-checked against Epoch AI. `research_discoveries` is marked unverified; the Sacks quote and the Xi paraphrase in the script are marked [VERIFY].

## Missing
- **The official NVIDIA logo.** The finale falls back to the word NVIDIA in white. Drop the official file at `app/public/nvidia-logo.svg` and it appears.
- The slide "Implied" shows $2.1 trillion for FY32 (the model's number); the script says "about two trillion".
- Governance (slide 21) has no figures, so no source line; its facts are in `docs/research/huang-reinstatement.md`.
