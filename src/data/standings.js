import { TEAMS } from './teams'

export const getStandings = () =>
  [...TEAMS]
    .map(t => ({ ...t, pct: t.wins / (t.wins + t.losses) }))
    .sort((a, b) => b.pct - a.pct || b.wins - a.wins)

export const LEAGUE_HISTORY = [
  { year: 2024, champion: 'Beth Chaim',       runnerUp: 'Shir Ami',           mvp: 'D. Goldstein' },
  { year: 2023, champion: 'Knesset Israel',   runnerUp: "B'nai Aaron",        mvp: 'M. Levine'    },
  { year: 2022, champion: 'Shir Ami',         runnerUp: 'Beth Chaim',         mvp: 'A. Rosenberg'  },
  { year: 2021, champion: "B'nai Aaron",      runnerUp: 'Beth El',            mvp: 'J. Stein'     },
  { year: 2020, champion: null,               runnerUp: null,                 mvp: null, note: 'Season cancelled (COVID-19)' },
  { year: 2019, champion: 'Beth Chaim',       runnerUp: 'Adath Congregation', mvp: 'R. Schwartz'  },
  { year: 2018, champion: 'Shir Ami',         runnerUp: 'Knesset Israel',     mvp: 'B. Cohen'     },
  { year: 2017, champion: 'Knesset Israel',   runnerUp: 'Beth Chaim',         mvp: 'P. Weiss'     },
  { year: 2016, champion: "B'nai Aaron",      runnerUp: 'Shir Ami',           mvp: 'H. Klein'     },
  { year: 2015, champion: 'Beth Chaim',       runnerUp: "B'nai Aaron",        mvp: 'N. Friedman'  },
]
