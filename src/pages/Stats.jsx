import { useState } from 'react'
import { PLAYERS, STAT_COLS, getLeaders } from '../data/stats'

const LEADER_STATS = [
  { key: 'avg', label: 'Batting Avg', emoji: '🎯' },
  { key: 'hr',  label: 'Home Runs',   emoji: '💥' },
  { key: 'rbi', label: 'RBI',         emoji: '🏃' },
  { key: 'h',   label: 'Hits',        emoji: '⚾' },
  { key: 'sb',  label: 'Stolen Bases',emoji: '💨' },
  { key: 'obp', label: 'On-Base %',   emoji: '📈' },
]

export default function Stats() {
  const [sortKey, setSortKey]   = useState('avg')
  const [sortDir, setSortDir]   = useState('desc')
  const [teamFilter, setTeamFilter] = useState('All')

  const teams = ['All', ...new Set(PLAYERS.map(p => p.team))]

  const sorted = [...PLAYERS]
    .filter(p => teamFilter === 'All' || p.team === teamFilter)
    .sort((a, b) => {
      const va = parseFloat(a[sortKey]) || a[sortKey] || 0
      const vb = parseFloat(b[sortKey]) || b[sortKey] || 0
      return sortDir === 'desc' ? vb - va : va - vb
    })

  const handleSort = key => {
    if (key === sortKey) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="tag mb-2">2025 Season</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Statistics</h1>
          <p className="text-dvsl-muted text-sm mt-1">{PLAYERS.length} players · Through Week 5</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Leaders */}
        <h2 className="section-title mb-4">Category Leaders</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {LEADER_STATS.map(({ key, label, emoji }) => {
            const top = getLeaders(key)[0]
            return (
              <div key={key} className="card p-4">
                <div className="text-xl mb-1">{emoji}</div>
                <p className="text-xs font-mono text-dvsl-muted uppercase tracking-wide mb-2">{label}</p>
                <p className="font-display font-black text-2xl text-dvsl-lime tabular-nums">{top[key]}</p>
                <p className="text-dvsl-text text-xs font-medium mt-1 truncate">{top.name}</p>
                <p className="text-dvsl-muted text-xs truncate">{top.team}</p>
              </div>
            )
          })}
        </div>

        {/* Full stat table */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="section-title">Full Stats</h2>
          {/* Team filter */}
          <div className="flex flex-wrap gap-2">
            {teams.map(t => (
              <button
                key={t}
                onClick={() => setTeamFilter(t)}
                className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-all ${
                  teamFilter === t
                    ? 'bg-dvsl-lime text-dvsl-bg border-dvsl-lime font-semibold'
                    : 'border-dvsl-border text-dvsl-muted hover:border-dvsl-lime hover:text-dvsl-lime'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-dvsl-border">
                <th className="text-left text-xs font-mono text-dvsl-muted py-3 px-4 font-medium sticky left-0 bg-dvsl-card">PLAYER</th>
                <th className="text-left text-xs font-mono text-dvsl-muted py-3 px-3 font-medium">TEAM</th>
                {STAT_COLS.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    title={col.tip}
                    className={`text-center text-xs font-mono py-3 px-2 font-medium cursor-pointer hover:text-dvsl-lime transition-colors ${
                      sortKey === col.key ? 'text-dvsl-lime' : 'text-dvsl-muted'
                    }`}
                  >
                    {col.label}
                    {sortKey === col.key && <span className="ml-0.5">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr key={p.name} className="border-b border-dvsl-border/40 hover:bg-dvsl-surface/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-dvsl-text sticky left-0 bg-dvsl-card">
                    <span className="text-dvsl-muted font-mono text-xs mr-2">{i+1}</span>
                    {p.name}
                  </td>
                  <td className="py-3 px-3 text-dvsl-muted text-xs font-mono whitespace-nowrap">{p.team}</td>
                  {STAT_COLS.map(col => (
                    <td
                      key={col.key}
                      className={`py-3 px-2 text-center font-mono tabular-nums text-xs ${
                        sortKey === col.key ? 'text-dvsl-lime font-semibold' : 'text-dvsl-muted'
                      }`}
                    >
                      {p[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-dvsl-muted font-mono">
          Click column headers to sort · AVG/OBP/SLG computed from raw stats
        </p>
      </div>
    </div>
  )
}
