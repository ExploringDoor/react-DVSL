import { Link } from 'react-router-dom'
import { STANDINGS } from '../data/standings'
import { getRecentGames, getUpcomingGames } from '../data/games'
import { getStatLeaders, fmtAvg } from '../data/stats'
import { getTeamByShort } from '../data/teams'
import GameCard from '../components/GameCard'
import LeaderCard from '../components/LeaderCard'

export default function Home() {
  const topStandings = STANDINGS.slice(0, 8)
  const recentGames  = getRecentGames(6)
  const upcoming     = getUpcomingGames().slice(0, 4)
  const leaders      = getStatLeaders()
  const fmtPct = n => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '.')

  const leaderCats = [
    { key:'avg', label:'Batting Avg', fmt: fmtAvg },
    { key:'hr',  label:'Home Runs',   fmt: v => v  },
    { key:'rbi', label:'RBI',         fmt: v => v  },
    { key:'r',   label:'Runs',        fmt: v => v  },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 114 }}>
      {/* Hero */}
      <div style={{ position: 'relative', background: 'var(--dark)', borderBottom: '1px solid var(--border)', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'min(28vw,280px)', color: 'rgba(255,255,255,0.03)', letterSpacing: '-.02em', userSelect: 'none', lineHeight: 1 }}>DVSL</span>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 48px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: 10 }}>2026 Season · Delaware Valley Synagogue League</div>
          <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 'min(8vw,80px)', textTransform: 'uppercase', lineHeight: 1, color: 'var(--white)', marginBottom: 24 }}>DVSL Softball</h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/scores" className="btn-gold">View Scores</Link>
            <Link to="/standings" className="btn-outline">Standings</Link>
            <Link to="/schedule" className="btn-outline">Schedule</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 60px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 40 }}>
        {/* Main column */}
        <div style={{ minWidth: 0 }}>
          {/* Recent scores */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Season Schedule · Hover a game for details</div>
                <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>Scores</h2>
              </div>
              <Link to="/scores" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>Full Schedule →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentGames.length === 0
                ? <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No scores yet.</div>
                : recentGames.map(g => <GameCard key={g.id} game={g} />)
              }
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Individual Leaders</div>
                <h2 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1 }}>Leaderboard</h2>
              </div>
              <Link to="/stats" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(245,200,66,.4)', borderRadius: 20, padding: '7px 18px', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase', fontSize: 13 }}>Full Leaders →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
              {leaderCats.map(({ key, label, fmt }) => (
                <LeaderCard key={key} catLabel={label} statKey={key} players={leaders[key] || []} fmt={fmt} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Standings */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--white)' }}>Standings</span>
              <Link to="/standings" style={{ color: 'var(--gold)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Full →</Link>
            </div>
            {topStandings.map((row, i) => (
              <div key={row.team} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: 'var(--muted2)', width: 16, textAlign: 'center', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                <Link to={`/teams/${row.id}`} style={{ flex: 1, fontSize: 13, color: 'var(--white)', textDecoration: 'none', fontWeight: 500, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</Link>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: "'Barlow Condensed',sans-serif", flexShrink: 0 }}>{row.w}-{row.l}</span>
                <span style={{ fontSize: 13, color: 'var(--gold)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, minWidth: 34, textAlign: 'right', flexShrink: 0 }}>{fmtPct(row.pct)}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: 'var(--white)' }}>Upcoming</span>
              <Link to="/schedule" style={{ color: 'var(--gold)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>Schedule →</Link>
            </div>
            {upcoming.map(g => <GameCard key={g.id} game={g} isNext />)}
          </div>
        </div>
      </div>
    </div>
  )
}
