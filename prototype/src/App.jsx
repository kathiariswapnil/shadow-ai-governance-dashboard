import { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import KpiStrip from './components/KpiStrip.jsx'
import BurnUpChart from './components/BurnUpChart.jsx'
import ToolSpendChart from './components/ToolSpendChart.jsx'
import DepartmentChart from './components/DepartmentChart.jsx'
import ActionTable from './components/ActionTable.jsx'
import AlertsRail from './components/AlertsRail.jsx'
import {
  org,
  tools,
  mtdSpendUsd,
  forecastOverageUsd,
  percentOfLimit,
  estimatedShareOfSpend,
} from './data/mockData.js'
import { usd } from './components/ui.jsx'

export default function App() {
  const [department, setDepartment] = useState('all')
  const filtered = useMemo(
    () => (department === 'all' ? tools : tools.filter((t) => t.department === department)),
    [department],
  )
  const daysLeft = org.period.daysInMonth - org.period.dayOfMonth
  const breached = forecastOverageUsd > 0

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-200">
      <Header departmentFilter={department} onDepartmentChange={setDepartment} />

      <main className="mx-auto max-w-[1400px] space-y-4 px-6 py-5">
        {estimatedShareOfSpend > 0.15 && (
          <p className="rounded border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[12px] text-amber-200">
            {(estimatedShareOfSpend * 100).toFixed(0)}% of this month&apos;s figure is estimated
            from usage or card descriptors rather than invoices. Connect Microsoft Graph and AP
            ingestion to firm this up.
          </p>
        )}

        <section className={`rounded-lg border px-4 py-3 ${breached ? 'border-rose-500/40 bg-rose-500/10' : 'border-slate-800 bg-[#0f1520]'}`}>
          <p className="text-[15px] font-medium leading-relaxed text-slate-100">
            You have used {percentOfLimit.toFixed(0)}% of the {org.period.label.split(' ')[0]} AI
            budget with {daysLeft} days left, and are tracking to finish{' '}
            <span className={breached ? 'text-rose-300' : 'text-emerald-300'}>
              {usd(Math.abs(forecastOverageUsd), { compact: true })} {breached ? 'over' : 'under'}
            </span>{' '}
            the {usd(org.monthlyLimitUsd, { compact: true })} limit.
          </p>
          <p className="mt-1 text-[12px] text-slate-400">
            Month-to-date {usd(mtdSpendUsd, { compact: true })}. Biggest movers: OpenAI API
            consumption and four newly discovered tools. Unattributed spend is shown, not guessed.
          </p>
        </section>

        <KpiStrip filteredTools={department === 'all' ? tools : filtered} />

        <div className="grid gap-4 xl:grid-cols-2">
          <BurnUpChart />
          <ToolSpendChart filteredTools={department === 'all' ? tools : filtered} />
        </div>

        <DepartmentChart />

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <ActionTable filteredTools={department === 'all' ? tools : filtered} />
          <AlertsRail />
        </div>

        <footer className="pb-8 pt-2 text-[11px] text-slate-600">
          Prototype for the Shadow AI take-home. Seeded mock data, not live. See{' '}
          <span className="text-slate-500">docs/part1-screen-spec.md</span>.
        </footer>
      </main>
    </div>
  )
}
