import { Link } from 'react-router-dom'
import { GAMES, getRecentGames, getUpcomingGames } from '../data/games'
import { STANDINGS } from '../data/standings'
import { getTeamByShort } from '../data/teams'
import { getStatLeaders, fmtAvg } from '../data/stats'
import GameCard from '../components/GameCard'
import LeaderCard from '../components/LeaderCard'

const LEADER_CATS = [
  { key:'avg', label:'Batting Avg', fmt: fmtAvg },
  { key:'hr',  label:'Home Runs',   fmt: v => v  },
  { key:'rbi', label:'RBI',         fmt: v => v  },
  { key:'h',   label:'Hits',        fmt: v => v  },
  { key:'obp', label:'OBP',         fmt: fmtAvg  },
]

export default function Home() {
  const recentGames   = getRecentGames(6)
  const upcomingGames = getUpcomingGames().slice(0, 5)
  const leaders       = getStatLeaders()
  const fmtPct = n => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '.')
  const topStandings  = [...STANDINGS].sort((a,b) => b.pct - a.pct).slice(0, 8)

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Hero banner */}
      <div style={{ position:'relative', minHeight:'clamp(160px,30vw,320px)', display:'flex', flexDirection:'column', justifyContent:'flex-end', overflow:'hidden', background:'#050608' }}>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
          <img src="/dvsl-banner.png" alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center center', opacity:0.75 }} />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(5,6,8,0.2) 0%, rgba(5,6,8,0.5) 60%, rgba(5,6,8,0.92) 100%)' }} />
        </div>
      </div>

      {/* Main content grid */}
      <div className="home-grid">

        {/* LEFT — scores + upcoming */}
        <div style={{ minWidth:0 }}>

          {/* Recent Scores */}
          {recentGames.length > 0 && (
            <div style={{ marginBottom:40 }}>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>2026 Season</div>
                  <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Recent Results</h2>
                </div>
                <Link to="/scores" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none' }}>All Scores →</Link>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {recentGames.map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcomingGames.length > 0 && (
            <div style={{ marginBottom:40 }}>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>On Deck</div>
                  <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Upcoming</h2>
                </div>
                <Link to="/schedule" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none' }}>Full Schedule →</Link>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {upcomingGames.map((g,i) => <GameCard key={g.id} game={g} isNext={i===0 && recentGames.length===0} />)}
              </div>
            </div>
          )}

          {/* Leaders */}
          <div style={{ marginBottom:40 }}>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>Individual Leaders</div>
                <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Leaderboard</h2>
              </div>
              <Link to="/stats" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none' }}>Full Leaders →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(130px,1fr))', gap:12 }}>
              {LEADER_CATS.map(({key,label,fmt}) => (
                <LeaderCard key={key} catLabel={label} statKey={key} players={leaders[key]||[]} fmt={fmt} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — standings */}
        <div style={{ minWidth:0 }}>
          <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', position:'sticky', top:72 }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, textTransform:'uppercase', color:'var(--white)', letterSpacing:'.02em' }}>Standings</span>
              <Link to="/standings" style={{ color:'var(--gold)', fontSize:13, textDecoration:'none', fontWeight:700 }}>Full →</Link>
            </div>
            {topStandings.map((row, i) => (
              <div key={row.team} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:'var(--gold)', width:20, flexShrink:0, textAlign:'center' }}>{i+1}</span>
                <span style={{ width:10, height:10, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                <Link to={`/teams/${row.id}`} style={{ flex:1, fontSize:14, color:'var(--white)', textDecoration:'none', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.name}</Link>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:'var(--white)', flexShrink:0, minWidth:56, textAlign:'right' }}>{row.w}-{row.l}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
