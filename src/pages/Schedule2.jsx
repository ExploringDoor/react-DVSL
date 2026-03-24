import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { WEEKS } from '../data/games'
import { getTeamByShort } from '../data/teams'
import { GamedayModal, BoxScoreModal, RecapModal } from '../components/GameModals'

function cleanField(f) {
  if (!f) return ''
  return f.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i, '').trim()
}
function parseTime(f) {
  if (!f) return '7:30 PM'
  const m = f.match(/(\d+:\d+|\d+)\s*(am|pm)/i)
  if (!m) return '7:30 PM'
  const t = m[1], p = m[2].toUpperCase()
  return t.includes(':') ? t + ' ' + p : t + ':00 ' + p
}

function GameRow({ game }) {
  const [modal, setModal] = useState(null)
  const away = getTeamByShort(game.away)
  const home = getTeamByShort(game.home)
  const isFinal = game.status === 'final'
  const field = cleanField(game.field)
  const time = parseTime(game.field)

  return (
    <>
      {modal === 'gameday'   && <GamedayModal   game={game} onClose={() => setModal(null)} />}
      {modal === 'boxscore'  && <BoxScoreModal  game={game} onClose={() => setModal(null)} />}
      {modal === 'recap'     && <RecapModal     game={game} onClose={() => setModal(null)} />}

      <div className="game-card-hover" style={{
        background:'#fff', border:'1px solid rgba(0,0,0,0.09)',
        borderTop:'3px solid #0057FF', borderRadius:12,
        overflow:'hidden', marginBottom:10,
        display:'flex', alignItems:'stretch',
      }}>
        {/* Teams */}
        <div style={{ flex:1, padding:'14px 18px', display:'flex', flexDirection:'column', gap:10 }}>
          {[{t:game.away,team:away,score:game.awayR},{t:game.home,team:home,score:game.homeR}].map((side,i) => {
            const won = isFinal && (i===0 ? game.awayR > game.homeR : game.homeR > game.awayR)
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:40, height:40, borderRadius:9, background:(side.team?.color||'#6b7280')+'18', border:'2px solid '+(side.team?.color||'#6b7280'), display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:10, color:side.team?.color||'#333', textTransform:'uppercase' }}>{(side.t||'').slice(0,4)}</span>
                </div>
                <div style={{ minWidth:0, flex:1 }}>
                  <Link to={'/teams/'+(side.team?.id||side.t.toLowerCase())} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, textTransform:'uppercase', color:side.team?.color||'#111', textDecoration:'none', lineHeight:1, display:'block' }}>
                    {side.team?.name||side.t}
                  </Link>
                  <span style={{ fontSize:12, color:'rgba(0,0,0,0.4)' }}>({side.team?.w}-{side.team?.l})</span>
                </div>
                {isFinal && (
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:won?38:26, color:won?'#111':'#bbb', lineHeight:1, flexShrink:0 }}>
                    {side.score}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right */}
        {isFinal ? (
          <div style={{ display:'flex', flexDirection:'column', borderLeft:'1px solid rgba(0,0,0,0.07)', flexShrink:0 }}>
            <button onClick={()=>setModal('recap')} style={{ flex:1, background:'#0057FF', border:'none', borderBottom:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', padding:'0 20px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'.06em', textTransform:'uppercase', color:'#fff', whiteSpace:'nowrap' }}>RECAP</button>
            <button onClick={()=>setModal('boxscore')} style={{ flex:1, background:'#0057FF', border:'none', cursor:'pointer', padding:'0 20px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'.06em', textTransform:'uppercase', color:'#fff', whiteSpace:'nowrap' }}>BOX SCORE</button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', borderLeft:'1px solid rgba(0,0,0,0.07)', padding:'14px 20px', flexShrink:0, gap:4 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:'#0057FF', lineHeight:1 }}>{time}</div>
            <div style={{ fontSize:12, color:'rgba(0,0,0,0.5)', fontWeight:600 }}>{field}</div>
            <button onClick={()=>setModal('gameday')} className="btn-outline btn-gameday-pulse" style={{ fontSize:11, fontWeight:700, padding:'6px 12px', marginTop:4, whiteSpace:'nowrap' }}>GAMEDAY</button>
          </div>
        )}
      </div>
    </>
  )
}

