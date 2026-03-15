import { useState } from 'react'
import { Link } from 'react-router-dom'
import StandingsTable from '../components/StandingsTable'
import { LEAGUE_HISTORY } from '../data/standings'

export default function Standings() {
  const [tab, setTab] = useState('current') // 'current' | 'history'

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="tag mb-2">2025 Season</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Standings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-dvsl-surface border border-dvsl-border rounded-lg p-1 w-fit mb-8">
          {[['current','2025 Season'],['history','League History']].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`text-sm px-4 py-1.5 rounded-md transition-all ${
                tab === v ? 'bg-dvsl-lime text-dvsl-bg font-semibold' : 'text-dvsl-muted hover:text-dvsl-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'current' && (
          <div className="card p-6">
            <StandingsTable />
            <p className="mt-4 text-xs text-dvsl-muted font-mono">
              GB = Games Behind · RS = Runs Scored · RA = Runs Allowed · Playoffs: Top 4 advance
            </p>
          </div>
        )}

        {tab === 'history' && (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dvsl-border">
                  {['Year','Champion','Runner-Up','MVP'].map(h => (
                    <th key={h} className="text-left text-xs font-mono text-dvsl-muted py-3 px-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEAGUE_HISTORY.map(row => (
                  <tr key={row.year} className="border-b border-dvsl-border/40 hover:bg-dvsl-surface/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-dvsl-text">{row.year}</td>
                    <td className="py-3 px-4">
                      {row.champion
                        ? <span className="flex items-center gap-1.5">
                            <span className="text-dvsl-gold">★</span>
                            <span className="text-dvsl-text font-medium">{row.champion}</span>
                          </span>
                        : <span className="text-dvsl-muted italic">{row.note}</span>
                      }
                    </td>
                    <td className="py-3 px-4 text-dvsl-muted">{row.runnerUp ?? '—'}</td>
                    <td className="py-3 px-4 text-dvsl-muted">{row.mvp ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
