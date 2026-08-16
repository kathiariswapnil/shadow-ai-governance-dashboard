import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildToolSpendSeries, tools } from '../data/mockData.js'
import { Card, PALETTE, Takeaway, usd } from './ui.jsx'

const STATE_COLOR = {
  sanctioned: PALETTE.sanctioned,
  pending: PALETTE.pending,
  shadow: PALETTE.shadow,
  aggregate: PALETTE.aggregate,
}

function TooltipBody({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded border border-slate-700 bg-[#0b0f17] px-3 py-2 text-[11px] shadow-xl">
      <p className="mb-1 font-medium text-slate-200">{d.name}</p>
      <p className="tabular text-slate-400">
        Spend: <span className="text-slate-200">{usd(d.spend)}</span>
      </p>
      <p className="tabular text-slate-400">
        Limit:{' '}
        <span className="text-slate-200">
          {d.limit == null ? 'none set' : usd(d.limit)}
        </span>
      </p>
      {d.percentOfLimit != null && (
        <p className="tabular text-slate-400">
          {d.percentOfLimit.toFixed(0)}% of limit
          {d.overLimit ? ' · over' : ''}
        </p>
      )}
    </div>
  )
}

export default function ToolSpendChart({ filteredTools }) {
  const source = filteredTools || tools
  const series =
    source === tools
      ? buildToolSpendSeries(10)
      : [...source]
          .sort((a, b) => b.mtdSpendUsd - a.mtdSpendUsd)
          .slice(0, 10)
          .map((t) => ({
            name: t.name,
            spend: t.mtdSpendUsd,
            limit: t.limitUsd,
            state: t.state,
            overLimit: t.limitUsd != null && t.mtdSpendUsd > t.limitUsd,
            percentOfLimit: t.limitUsd ? (t.mtdSpendUsd / t.limitUsd) * 100 : null,
          }))

  const overCount = series.filter((t) => t.overLimit).length
  const shadowCount = series.filter((t) => t.state === 'shadow').length
  const chartHeight = Math.max(240, series.length * 28)

  return (
    <Card
      title="Where is the money going?"
      subtitle="Top tools by MTD spend · ⋮ = tool limit · colour = policy state"
    >
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={series}
            layout="vertical"
            margin={{ top: 4, right: 28, left: 8, bottom: 0 }}
            barCategoryGap={6}
          >
            <CartesianGrid stroke={PALETTE.grid} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: PALETTE.axis, fontSize: 11 }}
              tickFormatter={(v) => usd(v, { compact: true })}
              tickLine={false}
              axisLine={{ stroke: PALETTE.grid }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={128}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<TooltipBody />} />
            <Bar dataKey="spend" name="Spend" radius={[0, 3, 3, 0]} maxBarSize={16}>
              {series.map((row) => (
                <Cell key={row.name} fill={STATE_COLOR[row.state] || PALETTE.aggregate} />
              ))}
            </Bar>
            {series.map((row) =>
              row.limit != null ? (
                <ReferenceLine
                  key={`lim-${row.name}`}
                  x={row.limit}
                  stroke="transparent"
                />
              ) : null,
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <LimitLegend series={series} />
      <Takeaway>
        {overCount} of the top {Math.min(10, series.length)} tools{' '}
        {overCount === 1 ? 'is' : 'are'} over {overCount === 1 ? 'its' : 'their'} limit
        {shadowCount ? `; ${shadowCount} ${shadowCount === 1 ? 'was' : 'were'} never approved.` : '.'}
      </Takeaway>
    </Card>
  )
}

function LimitLegend({ series }) {
  return (
    <div className="mt-2 space-y-1">
      {series
        .filter((r) => r.state !== 'aggregate')
        .slice(0, 6)
        .map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-[11px] text-slate-500">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: STATE_COLOR[r.state] }}
            />
            <span className="flex-1 truncate text-slate-400">{r.name}</span>
            <span className="tabular text-slate-300">{usd(r.spend, { compact: true })}</span>
            <span className="w-24 text-right tabular">
              {r.limit == null ? (
                <span className="text-amber-400/80">no limit set</span>
              ) : r.overLimit ? (
                <span className="text-rose-400">{r.percentOfLimit.toFixed(0)}% of limit</span>
              ) : (
                <span>{r.percentOfLimit.toFixed(0)}% of limit</span>
              )}
            </span>
          </div>
        ))}
      <div className="pt-1 text-[10px] uppercase tracking-wider text-slate-600">
        Blue sanctioned · amber pending · red shadow
      </div>
    </div>
  )
}
