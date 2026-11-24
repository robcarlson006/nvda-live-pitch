# The pitch script, draft 6 (generated from the slides)

Written 24 Nov 2026. This file is generated from the `say` lines in `docs/script/spine.yaml`, so it matches the slides exactly. To change a word, change it in spine.yaml, then regenerate. Lines starting with ▸ are what builds on screen and are never spoken. Slides marked (optional) can be switched off from the operator panel.

**Order:** Rob (the why, the bubble, the case for NVIDIA) → Panshul (the numbers) → Mi'kael (governance, emissions, the recommendation) → Rob (the close).

**What changed from v5:** removed the NV1 slide, "NVIDIA isn't one person", "AI takes over tasks, not people", "Data Center became almost the whole company", the analysts slide, the supply-chain emissions slide and the "built live" reveal. New: what makes the chips best; a CUDA slide on why it is so hard to catch up (new animation); "if the bubble pops"; an emissions comparison with other chip companies; governance now says the founder is back. The recommendation no longer mentions Bloomberg's rate. The closing line no longer claims the show was built live.

**Check before you speak:** the 80% AI chip spending share (IDC, SemiAnalysis) is unverified; the 90% "AI models trained on NVIDIA" claim is removed because we have no solid source. The reinstatement of Jensen Huang and every date must be checked against a news source on the morning. Figures are at a $165.05 share price and a 10.55% discount rate.

---

## ROB

### founding: 1993. A booth at Denny's.

In 1993, three engineers, Jensen Huang, Chris Malachowsky and Curtis Priem, sat in a booth at a Denny's in San Jose and drank a lot of coffee. Their idea was simple. The 3D graphics that lived on expensive workstations should be on every PC. And the way to pay for it was video games. People told them nobody starts a company to play games.

### first-gpu: 1999: the world's first GPU.

In 1999 they launched the GeForce 256 and gave it a new name: the GPU. In 2000 Microsoft picked NVIDIA for the first Xbox and paid two hundred million dollars up front. By 2007, Forbes named NVIDIA company of the year. A successful gaming company. They could have stopped there.

### cuda: 2006: CUDA.

Instead, in November 2006, they announced CUDA. Here's the idea. A normal processor is a handful of very fast workers doing one job after another. A graphics chip is thousands of smaller workers all doing the same job at the same time, in parallel. The screen behind me is exactly that: thousands of cores firing together. CUDA let anyone, not just graphics programmers, put those thousands of workers to work. It grew out of a Stanford PhD project by Ian Buck, who NVIDIA hired in 2004. And here's the part that matters: they gave it away for free, and they built it into every gaming card they sold.

### wall-street: Wall Street hated it.

Wall Street hated it. CUDA made every chip bigger and more expensive, for gamers who didn't care. NVIDIA was spending around half a billion dollars a year on it. The stock fell by more than half in 2008, and as late as 2013 an activist fund was questioning the spending. Look at revenue: stuck at three to four billion dollars for years. Shareholders wanted profits, not innovation. NVIDIA held on, because innovation is what creates the profits.

### alexnet: Then AI found CUDA.

In 2009, a Stanford team led by Andrew Ng showed that CUDA graphics cards could train neural networks up to 70 times faster. Then in 2012, a student at the University of Toronto, Alex Krizhevsky, entered an image-recognition contest with a neural network trained on two NVIDIA gaming cards. He won by more than ten points: an error rate of 15 percent against 26. Anyone who wanted to copy him needed CUDA. In 2016 NVIDIA declared the AI revolution, and Jensen personally delivered its first AI supercomputer to a small lab called OpenAI. By the time ChatGPT launched in 2022, CUDA had fifteen years of tools built on it. Modern AI was built on NVIDIA.

### revenue-long (optional): What the bet did.

Here's what that bet did. Twenty-seven years of revenue. Three to four billion a year for a decade, and then this. Panshul will show you whether it lasts. My job is to show you why it happened.

### four-layers: Why NVIDIA is the gold standard.

So why is NVIDIA the gold standard? Four layers. And a competitor has to beat all four at once.

### chips: One: chips. Built for AI, not just fast.

One: chips. So what makes NVIDIA's chips the best? Three things. First, they are built for AI. Since 2017 NVIDIA has put Tensor Cores on its chips, circuits designed for exactly the maths that AI uses, and each generation makes them faster. Second, the pace. NVIDIA now brings out a new generation every year, so a rival is always aiming at last year's chip. Third, NVIDIA doesn't sell a chip, it sells the whole machine: the processors, the wires between them and the network, designed together as one system. Which is why, on paper, AMD's latest chip beats NVIDIA's main one, with 288 gigabytes of memory against 192, and it's cheaper. Yet for every dollar AMD makes from data centres, NVIDIA makes about twelve. Last year that was about 194 billion dollars against 17. A chip is only as good as the software that runs on it.

