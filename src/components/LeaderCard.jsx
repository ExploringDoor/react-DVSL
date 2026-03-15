import { useState } from 'react'
import { getTeamByShort } from '../data/teams'
import { PlayerStatsModal } from './GameModals'

const MALE_PHOTOS = [
  'https://randomuser.me/api/portraits/men/42.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/men/36.jpg',
  'https://randomuser.me/api/portraits/men/67.jpg',
  'https://randomuser.me/api/portraits/men/48.jpg',
  'https://randomuser.me/api/portraits/men/71.jpg',
  'https://randomuser.me/api/portraits/men/33.jpg',
  'https://randomuser.me/api/portraits/men/59.jpg',
  'https://randomuser.me/api/portraits/men/44.jpg',
  'https://randomuser.me/api/portraits/men/62.jpg',
  'https://randomuser.me/api/portraits/men/51.jpg',
  'https://randomuser.me/api/portraits/men/77.jpg',
]

function Avatar({ name, size = 90 }) {
  const idx = ((name?.charCodeAt(0) || 0) + (name?.charCodeAt(4) || 0)) % MALE_PHOTOS.length
  return (
    <div style={{ width:size, height:size, borderRadius:6, overflow:'hidden', flexShrink:0, background:'rgba(255,255,255,0.06)' }}>
      <img src={MALE_PHOTOS[idx]} alt={name} width={size} height={size}
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        onError={e => { e.target.style.display='none' }}
      />
    </div>
  )
}

export default function LeaderCard({ catLabel, players, fmt, statKey, active = false }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  if (!players?.length) return null
  const leader = players[0]
  const rest   = players.slice(1, 6)
  const team   = getTeamByShort(leader.team)

  return (
    <>
      {selectedPlayer && <PlayerStatsModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
      <div style={{ background:'var(--card)', border:`1px solid ${active ? 'var(--gold)' : 'var(--border)'}`, borderRadius:10, padding:'14px', position:'relative', overflow:'hidden', minWidth:0 }}>
        {/* #1 watermark */}
        <div style={{ position:'absolute',top:2,right:10,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:52,color:'rgba(255,255,255,0.04)',lineHeight:1,userSelect:'none' }}>#1</div>

        <div style={{ fontSize:10,fontWeight:700,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--muted2)',marginBottom:8 }}>{catLabel}</div>

        {/* Leader row — clickable */}
        <button onClick={() => setSelectedPlayer(leader)} style={{ background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:10,marginBottom:10,width:'100%',textAlign:'left',padding:0 }}>
          <Avatar name={leader.name} size={70} />
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:36,color:'var(--gold)',lineHeight:1 }}>{fmt(leader[statKey])}</div>
            <div style={{ fontWeight:700,fontSize:13,color:'var(--white)',marginTop:4,lineHeight:1.2 }}>{leader.name}</div>
            <div style={{ fontSize:11,color:team?.color||'var(--muted)',marginTop:2 }}>{leader.team}</div>
          </div>
        </button>

        {/* Ranked list */}
        <div style={{ borderTop:'1px solid var(--border)',paddingTop:8,display:'flex',flexDirection:'column',gap:4 }}>
          {rest.map((p,i) => (
            <button key={p.id} onClick={() => setSelectedPlayer(p)} style={{ background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:6,width:'100%',padding:'2px 0' }}>
              <span style={{ fontSize:11,color:'var(--muted2)',width:12,flexShrink:0,textAlign:'left' }}>{i+2}</span>
              <span style={{ fontSize:13,color:'var(--muted)',flex:1,textAlign:'left',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                {p.name.split(' ').slice(1).join(' ') || p.name}
              </span>
              <span style={{ fontSize:13,fontWeight:700,color:'var(--white)',fontFamily:"'Barlow Condensed',sans-serif",flexShrink:0 }}>{fmt(p[statKey])}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
