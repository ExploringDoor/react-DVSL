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

const TEAM_W = 150   // team name column — fixed
const STAT_W = 52    // R, H, E columns — fixed

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
        // ── UPCOMING ──────────────────────────────────────
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:2 }}>
          {isNext && <div style={{ padding:'8px 16px 0', fontSize:12, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--gold)' }}>NEXT</div>}
          <div style={{ display:'flex', alignItems:'stretch', flexWrap:'wrap' }}>
            {/* Teams */}
            <div style={{ flex:'1 1 200px', padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
              {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
                <div key={side.t} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <TeamBadge short={side.t} size={32} />
                  <div>
                    <Link to={`/teams/${side.team?.id||side.t.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:20, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block' }}>
                      {side.team?.name || side.t}
                    </Link>
                    {side.team && <div style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Field + time + button */}
            <div style={{ display:'flex', alignItems:'center', gap:0, flexShrink:0, borderLeft:'1px solid var(--border)' }}>
              <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ fontWeight:600, fontSize:14, color:'var(--white)', marginBottom:4, whiteSpace:'nowrap' }}>{field}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:24, color:'var(--gold)', whiteSpace:'nowrap' }}>{time}</div>
              </div>
              <div style={{ padding:'12px 14px', borderLeft:'1px solid var(--border)', display:'flex', alignItems:'center' }}>
                <button onClick={()=>setModal('gameday')} className="btn-outline" style={{ fontSize:12, letterSpacing:'.06em', padding:'7px 12px', whiteSpace:'nowrap' }}>GAMEDAY</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ── FINAL — R/H/E + buttons only, NO pitchers ────
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:2, display:'flex', alignItems:'stretch', flexWrap:'wrap', overflow:'hidden' }}>

          {/* R/H/E section */}
          <div style={{ padding:'12px 14px 10px', flex:'1 1 280px' }}>
            {/* Header aligned to TEAM_W */}
            <div style={{ display:'flex', paddingLeft:TEAM_W, marginBottom:4 }}>
              {['R','H','E'].map(l=>(
                <span key={l} style={{ width:STAT_W, textAlign:'center', fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,0.5)', textTransform:'uppercase' }}>{l}</span>
              ))}
            </div>

            {[
              {t:game.away, team:away, score:game.awayScore, he:awayHE, won:aWin},
              {t:game.home, team:home, score:game.homeScore, he:homeHE, won:hWin},
            ].map((side,i)=>(
              <div key={side.t} style={{ display:'flex', alignItems:'center', marginBottom:i===0?4:0 }}>
                {/* Team — exactly TEAM_W wide */}
                <div style={{ display:'flex', alignItems:'center', gap:6, width:TEAM_W, flexShrink:0 }}>
                  <TeamBadge short={side.t} size={30} />
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <Link to={`/teams/${side.team?.id||side.t}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:side.won?800:400, fontSize:18, textTransform:'uppercase', color:side.won?'var(--white)':'var(--muted)', textDecoration:'none', lineHeight:1 }}>{side.t}</Link>
                      {side.won && <span style={{ fontSize:8, color:'var(--muted)' }}>◄</span>}
                    </div>
                    {side.team && <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
                {/* R H E — each STAT_W wide */}
                {[side.score, side.he?.h, side.he?.e].map((val,vi)=>(
                  <span key={vi} style={{ width:STAT_W, textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:vi===0&&side.won?800:400, fontSize:32, lineHeight:1, color:vi===2?'var(--muted)':side.won?'var(--white)':'var(--muted)' }}>{val}</span>
                ))}
              </div>
            ))}

            <div style={{ paddingLeft:TEAM_W+4, marginTop:6 }}>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>FINAL</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:6, padding:'12px 14px', borderLeft:'1px solid var(--border)', flexShrink:0 }}>
            <button onClick={()=>setModal('recap')} className="btn-outline" style={{ fontSize:12, letterSpacing:'.04em', padding:'7px 14px', whiteSpace:'nowrap' }}>RECAP</button>
            <button onClick={()=>setModal('boxscore')} className="btn-outline" style={{ fontSize:12, letterSpacing:'.04em', padding:'7px 14px', whiteSpace:'nowrap' }}>BOX SCORE</button>
          </div>
        </div>
      )}
    </>
  )
}
