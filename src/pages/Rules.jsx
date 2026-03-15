const RULES = [
  {
    section: 'General Rules',
    icon: '📋',
    items: [
      'All games are governed by ASA/USA Softball rules, except as modified below.',
      'Games are 7 innings or 65 minutes, whichever comes first. No new inning shall start after 60 minutes.',
      'A game is considered official after 4 full innings (3½ if the home team is ahead).',
      'Mercy rule: 15 runs after 3 innings, 10 runs after 5 innings.',
      'Teams must field a minimum of 8 players to avoid forfeit. The missing spots in the batting order are automatic outs.',
      'Managers must exchange lineup cards with the plate umpire before the game.',
    ],
  },
  {
    section: 'Batting & Hitting',
    icon: '🥎',
    items: [
      'A 12-inch slow-pitch softball is used. The DVSL uses Dudley Thunder ZN balls.',
      'Strike zone mat is used — any pitch landing on the mat is a strike regardless of batter action.',
      'Each batter starts with a 1-1 count.',
      'A foul ball on a 2-strike count is an out.',
      'Home runs over the fence are allowed; unlimited HR rule applies in regular season only.',
      'Batting helmets are mandatory for all batters and base runners.',
    ],
  },
  {
    section: 'Baserunning',
    icon: '🏃',
    items: [
      'Leading off and stealing bases are not permitted.',
      'Bunting and slap hitting are prohibited.',
      'A runner may not advance on a dropped third strike.',
      'Courtesy runners are permitted once per inning per team — the runner must be the last recorded out.',
      'Sliding is permitted but discouraged. Aggressive collisions at home plate may result in ejection.',
      'Double bag (orange bag) is in use at first base — batters use the orange bag, fielders use the white bag.',
    ],
  },
  {
    section: 'Pitching',
    icon: '🤾',
    items: [
      'All pitching is slow-pitch. The ball must arc between 6 and 12 feet above the ground.',
      'Pitchers must pitch from the rubber and keep one foot on the rubber until the ball is released.',
      'There is no limit on pitches per game or inning.',
      'Intentional walks: the pitcher may announce an intentional walk without throwing any pitches.',
    ],
  },
  {
    section: 'Lineup & Substitutions',
    icon: '📝',
    items: [
      'Teams may bat up to 12 players with free defensive substitution.',
      'Once a player is removed from the batting order, they may not re-enter.',
      'Injured player substitution: if a player is injured and no substitute is available, that spot is skipped (no automatic out).',
      'Teams may play with a continuous batting order — all present players bat.',
    ],
  },
  {
    section: 'Sportsmanship & Conduct',
    icon: '🤝',
    items: [
      'Umpire decisions are final. Arguing balls and strikes will result in a warning, then ejection.',
      'Verbal abuse of umpires, opposing players, or spectators will result in immediate ejection.',
      'Ejected players must leave the field and surrounding area.',
      'Alcohol is not permitted on or near the playing field.',
      'DVSL emphasizes sportsmanship, community, and fun. Treat opponents with respect.',
    ],
  },
  {
    section: 'Fields & Scheduling',
    icon: '🏟️',
    items: [
      'Home team is responsible for field preparation (raking bases, lining if needed).',
      'In case of rain, the league coordinator will notify managers by 8:00 AM on game day.',
      'Rainouts will be rescheduled at the discretion of the league coordinator.',
      'Games cannot be rescheduled by teams unilaterally — contact the league coordinator.',
      'DVSL fields: Mondauk Park (Fields 4 & 5), Southampton Township, Sunnybrook, Warwick, Plymouth Meeting, Horsham, Ridgeway.',
    ],
  },
  {
    section: 'Playoffs',
    icon: '🏆',
    items: [
      'Top 4 teams qualify for Gold Bracket; bottom 4 for Silver Bracket.',
      'Both brackets use double-elimination format.',
      'Playoff seeding is determined by win percentage, then run differential.',
      'Ties in standings are broken by: 1) head-to-head record, 2) run differential (max ±30 per game), 3) coin flip.',
      'All playoff games must be played to completion — no time limit.',
      'Playoff rosters are frozen one week before playoff start.',
    ],
  },
]

export default function Rules() {
  return (
    <div className="min-h-screen bg-dvsl-bg pt-16">
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="section-label mb-2">DVSL Softball</p>
          <h1 className="font-display text-5xl text-dvsl-text">Field Guide</h1>
          <p className="text-dvsl-muted text-sm mt-1">Official rules and guidelines for the 2025 season</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Quick-nav */}
        <div className="card p-4 mb-8">
          <p className="section-label mb-3">Jump To</p>
          <div className="flex flex-wrap gap-2">
            {RULES.map(r => (
              <a
                key={r.section}
                href={`#${r.section.replace(/\s+/g,'-').toLowerCase()}`}
                className="pill-inactive"
              >
                {r.icon} {r.section}
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {RULES.map(r => (
            <div key={r.section} id={r.section.replace(/\s+/g,'-').toLowerCase()} className="card p-6">
              <h2 className="font-display text-2xl text-dvsl-text mb-4 flex items-center gap-2">
                <span>{r.icon}</span> {r.section}
              </h2>
              <ol className="space-y-2">
                {r.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-dvsl-muted">
                    <span className="text-dvsl-lime font-mono text-xs mt-0.5 shrink-0">{String(i+1).padStart(2,'0')}</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-4 text-sm text-dvsl-muted text-center">
          Questions? Contact the league coordinator. Rules subject to change by league vote.
        </div>
      </div>
    </div>
  )
}