### software: Two: software. Why CUDA is so hard to beat.

Two: software. This is the real moat. Think iPhone versus Android: NVIDIA builds the hardware and the software together, so it just works. More than six million developers write code for CUDA, and the major AI tools are built for it first. It comes with over a thousand free libraries, refined for nearly twenty years, so a company doesn't start from zero, it starts from everything already built. That's why it's so hard to catch up. To switch, a company has to rewrite its code, retrain its engineers and trust a newer, less tested tool, while its rivals keep moving. AMD's answer, ROCm, launched in 2016, nine years behind. A rival can copy a chip. It is much harder to copy twenty years of other people's work.

### connections: Three: connections.

Three: connections. NVIDIA's NVLink wires 72 chips in a single rack so tightly that the software sees them as one giant chip. Then, in 2019, NVIDIA agreed to buy Mellanox, the company whose networking links those racks into clusters of a hundred thousand chips. It paid about seven billion dollars. Last year, that networking business made more than 31 billion. In one year.

### supply: Four: supply.

Four: supply. About nine in ten of the world's most advanced chips are made by one company, TSMC, in Taiwan. The real bottleneck is the packaging that assembles AI chips, and NVIDIA has reserved around 60 percent of it. Its supply commitments have reached 279 billion dollars. So even if you design a better chip, you can't get enough of it built.

### catch-up: Has anyone caught up?

Has anyone caught up? Google has come closest, with its own chips, software and networking. That's eleven years and tens of billions of dollars. Amazon, Microsoft and Meta are trying too, and they all still buy NVIDIA. Microsoft is its biggest customer. Industry estimates, from IDC and SemiAnalysis, put NVIDIA's share of all AI chip spending at around 80 percent. To compete with NVIDIA, you have to be one of the richest companies on earth, with a decade to spare.

### bubble: Is this the dot-com bubble again?

The obvious question: is this the dot-com bubble again? Look at the scale. Building the interstate highways took about 1.1 percent of US GDP a year. The dot-com fibre boom, at its peak in 2000: 1.4 percent. The railroads: 2.2. The AI build-out is projected at more than 3.6 percent of GDP every year to 2032. That makes it the biggest infrastructure project in American history, relative to the size of the economy.

### different (optional): Cisco in 2000: … expected earnings. NVIDIA today:

But this is different in two ways. In 2000, Cisco, the NVIDIA of its day, traded at about 140 times its expected earnings. NVIDIA today trades at a fraction of that. And in 2000 only a few percent of the fibre that was laid actually got used. Today, US data centres are almost completely full. The companies paying for this are some of the most profitable in history. Panshul will take you through the numbers, including the risks.

### if-it-pops: And if the bubble does pop, NVIDIA is built to survive it.

And what if it is a bubble, and it pops? Be honest: the share price would fall. But look at who survived 2000. The dot-com crash wiped out companies that were built on an idea. The ones selling something people truly needed, like Amazon, came through. NVIDIA owns both halves of what AI is built on: the hardware, and CUDA, the software every AI developer already writes for. If money gets tight, the weakest bets get cut first, and the best platform is the last to lose customers. Our stress case, where AI spending actually stops, is sixty-four dollars a share, a big fall. But that is still a company with the best chips, the best software and a lot of cash, not a company that disappears.

### already-doing: AI isn't a fad.

And AI isn't a fad, because of what it's already doing. In 2024 the Nobel Prize in Chemistry went to AI work on proteins: predicting the shape of almost every protein known, and designing new proteins that don't exist in nature. A drug for a lung disease went from idea to clinical trials in under 30 months, less than half the usual time. In Sweden, AI-assisted screening found 20 percent more breast cancers while cutting doctors' workload by 44 percent.

### security: Found the flaw. Wrote the attack. Launched it.

AI is also now a matter of national security. This month, Google's threat intelligence team reported hacking software that found security flaws, wrote the attack and launched it with zero humans involved. Last year, Anthropic found a state-backed group using AI to carry out 80 to 90 percent of a spying campaign. These AI agents work 24 hours a day. How do you defend yourself against them? With AI. Google's own AI has already found security flaws before attackers could use them.

### superpowers: Neither superpower is going to stop.

