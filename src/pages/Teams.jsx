import { Link } from 'react-router-dom'
import { TEAMS } from '../data/teams'
import { STANDINGS } from '../data/standings'
import { getGamesByTeam } from '../data/games'

function getRecord(teamName) {
  const row = STANDINGS.find(r => r.team === teamName)
  return row ? { w: row.w, l: row.l, pct: row.pct } : { w: 0, l: 0, pct: 0 }
}

export default function Teams() {
  const sorted = [...TEAMS].sort((a, b) => {
    const ra = getRecord(a.name)
    const rb = getRecord(b.name)
    return rb.pct - ra.pct
  })

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">2025 Season</p>
          <h1 className="font-display text-5xl text-dvsl-text">Teams</h1>
          <p className="text-dvsl-muted text-sm mt-1">{TEAMS.length} teams competing</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {sorted.map((team, i) => {
            const rec = getRecord(team.name)
            const games = getGamesByTeam(team.name)
            const played = games.filter(g => g.status === 'final').length
            const upcoming = games.filter(g => g.status === 'upcoming')
            const nextG = upcoming[0]

            return (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="card p-5 hover:border-dvsl-lime/30 transition-all duration-200 group block"
                style={{ borderLeftColor: team.color, borderLeftWidth: 3 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="section-label text-[10px]">#{i+1}</span>
                    </div>
                    <h2 className="font-display text-2xl text-dvsl-text group-hover:text-dvsl-lime transition-colors leading-tight">
                      {team.name}
                    </h2>
                    <p className="text-dvsl-muted text-xs mt-0.5">{team.sponsor}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-display text-3xl" style={{ color: team.color }}>{rec.w}-{rec.l}</p>
                    <p className="text-dvsl-muted text-xs font-mono">
                      {rec.pct === 1 ? '1.000' : rec.pct.toFixed(3).replace('0.','.')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-dvsl-muted border-t border-dvsl-border pt-3 mt-3">
                  <span>{played} GP</span>
                  <span className="w-px h-3 bg-dvsl-border" />
                  <span>Mgr: {team.manager}</span>
                  <span className="w-px h-3 bg-dvsl-border" />
                  <span>{team.field}</span>
                </div>

                {nextG && (
                  <p className="text-dvsl-muted text-xs mt-2">
                    Next: <span className="text-dvsl-text">{nextG.home === team.name ? `vs ${nextG.away}` : `@ ${nextG.home}`}</span>
                    <span className="ml-1">· {new Date(nextG.date+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
