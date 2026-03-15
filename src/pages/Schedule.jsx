import { useState } from 'react'
import GameCard from '../components/GameCard'
import Countdown from '../components/Countdown'
import { getUpcomingGames, getNextGame, GAMES } from '../data/games'
import { TEAMS } from '../data/teams'

export default function Schedule() {
  const [view, setView]       = useState('upcoming') // 'upcoming' | 'full'
  const [teamFilter, setTeamFilter] = useState('All')
  const next = getNextGame()

  const source = view === 'upcoming' ? getUpcomingGames() : GAMES
  const filtered = teamFilter === 'All'
    ? source
    : source.filter(g => g.homeTeam === teamFilter || g.awayTeam === teamFilter)

  const byWeek = filtered.reduce((acc, g) => {
    const key = `Week ${g.week}`
    if (!acc[key]) acc[key] = []
    acc[key].push(g)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="tag mb-2">2025 Season</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Schedule</h1>
          {next && (
            <div className="mt-4 flex items-center gap-4">
              <div>
                <p className="text-dvsl-muted text-xs font-mono uppercase tracking-wider">Next game</p>
                <p className="text-dvsl-text text-sm font-medium mt-0.5">
                  {next.homeTeam} vs {next.awayTeam} ·{' '}
                  {new Date(next.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {next.time}
                </p>
              </div>
              <div className="hidden sm:block pl-4 border-l border-dvsl-border">
                <Countdown targetDate={next.date} targetTime={next.time} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* View toggle */}
        <div className="flex items-center gap-1 bg-dvsl-surface border border-dvsl-border rounded-lg p-1 w-fit mb-6">
          {[['upcoming','Upcoming'],['full','Full Season']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-sm px-4 py-1.5 rounded-md transition-all ${
                view === v ? 'bg-dvsl-lime text-dvsl-bg font-semibold' : 'text-dvsl-muted hover:text-dvsl-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Team filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', ...TEAMS.map(t => t.name)].map(t => (
            <button
              key={t}
              onClick={() => setTeamFilter(t)}
              className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                teamFilter === t
                  ? 'bg-dvsl-lime text-dvsl-bg border-dvsl-lime font-semibold'
                  : 'border-dvsl-border text-dvsl-muted hover:border-dvsl-lime hover:text-dvsl-lime'
              }`}
            >
              {t === 'All' ? 'All Teams' : t}
            </button>
          ))}
        </div>

        {/* Games */}
        {Object.keys(byWeek).length === 0 ? (
          <p className="text-dvsl-muted text-sm">No games to show.</p>
        ) : (
          Object.entries(byWeek).map(([week, games]) => (
            <div key={week} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display font-bold text-xl text-dvsl-text">{week}</h2>
                <div className="flex-1 h-px bg-dvsl-border" />
                <span className="text-xs font-mono text-dvsl-muted">
                  {new Date(games[0].date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {games.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
