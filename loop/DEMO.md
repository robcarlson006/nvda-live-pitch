# DEMO: try it with your team (one page)

## Start it
```
cd /Users/robmcarlson/Developer/nvidia-pitch-loop     # this worktree, branch loop/2026-11-22
./start.sh
```
It builds, then opens two Chrome tabs: **/stage** (the projector; press `f` for full screen) and **/operator** (your control panel).
`app/.env` must hold the Deepgram and Anthropic keys (start.sh tells you if one is empty). The Anthropic key lets the deck follow your *meaning*; without it, cue words and Next still work.

## Start the mic
On /operator: press **Start mic**, set **Engine = Deepgram** (**Chrome (backup)** if Deepgram fails), pick the accent (UK/US). The level bar should move when you talk; the status says "Mic on: Deepgram".
Optional: press **t** on the stage to see the last words it heard along the bottom (off by default). **m** turns all motion down (calm).

## Say these three things and watch (from our `say:` text, any wording works)
1. *"In 1993, three engineers sat in a booth at a Denny's and drank a lot of coffee. The 3D graphics on expensive workstations should be on every PC, and video games would pay for it."* → "1993" slide builds; the next point glows faintly *just before* it lands.
2. *"In 1999 they launched the GeForce 256 and called it the GPU. Microsoft paid two hundred million up front for the first Xbox."* → moves on in a few seconds. No trigger words needed: try your own words.
3. *"A normal processor is a handful of very fast workers doing one job after another. A graphics chip is thousands of smaller workers all doing the same job at the same time."* → CUDA slide; bullets land as you say them.

## Skip a section and see it cope
Say line 1, then line 3 (leave out the GeForce part). The deck should go straight to CUDA. Or switch a ✂ slide off in the operator panel first: it is never shown. Panshul's new optional slides: "where the value comes from" (DCF bridge) and "turn it round" (reverse DCF).

## Ask a board question
On /operator press **q** (or the Q&A button), say the question, press **q** again. A prepared answer is queued in about a tenth of a second; **a** shows it, **x** rejects, **r** returns to the script. Try: *"Isn't this just an AI bubble, like 1999?"*, *"How does the P/E compare with AMD and Broadcom?"*, *"Why should we trust a student model?"*. A question we have no prepared answer for goes to Claude (3 to 6 s; a few have been slower), and anything it says shows in the queue first: read it before pressing **a**.

## Keys (operator tab unless said)
Right / Space = next · Left = back · **q** question · **a** approve · **x** reject · **r** resume · **Esc** or **p** = PANIC (stops following speech, standby screen) · stage tab: **f** full screen, **m** calm, **t** transcript line.

## What is slow or weak (honest)
- Following by meaning is not instant: a new slide arrives a median ~17 words into the beat (about 6 seconds of speech), and on the second half of the holdout test it missed 1 in 9 and moved wrongly 1.8 times per run. Cue words and Next are always the net: **keep a hand on Next**.
- Paraphrased bullets inside a slide land a little late; near-script speech lands on time and glows first.
- Not tested: a real room, a real wireless mic, or a second laptop. The ticker is optional.
- API money: about $0.5 of the $2.50 cap is left for practice; the app has its own cap too (app/ai-spend.json).

## If it misbehaves
Press **Esc** (panic), then step with Next. If the stage freezes or the page is blank, reload it: the show state is kept on the server. If everything fails, open the PDF deck in `fallback/` and carry on by hand. `npm run smoke` (in app/) re-runs this whole demo without a microphone (about 1 cent).
