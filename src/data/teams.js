export const TEAMS = [
  { id:'gold', name:"Goldstein's",               short:'GOLD', color:'#F5C842', field:'Mondauk 4',   w:9,  l:6,  rs:142, ra:118 },
  { id:'sa',   name:'Shir Ami',                  short:'SA',   color:'#4ade80', field:'Southampton', w:9,  l:5,  rs:158, ra:102 },
  { id:'ki',   name:'Keneseth Israel',           short:'KI',   color:'#60a5fa', field:'Mondauk 5',   w:8,  l:7,  rs:131, ra:124 },
  { id:'bob',  name:'Beth Or Blue',              short:'BOB',  color:'#f87171', field:'Sunnybrook',  w:7,  l:8,  rs:121, ra:130 },
  { id:'tbir', name:'TBI Royals',                short:'TBIR', color:'#c084fc', field:'Warwick',     w:6,  l:9,  rs:118, ra:141 },
  { id:'aj',   name:'Adath Jeshurun',            short:'AJ',   color:'#fb923c', field:'Plymouth',    w:5,  l:9,  rs:109, ra:138 },
  { id:'tsmc', name:'Temple Sinai Mens Club',    short:'TSMC', color:'#2dd4bf', field:'Horsham',     w:5,  l:10, rs:105, ra:149 },
  { id:'bsmc', name:'Beth Sholom Mens Club',     short:'BSMC', color:'#f472b6', field:'Ridgeway',    w:4,  l:11, rs:98,  ra:158 },
  { id:'ba',   name:'Beth Am',                   short:'BA1',  color:'#facc15', field:'Mondauk 4',   w:8,  l:7,  rs:120, ra:118 },
  { id:'bos',  name:'Beth Or Silver',            short:'BOR',  color:'#94a3b8', field:'Mondauk 4',   w:6,  l:9,  rs:105, ra:132 },
  { id:'tbi',  name:'TBI Jaguars',               short:'TBI1', color:'#a78bfa', field:'Mondauk 5',   w:7,  l:8,  rs:112, ra:121 },
  { id:'bsb',  name:'Beth Sholom Blue',          short:'BSB',  color:'#818cf8', field:'Mondauk 5',   w:5,  l:10, rs:99,  ra:140 },
  { id:'gjc',  name:'Glenside JCC',              short:'GJC',  color:'#38bdf8', field:'Mondauk 4',   w:9,  l:6,  rs:138, ra:112 },
  { id:'bami', name:'Beth Am Marlins',           short:'BAMI', color:'#e86030', field:'Mondauk 4',   w:4,  l:11, rs:95,  ra:152 },
  { id:'boo',  name:'Beth Or Orange',            short:'BOO',  color:'#a3e635', field:'Mondauk 4',   w:7,  l:7,  rs:118, ra:118 },
  { id:'os',   name:'Or Shalom',                 short:'OS',   color:'#cbd5e1', field:'Mondauk 4',   w:3,  l:12, rs:88,  ra:165 },
  { id:'ti',   name:'Temple Israel',             short:'TI',   color:'#e879f9', field:'Warwick',     w:10, l:5,  rs:148, ra:105 },
  { id:'ka',   name:'Kol Ami',                   short:'KA',   color:'#34d399', field:'Mondauk 4',   w:6,  l:9,  rs:108, ra:129 },
]

export function getTeamById(id) {
  return TEAMS.find(t => t.id === id) || null
}

export function getTeamByShort(short) {
  return TEAMS.find(t => t.short === short) || null
}

export function teamColor(short) {
  return getTeamByShort(short)?.color || '#6b7280'
}

export function teamId(short) {
  return getTeamByShort(short)?.id || short.toLowerCase()
}
