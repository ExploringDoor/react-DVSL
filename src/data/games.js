// Real 2026 DVSL schedule extracted from softball-site.vercel.app/schedule.html
// Scores for weeks 1-8 are real (from live site); weeks 9+ are upcoming

function fakeScore(away, home, seed) {
  const s = (away.charCodeAt(0) + home.charCodeAt(0) + seed * 7) % 15
  let a = 4 + (s % 8), h = 3 + ((s * 3 + 5) % 7)
  if (a === h) h++
  return { a, h }
}

const DAY_ORDER = { mon:1, tue:2, wed:3, thu:4, fri:5, sat:6, sun:7 }

// Build game list from schedule weeks
// Weeks 1-8 have scores; weeks 9-14 are upcoming
export const RAW_WEEKS = [
  { wk:'A', date:'April 3',   games:[] },
  { wk:'B', date:'April 10',  games:[] },
  { wk:1,   date:'April 17',  games:[
    {day:'mon',field:'Mondauk 4',  away:'OS',  home:'KA',  as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'BOB', home:'TSMC',as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'KA',  home:'BSB', as:null,hs:null},
    {day:'wed',field:'Mondauk 5',  away:'TBI1',home:'GOLD',as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'SA',  home:'BAMI',as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'BOR', home:'BSMC',as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'BA1', home:'BTBJ',as:null,hs:null},
    {day:'thu',field:'South 6pm',  away:'GJC', home:'TBIR',as:null,hs:null},
  ]},
  { wk:2, date:'April 24', games:[
    {day:'mon',field:'Mondauk 4',  away:'OS',  home:'KA',  as:null,hs:null},
    {day:'mon',field:'Warwick',    away:'BA1', home:'TI',  as:null,hs:null},
    {day:'mon',field:'Plymouth',   away:'TSMC',home:'GJC', as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'BAMI',home:'BSMC',as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'TBIR',home:'BOB', as:null,hs:null},
    {day:'wed',field:'Mondauk 5',  away:'TBI1',home:'BOO', as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'SA',  home:'BAMI',as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'BOR', home:'BSMC',as:null,hs:null},
    {day:'thu',field:'South 6pm',  away:'BSB', home:'SA',  as:null,hs:null},
  ]},
  { wk:3, date:'May 1', games:[
    {day:'mon',field:'Mondauk 4',  away:'KA',  home:'GJC', as:null,hs:null},
    {day:'mon',field:'Warwick',    away:'TI',  home:'OS',  as:null,hs:null},
    {day:'mon',field:'Plymouth',   away:'BTBJ',home:'GOLD',as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'BOB', home:'BA1', as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'BSMC',home:'SA',  as:null,hs:null},
    {day:'wed',field:'Mondauk 5',  away:'KI',  home:'TSMC',as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'OS',  home:'BAMI',as:null,hs:null},
    {day:'thu',field:'South 6pm',  away:'GJC', home:'BOR', as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'AJ',  home:'BOB', as:null,hs:null},
  ]},
  { wk:4, date:'May 8', games:[
    {day:'mon',field:'Mondauk 4',  away:'OS',  home:'BOB', as:null,hs:null},
    {day:'mon',field:'Horsham',    away:'TSMC',home:'TBI1',as:null,hs:null},
    {day:'mon',field:'Plymouth',   away:'GJC', home:'BTBJ',as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'AJ',  home:'KI',  as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'BSMC',home:'BA1', as:null,hs:null},
    {day:'tue',field:'South 8pm',  away:'GOLD',home:'SA',  as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'BOO', home:'TBIR',as:null,hs:null},
    {day:'wed',field:'Mondauk 5',  away:'BTBJ',home:'KA',  as:null,hs:null},
    {day:'thu',field:'South 6pm',  away:'GOLD',home:'OS',  as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'BA1', home:'BOR', as:null,hs:null},
    {day:'thu',field:'South 8pm',  away:'BSB', home:'TBI1',as:null,hs:null},
  ]},
  { wk:5, date:'May 15', games:[
    {day:'mon',field:'Mondauk 4',  away:'TSMC',home:'BOR', as:5, hs:9},
    {day:'mon',field:'Warwick',    away:'SA',  home:'TI',  as:10,hs:7},
    {day:'tue',field:'Mondauk 4',  away:'GJC', home:'TBI1',as:8, hs:6},
    {day:'tue',field:'Mondauk 5',  away:'BA1', home:'BOO', as:11,hs:23},
    {day:'wed',field:'Mondauk 4',  away:'BSMC',home:'OS',  as:7, hs:4},
    {day:'wed',field:'Mondauk 5',  away:'BOB', home:'GOLD',as:9, hs:5},
    {day:'thu',field:'Mondauk 4',  away:'BAMI',home:'KA',  as:4, hs:8},
    {day:'thu',field:'Mondauk 5',  away:'GJC', home:'AJ',  as:12,hs:7},
    {day:'thu',field:'South 8pm',  away:'TBIR',home:'BSB', as:7, hs:6},
  ]},
  { wk:6, date:'May 22', games:[
    {day:'mon',field:'Mondauk 4',  away:'BAMI',home:'BSB', as:5, hs:8},
    {day:'mon',field:'Warwick',    away:'BA1', home:'SA',  as:9, hs:5},
    {day:'mon',field:'Horsham',    away:'TBIR',home:'TI',  as:6, hs:10},
    {day:'mon',field:'Plymouth',   away:'BSMC',home:'BTBJ',as:4, hs:6},
    {day:'tue',field:'South 6pm',  away:'KI',  home:'OS',  as:11,hs:3},
    {day:'wed',field:'Mondauk 4',  away:'AJ',  home:'TSMC',as:7, hs:9},
    {day:'wed',field:'Mondauk 5',  away:'GOLD',home:'GJC', as:9, hs:6},
    {day:'thu',field:'Mondauk 4',  away:'TI',  home:'BSMC',as:12,hs:4},
    {day:'thu',field:'Mondauk 5',  away:'BOO', home:'BAMI',as:8, hs:3},
    {day:'thu',field:'South 6pm',  away:'SA',  home:'BOB', as:9, hs:10},
    {day:'thu',field:'South 8pm',  away:'TBIR',home:'BOR', as:6, hs:11},
  ]},
  { wk:7, date:'May 29', games:[
    {day:'tue',field:'Mondauk 4',  away:'BA1', home:'GOLD',as:11,hs:8},
    {day:'tue',field:'Mondauk 5',  away:'KI',  home:'BOO', as:7, hs:14},
    {day:'wed',field:'Mondauk 4',  away:'BTBJ',home:'AJ',  as:5, hs:9},
    {day:'thu',field:'Mondauk 4',  away:'SA',  home:'TBIR',as:14,hs:6},
    {day:'thu',field:'Mondauk 5',  away:'BSMC',home:'KA',  as:3, hs:7},
    {day:'thu',field:'South 8pm',  away:'BOR', home:'BOB', as:7, hs:8},
  ]},
  { wk:8, date:'June 5', games:[
    {day:'mon',field:'Mondauk 4',  away:'BOR', home:'SA',  as:9, hs:5},
    {day:'mon',field:'Warwick',    away:'GOLD',home:'TI',  as:8, hs:16},
    {day:'mon',field:'Horsham',    away:'BOO', home:'TSMC',as:11,hs:6},
    {day:'mon',field:'Plymouth',   away:'TBI1',home:'BTBJ',as:9, hs:5},
    {day:'tue',field:'Mondauk 4',  away:'BA1', home:'KI',  as:7, hs:14},
    {day:'tue',field:'Mondauk 5',  away:'GOLD',home:'BSB', as:16,hs:8},
    {day:'tue',field:'South 6pm',  away:'OS',  home:'AJ',  as:4, hs:7},
    {day:'wed',field:'Mondauk 4',  away:'TSMC',home:'KA',  as:5, hs:9},
    {day:'wed',field:'Mondauk 5',  away:'BAMI',home:'GJC', as:3, hs:11},
    {day:'wed',field:'South 6pm',  away:'OS',  home:'BA1', as:4, hs:6},
    {day:'thu',field:'Mondauk 4',  away:'BSB', home:'BA1', as:5, hs:9},
    {day:'thu',field:'South 8pm',  away:'BTBJ',home:'BOR', as:4, hs:10},
    {day:'thu',field:'Sunnybrook', away:'TBI1',home:'AJ',  as:7, hs:12},
  ]},
  { wk:9, date:'June 12', games:[
    {day:'mon',field:'Mondauk 4',  away:'TSMC',home:'BSMC',as:null,hs:null},
    {day:'mon',field:'Warwick',    away:'TI',  home:'BAMI',as:null,hs:null},
    {day:'mon',field:'Plymouth',   away:'BTBJ',home:'BOO', as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'GOLD',home:'BSB', as:null,hs:null},
    {day:'tue',field:'Mondauk 5',  away:'KA',  home:'SA',  as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'BAMI',home:'BOB', as:null,hs:null},
    {day:'tue',field:'South 8pm',  away:'GJC', home:'KI',  as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'TI',  home:'BSB', as:null,hs:null},
    {day:'wed',field:'South 6pm',  away:'OS',  home:'BA1', as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'BOR', home:'KI',  as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'BOB', home:'TBI1',as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'TSMC',home:'TBIR',as:null,hs:null},
  ]},
  { wk:10, date:'June 19', games:[
    {day:'mon',field:'Warwick',    away:'TI',  home:'TBI1',as:null,hs:null},
    {day:'mon',field:'Horsham',    away:'GOLD',home:'TSMC',as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'SA',  home:'BOO', as:null,hs:null},
    {day:'tue',field:'Mondauk 5',  away:'BSB', home:'GJC', as:null,hs:null},
    {day:'tue',field:'South 8pm',  away:'BAMI',home:'BOB', as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'TBIR',home:'KA',  as:null,hs:null},
    {day:'wed',field:'Mondauk 5',  away:'OS',  home:'BTBJ',as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'BSB', home:'BOO', as:null,hs:null},
    {day:'thu',field:'South 6pm',  away:'TBI1',home:'BOR', as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'AJ',  home:'TI',  as:null,hs:null},
  ]},
  { wk:11, date:'June 26', games:[
    {day:'mon',field:'Mondauk 4',  away:'BOR', home:'OS',  as:null,hs:null},
    {day:'mon',field:'Horsham',    away:'TBIR',home:'BA1', as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'BSB', home:'TSMC',as:null,hs:null},
    {day:'tue',field:'Mondauk 5',  away:'BOO', home:'GOLD',as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'BOB', home:'KI',  as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'KA',  home:'TI',  as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'BAMI',home:'TBI1',as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'GJC', home:'BSMC',as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'BTBJ',home:'TBIR',as:null,hs:null},
  ]},
  { wk:12, date:'July 3', games:[
    {day:'mon',field:'Mondauk 4',  away:'KA',  home:'AJ',  as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'BOO', home:'OS',  as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'BOB', home:'BTBJ',as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'BOO', home:'BOR', as:null,hs:null},
    {day:'thu',field:'South 8pm',  away:'KI',  home:'SA',  as:null,hs:null},
  ]},
  { wk:13, date:'July 10', games:[
    {day:'mon',field:'Mondauk 4',  away:'BOR', home:'AJ',  as:null,hs:null},
    {day:'mon',field:'Horsham',    away:'TBIR',home:'BAMI',as:null,hs:null},
    {day:'mon',field:'Plymouth',   away:'BTBJ',home:'KI',  as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'TI',  home:'TSMC',as:null,hs:null},
    {day:'tue',field:'Mondauk 5',  away:'BOO', home:'GJC', as:null,hs:null},
    {day:'wed',field:'Mondauk 4',  away:'AJ',  home:'BA1', as:null,hs:null},
    {day:'thu',field:'Mondauk 4',  away:'BOB', home:'BOO', as:null,hs:null},
    {day:'thu',field:'Mondauk 5',  away:'BSMC',home:'BSB', as:null,hs:null},
    {day:'thu',field:'Sunnybrook', away:'TBI1',home:'TBIR',as:null,hs:null},
  ]},
  { wk:14, date:'July 17', games:[
    {day:'mon',field:'Mondauk 4',  away:'BOR', home:'GOLD',as:null,hs:null},
    {day:'mon',field:'Horsham',    away:'BAMI',home:'BA1', as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'SA',  home:'AJ',  as:null,hs:null},
    {day:'tue',field:'Mondauk 4',  away:'TI',  home:'GJC', as:null,hs:null},
    {day:'tue',field:'Mondauk 5',  away:'BSB', home:'KA',  as:null,hs:null},
    {day:'tue',field:'South 6pm',  away:'TBI1',home:'KI',  as:null,hs:null},
  ]},
]

