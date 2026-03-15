import { getTeamByShort } from '../data/teams'
import { getPitcher } from '../data/pitchers'
import { STATS, fmtAvg } from '../data/stats'

// Generate a box score where H and R sum to exactly the game score
function genBoxScore(game) {
  const playerNames = {
    GOLD:['Josh Weinberg','Mike Goldstein','Aaron Rosen','David Levy','Ben Abrams','Noah Schwartz','Sam Rubin','Zach Feldman','Ari Blum'],
    SA:  ['Carlos Rivera','Tony DeLuca','Pete DiNunzio','Ray Kowalski','Lou DiMaggio','Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario'],
    KI:  ['Kevin Park','Brian Kim','Danny Ito','Sam Levy','Barry Kahn','Josh Cohen','Neil Katz','Rob Frankel','Jake Robbins'],
    BOB: ['Bobby Marchetti','Tony Greco','Chris Rosario','Sal Bianco','Al Jacobs','Dave Stein','Tom Birnbaum','Andy Katz','Bob Weiner'],
    TBIR:['Tom Birnbaum','Jake Robbins','Abe Stern','Phil Grossman','Steve Rubin','Jeff Landau','Gary Rubin','Marty Fein','Larry Weiss'],
    AJ:  ['Al Jacobs','Barry Kahn','Dave Stein','Hal Becker','Neil Katz','Bob Sacks','Rob Zwick','Lenny Gross','Rich Herman'],
    BA1: ['Lou DiMaggio','Frank Palermo','Marco Vitale','Phil Stern','Chris Rosario','Bobby Marchetti','Tony Greco','Sal Bianco','Danny Ito'],
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
    BTBJ:['Andy Katz','Bob Weiner','Hal Brody','Chuck Levy','Dave Rubin','Phil Weiss','Norm Shapiro','Arnie Gold','Mel Schwartz'],
  }
  const fallback = ['Player A','Player B','Player C','Player D','Player E','Player F','Player G','Player H','Player I']

  function buildTeam(short, totalRuns, totalHits) {
    const names = playerNames[short] || fallback
    const n = 9
    // Distribute hits exactly
    let hLeft = totalHits, rLeft = totalRuns
    const rows = names.slice(0, n).map((name, i) => {
      const isLast = i === n - 1
      const ab = 3 + (i % 2)
      const h  = isLast ? Math.max(0, hLeft) : Math.min(Math.floor(Math.random() * 3), hLeft, ab)
      hLeft -= h
      const r  = isLast ? Math.max(0, rLeft) : (h > 0 && rLeft > 0 ? (Math.random() > 0.5 ? 1 : 0) : 0)
      rLeft = Math.max(0, rLeft - r)
      const rbi = r > 0 ? r : (h > 1 ? 1 : 0)
      const hr  = h >= 2 && i % 4 === 0 ? 1 : 0
      const bb  = i % 3 === 0 ? 1 : 0
      const avg = ab > 0 ? (h / ab).toFixed(3).replace(/^0/, '.') : '.000'
      return { name, ab, h: Math.max(0,h), r: Math.max(0,r), rbi, hr, bb, avg }
    })
    return rows
  }

  return {
    away: buildTeam(game.away, game.awayScore || 0, Math.round((game.awayScore || 0) * 1.5 + 2)),
    home: buildTeam(game.home, game.homeScore || 0, Math.round((game.homeScore || 0) * 1.5 + 1)),
  }
}

function genRecap(game) {
  const winner = (game.awayScore || 0) > (game.homeScore || 0) ? game.away : game.home
  const loser  = (game.awayScore || 0) > (game.homeScore || 0) ? game.home : game.away
  const winScore = Math.max(game.awayScore || 0, game.homeScore || 0)
  const loseScore = Math.min(game.awayScore || 0, game.homeScore || 0)
  const winP = getPitcher(winner)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
  return `${winner} defeated ${loser} ${winScore}-${loseScore} at ${field}. ${winP.name} was dominant on the mound, improving to ${winP.wl} with a ${winP.era} ERA. The offense provided early support, plating runs in multiple innings to build a commanding lead. ${loser} made things interesting late but couldn't convert when it mattered most. ${winner} continues to push for playoff positioning.`
}

