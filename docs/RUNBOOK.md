# Runbook: pitch day

**Who:** presenters Rob, Panshul, Mi'kael. One person (not speaking at the time) sits at the laptop as **operator**. Whoever is speaking holds the clicker.

## T-60 minutes
1. Laptop on power. Quit everything except Chrome and Terminal (8 GB Mac). Turn off notifications (Focus), display sleep, and automatic updates.
2. Wi-Fi: join the venue network; have a phone hotspot ready. Speech and AI need internet; the deck itself does not.
3. Share price: set `priceOverride` in `data/model/assumptions.json`, then in `app/`: `npm run data && npm run xlsx && npm run xlsx-check` (must say PASS). Note the time you took the price.
4. `./start.sh` in the repo folder. It checks keys, builds and opens both pages.
5. Displays: **extend**, not mirror. Stage (`/stage`) on the projector, press `f`. Operator (`/operator`) on the laptop.
6. Operator page: Server connected (green), 2 screens, AI spend well under the cap. If near the cap: stop the app, delete `app/ai-spend.json`, start again.
7. Rebuild the fallback if slides changed: `npm run build && npm run fallback` (about 6 min), and open `fallback/index.html` once.

## T-10
1. Plug in the lavalier receiver. **Start mic**, allow it, check the meter moves and the name is the lavalier.
2. Say a sentence: the "Mic on: Deepgram" pill is green and the words appear. "Follow meaning" is ticked.
3. Press **Standby**: the stage shows NVIDIA and the loop strip is empty. Untick any ✂ slides you are dropping.
4. Open the fallback deck in another Chrome window, behind the stage.

## During
| You want | Do |
|---|---|
| Deck follows you | Nothing. Speak in your own words; skip or go back freely |
| It is behind, or wrong | Clicker / → / Space. It then leaves your choice alone for a few seconds |
| Back one | ← |
| Stop it listening | untick **Follow speech** |
| Board question | `q`, let them speak, `q` again. Read the answer, then `a` show / `x` reject |
| Back to the script | `r` |
| Off-script slide you don't want | `x` while it says "going up now" (1.5 s). Tick **Ask before off-script slides** to always be asked |
| Calm the visuals | `m` on the stage |
| Blank to NVIDIA | **Standby** on the operator page |

Timing from the last spoken measurements: the deck usually lands **about 8 seconds** after a new subject starts. For the beats where the moment matters (CUDA, the reveal, the last line), press the clicker.

## When something fails
| Failure | What you see | What to do |
|---|---|---|
| Wi-Fi drops | "Not following… cue words and Next still work" | Keep talking, use the clicker. Hotspot if there is time |
| Deepgram fails | "Switched to Chrome" | Nothing |
| Both speech engines fail | Mic pill red | Clicker for the rest. Prepared answers still work (list on the operator page) |
| Claude fails or the cap is reached | Red pill with the reason | Cue words take over by themselves; clicker; prepared answers |
| Stage looks wrong | - | Reload the page: it comes back on the same slide |
| App crashes | - | `./start.sh` again (about 10 s): same slide |
| Nothing works | - | `fallback/index.html`: → next, `q` answers list, `r` back. Or the PDF |
| Projector dies | - | Present from the laptop screen |

## Costs
Following a full pitch costs about 20p of API credit; a live answer about 1–2p; a web search about 5p. Cap: $4 (`AI_SPEND_CAP`).
