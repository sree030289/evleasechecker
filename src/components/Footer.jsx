export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="text-white font-bold text-lg mb-1">
              EV<span className="text-brand-500">Lease</span>Calc
            </div>
            <p className="text-sm max-w-sm">
              Free EV novated lease calculator for Australians. Compare your options and see real savings instantly.
            </p>
          </div>
          <div className="text-xs space-y-1">
            <p className="font-medium text-slate-300">Disclaimer</p>
            <p className="max-w-xs">
              All calculations are estimates only and do not constitute financial or tax advice.
              Figures are based on ATO guidelines current as of April 2026. Always seek independent advice.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs flex flex-col sm:flex-row gap-2 justify-between">
          <span>© 2026 EVLeaseCalc · Not a financial services provider</span>
          <span>EV FBT exemption subject to government review. Verify current rules with your provider.</span>
        </div>
      </div>
    </footer>
  )
}
