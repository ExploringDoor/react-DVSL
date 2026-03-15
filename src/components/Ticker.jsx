import { GAMES } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { Link } from 'react-router-dom'

function fmtTickerDate(date, field) {
  const [mon, day] = (date || '').split(' ')
  const mo = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }[mon] || mon
  const timeMatch = field?.match(/([\d:]+)\s*(pm|am)/i)
  const time = timeMatch ? timeMatch[0].toUpperCase().replace(/(\d+)(PM|AM)/, '$1:00 $2') : '7:00 PM'
  return `${mo} ${day} · ${time}`
}

export default function Ticker() {
  // Show last 8 completed + next 6 upcoming
  const completed = GAMES.filter(g => g.status === 'final').reverse().slice(0, 8)
  const upcoming  = GAMES.filter(g => g.status === 'upcoming').slice(0, 6)
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
              {/* Date/time */}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                {fmtTickerDate(g.date, g.field)}
              </div>
              {/* Away */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: away?.color || 'var(--white)' }}>{g.away}</span>
                {done ? (
                  <>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{away ? `${away.w}-${away.l}` : ''}</span>
                    <span style={{ fontSize: 13, fontWeight: aWin ? 700 : 400, color: aWin ? 'var(--white)' : 'rgba(255,255,255,0.35)', marginLeft: 4 }}>{g.awayScore}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{away ? `${away.w}-${away.l}` : ''}</span>
                )}
              </div>
              {/* Home */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: home?.color || 'var(--white)' }}>{g.home}</span>
                {done ? (
                  <>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{home ? `${home.w}-${home.l}` : ''}</span>
                    <span style={{ fontSize: 13, fontWeight: hWin ? 700 : 400, color: hWin ? 'var(--white)' : 'rgba(255,255,255,0.35)', marginLeft: 4 }}>{g.homeScore}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{home ? `${home.w}-${home.l}` : ''}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Schedule link */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, marginLeft: 'auto' }}>
        <Link to="/scores" style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13, color: 'var(--gold)', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          Full Schedule »
        </Link>
      </div>
    </div>
  )
}
