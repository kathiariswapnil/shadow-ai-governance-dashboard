/**
 * Seeded mock dataset for the AI Governance Dashboard prototype.
 *
 * Everything on the screen is derived from the records below rather than
 * hardcoded, so the figures stay internally consistent. The shape of each
 * record mirrors the canonical data model in docs/part2-data-sources.md.
 *
 * Scenario: Acme Corp, 1,240 employees, August 2026, viewed on day 19 of 31.
 */

export const org = {
  name: 'Acme Corp',
  employees: 1240,
  period: { label: 'August 2026', dayOfMonth: 19, daysInMonth: 31 },
  monthlyLimitUsd: 120000,
  currency: 'USD',
  // Oldest contributing source timestamp, not the newest. See Part 1, annotation (2).
  dataAsOf: '14 Aug, 06:00 IST',
}

export const CONFIDENCE = {
  metered: {
    key: 'metered',
    label: 'metered',
    glyph: '●',
    blurb: 'Taken directly from a billing API or invoice.',
  },
  estimated: {
    key: 'estimated',
    label: 'estimated',
    glyph: '◐',
    blurb: 'Derived from a rate card, run-rate projection or card descriptor.',
  },
  inferred: {
    key: 'inferred',
    label: 'inferred',
    glyph: '◔',
    blurb: 'Tool presence is known from a discovery signal. Contributes no dollars.',
  },
}

export const POLICY_STATE = {
  sanctioned: { key: 'sanctioned', label: 'Sanctioned', tone: 'ok' },
  pending: { key: 'pending', label: 'Pending review', tone: 'warn' },
  shadow: { key: 'shadow', label: 'Shadow', tone: 'bad' },
  blocked: { key: 'blocked', label: 'Blocked', tone: 'muted' },
}

export const RISK_LABELS = {
  no_dpa: 'No DPA in place',
  trains_on_data: 'Vendor trains on submitted data',
  no_sso: 'Not behind SSO',
  no_owner: 'No internal owner',
}

/**
 * Connected data sources. `status` and `lastSync` drive the coverage badge,
 * which is the trust anchor for the whole screen.
 */
export const dataSources = [
  { id: 'okta', name: 'Okta', layer: 'Identity', status: 'connected', latency: 'Near real time', lastSync: '12 min ago' },
  { id: 'ramp', name: 'Ramp', layer: 'Spend', status: 'connected', latency: 'T+1', lastSync: '3 h ago' },
  { id: 'workday', name: 'Workday (HRIS)', layer: 'Identity', status: 'connected', latency: 'Daily', lastSync: '6 h ago' },
  { id: 'openai', name: 'OpenAI Admin API', layer: 'Spend', status: 'connected', latency: 'T+1', lastSync: '8 h ago' },
  { id: 'anthropic', name: 'Anthropic Admin API', layer: 'Spend', status: 'connected', latency: 'T+1', lastSync: '9 h ago' },
  { id: 'gh_copilot', name: 'GitHub Copilot metrics', layer: 'Usage', status: 'connected', latency: 'T+1', lastSync: '7 h ago' },
  {
    id: 'zscaler',
    name: 'Zscaler',
    layer: 'Discovery',
    status: 'error',
    latency: 'Hourly',
    lastSync: 'Failed 4 h ago',
    gap: 'No network-level discovery right now. Tools used outside SSO and outside a corporate card are invisible until this reconnects.',
  },
  {
    id: 'msgraph',
    name: 'Microsoft Graph (M365 Copilot usage)',
    layer: 'Usage',
    status: 'not_configured',
    latency: 'T+1',
    lastSync: null,
    gap: 'M365 Copilot spend is estimated from the invoice, and its seat activity is estimated rather than measured.',
  },
  {
    id: 'ap_invoices',
    name: 'AP / invoice ingestion',
    layer: 'Spend',
    status: 'not_configured',
    latency: 'Monthly',
    lastSync: null,
    gap: 'Annual prepaid invoices are not amortised, so a renewal lands as a one-month spike.',
  },
]

/**
 * Daily spend for the current month, days 1 to 19.
 * Front-loaded because seat subscriptions bill at month start while
 * consumption accrues daily - the shape real AI spend actually has.
 */
