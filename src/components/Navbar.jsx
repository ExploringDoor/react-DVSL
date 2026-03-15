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

  return (
    <>
      <nav style={{
        position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 20px', height:62,
        background:'rgba(7,7,9,.97)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)', gap:16,
      }}>
        <Link to="/" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none', flexShrink:0 }}>
          DVSL
        </Link>

        {/* Desktop links — hidden on mobile */}
        <ul style={{ display:'flex', gap:2, listStyle:'none', margin:'0 auto', flexWrap:'nowrap' }} className="hidden lg:flex">
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to==='/'} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          <button style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--gold)', background:'rgba(245,200,66,.08)', border:'1px solid rgba(245,200,66,.25)', borderRadius:6, padding:'6px 12px', cursor:'pointer', whiteSpace:'nowrap' }} className="hidden sm:block">
            🔔 Alerts
          </button>
          {/* Hamburger — visible on mobile only */}
          <button
            onClick={() => setOpen(o => !o)}
            className="lg:hidden"
            aria-label="Menu"
            style={{ background:'none', border:'none', cursor:'pointer', padding:6, display:'flex', flexDirection:'column', gap:5, flexShrink:0 }}
          >
            {open
              ? <span style={{ color:'var(--white)', fontSize:22, lineHeight:1 }}>✕</span>
              : [0,1,2].map(i => <span key={i} style={{ display:'block', width:24, height:2, background:'var(--white)', borderRadius:2 }} />)
            }
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — full screen, proper z-index */}
      {open && (
        <div style={{
          position:'fixed', top:0, left:0, right:0, bottom:0, zIndex:500,
          background:'rgba(7,7,9,0.98)', backdropFilter:'blur(20px)',
          display:'flex', flexDirection:'column', overflowY:'auto',
          paddingTop:80,
        }}>
          {/* Close button */}
          <button onClick={() => setOpen(false)} style={{ position:'absolute', top:20, right:20, background:'none', border:'none', color:'var(--white)', fontSize:28, cursor:'pointer' }}>✕</button>

          <div style={{ padding:'0 32px 40px' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', color:'var(--muted2)', textTransform:'uppercase', marginBottom:24 }}>DVSL 2026</div>
            {LINKS.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                style={({ isActive }) => ({
                  fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:40,
                  textTransform:'uppercase', letterSpacing:'.02em',
                  color: isActive ? 'var(--gold)' : 'var(--white)',
                  textDecoration:'none', padding:'14px 0',
                  borderBottom:'1px solid rgba(255,255,255,0.06)', display:'block',
                  lineHeight:1,
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
