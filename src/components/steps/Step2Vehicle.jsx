import { useState } from 'react'
import { getBrands, getModels, getVariants } from '../../data/vehicles.js'

// Brand colour map for visual variety
const BRAND_COLORS = {
  Tesla: 'bg-red-50 border-red-100 text-red-800',
  BYD: 'bg-green-50 border-green-100 text-green-800',
  Hyundai: 'bg-blue-50 border-blue-100 text-blue-800',
  Kia: 'bg-indigo-50 border-indigo-100 text-indigo-800',
  MG: 'bg-orange-50 border-orange-100 text-orange-800',
  Polestar: 'bg-slate-50 border-slate-200 text-slate-800',
  Volvo: 'bg-sky-50 border-sky-100 text-sky-800',
  BMW: 'bg-blue-50 border-blue-200 text-blue-900',
  'Mercedes-Benz': 'bg-slate-50 border-slate-200 text-slate-800',
  Nissan: 'bg-rose-50 border-rose-100 text-rose-800',
  Mitsubishi: 'bg-red-50 border-red-100 text-red-800',
  Toyota: 'bg-red-50 border-red-200 text-red-900',
  Subaru: 'bg-blue-50 border-blue-200 text-blue-900',
  Volkswagen: 'bg-blue-50 border-blue-200 text-blue-900',
  Audi: 'bg-slate-50 border-slate-200 text-slate-900',
}

function FBTBadge({ exempt }) {
  return exempt ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
      ✓ FBT Exempt
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
      ⚠ FBT Applies
    </span>
  )
}

export default function Step2Vehicle({ calculator }) {
  const { inputs, selectBrand, selectModel, updateInput, setStep } = calculator
  const [level, setLevel] = useState(inputs.selectedBrand ? (inputs.selectedModel ? 2 : 1) : 0)

  const allBrands = getBrands()

  function handleBrand(brand) {
    selectBrand(brand)
    setLevel(1)
  }

  function handleModel(model) {
    selectModel(model)
    setLevel(2)
  }

  function handleVariant(variantName) {
    updateInput('selectedVariant', variantName)
  }

  function goBackTo(l) {
    if (l === 0) { selectBrand(''); setLevel(0) }
    if (l === 1) { selectModel(''); setLevel(1) }
  }

  const models = inputs.selectedBrand ? getModels(inputs.selectedBrand) : []
  const variants = (inputs.selectedBrand && inputs.selectedModel)
    ? getVariants(inputs.selectedBrand, inputs.selectedModel)
    : []

  const selectedVariantData = variants.find(v => v.name === inputs.selectedVariant)
  const isPHEV = selectedVariantData?.vehicle_type === 'PHEV'

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Choose Your Vehicle</h2>
        <p className="text-slate-500 mt-1">Select brand, model and variant to see real numbers.</p>
      </div>

      {/* Breadcrumb */}
      {level > 0 && (
        <div className="flex items-center gap-2 text-sm mb-4 flex-wrap">
          <button onClick={() => goBackTo(0)} className="text-brand-600 hover:underline font-medium">
            All Brands
          </button>
          {inputs.selectedBrand && (
            <>
              <span className="text-slate-300">/</span>
              {level > 1
                ? <button onClick={() => goBackTo(1)} className="text-brand-600 hover:underline font-medium">{inputs.selectedBrand}</button>
                : <span className="text-slate-700 font-medium">{inputs.selectedBrand}</span>
              }
            </>
          )}
          {inputs.selectedModel && level === 2 && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700 font-medium">{inputs.selectedModel}</span>
            </>
          )}
        </div>
      )}

      {/* PHEV warning */}
      {isPHEV && (
        <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-3">
          <strong>PHEV FBT Notice:</strong> PHEVs are no longer FBT-exempt from 1 April 2025.
          Your calculation will include FBT costs, which significantly reduces the tax saving.
          Consider a BEV for maximum benefit.
        </div>
      )}

      {/* Level 0: Brand grid */}
      {level === 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {allBrands.map(brand => (
            <button
              key={brand}
              onClick={() => handleBrand(brand)}
              className={`p-4 rounded-xl border-2 text-center font-semibold text-sm transition-all hover:shadow-md hover:border-brand-400
                ${BRAND_COLORS[brand] || 'bg-slate-50 border-slate-200 text-slate-800'}`}
            >
              {brand}
            </button>
          ))}
        </div>
      )}

      {/* Level 1: Model grid */}
      {level === 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {models.map(model => {
            const vs = getVariants(inputs.selectedBrand, model)
            return (
              <button
                key={model}
                onClick={() => handleModel(model)}
                className="bg-white border-2 border-slate-200 hover:border-brand-400 rounded-xl p-5 text-left transition-all hover:shadow-md"
              >
                <div className="font-bold text-slate-900">{model}</div>
                <div className="text-xs text-slate-500 mt-1">{vs.length} variant{vs.length !== 1 ? 's' : ''}</div>
                <div className="text-xs text-slate-400 mt-1">
                  From ${Math.min(...vs.map(v => v.price_driveaway)).toLocaleString('en-AU')}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Level 2: Variant cards */}
      {level === 2 && (
        <div className="space-y-3">
          {variants.map(v => {
            const selected = inputs.selectedVariant === v.name
            return (
              <button
                key={v.name}
                onClick={() => handleVariant(v.name)}
                className={`w-full text-left bg-white rounded-xl border-2 p-4 transition-all hover:shadow-md
                  ${selected ? 'border-brand-500 shadow-sm bg-brand-50' : 'border-slate-200 hover:border-brand-300'}`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="font-bold text-slate-900">{v.name}</div>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-600">
                      <span>🔋 {v.range_km} km range</span>
                      <span>⚡ {v.consumption_kWh_per_100km} kWh/100km</span>
                      <span>🚗 {v.driveType}</span>
                      <span>👥 {v.seats} seats</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold text-slate-900 text-lg">
                      ${v.price_driveaway.toLocaleString('en-AU')}
                    </div>
                    <div className="text-xs text-slate-500">drive-away</div>
                    <div className="mt-1">
                      <FBTBadge exempt={v.fbt_exempt} />
                    </div>
                  </div>
                </div>
                {selected && (
                  <div className="mt-2 text-brand-700 text-sm font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => setStep(1)}
          className="text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!inputs.selectedVariant}
          className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Next: Customise →
        </button>
      </div>
    </div>
  )
}
