import { useState } from 'react'
import { getTeamByShort } from '../data/teams'
import { getPitcher } from '../data/pitchers'
import { STATS, fmtAvg } from '../data/stats'
import { Link } from 'react-router-dom'

// ── Helpers ──────────────────────────────────────────────────────────────────

// Generate 7-inning line score that sums to total runs
function genInnings(totalRuns, seed) {
  const innings = Array(7).fill(0)
  let left = totalRuns
  for (let i = 0; i < 7; i++) {
    if (left === 0) break
    const isLast = i === 6
    const r = isLast ? left : Math.min(left, ((seed + i * 13) % 4))
    innings[i] = r
    left -= r
  }
  return innings
}

function genBoxScore(game) {
  const rosterNames = {
    GOLD:['Mike Goldstein','David Levy','Aaron Rosen','Josh Weinberg','Ethan Katz','Ben Abrams','Noah Schwartz','Sam Rubin','Zach Feldman','Ari Blum','Danny Fox','Lev Cohen'],
    SA:  ['Carlos Rivera','Tony DeLuca','Pete DiNunzio','Ray Kowalski','Lou DiMaggio','Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario'],
    KI:  ['Kevin Park','Brian Kim','Danny Ito','Sam Levy','Barry Kahn','Josh Cohen','Neil Katz','Rob Frankel','Jake Robbins'],
    BOB: ['Bobby Marchetti','Tony Greco','Chris Rosario','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz','Bob Weiner'],
    TBIR:['Tom Birnbaum','Jake Robbins','Abe Stern','Phil Grossman','Steve Rubin','Jeff Landau','Gary Rubin','Marty Fein','Larry Weiss'],
    AJ:  ['Al Jacobs','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
    BA1: ['Marcus Williams','David Cohen','Ray Santos','Jake Miller','Eric Goldberg','Tom Levine','Steve Katz','Andy Rubin','Pete Shapiro'],
    BOR: ['Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz'],
    TBI1:['Marco Vitale','Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum'],
    GJC: ['Sal Bianchi','Tony Greco','Chris Rosario','Bobby Marchetti','Phil Stern','Marco Vitale','Danny Ito','Sam Levy','Barry Kahn'],
    TI:  ['Jake Robbins','Phil Grossman','Steve Rubin','Jeff Landau','Gary Rubin','Marty Fein','Larry Weiss','Paul Silverman','Marty Drexler'],
    KA:  ['Marty Drexler','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
    TSMC:['Rob Zwick','Lenny Gross','Rich Herman','Norm Seidel','Andy Katz','Bob Weiner','Hal Brody','Chuck Levy','Dave Rubin'],
    BSMC:['Andy Katz','Bob Weiner','Hal Brody','Chuck Levy','Dave Rubin','Phil Weiss','Norm Shapiro','Arnie Gold','Mel Schwartz'],
    BSB: ['Sal Bianco','Dave Stein','Tom Birnbaum','Andy Katz','Bob Weiner','Phil Weiss','Norm Shapiro','Arnie Gold','Mel Schwartz'],
    BAMI:['Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Dave Stein','Tom Birnbaum'],
    BOO: ['Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz'],
    OS:  ['Marty Drexler','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
  }
  const POSITIONS = ['CF','SS','1B','LF','3B','RF','2B','C','DH','P','LF','RF']
  const fallback = ['Player A','Player B','Player C','Player D','Player E','Player F','Player G','Player H','Player I']

  function buildTeam(short, totalRuns, totalHits) {
    const names = rosterNames[short] || fallback
    const n = Math.min(names.length, 9)
    let hLeft = totalHits, rLeft = totalRuns
    return names.slice(0, n).map((name, i) => {
      const pos = POSITIONS[i] || 'OF'
      const ab = 3 + (i % 2)
      const isLast = i === n - 1
      const h = isLast ? Math.max(0, hLeft) : Math.min(Math.floor(Math.random() * 3), hLeft, ab)
      hLeft -= h
      const r = isLast ? Math.max(0, rLeft) : (h > 0 && rLeft > 0 && Math.random() > 0.5 ? 1 : 0)
      rLeft = Math.max(0, rLeft - r)
      const hr = h >= 2 && i % 4 === 0 ? 1 : 0
      const rbi = r > 0 ? r : (hr ? 1 : 0)
      const bb = i % 3 === 0 ? 1 : 0
      const avg = ab > 0 ? (h / ab) : 0
      // Season stats (boosted)
      const sAB = 70 + Math.floor(Math.random() * 30)
      const sH  = Math.floor(sAB * (0.28 + Math.random() * 0.25))
      const sHR = Math.floor(Math.random() * 10)
      const sRBI= sH + sHR * 2
      const sAvg = sAB > 0 ? sH / sAB : 0
      return { name, pos, ab, h: Math.max(0,h), r: Math.max(0,r), rbi, hr, bb,
               avg: ab > 0 ? h/ab : 0,
               seasonAvg: sAvg, seasonHR: sHR, seasonRBI: sRBI }
    })
  }

  const awayH = Math.round((game.awayScore||0) * 1.6 + 2)
  const homeH = Math.round((game.homeScore||0) * 1.6 + 1)
  return {
    away: buildTeam(game.away, game.awayScore||0, awayH),
    home: buildTeam(game.home, game.homeScore||0, homeH),
    awayH, homeH,
  }
}

function genRecap(game) {
  const winner = (game.awayScore||0) > (game.homeScore||0) ? game.away : game.home
  const loser  = (game.awayScore||0) > (game.homeScore||0) ? game.home : game.away
  const ws = Math.max(game.awayScore||0, game.homeScore||0)
  const ls = Math.min(game.awayScore||0, game.homeScore||0)
  const winP = getPitcher(winner)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
  return `${winner} defeated ${loser} ${ws}-${ls} at ${field}. ${winP.name} was dominant on the mound, improving to ${winP.wl} with a ${winP.era} ERA. The offense provided early support, plating runs in multiple innings to build a commanding lead. ${loser} made things interesting late but couldn't convert when it mattered most. ${winner} continues to push for playoff positioning.`
}

function genGamedayPreview(game) {
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const awayP = getPitcher(game.away)
  const homeP = getPitcher(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
  const m = game.field?.match(/([\d:]+)\s*(pm|am)/i)
  const time = m ? `${m[1]}${m[1].includes(':') ? '' : ':00'} ${m[2].toUpperCase()}` : '7:30 PM'
  return { field, time, awayP, homeP,
    awayRecord: `${awayT?.w}-${awayT?.l}`, homeRecord: `${homeT?.w}-${homeT?.l}`,
    storyline: `${game.away} (${awayT?.w}-${awayT?.l}) faces ${game.home} (${homeT?.w}-${homeT?.l}) at ${field}. ${awayP.name} takes the mound for ${game.away} (${awayP.era} ERA) against ${homeP.name} for ${game.home} (${homeP.era} ERA). Expect a tightly contested game as both clubs compete for playoff positioning.`
  }
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────

function Modal({ onClose, children, maxWidth = 900 }) {
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(255,255,255,0.88)',display:'flex',alignItems:'center',justifyContent:'center',padding:'env(safe-area-inset-top, 8px) 8px 8px',overflowY:'auto' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:14,maxWidth,width:'100%',maxHeight:'90vh',overflowY:'auto',position:'relative' }}>
        {children}
      </div>
    </div>
  )
}

// ── Player Card Modal (matches screenshot 1) ──────────────────────────────────

export function PlayerStatsModal({ player, onClose }) {
  if (!player) return null
  const team = getTeamByShort(player.team)
  const initials = player.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()
  const color = team?.color || '#F5C842'

  // Game log - fake but realistic
  const opponents = ['vs KI','vs BOB','vs SA','@ AJ','vs TBIR','@ TSMC','vs GJC','@ TI']
  const gameLog = opponents.map((opp,i) => {
    const ab = 3 + (i%2)
    const h  = Math.floor(Math.random()*3)
    const hr = h>=2 && i%3===0 ? 1 : 0
    const rbi= h + hr
    const bb = i%3===0 ? 1 : 0
    const r  = h>0 ? (Math.random()>0.5?1:0) : 0
    const won= Math.random()>0.4
    const ws = 5+Math.floor(Math.random()*12)
    const ls = 3+Math.floor(Math.random()*8)
    return { opp, ab, h, hr: hr||'—', rbi, bb, r, result: won?`W ${ws}-${ls}`:`L ${ls}-${ws}`, won }
  })

  return (
    <Modal onClose={onClose} maxWidth={700}>
      {/* Close button */}
      <button onClick={onClose} style={{ position:'absolute',top:16,right:16,background:'rgba(0,0,0,0.07)',border:'1px solid rgba(0,0,0,0.12)',borderRadius:8,color:'var(--white)',fontSize:13,fontWeight:700,padding:'8px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>✕ CLOSE</button>

      {/* Header */}
      <div style={{ padding:'28px 28px 20px',borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display:'flex',alignItems:'center',gap:20 }}>
          {/* Avatar circle */}
          <div style={{ width:80,height:80,borderRadius:'50%',background:`${color}15`,border:`2px solid ${color}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:28,color }}>{initials}</span>
          </div>
          <div>
            <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:40,textTransform:'uppercase',color:'var(--white)',lineHeight:1,letterSpacing:'.02em' }}>{player.name}</h1>
            <div style={{ fontSize:14,color:'rgba(0,0,0,0.45)',marginTop:4 }}>
              <span style={{ color:team?.color||'var(--gold)',fontWeight:700 }}>{player.team}</span>
            </div>
            <div style={{ display:'flex',gap:8,marginTop:8 }}>
              <span style={{ background:`${color}15`,border:`1px solid ${color}40`,borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color }}>{player.team} · {team?.name}</span>
              <span style={{ background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.3)',borderRadius:6,padding:'3px 10px',fontSize:11,fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',color:'#22c55e' }}>2026 Season</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ padding:'20px 28px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))',gap:10,marginBottom:24 }}>
          {[
            ['AVG', fmtAvg(player.avg)],
            ['HR',  player.hr],
            ['RBI', player.rbi],
            ['HITS',player.h],
            ['AB',  player.ab],
            ['RUNS',player.r],
            ['BB',  player.bb],
            ['SLG', fmtAvg(player.slg)],
          ].map(([k,v])=>(
            <div key={k} style={{ background:'rgba(0,0,0,0.04)',borderRadius:10,padding:'16px',textAlign:'center' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:38,color:'var(--gold)',lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'rgba(0,0,0,0.35)',textTransform:'uppercase',marginTop:6 }}>{k}</div>
            </div>
          ))}
        </div>

        {/* Game log */}
        <div style={{ fontSize:13,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold)',marginBottom:12 }}>Game Log</div>
        <div style={{ background:'rgba(0,0,0,0.03)',borderRadius:10,overflow:'hidden' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1.2fr repeat(6,1fr) 1.4fr',padding:'8px 16px',borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            {['OPPONENT','AB','H','HR','RBI','BB','R','RESULT'].map(h=>(
              <span key={h} style={{ fontSize:10,fontWeight:700,letterSpacing:'.1em',color:'rgba(0,0,0,0.3)',textTransform:'uppercase',textAlign:h==='OPPONENT'?'left':'center' }}>{h}</span>
            ))}
          </div>
          {gameLog.map((g,i)=>(
            <div key={i} style={{ display:'grid',gridTemplateColumns:'1.2fr repeat(6,1fr) 1.4fr',padding:'10px 16px',borderBottom:'1px solid rgba(0,0,0,0.04)',background:i%2===0?'transparent':'rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize:13,color:'var(--white)',fontWeight:500 }}>{g.opp}</span>
              {[g.ab,g.h,g.hr,g.rbi,g.bb,g.r].map((v,vi)=>(
                <span key={vi} style={{ fontSize:13,color:'rgba(0,0,0,0.5)',textAlign:'center',fontFamily:"'Barlow Condensed',sans-serif" }}>{v}</span>
              ))}
              <span style={{ fontSize:12,fontWeight:700,textAlign:'center',color:g.won?'#22c55e':'#ef4444',background:g.won?'rgba(34,197,94,0.15)':'rgba(239,68,68,0.15)',borderRadius:6,padding:'2px 8px',justifySelf:'center' }}>{g.result}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

// ── Box Score Modal (matches screenshot 2) ────────────────────────────────────

export function BoxScoreModal({ game, onClose }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const { away, home, awayH, homeH } = genBoxScore(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  const fmtA = (n) => typeof n === 'number' ? n.toFixed(3).replace(/^0/,'.') : n

  function TeamBattingTable({ players, teamShort, color }) {
    return (
      <div style={{ flex:'1 1 300px',minWidth:0 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color,textTransform:'uppercase' }}>{teamShort}</span>
          <span style={{ fontSize:13,color:'rgba(0,0,0,0.35)',cursor:'pointer' }}>↗</span>
        </div>
        <div style={{ background:'rgba(0,0,0,0.04)',borderRadius:8,overflow:'hidden' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr auto auto auto',padding:'8px 12px',borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
            {['PLAYER','AVG','HR','RBI'].map(h=>(
              <span key={h} style={{ fontSize:10,fontWeight:700,letterSpacing:'.08em',color:'rgba(0,0,0,0.3)',textTransform:'uppercase',textAlign:h==='PLAYER'?'left':'right' }}>{h}</span>
            ))}
          </div>
          {players.map((p,i)=>(
            <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr auto auto auto',padding:'8px 12px',borderBottom:'1px solid rgba(0,0,0,0.04)',background:i%2===0?'transparent':'rgba(0,0,0,0.01)',cursor:'pointer' }}
              onClick={() => setSelectedPlayer({...p, team: teamShort, avg: p.seasonAvg, hr: p.seasonHR, rbi: p.seasonRBI, h: Math.round(p.seasonAvg * 70), ab: 70, r: Math.round(p.seasonHR * 2 + 5), bb: 8, slg: p.seasonAvg * 1.5, doubles: 4, triples: 1, so: 5, sb: 2 })}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.04)'}
              onMouseLeave={e=>e.currentTarget.style.background=i%2===0?'transparent':'rgba(0,0,0,0.01)'}
            >
              <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                <span style={{ fontWeight:600,fontSize:14,color:'var(--white)',textDecoration:'underline',textDecorationColor:'rgba(0,0,0,0.15)',textUnderlineOffset:3 }}>{p.name}</span>
                <span style={{ fontSize:10,color:'rgba(0,0,0,0.3)' }}>{p.pos}</span>
              </div>
              <span style={{ fontSize:13,color:'var(--gold)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textAlign:'right' }}>{fmtA(p.seasonAvg)}</span>
              <span style={{ fontSize:13,color:'rgba(0,0,0,0.5)',fontFamily:"'Barlow Condensed',sans-serif",textAlign:'right',paddingLeft:16 }}>{p.seasonHR}</span>
              <span style={{ fontSize:13,color:'rgba(0,0,0,0.5)',fontFamily:"'Barlow Condensed',sans-serif",textAlign:'right',paddingLeft:16 }}>{p.seasonRBI}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {selectedPlayer && <PlayerStatsModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
      <Modal onClose={onClose} maxWidth={960}>
        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute',top:14,right:14,background:'rgba(0,0,0,0.07)',border:'1px solid rgba(0,0,0,0.12)',borderRadius:8,color:'var(--white)',fontSize:18,fontWeight:400,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>

        {/* Hero score header */}
        <div style={{ padding:'24px clamp(12px,4vw,40px) 20px',textAlign:'center',borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:32 }}>
            {/* Away */}
            <div style={{ flex:1,textAlign:'center' }}>
              <Link to={`/teams/${awayT?.id||game.away}`} style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'clamp(32px,6vw,64px)',textTransform:'uppercase',color:awayT?.color||'var(--gold)',textDecoration:'none',lineHeight:1,display:'block' }}>{game.away}</Link>
              <div style={{ fontSize:12,color:'rgba(0,0,0,0.35)',marginTop:4,textTransform:'uppercase',letterSpacing:'.08em' }}>AWAY ↗</div>
            </div>
            {/* Score */}
            <div style={{ textAlign:'center' }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'clamp(40px,8vw,72px)',color:'var(--gold)',lineHeight:1 }}>{game.awayScore}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:400,fontSize:48,color:'rgba(0,0,0,0.25)',lineHeight:1 }}>-</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'clamp(40px,8vw,72px)',color:'rgba(0,0,0,0.3)',lineHeight:1 }}>{game.homeScore}</span>
              </div>
              <div style={{ background:'rgba(0,0,0,0.07)',borderRadius:6,padding:'4px 16px',fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'rgba(0,0,0,0.45)',textTransform:'uppercase',marginTop:8,display:'inline-block' }}>FINAL</div>
              <div style={{ fontSize:12,color:'rgba(0,0,0,0.35)',marginTop:6 }}>📍 {field}</div>
            </div>
            {/* Home */}
            <div style={{ flex:1,textAlign:'center' }}>
              <Link to={`/teams/${homeT?.id||game.home}`} style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:'clamp(32px,6vw,64px)',textTransform:'uppercase',color:homeT?.color||'var(--gold)',textDecoration:'none',lineHeight:1,display:'block' }}>{game.home}</Link>
              <div style={{ fontSize:12,color:'rgba(0,0,0,0.35)',marginTop:4,textTransform:'uppercase',letterSpacing:'.08em' }}>HOME ↗</div>
            </div>
          </div>
        </div>

        <div style={{ padding:'16px clamp(12px,4vw,32px) 24px' }}>
          {/* Line Score with innings */}
          <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(0,0,0,0.35)',marginBottom:10 }}>Line Score</div>
          {(() => {
            const seed = (game.away?.charCodeAt(0)||0) + (game.home?.charCodeAt(0)||0)
            const awayInn = genInnings(game.awayScore||0, seed)
            const homeInn = genInnings(game.homeScore||0, seed+7)
            const cols = '80px repeat(7, 1fr) 1.2fr 1.2fr 1.2fr'
            const thStyle = { fontSize:11,fontWeight:700,letterSpacing:'.08em',color:'rgba(0,0,0,0.3)',textTransform:'uppercase',textAlign:'center',padding:'8px 4px' }
            const tdStyle = { fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,textAlign:'center',padding:'10px 4px',color:'rgba(0,0,0,0.45)' }
            return (
              <div style={{ overflowX:'auto',marginBottom:28 }}>
                <table style={{ width:'100%',borderCollapse:'collapse',background:'rgba(0,0,0,0.04)',borderRadius:8,overflow:'hidden',minWidth:500 }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid rgba(0,0,0,0.05)' }}>
                      <th style={{...thStyle,textAlign:'left',paddingLeft:16}}>TEAM</th>
                      {[1,2,3,4,5,6,7].map(n=><th key={n} style={thStyle}>{n}</th>)}
                      <th style={{...thStyle,color:'var(--white)',fontWeight:800}}>R</th>
                      <th style={{...thStyle,color:'var(--white)',fontWeight:800}}>H</th>
                      <th style={{...thStyle,color:'var(--white)',fontWeight:800}}>E</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[{short:game.away,t:awayT,inn:awayInn,r:game.awayScore,h:awayH},{short:game.home,t:homeT,inn:homeInn,r:game.homeScore,h:homeH}].map((row,i)=>(
                      <tr key={i} style={{ borderBottom:i===0?'1px solid rgba(0,0,0,0.04)':'none' }}>
                        <td style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,color:row.t?.color||'var(--gold)',textTransform:'uppercase',padding:'10px 16px' }}>{row.short}</td>
                        {row.inn.map((r,ii)=><td key={ii} style={tdStyle}>{r}</td>)}
                        <td style={{...tdStyle,color:'var(--white)',fontWeight:900,fontSize:20}}>{row.r}</td>
                        <td style={{...tdStyle,color:'rgba(0,0,0,0.5)'}}>{row.h}</td>
                        <td style={{...tdStyle,color:'rgba(0,0,0,0.5)'}}>0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })()}

          {/* Batting */}
          <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(0,0,0,0.35)',marginBottom:16 }}>Batting</div>
          <div style={{ display:'flex',gap:24,flexWrap:'wrap' }}>
            <TeamBattingTable players={away} teamShort={game.away} color={awayT?.color||'var(--gold)'} />
            <TeamBattingTable players={home} teamShort={game.home} color={homeT?.color||'var(--gold)'} />
          </div>
        </div>
      </Modal>
    </>
  )
}

// ── Recap Modal ───────────────────────────────────────────────────────────────

export function RecapModal({ game, onClose }) {
  const recap = genRecap(game)
  const winTeam = (game.awayScore||0)>(game.homeScore||0) ? game.away : game.home
  const lossTeam = (game.awayScore||0)>(game.homeScore||0) ? game.home : game.away
  const winP  = getPitcher(winTeam)
  const lossP = getPitcher(lossTeam)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  return (
    <Modal onClose={onClose} maxWidth={700}>
      <button onClick={onClose} style={{ position:'absolute',top:14,right:14,background:'rgba(0,0,0,0.07)',border:'1px solid rgba(0,0,0,0.12)',borderRadius:8,color:'var(--white)',fontSize:18,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8 }}>Game Recap</div>
        <div style={{ display:'flex',gap:20,alignItems:'center',marginBottom:20 }}>
          {[{t:game.away,team:awayT,score:game.awayScore},{t:game.home,team:homeT,score:game.homeScore}].map(s=>(
            <div key={s.t} style={{ display:'flex',alignItems:'center',gap:8 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:s.team?.color||'var(--white)',textTransform:'uppercase' }}>{s.t}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:40,color:'var(--white)' }}>{s.score}</span>
            </div>
          ))}
          <span style={{ fontSize:12,color:'rgba(0,0,0,0.35)',marginLeft:8 }}>{field}</span>
        </div>
        <div style={{ display:'flex',gap:32,marginBottom:20,paddingBottom:20,borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
          {[{role:'WIN',p:winP},{role:'LOSS',p:lossP}].map(({role,p})=>(
            <div key={role}>
              <div style={{ fontSize:10,fontWeight:700,letterSpacing:'.1em',color:'rgba(0,0,0,0.35)',marginBottom:4 }}>{role}</div>
              <div style={{ fontWeight:700,fontSize:15,color:'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize:12,color:'rgba(0,0,0,0.35)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:15,lineHeight:1.8,color:'rgba(0,0,0,0.6)' }}>{recap}</p>
      </div>
    </Modal>
  )
}

// ── Gameday Modal ─────────────────────────────────────────────────────────────

export function GamedayModal({ game, onClose }) {
  const { field, time, awayP, homeP, awayRecord, homeRecord, storyline } = genGamedayPreview(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)

  return (
    <Modal onClose={onClose} maxWidth={700}>
      <button onClick={onClose} style={{ position:'absolute',top:14,right:14,background:'rgba(0,0,0,0.07)',border:'1px solid rgba(0,0,0,0.12)',borderRadius:8,color:'var(--white)',fontSize:18,width:36,height:36,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
      <div style={{ padding:'28px 32px' }}>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--gold)',marginBottom:20 }}>Gameday Preview · {field} · {time}</div>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:32,marginBottom:24,paddingBottom:20,borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
          {[{t:game.away,team:awayT,rec:awayRecord},{t:game.home,team:homeT,rec:homeRecord}].map((s,i)=>(
            <div key={s.t} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:48,color:s.team?.color||'var(--gold)',textTransform:'uppercase',lineHeight:1 }}>{s.t}</div>
              <div style={{ fontSize:13,color:'rgba(0,0,0,0.35)',marginTop:4 }}>{s.rec}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:32,marginBottom:20,paddingBottom:20,borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
          {[{label:'Away Pitcher',p:awayP},{label:'Home Pitcher',p:homeP}].map(({label,p})=>(
            <div key={label}>
              <div style={{ fontSize:10,fontWeight:700,letterSpacing:'.1em',color:'var(--gold)',textTransform:'uppercase',marginBottom:4 }}>{label}</div>
              <div style={{ fontWeight:700,fontSize:16,color:'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize:13,color:'rgba(0,0,0,0.35)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:15,lineHeight:1.8,color:'rgba(0,0,0,0.6)' }}>{storyline}</p>
      </div>
    </Modal>
  )
}
