import { useParams, Link, useNavigate } from 'react-router-dom'
import GameCard from '../components/GameCard'
import { getTeamById } from '../data/teams'
import { getGamesByTeam } from '../data/games'
import { PLAYERS, STAT_COLS } from '../data/stats'

export default function TeamDetail() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const team = getTeamById(teamId)

  if (!team) return (
    <div className="min-h-screen bg-dvsl-bg pt-32 text-center">
      <p className="text-dvsl-muted">Team not found.</p>
      <Link to="/teams" className="text-dvsl-lime text-sm mt-4 inline-block">← Back to Teams</Link>
    </div>
  )

  const allGames = getGamesByTeam(team.name)
  const completed = allGames.filter(g => g.status === 'final')
  const upcoming  = allGames.filter(g => g.status === 'upcoming')
  const players   = PLAYERS.filter(p => p.team === team.name)

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border" style={{ background: `linear-gradient(135deg, ${team.color}18 0%, #111418 60%)` }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <button onClick={() => navigate(-1)} className="text-dvsl-muted text-xs font-mono hover:text-dvsl-lime transition-colors mb-4 flex items-center gap-1">
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-4 h-12 rounded" style={{ backgroundColor: team.color }} />
            <div>
              <p className="text-xs font-mono text-dvsl-muted mb-1">{team.short}</p>
              <h1 className="font-display font-black text-4xl text-dvsl-text">{team.name}</h1>
            </div>
          </div>

          {/* Record stats */}
          <div className="flex gap-6 mt-6">
            {[
              { val: team.wins,   label: 'Wins'   },
              { val: team.losses, label: 'Losses' },
              { val: team.pct.toFixed(3).replace('0.','.'), label: 'PCT' },
              { val: team.runs,   label: 'Runs Scored' },
              { val: team.runsAllowed, label: 'Runs Allowed' },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display font-black text-2xl text-dvsl-lime">{s.val}</p>
                <p className="text-dvsl-muted text-xs font-mono">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roster + stats */}
        <div className="lg:col-span-2">
          <h2 className="section-title mb-4">Roster / Stats</h2>
          {players.length === 0 ? (
            <p className="text-dvsl-muted text-sm">No stats available yet.</p>
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-dvsl-border">
                    <th className="text-left text-xs font-mono text-dvsl-muted py-3 px-4 font-medium">PLAYER</th>
                    {['avg','obp','h','hr','rbi','r','d2','d3','bb','so','sb'].map(k => {
                      const col = STAT_COLS.find(c => c.key === k)
                      return (
                        <th key={k} title={col?.tip} className="text-center text-xs font-mono text-dvsl-muted py-3 px-2 font-medium">
                          {col?.label}
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {[...players].sort((a,b) => parseFloat(b.avg) - parseFloat(a.avg)).map(p => (
                    <tr key={p.name} className="border-b border-dvsl-border/40 hover:bg-dvsl-surface/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-dvsl-text">{p.name}</td>
                      {['avg','obp','h','hr','rbi','r','d2','d3','bb','so','sb'].map(k => (
                        <td key={k} className="py-3 px-2 text-center font-mono text-xs text-dvsl-muted tabular-nums">{p[k] ?? '—'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sidebar: schedule */}
        <div className="space-y-6">
          {upcoming.length > 0 && (
            <div>
              <h2 className="section-title text-xl mb-3">Upcoming</h2>
              <div className="space-y-2">
                {upcoming.map(g => <GameCard key={g.id} game={g} compact />)}
              </div>
            </div>
          )}
          <div>
            <h2 className="section-title text-xl mb-3">Results</h2>
            <div className="space-y-2">
              {completed.length === 0
                ? <p className="text-dvsl-muted text-sm">No results yet.</p>
                : [...completed].reverse().map(g => <GameCard key={g.id} game={g} compact />)
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
