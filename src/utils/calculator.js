import {
  TAX_BRACKETS,
  MEDICARE_LEVY_RATE,
  LITO,
  FBT_RATE,
  FBT_GROSS_UP_TYPE1,
  FBT_STATUTORY_RATE,
  CAR_EFFECTIVE_LIFE_YEARS,
  OPPORTUNITY_COST_RATE,
  CAR_LOAN_RATE,
  PUBLIC_CHARGE_RATE,
  HOME_CHARGE_RATIO,
  PUBLIC_CHARGE_RATIO,
} from '../data/taxRates.js'
import { STATE_DATA } from '../data/stateCosts.js'

// ── Insurance estimates by group ─────────────────────────────────────────────
const INSURANCE_MIDPOINTS = {
  low: 1200,
  mid: 1600,
  high: 1950,
}

// ── Servicing base cost at 15,000km/yr ───────────────────────────────────────
const SERVICING_BASE = { BEV: 300, PHEV: 500, ICE: 900 }

// ── Tyre replacement config ──────────────────────────────────────────────────
const TYRE_CONFIG = {
  BEV:  { fullSet: 1100, replaceKm: 32500 },
  PHEV: { fullSet: 1100, replaceKm: 40000 },
  ICE:  { fullSet: 900,  replaceKm: 55000 },
}

/**
 * Calculate total income tax payable (progressive brackets + Medicare Levy + LITO).
 */
export function calculateIncomeTax(grossIncome) {
  const bracket = TAX_BRACKETS.find(b => grossIncome >= b.min && grossIncome <= b.max)
    ?? TAX_BRACKETS[TAX_BRACKETS.length - 1]

  const rawTax = bracket.baseTax + (grossIncome - bracket.min) * bracket.rate
  const medicare = grossIncome * MEDICARE_LEVY_RATE

  // LITO calculation
  let lito = 0
  if (grossIncome <= LITO.phaseout1Start) {
    lito = LITO.fullOffset
  } else if (grossIncome <= LITO.phaseout1End) {
    lito = LITO.fullOffset - (grossIncome - LITO.phaseout1Start) * LITO.phaseout1Rate
  } else if (grossIncome <= LITO.phaseout2End) {
    const step1Reduction = (LITO.phaseout1End - LITO.phaseout1Start) * LITO.phaseout1Rate
    const step2Reduction = (grossIncome - LITO.phaseout2Start) * LITO.phaseout2Rate
    lito = Math.max(0, LITO.fullOffset - step1Reduction - step2Reduction)
  }

  return Math.max(0, rawTax - lito + medicare)
}

/**
 * Get marginal tax rate (bracket rate + Medicare Levy) at a given gross income.
 * Used to calculate the tax saving from salary sacrifice.
 * For accuracy we compute: tax(income) - tax(income - sacrifice) in calculateScenarios.
 */
export function getMarginalRate(grossIncome) {
  const bracket = TAX_BRACKETS.find(b => grossIncome >= b.min && grossIncome <= b.max)
    ?? TAX_BRACKETS[TAX_BRACKETS.length - 1]
  return bracket.rate + MEDICARE_LEVY_RATE
}

/**
 * ATO minimum residual value percentage.
 * Formula: 75% - (75% / carEffectiveLife) × leaseTerm
 * Source: ATO Tax Ruling TR 93/142
 */
export function getResidualPercentage(leaseTerm) {
  return 0.75 - (0.75 / CAR_EFFECTIVE_LIFE_YEARS) * leaseTerm
}

/**
 * GST saving on the vehicle purchase price.
 * Employer claims the input tax credit, so drive-away / 11 is the GST component.
 */
export function getGSTSaving(driveawayPrice) {
  return driveawayPrice / 11
}

/**
 * Calculate annual novated lease payment using the flat-rate (add-on interest) method.
 * Returns: { annualPayment, residualValue, effectivePrice, gstSaving }
 */
