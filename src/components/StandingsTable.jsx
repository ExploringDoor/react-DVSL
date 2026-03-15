import { Link } from 'react-router-dom'
import { getStandings } from '../data/standings'

export default function StandingsTable({ compact = false }) {
  const rows = getStandings()

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dvsl-border">
            <th className="text-left text-xs font-mono text-dvsl-muted py-2 pr-4 font-medium">#</th>
            <th className="text-left text-xs font-mono text-dvsl-muted py-2 pr-4 font-medium">TEAM</th>
            <th className="text-center text-xs font-mono text-dvsl-muted py-2 px-3 font-medium">W</th>
            <th className="text-center text-xs font-mono text-dvsl-muted py-2 px-3 font-medium">L</th>
            <th className="text-center text-xs font-mono text-dvsl-muted py-2 px-3 font-medium">PCT</th>
            {!compact && <th className="text-center text-xs font-mono text-dvsl-muted py-2 px-3 font-medium">RS</th>}
            {!compact && <th className="text-center text-xs font-mono text-dvsl-muted py-2 px-3 font-medium">RA</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((team, i) => (
            <tr key={team.id} className="border-b border-dvsl-border/50 hover:bg-dvsl-surface/50 transition-colors">
              <td className="py-3 pr-4">
                <span className={`font-mono text-xs font-bold ${i === 0 ? 'text-dvsl-gold' : 'text-dvsl-muted'}`}>
                  {i + 1}
                </span>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
                  <Link
                    to={`/teams/${team.id}`}
                    className="font-medium text-dvsl-text hover:text-dvsl-lime transition-colors"
                  >
                    {compact ? team.short : team.name}
                  </Link>
                  {i === 0 && <span className="text-xs font-mono text-dvsl-gold">★</span>}
                </div>
              </td>
              <td className="py-3 px-3 text-center font-mono font-bold text-dvsl-lime">{team.wins}</td>
              <td className="py-3 px-3 text-center font-mono text-dvsl-muted">{team.losses}</td>
              <td className="py-3 px-3 text-center font-mono text-dvsl-text">{team.pct.toFixed(3).replace('0.', '.')}</td>
              {!compact && <td className="py-3 px-3 text-center font-mono text-dvsl-muted">{team.runs}</td>}
              {!compact && <td className="py-3 px-3 text-center font-mono text-dvsl-muted">{team.runsAllowed}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
