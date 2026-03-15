import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-dvsl-border bg-dvsl-surface mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-dvsl-lime flex items-center justify-center">
                <span className="text-dvsl-bg font-display text-base leading-none">D</span>
              </div>
              <span className="font-display text-lg text-dvsl-text">DVSL</span>
            </div>
            <p className="text-dvsl-muted text-xs leading-relaxed">
              Delaware Valley Synagogue League — adult recreational softball since 1990.
            </p>
          </div>
          <div>
            <p className="text-dvsl-lime text-xs font-mono tracking-widest uppercase mb-3">League</p>
            <div className="space-y-2">
              {[['/', 'Home'], ['/standings', 'Standings'], ['/playoffs', 'Playoffs'], ['/rules', 'Rules']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-dvsl-muted text-sm hover:text-dvsl-text transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-dvsl-lime text-xs font-mono tracking-widest uppercase mb-3">Stats</p>
            <div className="space-y-2">
              {[['/scores', 'Scores'], ['/schedule', 'Schedule'], ['/stats', 'Stats'], ['/teams', 'Teams']].map(([to, label]) => (
                <Link key={to} to={to} className="block text-dvsl-muted text-sm hover:text-dvsl-text transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-dvsl-lime text-xs font-mono tracking-widest uppercase mb-3">Season</p>
            <p className="text-dvsl-muted text-sm">2025 Season</p>
            <p className="text-dvsl-muted text-sm">May – August</p>
            <p className="text-dvsl-muted text-sm mt-2">Mondauk Park, Southampton,</p>
            <p className="text-dvsl-muted text-sm">and area fields</p>
          </div>
        </div>
        <div className="border-t border-dvsl-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dvsl-muted text-xs">© 2025 Delaware Valley Synagogue League. All rights reserved.</p>
          <p className="text-dvsl-muted text-xs">Built with ♥ for the DVSL community</p>
        </div>
      </div>
    </footer>
  )
}
