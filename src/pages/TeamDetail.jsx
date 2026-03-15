import { useParams, Link } from 'react-router-dom'
import { getTeamById, TEAMS } from '../data/teams'
import { getGamesByTeam } from '../data/games'
import { getStatsByTeam, fmtAvg } from '../data/stats'
import { STANDINGS } from '../data/standings'
import GameCard from '../components/GameCard'

function fmtDate(d) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function TeamDetail() {
  const { teamId } = useParams()
  const team = getTeamById(teamId)

  if (!team) {
    return (
      <div className="min-h-screen bg-dvsl-bg pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-4xl text-dvsl-text mb-2">Team Not Found</p>
          <Link to="/teams" className="text-dvsl-lime text-sm">← Back to Teams</Link>
        </div>
      </div>
    )
  }

  const allGames = getGamesByTeam(team.name)
  const completed = allGames.filter(g => g.status === 'final').sort((a,b)=>new Date(b.date)-new Date(a.date))
  const upcoming  = allGames.filter(g => g.status === 'upcoming').sort((a,b)=>new Date(a.date)-new Date(b.date))
  const stats     = getStatsByTeam(team.name).sort((a,b)=>b.avg-a.avg)
  const standing  = STANDINGS.find(r => r.team === team.name)

  const rank = STANDINGS.findIndex(r => r.team === team.name) + 1

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      {/* Hero bar */}
      <div className="border-b border-dvsl-border" style={{ background: `linear-gradient(135deg, ${team.colorDark}40 0%, #13161e 60%)` }}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link to="/teams" className="text-dvsl-muted text-xs hover:text-dvsl-lime transition-colors mb-4 block">← All Teams</Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-4 h-4 rounded-full" style={{ background: team.color }} />
                <p className="section-label">#{rank} in League</p>
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-dvsl-text leading-none">{team.name}</h1>
              <p className="text-dvsl-muted text-sm mt-2">{team.sponsor} · Mgr: {team.manager}</p>
              <p className="text-dvsl-muted text-xs mt-1">Home Field: {team.field}</p>
            </div>
            {standing && (
              <div className="card px-6 py-4 text-center min-w-[120px]">
                <p className="font-display text-5xl" style={{ color: team.color }}>{standing.w}-{standing.l}</p>
                <p className="text-dvsl-muted text-xs font-mono mt-1">
                  {standing.pct === 1 ? '1.000' : standing.pct.toFixed(3).replace('0.','.')} PCT
                </p>
                <p className="text-dvsl-muted text-xs mt-1">{standing.pf} RF · {standing.pa} RA</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Left: roster + stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Player stats */}
          <section>
            <p className="section-label mb-4">Roster & Stats</p>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full stat-table text-sm">
                  <thead>
                    <tr className="border-b border-dvsl-border">
                      {['Player','GP','AB','H','2B','3B','HR','R','RBI','SB','SO','AVG','OBP'].map(h => (
                        <th key={h} className={`px-3 py-2.5 text-xs font-mono text-dvsl-muted uppercase tracking-wider ${h==='Player'?'text-left':'text-center'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map(p => (
                      <tr key={p.id} className="border-b border-dvsl-border/40 hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-2.5 text-dvsl-text font-medium whitespace-nowrap">{p.name}</td>
                        {[p.gp,p.ab,p.h,p.doubles,p.triples,p.hr,p.r,p.rbi,p.sb,p.so].map((v,i) => (
                          <td key={i} className="px-3 py-2.5 font-mono text-dvsl-muted text-center">{v}</td>
                        ))}
                        <td className="px-3 py-2.5 font-mono text-dvsl-lime text-center">{fmtAvg(p.avg)}</td>
                        <td className="px-3 py-2.5 font-mono text-dvsl-blue text-center">{fmtAvg(p.obp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent results */}
          {completed.length > 0 && (
            <section>
              <p className="section-label mb-4">Recent Results</p>
              <div className="space-y-3">
                {completed.slice(0,4).map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </section>
          )}
        </div>

        {/* Right: upcoming */}
        <div className="space-y-6">
          <section className="card p-4">
            <p className="section-label mb-3">Upcoming Games</p>
            {upcoming.length === 0 ? (
              <p className="text-dvsl-muted text-sm">No upcoming games scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map(g => {
                  const opp = g.home === team.name ? g.away : g.home
                  const isHome = g.home === team.name
                  const oppTeam = TEAMS.find(t => t.name === opp)
                  return (
                    <div key={g.id} className="border-b border-dvsl-border pb-3 last:border-0 last:pb-0">
                      <p className="text-dvsl-text text-sm font-medium">
                        {isHome ? 'vs' : '@'} <span style={{ color: oppTeam?.color }}>{opp}</span>
                      </p>
                      <p className="text-dvsl-muted text-xs mt-0.5">{fmtDate(g.date)} · {g.time}</p>
                      <p className="text-dvsl-muted text-xs">{g.field}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          {/* Season summary */}
          {standing && (
            <section className="card p-4">
              <p className="section-label mb-3">Season Stats</p>
              <div className="space-y-2">
                {[
                  ['Record', `${standing.w}-${standing.l}`],
                  ['Run Diff', standing.diff],
                  ['Runs For', standing.pf],
                  ['Runs Against', standing.pa],
                  ['Points', standing.pts],
                  ['Streak', standing.streak],
                ].map(([k,v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-dvsl-muted">{k}</span>
                    <span className="text-dvsl-text font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
