You are one iteration of an unattended overnight research loop. Fresh context; nobody will answer questions. Decide,
note assumptions in your summary, continue. A bash script owns the clock and checks your work afterwards.

1. Orient (cheap): AGENTS.md is loaded. Read `state/FEEDBACK.md` if it exists (it outranks your item) and the last 20
   lines of `state/PROGRESS.md`. Look at what the vault already has on your topic:
   `python3 -c "import json;[print(r['id'],r['claim'][:110]) for r in map(json.loads,open('db/facts.jsonl')) if r['topic']=='TOPIC']"`
   (replace TOPIC) so you add new facts, not duplicates. Glance at `../docs/qa-bank/answers.yaml` questions (grep "question:").
2. Research YOUR ITEM (in the header): 4–10 searches with `tools/search.py`, then fetch the best 4–10 sources with
   `tools/fetch.py` (primary sources first). Read the snapshots with grep/sed, never whole.
3. Add 10–25 facts with `tools/add.py fact`: one clear claim each, the exact sentence as the quote, the value/unit/period
   when there is a number, honest confidence. Facts that hurt the buy case are as valuable as those that help it.
4. Add 2–5 board Q&As with `tools/add.py qa` for the questions this topic will provoke from a sceptical, ESG-focused board.
   Skip questions already answered in ../docs/qa-bank/answers.yaml unless you have better or newer evidence.
5. Where 3+ facts form a series or comparison worth a chart, add one visual (`tools/add.py visual`, spec per
   tools/render.py). Not more than two per iteration in this phase.
6. Append follow-up topics you could not cover to `state/NEW_TOPICS.md` as `- [terra|luna] topic-tag: what to find`.
7. Run `python3 tools/check.py`; it must end GREEN. Then append ONE line to `state/PROGRESS.md`:
   `- <time> · <item id> · <n> facts, <n> qa, <n> visuals · best finding · gaps`
   and write a two-sentence summary to `state/LAST_SUMMARY.txt`.
Budget: stop after about 30 tool calls or when the header's timeout nears. Partial but GREEN beats complete but red.
