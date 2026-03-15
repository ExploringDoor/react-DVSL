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
    time = raw.includes(':') ? raw : raw.replace(/(PM|AM)/, ':00 $1')
  }
  return `${mo} ${day} · ${time}`
}

export default function Ticker() {
  const completed = GAMES.filter(g => g.status === 'final').reverse().slice(0, 8)
  const upcoming  = GAMES.filter(g => g.status === 'upcoming').slice(0, 10)
  // Show completed first, then upcoming — but only records for upcoming, scores for completed
  const all = [...completed, ...upcoming]

  return (
    <div style={{
      background: '#0a0a0d',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      overflowX: 'auto', scrollbarWidth: 'none',
      whiteSpace: 'nowrap', display: 'flex', alignItems: 'stretch',
    }}>
      {/* DVSL badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.08)', flexShrink: 0,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>⬡</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)' }}>DVSL</span>
        <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>2026</span>
      </div>

      {/* Game columns */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {all.map(g => {
          const away = getTeamByShort(g.away)
          const home = getTeamByShort(g.home)
          const done = g.status === 'final'
          const aWin = done && g.awayScore > g.homeScore
          const hWin = done && g.homeScore > g.awayScore

          return (
            <div key={g.id} style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '5px 16px', borderRight: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0, gap: 2,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                {fmtTickerDate(g.date, g.field)}
              </div>
              {/* Away */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: away?.color || 'var(--white)' }}>{g.away}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{away ? `${away.w}-${away.l}` : ''}</span>
                {done && <span style={{ fontSize: 13, fontWeight: aWin ? 700 : 400, color: aWin ? 'var(--white)' : 'rgba(255,255,255,0.4)', marginLeft: 3 }}>{g.awayScore}</span>}
              </div>
              {/* Home */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: home?.color || 'var(--white)' }}>{g.home}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{home ? `${home.w}-${home.l}` : ''}</span>
                {done && <span style={{ fontSize: 13, fontWeight: hWin ? 700 : 400, color: hWin ? 'var(--white)' : 'rgba(255,255,255,0.4)', marginLeft: 3 }}>{g.homeScore}</span>}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, marginLeft: 'auto' }}>
        <Link to="/schedule" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--gold)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Full Schedule »
        </Link>
      </div>
    </div>
  )
}
