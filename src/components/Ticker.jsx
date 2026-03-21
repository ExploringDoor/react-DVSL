import { GAMES } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { Link } from 'react-router-dom'

function fmtTickerDate(date, field) {
  const [mon, day] = (date || '').split(' ')
  const mo = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }[mon] || mon
  const m = field?.match(/(\d+:\d+|\d+)\s*(pm|am)/i)
  const time = m ? `${m[1]}${m[1].includes(':') ? '' : ':00'} ${m[2].toUpperCase()}` : '7:00 PM'
  return `${mo} ${day} · ${time}`
}

export default function Ticker() {
  const games = GAMES.filter(g => g.status === 'upcoming').slice(0, 9)

  return (
    <div style={{
      background: '#002080',
      borderBottom: '2px solid #0057FF',
      overflowX: 'auto', scrollbarWidth: 'none',
      whiteSpace: 'nowrap', display: 'flex', alignItems: 'stretch',
    }}>
      {/* DVSL badge */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 16px', borderRight:'1px solid rgba(255,255,255,0.15)', flexShrink:0 }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:14, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFD700' }}>DVSL</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13, color:'rgba(255,255,255,0.7)' }}>2026</span>
      </div>

      {/* Games */}
      <div style={{ display:'flex', alignItems:'stretch' }}>
        {games.map(g => {
          const away = getTeamByShort(g.away)
          const home = getTeamByShort(g.home)
          return (
            <div key={g.id} style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'5px 14px', borderRight:'1px solid rgba(255,255,255,0.12)', flexShrink:0, gap:2 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', color:'#ff4444', textTransform:'uppercase' }}>
                {fmtTickerDate(g.date, g.field)}
              </div>
              {[{team:away, short:g.away, id:away?.id||g.away.toLowerCase()},
                {team:home, short:g.home, id:home?.id||g.home.toLowerCase()}].map(side => (
                <div key={side.short} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <Link to={'/teams/'+side.id} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, color:'#fff', textDecoration:'none', letterSpacing:'.02em' }}>
                    {side.short}
                  </Link>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>
                    {side.team ? `${side.team.w}-${side.team.l}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      <div style={{ display:'flex', alignItems:'center', padding:'0 18px', flexShrink:0, marginLeft:'auto' }}>
        <Link to="/schedule" style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#FFD700', textDecoration:'none', whiteSpace:'nowrap' }}>
          Full Schedule »
        </Link>
      </div>
    </div>
  )
}
