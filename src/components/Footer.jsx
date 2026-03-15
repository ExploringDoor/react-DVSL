import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-dvsl-border mt-20 py-12 bg-dvsl-surface">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="font-display font-black text-2xl text-dvsl-text tracking-wider mb-2">DVSL</div>
          <p className="text-dvsl-muted text-sm leading-relaxed">
            Delaware Valley Synagogue League<br />
            Men's Slow-Pitch Softball · Est. 1976
          </p>
        </div>
        <div>
          <p className="text-xs font-mono text-dvsl-lime tracking-widest uppercase mb-3">Navigate</p>
          <nav className="grid grid-cols-2 gap-y-2 gap-x-4">
            {[
              ['/','Home'],['/scores','Scores'],['/schedule','Schedule'],
              ['/standings','Standings'],['/stats','Stats'],['/teams','Teams'],
              ['/rules','Field Guide'],
            ].map(([to,label]) => (
              <Link key={to} to={to} className="text-dvsl-muted text-sm hover:text-dvsl-text transition-colors">{label}</Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="text-xs font-mono text-dvsl-lime tracking-widest uppercase mb-3">Contact</p>
          <p className="text-dvsl-muted text-sm">Questions or rainout updates?</p>
          <a href="mailto:commissioner@dvsl.org" className="text-dvsl-text text-sm hover:text-dvsl-lime transition-colors">
            commissioner@dvsl.org
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-dvsl-border flex items-center justify-between">
        <p className="text-dvsl-muted text-xs">© 2025 Delaware Valley Synagogue League</p>
        <p className="text-dvsl-muted text-xs font-mono">EST. 1976</p>
      </div>
    </footer>
  )
}
