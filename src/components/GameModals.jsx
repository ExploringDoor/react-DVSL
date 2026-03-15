import { getTeamByShort } from '../data/teams'
import { getPitcher } from '../data/pitchers'

// Generate fake but realistic box score for a game
function genBoxScore(game) {
  const seed = (game.away?.charCodeAt(0) || 0) + (game.home?.charCodeAt(0) || 0)
  const names = {
    GOLD:['Josh Weinberg','Mike Goldstein','Aaron Rosen','David Levy','Ben Abrams','Noah Schwartz','Sam Rubin','Zach Feldman','Ari Blum'],
    SA:  ['Carlos Rivera','Tony DeLuca','Pete DiNunzio','Ray Kowalski','Lou DiMaggio','Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario'],
    KI:  ['Kevin Park','Brian Kim','Danny Ito','Sam Levy','Barry Kahn','Josh Cohen','Neil Katz','Rob Frankel','Jake Robbins'],
    BOB: ['Bobby Marchetti','Tony Greco','Chris Rosario','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz','Bob Weiner'],
    TBIR:['Tom Birnbaum','Jake Robbins','Abe Stern','Phil Grossman','Steve Rubin','Jeff Landau','Gary Rubin','Marty Fein','Larry Weiss'],
    AJ:  ['Al Jacobs','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
    BA1: ['Lou DiMaggio','Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Danny Ito'],
    BOR: ['Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz'],
    TBI1:['Marco Vitale','Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum'],
    GJC: ['Sal Bianchi','Tony Greco','Chris Rosario','Bobby Marchetti','Phil Stern','Marco Vitale','Danny Ito','Sam Levy','Barry Kahn'],
    TI:  ['Jake Robbins','Phil Grossman','Steve Rubin','Jeff Landau','Gary Rubin','Marty Fein','Larry Weiss','Paul Silverman','Marty Drexler'],
    KA:  ['Marty Drexler','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
  }
  const fallback = ['Player One','Player Two','Player Three','Player Four','Player Five','Player Six','Player Seven','Player Eight','Player Nine']

  function teamPlayers(short) {
    const roster = names[short] || fallback
    return roster.slice(0, 9).map((name, i) => {
      const ab = 3 + (i + seed) % 2
      const h  = Math.max(0, Math.floor(ab * (0.2 + ((i * seed) % 3) * 0.1)))
      const r  = Math.floor(h * 0.4)
      const rbi= Math.floor(h * 0.5)
      const hr = h > 2 && i % 3 === 0 ? 1 : 0
      const bb = (i + seed) % 3 === 0 ? 1 : 0
      return { name, ab, h, r, rbi, hr, bb, avg: ab > 0 ? (h/ab).toFixed(3).replace(/^0/,'.') : '.000' }
    })
  }

  return { away: teamPlayers(game.away), home: teamPlayers(game.home) }
}

function genRecap(game) {
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const winner = game.awayScore > game.homeScore ? game.away : game.home
  const loser  = game.awayScore > game.homeScore ? game.home : game.away
  const winScore = Math.max(game.awayScore, game.homeScore)
  const loseScore = Math.min(game.awayScore, game.homeScore)
  const winP = getPitcher(winner)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  return `${winner} defeated ${loser} ${winScore}-${loseScore} at ${field} in a hard-fought ${game.day?.toUpperCase()} night contest. ${winP.name} was dominant on the mound, going the distance to improve to ${winP.wl} on the season with a ${winP.era} ERA. The offense provided early support, plating runs in three separate innings to build a lead ${loser} could never overcome. ${loser} made things interesting in the late innings but couldn't convert the key hits when it mattered most. ${winner} improves to a winning record and continues to push for playoff positioning as the season heats up.`
}

function genGamedayPreview(game) {
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const awayP = getPitcher(game.away)
  const homeP = getPitcher(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
  const timeMatch = game.field?.match(/([\d:]+)\s*(pm|am)/i)
  const time = timeMatch ? `${timeMatch[1]}${timeMatch[1].includes(':') ? '' : ':00'} ${timeMatch[2].toUpperCase()}` : '7:30 PM'

  return {
    field, time,
    awayP, homeP,
    awayRecord: `${awayT?.w}-${awayT?.l}`,
    homeRecord: `${homeT?.w}-${homeT?.l}`,
    storyline: `${game.away} (${awayT?.w}-${awayT?.l}) travels to face ${game.home} (${homeT?.w}-${homeT?.l}) at ${field}. ${awayP.name} is expected to take the mound for ${game.away}, coming in with a ${awayP.era} ERA. ${homeP.name} will counter for ${game.home} with a ${homeP.era} ERA. Both clubs are hungry for a win as playoff positioning becomes increasingly important. This matchup has the potential to be a pitcher's duel — expect a tightly contested game from first pitch to last out.`
  }
}

// ── MODAL WRAPPER ─────────────────────────────────────────
function Modal({ onClose, children }) {
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.85)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: 12, maxWidth: 860, width: '100%',
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
      <div>
        <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, textTransform: 'uppercase', color: 'var(--white)', letterSpacing: '.02em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 22, cursor: 'pointer', padding: '4px 8px' }}>✕</button>
    </div>
  )
}

// ── BOX SCORE MODAL ───────────────────────────────────────
export function BoxScoreModal({ game, onClose }) {
  const { away, home } = genBoxScore(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)

  function TeamTable({ players, teamShort, teamColor, score }) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 20, textTransform: 'uppercase', color: teamColor }}>{teamShort}</span>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 28, color: 'var(--white)' }}>{score}</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Player','AB','H','R','RBI','HR','BB','AVG'].map(h => (
                <th key={h} style={{ padding: '6px 10px', textAlign: h === 'Player' ? 'left' : 'center', fontSize: 11, fontWeight: 700, letterSpacing: '.08em', color: 'var(--muted2)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '7px 10px', fontWeight: 500, color: 'var(--white)' }}>{p.name}</td>
                {[p.ab, p.h, p.r, p.rbi, p.hr, p.bb, p.avg].map((v, vi) => (
                  <td key={vi} style={{ padding: '7px 10px', textAlign: 'center', color: vi === 6 ? 'var(--gold)' : 'var(--muted)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: vi === 6 ? 700 : 400 }}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="Box Score"
        subtitle={`${game.away} vs ${game.home} · ${field} · ${game.date}`}
        onClose={onClose}
      />
      <div style={{ padding: '20px 24px' }}>
        <TeamTable players={away} teamShort={game.away} teamColor={awayT?.color || 'var(--gold)'} score={game.awayScore} />
        <TeamTable players={home} teamShort={game.home} teamColor={homeT?.color || 'var(--blue)'} score={game.homeScore} />
      </div>
    </Modal>
  )
}

// ── RECAP MODAL ───────────────────────────────────────────
export function RecapModal({ game, onClose }) {
  const recap = genRecap(game)
  const winP  = getPitcher(game.awayScore > game.homeScore ? game.away : game.home)
  const lossP = getPitcher(game.awayScore > game.homeScore ? game.home : game.away)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Game Recap" subtitle={`${game.away} ${game.awayScore} · ${game.home} ${game.homeScore} · ${field}`} onClose={onClose} />
      <div style={{ padding: '24px' }}>
        {/* Score summary */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
          {[
            { t: game.away, team: awayT, score: game.awayScore },
            { t: game.home, team: homeT, score: game.homeScore },
          ].map(side => (
            <div key={side.t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 22, color: side.team?.color || 'var(--white)', textTransform: 'uppercase' }}>{side.t}</span>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 36, color: 'var(--white)' }}>{side.score}</span>
            </div>
          ))}
        </div>
        {/* Pitchers */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          {[{ role:'WIN', p: winP, short: game.awayScore > game.homeScore ? game.away : game.home },
            { role:'LOSS', p: lossP, short: game.awayScore > game.homeScore ? game.home : game.away }].map(({ role, p, short }) => (
            <div key={role}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted2)', marginBottom: 4 }}>{role}</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted2)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        {/* Recap text */}
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)', fontWeight: 400 }}>{recap}</p>
      </div>
    </Modal>
  )
}

// ── GAMEDAY PREVIEW MODAL ─────────────────────────────────
export function GamedayModal({ game, onClose }) {
  const { field, time, awayP, homeP, awayRecord, homeRecord, storyline } = genGamedayPreview(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)

  function TeamBadgeLg({ short, color, size = 60 }) {
    return (
      <div style={{ width: size, height: size, borderRadius: 12, border: `2px solid ${color}`, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: size * 0.26, color, letterSpacing: '.02em' }}>
        {short?.slice(0,4)}
      </div>
    )
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Gameday" subtitle={`${field} · ${time} · ${game.date}`} onClose={onClose} />
      <div style={{ padding: '24px' }}>
        {/* Teams */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <TeamBadgeLg short={game.away} color={awayT?.color || '#6b7280'} size={64} />
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: awayT?.color || 'var(--white)', textTransform: 'uppercase', marginTop: 8 }}>{game.away}</div>
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>{awayRecord}</div>
          </div>
          <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 32, color: 'var(--muted2)' }}>vs</div>
          <div style={{ textAlign: 'center' }}>
            <TeamBadgeLg short={game.home} color={homeT?.color || '#6b7280'} size={64} />
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 26, color: homeT?.color || 'var(--white)', textTransform: 'uppercase', marginTop: 8 }}>{game.home}</div>
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>{homeRecord}</div>
          </div>
        </div>
        {/* Probable pitchers */}
        <div style={{ display: 'flex', gap: 32, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
          {[{ label: 'Away Pitcher', p: awayP }, { label: 'Home Pitcher', p: homeP }].map(({ label, p }) => (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize: 13, color: 'var(--muted2)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        {/* Storyline */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Preview</div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--muted)' }}>{storyline}</p>
      </div>
    </Modal>
  )
}
