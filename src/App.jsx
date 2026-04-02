import { useEffect, useState } from 'react'
import { useCalculator } from './hooks/useCalculator.js'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import StepIndicator from './components/StepIndicator.jsx'
import Step1Personal from './components/steps/Step1Personal.jsx'
import Step2Vehicle from './components/steps/Step2Vehicle.jsx'
import Step3Customise from './components/steps/Step3Customise.jsx'
import Step4Results from './components/steps/Step4Results.jsx'
import LeadFormModal from './components/LeadFormModal.jsx'
import CounterPage from './components/CounterPage.jsx'
import Footer from './components/Footer.jsx'
import { trackEvent } from './utils/analytics.js'

export default function App() {
  const calculator = useCalculator()
  const { inputs, results, vehicleData, openLeadModal, closeLeadModal, setStep } = calculator

  // Determine if we're on the counter page via hash
  const isCounterPage = typeof window !== 'undefined' && window.location.hash === '#/counter'
  const [showCounter, setShowCounter] = useHashState(isCounterPage)

  // Fire page_view once on load
  useEffect(() => {
    trackEvent('page_view')
  }, [])

  function handleStartCalc() {
    setShowCounter(false)
    setStep(1)
    trackEvent('calculator_start')
  }

  const stepComponents = {
    1: <Step1Personal calculator={calculator} />,
    2: <Step2Vehicle calculator={calculator} />,
    3: <Step3Customise calculator={calculator} />,
    4: <Step4Results calculator={calculator} onGetQuote={openLeadModal} />,
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header onStartCalc={handleStartCalc} onShowStats={() => setShowCounter(true)} />

      {showCounter ? (
        <CounterPage onBack={() => setShowCounter(false)} />
      ) : (
        <>
          {inputs.currentStep === 0 && (
            <Hero onStart={handleStartCalc} />
          )}

          {inputs.currentStep >= 1 && inputs.currentStep <= 4 && (
            <main className="max-w-4xl mx-auto px-4 py-8">
              <StepIndicator currentStep={inputs.currentStep} />
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                {stepComponents[inputs.currentStep]}
              </div>
            </main>
          )}
        </>
      )}

      {inputs.showLeadModal && (
        <LeadFormModal
          results={results}
          vehicleData={vehicleData}
          inputs={inputs}
          onClose={closeLeadModal}
        />
      )}

      <Footer />
    </div>
  )
}

// Minimal hook to sync a boolean flag with the URL hash
function useHashState(initial) {
  const [value, setValue] = useState(initial)

  function set(v) {
    setValue(v)
    window.history.replaceState(null, '', v ? '#/counter' : window.location.pathname)
  }

  return [value, set]
}
