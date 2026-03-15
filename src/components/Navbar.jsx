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
        position:'relative',
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'0 40px',height:62,
        background:'rgba(7,7,9,.92)',backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(255,255,255,0.08)',gap:24,
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:19,
          letterSpacing:'.1em',textTransform:'uppercase',
          color:'var(--gold)',textDecoration:'none',
          display:'flex',alignItems:'center',gap:10,flexShrink:0,
        }}>
          DVSL
        </Link>

        {/* Desktop links */}
        <ul style={{display:'flex',gap:2,listStyle:'none',margin:'0 auto'}} className="hidden lg:flex">
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Alerts button */}
        <button style={{
          fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,
          letterSpacing:'.06em',textTransform:'uppercase',
          color:'var(--gold)',background:'rgba(245,200,66,.08)',
          border:'1px solid rgba(245,200,66,.25)',borderRadius:6,
          padding:'7px 16px',cursor:'pointer',flexShrink:0,
          display:'flex',alignItems:'center',gap:6,
        }} className="hidden sm:flex">
          🔔 Alerts
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="lg:hidden"
          style={{background:'none',border:'none',cursor:'pointer',padding:4,display:'flex',flexDirection:'column',gap:5}}
        >
          {open
            ? <span style={{color:'var(--white)',fontSize:20}}>✕</span>
            : [0,1,2].map(i => <span key={i} style={{display:'block',width:22,height:2,background:'var(--white)',borderRadius:2}} />)
          }
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position:'fixed',top:62,left:0,right:0,zIndex:199,
          background:'rgba(7,7,9,.97)',backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(255,255,255,0.08)',
          display:'flex',flexDirection:'column',padding:'16px 20px 24px',
        }}>
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              style={({ isActive }) => ({
                fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:26,
                textTransform:'uppercase',
                color: isActive ? 'var(--gold)' : 'var(--white)',
                textDecoration:'none',padding:'12px 0',
                borderBottom:'1px solid rgba(255,255,255,0.08)',display:'block',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}
