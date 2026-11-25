# Prompt for a new Claude Code session: cut the pitch to 9 minutes, bracket style

Paste everything below the line into a fresh Claude Code session opened in `~/Documents/Nvidia stock pitch`.

---

We're three University of Stirling students pitching NVIDIA (NVDA) as a buy to a sceptical, ESG-focused investment
board. The pitch is a web app (`app/`) that builds slides live as we speak, driven by the scripted spine in
`docs/script/spine.yaml`. The spoken script is too long: about 2,360 spoken words (~15½ minutes at 150 words a
minute, counting each `{{figure}}` as ~5 spoken words). **The goal is a 9-minute script (≈1,350 spoken words), with
the slides and visuals cut to match. I decide every cut, through a quick quiz you build for me.**

## 1. Get the latest code
- `git fetch origin` and check out the most recent work: branch `rob/dcf-slides` (pull it; if `origin/main` is newer,
  tell me before merging anything). Confirm the latest commit includes `docs/script/CUT-PROPOSAL.md`. If it doesn't,
  stop and tell me (the newest commit may not be pushed yet).
- Read `CLAUDE.md`, `docs/PROGRESS.md` (last two sections), `docs/script/CUT-PROPOSAL.md`, `docs/script/TIMING.md`
  and `docs/script/spine.yaml`. CUT-PROPOSAL.md is a starting point, not a decision.
- Do not touch `research-vault/` (an overnight GPT loop writes there) or `data/bloomberg-raw/`.

## 2. Measure
Write a small script that counts spoken words per slide from `say` (each `{{…}}` figure = 5 words) and converts to
time at 150 wpm, per slide and per speaker (Rob, Panshul, Mi'kael). Show me the table before building anything.

## 3. Build the cut quiz ("bracket")
A local page I click through, one match-up at a time, like a quiz:
- **Each round shows two candidates side by side**: the slide image (use the backup deck pictures in
  `app/public/fallback/slide-N.jpg`, or render the slide; whichever matches the current slides) and, under each, the
  exact script lines that go with it and its time cost (e.g. "−24 s"). I click the one to **keep**; the other is cut.
- Candidates are whole slides **and** smaller trims (a sentence, a bullet, a visual step, or two slides merged into
  one). For a trim, show "full version" vs "trimmed version" of the same slide and script.
- Start with the least essential and weakest material (see CUT-PROPOSAL.md tiers), pair things of similar length, and
  never pair two things that both have to stay for the story to make sense (e.g. the recommendation and the close stay).
- A big progress bar at the top: current running time vs the 9:00 target, words per speaker, rounds left. Stop
  offering rounds once we're at or under 9:00 (allow me to keep going if I want).
- **Undo** last pick, **Skip** (keep both), and a final summary screen: the new running order with every cut and trim,
  the new time per speaker, and the full new script.
- Save every pick as I go to `docs/script/cut-choices.json` (a tiny local server or the app's server; it must survive a
  refresh). Open it in the browser pane for me. Keep it simple and fast: big buttons, keyboard keys 1/2 to pick.

## 4. Apply my choices (only after I confirm the summary)
- Edit `spine.yaml`: remove cut slides; trim `say` lines and the matching `bullets`/visual steps so what is said and
  what is shown still line up; keep or fix each slide's `cues` so speech still triggers it (cues must be words we
  still say); keep `{{dataset | series | x}}` figures as lookups, never typed numbers.
- Check the bespoke scenes (`app/src/scenes/`) still read correctly with fewer points.
- Run `npm test` in `app/` (the "reading the script aloud builds every slide in order" tests must pass), check every
  changed slide on `/stage` at 1600×900, rebuild the backup deck (`fallback/spine.pdf` and the slide images) and
  update `docs/script/TIMING.md` and `docs/PROGRESS.md`.
- Commit on a new branch; don't push or merge without asking me.

Work with me throughout: show me the measure table first, then the quiz, then the summary. Explain any finance or
technical term in plain words.
