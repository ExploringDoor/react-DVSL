// 2025 final records shown in ticker (last season)
export const TEAMS = [
  { id:'gold', name:"Goldstein's",               short:'GOLD', color:'#F5C842', field:'Mondauk 4',   w:17, l:3  },
  { id:'sa',   name:'Shir Ami',                  short:'SA',   color:'#4ade80', field:'Southampton', w:12, l:5  },
  { id:'ki',   name:'Keneseth Israel',           short:'KI',   color:'#60a5fa', field:'Mondauk 5',   w:12, l:7  },
  { id:'bob',  name:'Beth Or Blue',              short:'BOB',  color:'#f87171', field:'Sunnybrook',  w:9,  l:7  },
  { id:'tbir', name:'TBI Royals',                short:'TBIR', color:'#c084fc', field:'Warwick',     w:12, l:5  },
  { id:'aj',   name:'Adath Jeshurun',            short:'AJ',   color:'#fb923c', field:'Plymouth',    w:7,  l:11 },
  { id:'tsmc', name:'Temple Sinai Mens Club',    short:'TSMC', color:'#2dd4bf', field:'Horsham',     w:1,  l:14 },
  { id:'bsmc', name:'Beth Sholom Mens Club',     short:'BSMC', color:'#f472b6', field:'Ridgeway',    w:10, l:10 },
  { id:'ba',   name:'Beth Am',                   short:'BA1',  color:'#facc15', field:'Mondauk 4',   w:15, l:3  },
  { id:'bos',  name:'Beth Or Silver',            short:'BOR',  color:'#94a3b8', field:'Mondauk 4',   w:6,  l:11 },
  { id:'tbi',  name:'TBI Jaguars',               short:'TBI1', color:'#a78bfa', field:'Mondauk 5',   w:8,  l:11 },
  { id:'bsb',  name:'Beth Sholom Blue',          short:'BSB',  color:'#818cf8', field:'Mondauk 5',   w:6,  l:12 },
  { id:'gjc',  name:'Glenside JCC',              short:'GJC',  color:'#38bdf8', field:'Mondauk 4',   w:10, l:6  },
  { id:'bami', name:'Beth Am Marlins',           short:'BAMI', color:'#e86030', field:'Mondauk 4',   w:6,  l:13 },
  { id:'boo',  name:'Beth Or Orange',            short:'BOO',  color:'#a3e635', field:'Mondauk 4',   w:7,  l:7  },
  { id:'os',   name:'Or Shalom',                 short:'OS',   color:'#cbd5e1', field:'Mondauk 4',   w:3,  l:12 },
  { id:'ti',   name:'Temple Israel',             short:'TI',   color:'#e879f9', field:'Warwick',     w:10, l:5  },
  { id:'ka',   name:'Kol Ami',                   short:'KA',   color:'#34d399', field:'Mondauk 4',   w:6,  l:9  },
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
