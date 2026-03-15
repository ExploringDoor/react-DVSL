import { useState } from 'react'
import { GAMES } from '../data/games'
import GameCard from '../components/GameCard'

const ALL_WEEKS = [...new Map(GAMES.map(g => [g.wk, g])).entries()]
  .filter(([wk]) => typeof wk === 'number')
  .map(([wk, g]) => ({ wk, date: g.date }))
  .sort((a,b) => a.wk - b.wk)

const UPCOMING_WEEKS = ALL_WEEKS.filter(w =>
  GAMES.some(g => g.wk === w.wk && g.status === 'upcoming')
)

export default function Schedule() {
  const [activeWk, setActiveWk] = useState(UPCOMING_WEEKS[0]?.wk || ALL_WEEKS[0]?.wk)

  const games = GAMES.filter(g => g.wk === activeWk)
  const byDay = games.reduce((acc, g) => {
    if (!acc[g.day]) acc[g.day] = []
    acc[g.day].push(g)
    return acc
  }, {})
  const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday' }
  const weekLabel = (wk) => {
    const w = ALL_WEEKS.find(w => w.wk === wk)
    return w ? `Week ${wk} · ${w.date}` : `Week ${wk}`
  }

  const displayWeeks = ALL_WEEKS

  return (
    <div style={{minHeight:'100vh',background:'var(--bg)',paddingTop:114}}>
      {/* Tab bar */}
      <div style={{padding:'0 48px',borderBottom:'1px solid var(--border)',background:'var(--bg)',display:'flex'}}>
        <button className="tab-btn active">Schedule</button>
      </div>

      {/* Week nav */}
      <div style={{
        display:'flex',alignItems:'stretch',background:'var(--bg)',
        borderBottom:'1px solid var(--border)',position:'sticky',top:114,zIndex:50,
        overflowX:'auto',scrollbarWidth:'none',
      }}>
        {displayWeeks.map(({wk, date}) => {
          const active = wk === activeWk
          const [mon, day] = (date || '').split(' ')
          const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon] || mon
          const hasUpcoming = GAMES.some(g => g.wk === wk && g.status === 'upcoming')
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

      {/* Week header */}
      <div style={{maxWidth:900,margin:'0 auto',padding:'20px 20px 4px'}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,color:'var(--white)'}}>
          Week {activeWk} · {ALL_WEEKS.find(w=>w.wk===activeWk)?.date}
        </div>
      </div>

      {/* Games */}
      <div style={{maxWidth:900,margin:'0 auto',paddingBottom:60}}>
        {games.length === 0 ? (
          <div style={{padding:60,textAlign:'center',color:'var(--muted)'}}>No games this week.</div>
        ) : (
          Object.entries(byDay).map(([day, dayGames]) => (
            <div key={day}>
              <div style={{padding:'14px 20px 4px',fontSize:13,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                {DAY_FULL[day] || day}
              </div>
              {dayGames.map((g, i) => {
                const isNext = g.status === 'upcoming' && i === 0 &&
                  !GAMES.some(gg => gg.status==='upcoming' && gg.wk < g.wk)
                return <GameCard key={g.id} game={g} isNext={isNext} />
              })}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
