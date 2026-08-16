import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  org,
  buildBurnUpSeries,
  forecastEomUsd,
  forecastOverageUsd,
  lastReconciledDay,
} from '../data/mockData.js'
import { Card, ChartTooltip, PALETTE, Takeaway, usd } from './ui.jsx'

export default function BurnUpChart() {
  const series = buildBurnUpSeries()
  const overage = forecastOverageUsd

  return (
    <Card
      title="Are we going to breach?"
      subtitle="Cumulative spend vs monthly limit · last 2 days provisional"
    >
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
            <CartesianGrid stroke={PALETTE.grid} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: PALETTE.axis, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: PALETTE.grid }}
            />
            <YAxis
              tick={{ fill: PALETTE.axis, fontSize: 11 }}
              tickFormatter={(v) => usd(v, { compact: true })}
              tickLine={false}
              axisLine={false}
              width={52}
            />
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(v) => usd(v, { compact: true, decimals: 1 })}
                />
              }
            />
            <ReferenceLine
              y={org.monthlyLimitUsd}
              stroke={PALETTE.limit}
              strokeDasharray="4 4"
              label={{
                value: `Limit ${usd(org.monthlyLimitUsd, { compact: true })}`,
                fill: PALETTE.limit,
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke={PALETTE.actual}
              fill={PALETTE.actual}
              fillOpacity={0.12}
              strokeWidth={2}
              connectNulls={false}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="provisional"
              name="Provisional"
              stroke={PALETTE.actual}
              strokeDasharray="3 3"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke={PALETTE.forecast}
              strokeDasharray="5 4"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-[10px] uppercase tracking-wider text-slate-500">
        <span className="text-blue-300">● Actual (reconciled through day {lastReconciledDay})</span>
        <span className="text-amber-300">- - Forecast (7-day avg)</span>
        <span className="text-rose-400">- - Limit</span>
      </div>
      <Takeaway>
        On current pace, {org.period.label.split(' ')[0]} closes{' '}
        <span className="text-rose-300">
          {usd(overage, { compact: true })} ({((overage / org.monthlyLimitUsd) * 100).toFixed(0)}%)
        </span>{' '}
        over the {usd(org.monthlyLimitUsd, { compact: true })} limit, at{' '}
        {usd(forecastEomUsd, { compact: true })}. Method: trailing 7-day average, seasonality-naive.
      </Takeaway>
    </Card>
  )
}
