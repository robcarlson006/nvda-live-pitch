# Visual queue for the strong-model phase (human-owned). One line per iteration, top first.
# Our own data is in ../data/clean (use "dataset" specs); research facts are in db/facts.jsonl.

- V01 DCF pack: every step of our DCF from ../data/clean/model_*.json — inputs (model_dcf_inputs), revenue paths (model_revenue_paths), drivers, FCF forecast (model_fcf_forecast), PV of FCF vs terminal value, the EV-to-equity-to-per-share bridge as a waterfall (model_dcf_bridge), one-page summary (model_dcf_summary)
- V02 Three discount rates: value per share at 10.55% / 14.45% / 15.4% vs today's price (model_three_rates, model_dcf_inputs), sensitivity grid (model_sensitivity), what each rate assumes
- V03 Reverse DCF: growth the market price implies vs our base case vs consensus (model_implied_growth, model_revenue_paths), bear and "AI ended" downside paths (model_path_bear, model_path_ai_ended, model_downside), our target vs analysts (model_vs_analysts, model_target_bridge)
- V04 ESG: energy and AI electricity demand, performance per watt, emissions Scope 1/2/3, renewables, water, ESG ratings vs peers — from the vault facts and ../data/clean (nvda_emissions, nvda_energy, nvda_renewable_share, nvda_esg_scores, peers_emissions_intensity)
- V05 Customers and demand: revenue by customer type, concentration, hyperscaler capex, sovereign AI deals (nvda_dc_customers, nvda_dc_customer_mix, nvda_customer_concentration + vault facts)
- V06 Competition: market share estimates, custom chips, AMD/Broadcom/TSMC comparisons (peers_* datasets + vault facts)
- V07 Risks: China revenue and export controls timeline, Taiwan/TSMC dependence, governance timeline, bear-case arguments with numbers
- V08 Valuation context: P/E history, peers' P/E/PEG/EV-EBITDA, analyst targets, buybacks (nvda_pe_history, peers_pe, peers_peg, peers_ev_ebitda, nvda_analyst_ratings + vault facts)
- V09 Growth story: revenue and segment history, margins, FCF, quarterly beats (nvda_revenue_annual, nvda_segments_annual, nvda_margins_annual, nvda_fcf_annual, nvda_revenue_surprise)
- V10 Fill gaps: any topic in the vault with 6+ facts and no visual yet (check db/visuals.jsonl facts coverage)