export function calculateAnnualLeasePayment(driveawayPrice, leaseTerm, interestRate) {
  const gstSaving = getGSTSaving(driveawayPrice)
  const effectivePrice = driveawayPrice - gstSaving
  const residualPct = getResidualPercentage(leaseTerm)
  const residualValue = driveawayPrice * residualPct

  const principal = effectivePrice - residualValue
  const averageBalance = (effectivePrice + residualValue) / 2
  const annualPayment = principal / leaseTerm + averageBalance * interestRate

  return { annualPayment, residualValue, effectivePrice, gstSaving }
}

/**
 * Annual charging cost with blended home/public rate.
 */
export function calculateChargingCost(annualKm, consumptionKWh, homeElectricityRate) {
  const totalKWh = (annualKm / 100) * consumptionKWh
  const blendedRate =
    HOME_CHARGE_RATIO * homeElectricityRate + PUBLIC_CHARGE_RATIO * PUBLIC_CHARGE_RATE
  return totalKWh * blendedRate
}

/**
 * Annual tyre budget (amortised replacement cost).
 */
export function calculateTyreCost(vehicleType, annualKm) {
  const cfg = TYRE_CONFIG[vehicleType] ?? TYRE_CONFIG.BEV
  return (annualKm / cfg.replaceKm) * cfg.fullSet
}

/**
 * Annual servicing cost scaled by annual km.
 */
export function calculateServicingCost(vehicleType, annualKm) {
  const base = SERVICING_BASE[vehicleType] ?? SERVICING_BASE.BEV
  return base * (annualKm / 15000)
}

/**
 * Rego + CTP midpoint for a given state, with any EV discount applied.
 */
export function getRegoCTPCost(state) {
  const s = STATE_DATA[state]
  if (!s) return 1200
  const regoMid = (s.regoMin + s.regoMax) / 2
  const ctpMid = (s.ctpMin + s.ctpMax) / 2
  const regoDiscount = s.regoEVDiscount ?? 0
  return regoMid + ctpMid - regoDiscount
}

/**
 * Annual running costs breakdown.
 * Returns individual line items and a total.
 */
export function calculateRunningCosts(vehicleType, insuranceGroup, state, annualKm, consumptionKWh, electricityRate) {
  const charging = vehicleType !== 'ICE'
    ? calculateChargingCost(annualKm, consumptionKWh, Math.max(electricityRate, 0.05))
    : 0
  const insurance = INSURANCE_MIDPOINTS[insuranceGroup] ?? INSURANCE_MIDPOINTS.mid
  const regoCTP = getRegoCTPCost(state)
  const servicing = calculateServicingCost(vehicleType, annualKm)
  const tyres = calculateTyreCost(vehicleType, annualKm)
  const total = charging + insurance + regoCTP + servicing + tyres

  return { charging, insurance, regoCTP, servicing, tyres, total }
}

/**
 * Annual FBT payable (employer pays, but cost is embedded in the salary sacrifice structure).
 * BEVs under LCT threshold: $0 (Treasury Laws Amendment Act 2022).
 * PHEVs & ICE: statutory formula method.
 */
export function calculateAnnualFBT(vehicleType, fbtExempt, driveawayPrice) {
  if (vehicleType === 'BEV' && fbtExempt) return 0
  const taxableValue = driveawayPrice * FBT_STATUTORY_RATE
  const grossedUp = taxableValue * FBT_GROSS_UP_TYPE1
  return grossedUp * FBT_RATE
}

/**
 * Master calculation function.
 * Returns three scenario result objects for the 3-column comparison.
 */
