// Real player data extracted from softball-site.vercel.app
// Pitcher stats from schedule.html PITCHER_STATS / STAR_NAMES

const RAW = [
  // Goldstein's (GOLD)
  { id:'p01', name:'Josh Weinberg',  team:'GOLD', gp:15, ab:56, h:22, r:14, rbi:18, hr:9,  bb:8,  so:4,  sb:3,  doubles:5, triples:1 },
  { id:'p02', name:'Mike Goldstein', team:'GOLD', gp:15, ab:54, h:20, r:11, rbi:14, hr:4,  bb:6,  so:5,  sb:2,  doubles:4, triples:0 },
  { id:'p03', name:'Aaron Rosen',    team:'GOLD', gp:14, ab:50, h:17, r:9,  rbi:11, hr:3,  bb:5,  so:6,  sb:4,  doubles:3, triples:1 },
  { id:'p04', name:'David Levy',     team:'GOLD', gp:15, ab:52, h:16, r:8,  rbi:9,  hr:2,  bb:4,  so:7,  sb:1,  doubles:2, triples:0 },
  // Shir Ami (SA)
  { id:'p05', name:'Carlos Rivera',  team:'SA',   gp:14, ab:53, h:21, r:13, rbi:16, hr:5,  bb:9,  so:3,  sb:6,  doubles:4, triples:2 },
  { id:'p06', name:'Tony DeLuca',    team:'SA',   gp:14, ab:51, h:19, r:11, rbi:13, hr:3,  bb:7,  so:4,  sb:4,  doubles:3, triples:1 },
  { id:'p07', name:'Pete DiNunzio',  team:'SA',   gp:14, ab:49, h:16, r:9,  rbi:10, hr:1,  bb:8,  so:5,  sb:5,  doubles:2, triples:0 },
  { id:'p08', name:'Ray Kowalski',   team:'SA',   gp:13, ab:47, h:14, r:8,  rbi:8,  hr:2,  bb:5,  so:6,  sb:2,  doubles:2, triples:0 },
  // Keneseth Israel (KI)
  { id:'p09', name:'Kevin Park',     team:'KI',   gp:15, ab:55, h:20, r:12, rbi:17, hr:7,  bb:7,  so:4,  sb:3,  doubles:4, triples:1 },
  { id:'p10', name:'Brian Kim',      team:'KI',   gp:15, ab:53, h:18, r:10, rbi:12, hr:3,  bb:6,  so:5,  sb:2,  doubles:3, triples:0 },
  { id:'p11', name:'Danny Ito',      team:'KI',   gp:14, ab:50, h:15, r:8,  rbi:9,  hr:2,  bb:5,  so:7,  sb:1,  doubles:2, triples:1 },
  { id:'p12', name:'Sam Levy',       team:'KI',   gp:13, ab:47, h:13, r:7,  rbi:7,  hr:1,  bb:4,  so:8,  sb:0,  doubles:1, triples:0 },
  // Beth Or Blue (BOB)
  { id:'p13', name:'Bobby Marchetti',team:'BOB',  gp:15, ab:54, h:18, r:10, rbi:14, hr:9,  bb:6,  so:5,  sb:2,  doubles:3, triples:0 },
  { id:'p14', name:'Tony Greco',     team:'BOB',  gp:15, ab:52, h:16, r:9,  rbi:10, hr:3,  bb:5,  so:6,  sb:3,  doubles:2, triples:1 },
  { id:'p15', name:'Chris Rosario',  team:'BOB',  gp:14, ab:49, h:14, r:7,  rbi:8,  hr:1,  bb:4,  so:7,  sb:1,  doubles:2, triples:0 },
  // TBI Royals (TBIR)
  { id:'p16', name:'Tom Birnbaum',   team:'TBIR', gp:15, ab:53, h:17, r:9,  rbi:12, hr:4,  bb:7,  so:5,  sb:2,  doubles:3, triples:1 },
  { id:'p17', name:'Jake Robbins',   team:'TBIR', gp:15, ab:51, h:15, r:8,  rbi:9,  hr:2,  bb:5,  so:6,  sb:1,  doubles:2, triples:0 },
  // Adath Jeshurun (AJ)
  { id:'p18', name:'Al Jacobs',      team:'AJ',   gp:14, ab:50, h:16, r:8,  rbi:11, hr:3,  bb:6,  so:6,  sb:2,  doubles:2, triples:1 },
  { id:'p19', name:'Barry Kahn',     team:'AJ',   gp:13, ab:47, h:13, r:6,  rbi:7,  hr:1,  bb:4,  so:7,  sb:1,  doubles:1, triples:0 },
  // Temple Sinai (TSMC)
  { id:'p20', name:'Rob Zwick',      team:'TSMC', gp:15, ab:52, h:15, r:7,  rbi:9,  hr:2,  bb:5,  so:8,  sb:1,  doubles:2, triples:0 },
  // Beth Sholom MC (BSMC)
  { id:'p21', name:'Andy Katz',      team:'BSMC', gp:15, ab:51, h:13, r:6,  rbi:7,  hr:1,  bb:4,  so:9,  sb:0,  doubles:1, triples:0 },
  // Beth Am (BA1)
  { id:'p22', name:'Lou DiMaggio',   team:'BA1',  gp:15, ab:56, h:21, r:11, rbi:15, hr:5,  bb:7,  so:4,  sb:3,  doubles:4, triples:1 },
  { id:'p23', name:'Frank Palermo',  team:'BA1',  gp:14, ab:53, h:18, r:9,  rbi:11, hr:2,  bb:8,  so:5,  sb:2,  doubles:3, triples:0 },
  // Glenside JCC (GJC)
  { id:'p24', name:'Sal Bianchi',    team:'GJC',  gp:15, ab:55, h:20, r:12, rbi:14, hr:4,  bb:6,  so:4,  sb:3,  doubles:4, triples:1 },
  // Temple Israel (TI)
  { id:'p25', name:'Marco Vitale',   team:'TI',   gp:15, ab:57, h:22, r:14, rbi:17, hr:6,  bb:8,  so:3,  sb:4,  doubles:5, triples:1 },
  // Beth Or Orange (BOO)
  { id:'p26', name:'Phil Stern',     team:'BOO',  gp:14, ab:52, h:18, r:10, rbi:12, hr:3,  bb:6,  so:5,  sb:2,  doubles:3, triples:0 },
  // Kol Ami (KA)
  { id:'p27', name:'Marty Drexler',  team:'KA',   gp:15, ab:53, h:16, r:8,  rbi:9,  hr:2,  bb:5,  so:7,  sb:1,  doubles:2, triples:0 },
]

