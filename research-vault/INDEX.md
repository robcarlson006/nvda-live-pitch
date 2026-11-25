# NVDA research vault — index
Built 2026-11-25T01:51:23 · 7 sources · 28 facts · 6 Q&A · 53 visuals

Open `gallery.html` for the visuals. Every fact below quotes its source word for word (checked against the saved page).

## Board questions (prepared answers)
### Q0001 · How much electricity could data centres consume globally, and is all of it AI?  _risk_
- Data centres include AI and other computing, so their total is not an AI-only footprint.
- The IEA estimates 415 TWh in 2024 and projects 945 TWh in 2030 in its base case.
- This is a forecast, and local grid pressure can be serious even if the global share remains modest.
  - facts: F0001, F0003, F0007
### Q0002 · Do more efficient NVIDIA chips mean AI electricity demand will fall?  _risk_
- No. Efficiency per workload can improve while total demand rises as usage expands.
- NVIDIA claims up to 25x lower energy for a specified Blackwell inference comparison, and up to 10x throughput per megawatt for Rubin on a specified model.
- These are vendor claims, not universal or independently verified results; the IEA still projects rising data-centre electricity use.
  - facts: F0011, F0012, F0003
### Q0003 · Could electricity constraints delay AI infrastructure expansion?  _risk_
- Yes. Grid connections and generation can constrain deployment, especially in local clusters.
- The IEA estimates about 20% of planned data-centre projects could face delays if grid risks are not addressed.
- This is a risk estimate, not a prediction that those projects will definitely be delayed.
  - facts: F0007
### Q0004 · Are NVIDIA operational energy needs falling as its products become more efficient?  _risk_
- No. Bloomberg records total energy use increasing from 815.86 thousand MWh in FY25 to 1,053.48 thousand MWh in FY26.
- Renewable energy is reported at 1,053.48 thousand MWh in FY26, but that does not establish the share of renewable electricity or customer energy use.
- Ask for independently verified absolute reductions and details of renewable procurement.
  - facts: F0025, F0026, F0027
### Q0005 · Do near-zero market-based electricity emissions mean NVIDIA has solved its climate impact?  _risk_
- No. Market-based operational electricity emissions are only one part of the footprint.
- Bloomberg data shows supply-chain and other Scope 3 emissions far exceed market-based Scope 2.
- These figures do not show that supply-chain or customer electricity emissions have been eliminated.
  - facts: F0021, F0024
### Q0006 · What is NVIDIA’s latest public CDP climate score?  _neutral_
- We have not verified NVIDIA’s latest public score and should not guess.
- CDP says its public scores for the current disclosure cycle are scheduled for release on December 2, 2026.
- Check the prior public score and then update the answer after the release.
  - facts: F0028

## emissions (13)
- **F0016** Bloomberg data records NVIDIA Scope 1 emissions of 8.89 thousand tonnes CO2e in FY24. _[medium; FY24]_ — our data: data/clean/nvda_emissions.json
- **F0017** Bloomberg data records NVIDIA Scope 1 emissions of 9.05 thousand tonnes CO2e in FY25. _[medium; FY25]_ — our data: data/clean/nvda_emissions.json
- **F0018** Bloomberg data records NVIDIA Scope 1 emissions of 9.82 thousand tonnes CO2e in FY26. _[medium; FY26]_ — our data: data/clean/nvda_emissions.json
- **F0019** Bloomberg data records NVIDIA Scope 2 (market-based) emissions of 40.56 thousand tonnes CO2e in FY24. _[medium; FY24]_ — our data: data/clean/nvda_emissions.json
- **F0020** Bloomberg data records NVIDIA Scope 2 (market-based) emissions of 0 thousand tonnes CO2e in FY25. _[medium; FY25]_ — our data: data/clean/nvda_emissions.json
- **F0021** Bloomberg data records NVIDIA Scope 2 (market-based) emissions of 0.57 thousand tonnes CO2e in FY26. _[medium; FY26]_ — our data: data/clean/nvda_emissions.json
- **F0022** Bloomberg data records NVIDIA Scope 3 emissions of 3638.43 thousand tonnes CO2e in FY24. _[medium; FY24]_ — our data: data/clean/nvda_emissions.json
- **F0023** Bloomberg data records NVIDIA Scope 3 emissions of 6912.58 thousand tonnes CO2e in FY25. _[medium; FY25]_ — our data: data/clean/nvda_emissions.json
- **F0024** Bloomberg data records NVIDIA Scope 3 emissions of 10700.9 thousand tonnes CO2e in FY26. _[medium; FY26]_ — our data: data/clean/nvda_emissions.json
- **F0025** Bloomberg data records NVIDIA total energy of 815.86 thousand MWh in FY25. _[medium; FY25]_ — our data: data/clean/nvda_energy.json
- **F0026** Bloomberg data records NVIDIA total energy of 1053.48 thousand MWh in FY26. _[medium; FY26]_ — our data: data/clean/nvda_energy.json
- **F0027** Bloomberg data records NVIDIA renewable energy of 1053.48 thousand MWh in FY26. _[medium; FY26]_ — our data: data/clean/nvda_energy.json
- **F0028** CDP says public corporate scores and A Lists for 2026 are scheduled for publication on 2 December 2026. _[high; 2026 disclosure cycle]_ — CDP (2026-11-25) https://www.cdp.net/en/companies/companies-scores

## energy-ai (15)
- **F0001** IEA estimates global data centres used about 415 TWh of electricity in 2024. _[medium; 2024]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0002** IEA estimates data centres accounted for 1.5% of global electricity consumption in 2024. _[medium; 2024]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0003** IEA projects data centres will consume around 945 TWh globally in 2030 in its base case. _[medium; 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0004** IEA projects data centres will use just under 3% of global electricity in 2030 in its base case. _[medium; 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0005** IEA estimates data centre electricity consumption grew around 12% per year globally since 2017. _[medium; 2017–2024]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0006** IEA projects accelerated-server electricity consumption, mainly driven by AI adoption, to grow by 30% annually in its base case. _[medium; to 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0007** IEA estimates around 20% of planned data centre projects could face delays if electricity grid risks are not addressed. _[medium; 2025 estimate]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0008** IEA projects electricity-related data centre emissions to rise from 180 Mt to 300 Mt by 2035 in its base case. _[medium; 2035 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0009** IEA high-efficiency scenario projects global data centre electricity use of around 970 TWh in 2035. _[medium; 2035 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0010** IEA headwinds scenario projects global data centre electricity demand plateauing around 700 TWh. _[medium; 2035 scenario]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0011** NVIDIA claims its GB200 NVL72 reduces energy consumption by up to 25x versus the same number of H100 GPUs for LLM inference; this is a vendor claim. _[medium; 2024 vendor claim]_ — NVIDIA (2024-03-18) https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
- **F0012** NVIDIA claims Vera Rubin NVL72 delivers up to 10x token throughput per megawatt versus GB200 NVL72 at comparable interactivity on Kimi-K2-Thinking; this is a workload-specific vendor claim. _[medium; 2026 vendor claim]_ — NVIDIA (2026-01-05) https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/
- **F0013** IEA projects data centre electricity consumption in United States increases by around 240 TWh from 2024 to 2030 in its base case. _[medium; 2024 to 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0014** IEA projects data centre electricity consumption in China increases by around 175 TWh from 2024 to 2030 in its base case. _[medium; 2024 to 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0015** IEA projects data centre electricity consumption in Europe increases by more than 45 TWh from 2024 to 2030 in its base case. _[medium; 2024 to 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
