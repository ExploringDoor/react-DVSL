import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STANDINGS, LEAGUE_HISTORY } from '../data/standings'

const COLS = [
  { key:'rank',  label:'#',    sortKey: null },
  { key:'name',  label:'Team', sortKey: 'w', align:'left' },
  { key:'w',     label:'W',    sortKey: 'w' },
  { key:'l',     label:'L',    sortKey: 'l' },
  { key:'pct',   label:'PCT',  sortKey: 'pct' },
  { key:'gb',    label:'GB',   sortKey: 'gb' },
  { key:'rs',    label:'PF',   sortKey: 'rs' },
  { key:'ra',    label:'PA',   sortKey: 'ra' },
  { key:'diff',  label:'DIFF', sortKey: 'diff' },
  { key:'pts',   label:'PTS',  sortKey: 'pts' },
]

export default function Standings() {
  const [tab, setTab]       = useState('2026')
  const [sortKey, setSortKey] = useState('pct')
  const [sortDir, setSortDir] = useState('desc')

  function handleSort(key) {
    if (!key) return
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const fmtPct = n => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '.')

  const sorted = [...STANDINGS].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey]
    // diff is a string like "+45" or "-12"
    if (sortKey === 'diff') { av = parseFloat(String(av)); bv = parseFloat(String(bv)) }
    if (sortKey === 'gb') {
      av = av === '—' ? -1 : Number(av)
      bv = bv === '—' ? -1 : Number(bv)
    }
    if (typeof av === 'string') return sortDir === 'desc' ? bv.localeCompare(av) : av.localeCompare(bv)
    return sortDir === 'desc' ? bv - av : av - bv
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ background:'var(--dark)', borderBottom:'1px solid var(--border)', padding:'32px clamp(16px,4vw,48px) 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:6 }}>DVSL · 2026 Season</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:52, textTransform:'uppercase', color:'var(--white)', lineHeight:1, marginBottom:0 }}>Standings</h1>
          <div style={{ display:'flex', gap:0, marginTop:16 }}>
            {['2026','History'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:22, textTransform:'uppercase',
                color: tab===t ? 'var(--white)' : 'rgba(255,255,255,0.35)',
                padding:'12px 0', marginRight:24, background:'none', border:'none',
                borderBottom: tab===t ? '3px solid var(--gold)' : '3px solid transparent',
                cursor:'pointer', transition:'color .15s',
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'24px clamp(16px,4vw,48px) 60px' }}>
        {tab === '2026' ? (
          <>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:12 }}>Click any column header to sort</div>
            <div style={{ overflowX:'auto', WebkitOverflowScrolling:'touch', background:'var(--card)', border:'1px solid var(--border)', borderRadius:10 }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
                <thead>
                  <tr style={{ borderBottom:'1px solid var(--border)' }}>
                    {COLS.map(col => (
                      <th key={col.key}
                        onClick={() => handleSort(col.sortKey)}
                        style={{
                          padding:'12px 14px',
                          textAlign: col.align==='left' ? 'left' : 'center',
                          fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase',
                          color: sortKey===col.sortKey ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                          cursor: col.sortKey ? 'pointer' : 'default',
                          userSelect:'none', whiteSpace:'nowrap',
                        }}>
                        {col.label}{sortKey===col.sortKey ? (sortDir==='desc' ? ' ↓' : ' ↑') : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row, i) => {
                    const origRank = STANDINGS.findIndex(r => r.id === row.id) + 1
                    const diffNum = parseFloat(String(row.diff))
                    return (
                      <tr key={row.team} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background=''}
                      >
                        {/* Rank */}
                        <td style={{ padding:'13px 14px', textAlign:'center' }}>
                          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:'var(--gold)' }}>{origRank}</span>
                        </td>
                        {/* Team */}
                        <td style={{ padding:'13px 14px' }}>
                          <Link to={`/teams/${row.id}`} style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
                            <span style={{ width:10, height:10, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:17, color:'var(--white)', textTransform:'uppercase', letterSpacing:'.02em' }}>{row.name}</span>
                          </Link>
                        </td>
                        {/* W */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:'var(--white)' }}>{row.w}</td>
                        {/* L */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, color:'rgba(255,255,255,0.55)' }}>{row.l}</td>
                        {/* PCT */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'var(--gold)' }}>{fmtPct(row.pct)}</td>
                        {/* GB */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, color: row.gb==='—' ? 'rgba(255,255,255,0.25)' : 'var(--blue)' }}>
                          {row.gb === '—' ? '—' : row.gb}
                        </td>
                        {/* PF */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, color:'rgba(255,255,255,0.55)' }}>{row.rs}</td>
                        {/* PA */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, color:'rgba(255,255,255,0.55)' }}>{row.ra}</td>
                        {/* DIFF */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color: diffNum >= 0 ? '#22c55e' : '#ef4444' }}>{row.diff}</td>
                        {/* PTS */}
                        <td style={{ padding:'13px 14px', textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:'var(--white)' }}>{row.pts}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Year','Champion','Runner-Up','Notes'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEAGUE_HISTORY.map(row => (
                  <tr key={row.year} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding:'14px 16px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:'var(--gold)' }}>{row.year}</td>
                    <td style={{ padding:'14px 16px', fontSize:15, color:'var(--white)', fontWeight:600 }}>{row.champion ? `🏆 ${row.champion}` : '—'}</td>
                    <td style={{ padding:'14px 16px', fontSize:14, color:'rgba(255,255,255,0.55)' }}>{row.runnerUp || '—'}</td>
                    <td style={{ padding:'14px 16px', fontSize:13, color:'rgba(255,255,255,0.35)', fontStyle:'italic' }}>{row.note || ''}</td>
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
