import { getTeamByShort } from '../data/teams'

export default function TeamBadge({ short, size = 34 }) {
  const team = getTeamByShort(short)
  const color = team?.color || '#6b7280'
  const label = short?.slice(0, 4) || '?'
  return (
    <div style={{
      width: size, height: size,
      borderRadius: 6,
      border: `1.5px solid ${color}`,
      background: `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 900,
      fontSize: size * 0.28,
      letterSpacing: '.03em',
      color: color,
      flexShrink: 0,
    }}>
      {label}
    </div>
  )
}
