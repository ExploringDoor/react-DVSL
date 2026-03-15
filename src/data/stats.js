const RAW_STATS = [
  // Goldstein's
  { id: 1,  name: 'Mike Goldstein',   team: "Goldstein's",    gp:6, ab:22, h:11, r:9,  rbi:8,  hr:3, bb:3, so:2, sb:2, doubles:3, triples:1 },
  { id: 2,  name: 'Danny Fried',      team: "Goldstein's",    gp:6, ab:20, h:9,  r:6,  rbi:6,  hr:1, bb:4, so:3, sb:4, doubles:2, triples:0 },
  { id: 3,  name: 'Stu Applebaum',    team: "Goldstein's",    gp:6, ab:18, h:7,  r:5,  rbi:5,  hr:2, bb:2, so:4, sb:1, doubles:1, triples:0 },
  { id: 4,  name: 'Larry Klein',      team: "Goldstein's",    gp:5, ab:16, h:5,  r:4,  rbi:3,  hr:0, bb:1, so:5, sb:0, doubles:1, triples:1 },
  { id: 5,  name: 'Howie Rosen',      team: "Goldstein's",    gp:6, ab:20, h:8,  r:7,  rbi:4,  hr:1, bb:5, so:2, sb:3, doubles:2, triples:0 },
  // Beth Or Blue
  { id: 6,  name: 'Alan Schwartz',    team: 'Beth Or Blue',   gp:6, ab:21, h:10, r:8,  rbi:7,  hr:2, bb:2, so:3, sb:1, doubles:3, triples:0 },
  { id: 7,  name: 'Eric Blum',        team: 'Beth Or Blue',   gp:6, ab:19, h:8,  r:5,  rbi:5,  hr:1, bb:3, so:2, sb:2, doubles:2, triples:1 },
  { id: 8,  name: 'Phil Shore',       team: 'Beth Or Blue',   gp:5, ab:17, h:6,  r:4,  rbi:4,  hr:1, bb:1, so:4, sb:0, doubles:1, triples:0 },
  // TBIR
  { id: 9,  name: 'Rob Frankel',      team: 'TBIR',           gp:6, ab:22, h:9,  r:8,  rbi:9,  hr:3, bb:2, so:3, sb:1, doubles:2, triples:1 },
  { id: 10, name: 'Steve Rubin',      team: 'TBIR',           gp:6, ab:20, h:8,  r:6,  rbi:6,  hr:2, bb:4, so:1, sb:3, doubles:1, triples:0 },
  { id: 11, name: 'Jeff Landau',      team: 'TBIR',           gp:6, ab:18, h:7,  r:5,  rbi:5,  hr:0, bb:3, so:5, sb:2, doubles:2, triples:0 },
  // Shir Ami
  { id: 12, name: 'Dave Levine',      team: 'Shir Ami',       gp:6, ab:21, h:9,  r:7,  rbi:5,  hr:1, bb:5, so:2, sb:4, doubles:3, triples:1 },
  { id: 13, name: 'Marc Greenberg',   team: 'Shir Ami',       gp:6, ab:19, h:7,  r:5,  rbi:4,  hr:0, bb:2, so:4, sb:1, doubles:1, triples:0 },
  { id: 14, name: 'Todd Bernstein',   team: 'Shir Ami',       gp:5, ab:17, h:6,  r:4,  rbi:3,  hr:1, bb:1, so:3, sb:0, doubles:0, triples:0 },
  // Keneseth Israel
  { id: 15, name: 'Josh Cohen',       team: 'Keneseth Israel',gp:6, ab:20, h:8,  r:5,  rbi:6,  hr:2, bb:3, so:3, sb:2, doubles:2, triples:0 },
  { id: 16, name: 'Barry Horowitz',   team: 'Keneseth Israel',gp:6, ab:18, h:6,  r:4,  rbi:4,  hr:0, bb:2, so:5, sb:1, doubles:1, triples:1 },
  // Adath Jeshurun
  { id: 17, name: 'Neil Katz',        team: 'Adath Jeshurun', gp:6, ab:20, h:7,  r:6,  rbi:5,  hr:1, bb:3, so:4, sb:3, doubles:1, triples:0 },
  { id: 18, name: 'Bob Sacks',        team: 'Adath Jeshurun', gp:5, ab:16, h:5,  r:3,  rbi:4,  hr:0, bb:1, so:6, sb:0, doubles:0, triples:0 },
  // TSMC
  { id: 19, name: 'Gary Rubin',       team: 'TSMC',           gp:6, ab:19, h:7,  r:6,  rbi:5,  hr:1, bb:4, so:3, sb:2, doubles:2, triples:0 },
  { id: 20, name: 'Marty Fein',       team: 'TSMC',           gp:6, ab:18, h:6,  r:4,  rbi:4,  hr:0, bb:2, so:4, sb:1, doubles:1, triples:0 },
  // BSMC
  { id: 21, name: 'Larry Weiss',      team: 'BSMC',           gp:6, ab:20, h:7,  r:5,  rbi:5,  hr:1, bb:2, so:3, sb:2, doubles:2, triples:0 },
  { id: 22, name: 'Paul Silverman',   team: 'BSMC',           gp:5, ab:16, h:5,  r:3,  rbi:3,  hr:0, bb:1, so:5, sb:0, doubles:1, triples:1 },
]

function compute(p) {
  const avg  = p.ab > 0 ? p.h / p.ab : 0
  const obp  = (p.ab + p.bb) > 0 ? (p.h + p.bb) / (p.ab + p.bb) : 0
  const slg  = p.ab > 0 ? (p.h - p.doubles - p.triples - p.hr + p.doubles*2 + p.triples*3 + p.hr*4) / p.ab : 0
  return { ...p, avg, obp, slg }
}

export const STATS = RAW_STATS.map(compute)

export function getStatLeaders() {
  return {
    avg:     [...STATS].sort((a,b) => b.avg - a.avg).slice(0,5),
    hr:      [...STATS].sort((a,b) => b.hr  - a.hr ).slice(0,5),
    rbi:     [...STATS].sort((a,b) => b.rbi - a.rbi).slice(0,5),
    h:       [...STATS].sort((a,b) => b.h   - a.h  ).slice(0,5),
    sb:      [...STATS].sort((a,b) => b.sb  - a.sb ).slice(0,5),
    obp:     [...STATS].sort((a,b) => b.obp - a.obp).slice(0,5),
  }
}

export function getStatsByTeam(teamName) {
  return STATS.filter(p => p.team === teamName)
}

export function fmtAvg(n) {
  if (typeof n !== 'number') return '---'
  return n === 1 ? '1.000' : n.toFixed(3).replace(/^0/, '')
}
