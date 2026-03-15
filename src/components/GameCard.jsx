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

const TEAM_W = 180
const STAT_W = 64

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

  return (
    <>
      {modal==='boxscore' && <BoxScoreModal game={game} onClose={()=>setModal(null)} />}
      {modal==='recap'    && <RecapModal    game={game} onClose={()=>setModal(null)} />}
      {modal==='gameday'  && <GamedayModal  game={game} onClose={()=>setModal(null)} />}

      {!done ? (
        // ── UPCOMING ──
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:2 }}>
          {isNext && <div style={{ padding:'6px 16px 0', fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--gold)' }}>NEXT</div>}
          <div style={{ display:'flex', alignItems:'stretch' }}>
            {/* Teams */}
            <div style={{ flex:'0 1 auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:6 }}>
              {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
                <div key={side.t} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <TeamBadge short={side.t} size={34} />
                  <div>
                    <Link to={`/teams/${side.team?.id||side.t.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:24, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block' }}>
                      {side.team?.name || side.t}
                    </Link>
                    {side.team && <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Field + time + GAMEDAY — tight together */}
            <div style={{ display:'flex', alignItems:'center', borderLeft:'1px solid var(--border)', flexShrink:0 }}>
              <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ fontWeight:600, fontSize:13, color:'var(--white)', marginBottom:3, whiteSpace:'nowrap' }}>{field}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:'var(--gold)', whiteSpace:'nowrap' }}>{time}</div>
              </div>
              <div style={{ padding:'12px 14px', borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center', flexShrink:0 }}>
                <button onClick={()=>setModal('gameday')} className="btn-outline" style={{ fontSize:13, fontWeight:700, padding:'8px 16px', whiteSpace:'nowrap' }}>GAMEDAY</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ── FINAL ──
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:2, display:'flex', alignItems:'stretch', overflow:'hidden', width:'fit-content', minWidth:'100%' }}>
          {/* R/H/E */}
          <div style={{ padding:'14px 14px 10px', flexShrink:0 }}>
            <div style={{ display:'flex', paddingLeft:TEAM_W, marginBottom:6 }}>
              {['R','H','E'].map(l=>(
                <span key={l} style={{ width:STAT_W, textAlign:'center', fontSize:12, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,0.45)', textTransform:'uppercase' }}>{l}</span>
              ))}
            </div>
            {[
              {t:game.away,team:away,score:game.awayScore,he:awayHE,won:aWin},
              {t:game.home,team:home,score:game.homeScore,he:homeHE,won:hWin},
            ].map((side,i)=>(
              <div key={side.t} style={{ display:'flex', alignItems:'center', marginBottom:i===0?6:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, width:TEAM_W, flexShrink:0 }}>
                  <TeamBadge short={side.t} size={36} />
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <Link to={`/teams/${side.team?.id||side.t}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:side.won?900:400, fontSize:26, textTransform:'uppercase', color:side.won?'var(--white)':'var(--muted)', textDecoration:'none', lineHeight:1 }}>{side.t}</Link>
                      {side.won && <span style={{ fontSize:9, color:'var(--muted)' }}>◄</span>}
                    </div>
                    {side.team && <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
                {[side.score, side.he?.h, side.he?.e].map((val,vi)=>(
                  <span key={vi} style={{ width:STAT_W, textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:vi===0&&side.won?900:400, fontSize:44, lineHeight:1, color:vi===2?'var(--muted)':side.won?'var(--white)':'rgba(255,255,255,0.35)' }}>{val}</span>
                ))}
              </div>
            ))}
            <div style={{ paddingLeft:TEAM_W+4, marginTop:6 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>FINAL</span>
            </div>
          </div>

          {/* Buttons — right next to scores */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:8, padding:'14px 16px', borderLeft:'1px solid var(--border)', flexShrink:0 }}>
            <button onClick={()=>setModal('recap')} className="btn-outline" style={{ fontSize:13, fontWeight:700, padding:'8px 16px', whiteSpace:'nowrap' }}>RECAP</button>
            <button onClick={()=>setModal('boxscore')} className="btn-outline" style={{ fontSize:13, fontWeight:700, padding:'8px 16px', whiteSpace:'nowrap' }}>BOX SCORE</button>
          </div>
        </div>
      )}
    </>
  )
}
