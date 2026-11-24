# The pitch script, draft 7 (generated from the slides)

Written 24 Nov 2026 from the `say` lines in `docs/script/spine.yaml`, so it matches the slides exactly. To change a word, change it in spine.yaml, then regenerate. Lines starting with ▸ are what builds on screen and are never spoken; 🔍 marks a zoom into the chart, on the words shown. Slides marked (optional) can be switched off from the operator panel.

**Length:** 1205 words. Read aloud at 150 words a minute with a short pause between slides it runs 9:05 (Rob 5:18, Panshul 2:08, Mi'kael 1:39), measured with `app/scripts/deepgram-run.ts`. Speak a little faster than a calm read, or cut the optional slide, to land under 9:00.

**Order:** Rob (the why, the bubble, the case for NVIDIA) → Panshul (the numbers) → Mi'kael (governance, emissions, the recommendation) → Rob (the close).

**What changed from v6:** cut from about 2,200 words (14½ minutes) to 1205. Removed the Cisco comparison ("different") and the national-security hacking slide (its "zero humans" figure was unverified); national security is now one line on the superpowers slide. The emissions slide is rewritten in plain English (48 kg against 109 tonnes, not "0.048 t CO2e per $1m") and now says that TSMC makes NVIDIA's chips. The bubble slide says the fibre boom was "about the same" as the highways, which matches the chart. Charts zoom in as you talk about them: the AI bar on the bubble slide, this quarter on the beats chart, next quarter's guide, NVIDIA on the P/E chart, the base case on the valuation, then NVIDIA and TSMC on the emissions chart.

**Check before you speak:** the 80% AI chip spending share, networking revenue ($31bn) and CUDA spend (~$0.5bn a year) are unverified. Check the reinstatement of Jensen Huang and every date against a news source on the morning. Figures are at a $165.05 share price and a 10.55% discount rate.

---

## ROB

### founding: 1993. A booth at Denny's.

In 1993, three engineers sat in a booth at a Denny's in San Jose. Their idea: 3D graphics on every PC, paid for by video games. People told them nobody starts a company to play games.

▸ Workstation 3D graphics, on every PC (on “every pc”)
▸ Paid for by video games (on “video games”)

### first-gpu: 1999: the world's first GPU.

In 1999 they launched the GeForce 256 and called it the GPU. Microsoft picked NVIDIA for the first Xbox, and by 2007 Forbes named it company of the year. A successful gaming company. They could have stopped there.

▸ 2000: Microsoft picks NVIDIA for the first Xbox, paying $200m up front (on “first xbox”)
▸ 2007: Forbes company of the year (on “company of the year”)
▸ A successful gaming company. They could have stopped there. (on “stopped there”)

### cuda: 2006: CUDA.

Instead, in November 2006, they announced CUDA. A normal processor is a few fast workers doing one job after another. A graphics chip is thousands of workers, all at the same time. CUDA let anyone use them, and NVIDIA gave it away for free, on every gaming card.

▸ A normal processor: a handful of fast workers, one job after another (on “one job after another”)
▸ A graphics chip: thousands of workers, all at the same time (on “at the same time”)
▸ CUDA lets anyone put those workers to work (on “let anyone”)
▸ Given away free, and built into every gaming card (on “away for free”)

### wall-street: Wall Street hated it.

Wall Street hated it. CUDA made chips pricier for gamers who didn't care, at about half a billion dollars a year. The stock halved in 2008, and in 2013 an activist fund circled. Look at revenue: stuck for years.

▸ Bigger, pricier chips, for gamers who didn't care
▸ About $0.5bn a year spent on CUDA (on “half a billion”)
▸ The stock more than halved in 2008. An activist fund circled in 2013. (on “activist fund”)
▸ Revenue stuck for years. NVIDIA held on anyway. (on “look at revenue”)
▸ Chart: NVIDIA annual revenue

### alexnet: Then AI found CUDA.

Then, in 2009, a Stanford team led by Andrew Ng trained neural networks 70 times faster on CUDA. In 2012, a student at the University of Toronto won the top image-recognition contest on two NVIDIA gaming cards, with an error rate of 15 percent against 26. Modern AI was built on NVIDIA.

▸ 2009: Stanford trains neural networks up to 70x faster on CUDA (on “times faster”)
▸ 2012: AlexNet, trained on NVIDIA gaming cards, wins ImageNet by a mile (on “university of toronto”)
▸ Chart: ImageNet 2012: top-5 error rate (lower is better) (on “error rate”)

### revenue-long (optional): What the bet did.

Here's what that bet did: twenty-seven years of revenue. Flat for a decade, and then this.

▸ Chart: NVIDIA annual revenue

### four-layers: Why NVIDIA is the gold standard.

So why is NVIDIA the gold standard? Four layers. And a competitor has to beat all four at once.

▸ Chips. Software. Connections. Supply. (on “four layers”)
▸ A competitor has to beat all of them, at once. (on “at once”)

### chips: One: chips. Built for AI, not just fast.

One: chips. Since 2017, Tensor Cores have done exactly the maths AI needs, and a new generation comes every year. On paper, AMD's latest chip has more memory, 288 gigabytes against 192. But NVIDIA sells the whole system, and for every dollar AMD makes from data centres, NVIDIA makes twelve: 194 billion against 17.

▸ Tensor Cores, added in 2017, are circuits built for the maths of AI (on “tensor cores”)
▸ A new chip generation every year, so rivals are always aiming at last year's chip (on “every year”)
▸ On paper AMD has more memory: 288 GB against 192 GB. But NVIDIA sells the whole system (on “gigabytes”)
▸ In data centres, NVIDIA makes 11.6x what AMD makes (on “every dollar”)
▸ Chart: Data centre revenue, latest full year (on “billion against”)

### software: Two: software. Why CUDA is so hard to beat.

Two: software. Think iPhone versus Android. Six million developers write code for CUDA, using over a thousand free libraries. To switch, a company must rewrite its code and retrain its engineers, and AMD's answer arrived nine years behind. A rival can copy a chip, not twenty years of other people's work.

▸ 6m developers write code for CUDA (on “developers”)
▸ More than 1,000 free libraries, refined since 2007 (on “libraries”)
▸ To switch, a company must rewrite its code and retrain its engineers (on “to switch”)
▸ AMD's answer, ROCm, arrived in 2016: nine years behind (on “years behind”)

### connections: Three: connections.

Three: connections. NVLink wires 72 chips in a single rack into one giant chip. In 2019 NVIDIA agreed to buy Mellanox for about seven billion dollars, and last year that networking business made more than 31 billion.

▸ NVLink: 72 chips in a rack act as one giant chip (on “single rack”)
▸ 2019: NVIDIA buys Mellanox for about $6.9bn (on “agreed to buy”)
▸ Last year that networking business made $31bn. In one year. (on “networking business”)

### supply: Four: supply.

Four: supply. TSMC in Taiwan makes about nine in ten of the most advanced chips. The bottleneck is packaging, and NVIDIA has booked around 60 percent of it. A rival with a better design can't get it built.

▸ TSMC in Taiwan makes about 90% of the most advanced chips (on “most advanced chips”)
▸ The bottleneck is packaging, and NVIDIA has booked most of it (on “bottleneck”)
▸ Chart: Share of TSMC CoWoS packaging capacity booked for 2026

### catch-up: Has anyone caught up?

Has anyone caught up? Google has come closest, after eleven years and tens of billions. Amazon, Microsoft and Meta all still buy NVIDIA. Industry estimates give it around 80 percent of AI chip spending.

▸ Google came closest, with its own chips since 2015 and tens of billions spent (on “come closest”)
▸ Amazon, Microsoft and Meta are trying too, and still buy NVIDIA (on “still buy”)

### bubble: Is this the dot-com bubble again?

Is this the dot-com bubble again? The interstate highways took about 1.1 percent of US GDP a year. The fibre boom, about the same. The railroads, 2.2. The AI build-out is projected at 3.6 percent: the biggest in American history.

▸ Chart: Average yearly spend during each build-out, share of US GDP (on “interstate highways”)
🔍 Zoom in on AI 2025–32 (on “projected at”)

### if-it-pops: And if the bubble does pop, NVIDIA is built to survive it.

And if the bubble pops? The share price would fall. But the dot-com crash wiped out companies built on ideas, not ones selling what people needed. NVIDIA owns both halves of AI, the hardware and the software, and when money gets tight the weakest bets are cut first. Our stress case, where AI spending stops, is 64 dollars: a big fall, not a disappearance.

▸ The dot-com crash wiped out companies built on ideas. The ones selling something people needed survived. (on “wiped out”)
▸ NVIDIA owns both halves of AI, the hardware and the CUDA software every AI developer already builds on (on “both halves”)
▸ When money gets tight, the weakest bets are cut first. The best platform is the last to lose customers. (on “cut first”)
▸ The share price would still fall. Our stress case, where AI spending stops, is $64.41 (on “stress case”)

### already-doing: AI isn't a fad.

And AI isn't a fad. The 2024 Nobel Prize in Chemistry went to AI that designs proteins. A lung disease drug went from idea to clinical trials in under 30 months. In Sweden, AI screening found 20 percent more breast cancers.

▸ 2024 Nobel Prize in Chemistry: AI that predicts and designs proteins (on “nobel prize”)
▸ A lung-disease drug: idea to clinical trials in under 30 months (on “lung disease”)
▸ Sweden: 20% more breast cancers found, with 44% less work for doctors (on “breast cancers”)

### superpowers: Neither superpower is going to stop.

It's also national security. China's official plan is to lead the world in AI by 2030, and the US restricts which AI chips China can buy. Neither superpower is going to stop.

▸ China's official plan: lead the world in AI by 2030 (on “official plan”)
▸ The US restricts which AI chips can be sold to China (on “restricts”)

### handoff: The best chips, software, connections and supply.

So NVIDIA has the best chips, software, connections and supply. The world's biggest companies and two biggest governments are building AI. The only way to stop NVIDIA is to stop innovation. Panshul will show you the numbers.

▸ The biggest companies and governments are all building AI (on “biggest governments”)
▸ The only way to stop NVIDIA is to stop innovation. (on “stop innovation”)

## PANSHUL

### last-quarter: Revenue in a single quarter

In the three months to October, NVIDIA's revenue was 116 billion dollars. In one quarter. More than double a year earlier, and six percent above what analysts expected.


### beats: Revenue has beaten consensus thirteen quarters running

And it isn't luck. Thirteen quarters in a row, revenue has beaten what analysts expected. The grey line is what analysts expected. The green line is what NVIDIA delivered. And look at this quarter: another beat. Earnings per share beat too, 2 dollars 68 against 2 47.

▸ Chart: NVIDIA quarterly revenue vs consensus
▸ The grey line is what analysts expected (on “analysts expected”)
▸ The green line is what NVIDIA delivered (on “delivered”)
🔍 Zoom in on FY27 Q3 (on “look at this quarter”)
▸ Earnings per share in the October quarter: $2.68, against $2.47 expected (on “earnings per share”)

### guidance: NVIDIA has told investors next quarter is bigger again

And next quarter is bigger again. NVIDIA has told investors to expect 130 billion dollars, give or take three percent. It raised its outlook for next year's revenue growth to about 75 percent, from 70. And the new Vera Rubin chips earned nearly 20 billion dollars in their first quarter of shipping.

▸ Chart: Revenue by quarter, with NVIDIA’s own guide for the next one
▸ Next quarter's guide: $130bn, give or take 3% (on “give or take”)
🔍 Zoom in on FY27 Q4 (guide)
▸ Next year's revenue growth outlook raised to about 75%, from 70% (on “raised”)
🔍 Zoom back out
▸ The new Vera Rubin chips earned nearly $20bn in their first quarter of shipping (on “vera rubin”)

### returns: The cash goes back to shareholders

A business this profitable hands the cash back. In the October quarter NVIDIA returned 28 billion dollars through buybacks and dividends. It still has 227 billion dollars of buyback authorization to use, and it plans to return all excess cash flow to shareholders.

▸ $28bn returned in the October quarter, through buybacks and dividends (on “october quarter”)
▸ $227bn of buyback authorization still to use, after adding $150bn (on “authorization”)
▸ NVIDIA plans to return all excess free cash flow, after strategic uses, to shareholders (on “excess”)

### peers: The cheapest of the five on this year's expected earnings

You might think it's expensive. On this year's expected earnings, it's the cheapest of the five big chip companies. On earnings already reported, it trades at about seventeen and three quarters times.

▸ Chart: Price/earnings: today and on this year’s expected earnings
▸ Forward P/E on the fiscal year ending around January 2027
🔍 Zoom in on NVIDIA (on “cheapest”)
▸ On earnings already reported over the last year it is 17.7x (on “already reported”)

### valuation: Our base case is worth far more than today's price

So what is it worth? We built a five-year cash-flow model. Our discount rate is ten and a half percent, the US chip-industry average, because NVIDIA holds more cash than debt. On that, our base case is about 391 dollars, against a price of 165. At Google Finance's higher rate it's 249, and at Bloomberg's about 167, roughly today's price. Our bear case, with rivals taking share and one soft year, is 102. If AI spending stops, 64.

▸ Chart: What one NVIDIA share is worth
▸ Discount rate 10.55%: the US chip-industry average (Damodaran) (on “discount rate”)
▸ Base case $391.38, against a price of $165.05 (on “base case”)
🔍 Zoom in on Base case
▸ At Google Finance's higher rate: $248.69. At Bloomberg's: $167.50 (on “google finance”)
🔍 Zoom back out
▸ Bear case $101.56. If AI spending stops: $64.41 (on “bear case”)

## MI'KAEL

### governance: Governance. The founder is back.

Let's start with the hard one: governance. This month Jensen Huang resigned as CEO, and the board reinstated him days later. It also created a committee of independent directors for national security and export control. The investigations reported by the SEC and California are still open, and we won't pretend that risk has gone.

▸ Jensen Huang resigned as CEO on 12 November 2026, and the board reinstated him days later (on “reinstated”)
▸ The board created an independent committee for national security and export control (on “committee”)
▸ SEC and California investigations have been reported, and are not yet closed (on “investigations”)

### renewables: NVIDIA's own operations now run on renewable energy

On the environment, NVIDIA's own operations now run on 100 percent renewable energy, up from about a third in 2018.

▸ Up from about a third in FY18
▸ Chart: Share of NVIDIA energy from renewables

### emissions-peers: NVIDIA's own emissions are tiny next to other chip makers

Now compare that with other chip companies. This is the carbon from each company's own buildings and the electricity they buy, for every million dollars of sales. NVIDIA emits about 48 kilograms. Intel, 25 tonnes. TSMC, a hundred and nine tonnes. To be fair, TSMC makes NVIDIA's chips, so those factory emissions count in TSMC's number, not NVIDIA's.

▸ Chart: Carbon per $1m of sales, from each company's own buildings and power (Scope 1 + 2)
▸ Carbon from each company's own buildings and the electricity they buy, per $1m of sales (on “every million dollars”)
🔍 Zoom in on NVIDIA (on “nvidia emits”)
🔍 Zoom in on TSMC (on “hundred and nine”)
▸ TSMC makes NVIDIA's chips, so the factory emissions count in TSMC's number, not NVIDIA's (on “factory emissions”)

### recommendation: Our recommendation: Buy.

Our recommendation is to buy. We would start with three percent of the portfolio, held for three to five years, well inside our ten percent limit. Our base case is about 391 dollars at the industry rate, and 249 even at Google Finance's higher one. At that size, our realistic bear case costs the portfolio about one percent, and the stress case under two. We would add only if cloud spending plans rise and the CEO investigation closes, and sell if those plans are cut.

▸ Start with three percent of the portfolio, well inside our ten percent limit on any one stock, for three to five years (on “three percent”)
▸ Base case $391.38 at the industry rate, and $248.69 even at Google Finance's higher one (on “even at google”)
▸ Sized so that our realistic bear case costs the portfolio about one percent, and the stress case under two percent (on “bear case”)
▸ We would add only if cloud spending plans rise again and the CEO investigation closes, and sell if they are cut (on “we would add”)

## ROB

### close: The AI industry runs on infrastructure NVIDIA built.

The AI industry runs on infrastructure NVIDIA built, and the company with the best hardware and the best software is the hardest one to replace. Our recommendation is to buy. Thank you.

▸ The best chips, the best software, the best connections and the best supply (on “best software”)
▸ Our recommendation is to buy. (on “to buy”)
