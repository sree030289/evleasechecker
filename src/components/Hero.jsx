export default function Hero({ onStart }) {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-brand-700 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-block bg-brand-600/30 border border-brand-500/40 text-brand-200 text-sm font-medium rounded-full px-4 py-1 mb-6">
          FBT-exempt for eligible EVs · Updated April 2026
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
          See exactly how much you save<br />
          <span className="text-brand-400">driving an EV through novated lease</span>
        </h1>

        <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
          Compare <strong className="text-white">Novated Lease vs Car Loan vs Cash Purchase</strong> in 2 minutes.
          Real numbers, all included — charging, rego, insurance, FBT and tax savings.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300 mb-10">
          {['100% free', 'No account needed', 'Instant results', 'ATO-compliant formulas'].map(s => (
            <span key={s} className="flex items-center gap-1">
              <svg className="w-4 h-4 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
              {s}
            </span>
          ))}
        </div>

        <button
          onClick={onStart}
          className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-100"
        >
          Start Calculator →
        </button>

        <p className="mt-4 text-slate-400 text-sm">Not financial advice · Estimates only · Takes ~2 minutes</p>
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '💰', title: 'Save up to $9,000/yr', desc: 'in tax on $120k salary with a Tesla Model Y' },
          { icon: '🚫', title: '$0 FBT for eligible EVs', desc: 'BEVs under $91,387 are FBT-exempt under Australian law' },
          { icon: '⚡', title: 'All costs included', desc: 'Charging, rego, insurance, servicing — all pre-tax' },
        ].map(c => (
          <div key={c.title} className="bg-white/10 backdrop-blur rounded-xl p-5 text-left border border-white/10">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className="font-semibold text-white">{c.title}</div>
            <div className="text-sm text-slate-300 mt-1">{c.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
