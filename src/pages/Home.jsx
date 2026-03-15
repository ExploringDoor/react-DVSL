import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRecentGames, getUpcomingGames } from '../data/games'
import { STANDINGS } from '../data/standings'
import { getTeamByShort } from '../data/teams'
import { getStatLeaders, fmtAvg } from '../data/stats'
import GameCard from '../components/GameCard'
import { GamedayModal } from '../components/GameModals'
import LeaderCard from '../components/LeaderCard'

const LEADER_CATS = [
  { key:'avg', label:'Batting Avg', fmt: fmtAvg },
  { key:'hr',  label:'Home Runs',   fmt: v => v  },
  { key:'rbi', label:'RBI',         fmt: v => v  },
  { key:'h',   label:'Hits',        fmt: v => v  },
  { key:'obp', label:'OBP',         fmt: fmtAvg  },
]

function cleanField(f) {
  if (!f) return f
  return f.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i, '').trim()
}

function parseTime(f) {
  if (!f) return '7:30 PM'
  const m = f.match(/(\d+:\d+|\d+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const t = m[1], p = m[2].toUpperCase()
  return t.includes(':') ? t + ' ' + p : t + ':00 ' + p
}

function HomeScheduleRow({ game, isNext }) {
  const [showGameday, setShowGameday] = useState(false)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const field = cleanField(game.field)
  const time  = parseTime(game.field)
  const parts = (game.date || '').split(' ')
  const mon = parts[0], day = parts[1]
  const moMap = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }
  const mo = moMap[mon] || mon

  return (
    <>
      {showGameday && <GamedayModal game={game} onClose={() => setShowGameday(false)} />}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderLeft: isNext ? '3px solid var(--gold)' : '1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:4, display:'flex', alignItems:'stretch' }}>
        {/* Teams */}
        <div style={{ width:280, flexShrink:0, padding:'10px 14px', display:'flex', flexDirection:'column', gap:5 }}>
          {[{t:game.away, team:away}, {t:game.home, team:home}].map(side => (
            <div key={side.t} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:6, background:(side.team?.color||'#6b7280')+'22', border:'2px solid '+(side.team?.color||'#6b7280'), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:8, color:side.team?.color||'var(--white)', textTransform:'uppercase' }}>{(side.t||'').slice(0,4)}</span>
              </div>
              <div style={{ minWidth:0 }}>
                <Link to={'/teams/'+(side.team?.id||side.t.toLowerCase())} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {side.team?.name || side.t}
                </Link>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>({side.team?.w}-{side.team?.l})</span>
              </div>
            </div>
          ))}
          {isNext && <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', color:'var(--gold)' }}>▶ NEXT</div>}
        </div>
        {/* Time + field */}
        <div style={{ width:130, flexShrink:0, borderLeft:'1px solid var(--border)', padding:'10px 14px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:'var(--gold)', lineHeight:1 }}>{time}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:3 }}>{mo} {day}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2, fontWeight:600 }}>{field}</div>
        </div>
        {/* GAMEDAY */}
        <div style={{ width:100, flexShrink:0, borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px' }}>
          <button onClick={() => setShowGameday(true)} className="btn-outline" style={{ fontSize:11, fontWeight:700, padding:'7px 8px', whiteSpace:'nowrap', width:'100%', textAlign:'center' }}>GAMEDAY</button>
        </div>
      </div>
    </>
  )
}

export default function Home() {
  const recentGames   = getRecentGames(6)
  const upcomingGames = getUpcomingGames().slice(0, 5)
  const leaders       = getStatLeaders()
  const topStandings  = [...STANDINGS].sort((a,b) => b.pct - a.pct).slice(0, 8)
  const fmtPct = n => n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '.')

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Hero banner — full natural height, no cropping */}
      <div style={{ width:'100%', background:'#050608', lineHeight:0, position:'relative' }}>
        <img src="/dvsl-banner.png" alt="DVSL Softball" style={{ width:'100%', height:'auto', display:'block' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(to bottom, transparent, #070709)', pointerEvents:'none' }} />
      </div>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'24px clamp(16px,4vw,48px) 60px' }}>
        <div className="home-grid">

          {/* LEFT */}
          <div style={{ minWidth:0 }}>

            {/* Recent Scores */}
            {recentGames.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>2026 Season</div>
                    <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Recent Results</h2>
                  </div>
                  <Link to="/scores" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none' }}>All Scores →</Link>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {recentGames.map(g => <GameCard key={g.id} game={g} />)}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingGames.length > 0 && (
              <div style={{ marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>On Deck</div>
                    <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Upcoming</h2>
                  </div>
                  <Link to="/schedule" style={{ color:'var(--gold)', fontWeight:700, fontSize:13, textDecoration:'none' }}>Full Schedule →</Link>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                  {upcomingGames.map((g,i) => <HomeScheduleRow key={g.id} game={g} isNext={i===0 && recentGames.length===0} />)}
                </div>
              </div>
            )}

            {/* Leaders */}
            <div style={{ marginBottom:24 }}>
              <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:4 }}>Individual Leaders</div>
                  <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Leaderboard</h2>
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
              <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, textTransform:'uppercase', color:'var(--white)' }}>Standings</span>
                <Link to="/standings" style={{ color:'var(--gold)', fontSize:13, textDecoration:'none', fontWeight:700 }}>Full →</Link>
              </div>
              {topStandings.map((row, i) => (
                <div key={row.team} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:'var(--gold)', width:20, flexShrink:0, textAlign:'center' }}>{i+1}</span>
                  <span style={{ width:10, height:10, borderRadius:'50%', background:row.color, flexShrink:0 }} />
                  <Link to={'/teams/'+row.id} style={{ flex:1, fontSize:14, color:'var(--white)', textDecoration:'none', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.name}</Link>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:700, color:'var(--white)', flexShrink:0, minWidth:56, textAlign:'right' }}>{row.w}-{row.l}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