export const dailySpend = [
  { day: 1, subscription: 18000, consumption: 1400 },
  { day: 2, subscription: 11500, consumption: 1500 },
  { day: 3, subscription: 7300, consumption: 1600 },
  { day: 4, subscription: 0, consumption: 1750 },
  { day: 5, subscription: 4500, consumption: 1900 },
  { day: 6, subscription: 0, consumption: 2050 },
  { day: 7, subscription: 0, consumption: 2200 },
  { day: 8, subscription: 2350, consumption: 2400 },
  { day: 9, subscription: 0, consumption: 2600 },
  { day: 10, subscription: 0, consumption: 2800 },
  { day: 11, subscription: 0, consumption: 3000 },
  { day: 12, subscription: 0, consumption: 3050 },
  { day: 13, subscription: 0, consumption: 3100 },
  { day: 14, subscription: 0, consumption: 3200 },
  { day: 15, subscription: 0, consumption: 3300 },
  { day: 16, subscription: 0, consumption: 3400 },
  { day: 17, subscription: 0, consumption: 3500 },
  { day: 18, subscription: 0, consumption: 3600 },
  { day: 19, subscription: 0, consumption: 3600 },
]

/** Last reconciled day. Days after this are provisional and will be restated. */
export const lastReconciledDay = 17

/**
 * Tools. `mtdSpendUsd` for seat-based tools equals seatsPaid x unitPriceUsd,
 * because a company pays for licences held, not licences used. The gap between
 * seatsPaid and seatsActive is the idle-seat waste.
 */