// Flatten into game objects
let gid = 1
export const GAMES = []
const CURRENT_WK = 0 // weeks 1-8 have scores

RAW_WEEKS.forEach(week => {
  if (!week.games.length) return
  const wkNum = typeof week.wk === 'number' ? week.wk : 0
  week.games.forEach(g => {
    const hasSCore = g.as !== null && g.hs !== null
    const isFuture = wkNum >= CURRENT_WK
    GAMES.push({
      id: `g${gid++}`,
      wk: week.wk,
      date: week.date,
      day: g.day,
      field: g.field,
      away: g.away,
      home: g.home,
      awayScore: hasSCore ? g.as : null,
      homeScore: hasSCore ? g.hs : null,
      status: hasSCore ? 'final' : 'upcoming',
    })
  })
})

export function getCompletedGames() {
  return GAMES.filter(g => g.status === 'final').reverse()
}

export function getUpcomingGames() {
  return GAMES.filter(g => g.status === 'upcoming')
}

export function getNextGame() {
  return getUpcomingGames()[0] || null
}

export function getGamesByTeam(short) {
  return GAMES.filter(g => g.away === short || g.home === short)
}

export function getRecentGames(n = 5) {
  return getCompletedGames().slice(0, n)
}

export function getWeeks() {
  return RAW_WEEKS
}

export const WEEKS = RAW_WEEKS;
