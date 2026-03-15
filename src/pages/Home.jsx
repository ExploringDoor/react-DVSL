import { Link } from 'react-router-dom'
import { STANDINGS } from '../data/standings'
import { getRecentGames, getUpcomingGames } from '../data/games'
import { getStatLeaders, fmtAvg } from '../data/stats'
import { getTeamByShort } from '../data/teams'
import GameCard from '../components/GameCard'
import LeaderCard from '../components/LeaderCard'

export default function Home() {
  const topStandings  = STANDINGS.slice(0, 8)
  const recentGames   = getRecentGames(6)
  const upcomingGames = getUpcomingGames().slice(0, 5)
  const leaders       = getStatLeaders()
  const fmtPct = n => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '.')

  const leaderCats = [
    { key:'avg', label:'Batting Avg', fmt: fmtAvg },
    { key:'hr',  label:'Home Runs',   fmt: v => v  },
    { key:'rbi', label:'RBI',         fmt: v => v  },
    { key:'r',   label:'Runs',        fmt: v => v  },
    { key:'h',   label:'Hits',        fmt: v => v  },
    { key:'obp', label:'OBP',         fmt: fmtAvg  },
  ]

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:114 }}>
      {/* Hero */}
      <div style={{ position:'relative', background:'var(--dark)', borderBottom:'1px solid var(--border)', minHeight:280, display:'flex', flexDirection:'column', justifyContent:'flex-end', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
          <img src="/dvsl-logo.png" alt="" style={{ height:'min(340px,80%)', width:'auto', opacity:0.08, objectFit:'contain', userSelect:'none' }} />
        </div>
        <div style={{ maxWidth:1400, margin:'0 auto', padding:'40px clamp(16px,4vw,48px)', position:'relative', zIndex:1, width:'100%' }}>
          <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:20 }}>
            <img src="/dvsl-logo.png" alt="DVSL Logo" style={{ height:110, width:110, objectFit:'contain', flexShrink:0, filter:'drop-shadow(0 0 20px rgba(59,130,246,0.4))' }} />
            <div>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:8 }}>2026 Season · Delaware Valley Synagogue League</div>
              <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:'min(8vw,72px)', textTransform:'uppercase', lineHeight:1, color:'var(--white)', marginBottom:16 }}>DVSL Softball</h1>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <Link to="/scores" className="btn-gold">View Scores</Link>
                <Link to="/standings" className="btn-outline">Standings</Link>
                <Link to="/schedule" className="btn-outline">Schedule</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'24px 20px 60px' }} className="home-grid">
        {/* LEFT */}
        <div style={{ minWidth:0 }}>
          {/* SCORES */}
          <div style={{ marginBottom:52 }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>Season Schedule · Hover a game for details</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:52, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Scores</h2>
              </div>
              <Link to="/scores" style={{ color:'var(--gold)', fontWeight:700, fontSize:15, textDecoration:'none' }}>Full Schedule →</Link>
            </div>

            {recentGames.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:10 }}>Recent Results</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {recentGames.map(g => <GameCard key={g.id} game={g} />)}
                </div>
              </div>
            )}

            {upcomingGames.length > 0 && (
              <div>
                <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:10 }}>
                  {recentGames.length > 0 ? 'Upcoming' : 'Schedule'}
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {upcomingGames.map((g,i) => <GameCard key={g.id} game={g} isNext={i===0 && recentGames.length===0} />)}
                </div>
              </div>
            )}
          </div>

          {/* LEADERBOARD */}
          <div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>Individual Leaders</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:52, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Leaderboard</h2>
              </div>
              <Link to="/stats" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none', border:'1px solid rgba(245,200,66,.4)', borderRadius:20, padding:'7px 18px', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'.06em', textTransform:'uppercase' }}>Full Leaders →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px,1fr))', gap:12 }}>
              {leaderCats.map(({ key, label, fmt }) => (
                <LeaderCard key={key} catLabel={label} statKey={key} players={leaders[key]||[]} fmt={fmt} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

          {/* Standings — bigger records */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, textTransform:'uppercase', color:'var(--white)', letterSpacing:'.02em' }}>Standings</span>
              <Link to="/standings" style={{ color:'var(--gold)', fontSize:13, textDecoration:'none', fontWeight:600 }}>Full →</Link>
            </div>
            {topStandings.map((row,i) => (
              <div key={row.team} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:13, color:'var(--muted2)', width:18, textAlign:'center', flexShrink:0 }}>{i+1}</span>
                <span style={{ width:10, height:10, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                <Link to={`/teams/${row.id}`} style={{ flex:1, fontSize:15, color:'var(--white)', textDecoration:'none', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.name}</Link>
                {/* Bigger record */}
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:700, color:'var(--white)', flexShrink:0, minWidth:56, textAlign:'right' }}>{row.w}-{row.l}</span>
              </div>
            ))}
          </div>

          {/* Upcoming — full names */}
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden' }}>
            <div style={{ padding:'16px 24px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, textTransform:'uppercase', color:'var(--white)', letterSpacing:'.02em' }}>Upcoming</span>
              <Link to="/schedule" style={{ color:'var(--gold)', fontSize:13, textDecoration:'none', fontWeight:600 }}>Schedule →</Link>
            </div>
            <div style={{ padding:'16px 24px', display:'flex', flexDirection:'column', gap:18 }}>
              {getUpcomingGames().slice(0,4).map((g,i) => {
                const away = getTeamByShort(g.away)
                const home = getTeamByShort(g.home)
                const field = g.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
                const tMatch = g.field?.match(/([\d:]+)\s*(pm|am)/i)
                const time = tMatch ? `${tMatch[1]}${tMatch[1].includes(':') ? '' : ':00'} ${tMatch[2].toUpperCase()}` : '7:30 PM'
                return (
                  <div key={g.id} style={{ borderBottom:i<3?'1px solid rgba(255,255,255,0.05)':'none', paddingBottom:i<3?18:0 }}>
                    {i===0 && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--gold)', marginBottom:8 }}>NEXT</div>}
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {[{t:g.away, team:away},{t:g.home, team:home}].map(side=>(
                        <div key={side.t} style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ width:10, height:10, borderRadius:'50%', background:side.team?.color||'#6b7280', flexShrink:0 }} />
                          <Link to={`/teams/${side.team?.id||side.t}`} style={{ fontWeight:600, fontSize:15, color:'var(--white)', textDecoration:'none', flex:1 }}>
                            {side.team?.name || side.t}
                          </Link>
                          <span style={{ fontSize:13, color:'var(--muted2)' }}>{side.team?.w}-{side.team?.l}</span>
                        </div>
                      ))}
                      <div style={{ fontSize:12, color:'var(--muted2)', marginTop:2, paddingLeft:20 }}>
                        <span style={{ color:'var(--white)', fontWeight:500 }}>{field}</span>
                        <span style={{ margin:'0 6px' }}>·</span>
                        <span style={{ color:'var(--gold)', fontWeight:700 }}>{time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
