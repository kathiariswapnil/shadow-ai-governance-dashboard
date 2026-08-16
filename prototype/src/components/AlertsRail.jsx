import { alerts } from '../data/mockData.js'

const TONE = {
  high: { dot: 'bg-rose-400', border: 'border-rose-500/30' },
  medium: { dot: 'bg-amber-400', border: 'border-amber-500/20' },
  low: { dot: 'bg-yellow-300', border: 'border-yellow-500/20' },
  info: { dot: 'bg-slate-400', border: 'border-slate-700' },
}

export default function AlertsRail() {
  return (
    <aside className="rounded-lg border border-slate-800 bg-[#0f1520]">
      <header className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-[13px] font-semibold tracking-wide text-slate-200">Alerts</h2>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Four types only. Connector health sits in the same feed as spend.
        </p>
      </header>
      <ul className="divide-y divide-slate-800">
        {alerts.map((a) => {
          const tone = TONE[a.severity] || TONE.info
          return (
            <li key={a.id} className={`px-4 py-3 ${tone.border}`}>
              <div className="flex items-start gap-2">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`} />
                <div>
                  <p className="text-[12px] font-medium leading-snug text-slate-200">{a.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{a.detail}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600">{a.age}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
