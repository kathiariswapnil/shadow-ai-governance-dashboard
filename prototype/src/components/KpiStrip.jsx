import {
  org,
  mtdSpendUsd,
  forecastEomUsd,
  forecastOverageUsd,
  percentOfLimit,
  stateCounts,
  seatsPaid,
  seatsActive,
  seatsIdle,
  idleSeatCostUsd,
  openPolicyFlags,
  highSeverityFlags,
  estimatedShareOfSpend,
  tools,
} from '../data/mockData.js'
import { ConfidenceBadge, usd, pct } from './ui.jsx'

function Tile({ label, children, confidence, footer }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-[#0f1520] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-1.5">{children}</div>
      <div className="mt-2 flex items-center justify-between gap-2">
        {footer ? <div className="text-[11px] text-slate-500">{footer}</div> : <span />}
        <ConfidenceBadge level={confidence} />
      </div>
    </div>
  )
}

export default function KpiStrip({ filteredTools }) {
  const list = filteredTools || tools
  const spend = list === tools ? mtdSpendUsd : list.reduce((a, t) => a + t.mtdSpendUsd, 0)
  const pctUsed = (spend / org.monthlyLimitUsd) * 100
  const forecast = list === tools ? forecastEomUsd : spend + (spend / org.period.dayOfMonth) * (org.period.daysInMonth - org.period.dayOfMonth)
  const overage = forecast - org.monthlyLimitUsd
  const paid = list.reduce((a, t) => a + (t.seatsPaid || 0), 0)
  const active = list.reduce((a, t) => a + (t.seatsActive || 0), 0)
  const idle = paid - active
  const idleCost = list.reduce(
    (a, t) => a + (t.pricingModel === 'seat' ? (t.seatsPaid - t.seatsActive) * t.unitPriceUsd : 0),
    0,
  )
  const counts = list.reduce((acc, t) => {
    acc[t.state] = (acc[t.state] || 0) + 1
    return acc
  }, {})
  const flags = list.reduce((a, t) => a + t.risks.length, 0)
  const high = list.reduce(
    (a, t) => a + t.risks.filter((r) => r === 'no_dpa' || r === 'trains_on_data').length,
    0,
  )
  const estShare =
    list.reduce((a, t) => a + (t.confidence === 'estimated' ? t.mtdSpendUsd : 0), 0) / (spend || 1)

  const barWidth = Math.min(100, pctUsed)

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Tile
        label="MTD spend"
        confidence={estShare > 0.4 ? 'estimated' : 'metered'}
        footer={`${pct(pctUsed)} of ${usd(org.monthlyLimitUsd, { compact: true })} limit`}
      >
        <p className="tabular text-2xl font-semibold tracking-tight text-slate-100">
          {usd(spend, { compact: true })}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full ${pctUsed > 100 ? 'bg-rose-500' : pctUsed > 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </Tile>

      <Tile
        label="Forecast EOM"
        confidence="estimated"
        footer={
          overage > 0
            ? `${usd(overage, { compact: true })} over limit`
            : `${usd(Math.abs(overage), { compact: true })} under limit`
        }
      >
        <p className="tabular text-2xl font-semibold tracking-tight text-slate-100">
          {usd(forecast, { compact: true })}
        </p>
        <p className={`mt-1 text-[12px] ${overage > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
          {overage > 0 ? '▲' : '▼'} {usd(Math.abs(overage), { compact: true })}
        </p>
      </Tile>

      <Tile
        label="Tools in use"
        confidence="inferred"
        footer={`${counts.shadow || 0} unapproved`}
      >
        <p className="tabular text-2xl font-semibold tracking-tight text-slate-100">
          {list.length}
        </p>
        <p className="mt-1 text-[12px] text-slate-400">
          <span className="text-blue-300">{counts.sanctioned || 0} sanctioned</span>
          {' · '}
          <span className="text-rose-300">{counts.shadow || 0} shadow</span>
        </p>
      </Tile>

      <Tile
        label="Seat usage"
        confidence="metered"
        footer={`${usd(idleCost, { compact: true })}/mo recoverable`}
      >
        <p className="tabular text-2xl font-semibold tracking-tight text-slate-100">
          {active.toLocaleString()}/{paid.toLocaleString()}
        </p>
        <p className="mt-1 text-[12px] text-slate-400">{idle.toLocaleString()} idle seats</p>
      </Tile>

      <Tile
        label="Policy flags"
        confidence="metered"
        footer={`${high} high · ${flags - high} medium`}
      >
        <p className="tabular text-2xl font-semibold tracking-tight text-slate-100">{flags} open</p>
        <p className="mt-1 text-[12px] text-slate-400">DPA, training, SSO, owner</p>
      </Tile>
    </div>
  )
}

export { percentOfLimit, seatsPaid, seatsActive, seatsIdle, idleSeatCostUsd, stateCounts, openPolicyFlags, highSeverityFlags, estimatedShareOfSpend }
