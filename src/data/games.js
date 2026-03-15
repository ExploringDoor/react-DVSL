// Game status: 'final' | 'upcoming' | 'postponed'
export const GAMES = [
  // Week 1
  { id: 'g1',  week: 1, date: '2025-05-04', time: '10:00 AM', field: 'Mondauk 4',   home: "Goldstein's", away: 'Shir Ami',        homeScore: 12, awayScore: 8,  status: 'final' },
  { id: 'g2',  week: 1, date: '2025-05-04', time: '10:00 AM', field: 'Mondauk 5',   home: 'Keneseth Israel', away: 'Beth Or Blue', homeScore: 6,  awayScore: 9,  status: 'final' },
  { id: 'g3',  week: 1, date: '2025-05-04', time: '12:00 PM', field: 'Southampton', home: 'TBIR',        away: 'Adath Jeshurun', homeScore: 14, awayScore: 11, status: 'final' },
  { id: 'g4',  week: 1, date: '2025-05-04', time: '12:00 PM', field: 'Sunnybrook',  home: 'TSMC',        away: 'BSMC',           homeScore: 7,  awayScore: 10, status: 'final' },

  // Week 2
  { id: 'g5',  week: 2, date: '2025-05-11', time: '10:00 AM', field: 'Mondauk 4',   home: 'Adath Jeshurun', away: "Goldstein's", homeScore: 5,  awayScore: 15, status: 'final' },
  { id: 'g6',  week: 2, date: '2025-05-11', time: '10:00 AM', field: 'Horsham',     home: 'BSMC',        away: 'Shir Ami',       homeScore: 8,  awayScore: 6,  status: 'final' },
  { id: 'g7',  week: 2, date: '2025-05-11', time: '12:00 PM', field: 'Mondauk 5',   home: 'Beth Or Blue', away: 'TBIR',          homeScore: 11, awayScore: 9,  status: 'final' },
  { id: 'g8',  week: 2, date: '2025-05-11', time: '12:00 PM', field: 'Ridgeway',    home: 'TSMC',        away: 'Keneseth Israel',homeScore: 13, awayScore: 7,  status: 'final' },

  // Week 3
  { id: 'g9',  week: 3, date: '2025-05-18', time: '10:00 AM', field: 'Southampton', home: "Goldstein's", away: 'Beth Or Blue',  homeScore: 9,  awayScore: 11, status: 'final' },
  { id: 'g10', week: 3, date: '2025-05-18', time: '10:00 AM', field: 'Sunnybrook',  home: 'Shir Ami',    away: 'TSMC',          homeScore: 14, awayScore: 12, status: 'final' },
  { id: 'g11', week: 3, date: '2025-05-18', time: '12:00 PM', field: 'Warwick',     home: 'Keneseth Israel', away: 'BSMC',     homeScore: 8,  awayScore: 4,  status: 'final' },
  { id: 'g12', week: 3, date: '2025-05-18', time: '12:00 PM', field: 'Plymouth',    home: 'Adath Jeshurun', away: 'TBIR',      homeScore: 7,  awayScore: 16, status: 'final' },

  // Week 4
  { id: 'g13', week: 4, date: '2025-06-01', time: '10:00 AM', field: 'Mondauk 4',   home: 'BSMC',        away: "Goldstein's",   homeScore: 6,  awayScore: 18, status: 'final' },
  { id: 'g14', week: 4, date: '2025-06-01', time: '10:00 AM', field: 'Horsham',     home: 'TBIR',        away: 'Shir Ami',      homeScore: 11, awayScore: 7,  status: 'final' },
  { id: 'g15', week: 4, date: '2025-06-01', time: '12:00 PM', field: 'Ridgeway',    home: 'Beth Or Blue', away: 'Adath Jeshurun',homeScore: 14, awayScore: 5, status: 'final' },
  { id: 'g16', week: 4, date: '2025-06-01', time: '12:00 PM', field: 'Mondauk 5',   home: 'Keneseth Israel', away: 'TSMC',     homeScore: 10, awayScore: 9,  status: 'final' },

  // Week 5
  { id: 'g17', week: 5, date: '2025-06-08', time: '10:00 AM', field: 'Southampton', home: "Goldstein's", away: 'TSMC',         homeScore: 22, awayScore: 9,  status: 'final' },
  { id: 'g18', week: 5, date: '2025-06-08', time: '10:00 AM', field: 'Sunnybrook',  home: 'Shir Ami',    away: 'Beth Or Blue',  homeScore: 5,  awayScore: 13, status: 'final' },
  { id: 'g19', week: 5, date: '2025-06-08', time: '12:00 PM', field: 'Warwick',     home: 'TBIR',        away: 'Keneseth Israel',homeScore: 8, awayScore: 6, status: 'final' },
  { id: 'g20', week: 5, date: '2025-06-08', time: '12:00 PM', field: 'Plymouth',    home: 'BSMC',        away: 'Adath Jeshurun',homeScore: 9,  awayScore: 12, status: 'final' },

  // Week 6
  { id: 'g21', week: 6, date: '2025-06-15', time: '10:00 AM', field: 'Mondauk 4',   home: 'Adath Jeshurun', away: 'Shir Ami',  homeScore: 7,  awayScore: 11, status: 'final' },
  { id: 'g22', week: 6, date: '2025-06-15', time: '10:00 AM', field: 'Mondauk 5',   home: 'TSMC',        away: "Goldstein's",  homeScore: 6,  awayScore: 14, status: 'final' },
  { id: 'g23', week: 6, date: '2025-06-15', time: '12:00 PM', field: 'Horsham',     home: 'BSMC',        away: 'TBIR',          homeScore: 10, awayScore: 13, status: 'final' },
  { id: 'g24', week: 6, date: '2025-06-15', time: '12:00 PM', field: 'Ridgeway',    home: 'Beth Or Blue', away: 'Keneseth Israel',homeScore: 8, awayScore: 7, status: 'final' },

  // Week 7 — upcoming
  { id: 'g25', week: 7, date: '2025-06-22', time: '10:00 AM', field: 'Southampton', home: "Goldstein's", away: 'TBIR',         homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g26', week: 7, date: '2025-06-22', time: '10:00 AM', field: 'Sunnybrook',  home: 'Shir Ami',    away: 'Keneseth Israel',homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g27', week: 7, date: '2025-06-22', time: '12:00 PM', field: 'Warwick',     home: 'Beth Or Blue', away: 'TSMC',         homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g28', week: 7, date: '2025-06-22', time: '12:00 PM', field: 'Plymouth',    home: 'Adath Jeshurun', away: 'BSMC',       homeScore: null, awayScore: null, status: 'upcoming' },

  // Week 8
  { id: 'g29', week: 8, date: '2025-06-29', time: '10:00 AM', field: 'Mondauk 4',   home: 'TBIR',        away: 'Beth Or Blue',  homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g30', week: 8, date: '2025-06-29', time: '10:00 AM', field: 'Mondauk 5',   home: 'Keneseth Israel', away: "Goldstein's",homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g31', week: 8, date: '2025-06-29', time: '12:00 PM', field: 'Horsham',     home: 'TSMC',        away: 'Adath Jeshurun',homeScore: null, awayScore: null, status: 'upcoming' },
  { id: 'g32', week: 8, date: '2025-06-29', time: '12:00 PM', field: 'Ridgeway',    home: 'BSMC',        away: 'Shir Ami',       homeScore: null, awayScore: null, status: 'upcoming' },
]

export function getCompletedGames() {
  return GAMES.filter(g => g.status === 'final').sort((a,b) => new Date(b.date) - new Date(a.date))
}

export function getUpcomingGames() {
  return GAMES.filter(g => g.status === 'upcoming').sort((a,b) => new Date(a.date) - new Date(b.date))
}

export function getNextGame() {
  return getUpcomingGames()[0] || null
}

export function getGamesByTeam(teamName) {
  return GAMES.filter(g => g.home === teamName || g.away === teamName)
}

export function getRecentGames(n = 5) {
  return getCompletedGames().slice(0, n)
}