function genGamedayPreview(game) {
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const awayP = getPitcher(game.away)
  const homeP = getPitcher(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()
  const timeMatch = game.field?.match(/([\d:]+)\s*(pm|am)/i)
  const time = timeMatch ? `${timeMatch[1]}${timeMatch[1].includes(':') ? '' : ':00'} ${timeMatch[2].toUpperCase()}` : '7:30 PM'
  return {
    field, time, awayP, homeP,
    awayRecord: `${awayT?.w}-${awayT?.l}`,
    homeRecord:  `${homeT?.w}-${homeT?.l}`,
    storyline: `${game.away} (${awayT?.w}-${awayT?.l}) travels to face ${game.home} (${homeT?.w}-${homeT?.l}) at ${field}. ${awayP.name} takes the mound for ${game.away} (${awayP.era} ERA) against ${homeP.name} for ${game.home} (${homeP.era} ERA). Both clubs are hungry for a win as playoff positioning becomes critical. Expect a tightly contested game.`
  }
}

// Modal wrapper
function Modal({ onClose, children, maxWidth = 860 }) {
  return (
    <div onClick={onClose} style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'var(--card)',border:'1px solid var(--border)',borderRadius:12,maxWidth,width:'100%',maxHeight:'85vh',overflowY:'auto' }}>
        {children}
      </div>
    </div>
  )
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',borderBottom:'1px solid var(--border)' }}>
      <div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,textTransform:'uppercase',color:'var(--white)',letterSpacing:'.02em' }}>{title}</div>
        {subtitle && <div style={{ fontSize:12,color:'var(--muted2)',marginTop:2 }}>{subtitle}</div>}
      </div>
      <button onClick={onClose} style={{ background:'none',border:'none',color:'var(--muted)',fontSize:20,cursor:'pointer',padding:'4px 8px' }}>✕</button>
    </div>
  )
}

