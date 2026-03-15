import { Link } from 'react-router-dom'
import { TEAMS } from '../data/teams'

function teamColor(name) {
  const t = TEAMS.find(t => t.name === name)
  return t ? t.color : '#6b7280'
}

function teamId(name) {
  const t = TEAMS.find(t => t.name === name)
  return t ? t.id : name.toLowerCase().replace(/\s+/g, '-')
}

export default function GameCard({ game, compact = false }) {
  const isFinal = game.status === 'final'
  const homeWon = isFinal && game.homeScore > game.awayScore
  const awayWon = isFinal && game.awayScore > game.homeScore

  if (compact) {
    return (
      <div className="card p-3 flex items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: teamColor(game.away) }} />
          <span className={`truncate ${awayWon ? 'text-dvsl-text font-semibold' : 'text-dvsl-muted'}`}>{game.away}</span>
        </div>
        {isFinal ? (
          <span className="font-mono text-xs text-dvsl-muted shrink-0">{game.awayScore} – {game.homeScore}</span>
        ) : (
          <span className="font-mono text-xs text-dvsl-muted shrink-0">{game.time}</span>
        )}
        <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
          <span className={`truncate text-right ${homeWon ? 'text-dvsl-text font-semibold' : 'text-dvsl-muted'}`}>{game.home}</span>
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: teamColor(game.home) }} />
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-dvsl-border flex items-center justify-between">
        <span className="text-dvsl-muted text-xs font-mono">Week {game.week} · {game.field}</span>
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
          isFinal ? 'bg-dvsl-green/15 text-dvsl-green' : 'bg-dvsl-gold/15 text-dvsl-gold'
        }`}>
          {isFinal ? 'FINAL' : `${game.date.slice(5)} ${game.time}`}
        </span>
      </div>
      {/* Teams */}
      <div className="p-4 space-y-2">
        {[{ name: game.away, score: game.awayScore, won: awayWon }, { name: game.home, score: game.homeScore, won: homeWon }].map(side => (
          <div key={side.name} className="flex items-center justify-between">
            <Link
              to={`/teams/${teamId(side.name)}`}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <span className="w-3 h-3 rounded-full" style={{ background: teamColor(side.name) }} />
              <span className={`text-sm ${side.won ? 'text-dvsl-text font-bold' : 'text-dvsl-muted'}`}>{side.name}</span>
            </Link>
            {isFinal && (
              <span className={`font-mono text-lg font-bold ${side.won ? 'text-dvsl-text' : 'text-dvsl-muted'}`}>
                {side.score}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
