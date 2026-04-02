import { useState, useEffect } from 'react'
import { getAggregatedStats } from '../utils/analytics.js'

function fmt(n) {
  if (!n || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
  }).format(n)
}

export default function CounterPage({ onBack }) {
  const [stats, setStats] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  function refresh() {
    setStats(getAggregatedStats())
    setLastRefresh(new Date().toLocaleTimeString('en-AU'))
  }

  useEffect(() => { refresh() }, [])

  if (!stats) return null

  const { total, funnel, topBrands, topVehicles, salaryBuckets, recentResults, dailyActivity, leadsStored } = stats

  // Max count for funnel bar width
  const funnelMax = funnel[0]?.count || 1
  // Max for daily chart
  const dailyMax = Math.max(...dailyActivity.map(d => d[1]), 1)

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <button
            onClick={onBack}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium mb-2 flex items-center gap-1"
          >
            ← Back to Calculator
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Usage Stats</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Stored in this browser · {lastRefresh && `Last refreshed ${lastRefresh}`}
          </p>
        </div>
        <button
          onClick={refresh}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Events', value: total.toLocaleString(), color: 'text-slate-900' },
          { label: 'Page Views', value: funnel[0]?.count.toLocaleString() ?? '0', color: 'text-slate-900' },
          { label: 'Results Viewed', value: funnel[3]?.count.toLocaleString() ?? '0', color: 'text-brand-700' },
          { label: 'Leads Captured', value: leadsStored.toLocaleString(), color: 'text-green-700' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-2xl border border-slate-200 p-5 text-center shadow-sm">
            <div className={`text-3xl font-extrabold ${t.color}`}>{t.value}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Conversion funnel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Conversion Funnel</h2>
        <div className="space-y-3">
          {funnel.map((step, i) => {
            const pct = funnelMax > 0 ? Math.round((step.count / funnelMax) * 100) : 0
            const convPct = i > 0 && funnel[i - 1].count > 0
              ? Math.round((step.count / funnel[i - 1].count) * 100)
              : null
            return (
              <div key={step.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">
                    {step.icon} {step.label}
                  </span>
                  <div className="flex items-center gap-3">
                    {convPct !== null && (
                      <span className="text-xs text-slate-400">{convPct}% from prev</span>
                    )}
                    <span className="font-bold text-slate-900 w-12 text-right">{step.count}</span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily activity chart */}
      {dailyActivity.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Daily Activity (Last 14 Days)</h2>
          <div className="flex items-end gap-1.5 h-32">
            {dailyActivity.map(([day, count]) => (
              <div key={day} className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className="w-full bg-brand-400 rounded-sm"
                  style={{ height: `${Math.max(4, Math.round((count / dailyMax) * 100))}%` }}
                  title={`${day}: ${count} events`}
                />
                <span className="text-[9px] text-slate-400 mt-1 truncate w-full text-center">{day}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top brands + vehicles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Top Brands</h2>
          {topBrands.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <ol className="space-y-2">
              {topBrands.map(([brand, count], i) => (
                <li key={brand} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">
                    <span className="text-slate-400 mr-2">#{i + 1}</span>{brand}
                  </span>
                  <span className="font-bold text-brand-700">{count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Top Vehicles</h2>
          {topVehicles.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <ol className="space-y-2">
              {topVehicles.map(([vehicle, count], i) => (
                <li key={vehicle} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 truncate mr-2">
                    <span className="text-slate-400 mr-2">#{i + 1}</span>{vehicle}
                  </span>
                  <span className="font-bold text-brand-700 shrink-0">{count}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      {/* Salary distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Salary Distribution</h2>
        {Object.values(salaryBuckets).every(v => v === 0) ? (
          <p className="text-slate-400 text-sm">No data yet — users need to reach Results to be counted.</p>
        ) : (
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(salaryBuckets).map(([range, count]) => {
              const salMax = Math.max(...Object.values(salaryBuckets), 1)
              const pct = Math.round((count / salMax) * 100)
              return (
                <div key={range} className="text-center">
                  <div className="h-20 flex items-end justify-center mb-1">
                    <div
                      className="w-full max-w-[40px] mx-auto bg-brand-400 rounded-t"
                      style={{ height: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-700">{count}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{range}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent results */}
      {recentResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Calculations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase border-b border-slate-100">
                  <th className="text-left pb-2 pr-4">Vehicle</th>
                  <th className="text-right pb-2 pr-4">Salary</th>
                  <th className="text-right pb-2 pr-4">Wkly Saving</th>
                  <th className="text-right pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.map((e, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0">
                    <td className="py-2 pr-4 text-slate-700">{e.props?.vehicle || '—'}</td>
                    <td className="py-2 pr-4 text-right text-slate-600">
                      {e.props?.salary ? `$${e.props.salary.toLocaleString('en-AU')}` : '—'}
                    </td>
                    <td className="py-2 pr-4 text-right font-semibold text-brand-700">
                      {e.props?.weeklySaving ? fmt(e.props.weeklySaving) + '/wk' : '—'}
                    </td>
                    <td className="py-2 text-right text-slate-400 text-xs">
                      {new Date(e.ts).toLocaleString('en-AU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 pb-8">
        Data is stored locally in your browser. There are no server-side analytics on this page.
        <br />Vercel Analytics provides aggregate (anonymous) data in the deployment dashboard.
      </p>
    </main>
  )
}
