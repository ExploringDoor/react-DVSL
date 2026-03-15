import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STATS, getStatLeaders, fmtAvg } from '../data/stats'
import { TEAMS } from '../data/teams'

const COLS = [
  { key: 'name',    label: 'Player',   fmt: v => v,       align: 'left' },
  { key: 'team',    label: 'Team',     fmt: v => v,       align: 'left' },
  { key: 'gp',     label: 'GP',       fmt: v => v,       align: 'center' },
  { key: 'ab',     label: 'AB',       fmt: v => v,       align: 'center' },
  { key: 'h',      label: 'H',        fmt: v => v,       align: 'center' },
  { key: 'doubles',label: '2B',       fmt: v => v,       align: 'center' },
  { key: 'triples',label: '3B',       fmt: v => v,       align: 'center' },
  { key: 'hr',     label: 'HR',       fmt: v => v,       align: 'center' },
  { key: 'r',      label: 'R',        fmt: v => v,       align: 'center' },
  { key: 'rbi',    label: 'RBI',      fmt: v => v,       align: 'center' },
  { key: 'bb',     label: 'BB',       fmt: v => v,       align: 'center' },
  { key: 'so',     label: 'SO',       fmt: v => v,       align: 'center' },
  { key: 'sb',     label: 'SB',       fmt: v => v,       align: 'center' },
  { key: 'avg',    label: 'AVG',      fmt: fmtAvg,       align: 'center' },
  { key: 'obp',    label: 'OBP',      fmt: fmtAvg,       align: 'center' },
  { key: 'slg',    label: 'SLG',      fmt: fmtAvg,       align: 'center' },
]

const LEADER_CATS = [
  { key: 'avg', label: 'Batting Average', fmt: fmtAvg },
  { key: 'hr',  label: 'Home Runs',       fmt: v => v },
  { key: 'rbi', label: 'RBI',             fmt: v => v },
  { key: 'h',   label: 'Hits',            fmt: v => v },
  { key: 'sb',  label: 'Stolen Bases',    fmt: v => v },
  { key: 'obp', label: 'On-Base Pct',     fmt: fmtAvg },
]

function teamColor(name) {
  return TEAMS.find(t => t.name === name)?.color || '#6b7280'
}
function teamId(name) {
  return TEAMS.find(t => t.name === name)?.id || name
}

export default function Stats() {
  const [sortKey, setSortKey] = useState('avg')
  const [sortDir, setSortDir] = useState('desc')
  const [teamFilter, setTeamFilter] = useState('All')
  const leaders = getStatLeaders()

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...STATS]
    .filter(p => teamFilter === 'All' || p.team === teamFilter)
    .sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      return sortDir === 'desc' ? bv - av : av - bv
    })

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="section-label mb-2">2025 Season</p>
          <h1 className="font-display text-5xl text-dvsl-text">Stats</h1>
          <p className="text-dvsl-muted text-sm mt-1">{STATS.length} players · Through Week 6</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Leader cards */}
        <p className="section-label mb-4">Leaders</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-12">
          {LEADER_CATS.map(({ key, label, fmt }) => {
            const p = leaders[key]?.[0]
            if (!p) return null
            const color = teamColor(p.team)
            return (
              <div key={key} className="card p-4 hover:border-dvsl-lime/30 transition-colors">
                <p className="text-dvsl-muted text-xs font-mono uppercase tracking-wider mb-2">{label}</p>
                <p className="font-display text-3xl text-dvsl-lime mb-1">{fmt(p[key])}</p>
                <p className="text-dvsl-text text-sm font-semibold leading-tight">{p.name}</p>
                <Link to={`/teams/${teamId(p.team)}`}>
                  <p className="text-xs mt-0.5 hover:opacity-80" style={{ color }}>{p.team}</p>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Full table */}
        <div className="flex items-center justify-between mb-4">
          <p className="section-label">Full Stats</p>
          <div className="flex flex-wrap gap-2">
            {['All', ...TEAMS.map(t => t.name)].map(name => (
              <button
                key={name}
                onClick={() => setTeamFilter(name)}
                className={teamFilter === name ? 'pill-active' : 'pill-inactive'}
              >
                {name === 'All' ? 'All Teams' : TEAMS.find(t => t.name === name)?.shortName || name}
              </button>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full stat-table text-sm">
              <thead>
                <tr className="border-b border-dvsl-border">
                  {COLS.map(col => (
                    <th
                      key={col.key}
                      onClick={() => col.key !== 'name' && col.key !== 'team' && handleSort(col.key)}
                      className={`px-3 py-3 text-xs font-mono text-dvsl-muted uppercase tracking-wider whitespace-nowrap select-none
                        ${col.align === 'center' ? 'text-center' : 'text-left'}
                        ${col.key !== 'name' && col.key !== 'team' ? 'cursor-pointer hover:text-dvsl-lime transition-colors' : ''}
                        ${sortKey === col.key ? 'text-dvsl-lime' : ''}
                      `}
                    >
                      {col.label}
                      {sortKey === col.key && <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => {
                  const color = teamColor(p.team)
                  return (
                    <tr key={p.id} className="border-b border-dvsl-border/40 hover:bg-white/[0.02] transition-colors">
                      {COLS.map(col => {
                        if (col.key === 'name') return (
                          <td key="name" className="px-3 py-2.5 font-medium text-dvsl-text whitespace-nowrap">{p.name}</td>
                        )
                        if (col.key === 'team') return (
                          <td key="team" className="px-3 py-2.5 whitespace-nowrap">
                            <Link to={`/teams/${teamId(p.team)}`} className="flex items-center gap-1.5 hover:opacity-80">
                              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                              <span className="text-dvsl-muted text-xs">{TEAMS.find(t=>t.name===p.team)?.shortName || p.team}</span>
                            </Link>
                          </td>
                        )
                        const val = col.fmt(p[col.key])
                        const isSort = sortKey === col.key
                        const isRate = ['avg','obp','slg'].includes(col.key)
                        return (
                          <td key={col.key} className={`px-3 py-2.5 font-mono text-center ${isSort ? 'text-dvsl-lime font-bold' : isRate ? 'text-dvsl-blue' : 'text-dvsl-muted'}`}>
                            {val}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
