import { Link } from 'react-router-dom'
import { getTeamByShort } from '../data/teams'

// Placeholder avatar using player initials
function Avatar({ name, size = 160 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '?'
  return (
    <div style={{
      width: size, height: size,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed',sans-serif",
      fontWeight: 900, fontSize: size * 0.35,
      color: 'rgba(255,255,255,0.25)',
      letterSpacing: '.02em',
    }}>{initials}</div>
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
      borderRadius: 12,
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
    }}>
      {/* #1 watermark */}
      <div style={{
        position: 'absolute', top: 8, right: 16,
        fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 900, fontSize: 72,
        color: 'rgba(255,255,255,0.04)',
        lineHeight: 1, userSelect: 'none',
        letterSpacing: '-.02em',
      }}>#1</div>

      {/* Category label */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted2)', marginBottom: 12 }}>
        {catLabel}
      </div>

      {/* Avatar */}
      <Avatar name={leader.name} size={140} />

      {/* Stat value */}
      <div style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontWeight: 900, fontSize: 52,
        color: 'var(--gold)', lineHeight: 1,
        marginTop: 14, marginBottom: 6,
      }}>
        {fmt(leader[statKey])}
      </div>

      {/* Player name + team */}
      <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--white)', marginBottom: 2 }}>{leader.name}</div>
      <div style={{ fontSize: 13, color: team?.color || 'var(--muted)', marginBottom: 16 }}>{leader.team}</div>

      {/* Ranked list 2-6 */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rest.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--muted2)', width: 14, flexShrink: 0 }}>{i + 2}</span>
            <span style={{ fontSize: 14, color: 'var(--muted)', flex: 1 }}>{p.name.split(' ')[1] || p.name}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--white)', fontFamily: "'Barlow Condensed',sans-serif" }}>{fmt(p[statKey])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
