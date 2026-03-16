import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import { GamedayModal } from './GameModals'

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

export default function GameCardUpcomingGrid({ game, isNext = false, showFullName = false }) {
  const [showGameday, setShowGameday] = useState(false)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const field = cleanField(game.field)
  const time  = parseTime(game.field)
  const parts = (game.date||'').split(' ')
  const mon = parts[0], day = parts[1]
  const moMap = { April:'Apr', May:'May', June:'Jun', July:'Jul', August:'Aug' }
  const mo = moMap[mon] || mon

  return (
    <>
      {showGameday && <GamedayModal game={game} onClose={() => setShowGameday(false)} />}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderLeft: isNext ? '3px solid var(--gold)' : '1px solid var(--border)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>

        {/* Top — field + date */}
        <div style={{ padding:'10px 16px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          {isNext
            ? <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--gold)' }}>▶ NEXT</span>
            : <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>UPCOMING</span>
          }
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{mo} {day}</span>
        </div>

        {/* Teams */}
        <div style={{ padding:'12px 16px', flex:1, display:'flex', flexDirection:'column', gap:10 }}>
          {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
            <div key={side.t} style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:8, background:(side.team?.color||'#6b7280')+'22', border:'2px solid '+(side.team?.color||'#6b7280'), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, color:side.team?.color||'var(--white)', textTransform:'uppercase' }}>{(side.t||'').slice(0,4)}</span>
              </div>
              <div style={{ minWidth:0 }}>
                <Link to={'/teams/'+(side.team?.id||side.t.toLowerCase())} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize: showFullName ? 18 : 22, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {showFullName ? (side.team?.name||side.t) : side.t}
                </Link>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2 }}>({side.team?.w}-{side.team?.l})</div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'0 16px' }} />

        {/* Bottom — time + field + GAMEDAY */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px' }}>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:'var(--gold)', lineHeight:1 }}>{time}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:2 }}>{field}</div>
          </div>
          <button onClick={()=>setShowGameday(true)} className="btn-outline" style={{ fontSize:12, fontWeight:700, padding:'8px 14px', whiteSpace:'nowrap' }}>GAMEDAY</button>
        </div>
      </div>
    </>
  )
}