export function BoxScoreModal({ game, onClose }) {
  const { away, home } = genBoxScore(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  function TeamTable({ players, teamShort, color, score }) {
    const totH = players.reduce((a,p)=>a+p.h,0)
    const totR = players.reduce((a,p)=>a+p.r,0)
    const totRBI = players.reduce((a,p)=>a+p.rbi,0)
    const totBB  = players.reduce((a,p)=>a+p.bb,0)
    return (
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,textTransform:'uppercase',color }}>{teamShort}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:30,color:'var(--white)' }}>{score}</span>
        </div>
        <table style={{ width:'100%',borderCollapse:'collapse',fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              {['Player','AB','H','R','RBI','HR','BB','AVG'].map(h=>(
                <th key={h} style={{ padding:'6px 10px',textAlign:h==='Player'?'left':'center',fontSize:11,fontWeight:700,letterSpacing:'.08em',color:'var(--muted2)',textTransform:'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p,i)=>(
              <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}
              >
                <td style={{ padding:'7px 10px',fontWeight:500,color:'var(--white)' }}>{p.name}</td>
                {[p.ab,p.h,p.r,p.rbi,p.hr,p.bb].map((v,vi)=>(
                  <td key={vi} style={{ padding:'7px 10px',textAlign:'center',color:'var(--muted)',fontFamily:"'Barlow Condensed',sans-serif" }}>{v}</td>
                ))}
                <td style={{ padding:'7px 10px',textAlign:'center',color:'var(--gold)',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700 }}>{p.avg}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr style={{ borderTop:'1px solid var(--border)',background:'rgba(255,255,255,0.03)' }}>
              <td style={{ padding:'7px 10px',fontWeight:700,color:'var(--white)',fontSize:12 }}>TOTALS</td>
              {[players.reduce((a,p)=>a+p.ab,0), totH, totR, totRBI, players.reduce((a,p)=>a+p.hr,0), totBB].map((v,vi)=>(
                <td key={vi} style={{ padding:'7px 10px',textAlign:'center',fontWeight:700,color:'var(--white)',fontFamily:"'Barlow Condensed',sans-serif" }}>{v}</td>
              ))}
              <td style={{ padding:'7px 10px',textAlign:'center',color:'var(--muted2)',fontFamily:"'Barlow Condensed',sans-serif" }}>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Box Score" subtitle={`${game.away} ${game.awayScore} · ${game.home} ${game.homeScore} · ${field}`} onClose={onClose} />
      <div style={{ padding:'20px 24px' }}>
        <TeamTable players={away} teamShort={game.away} color={awayT?.color||'var(--gold)'} score={game.awayScore} />
        <TeamTable players={home} teamShort={game.home} color={homeT?.color||'var(--blue)'} score={game.homeScore} />
      </div>
    </Modal>
  )
}

export function RecapModal({ game, onClose }) {
  const recap = genRecap(game)
  const winTeam = (game.awayScore||0) > (game.homeScore||0) ? game.away : game.home
  const lossTeam = (game.awayScore||0) > (game.homeScore||0) ? game.home : game.away
  const winP  = getPitcher(winTeam)
  const lossP = getPitcher(lossTeam)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)
  const field = game.field?.replace(/\s*(6pm|7pm|7:30pm|8pm|6:30pm|6:00pm)/i,'').trim()

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Game Recap" subtitle={`${game.away} ${game.awayScore} · ${game.home} ${game.homeScore} · ${field}`} onClose={onClose} />
      <div style={{ padding:'24px' }}>
        <div style={{ display:'flex',gap:24,marginBottom:20 }}>
          {[{t:game.away,team:awayT,score:game.awayScore},{t:game.home,team:homeT,score:game.homeScore}].map(s=>(
            <div key={s.t} style={{ display:'flex',alignItems:'center',gap:8 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:20,color:s.team?.color||'var(--white)',textTransform:'uppercase' }}>{s.t}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,color:'var(--white)' }}>{s.score}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:32,marginBottom:20,paddingBottom:20,borderBottom:'1px solid var(--border)' }}>
          {[{role:'WIN',p:winP},{role:'LOSS',p:lossP}].map(({role,p})=>(
            <div key={role}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'var(--muted2)',marginBottom:4 }}>{role}</div>
              <div style={{ fontWeight:700,fontSize:15,color:'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize:12,color:'var(--muted2)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:15,lineHeight:1.8,color:'var(--muted)' }}>{recap}</p>
      </div>
    </Modal>
  )
}

export function GamedayModal({ game, onClose }) {
  const { field, time, awayP, homeP, awayRecord, homeRecord, storyline } = genGamedayPreview(game)
  const awayT = getTeamByShort(game.away)
  const homeT = getTeamByShort(game.home)

  return (
    <Modal onClose={onClose}>
      <ModalHeader title="Gameday Preview" subtitle={`${field} · ${time} · ${game.date}`} onClose={onClose} />
      <div style={{ padding:'24px' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:40,marginBottom:24,paddingBottom:20,borderBottom:'1px solid var(--border)' }}>
          {[{t:game.away,team:awayT,rec:awayRecord},{t:game.home,team:homeT,rec:homeRecord}].map((s,i)=>(
            <div key={s.t} style={{ textAlign:'center' }}>
              <div style={{ width:64,height:64,borderRadius:12,border:`2px solid ${s.team?.color||'#6b7280'}`,background:`${s.team?.color||'#6b7280'}20`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:16,color:s.team?.color||'#6b7280',margin:'0 auto 8px' }}>{s.t?.slice(0,4)}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:24,color:s.team?.color||'var(--white)',textTransform:'uppercase' }}>{s.t}</div>
              <div style={{ fontSize:13,color:'var(--muted2)' }}>{s.rec}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex',gap:32,marginBottom:20,paddingBottom:20,borderBottom:'1px solid var(--border)' }}>
          {[{label:'Away Pitcher',p:awayP},{label:'Home Pitcher',p:homeP}].map(({label,p})=>(
            <div key={label}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'var(--gold)',textTransform:'uppercase',marginBottom:4 }}>{label}</div>
              <div style={{ fontWeight:700,fontSize:16,color:'var(--white)' }}>{p.name}</div>
              <div style={{ fontSize:13,color:'var(--muted2)' }}>{p.wl} · {p.era} ERA</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'var(--gold)',textTransform:'uppercase',marginBottom:8 }}>Preview</div>
        <p style={{ fontSize:15,lineHeight:1.8,color:'var(--muted)' }}>{storyline}</p>
      </div>
    </Modal>
  )
}

// Player stats popup
export function PlayerStatsModal({ player, onClose }) {
  if (!player) return null
  const team = getTeamByShort(player.team)
  return (
    <Modal onClose={onClose} maxWidth={500}>
      <ModalHeader title={player.name} subtitle={`${player.team} · ${team?.name || ''}`} onClose={onClose} />
      <div style={{ padding:'20px 24px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:20 }}>
          {[
            {label:'AVG', val: fmtAvg(player.avg)},
            {label:'OBP', val: fmtAvg(player.obp)},
            {label:'SLG', val: fmtAvg(player.slg)},
          ].map(({label,val})=>(
            <div key={label} style={{ background:'var(--bg)',borderRadius:8,padding:'12px 16px',textAlign:'center' }}>
              <div style={{ fontSize:11,fontWeight:700,letterSpacing:'.1em',color:'var(--muted2)',marginBottom:4 }}>{label}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:'var(--gold)' }}>{val}</div>
            </div>
          ))}
        </div>
        <table style={{ width:'100%',borderCollapse:'collapse' }}>
          <tbody>
            {[
              ['Games Played', player.gp],
              ['At Bats', player.ab],
              ['Hits', player.h],
              ['Runs', player.r],
              ['RBI', player.rbi],
              ['Home Runs', player.hr],
              ['Doubles', player.doubles],
              ['Triples', player.triples],
              ['Walks', player.bb],
              ['Strikeouts', player.so],
              ['Stolen Bases', player.sb],
            ].map(([label, val]) => (
              <tr key={label} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding:'9px 12px',color:'var(--muted)',fontSize:14 }}>{label}</td>
                <td style={{ padding:'9px 12px',textAlign:'right',fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:18,color:'var(--white)' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
