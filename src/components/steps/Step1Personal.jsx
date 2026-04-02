import { STATE_DATA } from '../../data/stateCosts.js'
import { getResidualPercentage } from '../../utils/calculator.js'

const LEASE_TERMS = [1, 2, 3, 4, 5]

function formatSalary(val) {
  if (!val) return ''
  return val.toLocaleString('en-AU')
}

function NumberInput({ label, value, onChange, prefix, suffix, placeholder, helper, min, max }) {
  function handleChange(e) {
    const raw = e.target.value.replace(/[^0-9.]/g, '')
    onChange(raw ? parseFloat(raw) : 0)
  }
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{prefix}</span>}
        <input
          type="text"
          inputMode="decimal"
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full py-2.5 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
            ${prefix ? 'pl-7 pr-3' : suffix ? 'pl-3 pr-12' : 'px-3'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">{suffix}</span>}
      </div>
      {helper && <p className="text-xs text-slate-400 mt-0.5">{helper}</p>}
    </div>
  )
}

export default function Step1Personal({ calculator }) {
  const { inputs, updateInput, updateCurrentCar, toggleCurrentCar, setStep } = calculator
  const { currentCar } = inputs

  function handleSalary(e) {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    updateInput('grossSalary', raw ? parseInt(raw, 10) : 0)
  }

  const canNext = inputs.grossSalary >= 1000 && !!inputs.state

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Your Details</h2>
        <p className="text-slate-500 mt-1">Tell us a bit about yourself to personalise your calculation.</p>
      </div>

      <div className="space-y-6">
        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Annual Gross Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={formatSalary(inputs.grossSalary)}
              onChange={handleSalary}
              placeholder="100,000"
              className="w-full pl-7 pr-4 py-3 border border-slate-300 rounded-xl text-slate-900 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Your total salary before tax, excluding superannuation.</p>
          {inputs.grossSalary > 0 && inputs.grossSalary < 18201 && (
            <p className="text-xs text-amber-600 mt-1 font-medium">
              Income below $18,201 — minimal tax savings from salary sacrifice (2% Medicare Levy only).
            </p>
          )}
          {inputs.grossSalary >= 135001 && (
            <p className="text-xs text-brand-700 mt-1 font-medium">
              Top tax bracket — novated lease is especially powerful. Every $1 of sacrifice saves ~{Math.round(getMarginalRate(inputs.grossSalary) * 100)}c in tax.
            </p>
          )}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            State / Territory
          </label>
          <select
            value={inputs.state}
            onChange={e => updateInput('state', e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-slate-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {Object.entries(STATE_DATA).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Affects rego, CTP, and applicable EV rebates.
          </p>
          {STATE_DATA[inputs.state]?.evRebate > 0 && (
            <p className="text-xs text-brand-700 mt-1 font-medium">
              Up to ${STATE_DATA[inputs.state].evRebate.toLocaleString()} EV rebate may be available in {STATE_DATA[inputs.state].label}
            </p>
          )}
        </div>

        {/* Lease Term */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Lease Term
          </label>
          <div className="grid grid-cols-5 gap-2">
            {LEASE_TERMS.map(term => {
              const residual = (getResidualPercentage(term) * 100).toFixed(2)
              return (
                <button
                  key={term}
                  onClick={() => updateInput('leaseTerm', term)}
                  className={`py-3 px-2 rounded-xl border-2 text-center transition-all
                    ${inputs.leaseTerm === term
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                >
                  <div className="font-bold text-lg leading-none">{term}yr</div>
                  <div className="text-xs text-slate-500 mt-1">{residual}% residual</div>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-slate-400 mt-2">Longer terms = lower residual = higher annual repayment portion.</p>
        </div>
      </div>

      {/* ── Current Car section (collapsible) ─────────────────────────────── */}
      <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleCurrentCar(!currentCar.enabled)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
        >
          <div>
            <div className="font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-lg">🚗</span>
              Compare with Your Current Car
              <span className="text-xs bg-brand-100 text-brand-700 font-semibold px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              See if switching to EV novated lease beats keeping your current car
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-slate-500 transition-transform ${currentCar.enabled ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {currentCar.enabled && (
          <div className="p-4 space-y-4 bg-white">
            <p className="text-xs text-slate-500">
              Enter your current car's running costs. We'll calculate your real monthly spend including the tax you pay on it,
              and show you whether switching to an EV novated lease is worth it.
            </p>

            {/* Car description */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Current Car <span className="font-normal text-slate-400">(optional label)</span></label>
              <input
                type="text"
                value={currentCar.description}
                onChange={e => updateCurrentCar('description', e.target.value)}
                placeholder="e.g. 2018 Jeep Compass"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Fuel */}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Fuel Consumption (L/100km)"
                value={currentCar.fuelConsumptionL}
                onChange={v => updateCurrentCar('fuelConsumptionL', v)}
                suffix="L"
                placeholder="13.5"
                helper="Check your car's manual or fuel bills"
              />
              <NumberInput
                label="Fuel Price ($/L)"
                value={currentCar.fuelPricePerLitre}
                onChange={v => updateCurrentCar('fuelPricePerLitre', v)}
                prefix="$"
                placeholder="2.50"
                helper="Current local petrol price"
              />
            </div>

            {/* Insurance & rego */}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Annual Insurance"
                value={currentCar.annualInsurance}
                onChange={v => updateCurrentCar('annualInsurance', v)}
                prefix="$"
                placeholder="1700"
                helper="Comprehensive car insurance per year"
              />
              <NumberInput
                label="Annual Rego + CTP"
                value={currentCar.annualRego}
                onChange={v => updateCurrentCar('annualRego', v)}
                prefix="$"
                placeholder="600"
                helper="Registration + CTP per year"
              />
            </div>

            {/* Servicing */}
            <NumberInput
              label="Annual Servicing + Maintenance"
              value={currentCar.annualServicing}
              onChange={v => updateCurrentCar('annualServicing', v)}
              prefix="$"
              placeholder="1200"
              helper="Estimate for services, tyres, repairs per year"
            />

            {/* Sale value */}
            <div className="grid grid-cols-2 gap-3">
              <NumberInput
                label="Estimated Sale Value"
                value={currentCar.estimatedSaleValue}
                onChange={v => updateCurrentCar('estimatedSaleValue', v)}
                prefix="$"
                placeholder="17000"
                helper="Private sale value (check Carsales)"
              />
              <NumberInput
                label="Remaining Loan Balance"
                value={currentCar.loanBalance}
                onChange={v => updateCurrentCar('loanBalance', v)}
                prefix="$"
                placeholder="0"
                helper="$0 if fully paid off"
              />
            </div>

            <div className="bg-brand-50 border border-brand-100 text-brand-700 text-xs rounded-lg p-3">
              At a {Math.round(getMarginalRate(inputs.grossSalary) * 100)}% marginal tax rate, every $1 you spend on your current car costs you ${(1 / (1 - getMarginalRate(inputs.grossSalary))).toFixed(2)} in gross salary to earn.
              Novated lease spending uses pre-tax dollars — the tax system pays {Math.round(getMarginalRate(inputs.grossSalary) * 100)}% of your car costs.
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setStep(2)}
          disabled={!canNext}
          className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Next: Choose Vehicle →
        </button>
      </div>
    </div>
  )
}

// Helper for the inline marginal rate display (same as calculator.js)
function getMarginalRate(salary) {
  if (salary <= 18200) return 0.02
  if (salary <= 45000) return 0.18
  if (salary <= 135000) return 0.32
  if (salary <= 190000) return 0.39
  return 0.47
}
