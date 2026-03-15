import { Link } from 'react-router-dom'
import { STANDINGS } from '../data/standings'
import { getRecentGames, getNextGame } from '../data/games'
import { getStatLeaders, fmtAvg } from '../data/stats'
import { TEAMS } from '../data/teams'
import GameCard from '../components/GameCard'
import Countdown from '../components/Countdown'

function fmtDate(d) {
  const dt = new Date(d + 'T12:00:00')
  return dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Home() {
  const topStandings = STANDINGS.slice(0, 5)
  const recentGames  = getRecentGames(4)
  const nextGame     = getNextGame()
  const leaders      = getStatLeaders()

  return (
    <div className="min-h-screen bg-dvsl-bg">
      {/* Hero */}
      <section className="relative pt-16 pb-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #a3e63530 0%, transparent 70%)',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 pt-16 pb-12 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="section-label mb-3">2025 Season · Week 6 of 14</p>
              <h1 className="font-display text-6xl md:text-7xl leading-none text-dvsl-text mb-4">
                DELAWARE<br/>
                <span className="text-dvsl-lime">VALLEY</span><br/>
                SYNAGOGUE<br/>
                LEAGUE
              </h1>
              <p className="text-dvsl-muted text-sm leading-relaxed max-w-sm mb-6">
                Adult recreational softball for the Jewish community of the Delaware Valley. 8 teams. 14 weeks. One championship.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/scores" className="btn-primary">View Scores</Link>
                <Link to="/standings" className="btn-secondary">Standings</Link>
              </div>
            </div>

            {/* Next game / countdown */}
            {nextGame && (
              <div className="card p-6">
                <p className="section-label mb-4">Next Game</p>
                <div className="flex flex-col gap-4">
                  <Countdown targetDate={nextGame.date} targetTime={nextGame.time} />
                  <div className="border-t border-dvsl-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-dvsl-muted">Date</span>
                      <span className="text-dvsl-text font-medium">{fmtDate(nextGame.date)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dvsl-muted">Time</span>
                      <span className="text-dvsl-text">{nextGame.time}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dvsl-muted">Field</span>
                      <span className="text-dvsl-text">{nextGame.field}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-dvsl-muted">Matchup</span>
                      <span className="text-dvsl-text font-medium">{nextGame.away} @ {nextGame.home}</span>
                    </div>
                  </div>
                  <Link to="/schedule" className="btn-secondary text-center block w-full text-center">Full Schedule →</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Season progress bar */}
        <div className="border-t border-dvsl-border bg-dvsl-surface">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            <span className="text-dvsl-muted text-xs font-mono shrink-0">Week 6 / 14</span>
            <div className="flex-1 bg-dvsl-border rounded-full h-1.5">
              <div className="bg-dvsl-lime h-1.5 rounded-full" style={{ width: '43%' }} />
            </div>
            <span className="text-dvsl-lime text-xs font-mono shrink-0">43%</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Recent Scores */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">Recent Scores</p>
              <Link to="/scores" className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {recentGames.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </section>

          {/* Stat leaders preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">Batting Leaders</p>
              <Link to="/stats" className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors">Full stats →</Link>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { cat: 'AVG', key: 'avg', fmt: fmtAvg },
                { cat: 'HR',  key: 'hr',  fmt: v => v },
                { cat: 'RBI', key: 'rbi', fmt: v => v },
              ].map(({ cat, key, fmt }) => {
                const p = leaders[key]?.[0]
                if (!p) return null
                const t = TEAMS.find(t => t.name === p.team)
                return (
                  <div key={cat} className="card p-4">
                    <p className="section-label mb-2">{cat}</p>
                    <p className="font-bold text-dvsl-text text-lg leading-tight">{p.name}</p>
                    <p className="text-dvsl-muted text-xs mb-2" style={{ color: t?.color || '#6b7280' }}>{p.team}</p>
                    <p className="font-display text-4xl text-dvsl-lime">{fmt(p[key])}</p>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Standings */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Standings</p>
              <Link to="/standings" className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors">Full →</Link>
            </div>
            <div className="space-y-1">
              {topStandings.map((row, i) => {
                const t = TEAMS.find(t => t.name === row.team)
                return (
                  <div key={row.team} className="flex items-center gap-2 py-1.5 border-b border-dvsl-border last:border-0">
                    <span className="text-dvsl-muted text-xs font-mono w-4">{i+1}</span>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t?.color || '#6b7280' }} />
                    <Link to={`/teams/${t?.id}`} className="flex-1 text-sm text-dvsl-text hover:text-dvsl-lime transition-colors truncate">{row.team}</Link>
                    <span className="text-dvsl-muted text-xs font-mono">{row.w}-{row.l}</span>
                    <span className="text-dvsl-lime text-xs font-mono">{row.pct.toFixed(3).replace('0.','.')}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Teams */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Teams</p>
              <Link to="/teams" className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors">All →</Link>
            </div>
            <div className="space-y-1">
              {TEAMS.map(t => (
                <Link
                  key={t.id}
                  to={`/teams/${t.id}`}
                  className="flex items-center gap-2 py-1.5 hover:text-dvsl-lime transition-colors group"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  <span className="text-sm text-dvsl-muted group-hover:text-dvsl-lime transition-colors">{t.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Email signup */}
          <section className="card p-4">
            <p className="section-label mb-2">Stay Updated</p>
            <p className="text-dvsl-muted text-xs mb-3">Score alerts, rainout notices, and playoff updates.</p>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-dvsl-bg border border-dvsl-border rounded-lg px-3 py-2 text-sm text-dvsl-text placeholder-dvsl-muted focus:outline-none focus:border-dvsl-lime w-full"
              />
              <button type="submit" className="btn-primary w-full">Subscribe</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
