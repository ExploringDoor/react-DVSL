import { useState } from 'react'
import { Link } from 'react-router-dom'
import { STANDINGS, LEAGUE_HISTORY } from '../data/standings'

export default function Standings() {
  const [tab, setTab] = useState('2026')

  const fmtPct = (n) => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/,'.')

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:0}}>
      {/* Hero */}
      <div style={{background:'var(--dark)',borderBottom:'1px solid var(--border)',padding:'40px clamp(16px,4vw,48px) 0'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div className="section-label" style={{marginBottom:8}}>DVSL · 2026 Season</div>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,textTransform:'uppercase',letterSpacing:'.02em',lineHeight:1,color:'var(--white)',marginBottom:24}}>
            Standings
          </h1>
          {/* Tab bar */}
          <div style={{display:'flex'}}>
            {['2026','History'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`tab-btn${tab===t?' active':''}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'32px clamp(16px,4vw,48px) 60px'}}>
        {tab === '2026' ? (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)'}}>
                  {['#','Team','W','L','T','PCT','GB','PF','PA','DIFF','STRK','PTS'].map(h => (
                    <th key={h} style={{
                      padding:'10px 12px',textAlign: h==='Team' ? 'left' : 'center',
                      fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',
                      color:'var(--muted2)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STANDINGS.map((row, i) => (
                  <tr key={row.team} style={{borderBottom:'1px solid rgba(255,255,255,0.04)',transition:'background .15s'}}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}
                  >
                    <td style={{padding:'12px',color:'var(--muted2)',fontSize:13,textAlign:'center'}}>{i+1}</td>
                    <td style={{padding:'12px'}}>
                      <Link to={`/teams/${row.id}`} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
                        <span style={{width:10,height:10,borderRadius:'50%',background:row.color,display:'inline-block',flexShrink:0}} />
                        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:'var(--white)',textTransform:'uppercase',letterSpacing:'.02em'}}>{row.name}</span>
                        <span style={{fontSize:12,color:'var(--muted2)'}}>({row.team})</span>
                      </Link>
                    </td>
                    <td style={{padding:'12px',textAlign:'center',fontWeight:700,fontSize:15,color:'var(--white)'}}>{row.w}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color:'var(--muted)'}}>{row.l}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color:'var(--muted)'}}>0</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color:'var(--gold)',fontWeight:700}}>{fmtPct(row.pct)}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color: row.gb==='—' ? 'var(--muted2)' : 'var(--blue)'}}>
                      {row.gb === '—' ? '—' : typeof row.gb === 'number' ? row.gb : row.gb}
                    </td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color:'var(--muted)'}}>{row.rs}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,color:'var(--muted)'}}>{row.ra}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:14,fontWeight:700,color: String(row.diff).startsWith('+') ? 'var(--green)' : 'var(--red)'}}>{row.diff}</td>
                    <td style={{padding:'12px',textAlign:'center',fontSize:13,color:'var(--muted2)'}}>—</td>
                    <td style={{padding:'12px',textAlign:'center',fontWeight:700,fontSize:15,color:'var(--white)'}}>{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,color:'var(--white)',marginBottom:24}}>League History</h2>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)'}}>
                  {['Year','Champion','Runner-Up','Notes'].map(h=>(
                    <th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LEAGUE_HISTORY.map(row=>(
                  <tr key={row.year} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <td style={{padding:'14px 12px',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:20,color:'var(--gold)'}}>{row.year}</td>
                    <td style={{padding:'14px 12px',fontSize:15,color:'var(--white)',fontWeight:600}}>{row.champion ? `🏆 ${row.champion}` : '—'}</td>
                    <td style={{padding:'14px 12px',fontSize:14,color:'var(--muted)'}}>{row.runnerUp || '—'}</td>
                    <td style={{padding:'14px 12px',fontSize:13,color:'var(--muted2)',fontStyle:'italic'}}>{row.note||''}</td>
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
