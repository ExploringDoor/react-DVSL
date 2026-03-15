const RULES = [
  {
    num: '01',
    title: 'Game Duration',
    body: '7 innings or 75-minute time limit, whichever comes first. No new inning starts after the time limit. Ties stand as ties after time expires.',
  },
  {
    num: '02',
    title: 'Pitching Arc',
    body: 'Pitches must travel in an arc between 6 and 12 feet high. Umpire judgment is final. Three illegal pitches in an at-bat results in an out.',
  },
  {
    num: '03',
    title: 'Strike Zone',
    body: 'A mat behind home plate is the strike zone. Any pitch hitting the mat is a strike regardless of swing. Umpires may override for obvious illegal pitches.',
  },
  {
    num: '04',
    title: 'Run Limit',
    body: '5-run limit per half-inning except the final inning, which is open. The home team may score as many runs as needed to walk off in the last inning.',
  },
  {
    num: '05',
    title: 'Roster Rules',
    body: 'Minimum 8 players to start a game; fewer than 8 is a forfeit. A batter vacating the lineup due to injury is an out. Batting order does not shorten when a player leaves.',
  },
  {
    num: '06',
    title: 'Courtesy Runner',
    body: 'One courtesy runner per inning, for the catcher only. The courtesy runner must be the last recorded out. Runners may not be substituted mid-base.',
  },
  {
    num: '07',
    title: 'Commitment Base',
    body: 'An orange commitment base is in play at first base to prevent collisions on close plays. Runners must touch the orange base; fielders must touch the white base on force plays.',
  },
  {
    num: '08',
    title: 'Home Run Rule',
    body: 'Each team is limited to 3 home runs per game. Additional fair balls hit over the fence are outs. All home runs must be announced to the plate umpire.',
  },
  {
    num: '09',
    title: 'Weather & Delays',
    body: 'Games are suspended on thunder or lightning. A mandatory 30-minute wait begins from the last sighting. The umpire has final authority on all weather-related decisions.',
  },
  {
    num: '10',
    title: 'Playoffs',
    body: 'Top 4 teams at season end advance to the playoffs. Seeding is by win percentage, then head-to-head, then run differential. Playoff games have no time limit.',
  },
]

export default function Rules() {
  return (
    <div className="min-h-screen bg-dvsl-bg pt-24">
      {/* Header */}
      <div className="border-b border-dvsl-border bg-dvsl-surface">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="tag mb-2">Official Rules</p>
          <h1 className="font-display font-bold text-4xl text-dvsl-text">Field Guide</h1>
          <p className="text-dvsl-muted text-sm mt-1">2025 DVSL Men's Slow-Pitch Rules Summary</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {RULES.map(rule => (
            <div key={rule.num} className="card p-5 flex gap-5">
              <div className="shrink-0">
                <span className="font-display font-black text-3xl text-dvsl-border leading-none">{rule.num}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-dvsl-text mb-1">{rule.title}</h3>
                <p className="text-dvsl-muted text-sm leading-relaxed">{rule.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 card p-5 border-dvsl-lime/30 bg-dvsl-lime/5">
          <p className="text-dvsl-lime text-xs font-mono font-semibold tracking-widest uppercase mb-2">Full Ruleset</p>
          <p className="text-dvsl-muted text-sm mb-3">
            This is an abbreviated summary. The official DVSL rulebook governs all disputes.
          </p>
          <a
            href="https://s3.amazonaws.com/file.imleagues/Images/Schools/Uploaded/202503/202538222742.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            ⬇ Download Full PDF
          </a>
        </div>
      </div>
    </div>
  )
}
