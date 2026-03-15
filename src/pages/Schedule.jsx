import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GAMES } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { GamedayModal } from '../components/GameModals'
import GameCard from '../components/GameCard'

const ALL_WEEKS = [...new Map(
  GAMES.filter(g => typeof g.wk === 'number').map(g => [g.wk, g])
).entries()]
  .map(([wk, g]) => ({ wk, date: g.date }))
  .sort((a,b) => a.wk - b.wk)

const UPCOMING_WK = ALL_WEEKS.find(w => GAMES.some(g => g.wk === w.wk && g.status === 'upcoming'))?.wk || ALL_WEEKS[0]?.wk
const DAY_FULL = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday' }
const dayOrder = ['mon','tue','wed','thu','fri','sat','sun']

function cleanField(f) { return f?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim() || f }
function parseTime(f) {
  const m = f?.match(/([\d:]+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const [,t,p] = m
  return `${t}${t.includes(':') ? '' : ':00'} ${p.toUpperCase()}`
}

// Compact game row - single line per game
function ScheduleRow({ game, isNext }) {
  const [showGameday, setShowGameday] = useState(false)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const field = cleanField(game.field)
  const time  = parseTime(game.field)
  const [mon, day] = (game.date||'').split(' ')
  const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon]||mon

  if (game.status === 'final') return <GameCard game={game} />

  return (
    <>
      {showGameday && <GamedayModal game={game} onClose={() => setShowGameday(false)} />}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderLeft: isNext ? '3px solid var(--gold)' : '1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:6, display:'flex', alignItems:'stretch', flexWrap:'wrap' }}>
        {/* Teams */}
        <div style={{ flex:'1 1 200px', minWidth:0, padding:'14px 20px', display:'flex', flexDirection:'column', gap:6 }}>
          {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
            <div key={side.t} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:`${side.team?.color||'#6b7280'}22`, border:`2px solid ${side.team?.color||'#6b7280'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, color:side.team?.color||'var(--white)', textTransform:'uppercase', letterSpacing:'-.02em' }}>{side.t?.slice(0,4)}</span>
              </div>
              <div>
                <Link to={`/teams/${side.team?.id||side.t.toLowerCase()}`} style={{
                  fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26,
                  textTransform:'uppercase', color:side.team?.color||'var(--white)',
                  textDecoration:'none', lineHeight:1, display:'block',
                }}>
                  {side.team?.name || side.t}
                </Link>
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.4)' }}>({side.team?.w}-{side.team?.l})</span>
              </div>
            </div>
          ))}
          {isNext && <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'var(--gold)', marginTop:2 }}>▶ NEXT</div>}
        </div>

        {/* Fixed-width columns so ALL rows align perfectly */}
        <div style={{ borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', flexShrink:0, flexWrap:'wrap', minWidth:0 }}>
          {/* Time + date — fixed 140px */}
          <div style={{ width:140, padding:'14px 20px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:32, color:'var(--gold)', lineHeight:1 }}>{time}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:4 }}>{mo} {day}</div>
          </div>
          {/* Field — fixed 120px */}
          <div style={{ width:120, padding:'14px 16px', borderLeft:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center' }}>
            <div style={{ fontWeight:600, fontSize:14, color:'var(--white)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{field}</div>
          </div>
          {/* GAMEDAY — fixed 120px */}
          <div style={{ width:120, padding:'14px 16px', borderLeft:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <button onClick={()=>setShowGameday(true)} className="btn-outline" style={{ fontSize:13, fontWeight:700, padding:'9px 18px', whiteSpace:'nowrap' }}>GAMEDAY</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Schedule() {
  const [activeWk, setActiveWk] = useState(UPCOMING_WK)
  const games    = GAMES.filter(g => g.wk === activeWk)
  const weekInfo = ALL_WEEKS.find(w => w.wk === activeWk)
  const byDay    = games.reduce((acc,g) => { if(!acc[g.day]) acc[g.day]=[]; acc[g.day].push(g); return acc }, {})
  const sortedDays = Object.keys(byDay).sort((a,b) => dayOrder.indexOf(a)-dayOrder.indexOf(b))
  const firstUpcoming = GAMES.find(g => g.status === 'upcoming')

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      {/* Week nav — compact sticky bar */}
      <div style={{ borderBottom:'1px solid var(--border)', background:'var(--bg)', position:'sticky', top:62, zIndex:50 }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(16px,4vw,48px)', display:'flex', overflowX:'auto', scrollbarWidth:'none' }}>
          {ALL_WEEKS.map(({wk, date}) => {
            const active = wk === activeWk
            const [mon, day] = (date||'').split(' ')
            const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon]||mon
            return (
              <button key={wk} onClick={()=>setActiveWk(wk)} style={{
                background:'none', border:'none', cursor:'pointer',
                padding:'10px 18px 0',
                borderBottom: active ? '3px solid var(--gold)' : '3px solid transparent',
                flexShrink:0, textAlign:'left',
              }}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:active?'var(--gold)':'var(--muted2)', marginBottom:2 }}>WK {wk}</div>
                <div style={{ fontFamily:"'Oswald',sans-serif", fontWeight:700, fontSize:20, color:active?'var(--gold)':'var(--white)', lineHeight:1, paddingBottom:8 }}>{mo} {day}</div>
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'20px clamp(16px,4vw,48px) 60px' }}>
        {/* Week header + calendar button inline */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:'var(--white)' }}>
            Week {activeWk} · {weekInfo?.date}
          </h2>
          <a href="/dvsl-2026.ics" download style={{ display:'inline-flex', alignItems:'center', gap:6, color:'var(--gold)', border:'1px solid rgba(245,200,66,.35)', borderRadius:20, padding:'6px 14px', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'.06em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
            📅 Subscribe to Calendar
          </a>
        </div>

        {games.length === 0 ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--muted)' }}>No games this week.</div>
        ) : (
          sortedDays.map(day => (
            <div key={day} style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)', paddingBottom:8, marginBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                {DAY_FULL[day]||day}
              </div>
              {byDay[day].map(g => (
                <ScheduleRow key={g.id} game={g} isNext={firstUpcoming?.id === g.id} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
