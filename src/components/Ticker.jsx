import { getCompletedGames } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { Link } from 'react-router-dom'

function fmtDateTime(g) {
  // Parse day from field string for time, use date for date
  const timeMap = {
    '6pm': '6:00 PM', '7pm': '7:00 PM', '7:30pm': '7:30 PM',
    '8pm': '8:00 PM', '6:30pm': '6:30 PM',
  }
  const timeMatch = g.field?.match(/([\d:]+\s*pm)/i)
  const time = timeMatch
    ? timeMatch[1].replace(/(\d+):?(\d*)pm/i, (_, h, m) => `${h}:${m||'00'} PM`)
    : '7:00 PM'
  // Format date like "APR 21"
  const [mon, day] = (g.date || '').split(' ')
  const mo = { April:'APR', May:'MAY', June:'JUN', July:'JUL', August:'AUG' }[mon] || mon?.toUpperCase()
  return `${mo} ${day} · ${time}`
}

export default function Ticker() {
  const games = getCompletedGames().slice(0, 12).reverse()

  return (
    <div style={{
      background: '#0a0a0d',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      overflowX: 'auto',
      scrollbarWidth: 'none',
      whiteSpace: 'nowrap',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      {/* DVSL badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>⬡</span>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900, fontSize: 13,
          letterSpacing: '.08em', textTransform: 'uppercase',
          color: 'var(--gold)',
        }}>DVSL</span>
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700, fontSize: 13,
          color: 'rgba(255,255,255,0.35)',
        }}>2026</span>
      </div>

      {/* Game columns */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {games.map((g, i) => {
          const away = getTeamByShort(g.away)
          const home = getTeamByShort(g.home)
          const aWin = g.awayScore > g.homeScore
          const hWin = g.homeScore > g.awayScore

          return (
            <div key={g.id} style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '5px 18px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0, gap: 3,
            }}>
              {/* Date / time row */}
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                {fmtDateTime(g)}
              </div>
              {/* Away team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: 13, letterSpacing: '.04em',
                  color: away?.color || 'var(--white)',
                }}>{g.away}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {away ? `${away.w}-${away.l}` : ''}
                </span>
                <span style={{ fontSize: 13, fontWeight: aWin ? 700 : 400, color: aWin ? 'var(--white)' : 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                  {g.awayScore}
                </span>
              </div>
              {/* Home team */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700, fontSize: 13, letterSpacing: '.04em',
                  color: home?.color || 'var(--white)',
                }}>{g.home}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
                  {home ? `${home.w}-${home.l}` : ''}
                </span>
                <span style={{ fontSize: 13, fontWeight: hWin ? 700 : 400, color: hWin ? 'var(--white)' : 'rgba(255,255,255,0.4)', marginLeft: 4 }}>
                  {g.homeScore}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full Schedule link */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0, marginLeft: 'auto' }}>
        <Link to="/scores" style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700, fontSize: 13,
          color: 'var(--gold)', textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>Full Schedule »</Link>
      </div>
    </div>
  )
}
