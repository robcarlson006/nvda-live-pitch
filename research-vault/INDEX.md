# NVDA research vault — index
Built 2026-11-25T09:41:22 · 352 sources · 1103 facts · 537 Q&A · 330 visuals

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
### Q0007 · Does liquid cooling mean a data centre uses no water?  _risk_
- No. A closed loop at the server does not establish zero water use for the whole site.
- Cooling towers and electricity generation can still use water.
- Ask for measured site-level consumption, water stress and the electricity supply footprint.
  - facts: F0030, F0031, F0036
### Q0008 · Which water footprint should the board ask NVIDIA to disclose?  _risk_
- Ask for water withdrawals and consumption across NVIDIA, chip suppliers and customers, with site-level context.
- Cooling, electricity generation and server manufacturing all matter.
- These different boundaries must not be added blindly or confused with each other.
  - facts: F0029, F0030
### Q0009 · How much electricity does a text AI query actually use?  _neutral_
- Google measured 0.24 Wh for its median Gemini Apps text prompt in May 2025, including serving overhead.
- That is one company’s result, not a measurement of this presentation; longer or less efficiently served prompts can consume more.
- It does not measure the full footprint of building the models and equipment.
  - facts: F0037, F0040
### Q0010 · Are generated images and videos more energy intensive than text?  _risk_
- A published benchmark found image generation used more energy than text generation on its tested hardware.
- Its text task used very short outputs, so the results are not a universal ratio for modern products.
- We lack a reliable comparable measurement for video, and cannot quantify our presentation’s use.
  - facts: F0041, F0042, F0043, F0047
### Q0011 · Won’t greater AI efficiency simply lead to more energy use through rebound?  _risk_
- It can: cheaper AI may encourage more use or more compute-intensive tasks, so efficiency alone cannot guarantee lower total demand.
- Google reports a large fall in energy per prompt, while the IEA still projects a strong rise in data-centre electricity use.
- The size of the rebound is uncertain; we should track total electricity and emissions as well as energy per query.
  - facts: F0039, F0044, F0045, F0001, F0003
### Q0012 · You used AI for a slideshow. Isn’t that environmentally wasteful?  _risk_
- It consumes energy and water; we have not measured this presentation’s footprint, so we cannot claim it is negligible.
- Google measured 0.24 Wh for its median Gemini text prompt, including serving overhead; that is not a measurement of our system.
- We would measure the actual workloads and infrastructure, and reduce unnecessary use.
  - facts: F0037, F0030 · visuals: V0052
### Q0013 · Does NVIDIA’s low operational emissions intensity prove it is cleaner than its chip manufacturer?  _risk_
- No. The comparison excludes most of NVIDIA’s supply-chain footprint and compares companies with different activities.
- Bloomberg records NVIDIA at 0.048 and TSMC at 108.743 tonnes CO2 per million dollars of sales, using different fiscal years.
- NVIDIA’s Scope 3 emissions must also be assessed; neither the comparison nor the score proves total impact is lower.
  - facts: F0053, F0054, F0024 · visuals: V0036, V0053
### Q0014 · Why has NVIDIA’s social disclosure score fallen, and does that mean its workforce practices have worsened?  _risk_
- The decline is a disclosure concern, but the score alone cannot establish why it fell or prove that working conditions deteriorated.
- Bloomberg records a social disclosure score of 51.62 in FY22 and 5.37 in FY25.
- We would seek the scoring methodology and evidence on workforce and supplier conditions before drawing a stronger conclusion.
  - facts: F0049, F0050 · visuals: V0024
### Q0015 · How vulnerable is NVIDIA to losing a major customer?  _risk_
- Customer concentration is a material risk: losing or reducing orders from a large direct customer could affect revenue.
- The project dataset sums the three disclosed direct customer shares to 36% of revenue in Q3 FY27.
- Direct customers can include intermediaries; the figure does not identify end users or predict the financial effect of a lost order.
  - facts: F0048 · visuals: V0017
### Q0016 · Why should we trust your valuation if the discount rate is disputed?  _risk_
- Treat the valuation as a scenario, not a price forecast: it is highly sensitive to the discount rate and other assumptions.
- Our model produces $389.99 per share at the industry rate and $226.87 at Bloomberg’s 15.4% WACC.
- Both are model outputs, not guarantees; cash flow and long-term growth assumptions also need scrutiny.
  - facts: F0051, F0052 · visuals: V0013
### Q0017 · Does NVIDIA attract and retain staff, and what are the caveats?  _neutral_
- The available indicators suggest strong retention and a positive reputation as an employer.
- Bloomberg data records FY26 staff turnover of 3.7%; the project dataset records a Glassdoor US rank of 3 for 2026.
- Rankings reflect their own methods; turnover alone does not prove pay fairness or good conditions.
  - facts: F0055, F0060
### Q0018 · Is NVIDIA making progress on workforce diversity?  _risk_
- The available figure shows room to improve representation, but does not establish a trend.
- Bloomberg data records women as 21.6% of the workforce in FY26.
- We have not independently verified a comparable historical series or pay equity data.
  - facts: F0058
### Q0019 · Does Jensen Huang chair NVIDIA as well as run it?  _neutral_
- No. Huang is president and CEO; Harvey Jones remains board chair after Huang’s return.
- Separating the roles supports independent oversight, though it does not itself resolve the continuing investigation.
  - facts: F0066, F0069, F0071
### Q0020 · Did the board clear Huang by reinstating him?  _risk_
- No. The board said its independent committee’s investigation would proceed to conclusion.
- The committee retained independent counsel; NVIDIA also said it would continue cooperating with government investigations and inquiries.
- The board expressed confidence in Huang’s leadership, but the unresolved inquiries remain a material governance risk.
  - facts: F0068, F0070, F0071, F0072
### Q0021 · What oversight has NVIDIA added for national security and exports?  _neutral_
- The board created a standing committee for national security, export compliance and trade risk.
- Suzanne Nora Johnson chairs it alongside Stephen Neal and John Dabiri; the company says it is composed solely of independent directors.
- NVIDIA is also searching for a chief compliance officer, so the effectiveness of these changes remains to be demonstrated.
  - facts: F0074, F0075, F0073, F0070
### Q0022 · Are hyperscalers the whole NVIDIA growth story?  _neutral_
- No. The project dataset groups AI clouds, industrial and enterprise into a substantial and fast-growing category.
- Hyperscalers were 51.9% of total revenue in the preliminary quarter; the combined other group was 41%.
- The categories do not reveal each buyer or separate sovereign, industrial and enterprise demand.
  - facts: F0079, F0080, F0083 · visuals: V0002
### Q0023 · Does rapid growth outside hyperscalers eliminate concentration risk?  _risk_
- No. Growth outside hyperscalers broadens demand, but direct customer exposure remains material.
- The three largest direct customers accounted for 36% of revenue in the quarter.
- Intermediaries can buy on behalf of end users, so direct-customer and end-user exposures cannot simply be added.
  - facts: F0048, F0081, F0083
### Q0024 · Does sovereign AI create a dependable new market for NVIDIA?  _neutral_
- It creates a credible public-compute opportunity, but programme budgets are not NVIDIA revenue and future orders are uncertain.
- The UK’s Isambard-AI uses 5,448 NVIDIA GH200 superchips and Bristol says users began accessing the full system in 2025.
- Competition is real: Dawn uses Intel GPUs and Zenith was built with AMD and other partners.
  - facts: F0091, F0092, F0096, F0097
### Q0025 · Can a publicly funded NVIDIA supercomputer be environmentally responsible?  _neutral_
- Efficient design can reduce overhead, but it does not eliminate the environmental cost of AI compute.
- Bristol reports a power usage effectiveness around 1.08 at Isambard-AI and describes a closed-loop liquid cooling system.
- PUE does not disclose the facility’s total electricity use, lifecycle emissions or net water consumption; request those measures before drawing a broader conclusion.
  - facts: F0099, F0100
### Q0026 · How much of UK sovereign AI funding goes directly to NVIDIA?  _risk_
- The published programme figures do not tell us how much NVIDIA receives.
- Bristol says the Sovereign AI programme has £500 million of UK government funding and provides its portfolio companies access to Isambard-AI.
- The government also describes a separate £1 billion compute commitment; these figures are not NVIDIA contract values and must not be added as NVIDIA sales.
  - facts: F0098, F0094
### Q0027 · Are NVIDIA’s supply-chain emissions falling as its business grows?  _risk_
- No. The available Bloomberg series shows reported supply-chain and other indirect emissions rising over the last two reported fiscal years.
- This is an absolute emissions series, not emissions per dollar of revenue.
- Confirm reporting boundaries and primary disclosures before attributing the increase to particular activities.
  - facts: F0022, F0023, F0024 · visuals: V0053
### Q0028 · Does the Ecolab partnership prove NVIDIA data centres save water?  _risk_
- No. The partnership describes cooling technologies and an ambition, not independently measured site-level water savings.
- Ecolab says NVIDIA collaborated on coolant qualification, monitoring and AI factory technologies.
- Request measured whole-site water consumption, local water stress and electricity-related water use before claiming savings.
  - facts: F0032, F0036, F0030
### Q0029 · Does next quarter’s revenue guidance mean growth is accelerating?  _neutral_
- The company guides revenue higher than the latest quarter.
- The next quarter includes an extra week, so the headline comparison is not like for like.
- Guidance is a forecast, not a guarantee.
  - facts: F0108, F0103, F0119
### Q0030 · Why might profitability weaken despite strong sales?  _risk_
- The company guides gross margin below the latest quarter while forecasting higher operating expenses.
- The release does not quantify the causes of the margin change.
  - facts: F0104, F0111, F0112, F0113
### Q0031 · Is growth broad-based across NVIDIA’s businesses?  _risk_
- Both reported businesses grew, but Data Center grew much faster than Edge Computing.
- This makes the outlook particularly dependent on Data Center demand.
  - facts: F0120, F0121, F0115, F0116 · visuals: V0055
### Q0032 · Does NVIDIA still disclose compute and networking separately?  _risk_
- The last split identified in these releases is from the first quarter under the new reporting framework.
- Networking grew faster than compute year on year in that quarter, but later releases use a different customer-based breakdown.
- Do not extrapolate the split without a comparable current disclosure.
  - facts: F0135, F0136, F0148
### Q0033 · Are robotics and automotive already a major standalone revenue engine?  _risk_
- Automotive was small beside Data Center in the last quarter before the reporting change, although it was still growing.
- Robotics is discussed in product announcements, but its separate revenue is not established by these figures.
- The newer Edge category groups several activities, so it cannot isolate robotics.
  - facts: F0132, F0139, F0148
### Q0034 · Do custom AI chips automatically reduce environmental impact?  _risk_
- No. A custom chip can improve efficiency on a particular workload, but that alone does not establish lower total emissions.
- Google reports an efficiency gain over its earlier TPU; Meta reports its early chip was not yet optimized for its hardest recommendation models.
- Ask for comparable workload, system energy and lifecycle data before claiming an ESG advantage.
  - facts: F0156, F0159, F0160
### Q0035 · Does NVIDIA face competition in both training and inference?  _risk_
- Yes. Google and Amazon offer alternatives aimed at training and inference, and Intel offers another accelerator.
- Meta has also built custom recommendation silicon for its own workloads.
- Vendor specifications do not establish market share or prove an equivalent real-world performance comparison.
  - facts: F0150, F0155, F0158, F0161
### Q0036 · Does CUDA lock customers in, or can they switch to AMD?  _neutral_
- CUDA creates practical switching costs, but it is not an absolute lock-in.
- NVIDIA libraries are used by AI frameworks; AMD offers HIPIFY conversion and says most CUDA libraries have HIP counterparts.
- Migration still requires testing, and AMD documents compatibility gaps; no general switching-cost estimate is established here.
  - facts: F0165, F0166, F0168, F0169, F0170, F0171, F0172
### Q0037 · Could open software undermine NVIDIA’s CUDA advantage?  _risk_
- Yes: alternatives could reduce the moat, although portability and performance must be tested for each workload.
- AMD offers HIP and conversion tooling, Intel describes the oneAPI ecosystem, and Triton provides a parallel programming language and compiler.
- Their existence alone does not establish full compatibility, equal performance or the scale of adoption.
  - facts: F0168, F0169, F0173, F0174
### Q0038 · How does NVIDIA make money from software, and how much does it earn?  _neutral_
- NVIDIA offers AI Enterprise as a commercial software suite, alongside free tools for development and prototyping.
- The suite combines AI software with infrastructure management and support.
- A standalone software revenue figure is not established by the sources checked, so do not treat data-centre hardware revenue as software revenue.
  - facts: F0175, F0177
### Q0039 · Does NVIDIA’s outlook assume China sales will recover?  _risk_
- No. Its outlook assumes no Data Center compute revenue from China.
- That assumption makes the forecast different from a claim that sales there will resume.
- Export restrictions and the future policy environment remain uncertain.
  - facts: F0110
### Q0040 · Can we compare Gaming and Automotive revenue directly with the latest Edge Computing result?  _risk_
- Not as a like-for-like standalone trend. NVIDIA changed its reported market platforms.
- Edge Computing combines PCs, consoles, workstations, robotics and automotive.
- Seek a reconciled historical series before attributing Edge growth to any one activity.
  - facts: F0148, F0116, F0140, F0142
### Q0041 · Has NVIDIA guaranteed gross margins will recover after the coming quarter?  _risk_
- No. Management expects the coming quarter to mark a low point, followed by improvement, but that is a forecast.
- The company guides the coming quarter below the latest reported gross margin.
- Product mix and future execution could differ from management expectations.
  - facts: F0126, F0111, F0104, F0127
### Q0042 · Why does networking matter to the NVIDIA investment case?  _strength_
- Networking helps the GPUs work together, so NVIDIA can sell more of the infrastructure around the accelerator.
- NVLink connects GPUs within a compute domain, while scale-out networks connect servers across the data center.
- Networking revenue reached $14.8 billion in Q1 FY27, but that historical growth does not guarantee future share or margins.
  - facts: F0180, F0181, F0136, F0188
### Q0043 · Does Ethernet make NVIDIA InfiniBand irrelevant?  _neutral_
- Not necessarily: NVIDIA sells both InfiniBand and Ethernet for scale-out networking.
- Quantum-X800 uses InfiniBand, while Spectrum-X800 uses Ethernet and targets multi-tenant AI clouds and enterprises.
- Customers have alternatives, including Broadcom Ethernet switching; headline speeds do not prove who wins on actual workloads.
  - facts: F0183, F0186, F0187
### Q0044 · Can Broadcom compete with NVIDIA in AI networking?  _risk_
- Yes. Broadcom sells Ethernet switch silicon with features aimed at AI traffic, so NVIDIA does not own the entire networking market.
- Broadcom specifies its Tomahawk 5 chip at up to 51.2 Tb/s and describes adaptive routing and congestion control for AI workloads.
- A chip specification alone does not establish end-to-end performance, market share, or relative profitability.
  - facts: F0186, F0187
### Q0045 · Why did NVIDIA buy Mellanox?  _neutral_
- The acquisition brought high-performance networking into NVIDIA alongside its computing business.
- NVIDIA completed the acquisition in 2020 at a $7 billion transaction value.
- That strengthened its system offering, but it still competes with Ethernet suppliers.
  - facts: F0179, F0186
### Q0046 · How do NVLink, InfiniBand and Spectrum-X fit together?  _neutral_
- NVLink is the scale-up fabric that links GPUs within a compute domain; InfiniBand and Ethernet can connect servers across a data center.
- NVIDIA markets Quantum-X800 as InfiniBand and Spectrum-X800 as Ethernet for cloud and enterprise workloads.
- These are vendor descriptions, so actual workload performance and the cost of competing designs need independent comparison.
  - facts: F0180, F0181, F0189, F0183
### Q0047 · Can NVIDIA manufacture enough advanced packages to meet demand?  _risk_
- Capacity remains a material bottleneck, and NVIDIA is paying suppliers to expand it.
- The company has announced packaging agreements with Amkor in Arizona and South Korea, as well as a Taiwan expansion with SPIL.
- These are multi-year plans, not guaranteed completed capacity; current Vera Rubin shipments still rely on TSMC CoWoS.
  - facts: F0191, F0192, F0193, F0195
### Q0048 · Does Arizona manufacturing eliminate NVIDIA’s Taiwan supply-chain exposure?  _risk_
- No. Arizona packaging investment adds geographic capacity, but does not eliminate reliance on Taiwan.
- NVIDIA says Vera Rubin products use TSMC manufacturing and CoWoS, while a separate SPIL packaging expansion is in Taiwan.
- The Arizona arrangement is a future capacity commitment and does not establish an independent end-to-end supply chain.
  - facts: F0191, F0192, F0193
### Q0049 · What other supply-chain bottlenecks could hold back AI hardware shipments?  _risk_
- Substrates, semiconductor testing and optical components can constrain production alongside advanced packaging.
- NVIDIA has announced substrate, testing and optical-engine expansions with several suppliers.
- Most of the additional capacity is planned for future years, so execution and demand forecasts matter.
  - facts: F0196, F0197, F0199, F0201
### Q0050 · How much did the H20 restrictions actually cost NVIDIA?  _risk_
- The restrictions caused a material charge and prevented shipments, but the figures measure different effects and must not be added.
- NVIDIA recorded a $4.5 billion charge and could not ship another $2.5 billion of H20 revenue in the first quarter of fiscal 2026.
- Its later $8 billion estimate was a forecast of lost revenue, not reported profit or a realised outcome.
  - facts: F0204, F0206, F0207
### Q0051 · Can investors count on China sales returning?  _risk_
- No: licensing and policy can change, and NVIDIA has stopped shipping licensed Hopper data centre products to China.
- Its latest outlook assumes no China data centre compute revenue, although the latest transcript reports $2.4 billion of licensed Hopper sales to China in the preceding quarter.
  - facts: F0211, F0212, F0110
### Q0052 · How is NVIDIA overseeing export control and national security risk?  _neutral_
- The board has established a standing committee to oversee national security, export compliance and global trade risk.
- NVIDIA says it will meet at least quarterly; creating oversight is not proof that diversion has been eliminated.
  - facts: F0213, F0214
### Q0053 · Could competition regulators constrain NVIDIA’s ecosystem and acquisitions?  _risk_
- Yes: competition scrutiny is a material risk, though the joint statement is not a finding that NVIDIA broke the law.
- US, UK and EU authorities warned about concentrated access to AI inputs and said they would scrutinise lock-in and partnerships.
- The proposed Arm takeover was abandoned after significant regulatory challenges, illustrating acquisition risk.
  - facts: F0216, F0222, F0223, F0224, F0225
### Q0054 · Does the EU AI Act make NVIDIA chips illegal or stop AI investment?  _neutral_
- No: the Commission describes risk-based rules for AI developers and deployers, not a blanket ban on NVIDIA chips.
- The rules for general-purpose AI models are effective, and providers of models posing systemic risks should assess and mitigate them.
- Compliance obligations and potential effects on adoption depend on the specific product, role and use; these sources do not quantify NVIDIA’s exposure.
  - facts: F0226, F0227, F0228, F0229
### Q0055 · What does the EU AI Act mean for the AI-generated presentation?  _neutral_
- The Act creates transparency obligations, but the obligations for this specific presentation depend on its use and who supplies or deploys the system.
- The Commission says generative AI providers must ensure content is identifiable and its transparency rules apply from August 2026.
- We should disclose the AI contribution and check the applicable rules rather than assert that every output needs the same label.
  - facts: F0226, F0230, F0231
### Q0056 · How should we judge NVIDIA's governance while the investigation continues?  _risk_
- The new independent-director committee strengthens oversight, but it does not establish the investigation's outcome.
- The board says its separate investigation continues with independent counsel and that the company will cooperate with government inquiries.
- We would track the findings and whether the new controls work in practice.
  - facts: F0070, F0071, F0072, F0074, F0078
### Q0057 · Were the H20 charge and lost sales NVIDIA's final net cost of export controls?  _risk_
- No. A charge, unshipped revenue and a forecast of lost future revenue measure different things and cannot be added into a net cost.
- NVIDIA later released part of its reserves and reported unrestricted sales outside China.
- The final economic impact is not established by those disclosures alone.
  - facts: F0204, F0206, F0207, F0209, F0210
### Q0058 · Can a published AI query energy figure tell us this presentation's total environmental footprint?  _risk_
- No. A measured text prompt from another service is not a measurement of this presentation.
- Water impacts can also arise from cooling, electricity generation and hardware manufacturing.
- We need workload-specific measurements and a defined boundary before claiming a footprint.
  - facts: F0037, F0030
### Q0059 · Does NVIDIA face a material securities lawsuit?  _risk_
- Yes. NVIDIA disclosed a securities class action alleging misleading statements about crypto-related GPU demand; allegations are not findings of liability.
- Its annual report says the case returned to district court, and possible losses could not be reasonably estimated.
- This is the status disclosed in the fiscal 2026 filing; later developments need checking.
  - facts: F0246, F0247, F0248
### Q0060 · Could power shortages derail the growth thesis?  _risk_
- Yes. NVIDIA says shortages of energy, capital or data-centre capacity could affect future revenue.
- It also warns that public purchase intentions may be non-binding, so announcements are not guaranteed orders.
  - facts: F0240, F0241
### Q0061 · What specific operating risks could make supply fail even without an invasion?  _risk_
- Restrictions, natural disasters and other disruptions can impair production and delivery.
- NVIDIA relies on external foundries and contractors and says its continuity plans may not cover every eventuality.
- The company identifies Taiwan and South Korea as especially important supply locations.
  - facts: F0232, F0233, F0234, F0236, F0237
### Q0062 · Can NVIDIA be exposed to ESG risks beyond its own emissions?  _risk_
- Yes. NVIDIA warns its sustainability disclosures or oversight may fall short of changing expectations or legal requirements.
- It also identifies legal, social and ethical issues around AI that could affect adoption.
  - facts: F0244, F0245
### Q0063 · Who has published a serious AI infrastructure bear case, and how strong is it?  _risk_
- Sequoia investor David Cahn argued that the infrastructure build-out could exceed end-user revenue and that GPU stockpiling could reverse.
- His revenue gap is a model based on assumptions, not a measured loss or an NVIDIA revenue forecast.
- A valuable technology can still leave investors with poor returns if capacity and financing outrun demand.
  - facts: F0251, F0252, F0253, F0256, F0257
### Q0064 · Does NVIDIA financing AI companies make its reported sales artificial?  _risk_
- NVIDIA does invest in companies that buy its products, creating a real incentive and counterparty exposure.
- Its filing discloses private investments and contingent commitments; disclosure alone does not show that purchases are fictitious or quantify how much revenue those investments generated.
- Track independent customer demand, investee funding and investment returns rather than assuming the entire sales cycle is circular.
  - facts: F0258, F0259, F0260, F0261
### Q0065 · Does rapid GPU obsolescence threaten the investment thesis even if AI keeps growing?  _risk_
- Yes: Cahn argues that faster chips can erode the economic value of existing equipment and depress returns on infrastructure.
- That is a forecast about economic value, not proof of a particular accounting life or actual impairment.
- If buyers cannot recover their costs, they may slow future orders; NVIDIA also warns that customers can change or delay many orders.
  - facts: F0255, F0262, F0256
### Q0066 · Could NVIDIA earn lower margins even while revenue grows?  _risk_
- Yes. NVIDIA guided to a lower gross-margin range for the next quarter than the margin it reported for the latest quarter.
- That is company guidance, not proof of permanent margin compression; changes in product mix and competition need monitoring.
- A margin decline would weaken the buy case even if sales continue to rise.
  - facts: F0263, F0264
### Q0067 · Is hyperscaler infrastructure spending backed by customers paying for AI?  _neutral_
- There is evidence of adoption, though it does not establish returns on the investment.
- Microsoft reported over 30 million paid Copilot seats and more than $100 billion in Azure revenue in FY2026.
- Azure includes non-AI workloads; paid seats do not show AI profit or NVIDIA-specific demand.
  - facts: F0270, F0271
### Q0068 · How fast is a major cloud provider increasing infrastructure spending, and what could go wrong?  _risk_
- Microsoft’s cash additions to property and equipment rose from $44,477 million in FY2024 to $115,948 million in FY2026.
- Those figures include all assets, not just AI or NVIDIA hardware, so they do not prove an attractive AI return.
  - facts: F0266, F0268 · visuals: V0058
### Q0069 · Can NVIDIA treat announced AI purchase intentions as guaranteed revenue?  _risk_
- No. Announcements are evidence of interest, not guaranteed revenue.
- NVIDIA says publicly announced purchase intentions are often non-binding, and customers generally can cancel, change or delay product commitments with little notice or penalty.
- That makes demand forecasting and revenue vulnerable to changes in customer plans; the bear-case visual is a modelled scenario, not a prediction.
  - facts: F0241, F0262, F0242 · visuals: V0009
### Q0070 · If Jensen Huang leaves again, can we assume NVIDIA has a seamless succession plan?  _risk_
- No. Investors should treat leadership succession as a material uncertainty.
- NVIDIA describes itself as highly dependent on its longstanding executive team and warns that failed succession planning or knowledge transfer could hinder long-term success.
- Huang was reinstated, while the independent investigation continues; neither fact establishes a tested succession plan.
  - facts: F0238, F0239, F0066, F0071
### Q0071 · Do NVIDIA investments in AI customers create competition risks as well as financial risks?  _risk_
- Potentially, but an investment alone does not establish an antitrust violation or artificial revenue.
- NVIDIA says its investments include AI model makers that purchase its products, and warns returns on early-stage investments are not assured.
- Competition authorities warn that AI partnerships and investments can sometimes undermine competitive threats; assess individual transactions and current investigations before drawing conclusions.
  - facts: F0258, F0261, F0225
### Q0072 · Is NVIDIA cheap compared with other chip companies?  _neutral_
- On this snapshot, its forward earnings multiple is lower than those of the selected peers.
- That does not establish fair value: forecast earnings, capital intensity and business mixes differ.
- The public snapshot differs from the pitch dataset, so reconcile the inputs and date before presenting.
  - facts: F0277, F0281, F0285, F0289 · visuals: V0059
### Q0073 · Why are your analyst target and historical valuation figures different from public sources?  _risk_
- The public analyst consensus differs from the team capture, and the historical earnings multiples also conflict.
- Analyst panels, price timestamps and valuation definitions may differ, but the reasons have not been verified.
- Treat the team target range and rating breakdown as unverified and reconcile historical multiples before citing them.
  - facts: F0291, F0292, F0293, F0294, F0295, F0296, F0297, F0298, F0299
### Q0074 · How much confidence should we put in analysts’ revenue forecasts?  _risk_
- Treat consensus as a benchmark, not a promise.
- The projected revenue range is wide, especially for the later year, so a miss could challenge the valuation.
  - facts: F0300, F0301, F0302, F0303, F0304, F0305 · visuals: V0060
### Q0075 · Have analysts changed their views on NVIDIA recently?  _neutral_
- Yes. Yahoo reports upgrades by StoneX and Bernstein in late November.
- The saved listing does not explain their reasons, so we cannot attribute a motive without further evidence.
  - facts: F0310, F0311
### Q0076 · What do analysts expect for earnings per share?  _neutral_
- Yahoo’s snapshot shows a higher average estimate for the later fiscal year, with a wide range of estimates.
- Its saved table does not establish whether the displayed earnings use GAAP or normalized accounting; check the basis before comparing.
  - facts: F0306, F0307, F0308, F0309
### Q0077 · Is the full buyback authorisation cash already returned to shareholders?  _neutral_
- No. Authorisation is capacity to repurchase shares, not proof that the cash has been spent.
- The company separately reports actual buybacks and dividends returned each quarter.
- Purchases are subject to future decisions and returns are not guaranteed.
  - facts: F0314, F0315, F0316, F0318, F0320
### Q0078 · Does stock compensation dilute owners despite buybacks?  _risk_
- It can dilute owners, so buyback spending alone does not tell us the net effect.
- NVIDIA reports stock compensation expense, and diluted weighted-average shares have fallen across the periods shown.
- Share counts vary over time and past declines do not guarantee future reductions.
  - facts: F0325, F0326, F0327, F0328
### Q0079 · Has NVIDIA changed the treatment of stock compensation in adjusted earnings?  _neutral_
- Yes. NVIDIA now includes stock-based compensation expense in its non-GAAP measures.
- The company says it updated historical non-GAAP information for comparison.
- Stock compensation remains a real cost and potential source of dilution.
  - facts: F0324, F0327, F0328
### Q0080 · Why did free cash flow dip even when AI demand was growing?  _risk_
- Cash flow can swing sharply from quarter to quarter, so a single quarter is not a durable run rate.
- Annual free cash flow has also fallen before: inventory, purchasing and investment timing can affect cash conversion.
- Track working capital and capital commitments alongside revenue.
  - facts: F0331, F0332, F0350, F0351, F0352, F0334, F0338 · visuals: V0021
### Q0081 · Why does Bloomberg show a different free cash flow figure from NVIDIA?  _neutral_
- The sources use different free cash flow conventions, so the figures should not be mixed without reconciliation.
- NVIDIA explicitly deducts principal payments as well as purchases of property, equipment and intangible assets.
- Use one consistent definition when comparing years and flag the difference.
  - facts: F0344, F0355
### Q0082 · Is NVIDIA building a cash cushion or taking on debt?  _risk_
- It holds substantial cash, but debt and inventory have also increased.
- Marketable equity securities are investments, not cash, and their value can fluctuate.
- Monitor financing, working capital and investment risk rather than assuming every asset is immediately risk free.
  - facts: F0333, F0334, F0335, F0336
### Q0083 · Which FY26 free cash flow figure should the board use, and is the difference explained?  _risk_
- Use NVIDIA’s company-defined figure when citing its results; Bloomberg reports a different figure for the same year.
- NVIDIA’s definition deducts specified asset purchases and principal payments.
- The exact Bloomberg components have not been reconciled, so we cannot yet attribute the gap to a particular adjustment.
  - facts: F0356, F0344, F0355 · visuals: V0062
### Q0084 · Which analyst revenue consensus should we use when Bloomberg and Yahoo disagree?  _risk_
- Use the dated provider-specific snapshot and label it clearly; we use the later Yahoo snapshot for its own consensus.
- Bloomberg’s earlier project snapshot differs, and analyst panels or methods may differ too.
- These are estimates, not future sales, and the chart shows the spread in Yahoo’s later-year forecasts.
  - facts: F0357, F0358, F0312, F0313, F0304, F0305 · visuals: V0060
### Q0085 · Did NVIDIA restate adjusted earnings to account for employee stock awards, and does that eliminate dilution?  _risk_
- NVIDIA updated historical non-GAAP information to include stock-based compensation, which improves comparability with its revised measure.
- Stock awards remain an economic cost and can dilute shareholders; buybacks and changes in share count also matter.
- The restatement alone does not establish future dilution or the value created by repurchases.
  - facts: F0324, F0330, F0327, F0325, F0329
### Q0086 · Does a more efficient Rubin rack mean AI will use less electricity overall?  _risk_
- No: efficiency per unit of work does not by itself establish lower total electricity use.
- NVIDIA claims up to 10x more token throughput per megawatt on the Kimi-K2-Thinking workload compared with GB200 NVL72 at comparable interactivity.
- That is a vendor workload-specific upper bound; greater total usage can outweigh efficiency gains.
  - facts: F0012
### Q0087 · Is Rubin an announced concept or is it shipping?  _neutral_
- NVIDIA reports it has reached volume shipments.
- In January 2026 it said partner products would arrive in the second half of 2026; its later disclosure says Vera Rubin NVL72 and Vera CPUs began volume shipments in the third quarter of fiscal 2027.
- This company disclosure is not an independent measure of how broadly customers have deployed or paid for the systems.
  - facts: F0365, F0191
### Q0088 · What exactly is inside a GB200 NVL72 rack?  _neutral_
- It is a liquid-cooled rack-scale system, not a single GPU.
- NVIDIA says it combines 72 Blackwell GPUs with 36 Grace CPUs, connected using NVLink.
- Its advertised gains are vendor upper bounds for specified workloads, not a guarantee for every application.
  - facts: F0360, F0361
### Q0089 · What is the difference between Blackwell, Blackwell Ultra and Rubin?  _neutral_
- Blackwell is a GPU platform; Blackwell Ultra is an enhanced generation, and Vera Rubin is the next platform.
- NVIDIA claims higher compute capability for Blackwell Ultra and publishes a separate peak inference rating for Rubin.
- These vendor specifications are not a direct application benchmark; realized performance and purchase economics depend on workload and configuration.
  - facts: F0363, F0367
### Q0090 · Was NVIDIA founded as an AI company?  _neutral_
- No. NVIDIA says it was founded to bring 3D graphics to gaming and multimedia markets.
- Its timeline presents GPU programmability through CUDA and later AlexNet as milestones in its transition toward accelerated computing and AI.
  - facts: F0371, F0375, F0376
### Q0091 · Was the Mellanox acquisition a major strategic expansion?  _neutral_
- NVIDIA announced an agreement valuing Mellanox at approximately $6.9 billion.
- The companies said the combination joined NVIDIA computing with Mellanox interconnects for high-performance computing; this is the company rationale, not independent proof the deal created value.
  - facts: F0378, F0380
### Q0092 · What happened with Jensen Huang and who is CEO now?  _risk_
- NVIDIA announced Huang had resigned effective immediately on November 12, then said he was reinstated effective immediately on November 23.
- NVIDIA’s latest cited announcement names Huang as president and CEO; it thanked Colette Kress for interim CEO service and said she remained CFO.
- The board said an independent-director investigation would continue; the succession episode is a real governance and key-person risk.
  - facts: F0396, F0398, F0399
### Q0093 · Is Colette Kress an experienced finance leader?  _neutral_
- NVIDIA appointed its serving EVP and CFO as interim CEO during the transition.
- Before NVIDIA, Kress held senior finance leadership at Cisco and Microsoft and finance roles at Texas Instruments; she has a finance degree and an MBA.
- Her transition to CEO was temporary in NVIDIA’s announcement; it does not establish a permanent succession plan.
  - facts: F0387, F0388, F0389, F0391, F0397
### Q0094 · Does NVIDIA depend too heavily on Jensen Huang?  _risk_
- Huang co-founded NVIDIA and the FY2026 filing described him as CEO and director since inception.
- NVIDIA lists other long-serving executives, including Kress, Ajay Puri and Debora Shoquist, with operating and finance backgrounds.
- The abrupt resignation and reinstatement within eleven days illustrate that succession remains a material governance question.
  - facts: F0382, F0392, F0394, F0398
### Q0095 · What tangible benefit does NVIDIA-enabled computing provide in the UK?  _strength_
- Isambard-AI gives UK researchers a national AI computing resource built with NVIDIA and HPE.
- Bristol reports about 1,000 research projects and more than 4,000 users in its first year, including work on British-language models.
- This demonstrates research use, not a measured financial return to NVIDIA; access was oversubscribed.
  - facts: F0400, F0401, F0402, F0404, F0091
### Q0096 · Does the UK AI buildout guarantee NVIDIA sales?  _risk_
- No. Public compute expansion creates an opportunity, not a guaranteed NVIDIA contract.
- The UK action plan recommends a range of hardware suppliers to limit vendor lock-in.
- Execution also depends on infrastructure: the BBC reported Microsoft left the Loughton project and that its power supply had been delayed into the 2030s.
  - facts: F0409, F0406, F0407, F0093
### Q0097 · What does the Nscale Loughton setback mean for UK jobs and AI investment?  _risk_
- The proposed centre faced major delivery uncertainty as of the BBC report.
- Nscale pledged investment and the site was expected to create permanent jobs when it opens; these are project figures, not NVIDIA revenue or jobs.
- The BBC reported Microsoft terminated involvement and grid power was delayed; its report does not establish an NVIDIA order for the project.
  - facts: F0405, F0406, F0407, F0408
### Q0098 · When was Huang reinstated and was the investigation closed?  _risk_
- Use the effective date in the company filing; the later press announcement says the reinstatement was immediate, creating a date ambiguity.
- Reinstatement did not close the committee investigation: the board said it would continue.
- The investigation outcome remains unverified.
  - facts: F0414, F0398, F0071
### Q0099 · Does NVIDIA reporting renewable energy equal to its total energy mean the AI presentation ran on renewable power?  _risk_
- No. The company-wide energy figures do not establish the electricity supply or footprint of this presentation.
- The Bloomberg project dataset records matching renewable and total energy figures for the latest reported fiscal year; customers’ data centres are outside that company total.
- We have no measured energy or water footprint for this specific presentation.
  - facts: F0026, F0027, F0030 · visuals: V0022
### Q0100 · What effective reinstatement date should we cite for Huang?  _risk_
- Use the twenty-second of November as the effective date: NVIDIA’s filing states it explicitly.
- Its press announcement appeared the following day and says effective immediately, so cite the filing when stating the effective date.
- The board said the committee investigation would continue; reinstatement did not resolve it.
  - facts: F0414, F0398, F0071
### Q0101 · How do interest rates affect the NVIDIA investment case?  _risk_
- Higher discount rates can reduce the present value of future cash flows; that is a valuation sensitivity, not a prediction of the share price.
- FRED put the US ten-year Treasury yield at 4.92% on 23 November 2026.
- The yield is a benchmark, not NVIDIA’s complete discount rate; earnings and the equity risk premium matter too.
  - facts: F0415 · visuals: V0063
### Q0102 · Is the equity risk premium a fixed number that guarantees a return?  _risk_
- No. It is an estimate of the extra return investors demand, not a guaranteed return.
- Damodaran’s historical FCFE method estimated 4.37% for 2007 and 4.36% for 2009.
- These are historical model estimates, not a current premium; different methods and assumptions can change the result.
  - facts: F0424, F0425
### Q0103 · Does a growing semiconductor market eliminate the risk of a downturn?  _risk_
- No. A strong industry forecast does not guarantee uninterrupted growth or NVIDIA share-price gains.
- The Semiconductor Industry Association projected global sales above $1.5 trillion for 2026; that is a forecast, not reported sales.
- Historical semiconductor and NVIDIA drawdowns still need independently verified peak and trough data.
  - facts: F0426
### Q0104 · Do we already own NVIDIA through a global index fund?  _risk_
- Probably, if your fund tracks MSCI World, but check the actual fund and benchmark.
- NVIDIA was 5.25% of the index on 30 October 2026.
- A direct position adds concentration; index weights change over time.
  - facts: F0439, F0434 · visuals: V0065
### Q0105 · Is NVIDIA the largest company by market value?  _neutral_
- In the 24 November snapshot, NVIDIA was smaller than Apple but slightly larger than Microsoft.
- Stock Analysis showed $3.75 trillion for NVIDIA, $5.15 trillion for Apple and $3.68 trillion for Microsoft.
- Rankings and capitalisations change with share prices.
  - facts: F0429, F0430, F0431
### Q0106 · Does the MSCI World benchmark itself screen for ESG?  _risk_
- No: MSCI says the World index does not pursue ESG objectives.
- Owning a broad index is therefore not a substitute for an ESG assessment of its holdings.
- A fund tracking a different ESG benchmark may have different rules.
  - facts: F0436, F0439
### Q0107 · How volatile is NVIDIA and where is it relative to its annual range?  _risk_
- The shares have moved sharply and sit below their annual high.
- Stock Analysis showed a $124.50 low, a $243.37 high and a $155.38 close in its late-November snapshot.
- The unverified team price and low differ, so reconcile before presenting.
  - facts: F0427, F0428, F0437, F0441, F0442
### Q0108 · Do ESG ratings agree on whether NVIDIA is sustainable?  _neutral_
- Do not treat ratings as interchangeable or as proof of environmental impact.
- MSCI measures industry-relative financial sustainability risks; Sustainalytics aggregates unmanaged material ESG risk.
- The Bloomberg export gives NVIDIA different pillar scores, and we have not verified current NVIDIA ratings from the other providers.
  - facts: F0450, F0451, F0453, F0446, F0447, F0448, F0449
### Q0109 · What does Bloomberg say about NVIDIA’s ESG profile?  _neutral_
- Its latest exported overall ESG score is 6.10 out of 10 for FY25.
- Environmental was 7.48, governance 7.10, and social 3.63 on the same scale.
- These are vendor scores, not direct measures of absolute emissions; the separate social disclosure score is a different measure.
  - facts: F0446, F0447, F0448, F0449, F0050
### Q0110 · Can we compare NVIDIA with semiconductor peers using these ESG ratings?  _neutral_
- Only when the same provider, rating product, date and peer definition are available.
- MSCI describes an industry-relative rating; ISS says its environmental and social QualityScores compare industry-group peers.
- We have not verified comparable NVIDIA and peer ratings, so no ranking is justified.
  - facts: F0451, F0455
### Q0111 · Will power and grid constraints choke AI growth?  _risk_
- Yes, electricity connections are a material execution risk, although the scale and timing are uncertain.
- The IEA estimates that around 20% of planned data-centre projects could be delayed unless grid risks are addressed; transmission lines can take four to eight years in advanced economies.
- Local clustering can intensify bottlenecks, so capacity announcements are not the same as connected, operating data centres.
  - facts: F0007, F0471, F0457
### Q0112 · Do hyperscaler clean-power deals make AI electricity carbon-free?  _risk_
- No. Power contracts can help bring cleaner supply onto grids, but they do not establish that every AI workload uses carbon-free electricity.
- Google says its Fervo geothermal project supplies the Nevada grid. Microsoft’s nuclear restart requires approval; Google’s Kairos reactors were future plans.
- The IEA expects coal and gas to meet over 40% of growth in global data-centre electricity demand through the end of this decade in its base case.
  - facts: F0462, F0468, F0463, F0465, F0466 · visuals: V0067
### Q0113 · Can AI itself measurably reduce energy use?  _neutral_
- Yes, in specific applications, but a case study does not prove that AI saves more energy than it consumes overall.
- Google DeepMind reported that machine learning consistently cut cooling energy by forty percent at the studied site, and reduced PUE overhead by fifteen percent.
- These are company-reported site results with different denominators; they are not a forty percent reduction in total electricity or proof of NVIDIA-specific savings.
  - facts: F0469, F0470
### Q0114 · Do clean-power announcements mean AI demand growth will be powered without fossil fuels?  _risk_
- No. Clean-power projects can help, but announcements do not establish that all incremental AI power is clean.
- The IEA expects gas and coal to meet over 40% of additional data-centre electricity demand through 2030.
- Some projects are still plans or need permits; actual delivery, location and timing matter.
  - facts: F0462, F0465, F0468 · visuals: V0067
### Q0115 · Can a low social score tell us whether NVIDIA has forced labour in its supply chain?  _risk_
- No. A score alone cannot establish whether forced labour occurs or whether suppliers remediate it.
- Bloomberg records a social score of 3.63 out of 10 for FY25; rating methodologies measure different things.
- Ask for supplier coverage, independent audit findings and evidence of remediation before drawing a conclusion.
  - facts: F0447, F0450, F0452, F0455 · visuals: V0066
### Q0116 · How does an independent valuation compare with the team’s DCF?  _neutral_
- Morningstar maintained a $250 per-share fair-value estimate on 23 November; our model estimates $389.99 at the industry discount rate and $226.87 at Bloomberg’s rate.
- These are different models, not independent confirmation of our assumptions: Morningstar uses a ten-year DCF and describes very high uncertainty.
- Its numerical discount rate is not disclosed in the material reviewed, so we cannot attribute the difference to any one input.
  - facts: F0474, F0476, F0051, F0052
### Q0117 · Are Morningstar’s margin assumptions directly comparable with ours?  _neutral_
- No: Morningstar discusses gross margin, while our model uses a free-cash-flow margin.
- Morningstar expected gross margin to ease over the long run, even as it remained optimistic about pricing power.
- Its disclosed assumptions were published before its latest valuation update, and we could not verify its numerical discount rate.
  - facts: F0477, F0478, F0474
### Q0118 · How strong is AMD as a competitive threat to NVIDIA?  _risk_
- AMD is a serious and growing rival, especially across data-centre CPUs and accelerators.
- Its data-centre revenue reached $8.5 billion in Q3 2026, up 97% year on year, and its next-quarter company revenue guidance was approximately $17 billion plus or minus 3%.
- That segment includes CPUs as well as GPUs, so it is not a clean measure of AI accelerator sales or NVIDIA market share.
  - facts: F0492, F0493
### Q0119 · Does Broadcom disclose AI revenue that competes with NVIDIA?  _risk_
- Yes: Broadcom reports AI semiconductor revenue spanning custom accelerators and networking.
- It reported $10.8 billion in Q2 FY2026, up 143% year on year.
- That company-defined category is not directly comparable to AMD data-centre revenue, and Broadcom’s subsequent performance needs verification.
  - facts: F0486, F0492
### Q0120 · How much US electricity could data centres use, and how certain is the estimate?  _risk_
- Demand is already material, and the forecast range is wide.
- Berkeley Lab estimated 176 TWh in 2023 and projected 325 to 580 TWh in 2028.
- These are all data centres, not AI alone; the projection is uncertain.
  - facts: F0496, F0497, F0498 · visuals: V0068
### Q0121 · Could grid constraints slow AI infrastructure growth?  _risk_
- Yes. Power supply and transmission planning can constrain the pace of data-centre expansion.
- PJM projected up to about 30 GW of data-centre load growth from 2025 to 2030.
- These projects may not all materialise on schedule, and the projection is not a guarantee.
  - facts: F0501, F0503, F0505
### Q0122 · Why should we trust data-centre power demand forecasts?  _risk_
- Treat them as scenarios, not committed electricity consumption.
- PJM reduced its near-term 2026 forecast versus its 2025 forecast, reflecting changed assumptions.
- Longer-term projects are derated for uncertainty, and double-counting is a risk.
  - facts: F0502, F0504, F0505
### Q0123 · If clean-energy procurement looks strong, can we still justify an ESG concern about NVIDIA?  _risk_
- Yes. Scrutinise supply-chain and product-use emissions alongside the company’s own energy procurement.
- Bloomberg records rising NVIDIA value-chain emissions, while the IEA expects fossil fuels to meet a substantial share of additional global data-centre electricity demand.
- Reconcile the emissions series to NVIDIA’s disclosures; the IEA projection covers all data centres, not NVIDIA’s attributable footprint.
  - facts: F0022, F0024, F0462 · visuals: V0053
### Q0124 · If AI demand forecasts keep rising, why should the board question grid connection promises?  _risk_
- Because a proposed connection is not the same as power delivered or revenue earned.
- PJM warns that double-counting can distort grid forecasts and treats longer-term projects as uncertain; the IEA identifies lengthy transmission construction times.
- Actual delays and financial effects will depend on location and project status; these sources do not quantify NVIDIA revenue at risk.
  - facts: F0502, F0505, F0471
### Q0125 · If NVIDIA has ample cash, why should we still monitor its balance sheet?  _risk_
- Cash does not remove the need to monitor inventory, debt and the liquidity of investments.
- NVIDIA disclosed cash and cash equivalents, inventories and long-term debt at its latest reported quarter; inventory and debt rose from the prior fiscal year-end.
- Marketable equity securities are separate from cash, and the disclosures alone do not establish a liquidity crisis or the reasons for the changes.
  - facts: F0333, F0334, F0335, F0336
### Q0126 · Do independent measurements prove each new NVIDIA GPU generation uses less electricity per AI answer?  _risk_
- We cannot yet substantiate a comparable measured result across all three generations.
- MLCommons reported a Rubin preview system in its inference results, but that announcement alone does not establish an energy measurement.
- Ask for the same workload, scenario, quality target, precision and whole-system wall-power measurements before accepting a comparison.
  - facts: F0506, F0508, F0509, F0513
### Q0127 · Can we use a GPU power rating to calculate AI energy efficiency?  _neutral_
- No: a power rating alone is not a measured energy-efficiency result.
- MLPerf measures the complete system at the wall during the workload, and its measured power applies only to the accompanying benchmark.
- Check the workload and numerical precision as well as system boundaries before comparing results.
  - facts: F0506, F0507, F0513
### Q0128 · Does NVIDIA’s annual Scope 3 figure represent only emissions released that year?  _risk_
- Not necessarily. The GHG Protocol’s product-use category counts expected lifetime emissions of relevant products sold in the reporting year.
- That estimate uses assumptions about product use and lifetimes; the NVIDIA-specific category boundary and Bloomberg mapping still need checking in the company report.
  - facts: F0517, F0519, F0024 · visuals: V0053
### Q0129 · Can NVIDIA subtract customers’ avoided emissions from its reported carbon footprint?  _risk_
- No. The GHG Protocol says avoided-emissions claims for sold products must be reported separately from the company’s inventory.
- Efficiency claims may be relevant context, but they do not by themselves cancel the reported emissions; verify the company’s own methodology.
  - facts: F0521, F0024
### Q0130 · Does NVIDIA’s product-use footprint count emissions from customer electricity?  _neutral_
- The accounting standard includes end users’ direct and purchased-energy emissions in the use-of-sold-products category.
- Whether and how NVIDIA includes particular products and customer electricity in the Bloomberg figures remains unverified until the company’s inventory boundary is obtained.
  - facts: F0518, F0024
### Q0131 · Does NVIDIA have a validated science-based emissions target, and does that guarantee delivery?  _risk_
- We cannot verify NVIDIA's current status from the accessible dashboard excerpt, so we should not claim a validated target or date.
- SBTi distinguishes a commitment from a validated target, and says validation does not guarantee delivery or demonstrate that a company is on track.
- Check the complete current dashboard and NVIDIA's primary disclosure before making a company-specific claim.
  - facts: F0524, F0526
### Q0132 · Does an SBTi temperature-alignment label cover all NVIDIA value-chain emissions?  _risk_
- Do not assume it covers the whole value chain: we have not verified a company-specific NVIDIA label.
- SBTi says its company temperature alignment generally covers operational scopes rather than the value chain, with an automaker exception.
- Even a validated target is not proof that the company is on track.
  - facts: F0528, F0526
### Q0133 · Can expanding packaging capacity eliminate Taiwan disruption risk?  _risk_
- No. Expansion helps capacity but does not remove geographic dependence.
- NVIDIA says its latest system uses TSMC fabrication and packaging technologies and has also announced expansion elsewhere.
- Plans are not completed, qualified replacement capacity; the impact of disruption remains unquantified.
  - facts: F0191, F0192, F0193
### Q0134 · If AI customers announce enormous projects, why might NVIDIA revenue fall short?  _risk_
- Announcements are not guaranteed sales.
- NVIDIA warns customers can cancel, change or delay commitments with little notice or penalty.
- Electricity connection forecasts also contain uncertain projects; neither fact estimates the revenue at risk.
  - facts: F0262, F0503, F0505
### Q0135 · Does independent benchmark validation prove NVIDIA's latest chips reduce total emissions?  _risk_
- No. A measured benchmark can inform a like-for-like comparison, but it does not establish total emissions.
- MLCommons measures wall power for the tested system and workload; its Rubin announcement does not establish a power measurement.
- Usage, electricity and the rest of the supply chain remain material.
  - facts: F0506, F0507, F0509, F0030
### Q0136 · What is NVIDIA’s latest public CDP climate score?  _neutral_
- I could not verify an NVIDIA-specific grade from the accessible CDP page snapshot, so we should not quote a letter score.
- CDP currently presents 2025 public corporate scores as the latest set; 2026 scores are scheduled for 2 December 2026.
- We should check the live public list after that date and record the score year and theme.
  - facts: F0529, F0530
### Q0137 · Can we reproduce NVIDIA’s CDP score in our pitch deck?  _risk_
- CDP says scores may only be used internally and non-commercially without its prior written consent.
- Ask CDP for a licence before reproducing the score in external or commercial material.
  - facts: F0529, F0533, F0536
### Q0138 · Are NVIDIA water withdrawals improving over time?  _risk_
- We cannot reliably say: NVIDIA warns its latest water figures are not comparable with earlier years because its collection methods changed.
- Ask for a restated, consistently measured series before drawing a trend.
  - facts: F0540
### Q0139 · Does NVIDIA operate in water-stressed areas?  _risk_
- Yes. NVIDIA reported that 20% of its facilities water withdrawals in FY24 were in water-stressed areas.
- This is an older assessment, not a current site-by-site impact measure.
  - facts: F0544
### Q0140 · Does NVIDIA’s own water figure capture the entire AI water footprint?  _risk_
- No. Its own reporting covers its corporate entities, while NVIDIA says it does not own manufacturing facilities.
- Water used in external manufacturing, electricity generation and customer data centres needs separate assessment.
  - facts: F0541, F0543, F0030
### Q0141 · Does NVIDIA’s own water disclosure capture the water used to manufacture its chips?  _risk_
- No. NVIDIA says it is fabless, and its reported operational water figures do not establish its foundry suppliers’ water footprint.
- NVIDIA identifies TSMC manufacturing and packaging technologies in its latest system.
- We could not verify current TSMC withdrawal, consumption, reclaimed water or site water stress from an accessible report; request those supplier disclosures before assessing the full impact.
  - facts: F0543, F0537, F0538, F0191
### Q0142 · Does reclaimed water eliminate the risk of water scarcity at a semiconductor fab?  _risk_
- No. Reuse can be relevant, but a reclaimed-water figure alone cannot establish a site’s effect on local water availability.
- Ask for withdrawals, consumption, the source and definition of reclaimed water, and a site-level water-risk assessment.
- Water consumption and withdrawal measure different impacts; WRI maps water risks including drought and stress.
  - facts: F0547, F0548, F0549
### Q0143 · What evidence should the board require before treating NVIDIA’s water footprint as low risk?  _risk_
- The operational figure alone is not enough to establish low water risk across the value chain.
- NVIDIA reports its own water use, but it is fabless and its reporting covers its own reporting entities; manufacturing and customer sites need separate assessment.
- Request site-level withdrawals and consumption, local water-stress exposure and consistent boundaries from suppliers and operators; the available disclosure does not establish the complete footprint.
  - facts: F0537, F0538, F0540, F0541, F0543, F0547, F0548, F0549 · visuals: V0069
### Q0144 · Could supply expansion and customer demand both disappoint at the same time?  _risk_
- Yes: announced capacity and demand are exposed to different execution risks.
- NVIDIA says its current platform uses TSMC fabrication and packaging technologies, while capacity expansion plans are forward-looking.
- NVIDIA also warns customers can cancel, change or delay commitments; we cannot quantify the combined impact on earnings from these disclosures.
  - facts: F0191, F0192, F0193, F0262
### Q0145 · Can you prove the Ecolab and NVIDIA cooling system saves water across an entire data centre?  _risk_
- Not from the evidence available: Ecolab describes an integrated cooling system, but we have not verified an independent whole-site before-and-after study.
- Ask for metered withdrawals and consumption, matched workloads, weather and cooling conditions before claiming savings.
  - facts: F0032, F0034, F0036, F0547, F0548
### Q0146 · Why do published AI water estimates differ so much?  _risk_
- They cover different services, workloads and boundaries, so the headline values are not directly comparable.
- Google estimates 0.26 mL of direct cooling water for a median Gemini text prompt; Mistral reports 45 mL for a typical 400-token response in a lifecycle assessment.
- Neither tells us this presentation’s actual water footprint.
  - facts: F0555, F0558, F0559
### Q0147 · How much electricity does a generated video consume?  _risk_
- We do not have a verified per-clip energy measurement, so we cannot give a defensible number for our video.
- The measured Gemini figure in our research is for text prompts and cannot be transferred to video; energy accounting also depends on whether idle machines and cooling are included.
- Ask the video provider for measured energy per clip, its resolution and duration, hardware, service boundary, and variability.
  - facts: F0560, F0561, F0564, F0565
### Q0148 · What would make a video-generation energy claim credible?  _neutral_
- A useful claim needs a measured workload and a clear system boundary, not just a chip power rating.
- For example, whole-system measurements can use wall power, while a production service may also need to account for idle machines and data-centre overhead.
- A text-serving measurement is only a methodological example; it does not quantify a video clip.
  - facts: F0506, F0507, F0560, F0561
### Q0149 · Does growing AI electricity demand prove Jevons paradox has already occurred?  _risk_
- No. Growing total consumption alongside better efficiency is a warning sign, but it does not isolate how much efficiency itself caused demand to grow.
- Direct rebound requires an efficiency-driven increase in consumption; establishing backfire needs a credible comparison with what energy use would have been without the efficiency gain.
- AI adoption, model capability and other influences also change, and the rebound researchers warn that causal estimation is difficult.
  - facts: F0566, F0567, F0568, F0570
### Q0150 · Does the IEA prove that AI efficiency will reduce total electricity use after rebound?  _risk_
- No. The IEA high-efficiency case is a scenario that holds demand for digital services and AI at the same level, so it does not measure the demand response to efficiency.
- The IEA warns that rebound could undercut some AI-enabled emissions benefits; the outcome depends on deployment, incentives and policy.
- Treat efficiency improvements as valuable but monitor absolute energy and emissions as well as energy per task.
  - facts: F0571, F0572, F0573
### Q0151 · Can you show evidence for an AI-specific rebound percentage?  _risk_
- We cannot give a reliable AI-wide rebound percentage from the sources verified here.
- The literature identifies plausible direct and economy-wide mechanisms and calls for detailed empirical studies of adoption, behavior and markets.
- The absence of a verified percentage is not proof that rebound is small; track absolute energy and emissions alongside efficiency.
  - facts: F0566, F0567, F0568, F0569
### Q0152 · The fallback deck says NVIDIA water withdrawals are rising. Can we defend that claim?  _risk_
- No. The reported figures cannot establish a trend because NVIDIA changed its collection methods.
- NVIDIA reports FY26 withdrawals of 451,297 cubic metres; its report says comparisons with prior years are invalid.
- Use the FY26 water breakdown and request a restated comparable series, including supplier and customer sites.
  - facts: F0537, F0540, F0543 · visuals: V0069
### Q0153 · If the IEA models savings from AI efficiency, has it accounted for people using more AI because it gets cheaper?  _risk_
- Not in that comparison: the IEA holds demand for digital services and AI constant in its high-efficiency scenario.
- Lower cost could stimulate extra use, but this scenario does not measure the size of that effect.
- Track actual total electricity use alongside efficiency and seek an empirical rebound estimate.
  - facts: F0571, F0566, F0569 · visuals: V0067
### Q0154 · Did the government clear Jensen Huang or NVIDIA?  _risk_
- No final clearance is established by the evidence we have.
- NVIDIA said the board was confident after government input, while its independent investigation would continue and the company would cooperate with government inquiries.
- CNN attributed a no-evidence assessment to a law-enforcement official; that is not a published conclusion of every inquiry.
  - facts: F0575, F0071, F0072, F0581
### Q0155 · What do the Megaspeed export restrictions prove about NVIDIA?  _risk_
- They establish a regulatory restriction on listed entities, not a finding that NVIDIA committed wrongdoing.
- The BIS rule identifies significant diversion risk and applies a licensing requirement with a presumption of denial.
- The investigation and its implications for NVIDIA remain unresolved.
  - facts: F0582, F0583, F0072
### Q0156 · What changed in board oversight after the leadership crisis?  _neutral_
- The board set up a standing national security and export control oversight committee of independent directors.
- NVIDIA said it was engaging specialist counsel and searching for a chief compliance officer who would report to the governance committee.
- These are announced controls; their effectiveness and the independent investigation outcome remain unproven.
  - facts: F0074, F0078, F0577, F0073, F0071
### Q0157 · Can NVIDIA switch its leading chips to Samsung if TSMC is disrupted?  _risk_
- Not immediately on the evidence we have. NVIDIA names both TSMC and Samsung as wafer foundries, but that does not prove they can substitute for each specific chip.
- NVIDIA warns that qualifying a new foundry and starting volume production can cause delays and added expense.
- The scale and duration of a switch remain unquantified.
  - facts: F0586, F0592
### Q0158 · Would a Taiwan disruption be resolved as soon as factories reopen?  _risk_
- Not necessarily: the supply chain includes fabrication, packaging, assembly and testing, and bottlenecks can persist across stages.
- NVIDIA says lead times have exceeded 12 months and could do so again; its disaster recovery planning may not cover every eventuality.
- We cannot infer a recovery time or financial loss from these disclosures.
  - facts: F0588, F0589, F0594, F0587
### Q0159 · Do new packaging investments eliminate Taiwan concentration?  _risk_
- No. They are diversification initiatives, many with future delivery dates, while NVIDIA describes its supply chain as mainly concentrated in Asia.
- NVIDIA is expanding Taiwan packaging capacity and plans additional capacity with Amkor; planned facilities and capacity are not proof of immediate substitute output.
- Disruption exposure depends on the affected production stage and capacity that is actually qualified.
  - facts: F0585, F0192, F0193, F0592
### Q0160 · Does the UK prohibit all NVIDIA chip exports to China?  _neutral_
- The UK China arms embargo covers certain military items; it is not described as a blanket ban on every chip.
- Separate UK controls cover listed dual-use items and can require licences for unlisted items based on end use, including military use in embargoed destinations.
- Exporters need product, destination and end-user checks; do not assume a particular NVIDIA model is unrestricted without a classification.
  - facts: F0605, F0606, F0607, F0608, F0609
### Q0161 · Are proposed AI export controls already law?  _risk_
- Do not assume that a proposal or announced replacement is in force.
- NVIDIA reported that the US announced plans to rescind the AI Diffusion interim final rule and replace it; its later scope and status require fresh verification.
- Existing controls and specific licensing conditions remain a separate matter, and the rules can change.
  - facts: F0611, F0604, F0597, F0600
### Q0162 · If the United States granted China chip licences, why is NVIDIA still losing business?  _risk_
- A US licence does not guarantee a sale: NVIDIA says Chinese restrictions also limited H200 sales.
- NVIDIA reported a $0.4 billion H200 charge in the first half of FY27.
- Licensed H200 shipments were less than 1% of Data Center revenue in the latest reported quarter.
- NVIDIA said it was effectively foreclosed from China data-centre compute, but could still ship uncontrolled gaming and workstation products.
  - facts: F0597, F0598, F0599, F0602
### Q0163 · If AI orders slow while NVIDIA has committed to supply, could that damage both cash flow and margins?  _risk_
- Yes. A demand slowdown can leave NVIDIA exposed to inventory and supply obligations, although the size of any future loss is unknown.
- NVIDIA says customers generally can cancel or delay commitments with little notice or penalty; inventory was $39,724 million at 25 October 2026.
- The H200 charge shows that restrictions can create excess inventory and purchase obligations, but it does not predict a comparable future charge.
  - facts: F0262, F0334, F0598 · visuals: V0062
### Q0164 · Can grid delays hurt NVIDIA financially even if demand for AI remains strong?  _risk_
- Yes. Strong interest does not guarantee that data centres can connect power and take delivery on schedule.
- The IEA estimates around 20% of planned data-centre projects could be delayed if grid risks are not addressed; PJM discounts longer-term large-load forecasts because of uncertainty.
- That estimate covers data centres broadly and does not quantify delayed NVIDIA sales or identify the affected customers.
  - facts: F0007, F0505, F0262 · visuals: V0068
### Q0165 · What happens if an AI cloud cannot find buyers for the computing capacity NVIDIA supports?  _risk_
- NVIDIA has agreed to buy committed capacity that the AI cloud cannot sell to third parties.
- It reported $36 billion of such cloud-service commitments at July 26, 2026, declining as NVIDIA or third parties use capacity.
- That creates demand and utilization risk; committed capacity is not the same as revenue or a realized loss.
  - facts: F0614, F0615, F0616
### Q0166 · Is the OpenAI infrastructure guarantee a cash expense or a potential obligation?  _risk_
- It is a conditional guarantee, not an upfront expense equal to its cap.
- NVIDIA disclosed a $105 billion aggregate cap, subject to conditions, for specified lease and power payments, and exposure falls as OpenAI pays.
- A default could still cause material losses, and NVIDIA says reimbursement might not be timely or complete.
  - facts: F0618, F0619, F0620, F0627
### Q0167 · Does investing in a customer automatically mean NVIDIA can book the investment as product revenue?  _neutral_
- No: NVIDIA says product revenue is recognized when control of products transfers and reflects consideration it expects to receive.
- It also says closely related agreements with one customer may be treated as a single contract.
- These policies do not establish how every individual financing arrangement was accounted for or prove that supported demand is independent.
  - facts: F0625, F0626, F0614, F0616
### Q0168 · Has NVIDIA found forced-labour warning signs in its supply chain, and what happened?  _risk_
- Yes. NVIDIA reports supplier non-compliance involving hiring fees, passport retention, working hours and penalties for leaving early.
- It says it worked with manufacturing partners on fee repayment, document access and changes to practices.
- These are company-reported actions; the disclosure does not establish that every affected worker has received remedy.
  - facts: F0635, F0636
### Q0169 · Do NVIDIA supplier audits prove its entire supply chain is free of forced labour?  _risk_
- No. NVIDIA identified forced and child labour as salient supply-chain risks before mitigation.
- It expects all manufacturing suppliers to self-assess annually, but the biennial independent onsite audit requirement applies to strategic suppliers.
- NVIDIA reports that reviewed audits covered 93% of strategic suppliers over two years, below its 100% goal; coverage and corrective-plan engagement do not prove all workers are protected.
  - facts: F0628, F0629, F0630, F0631, F0633, F0634
### Q0170 · What should we ask NVIDIA about supplier remediation?  _risk_
- Ask for evidence that workers received repayment, retained their passports and can leave employment without improper penalties.
- NVIDIA reports working with suppliers on those actions, but acknowledges remediation itself can put vulnerable workers at risk of lost income.
- Ask for independently verified closure, worker feedback and coverage beyond strategic suppliers.
  - facts: F0635, F0636, F0637, F0630
### Q0171 · Are employees leaving NVIDIA as it grows?  _risk_
- Turnover rose in FY26, although the company still reports a low overall rate.
- Overall turnover increased from 2.5% in FY25 to 3.7% in FY26.
- The FY26 rate for Black or African American U.S. employees was 6.3%; company-reported figures do not explain the causes.
  - facts: F0657, F0658, F0659
### Q0172 · Does NVIDIA pay women fairly?  _neutral_
- NVIDIA reports near parity on its global pay ratio, but that is not proof that every employee is paid equitably.
- It reports a women-to-men pay ratio of 99.5 to 100 for FY26.
- Women made up 17.4% of technical roles; pay ratios do not measure representation or career progression.
  - facts: F0652, F0648
### Q0173 · Is NVIDIA actually making progress on gender diversity?  _risk_
- The trend is improving, but women remain underrepresented, particularly in technical and leadership roles.
- In FY26 women held 17.4% of technical roles.
- The share of technical roles held by women rose over the prior two years, but remains low.
  - facts: F0648, F0646, F0647 · visuals: V0070
### Q0174 · Do independent audits prove NVIDIA products contain no conflict minerals?  _risk_
- No. Independent smelter assessments examine sourcing systems; the assessment body says they do not validate the material itself.
- NVIDIA uses several audit schemes, but its upstream supply chain relies on supplier-provided information.
- We could not verify the latest Form SD or establish complete product-level traceability.
  - facts: F0668, F0669, F0670, F0663, F0640
### Q0175 · When suppliers fail labour standards, how much can we trust remediation?  _risk_
- NVIDIA reports action on recruitment fees, passport retention and working hours, but the statement does not establish independently verified worker outcomes.
- The company reviews third-party audits for strategic suppliers and engages them on corrective plans where applicable.
- Ask for closure evidence, worker interviews and coverage beyond strategic suppliers.
  - facts: F0630, F0634, F0635, F0636, F0638
### Q0176 · How much governance attention does NVIDIA give supplier human rights?  _neutral_
- A board committee oversees human rights and reports to the board; a committee also approved the forced labour statement.
- Strategic supplier reviews allocate five percent of their scorecard to environmental and social performance.
- Oversight and scoring do not prove that violations have been eliminated.
  - facts: F0662, F0664, F0666, F0635
### Q0177 · Can NVIDIA's UK modern slavery statement prove its suppliers are compliant?  _risk_
- No. A published statement is a transparency disclosure, not proof that every supplier is compliant.
- NVIDIA says its statement covers named UK subsidiaries and reports supplier problems including hiring fees and passport retention.
- Ask for independent worker-level remediation evidence and coverage beyond strategic suppliers.
  - facts: F0639, F0642, F0641, F0635, F0640
### Q0178 · Should the board add NVIDIA's cloud commitments and customer guarantees to calculate its likely loss?  _risk_
- No. They are different kinds of exposure, not amounts of realized loss, and the available disclosures do not establish whether they overlap.
- Cloud service commitments fall as capacity is used; a separate infrastructure guarantee is conditional.
- Request current terms, counterparty exposure and a reconciled downside analysis before estimating losses.
  - facts: F0615, F0616, F0618, F0619, F0627
### Q0179 · Do supplier audits and board oversight prove NVIDIA's human rights controls work?  _risk_
- No. Oversight and audit coverage are evidence of processes, not proof that workers are protected.
- NVIDIA reports audit coverage of strategic suppliers and identified problems including recruitment fees and passport retention.
- Request independent evidence of remedy and information about upstream suppliers, where the company says visibility is limited.
  - facts: F0633, F0635, F0636, F0640, F0664
### Q0180 · Is the Fortune 100 workplace ranking decided by a company's own essays?  _neutral_
- No. The publisher says essays provide context, but only survey data can earn a list placement.
- Companies answer six essays about workplace programs, while employee feedback determines placement.
  - facts: F0680, F0684
### Q0181 · Is the Fortune 100 workplace ranking decided by a company's own essays?  _neutral_
- No. The publisher says essays provide context, but only survey data can earn a list placement.
- Companies answer essays about workplace programs, while employee feedback determines placement.
  - facts: F0680, F0685
### Q0182 · Did NVIDIA shareholders approve executive pay, and how is the CEO rewarded?  _risk_
- Shareholders approved executive pay in an advisory vote, but approval does not settle whether the rewards are appropriate.
- The proxy reported $36,343,830 in FY2026 CEO compensation and a 129:1 CEO-to-median-employee ratio.
- NVIDIA says the CEO equity grants were performance-based; the committee had prearranged lower stretch goals if H20 restrictions occurred and those goals were adjusted.
  - facts: F0690, F0693, F0694, F0696, F0697, F0698
### Q0183 · Did shareholders ask NVIDIA to change its voting rules?  _neutral_
- Yes. Shareholders approved a nonbinding proposal to replace supermajority provisions with a simple majority.
- The vote is advisory; the result alone does not establish that the charter or bylaws have changed.
  - facts: F0699
### Q0184 · Did NVIDIA shareholders approve disclosure of emissions from customers using its products?  _risk_
- No. Shareholders rejected a nonbinding proposal seeking a report on emissions from the use of sold products.
- The board opposed the proposal as unnecessary and overly prescriptive, while saying it planned enhancements to Scope 3 reporting including use of sold products.
- A plan is not proof the disclosure has been delivered.
  - facts: F0700, F0701, F0702
### Q0185 · Who audits NVIDIA and how independent is its board?  _neutral_
- Shareholders ratified PwC as auditor for fiscal 2027; the proxy says it has audited NVIDIA annually since 2004.
- The May proxy identified nine independent nominees on a ten-member board, and shareholders elected all ten in June.
- That board snapshot predates the November leadership changes; the long auditor relationship deserves continued scrutiny despite lead-partner rotation.
  - facts: F0686, F0687, F0689, F0691, F0692, F0705
### Q0186 · Does the shareholder vote against a sold-product emissions report remove the climate disclosure risk for an ESG investor?  _risk_
- No. The rejected proposal does not eliminate the need to assess emissions from use of sold products.
- The board opposed the proposal while saying it planned to enhance Scope 3 reporting, including product use; the team’s Bloomberg series also shows rising reported Scope 3 emissions.
- We need the delivered disclosure, its boundaries and comparable underlying data before judging progress; a proposed enhancement and an advisory vote are not evidence of a reduction.
  - facts: F0700, F0701, F0702, F0022, F0023, F0024
### Q0187 · Has the board or government found that Jensen Huang committed wrongdoing?  _neutral_
- NVIDIA said its independent-director committee investigation would proceed to conclusion; that is an ongoing process, not a finding.
- The same company statement said NVIDIA would continue cooperating with ongoing government investigations and inquiries.
- The reported foreign-intelligence targeting is the stated context for the board probe; the sources reviewed here do not establish a final finding or government outcome.
  - facts: F0071, F0072, F0070
### Q0188 · Do direct customer revenue shares capture NVIDIA’s full end-demand concentration?  _risk_
- No. Direct customers can be intermediaries, and indirect end-customer revenue is estimated from several sources.
- NVIDIA says some indirect customers individually represent at least 10% of revenue; it does not name them in this disclosure.
- The channels overlap, so do not add direct and indirect shares together.
  - facts: F0711, F0712, F0713
### Q0189 · Are sales booked to Taiwan-headquartered customers necessarily final demand in Taiwan?  _neutral_
- No. NVIDIA assigns sales geographically by the direct customer’s headquarters, which may differ from the end customer and shipping destination.
- For FY26 NVIDIA estimated 76% of Data Center revenue from Taiwan-headquartered customers was attributable to US and European end customers.
- That estimate applies to that segment and period, not all Taiwan sales.
  - facts: F0717, F0718
### Q0190 · Does NVIDIA disclose how much revenue sovereign AI generates?  _neutral_
- The cited filing does not separately quantify sovereign demand.
- NVIDIA identifies sovereign customers among several drivers of ACIE growth, alongside AI natives, enterprises and hyperscalers using AI clouds.
- ACIE is a broader grouping; its growth rate cannot be attributed solely to sovereign demand.
  - facts: F0716
### Q0191 · Does hyperscaler capital spending translate directly into NVIDIA orders?  _neutral_
- No. Broad capital spending includes facilities and other infrastructure, so it cannot be treated as NVIDIA orders.
- Microsoft says it will continue investing in cloud and AI infrastructure; its planned property additions cover facilities and computer systems for several functions.
- The sourced disclosures here do not establish NVIDIA’s share or an order forecast.
  - facts: F0724, F0725
### Q0192 · Can infrastructure spending pressure a major customer’s margins or face physical constraints?  _risk_
- Yes. Microsoft warns that cloud, AI infrastructure and device investments will increase operating costs and may reduce operating margins.
- It also says datacenters depend on buildable land, predictable energy, networking supplies and servers.
- Those constraints can affect deployment, but these disclosures do not quantify a delay in NVIDIA orders.
  - facts: F0726, F0729
### Q0193 · Are Microsoft’s datacenter commitments the same as its annual GPU budget?  _neutral_
- No. They are different measures and cannot be read as a GPU budget.
- At June 30, 2026, Microsoft reported $34.6 billion in construction commitments, primarily datacenters, and $329.1 billion in leases not yet commenced, also primarily datacenters.
- Some leases are conditional; neither figure is an annual NVIDIA order forecast.
  - facts: F0727, F0728
### Q0194 · If customers cut orders during a Taiwan disruption, can NVIDIA protect revenue and margins?  _risk_
- Not with certainty: a supply shock and a demand shock can occur together, affecting shipments and leaving unwanted commitments.
- NVIDIA warns that qualifying replacement suppliers can delay production; it has also recorded an H200 inventory and purchase-obligation charge.
- The available evidence cannot quantify the combined impact. We would stress-test qualified capacity, recovery time, cancellation terms and inventory recoverability before sizing a loss.
  - facts: F0592, F0593, F0598, F0262
### Q0195 · Can the board conclude that NVIDIA growth is environmentally sustainable from its own water and emissions figures?  _risk_
- Not yet. NVIDIA’s operational water data exclude fabrication, and its changed collection methods prevent a prior-year comparison.
- Product-use emissions can depend on assumed lifetime and usage, while NVIDIA said it planned enhanced Scope 3 reporting including sold-product use.
- Ask for comparable, independently assured supply-chain and customer data, basin-level water stress and transparent emissions boundaries before judging the growth trajectory.
  - facts: F0540, F0543, F0517, F0519, F0702 · visuals: V0069
### Q0196 · Can you separate NVIDIA revenue from AI clouds, industrial buyers, enterprises and sovereign customers?  _neutral_
- Bloomberg's preliminary Q3 FY27 dataset groups AI clouds, industrial and enterprise together at .474 billion; it does not separately identify those three categories.
- NVIDIA says sovereign demand contributed to ACIE growth, but does not quantify sovereign revenue separately.
- Treat the grouped bucket as an analyst dataset, not company-reported customer revenue.
  - facts: F0090, F0716
### Q0197 · Does NVIDIA's non-hyperscaler growth mean demand is diversified across independent end users?  _risk_
- Bloomberg's preliminary Q3 FY27 breakdown puts hyperscalers at .136 billion and the combined AI cloud, industrial and enterprise group at .474 billion.
- NVIDIA says indirect customers include some individually representing at least 10% of revenue, and its estimates rely on purchase orders and internal sales data.
- The disclosures do not show the ultimate end-user split within AI clouds, industrial and enterprise.
  - facts: F0088, F0090, F0711, F0712
### Q0198 · What has NVIDIA actually announced in Saudi Arabia, and is it delivered?  _neutral_
- NVIDIA announced planned deployments with HUMAIN and Saudi authorities, but the announcement alone does not establish delivery.
- HUMAIN’s first phase was described as an 18,000 GB300 supercomputer; the SDAIA factory was to use up to 5,000 Blackwell GPUs.
- The larger HUMAIN capacity and GPU figures were projections, not evidence of completed installations.
  - facts: F0730, F0731, F0732, F0733
### Q0199 · Do the Saudi and UAE AI announcements prove a low-carbon expansion?  _risk_
- No. The announcements describe planned infrastructure, not verified lifecycle emissions or energy use.
- G42 said the UAE campus would use nuclear, solar and natural gas, without specifying their shares.
- Capacity figures do not establish actual electricity consumption or emissions.
  - facts: F0730, F0736, F0738, F0739
### Q0200 · Does the UAE Stargate announcement show NVIDIA has secured quantified revenue?  _risk_
- It shows a planned supplier role, but the cited announcement does not disclose NVIDIA revenue or a GPU count.
- G42 said NVIDIA would supply Grace Blackwell systems; G42 would build the cluster and OpenAI and Oracle would operate it.
- The first cluster was expected to go live the following year; the announcement does not prove it went live.
  - facts: F0735, F0736, F0737
### Q0201 · Does European sovereign AI guarantee NVIDIA sales?  _risk_
- No. Sovereign projects create demand, but procurement is contested.
- Greece’s DAEDALUS uses more than 2,000 NVIDIA GH200 superchips, while France’s planned Alice Recoque and Finland’s planned LUMI-AI specify AMD accelerators.
- DAEDALUS’s EUR 36 million acquisition cost is for the whole system, not NVIDIA revenue; planned systems are not confirmed operational.
  - facts: F0751, F0740, F0743, F0756, F0744, F0745
### Q0202 · Is India building sovereign AI with NVIDIA alone?  _neutral_
- No. India’s compute programme uses a mix of suppliers.
- In May 2025 the government announced 34,333 empanelled GPUs; the programme lists NVIDIA, AMD, Intel and AWS compute options.
- The capacity and programme budget do not tell us NVIDIA’s share, sales or incremental revenue.
  - facts: F0755, F0746, F0753
### Q0203 · Can NVIDIA keep sovereign AI customers in Japan if rivals compete?  _neutral_
- NVIDIA has a foothold, but it is not exclusive.
- SoftBank reported NVIDIA GB200 NVL72 deployed in its Japan data centres and announced a GPU cloud service; it also started a joint evaluation of AMD Instinct GPUs.
- An evaluation is not a purchase, and the cloud announcement alone does not confirm its full launch.
  - facts: F0747, F0748, F0749, F0750
### Q0204 · What is Isambard-AI's measured annual electricity and water use?  _risk_
- Bristol says its electricity comes from renewable UK sources, but the material reviewed gives no metered annual consumption figure.
- Its cooling loop circulates coolant and water, but no annual water consumption or withdrawal figure is reported there.
- We should not equate renewable supply or a closed loop with zero environmental impact.
  - facts: F0757, F0758, F0762
### Q0205 · Is Isambard-AI's PUE independently verified, and what is its lifecycle footprint?  _risk_
- Bristol reports an approximate PUE, but does not state the averaging period in the article.
- I found no independent confirmation of that PUE or a full lifecycle emissions inventory in the reviewed material.
- Bristol separately claims a reduction in construction emissions versus a traditional build; that is not a complete lifecycle result.
  - facts: F0759, F0760, F0761
### Q0206 · Can you separate NVIDIA revenue from AI clouds, industrial buyers, enterprises and sovereign customers, and what figures should we use?  _risk_
- The available Bloomberg dataset combines AI clouds, industrial and enterprise, so it cannot separate their contributions or sovereign revenue.
- Its preliminary Q3 FY27 estimate for that combined group is 47.474 billion US dollars; NVIDIA says sovereign demand contributed to growth but does not separately quantify it.
- This is a preliminary analyst grouping, not a company-reported sovereign revenue figure.
  - facts: F0090, F0716
### Q0207 · Does non-hyperscaler growth prove NVIDIA has diversified independent end-user demand?  _risk_
- No. The available breakdown groups several customer types and does not identify their ultimate end users.
- Bloomberg estimates preliminary Q3 FY27 hyperscaler revenue of 60.136 billion US dollars and combined AI cloud, industrial and enterprise revenue of 47.474 billion US dollars.
- NVIDIA says some indirect customers each account for at least 10% of revenue, and estimates rely on purchase orders and internal sales information.
  - facts: F0088, F0090, F0711, F0712
### Q0208 · How much of NVIDIA manufacturing can Arizona replace if Taiwan is disrupted?  _risk_
- The replacement share is unknown, so we cannot quantify the shortfall.
- NVIDIA reported a Blackwell wafer made at TSMC Phoenix, but did not disclose equivalent spare capacity.
- Advanced packaging, testing and logistics must also be available; qualifying alternatives takes time.
  - facts: F0765, F0191, F0592, F0774
### Q0209 · Do packaging expansion plans remove the Taiwan bottleneck?  _risk_
- No. Expansion reduces some concentration, but does not prove replacement capacity for a Taiwan shutdown.
- NVIDIA and Amkor target a greater than 300% increase in South Korean interposer capacity by end-2028.
- That target is a packaging input, not a measured increase in complete GPU output.
  - facts: F0768, F0770, F0192, F0591
### Q0210 · How quickly could production recover after a Taiwan blockade?  _risk_
- There is no supported recovery timetable in the available evidence.
- Recovery depends on damage and access to materials, power, transport, packaging and testing.
- NVIDIA warns a disaster or war may require substantial time and spending, and continuity plans may not cover every eventuality.
  - facts: F0593, F0594, F0774
### Q0211 · How should we think about a local disruption versus a Taiwan-wide conflict?  _risk_
- Treat them as different scenarios, not forecasts with a reliable recovery clock.
- A local interruption may permit a restart if utilities and equipment recover; a wider conflict may also disrupt packaging and transport.
- NVIDIA warns recovery could take substantial time, and the available alternative capacity is not quantified.
  - facts: F0593, F0594, F0765, F0774 · visuals: V0072
### Q0212 · If Washington grants a licence, can NVIDIA automatically sell the chip in China?  _risk_
- No. US permission and access to the Chinese market are separate hurdles.
- NVIDIA says China restricted sales even after some H20 and H200 licences were granted.
- The company says Chinese officials also discouraged customers from buying its data-centre products, and it was unable to sell all licensed H200 products.
  - facts: F0776, F0597, F0783
### Q0213 · What did export controls actually cost, and does the company still depend on China sales?  _risk_
- The restrictions have already caused inventory and purchase-obligation charges.
- NVIDIA recorded a $4.5 billion H20 charge in Q1 FY26 and a $0.4 billion H200 charge in the first half of FY27.
- The latest outlook assumes no China data-centre compute revenue; this is an assumption, not proof that the wider business has no China exposure.
  - facts: F0204, F0598, F0785
### Q0214 · Are proposed cloud access restrictions already law?  _risk_
- Do not treat a proposal as an effective ban without checking its enactment and implementing rules.
- In its Q2 FY27 filing NVIDIA described the Remote Access Security Act as legislation under consideration and said a replacement for the AI Diffusion rule remained uncertain.
- The exact scope and current status of newer rules still require verification against the final regulatory text.
  - facts: F0782, F0781, F0611
### Q0215 · Do export restrictions affect more than the blocked AI chip sale?  _risk_
- Yes. NVIDIA warns that restrictions can also reduce demand for networking equipment paired with its GPUs.
- It also says losing access helps competitors develop customer and developer ecosystems.
- Those competitive effects are company assessments, not a measured revenue loss.
  - facts: F0784, F0779
### Q0216 · Does NVIDIA recognize revenue before customers pay, and what happens if payment terms lengthen?  _risk_
- Yes: product revenue is generally recognized when control transfers, while cash may arrive later.
- NVIDIA says extended terms on large multi-quarter agreements increased receivables and partly offset operating cash-flow growth; cash collection and credit quality deserve scrutiny.
- Allowances and customer incentives reduce reported revenue, but those policies alone do not establish collectibility for a particular deal.
  - facts: F0625, F0791, F0792, F0787, F0788
### Q0217 · What does NVIDIA receive in exchange for guaranteeing an OpenAI-related data-center project?  _risk_
- The guaranteed site is required to host NVIDIA AI infrastructure exclusively, with limited exceptions.
- The guarantee is capped and contingent on defined lease and power obligations, not an upfront purchase; termination conditions include satisfactory OpenAI creditworthiness.
- This aligns the project with NVIDIA equipment while exposing NVIDIA to counterparty and project risks; the filing does not quantify incremental NVIDIA revenue from the guarantee.
  - facts: F0795, F0618, F0620, F0796, F0627
### Q0218 · Do NVIDIA investments in AI infrastructure financiers appear as consolidated customer revenue?  _neutral_
- Not automatically: NVIDIA says it does not consolidate its variable interest investments in which it is not the primary beneficiary.
- The company has investments and commitments across model makers and infrastructure financiers, and AI clouds buy its hardware while NVIDIA commits to cloud services.
- These links create real shared exposure, but the filings cited do not isolate the share of NVIDIA sales funded by its own investments or prove accounting misconduct.
  - facts: F0794, F0793, F0614, F0622
### Q0219 · What did NVIDIA actually find in its supplier labour checks, and were workers made whole?  _risk_
- NVIDIA disclosed supplier issues involving hiring fees, retained passports or documents, working hours and penalties for leaving early.
- It says it worked with partners to return fees and change practices, but engagement with corrective plans is not proof that every case was closed or that every worker was made whole.
- Ask for independently verified closure, repayment totals and worker feedback; NVIDIA also acknowledges that remediation can put vulnerable workers income at risk.
  - facts: F0635, F0636, F0634, F0637
### Q0220 · What does independent supplier auditing actually cover and what does it prove?  _risk_
- NVIDIA requires onsite third-party VAP audits of strategic suppliers and says it reviewed audits covering 93% over two years, not all suppliers.
- The RBA says approved third-party firms use its protocols, and its VAP covers several social, environmental and governance criteria.
- The percentage measures strategic-supplier coverage, not a verified remediation success rate or proof that upstream supply chains are free of forced labour.
  - facts: F0630, F0633, F0807, F0811, F0640
### Q0221 · Does the RBA corrective action plan guarantee NVIDIA supplier problems have been fixed?  _risk_
- No. A corrective action plan records expected corrective and preventive action; a plan is not proof that the fix worked.
- The RBA says findings have severity ratings and remediation timelines, and announced plans would be included with onsite assessments going forward.
- NVIDIA says it engaged relevant strategic suppliers on plans for audits conducted, but that does not establish independent closure or worker outcomes.
  - facts: F0808, F0809, F0810, F0634
### Q0222 · If a financed customer delays payment during a Taiwan disruption, what should this board watch?  _risk_
- Watch collection risk and physical supply risk together: neither a data-centre commitment nor a guarantee establishes the resulting loss.
- NVIDIA says extended payment terms increased receivables, while component supply and capacity are not guaranteed.
- Ask for named counterparty exposure, collections, qualified alternative capacity and contract terms before quantifying a combined downside.
  - facts: F0791, F0772, F0615, F0621
### Q0223 · Could a cleaner data centre still leave NVIDIA exposed to climate and water risks?  _risk_
- Yes. Cleaner electricity at one facility does not establish a low footprint for the entire chip supply chain or every customer workload.
- Bristol says Isambard-AI uses renewable electricity; NVIDIA's operational water figures do not include its chip fabrication, and product-use emissions depend on usage and lifetime assumptions.
- Request metered facility impacts, supplier water stress and comparable value-chain emissions before drawing a portfolio-wide conclusion.
  - facts: F0757, F0540, F0517, F0519
### Q0224 · Could a cleaner data centre still leave NVIDIA exposed to climate and water risks, and what evidence supports that?  _risk_
- Yes. Cleaner electricity at one facility does not establish a low footprint for the entire chip supply chain or every customer workload.
- Bristol says Isambard-AI uses renewable electricity; NVIDIA says it is fabless and has no manufacturing facilities of its own, while product-use emissions depend on usage and lifetime assumptions.
- Request metered facility impacts, supplier water stress and comparable value-chain emissions before drawing a portfolio-wide conclusion.
  - facts: F0757, F0543, F0517, F0519
### Q0225 · Are chip manufacturing facilities exposed to water stress?  _risk_
- Yes. Samsung classifies its Xi’an and Suzhou semiconductor sites as extremely high water stress, and its Korean sites and Austin and Taylor sites as medium-high.
- These are Samsung site classifications, not proof of NVIDIA-specific water use or a current production interruption.
  - facts: F0818, F0819, F0820
### Q0226 · Can replenishment or water reuse be counted as lower water consumption?  _neutral_
- No. Reuse and replenishment are separate measures from withdrawal and consumption.
- Samsung reports water reuse of 134,011 thousand tonnes in 2025; that figure cannot be substituted for its consumption.
- Site-level consumption and verified watershed impacts still need checking.
  - facts: F0821, F0547, F0548
### Q0227 · Does NVIDIA’s own water total capture the water used to make its chips?  _risk_
- No. NVIDIA is fabless, so its operational water total does not include supplier manufacturing sites.
- Samsung reports combined surface-water supply for its Korean semiconductor sites, but it cannot be attributed to NVIDIA alone.
- Comparable site-level withdrawal and consumption across NVIDIA suppliers remain unverified.
  - facts: F0543, F0537, F0538, F0825
### Q0228 · Are NVIDIA climate targets independently validated and do they guarantee falling total emissions?  _risk_
- Yes, NVIDIA says its targets are validated, but validation is not a guarantee of delivery.
- The sold-GPU goal is an intensity target, so total use emissions can rise even if emissions per unit of compute fall.
  - facts: F0834, F0832, F0525, F0526
### Q0229 · Does engaging suppliers prove they have adopted science-based targets?  _risk_
- No. NVIDIA describes engaging suppliers, which is different from demonstrating adoption or delivering emissions cuts.
- The company says the engaged suppliers represented over 80% of its purchased-goods emissions in FY25.
  - facts: F0839, F0840
### Q0230 · What is missing from the headline scope three emissions figure?  _risk_
- The published table lists upstream categories through leased assets, but does not list use of sold products.
- NVIDIA said it planned to enhance reporting of use-phase emissions, which depend on customer activity and product lifetime.
  - facts: F0702, F0517, F0519
### Q0231 · What is the main reported supply-chain climate exposure?  _risk_
- Purchased goods and services are the largest category in the reported table, followed by capital goods.
- Greenpeace says the report did not disclose concrete supplier renewable-energy support; NVIDIA expects suppliers to disclose their impacts.
  - facts: F0835, F0836, F0830, F0841
### Q0232 · Do independent benchmarks prove NVIDIA wins every AI workload?  _neutral_
- No. MLPerf Training v6.1 includes NVIDIA, AMD and Google accelerator systems across several workloads; participation alone does not establish a winner.
- Compare matched model, accuracy, scenario, system size, availability and total cost before drawing a conclusion.
- The retrieved release does not give us a verified like-for-like result or cost ranking.
  - facts: F0844, F0846
### Q0233 · Can a customer reduce AI training costs by moving to a custom chip?  _risk_
- Potentially: AWS reports that its Trainium-based Trn1 can lower training cost, and an AWS-hosted Stockmark testimonial reports a 20% reduction against equivalent GPU instances.
- That is a customer-reported result for one workload, not an independently audited universal saving; the precise GPU comparator is not specified.
- Actual economics also depend on migration, utilization and the workload.
  - facts: F0853, F0854
### Q0234 · How expensive is it to leave CUDA for a competitor?  _neutral_
- The cost depends on the application, and we cannot quantify it from these sources.
- AMD offers translation tools, but says unsupported libraries cannot be translated and NVIDIA-optimized code may need further optimization on AMD hardware.
- AWS says its Neuron SDK integrates with common frameworks; portability can reduce the barrier without proving every application migrates unchanged.
  - facts: F0169, F0850, F0851, F0852, F0855
### Q0235 · Does a RAG benchmark prove the same performance for a live board question?  _neutral_
- No. MLCommons tests a multi-stage retrieval and question-answering pipeline, but its first end-to-end RAG benchmark uses an offline throughput scenario.
- A valid submission must reach at least 97% of reference answer accuracy.
- That result alone does not establish interactive response latency, energy use or the economics of our app.
  - facts: F0848, F0849
### Q0236 · Where is the evidence that AI customers get an economic return?  _neutral_
- There is evidence of productivity in specific tasks, but not proof that the industry earns an adequate return on its total AI investment.
- One NBER customer-support study found 14% more issues resolved per hour on average, with a 34% gain for novice and low-skilled workers and little impact on experienced workers.
- Those are task-level outcomes from one setting, not audited profits, customer-wide savings or a return on GPU capex.
  - facts: F0856, F0857, F0858
### Q0237 · Are customers actually making money as AI infrastructure spending rises?  _risk_
- Demand indicators are strong, but customer returns remain unproven.
- Microsoft reported 48% Azure revenue growth in its fiscal first quarter, and Microsoft Cloud gross margin fell to 66% in the preceding fiscal year as AI infrastructure spending and usage rose.
- Azure and Microsoft Cloud cover non-AI services; revenue growth and management confidence are not a disclosed AI return on invested capital.
  - facts: F0862, F0860, F0861
### Q0238 · What does a customer spending pause do to your valuation?  _risk_
- Our modelled bear case shows material downside; it is not a prediction.
- From FY27 consensus of $422.22 billion, assumed revenue is $464.44 billion in FY28, $441.22 billion in FY29 and $485.34 billion in FY30.
- The model values this scenario at $101.20 per share using a 10.55% discount rate.
- The spending pause, lost share and cash margin are assumptions; a worse outcome is possible.
  - facts: F0869, F0864, F0865, F0866, F0867, F0868 · visuals: V0075
### Q0239 · Your financial documents quote a different bear valuation. Which figure should we present?  _risk_
- Use $101.20 per share for the bear scenario in the current app dataset; it is a model output, not a market price or prediction.
- An older model document quotes $101.56; its version and assumptions need reconciling before the figures are compared.
- The model uses a 10.55% discount rate, and downside depends on its assumptions.
  - facts: F0870, F0868 · visuals: V0075
### Q0240 · Does a lower emissions intensity prove that NVIDIA sold products cause less total pollution?  _risk_
- No. Intensity measures emissions per unit of computing, so absolute emissions can rise as computing use grows.
- NVIDIA targets a 75% reduction per PFLOP for sold-GPU use by FY30 from an FY23 base.
- We do not have verified total sold-product use emissions or evidence that the target is on track.
  - facts: F0832, F0834, F0517, F0526
### Q0241 · Does Ecolab’s virtual twin independently prove that its AI cooling saves water?  _risk_
- No. The virtual twin is a simulation, not independent measurement of water saved at a working site.
- Ecolab says it models the facility water system and cooling system together, including water and power trade-offs.
- Ask for independently verified, weather- and workload-adjusted whole-site results against a comparable baseline.
  - facts: F0871, F0872, F0030
### Q0242 · What evidence would make an Ecolab cooling water-savings claim credible?  _risk_
- Ask for metered whole-site water consumption before and after, or against a matched baseline, adjusted for workload and weather.
- Include electricity-related water and local water stress, and ask an independent party to verify the calculation.
- Ecolab’s published virtual twin explores trade-offs, but it is a simulation rather than an independent site result.
  - facts: F0871, F0872, F0030, F0029
### Q0243 · Are Bloomberg's 51.62 disclosure score and its scores out of 10 comparable?  _neutral_
- No. Bloomberg's FY22 social disclosure score is 51.62 and FY25 is 5.37; these are the disclosure series, not the 1-to-10 social pillar series.
- The FY25 social pillar score is 3.63 out of 10.
- Keep disclosure and pillar scores on separate scales; Bloomberg says ESG-score usefulness depends partly on quantitative disclosure.
  - facts: F0049, F0050, F0447, F0875
### Q0244 · What does Bloomberg's 51.62 social disclosure score mean?  _risk_
- It is the Bloomberg social disclosure score for FY22, not the social pillar score.
- Bloomberg recorded 5.37 for that disclosure series in FY25; the separate FY25 social pillar score is 3.63 out of 10.
- Treat disclosure and ESG performance as distinct measures, and avoid claiming the disclosure score itself is a social outcome.
  - facts: F0049, F0050, F0447, F0875
### Q0245 · Can we rely on the environmental trend charts in the backup deck?  _risk_
- Not all of them: check the reporting boundary before showing a trend.
- NVIDIA says its operational water figures are not comparable with prior years because collection methods changed; the backup water answer should not claim a rising trend.
- The upstream emissions chart shows reported categories, but excludes unreported product use; revised prior-year emissions are not assured. Verify comparable boundaries before using a Scope 3 trend.
  - facts: F0674, F0829, F0517, F0835, F0836, F0837 · visuals: V0074
### Q0246 · Which discount rate supports your valuation, and is it really Bloomberg’s?  _risk_
- The current bear scenario uses the industry-average discount rate and is a modelled outcome, not a forecast.
- A separate input is labelled Bloomberg in the app dataset, but its attribution is disputed in the project reconciliation. Treat it as a team assumption until the original screen is checked.
- Reconcile the model inputs and source labels before presenting rate sensitivities.
  - facts: F0868, F0867, F0876 · visuals: V0075
### Q0247 · Could AI customer growth come at the expense of cash collection and customer margins?  _risk_
- Yes: revenue growth does not settle either collection risk or customer returns.
- NVIDIA says longer payment terms increased receivables and affect operating cash flow timing. Microsoft reported lower cloud gross margin while investing in AI infrastructure.
- Neither disclosure proves a customer default or identifies the return on NVIDIA purchases; seek collections and AI-specific economics.
  - facts: F0791, F0792, F0860
### Q0248 · What specifically explains the guided gross-margin decline?  _risk_
- Management linked its expected Q4 margin low to honoring earlier customer purchase orders while moving to new pricing, after a significant change in supply costs.
- Kress said NVIDIA absorbed some costs, but the call did not quantify each driver; the gross-margin recovery is management’s forecast, not a guarantee.
- The better product mix cited for the Q3 beat should not be treated as a quantified explanation of the Q4 decline.
  - facts: F0877, F0878, F0883, F0126, F0127
### Q0249 · What drove Edge Computing growth, and can we isolate gaming from it?  _neutral_
- Management attributed sequential Edge Computing growth to enterprise demand for Blackwell workstations and physical AI edge compute.
- Edge combines several activities, and the Q3 call and release do not supply a separate gaming revenue figure; do not label the whole Edge total as gaming.
  - facts: F0881, F0116, F0148
### Q0250 · Why are operating expenses rising, and is the whole increase recurring?  _risk_
- Management attributed the latest sequential expense growth to higher compute and infrastructure spending.
- Expenses came in marginally below outlook primarily due to the timing of non-recurring engineering costs.
- The next-quarter forecast includes an extra week and transition-related costs. Management did not quantify those effects or establish how much is recurring.
  - facts: F0879, F0880, F0125, F0119
### Q0251 · Can we still track NVIDIA gaming, professional visualization and automotive revenue separately?  _risk_
- The company’s reviewed FY27 earnings releases present these activities within broader Edge Computing, so they do not provide a directly comparable current breakdown.
- The final separately highlighted Gaming quarter in the FY26 releases was $3.7 billion; the new Edge Computing figure reached $8.2 billion in Q3 FY27.
- Edge is broader than gaming and also includes workstations, robotics and automotive, so do not compare the two as if they were the same market.
  - facts: F0137, F0116, F0891
### Q0252 · Does NVIDIA still disclose data-center compute versus networking revenue each quarter?  _risk_
- The reviewed Q1 FY27 release gave the old compute and networking split, but the reviewed Q2 and Q3 releases did not separately quantify it.
- For Q1 FY27, Data Center compute was $60.4 billion and networking was $14.8 billion.
- The new framework describes Hyperscale and ACIE by customer market, so it is not a like-for-like replacement for the product split.
  - facts: F0135, F0136, F0890, F0148
### Q0253 · Do the old quarterly Professional Visualization releases always reconcile exactly?  _neutral_
- Not exactly in the figures reviewed: one release reports $511 million for the final FY25 quarter, while the next reports $509 million for the prior quarter and describes it as flat.
- We have not established why the comparison differs, so show the originally reported figures and avoid claiming a confirmed restatement.
  - facts: F0885, F0888
### Q0254 · How should we read the Professional Visualization figures across the FY25 to FY26 boundary?  _neutral_
- The releases report $511 million in the final quarter of FY25 and $509 million in the first quarter of FY26.
- NVIDIA described the latter as flat sequentially; that is consistent with a rounded growth description, and we have not established any restatement.
  - facts: F0885, F0888
### Q0255 · Does your direct-emissions chart prove NVIDIA is cleaner than chipmakers that own fabs?  _risk_
- No. The chart compares emissions from company operations and purchased power per revenue; it is not a comparison of complete product footprints.
- NVIDIA says it is fabless, so its chip manufacturing occurs outside its own facilities.
- Compare supplier and product-use emissions on consistent boundaries before claiming environmental leadership.
  - facts: F0543, F0517, F0519 · visuals: V0036
### Q0256 · Can you justify the environmental cost of this particular AI pitch?  _risk_
- We cannot yet: we have not measured this presentation or a credible non-AI alternative.
- AI water impacts can arise from cooling, electricity generation and server manufacturing; the relevant workload and location matter.
- Measure electricity and water across those boundaries and compare with a defined alternative before claiming a net benefit.
  - facts: F0030, F0037
### Q0257 · Can we substantiate NVIDIA’s current share of all AI accelerators?  _neutral_
- We cannot responsibly quote a current all-accelerator percentage from the evidence checked here.
- The independent MLPerf training results include systems using NVIDIA, AMD and Google hardware, but they are benchmark submissions, not an inventory or revenue census.
- A market-share claim needs a dated independent estimate with a clear denominator, including whether captive cloud chips are counted.
  - facts: F0844, F0845, F0846
### Q0258 · Does a GPU market-share estimate capture the threat from cloud companies’ own AI chips?  _risk_
- Not necessarily: an estimate limited to merchant GPUs can omit accelerators designed for cloud providers’ own workloads.
- AWS describes Trainium as a purpose-built training and inference chip, and Meta describes MTIA as designed for its own recommendation workloads.
- Without a comparable dated source covering both merchant and captive accelerators, the size of any NVIDIA share loss is unknown.
  - facts: F0150, F0157, F0158
### Q0259 · How large is the custom-chip threat from Marvell and Broadcom?  _risk_
- It is commercially significant, but the disclosed totals are broader than custom chips.
- Broadcom reported $8.4 billion of AI revenue in Q1 FY2026, including networking as well as custom accelerators; its Q2 AI semiconductor revenue was $10.8 billion.
- Marvell reported $2,171.5 million of data-centre revenue in Q2 FY2027 across a broader portfolio.
- Neither total identifies ASIC-only revenue, NVIDIA share lost, or specific customer purchases.
  - facts: F0896, F0486, F0899
### Q0260 · Does Microsoft building Maia mean it no longer needs NVIDIA?  _neutral_
- No: Microsoft has developed its own accelerator, but this evidence does not quantify substitution.
- Microsoft designed Maia 100 for Azure AI workloads and described software integration with PyTorch and ONNX Runtime.
- The reviewed disclosures do not establish current Maia deployment volumes or the share of workloads displaced from NVIDIA.
  - facts: F0892, F0893, F0894
### Q0261 · Are custom AI chips automatically greener than NVIDIA GPUs?  _neutral_
- Not automatically: efficiency depends on the workload and the whole system.
- Microsoft says Maia 100 uses rack-level closed-loop liquid cooling; Marvell says custom designs can align compute and memory with a workload.
- These statements do not establish measured lifecycle emissions or a matched comparison against NVIDIA.
  - facts: F0895, F0901
### Q0262 · What does Marvell actually contribute to a hyperscaler custom chip?  _neutral_
- It can provide design and implementation services around customer-owned compute.
- Marvell describes design-to-spec and co-development models and says customer-developed compute can remain central.
- The reviewed disclosures do not establish which named hyperscalers buy each design or how much revenue each generates.
  - facts: F0901, F0902
### Q0263 · Does Intel Gaudi outperform NVIDIA on AI workloads?  _neutral_
- Intel advertises 33% more I/O connectivity than H100, which compares interconnect specifications rather than end-to-end workload throughput.
- For a fair performance comparison, use MLPerf Closed results with the same reference model, and compare only systems in the same benchmark scenario and availability class.
- The current sources reviewed here do not establish a recent matched Gaudi-versus-NVIDIA workload result or Gaudi shipment and revenue figure.
  - facts: F0910, F0911, F0912
### Q0264 · Is AMD catching NVIDIA in AI accelerators?  _risk_
- AMD reported USD 8.546 billion Q3 2026 Data Center revenue, up 97% year over year, and says customers are running MI450-based Helios systems.
- That revenue includes EPYC CPUs and other products; it is not GPU revenue or accelerator market share.
- We lack a verified matched workload result here to establish relative performance.
  - facts: F0913, F0907
### Q0265 · Does the evidence prove NVIDIA accelerators are greener than competing AI chips?  _risk_
- No: the available evidence here does not establish a cross-vendor lifecycle winner.
- A meaningful comparison needs the same workload and quality, measured system power, and matched manufacturing and operating boundaries.
- MLPerf measures whole-system wall power for its accompanying benchmark, but that does not itself include embodied emissions.
  - facts: F0914, F0915, F0916
### Q0266 · Could faster AI hardware still have a larger lifecycle footprint?  _risk_
- Yes: operating electricity is only part of the footprint, and the result depends on manufacturing, utilization and lifetime.
- One Facebook research case estimated an embodied share of 30% under its own assumptions and used a proxy for GPU hardware rather than a product measurement.
- That estimate is illustrative, not a current product comparison or proof of a universal share.
  - facts: F0915, F0916, F0922
### Q0267 · Could NVIDIA face power delays and water stress at the same time even if its chips get more efficient?  _risk_
- Yes. More efficient computation does not eliminate physical limits on power and water at particular sites.
- The IEA warns that grid risks could delay planned data centres; Samsung identifies water-stressed semiconductor sites.
- Those disclosures do not quantify NVIDIA’s exposure at a given location or establish that efficiency gains offset total demand.
  - facts: F0007, F0818, F0819, F0924
### Q0268 · Does a supplier climate engagement target prove NVIDIA’s supply-chain emissions will fall?  _risk_
- No. An engagement goal is not a measured reduction in absolute emissions.
- NVIDIA reports substantial purchased-goods emissions and describes a goal covering suppliers responsible for a share of that category.
- We still need verified supplier outcomes, consistent boundaries and comparable progress before claiming the target is on track.
  - facts: F0835, F0840 · visuals: V0074
### Q0269 · How large is the CUDA developer ecosystem, and is its growth proof of a moat?  _neutral_
- NVIDIA reports millions of developers using CUDA and its other software tools, indicating a substantial ecosystem.
- Its filings cite 3.8 million in FY2023, over 4.7 million in FY2024 and over 7.5 million in FY2026.
- These are company-reported broader-tool counts, not CUDA-only users, and they do not establish exclusive use, switching costs or revenue.
  - facts: F0926, F0927, F0928
### Q0270 · How many CUDA libraries exist, and what do the numbers actually measure?  _neutral_
- NVIDIA’s 2024 annual review said CUDA offered more than 300 libraries.
- The same review separately listed 600 AI models and 3,500 GPU-accelerated applications; do not add these categories as if they were the same.
- The library count is historical and company-reported, with no verified current count or counting methodology.
  - facts: F0930, F0932, F0933
### Q0271 · Do CUDA downloads prove NVIDIA has that many developers locked in?  _risk_
- No: downloads are not unique developers or evidence of exclusive use.
- NVIDIA’s 2024 annual review reported more than 48 million CUDA downloads, while its FY2024 filing reported over 4.7 million developers using CUDA and other NVIDIA software tools.
- The figures count different things, and neither establishes how many developers would face prohibitive switching costs.
  - facts: F0931, F0927
### Q0272 · How much revenue does NVIDIA AI Enterprise actually generate?  _risk_
- The reviewed NVIDIA filings do not separately quantify AI Enterprise revenue, so we cannot responsibly give a figure.
- NVIDIA sells paid AI Enterprise licenses, but its Compute & Networking segment combines software with hardware and other businesses.
- Treat any outside estimate or annualized run rate as distinct from reported, recognized revenue; the company warns standalone software sales may not become meaningful.
  - facts: F0937, F0938, F0939
### Q0273 · Can we use deferred revenue or contracted obligations as a proxy for NVIDIA software sales?  _risk_
- No: these balances mix several types of business and are not software-only sales.
- NVIDIA says unearned revenue includes hardware and software support and cloud services; its remaining performance obligations are a contract balance, not recognized annual software revenue.
- The disclosed balance cannot establish AI Enterprise revenue, recurring revenue, or software margins.
  - facts: F0941, F0942, F0943
### Q0274 · Does NVIDIA already have a proven recurring software revenue engine?  _neutral_
- There is a paid software offering, but its standalone financial contribution is not separately established by the reviewed filings.
- NVIDIA offers AI Enterprise licenses and warns its standalone offerings may fail to produce meaningful sales.
- License and support revenue can be recognized at different times, so a run rate should not be presented as audited annual revenue.
  - facts: F0937, F0939, F0944, F0945
### Q0275 · Does Triton make NVIDIA CUDA lock-in disappear?  _risk_
- No. Triton gives developers another way to target multiple GPU platforms, but that does not automatically convert an existing CUDA application or guarantee equal performance.
- The upstream project lists NVIDIA and AMD hardware support; Intel maintains a separate XPU backend.
- Actual migration effort, library dependencies, validation and workload performance still have to be measured.
  - facts: F0946, F0947, F0949, F0952, F0953
### Q0276 · Can we assume the same Triton code runs unchanged and just as fast on Intel GPUs?  _risk_
- No. Intel documents a separate XPU backend and modified tutorials, and recommends profiling end-to-end and kernel performance.
- Its documented software compatibility constraints make the exact stack important.
- We have no independent matched-workload benchmark or migration-cost estimate to support a numerical claim.
  - facts: F0949, F0950, F0952, F0953
### Q0277 · If NVIDIA meets its GPU emissions target, can the board conclude its total value-chain emissions have fallen?  _risk_
- No. The GPU goal is an emissions-intensity target, so it does not establish that absolute emissions from all sold products or the value chain will fall.
- NVIDIA separately reports purchased-goods emissions and sets a supplier engagement goal; these measures cover different boundaries.
- Its published inventory does not list use of sold products, so demand, product use and the missing category must be assessed before claiming an overall reduction.
  - facts: F0834, F0835, F0840, F0702 · visuals: V0074
### Q0278 · Does broad strategic-supplier audit coverage mean workers have been reimbursed for illegal recruitment fees?  _risk_
- No. Audit coverage measures which strategic suppliers were reviewed, not whether every affected worker was reimbursed.
- NVIDIA reports reviews covering 93% of its strategic suppliers over two years and identifies hiring fees and retained documents among non-compliance issues.
- It reports engagement on corrective plans, but independent repayment, worker outcomes and coverage beyond strategic suppliers remain necessary to assess remediation.
  - facts: F0633, F0635, F0634
### Q0279 · Does NVIDIA networking have an unassailable advantage over Ethernet competitors?  _risk_
- No. InfiniBand is designed for tightly coupled, low-latency workloads, but it brings additional hardware and operating considerations compared with Ethernet.
- Broadcom also offers AI-oriented Ethernet switching with adaptive routing and congestion-control capabilities. NVIDIA sells Spectrum-X Ethernet too.
- We lack an independent, matched workload comparison, so we cannot rank the systems or infer market share from product specifications.
  - facts: F0955, F0960, F0187, F0183
### Q0280 · Does InfiniBand prove NVIDIA dominates all AI networking?  _neutral_
- No. The InfiniBand trade association reported that it connected 63 of the top 100 supercomputers in June 2023; that is a historical supercomputer count, not current AI networking revenue share.
- Canonical expects the specialised fabric to coexist with Ethernet, and Broadcom offers competing high-capacity Ethernet switch silicon.
- We need current, independently sourced market shares with clearly defined scope before making a dominance claim.
  - facts: F0963, F0961, F0186
### Q0281 · Can you prove NVIDIA networking uses less energy than Broadcom or Arista?  _risk_
- Not from the available evidence. Network energy needs a matched comparison of complete systems under the same workload and conditions.
- Vendor switch capabilities and theoretical bandwidth do not establish energy per completed training job.
- The ESG case should remain qualified until an independent, reproducible energy benchmark is available.
  - facts: F0962, F0186
### Q0282 · Can we compare the latest networking revenue with the old quarterly series?  _neutral_
- Only cautiously: the first-quarter bridge uses the previous Data Center networking definition.
- A call transcript says the latest networking franchise revenue exceeded $21 billion, but its scope has not been reconciled with the old line.
- Treat that as a lower bound, not an exact comparable figure.
  - facts: F0136, F0967
### Q0283 · What powered the growth in networking and what is the disclosure risk?  _risk_
- Networking grew sharply, but the current breakdown is harder to compare.
- NVIDIA attributed 142% annual growth to NVLink and growth in Ethernet and InfiniBand.
- Its market-platform presentation changed, and customer reclassification led to recast prior-period figures.
  - facts: F0964, F0966
### Q0284 · What assumptions drive your free-cash-flow forecast?  _risk_
- We anchor the base case to consensus through FY28, then fade annual revenue growth to 3% by FY32.
- We apply the FY24–FY26 average free-cash-flow margin of 45.25% and discount each fiscal year-end cash flow at 10.55%.
- The base case reaches $874.22 billion of FY32 free cash flow. A slowdown or weaker margins would lower the valuation.
  - facts: F0968, F0969, F0970, F0868, F0973 · visuals: V0078, V0080, V0081
### Q0285 · How does a spending pause change the revenue path in your DCF?  _risk_
- In the bear case, a spending pause and lost share interrupt revenue growth.
- From FY27 consensus of $422.22 billion, the bear path rises to $464.44 billion, falls to $441.22 billion and then recovers to $485.34 billion.
- Applying our bear-case cash margin and the industry discount rate gives $101.20 per share. A deeper slowdown could drive it lower.
  - facts: F0864, F0865, F0866, F0867, F0868, F0869 · visuals: V0079, V0075
### Q0286 · How much of your enterprise value comes from terminal value?  _risk_
- Discounted terminal value accounts for 75.56% of base-case enterprise value.
- At the 10.55% discount rate, we get $7.08 trillion from cash flows after FY32 and $2.29 trillion from FY28–FY32 cash flows, both in present-value terms.
- The terminal estimate assumes 3% perpetual growth, so lower long-run growth or a higher discount rate would reduce the valuation.
  - facts: F0972, F0868, F0975, F0974, F0969 · visuals: V0082, V0084
### Q0287 · How do you get from enterprise value to the DCF value per share?  _neutral_
- We add $59.6 billion of net cash to enterprise value, then divide equity value by 24.186 billion diluted shares.
- That gives an implied $389.99 per share in our base case at the industry discount rate.
- The per-share result depends on hitting the cash-flow forecast and on the terminal assumptions.
  - facts: F0976, F0971, F0051, F0972 · visuals: V0083, V0084
### Q0288 · Which discount rate backs the base case and which rates do you stress?  _risk_
- We use the 10.55% US semiconductor industry average for our base case, which gives $389.99 per share.
- We also test a 14.45% input and a 15.4% team sensitivity, which yields $226.87 per share.
- The Bloomberg attribution for 15.4% is disputed, and the industry average may understate NVIDIA’s specific risk.
  - facts: F0868, F0051, F0977, F0876, F0052 · visuals: V0078, V0082, V0084
### Q0289 · How does the DCF compare with the most recent reported close at your three discount rates?  _neutral_
- All three DCF values are above the reported $155.38 close on 24 November 2026.
- The model gives $389.99 at 10.55%, $247.81 at 14.45% and $226.87 at 15.4%.
- Those are estimates based on the same operating forecast and 3% terminal growth. A weaker cash-flow path could lower them.
  - facts: F0473, F0051, F0978, F0979, F0868, F0977, F0876, F0969 · visuals: V0085, V0088
### Q0290 · What does each of the three discount rates assume?  _risk_
- The 10.55% base rate uses Damodaran’s US semiconductor average as a proxy for NVIDIA’s cost of capital.
- The model attributes the 14.45% company input to Google Finance. We treat 15.4% as a team sensitivity because the Bloomberg attribution is disputed.
- The higher rates give future cash flows less weight. The sector average may understate risks specific to NVIDIA.
  - facts: F0868, F0977, F0876 · visuals: V0086, V0085, V0087
### Q0291 · What happens if terminal growth is lower and the discount rate is higher?  _risk_
- The lowest tested cell is $214.94 per share at a 15.4% discount rate and 2% terminal growth.
- At that same rate, the model gives $226.87 with 3% growth and $240.89 with 4% growth.
- The grid still relies on the base operating forecast. Weaker cash flows or assumptions outside the grid could produce a lower value.
  - facts: F0980, F0979, F0981, F0876, F0969 · visuals: V0087
### Q0292 · Why does your upside comparison use a different share price from the model?  _neutral_
- Stock Analysis reports a $155.38 regular-session close on 24 November 2026. That is the dated market comparison on this chart.
- The DCF export uses an unverified $152.85 reference for its upside percentages.
- The price difference affects the upside comparison. The modeled cash-flow values are the same.
  - facts: F0473, F0982 · visuals: V0088, V0085
### Q0293 · How much revenue growth does the share price imply?  _risk_
- At the model’s $152.85 price input and 10.55% discount rate, it takes 11.56% annual revenue growth to match the price.
- Our base case compounds at 35.55% from FY27 to FY32, using consensus through FY28 and our own growth assumptions after that.
- The result depends on the discount rate and cash margins. The reported $155.38 close is a separate price.
  - facts: F0983, F0984, F0982, F0868, F0473, F0313 · visuals: V0089, V0090, V0088
### Q0294 · How far does analyst consensus support your revenue forecast?  _risk_
- We use Bloomberg consensus through FY28, when it puts revenue at $728.636 billion.
- We then assume growth slows through FY32. The later revenue trajectory depends on that team assumption.
  - facts: F0312, F0313, F0970, F0984 · visuals: V0090, V0089
### Q0295 · What happens to NVIDIA if customers pause AI spending?  _risk_
- The bear case assumes a spending pause and market share loss. Revenue falls to $441.22 billion in FY29 before recovering.
- The scenario values NVIDIA at $101.20 per share, a -33.79% change from the model’s reference price.
- A deeper slowdown or weaker margins could produce a larger loss.
  - facts: F0865, F0867, F0986 · visuals: V0091, V0093
### Q0296 · What if AI demand collapses for good?  _risk_
- In our severe stress test, revenue falls to $337.78 billion in FY29 and recovers to $358.35 billion by FY32.
- That scenario gives $64.19 per share, a -58.01% change from our model’s reference price.
- A deeper revenue shock or lower cash margins could put the value below that estimate.
  - facts: F0991, F0992, F0985, F0988 · visuals: V0092, V0093
### Q0297 · How much could our portfolio lose on this position?  _risk_
- At the modeled 3% position size, the bear case takes 1.01 percentage points off portfolio value and severe AI stress takes 1.74 points.
- Those estimates isolate the NVIDIA position. Losses elsewhere in the portfolio could add to the hit.
  - facts: F0990, F0987, F0989 · visuals: V0093, V0091, V0092
### Q0298 · Why is your valuation above analysts’ targets?  _risk_
- Our DCF gives $389.99 per share. Stock Analysis reports a $244.71 average target, while the unverified team capture shows $233.36.
- Analysts’ targets cover the coming year. Our DCF values cash flows over a much longer period and depends on our growth, margin and discount-rate assumptions.
  - facts: F0051, F0291, F0993 · visuals: V0094, V0085
### Q0299 · Why did your valuation rise since round one?  _risk_
- Updating the inputs at the reported 11.1% round-one discount rate adds $129.55 per share.
- Moving to 10.55% then adds $28.44 and brings the base case to $389.99.
- The original model is unavailable, so the bridge starts from the team’s reported $232 target.
  - facts: F0994, F0995, F0996, F0997, F0868, F0051 · visuals: V0095, V0085
### Q0300 · How much electricity demand is coming from AI and data centres?  _risk_
- The IEA’s 2025 base case puts global data-centre electricity at 945 TWh in 2030, up from an estimated 415 TWh in 2024.
- That total includes conventional computing. The IEA projects 30% annual growth in accelerated-server electricity use, driven mainly by AI adoption.
- It is a scenario, and grid delays could affect where and when the demand materialises.
  - facts: F0001, F0003, F0006, F0007 · visuals: V0096
### Q0301 · What does Rubin’s performance-per-watt claim actually prove?  _neutral_
- NVIDIA claims up to 10 times as many tokens per megawatt as Blackwell GB200 NVL72 on Kimi-K2-Thinking at comparable user interactivity.
- Treat it as a vendor result for a specific workload. Ask for matched quality and precision, and whole-system power measured at the wall.
- Total electricity demand can still rise as more inference runs.
  - facts: F0012, F0506, F0507, F0508, F0509, F0513, F0003 · visuals: V0097
### Q0302 · How do NVIDIA’s Scope 1, 2 and 3 emissions compare?  _risk_
- Scope 3 dominates the reported inventory at 10.70 million tonnes of CO₂e in FY26, versus 9,822 tonnes of direct Scope 1 emissions.
- Scope 2 was 568 tonnes market-based and 308,891 tonnes location-based. They describe the same purchased energy using alternative methods.
- The inventory lists upstream and operational value-chain categories. NVIDIA says it plans to add emissions from customers using sold products.
  - facts: F1000, F1001, F0838, F1002, F0702, F0517 · visuals: V0098
### Q0303 · Are NVIDIA’s reported value-chain emissions still growing?  _risk_
- Yes. The reported Scope 3 series rose from 3.64 million tonnes of CO₂e in FY24 to 10.70 million in FY26.
- Purchased goods and services were the largest FY26 category. NVIDIA revised some earlier emissions figures as its methods improved.
- The reported series leaves out customer use of sold products, which NVIDIA says it plans to disclose.
  - facts: F0022, F0023, F0024, F0829, F0835, F0702, F1002 · visuals: V0099
### Q0304 · Does NVIDIA’s renewable electricity figure cover all its energy use?  _neutral_
- NVIDIA reports 100% renewable electricity for its operations in FY26. Its sustainability report separately records 46,258 MWh of fuel.
- Bloomberg’s total energy series rose from 815.86 thousand MWh in FY25 to 1,053.48 thousand in FY26.
- The electricity match covers NVIDIA’s operations. This presentation’s power source and footprint would need separate measurement.
  - facts: F0025, F0026, F0998, F0999, F0030 · visuals: V0100
### Q0305 · How much water does NVIDIA use, and what is outside that figure?  _risk_
- NVIDIA’s FY26 operations withdrew 451,297 cubic metres, discharged 345,766 and consumed 105,531.
- Changes in data collection prevent a reliable prior-year comparison.
- For the full footprint, ask foundries and data-centre operators for site-level water use and local water stress.
  - facts: F0537, F0538, F0539, F0540, F0543, F0030, F0548 · visuals: V0101
### Q0306 · Is NVIDIA’s ESG score better than its semiconductor peers’?  _neutral_
- We lack a verified like-for-like peer ranking. The FY25 Bloomberg export scores NVIDIA 7.48 on environment, 7.10 on governance and 3.63 on social, out of 10.
- The overall score is 6.10. Compare peers using the same rating product, methodology, industry group and period.
  - facts: F0446, F0447, F0448, F0449, F0451, F0455 · visuals: V0102
### Q0307 · Why is NVIDIA’s operational emissions intensity lower than TSMC’s?  _neutral_
- Bloomberg shows 0.048 tonnes of CO₂ per million dollars of sales for NVIDIA and 108.743 for TSMC, using different fiscal years.
- NVIDIA is fabless, so emissions from outsourced manufacturing fall outside its operational comparison.
- To compare their full climate footprints, use consistent boundaries for suppliers and customer use.
  - facts: F0053, F0054, F0543, F0517, F0519 · visuals: V0103
### Q0308 · How exposed is NVIDIA to hyperscalers as a group?  _risk_
- About half of sales. Bloomberg’s preliminary Q3 FY27 breakdown puts hyperscalers at 51.9% of total NVIDIA revenue.
- The remaining 48.1% covers all other NVIDIA revenue, including sales outside Data Center.
- These end-user categories do not identify the customers NVIDIA invoiced.
  - facts: F0079, F0081, F0713 · visuals: V0104, V0106
### Q0309 · Where is NVIDIA finding Data Center growth beyond hyperscaler sales?  _strength_
- The combined AI cloud, industrial and enterprise group grew from $20.1 billion in Q4 FY26 to a preliminary $47.5 billion in Q3 FY27.
- Hyperscaler revenue rose from $42.2 billion to $60.1 billion over the same period.
- The Bloomberg series groups those other buyers together. NVIDIA identifies sovereign demand as a contributor and gives no separate sovereign sales figure in the cited filing.
  - facts: F0087, F0088, F0089, F0090, F0716 · visuals: V0105, V0104
### Q0310 · How much does NVIDIA depend on its biggest direct customers?  _risk_
- Its three largest direct customers accounted for 36% of Q3 FY27 revenue.
- The largest represented 14%, and the next two represented 11% each.
- Direct customers can buy for other companies. NVIDIA also estimates that some indirect customers individually represent at least 10% of revenue, so the direct shares show only part of the exposure.
  - facts: F0048, F0084, F0085, F0086, F0711, F0712, F0713 · visuals: V0106
### Q0311 · What does Microsoft’s reported capex tell us about NVIDIA demand?  _neutral_
- It shows the scale of spending by one hyperscaler. Microsoft’s cash additions to property and equipment reached $115.9 billion in FY26.
- The companywide total covers facilities and computer systems across business functions. The figures do not disclose NVIDIA’s share or forecast its orders.
  - facts: F0265, F0266, F0267, F0268, F0724, F0725 · visuals: V0107
### Q0312 · Is there evidence of sovereign demand that has reached deployment?  _neutral_
- Yes. The UK’s Isambard-AI uses 5,448 NVIDIA superchips, and Greece’s DAEDALUS uses more than 2,000.
- France and Finland selected AMD accelerators for planned public systems.
- Deployments show adoption. The available figures do not establish what NVIDIA earned or what it will win next.
  - facts: F0091, F0092, F0751, F0743, F0744, F0745, F0756 · visuals: V0108
### Q0313 · What can we count on from the Saudi and UAE AI announcements?  _risk_
- They name NVIDIA hardware, while delivery and revenue remain unconfirmed by those releases.
- HUMAIN described an 18,000-GB300 first phase, and SDAIA announced plans for up to 5,000 Blackwell GPUs.
- G42 named NVIDIA Grace Blackwell systems and expected the first 200 MW Stargate UAE cluster to go live in 2026.
  - facts: F0732, F0733, F0736, F0737 · visuals: V0109
### Q0314 · What would make an AI accelerator market-share estimate credible?  _neutral_
- We lack a verified current estimate for all AI accelerators. Ask which chips are counted and whether the measure is revenue or unit shipments.
- A merchant GPU estimate may omit in-house chips such as AWS Trainium or Meta MTIA.
- MLPerf received 153 submitted systems in the cited round. That measures benchmark participation, so it cannot establish market share.
  - facts: F0845, F0846, F0150, F0158 · visuals: V0110
### Q0315 · Are cloud providers’ own chips replacing NVIDIA GPUs?  _risk_
- They give cloud providers alternatives for selected workloads. AWS offers Trainium for training and inference, and Google targets those uses with Ironwood.
- Microsoft designed Maia for Azure AI, while Meta’s early MTIA designs targeted recommendations.
- AWS published a Stockmark customer example reporting 20% lower training cost. The specific GPU comparator and wider displacement remain unverified.
  - facts: F0150, F0155, F0158, F0892, F0893, F0854 · visuals: V0111
### Q0316 · How much AI business has Broadcom already reported?  _risk_
- Broadcom reported $8.4 billion in its first fiscal quarter of 2026 and $10.8 billion in its second.
- The figures combine custom AI accelerators and AI networking. Broadcom did not break out standalone accelerator revenue in these results.
  - facts: F0896, F0486 · visuals: V0112
### Q0317 · How big is AMD’s data-centre business compared with NVIDIA’s?  _strength_
- The Bloomberg export shows $193.737 billion for NVIDIA’s year to January 2026 and $16.635 billion for AMD’s year to December 2025.
- AMD includes server CPUs and NVIDIA includes networking. The comparison shows reported business scale, while estimating accelerator share requires separate data.
  - facts: F1004, F1005, F0492, F0136 · visuals: V0113, V0114
### Q0318 · Is AMD gaining momentum in data-centre chips?  _risk_
- AMD’s Data Center revenue rose from $4,341 million to $8,546 million year over year in the third quarter of 2026.
- AMD also says named customers were running workloads on its first Helios systems. The segment includes EPYC CPUs, so we cannot infer Instinct sales or NVIDIA share lost.
  - facts: F1010, F0925, F0492, F0907 · visuals: V0114
### Q0319 · Do analysts expect NVIDIA to earn higher margins than Broadcom and TSMC?  _neutral_
- The Bloomberg snapshot puts Broadcom at 66.94% and NVIDIA at 65.58%, and TSMC at 58.83%.
- Those are company-wide, current-fiscal-year forecasts. Broadcom’s software and TSMC’s foundry business make chip-level profitability a separate question.
  - facts: F1006, F1007, F1011 · visuals: V0115
### Q0320 · Why do analysts expect AMD’s earnings to grow faster than NVIDIA’s?  _neutral_
- The Bloomberg snapshot expects faster percentage EPS growth at AMD, 119.7% versus 72.1% at NVIDIA.
- These forecasts start from each company’s own earnings base and include all its businesses. The snapshot does not isolate what drives the difference.
  - facts: F1008, F1009 · visuals: V0116
### Q0321 · How much TSMC packaging capacity does NVIDIA have booked?  _neutral_
- Third-party estimates compiled by the team put NVIDIA at 60% of TSMC CoWoS bookings for 2026.
- This measures bookings at one packaging provider. NVIDIA identifies CoWoS in Vera Rubin, and actual output still depends on the supply chain.
  - facts: F1003, F0191, F0586, F0592 · visuals: V0117
### Q0322 · How much revenue did NVIDIA book to China and Hong Kong before the latest restrictions?  _risk_
- NVIDIA booked $19.68 billion to direct customers headquartered in China and Hong Kong in FY26, down from $25.05 billion in FY25.
- These figures cover all products. The direct customer’s headquarters can differ from where the product ships or who ultimately uses it.
  - facts: F1012, F1013, F1014, F0717 · visuals: V0118
### Q0323 · Why did US chip licences fail to reopen the China market?  _risk_
- A US licence cleared only one hurdle. NVIDIA said Chinese restrictions still blocked some licensed sales.
- Management reported $2.4 billion in licensed Hopper data-centre sales to China in Q3 FY27 and then said those shipments had stopped.
- The Q4 FY27 outlook assumes no China Data Center compute revenue. Gaming and workstation products are outside that assumption.
  - facts: F1015, F0604, F0203, F0776, F0597, F0785, F0211, F0786, F0602 · visuals: V0119
### Q0324 · How much did NVIDIA actually book in China-related chip charges?  _risk_
- NVIDIA recorded a $4.5 billion H20 inventory and purchase-obligation charge in Q1 FY26, and a $0.4 billion H200 charge in the first half of FY27.
- NVIDIA separately reported $2.5 billion in H20 revenue it could not ship in Q1 FY26, and later released $180 million of earlier H20 reserves.
  - facts: F0204, F0598, F0206, F0209 · visuals: V0120
### Q0325 · Could Arizona replace NVIDIA’s Taiwan supply if shipments stop?  _risk_
- NVIDIA has reported Blackwell wafer production in Arizona. The company has not quantified how much Taiwan output Arizona could replace.
- Rubin uses TSMC fabrication and CoWoS packaging. Nearly $3 billion of Amkor agreements support packaging expansion in Arizona and South Korea.
- NVIDIA warns that qualifying a replacement supplier and reaching volume production may take time and add costs.
  - facts: F0191, F0192, F0765, F0592, F0774, F0586 · visuals: V0121, V0072
### Q0326 · What changed at NVIDIA’s board when Huang returned?  _risk_
- NVIDIA’s SEC filing gives 22 November as the effective reinstatement date. The company announced the return on 23 November.
- Harvey Jones stayed board chair. The board said its independent investigation would continue.
- A separate standing board committee oversees national security, export compliance and global trade risk.
  - facts: F0063, F1016, F0414, F0398, F0064, F0065, F0074, F0070, F0071, F0069, F0078 · visuals: V0122
### Q0327 · How far could gross margin fall even if revenue keeps growing?  _risk_
- NVIDIA reported 74.8% GAAP gross margin in Q3 FY27 and guided to 71% to 72% for Q4.
- Management cited supply costs and earlier purchase orders, without quantifying each driver.
- Management expects 72% to 73% in FY28. That recovery depends on what it can charge and what it pays for supply.
  - facts: F0264, F0111, F0126, F0112, F0877, F0878, F0883 · visuals: V0123
### Q0328 · How much money has NVIDIA put at risk in the ecosystem that buys its chips?  _risk_
- NVIDIA invested $17.5 billion in private companies and infrastructure funds in FY26. It had $11.4 billion in contingent commitments at year end.
- Some investees buy NVIDIA products. The filing does not say how much revenue those relationships generated.
- Some early-stage investees may never become profitable, which makes investment returns uncertain.
  - facts: F0259, F0260, F0258, F0261 · visuals: V0124
### Q0329 · What was Sequoia’s numerical bear argument about AI infrastructure?  _risk_
- David Cahn at Sequoia estimated in June 2024 that the AI ecosystem needed $600 billion in revenue and had a $500 billion gap under his assumptions.
- The numbers depend on his cost, margin and customer-revenue assumptions, and describe his 2024 model.
- The risk for NVIDIA is slower GPU orders if customers struggle to earn money on capacity they already bought.
  - facts: F0251, F0252, F0253 · visuals: V0125, V0075
### Q0330 · How does NVIDIA’s P/E compare with its own history?  _neutral_
- Bloomberg’s annual series shows the year-end P/E falling from 83.31x in FY23 to 43.03x in FY26.
- Stock Analysis lists 114.74x for FY23, and we have yet to reconcile the calculation bases.
- Use a single provider’s series to describe the trend and compare today’s forward multiple separately.
  - facts: F0292, F0294, F1024 · visuals: V0126
### Q0331 · Does NVIDIA trade at a discount on expected earnings?  _neutral_
- Yes. In the pitch comparison NVIDIA is at 15.86x forecast earnings and TSMC is next at 17.98x.
- NVIDIA uses a later, unverified team price input. Stock Analysis reports 10.71x using its own inputs.
- A low multiple can disappear if earnings miss forecasts.
  - facts: F1017, F1018, F0277 · visuals: V0127, V0059
### Q0332 · Does NVIDIA still look cheaper after accounting for expected growth?  _neutral_
- On this snapshot, yes. NVIDIA is at 0.195x PEG, compared with 0.403x for Broadcom, the next lowest in this group.
- PEG divides forward P/E by expected earnings growth. Lower growth raises PEG if the P/E stays the same.
  - facts: F1019, F1020 · visuals: V0128
### Q0333 · How does NVIDIA compare with TSMC on EV to EBITDA?  _neutral_
- They are close. Bloomberg’s forward EV/EBITDA is 11.42x for NVIDIA and 11.92x for TSMC.
- EBITDA excludes capital spending, so the two businesses can turn similar EBITDA multiples into different free cash flow outcomes.
  - facts: F1021, F1022 · visuals: V0129
### Q0334 · Where do NVIDIA’s analyst price targets sit relative to the share price?  _neutral_
- Stock Analysis showed a $244.71 average target against the $155.38 close on 24 November 2026.
- Our unverified Google Finance capture shows $233.36. We have yet to reconcile the analyst panels.
- Both targets are forecasts and can move as expectations change.
  - facts: F0291, F0993, F0473 · visuals: V0130, V0094
### Q0335 · Do most of the analysts in our ratings snapshot recommend buying?  _neutral_
- Yes, in the team’s unverified Google Finance capture. It shows 34 Buy, 9 Hold and 1 Sell rating.
- Coverage varies by provider, and the distribution can change as analysts update their views.
  - facts: F0297, F0298, F0299 · visuals: V0131
### Q0336 · How much has NVIDIA actually spent on buybacks?  _neutral_
- NVIDIA reported $22,122 million in cash payments for repurchases in Q3 FY27.
- About $227.3 billion of authorisation remained at quarter-end. Future purchases are discretionary.
- The $28.1 billion headline return includes dividends.
  - facts: F1023, F0316, F0315 · visuals: V0132
### Q0337 · Did NVIDIA’s diluted share count fall after buybacks and stock awards?  _neutral_
- Yes. Diluted weighted-average shares fell from 24,483 million to 24,186 million in the year-over-year quarter comparison.
- NVIDIA still expensed $2,088 million in stock-based compensation in the latest quarter. A lower share count alone does not establish the return on buybacks.
  - facts: F0329, F0325, F0327 · visuals: V0133
### Q0338 · When did NVIDIA’s annual revenue start to take off?  _strength_
- The step-up started in FY24, when annual revenue rose to $60.9 billion from $27.0 billion in FY23.
- It reached $215.9 billion in FY26. That is the last completed fiscal year shown.
  - facts: F1025, F1026, F1027 · visuals: V0134
### Q0339 · Which business drove NVIDIA’s growth, and how big is Gaming now?  _risk_
- Data Center drove the increase. In FY22, Gaming was $12.46 billion and Data Center was $10.61 billion.
- By FY26, Data Center reached $193.74 billion and Gaming reached $16.04 billion.
- These are historical market platforms. FY27 Edge Computing groups Gaming with other activities.
  - facts: F1028, F1029, F1030, F1004, F0148, F0891 · visuals: V0135, V0076
### Q0340 · Did higher sales translate into higher annual margins?  _risk_
- Both margins climbed well above FY23 levels, then fell in FY26 despite higher sales.
- Gross margin fell from 74.99% to 71.07%, and operating margin fell from 62.42% to 60.38%.
- The latest quarterly gross-margin outlook is a separate period.
  - facts: F1031, F1032, F0342, F0343, F0340, F1025, F1026, F1027 · visuals: V0136, V0123
### Q0341 · Did NVIDIA’s sales surge turn into free cash flow?  _neutral_
- Yes. Bloomberg’s series fell from $8.1 billion in FY22 to $3.8 billion in FY23, then reached $96.7 billion in FY26.
- NVIDIA reports $96.575 billion on its own definition for FY26. Use one source consistently to compare years.
- Quarterly free cash flow still swings, so avoid treating one quarter as a run rate.
  - facts: F1033, F1034, F0344, F0355, F0350, F0351, F0352 · visuals: V0137, V0062
### Q0342 · Has NVIDIA consistently beaten Wall Street’s revenue estimates?  _neutral_
- Every quarter shown beat Bloomberg consensus. The beat ranged from 1.11% to 12.62%.
- The preliminary Q3 FY27 beat was 5.96%. The size has varied, and future consensus is a moving target.
  - facts: F1035, F1036, F1037 · visuals: V0138
### Q0343 · Where does NVIDIA use NVLink, Ethernet and InfiniBand?  _neutral_
- NVLink connects GPUs within a system. Spectrum-X Ethernet and Quantum-X800 InfiniBand connect servers across the data centre.
- NVIDIA specifies 3.6 TB/s of bidirectional bandwidth per GPU for NVLink in Vera Rubin NVL72.
- That is a product specification for one system. End-to-end performance also depends on the scale-out network and the workload.
  - facts: F0180, F0181, F0182, F0183, F0189 · visuals: V0139
### Q0344 · How fast did NVIDIA’s Data Center networking business grow in FY26?  _strength_
- NVIDIA reported 142% year-on-year Data Center networking revenue growth in FY26.
- It credited higher NVLink deployment as well as growth in its Ethernet and InfiniBand platforms.
- NVIDIA later recast customer-group figures. The newer networking-franchise figure uses a different label, and its scope has yet to be reconciled with the old line.
  - facts: F0964, F0966, F0967 · visuals: V0140
### Q0345 · What did NVIDIA lose and retain when the Arm deal collapsed?  _risk_
- SoftBank kept NVIDIA’s $1.25 billion prepayment, and NVIDIA retained its 20-year Arm licence.
- NVIDIA cited significant regulatory challenges. The UK had opened an in-depth competition and national security inquiry.
- The UK closed the inquiry after the deal was abandoned, so there was no clearance decision.
  - facts: F0216, F0217, F0218, F0219, F0220 · visuals: V0141
### Q0346 · What does NVIDIA’s FY26 filing say about the securities class action?  _risk_
- The case returned to district court for further proceedings. Shareholders alleged misleading statements about channel inventory and crypto-related GPU demand.
- The US Supreme Court dismissed NVIDIA’s petition without deciding the merits.
- At the fiscal year-end, NVIDIA recorded no liability for the disclosed proceedings and said a possible loss could not reasonably be estimated. Later case status remains unverified.
  - facts: F0246, F0247, F0248, F0249, F0250 · visuals: V0142
### Q0347 · How much UK research use did Isambard-AI see in its first year?  _strength_
- Bristol reports about 1,000 research projects and more than 4,000 users in the first year.
- Projects include work on British-language models. Bristol says each call for access was oversubscribed.
- These are measures of research use. Bristol’s figures do not quantify what NVIDIA earned from the facility.
  - facts: F0400, F0401, F0402, F0404 · visuals: V0143
### Q0348 · Which milestones took NVIDIA from graphics to AI?  _neutral_
- NVIDIA began in 1993 with a focus on graphics for gaming and multimedia.
- Its corporate timeline marks a GPU milestone in 1999 and the unveiling of CUDA in 2006, which opened GPUs to parallel computing for researchers.
- NVIDIA hardware powered AlexNet in 2012, a milestone in the use of GPUs for AI.
  - facts: F0371, F0372, F0374, F0375, F0376 · visuals: V0144
### Q0349 · How much of NVIDIA’s supply chain was audited, and were affected workers reimbursed?  _risk_
- Reviewed onsite audits covered 93% of strategic suppliers over two years, against NVIDIA’s 100% audit goal.
- NVIDIA found hiring fees and passport retention and says it worked on fee returns and document handling.
- The disclosure gives no independently verified tally of workers reimbursed.
  - facts: F0630, F0631, F0633, F0634, F0635, F0636 · visuals: V0145
### Q0350 · How much electricity did image generation and short text generation use in the same benchmark?  _risk_
- The benchmark reported medians of 1.35 kWh per 1,000 image inferences and 0.042 kWh per 1,000 text inferences.
- The text task generated just 10 new tokens per input. Electricity use varies by model and workload.
- Video and this pitch were outside the benchmark.
  - facts: F0041, F0042, F0043, F0047 · visuals: V0146
### Q0351 · How should we read NVIDIA’s cloud commitments and the OpenAI guarantee together?  _risk_
- The August filing disclosed $36 billion in cloud service commitments and a separate $105 billion cap on conditional OpenAI-related lease and power guarantees.
- The cloud balance falls as capacity is used, and guarantee exposure falls as OpenAI pays. The filing gives no estimate of combined losses.
  - facts: F0615, F0616, F0618, F0619, F0620, F0627, F0795 · visuals: V0147
### Q0352 · Where was the end demand behind NVIDIA’s Taiwan-booked Data Center sales?  _neutral_
- NVIDIA estimates that US and European end customers accounted for 76% of FY26 Data Center revenue from Taiwan-headquartered customers.
- Geographic reporting follows the direct customer’s headquarters. End users and shipping locations may be elsewhere.
  - facts: F0717, F0718 · visuals: V0148
### Q0353 · Why are the Gemini and Le Chat water estimates so far apart?  _neutral_
- They count different water uses and different workloads. Google estimated 0.26 mL of direct cooling water for a median Gemini text prompt.
- Google cites Mistral’s lifecycle estimate of 45 mL for a typical 400-token Le Chat response.
- A product comparison would require the same workload and accounting boundary.
  - facts: F0555, F0558, F0559 · visuals: V0149
### Q0354 · What changed on NVIDIA’s balance sheet as cash increased?  _risk_
- Cash rose, and so did inventories and long-term debt. NVIDIA reported $29,089 million in cash and $32,371 million in long-term debt at the October balance-sheet date.
- Inventory rose to $39,724 million. Marketable equity securities are a separate line from cash.
  - facts: F0333, F0334, F0335, F0336 · visuals: V0150
### Q0355 · How much of NVIDIA’s purchased-goods emissions did supplier engagement cover?  _neutral_
- NVIDIA says it engaged suppliers representing over 80% of its purchased-goods and services emissions in FY25, above the goal of at least 67%.
- This measure gives the emissions share represented by those suppliers. Target adoption and emissions cuts require separate evidence.
  - facts: F0839, F0840 · visuals: V0151
### Q0356 · How independent was NVIDIA’s board at the June election, and who audits it?  _neutral_
- Shareholders elected all 10 nominees in June. The May proxy classed 9 as independent under Nasdaq rules.
- Shareholders ratified PwC, which the proxy says had audited NVIDIA annually since 2004. The board count describes the June election.
  - facts: F0686, F0687, F0689, F0691, F0692, F0705 · visuals: V0152
### Q0357 · How did NVIDIA’s employee turnover change, and where was it higher?  _risk_
- Overall turnover rose to 3.7% in FY26 from 2.5% in FY25.
- In FY26, turnover was 6.3% among Black US employees and 4.4% among Hispanic or Latino US employees.
- Those group rates use separate denominators.
  - facts: F0656, F0657, F0658, F0659, F0660 · visuals: V0153
### Q0358 · Why might announced data-centre projects miss their power timelines?  _risk_
- PJM requires firm commitments for near-term large loads and discounts uncertain projects further out.
- Its annual report projected up to about 30 GW of regional data-centre load growth from 2025 to 2030.
- The overall regional load forecast was later lowered through 2032.
  - facts: F0501, F0502, F0503, F0504, F0505, F0240 · visuals: V0154
### Q0359 · Can NVIDIA record revenue before it collects payment?  _risk_
- Yes. NVIDIA generally records product revenue when control passes to the customer.
- It has offered some investment-grade customers 90 days to one year to pay for large data-centre builds.
- The longer terms increased receivables and partly offset operating cash flow growth in the first half of FY27.
  - facts: F0624, F0625, F0791, F0792 · visuals: V0155
### Q0360 · Where do NVIDIA’s facilities and semiconductor fabs face water stress?  _risk_
- NVIDIA reported that 23% of its FY25 facility withdrawals occurred in high or extremely high water-stress areas.
- Samsung rated Xi’an and Suzhou extremely high and Austin and Taylor medium-high.
- Samsung’s rankings describe site conditions and do not quantify NVIDIA’s manufacturing water use.
  - facts: F0828, F0543, F0544, F0818, F0819, F0820 · visuals: V0156
### Q0361 · How much do analysts expect NVIDIA’s earnings per share to rise?  _neutral_
- The average rises from $9.67 per share in FY27 to $16.61 in FY28.
- The FY28 estimates run from $12.27 to $18.78.
- The Yahoo Finance snapshot leaves the GAAP or adjusted basis unclear.
  - facts: F0306, F0307, F0308, F0309 · visuals: V0157
### Q0362 · Can we quantify what NVIDIA makes from AI Enterprise?  _neutral_
- NVIDIA offers paid licences, and its filings give no separate AI Enterprise sales figure.
- It reported $3.2 billion of remaining obligations in July 2026 from contracts longer than one year.
- That mixed balance includes deferred revenue and cannot pin down software sales.
  - facts: F0941, F0942, F0937, F0938, F0939, F0943 · visuals: V0158
### Q0363 · How is NVIDIA’s CEO paid, and what did the shareholder vote approve?  _neutral_
- Shareholders approved executive pay in an advisory vote.
- NVIDIA reported FY26 CEO compensation of $36,343,830, or 129 times median employee pay.
- All FY26 CEO equity grants were performance-based, and a pre-set rule lowered stretch targets after export restrictions.
  - facts: F0693, F0694, F0696, F0690, F0697, F0698 · visuals: V0159
### Q0364 · Could a more efficient AI chip still have a larger carbon footprint?  _risk_
- Yes. Manufacturing emissions, hardware lifetime and utilisation also affect lifecycle emissions.
- A 2021 Facebook case estimated about 30% embodied and 70% operational carbon using a hardware proxy.
- A cross-vendor comparison needs a matched workload and measured or comparable lifecycle inputs.
  - facts: F0916, F0915, F0922, F0914 · visuals: V0160
### Q0365 · What evidence shows AI delivering productivity before we claim a financial return?  _neutral_
- A customer-support study found 14% more issues resolved per hour with an AI assistant.
- Novice and low-skilled agents improved by 34%, while experienced and highly skilled agents saw little change.
- That measures productivity in one setting. The study does not establish a return on AI infrastructure spending.
  - facts: F0856, F0857, F0858 · visuals: V0161
### Q0366 · How much cooling energy did machine learning save at Google?  _neutral_
- Google DeepMind reported a 40% cut in cooling energy at one data centre.
- It reported a 15% cut in power usage effectiveness overhead after accounting for other losses.
- Both numbers use different denominators. The report does not establish total electricity savings or a net energy benefit across AI workloads.
  - facts: F0469, F0470 · visuals: V0162
### Q0367 · Where did NVIDIA close within its reported annual trading range?  _risk_
- Stock Analysis reported a $155.38 close on 24 November within a 52-week range of $124.50 to $243.37.
- The close was closer to the low than to the high. A range shows observed extremes and does not estimate return volatility.
- Our team input differs, and we have yet to reconcile the price timestamps and the low’s observation window.
  - facts: F0427, F0428, F0437, F0441, F0442 · visuals: V0163
### Q0368 · Did Bloomberg give NVIDIA two different social scores in FY25?  _risk_
- Yes. The FY25 Bloomberg export shows a social disclosure score of 5.37 and a separate social pillar score of 3.63 out of 10.
- The FY22 figure of 51.62 belongs to the disclosure series. Compare it with later disclosure scores on the same scale.
- Disclosure scores do not establish changes in workforce or supplier outcomes.
  - facts: F0049, F0050, F0447, F0875 · visuals: V0164
### Q0369 · What does Morningstar’s valuation imply about our NVIDIA price target?  _neutral_
- Morningstar’s $250 per-share estimate on 23 November is below our $389.99 base case and above our $226.87 high-rate sensitivity.
- Morningstar rates uncertainty very high and uses a ten-year DCF.
- Its numerical discount rate is unverified in the reviewed material, so the gap cannot be attributed to the discount rate alone.
  - facts: F0474, F0476, F0051, F0979 · visuals: V0165
### Q0370 · What has Bristol disclosed about Isambard-AI’s operational efficiency and construction emissions?  _risk_
- Bristol reports power usage effectiveness of about 1.08 without specifying the averaging period.
- At launch it estimated about 72% lower construction emissions than traditional build methods.
- The reviewed disclosures do not establish independent verification, annual resource use or a full lifecycle footprint.
  - facts: F0759, F0761, F0099 · visuals: V0166
### Q0371 · What changed when NVIDIA started counting stock awards in adjusted earnings?  _neutral_
- Since Q1 FY27, NVIDIA has included stock-based compensation in its non-GAAP measures, and updated the historical figures shown in its release.
- It reported $2,088 million of stock-based compensation expense in Q3 FY27.
- Including the expense improves comparability. Stock awards can still dilute shareholders.
  - facts: F0324, F0327, F0330 · visuals: V0167
### Q0372 · Can we calculate networking growth from the old product split and the latest earnings call?  _risk_
- The old product split shows $60.4 billion of compute and $14.8 billion of networking in Q1 FY27.
- Later releases group sales by customer market. The Q3 FY27 call transcript says networking franchise revenue exceeded $21 billion.
- We have no verified bridge between the old line and the call figure, so we cannot calculate a like-for-like growth rate.
  - facts: F0135, F0136, F0148, F0890, F0967 · visuals: V0168
### Q0373 · What does NVIDIA disclose about women’s pay and representation?  _neutral_
- NVIDIA reports rising representation and a global pay ratio close to parity.
- From FY24 to FY26, women went from 19.7% to 21.6% of the workforce and from 15.2% to 17.4% of technical roles.
- The FY26 global pay ratio was 99.5 to 100 for women versus men. Individual pay and promotion outcomes require more detail.
  - facts: F0643, F0644, F0645, F0646, F0647, F0648, F0652 · visuals: V0169
### Q0374 · What electricity figure can we defend when asked about this live pitch?  _risk_
- We have a published benchmark for text serving. This live presentation’s footprint remains unmeasured.
- Google measured 0.24 watt-hours for its median Gemini Apps text prompt in May 2025, including idle capacity and data-centre overhead.
- Energy varies with the request and the hardware’s utilisation. A session total would require measurements for our own audio and AI workflow.
  - facts: F0030, F0037, F0038, F0040 · visuals: V0170
### Q0375 · Which NVIDIA climate target is an absolute emissions cut?  _risk_
- NVIDIA aims to cut total Scope 1 and market-based Scope 2 emissions by 50% by FY30 from FY23.
- The sold-GPU goal is a 75% cut in emissions per unit of computing capacity by FY30 from the same base year.
- Total product-use emissions can still rise as computing grows. SBTi validation gives no assurance of delivery.
  - facts: F0526, F0832, F0833, F0834 · visuals: V0171
### Q0376 · What do Microsoft’s Copilot seats and cloud margin tell us about demand and returns?  _neutral_
- Microsoft showed paid adoption. The returns on its AI investment and its customers’ spending remain unknown.
- It reported more than 30 million paid Microsoft 365 Copilot seats by the end of FY2026.
- Microsoft Cloud gross margin fell to 66% that fiscal year. The figure spans its cloud services, and Microsoft cited AI infrastructure investment and usage among the drivers.
  - facts: F0271, F0860 · visuals: V0172
### Q0377 · How should we read NVIDIA’s CUDA download and developer counts together?  _neutral_
- The figures show reach. Exclusive use and migration costs remain unquantified.
- NVIDIA’s filings put developers using CUDA and other NVIDIA tools at 3.8 million in FY2023 and more than 7.5 million in FY2026.
- The 2024 annual review reported over 48 million CUDA downloads. A developer can download it repeatedly.
  - facts: F0926, F0927, F0928, F0931 · visuals: V0173
### Q0378 · How does the extra week affect how we read NVIDIA’s Q4 revenue guidance?  _neutral_
- The calendar makes the headline increase a weaker signal of accelerating demand.
- NVIDIA reported $115.8 billion in Q3 FY27 and guided to $130 billion, plus or minus 3%, for Q4 FY27.
- That outlook includes an extra week. The release gives no separate estimate for the extra week’s contribution.
  - facts: F0103, F0108, F0119 · visuals: V0174
### Q0379 · How much of India’s pooled AI compute capacity can we attribute to NVIDIA?  _neutral_
- NVIDIA participates in a programme with multiple suppliers. Its share remains undisclosed in these sources.
- India announced 34,333 approved GPUs in May 2025, including 15,916 additions.
- The IndiaAI portal lists offerings from NVIDIA, AMD, Intel and AWS. The totals measure pooled cloud capacity, and NVIDIA’s unit sales and revenue remain unknown.
  - facts: F0746, F0755 · visuals: V0175
### Q0380 · How do we tell water reuse apart from water consumption in a supplier report?  _risk_
- Consumption is water withdrawn minus water discharged. Reuse measures water put back into use.
- Samsung reported 3,512 thousand tonnes consumed in its device division and 134,011 thousand tonnes reused company-wide in 2025.
- The figures measure different flows and cover different operations. To judge local impact, we would need site-level consumption and watershed data.
  - facts: F0547, F0548, F0815, F0816, F0817, F0821 · visuals: V0176
### Q0381 · What pressure does NVIDIA’s outlook put on profitability?  _risk_
- Gross margin is guided lower and operating expenses are expected to rise.
- The GAAP gross margin outlook is 71% to 72%, versus 74.8% reported. GAAP operating expenses are expected to rise from $9.2bn to roughly $11bn.
- Management cited higher compute spending last quarter. The forecast includes an extra week and transition costs, and the recurring share is unquantified.
  - facts: F0104, F0111, F0112, F0119, F0123, F0125, F0879, F0880 · visuals: V0177
### Q0382 · Which parts besides advanced packaging could limit NVIDIA shipments?  _risk_
- Substrates, testing and optical engines can all limit shipments.
- NVIDIA targets 2.5 times substrate capacity over three years and expects testing capacity to double from calendar 2026 to 2027. SPIL targets 15 times optical-engine capacity by mid-2027.
- These are targets with separate baselines, and the available volumes still depend on execution.
  - facts: F0196, F0197, F0199 · visuals: V0178
### Q0383 · What hardware is in a single NVIDIA GB200 NVL72 rack?  _neutral_
- It is a rack-scale system.
- NVIDIA specifies 72 Blackwell GPUs and 36 Grace CPUs connected by NVLink.
- These are hardware counts. Realised inference performance depends on the workload and configuration.
  - facts: F0360 · visuals: V0179
### Q0384 · What does the Loughton delay show about turning UK AI plans into investment?  _risk_
- The proposed project faced major delivery uncertainty as of the October report.
- Nscale pledged £2bn, and the site was expected to create 250 permanent jobs when it opens.
- The BBC reported Microsoft had exited and grid power was delayed into the 2030s. An NVIDIA order is unverified.
  - facts: F0405, F0406, F0407, F0408 · visuals: V0180
### Q0385 · What can we tell about emissions from the Saudi and UAE AI projects?  _risk_
- The announcements leave actual operating emissions unknown.
- HUMAIN projected up to 500 MW in Saudi Arabia. G42 described the first 200 MW Stargate cluster within the broader 5 GW UAE campus.
- G42 named nuclear, solar and gas. The supply shares and operating emissions were unreported in those announcements.
  - facts: F0730, F0736, F0738, F0739 · visuals: V0181
### Q0386 · How much does Triton make workloads portable across GPU vendors?  _neutral_
- Triton gives developers another way to target several GPU platforms.
- Upstream lists NVIDIA compute capability 8.0 or newer and AMD ROCm 6.2 or newer. Intel maintains a separate XPU backend with stack constraints.
- Migration time and performance still need to be measured on the actual application.
  - facts: F0946, F0947, F0949, F0950, F0952, F0953 · visuals: V0182
### Q0387 · Did Professional Visualization revenue fall or stay flat at the fiscal year boundary?  _neutral_
- The two original releases show a slight decline, which can round to flat sequential growth.
- NVIDIA reported $511 million for the final quarter of FY25 and $509 million for the first quarter of FY26.
- We have no evidence of a restatement from those releases.
  - facts: F0885, F0888 · visuals: V0183
### Q0388 · Would reopening Taiwanese fabs restore NVIDIA shipments immediately?  _risk_
- Full recovery also depends on packaging, assembly and testing, and replacement suppliers may need qualification.
- NVIDIA says supply lead times have exceeded 12 months and could do so again.
- That disclosure concerns historical lead times. A Taiwan-specific recovery time and financial impact remain unquantified.
  - facts: F0587, F0588, F0589, F0592, F0593, F0594 · visuals: V0184
### Q0389 · What would prove that Ecolab’s cooling saves water at an NVIDIA data centre?  _risk_
- Ecolab describes a cooling partnership and a simulation. A measured whole-site saving remains unverified.
- Compare metered water withdrawals and consumption before and after at comparable workloads and weather.
- Include water used for electricity generation and ask for independent verification.
  - facts: F0030, F0032, F0034, F0547, F0548, F0871, F0872 · visuals: V0185
### Q0390 · Can customer energy savings reduce NVIDIA’s reported emissions inventory?  _risk_
- No. The GHG Protocol requires avoided-emissions claims for sold products to be reported separately from the company inventory.
- Bloomberg puts FY26 Scope 3 emissions at about 10.7 million metric tonnes of CO₂e. Show any estimated customer savings separately.
  - facts: F0024, F0521 · visuals: V0186
### Q0391 · Who oversees supplier labour at NVIDIA, and what has the company verified?  _risk_
- The Nominating and Corporate Governance Committee oversees human rights and reports to the full board.
- NVIDIA says it reviewed third-party audits covering 45% of strategic suppliers in FY26.
- NVIDIA reported hiring fees and passport retention and says it worked on corrective actions. Ask for independent evidence that workers received remedy.
  - facts: F0632, F0635, F0636, F0662, F0664, F0666 · visuals: V0187
### Q0392 · How much of the UK compute commitments is confirmed as NVIDIA revenue?  _neutral_
- The published figures leave NVIDIA’s share unknown.
- Bristol cites £500 million in government funding for the Sovereign AI programme, which gives portfolio companies access to Isambard-AI.
- The UK government also reports an additional £1 billion commitment to expand compute capacity. A payment to NVIDIA would require separate disclosure.
  - facts: F0094, F0098 · visuals: V0188
### Q0393 · Can a customer move its CUDA code to AMD, and what work does that take?  _neutral_
- Yes. AMD’s HIPIFY can translate supported CUDA code to HIP, and AMD recommends testing each converted section.
- NVIDIA reported more than 300 CUDA libraries in 2024. Code that depends on unavailable libraries can require replacement, and optimised code can need retuning.
- The effort is application-specific. We have no verified general cost or timeline.
  - facts: F0930, F0166, F0169, F0170, F0850, F0851, F0852 · visuals: V0189
### Q0394 · What evidence shows Rubin has moved into shipments?  _strength_
- NVIDIA says Vera Rubin rack systems and Vera CPUs started shipping in volume in Q3 FY27.
- Its January launch announcement had forecast partner availability in the second half of 2026.
- The shipment disclosure leaves the number of systems deployed and paid for unquantified.
  - facts: F0365, F0191 · visuals: V0190
### Q0395 · What drove Edge Computing growth, and what do we know about gaming sales?  _neutral_
- NVIDIA credited stronger demand for Blackwell workstations and physical AI edge compute for the sequential increase.
- Edge Computing reached $8.2 billion in Q3 FY27, up 14% from the prior quarter and 42% year on year.
- The reporting groups gaming with other Edge activities and leaves gaming revenue undisclosed for the quarter.
  - facts: F0116, F0148, F0881 · visuals: V0191
### Q0396 · Does InfiniBand adoption prove NVIDIA dominates AI networking or uses less energy?  _neutral_
- The InfiniBand trade association reported that it connected 63 of the top 100 supercomputers in June 2023.
- NVIDIA sells both InfiniBand and Spectrum Ethernet. Broadcom offers AI-oriented Ethernet features including adaptive routing and congestion control.
- Current market share needs current market data, and an efficiency claim needs matched whole-network energy per completed workload.
  - facts: F0963, F0960, F0961, F0183, F0186, F0187, F0189 · visuals: V0192
### Q0397 · How did NVIDIA’s market value compare with Apple and Microsoft?  _neutral_
- Apple was larger and Microsoft was close behind NVIDIA in the dated snapshot.
- Stock Analysis reported $5.15 trillion for Apple, $3.75 trillion for NVIDIA and $3.68 trillion for Microsoft.
- Market capitalisations move with share prices.
  - facts: F0430, F0429, F0431 · visuals: V0193
### Q0398 · Why did NVIDIA buy Mellanox, and what did it pay?  _strength_
- It brought high-performance networking into NVIDIA alongside its computing platform.
- The agreement cited an enterprise value of about $6.9 billion. At closing NVIDIA reported a $7 billion transaction value.
- The company announcements give the rationale and deal terms. The return on the acquisition requires separate evidence.
  - facts: F0378, F0179, F0373 · visuals: V0194
### Q0399 · Does Gaudi 3 outperform NVIDIA on AI workloads?  _risk_
- The sources reviewed do not establish a matched workload performance result.
- Intel claims 33% more I/O connectivity per accelerator versus H100. That is a bandwidth specification.
- Compare MLPerf Closed results using the same model and scenario and comparable system availability.
  - facts: F0910, F0911, F0912 · visuals: V0195
### Q0400 · What is NVIDIA’s latest verified public CDP climate score?  _neutral_
- We have no verified NVIDIA-specific climate grade in the accessible CDP material.
- CDP showed its 2025 set as the latest public corporate scores and scheduled the 2026 release for 2 December 2026.
- A confirmed grade needs the company, score year and climate theme.
  - facts: F0529, F0530, F0028 · visuals: V0196
### Q0401 · How would we measure electricity per generated video clip?  _neutral_
- We have no measured electricity figure for our clip.
- Specify the clip settings, measure active and idle system energy and overhead, and report how consumption varies across runs.
- Google’s 0.24 Wh example applies to a median Gemini text prompt, so we cannot use it to estimate video electricity.
  - facts: F0037, F0506, F0507, F0560, F0561, F0564, F0565 · visuals: V0197
### Q0402 · How did shareholders vote on disclosure of emissions from product use?  _risk_
- Shareholders rejected the nonbinding proposal.
- The filing records 13,789,742,126 shares against and 2,939,623,603 for, excluding abstentions and broker non-votes.
- NVIDIA’s proxy separately said it planned to expand reporting to include emissions from product use. Look for the published disclosure.
  - facts: F1039, F1038, F0700, F0701, F0702 · visuals: V0198
### Q0403 · What changed from Blackwell to Blackwell Ultra and Rubin?  _neutral_
- Blackwell is the base platform, Ultra is an enhanced version and Rubin follows as a new platform.
- NVIDIA rates Ultra at 1.5 times Blackwell AI compute FLOPS and Rubin at 50 petaflops per GPU for NVFP4 inference.
- Use a matched workload and configuration to compare real performance and cost.
  - facts: F0360, F0363, F0367 · visuals: V0199
### Q0404 · How many CUDA libraries did NVIDIA report, and what else did it count?  _strength_
- NVIDIA’s 2024 annual review reported more than 300 libraries.
- It separately listed 600 AI models and 3,500 GPU-accelerated applications.
- The figures are historical, company-reported counts in different categories. The current library count is unverified.
  - facts: F0930, F0932, F0933 · visuals: V0200
### Q0405 · Can grid delays slow AI infrastructure growth?  _risk_
- Yes. The IEA estimates that around 20% of planned data-centre projects could face delays if grid risks go unaddressed.
- It also finds that 50% of US data centres under development are in existing large clusters.
- New transmission lines can take years to build, so announced capacity can reach the grid more slowly than planned.
  - facts: F0007, F0457, F0471 · visuals: V0201
### Q0406 · Do custom AI chips have an environmental advantage over NVIDIA GPUs?  _neutral_
- That depends on the workload and the full system. Google reports 67% better energy efficiency for Trillium versus its previous TPU v5e.
- Meta’s 25 W figure is chip thermal design power. Microsoft describes closed-loop rack cooling without giving a measured energy saving in that disclosure.
- A comparison with NVIDIA needs matched workloads, whole-system energy and lifecycle emissions.
  - facts: F0156, F0159, F0160, F0895 · visuals: V0202
### Q0407 · What does the EU AI Act mean for NVIDIA and this presentation?  _neutral_
- The Commission describes risk-based obligations for providers and deployers by use. Its guidance gives no basis for treating NVIDIA chips as generally prohibited.
- General-purpose AI model rules became effective in August 2025. The Commission lists August 2026 for its transparency rules.
- For this pitch, disclose where we used AI. The applicable duties depend on who provides or deploys the system and how we use it.
  - facts: F0226, F0227, F0228, F0229, F0230, F0231 · visuals: V0203
### Q0408 · How strongly did NVIDIA shareholders back simple-majority voting?  _neutral_
- NVIDIA reported 14,589,671,908 shares for the proposal and 2,210,282,205 against.
- The proposal sought to replace supermajority provisions with a simple majority standard.
- The vote was advisory. A separate action would be needed to change the charter or bylaws.
  - facts: F0699, F1040, F1041, F1042, F1043 · visuals: V0204
### Q0409 · What happens if NVIDIA faces a supply disruption as orders weaken?  _risk_
- Revenue and margins could both come under pressure. Qualifying a replacement supplier takes time, and customers can often delay or cancel orders.
- NVIDIA reported a $0.4 billion inventory and purchase-obligation charge as H200 demand weakened in the first half of FY27.
- The filings give no loss estimate for a combined shock. Exposure depends on qualified capacity, order terms and the ability to recover inventory costs.
  - facts: F0592, F0593, F0598, F0262 · visuals: V0205
### Q0410 · Does growth outside hyperscalers prove NVIDIA has a diversified customer base?  _risk_
- The public breakdown cannot establish that. Bloomberg groups AI clouds, industrial and enterprise at $47.474 billion in its preliminary Q3 FY27 estimate.
- In its Q2 FY27 filing, NVIDIA says some individual indirect customers account for 10% or more of total revenue, based on estimates.
- NVIDIA names sovereign demand as a growth driver. The disclosures give no separate sovereign revenue figure or buyer-type split within Bloomberg’s combined bucket.
  - facts: F0090, F0711, F0712, F0716 · visuals: V0206
### Q0411 · Whose feedback determines Fortune’s workplace ranking?  _neutral_
- Great Place To Work says only employee survey data can earn a placement. Company essays provide context about workplace programmes.
- The publisher received more than 1.3 million responses across its US surveys in the year leading up to the 2026 edition. This is an aggregate across employers.
  - facts: F0680, F0684, F0685 · visuals: V0207
### Q0412 · What can MLPerf’s retrieval benchmark tell us about this pitch?  _neutral_
- It measures offline throughput for retrieval and answer generation.
- A valid submission must reach at least 97% of reference answer accuracy.
- Our live response time and energy use need measurements from the app itself.
  - facts: F0848, F0849 · visuals: V0208
### Q0413 · Does holding an MSCI World tracker mean we have screened NVIDIA for ESG risks?  _neutral_
- MSCI World has no ESG objective.
- NVIDIA was 5.25% of the index on 30 October 2026, so a direct position adds to the tracker exposure.
- The index mandate leaves our ESG assessment to us.
  - facts: F0436, F0439 · visuals: V0209
### Q0414 · What does NVIDIA’s published emissions target tell us about SBTi validation?  _risk_
- NVIDIA targets a 50% cut in absolute Scope 1 and market-based Scope 2 emissions by FY30 from FY23. Its SBTi validation status is unverified in the material reviewed.
- SBTi gives no assurance of delivery. Its temperature labels generally cover operational targets, with an exception for automakers.
  - facts: F0832, F0833, F0524, F0526, F0528 · visuals: V0210
### Q0415 · How much assurance do NVIDIA’s labour disclosures and conflict minerals audits provide?  _risk_
- UK law requires an annual modern slavery statement for eligible companies. NVIDIA’s FY26 statement says diligence found hiring fees and passport retention.
- NVIDIA reviewed audits covering 45% of strategic suppliers in FY26.
- Independent smelter assessments review sourcing systems and practices. Product-level material remains unverified by that process.
  - facts: F0632, F0635, F0639, F0641, F0663, F0668, F0669 · visuals: V0211
### Q0416 · What has SoftBank actually deployed in Japan, and what is still being evaluated?  _neutral_
- SoftBank reported deployment of NVIDIA GB200 NVL72 in its Japan data centres when it announced its GPU cloud beta.
- SoftBank and AMD began evaluating Instinct GPUs for future infrastructure. The releases leave future orders and the full cloud rollout open.
  - facts: F0747, F0748, F0749, F0750, F1048, F1049 · visuals: V0212
### Q0417 · What do we actually know about Isambard-AI’s annual energy and water footprint?  _risk_
- Annual metered electricity use, water withdrawals and water consumption remain unverified in the Bristol material reviewed.
- Bristol reports renewable electricity, closed-loop cooling and a PUE of about 1.08 with no measurement period stated.
- A facility profile leaves water at chip fabs and product-use emissions to be assessed separately.
  - facts: F0757, F0759, F0762, F0543, F0517, F0519 · visuals: V0213
### Q0418 · Which part of NVIDIA’s reported supply chain drives emissions growth?  _risk_
- Purchased goods and services rose from 3.22 million tonnes of CO₂e in FY24 to 9.30 million in FY26, the largest disclosed category.
- Capital goods reached 0.95 million tonnes in FY26. The inventory omits customer use of sold products.
- NVIDIA expects suppliers to verify their emissions. Greenpeace says the report gave no details on supplier power purchase agreements or direct renewable investment.
  - facts: F1044, F1045, F0835, F1046, F1047, F0836, F1002, F0830, F0841 · visuals: V0214
### Q0419 · What new oversight did NVIDIA announce for national security and export compliance?  _neutral_
- NVIDIA formed a standing board committee of independent directors for national security, export compliance and trade risk.
- It said it was engaging counsel and looking for a chief compliance officer to report to the governance committee.
- The independent investigation continued, and the effectiveness of the new controls remains to be demonstrated.
  - facts: F1016, F0398, F0074, F0075, F0078, F0577, F0073, F0071 · visuals: V0215
### Q0420 · Who does what when a hyperscaler builds a custom accelerator with Marvell?  _neutral_
- The hyperscaler can keep its own compute design. Marvell can provide chiplets, design IP, packaging and production support.
- Marvell offers design-to-spec and joint development. Its reported Data Center sales cover the broader segment, so custom-chip sales remain undisclosed in those figures.
  - facts: F0901, F0902, F1050, F0899 · visuals: V0216
### Q0421 · Who held NVIDIA’s leadership roles after Huang returned?  _neutral_
- Huang returned as president and CEO. Harvey Jones stayed board chair, and Colette Kress continued as CFO after serving as interim CEO.
- Cite 22 November 2026 as the effective date in the SEC filing. The press release appeared on 23 November and said effective immediately.
  - facts: F0063, F0064, F0065, F0066, F0069, F0398, F0399, F0414 · visuals: V0217
### Q0422 · What did Huang’s reinstatement establish about the investigations?  _risk_
- The board reinstated Huang and said its independent committee would continue investigating. The committee had retained independent counsel.
- NVIDIA said it would keep cooperating with government investigations. The board’s confidence and government input do not establish a final finding.
  - facts: F0070, F0071, F0072, F0398, F0575 · visuals: V0218
### Q0423 · Can a fab reuse water and still face local scarcity?  _risk_
- Yes. Samsung classifies its Korean semiconductor sites as medium-high water stress, even though they reported 107,967 thousand tonnes of reuse in 2025.
- Ask for site-level withdrawal, consumption and source-water stress before judging local impact.
  - facts: F0547, F0548, F0549, F0825, F1051, F1052 · visuals: V0219
### Q0424 · When can NVIDIA recognise sales to a customer it also supports financially?  _risk_
- NVIDIA recognises product revenue when the customer takes control, at the amount it expects to receive.
- It accounts for closely related agreements as one contract when warranted. The disclosed policy does not tell us how each arrangement was accounted for.
  - facts: F0614, F0615, F0616, F0625, F0626 · visuals: V0220
### Q0425 · Does the IEA’s high-efficiency scenario quantify AI rebound?  _neutral_
- No. The IEA projects about 970 TWh of global data-centre electricity demand in 2035 in that scenario while holding demand for AI and digital services constant.
- Estimating rebound requires measuring the extra usage efficiency induces. Track total electricity use alongside energy per task.
  - facts: F0009, F0566, F0568, F0569, F0571 · visuals: V0221
### Q0426 · Can the announced packaging projects replace Taiwan supply?  _risk_
- Replacement capacity remains unquantified. Vera Rubin uses TSMC CoWoS packaging, and SPIL’s expansion adds capacity within Taiwan.
- NVIDIA announced nearly $3 billion of agreements supporting Amkor in Arizona and South Korea. The agreements do not give a qualified replacement volume.
  - facts: F0191, F0192, F0193, F0774 · visuals: V0222
### Q0427 · Which US export measures were in place in NVIDIA’s August filing?  _risk_
- NVIDIA said the US had issued H200 licences for specific Chinese customers, subject to conditions.
- It described the AI Diffusion replacement as uncertain and the Remote Access Security Act as under consideration. Verify any subsequent rule and effective date separately.
  - facts: F0597, F0600, F0611, F0781, F0782 · visuals: V0223
### Q0428 · How can chip export restrictions spill into networking sales?  _risk_
- NVIDIA says its networking equipment is used in servers that contain its GPUs, so GPU curbs can weaken demand for both.
- NVIDIA reported $2.5 billion in H20 revenue it could not ship in Q1 FY26. The cited disclosures do not quantify the networking loss or competitors’ gains.
  - facts: F0206, F0779, F0784 · visuals: V0224
### Q0429 · Where do alternatives to NVIDIA compete in AI compute?  _risk_
- AWS Trainium and Google Ironwood target both training and inference.
- Intel markets Gaudi for large model workloads, and Meta built MTIA for its own recommendation workloads.
- Vendor descriptions establish intended workloads. Comparing cost, performance or market share requires separate evidence.
  - facts: F0150, F0155, F0158, F0161 · visuals: V0225
### Q0430 · Could NVIDIA suffer a supply interruption without a military conflict?  _risk_
- Yes. Disasters and supply restrictions can disrupt production or delay recovery.
- NVIDIA depends on foundries and contractors and highlights Taiwan and South Korea as especially important supply locations.
- Lead times previously exceeded 12 months. That history provides no specific recovery estimate, and NVIDIA says continuity plans have limits.
  - facts: F0232, F0233, F0234, F0235, F0236, F0589, F0593 · visuals: V0226
### Q0431 · What ESG exposures matter beyond NVIDIA’s operational emissions?  _risk_
- Supplier labour practices, sustainability oversight and the social and legal risks of AI adoption all matter.
- NVIDIA reviewed audits covering 45% of strategic suppliers in FY26. Its diligence found issues including hiring fees and passport retention.
- NVIDIA also warns that changing disclosure expectations and ethical or legal concerns about AI can affect the business.
  - facts: F0632, F0635, F0244, F0245 · visuals: V0227
### Q0432 · Could faster GPU generations hurt NVIDIA even if AI adoption rises?  _risk_
- Yes. Sequoia argues that newer chips can erode the economic value of older hardware, weakening infrastructure returns.
- If buyers struggle to recover their costs, they could defer future purchases. NVIDIA says customers can generally change or delay purchase commitments.
- NVIDIA’s workload comparison illustrates the technology shift. It leaves future resale values and accounting useful lives open.
  - facts: F0012, F0255, F0256, F0262 · visuals: V0228
### Q0433 · What qualifies Colette Kress to lead NVIDIA during a transition?  _neutral_
- Kress held divisional CFO roles at Microsoft and Cisco before joining NVIDIA as CFO in 2013.
- NVIDIA appointed her interim CEO while she stayed CFO. The reinstatement filing confirms that she continued as CFO after Huang returned.
  - facts: F0386, F0387, F0389, F0397, F0067 · visuals: V0229
### Q0434 · How much does NVIDIA rely on Jensen Huang as a leader?  _risk_
- Huang’s founder role and long tenure make succession a material governance question.
- The filings identify experienced executives in finance, field operations and operations, including Colette Kress, Ajay Puri and Debora Shoquist.
- Kress served as interim CEO, and the SEC filing gives 22 November 2026 as Huang’s effective return date.
  - facts: F0382, F0392, F0394, F0397, F0066 · visuals: V0229, V0217
### Q0435 · What does the equity risk premium tell us about expected returns?  _neutral_
- It estimates the extra return investors demand for holding equities. Actual returns can differ.
- The same US model gave 2.87% in 2000, 4.37% in 2007 and 4.36% in 2009.
- These are selected historical estimates. A current estimate depends on the method, inputs and date.
  - facts: F0423, F0424, F0425 · visuals: V0230
### Q0436 · Why is Morningstar’s margin higher than the one in our DCF?  _neutral_
- They measure different things. Morningstar forecasts gross margin and our DCF uses free-cash-flow margin.
- Morningstar projected mid-70% gross margin in FY27 and high-60% roughly a decade out. The team holds FCF margin at 45.25% based on its historical average.
- We could not verify Morningstar’s numerical discount rate from the disclosed assumptions.
  - facts: F0477, F0478, F0474, F0968 · visuals: V0231
### Q0437 · When could the UK require a licence to export NVIDIA chips to China?  _risk_
- The arms embargo covers certain military items. UK strategic export controls also apply to listed dual-use goods.
- An unlisted item can still require a licence based on end use, including certain military end uses.
- The UK assesses applications case by case. Check the product classification, destination and end user before reaching a conclusion.
  - facts: F0605, F0606, F0607, F0608, F0609 · visuals: V0232
### Q0438 · Can the semiconductor market grow while NVIDIA still suffers a downturn?  _risk_
- Yes. Semiconductor industry sales and NVIDIA’s AI demand can move differently.
- Our AI-demand stress test shows a scenario in which NVIDIA sales fall below FY27 consensus and stay there through FY32.
- This scenario tests downside exposure. It does not predict the timing or depth of a downturn.
  - facts: F0426, F0869, F0312, F0991, F0992 · visuals: V0092
### Q0439 · What did the Megaspeed listing establish, and what is still open?  _risk_
- BIS cited significant diversion risk. The listed entities face a licence requirement for items subject to US export rules and a presumption of denial.
- The rule establishes restrictions on listed entities. NVIDIA’s board inquiry and government inquiries were still ongoing in its November update.
  - facts: F0582, F0583, F0584, F0070, F0071, F0072 · visuals: V0218
### Q0440 · Does a growing semiconductor market protect NVIDIA from a downturn?  _risk_
- No. The industry can grow while individual markets weaken.
- SIA forecast global chip sales above $1.5 trillion for 2026. That is an industry forecast.
- In FY23, NVIDIA Gaming fell to $9.07 billion as Data Center grew to $15.01 billion.
  - facts: F0426, F1029, F1028, F1055, F1056 · visuals: V0233, V0236
### Q0441 · Can we reproduce NVIDIA’s CDP score in a pitch shared outside the team?  _risk_
- Obtain CDP’s prior written consent before reproducing its scores in an external deck.
- CDP allows internal, non-commercial use without consent. Its public score listings carry the same restriction.
  - facts: F1053, F0536 · visuals: V0234
### Q0442 · What does the BIS Entity List rule involving Megaspeed establish?  _risk_
- BIS cited diversion risk in adding 7 entities. The rule makes no finding of wrongdoing by NVIDIA.
- Items subject to US export rules require a licence for covered transactions. Applications face a presumption of denial.
- NVIDIA said it would continue cooperating with government inquiries.
  - facts: F1054, F0582, F0583, F0584, F0072 · visuals: V0235
### Q0443 · Has one NVIDIA market weakened while another grew?  _neutral_
- Yes. From FY22 to FY23, Gaming revenue fell from $12.46 billion to $9.07 billion.
- Data Center rose from $10.61 billion to $15.01 billion over the same period. That divergence illustrates why broad chip demand is an imperfect guide to individual markets.
  - facts: F1028, F1029, F1055, F1056 · visuals: V0236
### Q0444 · Has women’s representation on NVIDIA’s board improved?  _risk_
- The latest snapshot shows a decline. Women held 38.5% of board seats in FY25 and 30.0% in FY26.
- Women’s share of the workforce rose over the same reporting period, so the two measures moved in different directions.
  - facts: F1057, F0654, F0655, F0644, F0645 · visuals: V0237, V0169
### Q0445 · What share of U.S. electricity could data centres use?  _risk_
- Berkeley Lab estimated 4.4% in 2023 and projected 6.7% to 12% in 2028.
- The range includes all data-centre workloads, including AI, and shows how uncertain demand growth is.
  - facts: F0499, F0500, F1058 · visuals: V0238, V0068
### Q0446 · Has NVIDIA’s top direct customer become less important?  _risk_
- The largest disclosed direct customer represented 16% of revenue in Q2 FY27, down from 23% a year earlier.
- The filing does not establish that it was the same buyer. Some indirect customers also individually represented at least 10% of revenue.
  - facts: F0706, F0708, F0711, F0712, F0713 · visuals: V0239, V0106
### Q0447 · What do Microsoft’s outstanding data-centre commitments tell us about GPU demand?  _neutral_
- They show Microsoft has committed to infrastructure, including buildings and leases.
- At June 30, 2026 it disclosed $34.6 billion in construction commitments and $329.1 billion in leases yet to begin, both primarily for data centres.
- Some leases are conditional, and the disclosure gives no annual GPU spending figure.
  - facts: F0727, F0728 · visuals: V0240, V0107
### Q0448 · Why can NVIDIA report near-zero electricity emissions while grid-based emissions rise?  _risk_
- The methods answer different questions. Location-based accounting uses local grid emissions factors. Market-based accounting reflects electricity procurement.
- For FY26, NVIDIA reported 308,891 tonnes of CO₂e location-based and 568 tonnes market-based.
- Both cover purchased electricity in NVIDIA’s operations. The separate Scope 3 inventory covers value-chain emissions.
  - facts: F1059, F1060, F0838, F1061, F1062, F1001, F1002 · visuals: V0241, V0098
### Q0449 · How much can NVIDIA’s quarterly free cash flow swing?  _risk_
- In FY27 it fell from $48,554 million in Q1 to $21,341 million in Q2, then rebounded to $43,777 million in Q3.
- A single quarter is a poor guide to the annual run rate. Track inventory and investment alongside cash generation.
  - facts: F0346, F0347, F0348, F0349, F0350, F0351, F0352, F0334, F0338 · visuals: V0242, V0062
### Q0450 · How high could emissions from powering data centres go?  _risk_
- The IEA projects 300 million tonnes of CO₂ in its 2035 base case, up from a report baseline of 180 million tonnes.
- Its higher-growth Lift-Off Case reaches up to 500 million tonnes in 2035.
- The estimates cover electricity use at all data centres, including computing beyond AI.
  - facts: F0008 · visuals: V0243
### Q0451 · When did Microsoft and Google originally expect their nuclear deals to deliver power?  _neutral_
- The 2024 announcements targeted a 2028 restart for Microsoft’s contracted plant and a 2030 first reactor for Google’s Kairos deal.
- Google announced up to 500 MW across the planned deployments, and Constellation said the restart needed regulatory approvals.
- The IEA expects coal and gas to meet over 40% of added global data-centre electricity demand through 2030 in its base case.
  - facts: F0464, F0467, F0466, F0465, F0462 · visuals: V0244
### Q0452 · How much has NVIDIA’s workforce grown?  _neutral_
- Bloomberg records 42,000 NVIDIA employees in FY26, up from 22,473 in FY22.
- NVIDIA reported overall turnover of 3.7% in FY26, up from 2.5% the year before.
  - facts: F0057, F0056, F0657, F0658 · visuals: V0245
### Q0453 · How much equity has NVIDIA disclosed across its ecosystem?  _risk_
- NVIDIA disclosed $99 billion in ecosystem equity investments and $25 billion in equity investment commitments as of July 26, 2026.
- The figures cover the broader ecosystem, and the filing leaves the customer-funded share of NVIDIA revenue unquantified.
  - facts: F0612, F0613, F0614 · visuals: V0246
### Q0454 · How fast are Marvell’s data-centre sales growing?  _risk_
- Marvell reported $2,171.5 million in Q2 FY27 data-centre revenue, up from $1,490.5 million a year earlier.
- It reported $1,832.7 million in the preceding quarter.
- The wider portfolio includes connectivity, so these figures leave custom-chip revenue and any NVIDIA share loss unknown.
  - facts: F0897, F0898, F0899, F0900 · visuals: V0247
### Q0455 · Which H20 export-control costs did NVIDIA book, and which figures were estimates?  _risk_
- NVIDIA booked a $4.5 billion charge in Q1 FY26 and later released $180 million of reserves after unrestricted H20 sales outside China.
- It reported $2.5 billion in unshipped Q1 revenue and forecast roughly $8 billion in lost Q2 revenue.
- The charge, reserve release, unshipped revenue and forecast are different measures, so adding them would overstate what the disclosures establish.
  - facts: F0204, F0206, F0207, F0209 · visuals: V0248
### Q0456 · How much did NVIDIA increase research and development spending?  _neutral_
- NVIDIA reported $7,454 million in GAAP R&D expense for Q3 FY27, up from $4,705 million in the year-earlier quarter.
- These figures show what NVIDIA expensed for research and development. Returns on that spending remain uncertain.
  - facts: F0337 · visuals: V0249
### Q0457 · Which NVIDIA customer group grew faster last quarter?  _neutral_
- In Bloomberg’s preliminary Q3 FY27 breakdown, revenue from AI clouds, industrial and enterprise rose 195% year on year. Hyperscaler revenue rose 71%.
- The faster-growing category combines several types of buyers. Direct customer concentration remains a separate risk.
  - facts: F0082, F0083, F0048 · visuals: V0250, V0106
### Q0458 · How much new data-centre power could come from gas and coal?  _risk_
- In its base case, the IEA projects that gas and coal will meet more than 40% of added global data-centre electricity demand through 2030.
- Clean-power deals can help bring additional supply online. Their effect depends on when and where the projects deliver power.
  - facts: F0462, F0465, F0468 · visuals: V0251, V0244
### Q0459 · How much of the AI efficiency gain comes from the GPU?  _neutral_
- It depends on the workload. In one Facebook translation study, caching improved power efficiency 6.7-fold and GPU acceleration delivered a further 10.1-fold gain.
- Lower precision yielded a further 2.4-fold gain on GPUs. Each gain used the previous configuration as its baseline.
- The study illustrates how several changes contribute. A different model or deployment can produce different results.
  - facts: F0918, F0917, F0919, F0924 · visuals: V0252
### Q0460 · What does NVIDIA deduct to get from operating cash flow to free cash flow?  _neutral_
- For Q3 FY27, NVIDIA started with $48,253 million of operating cash flow.
- It deducted $4,422 million for equipment and intangible purchases and $54 million for related principal payments, leaving $43,777 million in free cash flow.
- Use NVIDIA’s definition consistently when comparing its reported quarters.
  - facts: F1063, F0338, F1064, F0352 · visuals: V0253, V0242
### Q0461 · What does Broadcom’s switch specification tell us about AI networking?  _neutral_
- Broadcom lists alternative configurations with up to 64 ports at 800 GbE, 128 at 400 GbE or 256 at 200 GbE.
- Those are switch-chip specifications. Comparing energy efficiency needs measured power and completion time for the same workload on complete networks.
  - facts: F0962, F0186 · visuals: V0254
### Q0462 · How has Black and Hispanic or Latino representation changed at NVIDIA in the US?  _neutral_
- The reported shares changed little. From FY24 to FY26, the Black or African American share went from 2.1% to 2.0% and the Hispanic or Latino share went from 3.9% to 4.1%.
- These figures describe the reported US workforce mix. Assessing hiring, promotion or retention requires separate measures.
  - facts: F0653, F1065 · visuals: V0255
### Q0463 · What share of the world’s electricity could data centres use?  _risk_
- The IEA estimates about 1.5% in 2024 and projects just under 3% in 2030 in its base case.
- That covers all data-centre workloads, including AI. The global figure can hide pressure on individual grids.
  - facts: F0002, F0004, F0007 · visuals: V0256
### Q0464 · Has turnover moved in the same direction across NVIDIA’s reported US employee groups?  _risk_
- No. Hispanic or Latino US staff turnover rose from 1.6% in FY24 to 2.7% in FY25 and 4.4% in FY26.
- Black or African American US staff turnover rose from 3.1% to 6.4%, then eased to 6.3%.
- Each rate uses its own employee population. NVIDIA’s table gives rates, and explaining them requires other evidence.
  - facts: F0659, F0660 · visuals: V0257
### Q0465 · How much water did Samsung’s device sites use in water-stressed areas?  _risk_
- At device sites in water-risk regions, Samsung reported withdrawing 2,440 thousand tonnes and consuming 552 thousand tonnes in 2025.
- Those volumes sit within device-division totals of 18,710 thousand tonnes withdrawn and 3,512 thousand tonnes consumed.
- The figures describe Samsung’s device division. Estimating NVIDIA’s manufacturing water footprint needs separate supplier data.
  - facts: F0815, F0816, F0826, F0827 · visuals: V0258
### Q0466 · Did any H20 sales continue after the US licensing requirement?  _risk_
- Yes. NVIDIA disclosed around $650 million of unrestricted Q2 FY26 H20 sales to one customer outside China. It reported no H20 sales to China-based customers that quarter.
- In Q1 FY26, NVIDIA reported $4.6 billion in H20 sales before licensing took effect. The Q2 dollar figure covers the disclosed transaction with one customer.
  - facts: F0205, F0208, F0210 · visuals: V0259
### Q0467 · What does AWS claim improved from Trainium2 to Trainium3?  _neutral_
- AWS lists 1.7 times the memory bandwidth and up to twice the MXFP8 compute throughput for Trainium3 versus Trainium2.
- These are AWS hardware ratings. A matched workload test would be needed to compare cost, energy use or speed against NVIDIA.
  - facts: F0152, F0153 · visuals: V0260
### Q0468 · Are NVIDIA’s direct emissions falling?  _risk_
- No. Bloomberg records direct emissions of 8.89 thousand tonnes CO₂e in FY24, 9.05 in FY25 and 9.82 in FY26.
- Direct emissions cover Scope 1. Purchased-electricity and value-chain emissions are reported separately, and the company target combines Scope 1 with market-based Scope 2.
  - facts: F0016, F0017, F0018, F0833 · visuals: V0261
### Q0469 · How wide is the IEA’s range for data-centre power demand in 2035?  _risk_
- The IEA projects roughly 700 TWh in its headwinds case, 970 TWh in its high-efficiency case, 1,200 TWh in its base case and more than 1,700 TWh in its lift-off case.
- These are global data-centre scenarios. They vary assumptions about adoption, efficiency and how quickly new capacity can be built.
  - facts: F0010, F0009, F1066, F1067 · visuals: V0262
### Q0470 · How much could NVIDIA lose on its investments in AI infrastructure financiers?  _risk_
- NVIDIA disclosed $4.7 billion in maximum loss exposure on certain investments, including carrying values and future commitments.
- It separately disclosed a $3.3 billion equity-method balance across infrastructure financiers. Those holdings overlap, so adding the figures would double count exposure.
  - facts: F0622, F0623 · visuals: V0263
### Q0471 · Can we compare NVIDIA’s water figures before and after the reporting change?  _risk_
- No comparable trend can be drawn. NVIDIA changed its collection methods in FY26.
- The two reports show water withdrawals of 409,814 and 451,297 cubic metres, respectively. The apparent increase cannot establish that operations withdrew more water.
  - facts: F0545, F0537, F0540, F0543 · visuals: V0264
### Q0472 · How does Isambard-AI’s power overhead compare with air-cooled supercomputers?  _neutral_
- Bristol reports a power usage effectiveness of about 1.08 for Isambard-AI versus around 2.0 for traditional air-cooled supercomputers.
- PUE compares facility electricity with IT electricity. Bristol leaves the averaging period unspecified, so this comparison gives no annual electricity total.
  - facts: F0759, F0764 · visuals: V0265
### Q0473 · Where did NVIDIA place on Fortune’s workplace list?  _strength_
- NVIDIA ranked sixth in 2026. Nearly 640,000 employee responses across eligible companies informed the list.
- Employees’ survey responses determine placement. The sample figure covers the eligible companies collectively.
  - facts: F0680, F0682, F0683 · visuals: V0266
### Q0474 · How much of Samsung’s device-division water use was actually consumed?  _neutral_
- In 2025 Samsung’s device division reported consuming 3,512 thousand tonnes of water.
- The division withdrew 18,710 thousand tonnes and discharged 15,198 thousand tonnes. These figures cover device sites. Use Samsung’s separate semiconductor figures for fabs.
  - facts: F0815, F0816, F0817, F0818 · visuals: V0267
### Q0475 · How much did NVIDIA’s standalone Automotive sales grow before the reporting change?  _neutral_
- Quarterly Automotive revenue rose modestly, from $570 million in Q4 FY25 to $604 million in Q4 FY26.
- NVIDIA subsequently grouped Automotive with other activities in Edge Computing. The Edge total cannot establish current Automotive or robotics revenue.
  - facts: F0886, F0889, F0145, F0142, F0139, F0148, F0891 · visuals: V0268
### Q0476 · What does Azure’s revenue growth tell us about demand for NVIDIA?  _neutral_
- Microsoft said Azure surpassed $75 billion in FY2025 and $100 billion in FY2026. Those are milestones for the whole Azure business.
- The milestones show cloud demand at scale, while the AI share, AI profitability and NVIDIA’s share of the spending remain unquantified by those disclosures.
  - facts: F0269, F0270 · visuals: V0269
### Q0477 · What protection does NVIDIA have on its guarantees for selected AI cloud partners?  _risk_
- NVIDIA disclosed $3.5 billion in maximum gross exposure on selected partners’ land, power and shell guarantees as of July 2026.
- The partners provided $712 million in escrow to partially mitigate potential losses. Exposure falls as those partners pay their lessors.
- The August SB Energy agreement is a separate disclosure. The gross figure on these selected partner guarantees does not forecast a cash loss.
  - facts: F0621, F1072, F0618 · visuals: V0270
### Q0478 · How concentrated were NVIDIA’s direct sales in the first half of FY27?  _risk_
- NVIDIA’s three biggest direct customers represented 16%, 15% and 13% of total revenue in the first half of FY27.
- Some direct customers are integrators or distributors, which can serve several end customers. The shares measure who bought directly from NVIDIA.
  - facts: F0707, F1070, F1071, F0711, F0713 · visuals: V0271
### Q0479 · Does NVIDIA supply all of the UK’s public AI research systems?  _neutral_
- The UK research programme uses several suppliers. Isambard-AI has 5,448 NVIDIA Grace Hopper superchips supplied by HPE.
- Cambridge’s Dawn uses 1,024 Intel GPUs, and Zenith was built with AMD, Dell and StackHPC.
- The disclosures identify suppliers on specific systems. The value of future NVIDIA orders remains unknown.
  - facts: F0091, F0096, F0097 · visuals: V0272
### Q0480 · Can Samsung’s group-wide water trend tell us how much water goes into making NVIDIA chips?  _risk_
- Samsung’s group-wide withdrawal rose from 177,361 thousand tonnes in 2023 to 197,720 thousand tonnes in 2025.
- Those withdrawals cover the reporting group, including device operations. Attributing water use to NVIDIA requires supplier and site data plus a way to allocate it to NVIDIA products.
  - facts: F1068, F1069, F0813, F0815, F0816 · visuals: V0273
### Q0481 · How wide is the range of NVIDIA revenue estimates for FY27 and FY28?  _risk_
- Yahoo Finance’s FY28 revenue estimates range from $546 billion to $778.47 billion, with an average of $726.02 billion.
- Its FY27 estimates range from $412.45 billion to $431.68 billion, with an average of $423.66 billion.
- These are the lowest and highest estimates in one published snapshot. They give no probability of landing within the range.
  - facts: F0302, F0300, F0303, F0304, F0301, F0305 · visuals: V0274
### Q0482 · How did the September approval change NVIDIA’s room for buybacks?  _neutral_
- Unused repurchase authority rose from about $99 billion at the end of Q2 FY27 to $227.3 billion at the end of Q3 FY27.
- The board added $150 billion of authority in September 2026.
- The remaining amount permits future repurchases at NVIDIA’s discretion.
  - facts: F0319, F0316, F0314 · visuals: V0275
### Q0483 · How much fuel did NVIDIA use alongside its renewable electricity?  _neutral_
- NVIDIA reported 46,258 MWh of fuel use in FY26 alongside 100% renewable electricity.
- Fuel use was 35,729 MWh in FY25 and 39,087 MWh in FY24.
- The figures cover NVIDIA’s reported operations. The presentation’s electricity source would require separate evidence.
  - facts: F1073, F1074, F0999, F0998 · visuals: V0276
### Q0484 · How much did Isambard-AI’s modular construction cut emissions?  _risk_
- The University of Bristol estimates about 72% lower construction emissions than traditional build methods.
- The estimate is for construction. A full lifecycle inventory would also need to address the computing hardware and ongoing operations.
  - facts: F0761, F0760 · visuals: V0277
### Q0485 · Did NVIDIA’s stock-based compensation expense rise on a like-for-like basis?  _risk_
- Yes. Stock-based compensation expense rose from $4,753 million to $6,042 million across the first nine months of FY26 and FY27.
- Expense measures the cost of awards. To assess net dilution, check diluted weighted-average shares alongside repurchases and stock issuance.
  - facts: F1075, F1076, F0329, F0325 · visuals: V0278
### Q0486 · Did Azure’s growth accelerate within Microsoft’s FY26?  _neutral_
- Microsoft reported 39% year-on-year growth in Azure and other cloud services in its December quarter and 43% in its June quarter.
- That measure covers the broader cloud business, so the growth figures leave NVIDIA’s share of the resulting spending unquantified.
  - facts: F0273, F0272 · visuals: V0279
### Q0487 · Has NVIDIA’s U.S. workplace safety record improved?  _strength_
- The U.S. recordable incident rate fell from 0.11 in FY24 to 0.08 in FY25 and 0.07 in FY26, measured per 200,000 employee hours.
- These are NVIDIA’s U.S. employee figures. Use separate evidence to assess safety at suppliers and facilities outside the U.S.
  - facts: F1077, F1078, F1079 · visuals: V0280
### Q0488 · How quickly was data-centre electricity use growing before the IEA’s forecast period?  _risk_
- The IEA estimates global data-centre electricity use grew about 12% a year from 2017 to 2024, more than four times the growth rate for all electricity use.
- The historical estimate covers all data-centre workloads, including conventional computing.
  - facts: F0005, F0001 · visuals: V0281
### Q0489 · How did annual dependence on NVIDIA’s largest direct buyer change?  _risk_
- The largest disclosed direct customer accounted for 13% of total revenue in FY24, 12% in FY25 and 22% in FY26.
- The filing does not identify the buyers. The ranking can change hands, and direct buyers can be intermediaries.
  - facts: F0710, F1080, F0709, F0711 · visuals: V0282
### Q0490 · Does NVIDIA’s renewable electricity figure apply to its manufacturing supply chain?  _risk_
- NVIDIA reports 100% renewable electricity for its own operations in FY26.
- Greenpeace estimated 24.09% across a sample of 20 East Asian manufacturing suppliers using CDP responses as of March 2026.
- The renewable mix across NVIDIA’s full supply chain remains unverified.
  - facts: F0998, F0831 · visuals: V0283
### Q0491 · Did Samsung’s wastewater discharge rise alongside its water withdrawals?  _risk_
- Yes. Group wastewater discharge rose from 142,995 to 158,660 thousand tonnes between 2023 and 2025. Withdrawal also rose, from 177,361 to 197,720 thousand tonnes.
- The figures cover Samsung’s reporting group. Estimating NVIDIA’s share would require site and product allocation data.
  - facts: F1068, F1081, F0813, F0814 · visuals: V0284
### Q0492 · How much of the latest MLPerf Training round came from cloud-based systems?  _neutral_
- Cloud-based systems accounted for 37% of submitted systems in v6.1, up from 29% in v6.0.
- These percentages measure which systems entered the benchmark. Market share and workload performance each require separate evidence.
  - facts: F1082, F1083, F0845, F0846 · visuals: V0285
### Q0493 · How much of NVIDIA’s revenue came from the big cloud providers?  _risk_
- Hyperscalers accounted for 51.9% of total revenue in Bloomberg’s preliminary Q3 FY27 breakdown.
- AI clouds, industrial and enterprise together accounted for 41% of total sales.
- The groupings show end-market exposure. Individual buyer concentration still needs a separate look.
  - facts: F0079, F0080, F0711, F0712 · visuals: V0286
### Q0494 · When a data centre withdraws water, how much does it actually consume?  _risk_
- Google says its data centres consumed 80% of withdrawals on average.
- It counts consumption as water withdrawn minus water returned.
- This is Google’s average. A site-specific assessment also needs the water source, local scarcity and water used to generate electricity.
  - facts: F0556, F0030 · visuals: V0287
### Q0495 · How much less energy does NVIDIA claim Blackwell can use for inference?  _neutral_
- NVIDIA claimed up to a 25-fold reduction for GB200 NVL72 versus the same number of H100 GPUs on large-language-model inference.
- The figure is a vendor maximum for that comparison. Total electricity use still depends on how fast AI workloads grow.
  - facts: F0011, F0003 · visuals: V0288
### Q0496 · How fast was Data Center networking growing under NVIDIA’s old reporting split?  _neutral_
- NVIDIA reported 35% growth from the previous quarter and 199% growth from the same quarter a year earlier in Q1 FY27.
- The newer networking franchise figure has a different label. We need a scope reconciliation before extending the growth series.
  - facts: F0965, F0136, F0967 · visuals: V0289
### Q0497 · How long is Microsoft’s Crane nuclear power agreement?  _neutral_
- Microsoft signed a 20-year power purchase agreement to support the planned restart of the Crane Clean Energy Center.
- Constellation originally targeted 2028 for the plant to come online. The contract term measures the length of the purchase commitment, and deliveries depend on the restart.
  - facts: F0463, F0464 · visuals: V0290
### Q0498 · How much memory do rival accelerator chips offer?  _neutral_
- AMD lists 288 GB of high-bandwidth memory per MI350-series GPU. AWS lists 144 GB per Trainium3 chip.
- Chip memory is relevant to model sizing. Compare system-level throughput and cost on the intended workload before drawing an investment conclusion.
  - facts: F0908, F0151 · visuals: V0291
### Q0499 · Did adjustments boost NVIDIA’s reported earnings per share last quarter?  _neutral_
- No. NVIDIA reported GAAP diluted EPS of $2.70 and non-GAAP diluted EPS of $2.68 in Q3 FY27.
- Adjusted operating expenses were lower at $8.8bn versus $9.2bn. Adjusted gross margin was 74.9% versus 74.8% on a GAAP basis.
- Both measures include stock compensation. Use NVIDIA’s reconciliation to see which other items it adjusts.
  - facts: F0104, F0105, F0106, F0107, F0123, F0124, F0324 · visuals: V0292
### Q0500 · Did the H200 licences materially reopen the Chinese market for NVIDIA?  _risk_
- The initial shipments were small. Licensed H200 shipments were less than 1% of Data Center revenue in Q2 FY27.
- NVIDIA booked a $0.4bn H200 inventory and purchase-obligation charge in the first half of FY27.
- Chinese restrictions limited sales and NVIDIA said it was unable to pass through the 25% US import tariff at the time of the filing.
  - facts: F0599, F0598, F0601, F0597, F0777 · visuals: V0293
### Q0501 · How much GPU time can UK projects request through the public compute programme?  _neutral_
- Rapid Access offers up to 20,000 GPU hours for eligible UK small and medium organisations. Gateway offers up to 10,000 GPU hours for eligible applicants.
- Both allocations must be used within three months of project start.
- These are access limits. NVIDIA is one of several suppliers to the public compute programme.
  - facts: F0102, F1084, F0091, F0096, F0097 · visuals: V0294
### Q0502 · Does Bristol’s liquid cooling claim show that Isambard-AI cut total energy use?  _neutral_
- Bristol’s launch announcement gives a maximum cooling-power reduction of 90% for the technology.
- To quantify annual electricity savings across the site, we would need metered facility electricity against a comparable baseline.
  - facts: F0763, F0762 · visuals: V0295
### Q0503 · Is NVIDIA’s valuation discount visible on a trailing enterprise-value measure?  _neutral_
- In the November snapshot, Stock Analysis showed NVIDIA at 14.89 times trailing EBITDA and TSMC at 14.73 times.
- Broadcom was at 28.18 times and AMD at 60.84 times on the same snapshot.
- The companies have different business mixes and capital needs. This comparison alone cannot establish fair value.
  - facts: F0278, F0282, F0286, F0290 · visuals: V0296
### Q0504 · Would measuring the GPU alone capture the energy cost of this AI presentation?  _neutral_
- A chip-only reading would miss host power, idle capacity and facility overhead.
- Google reported 0.14 Wh from the active accelerator and 0.24 Wh in total for its median Gemini Apps text prompt.
- That result applies to serving Gemini text in the study. We would need measurements for this presentation’s actual workloads and services.
  - facts: F1085, F1086, F0038, F0037, F0040 · visuals: V0297
### Q0505 · What happens when a smelter fails to fix audit findings?  _risk_
- Under the Responsible Minerals Initiative’s extended programme, an enrolled smelter or refiner has 12 months to close outstanding findings.
- If it misses that deadline, the programme issues a final warning and then ends its participation.
- Independent assessments check sourcing practices and management systems. They leave the material in any given chip unverified.
  - facts: F0672, F0668, F0669, F0670 · visuals: V0298
### Q0506 · If customers cancel orders, how much inventory is NVIDIA carrying?  _risk_
- Inventory was $39,724 million at the October 2026 quarter-end, up from $21,403 million at the January fiscal year-end.
- NVIDIA says customers can generally cancel, change or delay product purchase commitments at short notice without penalty.
- The balance measures inventory on hand. The size of any future write-down remains unknown.
  - facts: F0334, F0715 · visuals: V0299
### Q0507 · When is NVIDIA targeting more high-volume chip testing outside Taiwan?  _neutral_
- NVIDIA targets February 2027 for expanded testing in Singapore and April 2027 for KYEC’s U.S. facilities.
- NVIDIA announced a $1.1 billion capacity reservation advance for KYEC’s U.S. facilities and equipment.
- These dates are company targets. Testing is one step in producing a finished chip.
  - facts: F0198, F0769, F0197, F0661 · visuals: V0300
### Q0508 · How does NVIDIA sell AI Enterprise after the production trial?  _neutral_
- NVIDIA offers a 90-day production trial. Its filings disclose paid AI Enterprise licences alongside software delivered as part of its wider data-centre platform.
- The reviewed filing groups software with other businesses and gives no standalone AI Enterprise sales figure. Paid conversion remains unquantified.
  - facts: F0176, F0937, F0938, F0939 · visuals: V0301
### Q0509 · Did Huang’s reinstatement reverse Morningstar’s valuation cut?  _neutral_
- Morningstar kept its $250 per-share fair-value estimate after the reinstatement. It had cut the estimate from $310 during the leadership disruption.
- Morningstar said the cut reflected lower long-term revenue forecasts and a higher discount rate. It still rated uncertainty very high.
  - facts: F0475, F0474, F0476 · visuals: V0302
### Q0510 · Has Google put clean power on the grid for its data centres, or only signed deals?  _neutral_
- Yes. Google reported in 2023 that its Fervo geothermal project was feeding electricity onto the Nevada grid serving its data centres.
- Its later Kairos plan originally targeted 2030 for the first small modular reactor. That target leaves delivery and scale uncertain.
  - facts: F0467, F0468 · visuals: V0303
### Q0511 · Did Gemini’s efficiency gains lower total AI electricity use?  _risk_
- Google reported that energy per median Gemini Apps text prompt fell 33-fold and greenhouse gas emissions per prompt fell 44-fold from May 2024 to May 2025.
- To assess total impact, we need actual electricity use, emissions and workload volume.
  - facts: F0039, F1087, F0565 · visuals: V0304
### Q0512 · How much of AMD’s business is in data centres, and can we isolate its AI accelerator sales?  _risk_
- Data Center was AMD’s largest segment in Q3 2026, at $8,546 million. Client and Gaming brought in $3,722 million and Embedded brought in $1,109 million.
- Data Center includes EPYC CPUs as well as Instinct accelerators. This release gives no standalone accelerator revenue or market-share figure.
  - facts: F0913, F1088, F1089, F0492 · visuals: V0305
### Q0513 · How much of Broadcom’s chip business was AI, and what counts as AI revenue?  _risk_
- In Q2 FY26, Broadcom reported $10.8 billion of AI semiconductor revenue within $15,009 million of Semiconductor Solutions revenue.
- It separately reported $7,178 million in Infrastructure Software. The AI figure includes networking and custom accelerators, so standalone accelerator sales remain unknown.
  - facts: F1090, F1091, F0486, F0488 · visuals: V0306
### Q0514 · How was NVIDIA’s workstation graphics business performing before the disclosure changed?  _neutral_
- Professional Visualization rose from $509 million in Q1 FY26 to about $1.3 billion in Q4 FY26. NVIDIA attributed the final-quarter increase to strong Blackwell demand.
- NVIDIA’s FY27 release grouped workstations into Edge Computing, so the later aggregate does not isolate workstation graphics sales.
  - facts: F0885, F0888, F0144, F0141, F0138, F0891 · visuals: V0307
### Q0515 · What operating costs should we expect next quarter, and are they all recurring?  _risk_
- NVIDIA reported $9.2 billion of GAAP operating expenses in Q3 FY27 and guided to about $11.0 billion in Q4.
- Management attributed the recent rise to compute and infrastructure spending. The outlook includes an extra week and transition costs, whose effects management did not break out.
  - facts: F1092, F0123, F0113, F0125, F0879, F0880 · visuals: V0308
### Q0516 · How much cash dividend is NVIDIA paying per share?  _neutral_
- NVIDIA raised its quarterly dividend from $0.01 to $0.25 per share in May 2026 and declared the same rate for the December 2026 payment.
- That is the per-share dividend. NVIDIA’s broader capital-return total also includes buybacks.
  - facts: F1093, F0317, F0315 · visuals: V0309
### Q0517 · Does NVIDIA also look cheaper on trailing earnings, before using forecasts?  _neutral_
- In the 24 November 2026 close snapshot, Stock Analysis put trailing P/E at 16.69 times for NVIDIA, 23.60 for TSMC, 38.43 for Broadcom and 89.58 for AMD.
- That compares past earnings at one point in time. The companies have different business mixes, so the multiples alone cannot establish fair value.
  - facts: F0276, F0288, F0284, F0280 · visuals: V0310
### Q0518 · Has the US overnight rate moved, and is it the rate you use in the DCF?  _neutral_
- The effective federal funds rate rose from 3.63% in August 2026 to 3.88% in October 2026 on FRED’s monthly series.
- The overnight rate provides market context. The DCF uses a company discount rate, which also reflects longer-term yields and the equity risk premium.
  - facts: F0422, F0421, F0420, F0415 · visuals: V0311
### Q0519 · How can the board verify that NVIDIA’s supplier fixes reached workers?  _risk_
- Ask for evidence from affected workers and independently verified closure.
- NVIDIA reports working with suppliers on fee refunds and passport access. It also acknowledges that remediation can leave workers with lost income.
- Check whether workers received repayments, kept control of their documents and lost income during the process.
  - facts: F0634, F0635, F0636, F0637, F0638, F0808, F0809, F0810 · visuals: V0312
### Q0520 · Did Google meter the water used by each Gemini prompt?  _neutral_
- Google calculated the water figure. It estimated 0.26 mL of direct cooling water for its median Gemini Apps text prompt in May 2025.
- It used 0.24 Wh of serving energy and the prior-year average freshwater intensity of its model-serving data centres.
- The estimate covers cooling during serving. A lifecycle estimate uses a broader boundary.
  - facts: F0037, F0550, F0551, F0553, F0558, F0559 · visuals: V0313
### Q0521 · What should NVIDIA disclose about emissions from customers using its products?  _risk_
- Ask for expected lifetime emissions from relevant products sold during the reporting year, plus assumptions about customer use and equipment life.
- NVIDIA’s FY26 table reported 10,700,940 metric tonnes of Scope 3 emissions. Its listed categories omit use of sold products.
- The GHG Protocol requires direct use-phase emissions in that category and disclosure of calculation methods and assumptions.
  - facts: F1002, F0516, F0517, F0518, F0519, F0520, F0702 · visuals: V0314
### Q0522 · When is new substrate capacity due and where is it located?  _risk_
- NVIDIA said Samsung Electro-Mechanics could contribute existing capacity in South Korea.
- In Taiwan, Unimicron expects first additions in the second quarter of 2027, and Kinsus expects production in the second half of 2027.
- Japan’s IBIDEN expects its Ono plant to begin ramping in the first quarter of 2028. These milestones are supplier plans.
  - facts: F0200, F0201, F0767, F0771 · visuals: V0315
### Q0523 · When does NVIDIA recognise software licence and support revenue?  _neutral_
- NVIDIA’s FY24 filing described recognising licence revenue upfront when software became available, with software support booked over the service period or as delivered.
- The $3.2 billion July 2026 balance measures remaining obligations from contracts longer than one year.
- NVIDIA says unearned revenue covers hardware and software support and cloud services. These balances give no standalone AI Enterprise run rate.
  - facts: F0942, F0943, F0944, F0945 · visuals: V0316
### Q0524 · How long has PwC audited NVIDIA, and how often does its lead partner rotate?  _neutral_
- PwC has audited NVIDIA annually since 2004, according to the proxy. Shareholders ratified its appointment for fiscal 2027.
- The proxy caps the lead partner’s consecutive term at five years.
- Ask how the audit committee assesses firm-level independence across those rotations.
  - facts: F0691, F0692, F0705 · visuals: V0317
### Q0525 · How much cheaper is AWS Trainium for model training?  _risk_
- AWS advertises up to 50% savings versus comparable EC2 instances. Stockmark reports a 20% saving versus what it calls equivalent GPU instances in an AWS testimonial.
- Treat each result as specific to its comparison. The claims leave the exact matched configurations unclear.
- Compare the same model and quality target on named instances, including the engineering effort to switch.
  - facts: F0853, F0854, F0855 · visuals: V0318
### Q0526 · How does the IEA split electricity growth between accelerated and conventional servers?  _risk_
- In the IEA’s base case, accelerated-server electricity use grows 30% a year through 2030, versus 9% for conventional servers. AI adoption is the main driver of accelerated-server growth.
- Those are projected growth rates for each server category. The full data-centre total also includes other IT equipment and infrastructure such as cooling.
  - facts: F0006, F1094, F0007 · visuals: V0319, V0096
### Q0527 · How much of NVIDIA’s marketable assets is cash, debt securities or equities?  _risk_
- At October 25, NVIDIA held $29,089 million in cash and equivalents, $24,423 million in marketable debt securities and $44,219 million in marketable equity securities.
- Marketable equities rose from $12,886 million in January. Their market value can move, so assess that portfolio separately when judging NVIDIA’s cash cushion.
  - facts: F0333, F0336, F1095 · visuals: V0320, V0150
### Q0528 · Does NVIDIA’s principal payment deduction explain its FY26 free cash flow gap with Bloomberg?  _neutral_
- Use NVIDIA’s reported $96,575 million for FY26. Bloomberg’s annual export shows $96,676 million.
- NVIDIA’s reconciliation deducts $101 million in principal payments. That matches the difference arithmetically. We still need Bloomberg’s line items to confirm what explains the gap.
  - facts: F0355, F0344, F1096 · visuals: V0321
### Q0529 · Did NVIDIA’s U.S. lost-time case rate fall as recordable incidents declined?  _neutral_
- The lost-time case rate held at 0.01 per 200,000 labor hours in each year from FY24 through FY26. The recordable incident rate fell from 0.11 to 0.07 on the same reporting basis.
- These disclosures cover NVIDIA’s U.S. employees. Factory and supplier safety require separate evidence.
  - facts: F1097, F1077, F1078, F1079 · visuals: V0322
### Q0530 · How much has Microsoft’s cloud gross margin changed as it invested in AI?  _risk_
- Microsoft Cloud gross margin fell from 71% in FY2024 to 69% in FY2025 and 66% in FY2026. Microsoft cited AI infrastructure investment and, in FY2026, growing AI product usage.
- The margin covers Microsoft’s wider cloud business. To judge returns on AI spending, ask for AI-specific revenue and costs.
  - facts: F1098, F1099, F0860 · visuals: V0323, V0172
### Q0531 · What does NVIDIA disclose about pay ratios by gender and race?  _neutral_
- NVIDIA reports a global FY26 ratio of 99.5 to 100 for women versus men. Its published U.S. ratios relative to White employees range from 99.3 to 100.1 per 100.
- Ask for pay by role and level and for promotion outcomes to assess who advances and how compensation changes.
  - facts: F0652, F1100, F1101, F1102 · visuals: V0324, V0169
### Q0532 · How fast has Edge Computing grown this fiscal year?  _strength_
- NVIDIA reported Edge Computing revenue of $6.4 billion, $7.2 billion and $8.2 billion in the first three quarters of FY27.
- The platform includes PCs, consoles, workstations, robotics and automotive. The platform totals do not give us standalone Gaming sales.
  - facts: F0147, F0146, F0116, F0148 · visuals: V0325
### Q0533 · What does Ecolab’s cooling unit rating actually tell us about water savings?  _risk_
- The 3-megawatt rating describes the capacity of the coolant distribution unit.
- To establish savings, compare measured whole-site water consumption under similar loads and weather. Include the water used to generate the electricity.
  - facts: F0035, F0036, F0030, F0029 · visuals: V0326, V0185
### Q0534 · How much packaging capacity is Amkor planning to add, and does it reduce NVIDIA’s reliance on TSMC?  _risk_
- NVIDIA says Amkor is targeting more than a 300% increase in interposer wafer capacity in South Korea by end-2028.
- NVIDIA says its multiyear agreements supporting Amkor in South Korea and Arizona total nearly $3 billion and include prepayments.
- Rubin volume shipments still use TSMC. The Amkor target does not quantify how much Taiwan-based capacity could be replaced.
  - facts: F0768, F0192, F0191 · visuals: V0327, V0222
### Q0535 · How much of the planned UAE AI campus is Stargate UAE?  _neutral_
- G42 announced a 1 GW Stargate cluster inside a planned 5 GW campus. The first 200 MW phase sits inside that cluster.
- G42 named NVIDIA as a supplier without disclosing a contract value. Its original opening target does not establish that the first phase is operating.
  - facts: F0738, F0735, F0736, F0737 · visuals: V0328
### Q0536 · Is Microsoft’s commercial backlog still growing quarter to quarter?  _neutral_
- It held roughly steady at $678 billion in June and $677 billion in September 2026.
- Microsoft’s commercial backlog covers a range of products and services. It gives us no estimate of NVIDIA orders or AI-only revenue.
  - facts: F0274, F1103 · visuals: V0329
### Q0537 · How much sales growth did AMD guide to for its fourth quarter?  _risk_
- AMD reported $13.4 billion in third-quarter revenue and guided to about $17 billion for the fourth quarter, plus or minus 3%.
- These are company-wide figures. AMD’s outlook does not isolate accelerator sales or establish that it won share from NVIDIA.
  - facts: F0490, F0493 · visuals: V0330, V0305

## ai-demand (28)
- **F0265** Microsoft cash additions to property and equipment were $28,107 million in FY2023, ended June 2023; this covers all assets, not just AI or NVIDIA purchases. _[high; FY2023]_ — Microsoft (2024-07-30) https://www.microsoft.com/en-us/Investor/earnings/FY-2024-Q4/press-release-webcast
- **F0266** Microsoft cash additions to property and equipment were $44,477 million in FY2024, ended June 2024; this covers all assets, not just AI or NVIDIA purchases. _[high; FY2024]_ — Microsoft (2024-07-30) https://www.microsoft.com/en-us/Investor/earnings/FY-2024-Q4/press-release-webcast
- **F0267** Microsoft cash additions to property and equipment were $64,551 million in FY2025, ended June 2025; this covers all assets, not just AI or NVIDIA purchases. _[high; FY2025]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0268** Microsoft cash additions to property and equipment were $115,948 million in FY2026, ended June 2026; this covers all assets, not just AI or NVIDIA purchases. _[high; FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0269** Microsoft reported Azure surpassed $75 billion annual revenue in FY2025, across all workloads rather than AI alone. _[high; FY2025]_ — Microsoft (2025-07-30) https://www.microsoft.com/en-us/Investor/earnings/FY-2025-Q4/press-release-webcast
- **F0270** Microsoft reported Azure annual revenue exceeded $100 billion in FY2026; Azure includes non-AI workloads. _[high; FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0271** Microsoft reported more than 30 million paid Microsoft 365 Copilot seats in FY2026; seats are not a measure of profit. _[high; FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0272** Microsoft reported Azure and other cloud services revenue grew 43% year on year in its fiscal fourth quarter ended June 2026; this includes non-AI services. _[high; Q4 FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0273** Microsoft reported Azure and other cloud services revenue grew 39% year on year in its fiscal second quarter ended December 2025, across services. _[high; Q2 FY2026]_ — Microsoft (2026-01-28) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q2/press-release-webcast
- **F0274** Microsoft reported commercial remaining performance obligations of $678 billion in its fiscal fourth quarter ended June 2026; this is a broad contract backlog, not AI revenue. _[high; Q4 FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0275** Microsoft Cloud revenue was $59.3 billion in its fiscal fourth quarter ended June 2026; this includes non-AI products. _[high; Q4 FY2026]_ — Microsoft (2026-07-29) https://www.microsoft.com/en-us/Investor/earnings/FY-2026-Q4/press-release-webcast
- **F0856** The NBER study examined a staggered introduction of an AI assistant among 5,179 customer-support agents. _[high; 2023 working paper]_ — National Bureau of Economic Research (2023-04-01) https://www.nber.org/papers/w31161
- **F0857** In one customer-support setting, AI access was associated with 14% higher issues resolved per hour on average; this is not a company-wide financial return. _[high; 2023 working paper]_ — National Bureau of Economic Research (2023-04-01) https://www.nber.org/papers/w31161
- **F0858** The same study found a 34% improvement among novice and low-skilled agents and minimal impact on highly skilled and experienced agents. _[high; 2023 working paper]_ — National Bureau of Economic Research (2023-04-01) https://www.nber.org/papers/w31161
- **F0859** Microsoft reported 50 million GitHub Copilot users in its FY2026 annual report; users do not establish paid seats or return on investment. _[high; FY2026]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0860** Microsoft Cloud gross margin decreased to 66% in FY2026, with AI infrastructure investment and usage among the cited drivers. _[high; FY2026]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0861** Microsoft management expressed confidence in long-term returns from its investments; this is a management assessment, not a measured AI return. _[high; FY2026]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0862** Microsoft reported Azure revenue grew 48% year on year in FY2027 Q1; Azure includes non-AI workloads. _[high; FY2027 Q1]_ — Microsoft (2026-10-28) https://www.microsoft.com/en-us/Investor/earnings/FY-2027-Q1/press-release-webcast
- **F0863** Microsoft reported $63.9 billion in Microsoft Cloud revenue for FY2027 Q1; cloud revenue includes more than AI. _[high; FY2027 Q1]_ — Microsoft (2026-10-28) https://www.microsoft.com/en-us/Investor/earnings/FY-2027-Q1/press-release-webcast
- **F0864** In the team model, the spending-pause and share-loss bear scenario assumes FY28 revenue of $464.44 billion; this is a scenario, not a forecast. _[medium; FY28]_ — our data: data/clean/model_path_bear.json
- **F0865** In the same modelled bear scenario, FY29 revenue falls to $441.22 billion; this is an assumption-driven scenario, not a forecast. _[medium; FY29]_ — our data: data/clean/model_path_bear.json
- **F0866** In the same modelled bear scenario, FY30 revenue recovers to $485.34 billion; the path is an assumption, not a forecast. _[medium; FY30]_ — our data: data/clean/model_path_bear.json
- **F0867** The team model values the bear scenario at $101.20 per share using its stated assumptions; this is not an observed price or prediction. _[medium; as of 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0868** The team model uses a 10.55% US semiconductor-industry WACC as an input; it is not a guaranteed investor return. _[medium; as of 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0869** The team bear scenario starts from FY27 consensus revenue of $422.22 billion; it is an input estimate, not reported actual revenue. _[medium; FY27]_ — our data: data/clean/model_path_bear.json
- **F1098** Microsoft reported a FY2024 Microsoft Cloud gross margin of 71%. The annual report discusses a change to the estimated useful life of server and network equipment. _[high; Microsoft FY2024]_ — Microsoft (2024-07-30) https://www.microsoft.com/investor/reports/ar24/index.html
- **F1099** Microsoft reported a FY2025 Microsoft Cloud gross margin of 69%, citing AI infrastructure expansion partly offset by Azure efficiency gains. _[high; Microsoft FY2025]_ — Microsoft (2025-07-30) https://www.microsoft.com/investor/reports/ar25/index.html
- **F1103** Microsoft reported $677 billion in commercial remaining performance obligations in Q1 FY2027, up 73% from a year earlier. The total covers broad commercial contracts. _[high; Q1 FY2027]_ — Microsoft (2026-10-28) https://www.microsoft.com/en-us/Investor/earnings/FY-2027-Q1/press-release-webcast

## analysts (23)
- **F0291** Stock Analysis reported an NVIDIA average analyst price target of $244.71 in its November 24, 2026 snapshot; this is a consensus estimate, not a guaranteed future price. _[medium; analyst consensus]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/statistics/
- **F0295** The team’s unverified Google Finance capture records an analyst high target of $350 as of November 24, 2026; independently verify before use. _[low; value]_ — our data: data/clean/research_market.json
- **F0296** The team’s unverified Google Finance capture records an analyst low target of $130 as of November 24, 2026; independently verify before use. _[low; value]_ — our data: data/clean/research_market.json
- **F0297** The team’s unverified Google Finance capture records 34 buy ratings as of November 24, 2026; analyst coverage varies by provider. _[low; Buy]_ — our data: data/clean/nvda_analyst_ratings.json
- **F0298** The team’s unverified Google Finance capture records 9 hold ratings as of November 24, 2026; analyst coverage varies by provider. _[low; Hold]_ — our data: data/clean/nvda_analyst_ratings.json
- **F0299** The team’s unverified Google Finance capture records 1 sell rating as of November 24, 2026; analyst coverage varies by provider. _[low; Sell]_ — our data: data/clean/nvda_analyst_ratings.json
- **F0300** Yahoo Finance consensus revenue average for FY27 is $423.66bn, in its November 25 snapshot. _[medium; FY27]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0301** Yahoo Finance consensus revenue average for FY28 is $726.02bn, in its November 25 snapshot. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0302** Yahoo Finance revenue estimate low for FY27 is $412.45bn. _[medium; FY27]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0303** Yahoo Finance revenue estimate high for FY27 is $431.68bn. _[medium; FY27]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0304** Yahoo Finance revenue estimate low for FY28 is $546bn. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0305** Yahoo Finance revenue estimate high for FY28 is $778.47bn. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0306** Yahoo Finance lists mean estimated FY27 EPS as $9.67; the saved table does not clearly identify the selected GAAP or normalized basis. _[medium; FY27]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0307** Yahoo Finance lists mean estimated FY28 EPS as $16.61; the saved table does not clearly identify the selected GAAP or normalized basis. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0308** Yahoo Finance lists FY28 EPS estimate low as $12.27; accounting basis is unclear in the snapshot. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0309** Yahoo Finance lists FY28 EPS estimate high as $18.78; accounting basis is unclear in the snapshot. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0310** Yahoo Finance reports StoneX upgraded NVIDIA from Hold to Buy on November 24, 2026; the snapshot gives no rationale. _[medium; 2026-11-24]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analyst-insights/
- **F0311** Yahoo Finance reports Bernstein upgraded NVIDIA from Market Perform to Outperform on November 23, 2026; the snapshot gives no rationale. _[medium; 2026-11-23]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analyst-insights/
- **F0312** The team’s Bloomberg FA dataset records FY27 consensus revenue of $422.222bn as of November 20, 2026; Yahoo’s later snapshot reports $423.66bn and may reflect a different panel or date. _[medium; FY27]_ — our data: data/clean/nvda_revenue_forecast.json
- **F0313** The team’s Bloomberg FA dataset records FY28 consensus revenue of $728.636bn as of November 20, 2026; Yahoo’s later snapshot reports $726.02bn and may reflect a different panel or date. _[medium; FY28]_ — our data: data/clean/nvda_revenue_forecast.json
- **F0357** For the latest Yahoo FY27 consensus revenue snapshot use $423.66bn on November 25; Bloomberg had $422.222bn on November 20. The later snapshot is preferred when citing Yahoo; provider panels may differ. _[medium; FY27]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0358** For the latest Yahoo FY28 consensus revenue snapshot use $726.02bn on November 25; Bloomberg had $728.636bn on November 20. The later snapshot is preferred when citing Yahoo; provider panels may differ. _[medium; FY28]_ — Yahoo Finance (2026-11-25) https://finance.yahoo.com/quote/NVDA/analysis/
- **F0993** The team model records an unverified Google Finance capture of a $233.36 average analyst target. _[low; 12-month target]_ — our data: data/clean/model_vs_analysts.json

## bear-case (14)
- **F0251** David Cahn estimated an AI ecosystem revenue requirement of $600 billion in June 2024; this is a model-derived estimate, not observed revenue. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0252** Cahn estimated a $500 billion revenue gap in 2024 based on assumed AI revenues; it is not an audited shortfall. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0253** Cahn warned that accumulating GPU stockpiles could eventually lead to a demand reset; this was his forecast. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0254** Cahn argued that AI data-centre computing has limited pricing power as GPU compute becomes more commoditised. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0255** Cahn argued that advancing chip generations accelerate economic depreciation of older GPUs. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0256** Cahn cautioned that speculation in technology infrastructure can destroy investor capital even if the technology succeeds. _[medium; 2024-06-20]_ — Sequoia Capital (2024-06-20) https://www.sequoiacap.com/article/ais-600b-question/
- **F0257** Cahn explicitly described his 2023 AI revenue estimates as assumptions, not measured revenue. _[medium; 2023-09-20]_ — Sequoia Capital (2023-09-20) https://www.sequoiacap.com/article/follow-the-gpus-perspective/
- **F0258** NVIDIA disclosed that its private investments include AI model makers that buy its products directly or via cloud providers. _[high; FY2026]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0259** NVIDIA said it invested $17.5 billion in private companies and infrastructure funds during fiscal 2026. _[high; FY2026]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0260** NVIDIA disclosed $11.4 billion of contingent investment commitments as of 25 January 2026. _[high; 2026-01-25]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0261** NVIDIA says early-stage investees may never become profitable and investment returns are not assured. _[high; FY2026]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0262** NVIDIA warns customers generally can cancel, change or delay purchase commitments with little notice or penalty. _[high; FY2026]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0263** NVIDIA guided Q4 FY2027 gross margin to 71%–72%, below its reported Q3 FY2027 margin. _[high; Q4 FY2027 outlook]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0264** NVIDIA reported Q3 FY2027 GAAP gross margin of 74.8%. _[high; Q3 FY2027]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027

## china-export (44)
- **F0203** In April 2025 NVIDIA was informed that H20 exports into China required a US licence. _[high; 2025-04-09]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0204** NVIDIA recorded a $4.5 billion H20 excess inventory and purchase obligation charge in Q1 FY26. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0205** H20 sales before the licensing requirements were $4.6 billion in Q1 FY26. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0206** NVIDIA said it could not ship an additional $2.5 billion of H20 revenue in Q1 FY26. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0207** In May 2025 NVIDIA forecast approximately $8 billion of lost H20 revenue in its Q2 FY26 outlook; this was guidance, not a reported outcome. _[high; Q2 FY26 outlook]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0208** NVIDIA reported no H20 sales to China-based customers in Q2 FY26. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0209** NVIDIA released $180 million of prior H20 reserves in Q2 FY26 after unrestricted sales outside China. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0210** NVIDIA reported approximately $650 million in unrestricted H20 sales to an outside-China customer in Q2 FY26. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0211** A transcript hosted by Google Finance attributes $2.4 billion of Q3 FY27 licensed Hopper data centre sales to China to NVIDIA management. _[medium; Q3 FY27]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0212** In the Q3 FY27 transcript NVIDIA management said it was no longer shipping licensed Hopper data centre products to China. _[medium; Q4 FY27 outlook]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0213** NVIDIA established a board committee to oversee national security, export-control compliance and global trade risk. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0214** NVIDIA says its export-control oversight committee will meet at least quarterly. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0215** The local research notes report China at 9.1% of FY26 revenue by customer headquarters; the dataset is explicitly unverified, so this is provisional. _[low; FY26]_ — our data: data/clean/research_policy.json
- **F0597** NVIDIA says US H200 licences for small shipments to specific China customers began in February 2026, but PRC restrictions limited sales. _[high; 2026-02 onward]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0598** NVIDIA recorded a $0.4 billion H200 excess-inventory and purchase-obligation charge in the first half of FY27. _[high; H1 FY2027]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0599** NVIDIA said licensed H200 shipments to China represented less than 1% of Data Center revenue in its most recent reported quarter. _[high; Q2 FY2027]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0600** NVIDIA says H200 licences require inspection in the United States before customer shipment. _[high; Q2 FY2027 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0601** NVIDIA says H200 shipments under the programme face a 25% tariff on US importation. _[high; Q2 FY2027 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0602** As of Q2 FY27 NVIDIA said it could ship uncontrolled gaming and workstation GPUs to China but was effectively foreclosed from its data-centre compute market. _[high; Q2 FY2027]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0603** NVIDIA says its geographic revenue is classified by direct customers’ headquarters, which may differ from shipping and end-customer location. _[high; Q2 FY2027 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0604** NVIDIA says October 2023 US licensing requirements covered threshold-exceeding products including A100, H100 and B200, among others. _[high; 2023-10 announcement]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0605** UK strategic export controls include dual-use goods, software and technology usable for civilian and military applications. _[high; 2026-04-23 guidance]_ — UK Department for Business and Trade (2026-11-25) https://www.gov.uk/guidance/uk-strategic-export-control-lists-the-consolidated-list-of-strategic-military-and-dual-use-items
- **F0606** UK government can require a licence for an unlisted item through catch-all or end-use controls. _[high; 2026-04-23 guidance]_ — UK Department for Business and Trade (2026-11-25) https://www.gov.uk/guidance/uk-strategic-export-control-lists-the-consolidated-list-of-strategic-military-and-dual-use-items
- **F0607** UK military end-use controls may apply where an item risks military use in a destination subject to an arms embargo. _[high; 2026-04-23 guidance]_ — UK Department for Business and Trade (2026-11-25) https://www.gov.uk/guidance/uk-strategic-export-control-lists-the-consolidated-list-of-strategic-military-and-dual-use-items
- **F0608** The UK says its China arms embargo covers certain military items and has been observed since 1989. _[high; since 1989]_ — UK Department for Business and Trade (2026-11-25) https://www.gov.uk/guidance/arms-embargo-on-china
- **F0609** UK licensing applications for mainland China, Macao and Hong Kong are assessed case by case against strategic export licensing criteria. _[high; guidance accessed 2026-11-25]_ — UK Department for Business and Trade (2026-11-25) https://www.gov.uk/guidance/arms-embargo-on-china
- **F0610** As of its FY26 filing NVIDIA said the US had not codified officials’ expected 15% or greater revenue share on licensed product sales. _[high; FY2026 filing]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0611** NVIDIA said the US announced plans in May 2025 to rescind its AI Diffusion interim final rule and implement a replacement. _[high; 2025-05 announcement]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0775** NVIDIA said the April 2025 H20 licensing requirement also covered chips meeting its memory bandwidth, interconnect bandwidth or combination, and certain D:5-linked companies. _[high; 2025-04]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0776** NVIDIA said China restricted sales under H20 licences granted from August 2025, leaving it unable to sell its H20 inventory. _[high; 2025-08 onward, reported Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0777** NVIDIA said it could not pass the US H200 import tariff on to customers and did not expect to do so for licensed China sales. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0778** NVIDIA said China controls use processing performance, performance density, interconnect bandwidth and memory bandwidth criteria. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0779** NVIDIA said its inability to compete in China data-centre computing helped competitors build developer and customer ecosystems worldwide. _[high; Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0780** NVIDIA said the January 2025 AI Diffusion interim rule would have imposed worldwide licensing for H200, GB200 and GB300; this describes its proposed effect. _[high; 2025-01 interim rule, Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0781** NVIDIA said the scope, timing and requirements of the proposed AI Diffusion replacement remained uncertain as of its Q2 FY27 filing. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0782** NVIDIA said Congress was considering the Remote Access Security Act, which could prohibit cloud services to companies whose ultimate parent is headquartered in China; enactment was not established. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0783** NVIDIA said the Chinese government encouraged customers to buy from China-based competitors and discouraged purchases or use of NVIDIA data-centre products. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0784** NVIDIA warned export controls could also reduce demand for networking products used in servers containing its GPUs. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0785** In its Q4 FY27 outlook NVIDIA assumed no China data-centre compute revenue; this is a forecast assumption, not actual sales. _[high; Q4 FY27 outlook]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0786** Management said it had stopped shipping licensed Hopper data-centre products to China and excluded them from guidance. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F1012** NVIDIA reported USD 12,330 million of FY2024 revenue booked to direct customers headquartered in China including Hong Kong, using the FY26 10-K’s recast geographic basis. _[high; FY2024 ended 2024-01-28]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F1013** NVIDIA reported USD 25,048 million of FY2025 revenue booked to direct customers headquartered in China including Hong Kong, using the FY26 10-K’s recast geographic basis. _[high; FY2025 ended 2025-01-26]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F1014** NVIDIA reported USD 19,677 million of FY2026 revenue booked to direct customers headquartered in China including Hong Kong, using the FY26 10-K’s recast geographic basis. _[high; FY2026 ended 2026-01-25]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F1015** NVIDIA’s Q2 FY27 filing dates an early US export-restrictions and licensing milestone targeting China’s semiconductor and supercomputing industries to August 2022. _[high; 2022-08]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm

## competition (55)
- **F0150** AWS describes Trainium as a purpose-built chip for AI training and inference at scale. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ai/machine-learning/trainium/
- **F0151** AWS lists 144 GB of HBM3e memory per Trainium3 chip. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ai/machine-learning/trainium/
- **F0152** AWS says Trainium3 memory bandwidth is 4.9 TB/s per chip. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ai/machine-learning/trainium/
- **F0153** AWS claims up to twice the MXFP8 compute throughput for Trainium3 compared with Trainium2. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ai/machine-learning/trainium/
- **F0154** AWS names Anthropic, Databricks and OpenAI among customers using Trainium instances and UltraServers. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ai/machine-learning/trainium/
- **F0155** Google says its Ironwood TPU supports large-scale training, reasoning and inference. _[medium; 2026-11-25]_ — Google Cloud (2026-11-25) https://cloud.google.com/tpu
- **F0156** Google claims its Trillium TPU offers 67% more energy efficiency than TPU v5e, under its own comparison. _[medium; 2026-11-25]_ — Google Cloud (2026-11-25) https://cloud.google.com/tpu
- **F0157** Meta designed first-generation MTIA for internal workloads, according to its 2023 account. _[medium; 2026-11-25]_ — Meta (2026-11-25) https://ai.meta.com/blog/meta-training-inference-accelerator-AI-MTIA/
- **F0158** Meta says it designed recommendation-specific MTIA ASICs for its workloads. _[medium; 2026-11-25]_ — Meta (2026-11-25) https://ai.meta.com/blog/meta-training-inference-accelerator-AI-MTIA/
- **F0159** In its 2023 account, Meta said it had not yet optimized MTIA v1 for high-complexity recommendation models. _[medium; 2026-11-25]_ — Meta (2026-11-25) https://ai.meta.com/blog/meta-training-inference-accelerator-AI-MTIA/
- **F0160** Meta reports MTIA v1 has a 25 W chip thermal design power; this is not total data-centre energy use. _[medium; 2026-11-25]_ — Meta (2026-11-25) https://ai.meta.com/blog/meta-training-inference-accelerator-AI-MTIA/
- **F0161** Intel describes Gaudi 3 PCIe as an accelerator for workloads including large language models using standard Ethernet for scaling. _[medium; 2026-11-25]_ — Intel (2026-11-25) https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html
- **F0162** Broadcom says its custom ASICs integrate high-speed memory and SerDes IP. _[medium; 2026-11-25]_ — Broadcom (2026-11-25) https://www.broadcom.com/products/custom-silicon
- **F0163** AMD compared the memory capacity of its MI350X and MI355X platform with NVIDIA B200 in its own May 2025 calculations. _[medium; 2026-11-25]_ — AMD (2026-11-25) https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html
- **F0844** MLPerf Training v6.1 added a recommendation benchmark and a large-scale LLM post-training benchmark. _[medium; 2026-11-25]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/
- **F0845** MLPerf Training v6.1 received 153 systems and 250 test results. _[medium; MLPerf Training v6.1]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/
- **F0846** MLPerf Training v6.1 included systems with NVIDIA, AMD and Google accelerator hardware, including TPUv7 Ironwood. _[medium; 2026-11-25]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/
- **F0847** MLPerf Training v6.1 had 57 cloud-based systems, 37% of submitted systems. _[medium; MLPerf Training v6.1]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/
- **F0848** The first MLPerf end-to-end RAG benchmark uses an offline scenario; a server scenario is reserved for future rounds. _[medium; 2026-11-25]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/08/endtoend-inference/
- **F0849** The MLPerf end-to-end RAG submission must achieve at least 97% of reference answer accuracy. _[medium; undated vendor page]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/08/endtoend-inference/
- **F0850** AMD states HIPIFY cannot automatically translate all CUDA code. _[medium; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIPIFY/en/latest/index.html
- **F0851** AMD says CUDA or third-party libraries without HIP equivalents cannot be translated by HIPIFY. _[medium; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIPIFY/en/latest/index.html
- **F0852** AMD notes NVIDIA-optimized code may need further rework to optimize for AMD GPUs. _[medium; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIPIFY/en/latest/index.html
- **F0853** AWS claims Trn1 can save up to 50% in training cost versus other comparable EC2 instances; the cited page does not define the workload or GPU comparator for this claim. _[medium; undated vendor page]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ec2/instance-types/trn1/
- **F0854** Stockmark reports a 20% training cost reduction for its Trainium workload versus equivalent GPU instances in an AWS-hosted testimonial; comparator details are not specified. _[medium; undated vendor page]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ec2/instance-types/trn1/
- **F0855** AWS says Neuron integrates with PyTorch and TensorFlow for training on Trn1. _[medium; 2026-11-25]_ — Amazon Web Services (2026-11-25) https://aws.amazon.com/ec2/instance-types/trn1/
- **F0892** Microsoft described Maia 100 as its first in-house AI accelerator, designed for cloud AI and optimized for Azure AI infrastructure. _[high; 2024-04-03]_ — Microsoft (2026-11-25) https://azure.microsoft.com/en-us/blog/azure-maia-for-the-era-of-ai-from-silicon-to-software-to-systems/
- **F0893** Microsoft says Maia 100 was designed for cloud AI using experience from workloads such as Copilot; this does not establish deployment scale. _[high; 2024-04-03]_ — Microsoft (2026-11-25) https://azure.microsoft.com/en-us/blog/azure-maia-for-the-era-of-ai-from-silicon-to-software-to-systems/
- **F0894** Microsoft says its Maia 100 software integrates with PyTorch and ONNX Runtime. _[high; 2024-04-03]_ — Microsoft (2026-11-25) https://azure.microsoft.com/en-us/blog/azure-maia-for-the-era-of-ai-from-silicon-to-software-to-systems/
- **F0895** Microsoft says Maia 100 uses closed-loop rack-level liquid cooling for accelerators and host CPUs; no measured energy saving is given. _[high; 2024-04-03]_ — Microsoft (2026-11-25) https://azure.microsoft.com/en-us/blog/azure-maia-for-the-era-of-ai-from-silicon-to-software-to-systems/
- **F0896** Broadcom Q1 FY2026 AI revenue was $8.4 billion, including AI networking and custom accelerators, not ASIC revenue alone. _[high; Q1 FY2026]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-first-quarter-fiscal-year-2026-financial
- **F0897** Marvell data-center end-market revenue was $1,490.5 million in Q2 FY2026; this includes more than custom AI chips. _[high; Q2 FY2026]_ — Marvell (2026-08-27) https://investor.marvell.com/news-events/press-releases/detail/1031/marvell-technology-inc-reports-second-quarter-of-fiscal-year-2027-financial-results
- **F0898** Marvell data-center end-market revenue was $1,832.7 million in Q1 FY2027; this includes more than custom AI chips. _[high; Q1 FY2027]_ — Marvell (2026-08-27) https://investor.marvell.com/news-events/press-releases/detail/1031/marvell-technology-inc-reports-second-quarter-of-fiscal-year-2027-financial-results
- **F0899** Marvell data-center end-market revenue was $2,171.5 million in Q2 FY2027; this includes more than custom AI chips. _[high; Q2 FY2027]_ — Marvell (2026-08-27) https://investor.marvell.com/news-events/press-releases/detail/1031/marvell-technology-inc-reports-second-quarter-of-fiscal-year-2027-financial-results
- **F0900** Marvell said in August 2026 that it expected custom business acceleration beginning in the second half of FY2027; this was a forecast. _[high; 2026-08-27]_ — Marvell (2026-08-27) https://investor.marvell.com/news-events/press-releases/detail/1031/marvell-technology-inc-reports-second-quarter-of-fiscal-year-2027-financial-results
- **F0901** Marvell says customer-developed compute can remain central to its custom accelerator, with Marvell supplying selected supporting components and expertise. _[high; accessed 2026-11-25]_ — Marvell (2026-11-25) https://www.marvell.com/products/custom-ai-accelerators.html
- **F0902** Marvell says it supports design-to-spec, co-development, or combinations for custom accelerator programs. _[high; accessed 2026-11-25]_ — Marvell (2026-11-25) https://www.marvell.com/products/custom-ai-accelerators.html
- **F0903** Marvell reported preliminary Q3 FY2027 revenue within a narrower plus-or-minus 2% range around its prior guidance midpoint; results remained preliminary. _[high; Q3 FY2027 preliminary]_ — Marvell (2026-11-02) https://investor.marvell.com/news-events/press-releases/detail/1040/marvell-and-lumentum-to-combine-creating-a-category-leader-in-ai-connectivity
- **F0904** AMD said Anthropic, Meta, Microsoft, OpenAI and Oracle Cloud Infrastructure were running workloads on its first Helios rack-scale solutions powered by MI450 Series GPUs and 6th Gen EPYC CPUs. _[high; As reported 2026-11-03]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0905** AMD's MI350 series product page specifies 288 GB HBM3E memory and 8 TB/s bandwidth; these are vendor specifications, not workload benchmark results. _[high; MI350 series specification; page accessed 2026-11-25]_ — AMD (2026-11-25) https://www.amd.com/en/products/accelerators/instinct/mi350.html
- **F0906** AMD reported Q3 2026 Data Center segment revenue of .546 billion, up 97% year over year; this segment includes CPUs, AI accelerators and other products, not Instinct GPU revenue alone. _[high; Q3 2026 ended 2026-09-26]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0907** AMD said Anthropic, Meta, Microsoft, OpenAI and Oracle Cloud Infrastructure were running workloads on its first Helios solutions powered by MI450 GPUs and 6th Gen EPYC CPUs. _[high; As reported 2026-11-03]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0908** AMD's MI350 series product page specifies 288 GB HBM3E memory and 8 TB/s bandwidth; these are manufacturer specifications rather than a matched workload benchmark. _[high; MI350 series specification; accessed 2026-11-25]_ — AMD (2026-11-25) https://www.amd.com/en/products/accelerators/instinct/mi350.html
- **F0909** AMD advertises up to 2.2x AI performance versus unspecified competitive accelerators for MI355X; the page snippet does not define the matched workload or comparator. _[medium; MI355X product page accessed 2026-11-25]_ — AMD (2026-11-25) https://www.amd.com/en/products/accelerators/instinct/mi350.html
- **F0910** Intel claims Gaudi 3 has 33% more I/O connectivity than H100; its cited comparison is interconnect bandwidth, not matched workload throughput. _[medium; Gaudi 3 page accessed 2026-11-25]_ — Intel (2026-11-25) https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html
- **F0911** MLPerf Closed submissions require the same model as the reference implementation for apples-to-apples comparisons, while Open results allow using a different model or retraining. _[high; ]_ — MLCommons (2025-04-09) https://mlcommons.org/benchmarks/inference-datacenter/
- **F0912** MLPerf defines Available results as using components available for purchase or cloud rental, distinguishing them from Preview and RDI categories. _[high; ]_ — MLCommons (2025-04-09) https://mlcommons.org/benchmarks/inference-datacenter/
- **F0913** AMD reported USD 8.546 billion in Q3 2026 Data Center segment revenue, up 97% year over year; the segment includes CPU and accelerator products so this is not standalone MI-series revenue. _[high; Q3 2026 ended 2026-09-26]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0914** MLPerf's power measurements represent average AC power at the wall for the entire system during the benchmark and apply only to that accompanying benchmark. _[high; ]_ — MLCommons (2025-04-09) https://mlcommons.org/benchmarks/inference-datacenter/
- **F0925** Use USD 8,546 million for AMD Q3 2026 Data Center revenue, per AMD’s results table; F0906 truncates the narrative figure. The total covers the segment, not GPUs alone. _[high; Q3 2026 ended 2026-09-26]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F1010** AMD’s Q3 2026 release reports USD 4,341 million of prior-year Q3 2025 Data Center segment revenue in its comparative results table. _[high; Q3 2025 ended 2025-09-27]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F1048** SoftBank announced joint validation with AMD on 16 February 2026. _[high; February 2026]_ — SoftBank Corp. (2026-02-16) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260216_01/
- **F1050** Marvell says it can supply chiplets, IP, packaging, implementation and production expertise around customer-developed compute. _[high; Accessed November 2026]_ — Marvell (2026-11-25) https://www.marvell.com/products/custom-ai-accelerators.html
- **F1082** MLCommons reports that cloud-based systems made up 29% of submitted systems in MLPerf Training v6.0. _[high; MLPerf Training v6.0]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/
- **F1083** MLCommons reports that cloud-based systems made up 37% of submitted systems in MLPerf Training v6.1. _[high; MLPerf Training v6.1]_ — MLCommons (2026-11-25) https://mlcommons.org/2026/11/mlperf-training-v6-1-results/

## customers (70)
- **F0048** The project dataset sums NVIDIA’s three disclosed direct customer shares to 36% of revenue in Q3 FY27; direct customers may include intermediaries. _[medium; Q3 FY27]_ — our data: data/clean/nvda_customer_concentration.json
- **F0079** In Q3 FY27, hyperscalers accounted for 51.9% of total NVIDIA revenue in Bloomberg’s preliminary end-user breakdown. _[medium; Q3 FY27]_ — our data: data/clean/nvda_dc_customer_mix.json
- **F0080** In Q3 FY27, AI clouds, industrial and enterprise together accounted for 41% of total revenue in Bloomberg’s preliminary breakdown. _[medium; Q3 FY27]_ — our data: data/clean/nvda_dc_customer_mix.json
- **F0081** In Q3 FY27, the beyond-hyperscalers category represented 48.1% of total revenue in Bloomberg’s preliminary breakdown; it overlaps the AI cloud, industrial and enterprise category. _[medium; Q3 FY27]_ — our data: data/clean/nvda_dc_customer_mix.json
- **F0082** Bloomberg’s preliminary Q3 FY27 hyperscaler revenue grew 71% year over year. _[medium; Q3 FY27]_ — our data: data/clean/nvda_dc_customer_mix.json
- **F0083** Bloomberg’s preliminary Q3 FY27 AI cloud, industrial and enterprise revenue grew 195% year over year. _[medium; Q3 FY27]_ — our data: data/clean/nvda_dc_customer_mix.json
- **F0084** The largest direct customer accounted for 14% of NVIDIA revenue in Q3 FY27; the direct customer could be an intermediary. _[medium; Q3 FY27]_ — our data: data/clean/nvda_customer_concentration.json
- **F0085** The second largest direct customer accounted for 11% of NVIDIA revenue in Q3 FY27; the direct customer could be an intermediary. _[medium; Q3 FY27]_ — our data: data/clean/nvda_customer_concentration.json
- **F0086** The third largest direct customer accounted for 11% of NVIDIA revenue in Q3 FY27; the direct customer could be an intermediary. _[medium; Q3 FY27]_ — our data: data/clean/nvda_customer_concentration.json
- **F0087** Bloomberg’s end-user dataset reports hyperscaler revenue of $42.213 billion in Q4 FY26. _[medium; FY26 Q4]_ — our data: data/clean/nvda_dc_customers.json
- **F0088** Bloomberg’s preliminary end-user dataset reports hyperscaler revenue of $60.136 billion in Q3 FY27. _[medium; FY27 Q3]_ — our data: data/clean/nvda_dc_customers.json
- **F0089** Bloomberg’s end-user dataset reports AI cloud, industrial and enterprise revenue of $20.101 billion in Q4 FY26. _[medium; FY26 Q4]_ — our data: data/clean/nvda_dc_customers.json
- **F0090** Bloomberg’s preliminary end-user dataset reports AI cloud, industrial and enterprise revenue of $47.474 billion in Q3 FY27. _[medium; FY27 Q3]_ — our data: data/clean/nvda_dc_customers.json
- **F0612** As of July 26, 2026, NVIDIA reported $99 billion in ecosystem equity investments and $25 billion in equity investment commitments; these are not identified as customer-only amounts. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0613** NVIDIA reported $25 billion in ecosystem equity investment commitments as of July 26, 2026; this is not identified as a customer-only amount. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0614** Under NVIDIA’s AI cloud arrangements, partners buy its infrastructure and NVIDIA commits to cloud services that partners may redirect to third-party customers at more advantageous rates. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0615** As of July 26, 2026, AI-cloud service commitments totaled $36 billion, typically over six years, and fall as third parties or NVIDIA use the capacity. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0616** NVIDIA says it has agreed to buy committed AI-cloud capacity if the cloud partners cannot sell it to third-party customers. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0617** NVIDIA may share in revenue from AI clouds’ third-party customers if certain criteria are met. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0618** NVIDIA disclosed a $105 billion aggregate cap for conditional OpenAI lease guarantees, not an upfront payment or realized loss. _[high; August 2026]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0619** NVIDIA says its OpenAI lease guarantee exposure falls as OpenAI pays its leases. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0620** NVIDIA says its OpenAI guarantees cover defined portions of lease and power payments, not all tenant obligations. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0621** NVIDIA disclosed that guarantees for selected AI cloud partners had maximum gross exposure of $3.5 billion. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0622** NVIDIA held $3.3 billion of equity-method investments in infrastructure financiers as of July 26, 2026. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0623** Certain infrastructure-financier variable interest investments had $4.7 billion maximum loss exposure, including carrying values and commitments, as of July 26, 2026. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0624** NVIDIA says it has offered certain investment-grade buyers payment terms from 90 days to one year for large data-center builds. _[high; Q2 FY2027]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0625** NVIDIA says product revenue is recognized when control transfers, reflecting the consideration it expects to receive. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0626** NVIDIA says multiple agreements with one customer are treated as a single contract if their terms or substance make them effectively parts of one contract. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0627** NVIDIA warns that guarantees could lead to substantial payments and that reimbursement from OpenAI may not be timely or complete. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0706** In Q2 FY27 one direct customer represented 16% of total revenue, primarily from Compute & Networking. _[high; Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0707** In the first half of FY27 three direct customers represented 16%, 15% and 13% of total revenue, primarily from Compute & Networking. _[high; H1 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0708** In Q2 FY26 two direct customers represented 23% and 16% of total revenue. _[high; Q2 FY26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0709** In FY26 two direct customers represented 22% and 14% of total revenue. _[high; FY26]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0710** In FY24 one direct customer represented 13% of total revenue. _[high; FY24]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0711** NVIDIA estimates indirect customer revenue from purchase orders, specifications, internal sales data and other sources. _[high; Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0712** NVIDIA reports that some indirect customers individually represent at least 10% of revenue. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0713** NVIDIA says indirect customers primarily buy through system integrators and distributors. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0714** NVIDIA estimates one unnamed AI research and deployment company contributed a meaningful amount of revenue by purchasing cloud services from its customers. _[high; Q2 and H1 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0715** NVIDIA warns most sales are on purchase orders that customers can generally cancel, change or delay with little notice and without penalty. _[high; FY26 filing]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0716** NVIDIA says sovereign demand is among drivers of ACIE revenue growth, but the statement does not quantify sovereign demand separately. _[high; Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0717** NVIDIA assigns geographic revenue to the headquarters of direct customers, which may differ from end-customer and shipping locations. _[high; Q2 FY27 filing]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0718** NVIDIA estimated 76% of FY26 Data Center revenue from Taiwan-headquartered customers was attributable to US and European end customers. _[high; FY26]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0719** Five direct customers accounted for 22%, 14%, 13%, 11% and 10% of receivables at July 26, 2026; these are receivable balances, not revenue shares. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0720** One of five disclosed direct customers represented 14% of accounts receivable at July 26, 2026; this is not a revenue share. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0721** One of five disclosed direct customers represented 13% of accounts receivable at July 26, 2026; this is not a revenue share. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0722** One of five disclosed direct customers represented 11% of accounts receivable at July 26, 2026; this is not a revenue share. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0723** One of five disclosed direct customers represented 10% of accounts receivable at July 26, 2026; this is not a revenue share. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0724** Microsoft says it will continue capital expenditure to support cloud growth, AI training and other infrastructure; this is not an NVIDIA order forecast. _[high; FY2026 annual report outlook]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0725** Microsoft says its property and equipment additions will continue to include facilities, datacenters and computer systems for several corporate functions. _[high; FY2026 annual report outlook]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0726** Microsoft says cloud and AI infrastructure and device investments will continue to increase operating costs and may reduce margins. _[high; FY2026 annual report outlook]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0727** Microsoft had $34.6 billion of construction commitments at June 30, 2026, primarily for datacenters; these are not NVIDIA orders or annual capex guidance. _[high; as of 2026-06-30]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0728** Microsoft disclosed $329.1 billion of leases not yet commenced at June 30, 2026, primarily datacenters and sometimes conditional; these are not annual capex or GPU orders. _[high; as of 2026-06-30]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0729** Microsoft says datacenter availability depends on land, energy, network supplies and servers including GPUs and other components. _[high; FY2026 annual report]_ — Microsoft (2026-11-25) https://www.microsoft.com/investor/reports/ar26/index.html
- **F0787** NVIDIA says customer rebates and marketing development funds are recorded as reductions to revenue based on expected claims. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0788** NVIDIA estimates an allowance for products sold with return rights at the time it recognizes revenue. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0789** NVIDIA reports support and extended-warranty revenue over the service period or as services are performed. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0790** NVIDIA allocates a multi-obligation transaction price using relative standalone selling prices. _[high; ]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0791** NVIDIA says extended payment terms on large multi-quarter agreements increased accounts receivable, partly offsetting operating cash flow growth in the first half of FY27. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0792** NVIDIA expects extended payment terms in large multi-quarter financing arrangements to continue affecting operating cash flow timing. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0793** NVIDIA committed to equity investments in AI model makers, infrastructure financiers and other private companies, subject to contingencies. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0794** NVIDIA says it is not the primary beneficiary of its variable interest entity investments and does not consolidate them. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0795** NVIDIA says the OpenAI-backed site will exclusively host NVIDIA AI infrastructure, subject to limited exceptions, in exchange for its guarantees. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0796** NVIDIA says the OpenAI-related guarantees terminate upon certain events including a satisfactory OpenAI credit rating or completion of the relevant lease term. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0797** NVIDIA says certain supplier agreements can be canceled, rescheduled or adjusted before firm orders, subject to possible additional costs. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0798** NVIDIA expects to reassign third-party data-center leases; the expected commencement depends on construction timing. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0799** NVIDIA says cloud-service commitments support its own research and development of open models and autonomous vehicle software. _[high; ]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F1070** The second-highest disclosed direct customer represented 15% of NVIDIA total revenue in H1 FY27. _[high; H1 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F1071** The third-highest disclosed direct customer represented 13% of NVIDIA total revenue in H1 FY27. _[high; H1 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F1072** AI cloud partners placed $712 million in escrow to partially mitigate NVIDIA’s potential exposure under land, power and shell guarantees. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F1080** NVIDIA reported that its largest disclosed direct customer represented 12% of total revenue in FY25. _[high; FY25]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm

## dcf (42)
- **F0051** The team model estimates a base-case value of $389.99 per share at its industry discount rate; this is a model output, not an observed price. _[medium; 2026-11-24]_ — our data: data/clean/model_three_rates.json
- **F0052** The team model estimates a base-case value of $226.87 per share at Bloomberg’s 15.4% WACC; this is a model output, not an observed price. _[medium; 2026-11-24]_ — our data: data/clean/model_three_rates.json
- **F0474** Morningstar maintained a $250 per-share fair value estimate for NVIDIA on 23 November 2026, with very high uncertainty. _[high; 2026-11-23]_ — Morningstar (2026-11-23) https://www.morningstar.com/stocks/nvidia-ceo-saga-probably-ends-with-jensen-huangs-reinstatement
- **F0475** Morningstar cut its fair-value estimate from $310 to $250 per share on 12 November 2026. _[high; 2026-11-12]_ — Morningstar (2026-11-12) https://www.morningstar.com/stocks/nvidia-we-cut-our-fair-value-estimate-given-firms-ceo-transition-turmoil
- **F0476** Morningstar said its 10-year DCF reduced long-term revenue forecasts and raised its discount rate, or cost of equity, following management disruption; it did not quantify the rate here. _[high; 2026-11-12]_ — Morningstar (2026-11-12) https://www.morningstar.com/stocks/nvidia-we-cut-our-fair-value-estimate-given-firms-ceo-transition-turmoil
- **F0477** Morningstar projected mid-70% gross margins for NVIDIA in FY27 in its 13 November report; this is not the team model free-cash-flow margin. _[high; FY27]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0478** Morningstar anticipated NVIDIA gross margin declining to the high-60% range about a decade after its November 2026 report. _[high; approximately 2036]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0479** Morningstar said its model did not fully incorporate NVIDIA’s optimistic AI-industry forecasts in its 13 November analysis. _[high; 2026-11-13]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0480** Morningstar estimated NVIDIA data-center revenue of $385 billion for FY27 in its 13 November report. _[high; FY27]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0481** Morningstar modeled NVIDIA data-center revenue of $672 billion in FY28 in its 13 November report. _[high; FY28]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0482** Morningstar identified the future pace of AI spending as its largest risk in its 13 November analysis. _[high; 2026-11-13]_ — Morningstar (2026-11-13) https://www.morningstar.com/stocks/what-watch-nvidia-earnings-spy-scandal-data-center-concerns-take-center-stage
- **F0870** For the current app dataset bear scenario, use the model output of $101.20 per share; the older MODEL.md reports $101.56 and describes stale spreadsheet inputs, so reconcile model versions and assumptions before comparing them. _[medium; as of 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0876** For the current model input use 15.4% as the team’s assumed discount rate; its Bloomberg attribution is disputed by the project reconciliation and must be checked against the original screen before presenting it as a Bloomberg figure. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0968** The base DCF holds the free-cash-flow margin at the average of FY24, FY25 and FY26. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0969** The team DCF assumes a perpetual growth rate of 3% after its explicit forecast. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0970** The model fades base revenue growth in a straight line after FY28, reaching the terminal growth rate in FY32. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0971** The base DCF divides equity value by 24.186 billion diluted shares. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_summary.json
- **F0972** The team DCF attributes 75.56% of base-case enterprise value to discounted terminal value. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_summary.json
- **F0973** The team DCF projects FY32 free cash flow of $874.22 billion in its base case. _[medium; 2026-11-24]_ — our data: data/clean/model_fcf_forecast.json
- **F0974** The present value of the base-case FY28 through FY32 free cash flows is $2.2907 trillion. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_summary.json
- **F0975** The base DCF estimates a discounted terminal value of $7.0821 trillion. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_summary.json
- **F0976** The model adds $59.6 billion of net cash to enterprise value. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0977** The team model includes a 14.45% discount-rate sensitivity, attributed to Google Finance in the model export. _[medium; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0978** At a 14.45% discount rate, the team DCF yields $247.81 per share with the base cash-flow assumptions. _[medium; 2026-11-24]_ — our data: data/clean/model_three_rates.json
- **F0979** At the 15.4% team sensitivity, the team DCF yields $226.87 per share with the base cash-flow assumptions. _[medium; 2026-11-24]_ — our data: data/clean/model_three_rates.json
- **F0980** With a 15.4% discount rate and 2% terminal growth, the team sensitivity grid gives $214.94 per share, its lowest tested value. _[medium; 2026-11-24]_ — our data: data/clean/model_sensitivity.json
- **F0981** With a 15.4% discount rate and 4% terminal growth, the team sensitivity grid gives $240.89 per share. _[medium; 2026-11-24]_ — our data: data/clean/model_sensitivity.json
- **F0982** The team DCF export uses $152.85 as its share-price reference dated 24 November 2026. It is an unverified team input. _[low; 2026-11-24]_ — our data: data/clean/model_dcf_inputs.json
- **F0983** The reverse DCF solves for constant revenue growth of 11.56% at the team price input and base discount rate. _[medium; FY28–FY32]_ — our data: data/clean/model_implied_growth.json
- **F0984** The team base case compounds sales at 35.55%, from FY27 consensus to FY32. _[medium; FY28–FY32]_ — our data: data/clean/model_implied_growth.json
- **F0985** The team DCF values its severe AI-demand stress scenario at $64.19 per share. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0986** The team model records -33.79 as the share-price change from the model reference in the bear case scenario. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0987** The team model records 1.01 as the portfolio loss at the modeled position weight in the bear case scenario. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0988** The team model records -58.01 as the share-price change from the model reference in the if ai ended for good scenario. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0989** The team model records 1.74 as the portfolio loss at the modeled position weight in the if ai ended for good scenario. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0990** The downside comparison assumes NVIDIA has an initial portfolio weight of 3%. _[medium; 2026-11-24]_ — our data: data/clean/model_downside.json
- **F0991** The severe AI-demand stress scenario assumes NVIDIA revenue of $337.78 billion in FY29. _[medium; FY29]_ — our data: data/clean/model_path_ai_ended.json
- **F0992** The severe AI-demand stress scenario assumes NVIDIA revenue of $358.35 billion in FY32. _[medium; FY32]_ — our data: data/clean/model_path_ai_ended.json
- **F0994** The team reports a round-one target of $232 per share. The round-one model is unavailable. _[low; 2026-11-24]_ — our data: data/clean/model_target_bridge.json
- **F0995** The team reports using an 11.1% discount rate in round one. The round-one model is unavailable. _[low; 2026-11-24]_ — our data: data/clean/model_target_bridge.json
- **F0996** The team bridge attributes $129.55 per share to rerunning the updated model at the reported round-one discount rate. _[medium; 2026-11-24]_ — our data: data/clean/model_target_bridge.json
- **F0997** After updating the inputs, the team bridge attributes a further $28.44 per share to lowering the discount rate. _[medium; 2026-11-24]_ — our data: data/clean/model_target_bridge.json

## emissions (63)
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
- **F0516** GHG Protocol requires category 11 inventories to include direct use-phase emissions of sold products. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0517** GHG Protocol category 11 covers expected lifetime emissions of relevant products sold during the reporting year, across the product portfolio. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0518** GHG Protocol describes use-of-sold-products emissions as including end users’ Scope 1 and Scope 2 emissions. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0519** GHG Protocol says category 11 calculations typically require product design specifications and assumptions about customer usage and product lifetime. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0520** GHG Protocol requires companies to describe their calculation methods and assumptions for category 11. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0521** GHG Protocol requires avoided-emissions claims for sold products to be reported separately from Scope 1, 2 and 3 inventories. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0522** GHG Protocol permits companies to include emissions from maintaining sold products during use. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0523** GHG Protocol says companies should include indirect use-phase emissions when these are expected to be significant. _[high; ]_ — GHG Protocol (2026-11-25) https://ghgprotocol.org/sites/default/files/2022-12/Chapter11.pdf
- **F0524** SBTi says organizations with a commitment to set targets do not yet have validated science-based targets. _[high; ]_ — Science Based Targets initiative (2026-11-25) https://sciencebasedtargets.org/target-dashboard
- **F0525** SBTi Services validates targets displayed on the SBTi dashboard. _[high; ]_ — Science Based Targets initiative (2026-11-25) https://sciencebasedtargets.org/target-dashboard
- **F0526** SBTi says validation does not assure that a company will achieve or is on track to achieve its target. _[high; ]_ — Science Based Targets initiative (2026-11-25) https://sciencebasedtargets.org/target-dashboard
- **F0527** The SBTi target dashboard says its information is updated every Thursday. _[high; ]_ — Science Based Targets initiative (2026-11-25) https://sciencebasedtargets.org/target-dashboard
- **F0528** SBTi says company temperature alignment is usually provided for Scope 1 and 2 targets, not Scope 3, with an automaker exception. _[high; ]_ — Science Based Targets initiative (2026-11-25) https://sciencebasedtargets.org/target-dashboard
- **F0529** As of 25 November 2026, CDP’s Scores and A Lists page presents 2025 scores as its latest public corporate scores. _[high; as of 2026-11-25]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F0530** CDP says 2026 public scores and A Lists are due on 2 December 2026. _[high; 2026 disclosure cycle]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F0531** CDP says eligible organizations can already view their 2026 scores in the CDP Portal. _[high; 2026 disclosure cycle]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F0532** CDP’s displayed public corporate scores are parent-level theme scores and exclude scores under appeal. _[high; CDP public corporate scores]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F0533** CDP says organizations that miss the scoring deadline do not receive a score. _[high; CDP scoring]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F0534** CDP defines its scores as scores generated from questionnaire data. _[high; CDP website terms as of 2026-11-25]_ — CDP (2026-01-01) https://www.cdp.net/en/terms-and-conditions
- **F0535** CDP states that its website data is protected by copyright laws and treaties. _[high; CDP website terms as of 2026-11-25]_ — CDP (2026-01-01) https://www.cdp.net/en/terms-and-conditions
- **F0536** CDP directs users seeking access to its data to contact the licensing team. _[high; CDP website terms as of 2026-11-25]_ — CDP (2026-01-01) https://www.cdp.net/en/terms-and-conditions
- **F0760** Bristol says Isambard-AI's modular data-centre build cut construction emissions by approximately 72% versus traditional data centres. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0761** At launch, Bristol attributed a circa 72% construction-emissions reduction to Isambard-AI's modular construction versus traditional build methods. _[medium; launch 2025]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2025/isambard-ai-launches-july-2025.html
- **F0829** NVIDIA says revised prior-year emissions values due to improved data or methodology are not subject to assurance. _[medium; ]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0830** Greenpeace states that NVIDIA’s FY26 report did not disclose concrete supplier renewable-transition support such as PPAs or direct investment. _[medium; FY26]_ — Greenpeace East Asia (2026-11-25) https://www.greenpeace.org/eastasia/press/68806/nvidias-fy2026-sustainability-report-reveals-scope-3-emissions-have-nearly-tripled-since-2024-greenpeace-response/
- **F0831** Greenpeace estimates renewable electricity at 24.09% among the top 20 East Asian manufacturing suppliers using CDP responses as of March 2026. _[medium; ]_ — Greenpeace East Asia (2026-11-25) https://www.greenpeace.org/eastasia/press/68806/nvidias-fy2026-sustainability-report-reveals-scope-3-emissions-have-nearly-tripled-since-2024-greenpeace-response/
- **F0832** NVIDIA says its climate targets use FY23 as the base year. _[high; ]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0833** NVIDIA targets a 50% reduction in absolute Scope 1 and market-based Scope 2 emissions by FY30 from FY23. _[high; ]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0834** NVIDIA targets a 75% reduction per PFLOP in use-of-sold-GPU emissions intensity by FY30 from FY23. _[high; ]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0835** NVIDIA reported FY26 purchased goods and services emissions of 9,301,735 metric tonnes CO2e. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0836** NVIDIA reported FY26 capital-goods emissions of 954,865 metric tonnes CO2e. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0837** NVIDIA reported FY26 upstream transport emissions of 137,747 metric tonnes CO2e. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0838** NVIDIA reported FY26 location-based Scope 2 emissions of 308,891 metric tonnes CO2e. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0839** In FY25 NVIDIA said suppliers representing over 80% of Scope 3 category 1 emissions had been engaged; this does not establish target adoption. _[medium; FY25]_ — NVIDIA (2025-06-12) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf
- **F0840** NVIDIA says its supplier-engagement goal covered manufacturing suppliers comprising at least 67% of category 1 emissions. _[medium; FY25]_ — NVIDIA (2025-06-12) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf
- **F0841** NVIDIA expects supplier greenhouse gas emissions to be verified by a third party. _[medium; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0842** NVIDIA says its SB253 inventory covers the consolidated accounting group including wholly owned subsidiaries. _[medium; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/csr/FY26_NVIDIA_SB253_Disclosure.pdf
- **F0843** NVIDIA says its FY26 Scope 1 and 2 inventory runs from January 27, 2025 to January 25, 2026. _[medium; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/csr/FY26_NVIDIA_SB253_Disclosure.pdf
- **F1000** NVIDIA reports 9,822 metric tonnes CO2e of direct Scope 1 emissions for FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1001** NVIDIA reports market-based Scope 2 emissions of 568 metric tonnes CO2e in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1002** NVIDIA reports FY26 Scope 3 emissions of 10,700,940 metric tonnes CO2e; its table lists categories one through eight. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1044** NVIDIA reported 3,216,144 metric tonnes CO2e from purchased goods and services in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1045** NVIDIA reported 6,036,105 metric tonnes CO2e from purchased goods and services in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1046** NVIDIA reported 200,483 metric tonnes CO2e from capital goods in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1047** NVIDIA reported 570,175 metric tonnes CO2e from capital goods in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1053** CDP says its scores may be used without prior written consent only for internal, non-commercial use. _[high; Website terms as accessed]_ — CDP (2026-01-01) https://www.cdp.net/en/data/scores
- **F1059** NVIDIA reports FY24 location-based Scope 2 emissions of 178,087 metric tonnes CO2e. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1060** NVIDIA reports FY25 location-based Scope 2 emissions of 228,378 metric tonnes CO2e. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1061** NVIDIA reports FY24 market-based Scope 2 emissions of 40,555 metric tonnes CO2e. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1062** NVIDIA reports FY25 market-based Scope 2 emissions of zero metric tonnes CO2e. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf

## energy-ai (82)
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
- **F0457** The IEA finds half of US data centres under development are in existing large clusters, potentially increasing local bottlenecks. _[high; 2025 assessment]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0458** The IEA estimates coal provided about 30% of physical electricity consumed by global data centres in its 2025 report. _[high; 2025 report baseline]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai
- **F0459** The IEA estimates renewables provided about 27% of physical electricity consumed by global data centres in its 2025 report. _[high; 2025 report baseline]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai
- **F0460** The IEA estimates natural gas provided 26% of physical electricity consumed by global data centres in its 2025 report. _[high; 2025 report baseline]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai
- **F0461** The IEA estimates nuclear provided 15% of physical electricity consumed by global data centres in its 2025 report. _[high; 2025 report baseline]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai
- **F0462** IEA projects gas and coal together will meet over 40% of additional global data-centre electricity demand through 2030 in its base case. _[high; through 2030 projection]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai
- **F0463** Constellation announced a 20-year electricity purchase agreement with Microsoft to support restarting Three Mile Island Unit 1. _[medium; 2024 announcement]_ — Constellation (2024-09-20) https://www.constellationenergy.com/newsroom/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html
- **F0464** In 2024 Constellation expected the restarted Crane Clean Energy Center to come online in 2028. _[medium; 2024 announcement]_ — Constellation (2024-09-20) https://www.constellationenergy.com/newsroom/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html
- **F0465** Constellation stated a nuclear restart requires US NRC approval after safety and environmental review and state and local permits. _[medium; 2024 announcement]_ — Constellation (2024-09-20) https://www.constellationenergy.com/newsroom/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html
- **F0466** Google announced an agreement for up to 500 MW of new around-the-clock carbon-free power from Kairos reactors; it was a future deployment plan. _[medium; 2024 announcement]_ — Google (2024-10-14) https://blog.google/outreach-initiatives/sustainability/google-kairos-power-nuclear-energy-agreement/
- **F0467** Google said its initial Kairos project aimed for a first SMR by 2030, with further reactor deployments through 2035. _[medium; 2024 announcement]_ — Google (2024-10-14) https://blog.google/outreach-initiatives/sustainability/google-kairos-power-nuclear-energy-agreement/
- **F0468** Google reported its Fervo geothermal project was operational and sending electricity to the Nevada grid serving its data centres. _[medium; 2023]_ — Google (2026-11-25) https://blog.google/outreach-initiatives/sustainability/google-fervo-geothermal-energy-partnership/
- **F0469** Google DeepMind reported a machine-learning system consistently reduced cooling energy by 40% at the studied site; this is not a reduction in total electricity. _[medium; 2016 reported result]_ — Google DeepMind (2016-07-20) https://deepmind.google/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-by-40/
- **F0470** Google DeepMind reported a 15% reduction in PUE overhead at its studied data-centre site, after accounting for non-cooling inefficiencies. _[medium; 2016 reported result]_ — Google DeepMind (2016-07-20) https://deepmind.google/blog/deepmind-ai-reduces-google-data-centre-cooling-bill-by-40/
- **F0471** The IEA says new transmission lines can take four to eight years to build in advanced economies. _[high; 2025 estimate]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0472** The IEA says waits for critical grid components such as transformers and cables doubled over the preceding three years. _[high; 2022–2025]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0495** DOE reports Berkeley Lab estimated US data-centre electricity use at 58 TWh in 2014. _[high; 2014]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0496** DOE reports Berkeley Lab estimated US data-centre electricity use at 176 TWh in 2023. _[high; 2023]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0497** DOE reports Berkeley Lab projected a lower bound of 325 TWh for US data-centre electricity use in 2028. _[medium; 2028 projection]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0498** DOE reports Berkeley Lab projected an upper bound of 580 TWh for US data-centre electricity use in 2028. _[medium; 2028 projection]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0499** DOE reports Berkeley Lab estimated data centres consumed 4.4% of US electricity in 2023. _[high; 2023]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0500** DOE reports Berkeley Lab projected the US data-centre share of electricity at 6.7% to 12% in 2028. _[medium; 2028 projection]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F0501** PJM projected up to approximately 30 GW growth in data-centre electricity demand across its footprint between 2025 and 2030. _[medium; 2025–2030 projection]_ — PJM Interconnection (2026-11-25) https://services.pjm.com/annualreport2025/planning/
- **F0502** PJM says double-counting new large loads can compromise forecasts used for capacity procurement and grid planning. _[high; 2025 annual report]_ — PJM Interconnection (2026-11-25) https://services.pjm.com/annualreport2025/planning/
- **F0503** PJM uses a standardised process to collect information on whether and when new large loads may materialise. _[high; 2025 annual report]_ — PJM Interconnection (2026-11-25) https://services.pjm.com/annualreport2025/planning/
- **F0504** PJM says the 2026 long-term load forecast is lower than its 2025 forecast through 2032 because of changes to electric vehicle, economic and large-load assumptions. _[medium; 2026 forecast]_ — PJM Interconnection (2026-02-06) https://www.pjm.com/-/media/DotCom/library/reports-notices/load-forecast/2026-load-report.pdf
- **F0505** PJM says longer-term large-load projects are treated as non-firm and derated because of greater uncertainty. _[medium; 2026 forecast]_ — PJM Interconnection (2026-02-06) https://www.pjm.com/-/media/DotCom/library/reports-notices/load-forecast/2026-load-report.pdf
- **F0506** MLPerf Inference power uses average whole-system AC power measured at the wall during the benchmark performance run. _[high; ]_ — MLCommons (2026-11-25) https://mlcommons.org/benchmarks/inference-datacenter/?view=power
- **F0507** MLCommons says measured power is valid only for its accompanying benchmark and other power figures such as TDP are not measured or validated by MLCommons. _[high; ]_ — MLCommons (2026-11-25) https://mlcommons.org/benchmarks/inference-datacenter/?view=power
- **F0508** MLCommons says Closed division comparisons use the same model as the reference implementation. _[high; ]_ — MLCommons (2026-11-25) https://mlcommons.org/benchmarks/inference-datacenter/?view=power
- **F0510** MLPerf Inference documentation says the power supply to the system under test passes through a power analyser. _[high; ]_ — MLCommons (2026-11-25) https://docs.mlcommons.org/inference/power/
- **F0511** MLPerf documentation says automatic analyser range selection is not allowed during a testing run. _[high; ]_ — MLCommons (2026-11-25) https://docs.mlcommons.org/inference/power/
- **F0512** MLCommons notes published benchmark results may be modified or invalidated, and points to a change log. _[high; ]_ — MLCommons (2026-11-25) https://mlcommons.org/benchmarks/inference-datacenter/?view=power
- **F0513** MLCommons permits reproducible quantization to numerical formats meeting the benchmark quality target, subject to calibration and disclosure rules. _[high; ]_ — MLCommons (2026-11-25) https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc
- **F0514** MLPerf power documentation calls for an analyser certified by SPEC PTDaemon. _[high; ]_ — MLCommons (2026-11-25) https://docs.mlcommons.org/inference/power/
- **F0515** The MLPerf v5.1 release described sparse participation in measured power submissions, with one data-centre and one edge submission. _[high; 2025-09-09]_ — MLCommons (2025-09-09) https://mlcommons.org/2025/09/mlperf-inference-v5-1-results/?view=release
- **F0560** Google's Gemini text-serving study includes energy from idle accelerators and host trays provisioned for the service. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0561** Google's Gemini text-serving study includes data-centre overhead energy such as cooling and power conversion. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0562** Google's Gemini text-serving study excludes end-user devices from its energy boundary. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0563** Google's Gemini text-serving study excludes external networking and estimates data-centre networking negligible for a text prompt; this cannot establish the boundary for video. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0564** Google reports that its Gemini text-serving energy methodology measures host and accelerator tray power using external power supply units. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0565** Google notes that its Gemini text prompt energy distribution can be skewed, so a median is not a measure of total energy use. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0757** Bristol says Isambard-AI's electricity comes entirely from renewable UK sources, including battery, wind, solar and hydro-generated electricity. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0758** At its July 2025 launch, Bristol said Isambard-AI's facility exclusively used zero-carbon electricity. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2025/isambard-ai-launches-july-2025.html
- **F0759** Bristol describes Isambard-AI's PUE as around 1.08, but does not state the measurement period in this article. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0763** Bristol said Isambard-AI's direct liquid cooling can reduce cooling power consumption by up to 90%. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2025/isambard-ai-launches-july-2025.html
- **F0764** Bristol contrasts Isambard-AI's approximate PUE of 1.08 with around 2.0 for traditionally air-cooled supercomputers. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0915** Facebook-affiliated researchers assumed GPU training systems had the embodied emissions of an Apple 28-core CPU system with dual AMD Radeon GPUs; this is a proxy, not a measured NVIDIA product footprint. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0916** The Facebook study estimated a 30% embodied and 70% operational split for its large-scale workloads under its stated location-based assumptions, not a cross-vendor measurement. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0917** For one Facebook language translation task, researchers reported a further 10.1 times energy-efficiency improvement from GPU acceleration after caching; this is an older workload-specific comparison. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0918** Facebook researchers said platform-level caching improved power efficiency 6.7 times from a CPU-server baseline on the language translation task, before the GPU step. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0919** In that Facebook translation case, halving numerical precision on GPUs was associated with a further 2.4 times energy-efficiency improvement. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0920** A Hugging Face and Carnegie Mellon study used an eight-A100 AWS node for its inference experiments and Code Carbon to measure energy and emissions; it is not a cross-vendor test. _[medium; 2023 study]_ — Hugging Face and Carnegie Mellon University (2023-11-28) https://arxiv.org/html/2311.16863
- **F0921** MLCommons highlighted Fujitsu datacentre power submissions and GATEOverflow edge power submissions in the Inference v5.0 round; participation alone does not establish a matched-vendor winner. _[medium; MLPerf Inference v5.0]_ — MLCommons (2025-04-09) https://mlcommons.org/2025/04/mlperf-inference-v5-0-results/
- **F0922** The Facebook study assumed server utilization of 30–60% over a three- to five-year lifetime when allocating embodied emissions. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0923** The Facebook study assumed CPU-only systems had half the embodied emissions of its GPU-system proxy; this is an assumption rather than a measured vendor comparison. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0924** For the language-translation case, Facebook researchers attributed efficiency gains to caching, GPU acceleration, lower precision and model optimization together. _[medium; 2021 study]_ — Wu et al. (2021-11-01) https://arxiv.org/html/2111.00364
- **F0999** NVIDIA reports 46,258 MWh of fuel in FY26, separately from purchased and generated renewable electricity in its energy table. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1058** The U.S. Department of Energy cites 12% as the upper end of Berkeley Lab’s projected data-centre share of total U.S. electricity in 2028. _[medium; 2028 projection]_ — US Department of Energy (2026-11-25) https://www.energy.gov/articles/doe-releases-new-report-evaluating-increase-electricity-demand-data-centers
- **F1066** The IEA Base Case projects around 1,200 TWh of global data-centre electricity consumption in 2035. _[medium; 2035 scenario]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F1067** The IEA Lift-Off Case projects more than 1,700 TWh of global data-centre electricity demand in 2035. _[medium; 2035 scenario]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F1073** NVIDIA reported 39,087 MWh of fuel use in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1074** NVIDIA reported 35,729 MWh of fuel use in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1085** Google allocated 0.14 Wh of the median Gemini Apps text prompt to active AI accelerators using its full-stack serving methodology. _[high; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F1086** Google allocated 0.06 Wh of the median Gemini Apps text prompt to the host CPU and memory using its full-stack serving methodology. _[high; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F1087** Google Research reports a 44-fold reduction in total greenhouse gas emissions per median Gemini Apps text prompt over 12 months, including direct, market-based electricity and embodied emissions under its method. _[high; May 2024–May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F1094** The IEA projects conventional-server electricity use to grow 9% annually from 2024 to 2030 in its Base Case. _[high; 2024–2030 Base Case]_ — International Energy Agency (2025-04-10) https://www.iea.org/files/de9dea13-b07d-42c5-a398-d1b3ae17d866/EnergyandAI.pdf

## esg-environment (36)
- **F0037** Google measured 0.24 Wh for its median Gemini Apps text prompt in May 2025, including the production serving stack. _[high; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0038** Google attributes 0.02 Wh per median Gemini text prompt each to idle machines and data-centre overhead, rounded. _[high; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0039** Google reports a 33-fold reduction in energy per median Gemini Apps text prompt over the preceding year; a company-specific result. _[medium; May 2024–May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0040** Google notes a skewed prompt-energy distribution, with some high-token or low-utilisation prompts consuming disproportionately more energy. _[high; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0041** In an academic A100 benchmark, median image generation consumed 1.35 kWh per 1,000 inferences; this is not a universal production estimate. _[medium; 2023 benchmark]_ — Hugging Face and Carnegie Mellon University (2023-11-28) https://arxiv.org/html/2311.16863
- **F0042** In the same benchmark, median text generation consumed 0.042 kWh per 1,000 inferences; the study generated only 10 tokens per input. _[medium; 2023 benchmark]_ — Hugging Face and Carnegie Mellon University (2023-11-28) https://arxiv.org/html/2311.16863
- **F0043** The study generated 10 new tokens per input for its text generation task, limiting comparability to longer real-world answers. _[high; 2023 benchmark]_ — Hugging Face and Carnegie Mellon University (2023-11-28) https://arxiv.org/html/2311.16863
- **F0044** Epoch AI warns that increasing model complexity or reasoning tokens may offset efficiency gains. _[medium; ]_ — Epoch AI (2025-02-19) https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
- **F0045** The IEA high-efficiency scenario holds demand for digital services and AI at the same level while reducing the electricity footprint. _[high; ]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0046** Google estimates its median Gemini text prompt generated 0.03 g CO2e under its own comprehensive accounting in May 2025. _[medium; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0047** The research benchmark ran on a node of eight NVIDIA A100 GPUs, using CodeCarbon to measure inference. _[high; 2023 benchmark]_ — Hugging Face and Carnegie Mellon University (2023-11-28) https://arxiv.org/html/2311.16863
- **F0053** Bloomberg records NVIDIA direct operational emissions intensity at 0.048 tonnes CO2 per USD million of sales in FY26. _[medium; FY26]_ — our data: data/clean/peers_emissions_intensity.json
- **F0054** Bloomberg records TSMC direct operational emissions intensity at 108.743 tonnes CO2 per USD million of sales in FY25. _[medium; FY25]_ — our data: data/clean/peers_emissions_intensity.json
- **F0443** Bloomberg records NVIDIA Environmental score of 6.36 out of 10 for FY22, in an export dated 20 November 2026. _[medium; FY22]_ — our data: data/clean/nvda_esg_scores.json
- **F0444** Bloomberg records NVIDIA Environmental score of 6.86 out of 10 for FY23, in an export dated 20 November 2026. _[medium; FY23]_ — our data: data/clean/nvda_esg_scores.json
- **F0445** Bloomberg records NVIDIA Environmental score of 7.06 out of 10 for FY24, in an export dated 20 November 2026. _[medium; FY24]_ — our data: data/clean/nvda_esg_scores.json
- **F0446** Bloomberg records NVIDIA Environmental score of 7.48 out of 10 for FY25, in an export dated 20 November 2026. _[medium; FY25]_ — our data: data/clean/nvda_esg_scores.json
- **F0447** Bloomberg records NVIDIA Social score of 3.63 out of 10 for FY25, in an export dated 20 November 2026. _[medium; FY25]_ — our data: data/clean/nvda_esg_scores.json
- **F0448** Bloomberg records NVIDIA Governance score of 7.1 out of 10 for FY25, in an export dated 20 November 2026. _[medium; FY25]_ — our data: data/clean/nvda_esg_scores.json
- **F0449** Bloomberg records NVIDIA Overall ESG score score of 6.1 out of 10 for FY25, in an export dated 20 November 2026. _[medium; FY25]_ — our data: data/clean/nvda_esg_scores.json
- **F0450** MSCI ESG ratings measure resilience to financially relevant, industry-specific sustainability risks and opportunities. _[high; 2026-11-25]_ — MSCI (2026-11-25) https://www.msci.com/our-solutions/esg-investing/esg-ratings
- **F0451** MSCI assigns industry-relative letter ratings from AAA to CCC, based on risk and opportunity management relative to peers. _[high; 2026-11-25]_ — MSCI (2026-11-25) https://www.msci.com/our-solutions/esg-investing/esg-ratings
- **F0452** Sustainalytics describes its ESG Risk Ratings as an absolute measure based on exposure and management. _[high; 2026-11-25]_ — Morningstar Sustainalytics (2026-11-25) https://www.sustainalytics.com/esg-data
- **F0453** Sustainalytics aggregates unmanaged risk across material ESG issues to calculate its ESG Risk Rating. _[high; 2026-11-25]_ — Morningstar Sustainalytics (2026-11-25) https://www.sustainalytics.com/esg-data
- **F0454** Sustainalytics says controversies affect its management score. _[high; 2026-11-25]_ — Morningstar Sustainalytics (2026-11-25) https://www.sustainalytics.com/esg-data
- **F0455** ISS says its environmental and social QualityScores compare companies only with peers in their industry group. _[high; 2026-11-25]_ — ISS (2026-11-25) https://www.issgovernance.com/esg/ratings/corporate-rating/
- **F0456** CDP says its public score display excludes companies appealing scores and those missing the scoring deadline receive no score. _[high; 2026-11-25]_ — CDP (2026-11-25) https://www.cdp.net/en/scores
- **F0566** Direct economic rebound describes efficiency reducing a product’s price and increasing its consumption; the definition alone does not prove the effect occurred in AI. _[high; ]_ — Luccioni, Strubell and Crawford (2025-06-13) https://arxiv.org/html/2501.16548v2
- **F0567** The AI rebound literature notes that economy-wide rebound estimates have historically been difficult, especially for technologies. _[high; ]_ — Luccioni, Strubell and Crawford (2025-06-13) https://arxiv.org/html/2501.16548v2
- **F0568** Researchers say applying Jevons’ paradox to AI has conceptual and empirical limitations because technological development and diffusion are complex. _[high; ]_ — Luccioni, Strubell and Crawford (2025-06-13) https://arxiv.org/html/2501.16548v2
- **F0569** Researchers call for empirical studies of AI adoption, user behavior, policy and market dynamics to assess complex rebound effects. _[high; ]_ — Luccioni, Strubell and Crawford (2025-06-13) https://arxiv.org/html/2501.16548v2
- **F0570** Researchers say it is unclear how far AI model scaling is offset by simultaneous optimization, and what consequences follow for grids and supply chains. _[high; ]_ — Luccioni, Strubell and Crawford (2025-06-13) https://arxiv.org/html/2501.16548v2
- **F0571** In its high-efficiency scenario the IEA holds the level of demand for digital services and AI constant across the comparison, so this is not an empirical rebound estimate. _[high; ]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai
- **F0572** The IEA identifies autonomous-vehicle modal shifts as a possible rebound that could reduce AI-enabled emissions savings, not as an observed AI-wide rebound rate. _[high; ]_ — International Energy Agency (2025-04-10) https://www.iea.org/reports/energy-and-ai/executive-summary
- **F0573** The IEA emphasizes that the net climate impact of AI depends on deployment, incentives, business cases and regulation. _[high; ]_ — International Energy Agency (2025-04-10) https://www.iea.org/files/de9dea13-b07d-42c5-a398-d1b3ae17d866/EnergyandAI.pdf
- **F0998** NVIDIA reports FY26 renewable electricity at 100%; this is a share of electricity rather than of total energy. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf

## esg-social (90)
- **F0049** Bloomberg records an NVIDIA social disclosure score of 51.62 for FY22. _[medium; FY22]_ — our data: data/clean/nvda_esg_scores.json
- **F0050** Bloomberg records an NVIDIA social disclosure score of 5.37 for FY25. _[medium; FY25]_ — our data: data/clean/nvda_esg_scores.json
- **F0055** Bloomberg data in the project records NVIDIA staff turnover of 3.7% in FY26. _[medium; FY26]_ — our data: data/clean/research_people.json
- **F0056** Bloomberg data in the project records 42,000 NVIDIA employees in FY26. _[medium; FY26]_ — our data: data/clean/research_people.json
- **F0057** Bloomberg data in the project records 22,473 NVIDIA employees in FY22. _[medium; FY22]_ — our data: data/clean/research_people.json
- **F0058** Bloomberg data in the project records women as 21.6% of NVIDIA workforce in FY26. _[medium; FY26]_ — our data: data/clean/research_people.json
- **F0059** Bloomberg data in the project records zero NVIDIA employee fatalities in FY26. _[medium; FY26]_ — our data: data/clean/research_people.json
- **F0060** The project dataset records NVIDIA as rank 3 in Glassdoor US Best Places to Work 2026. _[medium; 2026]_ — our data: data/clean/research_people.json
- **F0061** The project dataset records NVIDIA as rank 6 in Fortune 100 Best Companies to Work For 2026. _[medium; 2026]_ — our data: data/clean/research_people.json
- **F0062** The project dataset records NVIDIA as rank 53 in the Corporate Knights Global 100 2026. _[medium; 2026]_ — our data: data/clean/research_people.json
- **F0628** NVIDIA says its FY25 assessment identified forced and child labour as salient pre-mitigation supply-chain risks, but not risks salient in its own operations. _[high; FY25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0629** NVIDIA expects all manufacturing suppliers to follow the RBA code and complete annual self-assessment questionnaires. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0630** NVIDIA requires strategic suppliers to undergo third-party onsite VAP audits every two years to validate self-assessments. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0631** NVIDIA says its goal is to audit all strategic suppliers on a biennial basis. _[high; FY26 goal]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0632** NVIDIA reviewed VAP audits covering 45% of strategic suppliers in FY26 and 93% over two years. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0633** NVIDIA reports VAP audits reviewed over two years covered 93% of its strategic suppliers. _[high; FY25–FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0634** NVIDIA says it engaged all strategic suppliers on corrective action plans where applicable for VAP audits conducted; engagement is not proof all actions closed. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0635** NVIDIA reports FY26 supplier non-compliance including hiring fees, passport retention, working hours and penalties for leaving early. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0636** NVIDIA says it worked with manufacturing partners on fee return, document retention and changes to working-hours and early-leaving practices. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0637** NVIDIA acknowledges remediation can risk lost income for vulnerable workers and families. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0638** NVIDIA says it is not aware of lost income from its FY26 remediation; this is not independent verification of no harm. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0639** NVIDIA says its FY26 statement is a report under the UK Modern Slavery Act and Canadian supply-chain legislation. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0640** NVIDIA says manufacturing partners procure most production raw materials, limiting direct visibility into upstream supply chains. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0641** The Home Office says section 54 requires certain organisations to develop a modern slavery statement annually. _[high; ]_ — UK Home Office (2026-11-25) https://www.gov.uk/government/publications/transparency-in-supply-chains-a-practical-guide
- **F0642** NVIDIA says its FY26 statement is issued on behalf of NVIDIA Development UK Limited, NVIDIA Ltd and NVIDIA Belfast Ltd, each judged to meet UK transparency criteria. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0643** NVIDIA reports women made up 19.7% of its workforce in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0644** NVIDIA reports women made up 21.2% of its workforce in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0645** NVIDIA reports women made up 21.6% of its workforce in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0646** NVIDIA reports women held 15.2% of technical roles in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0647** NVIDIA reports women held 16.8% of technical roles in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0648** NVIDIA reports women held 17.4% of technical roles in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0649** NVIDIA reports women held 13.1% of leadership positions in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0650** NVIDIA reports women held 13.5% of leadership positions in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0651** NVIDIA reports women held 14.8% of leadership positions in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0652** NVIDIA reports a global women-to-men pay ratio of 99.5 to 100 in FY26; its disclosed ratio does not by itself establish representation or resolve all inequity. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0653** NVIDIA reports Black or African American employees made up 2.0% of its U.S. workforce in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0654** NVIDIA reports women held 38.5% of board positions in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0655** NVIDIA reports women held 30.0% of board positions in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0656** NVIDIA reports overall turnover of 2.7% in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0657** NVIDIA reports overall turnover of 2.5% in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0658** NVIDIA reports overall turnover of 3.7% in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0659** NVIDIA reports turnover among Black or African American U.S. employees of 6.3% in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0660** NVIDIA reports turnover among Hispanic or Latino U.S. employees of 4.4% in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0661** NVIDIA says its manufacturing partners handle wafer fabrication, substrates, assembly, testing and packaging. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0662** NVIDIA says its strategic suppliers are reviewed quarterly or semiannually, with environmental and social performance weighted at five percent. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0663** NVIDIA says its conflict minerals due diligence uses compliance data from RMAP and three other industry audit schemes. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0664** NVIDIA says a board committee oversees human rights policy and reports to the full board. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0665** NVIDIA says its investigations team investigates human rights allegations from its Speak Up line and escalates matters as appropriate. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0666** NVIDIA says its board nominating and governance committee approved the FY26 forced labour statement. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0667** NVIDIA says its subsidiaries follow corporate policies and procedures. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0668** RMI says RMAP independently assesses smelter and refiner management systems and sourcing practices, not every transaction. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/
- **F0669** RMI states its assessment is not a material validation assessment. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/
- **F0670** RMI says assessments are conducted by independent approved third parties, while RMI manages scheduling, finance and quality control. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/
- **F0671** RMI says assessment validity lasts either one or three years depending on factors. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/
- **F0672** RMI says a nonconformant smelter that cannot meet extended corrective action requirements within 12 months receives a final warning followed by termination of participation. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/extended-corrective-action-plan/
- **F0673** RMI says it can share corrective action timeline and progress descriptions with its members. _[high; ]_ — Responsible Minerals Initiative (2026-11-25) https://www.responsiblemineralsinitiative.org/responsible-minerals-assurance-process/extended-corrective-action-plan/
- **F0676** Great Place To Work says its Trust Index survey measures workplace behaviors associated with trust in management, connection with colleagues and loyalty to the company. _[high; ]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0677** The Trust Index survey asks employees to rate 60 statements on a five-point scale and answer two open-ended questions. _[high; 2026 Fortune 100 methodology]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0678** Great Place To Work says Fortune 100 rankings assess whether positive workplace experience is shared across the workforce, including differences across demographic groups and roles. _[high; ]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0679** Great Place To Work says it analyzes survey response differences across demographic groups and roles when assessing employee experience quality and consistency. _[high; ]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0680** Great Place To Work says only survey data can earn a Fortune 100 Best list placement; company essays provide context but do not qualify a company for placement. _[high; ]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0681** Eligible employers for the 2026 Fortune 100 Best list had at least 1,000 U.S. employees and could not be government agencies. _[high; 2026 eligibility]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0682** Great Place To Work says its 2026 Fortune 100 ranking was based on nearly 640,000 responses from employees at eligible companies. _[high; 2026 Fortune 100]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0683** NVIDIA ranked sixth on Great Place To Work's 2026 Fortune 100 Best Companies to Work For list. _[high; 2026]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0684** Great Place To Work says employers of more than 7.3 million people were surveyed in the last year for its lists, and more than 1.3 million responses were received overall. _[high; Last year as stated in 2026 methodology]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0685** Each company answers six essay questions about its programs and workplace strategy for the Fortune 100 list. _[high; 2026 Fortune 100 methodology]_ — Great Place To Work (2026-04-02) https://www.greatplacetowork.com/best-workplaces/100-best/2026
- **F0800** NVIDIA says its FY25 human-rights assessment incorporated internal and external stakeholder input. _[high; FY25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0801** NVIDIA says supplier assessment results, including spend analysis, determine overall supplier risk. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0802** NVIDIA says enhanced strategic-supplier requirements apply to specified production-material, quality, product-design and customer-agreement categories. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0803** NVIDIA says all employees must take code-of-conduct training on hire and periodically, including forced labour prohibitions. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0804** NVIDIA says relevant employees also take RBA e-learning courses and participate in RBA workgroups. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0805** NVIDIA says its parent centrally manages supply chains and governs subsidiaries purchasing, importing and selling. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0806** NVIDIA says the supply-chain governance, diligence and remediation described in its statement are parent-level actions, with subsidiaries not directly involved. _[high; FY26]_ — NVIDIA (2026-11-25) https://www.nvidia.com/content/dam/en-zz/Solutions/about-us/documents/2025-Forced-Labor-Human-Trafficking-and-Child-Labor-Statement.pdf
- **F0807** In October 2026 the RBA said approved third-party firms assess facilities using its protocols and identify code nonconformances. _[high; 2026-10-22]_ — Responsible Business Alliance (2026-11-25) https://www.responsiblebusiness.org/news/onsite-assessments/
- **F0808** In October 2026 the RBA said each assessment finding carries a severity rating and a remediation timeline. _[high; 2026-10-22]_ — Responsible Business Alliance (2026-11-25) https://www.responsiblebusiness.org/news/onsite-assessments/
- **F0809** The RBA says facilities are expected to correct issues and implement measures to prevent recurrence. _[high; 2026-10-22]_ — Responsible Business Alliance (2026-11-25) https://www.responsiblebusiness.org/news/onsite-assessments/
- **F0810** The RBA announced that corrective action plans would be included going forward with all onsite assessments; this does not establish closure of NVIDIA supplier findings. _[high; 2026-10-22]_ — Responsible Business Alliance (2026-11-25) https://www.responsiblebusiness.org/news/onsite-assessments/
- **F0811** The RBA says its VAP assesses facilities against labour, health and safety, environmental, ethics and management-system criteria. _[high; 2026-10-22]_ — Responsible Business Alliance (2026-11-25) https://www.responsiblebusiness.org/news/onsite-assessments/
- **F0812** UK section 54 states that a corporate modern slavery statement must be approved by the board or equivalent and signed by a director or equivalent. _[high; Modern Slavery Act 2015]_ — UK legislation (2026-11-25) https://www.legislation.gov.uk/ukpga/2015/30/section/54
- **F0874** Bloomberg says its zero-centered ESG scores enable cross-peer-group comparison, with values from -10 to 8.5. _[high; methodology described in 2025 article]_ — Bloomberg Professional Services (2024-10-01) https://www.bloomberg.com/professional/insights/sustainable-finance/are-esg-scores-relevant-for-portfolio-returns/
- **F0875** Bloomberg says the usefulness of its ESG scores as an indicator of returns is influenced by the amount of quantitative disclosure supporting them. _[high; Bloomberg analysis through March 2025]_ — Bloomberg Professional Services (2024-10-01) https://www.bloomberg.com/professional/insights/sustainable-finance/are-esg-scores-relevant-for-portfolio-returns/
- **F1057** NVIDIA reports women held 33.3% of board positions in the FY24 column of its FY26 Sustainability Report. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1065** NVIDIA reports Hispanic or Latino employees made up 4.1% of its U.S. workforce in FY26, 4.1% in FY25 and 3.9% in FY24. _[high; FY24–FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1077** NVIDIA reported an OSHA recordable incident rate of 0.11 per 200,000 labor hours for U.S. employees in FY24. _[high; FY24]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1078** NVIDIA reported an OSHA recordable incident rate of 0.08 per 200,000 labor hours for U.S. employees in FY25. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1079** NVIDIA reported an OSHA recordable incident rate of 0.07 per 200,000 labor hours for U.S. employees in FY26. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1097** NVIDIA reports a U.S. lost-time case rate of 0.01 per 200,000 labor hours in each of FY24, FY25 and FY26. _[high; FY24–FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1100** NVIDIA reports a FY26 U.S. pay ratio of 100.1 to 100 for Asian versus White employees. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1101** NVIDIA reports a FY26 U.S. pay ratio of 100 to 100 for Black or African American versus White employees. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F1102** NVIDIA reports a FY26 U.S. pay ratio of 99.3 to 100 for Hispanic or Latino versus White employees. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf

## financials (52)
- **F0103** Q3 FY27 revenue was $115.8bn, up 20% sequentially and 103% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0104** Q3 FY27 GAAP gross margin was 74.8%. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0105** Q3 FY27 non-GAAP gross margin was 74.9%. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0106** Q3 FY27 GAAP diluted EPS was $2.70. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0107** Q3 FY27 non-GAAP diluted EPS was $2.68. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0122** Q3 FY27 total revenue grew 103% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0123** Q3 FY27 GAAP operating expenses were $9.2bn, up 57% year on year, as shown in NVIDIA’s GAAP summary table. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0124** Q3 FY27 non-GAAP operating expenses were $8.8bn, up 52% year on year, as shown in NVIDIA’s non-GAAP summary table. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0127** Kress attributed the Q3 gross-margin beat versus guidance to a better product mix. _[medium; Q3 FY27]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0331** NVIDIA reported FY22 free cash flow of $8,049 million, after principal payments as defined by NVIDIA. _[high; FY22]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2022
- **F0332** NVIDIA reported FY23 free cash flow of $3,750 million, after principal payments as defined by NVIDIA. _[high; FY23]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2023
- **F0333** Cash and cash equivalents were $29,089 million at October 25, 2026. _[high; 2026-10-25]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0334** Inventories were $39,724 million at October 25, 2026, versus $21,403 million at the prior fiscal year end. _[high; 2026-10-25]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0335** Long-term debt was $32,371 million at October 25, 2026, versus $7,469 million at the prior fiscal year end. _[high; 2026-10-25]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0336** Marketable equity securities were $44,219 million at October 25, 2026; these are distinct from cash. _[high; 2026-10-25]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0337** GAAP research and development expense was $7,454 million in Q3 FY27. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0338** Q3 FY27 purchases related to property and equipment and intangible assets were $4,422 million; this combines tangible and intangible purchases. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0339** Bloomberg annual data shows FY22 gross margin of 64.93%. _[high; FY22]_ — our data: data/clean/nvda_margins_annual.json
- **F0340** Bloomberg annual data shows FY23 gross margin of 56.93%. _[high; FY23]_ — our data: data/clean/nvda_margins_annual.json
- **F0341** Bloomberg annual data shows FY24 gross margin of 72.72%. _[high; FY24]_ — our data: data/clean/nvda_margins_annual.json
- **F0342** Bloomberg annual data shows FY25 gross margin of 74.99%. _[high; FY25]_ — our data: data/clean/nvda_margins_annual.json
- **F0343** Bloomberg annual data shows FY26 gross margin of 71.07%. _[high; FY26]_ — our data: data/clean/nvda_margins_annual.json
- **F0344** Bloomberg annual data reports FY26 free cash flow of $96.676bn, while NVIDIA reports $96.575bn using its own definition including principal payments; definitions need reconciliation. _[high; FY26]_ — our data: data/clean/nvda_fcf_annual.json
- **F0345** NVIDIA reported Q4 FY25 free cash flow of $15,519 million using its company definition. _[high; Q4 FY25]_ — NVIDIA (2025-02-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025
- **F0346** NVIDIA reported Q1 FY26 free cash flow of $26,135 million using its company definition. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0347** NVIDIA reported Q2 FY26 free cash flow of $13,450 million using its company definition. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0348** NVIDIA reported Q3 FY26 free cash flow of $22,089 million using its company definition. _[high; Q3 FY26]_ — NVIDIA (2025-11-19) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2026
- **F0349** NVIDIA reported Q4 FY26 free cash flow of $34,902 million using its company definition. _[high; Q4 FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0350** NVIDIA reported Q1 FY27 free cash flow of $48,554 million using its company definition. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0351** NVIDIA reported Q2 FY27 free cash flow of $21,341 million using its company definition. _[high; Q2 FY27]_ — NVIDIA (2026-08-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027
- **F0352** NVIDIA reported Q3 FY27 free cash flow of $43,777 million using its company definition. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0353** NVIDIA reported FY24 free cash flow of $26,947 million, after principal payments as defined by NVIDIA. _[high; FY24]_ — NVIDIA (2024-02-21) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2024
- **F0354** NVIDIA reported FY25 free cash flow of $60,724 million, after principal payments as defined by NVIDIA. _[high; FY25]_ — NVIDIA (2025-02-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025
- **F0355** NVIDIA reported FY26 free cash flow of $96,575 million, after principal payments as defined by NVIDIA. _[high; FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0356** Use NVIDIA’s $96,575 million for FY26 company-defined free cash flow: it is the primary source. Bloomberg reports $96.676 billion; the difference is not yet reconciled. _[medium; FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0879** Kress attributed sequential Q3 operating expense growth to higher compute and infrastructure spending. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0880** Kress said Q3 operating expenses came in marginally below outlook primarily due to timing of non-recurring engineering expenses. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F1025** Bloomberg shows NVIDIA revenue of $26.974 billion in FY23. _[high; FY23]_ — our data: data/clean/nvda_revenue_annual.json
- **F1026** Bloomberg shows NVIDIA revenue of $60.922 billion in FY24. _[high; FY24]_ — our data: data/clean/nvda_revenue_annual.json
- **F1027** Bloomberg shows NVIDIA revenue of $215.938 billion in FY26. _[high; FY26]_ — our data: data/clean/nvda_revenue_annual.json
- **F1031** Bloomberg shows NVIDIA operating margin of 62.42% in FY25. _[high; FY25]_ — our data: data/clean/nvda_margins_annual.json
- **F1032** Bloomberg shows NVIDIA operating margin of 60.38% in FY26. _[high; FY26]_ — our data: data/clean/nvda_margins_annual.json
- **F1033** Bloomberg shows NVIDIA free cash flow of $8.132 billion in FY22. _[high; FY22]_ — our data: data/clean/nvda_fcf_annual.json
- **F1034** Bloomberg shows NVIDIA free cash flow of $3.808 billion in FY23. _[high; FY23]_ — our data: data/clean/nvda_fcf_annual.json
- **F1035** Bloomberg shows NVIDIA revenue surprise of 12.62% in FY24 Q3. _[high; FY24 Q3]_ — our data: data/clean/nvda_revenue_surprise.json
- **F1036** Bloomberg shows NVIDIA revenue surprise of 1.11% in FY26 Q2. _[high; FY26 Q2]_ — our data: data/clean/nvda_revenue_surprise.json
- **F1037** Bloomberg shows NVIDIA revenue surprise of 5.96% in FY27 Q3. _[high; FY27 Q3]_ — our data: data/clean/nvda_revenue_surprise.json
- **F1063** NVIDIA reported GAAP net cash provided by operating activities of $48,253 million in Q3 FY27. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1064** NVIDIA deducted $54 million of principal payments on property and equipment and intangible assets in its Q3 FY27 free cash flow reconciliation. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1092** NVIDIA listed rounded Q2 FY27 GAAP operating expenses of $8.4 billion in the following quarter’s earnings release. _[high; Q2 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1095** NVIDIA reported $24,423 million in marketable debt securities on October 25, 2026, versus $39,065 million on January 25, 2026. _[high; October vs January 2026]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1096** NVIDIA deducted $101 million in principal payments on property, equipment and intangible assets in its FY26 free cash flow reconciliation. _[high; FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026

## governance (56)
- **F0063** On 12 November 2026 NVIDIA announced Jensen Huang had resigned immediately as president, CEO and director. _[high; 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0064** Colette Kress agreed to serve as interim CEO while continuing as executive vice president and CFO. _[high; 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0065** The board appointed Harvey C. Jones as NVIDIA’s first-ever board chair. _[high; 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0066** NVIDIA’s 8-K says Huang was reinstated as president, CEO and director effective 22 November 2026. _[high; 2026-11-22]_ — NVIDIA via SEC (2026-11-23) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm
- **F0067** After Huang’s reinstatement Kress continues as executive vice president and CFO. _[high; 2026-11-22]_ — NVIDIA via SEC (2026-11-23) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm
- **F0068** On 23 November NVIDIA said the board unanimously voted to reinstate Huang after discussions concerning his candor and ability to lead. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0069** On 23 November NVIDIA said Harvey Jones would remain board chair after Huang’s reinstatement. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0070** NVIDIA said an independent-director committee retained independent counsel to investigate reporting that Huang was targeted by a foreign intelligence effort. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0071** The board said its committee investigation would proceed to conclusion despite reinstatement. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0072** NVIDIA said it would continue to cooperate with ongoing government investigations and inquiries. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0073** NVIDIA began searching for a chief compliance officer reporting to the nominating and corporate governance committee. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0074** NVIDIA created a standing board committee overseeing national security policies, export control compliance and global trade risk. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0075** Suzanne Nora Johnson chairs the national security committee, with Stephen C. Neal and John O. Dabiri as members. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0076** The national security and export control oversight committee is to meet at least quarterly, including in executive session. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0077** CNN reported that chairs of three Republican-led House committees criticized NVIDIA’s reinstatement decision. _[high; 2026-11-23]_ — CNN (2026-11-23) https://www.cnn.com/2026/11/23/business/live-news/jensen-huang-reinstated-as-ceo-of-nvidia
- **F0078** NVIDIA said its new national security and export control committee comprises only independent directors. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0414** For the effective reinstatement date use 22 November 2026: NVIDIA’s 8-K explicitly specifies that date; the 23 November press announcement says effective immediately, creating an apparent date ambiguity. _[high; November 2026 reinstatement]_ — NVIDIA via SEC (2026-11-23) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm
- **F0574** After Huang resigned, the board launched a permanent CEO search considering internal and external candidates. _[high; 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0575** NVIDIA said the board received input from senior US government levels and expressed confidence that reinstatement posed no national security risk; this is the board’s assessment. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0576** NVIDIA said Huang supported and committed to cooperating with the board investigation. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0577** NVIDIA said the national security committee was engaging experienced counsel who would retain specialist advisers. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0578** At the time of the committee announcement, NVIDIA said its national security and global trade compliance teams would report to the committee and interim CEO for daily operations. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0579** NVIDIA said the standing committee would oversee enhancement of its national security and trade compliance teams and work with independent experts. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F0580** The reinstatement 8-K incorporates the company’s press release dated 23 November as an exhibit. _[high; 2026-11-23]_ — NVIDIA via SEC (2026-11-23) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm
- **F0581** CNN reported that a law-enforcement official said the attorney general had advised the president that DOJ had no evidence of wrongdoing by Huang or NVIDIA in ongoing investigations; this is attributed reporting, not a final finding. _[medium; 2026-11-23]_ — CNN (2026-11-23) https://www.cnn.com/2026/11/23/business/live-news/jensen-huang-reinstated-as-ceo-of-nvidia
- **F0582** The BIS public-inspection final rule identifies diversion risk as the reason for adding listed entities; it does not itself establish wrongdoing by NVIDIA. _[high; 2026 public-inspection rule]_ — US Bureau of Industry and Security (2026-11-23) https://public-inspection.federalregister.gov/2026-23999.pdf
- **F0583** The BIS rule says the listed entities face a licence requirement for items subject to the EAR and a presumption of denial. _[high; 2026 public-inspection rule]_ — US Bureau of Industry and Security (2026-11-23) https://public-inspection.federalregister.gov/2026-23999.pdf
- **F0584** The BIS public-inspection rule lists Megaspeed entities in Malaysia, Singapore and Thailand among the additions to the Entity List. _[high; 2026 public-inspection rule]_ — US Bureau of Industry and Security (2026-11-23) https://public-inspection.federalregister.gov/2026-23999.pdf
- **F0686** May 2026 proxy identified nine independent director nominees and one executive nominee; this predates November leadership changes. _[medium; May 2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0687** The May 2026 proxy said the board had ten members. _[medium; May 2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0688** Directors have one-year terms and stand for election annually, according to the 2026 proxy. _[medium; 2026 proxy]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0689** Shareholders elected all ten nominees at the June 2026 meeting, before the later leadership changes. _[medium; June 2026]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F0690** Shareholders approved executive compensation on an advisory basis at the June 2026 meeting. _[medium; June 2026]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F0691** Shareholders ratified PwC as independent registered auditor for the fiscal year ending January 2027. _[medium; FY2027]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F0692** PwC has audited NVIDIA financial statements annually since 2004, according to the 2026 proxy. _[medium; FY2027]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0693** NVIDIA reported FY2026 CEO compensation of $36,343,830. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0694** NVIDIA reported a FY2026 CEO-to-median-employee pay ratio of 129 to 1. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0695** NVIDIA reused its FY2024 median employee in calculating the FY2026 pay ratio, citing no significant changes to population or compensation arrangements. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0696** NVIDIA says all of Huang’s FY2026 equity grants were performance-based. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0697** The compensation committee prearranged lower FY2026 stretch goals if additional H20 export restrictions occurred in the first half. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0698** NVIDIA says H20 licensing restrictions triggered the automatic adjustment to FY2026 stretch goals. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0699** Shareholders approved a nonbinding proposal to replace supermajority voting rules with a simple majority. _[medium; June 2026]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F0700** Shareholders rejected a nonbinding proposal seeking disclosure of greenhouse gas emissions from use of sold products. _[medium; June 2026]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F0701** The board opposed the sold-product emissions proposal, calling it unnecessary and overly prescriptive. _[medium; 2026 proxy]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0702** In the 2026 proxy NVIDIA said it planned to enhance Scope 3 reporting, including sold-product use emissions. _[medium; 2026 proxy]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0703** Huang’s daughter and son are NVIDIA employees, the FY2026 proxy disclosed. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0704** The proxy says compensation for these related employees was set without the relevant family member’s involvement. _[medium; FY2026]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F0705** The proxy says the lead audit partner serves no more than five consecutive years. _[medium; 2026 proxy]_ — SEC / NVIDIA (2026-05-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000036/nvda-20260512.htm
- **F1016** On 17 November 2026 NVIDIA announced its standing National Security and Export Control Oversight Committee. _[high; 2026-11-17]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-board-of-directors-establishes-national-security-and-export-control-oversight-committee
- **F1038** NVIDIA reported 2,939,623,603 shares voting for the nonbinding proposal to disclose greenhouse gas emissions from use of sold products. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1039** NVIDIA reported 13,789,742,126 shares voting against the nonbinding proposal to disclose greenhouse gas emissions from use of sold products. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1040** NVIDIA reported 14,589,671,908 shares voted for the nonbinding simple-majority proposal at its June 2026 annual meeting. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1041** NVIDIA reported 2,210,282,205 shares voted against the nonbinding simple-majority proposal at its June 2026 annual meeting. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1042** NVIDIA reported 56,735,273 shares abstained on the nonbinding simple-majority proposal at its June 2026 annual meeting. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1043** NVIDIA reported 2,829,718,733 broker non-votes on the nonbinding simple-majority proposal at its June 2026 annual meeting. _[high; June 2026 annual meeting]_ — SEC / NVIDIA (2026-06-30) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000056/nvda-20260624.htm
- **F1054** The BIS public-inspection final rule adds 7 entities to the Entity List under Malaysia, Singapore and Thailand. _[high; November 2026 public-inspection rule]_ — US Bureau of Industry and Security (2026-11-23) https://public-inspection.federalregister.gov/2026-23999.pdf

## guidance (15)
- **F0108** Q4 FY27 revenue guidance is $130bn plus or minus 3%; it includes an additional week. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0109** Q4 FY27 revenue guidance carries a plus-or-minus 3% range. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0110** The Q4 FY27 outlook assumes no Data Center compute revenue from China. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0111** Q4 FY27 GAAP and non-GAAP gross-margin guidance is 71% to 72%, below Q3. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0112** The upper end of Q4 FY27 GAAP and non-GAAP gross-margin guidance is 72%. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0113** Q4 FY27 GAAP operating expenses are expected to be approximately $11bn. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0114** Q4 FY27 non-GAAP operating expenses are expected to be approximately $10.7bn. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0117** FY27 tax guidance is 16% to 18%, excluding discrete items and material changes to the tax environment. _[high; FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0119** Q4 FY27 outlook includes an additional week. _[high; Q4 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0125** On the call, Kress said Q4 operating expense guidance reflected the extra week and transition-related costs. _[medium; Q4 FY27]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0126** Kress expected Q4 to mark the gross-margin bottom, with improvement to 72–73% in FY28; this is management guidance. _[medium; FY28]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0877** In Q3 FY27 call Q&A, Kress said supply costs had changed significantly and that NVIDIA absorbed some costs in its margin outlook. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0878** Kress connected the expected Q4 gross-margin bottom to honoring prior customer purchase orders ahead of a move to new pricing; the transcript does not quantify the effect. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0882** For Q4, Kress expected sequential revenue growth to be driven by AI infrastructure demand and the continued Vera Rubin ramp; this is a forecast. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0883** In Q3 FY27 Q&A, Kress said NVIDIA had absorbed some supply costs in the margin figures it provided. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ

## history (10)
- **F0371** NVIDIA was founded on April 5, 1993, by Jensen Huang, Chris Malachowsky, and Curtis Priem. _[high; founding]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/
- **F0372** NVIDIA's founding vision was to bring 3D graphics to gaming and multimedia markets. _[high; ]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/
- **F0373** NVIDIA said its Mellanox combination was expected to unite computing and interconnect technologies used in high-performance computing. _[medium; ]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion
- **F0374** NVIDIA dates its GPU invention milestone to 1999. _[high; 1999]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/
- **F0375** NVIDIA dates its CUDA architecture unveiling to 2006. _[high; 2006]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/
- **F0376** NVIDIA dates the AlexNet neural-network breakthrough it powered to 2012. _[high; 2012]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/about-nvidia/corporate-timeline/
- **F0377** NVIDIA and Mellanox announced that their combination would unite two high-performance-computing companies. _[high; ]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion
- **F0378** The Mellanox agreement provided for an enterprise value of approximately 6.9 billion dollars. _[high; announced]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion
- **F0379** The Mellanox agreement offered 125 dollars per share in cash. _[high; announced]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion
- **F0380** NVIDIA and Mellanox said the acquisition would unite two high-performance-computing companies. _[high; ]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-to-acquire-mellanox-for-6-9-billion

## macro (12)
- **F0415** FRED reports the US 10-year constant-maturity Treasury yield at 4.92% on 2026-11-23. _[high; 2026-11-23]_ — Federal Reserve Bank of St. Louis (2026-11-24) https://fred.stlouisfed.org/series/DGS10
- **F0416** FRED reports the US 10-year constant-maturity Treasury yield at 4.92% on 2026-11-20. _[high; 2026-11-20]_ — Federal Reserve Bank of St. Louis (2026-11-24) https://fred.stlouisfed.org/series/DGS10
- **F0417** FRED reports the US 10-year constant-maturity Treasury yield at 5.04% on 2026-11-19. _[high; 2026-11-19]_ — Federal Reserve Bank of St. Louis (2026-11-24) https://fred.stlouisfed.org/series/DGS10
- **F0418** FRED reports the US 10-year constant-maturity Treasury yield at 5.07% on 2026-11-18. _[high; 2026-11-18]_ — Federal Reserve Bank of St. Louis (2026-11-24) https://fred.stlouisfed.org/series/DGS10
- **F0419** FRED reports the US 10-year constant-maturity Treasury yield at 5.10% on 2026-11-17. _[high; 2026-11-17]_ — Federal Reserve Bank of St. Louis (2026-11-24) https://fred.stlouisfed.org/series/DGS10
- **F0420** FRED reports the monthly effective federal funds rate for Oct 2026 as 3.88%. _[high; Oct 2026]_ — Federal Reserve Bank of St. Louis (2026-11-01) https://fred.stlouisfed.org/series/FEDFUNDS
- **F0421** FRED reports the monthly effective federal funds rate for Sep 2026 as 3.75%. _[high; Sep 2026]_ — Federal Reserve Bank of St. Louis (2026-11-01) https://fred.stlouisfed.org/series/FEDFUNDS
- **F0422** FRED reports the monthly effective federal funds rate for Aug 2026 as 3.63%. _[high; Aug 2026]_ — Federal Reserve Bank of St. Louis (2026-11-01) https://fred.stlouisfed.org/series/FEDFUNDS
- **F0423** Damodaran historical table gives the US implied equity risk premium on the FCFE method as 2.87% for 2000; this is a model estimate, not a realised return. _[medium; 2000]_ — NYU Stern Aswath Damodaran (2026-11-01) https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/implpr.html
- **F0424** Damodaran historical table gives the US implied equity risk premium on the FCFE method as 4.37% for 2007; this is a model estimate, not a realised return. _[medium; 2007]_ — NYU Stern Aswath Damodaran (2026-11-01) https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/implpr.html
- **F0425** Damodaran historical table estimates the US implied equity risk premium at 4.36% in 2009 using the FCFE method; this is an estimate, not realized return. _[medium; 2009]_ — NYU Stern Aswath Damodaran (2026-11-01) https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/implpr.html
- **F0426** SIA says global chip sales were projected to exceed $1.5 trillion in 2026; this is a forecast, not realized sales. _[medium; 2026 forecast]_ — Semiconductor Industry Association (2026-11-25) https://www.semiconductors.org/2026-state-of-the-u-s-semiconductor-industry/

## management (20)
- **F0118** At the earnings release, interim CEO and CFO Colette Kress said Vera Rubin was off to an explosive start and the roadmap was on track. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0381** As of February 20, 2026, NVIDIA listed Jen-Hsun Huang as president and CEO. _[high; as of 2026-02-20]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0382** Huang co-founded NVIDIA in 1993 and the FY2026 10-K said he had served as president, CEO and director since inception. _[high; since NVIDIA inception]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0383** Before NVIDIA, Huang worked at LSI Logic from 1985 to 1993. _[high; 1985–1993]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0384** Huang previously worked as a microprocessor designer for AMD. _[high; ]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0385** Huang holds electrical engineering degrees from Oregon State University and Stanford University. _[high; ]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0386** Kress joined NVIDIA in 2013 as executive vice president and CFO. _[high; joined NVIDIA]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0387** Before NVIDIA, Kress was Cisco SVP and CFO of its Business Technology and Operations Finance organization. _[high; before joining NVIDIA]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0388** Kress held several positions at Microsoft from 1997 to 2010. _[high; 1997–2010]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0389** Kress became CFO of Microsoft Server and Tools in 2006. _[high; beginning 2006]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0390** Before Microsoft, Kress spent eight years in finance roles at Texas Instruments. _[high; before joining Microsoft]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0391** Kress earned a finance degree from the University of Arizona and an MBA from Southern Methodist University. _[high; ]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0392** Ajay Puri joined NVIDIA in 2005 in Worldwide Sales and became EVP of Worldwide Field Operations in 2009. _[high; 2005 and 2009]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0393** Before NVIDIA, Puri held sales, marketing and general management roles at Sun Microsystems over a 22-year career. _[high; pre-NVIDIA career]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0394** Debora Shoquist joined NVIDIA in 2007 and became EVP of Operations in 2009. _[high; 2007 and 2009]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0395** Timothy Teter joined NVIDIA in 2017 as senior vice president, general counsel and secretary and became EVP in February 2018. _[high; 2017 and February 2018]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0396** NVIDIA announced on November 12, 2026 that Huang had resigned as president, CEO and director effective immediately. _[high; 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0397** Kress agreed to serve as interim CEO and continue as EVP and CFO until a permanent successor is named. _[high; interim appointment announced 2026-11-12]_ — NVIDIA via SEC (2026-11-12) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvidiaannouncesceotransiti.htm
- **F0398** On November 23, 2026, NVIDIA announced Huang was reinstated immediately as president, CEO and director. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director
- **F0399** NVIDIA said Kress continued as CFO after her interim CEO service. _[high; 2026-11-23]_ — NVIDIA (2026-11-23) https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director

## market (18)
- **F0427** Stock Analysis reports NVIDIA 52-week low of $124.50 as of 24 November 2026, versus the unverified team Google Finance input of $145.71; reconcile before use. _[medium; 52 weeks to 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0428** Stock Analysis reports NVIDIA 52-week high of $243.37 as of 24 November 2026. _[medium; 52 weeks to 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0429** Stock Analysis reported NVIDIA market capitalisation of $3.75 trillion at its 24 November snapshot. _[medium; 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0430** Stock Analysis reported Apple market capitalisation of $5.15 trillion at its 24 November snapshot. _[medium; 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/aapl/
- **F0431** Stock Analysis reported Microsoft market capitalisation of $3.68 trillion at its 24 November snapshot. _[medium; 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/msft/
- **F0432** MSCI World weighted Microsoft at 4.11% on 30 October 2026. _[high; MSCI World constituents]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0433** MSCI World weighted Broadcom at 1.64% on 30 October 2026. _[high; MSCI World constituents]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0434** MSCI World had 1,248 constituents on 30 October 2026. _[high; MSCI World constituents]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0435** MSCI says the World index covers developed market large and mid caps and approximately 85% of free-float-adjusted market capitalisation in each country. _[high; index methodology]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0436** MSCI states the World index does not pursue ESG objectives. _[high; index profile]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0437** NVIDIA closed at $155.38 on 24 November 2026, versus the unverified team Google Finance input of $152.85; reconcile timestamps and source. _[medium; 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0438** NVIDIA shares fell 5.86% at the 24 November close. _[medium; 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0439** MSCI World weighted NVIDIA at 5.25% on 30 October 2026. _[high; MSCI World constituents]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0440** MSCI World weighted Apple at 5.65% on 30 October 2026. _[high; MSCI World constituents]_ — MSCI (2026-11-24) https://www.msci.com/indexes/index/990100/msci-world-index
- **F0441** The unverified team Google Finance input reports NVIDIA at $152.85 on 24 November 2026; Stock Analysis reports a $155.38 close, so reconcile timing. _[low; team input dated 24 Nov 2026]_ — our data: data/clean/research_market.json
- **F0442** The unverified team Google Finance input reports a 52-week low of $145.71; Yahoo Finance and Stock Analysis report $124.50, requiring reconciliation. _[low; team input dated 24 Nov 2026]_ — our data: data/clean/research_market.json
- **F0473** For the 24 November 2026 regular-session close, use $155.38 from the timestamped Stock Analysis close rather than the unverified team input of $152.85; the latter may reflect a different time and is not a verified close. _[medium; 24 Nov 2026 regular-session close]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/
- **F0675** For the Stock Analysis 24 November snapshot, cite its 52-week low of $124.50; the team’s $145.71 input is unverified and its observation window is unresolved, so the figures cannot yet be reconciled. _[medium; 52 weeks to 24 Nov 2026]_ — Stock Analysis (2026-11-24) https://stockanalysis.com/stocks/nvda/

## networking (25)
- **F0179** NVIDIA completed its Mellanox acquisition in April 2020 for a $7 billion transaction value. _[high; 2020-04-27]_ — NVIDIA (2020-04-27) https://nvidianews.nvidia.com/news/nvidia-completes-acquisition-of-mellanox-creating-major-force-driving-next-gen-data-centers
- **F0180** NVIDIA says NVLink is its scale-up fabric connecting GPUs within a compute domain. _[high; 2026-07-20]_ — NVIDIA (2026-11-25) https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/
- **F0181** NVIDIA describes scale-out networks as connecting servers across the data center. _[high; 2026-07-20]_ — NVIDIA (2026-11-25) https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/
- **F0182** NVIDIA specifies sixth-generation NVLink at 3.6 TB/s bidirectional bandwidth per GPU in Vera Rubin NVL72. _[high; 2026-07-20]_ — NVIDIA (2026-11-25) https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/
- **F0183** NVIDIA describes Spectrum-X800 Ethernet as using its SN5600 switch and BlueField-3 SuperNIC for multi-tenant AI clouds and enterprises. _[high; 2024-03-18]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/networking-switches-gpu-computing-ai
- **F0184** In 2025 NVIDIA said Meta would integrate Spectrum Ethernet switches with its FBOSS networking platform. _[high; 2025-10-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-spectrum-x-ethernet-switches-speed-up-networks-for-meta-and-oracle
- **F0185** In 2025 NVIDIA said Oracle would use Spectrum-X Ethernet to interconnect planned Vera Rubin AI factories. _[high; 2025-10-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-spectrum-x-ethernet-switches-speed-up-networks-for-meta-and-oracle
- **F0186** Broadcom specifies its Tomahawk 5 BCM78900 switch chip at up to 51.2 Tb/s of network connectivity. _[high; as of 2026-11-25]_ — Broadcom (2026-11-25) https://www.broadcom.com/products/ethernet-connectivity/switching/strataxgs/bcm78900-series
- **F0187** Broadcom says Tomahawk 5 supports adaptive routing, load balancing and congestion control for AI workloads. _[high; as of 2026-11-25]_ — Broadcom (2026-11-25) https://www.broadcom.com/products/ethernet-connectivity/switching/strataxgs/bcm78900-series
- **F0188** NVIDIA says low-bandwidth or high-latency fabrics can erase expert parallelism gains through communication overhead. _[high; 2026-07-20]_ — NVIDIA (2026-11-25) https://developer.nvidia.com/blog/nvidia-nvlink-the-scale-up-network-for-ai-factories/
- **F0189** NVIDIA identifies Quantum-X800 as an InfiniBand platform for AI-dedicated infrastructure. _[high; 2024-03-18]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/networking-switches-gpu-computing-ai
- **F0190** NVIDIA reports Spectrum-X uses congestion control, adaptive routing and telemetry as part of its Ethernet platform. _[high; 2025-10-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-spectrum-x-ethernet-switches-speed-up-networks-for-meta-and-oracle
- **F0955** Canonical says InfiniBand integrates RDMA into its transport model, unlike RDMA adapted onto an existing network stack. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0956** Canonical says InfiniBand link-layer flow control is lossless, with reliability and ordering supplied by its transport layer. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0957** Canonical says mis-cabled links and uneven port use can reduce InfiniBand bisection bandwidth. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0958** Canonical warns that misaligned drivers, user-space libraries, firmware and kernel versions may cause InfiniBand latency spikes or reduced throughput. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0959** Canonical warns InfiniBand software-stack mismatches may show up as latency spikes or reduced throughput. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0960** Canonical says InfiniBand introduces additional hardware and operational considerations compared with Ethernet. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0961** Canonical expects InfiniBand to coexist with Ethernet as a specialised fabric where performance justifies its operational trade-offs. _[medium; 2026-06-02]_ — Canonical (2026-11-25) https://ubuntu.com/blog/what-is-infiniband
- **F0962** Broadcom specifies that its BCM78900 switch family supports up to 64 800GbE ports, 128 400GbE ports or 256 200GbE ports. _[high; 2026-11-25]_ — Broadcom (2026-11-25) https://www.broadcom.com/products/ethernet-connectivity/switching/strataxgs/bcm78900-series
- **F0963** The InfiniBand Trade Association reports InfiniBand connected 63 of the top 100 systems on the June 2023 TOP500 list; this is a historical supercomputer count, not current AI networking revenue share. _[medium; June 2023]_ — InfiniBand Trade Association (2026-11-25) https://infinibandta.org/about-infiniband/
- **F0964** NVIDIA said FY26 Data Center networking revenue grew 142% year on year, driven by NVLink for GB200 and GB300 and growth in Ethernet and InfiniBand. _[high; FY26]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0965** Under its previous Data Center sub-market definition, NVIDIA reported Q1 FY27 networking revenue rose 35% sequentially; this is the company’s reported growth, not a derived prior-quarter revenue. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0966** In Q2 FY27 NVIDIA said a company was reclassified from ACIE to Hyperscale and its prior-period revenue was recast, making old sub-market figures unsafe to compare without checking the recast. _[high; Q2 FY27]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0967** Google Finance’s Q3 FY27 call transcript quotes management saying networking franchise revenue exceeded $21 billion; comparability with the old Data Center networking line is unverified. _[medium; Q3 FY27]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ

## peers (26)
- **F0483** Broadcom FY2025 revenue was $63,887 million, up 24% year over year. _[high; FY2025]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-fourth-quarter-and-fiscal-year-2025
- **F0484** Broadcom FY2025 adjusted EBITDA was $43.0 billion, up 35% year over year. _[high; FY2025]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-fourth-quarter-and-fiscal-year-2025
- **F0485** Broadcom FY2025 free cash flow was $26.9 billion on its company definition. _[high; FY2025]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-fourth-quarter-and-fiscal-year-2025
- **F0486** Broadcom Q2 FY2026 AI semiconductor revenue was $10.8 billion, up 143% year over year; it includes custom AI accelerators and networking. _[high; Q2 FY2026]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial
- **F0487** Broadcom expected Q3 FY2026 AI semiconductor revenue of $16.0 billion; this was guidance as of June 3, 2026. _[high; Q3 FY2026 guidance]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial
- **F0488** Broadcom Q2 FY2026 revenue was $22,187 million, up 48% year over year. _[high; Q2 FY2026]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial
- **F0489** Broadcom guided Q3 FY2026 revenue to approximately $29.4 billion in June 2026; later results were not verified. _[high; Q3 FY2026 guidance]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial
- **F0490** AMD Q3 2026 revenue was $13.4 billion with GAAP gross margin of 54%. _[high; Q3 2026]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0491** AMD Q3 2026 revenue increased 45% year over year. _[high; Q3 2026]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0492** AMD Q3 2026 Data Center revenue was $8.5 billion, up 97% year over year; it includes EPYC CPUs as well as Instinct GPUs. _[high; Q3 2026]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0493** AMD guided Q4 2026 revenue to approximately $17 billion plus or minus 3%, as of November 3. _[high; Q4 2026 guidance]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F0494** AMD expected Q4 2026 non-GAAP gross margin of approximately 55%, as of November 3. _[high; Q4 2026 guidance]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F1004** The Bloomberg segment export shows NVIDIA Data Center revenue of USD 193.737 billion for its full year ended January 2026. _[high; FY26 ended January 2026]_ — our data: data/clean/peers_datacenter_revenue.json
- **F1005** The Bloomberg segment export shows AMD Data Center revenue of USD 16.635 billion for its full year ended December 2025. _[high; FY25 ended December 2025]_ — our data: data/clean/peers_datacenter_revenue.json
- **F1006** The Bloomberg consensus snapshot puts NVIDIA operating margin at 65.58% for its current fiscal year. _[medium; Current fiscal year consensus]_ — our data: data/clean/peers_operating_margin.json
- **F1007** The Bloomberg consensus snapshot puts Broadcom operating margin at 66.94% for its current fiscal year. _[medium; Current fiscal year consensus]_ — our data: data/clean/peers_operating_margin.json
- **F1008** The Bloomberg consensus snapshot expects AMD EPS to grow 119.704% from its current fiscal year to the next. _[medium; Next fiscal year versus current fiscal year consensus]_ — our data: data/clean/peers_growth.json
- **F1009** The Bloomberg consensus snapshot expects NVIDIA EPS to grow 72.095% from its current fiscal year to the next. _[medium; Next fiscal year versus current fiscal year consensus]_ — our data: data/clean/peers_growth.json
- **F1011** The Bloomberg consensus snapshot puts TSMC operating margin at 58.83% for its current fiscal year. _[medium; Current fiscal year consensus]_ — our data: data/clean/peers_operating_margin.json
- **F1018** The 20 Nov Bloomberg peer snapshot puts TSMC at 17.98x forward earnings. _[medium; Fiscal year ending around Dec 2026 or Jan 2027]_ — our data: data/clean/peers_pe.json
- **F1020** The 20 Nov Bloomberg-derived peer dataset puts Broadcom at 0.403x PEG. _[medium; 20 Nov 2026 snapshot]_ — our data: data/clean/peers_peg.json
- **F1022** The 20 Nov Bloomberg peer dataset puts TSMC at 11.92x forward EV/EBITDA. _[medium; Forward multiple; 20 Nov 2026 snapshot]_ — our data: data/clean/peers_ev_ebitda.json
- **F1088** AMD reported $3,722 million in Client and Gaming segment revenue for Q3 2026. _[high; Q3 2026 ended 2026-09-26]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F1089** AMD reported $1,109 million in Embedded segment revenue for Q3 2026. _[high; Q3 2026 ended 2026-09-26]_ — AMD (2026-11-25) https://ir.amd.com/news-events/press-releases/detail/1303/amd-reports-third-quarter-2026-financial-results
- **F1090** Broadcom reported $15,009 million of Semiconductor Solutions revenue in Q2 FY2026, including its AI semiconductor business. _[high; Q2 FY2026 ended 2026-05-03]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial
- **F1091** Broadcom reported $7,178 million of Infrastructure Software revenue in Q2 FY2026. _[high; Q2 FY2026 ended 2026-05-03]_ — Broadcom (2026-11-25) https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial

## products (13)
- **F0359** Blackwell architecture GPUs contain 208 billion transistors, according to NVIDIA. _[medium; 2024 announcement]_ — NVIDIA (2024-03-18) https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
- **F0360** GB200 NVL72 combines 72 Blackwell GPUs and 36 Grace CPUs in a rack, according to NVIDIA. _[medium; 2024 announcement]_ — NVIDIA (2024-03-18) https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
- **F0361** NVIDIA projected up to 30x greater LLM inference performance for GB200 NVL72 than the same number of H100 GPUs. _[medium; 2024 announcement]_ — NVIDIA (2024-03-18) https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
- **F0362** NVIDIA projected up to 25x lower inference cost and energy for GB200 NVL72 than the same number of H100 GPUs; this is a vendor upper-bound claim. _[medium; 2024 announcement]_ — NVIDIA (2024-03-18) https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing
- **F0363** NVIDIA claims Blackwell Ultra Tensor Cores have 1.5x the AI compute FLOPS of Blackwell GPUs. _[medium; vendor specification as of 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
- **F0364** NVIDIA claims Blackwell Ultra Tensor Cores provide 2x the attention-layer acceleration of Blackwell GPUs. _[medium; vendor specification as of 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/
- **F0365** On 5 January 2026 NVIDIA said Rubin was in full production and partner products would be available in the second half of 2026; this was a launch-time forecast. _[medium; 2026-01-05 announcement]_ — NVIDIA (2026-01-05) https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer
- **F0366** NVIDIA specifies Vera CPU has 88 custom Olympus cores and Armv9.2 compatibility. _[medium; 2026 announcement]_ — NVIDIA (2026-01-05) https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer
- **F0367** NVIDIA rates the Rubin GPU at 50 petaflops of NVFP4 inference compute. _[medium; 2026 announcement]_ — NVIDIA (2026-01-05) https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer
- **F0368** NVIDIA projected Rubin rack assembly and servicing could be up to 18x faster than Blackwell. _[medium; 2026 announcement]_ — NVIDIA (2026-01-05) https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer
- **F0369** NVIDIA specifies the Vera Rubin NVL72 rack includes 72 Rubin GPUs and 36 Vera CPUs. _[medium; as of 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/
- **F0370** NVIDIA states its Rubin versus GB200 training comparison assumes a 10T MoE model trained on 100T tokens over one month and is projected. _[medium; as of 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/
- **F0509** MLCommons reported that its September 2026 Inference v6.1 results included preview NVIDIA Rubin and Vera Rubin NVL72 systems; the announcement does not establish a power measurement. _[high; 2026-09-16]_ — MLCommons (2026-09-16) https://mlcommons.org/2026/09/mlperf-inference-v6-1-results/?view=release

## regulation (16)
- **F0216** NVIDIA and SoftBank terminated the proposed Arm acquisition because regulatory challenges prevented completion. _[high; ]_ — NVIDIA (2022-02-07) https://nvidianews.nvidia.com/news/nvidia-and-softbank-group-announce-termination-of-nvidias-acquisition-of-arm-limited
- **F0217** On termination, SoftBank was to retain the $1.25 billion NVIDIA had prepaid. _[high; 2022 termination]_ — NVIDIA (2022-02-07) https://nvidianews.nvidia.com/news/nvidia-and-softbank-group-announce-termination-of-nvidias-acquisition-of-arm-limited
- **F0218** On termination, NVIDIA retained its 20-year Arm licence. _[high; 2022 termination]_ — NVIDIA (2022-02-07) https://nvidianews.nvidia.com/news/nvidia-and-softbank-group-announce-termination-of-nvidias-acquisition-of-arm-limited
- **F0219** The CMA cancelled its Arm merger inquiry after the proposed transaction was abandoned; it did not clear the deal. _[high; ]_ — UK CMA (2026-11-25) https://www.gov.uk/cma-cases/nvidia-slash-arm-merger-inquiry
- **F0220** The UK referred the proposed Arm acquisition for an in-depth inquiry over competition and national security concerns. _[high; ]_ — UK CMA (2026-11-25) https://www.gov.uk/cma-cases/nvidia-slash-arm-merger-inquiry
- **F0221** The CMA said its Arm inquiry issues statement outlined theories, not findings or conclusions. _[high; ]_ — UK CMA (2026-11-25) https://www.gov.uk/cma-cases/nvidia-slash-arm-merger-inquiry
- **F0222** US, UK and EU competition authorities identified specialised chips, compute, data and expertise as critical foundation-model inputs. _[high; ]_ — UK CMA, US DOJ, FTC and European Commission (2024-07-23) https://www.gov.uk/government/publications/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products
- **F0223** The authorities warned that concentrated control of AI inputs could put a small number of companies in a position to exploit bottlenecks. _[high; ]_ — UK CMA, US DOJ, FTC and European Commission (2024-07-23) https://www.gov.uk/government/publications/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products
- **F0224** The authorities said they would scrutinise mechanisms of lock-in that prevent meaningful choice. _[high; ]_ — UK CMA, US DOJ, FTC and European Commission (2024-07-23) https://www.gov.uk/government/publications/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products
- **F0225** The authorities said AI partnerships and investments can sometimes undermine or coopt competitive threats, although they need not harm competition. _[high; ]_ — UK CMA, US DOJ, FTC and European Commission (2024-07-23) https://www.gov.uk/government/publications/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products/joint-statement-on-competition-in-generative-ai-foundation-models-and-ai-products
- **F0226** The European Commission says the EU AI Act takes a risk-based approach to developers and deployers for specific AI uses. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **F0227** The Commission says general-purpose AI model rules became effective in August 2025. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **F0228** The Commission says providers of general-purpose AI models that may pose systemic risks should assess and mitigate those risks. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **F0229** The Commission says the AI Act does not introduce rules for AI deemed minimal or no risk. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **F0230** The Commission says generative AI providers must ensure AI-generated content is identifiable. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- **F0231** The Commission says AI Act transparency rules take effect in August 2026. _[high; ]_ — European Commission (2026-11-25) https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai

## risks (19)
- **F0232** NVIDIA depends on foundries to fabricate its semiconductor wafers. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0233** NVIDIA contracts independent subcontractors for assembly, testing and packaging. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0234** NVIDIA says reliable supply from overseas partners, especially Taiwan and South Korea, is important to its business. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0235** NVIDIA warns that supply restrictions involving Taiwan or South Korea would harm its business and financial results. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0236** NVIDIA says its continuity and disaster recovery planning may not cover all eventualities. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0237** NVIDIA warns supply-chain geopolitical tensions could materially harm the company. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0238** NVIDIA says it is highly dependent on its longstanding executive team. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0239** NVIDIA warns failed succession planning and knowledge transfer could hinder its long-term success. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0240** NVIDIA warns that energy, capital or data-centre shortages could affect future revenue and performance. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0241** NVIDIA says publicly announced purchase intentions are often non-binding and may not translate into committed orders. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0242** NVIDIA warns demand estimation errors may cause revenue or supply volatility. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0243** NVIDIA says litigation can be costly, time-consuming and disruptive regardless of outcome. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0244** NVIDIA warns sustainability disclosure and oversight may fall short of evolving stakeholder expectations or legal requirements. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0245** NVIDIA warns AI raises legal, social and ethical issues that could affect adoption. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0246** The securities class action was remanded for further proceedings after the Ninth Circuit judgment took effect, according to the FY26 filing. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0247** NVIDIA said potential losses from the disclosed legal matters could not reasonably be estimated as of its FY26 filing. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0248** NVIDIA disclosed that the class action alleges misleading statements about channel inventory and cryptocurrency mining demand; these are allegations. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0249** The U.S. Supreme Court dismissed NVIDIA’s certiorari petition as improvidently granted; the FY26 filing records no merits ruling by the Court. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0250** As of the FY26 filing date, NVIDIA said losses in the disclosed legal proceedings were reasonably possible but not probable, with no accrued contingent liabilities. _[high; FY2026 annual report]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf

## segments (41)
- **F0115** Q3 FY27 Data Center revenue was $107.6bn, up 21% sequentially and 110% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0116** Q3 FY27 Edge Computing revenue was $8.2bn, up 14% sequentially and 42% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0120** Q3 FY27 Data Center revenue grew 110% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0121** Q3 FY27 Edge Computing revenue grew 42% year on year. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0128** Bloomberg project data records FY25 Q4 Data Center revenue at $35.58 billion. _[high; FY25 Q4]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0129** Bloomberg project data records FY26 Q1 Data Center revenue at $39.112 billion. _[high; FY26 Q1]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0130** Bloomberg project data records FY26 Q2 Data Center revenue at $41.096 billion. _[high; FY26 Q2]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0131** Bloomberg project data records FY26 Q3 Data Center revenue at $51.215 billion. _[high; FY26 Q3]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0132** Bloomberg project data records FY26 Q4 Data Center revenue at $62.314 billion. _[high; FY26 Q4]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0133** Bloomberg project data records FY27 Q1 Data Center revenue at $75.246 billion. _[high; FY27 Q1]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0134** Bloomberg project data records FY27 Q2 Data Center revenue at $89.023 billion. _[high; FY27 Q2]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0135** Data Center compute revenue was $60.4 billion in Q1 FY27, up 77% year on year. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0136** Data Center networking revenue was $14.8 billion in Q1 FY27, up 199% year on year. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0137** Gaming revenue was $3.7 billion in Q4 FY26, down 13% sequentially. _[high; Q4 FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0138** Professional Visualization revenue was $1.3 billion in Q4 FY26, up 159% year on year. _[high; Q4 FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0139** Automotive revenue was $604 million in Q4 FY26, up 6% year on year. _[high; Q4 FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0140** Gaming revenue was $4.3 billion in Q3 FY26, down 1% sequentially. _[high; Q3 FY26]_ — NVIDIA (2025-11-19) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2026
- **F0141** Professional Visualization revenue was $760 million in Q3 FY26, up 56% year on year. _[high; Q3 FY26]_ — NVIDIA (2025-11-19) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2026
- **F0142** Automotive revenue was $592 million in Q3 FY26, up 32% year on year. _[high; Q3 FY26]_ — NVIDIA (2025-11-19) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2026
- **F0143** Gaming revenue was $4.3 billion in Q2 FY26, up 49% year on year. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0144** Professional Visualization revenue was $601 million in Q2 FY26, up 32% year on year. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0145** Automotive revenue was $586 million in Q2 FY26, up 69% year on year. _[high; Q2 FY26]_ — NVIDIA (2025-08-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2026
- **F0146** Edge Computing revenue was $7.2 billion in Q2 FY27, up 27% year on year. _[high; Q2 FY27]_ — NVIDIA (2026-08-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027
- **F0147** Edge Computing revenue was $6.4 billion in Q1 FY27, up 29% year on year. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0148** Starting in Q1 FY27 NVIDIA moved to Data Center and Edge Computing market platforms; Edge includes PCs, consoles, workstations, robotics and automotive. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0149** Bloomberg project data records preliminary Q3 FY27 Data Center revenue at $107.610 billion. _[medium; FY27 Q3]_ — our data: data/clean/nvda_datacenter_quarterly.json
- **F0178** For Q3 FY27 Data Center revenue, use NVIDIA’s reported $107.6 billion when citing company results: the preliminary Bloomberg figure of $107.610 billion rounds to the same value at that precision. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0881** Kress attributed sequential Edge Computing growth to stronger enterprise demand for Blackwell workstations and edge compute for physical AI. _[medium; Q3 FY27 earnings call]_ — Google Finance (2026-11-25) https://www.google.com/finance/quote/NVDA:NASDAQ
- **F0884** Q4 FY25 Gaming revenue was $2.5 billion, down 22% sequentially and 11% year on year. _[high; Q4 FY25]_ — NVIDIA (2025-02-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025
- **F0885** Q4 FY25 Professional Visualization revenue was $511 million, up 5% sequentially. _[high; Q4 FY25]_ — NVIDIA (2025-02-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025
- **F0886** Q4 FY25 Automotive revenue was $570 million, up 27% sequentially. _[high; Q4 FY25]_ — NVIDIA (2025-02-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2025
- **F0887** Q1 FY26 Gaming revenue was $3.8 billion, up 48% sequentially. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0888** Q1 FY26 Professional Visualization revenue was $509 million; NVIDIA described it as flat sequentially. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0889** Q1 FY26 Automotive revenue was $567 million, down 1% sequentially. _[high; Q1 FY26]_ — NVIDIA (2025-05-28) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2026
- **F0890** NVIDIA said Hyperscale would include public clouds and the world’s largest consumer internet companies; ACIE addresses AI purpose-built data centers and AI factories across industries and countries. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0891** NVIDIA describes Edge Computing as including PCs, consoles, workstations, AI-RAN base stations, robotics and automotive; it is broader than any one legacy market. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F1028** Bloomberg shows NVIDIA data center of $10.613 billion in FY22. _[high; FY22]_ — our data: data/clean/nvda_segments_annual.json
- **F1029** Bloomberg shows NVIDIA gaming of $12.462 billion in FY22. _[high; FY22]_ — our data: data/clean/nvda_segments_annual.json
- **F1030** Bloomberg shows NVIDIA gaming of $16.042 billion in FY26. _[high; FY26]_ — our data: data/clean/nvda_segments_annual.json
- **F1055** Bloomberg FA reports NVIDIA Gaming revenue of $9.067 billion in FY23. _[high; FY23]_ — our data: data/clean/nvda_segments_annual.json
- **F1056** Bloomberg FA reports NVIDIA Data Center revenue of $15.005 billion in FY23. _[high; FY23]_ — our data: data/clean/nvda_segments_annual.json

## shareholder-returns (21)
- **F0314** NVIDIA increased its buyback authorisation by $150 billion without expiration in September 2026. _[high; September 2026]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0315** NVIDIA returned $28.1 billion via repurchases and dividends in Q3 FY27. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0316** About $227.3 billion of repurchase authority remained at the end of Q3 FY27. _[high; Q3 FY27 end]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0317** The declared December 2026 quarterly dividend is $0.25 per share. _[high; December 2026]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0318** NVIDIA returned approximately $26.0 billion in buybacks and dividends in Q2 FY27. _[high; Q2 FY27]_ — NVIDIA (2026-08-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027
- **F0319** About $99.0 billion of repurchase authority remained at the end of Q2 FY27. _[high; Q2 FY27 end]_ — NVIDIA (2026-08-26) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-second-quarter-fiscal-2027
- **F0320** NVIDIA returned approximately $20.0 billion via repurchases and dividends in Q1 FY27. _[high; Q1 FY27]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0321** The board approved an additional $80 billion in repurchase authority on May 18, 2026, with no expiry. _[high; May 2026]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027
- **F0322** NVIDIA returned $41.1 billion via repurchases and dividends in FY26. _[high; FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0323** The June 2024 ten-for-one stock split increased the share count mechanically. _[high; June 2024]_ — NVIDIA (2024-05-22) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2025
- **F0324** Since Q1 FY27, NVIDIA non-GAAP measures no longer exclude stock-based compensation expense. _[high; Since Q1 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0325** In Q3 FY27 diluted weighted-average shares were 24,186 million. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0326** In Q4 FY26 diluted weighted-average shares were 24,432 million. _[high; Q4 FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0327** Q3 FY27 stock-based compensation expense was $2,088 million. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0328** FY26 stock-based compensation expense was $6,386 million. _[high; FY26]_ — NVIDIA (2026-02-25) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-fourth-quarter-and-fiscal-2026
- **F0329** In Q3 FY26 diluted weighted-average shares were 24,483 million. _[high; Q3 FY26]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F0330** NVIDIA updated historical non-GAAP financial information to include stock-based compensation expense. _[high; Q3 FY27 release]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1023** NVIDIA reported $22,122 million in payments related to common stock repurchases in Q3 FY27. _[high; Q3 FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1075** NVIDIA reported $4,753 million of stock-based compensation expense in the first nine months of FY26. _[high; First nine months of FY26]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1076** NVIDIA reported $6,042 million of stock-based compensation expense in the first nine months of FY27. _[high; First nine months of FY27]_ — NVIDIA (2026-11-17) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-third-quarter-fiscal-2027
- **F1093** NVIDIA said its former quarterly cash dividend was $0.01 per share when it raised the payment to $0.25 per share in May 2026. _[high; May 2026 announcement]_ — NVIDIA (2026-05-27) https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027

## software-cuda (43)
- **F0164** NVIDIA introduced CUDA in 2006 to let computational workloads use GPU throughput independently of graphics APIs. _[high; 2006]_ — NVIDIA (2026-11-25) https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/introduction.html
- **F0165** NVIDIA identifies cuBLAS, cuFFT, cuDNN and CUTLASS as libraries that avoid reimplementing established algorithms. _[high; 2026-11-25]_ — NVIDIA (2026-11-25) https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/introduction.html
- **F0166** NVIDIA says many AI frameworks gain GPU acceleration through specialized GPU libraries. _[high; 2026-11-25]_ — NVIDIA (2026-11-25) https://docs.nvidia.com/cuda/cuda-programming-guide/01-introduction/introduction.html
- **F0167** NVIDIA says the CUDA toolkit includes GPU-accelerated libraries, debugging and optimization tools, a C/C++ compiler and a runtime. _[high; 2026-11-25]_ — NVIDIA (2026-11-25) https://developer.nvidia.com/cuda/toolkit
- **F0168** AMD says HIP enables existing NVIDIA CUDA code to be converted to run on AMD GPUs. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html
- **F0169** AMD says HIPIFY tools automatically translate CUDA code to HIP code. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html
- **F0170** AMD advises porting an application incrementally and testing each converted section. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html
- **F0171** AMD says most CUDA libraries have a corresponding HIP library. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html
- **F0172** AMD documents that the CUDA memory type cudaMemoryTypeUnregistered is not currently supported as a HIP memory type. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html
- **F0173** Triton describes itself as a language and compiler for parallel programming. _[high; 2026-11-25]_ — Triton (2026-11-25) https://triton-lang.org/main/index.html
- **F0174** Intel describes oneAPI as including libraries, open-source repositories, SYCL-based C++ extensions and reference implementations. _[high; 2026-11-25]_ — Intel (2026-11-25) https://www.intel.com/content/www/us/en/developer/tools/oneapi/overview.html
- **F0175** NVIDIA describes AI Enterprise as a commercially supported suite of AI software and GPU orchestration tools. _[high; 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/products/ai-enterprise/
- **F0176** NVIDIA offers a free production trial license for AI Enterprise lasting 90 days. _[high; trial]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/products/ai-enterprise/
- **F0177** NVIDIA offers free downloads of AI and data-science components for developing and prototyping on customers’ infrastructure. _[high; 2026-11-25]_ — NVIDIA (2026-11-25) https://www.nvidia.com/en-us/data-center/products/ai-enterprise/
- **F0926** In its FY2023 Form 10-K, NVIDIA reported 3.8 million developers worldwide using CUDA and its other software tools; this is not a CUDA-only count. _[high; FY2023]_ — NVIDIA (2023-02-24) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2023.pdf
- **F0927** In its FY2024 Form 10-K, NVIDIA reported over 4.7 million developers worldwide using CUDA and its other software tools; the figure is a lower bound. _[high; FY2024]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0928** In its FY2026 Form 10-K, NVIDIA reported over 7.5 million developers worldwide using CUDA and its other software tools; this is not a CUDA-only count. _[high; FY2026]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0929** NVIDIA’s 2024 annual review said its broader ecosystem spanned nearly 5 million developers and 40,000 companies; this is not a CUDA-only developer count. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0930** NVIDIA’s 2024 annual review said CUDA offered developers more than 300 libraries alongside models, SDKs and GPU-accelerated applications; this is a lower bound, not a current count. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0931** NVIDIA’s 2024 annual review said CUDA had more than 48 million downloads; downloads do not measure unique users. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0932** NVIDIA’s 2024 annual review said the CUDA offering included 600 AI models; the company did not describe all of them as libraries. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0933** NVIDIA’s 2024 annual review listed 3,500 GPU-accelerated applications in its CUDA offering; applications are a separate category from libraries. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0934** NVIDIA’s 2024 annual review said its broader ecosystem spanned 40,000 companies; this is not a count of CUDA-paying customers. _[high; 2024 annual review]_ — NVIDIA (2026-11-25) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf?download=1
- **F0935** NVIDIA says its cuPotential library was being adopted by several named drug-discovery organizations; the statement establishes named adoption, not market share. _[medium; 2026 NVIDIA blog]_ — NVIDIA (2026-11-25) https://blogs.nvidia.com/blog/cuda-x-libraries-agents-accelerate-scientific-discovery/
- **F0936** NVIDIA describes cuSpa as newly open source and says it accelerates cell-polygon calculations for spatial graphs; this is a company description rather than an independent comparison. _[medium; 2026 NVIDIA blog]_ — NVIDIA (2026-11-25) https://blogs.nvidia.com/blog/cuda-x-libraries-agents-accelerate-scientific-discovery/
- **F0937** NVIDIA offers paid AI Enterprise licenses in addition to software integral to its data-centre platform; the filing does not give a separate amount in this statement. _[high; FY2026]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0938** NVIDIA groups AI solutions and software with data-centre computing, networking and automotive in Compute & Networking, preventing the segment total from serving as software revenue. _[high; FY2026]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0939** NVIDIA cautioned that its standalone software business models may not succeed or produce meaningful software or services sales. _[high; FY2026]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0940** NVIDIA said its revenue was derived primarily from product sales including hardware and systems in its FY2026 accounting policy. _[high; FY2026]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0941** At January 25, 2026 NVIDIA reported $2.3 billion in remaining performance obligations for contracts longer than a year; this is a mixed contract balance, not software revenue. _[high; 2026-01-25]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0942** At July 26, 2026 NVIDIA reported $3.2 billion in remaining performance obligations for contracts longer than a year; this is not software revenue or a run rate. _[high; 2026-07-26]_ — NVIDIA / SEC (2026-08-26) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm
- **F0943** NVIDIA says its unearned revenue includes hardware and software support and cloud services, so it cannot be treated as a software-only measure. _[high; FY2026]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0944** In its FY2024 filing NVIDIA said software license revenue was recognized upfront when software became available, which differs from the treatment of support. _[high; FY2024]_ — NVIDIA (2024-02-21) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf
- **F0945** In its FY2024 filing NVIDIA said software support revenue was recognized over the service period or as services were performed. _[high; FY2024]_ — NVIDIA (2024-02-21) https://www.annualreports.com/HostedData/AnnualReportArchive/n/NASDAQ_NVDA_2024.pdf
- **F0946** As accessed on November 25, 2026, the upstream Triton repository lists NVIDIA GPUs with compute capability 8.0 or newer as supported hardware; this is a backend support statement, not an application portability guarantee. _[high; 2026-11-25]_ — Triton project (2026-11-25) https://github.com/triton-lang/triton
- **F0947** As accessed on November 25, 2026, upstream Triton lists AMD GPUs with ROCm 6.2 or newer as supported hardware; this alone does not establish comparable performance. _[high; 2026-11-25]_ — Triton project (2026-11-25) https://github.com/triton-lang/triton
- **F0948** The upstream Triton repository lists CPUs as under development as of access on November 25, 2026. _[high; 2026-11-25]_ — Triton project (2026-11-25) https://github.com/triton-lang/triton
- **F0949** Intel describes its XPU Triton backend as an out-of-tree module for Intel GPUs rather than upstream Triton support. _[high; 2026-11-25]_ — Intel Triton backend project (2026-11-25) https://github.com/intel/intel-xpu-backend-for-triton
- **F0950** Intel says the XPU Triton backend is incompatible with Intel Extension for PyTorch and Intel oneAPI Base Toolkit; users must check the applicable stack. _[high; 2026-11-25]_ — Intel Triton backend project (2026-11-25) https://github.com/intel/intel-xpu-backend-for-triton
- **F0951** Intel states that PyTorch on XPU installed from its linked binaries includes Triton unless a user needs the latest main-branch version. _[high; 2026-11-25]_ — Intel Triton backend project (2026-11-25) https://github.com/intel/intel-xpu-backend-for-triton
- **F0952** Intel says its Triton XPU repository supplies modified tutorials; this is evidence of adaptation, not a quantified migration cost. _[high; 2026-11-25]_ — Intel Triton backend project (2026-11-25) https://github.com/intel/intel-xpu-backend-for-triton
- **F0953** Intel advises profiling end-to-end and kernel performance separately for its Triton XPU backend; portability alone does not establish performance parity. _[high; 2026-11-25]_ — Intel Triton backend project (2026-11-25) https://github.com/intel/intel-xpu-backend-for-triton
- **F0954** AMD documents that cudaMemoryTypeUnregistered is not currently supported as a hipMemoryType enum due to HIP functionality backward compatibility. _[high; 2026-11-25]_ — AMD (2026-11-25) https://rocm.docs.amd.com/projects/HIP/en/latest/how-to/hip_porting_guide.html

## sovereign-ai (41)
- **F0091** At Isambard-AI, Bristol reports 5,448 NVIDIA GH200 superchips. _[high; 2026-06-05]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0092** Isambard-AI became operational in mid-2025, with real users from August. _[high; 2025]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0093** The UK government plans at least a 20-fold expansion of AIRR capacity by 2030. _[high; 2030 target]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0094** The government committed an additional £1 billion to scale UK compute; this is not NVIDIA revenue. _[high; commitment as of 2026-09-28]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0095** Government expects combined investment in Isambard-AI and Zenith of over around £350 million by 2030, not an NVIDIA contract value. _[high; through 2030]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0096** AIRR Dawn uses 1,024 Intel GPU Max 1550 processors, demonstrating a non-NVIDIA supplier. _[high; as of 2026-09-28]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0097** Zenith, another AIRR system, was built with AMD, Dell and StackHPC. _[high; as of 2026-09-28]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0098** Bristol says the UK Sovereign AI programme has £500 million in government funding and provides portfolio companies dedicated Isambard-AI access; the sum is not NVIDIA revenue. _[high; as of 2026-06-05]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0099** Bristol says Isambard-AI uses a closed-loop coolant and water system. _[high; as of 2026-06-05]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0100** Bristol reports an Isambard-AI PUE around 1.08; this is a facility-efficiency metric, not total energy use or emissions. _[high; as of 2026-06-05]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0101** The University of Bristol described Isambard-AI as a £225 million facility on launch, not an NVIDIA sale figure. _[high; 2025-07-17]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2025/isambard-ai-launches-july-2025.html
- **F0102** AIRR rapid access offers up to 20,000 GPU hours within three months of project start. _[high; as of 2026-09-28]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk
- **F0730** In its 13 May 2025 announcement, NVIDIA said HUMAIN planned AI factories in Saudi Arabia with projected capacity of up to 500 MW over five years. _[high; announced 2025-05-13, projected over five years]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
- **F0731** NVIDIA said the planned HUMAIN factories would use several hundred thousand NVIDIA GPUs over five years; this was a projection. _[high; announced 2025-05-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
- **F0732** NVIDIA described the first HUMAIN deployment phase as an 18,000 GB300 Grace Blackwell AI supercomputer, a future deployment at announcement. _[high; announced 2025-05-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
- **F0733** NVIDIA and SDAIA announced plans for up to 5,000 Blackwell GPUs for a Saudi sovereign AI factory. _[high; announced 2025-05-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
- **F0734** HUMAIN planned to deploy Saudi Arabia’s first NVIDIA Omniverse Cloud for physical AI simulation. _[high; announced 2025-05-13]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/saudi-arabia-and-nvidia-to-build-ai-factories-to-power-next-wave-of-intelligence-for-the-age-of-reasoning
- **F0735** G42 announced Stargate UAE as a planned 1 GW compute cluster to be built by G42 and operated by OpenAI and Oracle. _[high; announced 2025-05-22]_ — G42 (2026-11-25) https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
- **F0736** G42 said the first 200 MW Stargate UAE cluster was expected to go live in 2026; the announcement does not establish completion. _[high; announced 2025-05-22; expected 2026]_ — G42 (2026-11-25) https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
- **F0737** G42 said NVIDIA would supply Grace Blackwell GB300 systems for Stargate UAE. _[high; announced 2025-05-22]_ — G42 (2026-11-25) https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
- **F0738** G42 described Stargate UAE as a cluster within the planned 5 GW UAE–U.S. AI Campus in Abu Dhabi; the two capacities are nested, not additive. _[high; announced 2025-05-22]_ — G42 (2026-11-25) https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
- **F0739** G42 said the wider UAE–U.S. AI campus would use nuclear, solar and natural gas; it did not quantify their shares in this statement. _[high; announced 2025-05-22]_ — G42 (2026-11-25) https://www.g42.ai/resources/news/global-tech-alliance-launches-stargate-uae
- **F0740** DAEDALUS cost EUR 36 million to acquire; this is total system cost, not NVIDIA revenue. _[high; October 2026]_ — EuroHPC JU (2026-10-19) https://eurohpc-ju.europa.eu/eurohpc-ju-and-grnet-inaugurate-daedalus-ranked-among-worlds-top-50-supercomputers-2026-10-19_en
- **F0741** EuroHPC says the DAEDALUS data centre is powered by renewable energy sources; it does not specify an energy mix or emissions. _[high; October 2026]_ — EuroHPC JU (2026-10-19) https://eurohpc-ju.europa.eu/eurohpc-ju-and-grnet-inaugurate-daedalus-ranked-among-worlds-top-50-supercomputers-2026-10-19_en
- **F0742** DAEDALUS is the compute backbone of the Greek PHAROS AI Factory. _[high; October 2026]_ — EuroHPC JU (2026-10-19) https://eurohpc-ju.europa.eu/eurohpc-ju-and-grnet-inaugurate-daedalus-ranked-among-worlds-top-50-supercomputers-2026-10-19_en
- **F0743** France’s planned Alice Recoque combines AMD Venice processors with AMD MI430x GPUs. _[high; 2025 announcement]_ — EuroHPC JU (2025-11-18) https://eurohpc-ju.europa.eu/contract-signed-alice-recoque-europes-new-exascale-supercomputer-2025-11-18_en
- **F0744** As of November 2026, Alice Recoque’s first racks were expected in 2027, not yet confirmed operational. _[high; November 2026 outlook]_ — EuroHPC JU (2026-11-16) https://eurohpc-ju.europa.eu/eurohpc-supercomputers-confirm-europes-strong-position-global-rankings-preparations-advance-next-2026-11-16_en
- **F0745** EuroHPC expected LUMI-AI to be installed and available in 2027. _[high; August 2026 outlook]_ — EuroHPC JU (2026-08-31) https://eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-lumi-ai-supercomputer-2026-08-31_en
- **F0746** IndiaAI lists NVIDIA H100, H200 and A100 alongside AMD MI300X, Intel Gaudi 2 and AWS Tranium in its selected providers’ offerings; this is not a market-share breakdown. _[high; IndiaAI portal as accessed November 2026]_ — IndiaAI (2026-11-25) https://indiaai.gov.in/hub/indiaai-compute-capacity
- **F0747** SoftBank said in May 2026 its Japan-based data centres had deployed NVIDIA GB200 NVL72 infrastructure. _[high; May 2026]_ — SoftBank Corp. (2026-05-25) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260525_01/
- **F0748** SoftBank announced a Japanese AI GPU cloud planned for October 2026 and a beta starting in May; announcement alone does not prove the full launch occurred. _[high; May 2026 announcement]_ — SoftBank Corp. (2026-05-25) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260525_01/
- **F0749** SoftBank and AMD commenced joint validation of AMD Instinct GPUs for next-generation AI infrastructure; evaluation is not a purchase or proof of production deployment. _[high; February 2026]_ — SoftBank Corp. (2026-02-16) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260216_01/
- **F0750** SoftBank and AMD said they would continue technical evaluation of AMD Instinct GPUs. _[high; February 2026]_ — SoftBank Corp. (2026-02-16) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260216_01/
- **F0751** Greece’s DAEDALUS uses more than 2,000 NVIDIA GH200 superchips, built by HPE. _[high; October 2026]_ — EuroHPC JU (2026-10-19) https://eurohpc-ju.europa.eu/eurohpc-ju-and-grnet-inaugurate-daedalus-ranked-among-worlds-top-50-supercomputers-2026-10-19_en
- **F0752** JUPITER placed fifth in the November 2026 TOP500 ranking. _[high; November 2026]_ — EuroHPC JU (2026-11-16) https://eurohpc-ju.europa.eu/eurohpc-supercomputers-confirm-europes-strong-position-global-rankings-preparations-advance-next-2026-11-16_en
- **F0753** India approved more than INR 10,300 crore for the entire IndiaAI Mission, not NVIDIA revenue. _[high; March 2024]_ — Government of India Press Information Bureau (2026-11-25) https://pib.gov.in/PressReleasePage.aspx?PRID=2012375
- **F0754** India planned more than 10,000 GPUs via public-private collaboration in 2024. _[high; March 2024 plan]_ — Government of India Press Information Bureau (2026-11-25) https://pib.gov.in/PressReleasePage.aspx?PRID=2012375
- **F0755** In May 2025, India announced 34,333 empanelled GPUs including an additional 15,916; this is heterogeneous cloud capacity, not NVIDIA unit sales. _[high; May 2025]_ — Government of India Press Information Bureau (2026-11-25) https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132817
- **F0756** Finland’s LUMI-AI will be built with AMD MI430X GPUs and AMD EPYC processors, according to its 2026 procurement announcement. _[high; August 2026]_ — EuroHPC JU (2026-08-31) https://eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-lumi-ai-supercomputer-2026-08-31_en
- **F1049** SoftBank reported an existing NVIDIA deployment in Japan on 25 May 2026. _[high; May 2026]_ — SoftBank Corp. (2026-05-25) https://www.softbank.jp/en/corp/news/press/sbkk/2026/20260525_01/
- **F1084** UK government guidance offers eligible AIRR Gateway users up to 10,000 GPU hours within three months of project start. _[high; Gateway guidance updated September 2026]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-research-resource/airr-advanced-supercomputers-for-the-uk

## supply-chain (35)
- **F0191** NVIDIA says Vera Rubin NVL72 and Vera CPUs began volume shipments in Q3 FY2027 and use TSMC 5nm, 3nm and CoWoS technologies. _[high; Q3 FY2027]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0192** NVIDIA says its agreements supporting Amkor packaging expansion in Arizona and South Korea total nearly $3 billion and include prepayments. _[high; announced 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0193** NVIDIA says a Taiwan SPIL packaging expansion backed by multibillion-dollar funding aims to increase capacity dedicated to NVIDIA by mid-2029. _[high; announced 2026-11]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0194** Kinsus plans to expand its dedicated NVIDIA substrate capacity at Taoyuan by more than 3.5 times its current level. _[high; announced 2026-11]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0195** NVIDIA says Amkor plans to increase advanced packaging capacity by more than 300% by the end of 2028. _[high; target end 2028]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0196** NVIDIA says three substrate agreements are intended to drive aggregate capacity to 2.5 times its level over three years. _[high; target three years from October 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0197** NVIDIA expects its semiconductor testing capacity to double between calendar 2026 and 2027, supported by buildouts in the US, Taiwan and Singapore. _[high; 2026–2027 forecast]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0198** NVIDIA says its $1.1 billion advance will support KYEC US testing facilities and equipment with high-volume production targeted for April 2027. _[high; announced October 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0199** NVIDIA and SPIL target a 15-fold increase in Taiwan optical-engine capacity by mid-2027 and aim to double it again by end-2028. _[high; target mid-2027]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0200** NVIDIA says Samsung Electro-Mechanics joined its substrate supply chain using immediate South Korean capacity. _[high; October 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0201** NVIDIA says Unimicron substrate expansion in Taiwan is expected to start adding capacity in Q2 2027 and reach full capacity by mid-2028. _[high; forecast 2027–2028]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0202** NVIDIA says its new substrate commitments with Kinsus and Samsung Electro-Mechanics add capacity and improve existing factory capabilities. _[high; November 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0585** NVIDIA says its supply chain is mainly concentrated in Asia while it expands into the US and Latin America. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0586** NVIDIA names TSMC and Samsung among the foundries producing its semiconductor wafers; this does not establish interchangeability for any specific chip. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0587** NVIDIA uses CoWoS semiconductor packaging. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0588** NVIDIA contracts with independent subcontractors for product assembly, testing and packaging. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0589** NVIDIA has experienced extended lead times above 12 months and says these could recur. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0590** NVIDIA says it may remain unable to secure sufficient capacity commitments despite its efforts. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0591** NVIDIA identifies a limited number and geographic concentration of suppliers, foundries, assemblers, testers and memory manufacturers as a risk. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0592** NVIDIA warns that qualifying a replacement foundry or subcontractor and starting volume production can add expense or cause delays. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0593** NVIDIA says a disaster or war could require substantial expenditure and time to resume operations fully. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0594** NVIDIA warns its continuity and disaster recovery planning may not suffice for every eventuality. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0595** NVIDIA says limited supply or capacity can extend lead times during semiconductor shortages. _[high; FY2026 filing]_ — NVIDIA via SEC (2026-02-25) https://cdn.kscope.io/35eda9e72d095b34a4f3392d5b582e8f.pdf
- **F0596** SPIL says it and NVIDIA started low-volume optical-engine assembly production in Q3 2026; the announced ramp is a future target. _[high; Q3 2026]_ — SPIL (2026-11-25) https://www.spilglobal.com/NewsDetail/d968ea095a2d08fe
- **F0765** In October 2025 NVIDIA reported its first US-produced Blackwell wafer at TSMC Phoenix, saying Blackwell had reached volume production; it did not quantify NVIDIA output there. _[high; 2025-10-17]_ — NVIDIA (2026-11-25) https://blogs.nvidia.com/blog/tsmc-blackwell-manufacturing/
- **F0766** NVIDIA said TSMC Arizona would produce two-, three- and four-nanometer and A16 technologies; the statement does not establish that each node was producing NVIDIA chips at that date. _[high; 2025-10-17]_ — NVIDIA (2026-11-25) https://blogs.nvidia.com/blog/tsmc-blackwell-manufacturing/
- **F0767** NVIDIA says its IBIDEN Japan substrate expansion targets triple plant capacity and an initial ramp in the first quarter of 2028. _[high; 2028 target]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0768** NVIDIA says Amkor plans a greater than 300% increase in South Korean interposer wafer capacity by end-2028; this is a forecast for packaging capacity, not GPU output. _[high; end-2028 target]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0769** NVIDIA expects expanded Singapore testing operations to begin high-volume production in February 2027; testing is a distinct step from fabrication. _[high; February 2027 target]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-and-supply-chain-partners-expand-capacity-to-accelerate-ai-infrastructure-buildout
- **F0770** NVIDIA says the planned SPIL Taiwan packaging project includes bumping, interposer wafer fabrication, assembly and testing. _[high; announced November 2026]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0771** Kinsus substrate production for NVIDIA is expected to begin in the second half of 2027, with added capacity targeted for the third quarter of 2028. _[high; 2027–2028 targets]_ — NVIDIA (2026-11-25) https://nvidianews.nvidia.com/news/nvidia-expands-commitments-with-supply-chain-partners-to-support-ai-infrastructure-buildout
- **F0772** NVIDIA says supply of components and capacity is not guaranteed. _[high; FY2026 filing]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0773** NVIDIA says new suppliers and contract manufacturers add complexity to planning, execution and logistics. _[high; FY2026 filing]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F0774** NVIDIA says regional expansion depends on local ecosystems ramping supply to required volume and on time. _[high; FY2026 filing]_ — NVIDIA / SEC (2026-02-25) https://www.sec.gov/Archives/edgar/data/1045810/000104581026000021/nvda-20260125.htm
- **F1003** The team’s third-party compilation estimates NVIDIA booked 60% of TSMC’s CoWoS packaging capacity for 2026. _[medium; 2026]_ — our data: data/clean/research_cowos_share.json

## uk (14)
- **F0400** Bristol reports around 1,000 projects supported in Isambard-AI’s first year; this is facility activity, not NVIDIA revenue. _[high; first year to July 2026]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/news/2026/july/isambard-ai-first-anniversary.html
- **F0401** Bristol reports more than 4,000 Isambard-AI users in its first year. _[high; first year to July 2026]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/news/2026/july/isambard-ai-first-anniversary.html
- **F0402** Bristol says every Isambard-AI access call was oversubscribed and it is preparing inference services and BRAID. _[high; 2026-07-27]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/news/2026/july/isambard-ai-first-anniversary.html
- **F0403** Bristol reports Isambard-AI uses renewable electricity; this does not quantify lifecycle emissions. _[high; 2026-07-27]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/news/2026/july/isambard-ai-first-anniversary.html
- **F0404** Bristol describes research using Isambard-AI for British languages including Welsh, Scottish Gaelic and Cornish. _[high; 2026-07-27]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/news/2026/july/isambard-ai-first-anniversary.html
- **F0405** BBC reports Nscale pledged £2bn for a Loughton data centre; this is a project pledge, not NVIDIA revenue. _[medium; 2025 pledge reported 2026-10-18]_ — BBC (2026-11-25) https://www.bbc.com/news/articles/c9m26kl5y7epo
- **F0406** BBC reports Microsoft terminated involvement in the proposed Loughton supercomputer. _[medium; 2026-10-18]_ — BBC (2026-11-25) https://www.bbc.com/news/articles/c9m26kl5y7epo
- **F0407** BBC reports Nscale was told Loughton power supply would be delayed until the 2030s, after a previous year-end expectation. _[medium; 2026-10-18]_ — BBC (2026-11-25) https://www.bbc.com/news/articles/c9m26kl5y7epo
- **F0408** BBC reports Loughton was expected to create 250 permanent jobs when opened; these are projected site jobs, not NVIDIA jobs. _[medium; 2026-10-18]_ — BBC (2026-11-25) https://www.bbc.com/news/articles/c9m26kl5y7epo
- **F0409** The UK AI Opportunities Action Plan recommends a range of public-compute hardware providers to avoid vendor lock-in. _[high; 2025 action plan]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-opportunities-action-plan/ai-opportunities-action-plan
- **F0410** The UK action plan proposed AI Growth Zones to accelerate AI data-centre construction; this is a recommendation, not proof of delivery. _[high; 2025 action plan]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-opportunities-action-plan/ai-opportunities-action-plan
- **F0411** The UK action plan says 46,000 students graduated from AI-relevant UK higher-education programmes in 2022; this is not NVIDIA employment. _[high; 2022]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-opportunities-action-plan/ai-opportunities-action-plan
- **F0412** The UK action plan says 22% of people working in AI and data science are women, citing its underlying research; this is not NVIDIA workforce composition. _[high; 2025 action plan, underlying source date unspecified]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-opportunities-action-plan/ai-opportunities-action-plan
- **F0413** The UK action plan recommends mitigating sustainability and security risks of AI infrastructure. _[high; 2025 action plan]_ — UK Government (2026-11-25) https://www.gov.uk/government/publications/ai-opportunities-action-plan/ai-opportunities-action-plan

## valuation (22)
- **F0276** Stock Analysis reported NVIDIA trailing P/E of 16.69x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/statistics/
- **F0277** Stock Analysis reported NVIDIA forward P/E of 10.71x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/statistics/
- **F0278** Stock Analysis reported NVIDIA EV/EBITDA of 14.89x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/statistics/
- **F0279** Stock Analysis reported NVIDIA PEG of 0.23x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/statistics/
- **F0280** Stock Analysis reported AMD trailing P/E of 89.58x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/amd/statistics/
- **F0281** Stock Analysis reported AMD forward P/E of 27.45x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/amd/statistics/
- **F0282** Stock Analysis reported AMD EV/EBITDA of 60.84x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/amd/statistics/
- **F0283** Stock Analysis reported AMD PEG of 0.39x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/amd/statistics/
- **F0284** Stock Analysis reported Broadcom trailing P/E of 38.43x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/avgo/statistics/
- **F0285** Stock Analysis reported Broadcom forward P/E of 17.33x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/avgo/statistics/
- **F0286** Stock Analysis reported Broadcom EV/EBITDA of 28.18x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/avgo/statistics/
- **F0287** Stock Analysis reported Broadcom PEG of 0.32x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/avgo/statistics/
- **F0288** Stock Analysis reported TSMC trailing P/E of 23.6x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/tsm/statistics/
- **F0289** Stock Analysis reported TSMC forward P/E of 16.73x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/tsm/statistics/
- **F0290** Stock Analysis reported TSMC EV/EBITDA of 14.73x as of the November 24, 2026 close; methodology and forward estimates may differ from the pitch dataset. _[medium; market snapshot]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/tsm/statistics/
- **F0292** The team Bloomberg-derived dataset reports FY23 fiscal-year-end P/E of 83.31x; Stock Analysis reports 114.74x for the corresponding year, so reconcile before presenting. _[medium; FY23]_ — our data: data/clean/nvda_pe_history.json
- **F0293** The team Bloomberg-derived dataset reports FY25 fiscal-year-end P/E of 48.6x; Stock Analysis reports 47.93x for the corresponding year, so reconcile before presenting. _[medium; FY25]_ — our data: data/clean/nvda_pe_history.json
- **F0294** The team Bloomberg-derived dataset reports FY26 fiscal-year-end P/E of 43.03x; Stock Analysis reports 37.98x for the corresponding year, so reconcile before presenting. _[medium; FY26]_ — our data: data/clean/nvda_pe_history.json
- **F1017** The pitch dataset puts NVIDIA at 15.86x on FY27 expected earnings using the unverified 24 Nov price input. _[medium; FY27 estimate; team price input 24 Nov 2026]_ — our data: data/clean/peers_pe.json
- **F1019** The 20 Nov Bloomberg-derived peer dataset puts NVIDIA at 0.195x PEG using expected EPS growth. _[medium; 20 Nov 2026 snapshot]_ — our data: data/clean/peers_peg.json
- **F1021** The 20 Nov Bloomberg peer dataset puts NVIDIA at 11.42x forward EV/EBITDA. _[medium; Forward multiple; 20 Nov 2026 snapshot]_ — our data: data/clean/peers_ev_ebitda.json
- **F1024** Stock Analysis lists NVIDIA FY23 fiscal-year-end P/E at 114.74x. Its basis has not been reconciled with the pitch dataset. _[medium; FY23]_ — Stock Analysis (2026-11-25) https://stockanalysis.com/stocks/nvda/financials/ratios/

## water (57)
- **F0029** The researchers distinguish water withdrawal from water consumption because both matter to water stress and availability. _[medium; ]_ — Li et al., Communications of the ACM (2025-03-26) https://arxiv.org/html/2304.03271v5
- **F0030** AI water impacts include on-site cooling, off-site electricity generation, and server manufacturing, according to the researchers. _[medium; ]_ — Li et al., Communications of the ACM (2025-03-26) https://arxiv.org/html/2304.03271v5
- **F0031** Researchers explain that heat rejection at the facility level can use water-intensive cooling towers or evaporation-assisted air cooling. _[medium; ]_ — Li et al., Communications of the ACM (2025-03-26) https://arxiv.org/html/2304.03271v5
- **F0032** Ecolab says NVIDIA collaborated with it and CoolIT on coolant qualification, monitoring, infrastructure and AI factory technologies. _[medium; July 2026]_ — Ecolab (2026-07-02) https://www.ecolab.com/en-us/media-center/news/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform
- **F0033** Ecolab says it closed its acquisition of direct liquid cooling supplier CoolIT. _[medium; July 2026]_ — Ecolab (2026-07-02) https://www.ecolab.com/en-us/media-center/news/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform
- **F0034** Ecolab says its cooling platform connects CoolIT direct liquid cooling hardware with fluid management, digital intelligence and service. _[medium; November 2026]_ — Ecolab (2026-11-16) https://en-vn.ecolab.com/news/2026/11/ecolab-unveils-first-of-its-kind-integrated-cooling-platform-to-unlock-the-next-generation-of-ai
- **F0035** Ecolab identifies its new CoolIT CHx 3000 as a 3-megawatt coolant distribution unit integrated with its 3D TRASAR technology. _[medium; November 2026]_ — Ecolab (2026-11-16) https://en-vn.ecolab.com/news/2026/11/ecolab-unveils-first-of-its-kind-integrated-cooling-platform-to-unlock-the-next-generation-of-ai
- **F0036** Ecolab describes a goal of moving data centres toward a near-zero water footprint through closed-loop solutions; this is an ambition, not a measured result. _[medium; July 2026]_ — Ecolab (2026-07-02) https://www.ecolab.com/en-us/media-center/news/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform
- **F0537** NVIDIA reports FY26 operational water withdrawal of 451,297 cubic metres; FY26 values are not comparable with prior years because collection methods changed. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0538** NVIDIA reports FY26 water consumption of 105,531 cubic metres; the methodology changed and earlier years are not comparable. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0539** NVIDIA reports FY26 water discharge of 345,766 cubic metres; the methodology changed and earlier years are not comparable. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0540** NVIDIA warns its FY26 water values are not comparable to prior-year data because data collection methods changed. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0541** NVIDIA says its sustainability reporting covers the same entities as its financial reporting. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0542** NVIDIA identifies the FY26 sustainability reporting year as ending January 25, 2026. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0543** NVIDIA states it is a fabless semiconductor company without its own manufacturing facilities. _[high; FY26]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0544** NVIDIA says 20% of its FY24 facilities water withdrawals were in water-stressed areas, according to its WRI assessment. _[high; FY24]_ — NVIDIA (2025-06-12) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf
- **F0545** NVIDIA reports FY25 water withdrawal of 409,814 cubic metres; its FY26 report says FY26 data are not comparable with prior-year data. _[high; FY25]_ — NVIDIA (2025-06-12) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf
- **F0546** NVIDIA reports FY25 water consumption of 141,772 cubic metres; its FY26 report says FY26 data are not comparable with prior-year data. _[high; FY25]_ — NVIDIA (2025-06-12) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2025.pdf
- **F0547** Researchers define water withdrawal as freshwater taken from ground or surface sources for uses including industry, whether temporarily or permanently. _[medium; ]_ — Li et al., Communications of the ACM (2025-03-26) https://arxiv.org/html/2304.03271v5
- **F0548** Researchers define water consumption as withdrawal minus discharge, including water evaporated or otherwise removed from the immediate environment. _[medium; ]_ — Li et al., Communications of the ACM (2025-03-26) https://arxiv.org/html/2304.03271v5
- **F0549** WRI says its Aqueduct tools map water risks including floods, droughts and water stress using open-source, peer-reviewed data. _[high; ]_ — World Resources Institute (2024-01-01) https://www.wri.org/aqueduct
- **F0550** Google derives water per prompt from energy and an average data-centre WUE rather than directly metering each prompt. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0551** Google defines its water intensity factor as a previous-calendar-year average for data centres supporting LLM models. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0552** Google’s serving boundary excludes energy consumed by end-user devices. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0553** Google excludes model training and data storage from its inference serving energy assessment. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0554** Google ranks models by average energy per prompt to identify its median prompt model; this is not a direct water measurement of a single prompt. _[medium; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0555** Google cites Mistral’s lifecycle assessment estimate of 45 mL of water for a typical 400-token Le Chat response, a different system and boundary. _[medium; 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0556** Google reports that its data centres consumed on average 80% of the water withdrawn. _[medium; 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0557** Google says it obtains production machine power measurements from power supply units and tracks allocated and idle time. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0558** Google’s quoted water figure represents direct data-centre cooling consumption, so it is not a full lifecycle water footprint. _[medium; ]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0559** Google estimates that its median Gemini Apps text prompt in May 2025 consumed 0.26 mL of direct data-centre cooling water; this is calculated from energy and average water intensity. _[medium; May 2025]_ — Google Research (2025-08-21) https://arxiv.org/html/2508.15734
- **F0674** Do not report a FY25–FY26 operational water withdrawal trend: NVIDIA says its FY26 values are not comparable with prior years after collection methods changed, contrary to the fallback claim of rising withdrawals. _[high; FY25–FY26 comparison]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0762** Bristol describes Isambard-AI's direct-liquid-cooling circuit as a closed loop carrying a coolant-and-water mixture. _[medium; ]_ — University of Bristol (2026-11-25) https://www.bristol.ac.uk/research/centres/bristol-supercomputing/articles/2026/inside-isambard-ai.html
- **F0813** Samsung Electronics reports 2025 water withdrawal of 197,720 thousand tonnes across the reporting group, including semiconductor and device operations. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0814** Samsung Electronics reports 2025 wastewater discharge of 158,660 thousand tonnes across the reporting group; this is discharge, not consumption. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0815** Samsung reports that its device division withdrew 18,710 thousand tonnes of water across 25 sites in 2025. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0816** Samsung reports its device division consumed 3,512 thousand tonnes of water across 25 sites in 2025. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0817** Samsung reports that its device division discharged 15,198 thousand tonnes of water across 25 sites in 2025. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0818** Samsung rates water stress at its semiconductor sites in Xi’an and Suzhou, China, as extremely high. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0819** Samsung rates water stress at its semiconductor sites in Austin and Taylor, United States, as medium-high. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0820** Samsung identifies its Korean semiconductor sites at Giheung, Hwaseong, Pyeongtaek, Cheonan and Onyang as medium-high water stress. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0821** Samsung reports 2025 water reuse of 134,011 thousand tonnes; reuse is not equivalent to water withdrawal or consumption. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0822** Samsung estimates water consumption associated with manufacturing its products by suppliers selected by transaction scale and key supplier status; this is not NVIDIA-attributable consumption. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0823** Samsung reports its Hwaseong semiconductor campus received Alliance for Water Stewardship Platinum certification in 2023; certification does not establish the site withdrawal or consumption. _[high; 2023]_ — Samsung Electronics (2026-11-25) https://news.samsung.com/global/samsung-semiconductor-site-awarded-highest-level-global-certification-for-water-resource-management
- **F0824** Samsung says it expects daily semiconductor-site water withdrawal requirements to more than double between 2022 and 2030 as production lines expand, before planned reuse measures. _[high; 2022–2030]_ — Samsung Electronics (2026-11-25) https://www.samsung.com/global/sustainability/planet/sustainable-operations/
- **F0825** Samsung reports a combined 153,238 thousand tonnes of surface-water supply for its five Korean semiconductor sites in 2025; it does not isolate NVIDIA production. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0826** Samsung reports that its device division consumed 552 thousand tonnes of water in water-risk regions in 2025. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0827** Samsung reports that its device division withdrew 2,440 thousand tonnes of water in water-risk regions in 2025. _[high; 2025]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F0828** NVIDIA reports 23% of FY25 facility withdrawals in high or extremely high baseline water-stress areas. _[high; FY25]_ — NVIDIA (2026-11-25) https://images.nvidia.com/aem-dam/Solutions/documents/NVIDIA-Sustainability-Report-Fiscal-Year-2026.pdf
- **F0871** Ecolab says its Dassault Systèmes virtual twin combines technology cooling and facility water models to simulate data-centre performance; this is a model, not a site measurement. _[high; 2026-11-17]_ — Ecolab (2026-11-17) https://www.ecolab.com/en-us/media-center/news/ecolab-launches-premier-liquid-cooling-ecosystem-to-shape-the-industrys-most-efficient-ai-infrastructure
- **F0872** Ecolab says its virtual twin examines trade-offs between water use, coolant performance, power efficiency and redundancy; the announcement does not quantify site savings. _[high; 2026-11-17]_ — Ecolab (2026-11-17) https://www.ecolab.com/en-us/media-center/news/ecolab-launches-premier-liquid-cooling-ecosystem-to-shape-the-industrys-most-efficient-ai-infrastructure
- **F0873** Ecolab describes collaboration with Alfa Laval covering heat exchangers and thermal-loop management, from facility water treatment to direct-to-chip cooling. _[high; 2026-11-17]_ — Ecolab (2026-11-17) https://www.ecolab.com/en-us/media-center/news/ecolab-launches-premier-liquid-cooling-ecosystem-to-shape-the-industrys-most-efficient-ai-infrastructure
- **F1051** Samsung reports 107,967 thousand tonnes of water reuse across its five Korean semiconductor sites in 2025. The figure includes process reuse and internal treatment reuse. _[high; 2025 reporting year]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F1052** Samsung lists its five Korean semiconductor sites as medium-high water stress in its 2026 Sustainability Report. _[high; 2025 reporting year]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F1068** Samsung Electronics reported group-wide water withdrawal of 177,361 thousand tonnes in 2023. _[high; 2023]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F1069** Samsung Electronics reported group-wide water withdrawal of 188,540 thousand tonnes in 2024. _[high; 2024]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
- **F1081** Samsung Electronics reported group-wide wastewater discharge of 142,995 thousand tonnes in 2023. _[high; 2023]_ — Samsung Electronics (2026-06-26) https://www.samsung.com/global/sustainability/media/pdf/Samsung_Electronics_Sustainability_Report_2026_ENG.pdf
