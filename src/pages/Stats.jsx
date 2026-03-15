import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STATS, getStatLeaders, fmtAvg } from '../data/stats'
import { TEAMS, getTeamByShort } from '../data/teams'
import LeaderCard from '../components/LeaderCard'

const LEADER_CATS = [
  { key:'avg',     label:'Batting Avg', fmt: fmtAvg },
  { key:'hr',      label:'Home Runs',   fmt: v => v  },
  { key:'rbi',     label:'RBI',         fmt: v => v  },
  { key:'r',       label:'Runs',        fmt: v => v  },
  { key:'sb',     label:'Stolen Bases', fmt: v => v  },
  { key:'h',      label:'Hits',         fmt: v => v  },
  { key:'doubles',label:'Doubles',      fmt: v => v  },
  { key:'obp',    label:'OBP',          fmt: fmtAvg  },
  { key:'slg',    label:'Slugging',     fmt: fmtAvg  },
  { key:'h',       label:'Hits',        fmt: v => v  },
  { key:'obp',     label:'OBP',         fmt: fmtAvg  },
]

const TABLE_COLS = [
  { key:'name',    label:'Player',  align:'left' },
  { key:'team',    label:'Team',    align:'left' },
  { key:'gp',      label:'GP' },
  { key:'ab',      label:'AB' },
  { key:'h',       label:'H'  },
  { key:'doubles', label:'2B' },
  { key:'triples', label:'3B' },
  { key:'hr',      label:'HR' },
  { key:'r',       label:'R'  },
  { key:'rbi',     label:'RBI'},
  { key:'bb',      label:'BB' },
  { key:'so',      label:'SO' },
  { key:'sb',      label:'SB' },
  { key:'avg',     label:'AVG', fmt: fmtAvg, highlight: true },
  { key:'obp',     label:'OBP', fmt: fmtAvg, highlight: true },
  { key:'slg',     label:'SLG', fmt: fmtAvg, highlight: true },
]

export default function Stats() {
  const [sortKey, setSortKey]     = useState('avg')
  const [sortDir, setSortDir]     = useState('desc')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const [activeLeader, setActiveLeader] = useState('avg')
  const leaders = getStatLeaders()

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...STATS]
    .filter(p => teamFilter === 'ALL' || p.team === teamFilter)
    .sort((a, b) => sortDir === 'desc' ? (b[sortKey] ?? 0) - (a[sortKey] ?? 0) : (a[sortKey] ?? 0) - (b[sortKey] ?? 0))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 114 }}>
      {/* Hero */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '32px 48px 28px' }}>
        <div style={{ maxWidth: 1300, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Individual Leaders</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h1 style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 64, textTransform: 'uppercase', color: 'var(--white)', lineHeight: 1, letterSpacing: '.01em' }}>Leaderboard</h1>
            <Link to="/stats" style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(245,200,66,.4)', borderRadius: 20, padding: '7px 18px', fontFamily: "'Barlow Condensed',sans-serif", letterSpacing: '.06em', textTransform: 'uppercase' }}>Full Leaders →</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 48px 60px' }}>
        {/* Leader cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 56 }}>
          {LEADER_CATS.map(({ key, label, fmt }) => (
            <LeaderCard
              key={key}
              catLabel={label}
              statKey={key}
              players={leaders[key] || []}
              fmt={fmt}
              active={activeLeader === key}
            />
          ))}
        </div>

        {/* Full stats table */}
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Full Stats · Click column to sort</div>

        {/* Team filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {['ALL', ...TEAMS.map(t => t.short)].map(s => (
            <button key={s} onClick={() => setTeamFilter(s)} style={{
              fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700, fontSize: 13,
              letterSpacing: '.05em', textTransform: 'uppercase',
              color: teamFilter === s ? 'var(--bg)' : 'var(--muted)',
              background: teamFilter === s ? 'var(--gold)' : 'transparent',
              border: teamFilter === s ? 'none' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, padding: '5px 14px', cursor: 'pointer',
            }}>{s === 'ALL' ? 'All Teams' : s}</button>
          ))}
        </div>

        <div style={{ overflowX: 'auto', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {TABLE_COLS.map(col => (
                  <th key={col.key}
                    onClick={() => col.key !== 'name' && col.key !== 'team' && handleSort(col.key)}
                    style={{
                      padding: '10px 12px',
                      textAlign: col.align === 'left' ? 'left' : 'center',
                      fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
                      color: sortKey === col.key ? 'var(--gold)' : 'var(--muted2)',
                      cursor: col.key !== 'name' && col.key !== 'team' ? 'pointer' : 'default',
                      whiteSpace: 'nowrap', userSelect: 'none',
                    }}>
                    {col.label}{sortKey === col.key ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => {
                const t = getTeamByShort(p.team)
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    {TABLE_COLS.map(col => {
                      if (col.key === 'name') return <td key="name" style={{ padding: '10px 12px', fontWeight: 600, fontSize: 14, color: 'var(--white)', whiteSpace: 'nowrap' }}>{p.name}</td>
                      if (col.key === 'team') return (
                        <td key="team" style={{ padding: '10px 12px' }}>
                          <Link to={`/teams/${t?.id || p.team}`} style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: t?.color || '#6b7280', flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: t?.color || 'var(--muted)', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700 }}>{p.team}</span>
                          </Link>
                        </td>
                      )
                      const val = col.fmt ? col.fmt(p[col.key]) : p[col.key]
                      return (
                        <td key={col.key} style={{
                          padding: '10px 12px', textAlign: 'center', fontSize: 14,
                          fontFamily: "'Barlow Condensed',sans-serif",
                          color: sortKey === col.key ? 'var(--gold)' : col.highlight ? 'var(--blue)' : 'var(--muted)',
                          fontWeight: sortKey === col.key ? 700 : 400,
                        }}>{val}</td>
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
  )
}
