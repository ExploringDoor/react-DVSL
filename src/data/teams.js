export const TEAMS = [
  {
    id: 'golsteins',
    name: "Goldstein's",
    shortName: 'Golsteins',
    color: '#f59e0b',
    colorDark: '#92400e',
    sponsor: "Goldstein's Deli",
    manager: 'Mike Goldstein',
    field: 'Mondauk 4',
  },
  {
    id: 'shir-ami',
    name: 'Shir Ami',
    shortName: 'Shir Ami',
    color: '#3b82f6',
    colorDark: '#1e3a8a',
    sponsor: 'Congregation Shir Ami',
    manager: 'Dave Levine',
    field: 'Southampton',
  },
  {
    id: 'keneseth',
    name: 'Keneseth Israel',
    shortName: 'KI',
    color: '#a3e635',
    colorDark: '#365314',
    sponsor: 'Congregation Keneseth Israel',
    manager: 'Josh Cohen',
    field: 'Mondauk 5',
  },
  {
    id: 'beth-or-blue',
    name: 'Beth Or Blue',
    shortName: 'Beth Or B',
    color: '#60a5fa',
    colorDark: '#1e3a8a',
    sponsor: 'Temple Beth Or',
    manager: 'Alan Schwartz',
    field: 'Sunnybrook',
  },
  {
    id: 'tbir',
    name: 'TBIR',
    shortName: 'TBIR',
    color: '#f87171',
    colorDark: '#7f1d1d',
    sponsor: 'Temple Beth Israel Roslyn',
    manager: 'Rob Frankel',
    field: 'Warwick',
  },
  {
    id: 'adath',
    name: 'Adath Jeshurun',
    shortName: 'Adath',
    color: '#a78bfa',
    colorDark: '#4c1d95',
    sponsor: 'Congregation Adath Jeshurun',
    manager: 'Neil Katz',
    field: 'Plymouth',
  },
  {
    id: 'tsmc',
    name: 'TSMC',
    shortName: 'TSMC',
    color: '#34d399',
    colorDark: '#064e3b',
    sponsor: 'Temple Sinai Melrose Club',
    manager: 'Gary Rubin',
    field: 'Horsham',
  },
  {
    id: 'bsmc',
    name: 'BSMC',
    shortName: 'BSMC',
    color: '#fb923c',
    colorDark: '#7c2d12',
    sponsor: 'Beth Shalom Men\'s Club',
    manager: 'Larry Weiss',
    field: 'Ridgeway',
  },
]

export function getTeamById(id) {
  return TEAMS.find(t => t.id === id) || null
}

export function getTeamByName(name) {
  return TEAMS.find(t => t.name === name || t.shortName === name) || null
}
