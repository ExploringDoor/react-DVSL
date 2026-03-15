import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'

// Real photos of random men from randomuser.me - seeded by index
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
]

function Avatar({ name, size = 130 }) {
  const idx = (name?.charCodeAt(0) || 0 + (name?.charCodeAt(1) || 0)) % MALE_PHOTOS.length
  const url = MALE_PHOTOS[idx]
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