export const tools = [
  // Engineering
  { id: 't01', name: 'GitHub Copilot Enterprise', vendor: 'GitHub', department: 'Engineering', owner: 'A. Iyer', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 39, seatsPaid: 450, seatsActive: 360, activeUsers: 360, mtdSpendUsd: 17550, limitUsd: 19000, confidence: 'metered', risks: [], source: 'gh_copilot', firstSeen: '2024-03-02' },
  { id: 't02', name: 'OpenAI API (platform)', vendor: 'OpenAI', department: 'Engineering', owner: 'R. Mehta', state: 'sanctioned', pricingModel: 'consumption', unitPriceUsd: null, seatsPaid: null, seatsActive: null, activeUsers: 88, mtdSpendUsd: 17000, limitUsd: 16000, confidence: 'metered', risks: [], source: 'openai', firstSeen: '2023-11-14' },
  { id: 't03', name: 'Cursor Business', vendor: 'Anysphere', department: 'Engineering', owner: 'A. Iyer', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 40, seatsPaid: 110, seatsActive: 96, activeUsers: 96, mtdSpendUsd: 4400, limitUsd: 5000, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-01-20' },
  { id: 't04', name: 'Anthropic API', vendor: 'Anthropic', department: 'Engineering', owner: 'R. Mehta', state: 'sanctioned', pricingModel: 'consumption', unitPriceUsd: null, seatsPaid: null, seatsActive: null, activeUsers: 34, mtdSpendUsd: 6500, limitUsd: 8000, confidence: 'metered', risks: [], source: 'anthropic', firstSeen: '2024-06-08', note: 'Priority Tier spend is backed out of token counts; Anthropic does not report it in the cost endpoint.' },
  { id: 't05', name: 'AWS Bedrock', vendor: 'Amazon', department: 'Engineering', owner: 'R. Mehta', state: 'sanctioned', pricingModel: 'consumption', unitPriceUsd: null, seatsPaid: null, seatsActive: null, activeUsers: 12, mtdSpendUsd: 3200, limitUsd: 5000, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2024-09-30' },
  { id: 't06', name: 'Codeium', vendor: 'Codeium', department: 'Engineering', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 12, seatsPaid: 10, seatsActive: 8, activeUsers: 8, mtdSpendUsd: 120, limitUsd: null, confidence: 'estimated', risks: ['no_owner'], source: 'okta', firstSeen: '2026-07-28' },
  { id: 't07', name: 'Replit AI', vendor: 'Replit', department: 'Engineering', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 25, seatsPaid: 7, seatsActive: 5, activeUsers: 5, mtdSpendUsd: 175, limitUsd: null, confidence: 'estimated', risks: ['no_owner', 'no_sso'], source: 'ramp', firstSeen: '2026-08-06' },

  // Product
  { id: 't08', name: 'Claude Team', vendor: 'Anthropic', department: 'Product', owner: 'S. Rao', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 30, seatsPaid: 70, seatsActive: 62, activeUsers: 62, mtdSpendUsd: 2100, limitUsd: 2400, confidence: 'metered', risks: [], source: 'anthropic', firstSeen: '2024-08-19' },
  { id: 't09', name: 'Dovetail AI', vendor: 'Dovetail', department: 'Product', owner: 'M. Bhat', state: 'pending', pricingModel: 'seat', unitPriceUsd: 38, seatsPaid: 22, seatsActive: 18, activeUsers: 18, mtdSpendUsd: 836, limitUsd: 1000, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2026-06-11' },
  { id: 't10', name: 'Notion AI', vendor: 'Notion', department: 'Product', owner: 'S. Rao', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 10, seatsPaid: 102, seatsActive: 92, activeUsers: 92, mtdSpendUsd: 1020, limitUsd: 1200, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-04-02' },

  // Marketing
  { id: 't11', name: 'Midjourney', vendor: 'Midjourney', department: 'Marketing', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 60, seatsPaid: 16, seatsActive: 14, activeUsers: 14, mtdSpendUsd: 960, limitUsd: 350, confidence: 'estimated', risks: ['no_dpa', 'trains_on_data', 'no_owner'], source: 'ramp', firstSeen: '2026-02-17', note: 'No admin API exists. Detected from card descriptors and priced from the public rate card.' },
  { id: 't12', name: 'Perplexity Enterprise', vendor: 'Perplexity', department: 'Marketing', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 40, seatsPaid: 35, seatsActive: 31, activeUsers: 31, mtdSpendUsd: 1400, limitUsd: null, confidence: 'estimated', risks: ['no_sso', 'no_owner'], source: 'okta', firstSeen: '2026-05-23' },
  { id: 't13', name: 'Jasper', vendor: 'Jasper', department: 'Marketing', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 49, seatsPaid: 12, seatsActive: 9, activeUsers: 9, mtdSpendUsd: 588, limitUsd: null, confidence: 'estimated', risks: ['no_dpa', 'no_owner'], source: 'ramp', firstSeen: '2026-04-09' },
  { id: 't14', name: 'Gamma AI', vendor: 'Gamma', department: 'Marketing', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 20, seatsPaid: 8, seatsActive: 6, activeUsers: 6, mtdSpendUsd: 160, limitUsd: null, confidence: 'estimated', risks: ['no_owner'], source: 'okta', firstSeen: '2026-08-16' },
  { id: 't15', name: 'Synthesia', vendor: 'Synthesia', department: 'Marketing', owner: 'K. Nair', state: 'pending', pricingModel: 'seat', unitPriceUsd: 89, seatsPaid: 4, seatsActive: 3, activeUsers: 3, mtdSpendUsd: 356, limitUsd: 500, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2026-07-01' },
  { id: 't16', name: 'HubSpot AI add-on', vendor: 'HubSpot', department: 'Marketing', owner: 'K. Nair', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 50, seatsPaid: 45, seatsActive: 40, activeUsers: 40, mtdSpendUsd: 2250, limitUsd: 2500, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-09-15' },

  // Design
  { id: 't17', name: 'Figma AI', vendor: 'Figma', department: 'Design', owner: 'L. DSouza', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 20, seatsPaid: 40, seatsActive: 34, activeUsers: 34, mtdSpendUsd: 800, limitUsd: 1000, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-06-04' },
  { id: 't18', name: 'Adobe Firefly', vendor: 'Adobe', department: 'Design', owner: 'L. DSouza', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 50, seatsPaid: 26, seatsActive: 22, activeUsers: 22, mtdSpendUsd: 1300, limitUsd: 1500, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-02-11' },
  { id: 't19', name: 'ElevenLabs', vendor: 'ElevenLabs', department: 'Design', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 99, seatsPaid: 6, seatsActive: 5, activeUsers: 5, mtdSpendUsd: 594, limitUsd: null, confidence: 'estimated', risks: ['no_dpa', 'no_owner'], source: 'ramp', firstSeen: '2026-06-27' },
  { id: 't20', name: 'Runway ML', vendor: 'Runway', department: 'Design', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 95, seatsPaid: 5, seatsActive: 4, activeUsers: 4, mtdSpendUsd: 475, limitUsd: null, confidence: 'estimated', risks: ['trains_on_data', 'no_owner'], source: 'ramp', firstSeen: '2026-07-19' },

  // Sales
  { id: 't21', name: 'Gong AI', vendor: 'Gong', department: 'Sales', owner: 'V. Kapoor', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 50, seatsPaid: 95, seatsActive: 88, activeUsers: 88, mtdSpendUsd: 4750, limitUsd: 5200, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2024-10-08' },
  { id: 't22', name: 'Otter.ai', vendor: 'Otter', department: 'Sales', owner: null, state: 'shadow', pricingModel: 'seat', unitPriceUsd: 20, seatsPaid: 25, seatsActive: 22, activeUsers: 22, mtdSpendUsd: 500, limitUsd: null, confidence: 'estimated', risks: ['no_dpa', 'no_owner'], source: 'okta', firstSeen: '2026-03-30' },
  { id: 't23', name: 'Clay AI', vendor: 'Clay', department: 'Sales', owner: 'V. Kapoor', state: 'pending', pricingModel: 'seat', unitPriceUsd: 123, seatsPaid: 14, seatsActive: 11, activeUsers: 11, mtdSpendUsd: 1722, limitUsd: 2000, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2026-05-06' },

  // Support
  { id: 't24', name: 'Intercom Fin AI', vendor: 'Intercom', department: 'Support', owner: 'T. Menon', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 120, seatsPaid: 28, seatsActive: 24, activeUsers: 24, mtdSpendUsd: 3360, limitUsd: 3800, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-11-12' },

  // Operations / company-wide
  { id: 't25', name: 'Microsoft 365 Copilot', vendor: 'Microsoft', department: 'Operations', owner: 'N. Fernandes', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 30, seatsPaid: 420, seatsActive: 240, activeUsers: 240, mtdSpendUsd: 12600, limitUsd: 13000, confidence: 'estimated', risks: [], source: 'ramp', firstSeen: '2025-03-18', note: 'Seat activity is estimated. Connect Microsoft Graph to measure it.' },
  { id: 't26', name: 'Gemini for Google Workspace', vendor: 'Google', department: 'Operations', owner: 'N. Fernandes', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 20, seatsPaid: 120, seatsActive: 90, activeUsers: 90, mtdSpendUsd: 2400, limitUsd: 2800, confidence: 'metered', risks: [], source: 'ramp', firstSeen: '2025-08-25' },
  { id: 't27', name: 'Grammarly Business', vendor: 'Grammarly', department: 'Operations', owner: 'N. Fernandes', state: 'sanctioned', pricingModel: 'seat', unitPriceUsd: 15, seatsPaid: 220, seatsActive: 128, activeUsers: 128, mtdSpendUsd: 3300, limitUsd: 3600, confidence: 'estimated', risks: [], source: 'ramp', firstSeen: '2024-05-21' },
]

/**
 * Spend that could not be resolved to a department. Shown in its own bucket
 * rather than dropped or guessed - see the entity resolution fallback in Part 2.
 */
export const unattributedSpend = [
  { id: 'u1', label: 'AI Tools Reseller Ltd - bundled invoice', amountUsd: 1650, reason: 'Reseller invoice does not itemise the underlying vendors.' },
  { id: 'u2', label: 'Unmatched card descriptors (9 transactions)', amountUsd: 1194, reason: 'Merchant strings did not match the vendor catalogue.' },
  { id: 'u3', label: 'ChatGPT Plus reimbursements (17 employees)', amountUsd: 340, reason: 'Personal-card purchases claimed through expenses; no cost centre on the claim.' },
]

export const alerts = [
  { id: 'a1', severity: 'high', title: 'Midjourney is 274% of its limit', detail: '$960 against a $350 limit. No internal owner, no DPA.', age: '2 h ago', toolId: 't11' },
  { id: 'a2', severity: 'medium', title: 'New tool discovered: Gamma AI', detail: '6 users signed in via Okta for the first time on 16 Aug.', age: '1 d ago', toolId: 't14' },
  { id: 'a3', severity: 'medium', title: 'OpenAI API spend up 38% week over week', detail: 'Consumption is driving the forecast overage, not seats.', age: '1 d ago', toolId: 't02' },
  { id: 'a4', severity: 'low', title: 'Grammarly Business renews in 21 days', detail: '92 of 220 seats idle. Renewing as-is costs $1,380 a month in unused licences.', age: '3 d ago', toolId: 't27' },
  { id: 'a5', severity: 'info', title: 'Zscaler connector failed to sync', detail: 'Network discovery is offline, so new shadow tools may go undetected.', age: '4 h ago', toolId: null },
]

// ---------------------------------------------------------------------------
// Derived aggregates. Computed rather than hardcoded so the screen stays honest.
// ---------------------------------------------------------------------------

const sum = (arr, fn) => arr.reduce((acc, x) => acc + (fn(x) || 0), 0)

export const toolsSpendUsd = sum(tools, (t) => t.mtdSpendUsd)
export const unattributedUsd = sum(unattributedSpend, (u) => u.amountUsd)
export const mtdSpendUsd = toolsSpendUsd + unattributedUsd

/** Trailing seven-day average, used as the forecast basis. Seasonality-naive by design. */
export const trailing7Avg =
  sum(dailySpend.slice(-7), (d) => d.subscription + d.consumption) / 7

export const daysRemaining = org.period.daysInMonth - org.period.dayOfMonth
export const forecastEomUsd = mtdSpendUsd + trailing7Avg * daysRemaining
export const forecastOverageUsd = forecastEomUsd - org.monthlyLimitUsd
export const percentOfLimit = (mtdSpendUsd / org.monthlyLimitUsd) * 100

export const seatsPaid = sum(tools, (t) => t.seatsPaid)
export const seatsActive = sum(tools, (t) => t.seatsActive)
export const seatsIdle = seatsPaid - seatsActive
export const idleSeatCostUsd = sum(tools, (t) =>
  t.pricingModel === 'seat' ? (t.seatsPaid - t.seatsActive) * t.unitPriceUsd : 0,
)

export const stateCounts = tools.reduce((acc, t) => {
  acc[t.state] = (acc[t.state] || 0) + 1
  return acc
}, {})

export const openPolicyFlags = sum(tools, (t) => t.risks.length)
export const highSeverityFlags = sum(tools, (t) =>
  t.risks.filter((r) => r === 'no_dpa' || r === 'trains_on_data').length,
)

export const estimatedShareOfSpend =
  sum(tools.filter((t) => t.confidence === 'estimated'), (t) => t.mtdSpendUsd) / mtdSpendUsd

export const sourceCounts = dataSources.reduce((acc, s) => {
  acc[s.status] = (acc[s.status] || 0) + 1
  return acc
}, {})

export const knownGaps = dataSources.filter((s) => s.gap)

/** Cumulative actual with a dashed forecast tail, for Chart 1. */
export function buildBurnUpSeries() {
  let running = 0
  const actual = dailySpend.map((d) => {
    running += d.subscription + d.consumption
    return {
      day: d.day,
      actual: running,
      provisional: d.day > lastReconciledDay ? running : null,
      forecast: d.day === org.period.dayOfMonth ? running : null,
    }
  })

  const tail = []
  for (let day = org.period.dayOfMonth + 1; day <= org.period.daysInMonth; day++) {
    running += trailing7Avg
    tail.push({ day, actual: null, provisional: null, forecast: running })
  }
  return [...actual, ...tail]
}

/** Top N tools by spend for Chart 2, with the remainder collapsed. */
export function buildToolSpendSeries(topN = 10) {
  const sorted = [...tools].sort((a, b) => b.mtdSpendUsd - a.mtdSpendUsd)
  const top = sorted.slice(0, topN).map((t) => ({
    name: t.name,
    spend: t.mtdSpendUsd,
    limit: t.limitUsd,
    state: t.state,
    overLimit: t.limitUsd != null && t.mtdSpendUsd > t.limitUsd,
    percentOfLimit: t.limitUsd ? (t.mtdSpendUsd / t.limitUsd) * 100 : null,
  }))
  const rest = sorted.slice(topN)
  if (rest.length) {
    top.push({
      name: `${rest.length} others`,
      spend: sum(rest, (t) => t.mtdSpendUsd),
      limit: null,
      state: 'aggregate',
      overLimit: false,
      percentOfLimit: null,
    })
  }
  return top
}

/** Department rollup for Chart 3, sorted by shadow dollars descending. */
export function buildDepartmentSeries() {
  const byDept = new Map()
  for (const t of tools) {
    const row =
      byDept.get(t.department) || { department: t.department, sanctioned: 0, pending: 0, shadow: 0 }
    if (t.state === 'sanctioned') row.sanctioned += t.mtdSpendUsd
    else if (t.state === 'pending') row.pending += t.mtdSpendUsd
    else if (t.state === 'shadow') row.shadow += t.mtdSpendUsd
    byDept.set(t.department, row)
  }
  const rows = [...byDept.values()]
    .map((r) => ({ ...r, total: r.sanctioned + r.pending + r.shadow }))
    .sort((a, b) => b.shadow - a.shadow || b.total - a.total)

  rows.push({
    department: 'Unattributed',
    sanctioned: 0,
    pending: 0,
    shadow: 0,
    unattributed: unattributedUsd,
    total: unattributedUsd,
  })
  return rows
}

export const departments = [...new Set(tools.map((t) => t.department))].sort()

export const worstShadowDept = buildDepartmentSeries().find((d) => d.shadow > 0)
