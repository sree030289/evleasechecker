function fmt(n) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
  }).format(n)
}

function fmtPct(r) {
  return (r * 100).toFixed(0) + '%'
}

function Row({ label, a, b, c, highlight, note, inverseColor }) {
  // inverseColor: lower is better for costs (green = lower); for savings, higher is better
  return (
    <tr className={highlight ? 'bg-slate-50 font-semibold' : ''}>
      <td className="py-2.5 px-3 text-sm text-slate-600 border-b border-slate-100">
        {label}
        {note && <div className="text-xs text-slate-400 font-normal">{note}</div>}
      </td>
      <td className="py-2.5 px-3 text-sm text-center border-b border-slate-100">{a}</td>
      <td className="py-2.5 px-3 text-sm text-center border-b border-slate-100 bg-brand-50 font-semibold text-brand-800">{b}</td>
      <td className="py-2.5 px-3 text-sm text-center border-b border-slate-100">{c}</td>
    </tr>
  )
}

export default function TradeInComparison({ comparison, inputs, vehicleData }) {
  if (!comparison) return null

  const { optionA, optionB, optionC, netSaleProceeds, marginalRate,
    monthlySavingBvsA, annualSavingBvsA, paybackMonths, recommendation,
    govtPaysForCurrent, totalYearlyFuelSaving } = comparison

  const carName = inputs.currentCar.description || 'Current Car'
  const evName = vehicleData?.name || 'New EV'

  // Is switching financially better?
  const switchIsBetter = monthlySavingBvsA > 0

  return (
    <div className="space-y-6">

      {/* ── Headline ──────────────────────────────────────────────────────── */}
      <div className={`rounded-2xl p-6 text-center ${switchIsBetter ? 'bg-gradient-to-br from-brand-600 to-brand-700 text-white' : 'bg-slate-800 text-white'}`}>
        <div className="text-sm font-medium opacity-80 mb-1">Should You Switch?</div>
        {switchIsBetter ? (
          <>
            <div className="text-4xl font-extrabold">{fmt(Math.abs(monthlySavingBvsA))}/month</div>
            <div className="opacity-90 mt-1 text-lg">
              better off switching to {evName} on a novated lease
            </div>
            <div className="opacity-70 text-sm mt-1">
              {fmt(Math.abs(annualSavingBvsA))}/year · {fmt(Math.abs(annualSavingBvsA) * inputs.leaseTerm)} over {inputs.leaseTerm} years
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl font-extrabold">{fmt(Math.abs(monthlySavingBvsA))}/month</div>
            <div className="opacity-90 mt-1 text-lg">
              cheaper to keep your {carName} for now
            </div>
            <div className="opacity-70 text-sm mt-1">
              The novated lease costs more than keeping the paid-off car at this salary level.
            </div>
          </>
        )}
      </div>

      {/* ── True Current Cost ─────────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <span>⛽</span> Your {carName} "True Cost" (After Tax)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Monthly Fuel', value: fmt(optionA.monthlyFuel) },
            { label: 'Monthly Insurance', value: fmt(optionA.monthlyInsurance) },
            { label: 'Monthly Rego', value: fmt(optionA.monthlyRego) },
            { label: 'Monthly Servicing', value: fmt(optionA.monthlyServicing) },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-lg p-3 border border-amber-100">
              <div className="text-xs text-amber-700 mb-1">{item.label}</div>
              <div className="font-bold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 bg-white rounded-xl p-4 border border-amber-100">
          <div>
            <div className="text-xs text-slate-500">Total monthly spend</div>
            <div className="text-2xl font-bold text-slate-900">{fmt(optionA.totalMonthlyPostTax)}/mo</div>
            <div className="text-xs text-slate-400">Post-tax dollars</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Salary needed to earn this</div>
            <div className="text-2xl font-bold text-amber-700">{fmt(optionA.totalMonthlyPreTaxEquivalent)}/mo</div>
            <div className="text-xs text-slate-400">
              At {fmtPct(marginalRate)} marginal rate — employer pays you ${fmt(optionA.totalMonthlyPreTaxEquivalent)}, you keep {fmt(optionA.totalMonthlyPostTax)}
            </div>
          </div>
        </div>
        <p className="text-xs text-amber-700 mt-3">
          The government takes <strong>{fmt(govtPaysForCurrent)}/yr</strong> in tax before that money can even reach your fuel pump.
          A novated lease flips this — your car costs come out before tax.
        </p>
      </div>

      {/* ── 3-Option Comparison Table ─────────────────────────────────────── */}
      <div>
        <h3 className="font-bold text-slate-900 text-lg mb-3">The 3 Options Side by Side</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide w-2/5">Expense</th>
                <th className="py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide text-center">
                  A — Keep {carName.length > 15 ? 'Current Car' : carName}
                </th>
                <th className="py-3 px-3 text-xs font-bold text-brand-700 uppercase tracking-wide text-center bg-brand-50">
                  B — EV Lease<br />
                  <span className="normal-case font-medium text-brand-600">$0 upfront</span>
                </th>
                <th className="py-3 px-3 text-xs font-bold text-slate-500 uppercase tracking-wide text-center">
                  C — EV Lease<br />
                  <span className="normal-case font-medium text-slate-400">{netSaleProceeds > 0 ? fmt(netSaleProceeds) + ' upfront' : 'N/A'}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <Row
                label="Fuel / Charging"
                a={fmt(optionA.monthlyFuel)}
                b="$0 (included in lease)"
                c="$0 (included in lease)"
              />
              <Row
                label="Insurance"
                a={fmt(optionA.monthlyInsurance)}
                b="$0 (included)"
                c="$0 (included)"
              />
              <Row
                label="Rego + CTP"
                a={fmt(optionA.monthlyRego)}
                b="$0 (included)"
                c="$0 (included)"
              />
              <Row
                label="Servicing / Maintenance"
                a={fmt(optionA.monthlyServicing)}
                b="$0 (included)"
                c="$0 (included)"
              />
              <Row
                label="Lease / Finance"
                a="$0 (paid off)"
                b={fmt(optionB.monthlyGrossLeaseCost)}
                c={fmt(optionC.monthlyGrossBeforeReduction)}
                note="Monthly take-home sacrifice"
              />
              <Row
                label="Tax / GST Savings"
                a="$0"
                b={`−${fmt(optionB.monthlyGrossLeaseCost - optionB.totalMonthlyNet)}`}
                c={`−${fmt(optionC.monthlyGrossBeforeReduction - optionC.totalMonthlyNet)}`}
                note="Government subsidy via pre-tax dollars"
              />
              {netSaleProceeds > 0 && (
                <Row
                  label="Offset Account Benefit"
                  a="$0"
                  b={`+${fmt(optionB.monthlyOffsetBenefit)}/mo`}
                  c="—"
                  note={`${fmt(netSaleProceeds)} @ 6.5% p.a.`}
                />
              )}
              <Row
                label="NET MONTHLY WALLET IMPACT"
                a={fmt(optionA.totalMonthlyPostTax)}
                b={fmt(optionB.totalMonthlyNet)}
                c={fmt(optionC.totalMonthlyNet)}
                highlight
              />
            </tbody>
          </table>
        </div>

        {/* Option B vs C note */}
        {netSaleProceeds > 0 && (
          <div className="mt-3 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600">
            <strong>Option B vs C:</strong> Option C saves {fmt(optionB.totalMonthlyNet - optionC.totalMonthlyNet)}/month on take-home pay
            but you give up {fmt(netSaleProceeds)} in cash today. Even at a reduced monthly cost, it takes{' '}
            {paybackMonths != null ? <strong>{paybackMonths > 36 ? 'over 3 years' : paybackMonths + ' months'}</strong> : <strong>a very long time</strong>}{' '}
            just to break even on the capital you deployed. Meanwhile in Option B, your {fmt(netSaleProceeds)} is{' '}
            earning interest in your offset account every month.
          </div>
        )}
      </div>

      {/* ── 3-Year Total Cost Comparison ─────────────────────────────────── */}
      <div>
        <h3 className="font-bold text-slate-900 text-lg mb-3">{inputs.leaseTerm}-Year Total Cost Comparison</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: `Keep ${carName.length > 12 ? 'Current Car' : carName}`,
              color: 'border-slate-300',
              bg: 'bg-white',
              badge: null,
              amount: optionA.totalOverTerm,
              sub: 'Running costs only (car already owned)',
            },
            {
              label: 'EV Lease — $0 upfront',
              color: 'border-brand-400',
              bg: 'bg-brand-50',
              badge: recommendation === 'B' ? 'Best Choice' : null,
              amount: optionB.totalOverTerm,
              sub: `Incl. ${fmt(optionB.residualAtEnd)} balloon at end`,
            },
            {
              label: `EV Lease — ${fmt(netSaleProceeds)} upfront`,
              color: 'border-slate-300',
              bg: 'bg-white',
              badge: null,
              amount: optionC.totalOverTerm,
              sub: `Incl. ${fmt(optionC.residualAtEnd)} balloon at end`,
            },
          ].map(opt => (
            <div key={opt.label} className={`${opt.bg} border-2 ${opt.color} rounded-xl p-4 text-center relative`}>
              {opt.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {opt.badge}
                </div>
              )}
              <div className="text-xs font-semibold text-slate-500 mb-2 mt-1">{opt.label}</div>
              <div className={`text-2xl font-extrabold ${opt.badge ? 'text-brand-700' : 'text-slate-800'}`}>
                {fmt(opt.amount)}
              </div>
              <div className="text-xs text-slate-400 mt-1">{opt.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recommendation section ─────────────────────────────────────────── */}
      <div className={`rounded-2xl p-5 border-2 ${switchIsBetter ? 'bg-brand-50 border-brand-300' : 'bg-amber-50 border-amber-300'}`}>
        <h3 className={`font-bold text-lg mb-3 ${switchIsBetter ? 'text-brand-800' : 'text-amber-800'}`}>
          {switchIsBetter ? '✅ Verdict: Switch to EV Novated Lease' : '⚠️ Verdict: Keep Your Current Car for Now'}
        </h3>

        {switchIsBetter ? (
          <div className="space-y-2 text-sm text-brand-800">
            <p>
              On your <strong>${inputs.grossSalary.toLocaleString('en-AU')} salary</strong>, the EV novated lease is the financially superior choice.
              The government essentially subsidises <strong>{fmtPct(marginalRate)}</strong> of your car costs through pre-tax salary sacrifice.
            </p>
            {netSaleProceeds > 0 && (
              <p>
                <strong>Option B is the winning strategy:</strong> Sell the {carName} for {fmt(inputs.currentCar.estimatedSaleValue)},
                put the {fmt(netSaleProceeds)} net proceeds into your mortgage offset account <strong>(do not pay it into the lease upfront)</strong>.
                That cash earns 6.5% while the government already subsidises your lease.
              </p>
            )}
            <p>
              Fuel saving alone: <strong>{fmt(totalYearlyFuelSaving)}/year</strong> eliminated.
              Your EV lease also covers insurance, rego, charging and servicing — all pre-tax.
            </p>
            <div className="bg-white border border-brand-200 rounded-lg p-3 mt-3 text-xs text-brand-700">
              <strong>FBT warning:</strong> This calculation assumes the {evName} is under the $91,387 LCT threshold and eligible for the FBT exemption.
              If the exemption is removed after mid-2027, leases signed now are typically grandfathered for the lease term.
              Sign sooner rather than later to lock in the benefit.
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm text-amber-800">
            <p>
              Keeping your paid-off car is <strong>{fmt(Math.abs(monthlySavingBvsA))}/month</strong> cheaper right now.
              The novated lease is an upgrade — not a pure cost-saving move at this salary level.
            </p>
            <p>
              However, if your salary increases, if petrol hits <strong>$2.80+/L</strong>, or if your car starts requiring major repairs,
              the calculation will swing in favour of switching.
            </p>
            {netSaleProceeds > 0 && (
              <p>
                Your {carName} still has {fmt(netSaleProceeds)} in value. That cash would erode the cost gap significantly — consider the EV lease
                if you're planning to replace the car anyway within 2 years.
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Key facts pullout ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Annual fuel saving', value: fmt(totalYearlyFuelSaving), sub: 'By switching to EV', color: 'text-brand-700' },
          { label: 'Tax subsidy on lease', value: fmtPct(marginalRate), sub: 'Every lease dollar saves this', color: 'text-brand-700' },
          { label: `${inputs.leaseTerm}-yr balloon payment`, value: fmt(optionB.residualAtEnd), sub: 'ATO minimum residual', color: 'text-slate-700' },
          { label: 'Offset benefit (yr 1)', value: fmt(netSaleProceeds * 0.065), sub: `On ${fmt(netSaleProceeds)} @ 6.5%`, color: 'text-slate-700' },
        ].map(f => (
          <div key={f.label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-500 mb-1">{f.label}</div>
            <div className={`text-xl font-bold ${f.color}`}>{f.value}</div>
            <div className="text-xs text-slate-400">{f.sub}</div>
          </div>
        ))}
      </div>

    </div>
  )
}
