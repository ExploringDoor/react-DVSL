import { Link } from 'react-router-dom'
import { getStandings } from '../data/standings'
import { LEAGUE_HISTORY } from '../data/standings'

// ─── PLAYOFF DATA ───────────────────────────────────────────────
// When playoffs happen, fill these in. Set playoffsStarted = true
// and add results to BRACKET. Seeds auto-populate from standings.
const playoffsStarted = false
const playoffDate = 'July 13, 2025'

const BRACKET = {
  semi1: { homeScore: null, awayScore: null, winner: null },
  semi2: { homeScore: null, awayScore: null, winner: null },
  final: { homeScore: null, awayScore: null, winner: null, mvp: null },
}
// ────────────────────────────────────────────────────────────────

function Seed({ rank, team, dim = false }) {
  if (!team) return (
    <div className={`flex items-center gap-3 px-4 py-3 ${dim ? 'opacity-30' : ''}`}>
      <span className="font-mono text-xs text-dvsl-muted w-4">{rank}</span>
      <div className="w-2 h-2 rounded-full bg-dvsl-border shrink-0" />
      <span className="text-dvsl-muted text-sm italic">TBD</span>
    </div>
  )
  return (
    <Link
      to={`/teams/${team.id}`}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-dvsl-surface/50 transition-colors group ${dim ? 'opacity-40' : ''}`}
    >
      <span className="font-mono text-xs text-dvsl-muted w-4">{rank}</span>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: team.color }} />
      <span className="flex-1 text-sm font-medium text-dvsl-text group-hover:text-dvsl-lime transition-colors">{team.name}</span>
      <span className="font-mono text-xs text-dvsl-muted">{team.wins}-{team.losses}</span>
    </Link>
  )
}

function BracketMatchup({ label, date, topSeed, topScore, botSeed, botScore, winner, dim = false }) {
  return (
    <div className={`card overflow-hidden ${dim ? 'opacity-50' : ''}`}>
      <div className="px-4 py-2 border-b border-dvsl-border bg-dvsl-surface">
        <span className="text-xs font-mono text-dvsl-muted tracking-widest uppercase">{label}</span>
        {date && <span className="text-xs font-mono text-dvsl-muted ml-3">· {date}</span>}
      </div>
      {[
        { seed: topSeed, score: topScore },
        { seed: botSeed, score: botScore },
      ].map((row, i) => {
        const isWinner = winner && row.seed?.name === winner
        const isLoser  = winner && row.seed?.name !== winner
        return (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 border-b border-dvsl-border/40 last:border-0 ${isLoser ? 'opacity-40' : ''}`}
          >
            {row.seed ? (
              <>
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.seed.color }} />
                <span className={`flex-1 text-sm font-medium ${isWinner ? 'text-dvsl-lime' : 'text-dvsl-text'}`}>
                  {row.seed.name}
                </span>
                <span className={`font-mono font-bold tabular-nums text-lg ${isWinner ? 'text-dvsl-lime' : 'text-dvsl-muted'}`}>
                  {row.score ?? '—'}
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-dvsl-border shrink-0" />
                <span className="flex-1 text-sm text-dvsl-muted italic">TBD</span>
                <span className="font-mono text-dvsl-border text-lg">—</span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Playoffs() {
  const standings = getStandings()
  const [s1, s2, s3, s4] = standings  // top 4 by record

  const lastChamp = LEAGUE_HISTORY[0]

  // Seeding matchups: 1 vs 4, 2 vs 3
  const semi1Top = s1
  const semi1Bot = s4
  const semi2Top = s2
  const semi2Bot = s3

  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="tag mb-2">2025 Season</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Playoffs</h1>
          <p className="text-dvsl-muted text-sm mt-1">
            Top 4 teams advance · {playoffsStarted ? 'Bracket in progress' : `Begin ${playoffDate}`}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Coming Soon banner (hidden once playoffs start) */}
        {!playoffsStarted && (
          <div className="card p-8 text-center mb-10 border-dvsl-lime/20 bg-dvsl-lime/5">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-display font-bold text-3xl text-dvsl-text mb-2">Bracket Coming Soon</h2>
            <p className="text-dvsl-muted text-sm max-w-md mx-auto">
              The 2025 playoff bracket will go live once the regular season concludes.
              Playoffs begin <span className="text-dvsl-text font-medium">{playoffDate}</span>.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Projected seeds */}
          <div>
            <h2 className="section-title mb-1">
              {playoffsStarted ? 'Seeds' : 'Projected Seeds'}
            </h2>
            <p className="text-dvsl-muted text-xs font-mono mb-4">Based on current standings</p>
            <div className="card divide-y divide-dvsl-border/40 mb-6">
              <Seed rank="1" team={s1} />
              <Seed rank="2" team={s2} />
              <Seed rank="3" team={s3} />
              <Seed rank="4" team={s4} />
            </div>

            {/* Eliminated teams */}
            <p className="text-xs font-mono text-dvsl-muted uppercase tracking-widest mb-3">Eliminated</p>
            <div className="card divide-y divide-dvsl-border/40">
              {standings.slice(4).map((t, i) => (
                <Seed key={t.id} rank={i + 5} team={t} dim />
              ))}
            </div>
          </div>

          {/* Bracket */}
          <div className="lg:col-span-2">
            <h2 className="section-title mb-1">Bracket</h2>
            <p className="text-dvsl-muted text-xs font-mono mb-4">
              {playoffsStarted ? 'Results' : 'Structure — results TBD'}
            </p>

            {/* Semis */}
            <div className="space-y-3 mb-6">
              <BracketMatchup
                label="Semifinal 1 · #1 vs #4"
                date={playoffsStarted ? undefined : playoffDate}
                topSeed={semi1Top}
                topScore={BRACKET.semi1.homeScore}
                botSeed={semi1Bot}
                botScore={BRACKET.semi1.awayScore}
                winner={BRACKET.semi1.winner}
                dim={!playoffsStarted}
              />
              <BracketMatchup
                label="Semifinal 2 · #2 vs #3"
                date={playoffsStarted ? undefined : playoffDate}
                topSeed={semi2Top}
                topScore={BRACKET.semi2.homeScore}
                botSeed={semi2Bot}
                botScore={BRACKET.semi2.awayScore}
                winner={BRACKET.semi2.winner}
                dim={!playoffsStarted}
              />
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-dvsl-border" />
              <span className="text-dvsl-muted text-xs font-mono">Semi winners advance</span>
              <div className="flex-1 h-px bg-dvsl-border" />
            </div>

            {/* Championship */}
            <BracketMatchup
              label="🏆 Championship"
              topSeed={BRACKET.semi1.winner ? standings.find(t => t.name === BRACKET.semi1.winner) : null}
              topScore={BRACKET.final.homeScore}
              botSeed={BRACKET.semi2.winner ? standings.find(t => t.name === BRACKET.semi2.winner) : null}
              botScore={BRACKET.final.awayScore}
              winner={BRACKET.final.winner}
              dim={!BRACKET.semi1.winner && !playoffsStarted}
            />

            {/* Champion callout */}
            {BRACKET.final.winner && (
              <div className="mt-6 card p-6 text-center border-dvsl-gold/30 bg-dvsl-gold/5">
                <div className="text-4xl mb-2">🏆</div>
                <p className="tag text-dvsl-gold mb-1">2025 Champions</p>
                <h3 className="font-display font-black text-3xl text-dvsl-gold">{BRACKET.final.winner}</h3>
                {BRACKET.final.mvp && (
                  <p className="text-dvsl-muted text-sm mt-2">MVP: <span className="text-dvsl-text">{BRACKET.final.mvp}</span></p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Defending champ note */}
        {lastChamp?.champion && (
          <div className="mt-10 border-t border-dvsl-border pt-6 flex items-center gap-3">
            <span className="text-dvsl-gold text-xl">★</span>
            <p className="text-dvsl-muted text-sm">
              Defending champion: <span className="text-dvsl-text font-medium">{lastChamp.champion}</span>
              <span className="text-dvsl-muted mx-2">·</span>
              {lastChamp.year} Season
              {lastChamp.mvp && <> · MVP: <span className="text-dvsl-text">{lastChamp.mvp}</span></>}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