export function calculateScenarios(inputs) {
  const {
    grossSalary,
    vehicleData,
    leaseTerm,
    annualKm,
    interestRate,
    electricityRate,
    state,
  } = inputs

  const priceDA = vehicleData.price_driveaway
  const consumption = vehicleData.consumption_kWh_per_100km
  const vType = vehicleData.vehicle_type
  const fbtExempt = vehicleData.fbt_exempt
  const insGroup = vehicleData.insurance_group

  // Running costs are the same vehicle regardless of finance method
  const runningCosts = calculateRunningCosts(
    vType, insGroup, state, annualKm, consumption, electricityRate
  )

  // ── NOVATED LEASE ──────────────────────────────────────────────────────────
  const { annualPayment, residualValue, gstSaving } =
    calculateAnnualLeasePayment(priceDA, leaseTerm, interestRate)

  const annualFBT = calculateAnnualFBT(vType, fbtExempt, priceDA)
  const gstSavingRunning = runningCosts.total / 11
  const totalGSTSaving = gstSaving + gstSavingRunning

  const totalSalarySacrifice = annualPayment + runningCosts.total + annualFBT

  // Accurate tax saving: difference between tax at full salary and tax after sacrifice
  const taxAtFullSalary = calculateIncomeTax(grossSalary)
  const salaryAfterSacrifice = Math.max(grossSalary - totalSalarySacrifice, 0)
  const taxAfterSacrifice = calculateIncomeTax(salaryAfterSacrifice)
  const taxSaving = taxAtFullSalary - taxAfterSacrifice

  const netAnnualNovated = totalSalarySacrifice - taxSaving
  const overSacrificeWarning = totalSalarySacrifice > grossSalary * 0.9

  const novated = {
    label: 'Novated Lease',
    subtitle: 'Pre-tax salary packaging',
    highlight: true,
    vehiclePrice: priceDA,
    gstSaving: totalGSTSaving,
    residualValue,
    annualLeasePayment: annualPayment,
    annualRunningCosts: runningCosts,
    annualFBT,
    fbtExempt,
    totalSalarySacrifice,
    taxSaving,
    netAnnualCost: netAnnualNovated,
    netWeeklyCost: netAnnualNovated / 52,
    netMonthlyCost: netAnnualNovated / 12,
    totalCostOverTerm: netAnnualNovated * leaseTerm + residualValue,
    overSacrificeWarning,
  }

  // ── CAR LOAN ──────────────────────────────────────────────────────────────
  const monthlyRate = CAR_LOAN_RATE / 12
  const nPayments = leaseTerm * 12
  const monthlyRepayment =
    priceDA * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) /
    (Math.pow(1 + monthlyRate, nPayments) - 1)
  const annualLoanRepayment = monthlyRepayment * 12
  const totalInterestPaid = monthlyRepayment * nPayments - priceDA
  const netAnnualLoan = annualLoanRepayment + runningCosts.total

  const carLoan = {
    label: 'Car Loan',
    subtitle: '8% p.a. personal loan',
    highlight: false,
    vehiclePrice: priceDA,
    gstSaving: 0,
    residualValue: 0,
    annualLoanRepayment,
    totalInterestPaid,
    annualRunningCosts: runningCosts,
    annualFBT: 0,
    fbtExempt: false,
    taxSaving: 0,
    netAnnualCost: netAnnualLoan,
    netWeeklyCost: netAnnualLoan / 52,
    netMonthlyCost: netAnnualLoan / 12,
    totalCostOverTerm: annualLoanRepayment * leaseTerm + runningCosts.total * leaseTerm,
  }

  // ── CASH PURCHASE ─────────────────────────────────────────────────────────
  const estimatedEndValue = priceDA * getResidualPercentage(leaseTerm) * 0.85
  const annualDepreciation = (priceDA - estimatedEndValue) / leaseTerm
  const annualOpportunityCost = (priceDA / 2) * OPPORTUNITY_COST_RATE
  const netAnnualCash = runningCosts.total + annualOpportunityCost + annualDepreciation

  const cash = {
    label: 'Cash Purchase',
    subtitle: 'After-tax dollars',
    highlight: false,
    vehiclePrice: priceDA,
    gstSaving: 0,
    residualValue: estimatedEndValue,
    annualDepreciation,
    annualOpportunityCost,
    annualRunningCosts: runningCosts,
    annualFBT: 0,
    fbtExempt: false,
    taxSaving: 0,
    netAnnualCost: netAnnualCash,
    netWeeklyCost: netAnnualCash / 52,
    netMonthlyCost: netAnnualCash / 12,
    totalCostOverTerm:
      priceDA - estimatedEndValue + runningCosts.total * leaseTerm + annualOpportunityCost * leaseTerm,
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  const annualSavingVsLoan = carLoan.netAnnualCost - novated.netAnnualCost
  const annualSavingVsCash = cash.netAnnualCost - novated.netAnnualCost
  const totalSavingVsLoan = annualSavingVsLoan * leaseTerm
  const totalSavingVsCash = annualSavingVsCash * leaseTerm

  return {
    novated,
    carLoan,
    cash,
    summary: {
      annualSavingVsLoan,
      annualSavingVsCash,
      totalSavingVsLoan,
      totalSavingVsCash,
      weeklyTakeHomeSaving: annualSavingVsLoan / 52,
    },
    lowSalaryWarning: grossSalary < 18201,
    overSacrificeWarning,
  }
}

