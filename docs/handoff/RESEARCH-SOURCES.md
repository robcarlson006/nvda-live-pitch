# Live Q&A source policy

Start with the prepared bank and dated `data/clean/` exports. For a question they cannot answer, use the scoped research path. Treat source priority as claim-specific. A company is a primary source for what it reported. A regulator or court establishes the status of an investigation or proceeding. Use an independent source where it improves a contested or material claim.

| Question | Initial live allowlist | What to check |
| --- | --- | --- |
| NVIDIA results, customer concentration, succession | `sec.gov`, `investor.nvidia.com`, `nvidianews.nvidia.com` | Prefer filings, match fiscal period and entity, and label guidance and announcements. |
| UK law and ESG disclosures | `legislation.gov.uk`, `gov.uk`, `ico.org.uk`, `nvidia.com` | Verify the statute and applicable entity. A published disclosure supports the specific report it describes. |
| US policy, trade and permitting | `congress.gov`, `govinfo.gov`, `federalregister.gov`, `bis.gov`, `epa.gov`, `energy.gov`, `eia.gov` | Verify whether a measure is introduced, enacted, in force or stayed. Use state or local sites only after the relevant hostname is reviewed. |
| Climate, grid and cooling | `iea.org`, `ipcc.ch`, `lbl.gov`, `ecolab.com` | Distinguish measured site results, company estimates, methodology and the exact cooling boundary. |
| Independent reporting | `reuters.com`, `apnews.com` | Use for attributed context. Check official records for legal status or company filings. |

Source anchors for the pitch include the [SEC reinstatement filing](https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm), the [CMA Arm merger docket](https://www.gov.uk/cma-cases/nvidia-slash-arm-merger-inquiry), the [introduced S. 4214 bill text](https://www.govinfo.gov/app/details/BILLS-119s4214is), and the [Ecolab CoolIT close and NVIDIA collaboration announcement](https://www.ecolab.com/en-us/media-center/news/ecolab-closes-coolit-acquisition-and-expands-ai-cooling-platform).

## Enforcement for the live implementation

- Pass `allowed_domains` to the Anthropic web search tool. The API accepts bare domains, and a parent domain includes its subdomains. Validate returned HTTPS URLs server-side using parsed hostnames and dot-boundary matching against the registry. Reject credentials in URLs and unexpected ports. Recheck targets before any follow-up fetch and keep redirects disabled unless each destination is validated. [Anthropic web search](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool) · [Domain filtering](https://platform.claude.com/docs/en/agents-and-tools/tool-use/server-tools)
- Require a direct link, publisher and available publication or effective date for every externally researched factual line. Check each figure, its unit and period against the cited evidence before display. Label assumptions and what-if cases. Cite Bloomberg and company inputs from the existing dataset metadata for local answers. If evidence is missing, say what the team would check.
- When constructing a diagram, use phrases from the cited answer. Use validated dataset keys for charts. An operator should be able to inspect the source before approving the slide.
- Keep search bounded and preserve the prepared answer if a visual call fails. If the allowed sources do not carry the answer, return an evidence gap. For a specific market or geography, add a verified publisher or regulator as a deliberate registry update before the pitch.
