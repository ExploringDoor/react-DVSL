import { TEAMS } from '../data/teams'
import { STANDINGS } from '../data/standings'

// Playoff bracket data — Gold (top 4) and Silver (bottom 4) double elimination
const BRACKET = {
  gold: {
    label: 'Gold Bracket',
    subtitle: 'Top 4 Teams',
    color: '#f59e0b',
    rounds: [
      {
        name: 'Semifinal',
        games: [
          { id: 'gG1', home: "Goldstein's", away: 'Beth Or Blue', homeScore: 11, awayScore: 7, status: 'final', note: '#1 vs #4' },
          { id: 'gG2', home: 'TBIR',        away: 'Shir Ami',     homeScore: 9,  awayScore: 6, status: 'final', note: '#2 vs #3' },
        ],
      },
      {
        name: 'Final',
        games: [
          { id: 'gG3', home: "Goldstein's", away: 'TBIR', homeScore: null, awayScore: null, status: 'upcoming', note: 'Championship' },
        ],
      },
    ],
  },
  silver: {
    label: 'Silver Bracket',
    subtitle: 'Bottom 4 Teams',
    color: '#9ca3af',
    rounds: [
      {
        name: 'Semifinal',
        games: [
          { id: 'gS1', home: 'Keneseth Israel', away: 'Adath Jeshurun', homeScore: 12, awayScore: 8, status: 'final', note: '#5 vs #8' },
          { id: 'gS2', home: 'TSMC',            away: 'BSMC',           homeScore: 10, awayScore: 5, status: 'final', note: '#6 vs #7' },
        ],
      },
      {
        name: 'Final',
        games: [
          { id: 'gS3', home: 'Keneseth Israel', away: 'TSMC', homeScore: null, awayScore: null, status: 'upcoming', note: 'Silver Championship' },
        ],
      },
    ],
  },
}

function teamColor(name) {
  return TEAMS.find(t => t.name === name)?.color || '#6b7280'
}

function BracketGame({ game }) {
  const isFinal = game.status === 'final'
  const homeWon = isFinal && game.homeScore > game.awayScore
  const awayWon = isFinal && game.awayScore > game.homeScore

  return (
    <div className="card overflow-hidden min-w-[220px]">
      {game.note && (
        <div className="px-3 py-1.5 border-b border-dvsl-border bg-dvsl-bg">
          <span className="text-dvsl-muted text-xs font-mono">{game.note}</span>
        </div>
      )}
      {[
        { name: game.away, score: game.awayScore, won: awayWon },
        { name: game.home, score: game.homeScore, won: homeWon },
      ].map(side => (
        <div key={side.name} className={`flex items-center justify-between px-3 py-2.5 border-b border-dvsl-border last:border-0 ${side.won ? 'bg-dvsl-lime/5' : ''}`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: teamColor(side.name) }} />
            <span className={`text-sm ${side.won ? 'text-dvsl-text font-bold' : 'text-dvsl-muted'}`}>{side.name}</span>
          </div>
          {isFinal ? (
            <span className={`font-mono font-bold ${side.won ? 'text-dvsl-lime' : 'text-dvsl-muted'}`}>{side.score}</span>
          ) : (
            <span className="text-dvsl-muted font-mono text-xs">TBD</span>
          )}
        </div>
      ))}
    </div>
  )
}

function BracketSection({ bracket }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-3 h-3 rounded-full" style={{ background: bracket.color }} />
        <div>
          <h2 className="font-display text-2xl text-dvsl-text">{bracket.label}</h2>
          <p className="text-dvsl-muted text-xs">{bracket.subtitle}</p>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-2">
        {bracket.rounds.map((round, ri) => (
          <div key={ri} className="shrink-0">
            <p className="section-label mb-3 text-[10px]">{round.name}</p>
            <div className="flex flex-col gap-4 justify-center" style={{ minHeight: ri === 0 ? 'auto' : '100%' }}>
              {round.games.map(g => <BracketGame key={g.id} game={g} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Playoffs() {
  const top4 = STANDINGS.slice(0, 4)
  const bot4 = STANDINGS.slice(4, 8)

  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="section-label mb-2">2025 Season</p>
          <h1 className="font-display text-5xl text-dvsl-text">Playoffs</h1>
          <p className="text-dvsl-muted text-sm mt-1">Double elimination · Gold &amp; Silver Brackets</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Seeds */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="section-label mb-3" style={{ color: '#f59e0b' }}>Gold Seeds</p>
            <div className="space-y-2">
              {top4.map((r, i) => {
                const t = TEAMS.find(t => t.name === r.team)
                return (
                  <div key={r.team} className="flex items-center gap-2 text-sm">
                    <span className="text-dvsl-gold font-mono w-4">#{i+1}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: t?.color }} />
                    <span className="text-dvsl-text flex-1">{r.team}</span>
                    <span className="text-dvsl-muted font-mono text-xs">{r.w}-{r.l}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="card p-4">
            <p className="section-label mb-3" style={{ color: '#9ca3af' }}>Silver Seeds</p>
            <div className="space-y-2">
              {bot4.map((r, i) => {
                const t = TEAMS.find(t => t.name === r.team)
                return (
                  <div key={r.team} className="flex items-center gap-2 text-sm">
                    <span className="text-dvsl-muted font-mono w-4">#{i+5}</span>
                    <span className="w-2 h-2 rounded-full" style={{ background: t?.color }} />
                    <span className="text-dvsl-text flex-1">{r.team}</span>
                    <span className="text-dvsl-muted font-mono text-xs">{r.w}-{r.l}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Brackets */}
        <BracketSection bracket={BRACKET.gold} />
        <BracketSection bracket={BRACKET.silver} />

        {/* Format note */}
        <div className="card p-4 text-sm text-dvsl-muted">
          <p className="section-label mb-2">Format</p>
          <p>Double elimination — each bracket plays separately. All teams are guaranteed at least two playoff games. Seeds 1–4 compete for the Gold championship; Seeds 5–8 for the Silver championship.</p>
        </div>
      </div>
    </div>
  )
}