// Pure CSS scroll-driven line fill using IntersectionObserver
function TimelineLine({ containerRef }) {
  const lineRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const line = lineRef.current
    if (!container || !line) return

    const onScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowH = window.innerHeight
      const total = rect.height
      const scrolled = Math.max(0, windowH * 0.1 - rect.top)
      const pct = Math.min(1, scrolled / (total * 0.9))
      line.style.height = (pct * 100) + '%'
      line.style.opacity = pct > 0.01 ? '1' : '0'
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{ position:'absolute', left:157, top:0, bottom:0, width:2, background:'rgba(0,0,0,0.07)', overflow:'hidden' }}>
      <div ref={lineRef} style={{ width:2, height:'0%', background:'linear-gradient(to bottom, #0057FF, #00c8ff)', borderRadius:2, boxShadow:'0 0 8px rgba(0,87,255,0.4)', opacity:0, transition:'height 0.1s linear' }} />
    </div>
  )
}

export default function Schedule2() {
  const containerRef = useRef(null)

  const timelineData = WEEKS.map(w => {
    const parts = (w.date || '').split(' ')
    return {
      wk: w.wk,
      month: parts[0] || '',
      day: parts[1] || '',
      date: w.date,
      games: w.games || [],
      hasGames: (w.games || []).length > 0,
    }
  })

  return (
    <div style={{ background:'#f2f4f8', minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'3px solid #0057FF', padding:'28px clamp(16px,4vw,48px) 24px' }}>
        <div style={{ maxWidth:1040, margin:'0 auto', display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#0057FF', marginBottom:4 }}>2026 Season</div>
            <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:'clamp(32px,6vw,52px)', textTransform:'uppercase', color:'#111', lineHeight:1 }}>Full Schedule</h1>
          </div>
          <Link to="/schedule" style={{ fontSize:13, fontWeight:700, color:'#0057FF', textDecoration:'none' }}>← Classic View</Link>
        </div>
      </div>

      <div style={{ maxWidth:1040, margin:'0 auto', padding:'32px clamp(16px,4vw,32px) 80px' }}>
        <div ref={containerRef} style={{ position:'relative' }}>
          <TimelineLine containerRef={containerRef} />

          {timelineData.map((item, index) => (
            <div key={index} style={{ display:'flex', gap:0, paddingTop: index === 0 ? 0 : 40 }}>

              {/* LEFT — date */}
              <div style={{ width:160, flexShrink:0, position:'sticky', top:80, alignSelf:'flex-start', display:'flex', flexDirection:'column', alignItems:'flex-end', paddingRight:28, paddingTop:4 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:48, color:item.hasGames?'#0057FF':'#ccc', lineHeight:1 }}>{item.day}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, color:item.hasGames?'#444':'#ccc', marginTop:1 }}>{item.month}</div>
                {item.wk !== 'A' && item.wk !== 'B' && (
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', color:'#aaa', textTransform:'uppercase', marginTop:4 }}>WK {item.wk}</div>
                )}
                {/* dot */}
                <div style={{ width:12, height:12, borderRadius:'50%', background:item.hasGames?'#0057FF':'#ccc', border:'3px solid #f2f4f8', boxShadow:item.hasGames?'0 0 0 3px rgba(0,87,255,0.18)':'none', marginTop:10, position:'relative', zIndex:2 }} />
              </div>

              {/* RIGHT — games */}
              <div style={{ flex:1, minWidth:0, paddingLeft:24 }}>
                {item.games.length > 0
                  ? item.games.map(g => <GameRow key={g.id} game={g} />)
                  : <div style={{ background:'#fff', border:'1px dashed rgba(0,0,0,0.1)', borderRadius:10, padding:'14px 20px', color:'#ccc', fontSize:13 }}>No games this week</div>
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