And the world's two superpowers know it. China's official plan is to lead the world in AI by 2030. The US treats AI chips as so strategic that it restricts which ones can be sold to China. Neither side is going to stop.

### handoff: The best chips, software, connections and supply.

NVIDIA has the best chips, the best software, the best connections and the best supply chain. The world's biggest companies and its two biggest governments are all building AI. The only way to stop NVIDIA is to stop innovation. Panshul is going to show you whether the numbers back that up.

## PANSHUL

### last-quarter: Revenue in a single quarter

In the three months to October, NVIDIA's revenue was a hundred and sixteen billion dollars. In one quarter. That is more than double the same quarter a year earlier, and six percent above what analysts expected.

### beats: Revenue has beaten consensus thirteen quarters running

And it isn't luck. Thirteen quarters in a row, revenue has beaten what analysts expected, including this one. Grey is what analysts expected. Green is what NVIDIA delivered. Earnings per share beat too, two dollars sixty-eight against two forty-seven.

### guidance: NVIDIA has told investors next quarter is bigger again

And NVIDIA doesn't just report the past. For the current quarter it has told investors to expect a hundred and thirty billion dollars, give or take three percent. It raised its outlook for next year's revenue growth to about seventy-five percent, from seventy. And the new Vera Rubin chips earned nearly twenty billion dollars in their very first quarter of shipping, the fastest product ramp in the company's history.

### returns: The cash goes back to shareholders

A business this profitable has to do something with the cash. In the October quarter NVIDIA handed back twenty-eight billion dollars, twenty-two in share buybacks and six in dividends. Its board added another hundred and fifty billion to the buyback programme, which leaves two hundred and twenty-seven billion still to use. And it says it intends to return all excess free cash flow, after strategic uses, to shareholders.

### peers: The cheapest of the five on this year's expected earnings

You might think it's expensive. On this year's expected earnings it's the cheapest of the five big chip companies. And on the earnings it has already reported over the last year, it trades at about seventeen and three quarters times.

### valuation: At the industry-average discount rate, our base case is worth far more than the price

We built a five-year cash-flow model: forecast the cash, then shrink it back into today's money at the return investors demand. For that rate we use ten and a half percent, the average for American semiconductor companies. We think NVIDIA deserves no more than that: it holds more cash than debt and keeps far more of each dollar than its rivals. But we know the other estimates are higher. Google Finance has fourteen and a half for NVIDIA, Bloomberg nineteen. At ten and a half our base case, analysts roughly right and then growth slowing, is about three hundred and ninety-one dollars against a price of one sixty-five. At Google Finance's rate it is two forty-nine. At Bloomberg's it is about one sixty-seven, which is roughly the price. Our realistic bear case, where rivals take share and customers pause for a year, is a hundred and two. If AI spending actually stops, sixty-four.

## MI'KAEL

### governance: Governance. The founder is back.

Let's start with the hard one. Governance. Earlier this month Jensen Huang resigned as CEO. The board has now reinstated him, and it created a committee of independent directors for national security and export control. The investigations reported by the SEC and California are still open, so we won't pretend that risk has gone. VERIFY the reinstatement and every date against a major news source on the morning of the pitch.

### renewables: NVIDIA's own operations now run on renewable energy

Environment. NVIDIA's own operations now run on renewable energy, up from about a third in 2018.

### emissions-peers: Per dollar of sales, NVIDIA's own emissions are tiny next to other chip companies

And compared with other chip companies, NVIDIA's own operations are tiny. For every million dollars of sales, NVIDIA's own emissions are about a twentieth of a tonne. AMD emits one point two. Broadcom, two point eight. Intel, twenty-five. TSMC, a hundred and nine. That is own operations only, not suppliers.

### recommendation: Our recommendation: Buy.

Our recommendation is to buy. We would start with a three percent position in the portfolio, to hold for three to five years, well inside our ten percent limit on any single stock. At the industry-average rate of ten and a half percent our base case is about three hundred and ninety-one dollars against a price of one sixty-five. Even at Google Finance's higher rate of fourteen and a half percent it is two forty-nine. At three percent, our realistic bear case, a hundred and two dollars a share, costs the portfolio about one percent. Even the stress case, sixty-four dollars, costs under two percent. We would add, up to our limit, only if cloud spending plans rise again and the investigation into the CEO closes. We would sell if the cloud companies cut their spending plans.

## ROB

### close: The AI industry runs on infrastructure NVIDIA built.

The AI industry runs on infrastructure NVIDIA built, and the company with the best hardware and the best software is the hardest one to replace. Our recommendation is to buy. Thank you.
