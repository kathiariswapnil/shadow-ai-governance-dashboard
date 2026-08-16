import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { buildDepartmentSeries, worstShadowDept } from '../data/mockData.js'
import { Card, PALETTE, Takeaway, usd } from './ui.jsx'

function TooltipBody({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((a, p) => a + (p.value || 0), 0)
  return (
    <div className="rounded border border-slate-700 bg-[#0b0f17] px-3 py-2 text-[11px] shadow-xl">
      <p className="mb-1 font-medium text-slate-200">{label}</p>
      {payload
        .filter((p) => p.value)
        .map((p) => (
          <p key={p.name} className="tabular text-slate-400">
            <span
              className="mr-1.5 inline-block h-2 w-2 rounded-sm align-middle"
              style={{ background: p.color }}
            />
            {p.name}: <span className="text-slate-200">{usd(p.value)}</span>
          </p>
        ))}
      <p className="mt-1 tabular text-slate-500">Total {usd(total)}</p>
    </div>
  )
}

export default function DepartmentChart() {
  const series = buildDepartmentSeries()
  const worst = worstShadowDept

  return (
    <Card
      title="Who do I call?"
      subtitle="Stacked spend by department, sorted by shadow dollars descending"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={series}
            layout="vertical"
            margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
            barCategoryGap={8}
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
              dataKey="department"
              width={96}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<TooltipBody />} />
            <Bar dataKey="sanctioned" name="Sanctioned" stackId="a" fill={PALETTE.sanctioned} />
            <Bar dataKey="pending" name="Pending review" stackId="a" fill={PALETTE.pending} />
            <Bar dataKey="shadow" name="Shadow" stackId="a" fill={PALETTE.shadow} />
            <Bar
              dataKey="unattributed"
              name="Unattributed"
              stackId="a"
              fill={PALETTE.unattributed}
              radius={[0, 3, 3, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-slate-500">
        <span className="text-blue-300">█ Sanctioned</span>
        <span className="text-amber-300">█ Pending review</span>
        <span className="text-rose-300">█ Shadow</span>
        <span className="text-slate-400">█ Unattributed</span>
      </div>
      <Takeaway>
        {worst ? (
          <>
            <span className="text-slate-200">{worst.department}</span> has{' '}
            <span className="text-rose-300">{usd(worst.shadow, { compact: true })}</span> of
            unapproved AI spend this month, the highest of any department. The Unattributed row is
            spend we could not map to a cost centre — not dropped, not guessed.
          </>
        ) : (
          <>No shadow spend attributed to a department this month.</>
        )}
      </Takeaway>
    </Card>
  )
}
