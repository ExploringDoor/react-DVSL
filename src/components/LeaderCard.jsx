import { useState } from 'react'
import { getTeamByShort } from '../data/teams'
import { PlayerStatsModal } from './GameModals'

export default function LeaderCard({ catLabel, players, fmt, statKey, active = false }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  if (!players?.length) return null
  const leader = players[0]
  const rest   = players.slice(1, 7)
  const team   = getTeamByShort(leader.team)

  return (
    <>
      {selectedPlayer && <PlayerStatsModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
      <div style={{ background:'var(--card)', border:`1px solid ${active ? 'var(--gold)' : 'var(--border)'}`, borderRadius:10, padding:'14px 16px', position:'relative', overflow:'hidden', minWidth:0 }}>
        {/* #1 watermark */}
        <div style={{ position:'absolute', top:2, right:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:52, color:'rgba(255,255,255,0.04)', lineHeight:1, userSelect:'none' }}>#1</div>

        <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'var(--muted2)', marginBottom:6 }}>{catLabel}</div>

        {/* Leader — clickable, no photo */}
        <button onClick={() => setSelectedPlayer(leader)} style={{ background:'none', border:'none', cursor:'pointer', width:'100%', textAlign:'left', padding:0, marginBottom:10 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:40, color:'var(--gold)', lineHeight:1 }}>{fmt(leader[statKey])}</div>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--white)', marginTop:4, lineHeight:1.2 }}>{leader.name}</div>
          <div style={{ fontSize:11, color:team?.color||'var(--muted)', marginTop:2 }}>{leader.team}</div>
        </button>

        {/* Ranked list 2-7 — all clickable */}
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:8, display:'flex', flexDirection:'column', gap:4 }}>
          {rest.map((p,i) => (
            <button key={p.id} onClick={() => setSelectedPlayer(p)} style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, width:'100%', padding:'2px 0' }}>
              <span style={{ fontSize:11, color:'var(--muted2)', width:12, flexShrink:0 }}>{i+2}</span>
              <span style={{ fontSize:13, color:'var(--muted)', flex:1, textAlign:'left', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {p.name.split(' ').slice(1).join(' ') || p.name}
              </span>
              <span style={{ fontSize:13, fontWeight:700, color:'var(--white)', fontFamily:"'Barlow Condensed',sans-serif", flexShrink:0 }}>{fmt(p[statKey])}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
