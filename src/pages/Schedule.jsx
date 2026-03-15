import { useState } from 'react'
import { GAMES } from '../data/games'
import { getTeamByShort } from '../data/teams'
import GameCard from '../components/GameCard'

const ALL_WEEKS = [...new Map(
  GAMES.filter(g => typeof g.wk === 'number').map(g => [g.wk, g])
).entries()]
  .map(([wk, g]) => ({ wk, date: g.date }))
  .sort((a,b) => a.wk - b.wk)

const UPCOMING_WK = ALL_WEEKS.find(w => GAMES.some(g => g.wk === w.wk && g.status === 'upcoming'))?.wk || ALL_WEEKS[0]?.wk
const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday' }

function cleanField(f) {
  return f?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim() || f
}
function parseTime(f) {
  const m = f?.match(/([\d:]+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const [,t,p] = m
  return `${t}${t.includes(':') ? '' : ':00'} ${p.toUpperCase()}`
}

// Simple upcoming game row — full names, clean layout
function ScheduleRow({ game, isNext }) {
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const field = cleanField(game.field)
  const time  = parseTime(game.field)

  if (game.status === 'final') {
    return <GameCard game={game} />
  }

  return (
    <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:2 }}>
      {isNext && <div style={{ padding:'8px 24px 0', fontSize:13, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--gold)' }}>NEXT</div>}
      <div style={{ display:'flex', alignItems:'stretch' }}>
        {/* Teams — full names */}
        <div style={{ flex:1, padding:'16px 24px', display:'flex', flexDirection:'column', gap:10 }}>
          {[{t:game.away, team:away},{t:game.home, team:home}].map(side=>(
            <div key={side.t} style={{ display:'flex', alignItems:'center', gap:12 }}>
              {/* color dot */}
              <span style={{ width:12, height:12, borderRadius:'50%', background:side.team?.color||'#6b7280', flexShrink:0 }} />
              <div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:24, textTransform:'uppercase', color:'var(--white)', lineHeight:1 }}>
                  {side.team?.name || side.t}
                </div>
                <div style={{ fontSize:12, color:'var(--muted2)', marginTop:2 }}>({side.team?.w}-{side.team?.l})</div>
              </div>
            </div>
          ))}
        </div>

        {/* Field */}
        <div style={{ borderLeft:'1px solid var(--border)', padding:'16px 28px', display:'flex', flexDirection:'column', justifyContent:'center', minWidth:160 }}>
          <div style={{ fontWeight:700, fontSize:18, color:'var(--white)', marginBottom:6 }}>{field}</div>
          <div style={{ fontSize:15, fontWeight:700, color:'var(--gold)' }}>{time}</div>
        </div>

        {/* Big time + GAMEDAY */}
        <div style={{ borderLeft:'1px solid var(--border)', padding:'16px 28px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:12 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, color:'var(--gold)', whiteSpace:'nowrap' }}>{time}</div>
          <button className="btn-outline" style={{ fontSize:14, letterSpacing:'.08em' }}>GAMEDAY</button>
        </div>
      </div>
    </div>
  )
}

export default function Schedule() {
  const [activeWk, setActiveWk] = useState(UPCOMING_WK)
  const games   = GAMES.filter(g => g.wk === activeWk)
  const weekInfo = ALL_WEEKS.find(w => w.wk === activeWk)
  const dayOrder = ['mon','tue','wed','thu','fri','sat','sun']
  const byDay = games.reduce((acc,g) => { if(!acc[g.day]) acc[g.day]=[]; acc[g.day].push(g); return acc }, {})
  const sortedDays = Object.keys(byDay).sort((a,b) => dayOrder.indexOf(a)-dayOrder.indexOf(b))
  const firstUpcoming = GAMES.find(g=>g.status==='upcoming')

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)', paddingTop:114 }}>
      {/* Week date nav — bigger */}
      <div style={{
        display:'flex', alignItems:'stretch',
        background:'var(--bg)', borderBottom:'1px solid var(--border)',
        position:'sticky', top:114, zIndex:50,
        overflowX:'auto', scrollbarWidth:'none',
      }}>
        {ALL_WEEKS.map(({wk, date}) => {
          const active = wk === activeWk
          const [mon, day] = (date||'').split(' ')
          const moFull = mon || ''
          const moShort = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon] || mon
          return (
            <button key={wk} onClick={()=>setActiveWk(wk)} style={{
              background:'none', border:'none', cursor:'pointer',
              padding:'14px 24px',
              borderBottom: active ? '3px solid var(--gold)' : '3px solid transparent',
              flexShrink:0, textAlign:'center',
            }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color: active ? 'var(--gold)' : 'var(--muted2)' }}>WK {wk}</div>
              <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:26, color: active ? 'var(--gold)' : 'var(--white)', lineHeight:1, marginTop:3, whiteSpace:'nowrap' }}>{moShort} {day}</div>
            </button>
          )
        })}
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 48px 60px' }}>
        {/* Week header */}
        <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:36, color:'var(--white)', marginBottom:28, letterSpacing:'.01em' }}>
          Week {activeWk} · {weekInfo?.date}</h2>
        <div style={{ marginBottom:20 }}>
          <a href="/dvsl-2026.ics" download="dvsl-2026.ics" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'var(--gold)', border:'1px solid rgba(245,200,66,.35)', borderRadius:20, padding:'8px 20px', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'.06em', textTransform:'uppercase' }}>📅 Subscribe to Calendar</a>
          <span style={{ fontSize:12, color:'var(--muted2)', marginLeft:12 }}>Add all DVSL games to Apple Calendar, Google Calendar, or Outlook</span>
        </div>
        <h2 style={{display:'none'}}
        </h2>


        {/* iCal subscribe */}
        <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
          <a href="/dvsl-2026.ics" download="dvsl-2026.ics" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'var(--gold)', border:'1px solid rgba(245,200,66,.35)', borderRadius:20, padding:'8px 20px', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'.06em', textTransform:'uppercase' }}>📅 Subscribe to Calendar</a>
          <span style={{ fontSize:12, color:'var(--muted2)' }}>Sync all DVSL games to Apple Calendar, Google Calendar, or Outlook</span>
        </div>
        {games.length === 0 ? (
          <div style={{ padding:60, textAlign:'center', color:'var(--muted)' }}>No games this week.</div>
        ) : (
          sortedDays.map(day => (
            <div key={day} style={{ marginBottom:32 }}>
              <div style={{ fontSize:13, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', borderBottom:'1px solid rgba(255,255,255,0.05)', paddingBottom:8, marginBottom:12 }}>
                {DAY_FULL[day]||day}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {byDay[day].map(g => (
                  <ScheduleRow key={g.id} game={g} isNext={firstUpcoming?.id===g.id} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
