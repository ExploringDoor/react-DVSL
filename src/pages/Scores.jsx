import { useState } from 'react'
import { GAMES, getCompletedGames } from '../data/games'
import { TEAMS } from '../data/teams'
import GameCard from '../components/GameCard'

const WEEKS_WITH_SCORES = [...new Set(
  GAMES.filter(g => g.status === 'final').map(g => g.wk)
)].sort((a,b) => (typeof a === 'number' && typeof b === 'number') ? b - a : 0)

export default function Scores() {
  const [activeWk, setActiveWk] = useState(WEEKS_WITH_SCORES[0])

  const games = GAMES.filter(g => g.wk === activeWk && g.status === 'final')

  // Group by day
  const byDay = games.reduce((acc, g) => {
    if (!acc[g.day]) acc[g.day] = []
    acc[g.day].push(g)
    return acc
  }, {})
  const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday' }

  const weekLabel = (wk) => {
    const w = GAMES.find(g => g.wk === wk)
    return w ? `${w.date}` : `Week ${wk}`
  }

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:62}}>
      {/* Tab bar */}
      <div style={{padding:'0 48px',borderBottom:'1px solid var(--border)',background:'var(--bg)',display:'flex'}}>
        <button className="tab-btn active">Scores</button>
      </div>

      {/* Week date nav */}
      <div style={{
        display:'flex',alignItems:'stretch',background:'var(--bg)',
        borderBottom:'1px solid var(--border)',position:'sticky',top:62,zIndex:50,
        overflowX:'auto',scrollbarWidth:'none',
      }}>
        {WEEKS_WITH_SCORES.map(wk => {
          const active = wk === activeWk
          const w = GAMES.find(g => g.wk === wk)
          const [mon, day] = (w?.date || '').split(' ')
          const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon] || mon
          return (
            <button key={wk} onClick={() => setActiveWk(wk)} style={{
              background:'none',border:'none',cursor:'pointer',
              padding:'12px 20px',borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
              flexShrink:0,textAlign:'center',
            }}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color: active ? 'var(--gold)' : 'var(--muted2)'}}>WK {wk}</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontWeight:600,fontSize:20,color: active ? 'var(--gold)' : 'var(--white)',lineHeight:1,marginTop:2}}>{mo} {day}</div>
            </button>
          )
        })}
      </div>

      {/* Games */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'0 0 60px'}}>
        {games.length === 0 ? (
          <div style={{padding:60,textAlign:'center',color:'var(--muted)'}}>No scores yet for this week.</div>
        ) : (
          Object.entries(byDay).map(([day, dayGames]) => (
            <div key={day}>
              <div style={{padding:'16px 20px 4px',fontSize:13,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',borderBottom:'1px solid var(--border2)'}}>
                {DAY_FULL[day] || day}
              </div>
              {dayGames.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
