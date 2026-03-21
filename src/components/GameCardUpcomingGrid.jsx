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
      <div className='game-card-hover' style={{
        background:'var(--card)',
        border:'1px solid var(--border)',
        borderLeft: isNext ? '3px solid #0057FF' : '1px solid var(--border)',
        borderRadius:12, overflow:'hidden',
        display:'flex', alignItems:'stretch',
      }}>
        {/* LEFT — teams with big badges */}
        <div style={{ flex:1, padding:'16px 20px', display:'flex', flexDirection:'column', gap:14 }}>
          {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
            <div key={side.t} style={{ display:'flex', alignItems:'center', gap:14 }}>
              {/* Big badge */}
              <div style={{
                width:56, height:56, borderRadius:12,
                background:(side.team?.color||'#6b7280')+'22',
                border:'2px solid '+(side.team?.color||'#6b7280'),
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                transition:'box-shadow 0.2s ease, transform 0.2s ease',
              }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:13, color:side.team?.color||'var(--white)', textTransform:'uppercase', letterSpacing:'-.02em' }}>
                  {(side.t||'').slice(0,4)}
                </span>
              </div>
              {/* Name + record */}
              <div style={{ minWidth:0 }}>
                <Link to={'/teams/'+(side.team?.id||side.t.toLowerCase())} style={{
                  fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900,
                  fontSize: showFullName ? 22 : 32,
                  textTransform:'uppercase', color:side.team?.color||'var(--white)',
                  textDecoration:'none', lineHeight:1, display:'block',
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                }}>
                  {showFullName ? (side.team?.name||side.t) : side.t}
                </Link>
                <div style={{ fontSize:14, color:'rgba(0,0,0,0.4)', marginTop:4 }}>({side.team?.w}-{side.team?.l})</div>
              </div>
            </div>
          ))}
        </div>

        {/* CENTER divider */}
        <div style={{ width:1, background:'rgba(255,255,255,0.07)', flexShrink:0 }} />

        {/* RIGHT — time, date, field */}
        <div style={{ width:160, flexShrink:0, padding:'16px 20px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:34, color:'var(--gold)', lineHeight:1 }}>{time}</div>
          <div style={{ fontSize:14, color:'rgba(0,0,0,0.45)', marginTop:6 }}>{mo} {day}</div>
          <div style={{ fontSize:13, color:'rgba(0,0,0,0.4)', marginTop:3, fontWeight:600 }}>{field}</div>
        </div>

        {/* CENTER divider */}
        <div style={{ width:1, background:'rgba(255,255,255,0.07)', flexShrink:0 }} />

        {/* FAR RIGHT — GAMEDAY button */}
        <div style={{ width:130, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px 16px' }}>
          <button onClick={()=>setShowGameday(true)} className="btn-outline" style={{ fontSize:13, fontWeight:700, padding:'11px 16px', whiteSpace:'nowrap', width:'100%', textAlign:'center' }}>GAMEDAY</button>
        </div>
      </div>
    </>
  )
}
