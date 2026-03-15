import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TEAMS } from '../data/teams'
import { STANDINGS } from '../data/standings'
import { getGamesByTeam } from '../data/games'
import TeamBadge from '../components/TeamBadge'

export default function Teams() {
  const [activeTeam, setActiveTeam] = useState(null)

  const sorted = [...TEAMS].sort((a,b) => {
    const ra = STANDINGS.find(s=>s.id===a.id)
    const rb = STANDINGS.find(s=>s.id===b.id)
    return (rb?.pct||0) - (ra?.pct||0)
  })

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:0}}>
      <div style={{background:'var(--dark)',borderBottom:'1px solid var(--border)',padding:'40px clamp(16px,4vw,48px) 32px'}}>
        <div style={{maxWidth:1200,margin:'0 auto'}}>
          <div className="section-label" style={{marginBottom:8}}>2026 Season</div>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,textTransform:'uppercase',color:'var(--white)',lineHeight:1,marginBottom:20}}>
            Team Directory
          </h1>
          {/* Team buttons */}
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {sorted.map(t => (
              <Link key={t.id} to={`/teams/${t.id}`} style={{
                display:'flex',alignItems:'center',gap:8,
                background: 'var(--card)',
                border: `1px solid ${t.color}40`,
                borderRadius:8,padding:'8px 14px',
                textDecoration:'none',transition:'all .15s',
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=t.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor=`${t.color}40`}
              >
                <span style={{width:8,height:8,borderRadius:'50%',background:t.color,flexShrink:0}} />
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:16,color:'var(--white)',textTransform:'uppercase'}}>{t.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:'0 auto',padding:'32px clamp(16px,4vw,48px) 60px'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:16}}>
          {sorted.map((team, i) => {
            const standing = STANDINGS.find(s=>s.id===team.id)
            const games = getGamesByTeam(team.short)
            const upcoming = games.filter(g=>g.status==='upcoming')
            const fmtPct = n => n>=1?'1.000':n.toFixed(3).replace(/^0/,'.')
            return (
              <Link key={team.id} to={`/teams/${team.id}`} style={{
                background:'var(--card)',
                border:'1px solid var(--border)',
                borderLeft:`3px solid ${team.color}`,
                borderRadius:10,padding:'20px',
                textDecoration:'none',display:'block',transition:'border-color .15s',
              }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=team.color}
                onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
              >
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <TeamBadge short={team.short} size={40} />
                    <div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:'var(--white)',textTransform:'uppercase',lineHeight:1}}>{team.name}</div>
                      <div style={{fontSize:12,color:'var(--muted2)',marginTop:2}}>{team.field}</div>
                    </div>
                  </div>
                  {standing && (
                    <div style={{textAlign:'right'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color:team.color,lineHeight:1}}>{standing.w}-{standing.l}</div>
                      <div style={{fontSize:12,color:'var(--muted2)',fontFamily:"'Barlow Condensed',sans-serif"}}>{fmtPct(standing.pct)}</div>
                    </div>
                  )}
                </div>
                {upcoming[0] && (
                  <div style={{fontSize:12,color:'var(--muted2)',borderTop:'1px solid var(--border)',paddingTop:10,marginTop:4}}>
                    Next: <span style={{color:'var(--white)'}}>{upcoming[0].home===team.short?`vs ${upcoming[0].away}`:`@ ${upcoming[0].home}`}</span>
                    <span style={{marginLeft:6}}>· {upcoming[0].date}</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
