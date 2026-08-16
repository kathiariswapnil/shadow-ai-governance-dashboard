import { useState } from 'react'
import {
  org,
  dataSources,
  sourceCounts,
  knownGaps,
  departments,
} from '../data/mockData.js'

const STATUS_DOT = {
  connected: 'bg-emerald-400',
  error: 'bg-rose-400',
  not_configured: 'bg-slate-600',
}

const STATUS_LABEL = {
  connected: 'Connected',
  error: 'Sync failed',
  not_configured: 'Not connected',
}

export default function Header({ departmentFilter, onDepartmentChange }) {
  const [showCoverage, setShowCoverage] = useState(false)
  const connected = sourceCounts.connected || 0

  return (
    <header className="border-b border-slate-800 bg-[#0b0f17]">
      <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-100">
            AI Governance
          </h1>
          <p className="mt-0.5 text-[12px] text-slate-500">
            {org.name} · {org.employees.toLocaleString()} employees
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-slate-700 bg-[#111827] px-3 py-1.5 text-[12px] text-slate-300">
            {org.period.label}
          </span>
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="rounded border border-slate-700 bg-[#111827] px-3 py-1.5 text-[12px] text-slate-300"
          >
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded border border-slate-700 bg-[#111827] px-3 py-1.5 text-[12px] text-slate-300 hover:border-slate-600"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Freshness and coverage. Part 1, annotation (2) - the trust anchor. */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800/60 px-6 py-2 text-[11px]">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Data as of {org.dataAsOf}
          <span className="text-slate-600">(oldest contributing source)</span>
        </span>

        <button
          type="button"
          onClick={() => setShowCoverage((v) => !v)}
          className="flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-amber-300 hover:border-amber-400/50"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Coverage: {connected} of {dataSources.length} sources connected ·{' '}
          {knownGaps.length} known {knownGaps.length === 1 ? 'gap' : 'gaps'}
          <span className="ml-1 text-amber-500/70">{showCoverage ? '▲' : '▼'}</span>
        </button>
      </div>

      {showCoverage && (
        <div className="border-t border-slate-800 bg-[#0d131d] px-6 py-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Sources
              </h3>
              <ul className="space-y-1.5">
                {dataSources.map((s) => (
                  <li key={s.id} className="flex items-center gap-2 text-[12px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s.status]}`} />
                    <span className="text-slate-300">{s.name}</span>
                    <span className="text-slate-600">{s.layer}</span>
                    <span className="ml-auto text-slate-500">
                      {s.lastSync || STATUS_LABEL[s.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                What this dashboard cannot see right now
              </h3>
              <ul className="space-y-2">
                {knownGaps.map((s) => (
                  <li key={s.id} className="text-[12px] leading-relaxed">
                    <span className="font-medium text-amber-300">{s.name}:</span>{' '}
                    <span className="text-slate-400">{s.gap}</span>
                  </li>
                ))}
                <li className="text-[12px] leading-relaxed">
                  <span className="font-medium text-amber-300">Structural limit:</span>{' '}
                  <span className="text-slate-400">
                    A subscription bought on a personal card, on a personal device, off
                    the corporate network is invisible to every source. Only an expense
                    claim or network egress can catch it.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
