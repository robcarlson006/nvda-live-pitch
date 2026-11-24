# Codex prompt

You own the live Q&A and operator lane. Work only in the Codex checkout. Read `docs/handoff/PARALLEL.md` and `docs/handoff/RESEARCH-SOURCES.md`. Confirm your starting commit and branch before changing code.

1. Keep the flow prepared answer → verified local data → bounded live research. For a prepared or generated answer without a usable chart, call the current Anthropic API for a small structured visual. Use local data for quantitative visuals. Let the API choose a chart or produce an explanatory diagram that reuses sourced claims without adding figures or causation. Fall back to the readable answer when generation is unavailable. Move no live Q&A answer to stage before approval.
2. Implement the source allowlist in the web search request and enforce it again on returned citations and any fallback page fetch. Keep one code-owned registry so the checks use the same setting. Return a sourced answer or an honest evidence gap. Keep hyperlinks and dates in the operator. Display source names on stage. Use the existing budget and cancellation controls. Stay with the current provider for this pass.
3. Finish the operator chat with follow-up context, searchable prepared bank, citation visibility and visual status. Finish teleprompter and cue timing checks. Export `AnswerVisual({ diagram })` from `app/src/AnswerVisual.tsx`. Work in that file and its CSS to avoid changing Claude Code's stage composition.
4. Add regression coverage for unsupported and compound questions, citation checking, disallowed hosts, answer approval, stale API results and cue behavior. Check timeout, missing credentials and offline paths. Report actual live API verification separately from mocked tests. Commit locally and send the commit SHA with any integration needs.

Claude Code owns the script, bank content, stage composition, DCF and offline exports. Save the model-comparison experiment for after both lanes merge.
