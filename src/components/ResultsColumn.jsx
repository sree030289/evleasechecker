function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)
}

function Row({ label, value, valueClass = 'text-slate-700', strong = false }) {
  return (
    <div className={`flex justify-between items-center py-1.5 text-sm ${strong ? 'font-semibold' : ''}`}>
      <span className="text-slate-500">{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  )
}

export default function ResultsColumn({ data, leaseTerm, savingVs }) {
  const isNovated = data.highlight

  return (
    <div className={`relative rounded-2xl border-2 overflow-hidden flex flex-col
      ${isNovated
        ? 'border-brand-500 shadow-lg shadow-brand-100'
        : 'border-slate-200'}`}
    >
      {/* Featured badge */}
      {isNovated && (
        <div className="bg-brand-600 text-white text-xs font-bold text-center py-1.5 tracking-wider uppercase">
          Best Value
        </div>
      )}

      {/* Header */}
      <div className={`px-5 pt-5 pb-4 ${isNovated ? 'bg-brand-50' : 'bg-white'}`}>
        <div className="font-bold text-lg text-slate-900">{data.label}</div>
        <div className="text-xs text-slate-500">{data.subtitle}</div>

        {/* Net weekly cost — hero number */}
        <div className="mt-4 mb-1">
          <div className={`text-4xl font-extrabold ${isNovated ? 'text-brand-700' : 'text-slate-800'}`}>
            {fmt(data.netWeeklyCost)}
          </div>
          <div className="text-sm text-slate-500">per week from take-home pay</div>
        </div>

        <div className="flex gap-3 text-xs text-slate-500 mt-1">
          <span>{fmt(data.netMonthlyCost)}/mo</span>
          <span>·</span>
          <span>{fmt(data.netAnnualCost)}/yr</span>
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Breakdown */}
      <div className="px-5 py-4 bg-white flex-1 space-y-1">

        {/* Novated-specific rows */}
        {isNovated && (
          <>
            <Row label="Annual salary sacrifice" value={fmt(data.totalSalarySacrifice)} />
            <Row
              label="Tax saving"
              value={`- ${fmt(data.taxSaving)}`}
              valueClass="text-brand-700 font-semibold"
            />
            <Row
              label="GST saving (one-off)"
              value={`- ${fmt(data.gstSaving)}`}
              valueClass="text-brand-700"
            />
            <Row
              label="FBT"
              value={data.fbtExempt ? '$0 (Exempt)' : fmt(data.annualFBT)}
              valueClass={data.fbtExempt ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}
            />
          </>
        )}

        {/* Car loan specific */}
        {data.label === 'Car Loan' && (
          <>
            <Row label="Annual loan repayment" value={fmt(data.annualLoanRepayment)} />
            <Row label="Total interest over term" value={fmt(data.totalInterestPaid)} valueClass="text-red-500" />
          </>
        )}

        {/* Cash specific */}
        {data.label === 'Cash Purchase' && (
          <>
            <Row label="Opportunity cost (6.5%/yr)" value={fmt(data.annualOpportunityCost)} valueClass="text-slate-600" />
            <Row label="Annual depreciation" value={fmt(data.annualDepreciation)} valueClass="text-slate-600" />
          </>
        )}

        <div className="my-2 h-px bg-slate-100" />

        {/* Running costs */}
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Annual Running Costs</div>
        <Row label="Charging" value={fmt(data.annualRunningCosts.charging)} />
        <Row label="Insurance" value={fmt(data.annualRunningCosts.insurance)} />
        <Row label="Rego + CTP" value={fmt(data.annualRunningCosts.regoCTP)} />
        <Row label="Servicing" value={fmt(data.annualRunningCosts.servicing)} />
        <Row label="Tyres" value={fmt(data.annualRunningCosts.tyres)} />
        <Row label="Total running" value={fmt(data.annualRunningCosts.total)} strong />

        <div className="my-2 h-px bg-slate-100" />

        <Row label="Residual / end value" value={fmt(data.residualValue)} valueClass="text-slate-600" />
        <Row
          label={`Total cost over ${leaseTerm}yr`}
          value={fmt(data.totalCostOverTerm)}
          strong
          valueClass={isNovated ? 'text-brand-700' : 'text-slate-800'}
        />
      </div>

      {/* Saving vs car loan footer */}
      {isNovated && savingVs && (
        <div className="bg-brand-600 text-white px-5 py-3 text-center text-sm font-semibold">
          Save {fmt(savingVs.total)} over {leaseTerm}yr vs car loan ({fmt(savingVs.annual)}/yr)
        </div>
      )}
    </div>
  )
}
