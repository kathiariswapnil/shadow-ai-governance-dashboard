# Assumptions and Open Questions

> Written because the honest answer to a week-one scoping brief is "here is what I decided, here is what I guessed, and here is what I would go and find out."

---

## Assumptions I made, and what changes if they are wrong

**1. A mid-market to lower-enterprise customer: roughly 500 to 3,000 employees.**
Big enough to have a real shadow-AI problem and a CFO who cares, small enough that no internal team has already built this in a BI tool. If the target is actually 10,000+ enterprise, three things change: SSO coverage is much higher so discovery gets easier, procurement gets stricter so the privacy posture in [Part 2](part2-data-sources.md#access-privacy-and-optics) becomes a gating requirement rather than a nice-to-have, and the buyer likely shifts from CFO to a FinOps or IT-governance function - which would change the primary persona and therefore the top of the screen.

**2. The buyer is finance, and IT/security is the implementer.**
This drove the single-persona decision. If the actual buyer is the CISO, the screen should lead with risk exposure and data-handling posture rather than budget, and Chart 1 would probably become a shadow-tool discovery trend.

**3. The customer has *some* central spend visibility - a corporate card platform or an AP system.**
Phase 0's CSV path exists precisely so this assumption is not load-bearing, but if a customer genuinely has no central spend data, the product can only ever show `inferred` findings and the value proposition weakens substantially.

**4. "Spend limits" means internal budget guardrails, not technical rate limits.**
The brief says "approved limits", which I read as a finance ceiling. Some vendors do offer real hard caps (OpenAI and Anthropic both expose spend-limit endpoints), so the design surfaces those separately rather than conflating them. If the brief meant vendor-side technical enforcement, the product becomes considerably more of an enforcement engine and much less of a reporting surface.

**5. A single currency view (USD) with multi-currency ingestion.**
Fine for a US-centric customer, insufficient for a company with entity-level reporting in three currencies. FX convention would need to be a customer setting rather than a fixed choice.

**6. Monthly periods aligned to the finance calendar, not rolling 30-day windows.**
Chosen so numbers reconcile to the general ledger. A customer on a 4-4-5 or non-calendar fiscal calendar would break this, which is a real and common case.

**7. Nobody wants prompt-level content in v1.**
This is a conviction rather than a research finding. It is the assumption I am least willing to abandon and most aware could be wrong - a security-led buyer may consider content inspection the whole point, in which case this is a different product for a different buyer.

**8. Mock data in the prototype is representative.**
The 27 tools, 8 departments and 90-day history are invented from plausible patterns, not from a real customer. Real data is always messier: more unattributed spend, more duplicate vendor records, and a longer tail of tiny tools.

---

## Questions I would take into week two

Ordered by how much the answer would change the build.

### To customers - three to five discovery calls before writing a line of code

1. **What did you do the last time you found unapproved AI spend?** The current workaround is the real competition. If the answer is "a spreadsheet the FP&A analyst updates monthly", I am replacing a person's Tuesday; if the answer is "nothing, we found out at audit", I am creating a habit that does not yet exist, which is a much harder product problem.
2. **Who has the authority to cancel a tool or set a limit - and do they read this dashboard?** If the person who reads the screen cannot act, the action table in [Part 1](part1-screen-spec.md) is theatre and the product needs a routing and approval workflow instead.
3. **What is the trigger for looking at this - monthly close, budget season, a board question, or a security incident?** Frequency of the trigger determines whether this is a dashboard, a scheduled report, or an alerting product. My design assumes a monthly rhythm with alert interrupts, and I would want that confirmed before investing in the real-time side.
4. **How much wrongness is tolerable?** Would a CFO accept a number that is 95% accurate and clearly labelled, or does anything short of GL-reconciled get dismissed? This single answer decides whether `estimated` figures can appear in the headline at all.
5. **Would you allow us to see individual-level usage, and would your employees know?** Determines whether the aggregate-first posture is a legal requirement or a courtesy, and whether works-council consultation is on the critical path.

### Internal, to engineering and design

6. **What is the realistic accuracy ceiling on vendor normalisation from card descriptors alone?** The entire Phase 0 value proposition rests on this, and I would want a spike on a sample of real statements before promising it.
7. **Build or license the AI-vendor catalogue?** It is a genuine moat and also a continuous content-operations cost. If a licensable source is good enough for v1, that is months of runway.
8. **Do we treat SaaS-management platforms as partners or competitors?** Reading from Torii or Zluri shortcuts enormous connector work; competing with them means winning on AI-specific depth. This is a positioning decision with an architecture consequence, so it should not be made implicitly by an engineer choosing an integration.

### To finance and legal

9. **How should annual prepayments be amortised in the monthly view?** Without a decision, a single annual invoice creates a fake spike that makes the burn-up chart lie.
10. **What is our own data-processing posture?** We would be handling HR-adjacent data from an identity provider. Sub-processor disclosure, residency and retention need answers before the first enterprise security questionnaire, not after.

---

## What I would build first if I had two weeks and one engineer

Not the dashboard. A **coverage report**: ingest a card statement CSV and one identity provider, normalise vendors against the catalogue, and output a single page that says "we found 27 AI tools, 9 of which are not in your approved list, totalling an estimated $18K a month, and here is what we still cannot see."

That artefact tests the two riskiest assumptions in the whole plan - that vendor normalisation works well enough on messy real inputs, and that a CFO finds the finding alarming enough to act on - without building a single chart. If the coverage report does not provoke a reaction in a discovery call, no amount of dashboard polish will fix it, and I would rather learn that in week two than in month six.