/**
 * Current Car vs New EV Novated Lease comparison.
 *
 * Compares three options:
 *   A — Keep current car (paid off)
 *   B — EV novated lease, $0 upfront (keep sale proceeds in offset account)
 *   C — EV novated lease, pay sale proceeds upfront (capital reduction)
 *
 * All "current car" running costs are post-tax (after-tax dollars).
 * The "true cost" shows how much pre-tax salary is needed to fund each dollar of spend.
 */
export function calculateCurrentCarScenarios(
  currentCar,
  grossSalary,
  novatedScenario,
  leaseTerm,
  annualKm,
  interestRate,
) {
  const marginalRate = getMarginalRate(grossSalary)

  // ── Current car annual costs (all post-tax) ──────────────────────────────
  const annualFuel = (annualKm / 100) * currentCar.fuelConsumptionL * currentCar.fuelPricePerLitre
  const annualInsurance = currentCar.annualInsurance || 0
  const annualRego = currentCar.annualRego || 0
  const annualServicing = currentCar.annualServicing || 0
  const totalAnnualPostTax = annualFuel + annualInsurance + annualRego + annualServicing

  // Monthly breakdown
  const monthlyFuel = annualFuel / 12
  const monthlyInsurance = annualInsurance / 12
  const monthlyRego = annualRego / 12
  const monthlyServicing = annualServicing / 12
  const totalMonthlyPostTax = totalAnnualPostTax / 12

  // "True cost" — how much pre-tax salary must be earned to net each dollar of spend
  // At 47% effective marginal rate: must earn $1.887 to have $1.00 after tax
  const earningMultiplier = 1 / (1 - marginalRate)
  const totalMonthlyPreTaxEquivalent = totalMonthlyPostTax * earningMultiplier
  const totalAnnualPreTaxEquivalent = totalAnnualPostTax * earningMultiplier

  // ── Option A: Keep current car ──────────────────────────────────────────
  const optionA = {
    label: currentCar.description ? `Keep ${currentCar.description}` : 'Keep Current Car',
    monthlyFuel,
    monthlyInsurance,
    monthlyRego,
    monthlyServicing,
    totalMonthlyPostTax,
    totalMonthlyPreTaxEquivalent,
    totalAnnualPostTax,
    totalAnnualPreTaxEquivalent,
    // 3-year totals
    totalOverTerm: totalAnnualPostTax * leaseTerm,
    cashInHand: currentCar.estimatedSaleValue - (currentCar.loanBalance || 0),
    loanBalance: currentCar.loanBalance || 0,
  }

  // ── Net sale proceeds (after paying off any existing loan) ───────────────
  const netSaleProceeds = Math.max(0, (currentCar.estimatedSaleValue || 0) - (currentCar.loanBalance || 0))

  // ── Option B: EV Novated Lease, $0 upfront, keep proceeds in offset ──────
  // Offset account benefit: proceeds earn ~6.5% interest (mortgage offset equivalent)
  const annualOffsetBenefit = netSaleProceeds * OPPORTUNITY_COST_RATE
  const monthlyOffsetBenefit = annualOffsetBenefit / 12
  // Effective "net" monthly cost of novated lease after offset benefit
  const optionB_monthlyGross = novatedScenario.netMonthlyCost
  const optionB_monthlyNet = optionB_monthlyGross - monthlyOffsetBenefit

  const optionB = {
    label: 'EV Novated Lease — $0 upfront',
    sublabel: `Keep ${netSaleProceeds > 0 ? '$' + netSaleProceeds.toLocaleString('en-AU') : 'proceeds'} in offset account`,
    monthlyGrossLeaseCost: optionB_monthlyGross,
    monthlyOffsetBenefit,
    totalMonthlyNet: optionB_monthlyNet,
    totalAnnualNet: optionB_monthlyNet * 12,
    cashInHand: netSaleProceeds,
    totalOverTerm: optionB_monthlyNet * 12 * leaseTerm + novatedScenario.residualValue,
    residualAtEnd: novatedScenario.residualValue,
  }

  // ── Option C: EV Novated Lease, pay proceeds upfront (capital reduction) ─
  // Upfront payment reduces financed amount, saving interest on that portion
  // Annual interest saving = upfront × interestRate (flat rate method)
  const annualInterestSaving = netSaleProceeds * interestRate
  // Tax saving on the interest saving: the sacrifice is pre-tax so the effective
  // reduction in net cost from reduced sacrifice = interestSaving × (1 - marginalRate)
  const annualNetCostReduction = annualInterestSaving * (1 - marginalRate)
  const optionC_monthlyNet = novatedScenario.netMonthlyCost - annualNetCostReduction / 12
  // Balloon payment remains unchanged (ATO mandates residual on original vehicle price)
  const optionC_residual = novatedScenario.residualValue

  const optionC = {
    label: `EV Novated Lease — $${netSaleProceeds.toLocaleString('en-AU')} upfront`,
    sublabel: 'Uses sale proceeds to reduce financed amount',
    monthlyGrossBeforeReduction: novatedScenario.netMonthlyCost,
    capitalReductionSavingMonthly: annualNetCostReduction / 12,
    totalMonthlyNet: optionC_monthlyNet,
    totalAnnualNet: optionC_monthlyNet * 12,
    cashInHand: 0,
    totalOverTerm: optionC_monthlyNet * 12 * leaseTerm + optionC_residual,
    residualAtEnd: optionC_residual,
    note: `Balloon payment of $${Math.round(optionC_residual).toLocaleString('en-AU')} still applies at end of lease (ATO minimum residual is on original vehicle price).`,
  }

  // ── Winner & payback analysis ─────────────────────────────────────────────
  // Monthly saving of switching to EV novated (Option B) vs keeping current car
  const monthlySavingBvsA = optionA.totalMonthlyPostTax - optionB.totalMonthlyNet
  const annualSavingBvsA = monthlySavingBvsA * 12

  // How long it takes Option C to "recover" the $upfront paid vs Option B
  const monthlySavingCvsB = optionB.totalMonthlyNet - optionC.totalMonthlyNet
  const paybackMonths = monthlySavingCvsB > 0
    ? Math.ceil(netSaleProceeds / (monthlySavingCvsB * 12) * 12)
    : null

  // Recommended option
  let recommendation
  if (annualSavingBvsA > 0 && netSaleProceeds > 0) {
    recommendation = 'B' // Keep cash, take novated lease
  } else if (annualSavingBvsA > 0) {
    recommendation = 'B'
  } else {
    recommendation = 'A' // Keeping current car is cheaper
  }

  // True cost breakdown: how much salary you need to earn to cover your current car
  const govtPaysForCurrent =
    totalAnnualPreTaxEquivalent - totalAnnualPostTax  // the tax portion eaten before you can spend

  return {
    optionA,
    optionB,
    optionC,
    netSaleProceeds,
    marginalRate,
    earningMultiplier,
    monthlySavingBvsA,
    annualSavingBvsA,
    paybackMonths,
    recommendation,
    govtPaysForCurrent,
    totalYearlyFuelSaving: annualFuel,   // how much fuel cost is eliminated
  }
}

