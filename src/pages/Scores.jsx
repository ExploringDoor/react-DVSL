import { useState } from 'react'
import { GAMES } from '../data/games'
import GameCard from '../components/GameCard'
import { Link } from 'react-router-dom'

const WEEKS_WITH_SCORES = [...new Map(
  GAMES.filter(g => g.status === 'final').map(g => [g.wk, g])
).entries()]
  .map(([wk, g]) => ({ wk, date: g.date }))
  .filter(w => typeof w.wk === 'number')
  .sort((a,b) => b.wk - a.wk)

const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday' }

export default function Scores() {
  const [activeWk, setActiveWk] = useState(WEEKS_WITH_SCORES[0]?.wk)

  const games = GAMES.filter(g => g.wk === activeWk && g.status === 'final')
  const byDay = games.reduce((acc,g) => { if(!acc[g.day]) acc[g.day]=[]; acc[g.day].push(g); return acc }, {})
  const dayOrder = ['mon','tue','wed','thu','fri','sat','sun']
  const sortedDays = Object.keys(byDay).sort((a,b) => dayOrder.indexOf(a)-dayOrder.indexOf(b))

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:0 }}>
      {/* Page header — full width, centered */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px clamp(16px,4vw,48px) 0' }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)', marginBottom:6 }}>
          Season Schedule · Hover a game for details
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:20 }}>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:72, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>Scores</h1>
          <Link to="/schedule" style={{ color:'var(--gold)', fontWeight:700, fontSize:15, textDecoration:'none', marginBottom:8 }}>Full Schedule →</Link>
        </div>
      </div>

      {/* Week date nav — full width */}
      <div style={{ borderBottom:'1px solid var(--border)', position:'sticky', top:62, zIndex:50, background:'var(--bg)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 48px', display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
          {WEEKS_WITH_SCORES.map(({wk, date}) => {
            const active = wk === activeWk
            const [mon, day] = (date||'').split(' ')
            const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon]||mon
            return (
              <button key={wk} onClick={()=>setActiveWk(wk)} style={{
                background:'none', border:'none', cursor:'pointer',
                padding:'12px 20px 0',
                borderBottom: active ? '3px solid var(--gold)' : '3px solid transparent',
                flexShrink:0, textAlign:'left', marginBottom:0,
              }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color: active?'var(--gold)':'var(--muted2)', marginBottom:2 }}>WK {wk}</div>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:24, color: active?'var(--gold)':'var(--white)', lineHeight:1, paddingBottom:10 }}>{mo} {day}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Games */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px clamp(16px,4vw,48px) 60px' }}>
        {games.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'var(--muted)' }}>No scores yet for this week.</div>
        ) : (
          sortedDays.map(day => (
            <div key={day} style={{ marginBottom:32 }}>
              <div style={{ fontSize:13, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:8, marginBottom:12 }}>
                {DAY_FULL[day]||day}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {games.filter(g=>g.day===day).map(g => <GameCard key={g.id} game={g} />)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
