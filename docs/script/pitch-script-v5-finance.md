# Pitch script v5: finance section (Panshul) and the bear-case callback (Mi'kael)

Written 24 Nov 2026. It replaces **only** these parts of `pitch-script-v4.md`: Panshul's section ("the numbers", lines 59–87) and Mi'kael's opening callback (lines 93–95). Everything else in v4 stands. The spoken words match the `say` lines in `spine.yaml`; if you change one, change the other.

Figures come from `data/clean/` at a **$165.05** share price (Google Finance, 24 Nov): discount rate **10.55%** (US semiconductor average); base $391.38, realistic bear $101.56, stress $64.41. At Google Finance's 14.45%: base $248.69, bear $67.04, stress $43.48. **If the price changes on the morning, re-read every dollar figure below** (`npm run data`, then check the slides).

---

## PANSHUL: the numbers (about 3:30)

▸ *Chart builds, slowly:* revenue FY22 $26.9bn → FY26 $215.9bn, Data Center shaded.

Do the numbers agree? Yes. Four years ago NVIDIA sold twenty-seven billion dollars. Last year it sold two hundred and sixteen: eight times as much. Ninety percent of that is Data Center.

▸ *Slide `last-quarter`:* Q3 FY27 revenue $115.8bn, 6.0% above expected.

In the three months to October, NVIDIA's revenue was a hundred and sixteen billion dollars. In one quarter. That is more than double the same quarter a year earlier, and six percent above what analysts expected.

▸ *Slide `beats`:* revenue v consensus, thirteen quarters; EPS $2.68 v $2.47.

And it isn't luck. Thirteen quarters in a row, revenue has beaten what analysts expected, including this one. Grey is what analysts expected. Green is what NVIDIA delivered. Earnings per share beat too, two dollars sixty-eight against two forty-seven.

▸ *Slide `guidance` (new):* Q4 guide $130bn ±3%; FY28 growth outlook ~75%, up from 70%; Vera Rubin nearly $20bn in first quarter.

And NVIDIA doesn't just report the past. For the current quarter it has told investors to expect a hundred and thirty billion dollars, give or take three percent. It raised its outlook for next year's revenue growth to about seventy-five percent, from seventy. And the new Vera Rubin chips earned nearly twenty billion dollars in their very first quarter of shipping, the fastest product ramp in the company's history.

▸ *Slide `segments`:* Data Center in the October quarter $107.6bn, up 110% on a year earlier.

Where does it come from? Data centres. The chips that train and run AI. In the October quarter alone, Data Center sold a hundred and eight billion dollars, up a hundred and ten percent on a year earlier. Gaming, where NVIDIA started, is now the thin grey band.

▸ *Slide `returns` (new):* $28bn returned in the quarter; $227bn buyback authorization left.

A business this profitable has to do something with the cash. In the October quarter NVIDIA handed back twenty-eight billion dollars, twenty-two in share buybacks and six in dividends. Its board added another hundred and fifty billion to the buyback programme, which leaves two hundred and twenty-seven billion still to use. And it says it intends to return all excess free cash flow, after strategic uses, to shareholders.

▸ *Slide `peers`:* forward P/E, cheapest of the five; trailing P/E 17.73x.

You might think it's expensive. On this year's expected earnings it's the cheapest of the five big chip companies. And on the earnings it has already reported over the last year, it trades at about seventeen and three quarters times.

▸ *Slide `valuation`:* bars Stress / Bear / Base / Bull / Peer P/E; bullets for the rate, the base case, the bear cases and Bloomberg's rate.

We built a five-year cash-flow model: forecast the cash, then shrink it back into today's money at the return investors demand. For that rate we use ten and a half percent, the average for American semiconductor companies. We think NVIDIA deserves no more than that: it holds more cash than debt and keeps far more of each dollar than its rivals. But we know the other estimates are higher. Google Finance has fourteen and a half for NVIDIA, Bloomberg nineteen. At ten and a half our base case, analysts roughly right and then growth slowing, is about three hundred and ninety-one dollars against a price of one sixty-five. At Google Finance's rate it is two forty-nine. At Bloomberg's it is about one sixty-seven, which is roughly the price. Our realistic bear case, where rivals take share and customers pause for a year, is a hundred and two. If AI spending actually stops, sixty-four.

▸ *Slide `analysts` (new):* 34 buy / 9 hold / 1 sell of 44; average target $233.36; lowest $130.

Is it just us? No. Of forty-four Wall Street analysts, thirty-four say buy, nine say hold and one says sell. Their average twelve-month target is two hundred and thirty-three dollars and the highest is three fifty. Our base case, three hundred and ninety-one, is above every one of them, and we want to be clear why: we use the industry discount rate, ten and a half percent. At Google Finance's fourteen and a half it is two forty-nine, close to their average. And our realistic bear case, a hundred and two, is below the lowest analyst target of a hundred and thirty.

*Hand-off line (replaces v4's "thirty-one dollars" sentence):* "Now the risk, from us first. Everything here depends on AI spending continuing. If it pauses, our stress case is sixty-four dollars, sixty-one percent below today. That is the downside, and we are showing it to you. Mi'kael will tell you why we think it is very unlikely."

---

## MI'KAEL: opening callback (replaces v4 lines 93–95)

▸ *The stress-case bar returns, alone, large:* **$64**.

As Panshul said, if AI spending stops, a share is worth sixty-four dollars. So the question is whether it stops. We think it is very unlikely, for two reasons.

---

## Not said on stage (Q&A only)

Customer financing and guarantees, margin pressure, the CEO search, China and the new export controls, and the 2028 policy question are all deliberately **not** on the slides. Prepared answers are in `docs/qa-bank/answers.yaml` and `docs/qa-bank/QA_PREP.md` Part 5, citing the Q3 earnings call. Insider selling is not used anywhere.

## Checks before you speak

- Earnings-call and Google Finance figures come from pasted text. Open the Google Finance page and the NVIDIA press release and check them; say "on the earnings call", not "in the filing".
- The page's own WACC inputs add up to about 14.9%, not 14.45%. Say "about fourteen and a half percent".
- Position sizing line in `recommendation` (about one percent; under two percent) was worked out at $165.05 and 10.55%. Recompute if the price moves: 3% × (1 − bear ÷ price).
- Beta: Google Finance shows NVIDIA's beta as 2.21, so do not say it is "less volatile" than other chip companies. Say strong balance sheet and margins justify the industry rate, and point to the range on the slide.
