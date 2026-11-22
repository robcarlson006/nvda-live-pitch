# Rob's Why: rough script (draft 1)

Source of truth is the "Script draft" tab of the doc "NVIDIA Pitch – Part 1: The Why". This file is a copy for Claude Code, made 21 Nov 2026.

This is a rehearsal draft of about 1,600 spoken words, roughly 11 minutes at normal pace. Rob's slot is about 3–4 minutes of a 10-minute pitch, so expect to cut around 60%. Beats marked ✂ are the first to go.

**How to read it:** this is only what we say. Claude Code decides what builds on screen and when, reacting live to the speech. **[VERIFY]** = a figure from NotebookLM that needs a primary source before it goes on a slide.

**Running order:** Rob (why) → Panshul (financials) → Mi'kael (ESG) → Rob (close).

## Act 1: Origin

### Beat 1. Cold open

In 1993, three engineers, Jensen Huang, Chris Malachowsky and Curtis Priem, sat in a booth at a Denny's in San Jose and drank a lot of coffee. Their idea was simple. The 3D graphics that lived on expensive workstations should be on every PC. And the way to pay for it was video games. People told them nobody starts a company to play games.

### Beat 2. Nearly going bust ✂

Their first chip, the NV1, bet on the wrong technology. Of 250,000 made, about 249,000 came back. NVIDIA had less than six months of cash. Their next chip, for Sega, was heading the same way, so they told Sega's CEO the truth. Sega invested five million dollars anyway. With about one month of payroll left, they bet the company on the RIVA 128. It launched in August 1997 and sold a million units in four months.

### Beat 3. The first GPU

In 1999 they launched the GeForce 256 and gave it a new name: the GPU. In 2000 Microsoft picked NVIDIA for the first Xbox and paid two hundred million dollars up front. By 2007, Forbes named NVIDIA company of the year. A successful gaming company. They could have stopped there.

## Act 2: The bet

### Beat 4. What CUDA is

Instead, in November 2006, they announced CUDA. Here's the idea. A normal processor is a handful of very fast workers doing one job after another. A graphics chip is thousands of smaller workers all doing the same job at the same time, in parallel. The screen behind me is exactly that: thousands of cores firing together. CUDA let anyone, not just graphics programmers, put those thousands of workers to work. It grew out of a Stanford PhD project by Ian Buck, who NVIDIA hired in 2004. And here's the part that matters: they gave it away for free, and they built it into every gaming card they sold.

### Beat 5. Wall Street hated it

Wall Street hated it. CUDA made every chip bigger and more expensive, for gamers who didn't care. NVIDIA was spending around half a billion dollars a year on it [VERIFY]. The stock fell by more than half in 2008, and as late as 2013 an activist fund was questioning the spending. Look at revenue: stuck at three to four billion dollars for years. Shareholders wanted profits, not innovation. NVIDIA held on, because innovation is what creates the profits.

### Beat 6. The payoff

In 2009, a Stanford team led by Andrew Ng showed that CUDA graphics cards could train neural networks up to 70 times faster. Then in 2012, a student at the University of Toronto, Alex Krizhevsky, entered an image-recognition contest with a neural network trained on two NVIDIA gaming cards. He won by more than ten points: an error rate of 15 percent against 26. Anyone who wanted to copy him needed CUDA. In 2016 NVIDIA declared the AI revolution, and Jensen personally delivered its first AI supercomputer to a small lab called OpenAI. By the time ChatGPT launched in 2022, CUDA had fifteen years of tools built on it. Modern AI was built on NVIDIA.

### Beat 7. What the bet did ✂ (or merge into Beat 6)

Here's what that bet did. Twenty-seven years of revenue. Three to four billion a year for a decade, and then this. Panshul will show you whether it lasts. My job is to show you why it happened.

## Act 3: Why NVIDIA is the gold standard

### Beat 8. Four layers

So why is NVIDIA the gold standard? Four layers. And a competitor has to beat all four at once.

### Beat 9. Chips

One: chips. On paper, AMD's latest chip beats NVIDIA's main one. It has 288 gigabytes of memory against 192, and it's cheaper. Yet for every dollar AMD makes from data centres, NVIDIA makes about twelve. Last year that was about 194 billion dollars against 17. Why? Because a chip is only as good as the software that runs on it.

### Beat 10. Software

Two: software. Think iPhone versus Android. NVIDIA builds the hardware and the software together, so it just works. More than six million developers use CUDA. It has over a thousand libraries, refined for nearly twenty years, and it's free. AMD's answer, ROCm, launched in 2016, nine years behind. When a new AI breakthrough comes out, it's written for CUDA on day one. Everyone else gets it months later, if at all.

> **Note:** I've left out the CUDA licence ban on translation layers. The DOJ, EU and China are all investigating NVIDIA over lock-in, so raising it to an ESG board invites a governance question. Keep it for Q&A if needed.

### Beat 11. Connections

Three: connections. NVIDIA's NVLink wires 72 chips in a single rack so tightly that the software sees them as one giant chip. Then, in 2019, NVIDIA agreed to buy Mellanox, the company whose networking links those racks into clusters of a hundred thousand chips. It paid about seven billion dollars. Last year, that networking business made more than 31 billion [VERIFY]. In one year.

