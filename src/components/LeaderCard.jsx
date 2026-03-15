import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'

// Realistic placeholder using Unsplash's face collection (seeded by player name)
function Avatar({ name, size = 140 }) {
  const seed = name?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 42
  // Use picsum with a face-like seed
  const url = `https://i.pravatar.cc/${size}?u=${encodeURIComponent(name || 'player')}`
  return (
    <div style={{ width: size, height: size, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.06)' }}>
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => {
          e.target.style.display = 'none'
          e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:${size*0.32}px;color:rgba(255,255,255,0.2)">${(name||'?').split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</div>`
        }}
      />
    </div>
  )
}

export default function LeaderCard({ catLabel, players, fmt, statKey, active = false }) {
  if (!players?.length) return null
  const leader = players[0]
  const rest   = players.slice(1, 7)
  const team   = getTeamByShort(leader.team)

  return (
    <div style={{
      background: 'var(--card)',
      border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
      borderRadius: 12, padding: '18px',
      position: 'relative', overflow: 'hidden', minWidth: 0,
    }}>
      {/* #1 watermark */}
      <div style={{
        position: 'absolute', top: 4, right: 12,
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 68,
        color: 'rgba(255,255,255,0.04)', lineHeight: 1, userSelect: 'none',
      }}>#1</div>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: 10 }}>
        {catLabel}
      </div>

      <Avatar name={leader.name} size={130} />

      <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: 48, color: 'var(--gold)', lineHeight: 1, marginTop: 12, marginBottom: 4 }}>
        {fmt(leader[statKey])}
      </div>

      <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--white)', marginBottom: 2 }}>{leader.name}</div>
      <div style={{ fontSize: 13, color: team?.color || 'var(--muted)', marginBottom: 14 }}>{leader.team}</div>

      {/* 2-7 list */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {rest.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted2)', width: 14, flexShrink: 0 }}>{i + 2}</span>
            <span style={{ fontSize: 14, color: 'var(--muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name.split(' ').slice(1).join(' ') || p.name}
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', fontFamily: "'Barlow Condensed',sans-serif", flexShrink: 0 }}>
              {fmt(p[statKey])}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
