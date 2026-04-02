import { useState } from 'react'
import { trackEvent } from '../utils/analytics.js'

const AU_PHONE_RE = /^04\d{2}[\s-]?\d{3}[\s-]?\d{3}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const PROVIDERS = [
  'No preference',
  'Maxxia',
  'SG Fleet',
  'Smartleasing',
  'Easi Fleet',
  'Fleet Network',
  'Novated Choice',
  '1ALP (Fleet Partners)',
  'LeasePlan',
]

function fmt(n) {
  if (!n || isNaN(n)) return '$—'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', maximumFractionDigits: 0,
  }).format(n)
}

export default function LeadFormModal({ results, vehicleData, inputs, onClose }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', employer: '', provider: 'No preference',
    consentContact: false, consentDisclaimer: false,
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function setField(k, v) {
    setForm(prev => ({ ...prev, [k]: v }))
    setErrors(prev => ({ ...prev, [k]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!EMAIL_RE.test(form.email)) e.email = 'Valid email required'
    if (!AU_PHONE_RE.test(form.phone.replace(/\s/g, ''))) e.phone = 'Australian mobile required (04XX XXX XXX)'
    if (!form.consentContact) e.consentContact = 'Required to receive a quote'
    if (!form.consentDisclaimer) e.consentDisclaimer = 'Required'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    // Save to localStorage for MVP
    const lead = {
      ...form,
      salary: inputs.grossSalary,
      state: inputs.state,
      leaseTerm: inputs.leaseTerm,
      vehicle: vehicleData?.name || '',
      vehiclePrice: vehicleData?.price_driveaway || 0,
      annualSaving: results?.summary?.annualSavingVsLoan || 0,
      submittedAt: new Date().toISOString(),
    }
    const existing = JSON.parse(localStorage.getItem('evleasecalc_leads') || '[]')
    localStorage.setItem('evleasecalc_leads', JSON.stringify([...existing, lead]))
    trackEvent('quote_submitted', {
      vehicle: vehicleData?.name,
      salary: inputs.grossSalary,
      provider: form.provider,
    })
    setSubmitted(true)
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You're all set!</h3>
            <p className="text-slate-500 mb-4">
              A novated lease specialist will be in touch within 1 business day to discuss your options.
            </p>
            {vehicleData && results && (
              <div className="bg-brand-50 rounded-xl p-4 mb-4 text-sm text-brand-800">
                <strong>{vehicleData.name}</strong> · Estimated saving: {fmt(results.summary.annualSavingVsLoan)}/yr
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Get Your Free Quote</h3>
                <p className="text-sm text-slate-500 mt-0.5">A specialist will contact you within 1 business day.</p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Summary */}
            {vehicleData && results && (
              <div className="bg-slate-50 rounded-xl p-3 mb-5 text-sm">
                <span className="font-semibold text-slate-700">{vehicleData.name}</span>
                <span className="text-slate-500 mx-2">·</span>
                <span className="text-slate-500">{fmt(inputs.grossSalary)} salary</span>
                <span className="text-slate-500 mx-2">·</span>
                <span className="text-brand-700 font-semibold">Est. {fmt(results.summary.annualSavingVsLoan)}/yr saving</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setField('firstName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                      ${errors.firstName ? 'border-red-400' : 'border-slate-300'}`}
                    placeholder="Jane"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-0.5">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setField('lastName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                      ${errors.lastName ? 'border-red-400' : 'border-slate-300'}`}
                    placeholder="Smith"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-0.5">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                    ${errors.email ? 'border-red-400' : 'border-slate-300'}`}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-0.5">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setField('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500
                    ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
                  placeholder="0412 345 678"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-0.5">{errors.phone}</p>}
              </div>

              {/* Employer */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Employer <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  value={form.employer}
                  onChange={e => setField('employer', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Acme Corp"
                />
                <p className="text-xs text-slate-400 mt-0.5">Helps the provider verify your salary packaging eligibility.</p>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Preferred Provider <span className="font-normal text-slate-400">(optional)</span></label>
                <select
                  value={form.provider}
                  onChange={e => setField('provider', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-1">
                <label className={`flex gap-3 items-start cursor-pointer text-xs text-slate-600
                  ${errors.consentContact ? 'text-red-500' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.consentContact}
                    onChange={e => setField('consentContact', e.target.checked)}
                    className="mt-0.5 accent-brand-600"
                  />
                  <span>I agree to be contacted by novated lease providers about my enquiry. *</span>
                </label>
                {errors.consentContact && <p className="text-red-500 text-xs -mt-2 ml-5">{errors.consentContact}</p>}

                <label className={`flex gap-3 items-start cursor-pointer text-xs text-slate-600
                  ${errors.consentDisclaimer ? 'text-red-500' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.consentDisclaimer}
                    onChange={e => setField('consentDisclaimer', e.target.checked)}
                    className="mt-0.5 accent-brand-600"
                  />
                  <span>I understand that calculator results are estimates only, not financial advice, and I will seek independent advice before making any decision. *</span>
                </label>
                {errors.consentDisclaimer && <p className="text-red-500 text-xs -mt-2 ml-5">{errors.consentDisclaimer}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors mt-2"
              >
                Submit My Enquiry →
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
