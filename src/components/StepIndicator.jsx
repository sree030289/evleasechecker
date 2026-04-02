const STEPS = ['Your Details', 'Choose Vehicle', 'Customise', 'Your Results']

export default function StepIndicator({ currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* connector line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-brand-500 z-0 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
        />

        {STEPS.map((label, i) => {
          const step = i + 1
          const done = currentStep > step
          const active = currentStep === step
          return (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                  ${done ? 'bg-brand-600 border-brand-600 text-white'
                    : active ? 'bg-white border-brand-600 text-brand-600'
                    : 'bg-white border-slate-300 text-slate-400'}`}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step}
              </div>
              <span className={`mt-1 text-xs hidden sm:block font-medium
                ${active ? 'text-brand-700' : done ? 'text-slate-600' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
