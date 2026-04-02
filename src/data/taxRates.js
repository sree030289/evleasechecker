// FY 2025-26 ATO income tax brackets
// baseTax = cumulative tax owed at the minimum of each bracket
export const TAX_BRACKETS = [
  { min: 0,       max: 18200,   rate: 0.00, baseTax: 0 },
  { min: 18201,   max: 45000,   rate: 0.16, baseTax: 0 },
  { min: 45001,   max: 135000,  rate: 0.30, baseTax: 4288 },
  { min: 135001,  max: 190000,  rate: 0.37, baseTax: 31288 },
  { min: 190001,  max: Infinity, rate: 0.45, baseTax: 51638 },
]

export const MEDICARE_LEVY_RATE = 0.02

// Low Income Tax Offset (LITO) — up to $700, phases out between $37,500–$66,667
export const LITO = {
  fullOffset: 700,
  phaseout1Start: 37500,
  phaseout1End: 45000,
  phaseout1Rate: 0.05,
  phaseout2Start: 45001,
  phaseout2End: 66667,
  phaseout2Rate: 0.015,
}

// FBT constants (ATO)
export const FBT_RATE = 0.47
export const FBT_GROSS_UP_TYPE1 = 2.0802
export const FBT_STATUTORY_RATE = 0.20

// Luxury Car Tax threshold for fuel-efficient / EV vehicles FY2026-27
export const LCT_THRESHOLD_EV = 91387

// Car effective life per ATO (TR 93/142) — used for residual calculation
export const CAR_EFFECTIVE_LIFE_YEARS = 8

// Opportunity cost rate (mortgage offset savings foregone) for cash scenario
export const OPPORTUNITY_COST_RATE = 0.065

// Car loan interest rate for comparison scenario
export const CAR_LOAN_RATE = 0.08

// Public DC fast-charge rate (average Australia 2026)
export const PUBLIC_CHARGE_RATE = 0.55

// Ratio of home vs public charging assumed
export const HOME_CHARGE_RATIO = 0.70
export const PUBLIC_CHARGE_RATIO = 0.30
