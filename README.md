# Shadow AI Governance Dashboard - Take-Home Submission

**Candidate:** Swapnil Kathiari
**Role framing:** Product Manager / Product Owner, week one of scoping

---

## The 90-second version

An organisation buying AI tools has three separate problems that look like one problem: it does not know what it is spending, it does not know who is spending it, and it does not know which of that spending was ever approved. A dashboard that tries to solve all three for all audiences at once becomes a data-science toy. So this submission makes three explicit product decisions up front and lets everything else follow from them.

**1. One primary persona: the CFO or finance owner.** The IT/security lead is the secondary reader. Every risk finding is denominated in dollars and attached to a named owner, not written in security language. A dashboard designed to serve finance and security equally serves neither, because the two personas disagree on what the top-line number should be.

**2. Provenance beats polish.** Every number on the screen carries where it came from and how much to trust it: `metered` (came from a billing API), `estimated` (rate card multiplied by observed usage), or `inferred` (a discovery signal with no dollar figure attached). The dashboard states its own blind spots in the header rather than implying it sees everything. A governance number that a CFO cannot defend in a board meeting is worse than no number, because the first time it is wrong the whole product loses its credibility.

**3. No prompt or content inspection in v1.** The instinct is to capture more data. That instinct is wrong here. Reading prompt content turns a finance product into an employee-surveillance product, triggers GDPR and works-council review in the EU, and kills the internal champion's ability to roll it out. Tool-level and seat-level telemetry answers the actual question at a fraction of the political cost.

### Part 1 - the screen

A single "AI Governance" screen structured to answer four questions in the order an executive actually asks them: *Are we over budget? Where is the money going? What did nobody approve? What do I do about it?* The bottom half of the screen is an action table with real row actions (approve, set limit, request owner review, block), which is what separates a governance product from a report. Full spec, wireframe and scope cuts in [docs/part1-screen-spec.md](docs/part1-screen-spec.md).

### Part 2 - data sources

Five layers, organised by the question each layer answers rather than by vendor logo: spend truth, identity and seat truth, usage truth, shadow discovery, and governance context. Every source is cited with its documentation link.

The important part of the answer is not the list of APIs. It is that **entity resolution is the actual product**: turning `OPENAI *CHATGPT SUBSCR` on a corporate card into "ChatGPT Team, 40 seats, owned by Design, cost centre 4100" requires stitching merchant strings, SSO identities, vendor user IDs and HRIS records together. That is where the engineering effort goes and where trust is won or lost. Full plan, canonical data model and phased sequencing in [docs/part2-data-sources.md](docs/part2-data-sources.md).

### Part 3 - the three charts

1. **Budget burn-up with forecast** - cumulative spend against the limit, projected to month-end. Answers "are we going to breach?" while there is still time to act.
2. **Spend by tool, ranked, with per-tool limit markers and shadow/sanctioned colouring** - answers "where is the money going, and what is out of policy?" in a single mark.
3. **Sanctioned vs. pending vs. shadow spend by department** - answers "who do I call?", which is the only one of the three that produces a conversation rather than a number.

Includes the charts I deliberately rejected and why, because the cut list is the part that shows judgement. See [docs/part3-charts.md](docs/part3-charts.md).

---

## How to read this submission

| Document | What it covers |
| --- | --- |
| [docs/part1-screen-spec.md](docs/part1-screen-spec.md) | Part 1. Persona, job-to-be-done, annotated wireframe, states, scope cuts, success metrics |
| [docs/part2-data-sources.md](docs/part2-data-sources.md) | Part 2. Five source layers with documentation links, entity resolution, canonical data model, freshness and confidence contract, phased rollout, privacy posture, risks |
| [docs/part3-charts.md](docs/part3-charts.md) | Part 3. Chart selection criteria, the three picks with rationale, rejected alternatives |
| [docs/assumptions-and-open-questions.md](docs/assumptions-and-open-questions.md) | What I assumed in the absence of a real customer, and the questions I would take into week two |
| [prototype/](prototype/) | Clickable prototype of the Part 1 screen (React + Recharts, seeded mock data) |

## Running the prototype

```bash
cd prototype
npm install
npm run dev
```

The prototype uses a seeded mock dataset (27 tools, 8 departments, 90 days of spend history, deliberate coverage gaps) so the charts behave like real data rather than placeholder shapes. Fidelity is intentionally rough: the point is the information architecture and the labelling, not the pixels.
