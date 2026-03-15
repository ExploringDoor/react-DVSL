import { Link } from 'react-router-dom'
import { STANDINGS } from '../data/standings'
import { getRecentGames, getUpcomingGames } from '../data/games'
import { getStatLeaders, fmtAvg } from '../data/stats'
import { getTeamByShort } from '../data/teams'
import GameCard from '../components/GameCard'
import TeamBadge from '../components/TeamBadge'

export default function Home() {
  const topStandings = STANDINGS.slice(0, 8)
  const recentGames  = getRecentGames(6)
  const upcoming     = getUpcomingGames().slice(0,4)
  const leaders      = getStatLeaders()

  const fmtPct = n => n>=1?'1.000':n.toFixed(3).replace(/^0/,'.')

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:62}}>
      {/* Scrolling ticker */}
      <div style={{background:'var(--dark)',borderBottom:'1px solid var(--border)',padding:'10px 0',overflow:'hidden',whiteSpace:'nowrap'}}>
        <div style={{display:'inline-flex',gap:40,paddingLeft:40,animation:'none'}}>
          {recentGames.map(g => {
            const at = getTeamByShort(g.away)
            const ht = getTeamByShort(g.home)
            const aWin = g.awayScore > g.homeScore
            return (
              <span key={g.id} style={{display:'inline-flex',alignItems:'center',gap:8,fontSize:12}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color: at?.color||'var(--white)'}}>{g.away}</span>
                <span style={{color: aWin?'var(--white)':'var(--muted)',fontWeight:aWin?700:400}}>{g.awayScore}</span>
                <span style={{color:'var(--muted2)'}}>·</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,color: ht?.color||'var(--white)'}}>{g.home}</span>
                <span style={{color: !aWin?'var(--white)':'var(--muted)',fontWeight:!aWin?700:400}}>{g.homeScore}</span>
              </span>
            )
          })}
          <Link to="/scores" style={{color:'var(--gold)',fontSize:12,fontWeight:600,textDecoration:'none',flexShrink:0}}>Full Schedule »</Link>
        </div>
      </div>

      {/* Hero */}
      <div style={{position:'relative',background:'var(--dark)',borderBottom:'1px solid var(--border)',minHeight:400,display:'flex',flexDirection:'column',justifyContent:'flex-end',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none'}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'min(30vw,300px)',color:'rgba(255,255,255,0.03)',letterSpacing:'-.02em',userSelect:'none',lineHeight:1}}>DVSL</span>
        </div>
        <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 48px',position:'relative',zIndex:1,width:'100%'}}>
          <div className="section-label" style={{marginBottom:12}}>2026 Season · Delaware Valley Synagogue League</div>
          <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'min(8vw,80px)',textTransform:'uppercase',lineHeight:1,color:'var(--white)',marginBottom:24}}>
            DVSL Softball
          </h1>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <Link to="/scores" className="btn-gold">View Scores</Link>
            <Link to="/standings" className="btn-outline">Standings</Link>
            <Link to="/schedule" className="btn-outline">Schedule</Link>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:'0 auto',padding:'40px 48px 60px',display:'grid',gridTemplateColumns:'1fr 340px',gap:40}}>
        {/* Main */}
        <div style={{minWidth:0}}>
          {/* Recent scores */}
          <div style={{marginBottom:40}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:28,textTransform:'uppercase',color:'var(--white)'}}>Scores</h2>
              <Link to="/scores" style={{color:'var(--gold)',fontSize:13,textDecoration:'none',fontWeight:600}}>Full Schedule →</Link>
            </div>
            <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
              {recentGames.length === 0
                ? <div style={{padding:40,textAlign:'center',color:'var(--muted)'}}>No scores yet.</div>
                : recentGames.map(g => <GameCard key={g.id} game={g} />)
              }
            </div>
          </div>

          {/* Stat leaders */}
          <div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
              <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:28,textTransform:'uppercase',color:'var(--white)'}}>Leaderboard</h2>
              <Link to="/stats" style={{color:'var(--gold)',fontSize:13,textDecoration:'none',fontWeight:600}}>Full Leaders →</Link>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {[
                {key:'avg',label:'AVG',fmt:fmtAvg},
                {key:'hr', label:'HR', fmt:v=>v},
                {key:'rbi',label:'RBI',fmt:v=>v},
              ].map(({key,label,fmt})=>{
                const p = leaders[key]?.[0]
                if(!p) return null
                const t = getTeamByShort(p.team)
                return (
                  <div key={key} style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,padding:'16px 18px'}}>
                    <div className="section-label" style={{marginBottom:8}}>{label}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:38,color:'var(--gold)',lineHeight:1,marginBottom:6}}>{fmt(p[key])}</div>
                    <div style={{fontWeight:600,fontSize:14,color:'var(--white)'}}>{p.name}</div>
                    <div style={{fontSize:12,color:t?.color||'var(--muted)',marginTop:2}}>{p.team}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          {/* Standings */}
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,textTransform:'uppercase',color:'var(--white)'}}>Standings</span>
              <Link to="/standings" style={{color:'var(--gold)',fontSize:12,textDecoration:'none'}}>Full →</Link>
            </div>
            {topStandings.map((row,i)=>(
              <div key={row.team} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                <span style={{fontSize:12,color:'var(--muted2)',width:16,textAlign:'center'}}>{i+1}</span>
                <span style={{width:8,height:8,borderRadius:'50%',background:row.color,flexShrink:0}} />
                <Link to={`/teams/${row.id}`} style={{flex:1,fontSize:14,color:'var(--white)',textDecoration:'none',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:'uppercase',letterSpacing:'.02em'}}>{row.team}</Link>
                <span style={{fontSize:13,color:'var(--muted)',fontFamily:"'Barlow Condensed',sans-serif"}}>{row.w}-{row.l}</span>
                <span style={{fontSize:13,color:'var(--gold)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,minWidth:34,textAlign:'right'}}>{fmtPct(row.pct)}</span>
              </div>
            ))}
          </div>

          {/* Upcoming */}
          <div style={{background:'var(--card)',border:'1px solid var(--border)',borderRadius:10,overflow:'hidden'}}>
            <div style={{padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,textTransform:'uppercase',color:'var(--white)'}}>Upcoming</span>
              <Link to="/schedule" style={{color:'var(--gold)',fontSize:12,textDecoration:'none'}}>Schedule →</Link>
            </div>
            {upcoming.map(g => <GameCard key={g.id} game={g} isNext />)}
          </div>
        </div>
      </div>
    </div>
  )
}
