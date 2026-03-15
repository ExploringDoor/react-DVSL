import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STATS, getStatLeaders, fmtAvg } from '../data/stats'
import { TEAMS, getTeamByShort } from '../data/teams'

const COLS = [
  {key:'name',   label:'Player', align:'left'},
  {key:'team',   label:'Team',   align:'left'},
  {key:'gp',     label:'GP'},
  {key:'ab',     label:'AB'},
  {key:'h',      label:'H'},
  {key:'doubles',label:'2B'},
  {key:'triples',label:'3B'},
  {key:'hr',     label:'HR'},
  {key:'r',      label:'R'},
  {key:'rbi',    label:'RBI'},
  {key:'bb',     label:'BB'},
  {key:'so',     label:'SO'},
  {key:'sb',     label:'SB'},
  {key:'avg',    label:'AVG',  fmt:fmtAvg, highlight:true},
  {key:'obp',    label:'OBP',  fmt:fmtAvg, highlight:true},
  {key:'slg',    label:'SLG',  fmt:fmtAvg, highlight:true},
]

const LEADER_CATS = [
  {key:'avg', label:'AVG',  fmt:fmtAvg},
  {key:'hr',  label:'HR',   fmt:v=>v},
  {key:'rbi', label:'RBI',  fmt:v=>v},
  {key:'h',   label:'Hits', fmt:v=>v},
  {key:'sb',  label:'SB',   fmt:v=>v},
  {key:'obp', label:'OBP',  fmt:fmtAvg},
]

export default function Stats() {
  const [sortKey, setSortKey] = useState('avg')
  const [sortDir, setSortDir] = useState('desc')
  const [teamFilter, setTeamFilter] = useState('ALL')
  const leaders = getStatLeaders()

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d==='desc'?'asc':'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sorted = [...STATS]
    .filter(p => teamFilter === 'ALL' || p.team === teamFilter)
    .sort((a,b) => sortDir==='desc' ? (b[sortKey]??0)-(a[sortKey]??0) : (a[sortKey]??0)-(b[sortKey]??0))

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:114}}>
      {/* Hero */}
      <div style={{background:'var(--dark)',borderBottom:'1px solid var(--border)',padding:'40px 48px 32px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div className="section-label" style={{marginBottom:8}}>2026 Season</div>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,textTransform:'uppercase',color:'var(--white)',lineHeight:1}}>
            Individual Leaders
          </h1>
          <p style={{color:'var(--muted)',fontSize:13,marginTop:8}}>Click any stat to re-rank.</p>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px 48px 60px'}}>
        {/* Leader cards */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:16,marginBottom:48}}>
          {LEADER_CATS.map(({key,label,fmt}) => {
            const p = leaders[key]?.[0]
            if (!p) return null
            const t = getTeamByShort(p.team)
            return (
              <div key={key} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,padding:'16px 18px'}}>
                <div className="section-label" style={{marginBottom:8}}>{label}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:40,color:'var(--gold)',lineHeight:1,marginBottom:6}}>
                  {fmt(p[key])}
                </div>
                <div style={{fontWeight:600,fontSize:14,color:'var(--white)'}}>{p.name}</div>
                <div style={{fontSize:12,color: t?.color || 'var(--muted)',marginTop:2}}>{p.team}</div>
              </div>
            )
          })}
        </div>

        {/* Team filter */}
        <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:20}}>
          {['ALL', ...TEAMS.map(t=>t.short)].map(s => (
            <button key={s} onClick={() => setTeamFilter(s)} style={{
              fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,
              letterSpacing:'.05em',textTransform:'uppercase',
              color: teamFilter===s ? 'var(--bg)' : 'var(--muted)',
              background: teamFilter===s ? 'var(--gold)' : 'transparent',
              border: teamFilter===s ? 'none' : '1px solid rgba(255,255,255,0.12)',
              borderRadius:6,padding:'5px 14px',cursor:'pointer',
            }}>{s === 'ALL' ? 'All Teams' : s}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{overflowX:'auto',background:'var(--card)',border:'1px solid var(--border)',borderRadius:10}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:900}}>
            <thead>
              <tr style={{borderBottom:'1px solid var(--border)'}}>
                {COLS.map(col => (
                  <th key={col.key}
                    onClick={() => col.key!=='name'&&col.key!=='team'&&handleSort(col.key)}
                    style={{
                      padding:'10px 12px',
                      textAlign: col.align==='left' ? 'left' : 'center',
                      fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
                      color: sortKey===col.key ? 'var(--gold)' : 'var(--muted2)',
                      cursor: col.key!=='name'&&col.key!=='team' ? 'pointer' : 'default',
                      whiteSpace:'nowrap',userSelect:'none',
                    }}>
                    {col.label}{sortKey===col.key ? (sortDir==='desc'?' ↓':' ↑') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p,i) => {
                const t = getTeamByShort(p.team)
                return (
                  <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}
                  >
                    {COLS.map(col => {
                      if (col.key==='name') return (
                        <td key="name" style={{padding:'10px 12px',fontWeight:600,fontSize:14,color:'var(--white)',whiteSpace:'nowrap'}}>{p.name}</td>
                      )
                      if (col.key==='team') return (
                        <td key="team" style={{padding:'10px 12px'}}>
                          <Link to={`/teams/${t?.id||p.team}`} style={{display:'flex',alignItems:'center',gap:6,textDecoration:'none'}}>
                            <span style={{width:8,height:8,borderRadius:'50%',background:t?.color||'#6b7280',flexShrink:0}} />
                            <span style={{fontSize:13,color: t?.color||'var(--muted)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{p.team}</span>
                          </Link>
                        </td>
                      )
                      const val = col.fmt ? col.fmt(p[col.key]) : p[col.key]
                      const isSort = sortKey===col.key
                      return (
                        <td key={col.key} style={{
                          padding:'10px 12px',textAlign:'center',fontSize:14,
                          fontFamily:"'Barlow Condensed',sans-serif",
                          color: isSort ? 'var(--gold)' : col.highlight ? 'var(--blue)' : 'var(--muted)',
                          fontWeight: isSort ? 700 : 400,
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
