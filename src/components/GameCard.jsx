import { getTeamByName } from '../data/teams'

export default function GameCard({ game, compact = false }) {
  const home = getTeamByName(game.homeTeam)
  const away = getTeamByName(game.awayTeam)
  const isFinal = game.status === 'final'
  const isLive  = game.status === 'live'

  const homeWon = isFinal && game.homeScore > game.awayScore
  const awayWon = isFinal && game.awayScore > game.homeScore

  if (compact) {
    return (
      <div className="card p-3 flex items-center gap-3 text-sm">
        <div className="flex-1 min-w-0">
          <div className={`flex items-center justify-between ${awayWon ? 'opacity-50' : ''}`}>
            <span className="font-medium text-dvsl-text truncate">{game.homeTeam}</span>
            <span className={`font-mono font-bold tabular-nums ${homeWon ? 'text-dvsl-lime' : 'text-dvsl-text'}`}>
              {isFinal ? game.homeScore : '—'}
            </span>
          </div>
          <div className={`flex items-center justify-between mt-1 ${homeWon ? 'opacity-50' : ''}`}>
            <span className="font-medium text-dvsl-text truncate">{game.awayTeam}</span>
            <span className={`font-mono font-bold tabular-nums ${awayWon ? 'text-dvsl-lime' : 'text-dvsl-text'}`}>
              {isFinal ? game.awayScore : '—'}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          {isLive  && <span className="text-xs text-red-400 font-mono font-bold">LIVE</span>}
          {isFinal && <span className="text-xs text-dvsl-muted font-mono">FINAL</span>}
          {!isFinal && !isLive && (
            <span className="text-xs text-dvsl-muted font-mono">{game.time}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-4">
      {/* Meta row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono text-dvsl-muted">
          Wk {game.week} · {new Date(game.date + 'T12:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })}
        </span>
        <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded-full ${
          isLive  ? 'bg-red-950/60 text-red-400 border border-red-900/40' :
          isFinal ? 'bg-dvsl-border text-dvsl-muted' :
                    'bg-dvsl-surface text-dvsl-muted border border-dvsl-border'
        }`}>
          {isLive ? '● LIVE' : isFinal ? 'FINAL' : game.time}
        </span>
      </div>

      {/* Teams */}
      <div className="space-y-2">
        {[
          { team: game.homeTeam, score: game.homeScore, won: homeWon, lost: awayWon, label: 'HOME' },
          { team: game.awayTeam, score: game.awayScore, won: awayWon, lost: homeWon, label: 'AWAY' },
        ].map(row => (
          <div key={row.label} className={`flex items-center gap-3 ${row.lost ? 'opacity-40' : ''}`}>
            <span className="text-xs font-mono text-dvsl-muted w-10 shrink-0">{row.label}</span>
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: getTeamByName(row.team)?.color || '#5a6472' }}
            />
            <span className="flex-1 font-medium text-dvsl-text text-sm">{row.team}</span>
            <span className={`font-display font-bold text-xl tabular-nums ${row.won ? 'text-dvsl-lime' : 'text-dvsl-text'}`}>
              {row.score ?? '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Field */}
      <p className="mt-3 text-xs text-dvsl-muted font-mono truncate">{game.field}</p>
    </div>
  )
}
