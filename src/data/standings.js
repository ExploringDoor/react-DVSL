// Auto-computed from game results. Update W/L/PF/PA each week.
const RAW = [
  { team: "Goldstein's",    w: 6, l: 0, pf: 90, pa: 51 },
  { team: 'Beth Or Blue',   w: 5, l: 1, pf: 66, pa: 47 },
  { team: 'TBIR',           w: 4, l: 2, pf: 61, pa: 50 },
  { team: 'Shir Ami',       w: 3, l: 3, pf: 51, pa: 55 },
  { team: 'Keneseth Israel',w: 3, l: 3, pf: 44, pa: 48 },
  { team: 'Adath Jeshurun', w: 2, l: 4, pf: 47, pa: 73 },
  { team: 'TSMC',           w: 2, l: 4, pf: 56, pa: 72 },
  { team: 'BSMC',           w: 1, l: 5, pf: 47, pa: 67 },
]

function buildStandings(raw) {
  const leader = raw[0]
  return raw.map((r, i) => {
    const gp = r.w + r.l
    const pct = gp === 0 ? 0 : r.w / gp
    const gb = i === 0 ? '—' : ((leader.w - r.w) + (r.l - leader.l)) / 2
    const diff = r.pf - r.pa
    return {
      ...r,
      gp,
      pct,
      gb,
      diff: diff >= 0 ? `+${diff}` : `${diff}`,
      pts: r.w * 2,
      streak: i < 2 ? 'W3' : i < 4 ? 'W1' : i < 6 ? 'L2' : 'L3',
    }
  })
}

export const STANDINGS = buildStandings(RAW)

export const LEAGUE_HISTORY = [
  { year: 2025, champion: "Goldstein's",    runnerUp: 'Beth Or Blue' },
  { year: 2024, champion: 'TBIR',           runnerUp: "Goldstein's" },
  { year: 2023, champion: 'Shir Ami',       runnerUp: 'TSMC' },
  { year: 2022, champion: "Goldstein's",    runnerUp: 'Keneseth Israel' },
  { year: 2021, champion: 'Beth Or Blue',   runnerUp: 'TBIR' },
  { year: 2020, champion: null,             runnerUp: null, note: 'Season cancelled (COVID-19)' },
  { year: 2019, champion: 'Adath Jeshurun', runnerUp: 'Shir Ami' },
  { year: 2018, champion: 'TSMC',           runnerUp: 'Beth Or Blue' },
  { year: 2017, champion: 'BSMC',           runnerUp: "Goldstein's" },
  { year: 2016, champion: "Goldstein's",    runnerUp: 'Keneseth Israel' },
  { year: 2015, champion: 'TBIR',           runnerUp: 'Adath Jeshurun' },
]
