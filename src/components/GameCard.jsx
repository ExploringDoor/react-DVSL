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

function PitcherBadge({ short, size = 48 }) {
  const team = getTeamByShort(short)
  const color = team?.color || '#6b7280'
  return (
    <div style={{
      width: size, height: size, borderRadius: '22%',
      background: `${color}28`, border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900,
      fontSize: size * 0.26, color, flexShrink: 0, letterSpacing: '.02em',
    }}>{short?.slice(0, 4)}</div>
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
  const time  = parseTime(game.field)

  // ── UPCOMING ──────────────────────────────────────────────
  if (!done) {
    return (
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', marginBottom: 2 }}>
        {isNext && (
          <div style={{ padding: '8px 20px 0', fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--gold)' }}>NEXT</div>
        )}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          {/* Teams */}
          <div style={{ flex: 1, padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[{ t: game.away, team: away }, { t: game.home, team: home }].map(side => (
              <div key={side.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <TeamBadge short={side.t} size={36} />
                <div>
                  <Link to={`/teams/${side.team?.id || side.t}`} style={{
                    fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
                    fontSize: 28, textTransform: 'uppercase',
                    color: 'var(--white)', textDecoration: 'none', lineHeight: 1, display: 'block',
                  }}>{side.t}</Link>
                  {side.team && <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 1 }}>({side.team.w}-{side.team.l})</div>}
                </div>
              </div>
            ))}
          </div>
          {/* Field + time */}
          <div style={{ borderLeft: '1px solid var(--border)', padding: '14px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 160 }}>
            <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--white)', marginBottom: 6 }}>{field}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>{time}</div>
          </div>
          {/* Big time + gameday */}
          <div style={{ borderLeft: '1px solid var(--border)', padding: '14px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, color: 'var(--gold)', letterSpacing: '.01em', whiteSpace: 'nowrap' }}>{time}</div>
            <button className="btn-outline" style={{ fontSize: 13, letterSpacing: '.08em' }}>GAMEDAY</button>
          </div>
        </div>
      </div>
    )
  }

  // ── FINAL ─────────────────────────────────────────────────
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 2, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
      {/* R/H/E */}
      <div style={{ padding: '18px 20px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', paddingLeft: 50, marginBottom: 8 }}>
          {['R','H','E'].map(l => (
            <span key={l} style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted2)', textTransform: 'uppercase' }}>{l}</span>
          ))}
        </div>
        {[
          { t: game.away, team: away, score: game.awayScore, he: awayHE, won: aWin },
          { t: game.home, team: home, score: game.homeScore, he: homeHE, won: hWin },
        ].map((side, i) => (
          <div key={side.t} style={{ display: 'flex', alignItems: 'center', marginBottom: i === 0 ? 4 : 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 168, flexShrink: 0 }}>
              <TeamBadge short={side.t} size={36} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Link to={`/teams/${side.team?.id || side.t}`} style={{
                    fontFamily: "'Barlow Condensed',sans-serif",
                    fontWeight: side.won ? 800 : 400, fontSize: 24,
                    textTransform: 'uppercase',
                    color: side.won ? 'var(--white)' : 'var(--muted)',
                    textDecoration: 'none', lineHeight: 1,
                  }}>{side.t}</Link>
                  {side.won && <span style={{ fontSize: 9, color: 'var(--muted)' }}>◄</span>}
                </div>
                {side.team && <div style={{ fontSize: 11, color: 'var(--muted2)', marginTop: 1 }}>({side.team.w}-{side.team.l})</div>}
              </div>
            </div>
            {[side.score, side.he?.h, side.he?.e].map((val, vi) => (
              <span key={vi} style={{
                width: 56, textAlign: 'center',
                fontFamily: "'Barlow Condensed',sans-serif",
                fontWeight: vi === 0 && side.won ? 800 : 400,
                fontSize: 40, lineHeight: 1,
                color: vi === 2 ? 'var(--muted)' : side.won ? 'var(--white)' : 'var(--muted)',
              }}>{val}</span>
            ))}
          </div>
        ))}
        <div style={{ paddingLeft: 44, marginTop: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--muted2)' }}>FINAL</span>
        </div>
      </div>

      {/* WIN/LOSS — no field name, saves space */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '18px 20px', borderLeft: '1px solid var(--border)', flex: 1, gap: 14 }}>
        {[{ role:'WIN', p:winP, short:winTeam }, { role:'LOSS', p:lossP, short:lossTeam }].map(({ role, p, short }) => (
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
