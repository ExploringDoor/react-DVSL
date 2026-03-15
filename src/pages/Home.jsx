import { Link } from 'react-router-dom'
import Countdown from '../components/Countdown'
import StandingsTable from '../components/StandingsTable'
import GameCard from '../components/GameCard'
import { getNextGame, getRecentGames } from '../data/games'
import { getLeaders } from '../data/stats'

export default function Home() {
  const next    = getNextGame()
  const recent  = getRecentGames(3)
  const leaders = getLeaders('avg').slice(0, 3)

  return (
    <div className="min-h-screen bg-dvsl-bg">
      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(181,232,83,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(181,232,83,0.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-dvsl-lime/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="max-w-3xl">
            <p className="tag mb-4">⬡ Delaware Valley Synagogue League · Est. 1976</p>
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl leading-none text-dvsl-text mb-6">
              DVSL<br /><em className="text-dvsl-lime not-italic">Softball</em><br />2025
            </h1>
            <p className="text-dvsl-muted text-lg leading-relaxed max-w-xl mb-8">
              Men's slow-pitch softball across Bucks, Montgomery &amp; Philadelphia Counties.
              Eight congregations. Real grass. No mercy rule.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/standings" className="btn-primary">View Standings</Link>
              <Link to="/schedule" className="btn-outline">Full Schedule</Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEXT GAME BANNER */}
      {next && (
        <section className="bg-dvsl-surface border-y border-dvsl-border py-6">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="tag mb-1">Next Game</p>
              <p className="text-dvsl-text font-semibold">
                {next.homeTeam} <span className="text-dvsl-muted mx-2">vs</span> {next.awayTeam}
              </p>
              <p className="text-dvsl-muted text-sm mt-0.5 font-mono">
                {new Date(next.date + 'T12:00:00').toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric' })}
                &nbsp;· {next.time} · {next.field}
              </p>
            </div>
            <Countdown targetDate={next.date} targetTime={next.time} />
          </div>
        </section>
      )}

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Standings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Standings</h2>
            <Link to="/standings" className="text-xs text-dvsl-lime font-mono hover:underline">Full table →</Link>
          </div>
          <div className="card p-4">
            <StandingsTable compact />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent scores */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-xl">Recent Scores</h2>
              <Link to="/scores" className="text-xs text-dvsl-lime font-mono hover:underline">All →</Link>
            </div>
            <div className="space-y-2">
              {recent.map(g => <GameCard key={g.id} game={g} compact />)}
            </div>
          </div>

          {/* Batting leaders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title text-xl">AVG Leaders</h2>
              <Link to="/stats" className="text-xs text-dvsl-lime font-mono hover:underline">Full stats →</Link>
            </div>
            <div className="card overflow-hidden">
              {leaders.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 px-4 py-3 border-b border-dvsl-border/50 last:border-0">
                  <span className="font-mono text-xs text-dvsl-muted w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-dvsl-text text-sm font-medium truncate">{p.name}</p>
                    <p className="text-dvsl-muted text-xs truncate">{p.team}</p>
                  </div>
                  <span className="font-display font-bold text-lg text-dvsl-lime tabular-nums">{p.avg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALERTS SIGNUP */}
      <section id="alerts" className="bg-dvsl-surface border-t border-dvsl-border py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <p className="tag mb-3">Stay in the loop</p>
          <h2 className="font-display font-bold text-3xl text-dvsl-text mb-3">Get Game Alerts</h2>
          <p className="text-dvsl-muted text-sm mb-6">
            Score updates, rainout notices, and playoff info straight to your inbox.
          </p>
          <form onSubmit={e => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-dvsl-bg border border-dvsl-border rounded-lg px-3 py-2.5 text-sm text-dvsl-text placeholder-dvsl-muted focus:outline-none focus:border-dvsl-lime transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
          </form>
          <div className="flex justify-center gap-6 mt-4">
            {['Score alerts', 'Rainout notices', 'Playoff updates'].map(t => (
              <span key={t} className="text-dvsl-muted text-xs flex items-center gap-1">
                <span className="text-dvsl-lime">✓</span> {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