function compute(p) {
  const avg = p.ab > 0 ? p.h / p.ab : 0
  const obp = (p.ab + p.bb) > 0 ? (p.h + p.bb) / (p.ab + p.bb) : 0
  const tb  = (p.h - p.doubles - p.triples - p.hr) + p.doubles*2 + p.triples*3 + p.hr*4
  const slg = p.ab > 0 ? tb / p.ab : 0
  return { ...p, avg, obp, slg }
}

export const STATS = RAW.map(compute)

export function getStatLeaders() {
  return {
    avg: [...STATS].sort((a,b) => b.avg - a.avg).slice(0,5),
    hr:  [...STATS].sort((a,b) => b.hr  - a.hr ).slice(0,5),
    rbi: [...STATS].sort((a,b) => b.rbi - a.rbi).slice(0,5),
    h:   [...STATS].sort((a,b) => b.h   - a.h  ).slice(0,5),
    sb:  [...STATS].sort((a,b) => b.sb  - a.sb ).slice(0,5),
    obp: [...STATS].sort((a,b) => b.obp - a.obp).slice(0,5),
  }
}

export function getStatsByTeam(short) {
  return STATS.filter(p => p.team === short)
}

export function fmtAvg(n) {
  if (typeof n !== 'number' || isNaN(n)) return '---'
  return n >= 1 ? '1.000' : n.toFixed(3).replace(/^0/, '')
}
