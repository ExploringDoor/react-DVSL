import { GAMES } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { Link } from 'react-router-dom'

function fmtTickerDate(date, field) {
  const [mon, day] = (date || '').split(' ')
  const mo = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }[mon] || mon
  const timeMatch = field?.match(/([\d:]+)\s*(pm|am)/i)
  let time = '7:00 PM'
  if (timeMatch) {
    const raw = timeMatch[0].toUpperCase()
    time = raw.includes(':') ? raw.replace('PM',' PM').replace('AM',' AM') : raw.replace(/(PM|AM)/, ':00 $1')
  }
  return `${mo} ${day} · ${time}`
}

export default function Ticker() {
  const games = GAMES.filter(g => g.status === 'upcoming').slice(0, 9)

  return (
    <div style={{
      background: '#0057FF',
      borderBottom: 'none',
      overflowX: 'auto', scrollbarWidth: 'none',
      whiteSpace: 'nowrap', display: 'flex', alignItems: 'stretch',
    }}>
      {/* DVSL badge */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 16px', borderRight:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}>
        <span style={{ color:'rgba(255,255,255,0.8)', fontSize:11 }}>⬡</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, letterSpacing:'.08em', textTransform:'uppercase', color:'#fff' }}>DVSL</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'rgba(255,255,255,0.8)' }}>2026</span>
      </div>

      {/* Game columns */}
      <div style={{ display:'flex', alignItems:'stretch' }}>
        {games.map(g => {
          const away = getTeamByShort(g.away)
          const home = getTeamByShort(g.home)
          return (
            <div key={g.id} style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'5px 10px', borderRight:'1px solid rgba(255,255,255,0.2)', flexShrink:0, gap:2 }}>
              {/* Date/time — brighter */}
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', color:'rgba(255,255,255,0.9)', textTransform:'uppercase' }}>
                {fmtTickerDate(g.date, g.field)}
              </div>
              {/* Away — clickable */}
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Link to={`/teams/${away?.id || g.away.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:away?.color || 'var(--white)', textDecoration:'none' }}>
                  {g.away}
                </Link>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{away ? `${away.w}-${away.l}` : ''}</span>
              </div>
              {/* Home — clickable */}
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <Link to={`/teams/${home?.id || g.home.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:home?.color || 'var(--white)', textDecoration:'none' }}>
                  {g.home}
                </Link>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{home ? `${home.w}-${home.l}` : ''}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display:'flex', alignItems:'center', padding:'0 20px', flexShrink:0, marginLeft:'auto' }}>
        <Link to="/schedule" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#fff', fontWeight:700, textDecoration:'none', whiteSpace:'nowrap' }}>
          Full Schedule »
        </Link>
      </div>
    </div>
  )
}
