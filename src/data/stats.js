// Auto-compute AVG, OBP, SLG from raw numbers
const compute = p => {
  const ab = p.ab || 1
  const pa = p.pa || ab + (p.bb || 0)
  const avg  = (p.h  / ab).toFixed(3).replace('0.', '.')
  const obp  = ((p.h + (p.bb||0)) / pa).toFixed(3).replace('0.', '.')
  const slg  = ((p.h + p.d2*(2-1) + p.d3*(3-1) + p.hr*(4-1)) / ab).toFixed(3).replace('0.', '.')
  return { ...p, avg, obp, slg }
}

export const PLAYERS = [
  // Beth Chaim
  compute({ name:'D. Goldstein',  team:'Beth Chaim',         pa:45, ab:40, h:17, d2:4, d3:1, hr:3, rbi:14, r:12, bb:5, so:4,  sb:2 }),
  compute({ name:'M. Levine',     team:'Beth Chaim',         pa:42, ab:38, h:14, d2:3, d3:0, hr:2, rbi:11, r:10, bb:4, so:6,  sb:1 }),
  compute({ name:'R. Cohen',      team:'Beth Chaim',         pa:40, ab:37, h:12, d2:2, d3:1, hr:1, rbi:8,  r:9,  bb:3, so:5,  sb:3 }),
  // Shir Ami
  compute({ name:'A. Rosenberg',  team:'Shir Ami',           pa:44, ab:39, h:16, d2:5, d3:2, hr:2, rbi:13, r:11, bb:5, so:3,  sb:4 }),
  compute({ name:'J. Bloom',      team:'Shir Ami',           pa:41, ab:36, h:13, d2:2, d3:0, hr:4, rbi:15, r:8,  bb:5, so:7,  sb:0 }),
  compute({ name:'B. Katz',       team:'Shir Ami',           pa:38, ab:35, h:11, d2:1, d3:1, hr:1, rbi:7,  r:7,  bb:3, so:4,  sb:2 }),
  // Knesset Israel
  compute({ name:'P. Weiss',      team:'Knesset Israel',     pa:43, ab:38, h:15, d2:3, d3:1, hr:2, rbi:12, r:10, bb:5, so:5,  sb:1 }),
  compute({ name:'H. Klein',      team:'Knesset Israel',     pa:40, ab:37, h:13, d2:2, d3:0, hr:3, rbi:10, r:9,  bb:3, so:6,  sb:0 }),
  // B'nai Aaron
  compute({ name:'J. Stein',      team:"B'nai Aaron",        pa:42, ab:38, h:14, d2:4, d3:1, hr:1, rbi:9,  r:8,  bb:4, so:8,  sb:5 }),
  compute({ name:'N. Friedman',   team:"B'nai Aaron",        pa:39, ab:36, h:11, d2:2, d3:0, hr:2, rbi:8,  r:7,  bb:3, so:5,  sb:2 }),
  // Beth El
  compute({ name:'R. Schwartz',   team:'Beth El',            pa:41, ab:37, h:13, d2:3, d3:2, hr:0, rbi:7,  r:9,  bb:4, so:4,  sb:6 }),
  compute({ name:'S. Horowitz',   team:'Beth El',            pa:38, ab:35, h:10, d2:1, d3:1, hr:2, rbi:9,  r:6,  bb:3, so:7,  sb:1 }),
  // Adath
  compute({ name:'B. Cohen',      team:'Adath Congregation', pa:40, ab:37, h:12, d2:2, d3:0, hr:1, rbi:6,  r:6,  bb:3, so:9,  sb:0 }),
  compute({ name:'E. Shapiro',    team:'Adath Congregation', pa:37, ab:34, h:9,  d2:1, d3:0, hr:0, rbi:4,  r:5,  bb:3, so:6,  sb:1 }),
]

export const getLeaders = stat => [...PLAYERS].sort((a,b) => {
  const va = parseFloat(a[stat]) || a[stat] || 0
  const vb = parseFloat(b[stat]) || b[stat] || 0
  return vb - va
}).slice(0, 5)

export const STAT_COLS = [
  { key:'avg',  label:'AVG',  tip:'Batting Average' },
  { key:'obp',  label:'OBP',  tip:'On-Base Percentage' },
  { key:'slg',  label:'SLG',  tip:'Slugging Percentage' },
  { key:'h',    label:'H',    tip:'Hits' },
  { key:'hr',   label:'HR',   tip:'Home Runs' },
  { key:'rbi',  label:'RBI',  tip:'Runs Batted In' },
  { key:'r',    label:'R',    tip:'Runs Scored' },
  { key:'d2',   label:'2B',   tip:'Doubles' },
  { key:'d3',   label:'3B',   tip:'Triples' },
  { key:'bb',   label:'BB',   tip:'Walks' },
  { key:'so',   label:'SO',   tip:'Strikeouts' },
  { key:'sb',   label:'SB',   tip:'Stolen Bases' },
  { key:'ab',   label:'AB',   tip:'At-Bats' },
]
