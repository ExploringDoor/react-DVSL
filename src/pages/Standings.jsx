import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STANDINGS, LEAGUE_HISTORY } from '../data/standings'
import { TEAMS } from '../data/teams'

export default function Standings() {
  const [tab, setTab] = useState('current') // 'current' | 'history'

  function teamColor(name) {
    return TEAMS.find(t => t.name === name)?.color || '#6b7280'
  }
  function teamId(name) {
    return TEAMS.find(t => t.name === name)?.id || name
  }

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">2025 Season</p>
          <h1 className="font-display text-5xl text-dvsl-text">Standings</h1>
          <p className="text-dvsl-muted text-sm mt-1">Through Week 6 · {STANDINGS.reduce((a,r)=>a+r.gp,0)/2} games played</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setTab('current')} className={tab==='current' ? 'pill-active' : 'pill-inactive'}>2025 Standings</button>
          <button onClick={() => setTab('history')} className={tab==='history' ? 'pill-active' : 'pill-inactive'}>League History</button>
        </div>

        {tab === 'current' ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full stat-table">
                <thead>
                  <tr className="border-b border-dvsl-border">
                    {['#','Team','GP','W','L','PCT','GB','PF','PA','DIFF','STK','PTS'].map(h => (
                      <th key={h} className="px-3 py-3 text-left text-xs font-mono text-dvsl-muted uppercase tracking-wider first:pl-4 last:pr-4">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STANDINGS.map((row, i) => {
                    const color = teamColor(row.team)
                    const id = teamId(row.team)
                    const strk = row.streak || ''
                    const strkColor = strk.startsWith('W') ? '#4ade80' : '#f87171'
                    return (
                      <tr key={row.team} className="border-b border-dvsl-border/50 hover:bg-white/[0.02] transition-colors">
                        <td className="px-3 py-3 pl-4 text-dvsl-muted text-sm font-mono">{i+1}</td>
                        <td className="px-3 py-3 min-w-[140px]">
                          <Link to={`/teams/${id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                            <span className="text-dvsl-text text-sm font-medium">{row.team}</span>
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-dvsl-muted text-sm font-mono text-center">{row.gp}</td>
                        <td className="px-3 py-3 text-dvsl-text text-sm font-bold text-center">{row.w}</td>
                        <td className="px-3 py-3 text-dvsl-muted text-sm font-mono text-center">{row.l}</td>
                        <td className="px-3 py-3 text-dvsl-lime text-sm font-mono text-center">
                          {row.pct === 1 ? '1.000' : row.pct.toFixed(3).replace('0.',  '.')}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-sm font-mono ${row.gb === '—' ? 'text-dvsl-muted' : 'text-dvsl-blue'}`}>
                            {row.gb === '—' ? '—' : `-${row.gb}`}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-dvsl-muted text-sm font-mono text-center">{row.pf}</td>
                        <td className="px-3 py-3 text-dvsl-muted text-sm font-mono text-center">{row.pa}</td>
                        <td className="px-3 py-3 text-center">
                          <span className={`text-sm font-mono font-bold ${String(row.diff).startsWith('+') ? 'text-dvsl-green' : 'text-dvsl-red'}`}>
                            {row.diff}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="text-sm font-mono" style={{ color: strkColor }}>{strk}</span>
                        </td>
                        <td className="px-3 py-3 pr-4 text-dvsl-text text-sm font-bold text-center">{row.pts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-dvsl-border flex flex-wrap gap-4 text-xs text-dvsl-muted font-mono">
              <span>GP=Games Played</span><span>PCT=Win%</span><span>GB=Games Behind</span>
              <span>PF=Runs Scored</span><span>PA=Runs Allowed</span><span>STK=Streak</span>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dvsl-border">
                    {['Year','Champion','Runner-Up','Notes'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-mono text-dvsl-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LEAGUE_HISTORY.map(row => (
                    <tr key={row.year} className="border-b border-dvsl-border/50 hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-dvsl-lime text-sm">{row.year}</td>
                      <td className="px-4 py-3">
                        {row.champion ? (
                          <div className="flex items-center gap-2">
                            <span className="text-dvsl-gold">🏆</span>
                            <span className="text-dvsl-text text-sm font-medium">{row.champion}</span>
                          </div>
                        ) : <span className="text-dvsl-muted text-sm">—</span>}
                      </td>
                      <td className="px-4 py-3 text-dvsl-muted text-sm">{row.runnerUp || '—'}</td>
                      <td className="px-4 py-3 text-dvsl-muted text-sm italic">{row.note || ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
