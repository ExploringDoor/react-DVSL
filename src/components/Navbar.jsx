import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/scores',   label: 'Scores' },
  { to: '/schedule', label: 'Schedule' },
  { to: '/standings',label: 'Standings' },
  { to: '/stats',    label: 'Stats' },
  { to: '/teams',    label: 'Teams' },
  { to: '/playoffs', label: 'Playoffs' },
  { to: '/rules',    label: 'Rules' },
  { to: '/photos',   label: 'Photos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(13,15,20,0.97)' : 'rgba(13,15,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid #252a38' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-dvsl-lime flex items-center justify-center">
              <span className="text-dvsl-bg font-display text-lg leading-none">D</span>
            </div>
            <span className="font-display text-xl tracking-wide text-dvsl-text hidden sm:block">DVSL</span>
            <span className="text-dvsl-muted text-xs hidden sm:block">Softball</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'text-dvsl-lime bg-dvsl-lime/10'
                      : 'text-dvsl-muted hover:text-dvsl-text'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Season badge + hamburger */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 bg-dvsl-border px-2.5 py-1 rounded-full text-xs font-mono text-dvsl-lime">
              <span className="w-1.5 h-1.5 rounded-full bg-dvsl-lime animate-pulse" />
              2025
            </span>
            <button
              onClick={() => setOpen(o => !o)}
              className="lg:hidden p-2 text-dvsl-muted hover:text-dvsl-text"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                {open
                  ? <><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></>
                  : <><line x1="3" y1="6" x2="17" y2="6"/><line x1="3" y1="10" x2="17" y2="10"/><line x1="3" y1="14" x2="17" y2="14"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-dvsl-surface border-t border-dvsl-border px-4 py-3">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive ? 'text-dvsl-lime' : 'text-dvsl-muted hover:text-dvsl-text'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
