# Rehearse the 25 November pitch

1. From this folder run `./start.sh`. It builds the app and opens the stage and operator in Chrome. If `app/.env` is absent, the manual deck and static backup still work; Deepgram and Anthropic do not.
2. On the stage press **f** for full screen. On the operator, use **Start rehearsal run**, then **Start mic** if the key and microphone are ready. Speak the `say` lines in `docs/script/spine.yaml` from memory and check that each element lands on its phrase.
3. Use **Right Arrow / Space / Page Down** to advance an element and **Left Arrow / Page Up** to go back. **q** starts or submits a board question. On the operator screen, **a** approves and **x** rejects a queued answer. **m** toggles motion. The stage URL `?motion=off` forces the plain deck on that screen.
4. Press **B** or **Backup deck** on the operator for the static slides. Next and Back move whole backup pages. Press **B** again to resume live slides. The operator has links to both PDFs. If the app itself fails, open `fallback/spine.pdf` (37 pages, one per slide) in a PDF viewer, and `fallback/qa-bank.pdf` for the prepared answers.
5. Stop and save the rehearsal run. Check its log in `rehearsal/`. The current script is about 1,150 spoken words (about 7:40 at 150 wpm before pauses; see `docs/script/TIMING.md`); prove the full run is under 9:00 in the room.
6. Run the question drill in `docs/qa-bank/DRILL.md`. The UK-law answers rest on `docs/qa-bank/UK-EVIDENCE.md`.

Before the pitch, confirm the current share price from a named source with its time (24 Nov quotes conflicted; see `docs/financials/RECONCILE.md` section 5), update the model and every spoken rounded figure, regenerate the fallback with `python3 fallback/build.py`, then run tests and inspect both screens. The current $152.85 is dated 24 November and is a team input. The staff-turnover benchmark compares different periods and populations and is directional. The operator marks remaining unverified slides.

`./restore-pre-v2.sh` restores the earlier deck if the new build fails. It changes Git state, so use it only if you have decided to abandon this version.
