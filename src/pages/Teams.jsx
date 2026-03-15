import { Link } from 'react-router-dom'
import { getStandings } from '../data/standings'

export default function Teams() {
  const teams = getStandings()

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="tag mb-2">2025 Season</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Teams</h1>
          <p className="text-dvsl-muted text-sm mt-1">{teams.length} congregations competing</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team, i) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="card p-5 hover:border-dvsl-lime/40 transition-all group block"
            >
              {/* Rank + color strip */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-8 rounded-sm" style={{ backgroundColor: team.color }} />
                  <span className="font-mono text-xs text-dvsl-muted">#{i + 1}</span>
                  {i === 0 && <span className="text-dvsl-gold text-sm">★</span>}
                </div>
                <span className="text-xs font-mono text-dvsl-muted group-hover:text-dvsl-lime transition-colors">View →</span>
              </div>

              {/* Team name */}
              <h2 className="font-display font-bold text-xl text-dvsl-text group-hover:text-dvsl-lime transition-colors leading-tight mb-1">
                {team.name}
              </h2>
              <p className="text-dvsl-muted text-xs font-mono mb-4">{team.short}</p>

              {/* Record */}
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-display font-black text-3xl text-dvsl-lime leading-none">{team.wins}</p>
                  <p className="text-dvsl-muted text-xs font-mono mt-0.5">W</p>
                </div>
                <div className="text-dvsl-muted font-mono">-</div>
                <div className="text-center">
                  <p className="font-display font-bold text-3xl text-dvsl-muted leading-none">{team.losses}</p>
                  <p className="text-dvsl-muted text-xs font-mono mt-0.5">L</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-mono text-sm text-dvsl-text">{team.pct.toFixed(3).replace('0.', '.')}</p>
                  <p className="text-dvsl-muted text-xs font-mono">PCT</p>
                </div>
              </div>

              {/* Runs diff bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-mono text-dvsl-muted mb-1">
                  <span>RS: {team.runs}</span>
                  <span>RA: {team.runsAllowed}</span>
                </div>
                <div className="h-1.5 bg-dvsl-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(team.runs / (team.runs + team.runsAllowed)) * 100}%`,
                      backgroundColor: team.color,
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
