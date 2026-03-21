import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import { fakeHE } from '../data/pitchers'
import TeamBadge from './TeamBadge'
import { BoxScoreModal, RecapModal, GamedayModal } from './GameModals'

function cleanField(f) {
  return f?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i, '').trim() || f
}
function parseTime(f) {
  const m = f?.match(/([\d:]+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const [,t,p] = m
  return `${t}${t.includes(':') ? '' : ':00'} ${p.toUpperCase()}`
}

// Fixed column widths — header and rows must match exactly
const TEAM_W = 110   // team name+badge column
const STAT_W = 50    // each stat column (R, H, E)

export default function GameCard({ game, isNext = false }) {
  const [modal, setModal] = useState(null)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const done = game.status === 'final'
  const aWin = done && game.awayScore > game.homeScore
  const hWin = done && game.homeScore > game.awayScore
  const seed = (game.id||'').length + (game.away?.charCodeAt(0)||0)
  const awayHE = done ? fakeHE(game.awayScore, seed) : null
  const homeHE = done ? fakeHE(game.homeScore, seed+3) : null
  const field = cleanField(game.field)
  const time  = parseTime(game.field)
  const [mon, day] = (game.date||'').split(' ')
  const mo = {April:'Apr',May:'May',June:'Jun',July:'Jul',August:'Aug'}[mon]||mon

  return (
    <>
      {modal==='boxscore' && <BoxScoreModal game={game} onClose={()=>setModal(null)} />}
      {modal==='recap'    && <RecapModal    game={game} onClose={()=>setModal(null)} />}
      {modal==='gameday'  && <GamedayModal  game={game} onClose={()=>setModal(null)} />}

      {!done ? (
        // ── UPCOMING ──────────────────────────────────────────────────────
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderLeft: isNext ? '3px solid var(--gold)' : '1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:6 }}>
          {isNext && <div style={{ padding:'6px 16px 0', fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--gold)' }}>▶ NEXT</div>}
          <div style={{ display:'flex', alignItems:'stretch' }}>
            {/* Teams — fixed 300px */}
            <div style={{ flex:'1 1 160px', minWidth:0, padding:'12px 12px', display:'flex', flexDirection:'column', gap:6 }}>
              {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
                <div key={side.t} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32, height:32, borderRadius:6, background:`${side.team?.color||'#6b7280'}22`, border:`2px solid ${side.team?.color||'#6b7280'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:9, color:side.team?.color||'var(--white)', textTransform:'uppercase' }}>{side.t?.slice(0,4)}</span>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <Link to={`/teams/${side.team?.id||side.t.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {side.team?.name || side.t}
                    </Link>
                    {side.team && <div style={{ fontSize:11, color:'rgba(0,0,0,0.35)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Time — fixed 120px */}
            <div style={{ width:115, flexShrink:0, borderLeft:'1px solid var(--border)', padding:'12px 10px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:'var(--gold)', lineHeight:1 }}>{time}</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,0.4)', marginTop:4 }}>{mo} {day}</div>
              <div style={{ fontSize:12, color:'rgba(0,0,0,0.45)', marginTop:2, fontWeight:600 }}>{field}</div>
            </div>
            {/* GAMEDAY — fixed 110px */}
            <div style={{ width:100, flexShrink:0, borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', padding:'12px 10px' }}>
              <button onClick={()=>setModal('gameday')} className="btn-outline" style={{ fontSize:11, fontWeight:700, padding:'7px 8px', whiteSpace:'nowrap', width:'100%', textAlign:'center' }}>GAMEDAY</button>
            </div>
          </div>
        </div>
      ) : (
        // ── FINAL ─────────────────────────────────────────────────────────
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:6, display:'flex', alignItems:'stretch', overflow:'hidden' }}>
          {/* RHE section — tight fixed widths */}
          <div style={{ padding:'12px 10px 10px', flex:'1 1 auto', minWidth:0, overflow:'hidden' }}>
            {/* Header */}
            <div style={{ display:'flex', paddingLeft:TEAM_W, marginBottom:4 }}>
              {['R','H','E'].map(l=>(
                <span key={l} style={{ width:STAT_W, textAlign:'center', fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(0,0,0,0.35)', textTransform:'uppercase' }}>{l}</span>
              ))}
            </div>
            {/* Rows */}
            {[
              {t:game.away,team:away,score:game.awayScore,he:awayHE,won:aWin},
              {t:game.home,team:home,score:game.homeScore,he:homeHE,won:hWin},
            ].map((side,i)=>(
              <div key={side.t} style={{ display:'flex', alignItems:'center', marginBottom:i===0?4:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, width:TEAM_W, flexShrink:0 }}>
                  <TeamBadge short={side.t} size={30} />
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <Link to={`/teams/${side.team?.id||side.t}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:side.won?900:400, fontSize:'clamp(16px,2vw,26px)', textTransform:'uppercase', color:side.won?'var(--white)':'var(--muted)', textDecoration:'none', lineHeight:1 }}>{side.t}</Link>
                      {side.won && <span style={{ fontSize:8, color:'var(--muted)' }}>◄</span>}
                    </div>
                    {side.team && <div style={{ fontSize:10, color:'rgba(0,0,0,0.35)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
                {[side.score, side.he?.h, side.he?.e].map((val,vi)=>(
                  <span key={vi} style={{ width:STAT_W, textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:vi===0&&side.won?900:400, fontSize:'clamp(22px,4vw,52px)', lineHeight:1, color:vi===2?'var(--muted)':side.won?'var(--white)':'rgba(0,0,0,0.3)' }}>{val}</span>
                ))}
              </div>
            ))}
            <div style={{ paddingLeft:TEAM_W+4, marginTop:4 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(0,0,0,0.3)' }}>FINAL</span>
            </div>
          </div>
          {/* Buttons — right next to RHE */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:5, padding:'10px 8px', borderLeft:'1px solid var(--border)', flexShrink:0 }}>
            <button onClick={()=>setModal('recap')} className="btn-outline" style={{ fontSize:11, fontWeight:700, padding:'6px 8px', whiteSpace:'nowrap' }}>RECAP</button>
            <button onClick={()=>setModal('boxscore')} className="btn-outline" style={{ fontSize:11, fontWeight:700, padding:'5px 8px', whiteSpace:'nowrap' }}>BOX SCORE</button>
          </div>
        </div>
      )}
    </>
  )
}
