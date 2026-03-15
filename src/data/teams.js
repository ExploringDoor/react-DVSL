export const TEAMS = [
  { id: 'bcc',  name: 'Beth Chaim',         short: 'BCC', color: '#3b82f6', wins: 8, losses: 3, runs: 94,  runsAllowed: 67 },
  { id: 'sbk',  name: 'Shir Ami',           short: 'SBK', color: '#f59e0b', wins: 7, losses: 4, runs: 88,  runsAllowed: 72 },
  { id: 'kia',  name: 'Knesset Israel',     short: 'KIA', color: '#10b981', wins: 6, losses: 5, runs: 79,  runsAllowed: 76 },
  { id: 'bnai', name: "B'nai Aaron",        short: 'BAA', color: '#ef4444', wins: 5, losses: 6, runs: 72,  runsAllowed: 81 },
  { id: 'beth', name: 'Beth El',            short: 'BET', color: '#8b5cf6', wins: 4, losses: 7, runs: 65,  runsAllowed: 88 },
  { id: 'acav', name: 'Adath Congregation', short: 'ACA', color: '#ec4899', wins: 3, losses: 8, runs: 58,  runsAllowed: 96 },
]

export const getTeamById   = id  => TEAMS.find(t => t.id === id)
export const getTeamByName = name => TEAMS.find(t => t.name === name || t.short === name)

export const TEAM_NAMES = TEAMS.map(t => t.name)
