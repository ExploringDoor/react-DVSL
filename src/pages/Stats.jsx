import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STATS, getStatLeaders, fmtAvg } from '../data/stats'
import { TEAMS, getTeamByShort } from '../data/teams'
import { PlayerStatsModal } from '../components/GameModals'

const LEADER_CATS = [
  { key:'avg',     label:'Batting Avg', fmt: fmtAvg },
  { key:'hr',      label:'Home Runs',   fmt: v => v  },
  { key:'rbi',     label:'RBI',         fmt: v => v  },
  { key:'r',       label:'Runs',        fmt: v => v  },
  { key:'h',       label:'Hits',        fmt: v => v  },
  { key:'obp',     label:'OBP',         fmt: fmtAvg  },
  { key:'sb',      label:'Stolen Bases',fmt: v => v  },
  { key:'doubles', label:'Doubles',     fmt: v => v  },
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
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [sortKey, setSortKey]     = useState('avg')
  const [sortDir, setSortDir]     = useState('desc')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const leaders = getStatLeaders()

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d==='desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...STATS]
    .filter(p => teamFilter==='ALL' || p.team===teamFilter)
    .sort((a,b) => sortDir==='desc' ? (b[sortKey]??0)-(a[sortKey]??0) : (a[sortKey]??0)-(b[sortKey]??0))

  return (
    <>
      {selectedPlayer && <PlayerStatsModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}

      <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:0 }}>
        {/* Hero with mini stat boxes */}
        <div style={{ background:'var(--dark)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1300, margin:'0 auto', padding:'24px clamp(16px,4vw,48px) 0' }}>
            {/* Mini stat boxes */}
            <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:20, scrollbarWidth:'none' }}>
              {LEADER_CATS.map(({key,label,fmt}) => {
                const p = leaders[key]?.[0]
                if (!p) return null
                const t = getTeamByShort(p.team)
                return (
                  <div key={key} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 16px', flexShrink:0, minWidth:120 }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:3 }}>{label}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:'var(--gold)', lineHeight:1 }}>{fmt(p[key])}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--white)', marginTop:3, lineHeight:1.2 }}>{p.name.split(' ')[1] || p.name}</div>
                    <div style={{ fontSize:11, color:t?.color||'var(--muted)', marginTop:1 }}>{p.team}</div>
                  </div>
                )
              })}
            </div>

            {/* Heading */}
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>Individual Leaders</div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', paddingBottom:20 }}>
              <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:64, textTransform:'uppercase', color:'var(--white)', lineHeight:1, letterSpacing:'.01em' }}>Leaderboard</h1>
              <span style={{ fontSize:13, color:'var(--muted2)', marginBottom:8 }}>Click any player name to view full stats</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1300, margin:'0 auto', padding:'32px clamp(16px,4vw,48px) 60px' }}>
          {/* Full table header */}
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:8 }}>Full Stats · Click column to sort · Click player name for details</div>

          {/* Team filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16 }}>
            {['ALL', ...TEAMS.map(t=>t.short)].map(s => (
              <button key={s} onClick={()=>setTeamFilter(s)} style={{
                fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13,
                letterSpacing:'.05em', textTransform:'uppercase',
                color: teamFilter===s ? 'var(--bg)' : 'var(--muted)',
                background: teamFilter===s ? 'var(--gold)' : 'transparent',
                border: teamFilter===s ? 'none' : '1px solid rgba(255,255,255,0.12)',
                borderRadius:6, padding:'5px 14px', cursor:'pointer',
              }}>{s==='ALL' ? 'All Teams' : s}</button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto', background:'var(--card)', border:'1px solid var(--border)', borderRadius:10 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:900 }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {TABLE_COLS.map(col => (
                    <th key={col.key}
                      onClick={() => col.key!=='name' && col.key!=='team' && handleSort(col.key)}
                      style={{ padding:'10px 12px', textAlign:col.align==='left'?'left':'center', fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:sortKey===col.key?'var(--gold)':'var(--muted2)', cursor:col.key!=='name'&&col.key!=='team'?'pointer':'default', whiteSpace:'nowrap', userSelect:'none' }}>
                      {col.label}{sortKey===col.key ? (sortDir==='desc' ? ' ↓' : ' ↑') : ''}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(p => {
                  const t = getTeamByShort(p.team)
                  return (
                    <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                      onMouseLeave={e => e.currentTarget.style.background=''}
                    >
                      {TABLE_COLS.map(col => {
                        if (col.key==='name') return (
                          <td key="name" style={{ padding:'10px 12px' }}>
                            <button
                              onClick={() => setSelectedPlayer(p)}
                              style={{ background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:14, color:'var(--white)', whiteSpace:'nowrap', padding:0, textDecoration:'underline', textDecorationColor:'rgba(255,255,255,0.25)', textUnderlineOffset:3 }}
                            >
                              {p.name}
                            </button>
                          </td>
                        )
                        if (col.key==='team') return (
                          <td key="team" style={{ padding:'10px 12px' }}>
                            <Link to={`/teams/${t?.id||p.team}`} style={{ display:'flex', alignItems:'center', gap:6, textDecoration:'none' }}>
                              <span style={{ width:8, height:8, borderRadius:'50%', background:t?.color||'#6b7280', flexShrink:0 }} />
                              <span style={{ fontSize:13, color:t?.color||'var(--muted)', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{p.team}</span>
                            </Link>
                          </td>
                        )
                        const val = col.fmt ? col.fmt(p[col.key]) : p[col.key]
                        return (
                          <td key={col.key} style={{ padding:'10px 12px', textAlign:'center', fontSize:14, fontFamily:"'Barlow Condensed',sans-serif", color:sortKey===col.key?'var(--gold)':col.highlight?'var(--blue)':'var(--muted)', fontWeight:sortKey===col.key?700:400 }}>
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
    </>
  )
}
