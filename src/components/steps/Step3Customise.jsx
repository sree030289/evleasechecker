function fmt(n) {
  if (n === undefined || n === null || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(n)
}

export default function Step3Customise({ calculator }) {
  const { inputs, updateInput, vehicleData, quickSaving, setStep } = calculator

  function handleKm(e) {
    updateInput('annualKm', parseInt(e.target.value))
  }
  function handleRate(e) {
    updateInput('interestRate', parseFloat(e.target.value))
  }
  function handleElec(e) {
    updateInput('electricityRate', parseFloat(e.target.value))
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Customise Your Numbers</h2>
        <p className="text-slate-500 mt-1">Adjust these to match your actual situation.</p>
      </div>

      {/* Selected vehicle summary */}
      {vehicleData && (
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-brand-700 font-semibold uppercase tracking-wide">Selected Vehicle</div>
            <div className="font-bold text-slate-900 mt-0.5">{vehicleData.name}</div>
            <div className="text-sm text-slate-600">
              {fmt(vehicleData.price_driveaway)} drive-away · {vehicleData.range_km}km range
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            className="text-brand-600 hover:text-brand-800 text-sm font-semibold underline"
          >
            Change Vehicle
          </button>
        </div>
      )}

      <div className="space-y-8">
        {/* Annual km */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-slate-700">Annual Kilometres</label>
            <span className="font-bold text-brand-700 text-lg">{inputs.annualKm.toLocaleString()} km</span>
          </div>
          <input
            type="range"
            min={5000} max={50000} step={1000}
            value={inputs.annualKm}
            onChange={handleKm}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>5,000 km</span>
            <span>50,000 km</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Average Australian driver: 13,000–15,000 km/year.</p>
        </div>

        {/* Interest rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-slate-700">Novated Lease Finance Rate</label>
            <span className="font-bold text-brand-700 text-lg">{(inputs.interestRate * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.04} max={0.15} step={0.001}
            value={inputs.interestRate}
            onChange={handleRate}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>4.0%</span>
            <span>15.0%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Typical novated lease rates: 6.5–8.5%. Car loan comparison uses 8%.</p>
        </div>

        {/* Electricity rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-semibold text-slate-700">Home Electricity Rate</label>
            <span className="font-bold text-brand-700 text-lg">{(inputs.electricityRate * 100).toFixed(0)}c / kWh</span>
          </div>
          <input
            type="range"
            min={0.15} max={0.55} step={0.01}
            value={inputs.electricityRate}
            onChange={handleElec}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>15c/kWh</span>
            <span>55c/kWh</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Check your electricity bill. Calculation uses 70% home / 30% public charging (55c/kWh).
          </p>
        </div>
      </div>

      {/* Live savings preview */}
      {quickSaving && quickSaving.annualVsLoan > 0 && (
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <div className="text-sm text-green-700 font-medium mb-1">Estimated saving vs car loan</div>
          <div className="text-4xl font-extrabold text-green-700">
            {fmt(quickSaving.weeklyVsLoan)}<span className="text-xl font-semibold">/week</span>
          </div>
          <div className="text-sm text-green-600 mt-1">{fmt(quickSaving.annualVsLoan)}/year · See full breakdown below</div>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep(2)}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(4)}
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          See My Results →
        </button>
      </div>
    </div>
  )
}
