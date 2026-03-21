import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'
import { fakeHE } from '../data/pitchers'
import { BoxScoreModal, RecapModal } from './GameModals'

export default function GameCardGrid({ game, showFullName = false }) {
  const [modal, setModal] = useState(null)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const done = game.status === 'final'
  const aWin = done && game.awayScore > game.homeScore
  const hWin = done && game.homeScore > game.awayScore
  const seed = (game.id||'').length + (game.away?.charCodeAt(0)||0)
  const awayHE = done ? fakeHE(game.awayScore, seed) : null
  const homeHE = done ? fakeHE(game.homeScore, seed+3) : null

  if (!done) return null // grid only for final games

  return (
    <>
      {modal==='boxscore' && <BoxScoreModal game={game} onClose={()=>setModal(null)} />}
      {modal==='recap'    && <RecapModal    game={game} onClose={()=>setModal(null)} />}

      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {/* FINAL badge */}
        <div style={{ padding:'10px 16px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)' }}>FINAL</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>{game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()}</span>
        </div>

        {/* Teams + scores */}
        <div style={{ padding:'10px 16px', flex:1 }}>
          {/* R H E header */}
          <div style={{ display:'flex', alignItems:'center', marginBottom:6 }}>
            <div style={{ flex:1 }} />
            {['R','H','E'].map(l => (
              <span key={l} style={{ width:40, textAlign:'center', fontSize:10, fontWeight:700, letterSpacing:'.1em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase' }}>{l}</span>
            ))}
          </div>

          {/* Away row */}
          {[
            {t:game.away, team:away, score:game.awayScore, he:awayHE, won:aWin},
            {t:game.home, team:home, score:game.homeScore, he:homeHE, won:hWin},
          ].map((side, i) => (
            <div key={side.t} style={{ display:'flex', alignItems:'center', marginBottom:i===0?8:0 }}>
              {/* Badge */}
              <div style={{ width:38, height:38, borderRadius:8, background:(side.team?.color||'#6b7280')+'22', border:'2px solid '+(side.team?.color||'#6b7280'), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginRight:8 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:11, color:side.team?.color||'var(--white)', textTransform:'uppercase' }}>{side.t?.slice(0,4)}</span>
              </div>
              {/* Name + record */}
              <div style={{ flex:1, minWidth:0 }}>
                <Link to={'/teams/'+(side.team?.id||side.t.toLowerCase())} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:side.won?900:600, fontSize:showFullName?18:26, textTransform:'uppercase', color:side.won?'var(--white)':'var(--muted)', textDecoration:'none', lineHeight:1, display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {showFullName ? (side.team?.name||side.t) : side.t}
                </Link>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginTop:2 }}>({side.team?.w}-{side.team?.l})</div>
              </div>
              {/* R H E */}
              {[side.score, side.he?.h, side.he?.e].map((val,vi) => (
                <span key={vi} style={{ width:40, textAlign:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:vi===0&&side.won?900:400, fontSize:vi===0?40:24, lineHeight:1, color:vi===2?'rgba(255,255,255,0.25)':side.won?'var(--white)':'rgba(255,255,255,0.3)' }}>{val}</span>
              ))}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'0 16px' }} />

        {/* Buttons */}
        <div style={{ display:'flex', gap:0 }}>
          <button onClick={()=>setModal('recap')} style={{ flex:1, background:'none', border:'none', borderRight:'1px solid rgba(255,255,255,0.06)', cursor:'pointer', padding:'12px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--gold)', borderTop:'1px solid rgba(0,0,0,0.06)' }}>RECAP</button>
          <button onClick={()=>setModal('boxscore')} style={{ flex:1, background:'none', border:'none', cursor:'pointer', padding:'12px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'.06em', textTransform:'uppercase', color:'var(--gold)' }}>BOX SCORE</button>
        </div>
      </div>
    </>
  )
}