### Beat 12. Supply

Four: supply. About nine in ten of the world's most advanced chips are made by one company, TSMC, in Taiwan. The real bottleneck is the packaging that assembles AI chips, and NVIDIA has reserved around 60 percent of it. Its supply commitments have reached 279 billion dollars [VERIFY]. So even if you design a better chip, you can't get enough of it built.

### Beat 13. Can anyone catch up?

Has anyone caught up? Google has come closest, with its own chips, software and networking. That's eleven years and tens of billions of dollars. Amazon, Microsoft and Meta are trying too, and they all still buy NVIDIA. Microsoft is its biggest customer. NVIDIA still trains over 90 percent of AI models and takes about 80 percent of all AI chip spending [VERIFY]. To compete with NVIDIA, you have to be one of the richest companies on earth, with a decade to spare.

> **Note:** This replaces "7 out of 10 servers". Taken literally that's wrong: AI servers are only about 17% of servers shipped. The defensible versions are ~80% of AI chip revenue and ~90% of AI training.

### Beat 14. Not one person ✂ (check with Panshul so it isn't duplicated)

And NVIDIA isn't one person. Co-founder Chris Malachowsky is still there. The people who run its sales, its supply chain, its research and its finances have worked together for fifteen to twenty years. Ian Buck, who built CUDA, still runs it. In 2023, Glassdoor ranked NVIDIA the best place to work in America.

## Act 4: AI isn't going away

### Beat 15. Is it a bubble?

The obvious question: is this the dot-com bubble again? Look at the scale. Building the interstate highways took about 1.1 percent of US GDP a year. The dot-com fibre boom, at its peak in 2000: 1.4 percent. The railroads: 2.2. The AI build-out is projected at more than 3.6 percent of GDP every year to 2032. That makes it the biggest infrastructure project in American history, relative to the size of the economy.

### Beat 16. Why it's different ✂

But this is different in two ways. In 2000, Cisco, the NVIDIA of its day, traded at about 140 times its expected earnings. NVIDIA today trades at a fraction of that. And in 2000 only a few percent of the fibre that was laid actually got used. Today, US data centres are almost completely full. The companies paying for this are some of the most profitable in history. Panshul will take you through the numbers, including the risks.

> **Note:** The research also says the build-out is shifting to debt, and that two-thirds of the spend is on chips that last only 3–6 years. That's the board's best bubble argument, so prepare a Q&A slide for it.

### Beat 17. What AI is already doing

And AI isn't a fad, because of what it's already doing. In 2024 the Nobel Prize in Chemistry went to AI work on proteins: predicting the shape of almost every protein known, and designing new proteins that don't exist in nature. A drug for a lung disease went from idea to clinical trials in under 30 months, less than half the usual time. In Sweden, AI-assisted screening found 20 percent more breast cancers while cutting doctors' workload by 44 percent.

### Beat 18. The everyday person ✂

For everyday people, it's already making work faster. In one study, business writers finished tasks 40 percent faster, with better quality. Customer support staff solved 14 percent more problems, and new staff 34 percent more. People worry robots will take jobs. When ATMs arrived, everyone said bank tellers were finished. Instead, banks opened more branches and teller jobs grew. AI takes over tasks, and leaves people more time for creative work.

> **Note:** The board may push back with the Stanford finding that jobs for developers aged 22–25 fell 20%. Prepare an answer.

### Beat 19. National security

AI is also now a matter of national security. This month, Google's threat intelligence team reported hacking software that found security flaws, wrote the attack and launched it with zero humans involved [VERIFY]. Last year, Anthropic found a state-backed group using AI to carry out 80 to 90 percent of a spying campaign. These AI agents work 24 hours a day. How do you defend yourself against them? With AI. Google's own AI has already found security flaws before attackers could use them.

### Beat 20. Two superpowers

And the world's two superpowers know it. China's official plan is to lead the world in AI by 2030. The US treats AI chips as so strategic that it restricts which ones can be sold to China. Neither side is going to stop.

> **Note:** NVIDIA now assumes zero data centre revenue from China, so the board could say the race helps Huawei, not NVIDIA. Prepare a Q&A answer.

### Beat 21. Handoff

NVIDIA has the best chips, the best software, the best connections and the best supply chain. The world's biggest companies and its two biggest governments are all building AI. The only way to stop NVIDIA is to stop innovation. Panshul is going to show you whether the numbers back that up.

## Close (Rob, after Mi'kael's ESG section)

### Beat 22. The reveal

One more thing. Every visual, every bullet point, every chart and every animation you just saw was built live, as we spoke.

### Beat 23. Final line

Everything you just watched was built and run by AI. The AI industry runs on infrastructure NVIDIA built. If three university students can do this for a stock pitch, imagine what the world's companies are doing.

## Cutting to 3–4 minutes

- **Cut first:** Beats 2, 7, 14, 16 and 18 (all marked ✂).
- **Then shorten:** Beat 6 down to AlexNet only; Beats 10–12 to two sentences each; Beats 19–20 into one beat.
- **Keep:** the Denny's opening, CUDA, Wall Street hating it, the four layers, the GDP comparison, the Nobel Prize, and the handoff line.
