import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import { getPitcher, fakeHE } from '../data/pitchers'
import TeamBadge from './TeamBadge'

function cleanField(f) {
  return f?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i, '').trim() || f
}
function parseTime(f) {
  const m = f?.match(/([\d:]+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  return `${m[1]}:${m[1].includes(':') ? '' : '00'} ${m[2].toUpperCase()}`.replace('::', ':')
}

// Hexagon badge shape for pitcher
function HexBadge({ short, size = 44 }) {
  const team = getTeamByShort(short)
  const color = team?.color || '#6b7280'
  return (
    <div style={{
      width: size, height: size,
      background: `${color}22`,
      border: `2px solid ${color}`,
      borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 900, fontSize: size * 0.27,
      color: color, flexShrink: 0, letterSpacing: '.02em',
    }}>
      {short?.slice(0, 4)}
    </div>
  )
}

export default function GameCard({ game, isNext = false }) {
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const done = game.status === 'final'
  const aWin = done && game.awayScore > game.homeScore
  const hWin = done && game.homeScore > game.awayScore
  const field = cleanField(game.field)

  // Compute fake H/E from score
  const seed = (game.id || '').length + (game.away?.charCodeAt(0) || 0)
  const awayHE = done ? fakeHE(game.awayScore, seed) : null
  const homeHE = done ? fakeHE(game.homeScore, seed + 3) : null

  // Pitchers
  const winTeam  = aWin ? game.away : game.home
  const lossTeam = aWin ? game.home : game.away
  const winP  = done ? getPitcher(winTeam)  : null
  const lossP = done ? getPitcher(lossTeam) : null

  if (!done) {
    // Upcoming game — simple layout
    return (
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
        {isNext && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', paddingBottom: 6, paddingLeft: 44 }}>NEXT</div>
        )}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ t: game.away, team: away }, { t: game.home, team: home }].map(side => (
              <div key={side.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TeamBadge short={side.t} size={34} />
                <Link to={`/teams/${side.team?.id || side.t}`} style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 24,
                  textTransform: 'uppercase', color: 'var(--white)', textDecoration: 'none', lineHeight: 1,
                }}>
                  {side.t}
                </Link>
                {side.team && (
                  <span style={{ fontSize: 12, color: 'var(--muted2)' }}>({side.team.w}-{side.team.l})</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ width: 1, background: 'var(--border)', margin: '0 20px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 130 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--white)' }}>{field}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginTop: 6 }}>{parseTime(game.field)}</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)', margin: '0 20px' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="btn-outline" style={{ fontSize: 14 }}>GAMEDAY</button>
          </div>
        </div>
      </div>
    )
  }

  // Final game — full layout matching screenshot
  return (
    <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>

        {/* LEFT: Teams + R/H/E */}
        <div style={{ flex: '0 0 auto', minWidth: 420, padding: '18px 24px' }}>
          {/* R H E header */}
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 54, marginBottom: 8, gap: 0 }}>
            {['R', 'H', 'E'].map(l => (
              <span key={l} style={{ width: 60, textAlign: 'center', fontSize: 13, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted2)', textTransform: 'uppercase' }}>{l}</span>
            ))}
          </div>

          {/* Away row */}
          {[
            { t: game.away, team: away, score: game.awayScore, he: awayHE, won: aWin },
            { t: game.home, team: home, score: game.homeScore, he: homeHE, won: hWin },
          ].map((side, i) => (
            <div key={side.t}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: i === 0 ? 6 : 0 }}>
                <TeamBadge short={side.t} size={34} />
                <Link to={`/teams/${side.team?.id || side.t}`} style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: side.won ? 800 : 400,
                  fontSize: 28, textTransform: 'uppercase',
                  color: side.won ? 'var(--white)' : 'var(--muted)',
                  textDecoration: 'none', lineHeight: 1,
                  marginLeft: 10, width: 10,
                  display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto',
                  minWidth: 0,
                }}>
                  {side.t}
                  {side.won && <span style={{ fontSize: 10, color: 'var(--white)', opacity: .6 }}>◄</span>}
                </Link>
                {!side.won && side.team && (
                  <span style={{ fontSize: 12, color: 'var(--muted2)', marginLeft: 8, flex: '0 0 auto' }}>({side.team.w}-{side.team.l})</span>
                )}
                {/* R H E scores */}
                <div style={{ display: 'flex', marginLeft: 'auto' }}>
                  <span style={{ width: 60, textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: side.won ? 800 : 400, fontSize: 38, color: side.won ? 'var(--white)' : 'var(--muted)', lineHeight: 1 }}>
                    {side.score}
                  </span>
                  <span style={{ width: 60, textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 38, color: side.won ? 'var(--white)' : 'var(--muted)', lineHeight: 1 }}>
                    {side.he?.h}
                  </span>
                  <span style={{ width: 60, textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400, fontSize: 38, color: 'var(--muted)', lineHeight: 1 }}>
                    {side.he?.e}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div style={{ paddingLeft: 44, marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted2)' }}>FINAL</span>
          </div>
        </div>

        {/* DIVIDER + FIELD */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 28px', borderLeft: '1px solid var(--border)', minWidth: 130 }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--white)' }}>{field}</div>
        </div>

        {/* WIN / LOSS pitchers */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 24px', borderLeft: '1px solid var(--border)', flex: 1, gap: 12 }}>
          {[
            { role: 'WIN',  p: winP,  short: winTeam },
            { role: 'LOSS', p: lossP, short: lossTeam },
          ].map(({ role, p, short }) => (
            <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted2)', width: 36, flexShrink: 0 }}>{role}</span>
              <HexBadge short={short} size={44} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)' }}>{p?.name}</div>
                <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 2 }}>{p?.wl} · {p?.era} ERA</div>
              </div>
            </div>
          ))}
        </div>

        {/* RECAP / BOX SCORE buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: '18px 24px', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
          <button className="btn-outline" style={{ fontSize: 14, letterSpacing: '.08em' }}>RECAP</button>
          <button className="btn-outline" style={{ fontSize: 14, letterSpacing: '.08em' }}>BOX SCORE</button>
        </div>
      </div>
    </div>
  )
}
