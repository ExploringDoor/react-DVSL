import { useParams, Link } from 'react-router-dom'
import { TEAMS, getTeamById } from '../data/teams'
import { getGamesByTeam } from '../data/games'
import { getStatsByTeam, fmtAvg } from '../data/stats'
import { STANDINGS } from '../data/standings'
import TeamBadge from '../components/TeamBadge'
import GameCard from '../components/GameCard'

export default function TeamDetail() {
  const { teamId } = useParams()
  const team = getTeamById(teamId)

  if (!team) return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:120,textAlign:'center'}}>
      <p style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:40,color:'var(--white)'}}>Team Not Found</p>
      <Link to="/teams" style={{color:'var(--gold)',fontSize:14}}>← All Teams</Link>
    </div>
  )

  const allGames  = getGamesByTeam(team.short)
  const completed = allGames.filter(g=>g.status==='final').reverse()
  const upcoming  = allGames.filter(g=>g.status==='upcoming')
  const stats     = getStatsByTeam(team.short).sort((a,b)=>b.avg-a.avg)
  const standing  = STANDINGS.find(s=>s.id===team.id)
  const rank      = STANDINGS.findIndex(s=>s.id===team.id)+1
  const fmtPct    = n => n>=1?'1.000':n.toFixed(3).replace(/^0/,'.')

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:0}}>
      {/* Hero */}
      <div style={{
        background:`linear-gradient(135deg, ${team.color}15 0%, var(--dark) 60%)`,
        borderBottom:'1px solid var(--border)',padding:'40px clamp(16px,4vw,48px) 32px',
      }}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <Link to="/teams" style={{color:'var(--muted)',fontSize:12,textDecoration:'none',display:'block',marginBottom:16}}>← All Teams</Link>
          <a
            href={`/calendars/${team.short.toLowerCase()}.ics`}
            download={`dvsl-2026-${team.short.toLowerCase()}.ics`}
            style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--gold)',border:'1px solid rgba(245,200,66,.35)',borderRadius:20,padding:'6px 16px',textDecoration:'none',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:16}}
          >
            📅 Subscribe to {team.name} Schedule
          </a>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',flexWrap:'wrap',gap:24}}>
            <div style={{display:'flex',alignItems:'center',gap:20}}>
              <TeamBadge short={team.short} size={60} />
              <div>
                <div className="section-label" style={{marginBottom:4}}>#{rank} in League</div>
                <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,textTransform:'uppercase',color:'var(--white)',lineHeight:1}}>{team.name}</h1>
                <div style={{fontSize:13,color:'var(--muted)',marginTop:4}}>{team.field}</div>
              </div>
            </div>
            {standing && (
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,padding:'20px 28px',textAlign:'center'}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,color:team.color,lineHeight:1}}>{standing.w}-{standing.l}</div>
                <div style={{fontSize:13,color:'var(--muted)',fontFamily:"'Barlow Condensed',sans-serif",marginTop:4}}>{fmtPct(standing.pct)} PCT</div>
                <div style={{fontSize:12,color:'var(--muted2)',marginTop:4}}>{standing.rs} RF · {standing.ra} RA</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'20px clamp(12px,4vw,48px) 60px',display:'grid',gridTemplateColumns:'1fr 300px',gap:32}}>
        {/* Left */}
        <div>
          {/* Stats */}
          {stats.length > 0 && (
            <div style={{marginBottom:32}}>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:24,color:'var(--white)',marginBottom:16,textTransform:'uppercase'}}>Roster & Stats</h2>
              <div style={{overflowX:'auto',background:'var(--card)',border:'1px solid var(--border)',borderRadius:10}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{borderBottom:'1px solid var(--border)'}}>
                      {['Player','GP','AB','H','2B','3B','HR','R','RBI','SB','SO','AVG','OBP'].map(h=>(
                        <th key={h} style={{padding:'10px 10px',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--muted2)',textAlign:h==='Player'?'left':'center'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map(p=>(
                      <tr key={p.id} style={{borderBottom:'1px solid rgba(255,255,255,0.04)'}}
                        onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                        onMouseLeave={e=>e.currentTarget.style.background=''}
                      >
                        <td style={{padding:'10px',fontSize:14,fontWeight:600,color:'var(--white)',whiteSpace:'nowrap'}}>{p.name}</td>
                        {[p.gp,p.ab,p.h,p.doubles,p.triples,p.hr,p.r,p.rbi,p.sb,p.so].map((v,i)=>(
                          <td key={i} style={{padding:'10px',textAlign:'center',fontSize:13,color:'var(--muted)',fontFamily:"'Barlow Condensed',sans-serif"}}>{v}</td>
                        ))}
                        <td style={{padding:'10px',textAlign:'center',fontSize:13,color:'var(--gold)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700}}>{fmtAvg(p.avg)}</td>
                        <td style={{padding:'10px',textAlign:'center',fontSize:13,color:'var(--blue)',fontFamily:"'Barlow Condensed',sans-serif"}}>{fmtAvg(p.obp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent results */}
          {completed.length > 0 && (
            <div>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:24,color:'var(--white)',marginBottom:12,textTransform:'uppercase'}}>Recent Results</h2>
              <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
                {completed.slice(0,5).map(g=><GameCard key={g.id} game={g} />)}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,padding:20}}>
            <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:'var(--white)',textTransform:'uppercase',marginBottom:14}}>Upcoming Games</h3>
            {upcoming.length===0 ? (
              <p style={{color:'var(--muted)',fontSize:13}}>No upcoming games.</p>
            ) : upcoming.map(g=>{
              const opp = g.home===team.short ? g.away : g.home
              const isHome = g.home===team.short
              const oppTeam = TEAMS.find(t=>t.short===opp)
              return (
                <div key={g.id} style={{borderBottom:'1px solid var(--border)',paddingBottom:12,marginBottom:12}}>
                  <div style={{fontSize:15,fontWeight:600,color:'var(--white)',fontFamily:"'Barlow Condensed',sans-serif",textTransform:'uppercase'}}>
                    {isHome?'vs':'@'} <span style={{color:oppTeam?.color||'var(--gold)'}}>{opp}</span>
                  </div>
                  <div style={{fontSize:12,color:'var(--muted)',marginTop:2}}>{g.date} · {g.field}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
