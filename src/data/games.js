// status: 'final' | 'upcoming' | 'live' | 'postponed'
export const GAMES = [
  // Week 1
  { id: 'g1',  week:1, date:'2025-05-04', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Beth Chaim',         awayTeam:"B'nai Aaron",       homeScore:14, awayScore:8,  status:'final' },
  { id: 'g2',  week:1, date:'2025-05-04', time:'12:00', field:'Dresher Community Park F2', homeTeam:'Shir Ami',           awayTeam:'Adath Congregation', homeScore:11, awayScore:5,  status:'final' },
  { id: 'g3',  week:1, date:'2025-05-04', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Knesset Israel',     awayTeam:'Beth El',            homeScore:9,  awayScore:12, status:'final' },
  // Week 2
  { id: 'g4',  week:2, date:'2025-05-11', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Beth Chaim',         awayTeam:'Shir Ami',           homeScore:7,  awayScore:10, status:'final' },
  { id: 'g5',  week:2, date:'2025-05-11', time:'12:00', field:'Dresher Community Park F2', homeTeam:"B'nai Aaron",        awayTeam:'Knesset Israel',     homeScore:6,  awayScore:8,  status:'final' },
  { id: 'g6',  week:2, date:'2025-05-11', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Beth El',            awayTeam:'Adath Congregation', homeScore:14, awayScore:4,  status:'final' },
  // Week 3
  { id: 'g7',  week:3, date:'2025-05-18', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Shir Ami',           awayTeam:'Knesset Israel',     homeScore:8,  awayScore:6,  status:'final' },
  { id: 'g8',  week:3, date:'2025-05-18', time:'12:00', field:'Dresher Community Park F2', homeTeam:'Beth Chaim',         awayTeam:'Beth El',            homeScore:16, awayScore:9,  status:'final' },
  { id: 'g9',  week:3, date:'2025-05-18', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Adath Congregation', awayTeam:"B'nai Aaron",        homeScore:7,  awayScore:11, status:'final' },
  // Week 4
  { id: 'g10', week:4, date:'2025-06-01', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Beth Chaim',         awayTeam:'Knesset Israel',     homeScore:12, awayScore:7,  status:'final' },
  { id: 'g11', week:4, date:'2025-06-01', time:'12:00', field:'Dresher Community Park F2', homeTeam:'Shir Ami',           awayTeam:"B'nai Aaron",        homeScore:9,  awayScore:5,  status:'final' },
  { id: 'g12', week:4, date:'2025-06-01', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Beth El',            awayTeam:'Adath Congregation', homeScore:11, awayScore:8,  status:'final' },
  // Week 5
  { id: 'g13', week:5, date:'2025-06-08', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Knesset Israel',     awayTeam:'Adath Congregation', homeScore:10, awayScore:3,  status:'final' },
  { id: 'g14', week:5, date:'2025-06-08', time:'12:00', field:'Dresher Community Park F2', homeTeam:"B'nai Aaron",        awayTeam:'Beth El',            homeScore:7,  awayScore:13, status:'final' },
  { id: 'g15', week:5, date:'2025-06-08', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Beth Chaim',         awayTeam:'Shir Ami',           homeScore:8,  awayScore:8,  status:'final' },
  // Week 6 — upcoming
  { id: 'g16', week:6, date:'2025-06-15', time:'10:00', field:'Dresher Community Park F1', homeTeam:'Shir Ami',           awayTeam:'Beth El',            homeScore:null, awayScore:null, status:'upcoming' },
  { id: 'g17', week:6, date:'2025-06-15', time:'12:00', field:'Dresher Community Park F2', homeTeam:'Beth Chaim',         awayTeam:'Adath Congregation', homeScore:null, awayScore:null, status:'upcoming' },
  { id: 'g18', week:6, date:'2025-06-15', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Knesset Israel',     awayTeam:"B'nai Aaron",        homeScore:null, awayScore:null, status:'upcoming' },
  // Week 7
  { id: 'g19', week:7, date:'2025-06-22', time:'10:00', field:'Dresher Community Park F1', homeTeam:"B'nai Aaron",        awayTeam:'Beth Chaim',         homeScore:null, awayScore:null, status:'upcoming' },
  { id: 'g20', week:7, date:'2025-06-22', time:'12:00', field:'Dresher Community Park F2', homeTeam:'Adath Congregation', awayTeam:'Shir Ami',           homeScore:null, awayScore:null, status:'upcoming' },
  { id: 'g21', week:7, date:'2025-06-22', time:'14:00', field:'Dresher Community Park F1', homeTeam:'Beth El',            awayTeam:'Knesset Israel',     homeScore:null, awayScore:null, status:'upcoming' },
]

export const getCompletedGames = () => GAMES.filter(g => g.status === 'final')
export const getUpcomingGames  = () => GAMES.filter(g => g.status === 'upcoming')
export const getLiveGame       = () => GAMES.find(g => g.status === 'live') || null
export const getNextGame       = () => getUpcomingGames()[0] || null
export const getGamesByTeam    = name => GAMES.filter(g => g.homeTeam === name || g.awayTeam === name)
export const getRecentGames    = n => getCompletedGames().slice(-n)
