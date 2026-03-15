import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getLiveGame } from '../data/games'

const NAV = [
  { to: '/',           label: 'Home'      },
  { to: '/scores',     label: 'Scores'    },
  { to: '/schedule',   label: 'Schedule'  },
  { to: '/standings',  label: 'Standings' },
  { to: '/stats',      label: 'Stats'     },
  { to: '/teams',      label: 'Teams'     },
  { to: '/playoffs',   label: 'Playoffs'  },
  { to: '/rules',      label: 'Field Guide'},
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const live = getLiveGame()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-dvsl-lime' : 'text-dvsl-muted hover:text-dvsl-text'}`

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-dvsl-bg/95 backdrop-blur border-b border-dvsl-border' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display font-black text-xl tracking-wider text-dvsl-text">DVSL</span>
            <span className="hidden sm:block text-dvsl-muted text-xs font-mono">·</span>
            <span className="hidden sm:block text-dvsl-muted text-xs font-mono tracking-wider">SOFTBALL</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV.map(n => (
              <NavLink key={n.to} to={n.to} end={n.to==='/'} className={linkClass}>{n.label}</NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            {live && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-red-400 border border-red-900/50 bg-red-950/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            <a
              href="#alerts"
              className="hidden sm:block text-xs font-semibold bg-dvsl-lime text-dvsl-bg px-3 py-1.5 rounded-md hover:brightness-110 transition-all"
            >
              🔔 Alerts
            </a>
            {/* Hamburger */}
            <button
              onClick={() => setOpen(o => !o)}
              className="lg:hidden flex flex-col gap-1.5 p-1"
              aria-label="Menu"
            >
              <span className={`block w-5 h-0.5 bg-dvsl-text transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-dvsl-text transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-dvsl-text transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-dvsl-surface border-t border-dvsl-border px-4 py-3 flex flex-col gap-3">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to==='/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium py-1 ${isActive ? 'text-dvsl-lime' : 'text-dvsl-muted'}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Ticker */}
      <Ticker />
    </>
  )
}

function Ticker() {
  const items = [
    'DVSL 2025 Season — Week 6 begins June 15',
    'Beth Chaim leads standings at 8-3',
    'Most recent: Beth Chaim 8, Shir Ami 8 (tie)',
    'Playoffs begin July 13 · All 6 teams qualify',
    'MVP leader: D. Goldstein (.425 AVG, 14 RBI)',
    'Next game: June 15 at Dresher Community Park',
  ]
  const repeated = [...items, ...items]

  return (
    <div className="fixed top-14 inset-x-0 z-40 bg-dvsl-lime text-dvsl-bg overflow-hidden h-7 flex items-center">
      <div className="ticker-track flex gap-16 whitespace-nowrap text-xs font-mono font-semibold tracking-wide">
        {repeated.map((s, i) => (
          <span key={i}>⬡ {s}</span>
        ))}
      </div>
    </div>
  )
}
