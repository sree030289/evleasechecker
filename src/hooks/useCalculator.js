import { useState, useMemo } from 'react'
import { calculateScenarios, calculateCurrentCarScenarios } from '../utils/calculator.js'
import { getVariantData } from '../data/vehicles.js'

const DEFAULTS = {
  grossSalary: 100000,
  state: 'VIC',
  leaseTerm: 5,
  selectedBrand: '',
  selectedModel: '',
  selectedVariant: '',
  annualKm: 15000,
  interestRate: 0.075,
  electricityRate: 0.30,
  currentStep: 0,
  showLeadModal: false,
  // Current car trade-in comparison (optional)
  currentCar: {
    enabled: false,
    description: '',
    fuelConsumptionL: 13.5,
    fuelPricePerLitre: 2.50,
    annualInsurance: 1700,
    annualRego: 600,
    annualServicing: 1200,
    estimatedSaleValue: 0,
    loanBalance: 0,
  },
}

export function useCalculator() {
  const [inputs, setInputs] = useState(DEFAULTS)

  function updateInput(field, value) {
    setInputs(prev => ({ ...prev, [field]: value }))
  }

  function updateCurrentCar(field, value) {
    setInputs(prev => ({
      ...prev,
      currentCar: { ...prev.currentCar, [field]: value },
    }))
  }

  function toggleCurrentCar(enabled) {
    setInputs(prev => ({
      ...prev,
      currentCar: { ...prev.currentCar, enabled },
    }))
  }

  function selectBrand(brand) {
    setInputs(prev => ({
      ...prev,
      selectedBrand: brand,
      selectedModel: '',
      selectedVariant: '',
    }))
  }

  function selectModel(model) {
    setInputs(prev => ({
      ...prev,
      selectedModel: model,
      selectedVariant: '',
    }))
  }

  function setStep(step) {
    setInputs(prev => ({ ...prev, currentStep: step }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const vehicleData = useMemo(
    () => getVariantData(inputs.selectedBrand, inputs.selectedModel, inputs.selectedVariant),
    [inputs.selectedBrand, inputs.selectedModel, inputs.selectedVariant]
  )

  const results = useMemo(() => {
    if (!vehicleData || !inputs.grossSalary || !inputs.state) return null
    try {
      return calculateScenarios({
        grossSalary: inputs.grossSalary,
        vehicleData,
        leaseTerm: inputs.leaseTerm,
        annualKm: inputs.annualKm,
        interestRate: inputs.interestRate,
        electricityRate: inputs.electricityRate,
        state: inputs.state,
      })
    } catch {
      return null
    }
  }, [
    vehicleData,
    inputs.grossSalary,
    inputs.state,
    inputs.leaseTerm,
    inputs.annualKm,
    inputs.interestRate,
    inputs.electricityRate,
  ])

  // Current car comparison — only computed when currentCar is enabled and results exist
  const tradeInComparison = useMemo(() => {
    if (!inputs.currentCar.enabled || !results) return null
    try {
      return calculateCurrentCarScenarios(
        inputs.currentCar,
        inputs.grossSalary,
        results.novated,
        inputs.leaseTerm,
        inputs.annualKm,
        inputs.interestRate,
      )
    } catch {
      return null
    }
  }, [inputs.currentCar, inputs.grossSalary, results, inputs.leaseTerm, inputs.annualKm, inputs.interestRate])

  const quickSaving = results
    ? {
        weeklyVsLoan: results.summary.weeklyTakeHomeSaving,
        annualVsLoan: results.summary.annualSavingVsLoan,
      }
    : null

  function canProceedToStep(step) {
    if (step <= 1) return true
    if (step === 2) return inputs.grossSalary > 0 && !!inputs.state
    if (step >= 3) return !!inputs.selectedVariant
    return false
  }

  return {
    inputs,
    updateInput,
    updateCurrentCar,
    toggleCurrentCar,
    selectBrand,
    selectModel,
    vehicleData,
    results,
    tradeInComparison,
    quickSaving,
    canProceedToStep,
    setStep,
    openLeadModal: () => updateInput('showLeadModal', true),
    closeLeadModal: () => updateInput('showLeadModal', false),
    reset: () => setInputs(DEFAULTS),
  }
}
