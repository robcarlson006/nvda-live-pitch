# The pitch script, draft 8 (generated from the slides)

> **FIGURES OUT OF DATE (24 Nov 2026, late):** this draft quotes a $165.05 price and 24.1bn basic shares. The current
> model uses **$152.85** and **24.186bn diluted shares**: base **$389.99** at 10.55% (Damodaran), **$247.81** at 14.45%
> (Google Finance), **$226.87** at 15.4% (Bloomberg Q3 2026); bear **$101.20**; if AI ended **$64.19**. `spine.yaml`
> (the teleprompter) is current. Regenerate this draft from it before printing.

Written 24 Nov 2026 from the `say` lines in `docs/script/spine.yaml`, so it matches the slides exactly. Lines starting with ▸ build on screen and are never spoken; 🔍 marks a zoom into the chart; 🎬 a muted video. Slides marked (optional) can be switched off from the operator panel.

**Length:** 1221 words. Read aloud at 150 words a minute with a short pause between slides it runs 9:11 (Rob 4:50, Panshul 2:01, Mi'kael 2:20), about 9:04 with the optional slide off. Measured with `app/scripts/deepgram-run.ts`, which also confirmed every slide moves on speech alone.

**Order:** Rob (the why, the bubble) → Panshul (the numbers) → Mi'kael (governance, competition, people, emissions, the recommendation) → Rob (the close).

**What changed from v7:** Mi'kael's ESG section is deeper. Governance now plays the Wall Street Journal clip of staff welcoming Jensen back (muted, credited). New "competition" slide: NVIDIA funds open-model companies that compete with the AI giants (Hugging Face, agreed and pending approval; Mistral, Black Forest Labs, AI21; Fireworks, Together, Replicate), with the circular-money catch said out loud. New "people" slide: 3.7% staff turnover (Bloomberg), Glassdoor #3, Fortune top 6 every year since 2022, TIME #6 for sustainable growth, and the honest weak spot (less social data published). New prepared answer for "Bloomberg says your social score is weak". To pay for the time: the superpowers slide is cut (export controls stay in the Q&A bank) and several lines are tighter.

**Check before you speak:** the 80% AI chip spending share, networking revenue ($31bn) and CUDA spend (~$0.5bn a year) are unverified. Check Jensen Huang's reinstatement and every date against a news source on the morning, and that the Hugging Face deal has not closed or been blocked. Figures are at a $165.05 share price and a 10.55% discount rate.

---

## ROB

### founding: 1993. A booth at Denny's.

In 1993, three engineers sat in a booth at a Denny's in San Jose. Their idea: 3D graphics on every PC, paid for by video games. People told them nobody starts a company to play games.

▸ Workstation 3D graphics, on every PC (on “every pc”)
▸ Paid for by video games (on “video games”)

### first-gpu: 1999: the world's first GPU.

In 1999 they launched the GeForce 256 and called it the GPU. Microsoft picked NVIDIA for the first Xbox, and by 2007 Forbes named it company of the year. They could have stopped there.

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

One: chips. Tensor Cores do exactly the maths AI needs, with a new generation every year. On paper, AMD's latest chip has more memory, 288 gigabytes against 192. But for every dollar AMD makes from data centres, NVIDIA makes twelve: 194 billion against 17.

▸ Tensor Cores, added in 2017, are circuits built for the maths of AI (on “tensor cores”)
▸ A new chip generation every year, so rivals are always aiming at last year's chip (on “every year”)
▸ On paper AMD has more memory: 288 GB against 192 GB. But NVIDIA sells the whole system (on “gigabytes”)
▸ In data centres, NVIDIA makes 11.6x what AMD makes (on “every dollar”)
▸ Chart: Data centre revenue, latest full year (on “billion against”)

### software: Two: software. Why CUDA is so hard to beat.

Two: software. Think iPhone versus Android. Six million developers write code for CUDA, with over a thousand free libraries. To switch, a company must rewrite its code and retrain its engineers, and AMD's answer arrived nine years behind. A rival can copy a chip, not twenty years of work.

▸ 6m developers write code for CUDA (on “developers”)
▸ More than 1,000 free libraries, refined since 2007 (on “libraries”)
▸ To switch, a company must rewrite its code and retrain its engineers (on “to switch”)
▸ AMD's answer, ROCm, arrived in 2016: nine years behind (on “years behind”)

### connections: Three: connections.

Three: connections. NVLink wires 72 chips in a single rack into one giant chip. In 2019 NVIDIA agreed to buy Mellanox for about seven billion dollars, and that networking business now makes over 31 billion a year.

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

Is this the dot-com bubble again? The interstate highways took about 1.1 percent of US GDP a year, the fibre boom about the same, the railroads 2.2. The AI build-out is projected at 3.6 percent: the biggest in American history.

▸ Chart: Average yearly spend during each build-out, share of US GDP (on “interstate highways”)
🔍 Zoom in on AI 2025–32 (on “projected at”)

### if-it-pops: And if the bubble does pop, NVIDIA is built to survive it.

And if the bubble pops? The share price would fall. But the dot-com crash wiped out companies built on ideas, not ones selling what people needed. NVIDIA owns both halves of AI, the hardware and the software, and when money gets tight the weakest bets are cut first. Our stress case, where AI spending stops, is 64 dollars a share.

▸ The dot-com crash wiped out companies built on ideas. The ones selling something people needed survived. (on “wiped out”)
▸ NVIDIA owns both halves of AI, the hardware and the CUDA software every AI developer already builds on (on “both halves”)
▸ When money gets tight, the weakest bets are cut first. The best platform is the last to lose customers. (on “cut first”)
▸ The share price would still fall. Our stress case, where AI spending stops, is $64.41 (on “stress case”)

### already-doing: AI isn't a fad.

And AI isn't a fad. The 2024 Nobel Prize in Chemistry went to AI that designs proteins. A lung disease drug reached clinical trials in under 30 months, and in Sweden, AI screening found 20 percent more breast cancers.

▸ 2024 Nobel Prize in Chemistry: AI that predicts and designs proteins (on “nobel prize”)
▸ A lung-disease drug: idea to clinical trials in under 30 months (on “lung disease”)
▸ Sweden: 20% more breast cancers found, with 44% less work for doctors (on “breast cancers”)

### handoff: The best chips, software, connections and supply.

So NVIDIA has the best chips, software, connections and supply, and the world's biggest companies and two biggest governments are building AI. The only way to stop NVIDIA is to stop innovation. Panshul?

▸ The biggest companies and governments are all building AI (on “biggest governments”)
▸ The only way to stop NVIDIA is to stop innovation. (on “stop innovation”)

## PANSHUL

### last-quarter: Revenue in a single quarter

In the three months to October, NVIDIA's revenue was 116 billion dollars. In one quarter. More than double a year earlier, and six percent above what analysts expected.


### beats: Revenue has beaten consensus thirteen quarters running

And it isn't luck. Revenue has beaten what analysts expected thirteen quarters in a row. The grey line is what analysts expected; the green line, what NVIDIA delivered. Look at this quarter: another beat, and earnings per share beat too, 2 dollars 68 against 2 47.

▸ Chart: NVIDIA quarterly revenue vs consensus
▸ The grey line is what analysts expected (on “analysts expected”)
▸ The green line is what NVIDIA delivered (on “delivered”)
🔍 Zoom in on FY27 Q3 (on “look at this quarter”)
▸ Earnings per share in the October quarter: $2.68, against $2.47 expected (on “earnings per share”)

### guidance: NVIDIA has told investors next quarter is bigger again

And next quarter is bigger again: 130 billion dollars, give or take three percent. NVIDIA raised next year's growth outlook to about 75 percent, from 70, and the new Vera Rubin chips earned nearly 20 billion dollars in their first quarter.

▸ Chart: Revenue by quarter, with NVIDIA’s own guide for the next one
▸ Next quarter's guide: $130bn, give or take 3% (on “give or take”)
🔍 Zoom in on FY27 Q4 (guide)
▸ Next year's revenue growth outlook raised to about 75%, from 70% (on “raised”)
🔍 Zoom back out
▸ The new Vera Rubin chips earned nearly $20bn in their first quarter of shipping (on “vera rubin”)

### returns: The cash goes back to shareholders

A business this profitable hands the cash back: 28 billion dollars in the October quarter, through buybacks and dividends. It still has 227 billion dollars of buyback authorization, and it plans to return all excess cash to shareholders.

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

So what is it worth? Our five-year cash-flow model uses a discount rate of ten and a half percent, the US chip-industry average, because NVIDIA holds more cash than debt. Our base case is about 391 dollars, against a price of 165. At Google Finance's higher rate it's 249; at Bloomberg's, about 167, roughly today's price. Our bear case, with rivals taking share and one soft year, is 102. If AI spending stops, 64.

▸ Chart: What one NVIDIA share is worth
▸ Discount rate 10.55%: the US chip-industry average (Damodaran) (on “discount rate”)
▸ Base case $391.38, against a price of $165.05 (on “base case”)
🔍 Zoom in on Base case
▸ At Google Finance's higher rate: $248.69. At Bloomberg's: $167.50 (on “google finance”)
🔍 Zoom back out
▸ Bear case $101.56. If AI spending stops: $64.41 (on “bear case”)

## MI'KAEL

### governance: Governance. The founder is back.

Let's start with the hard one: governance. Jensen Huang resigned as CEO this month, and the board reinstated him days later, with a new independent committee for national security and export control. The SEC and California investigations are still open, and we won't pretend that risk has gone.

🎬 Video, muted and looping: credited to The Wall Street Journal
▸ Jensen Huang resigned as CEO on 12 November 2026, and the board reinstated him days later (on “reinstated”)
▸ The board created an independent committee for national security and export control (on “committee”)
▸ SEC and California investigations have been reported, and are not yet closed (on “investigations”)

### open-ai: NVIDIA is funding competition to the AI giants.

NVIDIA is also funding competition to the AI giants. It has agreed to buy Hugging Face, home of open models, and backs Mistral, Black Forest Labs and AI21, which build them, and Fireworks, Together and Replicate, which run them. More choice keeps the giants' prices in check, and every model still needs chips. The catch: some of these firms buy NVIDIA chips, so we watch for money going round in a circle.

▸ Sharing open models: Hugging Face, which NVIDIA agreed to buy in September 2026, pending approval (on “hugging face”)
▸ Building them: Mistral, Black Forest Labs and AI21 Labs (on “mistral”)
▸ Running them: Fireworks AI, Together AI and Replicate (on “fireworks”)
▸ More choice keeps the giants' prices and lock-in in check, and whichever model wins still needs chips (on “more choice”)

### people: People want to work here, and they stay.

And people want to work there. Only 3.7 percent of staff left last year. Glassdoor ranks NVIDIA the third best place to work in America, Fortune has it in the top six every year since 2022, and TIME ranks it sixth in the world for sustainable growth. The weak spot: NVIDIA now publishes less social data, and as shareholders we would push for more.

▸ Glassdoor Best Places to Work 2026: #3 in the US (on “glassdoor”)
▸ Fortune 100 Best Companies to Work For: top 6 every year since 2022 (on “fortune”)
▸ TIME World's Best Companies in Sustainable Growth 2026: #6 (on “sustainable growth”)

### renewables: NVIDIA's own operations now run on renewable energy

On the environment, NVIDIA's own operations now run on 100 percent renewable energy, up from about a third in 2018.

▸ Up from about a third in FY18
▸ Chart: Share of NVIDIA energy from renewables

### emissions-peers: NVIDIA's own emissions are tiny next to other chip makers

Now compare other chip companies: the carbon from each one's own buildings and electricity, for every million dollars of sales. NVIDIA emits about 48 kilograms. Intel, 25 tonnes. TSMC, a hundred and nine tonnes. To be fair, TSMC makes NVIDIA's chips, so those factory emissions count in TSMC's number.

▸ Chart: Carbon per $1m of sales, from each company's own buildings and power (Scope 1 + 2)
▸ Carbon from each company's own buildings and the electricity they buy, per $1m of sales (on “every million dollars”)
🔍 Zoom in on NVIDIA (on “nvidia emits”)
🔍 Zoom in on TSMC (on “hundred and nine”)
▸ TSMC makes NVIDIA's chips, so the factory emissions count in TSMC's number, not NVIDIA's (on “factory emissions”)

### recommendation: Our recommendation: Buy.

Our recommendation is to buy: three percent of the portfolio, for three to five years. Our base case is 391 dollars, and 249 even at Google Finance's higher rate. Our bear case would cost the portfolio about one percent. We would add if cloud spending plans rise and the CEO investigation closes, and sell if those plans are cut.

▸ Start with three percent of the portfolio, well inside our ten percent limit on any one stock, for three to five years (on “three percent”)
▸ Base case $391.38 at the industry rate, and $248.69 even at Google Finance's higher one (on “even at google”)
▸ Sized so that our realistic bear case costs the portfolio about one percent, and the stress case under two percent (on “bear case”)
▸ We would add only if cloud spending plans rise again and the CEO investigation closes, and sell if they are cut (on “we would add”)

## ROB

### close: The AI industry runs on infrastructure NVIDIA built.

The AI industry runs on infrastructure NVIDIA built, and the company with the best hardware and the best software is the hardest one to replace. Our recommendation is to buy. Thank you.

▸ The best chips, the best software, the best connections and the best supply (on “best software”)
▸ Our recommendation is to buy. (on “to buy”)
