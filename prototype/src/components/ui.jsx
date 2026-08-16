import { CONFIDENCE, POLICY_STATE } from '../data/mockData.js'

export const PALETTE = {
  sanctioned: '#4f7cff',
  pending: '#f0b429',
  shadow: '#ef4761',
  unattributed: '#6b7280',
  aggregate: '#334155',
  actual: '#60a5fa',
  forecast: '#f59e0b',
  limit: '#ef4444',
  grid: '#1c2432',
  axis: '#64748b',
}

export function usd(value, { compact = false, decimals = 0 } = {}) {
  if (value == null) return '-'
  if (compact && Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

export function pct(value, decimals = 0) {
  if (value == null) return '-'
  return `${value.toFixed(decimals)}%`
}

export function Card({ title, subtitle, right, children, className = '' }) {
  return (
    <section
      className={`rounded-lg border border-slate-800 bg-[#0f1520] ${className}`}
    >
      {(title || right) && (
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-4 py-3">
          <div>
            {title && (
              <h2 className="text-[13px] font-semibold tracking-wide text-slate-200">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-0.5 text-[11px] text-slate-500">{subtitle}</p>
            )}
          </div>
          {right}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  )
}

/**
 * Provenance marker. Rendered on every figure - this is the trust mechanism
 * described in docs/part2-data-sources.md, not decoration.
 */
export function ConfidenceBadge({ level, showLabel = true }) {
  const c = CONFIDENCE[level]
  if (!c) return null
  const tone =
    level === 'metered'
      ? 'text-emerald-400'
      : level === 'estimated'
        ? 'text-amber-400'
        : 'text-slate-400'
  return (
    <span
      title={c.blurb}
      className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider ${tone}`}
    >
      <span aria-hidden>{c.glyph}</span>
      {showLabel && <span>{c.label}</span>}
    </span>
  )
}

export function StatusPill({ state }) {
  const s = POLICY_STATE[state]
  if (!s) return <span className="text-slate-500">-</span>
  const tone = {
    ok: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
    warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    bad: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    muted: 'border-slate-600/40 bg-slate-600/10 text-slate-400',
  }[s.tone]
  return (
    <span
      className={`inline-block whitespace-nowrap rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}
    >
      {s.label}
    </span>
  )
}

/**
 * The generated plain-language takeaway that sits under every chart.
 * See the closing section of docs/part3-charts.md.
 */
export function Takeaway({ children }) {
  return (
    <p className="mt-3 border-l-2 border-slate-700 pl-3 text-[12px] leading-relaxed text-slate-400">
      {children}
    </p>
  )
}

export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded border border-slate-700 bg-[#0b0f17] px-3 py-2 text-[11px] shadow-xl">
      <p className="mb-1 font-medium text-slate-200">{label}</p>
      {payload
        .filter((p) => p.value != null)
        .map((p) => (
          <p key={p.name} className="tabular text-slate-400">
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-sm align-middle"
              style={{ background: p.color || p.stroke }}
            />
            {p.name}: <span className="text-slate-200">{formatter ? formatter(p.value) : p.value}</span>
          </p>
        ))}
    </div>
  )
}
