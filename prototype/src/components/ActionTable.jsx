import { useMemo, useState } from 'react'
import { RISK_LABELS, tools as allTools } from '../data/mockData.js'
import { Card, StatusPill, usd } from './ui.jsx'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'shadow', label: 'Shadow' },
  { id: 'over', label: 'Over limit' },
  { id: 'risk', label: 'Risk' },
]

const RISK_SHORT = {
  no_dpa: 'DPA',
  trains_on_data: 'Trains',
  no_sso: 'SSO',
  no_owner: 'Owner',
}

function severity(t) {
  const over = t.limitUsd != null && t.mtdSpendUsd > t.limitUsd
  if (t.state === 'shadow' && over) return 0
  if (t.state === 'shadow') return 1
  if (over) return 2
  if (t.risks.length) return 3
  if (t.state === 'pending') return 4
  return 5
}

function pctOfLimit(t) {
  if (t.limitUsd == null) return null
  return (t.mtdSpendUsd / t.limitUsd) * 100
}

export default function ActionTable({ filteredTools }) {
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const source = filteredTools || allTools

  const rows = useMemo(() => {
    let list = [...source]
    if (filter === 'shadow') list = list.filter((t) => t.state === 'shadow')
    if (filter === 'over') list = list.filter((t) => t.limitUsd != null && t.mtdSpendUsd > t.limitUsd)
    if (filter === 'risk') list = list.filter((t) => t.risks.length > 0)
    return list.sort((a, b) => severity(a) - severity(b) || b.mtdSpendUsd - a.mtdSpendUsd)
  }, [source, filter])

  function act(label, tool) {
    setToast(`${label}: ${tool.name}. In v1 this creates a request, it does not enforce.`)
    window.setTimeout(() => setToast(null), 2800)
  }

  return (
    <Card
      title="Tools needing attention"
      subtitle="Sorted by severity, not alphabetically. Empty owner is itself a finding."
      right={
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded px-2 py-1 text-[11px] ${
                filter === f.id
                  ? 'bg-slate-700 text-slate-100'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      {toast && (
        <p className="mb-3 rounded border border-slate-700 bg-slate-800/60 px-3 py-2 text-[12px] text-slate-300">
          {toast}
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-[12px]">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="pb-2 pr-3 font-medium">Tool</th>
              <th className="pb-2 pr-3 font-medium">Owner</th>
              <th className="pb-2 pr-3 font-medium">Dept</th>
              <th className="pb-2 pr-3 font-medium">Users</th>
              <th className="pb-2 pr-3 font-medium">MTD</th>
              <th className="pb-2 pr-3 font-medium">Limit</th>
              <th className="pb-2 pr-3 font-medium">%</th>
              <th className="pb-2 pr-3 font-medium">Status</th>
              <th className="pb-2 pr-3 font-medium">Risk</th>
              <th className="pb-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => {
              const p = pctOfLimit(t)
              return (
                <tr key={t.id} className="border-b border-slate-800/70 align-middle">
                  <td className="py-2.5 pr-3 font-medium text-slate-200">
                    {t.name}
                    {t.note && (
                      <span className="ml-1 text-[10px] font-normal text-slate-500" title={t.note}>
                        ⓘ
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3">
                    {t.owner ? (
                      <span className="text-slate-300">{t.owner}</span>
                    ) : (
                      <span className="text-rose-400">(none)</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-slate-400">{t.department}</td>
                  <td className="tabular py-2.5 pr-3 text-slate-300">{t.activeUsers}</td>
                  <td className="tabular py-2.5 pr-3 text-slate-200">
                    {usd(t.mtdSpendUsd, { compact: true })}
                  </td>
                  <td className="tabular py-2.5 pr-3 text-slate-400">
                    {t.limitUsd == null ? 'none' : usd(t.limitUsd, { compact: true })}
                  </td>
                  <td className="tabular py-2.5 pr-3">
                    {p == null ? (
                      <span className="text-slate-600">n/a</span>
                    ) : (
                      <span
                        className={
                          p > 100 ? 'text-rose-400' : p > 90 ? 'text-amber-300' : 'text-slate-300'
                        }
                      >
                        {p.toFixed(0)}%
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusPill state={t.state} />
                  </td>
                  <td className="py-2.5 pr-3">
                    {t.risks.length === 0 ? (
                      <span className="text-slate-600">-</span>
                    ) : (
                      <span className="flex flex-wrap gap-1">
                        {t.risks.map((r) => (
                          <span
                            key={r}
                            title={RISK_LABELS[r]}
                            className="rounded border border-rose-500/30 bg-rose-500/10 px-1 py-0.5 text-[10px] text-rose-300"
                          >
                            {RISK_SHORT[r]}
                          </span>
                        ))}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5">
                    <span className="flex flex-wrap gap-1">
                      {t.state === 'shadow' || t.state === 'pending' ? (
                        <button
                          type="button"
                          onClick={() => act('Approve requested', t)}
                          className="rounded border border-slate-700 px-1.5 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => act('Set limit', t)}
                        className="rounded border border-slate-700 px-1.5 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                      >
                        {t.limitUsd && t.mtdSpendUsd > t.limitUsd ? 'Raise cap' : 'Set limit'}
                      </button>
                      {t.state === 'shadow' ? (
                        <button
                          type="button"
                          onClick={() => act('Block request queued for IdP/network admin', t)}
                          className="rounded border border-rose-500/40 px-1.5 py-0.5 text-[11px] text-rose-300 hover:border-rose-400"
                        >
                          Block
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => act('Owner review requested', t)}
                          className="rounded border border-slate-700 px-1.5 py-0.5 text-[11px] text-slate-300 hover:border-slate-500"
                        >
                          Review
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-slate-500">
        Showing {rows.length} of {source.length} tools. Block and approve create a request in v1 —
        they do not enforce.
      </p>
    </Card>
  )
}
