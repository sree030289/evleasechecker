export default function Header({ onStartCalc, onShowStats }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">
            EV<span className="text-brand-600">Lease</span>Calc
          </span>
          <span className="hidden sm:inline-block text-xs bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5 font-medium">
            Australia
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onShowStats}
            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Stats
          </button>
          <button
            onClick={onStartCalc}
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Calculate My Savings
          </button>
        </div>
      </div>
    </header>
  )
}
