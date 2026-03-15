import { useState } from 'react'
import GameCard from '../components/GameCard'
import { getCompletedGames } from '../data/games'
import { TEAMS } from '../data/teams'

export default function Scores() {
  const [teamFilter, setTeamFilter] = useState('All')
  const completed = getCompletedGames()

  const filtered = teamFilter === 'All'
    ? completed
    : completed.filter(g => g.homeTeam === teamFilter || g.awayTeam === teamFilter)

  // Group by week
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
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Scores</h1>
          <p className="text-dvsl-muted text-sm mt-1">{completed.length} games completed</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
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

        {/* Games by week */}
        {Object.keys(byWeek).length === 0 ? (
          <p className="text-dvsl-muted text-sm">No completed games for this team yet.</p>
        ) : (
          Object.entries(byWeek).reverse().map(([week, games]) => (
            <div key={week} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display font-bold text-xl text-dvsl-text">{week}</h2>
                <div className="flex-1 h-px bg-dvsl-border" />
                <span className="text-xs font-mono text-dvsl-muted">
                  {new Date(games[0].date + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
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
