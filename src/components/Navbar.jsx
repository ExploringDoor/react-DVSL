import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/scores',    label: 'Scores' },
  { to: '/schedule',  label: 'Schedule' },
  { to: '/standings', label: 'Standings' },
  { to: '/stats',     label: 'Stats' },
  { to: '/teams',     label: 'Teams' },
  { to: '/playoffs',  label: 'Brackets' },
  { to: '/rules',     label: 'Field Guide' },
  { to: '/photos',    label: 'Gallery' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav style={{
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 62,
        background: 'rgba(7,7,9,0.98)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <Link to="/" style={{ textDecoration:'none', flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
          <img src="/dvsl-logo.png" alt="DVSL" style={{ height:36, width:36, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--gold)' }}>DVSL</span>
        </Link>

        {/* Desktop nav */}
        <ul style={{ display:'flex', gap:2, listStyle:'none', margin:'0 auto' }} className="hidden lg:flex">
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to==='/'} className={({ isActive }) => `nav-link${isActive?' active':''}`}>{l.label}</NavLink>
            </li>
          ))}
        </ul>

        {/* Hamburger button — always visible on non-desktop */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', display: 'flex', flexDirection: 'column',
            gap: 5, flexShrink: 0,
          }}
          className="lg:hidden"
          aria-label="Toggle menu"
        >
          <span style={{ display:'block', width:24, height:2, background:'var(--white)', borderRadius:2, transition:'all .3s', transform: open ? 'translateY(7px) rotate(45deg)' : 'none' }} />
          <span style={{ display:'block', width:24, height:2, background:'var(--white)', borderRadius:2, transition:'all .3s', opacity: open ? 0 : 1 }} />
          <span style={{ display:'block', width:24, height:2, background:'var(--white)', borderRadius:2, transition:'all .3s', transform: open ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
        </button>
      </nav>

      {/* Full-screen mobile menu overlay */}
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9999,
          background: '#070709',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }} className="lg:hidden">
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', height:62, borderBottom:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <img src="/dvsl-logo.png" alt="DVSL" style={{ height:32, width:32, objectFit:'contain' }} />
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:'var(--gold)', letterSpacing:'.1em' }}>DVSL</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'var(--white)', fontSize:28, cursor:'pointer', padding:8 }}>✕</button>
          </div>

          {/* Nav links */}
          <div style={{ padding:'8px 0 40px' }}>
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center',
                  fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36,
                  textTransform: 'uppercase', letterSpacing: '.02em',
                  color: isActive ? 'var(--gold)' : 'var(--white)',
                  textDecoration: 'none',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  background: isActive ? 'rgba(245,200,66,0.06)' : 'none',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
