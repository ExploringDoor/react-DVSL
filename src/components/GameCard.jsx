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
  const [, t, period] = m
  return `${t}${t.includes(':') ? '' : ':00'} ${period.toUpperCase()}`
}

// Hexagon-ish badge for pitchers (matches screenshot 3)
function PitcherBadge({ short, size = 48 }) {
  const team = getTeamByShort(short)
  const color = team?.color || '#6b7280'
  return (
    <div style={{
      width: size, height: size,
      borderRadius: '30%',
      background: `${color}30`,
      border: `2px solid ${color}`,
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

  const seed = (game.id || '').length + (game.away?.charCodeAt(0) || 0)
  const awayHE = done ? fakeHE(game.awayScore, seed) : null
  const homeHE = done ? fakeHE(game.homeScore, seed + 3) : null

  const winTeam  = aWin ? game.away : game.home
  const lossTeam = aWin ? game.home : game.away
  const winP  = done ? getPitcher(winTeam)  : null
  const lossP = done ? getPitcher(lossTeam) : null
  const field = cleanField(game.field)

  if (!done) {
    return (
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 24px', marginBottom: 2 }}>
        {isNext && (
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)', paddingBottom: 8, paddingLeft: 46 }}>NEXT</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ t: game.away, team: away }, { t: game.home, team: home }].map(side => (
              <div key={side.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TeamBadge short={side.t} size={34} />
                <div>
                  <Link to={`/teams/${side.team?.id || side.t}`} style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: 'var(--white)', textDecoration: 'none', lineHeight: 1, display: 'block' }}>{side.t}</Link>
                  {side.team && <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 1 }}>({side.team.w}-{side.team.l})</div>}
                </div>
              </div>
            ))}
          </div>
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 24px' }} />
          <div style={{ minWidth: 140 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--white)' }}>{field}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)', marginTop: 6 }}>{parseTime(game.field)}</div>
          </div>
          <div style={{ width: 1, background: 'var(--border)', alignSelf: 'stretch', margin: '0 24px' }} />
          <div>
            <button className="btn-outline" style={{ fontSize: 14 }}>GAMEDAY</button>
          </div>
        </div>
      </div>
    )
  }

  // Completed game — matches screenshots exactly
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 2, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>

      {/* LEFT: R/H/E */}
      <div style={{ padding: '18px 20px 14px', minWidth: 360, flexShrink: 0 }}>
        {/* R H E header */}
        <div style={{ display: 'flex', paddingLeft: 46, marginBottom: 8 }}>
          {['R','H','E'].map(l => (
            <span key={l} style={{ width: 58, textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted2)', textTransform: 'uppercase' }}>{l}</span>
          ))}
        </div>

        {/* Team rows */}
        {[
          { t: game.away, team: away, score: game.awayScore, he: awayHE, won: aWin },
          { t: game.home, team: home, score: game.homeScore, he: homeHE, won: hWin },
        ].map((side, i) => (
          <div key={side.t} style={{ display: 'flex', alignItems: 'center', marginBottom: i === 0 ? 4 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 160, flexShrink: 0 }}>
              <TeamBadge short={side.t} size={34} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Link to={`/teams/${side.team?.id || side.t}`} style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: side.won ? 800 : 400,
                    fontSize: 24, textTransform: 'uppercase',
                    color: side.won ? 'var(--white)' : 'var(--muted)',
                    textDecoration: 'none', lineHeight: 1,
                  }}>{side.t}</Link>
                  {side.won && <span style={{ fontSize: 9, color: 'var(--muted)' }}>◄</span>}
                </div>
                {side.team && <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 1 }}>({side.team.w}-{side.team.l})</div>}
              </div>
            </div>
            {/* R H E numbers */}
            {[side.score, side.he?.h, side.he?.e].map((val, vi) => (
              <span key={vi} style={{
                width: 58, textAlign: 'center',
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: vi === 0 && side.won ? 800 : 400,
                fontSize: 38, lineHeight: 1,
                color: vi === 2 ? 'var(--muted)' : side.won ? 'var(--white)' : 'var(--muted)',
              }}>{val}</span>
            ))}
          </div>
        ))}

        <div style={{ paddingLeft: 42, marginTop: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted2)' }}>FINAL</span>
        </div>
      </div>

      {/* Field */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 24px', borderLeft: '1px solid var(--border)', minWidth: 130, flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--white)' }}>{field}</div>
      </div>

      {/* WIN/LOSS pitchers */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 20px', borderLeft: '1px solid var(--border)', flex: 1, gap: 12 }}>
        {[{ role: 'WIN', p: winP, short: winTeam }, { role: 'LOSS', p: lossP, short: lossTeam }].map(({ role, p, short }) => (
          <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted2)', width: 34, flexShrink: 0 }}>{role}</span>
            <PitcherBadge short={short} size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--white)', lineHeight: 1.2 }}>{p?.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 2 }}>{p?.wl} · {p?.era} ERA</div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10, padding: '18px 20px', borderLeft: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="btn-outline" style={{ fontSize: 13, letterSpacing: '.08em' }}>RECAP</button>
        <button className="btn-outline" style={{ fontSize: 13, letterSpacing: '.08em' }}>BOX SCORE</button>
      </div>
    </div>
  )
}
