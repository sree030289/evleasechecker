import ResultsColumn from '../ResultsColumn.jsx'
import TradeInComparison from '../TradeInComparison.jsx'
import { STATE_DATA } from '../../data/stateCosts.js'

function fmt(n) {
  if (!n || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
  }).format(n)
}

export default function Step4Results({ calculator, onGetQuote }) {
  const { inputs, results, vehicleData, tradeInComparison, setStep } = calculator

  if (!results) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p>Something went wrong. Please go back and try again.</p>
        <button onClick={() => setStep(3)} className="mt-4 text-brand-600 underline">← Go back</button>
      </div>
    )
  }

  const { novated, carLoan, cash, summary, lowSalaryWarning, overSacrificeWarning } = results
  const stateInfo = STATE_DATA[inputs.state]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Your Results</h2>
        {vehicleData && (
          <p className="text-slate-500 mt-1">
            {vehicleData.name} · {inputs.leaseTerm}yr lease · ${inputs.grossSalary.toLocaleString('en-AU')} salary · {inputs.state}
          </p>
        )}
      </div>

      {/* Warnings */}
      {lowSalaryWarning && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-3">
          Income below $18,201 — novated lease provides minimal tax benefit (Medicare Levy only).
        </div>
      )}
      {overSacrificeWarning && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-3">
          The total salary sacrifice exceeds 90% of your gross income. Discuss limits with your employer and lease provider.
        </div>
      )}

      {/* ── Trade-in comparison section (shown first if current car is enabled) ── */}
      {tradeInComparison && inputs.currentCar.enabled && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Should You Switch from Your Current Car?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <TradeInComparison
            comparison={tradeInComparison}
            inputs={inputs}
            vehicleData={vehicleData}
          />
          <div className="h-px bg-slate-200 mt-8 mb-6" />
        </div>
      )}

      {/* ── EV Novated Lease vs Finance options ─────────────────────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-sm font-bold text-slate-600 uppercase tracking-wide">Novated Lease vs Financing Options</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Savings banner */}
      {summary.annualSavingVsLoan > 200 && (
        <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-2xl p-6 mb-6 text-center">
          <div className="text-sm font-medium text-brand-100 mb-1">Estimated annual saving vs car loan</div>
          <div className="text-5xl font-extrabold">{fmt(summary.annualSavingVsLoan)}/yr</div>
          <div className="text-brand-200 mt-1">
            That's {fmt(summary.weeklyTakeHomeSaving)}/wk · {fmt(summary.totalSavingVsLoan)} over {inputs.leaseTerm}yr
          </div>
          {vehicleData && (
            <div className="text-brand-100 text-sm mt-2">
              Driving a {vehicleData.name} on a novated lease
            </div>
          )}
        </div>
      )}

      {/* 3-column comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <ResultsColumn
          data={novated}
          leaseTerm={inputs.leaseTerm}
          savingVs={{ annual: summary.annualSavingVsLoan, total: summary.totalSavingVsLoan }}
        />
        <ResultsColumn data={carLoan} leaseTerm={inputs.leaseTerm} />
        <ResultsColumn data={cash} leaseTerm={inputs.leaseTerm} />
      </div>

      {/* State rebate callout */}
      {stateInfo?.evRebate > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-4 mb-6 text-sm">
          <strong>State EV Incentive:</strong> A {fmt(stateInfo.evRebate)} rebate may be available in {stateInfo.label}.
          <br /><span className="text-blue-600">{stateInfo.notes}</span>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="text-2xl font-bold text-slate-900 mb-2">Ready to get started?</div>
        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
          Get a free personalised quote from a certified novated lease provider. Takes 60 seconds.
        </p>
        <button
          onClick={onGetQuote}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-100"
        >
          Get My Free Novated Lease Quote →
        </button>
        <p className="text-slate-400 text-xs mt-3">No commitment · You choose the provider</p>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-xs text-slate-400 space-y-1 leading-relaxed">
        <p>All figures are estimates for illustrative purposes only, not financial or tax advice. Running costs use mid-range estimates.</p>
        <p>Car loan comparison assumes 8% p.a. amortising. Novated lease uses flat-rate interest method. Cash opportunity cost at 6.5% p.a. mortgage offset rate.</p>
        <p>FBT exemption applies to eligible BEVs registered under the Treasury Laws Amendment (Electric Car Discount) Act 2022, subject to current ATO rules. PHEVs are not exempt from 1 April 2025.</p>
        <p>Trade-in comparison uses estimated current values and fuel costs. Always verify with a qualified novated lease provider and seek independent tax advice.</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setStep(3)}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ← Adjust Numbers
        </button>
      </div>
    </div>
  )
}
