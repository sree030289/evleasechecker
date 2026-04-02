/**
 * Analytics utility — dual-write:
 *  1. localStorage `evleasecalc_events` — for the in-app /counter page
 *  2. Vercel Analytics `track()` — for global dashboard (when deployed)
 *
 * Events fired in this app:
 *  page_view        — on every app load
 *  calculator_start — user clicks "Start Calculator" or "Calculate My Savings"
 *  brand_selected   — user picks a car brand in Step 2
 *  vehicle_selected — user picks a specific variant (includes name, price)
 *  results_viewed   — user reaches Step 4 (includes vehicle, salary, weeklySaving)
 *  quote_submitted  — user submits lead form
 *  current_car_opened — user expands "Compare with Your Current Car"
 */

const STORAGE_KEY = 'evleasecalc_events'

/**
 * Read all events from localStorage.
 */
export function getStoredEvents() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

/**
 * Write a single event to localStorage and fire Vercel Analytics if available.
 */
export function trackEvent(name, props = {}) {
  // 1. localStorage — append event
  try {
    const events = getStoredEvents()
    events.push({
      name,
      props,
      ts: Date.now(),
      date: new Date().toISOString(),
    })
    // Keep last 2000 events to avoid unbounded growth
    const trimmed = events.slice(-2000)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // localStorage unavailable (private browsing etc.) — silent fail
  }

  // 2. Vercel Analytics — works when deployed on Vercel
  try {
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', { name, ...props })
    }
  } catch {
    // not available in dev
  }
}

/**
 * Aggregate stored events into summary stats for the counter page.
 */
export function getAggregatedStats() {
  const events = getStoredEvents()

  const count = (name) => events.filter(e => e.name === name).length

  // Most popular brands
  const brandCounts = {}
  events
    .filter(e => e.name === 'brand_selected' && e.props?.brand)
    .forEach(e => {
      const b = e.props.brand
      brandCounts[b] = (brandCounts[b] || 0) + 1
    })
  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Most popular vehicles
  const vehicleCounts = {}
  events
    .filter(e => e.name === 'vehicle_selected' && e.props?.vehicle)
    .forEach(e => {
      const v = e.props.vehicle
      vehicleCounts[v] = (vehicleCounts[v] || 0) + 1
    })
  const topVehicles = Object.entries(vehicleCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Salary distribution (bucket into ranges)
  const salaryBuckets = { '<60k': 0, '60k–100k': 0, '100k–150k': 0, '150k–200k': 0, '200k+': 0 }
  events
    .filter(e => e.name === 'results_viewed' && e.props?.salary)
    .forEach(e => {
      const s = e.props.salary
      if (s < 60000) salaryBuckets['<60k']++
      else if (s < 100000) salaryBuckets['60k–100k']++
      else if (s < 150000) salaryBuckets['100k–150k']++
      else if (s < 200000) salaryBuckets['150k–200k']++
      else salaryBuckets['200k+']++
    })

  // Recent results (last 10)
  const recentResults = events
    .filter(e => e.name === 'results_viewed')
    .slice(-10)
    .reverse()

  // Conversion funnel
  const funnel = [
    { label: 'Page Views', count: count('page_view'), icon: '👁' },
    { label: 'Calculator Started', count: count('calculator_start'), icon: '▶️' },
    { label: 'Vehicles Selected', count: count('vehicle_selected'), icon: '🚗' },
    { label: 'Results Viewed', count: count('results_viewed'), icon: '📊' },
    { label: 'Quotes Submitted', count: count('quote_submitted'), icon: '✅' },
  ]

  // Events per day (last 14 days)
  const days = {}
  const now = Date.now()
  events
    .filter(e => now - e.ts < 14 * 24 * 60 * 60 * 1000)
    .forEach(e => {
      const d = new Date(e.ts).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
      days[d] = (days[d] || 0) + 1
    })
  const dailyActivity = Object.entries(days)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))

  return {
    total: events.length,
    funnel,
    topBrands,
    topVehicles,
    salaryBuckets,
    recentResults,
    dailyActivity,
    leadsStored: (() => {
      try {
        return JSON.parse(localStorage.getItem('evleasecalc_leads') || '[]').length
      } catch {
        return 0
      }
    })(),
  }
}
