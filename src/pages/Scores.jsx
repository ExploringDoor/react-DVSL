import { useState } from 'react'
import { GAMES, getCompletedGames } from '../data/games'
import { TEAMS } from '../data/teams'
import GameCard from '../components/GameCard'

const ALL = 'All Teams'

export default function Scores() {
  const [teamFilter, setTeamFilter] = useState(ALL)
  const completed = getCompletedGames()

  const filtered = teamFilter === ALL
    ? completed
    : completed.filter(g => g.home === teamFilter || g.away === teamFilter)

  // Group by week desc
  const byWeek = filtered.reduce((acc, g) => {
    const k = `Week ${g.week}`
    if (!acc[k]) acc[k] = []
    acc[k].push(g)
    return acc
  }, {})
  const weeks = Object.keys(byWeek).sort((a, b) => {
    return parseInt(b.split(' ')[1]) - parseInt(a.split(' ')[1])
  })

  function fmtDate(d) {
    return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">2025 Season</p>
          <h1 className="font-display text-5xl text-dvsl-text">Scores</h1>
          <p className="text-dvsl-muted text-sm mt-1">{completed.length} games completed</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Team filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[ALL, ...TEAMS.map(t => t.name)].map(name => (
            <button
              key={name}
              onClick={() => setTeamFilter(name)}
              className={teamFilter === name ? 'pill-active' : 'pill-inactive'}
            >
              {name === ALL ? name : TEAMS.find(t => t.name === name)?.shortName || name}
            </button>
          ))}
        </div>

        {weeks.length === 0 ? (
          <div className="text-center text-dvsl-muted py-16">No scores found.</div>
        ) : (
          <div className="space-y-10">
            {weeks.map(week => {
              const games = byWeek[week]
              const sampleDate = games[0]?.date
              return (
                <div key={week}>
                  <div className="flex items-center gap-4 mb-4">
                    <h2 className="font-display text-2xl text-dvsl-text">{week}</h2>
                    <span className="text-dvsl-muted text-xs font-mono">{fmtDate(sampleDate)}</span>
                    <div className="flex-1 border-t border-dvsl-border" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {games.map(g => <GameCard key={g.id} game={g} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
