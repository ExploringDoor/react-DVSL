import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import { getPitcher, fakeHE } from '../data/pitchers'
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

function PitcherBadge({ short, size = 40 }) {
  const team = getTeamByShort(short)
  const color = team?.color || '#6b7280'
  return (
    <div style={{ width:size, height:size, borderRadius:'22%', background:`${color}28`, border:`2px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:size*0.25, color, flexShrink:0 }}>
      {short?.slice(0,4)}
    </div>
  )
}

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
  const winTeam  = aWin ? game.away : game.home
  const lossTeam = aWin ? game.home : game.away
  const winP  = done ? getPitcher(winTeam)  : null
  const lossP = done ? getPitcher(lossTeam) : null
  const field = cleanField(game.field)
  const time  = parseTime(game.field)

  return (
    <>
      {modal==='boxscore' && <BoxScoreModal game={game} onClose={()=>setModal(null)} />}
      {modal==='recap'    && <RecapModal    game={game} onClose={()=>setModal(null)} />}
      {modal==='gameday'  && <GamedayModal  game={game} onClose={()=>setModal(null)} />}

      {!done ? (
        // ── UPCOMING — time shown once, no duplication ──
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, overflow:'hidden', marginBottom:2 }}>
          {isNext && <div style={{ padding:'8px 20px 0', fontSize:13, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--gold)' }}>NEXT</div>}
          <div style={{ display:'flex', alignItems:'stretch' }}>
            {/* Teams */}
            <div style={{ flex:1, padding:'14px 20px', display:'flex', flexDirection:'column', gap:8 }}>
              {[{t:game.away,team:away},{t:game.home,team:home}].map(side=>(
                <div key={side.t} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <TeamBadge short={side.t} size={34} />
                  <div>
                    <Link to={`/teams/${side.team?.id||side.t.toLowerCase()}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:22, textTransform:'uppercase', color:side.team?.color||'var(--white)', textDecoration:'none', lineHeight:1, display:'block' }}>
                      {side.team?.name || side.t}
                    </Link>
                    {side.team && <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Field + time — ONCE only */}
            <div style={{ borderLeft:'1px solid var(--border)', padding:'14px 24px', display:'flex', flexDirection:'column', justifyContent:'center', minWidth:160 }}>
              <div style={{ fontWeight:700, fontSize:16, color:'var(--white)', marginBottom:6 }}>{field}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:'var(--gold)' }}>{time}</div>
            </div>
            {/* GAMEDAY button only */}
            <div style={{ borderLeft:'1px solid var(--border)', padding:'14px 20px', display:'flex', alignItems:'center' }}>
              <button onClick={()=>setModal('gameday')} className="btn-outline" style={{ fontSize:13, letterSpacing:'.08em' }}>GAMEDAY</button>
            </div>
          </div>
        </div>
      ) : (
        // ── FINAL ──
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:10, marginBottom:2, display:'flex', alignItems:'stretch', overflow:'hidden' }}>
          {/* R/H/E */}
          <div style={{ padding:'12px 14px 10px', width:310, flexShrink:0 }}>
            <div style={{ display:'flex', paddingLeft:46, marginBottom:6 }}>
              {['R','H','E'].map(l=>(
                <span key={l} style={{ width:50, textAlign:'center', fontSize:11, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,0.5)', textTransform:'uppercase' }}>{l}</span>
              ))}
            </div>
            {[
              {t:game.away,team:away,score:game.awayScore,he:awayHE,won:aWin},
              {t:game.home,team:home,score:game.homeScore,he:homeHE,won:hWin},
            ].map((side,i)=>(
              <div key={side.t} style={{ display:'flex', alignItems:'center', marginBottom:i===0?4:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, width:136, flexShrink:0 }}>
                  <TeamBadge short={side.t} size={32} />
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <Link to={`/teams/${side.team?.id||side.t}`} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:side.won?800:400, fontSize:20, textTransform:'uppercase', color:side.won?'var(--white)':'var(--muted)', textDecoration:'none', lineHeight:1 }}>{side.t}</Link>
                      {side.won && <span style={{ fontSize:8, color:'var(--muted)' }}>◄</span>}
                    </div>
                    {side.team && <div style={{ fontSize:10, color:'rgba(255,255,255,0.45)', marginTop:1 }}>({side.team.w}-{side.team.l})</div>}
                  </div>
                </div>
                {[side.score,side.he?.h,side.he?.e].map((val,vi)=>(
                  <span key={vi} style={{ width:50, textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:vi===0&&side.won?800:400, fontSize:34, lineHeight:1, color:vi===2?'var(--muted)':side.won?'var(--white)':'var(--muted)' }}>{val}</span>
                ))}
              </div>
            ))}
            <div style={{ paddingLeft:38, marginTop:6 }}>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.4)' }}>FINAL</span>
            </div>
          </div>

          {/* WIN/LOSS — moved closer to buttons */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', padding:'12px 16px', borderLeft:'1px solid var(--border)', flex:1, gap:10 }}>
            {[{role:'WIN',p:winP,short:winTeam},{role:'LOSS',p:lossP,short:lossTeam}].map(({role,p,short})=>(
              <div key={role} style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.08em', color:'rgba(255,255,255,0.45)', width:28, flexShrink:0 }}>{role}</span>
                <PitcherBadge short={short} size={38} />
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:'var(--white)', lineHeight:1.2 }}>{p?.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', marginTop:1, whiteSpace:'nowrap' }}>{p?.wl} · {p?.era} ERA</div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons — tight */}
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:6, padding:'12px 14px', borderLeft:'1px solid var(--border)', flexShrink:0 }}>
            <button onClick={()=>setModal('recap')} className="btn-outline" style={{ fontSize:12, letterSpacing:'.04em', padding:'6px 14px', whiteSpace:'nowrap' }}>RECAP</button>
            <button onClick={()=>setModal('boxscore')} className="btn-outline" style={{ fontSize:12, letterSpacing:'.04em', padding:'6px 14px', whiteSpace:'nowrap' }}>BOX SCORE</button>
          </div>
        </div>
      )}
    </>
  )
}
